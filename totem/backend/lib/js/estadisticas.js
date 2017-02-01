
/*
 * VARIABLES GLOBALES
 */

var inputs = {
	desde: $('#inputDesde'),
	hasta: $('#inputHasta')
};

var array_estadisticas;


/*
 * FUNCION DE CARGA
 */
var funcionDeCarga = function(seccion)
{
	var hoy 			= moment().format('YYYY-MM-DD'),
		semanaAnterior 	= moment().subtract(7, 'days').format('YYYY-MM-DD');
	
	inputs.desde.val(semanaAnterior);
	inputs.hasta.val(hoy);
}

var validarObtenerEstadisticas = function(){

	console.log(inputs.desde.val(), inputs.hasta.val());

	var e = 0;

	if (inputs.desde.val().trim().length < 3)
	{
		inputs.desde.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.desde.parent().removeClass('has-error has-feedback');

	if (inputs.hasta.val().trim().length < 3)
	{
		inputs.hasta.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.hasta.parent().removeClass('has-error has-feedback');

	// Validacion y envio de datos a la base para checkear.
	if (e == 0)
	{
		window.location = 'descargar_estadisticas.php?desde='+ inputs.desde.val() +'&hasta='+ inputs.hasta.val();
	}
};