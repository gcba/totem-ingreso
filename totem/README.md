# Totem kiosk

Core del totem, es el que tiene el front kiosk y el backend con el AMB basico de empleados y descarga de estadisticas.


### Instalación:

- Poner esta carpeta dentro de un servidor Apache con php5
- Crear la base de datos en mysql con el nombre totem_ingreso
- Importar el dump que se encuentra en _db/totem_ingreso.sql, eso va a crear la estructura de la base
- Copiar y renombrar a config.php el default.config.php que se encuentra dentro de la carpeta php.
- Ahí completar la configuración de la Base de Datos, SMTP (envio de mails), y la url del slackbot si se usa la integracion.


### Backend

De la url base donde este el totem es "/backend" las credenciales para acceder son:

User: backendtotem
Pass: asd123asd

Para esta primera versión el login es básico, no contempla roles y la password esta hardcodeada como **md5** en el archivo "backend/login.php".
