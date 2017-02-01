var Bot = require('slackbots');

var settings = {
    token: 'TOKEN_DE_SLACK',
    name: 'Totem ingreso' // Nombre para mostrar en el usuario
};

var bot = new Bot(settings);

module.exports = bot;