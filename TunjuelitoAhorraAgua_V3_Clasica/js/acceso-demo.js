/* Componente independiente. Quitar esta referencia de index.html elimina la bienvenida.
   Los campos nunca se leen, validan, guardan ni transmiten. Sin cuentas ni servidor. */
(function () {
  'use strict';
  const panel = document.createElement('section');
  panel.className = 'demo-access';
  panel.setAttribute('aria-labelledby', 'demo-title');
  panel.innerHTML = `<div class="demo-access-inner">
    <div class="brand"><img src="assets/favicon.svg" width="42" height="48" alt="Logotipo: gota de agua"><span>Tunjuelito<strong>Ahorra Agua</strong></span></div>
    ${window.RecorridoGuiado ? window.RecorridoGuiado.progreso(1) : '<span class="local-pill">PROTOTIPO ACADÉMICO</span>'}
    <h1 id="demo-title" tabindex="-1">El agua se cuida<br><em>en familia.</em></h1>
    <p>Prepara tu hogar para un corte simulado, paso a paso.</p>
    <img class="demo-art" src="assets/familia.svg" width="480" height="265" alt="Familia organizando su reserva de agua">
    <aside class="demo-info"><strong>Acceso de demostración</strong><p>Usa datos inventados. No ingreses contraseñas reales. No creamos cuentas ni guardamos o enviamos estos campos.</p></aside>
    <form id="demo-access-form" autocomplete="off" novalidate>
      <label class="field" for="demo-email">Correo electrónico de ejemplo<input id="demo-email" type="email" autocomplete="off" placeholder="familia@ejemplo.com" spellcheck="false"></label>
      <label class="field" for="demo-password">Contraseña de ejemplo<input id="demo-password" type="password" autocomplete="new-password" placeholder="Escribe algo inventado"></label>
      <button class="btn" type="submit">Empezar</button>
      <button class="wide-link" type="button" id="demo-guest">Continuar como invitado</button>
      <p class="save-note">Ambas opciones abren la misma aplicación. Puedes dejar los campos vacíos.</p>
    </form>
  </div>`;
  const app = document.querySelector('.app'), nav = document.getElementById('bottom-nav');
  const skip = document.querySelector('.skip');
  app.hidden = true; nav.hidden = true; if(skip)skip.hidden=true;
  document.body.prepend(panel);
  function entrar(event) {
    event.preventDefault();
    panel.querySelector('form').reset();
    panel.remove();
    app.hidden = false; nav.hidden = false; if(skip)skip.hidden=false;
    window.dispatchEvent(new Event('demo:enter'));
  }
  panel.querySelector('form').addEventListener('submit', entrar);
  panel.querySelector('#demo-guest').addEventListener('click', entrar);
  // La pantalla se vuelve a mostrar al abrir o recargar la página; no guarda sesión.
})();
