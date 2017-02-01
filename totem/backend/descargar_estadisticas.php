<?php
	session_start();

	if(!$_SESSION['isActive'])
    {
        header("Location: login.php");
        die();
    }

    if (!isset($_GET['desde']) || !isset($_GET['hasta'])) die();

	// Headers
	header('Content-type: application/vnd.ms-excel');
	header("Content-Disposition: attachment; filename=estadisticas.xls");
	header("Pragma: no-cache");
	header("Expires: 0");

	// SQL
	$c 		= @mysqli_connect('localhost', 'root', '', 'totem_entrada');
    $sql 	= 'SELECT c.id_cita, e.nombre_apellido, e.subsecretaria, v.nombre, v.apellido, v.numero_documento, c.createdAt FROM cita c, empleado e, visitante v WHERE e.id_empleado = c.id_empleado AND v.numero_documento = c.numero_documento  AND c.createdAt >= "'.$_GET["desde"].'" AND c.createdAt <= "'.$_GET["hasta"].'" ORDER BY c.id_cita';

    $res  	= @mysqli_query($c, $sql);
?>

<html>
	<body>
		<table cellspacing="0" cellpadding="5">
			<tr>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">ID</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Empleado</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Subsecretaria</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Nombre Visitante</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Apellido Visitante</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Documento Visitante</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Fecha y hora de la visita</th>
		 	</tr>

			<?php
				while($re = @$res->fetch_assoc())
				{
			?>
				<tr>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['id_cita']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['nombre_apellido']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['subsecretaria']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['nombre']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['apellido']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['numero_documento']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['createdAt']; ?></td>
				</tr>
			<?php
				}
				@mysqli_close($c);
			?>
		</table>
	</body>
</html>