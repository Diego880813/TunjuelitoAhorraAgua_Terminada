# Pruebas de las versiones finales V3

## Pruebas ejecutadas

- 38 pruebas de regresión de la calculadora en cada versión: aprobadas. Incluyen conversiones, promedios ponderados, tres familias, duración, sanitario, ropa, mascotas, metas, fechas, validación y migración.
- 12 pruebas del recorrido guiado: aprobadas. Comprueban orden de confirmación, bloqueos por datos pendientes, recibos opcionales, edición, persistencia del progreso y reinicio.
- 40 combinaciones comparadas entre ambas calculadoras: cuatro perfiles (incluido nuevo), cinco duraciones y dos cantidades de cargas. Plan, histórico, estadísticas, hábitos y meta idénticos.
- Comparación de archivos: calculadora y datos de demostración idénticos byte a byte al ZIP V3 recibido. El código compartido de ambas variantes también es idéntico.
- Sintaxis JavaScript y rutas locales de index.html: correctas. Todos los enlaces originales de fuentes se conservaron.

## Revisión en navegador

Se utilizó Chromium de escritorio con contenedores de ancho reducido, no teléfonos físicos.

- 15 secciones × 3 anchos × 2 versiones = 90 revisiones de ancho sin desbordamiento horizontal. Contenedores de 320, 390 y 430 px; anchos útiles medidos de 305, 375 y 415 px debido a la barra de desplazamiento del entorno de prueba.
- Inicio, plan, recibos, estadísticas y fuentes × 2 anchos × 2 versiones = 20 revisiones adicionales sin desbordamiento. Anchos útiles: 753 y 1.350 px.
- Acceso con Empezar (campos inventados y campos vacíos) y como invitado. Inspección del código: el componente no lee valores, no usa FormData ni almacenamiento ni peticiones. Los textos de credenciales ficticias usados en la prueba no aparecieron en los registros locales de ninguna variante.
- Recorrido guiado: bloqueo antes de elegir familia; bloqueo de resultado al faltar actividades o reserva; enlaces directos al paso pendiente; resultado tras confirmar. Tras una edición inválida de reserva, el acceso al resultado vuelve a pedir completar ese dato.
- Resultado de familia de cuatro observado en ambas interfaces: 113,6 L para 24 h; reserva 120 L y diferencia +6,4 L. También se observaron 85,2 L para adulto mayor y 57,35 L para mascota en los respectivos escenarios.
- Hogar personalizado de dos integrantes, 48 h, reserva cero y sin recibos: resultado 113,6 L; faltante 113,6 L. Estadísticas vacías con invitación a registrar un recibo, sin bloquear el plan.
- Persistencia del hogar personalizado y de su progreso tras recargar.
- Registro de recibo fechado (9 m³/30 días), junto al ejemplo de 18 m³/60 días: dos barras de 300 L/día. Días derivados de las fechas.
- Validación de consumo negativo y cero integrantes. Consumo cero y reserva cero aceptados.
- Marcar como pagado en ambas variantes. Editar el recibo de 9 a 0 m³ y agregar valor conserva el estado pagado. Histórico ponderado resultante: 200 L/día, por debajo de 226,32 L/día para tres integrantes.
- Comparación por encima del promedio con la familia de cuatro: 375 frente a 301,76 L/día. Barras de 400 y 350 L/día; selección de una barra actualiza su detalle.
- Con un solo recibo se muestra explícitamente que no hay periodos para comparar cambios.
- Fuentes desplegables y sus enlaces visibles al ampliar; pantalla de recibos sin campos de emisión ni vencimiento.
- Reinicio de demostración clásica recupera la familia de cuatro. Cambio entre ejemplos y creación de hogar probado en la guiada.
- No se observaron errores JavaScript atribuibles a la aplicación en los registros consultados. Los mensajes de la extensión del entorno de prueba se excluyeron por provenir de chrome-extension://.

## Límites de la revisión

No se ejecutó en dispositivos físicos, Safari, Firefox o Edge, ni se validó con usuarios o lectores de pantalla. No se publicó en GitHub Pages ni se ejecutó la extensión de VS Code Live Server; se comprobó el sitio servido como archivos estáticos y las rutas relativas. La apertura directa con file:// está prevista por su estructura sin módulos ni peticiones, pero no se ejecutó en esta revisión. No se volvió a auditar el contenido externo de las fuentes: se conservaron las referencias aprobadas de V3.

Las pruebas originales de fechas/recordatorios permanecen para regresión del módulo íntegro. No significan que existan alertas de pago en esta interfaz: ninguna pantalla invoca esa función antigua. La información de facturación es únicamente informativa.

Los archivos auxiliares de revisión móvil no se incluyen en la aplicación. No hay datos personales de las pruebas dentro del ZIP: el navegador guarda el hogar por separado y cada instalación inicia con sus propios datos locales.
