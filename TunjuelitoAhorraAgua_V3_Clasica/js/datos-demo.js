/* Referencias iniciales V3. Las ediciones del usuario no cambian este catálogo. */
(function (root) {
  'use strict';
  const referencias = Object.freeze([
    {id:'beber',nombre:'Agua para beber',unidad:'L / persona / día',base:'persona',litros:3,esencial:true,icono:'gota'},
    {id:'cocinar',nombre:'Preparar alimentos',unidad:'L / persona / día',base:'persona',litros:5,esencial:true,icono:'cocina'},
    {id:'higiene',nombre:'Higiene básica',unidad:'L / persona / día',base:'persona',litros:6,esencial:true,icono:'gota'},
    {id:'sanitario',nombre:'Uso del sanitario',unidad:'L / descarga',base:'descarga',litros:4.8,esencial:true,icono:'hogar'},
    {id:'limpieza',nombre:'Limpieza aplazable',unidad:'L / hogar / día',base:'hogar',litros:0,esencial:false,icono:'brillo'},
    {id:'ropa',nombre:'Lavado de ropa',unidad:'L / carga',base:'carga',litros:53,esencial:false,icono:'ropa'},
    {id:'mascota',nombre:'Cuidado de mascotas',unidad:'mL / kg / día',base:'mascota',litros:55,esencial:true,icono:'huella'}
  ].map(Object.freeze));
  const residencial = Object.freeze({valor:75.44,anio:2025,tolerancia:1});
  function crear(id) {
    const s={version:3,escenario:id,hogar:{nombre:'Mi hogar',personas:1,mayor:false,mascota:false,actividades:['cocinar','limpieza'],ducha:5,caudal:8,cocina:8,esEstimado:true},recibos:[],meta:10,reserva:0,horas:24,tasas:Object.fromEntries(referencias.map(r=>[r.id,r.litros])),frecuencia:3,cargas:0,lavadora:'eficiente',mascotas:[{id:1,peso:10,mlKg:55}],seleccion:['beber','cocinar','higiene','sanitario','limpieza'],leidos:[]};
    if(id==='familia')Object.assign(s,{hogar:{...s.hogar,nombre:'Familia de cuatro',personas:4,ducha:8,actividades:['cocinar','limpieza','ropa']},reserva:120,recibos:[{id:1,m3:24,dias:60,valor:156000,demo:true},{id:2,m3:21,dias:60,valor:148000,demo:true}]});
    if(id==='mayor')Object.assign(s,{hogar:{...s.hogar,nombre:'Hogar con adulto mayor',personas:3,mayor:true,ducha:6},reserva:120,recibos:[{id:1,m3:18,dias:60,valor:null,demo:true}]});
    if(id==='mascota')Object.assign(s,{hogar:{...s.hogar,nombre:'Hogar con mascota',personas:2,mascota:true,ducha:7},reserva:100,seleccion:[...s.seleccion,'mascota'],recibos:[{id:1,m3:13.2,dias:60,valor:null,demo:true}]});
    s.recibos=s.recibos.map(r=>({...r,inicio:'',fin:'',emision:'',vencimiento:'',pagado:false}));
    return s;
  }
  root.DatosDemo={referencias,residencial,crear};
})(typeof window==='undefined'?globalThis:window);
