erDiagram
    ROLES ||--o{ USUARIOS : asignado
    USUARIOS ||--o{ RESERVAS : realiza
    HABITACIONES ||--o{ RESERVAS : recibe
    RESERVAS ||--o| PAGOS : tiene

    USUARIOS {
        uuid id PK
        uuid id_rol FK
        string nombre
        string apellido
        string email
        string password
        string num_contacto
    }

    ROLES {
        uuid id PK
        string descripcion
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
        string adicionales
        date desde
        date hasta
        int huespedes
    }

    PAGOS {
        uuid id PK
        uuid id_reserva FK
        string medio
        string estado
        decimal monto
    }