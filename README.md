# ♻️ Recocycle — Plataforma de Reciclaje Inteligente

> 🌱 *Una plataforma desarrollada en Laravel + React + Inertia + Docker + PostgreSQL para conectar usuarios, recolectores y administradores en un ecosistema de reciclaje digital.*

---

## 🧭 Descripción general

**Recocycle** es un proyecto web desarrollado por **Santiago Abasto Ortega (AppleBoss)** con el objetivo de crear una red ecológica moderna donde los ciudadanos puedan **registrar reciclajes**, los **recolectores** puedan **gestionar recolecciones**, y los **administradores** supervisen toda la actividad mediante **paneles visuales e informes**.

Incluye autenticación por roles (`Administrador`, `Recolector`, `Usuario`), paneles personalizados, ranking de usuarios, módulos de premios, calificaciones y más.

---

## 🧱 Tecnologías utilizadas

| Capa | Tecnología | Descripción |
|------|-------------|-------------|
| 🧩 Backend | **Laravel 12** | Framework PHP moderno con Artisan, migraciones y Eloquent ORM |
| ⚛️ Frontend | **React 18 + Inertia.js** | SPA con integración directa de Laravel + React |
| 🐘 Base de datos | **PostgreSQL 15** | Base de datos relacional robusta y eficiente |
| 🐳 Contenedores | **Docker + Docker Compose** | Aislamiento total del entorno de desarrollo |
| 🎨 Estilos | **TailwindCSS + Bootstrap 5** | Diseño moderno y adaptable |
| 🧰 Control de versiones | **Git + GitHub** | Versionado colaborativo del proyecto |
| ⚙️ Servidor web | **Nginx** | Proxy inverso y balanceador dentro del contenedor |
| 🧑‍💻 ORM / Query Builder | **Eloquent** | Gestión de modelos y relaciones |
| 🧠 Autenticación | **Laravel Breeze (con Inertia)** | Sistema de login, registro y recuperación de contraseña |
| 🔐 Seguridad | **Middleware + Roles** | Control de acceso a rutas basado en roles |
| 📦 Empaquetador | **Vite** | Compilación moderna para React/Tailwind |
| 🧾 PDF / Reportes | **DomPDF + Blade Templates** | Generación de reportes con estilo profesional |

---

## 🧬 Arquitectura general

El sistema está totalmente **contenedorizado con Docker** y organizado en servicios separados:

📦 recocycle/
├── app/              # Código backend (Laravel)
├── resources/js/     # Frontend React (Inertia)
├── database/         # Migraciones y seeders
├── public/           # Archivos públicos (logo, CSS, imágenes)
├── docker-compose.yml
├── Dockerfile
├── .env
└── README.md

---

## 🚀 Instalación paso a paso (desde cero)

> ⚙️ Ideal para una nueva máquina o entorno limpio.

### 1️⃣ Clonar el proyecto
git clone https://github.com/tu_usuario/recocycle.git
cd recocycle

### 2️⃣ Crear el archivo `.env`
cp .env.example .env

Configurá tus variables:
APP_NAME=Recocycle
APP_URL=http://localhost:8080
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=recocycle
DB_USERNAME=postgres
DB_PASSWORD=postgres

### 3️⃣ Levantar contenedores
docker compose up -d --build

### 4️⃣ Generar la clave de aplicación
docker compose exec php bash
php artisan key:generate

### 5️⃣ Migrar base de datos y seeders
php artisan migrate --seed

### 6️⃣ Compilar frontend
npm install
npm run dev

### 7️⃣ Abrir en navegador
👉 http://localhost:8080

---

## 🧰 Comandos útiles

| Acción | Comando |
|--------|----------|
| 🔑 Generar clave | php artisan key:generate |
| 🧱 Migrar BD | php artisan migrate --seed |
| 🧹 Limpiar caché | php artisan optimize:clear |
| 🐳 Detener contenedores | docker compose down |
| 🚀 Reiniciar contenedores | docker compose restart |
| 🧩 Ver logs Laravel | docker compose logs -f php |
| 🔁 Reiniciar BD | docker compose down -v && docker compose up -d --build |
| ⚙️ Ejecutar Artisan | docker compose exec php bash -lc "php artisan comando" |

