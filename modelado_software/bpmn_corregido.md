flowchart LR
    subgraph U["Usuario registrado"]
        direction TB
        IN(("Inicio"))
        U1["Iniciar sesión"]
        U2["Seleccionar habitación"]
        U3["Ingresar fechas"]
        U4["Elegir nuevas fechas"]
        U5["Seleccionar adicionales"]
        U6["Enviar solicitud"]
    end

    subgraph S["Sistema hotelero"]
        direction TB
        S1["Consultar disponibilidad"]
        G1{"¿Disponible?"}
        S2["Informar indisponibilidad"]
        S3["Validar datos"]
        G2{"¿Datos válidos?"}
        S4["Mostrar errores"]
        S5["Registrar reserva pendiente"]
        S6["Generar código de reserva"]
        S7["Presentar reserva pendiente"]
        S8["Guardar confirmación"]
        S9["Guardar cancelación"]
        S10["Actualizar información de reserva"]
    end

    subgraph A["Administrador"]
        direction TB
        A1["Revisar reserva"]
        G3{"¿Confirmar?"}
        A2["Confirmar"]
        A3["Cancelar"]
    end

    END1(("Fin: Reserva confirmada"))
    END2(("Fin: Reserva cancelada"))

    IN --> U1 --> U2 --> U3
    U3 --> S1 --> G1

    G1 -->|"No"| S2 --> U4 --> U3
    G1 -->|"Sí"| U5 --> U6 --> S3 --> G2

    G2 -->|"No"| S4 --> U6
    G2 -->|"Sí"| S5 --> S6 --> S7 --> A1 --> G3

    G3 -->|"Sí"| A2 --> S8 --> S10 --> END1
    G3 -->|"No"| A3 --> S9 --> S10 --> END2