/* Lógica pura V3: unidades explícitas, fechas de calendario y migración sin DOM. */
(function(root){
  'use strict';
  const D=root.DatosDemo, DIA=86400000;
  function numero(v,min,max,entero=false){
    if(v===null||typeof v==='boolean'||typeof v==='object'||String(v).trim()==='')throw new Error('Completa el dato solicitado.');
    const n=Number(v);if(!Number.isFinite(n)||n<min||n>max||(entero&&!Number.isInteger(n)))throw new Error(`Ingresa ${entero?'un número entero':'un número'} entre ${min} y ${max}.`);return n;
  }
  function fecha(s){
    if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s)||s<'1900-01-01'||s>'2100-12-31')throw new Error('Ingresa una fecha válida entre 1900 y 2100.');
    const t=Date.parse(s+'T00:00:00Z');if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==s)throw new Error('La fecha no existe.');return t;
  }
  function diasPeriodo(inicio,fin){const dias=(fecha(fin)-fecha(inicio))/DIA+1;return numero(dias,1,366,true);}
  function hoy(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
  function sumarMeses(s,meses){const d=new Date(fecha(s)),dia=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+meses);const ultimo=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(dia,ultimo));return d.toISOString().slice(0,10);}
  function recibo(r,otros=[]){
    const n={...r,m3:numero(r.m3,0,10000),dias:numero(r.dias,1,366,true),valor:r.valor===null||r.valor===''||r.valor===undefined?null:numero(r.valor,0,100000000),inicio:r.inicio||'',fin:r.fin||'',emision:r.emision||'',vencimiento:r.vencimiento||'',pagado:r.pagado??false};
    numero(n.id,0,Number.MAX_SAFE_INTEGER,true);if(typeof n.pagado!=='boolean')throw new Error('Estado de pago inválido.');
    if(Boolean(n.inicio)!==Boolean(n.fin))throw new Error('Completa las dos fechas del periodo o deja ambas vacías.');
    if(n.inicio)n.dias=diasPeriodo(n.inicio,n.fin);
    for(const k of ['emision','vencimiento'])if(n[k])fecha(n[k]);
    if(n.emision&&n.vencimiento&&n.vencimiento<n.emision)throw new Error('El vencimiento no puede ser anterior a la emisión.');
    for(const o of otros.filter(o=>o.id!==n.id)){
      if(n.inicio&&o.inicio&&n.inicio<=o.fin&&o.inicio<=n.fin)throw new Error('Este periodo se superpone con otro recibo. Revisa las fechas.');
      if(!n.inicio&&!o.inicio&&n.emision&&n.emision===o.emision&&n.m3===o.m3&&n.dias===o.dias)throw new Error('Ya existe un recibo con esos datos y fecha de emisión.');
    }
    return n;
  }
  function consumo(rs,p){numero(p,1,30,true);if(!rs.length)return null;const total=rs.reduce((a,r)=>({litros:a.litros+numero(r.m3,0,10000)*1000,dias:a.dias+numero(r.dias,1,366,true)}),{litros:0,dias:0});return {...total,diario:total.litros/total.dias,persona:total.litros/total.dias/p};}
  function plan(s){
    const p=numero(s.hogar.personas,1,30,true),dias=numero(s.horas,1,168)/24;
    const filas=D.referencias.filter(r=>s.seleccion.includes(r.id)&&(r.id!=='mascota'||s.hogar.mascota)).map(r=>{
      const tasa=numero(s.tasas[r.id],r.id==='limpieza'?0:.1,1000);let total,formula;
      if(r.base==='persona'){total=p*tasa*dias;formula=`${p} personas × ${tasa} L/persona/día × ${dias} días`;}
      if(r.base==='hogar'){total=tasa*dias;formula=`${tasa} L/hogar/día × ${dias} días`;}
      if(r.base==='descarga'){const f=numero(s.frecuencia,.1,50);total=p*f*tasa*dias;formula=`${p} personas × ${f} descargas/persona/día × ${tasa} L/descarga × ${dias} días`;}
      if(r.base==='carga'){const cargas=numero(s.cargas,0,100,true);total=cargas*tasa;formula=`${cargas} cargas en todo el corte × ${tasa} L/carga`;}
      if(r.base==='mascota'){const diario=s.mascotas.reduce((a,m)=>a+numero(m.peso,.1,1000)*numero(m.mlKg,.1,1000)/1000,0);total=diario*dias;formula=s.mascotas.map(m=>`${m.peso} kg × ${m.mlKg} mL/kg/día`).join(' + ');formula=`(${formula}) ÷ 1.000 × ${dias} días`;}
      return {...r,tasa,total,formula};
    });
    const total=filas.reduce((a,r)=>a+r.total,0),reserva=numero(s.reserva,0,100000);return {filas,total,saldo:reserva-total,cobertura:total?reserva/total*100:0,horas:total?reserva/(total/s.horas):0};
  }
  function meta(promedio,p){numero(p,0,30);return promedio===null?null:promedio*(1-p/100);}
  function habitos(h){const ducha=numero(h.ducha,.1,120)*numero(h.caudal,.1,40)*numero(h.personas,1,30,true),cocina=numero(h.cocina,.1,200);return {ducha,cocina,total:ducha+cocina,min:(ducha+cocina)*.8,max:(ducha+cocina)*1.2};}
  function comparacion(diario,p){const referencia=D.residencial.valor*numero(p,1,30,true);if(diario===null)return null;numero(diario,0,10000000);const diferencia=diario-referencia,porcentaje=diferencia/referencia*100;return {referencia,diferencia,porcentaje,estado:Math.abs(porcentaje)<=D.residencial.tolerancia?'similar':porcentaje>0?'encima':'debajo'};}
  function variacion(a,b){return a===0?(b===0?0:null):(b-a)/a*100;}
  function estadisticas(rs,p){
    const resumen=consumo(rs,p);if(!resumen)return null;
    // No inventar cronología: registros sin fechas se muestran como grupo aparte.
    const grupos=[rs.filter(r=>r.inicio).sort((a,b)=>a.inicio.localeCompare(b.inicio)),rs.filter(r=>!r.inicio)];
    const filas=grupos.flatMap((g,grupo)=>g.map((r,i)=>({...r,grupo,diario:r.m3*1000/r.dias,variacion:i?variacion(g[i-1].m3*1000/g[i-1].dias,r.m3*1000/r.dias):undefined})));
    const max=Math.max(...filas.map(r=>r.diario)),min=Math.min(...filas.map(r=>r.diario));
    return {resumen,filas,max,min,mayores:filas.filter(r=>r.diario===max).map(r=>r.id),menores:filas.filter(r=>r.diario===min).map(r=>r.id),comparacion:comparacion(resumen.diario,p)};
  }
  function recordatorios(rs,actual=hoy()){
    const hoyMs=fecha(actual),avisos=[];
    rs.forEach(r=>{if(r.vencimiento&&!r.pagado){const dias=Math.round((fecha(r.vencimiento)-hoyMs)/DIA);if(dias<=5)avisos.push({tipo:dias<0?'vencido':'pago',id:r.id,fecha:r.vencimiento,dias});}});
    const emisiones=rs.filter(r=>r.emision).sort((a,b)=>b.emision.localeCompare(a.emision));
    let siguiente=null;if(emisiones.length){siguiente=sumarMeses(emisiones[0].emision,2);const dias=Math.round((fecha(siguiente)-hoyMs)/DIA);if(dias>=0&&dias<=7)avisos.push({tipo:'llegada',id:emisiones[0].id,fecha:siguiente,dias});}
    return {avisos,siguiente,sinEmision:!emisiones.length,sinVencimiento:rs.some(r=>!r.vencimiento),pasoEstimada:siguiente!==null&&siguiente<actual};
  }
  function migrar(s){
    if(s?.version===3)return validar(s);
    if(s?.version!==1||!s.hogar||!Array.isArray(s.recibos))throw new Error('Datos guardados no compatibles.');
    const base=D.crear('nuevo');
    return validar({...base,...s,version:3,tasas:base.tasas,frecuencia:3,cargas:0,lavadora:'eficiente',mascotas:base.mascotas,seleccion:[...base.seleccion,...(s.hogar.mascota?['mascota']:[])],recibos:s.recibos.map(r=>recibo(r))});
  }
  function validar(s){
    if(!s||s.version!==3||!s.hogar||!s.tasas||!Array.isArray(s.recibos)||s.recibos.length>100||!Array.isArray(s.seleccion)||!Array.isArray(s.leidos)||!Array.isArray(s.mascotas)||s.mascotas.length<1||s.mascotas.length>10)throw new Error('Datos guardados no compatibles.');
    if(typeof s.hogar.nombre!=='string'||s.hogar.nombre.length>50||typeof s.hogar.mayor!=='boolean'||typeof s.hogar.mascota!=='boolean'||typeof s.hogar.esEstimado!=='boolean'||!Array.isArray(s.hogar.actividades))throw new Error('Perfil inválido.');
    if(!s.hogar.actividades.every(a=>['cocinar','limpieza','ropa','plantas'].includes(a)))throw new Error('Actividades inválidas.');
    if(!s.leidos.every(a=>['corte','meta','reserva'].includes(a)))throw new Error('Avisos inválidos.');
    if(!s.seleccion.every(a=>D.referencias.some(r=>r.id===a))||!['beber','cocinar','higiene','sanitario'].every(a=>s.seleccion.includes(a))||(s.hogar.mascota&&!s.seleccion.includes('mascota')))throw new Error('Plan incompleto.');
    D.referencias.forEach(r=>numero(s.tasas[r.id],r.id==='limpieza'?0:.1,1000));numero(s.frecuencia,.1,50);numero(s.cargas,0,100,true);
    if(!['eficiente','convencional','manual'].includes(s.lavadora))throw new Error('Lavadora inválida.');
    if(new Set(s.mascotas.map(m=>m.id)).size!==s.mascotas.length)throw new Error('Identificadores de mascota duplicados.');
    s.mascotas.forEach(m=>{numero(m.id,0,Number.MAX_SAFE_INTEGER,true);numero(m.peso,.1,1000);numero(m.mlKg,.1,1000);});
    if(new Set(s.recibos.map(r=>r.id)).size!==s.recibos.length)throw new Error('Identificadores de recibo duplicados.');
    s.recibos.forEach(r=>{const normal=recibo(r);if(normal.inicio&&normal.dias!==r.dias)throw new Error('Días y fechas del recibo no coinciden.');});
    consumo(s.recibos,s.hogar.personas);habitos(s.hogar);plan(s);numero(s.meta,0,30);return s;
  }
  root.CalculadoraConsumo={numero,fecha,diasPeriodo,hoy,sumarMeses,recibo,consumo,plan,meta,habitos,comparacion,variacion,estadisticas,recordatorios,migrar,validar};
})(typeof window==='undefined'?globalThis:window);