---

## 🧪 Roles y módulos del sistema

| Rol | Funcionalidades principales |
|-----|------------------------------|
| 👑 **Administrador** | Gestiona usuarios, recolectores, categorías, premios, estadísticas |
| 🚛 **Recolector** | Ve las solicitudes asignadas, marca recolecciones completadas |
| 🧍‍♂️ **Usuario** | Registra reciclajes, consulta su historial, participa en el ranking |

---

## 🧭 Módulos implementados

- ♻️ **Reciclajes:** creación, asignación y seguimiento.  
- 🏆 **Ranking y premios:** puntuación según materiales reciclados.  
- 💬 **Calificaciones:** los usuarios pueden evaluar la experiencia con los recolectores.  
- 🧭 **Dashboard general:** métricas globales para el administrador.  
- 📅 **Gestión de horarios:** usuarios definen disponibilidad para recolección.  
- 📍 **Geolocalización:** almacenamiento de latitud y longitud de las recolecciones.

---

## 🧠 Problemas enfrentados y soluciones

| Problema | Causa | Solución aplicada |
|-----------|--------|------------------|
| ❌ Error “Page not found: ./Pages/Admin/Premios/Index.jsx” | Rutas de Inertia mal definidas | Se corrigió el `route().name` y estructura `/Pages/Admin/Premios` |
| ⚠️ Logo distorsionado en login | CSS con proporciones fijas | Se ajustó con `object-fit: contain;` y tamaño responsivo |
| 🐳 Docker no levantaba correctamente | `version:` obsoleto en `docker-compose.yml` | Eliminado atributo obsoleto y corregido mapeo de puertos |
| 🔑 `APP_KEY` vacío | Falta de generación inicial | Ejecutado `php artisan key:generate` dentro del contenedor |
| 📦 Error de cache en Artisan | Permisos de storage y bootstrap | Se ajustaron permisos en Dockerfile con `chmod -R 775` |
| 🧩 Error Ziggy “route not found” | Configuración Vite desincronizada | Reconstrucción con `npm run dev` y cache limpia |
| 🐘 Conexión PostgreSQL rechazada | Host incorrecto (`localhost` en lugar de `db`) | Corregido en `.env` y docker network interna |
| 💥 Error al ejecutar `npm run dev` | Versión Node antigua | Actualizado a Node 18+ y reinstalado dependencias |

---

## 📊 Estado actual del proyecto

✅ Autenticación por roles  
✅ CRUD de reciclajes  
✅ Panel de administrador con métricas  
✅ Ranking de usuarios  
✅ Sistema de premios  
✅ Migraciones y seeders automáticos  
✅ Integración completa Laravel + React + Inertia  
✅ Docker funcional para clonar y levantar sin pasos manuales  

---

## 🧑‍💻 Desarrollador principal

**👨‍💻 Santiago Alfredo Abasto Ortega**  
📍 Cochabamba, Bolivia  
📧 [apple.boss2011@gmail.com](mailto:apple.boss2011@gmail.com)  
💼 CEO de **AppleBoss** / Creador de **Recocycle**  
🎓 Ing. de Sistemas – UCATEC  
🎓 Máster en Ciberseguridad – OBS Business School  

---

## 🧩 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
Podés modificarlo, redistribuirlo y mejorarlo libremente, manteniendo los créditos originales.

---

## 🌟 Créditos adicionales

- **Bootstrap & TailwindCSS** por la estética moderna.  
- **Inertia.js** por el puente mágico entre Laravel y React.  
- **Docker** por la portabilidad total del entorno.  
- **PostgreSQL** por la estabilidad de datos.  
- **GitHub** por el control de versiones del proyecto.  

---

## 📦 Recomendación final

Si clonas el proyecto en otra máquina:

git clone https://github.com/tu_usuario/recocycle.git
cd recocycle
cp .env.example .env
docker compose up -d --build
docker compose exec php bash -lc "php artisan migrate:fresh --seed"
npm install
npm run dev

Y listo. 🚀  
Tu entorno Recocycle estará funcionando igual que el original.
