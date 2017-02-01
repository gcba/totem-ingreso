# Integración con slack

La integracion esta hecha en node utilizando la libreria slackbots

### Creacion del bot:
- Ir a https://slack.com/apps/manage/custom-integrations, clickear Bots y generar un nuevo bot.  
- Configurar un nombre de usuario para el bot
- Guardar la API Token  
- Configurar el nombre y la imagen de perfil a gusto (opcional)

### Uso:

- **Instalar las dependencias:** npm install
- **Iniciar el bot:** npm start o node index.js
- **Para utilizarlo**: Hacer un post a http://localhost:3000/api/v1/visitante/new con las variables "slackName" (nombre de usuario de slack), "visitorName" (Nombre propio de la persona que ingresa).


### Configuraciones:

En controllers/bot.js configurar la API KEY

```javascript
var settings = {
    token: 'TOKEN_DE_SLACK', // Reemplazar por el token generado
    name: 'Totem ingreso' // Nombre para mostrar en el usuario
};
```

En routes/api/v1/visitantes.js se puede cambiar el mensaje que envia cuando alguien ingresa:

```javascript
// req.body.slackName (Usuario de slack)
// req.body.visitorName (Nombre de la persona que ingresa al edificio)
var message = 'Hola '+ req.body.slackName +'! '+ req.body.visitorName + ' ingresó al edificio para verte.';
```

Tambien se puede configurar el emoji que utiliza el bot como imagen de perfil:

```javascript
var params = {
	icon_emoji: ':botavatar:'
};
```