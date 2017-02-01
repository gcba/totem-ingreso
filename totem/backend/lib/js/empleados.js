
/*
 * VARIABLES GLOBALES
 */

var urls = {
	php: {
		fw: '../php/functions.php'
	}
};

var tableEmpleadosInit = false;
var array_empleados;


/*
 * FUNCION DE CARGA
 */
var funcionDeCarga = function(seccion)
{
	switch(seccion)
	{
		case "empleados":
			cargarEmpleados();
		break;
	}
}


/*
 * OBTENER EMPLEADOS Y ARMAR LA TABLA
 */
var cargarEmpleados = function(){
	pedidoMySQL('h=obtenerEmpleados');
};


var armarTablaEmpleados = function(targetId){

	if (!tableEmpleadosInit)
	{
		$('#'+targetId).DataTable( {
	        data: array_empleados,
	        lengthChange: false,
	        bInfo: false,
	        "oLanguage": {
				"sSearch": "Buscar: "
			},
			fnCreatedRow: function( nRow, aData, iDataIndex ) {
		        $(nRow).attr('data-id', aData.id_empleado);

		        $(nRow).on('click', function() {
					abrirModalEditarEmpleado(aData);
				});
		    },
	        sDom: '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-left"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
	        sPaginationType: "simple_numbers",
	        pageLength: 30,
	        columns: [
	            { title: "Nombre y Apellido", data: "nombre_apellido" },
	            { title: "Interno", data: "interno" },
	            { title: "Direccion General", data: "direccion_general" },
	            { title: "Subsecretaria", data: "subsecretaria" },
							{ title: "Slack", data: "slack" },
	            { title: "Email", data: "mail" },
	        ]
	    } );

	    tableEmpleadosInit = true;
	}
	else
	{
		var datatable = $('#'+targetId).dataTable().api();
			datatable.clear();
	    	datatable.rows.add(array_empleados);
	    	datatable.draw();
	}
};

var abrirModalEliminar = function(){
	$('#nombreEmpleadoEliminar').text($('#modalNombreApellido').val());
	$('#myModal').modal('hide');
	$('#eliminarEmpleado').modal('show');
};

var cancelarModalEliminar = function(){
	$('#eliminarEmpleado').modal('hide');
	$('#myModal').modal('show');
};

var eliminarEmpleado = function(){

	var postData =  'h=borrarEmpleado';
			postData += '&id_empleado='+$('#modalIdEmpleado').val().trim();

	pedidoMySQL(postData);

	$('#eliminarEmpleado').modal('hide');
};



/*
 * EDITAR EMPLEADO
 */
var abrirModalEditarEmpleado = function(data){

	// Limpio por si queda alguna clase colgada
	$('.has-error.has-feedback').removeClass('has-error has-feedback');

	// Oculto el mensaje de error
	$('#mensajeError').hide();

	// Lo lleno con los datos del empleado
	$('#modalIdEmpleado').val(data.id_empleado);
	$('#modalNombreApellido').val(data.nombre_apellido);
	$('#modalInterno').val(data.interno);
	$('#modalDireccionGeneral').val(data.direccion_general);
	$('#modalSubsecretaria').val(data.subsecretaria);
	$('#modalSlack').val(data.slack);
	$('#modalMail').val(data.mail);

	// Muestro el modal
	$('#myModal').modal('show');
};

var cerrarModalEditarEmpleado= function(){
	$('#myModal').modal('hide');
};

