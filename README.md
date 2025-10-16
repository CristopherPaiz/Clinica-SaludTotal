# Clínica SaludTotal - Proyecto de Gestión de Citas

Este repositorio contiene el backend (API en Node.js/Express) y el frontend (UI en React/Vite) para el sistema de gestión de la Clínica SaludTotal. El proyecto está completamente dockerizado para una configuración de desarrollo rápida y consistente.

## Requisitos Previos

- Git
- Docker
- Docker Compose

## Puesta en Marcha (Quick Start)

Sigue estos pasos para levantar todo el entorno de desarrollo. El proceso está diseñado para ser lo más simple posible: clonar, configurar y ejecutar.

**1. Clonar el Repositorio**

```bash
git clone <URL_DEL_REPOSITORIO>
cd clinica-saludtotal
```

**2. Configurar Variables de Entorno**
La API necesita un archivo `.env` para funcionar. Simplemente copia la plantilla de ejemplo. Los valores por defecto están preconfigurados para funcionar con Docker.

```bash
cp api/.env.example api/.env
```

**3. Levantar los Servicios con Docker Compose**
Este único comando construirá las imágenes de Docker, creará los contenedores, establecerá la red entre ellos y los iniciará.

```bash
docker-compose up --build
```

- `--build`: Es importante para la primera vez, ya que construye las imágenes desde los `Dockerfile`.
- `-d`: Ejecuta los contenedores en segundo plano (detached mode).

**¡Listo! El entorno ya está funcionando.**

- **API Backend:** Disponible en `http://localhost:3001`
- **UI Frontend:** Disponible en `http://localhost:5173`

> **Nota sobre la Base de Datos:** En el primer arranque, la API detectará que la base de datos está vacía, creará todas las tablas y la poblará automáticamente con un conjunto completo de datos de prueba (administradores, médicos con sus horarios, pacientes y citas futuras). Puedes ver este proceso en los logs de la API.

---

## Gestión del Entorno de Desarrollo

Estos comandos te ayudarán a gestionar el ciclo de vida de tu entorno Docker.

#### Iniciar y Detener Servicios

- **Iniciar todos los servicios en segundo plano:**

  ```bash
  docker-compose up -d
  ```

- **Detener todos los servicios:**
  ```bash
  docker-compose down
  ```

#### Reiniciar el Entorno Desde Cero (Borrar Todo)

Si necesitas una pizarra limpia, este comando es tu mejor aliado. Detendrá los contenedores y **eliminará los volúmenes de datos (incluida la base de datos)**.

```bash
docker-compose down -v
```

Después de ejecutarlo, simplemente vuelve a levantar todo con `docker-compose up --build -d` para tener un entorno fresco y con los datos de prueba iniciales.

#### Ver Logs en Tiempo Real

Esencial para depurar. Abre una terminal separada para cada servicio que quieras monitorear.

- **Logs de la API:**

  ```bash
  docker-compose logs -f api
  ```

- **Logs de la UI:**
  ```bash
  docker-compose logs -f ui
  ```

#### Ejecutar Comandos Dentro de un Contenedor

- **Acceder a la terminal de la API:**

  ```bash
  docker-compose exec api sh
  ```

  _Desde aquí puedes ejecutar comandos de `npm`, como `npm run db:reset` si quisieras repoblar la base de datos manualmente._

- **Conectarse a la base de datos con `psql`:**
  ```bash
  docker-compose exec db psql -U postgres -d clinica_db
  ```

---

## Flujo de Pruebas con Postman

1.  **Importa la Colección:** Abre Postman e importa el archivo `Clinica.postman_collection.json` que se encuentra en el repositorio.
2.  **Verifica la Variable `baseUrl`:** La colección ya incluye una variable `baseUrl` preconfigurada a `http://localhost:3001/api`. No necesitas cambiarla si usas la configuración por defecto.
3.  **Prueba el Flujo:**
    - Ve a la carpeta `Auth (Autenticación)` y ejecuta una de las peticiones de `Login` (ej. `POST Login Admin`). El script de la petición guardará el token JWT automáticamente.
    - Ahora puedes ejecutar cualquier petición de las carpetas protegidas (ej. `Flujo Admin`) y la autenticación funcionará sin que tengas que hacer nada más.
