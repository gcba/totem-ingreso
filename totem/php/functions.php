<?php
error_reporting(0);

include 'framework/framework.php';


$fw->ajax->listen('obtenerEmpleados', function($params, $r, $fw)
{
	$r = $fw->db->query('SELECT id_empleado, nombre_apellido, interno, direccion_general, subsecretaria, slack, mail, activo FROM empleado WHERE activo=1 ORDER BY nombre_apellido ASC');
	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('actualizarEmpleado', function($params, $r, $fw)
{
	$id_empleado 				= $params['id_empleado'];
	$nombre_apellido 		= $params['nombre_apellido'];
	$interno 						= $params['interno'];
	$direccion_general 	= $params['direccion_general'];
	$subsecretaria 			= $params['subsecretaria'];
	$slack 							= $params['slack'];
	$mail 							= $params['mail'];


	$r = $fw->db->insert('UPDATE `empleado` SET `nombre_apellido`= "'.$nombre_apellido.'",`interno`='.$interno.',`direccion_general`="'.$direccion_general.'",`subsecretaria`="'.$subsecretaria.'",`slack`="'.$slack.'",`mail`="'.$mail.'" WHERE `id_empleado`= '. $id_empleado);

	$r['params'] = $params;

	return $r;
});


$fw->ajax->listen('borrarEmpleado', function($params, $r, $fw)
{
	$id_empleado = $params['id_empleado'];

	$r = $fw->db->insert('UPDATE `empleado` SET `activo`= 0 WHERE `id_empleado`= '. $id_empleado);

	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('agregarEmpleado', function($params, $r, $fw)
{
	$nombre_apellido 		= $params['nombre_apellido'];
	$interno 						= $params['interno'];
	$direccion_general 	= $params['direccion_general'];
	$subsecretaria 			= $params['subsecretaria'];
	$slack 							= $params['slack'];
	$mail 							= $params['mail'];


	$r = $fw->db->insert('INSERT INTO `empleado`(`nombre_apellido`, `interno`, `direccion_general`, `subsecretaria`, `slack`, `mail`) VALUES ("'.$nombre_apellido.'",'.$interno.',"'.$direccion_general.'","'.$subsecretaria.'","'.$slack.'","'.$mail.'")');

	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('obtenerTiposDoc', function($params, $r, $fw)
{
	$r = $fw->db->query('SELECT * FROM tipo_doc');
	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('consultarExistenciaVisitante', function($params, $r, $fw)
{
	$num_doc 	= $params['num-doc'];
	$tipo_doc 	= $params['tipo-doc'];

	$query = 'SELECT COUNT(*) AS cant, nombre, apellido FROM visitante WHERE numero_documento = "'.$num_doc.'" AND id_tipo_doc = '.$tipo_doc;

	$r = $fw->db->query($query);
	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('ingresarVisitante', function($params, $r, $fw)
{
	$nombre 	= $params['nombre'];
	$apellido 	= $params['apellido'];
	$num_doc 	= $params['num-doc'];
	$tipo_doc 	= $params['tipo-doc'];

	$query = 'INSERT INTO visitante (id_tipo_doc, numero_documento, nombre, apellido) VALUES ('.$tipo_doc.', "'.$num_doc.'", "'.$nombre.'", "'.$apellido.'")';

	$r = $fw->db->insert($query);
	$r['params'] = $params;

	return $r;
});

$fw->ajax->listen('cargarNuevaCita', function($params, $r, $fw)
{
	$id_empleado 		= $params['id_empleado'];
	$id_tipo_doc 		= $params['id_tipo_doc'];
	$numero_documento 	= $params['numero_documento'];

	$query = 'INSERT INTO cita (id_empleado, id_tipo_doc, numero_documento) VALUES ('.$id_empleado.', '.$id_tipo_doc.', "'.$numero_documento.'")';
	$r = $fw->db->insert($query);

	$r['params'] = $params;

	$r['notify'] = $fw->notify->send($id_empleado, $id_tipo_doc, $numero_documento);

	return $r;
});
