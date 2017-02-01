<?php
	session_start();

	if(!$_SESSION['isActive'])
    {
        header("Location: login.php");
        die();
    }

	// Headers
	header('Content-type: application/vnd.ms-excel');
	header("Content-Disposition: attachment; filename=estadisticas.xls");
	header("Pragma: no-cache");
	header("Expires: 0");

	// SQL
	$c 		= @mysqli_connect('localhost', 'root', '', 'totem_entrada');

    $sql 	= 'SELECT nombre_apellido, interno, direccion_general, subsecretaria FROM empleado ORDER BY nombre_apellido';

    $res  	= @mysqli_query($c, $sql);
?>

<html>
	<body>
		<table cellspacing="0" cellpadding="5">
			<tr>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Nombre y Apellido</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Interno</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Direccion general</th>
				<th style="text-align: center; border: 1px solid black; border-width: 0 1px 1px 0; padding: 3px;">Subsecretaria</th>
		 	</tr>

			<?php
				while($re = @$res->fetch_assoc())
				{
			?>
				<tr>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['nombre_apellido']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['interno']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['direccion_general']; ?></td>
					<td style="text-align: left; border-right: 1px solid black;"><?php echo $re['subsecretaria']; ?></td>
				</tr>
			<?php
				}
				@mysqli_close($c);
			?>
		</table>
	</body>
</html>