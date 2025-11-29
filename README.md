    Plantilla Manual Técnico.

1.	Estudiante:		Johnny Suarez Abasto

2.	Introducción:
Recocycle es una plataforma web que conecta a usuarios que desean reciclar con recolectores y empresas aliadas. El sistema permite registrar puntos de recolección, visualizar un mapa interactivo, gestionar reciclajes y generar reportes y rankings de desempeño.
El proyecto se desarrolló como trabajo académico de la materia de Sistemas I, aplicando buenas prácticas de ingeniería de software, uso de control de versiones (Git/GitHub) y despliegue mediante contenedores Docker.

3.	Descripción / objetivo del proyecto:
El objetivo principal de Recocycle es facilitar y gamificar el reciclaje en la ciudad, ofreciendo:
•	Un panel administrativo para gestionar usuarios, recolectores, empresas y reportes.
•	Un módulo de recolectores para registrar reciclajes, consultar su ranking y estadísticas.
•	Un módulo de usuarios para visualizar puntos de recolección, su historial y reputación.
•	Herramientas para monitorizar el impacto ecológico, como reportes de material reciclado por período.
Objetivos específicos:
-	Centralizar en una sola plataforma la información de puntos de recolección.
-	Ofrecer un ranking de recolectores y usuarios para incentivar la participación.
-	Generar reportes PDF con métricas de actividad (recolectores, usuarios, reciclajes).
-	Aplicar patrones de arquitectura y herramientas modernas (Laravel, React, Docker, PostgreSQL).

4.	Link al Video ilustrativo en YouTube (de 2 a 5 minutos máximo)

https://youtu.be/Rl8zV76looQ

5.	Listado de los Requisitos Funcionales del Sistema
RF-01 – Gestión de autenticación
•	El sistema debe permitir el registro e inicio de sesión de usuarios, recolectores y administradores.
•	Autenticación basada en email y contraseña.
RF-02 – Gestión de usuarios
•	CRUD de usuarios desde el panel de administrador.
•	Asociación de roles (admin, recolector, usuario).
RF-03 – Gestión de recolectores
•	Registro y edición de datos de recolectores.
•	Visualización de su puntaje total y rating promedio.
RF-04 – Gestión de empresas / puntos de recolección
•	CRUD de empresas aliadas.
•	CRUD de puntos de recolección (ubicación, tipo de material, horarios).
RF-05 – Módulo de reciclajes
•	Registro de reciclajes por recolector (tipo de material, cantidad, fecha).
•	Asociación de reciclaje con usuario y punto de recolección.
RF-06 – Ranking
•	Visualizar ranking de recolectores y usuarios basado en puntaje y rating.
•	Exportar ranking a PDF (recolectores y usuarios).
RF-07 – Reportes y exportación
•	Generar reportes PDF de recolectores, usuarios y reciclajes en rangos de fecha.
•	Mostrar estadísticas generales (totales, activos, pendientes, etc.).
RF-08 – Mapa interactivo
•	Visualizar puntos de recolección en un mapa (Leaflet).
•	Diferenciar tipos de marcadores (recolector, punto de recolección, etc.).
RF-09 – Panel administrativo
•	Dashboard con métricas clave: cantidad de usuarios, recolectores activos, material reciclado, reportes pendientes.



6.	Arquitectura del software:
 
![Arquitectura](./docs/img/Imagen5.png)

7.	Base de datos
![BDD](./docs/img/Imagen7.png)

 
Rol	Email	Contraseña	Descripción
Admin	
suarezabastojohnny60@gmail.com
Fervorace9496939@
	Acceso completo a panel, reportes, rankings, etc.
Recolector	empresadefensa@gmail.com
Julian0423@	

Puede ver mapa, 
puntos de recolección y 
su perfil.

Usuario	johnnysuarezabasto@gmail.com
Fervorace9496939@#	Puede registrar reciclajes, ver su ranking.
Listado de Roles más sus credenciales de todos los Admin / Users del sistema

