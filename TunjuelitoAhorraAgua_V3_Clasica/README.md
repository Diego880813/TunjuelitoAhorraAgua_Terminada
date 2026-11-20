# Tunjuelito Ahorra Agua V3 — Navegación clásica

Prototipo académico CDIO · Proyecto de Diseño 1 · Tunjuelito, Bogotá.

## Abrir y ejecutar

1. Descomprime el ZIP y abre la carpeta en **Visual Studio Code**.
2. Abre `index.html` directamente en un navegador moderno, o usa **Open with Live Server** con la extensión gratuita Live Server.
3. Pulsa **Empezar** o **Continuar como invitado**. Puedes dejar los campos vacíos: no hay cuentas ni autenticación.

No necesita instalación de paquetes, servidor propio, backend ni API. Los enlaces a fuentes sí requieren internet. Live Server ofrece un comportamiento más consistente de localStorage que abrir archivos con `file://`.

## Qué versión estás probando

Conserva Inicio | Mi plan | Recibos | Más y el plan familiar de cuatro pasos. Puedes explorar libremente desde el inicio.

Ambas versiones usan exactamente la misma calculadora, referencias, familias, fuentes, contenido de las secciones y estilos. Solo cambia la forma de recorrerlas y la ubicación del campo de duración.

## Prueba rápida

Elige cada familia desde Inicio o Configuración → Elegir otra familia. Confirma sus datos sin modificarlos:

| Hogar ficticio | Plan de 24 horas | Reserva | Diferencia a favor simulada |
|---|---:|---:|---:|
| 4 personas | 113,60 L | 120 L | 6,40 L |
| 3 personas, adulto mayor | 85,20 L | 120 L | 34,80 L |
| 2 personas, mascota de ejemplo | 57,35 L | 100 L | 42,65 L |

También puedes crear un hogar sin recibos. Cambia horas, integrantes y reserva para ver el resultado. Reinicia desde **Más → Configuración → Reiniciar demostración**.

## Funciones y ajustes

- Hogar, hábitos, plan de corte, reservas, metas, consejos, avisos simulados y fuentes.
- Recibos manuales: m³, días, valor opcional y fechas del periodo. Editar, eliminar y marcar como pagado funcionan localmente.
- Estadísticas con barras de L/día por recibo; comparación con Bogotá: **75,44 L/persona/día (OAB, 2025)**, escalada por integrantes. Sin tendencias inventadas con un único recibo.
- Facturación generalmente bimestral: se recuerda revisar el vencimiento en la factura. No se calculan alertas ni próximas fechas.
- Fuentes en apartados desplegables; contexto y fórmulas disponibles al ampliar.

## Datos y simulación

Las familias, recibos de ejemplo, cortes y avisos son ficticios. Los valores del plan son orientativos y editables; no son prescripciones individuales ni ahorro demostrado. No se supone acceso a tanques comunales ni se recomienda reducir usos esenciales.

Se guarda el hogar en `tunjuelito-agua-v3-clasica`. Las versiones mantienen datos independientes aun en el mismo origen. Si no hay datos de esta variante, se puede recuperar el antiguo registro `tunjuelito-agua-v1` sin borrarlo. La versión guiada requiere confirmar los pasos incluso al recuperar datos antiguos. Los antiguos campos de emisión y vencimiento se conservan para compatibilidad, pero no se muestran ni se usan para alertas.

El acceso visual **no lee, guarda, transmite ni valida** el correo o contraseña: usa únicamente datos inventados. Se borran los campos al entrar y la bienvenida reaparece al recargar. No hay sincronización entre equipos.

## Cálculos

- Recibo diario: m³ × 1.000 ÷ días. Histórico: suma de litros ÷ suma de días; dividir por integrantes para el valor por persona.
- Plan: tasas por persona × integrantes × horas/24; sanitario incluye descargas. Ropa = cargas de todo el corte × L/carga. Mascotas = suma de kg × mL/kg/día ÷ 1.000 × horas/24.
- Balance = reserva − plan. Meta orientativa = histórico diario × (1 − porcentaje/100).

Detalle y fuentes en `docs/FORMULAS.md`, `docs/FUENTES_Y_METODOLOGIA.md` y la propia aplicación.

## Código y pruebas

`js/calculadora.js` y `js/datos-demo.js` se conservaron sin cambios respecto al ZIP V3. `js/app.js` y `css/styles.css` son comunes a ambas variantes. Esta variante no carga el adaptador del recorrido guiado.

Para quitar la bienvenida, elimina de `index.html` las referencias a `js/acceso-demo.js` y `css/acceso-demo.css`. El componente crea y retira su propia pantalla, sin depender de cuentas ni alterar los cálculos.

Pruebas opcionales, si tienes Node.js: `node tests/calculadora.test.js`. Resultados y límites reales de la revisión: `docs/PRUEBAS.md`.

## Publicar después y limitaciones

Para GitHub Pages, sube el contenido de esta carpeta a un repositorio y selecciona su rama y carpeta raíz en **Settings → Pages**. Las rutas son relativas. **Esta entrega no se ha publicado**.

Es una simulación local, sin datos en tiempo real de EAAB, lectura de medidor, pagos reales ni validación de potabilidad. No se probó en teléfonos físicos ni en todos los navegadores. Posibles mejoras: pruebas con familias reales, revisión de accesibilidad con usuarios y mantenimiento periódico de referencias.
