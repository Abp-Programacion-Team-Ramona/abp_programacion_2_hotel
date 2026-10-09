
erDiagram
    ROLES ||--o{ USUARIOS : asignado
    USUARIOS ||--o{ RESERVAS : realiza
    HABITACIONES ||--o{ RESERVAS : recibe
    RESERVAS ||--o| PAGOS : tiene
    RESERVAS }o--o{ ADICIONALES : incluye

    ROLES {
        uuid id
        string descripcion
    }

    USUARIOS {
        uuid id
        string nombre
        string apellido
        string email
        string password
        string num_contacto
    }

    HABITACIONES {
        uuid id
        int numero
        string tipo
        int capacidad
        decimal precio
    }

    RESERVAS {
        uuid id
        string observaciones
        string estado
        date desde
        date hasta
        int huespedes
    }

    ADICIONALES {
        uuid id
        string nombre
        decimal precio
    }

    PAGOS {
        uuid id
        string medio
        string estado
        decimal monto
    }
