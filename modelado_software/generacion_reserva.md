sequenceDiagram
    autonumber

    actor U as Usuario registrado
    participant F as Frontend Angular
    participant B as Backend Django REST
    participant S as ReservaService
    participant DB as MySQL

    U->>F: Completa el formulario de reserva
    Note over U,F: Fechas, habitación, huéspedes y adicionales

    U->>F: Confirma la solicitud de reserva

    F->>F: Validar campos obligatorios y fechas

    alt Formulario inválido
        F-->>U: Mostrar errores de validación
    else Formulario válido
        F->>B: POST /api/v1/reservas/
        Note over F,B: Datos de la reserva e ID del usuario

        B->>B: Validar datos con ReservaSerializer

        alt Datos inválidos
            B-->>F: HTTP 400 - Errores de validación
            F-->>U: Mostrar mensaje de error
        else Datos válidos
            B->>S: crear_reserva(datos validados)
            S->>DB: INSERT reserva y asociar adicionales
            DB-->>S: Reserva almacenada
            S-->>B: Reserva creada

            B-->>F: HTTP 201 - Reserva creada
            F-->>U: Mostrar confirmación y código de reserva
        end
    end