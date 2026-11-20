# Fórmulas de V3

Los cálculos conservan todos sus decimales. La interfaz muestra hasta dos decimales en litros y uno en porcentajes. Los intervalos de fechas incluyen inicio y fin; dos periodos que comparten un mismo día se consideran superpuestos.

## Recibos y estadísticas

| Resultado | Fórmula |
| --- | --- |
| Litros facturados | m³ × 1.000 |
| Diario de un periodo | litros / días |
| Histórico ponderado | suma de litros / suma de días |
| Por integrante | histórico / integrantes |
| Variación entre periodos | (diario reciente − diario anterior) / diario anterior × 100 |
| Referencia del hogar | 75,44 × integrantes |
| Diferencia L/día | histórico − referencia |
| Diferencia porcentual | diferencia / referencia × 100 |
| Meta orientativa | histórico × (1 − meta/100) |

La calculadora conserva la clasificación de similitud de ±1 %. La interfaz simplificada indica por encima o por debajo usando el signo de la diferencia, sin mostrar porcentajes. Si el periodo anterior es cero, un cambio a consumo positivo no tiene porcentaje definido; cero frente a cero devuelve 0 % internamente. Sin recibos no se calcula promedio ni meta; con uno no se inventa evolución.

Los periodos fechados se ordenan por inicio. Los no fechados se agrupan aparte en orden de registro/demostración y se indica ese orden. No hay variación entre un grupo y otro. Máximos, mínimos y variaciones siguen calculándose internamente, pero no recargan la pantalla de estadísticas.

## Plan familiar

Sea P el número de personas y d = horas/24. Las tasas son editables.

| Actividad | Fórmula | Valor inicial |
| --- | --- | --- |
| Beber | P × tasa × d | 3 L/persona/día |
| Cocina básica | P × tasa × d | 5 L/persona/día |
| Higiene básica | P × tasa × d | 6 L/persona/día |
| Sanitario | P × frecuencia × L/descarga × d | 3 descargas/persona/día × 4,8 L |
| Limpieza aplazable | L/hogar/día × d | 0 L |
| Ropa | cargas totales del corte × L/carga | 0 cargas; 53 eficiente / 76 convencional / manual |
| Mascotas | suma(peso kg × mL/kg/día) / 1.000 × d | 55 mL/kg/día; peso ficticio inicial 10 kg |

Total = suma de actividades seleccionadas. Balance = reserva − total. Una reserva de cero es válida; no se ajustan automáticamente las necesidades esenciales a la reserva. Ropa no se multiplica por d. Los usos esenciales permanecen seleccionados.

Ejemplo: cuatro personas, 24 horas, sin ropa: 12 + 20 + 24 + 57,6 + 0 = **113,6 L**. Con 120 L de reserva: **+6,4 L**. A 48 horas: **227,2 L**. Dos cargas eficientes añaden **106 L** a cualquiera de esas duraciones.

## Hábitos conservados

Ducha = minutos × caudal L/min × integrantes (supone una ducha por persona al día). Cocina habitual = L/hogar/día ingresados. Total parcial = ducha + cocina; rango ilustrativo opcional = total × 0,8 a total × 1,2. Ni el rango ni una reducción de la meta acreditan ahorro real. Este cálculo no se suma al recibo ni al plan.

## Recordatorios simplificados

La interfaz solo recuerda que la facturación es generalmente bimestral y pide consultar el vencimiento en la factura. No calcula próximas llegadas ni alertas de pago. Marcar como pagado actualiza un booleano local, sin comprobar pagos ante la EAAB.

La calculadora original se mantiene íntegra para conservar compatibilidad con V3. Sus funciones antiguas de fechas y recordatorios siguen cubiertas por pruebas de regresión, pero **la aplicación no invoca `CalculadoraConsumo.recordatorios`**. Los campos antiguos de emisión/vencimiento no se solicitan y no activan alertas.

## Límites de validación

Personas 1–30 enteras; duración 1–168 h; reserva 0–100.000 L; hasta 100 recibos; cada recibo 0–10.000 m³ y 1–366 días; valor opcional 0–100.000.000 COP. Cargas 0–100 enteras; hasta 10 mascotas. Las tasas esenciales y pesos deben ser positivos; limpieza puede ser cero. Son límites técnicos del formulario, no recomendaciones de consumo. Se rechazan vacíos obligatorios, no finitos, números negativos, fechas inexistentes/invertidas, superposiciones fechadas y duplicados identificables por emisión y datos.
