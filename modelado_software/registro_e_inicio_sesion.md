sequenceDiagram
    autonumber

    actor U as Usuario
    participant F as Frontend Angular
    participant B as Backend Django
    participant DB as MySQL

    U->>F: Ingresa sus credenciales
    F->>B: POST /api/v1/usuarios/login/
    B->>DB: Consultar usuario por credenciales
    DB-->>B: Resultado de la consulta

    alt Credenciales válidas
        B-->>F: Datos del usuario y rol
        F->>F: Guardar usuario en localStorage

        alt Administrador
            F-->>U: Redirigir al dashboard administrativo
        else Cliente
            F-->>U: Redirigir al panel de usuario
        end

    else Credenciales inválidas
        B-->>F: Error de autenticación
        F-->>U: Mostrar mensaje de error
    end
    