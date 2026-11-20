# Coherencia con la arquitectura CDIO — V3

La actualización parte del código real de V2 y mantiene su arquitectura conceptual y la alternativa seleccionada: una aplicación de consumo y consejos para ayudar a hogares de Tunjuelito a planificar actividades y organizar reservas durante cortes simulados. No sustituye la solución por un sistema de sensores o gestión de tanques comunales.

| Componente original | Implementación V3 |
| --- | --- |
| Hogar | `estado.hogar`: integrantes, características y hábitos |
| Recibo | `estado.recibos`: m³, días, valor opcional, fechas y pago local |
| HabitoConsumo | Ducha, caudal, cocina habitual, rango ilustrativo y actividades |
| CalculadoraConsumo | `calculadora.js`: funciones puras, validación y migración |
| MetaAhorro | Porcentaje configurable; objetivo hipotético sobre el histórico |
| ReferenciaConsumo | `DatosDemo.referencias` y `DatosDemo.residencial`; catálogo inmutable separado de parámetros personalizados |
| GestorNotificaciones | Avisos simulados leídos/no leídos y recordatorio informativo de facturación dentro de la app |
| Fuentes institucionales | Enlaces EAAB, Alcaldía, OAB y referencias técnicas documentadas; sin integración automática |

Planificador y reserva doméstica continúan identificados como **complementos del diseño original**. Las estadísticas y los recordatorios amplían Recibo, CalculadoraConsumo y GestorNotificaciones. Se emplean objetos y funciones JavaScript sin imponer una implementación orientada a objetos estricta.

## Respuesta a la pregunta problema

- Desinformación: distinguir simulación, dato registrado y fuente institucional consultable.
- Incertidumbre: comparar reserva individual con actividades estimadas, sin prometer abastecimiento.
- Planificación: cuatro pasos y acción posterior para revisar tareas aplazables, conservando usos esenciales.
- Conservación: consejos según hábitos y organización familiar sin inventar cuotas médicas.
- Seguimiento: recibos, periodos, promedios ponderados y comparación residencial contextualizada.

La arquitectura no requiere cuentas, fotografías, OCR, bases de datos ni servicios de pago. Los datos no salen del navegador. El programa se organiza en `index.html`, `css/`, `js/`, `assets/`, `docs/` y `tests/`.

La V3 no recalcula ni modifica la matriz de selección o la infografía del semestre. Las referencias numéricas aprobadas para esta actualización, con sus limitaciones, se documentan en [FUENTES_Y_METODOLOGIA.md](FUENTES_Y_METODOLOGIA.md).


## Dos variantes de interacción

La clásica conserva cuatro pasos y navegación libre. La guiada añade `recorrido-guiado.js`: requiere elegir y confirmar familia, actividades/duración y reserva antes de permitir resultados personalizados. El avance se persiste junto al hogar, sin exigir recibos.

Ambas cargan el mismo `app.js`, estilos, datos y calculadora. `acceso-demo.js` y su CSS son independientes y removibles; no leen ni almacenan credenciales y no implementan autenticación. Cada variante usa una clave de almacenamiento propia. No se ha publicado ninguna.
