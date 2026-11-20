/* V3 final: interfaz compartida; el adaptador opcional añade el recorrido guiado. */
(function () {
  'use strict';
  const C = window.CalculadoraConsumo;
  const D = window.DatosDemo;
  const G = window.RecorridoGuiado;
  const KEY = G ? 'tunjuelito-agua-v3-guiada' : 'tunjuelito-agua-v3-clasica';
  const $ = selector => document.querySelector(selector);
  const fmt = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(n);
  const porcentaje = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(n);
  const money = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths={gota:'M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12ZM8 15a4 4 0 0 0 4 4',hogar:'m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',grafico:'M4 20V10m8 10V4m8 16v-7M2 22h20',plan:'M4 5h16v16H4zM8 2v6m8-6v6M4 10h16m-12 4h3m2 3h3',reserva:'M6 4q6-3 12 0v16q-6 3-12 0ZM6 5q6 3 12 0M6 14q3-3 6 0t6 0',meta:'M21 12a9 9 0 1 1-9-9m0 5a4 4 0 1 0 4 4m-4 0 9-9m-5 0h5v5',campana:'M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 21h4',info:'M12 11v6m0-10v1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',personas:'M9 8a3 3 0 1 0 0 .1M3 21v-3a6 6 0 0 1 12 0v3m2-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2',flecha:'M5 12h14m-5-5 5 5-5 5',check:'m5 12 4 4L19 6',brillo:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',ropa:'m8 3 4 3 4-3 6 5-4 4v9H6v-9L2 8Z',cocina:'M5 9h14v10H5ZM3 9h18M9 5V2m6 3V2',huella:'M8 15c-4 7 12 7 8 0l-4-4ZM4 9v1m5-5v1m6-1v1m5 3v1',libro:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3ZM12 6v16'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[n]||paths.gota}"/></svg>`;
  paths.mas = 'M5 12h.01M12 12h.01M19 12h.01';
  paths.atras = 'm14 6-6 6 6 6';
  paths.corazon = 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z';
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));

  let editingId = null, selectedPeriod = null;
  let estado = D.crear('familia');
  let avisoCarga = '';
  let memoria = false;
  let tieneDatos = false;
  const borradores = new Map();
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem('tunjuelito-agua-v1');
    if (raw) {
      const anterior = JSON.parse(raw);
      estado = C.migrar(anterior); tieneDatos = true;
      if (anterior.version !== 3) {
        localStorage.setItem('tunjuelito-agua-v2-respaldo', raw);
        localStorage.setItem(KEY, JSON.stringify(estado));
        avisoCarga = 'Actualizamos las unidades y cantidades del simulador a V3. Conservamos tu perfil, recibos, reserva y duración. Revisa las nuevas cantidades; guardamos una copia de los datos anteriores en este navegador.';
      }
    }
  } catch (_) {
    avisoCarga = 'No pudimos recuperar tus datos. Puedes volver a empezar o cargar una familia de ejemplo.';
  }

  if (G) G.iniciar(tieneDatos ? estado.recorrido : null);

  const fuente = 'https://bogota.gov.co/mi-ciudad/habitat/recomendaciones-del-acueducto-de-bogota-para-ahorrar-agua-en-tu-hogar';
  const externos = (url, text) => `<a class="external" href="${url}" target="_blank" rel="noopener noreferrer">${text} <span aria-hidden="true">↗</span></a>`;
  const nota = (text, clase = '') => `<aside class="note ${clase}">${icon('info')}<p>${text}</p></aside>`;
  const heading = (tag, title, text = '') => `<div class="heading"><span class="eyebrow">${tag}</span><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div>`;
  const btn = (text, route, style = '') => `<a class="btn ${style}" href="#${route}">${text}${icon('flecha')}</a>`;
  const input = (name, label, value, min, max, step = '1', hint = '') => `<label class="field">${label}<input name="${name}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}" required>${hint ? `<small>${hint}</small>` : ''}</label>`;
  const checkbox = (name, text, checked, value = 'on') => `<label class="check-row"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span>${text}</span></label>`;
  const error = '<p class="form-error" role="alert"></p>';
  const volver = (text = 'Más opciones', url = 'mas') => `<a class="back-link" href="#${url}">${icon('atras')}${text}</a>`;
  const paso = n => G ? G.progreso(n + 1) : `<div class="stepper" aria-label="Paso ${n} de 4"><div class="step-label"><span>PASO ${n} DE 4</span><span>${['Mi familia', 'Mis actividades', 'Mi agua', 'Mi plan'][n - 1]}</span></div><ol>${['familia', 'actividades', 'agua', 'plan'].map((id, i) => `<li class="${i < n ? 'done' : ''}"><a href="#${id}" aria-label="Paso ${i + 1}: ${['Mi familia', 'Mis actividades', 'Mi agua', 'Mi plan'][i]}" ${i === n - 1 ? 'aria-current="step"' : ''}><span>${i + 1}</span></a></li>`).join('')}</ol></div>`;
  const acciones = (back, forward, label) => `<div class="wizard-actions">${back ? `<a class="btn back" href="#${back}">${icon('atras')}${G ? 'Anterior' : 'Atrás'}</a>` : ''}<button class="btn" type="submit">${label || 'Continuar'}${icon('flecha')}</button></div><p class="save-note" id="save-status" role="status">Tus cambios válidos se guardan en este navegador.</p>`;

  function guardar() {
    if (G) estado.recorrido = G.datos();
    try { localStorage.setItem(KEY, JSON.stringify(estado)); memoria = false; }
    catch (_) { memoria = true; }
    tieneDatos = true;
  }
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
  }
  function commit(next) { C.validar(next); estado = next; guardar(); }
  function data() { return { c: C.consumo(estado.recibos, estado.hogar.personas), p: C.plan(estado), h: C.habitos(estado.hogar) }; }

  function inicio() {
    return `<section class="welcome">
      <span class="local-pill">${icon('hogar')} HECHO PARA TUNJUELITO</span>
      <h1>Cuidar el agua<br>empieza en <em>familia.</em></h1>
      <p>Organiza el agua de tu hogar, conoce cuánto podrías necesitar y descubre cómo evitar desperdicios durante un corte.</p>
      <img class="family-art" src="assets/familia.svg" alt="Una familia junto a su reserva de agua, rodeada de casas, árboles y edificios del barrio" width="480" height="265">
      <div class="welcome-actions">${btn('Probar con una familia de ejemplo', 'ejemplos')}<button class="btn secondary" data-demo="nuevo">Crear mi propio hogar${icon('hogar')}</button></div>
      ${tieneDatos ? '<a class="resume" href="#plan">Continuar con mi hogar guardado →</a>' : ''}
      <div class="welcome-promise"><span>${icon('check')} Sin cuentas</span><span>${icon('check')} Paso a paso</span><span>${icon('check')} A tu ritmo</span></div>
      ${nota('<strong>Estás en un prototipo académico.</strong> Los cortes y avisos son simulados; no son información actual.', 'compact')}
    </section>`;
  }
  function ejemplos() {
    return (G ? G.progreso(2) : '') + volver('Volver al inicio', 'inicio') + heading('PROBEMOS EN FAMILIA', 'Elige un hogar', 'Todos son ejemplos ficticios. Después puedes cambiar sus datos.') +
      `<div class="example-list">${[
        ['familia', 'Familia de cuatro', '4 integrantes', 'Un día para cocinar, asearse y limpiar.', 'personas', 'mint'],
        ['mayor', 'Con un adulto mayor', '3 integrantes', 'Organizar juntos el acceso al agua.', 'corazon', 'peach'],
        ['mascota', 'Con una mascota', '2 integrantes', 'También incluimos su cuidado en el plan.', 'huella', 'blue']
      ].map(([id, title, sub, description, ico, color]) => `<button class="example ${color}" data-demo="${id}"><span class="example-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${sub}</small><span class="example-description">${description}</span></span>${icon('flecha')}</button>`).join('')}</div>
      <button class="wide-link" data-demo="nuevo">Prefiero crear mi propio hogar →</button>`;
  }
  function familia() {
    const h = estado.hogar;
    return paso(1) + heading('EMPECEMOS POR USTEDES', '¿Quiénes viven en casa?', 'Conocer tu familia nos ayuda a organizar el agua.') +
      `<form id="familia-form" data-autosave>
        <section class="surface family-count"><label for="personas">Número de integrantes</label><div class="counter"><button type="button" data-count="-1" aria-label="Disminuir integrantes" ${h.personas <= 1 ? 'disabled' : ''}>−</button><input id="personas" name="personas" type="number" inputmode="numeric" min="1" max="30" step="1" value="${h.personas}" required aria-label="Número de integrantes"><button type="button" data-count="1" aria-label="Aumentar integrantes" ${h.personas >= 30 ? 'disabled' : ''}>+</button></div><span class="muted">Incluye a todas las personas del hogar.</span></section>
        <fieldset class="plain"><legend>¿Algo más sobre tu familia?</legend><div class="choice-list">
          ${opcion('mayor', 'Vive un adulto mayor', 'Mostraremos consejos para organizarse juntos.', h.mayor, 'corazon')}
          ${opcion('mascota', 'Tenemos mascotas', 'Incluiremos su cuidado en las actividades.', h.mascota, 'huella')}
        </div></fieldset>
        <p class="quiet">No pedimos nombres, direcciones ni información médica.</p>
        ${error}${acciones(G ? 'ejemplos' : 'inicio', 'actividades')}
      </form>`;
  }
  function opcion(name, title, desc, checked, ico, value = 'on') {
    return `<label class="choice"><input type="checkbox" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span class="choice-icon">${icon(ico)}</span><span class="choice-text"><strong>${title}</strong><small>${desc}</small></span><span class="choice-check" aria-hidden="true">${icon('check')}</span></label>`;
  }
  function actividades() {
    const desc = { beber: 'Agua para las personas del hogar.', cocinar: 'Preparación básica de alimentos.', higiene: 'Lavado de manos y aseo esencial; no una ducha completa.', sanitario: 'Ajusta el equipo y su frecuencia de uso.', limpieza: 'Tareas no urgentes que pueden esperar.', ropa: 'Solo las cargas necesarias durante todo el corte.', mascota: 'Orienta la reserva; nunca limites su acceso al agua.' };
    const refs = D.referencias.filter(r => r.id !== 'mascota' || estado.hogar.mascota);
    return paso(2) + heading('UN DÍA EN TU HOGAR', '¿Qué necesitan hacer?', 'Los usos esenciales ya están incluidos. Elige las demás actividades.') +
      `<form id="actividades-form" data-autosave>
        ${G ? duracion() : ''}
        <div class="activity-choices">${refs.map(r => r.esencial ? `<div class="essential"><span class="choice-icon">${icon(r.icono)}</span><span><strong>${r.nombre}</strong><small>${desc[r.id]}</small><span class="included">${icon('check')} Siempre incluida</span></span></div>` : opcion('seleccion', r.nombre, desc[r.id], estado.seleccion.includes(r.id), r.icono, r.id)).join('')}</div>
        <details class="customize" id="cantidades"><summary>${icon('grafico')}<span>Cantidades sugeridas<small>Valores orientativos. Puedes ajustarlos a tu hogar.</small></span><span aria-hidden="true">+</span></summary><div class="details-content">
        <a class="wide-link" href="#fuentes">¿De dónde salen estos valores?</a>
        ${refs.filter(r=>!['ropa','mascota'].includes(r.id)).map(r => input('tasa-' + r.id, r.nombre, estado.tasas[r.id], r.id==='limpieza'?0:.1, 1000, .1, r.unidad)).join('')}
        ${input('frecuencia','Frecuencia del sanitario',estado.frecuencia,.1,50,.1,'Descargas/persona/día. El 3 inicial es un supuesto editable.')}
        <fieldset class="plain laundry-fields"><legend>Lavado de ropa</legend><p class="quiet">Se suma solo si seleccionas esta actividad. No se multiplica por los días.</p>
        ${input('cargas','Cargas previstas en todo el corte',estado.cargas,0,100,1)}
        <label class="field">Tipo de lavadora<select name="lavadora">${[['eficiente','Eficiente · 53 L/carga'],['convencional','Convencional · 76 L/carga'],['manual','Cantidad personalizada']].map(([v,t])=>`<option value="${v}" ${estado.lavadora===v?'selected':''}>${t}</option>`).join('')}</select></label>
        ${input('tasa-ropa','Litros por carga',estado.tasas.ropa,.1,1000,.1,'Si cambias este valor, se usa como cantidad personalizada.')}</fieldset>
        ${estado.hogar.mascota?`<fieldset class="plain"><legend>Agua para tus mascotas</legend><p class="quiet">El peso inicial de 10 kg es un ejemplo: reemplázalo por el de cada animal. Agua total orientativa, no un límite de bebida.</p>${estado.mascotas.map((m,i)=>`<div class="pet-entry"><h3>Mascota ${i+1}</h3>${input('peso-'+m.id,'Peso (kg) · mascota '+(i+1),m.peso,.1,1000,.1)}${input('ml-'+m.id,'mL/kg/día · mascota '+(i+1),m.mlKg,.1,1000,.1)}<button type="button" class="wide-link" data-remove-pet="${m.id}" ${estado.mascotas.length===1?'disabled':''}>Quitar mascota ${i+1}</button></div>`).join('')}<button type="button" class="btn secondary" data-add-pet ${estado.mascotas.length>=10?'disabled':''}>Agregar otra mascota</button></fieldset>`:''}
        </div></details>
        ${nota('No reduzcas el agua indispensable para beber, preparar alimentos o mantener la higiene para hacer coincidir el plan con tu reserva. La limpieza sanitaria indispensable debe conservarse.')}
        ${error}${acciones('familia', 'agua')}
      </form>`;
  }
  function duracion() { return `<section class="duration"><h2>¿Cuánto duraría el corte?</h2><p>Es una simulación, sin una fecha real.</p><div class="duration-options">${[12, 24, 48].map(n => `<button type="button" data-value="${n}" data-field="horas" aria-pressed="${estado.horas === n}">${n} <span>horas</span></button>`).join('')}</div>${input('horas', 'Duración del corte simulado (horas)', estado.horas, 1, 168, .5, 'Puedes elegir otra duración entre 1 y 168 horas.')}</section>`; }
  function agua() {
    return paso(3) + heading('LO QUE TIENES A MANO', '¿Cuánta agua tienes?', 'Cuenta solo el agua potable almacenada dentro de tu hogar.') +
      `<form id="agua-form" data-autosave><section class="surface water-entry"><span class="water-icon">${icon('reserva')}</span><label for="reserva">Agua disponible</label><div class="liters-input"><input id="reserva" name="reserva" type="number" inputmode="decimal" min="0" max="100000" step="0.1" value="${estado.reserva}" required><span>litros</span></div><div class="quick-values" aria-label="Cantidades de ejemplo">${[60, 120, 180].map(n => `<button type="button" data-value="${n}" data-field="reserva">${n} L</button>`).join('')}</div></section>
        ${G ? '' : duracion()}
        ${nota('No sumes el agua de tanques comunales del conjunto. No suponemos que esa reserva esté disponible para tu hogar.')}
        ${error}${acciones('actividades', 'plan', 'Ver mi plan')}
      </form>`;
  }
  function plan() {
    const { p } = data();
    const falta = p.saldo < 0;
    return paso(4) + heading('YA TIENEN UN PUNTO DE PARTIDA', 'Un plan para tu familia', `${estado.hogar.personas} integrantes · ${fmt(estado.horas)} horas simuladas`) +
      `<section class="plan-card"><div class="plan-icon">${icon('gota')}</div><h2 class="simulation-result">Resultado de simulación</h2><p class="simulation-context">Estimaciones orientativas; no son recomendaciones oficiales individuales.</p><p>Para las actividades que elegiste,<br>podrían necesitar aproximadamente</p><div class="plan-number">${fmt(p.total)} <span>litros</span></div><div class="available"><span>Tienes registrados</span><strong>${fmt(estado.reserva)} L</strong></div><div class="balance ${falta ? 'shortage' : 'enough'}"><span class="balance-icon">${icon(falta ? 'info' : 'check')}</span><div><strong>${falta ? `Podrían faltar ${fmt(-p.saldo)} litros` : p.saldo === 0 ? 'Tu reserva coincide con el plan' : `Tendrías ${fmt(p.saldo)} litros por encima del plan`}</strong><p>Según esta simulación, con los datos que ingresaste.</p></div></div></section>
        ${G ? '<div class="wizard-actions"><a class="btn back" href="#agua">Anterior</a><button type="button" class="btn" data-explore>Explorar la aplicación</button></div>' : ''}
        <p class="estimate-caption">Es una estimación, no una garantía de abastecimiento.</p>
        <section class="organize-next" aria-labelledby="organize-title"><h2 id="organize-title">Ahora, organiza tu agua</h2><p>Reserva primero el agua para beber, preparar alimentos y la higiene básica. Revisa qué tareas de limpieza o lavado de ropa pueden esperar, sin reducir lo indispensable.</p>${btn('Revisar qué puede esperar', 'actividades')}</section>
        ${nota('<strong>Recibos:</strong> muestran el consumo histórico de periodos facturados.<br><strong>Este plan:</strong> estima el agua para las actividades y horas de un corte simulado. La diferencia entre ambos no demuestra ahorro real.')}

        <div class="section-title"><span class="round-icon">${icon('corazon')}</span><h2>¿Cómo pueden organizarse?</h2></div>
        <ol class="advice-steps"><li><strong>Primero, los usos esenciales.</strong><p>${falta ? 'Revisa el faltante y consulta alternativas de abastecimiento en los canales oficiales. No dejes de beber, preparar alimentos o realizar higiene básica.' : 'La diferencia a favor no significa que debas gastar o almacenar más. Revisa lo que realmente necesitas.'}</p></li><li><strong>Decidan qué puede esperar.</strong><p>Revisa la limpieza y el lavado de ropa. Pueden cambiar las actividades y volver a calcular.</p></li>${estado.hogar.mayor ? '<li><strong>Acompañen al adulto mayor.</strong><p>Acuerden quién facilita el acceso al agua, sin cambiar sus indicaciones individuales.</p></li>' : ''}${estado.hogar.mascota ? '<li><strong>Incluyan a su mascota.</strong><p>Revisa el agua prevista para su cuidado. El valor de ejemplo no es una cuota veterinaria.</p></li>' : ''}</ol>
        <details class="customize breakdown"><summary>${icon('libro')}<span>Así se reparten los litros<small>Resultado de simulación · ver cálculo</small></span><span aria-hidden="true">+</span></summary><div class="details-content">${p.filas.map(r => `<div class="breakdown-row"><span>${r.nombre}<small>${esc(r.formula)}</small></span><strong>≈ ${fmt(r.total)} L</strong></div>`).join('')}<p class="quiet">Parámetros editables en Mis actividades. Las cargas de ropa corresponden a todo el corte. Los cálculos usan todos los decimales; aquí se muestran hasta dos.</p></div></details>
        <div class="plan-actions">${btn('Ajustar mi agua', 'agua')}${btn('Cambiar actividades', 'actividades', 'secondary')}</div>
        <a class="wide-link" href="#consejos">Ver consejos para mi hogar →</a>
        <p class="extension-note">Planificador y reserva: complementos del diseño original.</p>`;
  }
  function mas() {
    return heading('A TU RITMO', 'Un poco más para tu hogar', 'Consulta tus registros o ajusta lo que necesites.') +
      `<div class="menu-list">${[
        ['consumo', 'Mi consumo y recibos', 'Conoce cuánto consumen en casa.', 'grafico'],
        ['habitos', 'Mis hábitos', 'Ducha, cocina y actividades habituales.', 'gota'],
        ['metas', 'Mis metas', 'Explora un objetivo de ahorro.', 'meta'],
        ['consejos', 'Consejos para mi hogar', 'Prácticas de conservación según tus hábitos.', 'brillo'],
        ['avisos', 'Información y avisos', 'Recordatorios de recibos y avisos simulados.', 'campana'],
        ['fuentes', 'Fuentes y metodología', 'Referencias, supuestos y fórmulas.', 'libro'],
        ['configuracion', 'Configuración', 'Tu hogar, cantidades y demostración.', 'hogar']
      ].map(([url, title, sub, ico]) => `<a class="menu-item" href="#${url}"><span class="choice-icon">${icon(ico)}</span><span><strong>${title}</strong><small>${sub}</small></span>${icon('flecha')}</a>`).join('')}</div>`;
  }
  const fechaTexto = s => s ? new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(C.fecha(s))) : 'Sin fecha';
  const periodo = r => r.inicio ? `${fechaTexto(r.inicio)} — ${fechaTexto(r.fin)}` : `Recibo ${estado.recibos.findIndex(x=>x.id===r.id)+1}`;
  function comparar(c) {
    if (!c) return '';
    const v=C.comparacion(c.diario,estado.hogar.personas);
    const posicion=v.diferencia===0?'En el promedio':v.diferencia>0?'Por encima del promedio':'Por debajo del promedio';
    return `<section class="surface comparison"><span class="eyebrow">FRENTE A BOGOTÁ</span><h2>${posicion}</h2><p class="comparison-main">Tu hogar: <strong>${fmt(c.diario)} L/día</strong></p><p>Referencia para ${estado.hogar.personas} integrantes: <strong>${fmt(v.referencia)} L/día</strong>.</p><p class="quiet">OAB, 2025 · 75,44 L/persona/día. Es un promedio residencial observado, no una meta ni un límite.</p><a href="#fuentes">Conocer la fuente</a></section>`;
  }
  function consumo() {
    const {c}=data(), r=estado.recibos.find(r=>r.id===editingId), v=r||{m3:'',dias:60,valor:'',inicio:'',fin:'',emision:'',vencimiento:''};
    const dateInput=(name,label)=>`<label class="field">${label}<input type="date" name="${name}" min="1900-01-01" max="2100-12-31" value="${v[name]||''}"></label>`;
    return heading('CONOCE TU CONSUMO', 'Mi consumo y recibos', 'Transcribe los datos de tu recibo. No necesitas subir una foto.')+
      `<section class="surface consumption-summary"><p>Promedio diario del hogar</p><div class="summary-number">${c?fmt(c.diario):'—'}<span>litros / día</span></div><div class="inline-result"><span>Por persona</span><strong>${c?fmt(c.persona):'—'} L / día</strong></div><p class="quiet">${c?`${estado.recibos.length} recibos · ${c.dias} días registrados`:'Agrega tu primer recibo para calcular el promedio.'}</p></section>
      ${comparar(c)}${btn('Obtener estadísticas','estadisticas')}
      ${nota('<strong>Consumo histórico:</strong> los recibos describen periodos facturados.<br><strong>Mi plan:</strong> estima actividades durante un corte. Son cálculos distintos; la diferencia no demuestra ahorro real.')}
      <details class="customize" ${!estado.recibos.length||r?'open':''}><summary>${icon('grafico')}<span>${r?'Editar recibo':'Agregar un recibo'}<small>Consumo, periodo y fechas opcionales</small></span><span aria-hidden="true">+</span></summary><form id="recibo-form" class="details-content">
      ${input('m3','Consumo del recibo (m³)',v.m3,0,10000,.001,'1 m³ equivale a 1.000 litros.')}
      ${dateInput('inicio','Inicio del periodo (opcional)')}${dateInput('fin','Fin del periodo (opcional)')}
      ${input('dias','Días del periodo facturado',v.dias,1,366,1,'Con ambas fechas, contamos los días incluyendo inicio y fin. Sin fechas, transcribe los días del recibo.')}
      <label class="field">Valor del recibo (COP, opcional)<input name="valor" type="number" inputmode="numeric" min="0" max="100000000" step="1" value="${v.valor??''}" placeholder="Por ejemplo, 150000"></label>
      <p class="quiet">Las fechas permiten verificar superposiciones y ordenar los periodos. Sin ellas no podemos detectar todos los duplicados ni confirmar el orden temporal.</p>${error}<button class="btn" type="submit">${r?'Guardar cambios':'Guardar recibo'}${icon('check')}</button>${r?'<button type="button" class="wide-link" data-cancel-edit>Cancelar edición</button>':''}</form></details>
      ${recordatorios()}<h2 class="spaced">Tus recibos</h2><div class="receipts">${estado.recibos.length?estado.recibos.map((r,i)=>`<article class="receipt"><div class="receipt-heading"><strong>${periodo(r)}</strong><button class="icon-button" data-delete="${r.id}" aria-label="Eliminar periodo ${i+1}">×</button></div><span class="receipt-type">${r.demo?'Ejemplo ficticio':'Registro manual'} · ${r.dias} días</span><div class="receipt-values"><strong>${fmt(r.m3)} m³</strong><span>≈ ${fmt(r.m3*1000/r.dias)} L/día</span></div><p class="quiet">${r.valor===null?'Sin valor registrado':money(r.valor)}</p><div class="receipt-actions"><button class="btn secondary" data-edit="${r.id}">Editar</button><button class="btn secondary" data-paid="${r.id}" aria-pressed="${r.pagado}">${r.pagado?'Pagado · Desmarcar':'Marcar como pagado'}</button></div></article>`).join(''):'<p class="empty">Tu historial empieza con el primer recibo.</p>'}</div>`;
  }
  // Presentación de estadísticas: la calculadora sigue aportando L/día por recibo.
  function graficaRecibos(e, escogido) {
    const maximo = e.max || 1;
    const base = 10 ** Math.floor(Math.log10(maximo / 4));
    const fraccion = maximo / 4 / base;
    const pasoEscala = base * (fraccion >= 7.5 ? 10 : fraccion >= 3.5 ? 5 : fraccion >= 1.5 ? 2 : 1);
    const intervalos = Math.ceil(maximo / pasoEscala);
    const techo = intervalos * pasoEscala;
    const decimales = Math.min(6, Math.max(0, -Math.floor(Math.log10(pasoEscala))));
    const escala = n => new Intl.NumberFormat('es-CO', { maximumFractionDigits: decimales, ...(techo >= 10000 ? { notation: 'compact', maximumFractionDigits: 1 } : {}) }).format(n);
    const valor = n => n > 0 && n < .01 ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 6 }).format(n) : fmt(n);
    const marcas = Array.from({ length: intervalos + 1 }, (_, i) => ({ altura: i / intervalos * 100, valor: i * pasoEscala }));
    return `<div class="receipt-chart">
      <div class="receipt-chart-axis" aria-hidden="true">${marcas.map(m => `<span style="bottom:${m.altura}%">${esc(escala(m.valor))}</span>`).join('')}</div>
      <div class="receipt-chart-scroll" role="region" aria-label="Gráfica de consumo diario por recibo. Desplázate horizontalmente para ver todos los recibos." tabindex="0">
        <div class="receipt-chart-columns" style="--recibos:${e.filas.length};grid-template-columns:repeat(${e.filas.length},minmax(86px,1fr))">
          <div class="receipt-chart-grid" aria-hidden="true">${marcas.map(m => `<span style="bottom:${m.altura}%"></span>`).join('')}</div>
          ${e.filas.map(r => `<button type="button" class="receipt-chart-column" data-period="${r.id}" aria-pressed="${r.id === escogido.id}" aria-label="${esc(periodo(r))}: ${valor(r.diario)} litros por día. Ver detalle.">
            <span class="receipt-chart-track" style="--altura:${r.diario / techo * 100}%">
              <span class="receipt-chart-value"><strong>${valor(r.diario)}</strong><small>L/día</small></span>
              <span class="receipt-chart-bar ${r.diario === 0 ? 'is-zero' : ''}" aria-hidden="true"></span>
            </span>
            <span class="receipt-chart-label">${periodo(r)}</span>
          </button>`).join('')}
        </div>
      </div>
    </div>${e.filas.length > 2 ? '<p class="receipt-chart-hint">Desliza la gráfica para ver todos los recibos.</p>' : ''}`;
  }
  function estadisticas() {
    const e=C.estadisticas(estado.recibos,estado.hogar.personas);
    if(!e)return volver('Volver a recibos','consumo')+heading('TUS PERIODOS FACTURADOS','Estadísticas','Agrega tu primer recibo para comenzar.')+btn('Registrar un recibo','consumo');
    const escogido=e.filas.find(r=>r.id===selectedPeriod)||e.filas[0];
    return volver('Volver a recibos','consumo')+heading('TUS PERIODOS FACTURADOS','Estadísticas de consumo','Compara el promedio diario, aunque cada recibo cubra una cantidad distinta de días.')+
      `<section class="surface chart"><h2>Litros por día de cada recibo</h2><p class="quiet">Toca una barra para consultar el periodo.</p>
      ${graficaRecibos(e, escogido)}
      ${e.filas.some(r=>r.grupo===1)?'<p class="quiet">Los recibos sin fechas aparecen al final, en orden de registro.</p>':''}</section>
      <section class="surface period-detail" aria-live="polite"><h2>${periodo(escogido)}</h2><p>${fmt(escogido.m3)} m³ en ${escogido.dias} días · <strong>${fmt(escogido.diario)} L/día</strong>.</p></section>
      ${estado.recibos.length===1?nota('Tienes un solo recibo: todavía no hay periodos para comparar cambios.'):''}
      ${comparar(e.resumen)}${btn('Volver a mis recibos','consumo','secondary')}`;
  }
  function recordatorios() {
    return `<section class="surface reminders"><h2>Recuerda revisar tu factura</h2><p>La facturación es generalmente bimestral. Consulta la fecha de vencimiento en tu factura.</p><p class="quiet">No calculamos fechas de llegada ni alertas de pago. Marcar como pagado solo actualiza tu registro en este navegador.</p></section>`;
  }
  function fuentes() {
    const links={oab:'https://oab.ambientebogota.gov.co/indicadores/?id=f7c740e0-0bd1-11ea-8a63-eb42c61128d3',esfera:'https://spherestandards.org/wp-content/uploads/El-manual-Esfera-2018-ES.pdf',oms:'https://www.who.int/publications/i/item/9789240015241',epa:'https://www.epa.gov/watersense/residential-toilets',energy:'https://www.energystar.gov/products/clothes_washers',merck:'https://www.merckvetmanual.com/es-us/manejo-y-nutrici%C3%B3n/nutrici%C3%B3n-peque%C3%B1os-animales/necesidades-nutricionales-de-peque%C3%B1os-animales',eaab:'https://acueducto.com.co/wps/portal/EAB2/Home/mi-cuenta/facturacion/conozca_la_factura'};
    const rows=[['Consumo residencial (2025)','75,44','L/persona/día','Promedio observado','oab','OAB · CRAPH'],['Beber','3','L/persona/día','Supuesto: asignación a bebida a partir del rango de ingesta','esfera','Esfera 2018'],['Cocina básica','5','L/persona/día','Valor elegido dentro de 3–6','esfera','Esfera 2018'],['Higiene básica','6','L/persona/día','Valor elegido dentro de 2–6','esfera','Esfera 2018'],['Sanitario eficiente','4,8','L/descarga','Referencia de equipo; aproximación de 1,28 galones US','epa','EPA WaterSense'],['Frecuencia del sanitario','3','Descargas/persona/día','Supuesto editable',null,'Diseño del prototipo'],['Limpieza aplazable','0','L/hogar/día','Supuesto inicial',null,'Diseño del prototipo'],['Lavado de ropa','0','Cargas en todo el corte','Supuesto inicial',null,'Diseño del prototipo'],['Lavadora eficiente / convencional','53 / 76','L/carga','Aproximación de 14 / 20 galones US','energy','ENERGY STAR'],['Mascotas','55','mL/kg/día','Valor orientativo dentro de 44–66','merck','Merck Veterinary Manual']];
    return volver()+heading('INFORMACIÓN CON ORIGEN CLARO','Fuentes y metodología','Valores iniciales orientativos. Abre cada apartado para conocer su origen.')+
    nota('Los recibos muestran consumo histórico. El plan es una simulación: no demuestra ahorro real ni establece cantidades obligatorias.')+
    `<div class="source-cards">${rows.map(row=>`<details class="customize source-card"><summary><span><strong>${row[0]}</strong><span class="source-value">${row[1]} ${row[2]}</span><small>${row[5]} · ${row[3]}</small></span><span aria-hidden="true">+</span></summary><div class="details-content"><p>${row[4]?'Consulta el contexto original antes de interpretar este valor.':'Es un supuesto de simulación editable, no una recomendación oficial.'}</p>${row[4]?externos(links[row[4]],'Abrir fuente original'):''}</div></details>`).join('')}</div>
    <details class="customize"><summary><span>Cómo interpretar las cantidades<small>Contexto y límites de las referencias</small></span><span aria-hidden="true">+</span></summary><div class="details-content"><p><strong>Esfera 2018, páginas impresas 122 y 164:</strong> referencias de supervivencia y respuesta humanitaria, no cantidades ideales universales. La ingesta de 2,5–3 L incluye bebidas y alimentos. Asignar 3 L a bebida es un supuesto conservador del simulador, no una prescripción médica.</p><p>La higiene básica representa lavado de manos y aseo esencial; no necesariamente una ducha completa. El cero para limpieza solo afecta tareas aplazables: no elimina la limpieza sanitaria indispensable.</p><p><strong>Equipos:</strong> no todos los sanitarios consumen 4,8 L. Ajusta los litros por descarga y su frecuencia. Las lavadoras pueden variar; 1 galón estadounidense ≈ 3,78541 L. Las cargas corresponden a todo el corte.</p><p><strong>Mascotas:</strong> Merck describe agua total para mamíferos en ambiente termoneutro; los alimentos húmedos pueden aportar parte. El peso de 10 kg inicial es ficticio. El cálculo no limita el agua potable: conserva acceso libre al agua y considera sus necesidades particulares.</p><p><strong>OMS, 2020:</strong> aporta contexto sobre acceso, cantidad de agua y salud. No sumamos sus referencias a las de Esfera.</p>${externos(links.oms,'OMS · cantidad de agua doméstica y salud')}</div></details>
    <details class="customize"><summary><span>Cálculos del prototipo<small>Consultar fórmulas y criterios</small></span><span aria-hidden="true">+</span></summary><div class="details-content"><ul class="formula-list"><li>Recibo: m³ × 1.000 ÷ días = L/día.</li><li>Histórico: suma de litros ÷ suma de días; por persona: dividir por integrantes.</li><li>Variación: (diario reciente − diario anterior) ÷ diario anterior × 100. Si el anterior es cero, no se divide por cero.</li><li>Referencia del hogar: 75,44 × integrantes. Diferencia = diario histórico − referencia; porcentaje = diferencia ÷ referencia × 100. La calculadora conserva la tolerancia interna de ±1 %. La tarjeta muestra por encima o por debajo según el signo de la diferencia.</li><li>Corte: días = horas ÷ 24. Beber, cocinar e higiene: integrantes × tasa × días.</li><li>Sanitario: integrantes × descargas/persona/día × L/descarga × días.</li><li>Limpieza: L/hogar/día × días. Ropa: cargas totales × L/carga.</li><li>Mascotas: suma de (kg × mL/kg/día) ÷ 1.000 × días.</li><li>Balance: reserva doméstica − suma de actividades. No incluye reservas comunales.</li></ul><p>Los días entre fechas incluyen ambos extremos. Los registros sin fechas se muestran aparte, en orden de registro, sin atribuirles cronología. Los litros se redondean a dos decimales y los porcentajes a uno, solo al mostrarlos.</p></div></details>
    
    <details class="customize"><summary><span>Facturación y recordatorios<small>EAAB · generalmente bimestral</small></span><span aria-hidden="true">+</span></summary><div class="details-content"><p>Revisa la fecha de vencimiento en tu factura. No calculamos alertas ni fechas de llegada. Marcar como pagado solo modifica tu registro local; no confirma un pago ante la EAAB.</p>${externos(links.eaab,'EAAB · conoce la factura')}</div></details>`;
  }
  function habitos() {
    const h = estado.hogar, calc = C.habitos(h);
    return volver() + heading('PEQUEÑAS ACCIONES DIARIAS', 'Mis hábitos', 'Estos datos estiman parte del consumo de un día habitual, sin corte.') +
      `<form id="habitos-form"><fieldset class="plain"><legend>¿Qué hacen habitualmente?</legend>${[['cocinar', 'Cocinar'], ['limpieza', 'Limpiar la casa'], ['ropa', 'Lavar ropa'], ['plantas', 'Cuidar plantas']].map(([v, t]) => checkbox('actividades', t, h.actividades.includes(v), v)).join('')}</fieldset>
        ${input('ducha', 'Duración de la ducha (minutos)', h.ducha, .1, 120, .1)}
        ${input('caudal', 'Agua que sale de la ducha (L/min)', h.caudal, .1, 40, .1, 'Ejemplo inicial: 8 litros por minuto. Puedes ajustarlo.')}
        ${input('cocina', 'Agua para cocinar (L/hogar/día)', h.cocina, .1, 200, .1, 'Estimación de un día habitual por hogar. El plan de corte usa otra tasa, por persona.')}
        ${checkbox('esEstimado', 'No conozco los datos: mostrar un rango de ejemplo de ±20 %', h.esEstimado)}${error}<button class="btn" type="submit">Guardar mis hábitos${icon('check')}</button></form>
        <section class="surface habit-result"><h2>Ducha y cocina, aproximadamente</h2><div class="summary-number">${fmt(calc.total)}<span>L / día</span></div><p>Ducha: ${fmt(calc.ducha)} L + cocina: ${fmt(calc.cocina)} L.</p>${h.esEstimado ? `<p>Rango ilustrativo: <strong>${fmt(calc.min)} a ${fmt(calc.max)} L/día.</strong></p>` : ''}<p class="quiet">Supone una ducha por persona al día. Es una estimación parcial; no reemplaza el recibo ni se suma a él. El rango no es una referencia oficial ni estadística.</p></section>`;
  }
  function metas() {
    const { c } = data(), m = C.meta(c ? c.diario : null, estado.meta);
    return volver() + heading('UN OBJETIVO PARA EXPLORAR', 'Mis metas', 'Piensa en desperdicios que podrías evitar, sin reducir los usos esenciales.') +
      `<section class="surface goal-result"><span class="round-icon">${icon('meta')}</span><p>Meta orientativa del hogar</p><div class="summary-number">${m === null ? '—' : fmt(m)}<span>L / día</span></div><p>${m === null ? 'Agrega un recibo para tener una base de comparación.' : `Sobre un promedio de ${fmt(c.diario)} L/día, la diferencia propuesta es ${fmt(c.diario - m)} L/día.`}</p></section>
        <form id="meta-form">${input('meta', 'Reducción que quieres explorar (%)', estado.meta, 0, 30, .5)}${error}<button class="btn" type="submit">Actualizar mi meta${icon('check')}</button></form>
        ${nota('<strong>Es un objetivo, no ahorro logrado.</strong> La meta no cambia los litros esenciales de tu plan. El 10 % inicial es solo un ejemplo; puedes elegir 0 % si no identificas desperdicios evitables.')}
        <a class="wide-link" href="#consejos">Ideas para evitar desperdicios →</a>`;
  }
  function listaConsejos() {
    const h = estado.hogar;
    const rows = [
      ['Cierra la llave en las pausas', 'Al cepillarte, evita dejar correr el agua sin usarla.', 'gota', true],
      ['Revisa las fugas', 'Comprueba llaves, duchas y tuberías: una pérdida pequeña también cuenta.', 'hogar', true]
    ];
    if (h.ducha > 5) rows.push(['Revisa el tiempo de la ducha', 'Tus hábitos indican duchas de más de cinco minutos. Identifica momentos en que corre agua sin usarla.', 'gota', true]);
    if (h.actividades.includes('ropa')) rows.push(['Aprovecha cada carga', 'Usa la lavadora con carga completa, de acuerdo con su capacidad.', 'ropa', true]);
    if (h.actividades.includes('cocinar')) rows.push(['Planea la preparación de alimentos', 'Separa el agua de cocina en tu plan. Conserva la necesaria para preparar los alimentos.', 'cocina', false]);
    if (h.mayor) rows.push(['Planeen juntos', 'Acuerden quién facilita el acceso al agua al adulto mayor. No cambiamos sus indicaciones individuales.', 'corazon', false]);
    if (h.mascota) rows.push(['Su cuidado también cuenta', 'Ajusta el agua de mascotas a las necesidades que conoces. El ejemplo no es una cuota veterinaria.', 'huella', false]);
    if (h.actividades.includes('plantas')) rows.push(['Separa los usos del agua', 'Planifica el cuidado de las plantas sin mezclar agua reutilizada con la reserva potable.', 'brillo', false]);
    return rows;
  }
  function consejos() {
    return heading('CUIDAR SIN COMPLICARSE', 'Pequeños hábitos que suman', 'Ideas para tu hogar, según las actividades que registraste.') +
      `<div class="tips">${listaConsejos().map(([t, s, ico, oficial], i) => `<article class="tip ${i === 0 ? 'featured' : ''}"><span class="round-icon">${icon(ico)}</span><h2>${t}</h2><p>${s}</p>${oficial ? externos(fuente, 'Fuente: Portal Bogotá / EAAB') : '<small>Orientación del prototipo, sin cantidades obligatorias.</small>'}</article>`).join('')}</div>${btn('Información y avisos', 'avisos', 'secondary')}`;
  }
  function avisos() {
    return volver('Volver a consejos', 'consejos') + heading('INFORMACIÓN CON ORIGEN CLARO', 'Información y avisos', 'Verifica la fuente antes de compartir un aviso.') +
      recordatorios() + nota('<strong>SIMULACIÓN — NO ES INFORMACIÓN ACTUAL</strong><br>No recibimos turnos ni fechas de la EAAB. Estos avisos son ejemplos.', 'warning') +
      `<div class="section-heading"><h2>Avisos de ejemplo</h2><span>${3 - estado.leidos.length} sin leer</span></div><div class="notices">${[
        ['corte', 'Preparen juntos el corte simulado', `Tu plan está configurado para ${fmt(estado.horas)} horas. No corresponde a una fecha o corte real.`],
        ['meta', 'Revisen su meta', 'Comprueben los recibos y los desperdicios evitables antes de cambiar el objetivo.'],
        ['reserva', 'Actualicen el agua disponible', 'Revisen los litros almacenados cuando cambie la reserva. No es una lectura automática.']
      ].map(([id, t, s]) => `<article class="notice"><span class="simulation-label">SIMULACIÓN — NO ES INFORMACIÓN ACTUAL</span><h3>${t}</h3><p>${s}</p><button class="wide-link" data-read="${id}">${estado.leidos.includes(id) ? '✓ Leído · Marcar como no leído' : 'Marcar como leído'}</button></article>`).join('')}</div>
        <h2 class="spaced">Canales oficiales</h2><div class="source-list">${externos('https://www.acueducto.com.co/', 'Acueducto de Bogotá · EAAB')}${externos('https://bogota.gov.co/', 'Alcaldía · Portal Bogotá')}${externos(fuente, 'Consejos del Acueducto')}</div><p class="quiet">Revisa la fecha de las publicaciones. Los consejos citados no confirman un corte vigente. Los avisos se muestran solo aquí; no se envían al teléfono.</p>`;
  }
  function configuracion() {
    return volver() + heading('TU HOGAR, A TU MANERA', 'Configuración', 'Ajusta tus datos o vuelve a empezar la demostración.') +
      `<form id="nombre-form"><label class="field">Nombre para identificar tu hogar<input name="nombre" maxlength="50" value="${esc(estado.hogar.nombre)}" required></label><p class="quiet">Puede ser un nombre ficticio. No necesitas identificar a las personas.</p>${error}<button class="btn secondary" type="submit">Guardar nombre${icon('check')}</button></form>
        <div class="menu-list spaced">${[['familia', 'Cambiar integrantes', 'personas'], ['actividades', 'Personalizar cantidades', 'grafico'], ['habitos', 'Editar mis hábitos', 'gota'], ['ejemplos', 'Elegir otra familia de ejemplo', 'hogar']].map(([url, t, ico]) => `<a class="menu-item" href="#${url}"><span class="choice-icon">${icon(ico)}</span><strong>${t}</strong>${icon('flecha')}</a>`).join('')}</div>
        <section class="reset-area"><h2>Volver al ejemplo inicial</h2><p>Recupera la familia de cuatro y reemplaza tus registros actuales.</p><button class="btn secondary" data-reset>Reiniciar demostración</button></section>
        ${nota('Tus datos se guardan en este navegador. No hay cuentas ni sincronización entre dispositivos. Las funciones de la app usan archivos locales; abrir las fuentes requiere internet.')}`;
  }

  const screens = { inicio, ejemplos, familia, actividades, agua, plan, mas, consumo, habitos, metas, consejos, avisos, configuracion, estadisticas, fuentes };
  // Compatibilidad con enlaces de V1.
  const aliases = { hogar: 'familia', planificador: 'actividades', reserva: 'agua', recibos: 'consumo' };
  function route() { const id = aliases[location.hash.slice(1)] || location.hash.slice(1); return screens[id] ? id : 'inicio'; }
  function navGroup(id) {
    if (['familia', 'actividades', 'agua', 'plan'].includes(id)) return 'plan';
    if (['consumo', 'estadisticas'].includes(id)) return 'consumo';
    return ['inicio', 'ejemplos'].includes(id) ? 'inicio' : 'mas';
  }
  function render(focus = false) {
    const id = route();
    $('#bottom-nav').innerHTML = [['inicio', 'Inicio', 'hogar'], ['plan', 'Mi plan', 'plan'], ['consumo', 'Recibos', 'grafico'], ['mas', 'Más', 'mas']].map(([url, label, ico]) => `<a href="#${url}" ${navGroup(id) === url ? 'aria-current="page"' : ''}><span>${icon(ico)}</span>${label}</a>`).join('');
    const pendiente = G && G.pendiente(id);
    $('#contenido').innerHTML = (avisoCarga ? nota(esc(avisoCarga), 'warning') : '') + (memoria ? nota('No pudimos guardar en el navegador. Puedes seguir usando esta sesión.', 'warning') : '') + (pendiente ? G.bloqueo(pendiente) : (G && !['ejemplos','familia','actividades','agua','plan'].includes(id) ? G.progreso(G.datos().nivel>=3?6:2) : '') + screens[id]());
    const form = $('#contenido form');
    if (form && borradores.has(form.id)) restoreDraft(form);
    if (form) updateControls(form);
    if (focus) { $('#contenido').focus({ preventScroll: true }); window.scrollTo({top:0,behavior:'instant'}); }
  }
  // Los valores incompletos se conservan durante la navegación de esta sesión.
  // Solo datos válidos pasan al estado utilizado por la calculadora.
  function captureDraft(form) {
    const values = Array.from(form.elements).filter(el => el.name).map(el => ({ name: el.name, value: el.value, checked: el.checked, type: el.type }));
    borradores.set(form.id, values);
  }
  function restoreDraft(form) {
    for (const field of borradores.get(form.id)) {
      const el = Array.from(form.elements).find(el => el.name === field.name && (field.type !== 'checkbox' || el.value === field.value));
      if (el) { if (field.type === 'checkbox') el.checked = field.checked; else el.value = field.value; }
    }
    updateControls(form);
  }
  function readForm(form) {
    const f = new FormData(form), n = structuredClone(estado);
    switch (form.id) {
      case 'familia-form':
        n.hogar.personas = C.numero(f.get('personas'), 1, 30, true);
        n.hogar.mayor = f.has('mayor'); n.hogar.mascota = f.has('mascota');
        n.seleccion = n.seleccion.filter(id => id !== 'mascota');
        if (n.hogar.mascota) n.seleccion.push('mascota');
        break;
      case 'actividades-form':
        if (G) n.horas = C.numero(f.get('horas'), 1, 168);
        n.seleccion = D.referencias.filter(r => r.esencial && (r.id !== 'mascota' || n.hogar.mascota)).map(r => r.id).concat(f.getAll('seleccion'));
        D.referencias.filter(r => r.id !== 'mascota').forEach(r => n.tasas[r.id] = C.numero(f.get('tasa-' + r.id), r.id==='limpieza'?0:.1, 1000));
        n.frecuencia=C.numero(f.get('frecuencia'),.1,50); n.cargas=C.numero(f.get('cargas'),0,100,true); n.lavadora=f.get('lavadora');
        if(n.hogar.mascota)n.mascotas=n.mascotas.map(m=>({...m,peso:C.numero(f.get('peso-'+m.id),.1,1000),mlKg:C.numero(f.get('ml-'+m.id),.1,1000)}));
        break;
      case 'agua-form':
        n.reserva = C.numero(f.get('reserva'), 0, 100000);
        if (!G) n.horas = C.numero(f.get('horas'), 1, 168);
        break;
      case 'habitos-form':
        n.hogar.actividades = f.getAll('actividades');
        n.hogar.ducha = C.numero(f.get('ducha'), .1, 120);
        n.hogar.caudal = C.numero(f.get('caudal'), .1, 40);
        n.hogar.cocina = C.numero(f.get('cocina'), .1, 200);
        n.hogar.esEstimado = f.has('esEstimado');
        break;
      case 'meta-form': n.meta = C.numero(f.get('meta'), 0, 30); break;
      case 'nombre-form':
        n.hogar.nombre = f.get('nombre').trim();
        if (!n.hogar.nombre) throw new Error('Escribe un nombre para tu hogar.');
        break;
      case 'recibo-form': {
        if (n.recibos.length >= 100 && editingId===null) throw new Error('Puedes guardar hasta 100 recibos. Elimina uno para continuar.');
        const anterior=n.recibos.find(r=>r.id===editingId);
        const r=C.recibo({id:anterior?.id??Math.max(Date.now(),...n.recibos.map(r=>r.id+1)),m3:f.get('m3'),dias:f.get('dias'),valor:f.get('valor'),inicio:f.get('inicio'),fin:f.get('fin'),emision:anterior?.emision||'',vencimiento:anterior?.vencimiento||'',pagado:anterior?.pagado??false,demo:false},n.recibos);
        if(anterior)n.recibos=n.recibos.map(x=>x.id===r.id?r:x);else n.recibos.push(r);
        break;
      }
    }
    return C.validar(n);
  }
  function updateControls(form) {
    if(form.id==='recibo-form') {
      const {inicio,fin,dias}=form.elements; dias.readOnly=false;
      if(inicio.value&&fin.value)try{dias.value=C.diasPeriodo(inicio.value,fin.value);dias.readOnly=true;dias.setCustomValidity('');}catch(_){}
    }
    const person = form.elements.personas;
    if (person) form.querySelectorAll('[data-count]').forEach(b => b.disabled = Number(b.dataset.count) < 0 ? Number(person.value) <= 1 : Number(person.value) >= 30);
    form.querySelectorAll('[data-field="horas"]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.value) === Number(form.elements.horas.value))));
  }
  function inputChanged(form) {
    if (G) G.editar(form.id);
    updateControls(form);
    captureDraft(form);
    if (!form.hasAttribute('data-autosave')) return;
    try {
      // validity.valid no presenta globos de error mientras la persona escribe.
      if (!Array.from(form.elements).every(el => !el.validity || el.validity.valid)) return;
      commit(readForm(form));
      borradores.delete(form.id);
      if ($('#save-status')) $('#save-status').textContent = memoria ? 'Cambios guardados solo durante esta sesión.' : 'Cambios guardados en este navegador.';
    } catch (_) { /* Se valida al continuar; nunca guardar entradas inválidas. */ }
  }
  function confirmAction(title, text, label, action) {
    const dlg = $('#confirmacion');
    $('#dialog-title').textContent = title; $('#dialog-text').textContent = text;
    dlg.querySelector('[value="ok"]').textContent = label;
    dlg.querySelector('[value="cancel"]').textContent = 'Cancelar';
    dlg.returnValue = '';
    dlg.onclose = () => { if (dlg.returnValue === 'ok') action(); };
    dlg.showModal();
  }
  function loadDemo(id) {
    const action = () => {
      borradores.clear(); editingId=null; selectedPeriod=null; avisoCarga = ''; if(G)G.elegir(); commit(D.crear(id));
      if (route() === 'familia') render(true); else location.hash = 'familia';
      toast(id === 'nuevo' ? 'Tu hogar está listo para configurar.' : 'Familia de ejemplo cargada.');
    };
    if (tieneDatos) confirmAction('¿Cambiamos de hogar?', 'Se reemplazarán el perfil, los recibos y el plan guardados en este navegador.', id === 'nuevo' ? 'Crear mi hogar' : 'Cargar familia', action);
    else action();
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.skip')) { e.preventDefault(); $('#contenido').focus(); return; }
    const b = e.target.closest('button');
    if (!b) return;
    if(b.hasAttribute('data-explore') && G){G.explorar();guardar();location.hash='mas';return;}
    if (b.dataset.demo) loadDemo(b.dataset.demo);
    if (b.hasAttribute('data-reset')) confirmAction('¿Reiniciar la demostración?', 'Volverás a la familia de cuatro. Se reemplazarán los datos actuales.', 'Reiniciar', () => {
      borradores.clear(); editingId=null; selectedPeriod=null; avisoCarga = ''; if(G)G.iniciar(null); commit(D.crear('familia')); location.hash = G ? 'ejemplos' : 'inicio'; render(true); toast('Demostración reiniciada.');
    });
    if (b.dataset.count) {
      const form = b.closest('form'), el = form.elements.personas;
      el.value = Math.min(30, Math.max(1, (Number(el.value) || 1) + Number(b.dataset.count)));
      el.setCustomValidity(''); inputChanged(form);
    }
    if (b.dataset.field) {
      const form = b.closest('form'), el = form.elements[b.dataset.field];
      el.value = b.dataset.value; el.setCustomValidity(''); inputChanged(form);
    }
    if (b.dataset.delete) confirmAction('¿Eliminar este recibo?', 'El promedio y la meta se recalcularán con los recibos restantes.', 'Eliminar recibo', () => {
      editingId=null; borradores.delete('recibo-form'); const n = structuredClone(estado); n.recibos = n.recibos.filter(r => r.id !== Number(b.dataset.delete)); commit(n); render(); toast('Recibo eliminado.');
    });
    if(b.dataset.edit){editingId=Number(b.dataset.edit);borradores.delete('recibo-form');render();$('#recibo-form').scrollIntoView({block:'start'});$('#recibo-form input').focus();}
    if(b.hasAttribute('data-cancel-edit')){editingId=null;borradores.delete('recibo-form');render();}
    if(b.dataset.paid){const n=structuredClone(estado),r=n.recibos.find(r=>r.id===Number(b.dataset.paid));r.pagado=!r.pagado;commit(n);render();toast('Estado de pago actualizado según tu registro.');}
    if(b.dataset.period){
      const desplazamiento=$('.receipt-chart-scroll').scrollLeft;
      selectedPeriod=Number(b.dataset.period);render();
      $('.receipt-chart-scroll').scrollLeft=desplazamiento;
      const chosen=$(`[data-period="${selectedPeriod}"]`);chosen.focus({preventScroll:true});
      $('.period-detail').scrollIntoView({block:'nearest'});
    }
    if(b.hasAttribute('data-add-pet')||b.hasAttribute('data-remove-pet')){
      const form=b.closest('form');try{const n=readForm(form);if(b.hasAttribute('data-add-pet')){if(n.mascotas.length>=10)return;n.mascotas.push({id:Math.max(...n.mascotas.map(m=>m.id))+1,peso:10,mlKg:55});}else{if(n.mascotas.length<=1)return;n.mascotas=n.mascotas.filter(m=>m.id!==Number(b.dataset.removePet));}commit(n);borradores.delete(form.id);render();$('#cantidades').open=true;}catch(err){form.querySelector('.form-error').textContent=err.message;}
    }
    if (b.dataset.read) {
      const n = structuredClone(estado), id = b.dataset.read;
      n.leidos = n.leidos.includes(id) ? n.leidos.filter(v => v !== id) : [...n.leidos, id];
      commit(n); render(); toast('Aviso actualizado.');
    }
  });
  document.addEventListener('invalid', e => {
    const el = e.target;
    if (!el.matches('input')) return;
    el.setCustomValidity(el.validity.valueMissing ? 'Completa este campo.' : el.validity.rangeUnderflow || el.validity.rangeOverflow ? `Ingresa un valor entre ${el.min} y ${el.max}.` : el.validity.stepMismatch ? 'Revisa los decimales o usa un número entero según el campo.' : 'Revisa el valor ingresado.');
    // Permite que el navegador enfoque un campo inválido dentro de un desplegable.
    const details = el.closest('details'); if (details) details.open = true;
  }, true);
  document.addEventListener('input', e => {
    if (!e.target.matches('input, select')) return;
    e.target.setCustomValidity('');
    if(e.target.name==='lavadora' && e.target.value!=='manual'){e.target.form.elements['tasa-ropa'].value=e.target.value==='eficiente'?53:76;}
    if(e.target.name==='tasa-ropa'){e.target.form.elements.lavadora.value='manual';}
    const form = e.target.closest('#contenido form');
    if (form) { form.querySelector('.form-error').textContent = ''; inputChanged(form); }
  });
  document.addEventListener('submit', e => {
    if (e.target.method === 'dialog') return;
    const form = e.target;
    if (!form.closest('#contenido')) return;
    e.preventDefault();
    try {
      const siguiente = readForm(form);
      if(G)G.confirmar(form.id);
      commit(siguiente); borradores.delete(form.id);
      if (form.id === 'recibo-form') editingId=null;
      const next = { 'familia-form': 'actividades', 'actividades-form': 'agua', 'agua-form': 'plan' }[form.id];
      if (next) location.hash = next;
      else { render(); toast(memoria ? 'Cambios aplicados en esta sesión.' : 'Cambios guardados.'); }
    } catch (err) { form.querySelector('.form-error').textContent = err.message; }
  });
  window.addEventListener('hashchange', () => render(true));
  window.addEventListener('focus',()=>{if(route()==='avisos')render();});
  window.addEventListener('demo:enter', () => {
    if(G) { const destino=G.destino(); if(location.hash.slice(1)!==destino)location.hash=destino; else render(true); }
    else render(true);
  });
  render();
})();
