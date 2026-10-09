
erDiagram
    ROLES ||--o{ USUARIOS : tiene
    USUARIOS ||--o{ RESERVAS : realiza
    HABITACIONES ||--o{ RESERVAS : recibe
    RESERVAS ||--o| PAGOS : tiene
    RESERVAS ||--o{ RESERVAS_ADICIONALES : contiene
    ADICIONALES ||--o{ RESERVAS_ADICIONALES : pertenece

    ROLES {
        uuid id PK
        string descripcion
    }

    USUARIOS {
        uuid id PK
        uuid id_rol FK
        string nombre
        string apellido
        string email
        string password
        string num_contacto
    }

    HABITACIONES {
        uuid id PK
        int numero
        string tipo
        int capacidad
        decimal precio
    }

    RESERVAS {
        uuid id PK
        uuid id_usuario FK
        uuid id_habitacion FK
        string observaciones
        string estado
        date desde
        date hasta
        int huespedes
    }

    ADICIONALES {
        uuid id PK
        string nombre
        decimal precio
    }

    RESERVAS_ADICIONALES {
        uuid id_reserva PK, FK
        uuid id_adicional PK, FK
    }

    PAGOS {
        uuid id PK
        uuid id_reserva FK
        string medio
        string estado
        decimal monto
    }
