sequenceDiagram
    autonumber

    actor U as Usuario
    participant F as Frontend Angular
    participant B as Backend Django REST
    participant DB as MySQL

    U->>F: Selecciona una habitación
    F->>B: GET /api/v1/reservas/disponibilidad/
    Note over F,B: Se envía el ID de la habitación

    B->>DB: Consultar reservas de la habitación
    DB-->>B: Reservas y fechas registradas

    B->>B: Excluir reservas canceladas
    B->>B: Obtener fechas ocupadas

    B-->>F: Respuesta con fechas_ocupadas
    F-->>U: Mostrar calendario de disponibilidad

    U->>F: Selecciona fechas de entrada y salida

    alt Fechas disponibles
        F-->>U: Permitir continuar con la reserva
    else Fechas ocupadas
        F-->>U: Impedir selección y solicitar otras fechas
    end