# Totem de Ingreso

El sistema se desarrolló para tener un mayor registro y control de las personas que no trabajen en el edificio y accedan al mismo.

El sistema se encarga de:

- Registrar al visitante en caso de ser su primer visita
- Identificar a los visitantes recurrentes
- Registrar el ingreso del visitante al edificio
- Emitir ticket que funcione como comprobante
- Notificar por Slack o Mail que una persona ingresó al edificio.

### TECNOLOGIAS UTILIZADAS

- Front: HTML5, BAstrap7, JavaScript.
- Backend: PHP, NodeJS (Integración con slack y notificaciones en tiempo real)
- Kiosk Mode: Mozilla, Electron.

### REQUISITOS

Un servidor con:
* Apache (http://www.apache.org/dyn/closer.cgi)
* MySQL (https://www.mysql.com/downloads/)
* PHP (http://www.php.net/downloads)
* NodeJS (https://nodejs.org/es/)

Dirección General de Gestión Digital