Requisitos del sistema:
9.1. Requerimientos de Hardware (mínimo – cliente)
•	CPU: Dual core.
•	RAM: 4 GB.
•	Navegador moderno (Chrome, Edge, Firefox).
•	Conexión a Internet estable.
9.2. Requerimientos de Software (cliente)
•	Navegador con soporte ES6 y CSS3.
•	Habilitación de JavaScript.
•	Resolución mínima recomendada: 1366x768.
9.3. Requerimientos de Hardware (server / hosting / BD)
•	CPU: 2 vCPU.
•	RAM: 2–4 GB.
•	Espacio en disco: 20 GB (según cantidad de datos).
•	Conectividad a Internet y puertos HTTP/HTTPS abiertos.
9.4. Requerimientos de Software (server / hosting / BD)
•	Sistema operativo Linux (Ubuntu recomendado).
•	Docker + Docker Compose (para la versión dockerizada).
•	PHP 8.3, Composer (si se despliega sin Docker).
•	Node.js 18+ (para compilar frontend si no se usa contenedor).
•	PostgreSQL 14+ (local o gestionado en la nube).

8.	Instalación y configuración (Actualizado con Hosting en la nube)
La instalación del sistema puede hacerse de forma local mediante Docker o directamente en la nube.
Actualmente, el proyecto Recocycle está desplegado completamente en la nube, incluyendo:
El sitio web
La API
La base de datos
El entorno Dockerizado completo
Los recursos estáticos (imágenes, fotos de reciclajes)
Enlace oficial del sistema (Hosting en la nube)
https://recocycle-web.onrender.com/

 Repositorio GitHub
https://github.com/Johnny20060902/Recocycle

9.	 PROCEDIMIENTO DE HOSTEADO / HOSTING (ACTUALIZADO)
A diferencia de la versión inicial, donde solo se pedía subir la base de datos, ahora el hosting incluye toda la aplicación completa:
Backend Laravel
Frontend React + Inertia
Servidor Nginx
Contenedores Docker
Base de datos PostgreSQL
Storage de imágenes
APIs internas
Mapas y archivos estáticos
📌 Servicios desplegados en la nube

Componente	Estado	Descripción
Sitio Web	✔ Operativo	Recocycle UI + Inertia
Backend API	✔ Operativo	Laravel 12 + autenticación + ranking + mapa
Base de datos	✔ Subida	PostgreSQL con migraciones + seeds
Archivos e imágenes	✔ Activo	Fotos de reciclaje, logos, perfiles
Docker Compose	✔ Usado	Orquesta todos los servicios
Servidor	✔ Activo	Linux con Docker + Nginx + PHP-FPM

10.	 Hosting de la aplicación
La aplicación completa fue desplegada siguiendo estos pasos:
1. Subida del código a GitHub
Repositorio:  
👉 https://github.com/Johnny20060902/Recocycle
2. Conexión del hosting con GitHub
El servidor clona automáticamente la última versión estable desde main.
3. Ejecución de la infraestructura Docker

En el servidor:

docker compose up -d



Servicios levantados:
app → Laravel + PHP-FPM
nginx → Servidor web
node → Compilación de React/Vite
db → PostgreSQL

4. Migraciones y datos iniciales

docker compose exec app php artisan migrate –seed

5. Compilación del frontend
docker compose exec node npm install
docker compose exec node npm run build

6. Configuración del dominio

Se configuró el dominio:

https://recocycle-web.onrender.com/

11.	🗄️ Base de datos en la nube
La base de datos está en la nube:
Servicio	Estado
PostgreSQL	✔ Operativa
Acceso remoto	✔ Habilitado
Backups automáticos	✔ Configurados

🔌 Accesos del sistema
Rol	Email	Contraseña	Entorno
Admin	admin@recocycle.com	Admin123*	Producción/Nube
Recolector	recolector@recocycle.io	Reco123*	Producción/Nube
Usuario	usuario@recocycle.io	User123*	Producción/Nube

12.	📤 12. Git
La rama principal (main) contiene la versión final que está actualmente desplegada en la nube:

 Repositorio:

https://github.com/Johnny20060902/Recocycle


Incluye en hosting:
Código Laravel (backend)
Código React (frontend)
PDF templates
Migraciones
Configuración Docker
Seeders

13.	🐳 13. Dockerizado (actualizado con hosting)
El servidor en la nube ejecuta exactamente el mismo docker-compose.yml que se usa en local:
Servicios:
app: Laravel + PHP-FPM
nginx: Servidor web
node: Compilación Vite
db: PostgreSQL
storage: Para archivos subidos

      Para reiniciar la app en la nube:

docker compose down
docker compose up -d –build

14.	Personalización y configuración: 
Las principales opciones de configuración se realizan a través del archivo .env:

