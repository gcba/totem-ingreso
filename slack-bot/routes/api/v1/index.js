var _bot = require('../../../controllers/bot');

module.exports = function(app) {

  var root = '/api/';

  require('./visitantes')(app, root + 'v1', _bot);

};