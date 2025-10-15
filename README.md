# Clínica SaludTotal - Proyecto de Gestión

Este proyecto contiene el backend (API) y el frontend (UI) para el sistema de gestión de citas de la Clínica SaludTotal.

## Requisitos Previos

- Docker
- Docker Compose
- Node.js v18 o superior (para desarrollo local si no se usa Docker)

## Configuración Inicial del Entorno (Docker)

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd clinica-saludtotal
    ```

2.  **Configurar variables de entorno:**
    Copia el archivo de ejemplo de la API y ajústalo si es necesario. Por defecto, funcionará con la configuración de Docker.

    ```bash
    cp api/.env.example api/.env
    ```

3.  **Levantar los servicios:**
    Este comando construirá las imágenes de Docker (si no existen) y levantará los contenedores de la base de datos, la API y la interfaz de usuario.

    ```bash
    docker-compose up --build -d
    ```

    - La API estará disponible en `http://localhost:3001`
    - La UI estará disponible en `http://localhost:5173`
    - La base de datos PostgreSQL estará expuesta en el puerto `5432`

## Comandos Útiles de Docker

A continuación se listan comandos para gestionar el ciclo de vida del entorno de desarrollo.

#### Iniciar y Detener Servicios

- **Iniciar todos los servicios en segundo plano:**

  ```bash
  docker-compose up -d
  ```

- **Detener todos los servicios:**
  ```bash
  docker-compose down
  ```

#### Gestión de la Base de Datos

- **Reiniciar la base de datos desde cero (elimina todos los datos):**
  Este comando detiene los contenedores y elimina los volúmenes, incluyendo el de la base de datos.

  ```bash
  docker-compose down -v
  ```

  Luego, para volver a levantar todo:

  ```bash
  docker-compose up --build -d
  ```

- **Poblar la base de datos con datos de prueba (sin borrarla):**
  Si la base de datos está vacía o quieres restaurar los datos iniciales, puedes ejecutar el script de inicialización.
  ```bash
  docker-compose exec api npm run db:reset
  ```

#### Visualización de Logs

- **Ver los logs de la API en tiempo real:**

  ```bash
  docker-compose logs -f api
  ```

- **Ver los logs de la UI en tiempo real:**
  ```bash
  docker-compose logs -f ui
  ```

#### Acceder a un Contenedor

- **Entrar a la terminal del contenedor de la API:**

  ```bash
  docker-compose exec api sh
  ```

- **Conectarse a la base de datos usando `psql`:**
  ```bash
  docker-compose exec db psql -U postgres -d clinica_db
  ```