Nombre y URL de la app
APP_NAME="Recocycle"
APP_URL=http://localhost:8080
Conexión a la base de datos (local o remota – ver punto 11):
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=recocycle
DB_USERNAME=recocycle
DB_PASSWORD=recocycle
Coordenadas por defecto para el mapa (ejemplo):
MAP_DEFAULT_LAT=-17.3895
MAP_DEFAULT_LNG=-66.1568
MAP_DEFAULT_ZOOM=12

Estos parámetros se pueden exponer como configuración en controladores o helpers para personalizar:
Ciudad por defecto.
Rangos de puntaje / cálculo de ranking.
Textos visibles en la interfaz (títulos, slogans, etc.).

15.	Seguridad: 
Principales consideraciones aplicadas:
•	Gestión de usuarios:
o	Contraseñas almacenadas con hash seguro (bcrypt, por defecto en Laravel).
o	Middleware de autenticación (auth) para proteger rutas internas.
•	Roles y autorizaciones:
o	Middleware role:admin para restringir el panel administrativo.
o	Solo administradores pueden acceder a reportes completos y acciones masivas de ranking.
•	Protecciones estándar de Laravel:
o	Tokens CSRF en formularios.
o	Validación de inputs en controladores / Form Requests.
•	Buenas prácticas:
o	El archivo .env nunca se sube a Git.
o	Uso de usuario de base de datos con permisos limitados (sin SUPERUSER).
o	Recomendación de usar HTTPS en producción.

16.	Depuración y solución de problemas:
Problemas comunes y cómo resolverlos:
1.	La página no carga / error 500
o	Revisar logs de Laravel:
o	docker compose exec app tail -f storage/logs/laravel.log
o	Verificar que se ejecutaron migraciones.
2.	Error de conexión a la base de datos
o	Revisar variables DB_* en .env.
o	Verificar que el contenedor db esté levantado:
o	docker compose ps
3.	Assets (JS/CSS) no se cargan correctamente
o	Asegurarse de haber corrido:
o	docker compose exec node npm install
o	docker compose exec node npm run dev
4.	DomPDF no muestra imágenes o estilos
o	Verificar que las rutas de imágenes usen public_path() o asset() correctamente.
o	Asegurarse de que el archivo exista en public/images/....
5.	Problemas de permisos en Linux
o	Ajustar permisos de storage y bootstrap/cache:
docker compose exec app chmod -R 775 storage bootstrap/cache.

17.	Glosario de términos:
•  Recolector: Usuario encargado de recoger material reciclable en puntos específicos.
•  Usuario: Persona que registra sus reciclajes y puede ver su historial y ranking.
•  Punto de recolección: Ubicación física registrada en el sistema donde se puede dejar material reciclable.
•  Ranking: Lista ordenada de recolectores/usuarios según su puntaje y rating.
•  Docker: Plataforma para crear y ejecutar contenedores de aplicaciones.
•  Docker Compose: Herramienta para definir y levantar múltiples contenedores como un solo servicio.
•  Inertia.js: Librería que conecta Laravel (backend) con React (frontend) sin crear una API tradicional.
•  DomPDF: Librería PHP utilizada para generar archivos PDF a partir de vistas Blade.
•  PostgreSQL: Sistema de gestión de bases de datos relacional utilizado en el proyecto.


18.	Referencias y recursos adicionales
a.	Documentación oficial de Laravel: https://laravel.com/docs
b.	Documentación de React: https://react.dev
c.	Documentación de Inertia.js: https://inertiajs.com
d.	Documentación de Docker: https://docs.docker.com
e.	Documentación de PostgreSQL: https://www.postgresql.org/docs/
f.	Barryvdh DomPDF (Laravel): https://github.com/barryvdh/laravel-dompdf
g.	Leaflet (mapas interactivos): https://leafletjs.com
19.	Herramientas de Implementación:
a.	Lenguajes de programación:
i.	PHP 8.3
ii.	JavaScript (ES6+)
iii.	SQL (PostgreSQL)
b.	Frameworks principales:
i.	Laravel (backend, MVC, migraciones, seeds, DomPDF).
ii.	React + Inertia.js (frontend SPA-like).
iii.	Bootstrap / Tailwind + animate.css (estilos y animaciones).
c.	APIs / servicios de terceros:
i.	Leaflet + proveedores de tiles (OpenStreetMap) para mapas.




