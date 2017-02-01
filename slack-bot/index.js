var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	morgan 		= require('morgan'),
	app 		= express();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


require('./routes')(app);


app.listen(3000, function () {
  console.log('Chat de slack iniciado en el puerto 3000');
});