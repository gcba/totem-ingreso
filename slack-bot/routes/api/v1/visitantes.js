var _bot;

module.exports = function(app, uri, bot) {

	_bot = bot;

  	app.post(uri + '/visitante/new', newVisitor, sendResponse);
};

var newVisitor = function(req, res, next){

	if (req.body.slackName && req.body.visitorName)
	{
		var message = 'Hola '+ req.body.slackName +'! '+ req.body.visitorName + ' ingresó al edificio para verte.';

		req.response = {msg: message};

		var params = {
	    	icon_emoji: ':botavatar:'
		};

		_bot.postMessageToUser(req.body.slackName, message, params);
	}
	next();
};


var sendResponse = function(req, res){
    res.json(req.response || {});
};