var validarModalEditarEmpleado = function(){
	var inputs = {
		id_empleado: $('#modalIdEmpleado'),
		nombre_apellido: $('#modalNombreApellido'),
		interno: $('#modalInterno'),
		direccion_general: $('#modalDireccionGeneral'),
		subsecretaria: $('#modalSubsecretaria'),
		slack: $('#modalSlack'),
		mail: $('#modalMail')
	};

	var e = 0;

	if (inputs.id_empleado.val().trim().length <= 0)
		e++;

	if (inputs.nombre_apellido.val().trim().length < 3)
	{
		inputs.nombre_apellido.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.nombre_apellido.parent().removeClass('has-error has-feedback');

	if (inputs.interno.val().trim().length < 3 || isNaN(inputs.interno.val().trim()))
	{
		inputs.interno.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.interno.parent().removeClass('has-error has-feedback');

	if (inputs.direccion_general.val().trim().length < 3)
	{
		inputs.direccion_general.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.direccion_general.parent().removeClass('has-error has-feedback');

	if (inputs.subsecretaria.val().trim().length < 3)
	{
		inputs.subsecretaria.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.subsecretaria.parent().removeClass('has-error has-feedback');

	// Validacion y envio de datos a la base para checkear.
	if (e == 0)
	{
		var postData =  'h=actualizarEmpleado';
			postData += '&id_empleado='+inputs.id_empleado.val().trim();
			postData += '&nombre_apellido='+inputs.nombre_apellido.val().trim();
			postData += '&interno='+inputs.interno.val().trim();
			postData += '&direccion_general='+inputs.direccion_general.val().trim();
			postData += '&subsecretaria='+inputs.subsecretaria.val().trim();
			postData += '&slack='+inputs.slack.val().trim();
			postData += '&mail='+inputs.mail.val().trim();

		pedidoMySQL(postData);
	}
};


/*
 * AGREGAR EMPLEADO
 */
var abrirModalAgregarEmpleado = function(data){

	// Limpio por si queda alguna clase colgada
	$('.has-error.has-feedback').removeClass('has-error has-feedback');

	// Oculto el mensaje de error
	$('#mensajeErrorAgregar').hide();

	// Muestro el modal
	$('#agregarEmpleado').modal('show');
};

var cerrarModalAgregarEmpleado = function(){
	// Ocultamos el modal
	$('#agregarEmpleado').modal('hide');

	// Limpiamos los campos
	$('#modalAgregarNombreApellido').val();
	$('#modalAgregarInterno').val();
	$('#modalAgregarDireccionGeneral').val();
	$('#modalAgregarSubsecretaria').val();
};


var validarModalAgregarEmpleado = function(){
	var inputs = {
		nombre_apellido: $('#modalAgregarNombreApellido'),
		interno: $('#modalAgregarInterno'),
		direccion_general: $('#modalAgregarDireccionGeneral'),
		subsecretaria: $('#modalAgregarSubsecretaria'),
		slack: $('#modalAgregarSlack'),
		mail: $('#modalAgregarMail')
	};

	var e = 0;

	if (inputs.nombre_apellido.val().trim().length < 3)
	{
		inputs.nombre_apellido.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.nombre_apellido.parent().removeClass('has-error has-feedback');

	if (inputs.interno.val().trim().length < 3 || isNaN(inputs.interno.val().trim()))
	{
		inputs.interno.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.interno.parent().removeClass('has-error has-feedback');

	if (inputs.direccion_general.val().trim().length < 3)
	{
		inputs.direccion_general.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.direccion_general.parent().removeClass('has-error has-feedback');

	if (inputs.subsecretaria.val().trim().length < 3)
	{
		inputs.subsecretaria.parent().addClass('has-error has-feedback');
		e++;
	}
	else
		inputs.subsecretaria.parent().removeClass('has-error has-feedback');

	// Validacion y envio de datos a la base para checkear.
	if (e == 0)
	{
		var postData =  'h=agregarEmpleado';
			postData += '&nombre_apellido='+inputs.nombre_apellido.val().trim();
			postData += '&interno='+inputs.interno.val().trim();
			postData += '&direccion_general='+inputs.direccion_general.val().trim();
			postData += '&subsecretaria='+inputs.subsecretaria.val().trim();
			postData += '&slack='+inputs.slack.val().trim();
			postData += '&mail='+inputs.mail.val().trim();

		pedidoMySQL(postData);
	}
};



var descargarEmpleados = function(){
	window.location = 'descargar_empleados.php';
};


/*
	======================================================
	================= Conexion a la bdd ==================
	======================================================
*/
var pedidoMySQL = function(params){

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.open("POST", urls.php.fw, true);

	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE )
		{
			if(xmlhttp.status == 200)
				terminaMySQL(JSON.parse(xmlhttp.responseText));
			else if(xmlhttp.status == 400)
				console.warn('There was an error 400');
			else
				console.warn('Something else other than 200 was returned');
		}
	}

	xmlhttp.send(params);
}

var terminaMySQL = function(res){

	switch(res.params.h)
	{
		case 'obtenerEmpleados':
			array_empleados = res;
			armarTablaEmpleados('tablaEmpleados');
		break;
		case 'actualizarEmpleado':
			if (res.status)
			{
				cargarEmpleados();
				cerrarModalEditarEmpleado();
			}
			else
				$('#mensajeError').slideDown();
		break;
		case 'agregarEmpleado':
			if (res.status)
			{
				cargarEmpleados();
				cerrarModalAgregarEmpleado();
			}
			else
				$('#mensajeErrorAgregar').slideDown();
		break;
		case 'borrarEmpleado':
			if (res.status)
			{
				cargarEmpleados();
			}
			else
				$('#mensajeErrorAgregar').slideDown();
		break;
	}
}
