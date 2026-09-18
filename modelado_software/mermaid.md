erDiagram
    CLIENTES ||--|| RESERVAS : realiza
    CABANAS ||--o{ RESERVAS : recibe
    RESERVAS ||--o| PAGOS : tiene
    ROLES ||--o{ EMPLEADOS : asignado

    CLIENTES {
        uuid id PK
        string num_contacto
        string email
        string nombre
        string apellido
        string observaciones
    }

    CABANAS {
        uuid id PK
        int capacidad
        int habitaciones
        boolean disponible
    }

    RESERVAS {
        uuid id PK
        uuid id_cliente FK
        uuid id_cabana FK
        uuid id_pago FK
        string observaciones
        string estado
        string adicionales
        date desde
        date hasta
    }

    PAGOS {
        uuid id PK
        uuid id_reserva FK
        string medio
        string estado
        string cupon
    }

    EMPLEADOS {
        uuid id PK
        uuid id_rol FK
        string nombre
        string apellido
    }

    ROLES {
        uuid id PK
        string descripcion
    }