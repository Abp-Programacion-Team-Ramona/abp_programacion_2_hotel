sequenceDiagram
    autonumber

    actor U as Usuario
    participant F as Frontend Angular
    participant B as Backend Django REST
    participant DB as MySQL

    U->>F: Accede a la gestión de reservas

    alt Administrador
        F->>B: GET /api/v1/reservas/
    else Cliente
        F->>B: GET /api/v1/reservas/?id_usuario=UUID
    end

    B->>DB: Consultar reservas
    DB-->>B: Reservas registradas
    B-->>F: HTTP 200 - Listado de reservas
    F-->>U: Mostrar reservas y estados

    alt Confirmar reserva (administrador)
        U->>F: Selecciona Confirmar
        F-->>U: Solicitar confirmación
        U->>F: Acepta operación
        F->>B: PATCH /api/v1/reservas/{id}/
        Note over F,B: estado = confirmada

    else Cancelar reserva (administrador o cliente)
        U->>F: Selecciona Cancelar
        F-->>U: Solicitar confirmación
        U->>F: Acepta operación
        F->>B: PATCH /api/v1/reservas/{id}/
        Note over F,B: estado = cancelada
    end

    B->>DB: Buscar reserva por ID
    DB-->>B: Reserva encontrada

    alt Cambio de estado permitido
        B->>DB: Actualizar estado de la reserva
        DB-->>B: Actualización realizada
        B-->>F: HTTP 200 - Reserva actualizada
        F->>F: Actualizar estado local
        F-->>U: Mostrar nuevo estado de la reserva

    else Cambio de estado no permitido
        B-->>F: HTTP 400 - Error de validación
        F-->>U: Mostrar mensaje de error
    end