# Fuentes y metodología — V3

Referencias conservadas de la V3 adjunta, documentadas el 19 de noviembre de 2026. Esta actualización modifica su presentación sin cambiar los valores aprobados. La aplicación no descarga estas fuentes ni actualiza sus cifras automáticamente. Los enlaces requieren conexión a internet. Las referencias se documentan por separado de las cantidades personalizadas.

## Referencias y supuestos

| Actividad o indicador | Valor inicial utilizado | Unidad | Naturaleza | Fuente |
| --- | ---: | --- | --- | --- |
| Consumo residencial de Bogotá, 2025 | 75,44 | L/habitante/día | Promedio estadístico observado | [OAB · CRAPH](https://oab.ambientebogota.gov.co/indicadores/?id=f7c740e0-0bd1-11ea-8a63-eb42c61128d3) |
| Beber | 3 | L/persona/día | Supuesto de asignar a bebida el extremo del rango de ingesta total | [Esfera 2018](https://spherestandards.org/wp-content/uploads/El-manual-Esfera-2018-ES.pdf) |
| Cocina básica | 5 | L/persona/día | Valor elegido dentro de 3–6 | Esfera 2018 |
| Higiene básica | 6 | L/persona/día | Valor elegido dentro de 2–6 | Esfera 2018 |
| Sanitario eficiente | 4,8 | L/descarga | Aproximación de 1,28 galones estadounidenses | [EPA WaterSense](https://www.epa.gov/watersense/residential-toilets) |
| Frecuencia del sanitario | 3 | Descargas/persona/día | Supuesto editable, sin atribución oficial | Diseño del prototipo |
| Limpieza aplazable | 0 | L/hogar/día | Supuesto inicial | Diseño del prototipo |
| Ropa | 0 | Cargas totales durante el corte | Supuesto inicial | Diseño del prototipo |
| Lavadora eficiente / convencional | 53 / 76 | L/carga | Aproximación de 14 / 20 galones estadounidenses | [ENERGY STAR](https://www.energystar.gov/products/clothes_washers) |
| Mascotas | 55 | mL/kg/día | Valor orientativo dentro de 44–66 | [Manual Veterinario Merck](https://www.merckvetmanual.com/es-us/manejo-y-nutrici%C3%B3n/nutrici%C3%B3n-peque%C3%B1os-animales/necesidades-nutricionales-de-peque%C3%B1os-animales) |

### Interpretación

**OAB:** CRAPH relaciona el consumo residencial con la población urbana. La cifra de 2025 se utiliza como comparación del consumo histórico. Se multiplica por el número de personas para comparar hogares; no expresa un ideal, obligación ni límite. La calculadora conserva la tolerancia interna ±1 %, pero la tarjeta simplificada muestra el signo de la diferencia: por encima o por debajo.

**Esfera:** páginas impresas 122 y 164 (páginas 133 y 175 del archivo PDF). Son referencias de supervivencia y respuesta humanitaria. El rango de ingesta 2,5–3 L incluye bebidas y alimentos; asignar 3 L al apartado de bebida es un supuesto conservador del simulador. No es una prescripción médica ni una cantidad universal. Higiene básica significa aseo esencial y manos; no necesariamente una ducha completa.

**Equipos:** WaterSense y ENERGY STAR son referencias técnicas de eficiencia. No se asume que los hogares de Bogotá tengan esos equipos. Un galón estadounidense equivale aproximadamente a 3,78541 L. Los valores dependen del equipo/ciclo y son ajustables. Las cargas se cuentan para todo el corte, sin multiplicarlas por su duración.

**Mascotas:** la referencia de Merck corresponde a agua total para mamíferos en ambiente termoneutro; los alimentos húmedos aportan parte. El peso inicial de 10 kg es ficticio y debe ajustarse por animal. El resultado nunca es un límite de agua potable ni una instrucción de restringir su acceso. La fuente en español se verificó mediante resultados indexados; la apertura directa devolvió una restricción HTTP durante la consulta.

**OMS:** [Domestic water quantity, service level and health, segunda edición, 2020](https://www.who.int/publications/i/item/9789240015241) aporta contexto sobre cantidad, acceso y salud. No se suman automáticamente sus referencias globales a las de Esfera.

**Limpieza y usos esenciales:** el cero solo se refiere a tareas aplazables. No elimina la limpieza sanitaria indispensable. El plan conserva bebida, alimentación, higiene básica y sanitario; la familia puede ajustar cantidades según sus necesidades. Un faltante no reduce automáticamente esos usos.

## Recibos y recordatorios

[EAAB · Conoce la factura](https://acueducto.com.co/wps/portal/EAB2/Home/mi-cuenta/facturacion/conozca_la_factura) respalda la distinción entre periodo facturado, consumo, emisión y vencimiento. La facturación es normalmente bimestral, aunque existen otros ciclos.

La interfaz ya no solicita emisión/recepción ni vencimiento. Muestra únicamente el recordatorio de revisar la fecha límite en la factura. No estima fechas de llegada ni genera alertas de pago. El estado «Pagado» es una anotación personal, no una confirmación de la EAAB.

Los datos antiguos de emisión/vencimiento se conservan solo por compatibilidad; no activan avisos. No hay notificaciones push, correos ni SMS.

## Consejos de conservación

Se conservan los consejos de [Portal Bogotá / EAAB](https://bogota.gov.co/mi-ciudad/habitat/recomendaciones-del-acueducto-de-bogota-para-ahorrar-agua-en-tu-hogar): evitar dejar correr agua sin usar, revisar fugas y aprovechar la capacidad de la lavadora. Son prácticas generales, no información sobre cortes actuales.

Canales: [EAAB](https://www.acueducto.com.co/) y [Alcaldía de Bogotá](https://bogota.gov.co/). Los consejos de organización familiar y apoyo al adulto mayor se identifican como orientaciones del prototipo, sin necesidades médicas inventadas.

## Qué no demuestra una simulación

El recibo describe un periodo histórico; el plan representa actividades de un corte hipotético. Su diferencia no acredita ahorro real. Tampoco lo hacen una meta, una reserva superior al plan o una variación entre periodos por sí solas. No se afirma que haya racionamiento vigente ni se asignan fechas ficticias a cortes reales.

Las fórmulas y los criterios de fechas están en [FORMULAS.md](FORMULAS.md). Los rangos de validación son límites técnicos; el margen de hábitos ±20 % y la meta inicial 10 % siguen siendo ejemplos pedagógicos.
