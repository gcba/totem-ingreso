<?php
    session_start();

    if(!$_SESSION['isActive'])
    {
        header("Location: login.php");
        die();
    }

    $seccion = 'estadisticas';
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Sitio externo del Gobierno de la Ciudad de Buenos Aires.">
    <meta name="author" content="DGGDI - GCBA">
    <title>Totem Entrada - Backend</title>
    <link rel="shortcut icon" href="lib/bastrap3/favicon.png">
    <link rel="apple-touch-icon-precomposed" href="lib/bastrap3/favicon-mobile.png">

    <!-- BAstrap -->
    <link rel="stylesheet" href="lib/bastrap3/bootstrap.min.css">
    <link rel="stylesheet" href="lib/bastrap3/bastrap.css">

    <!-- Estilos propios -->
    <link rel="stylesheet" href="lib/css/site.css">
  </head>
  <body onload="funcionDeCarga('estadisticas')">
    <!-- HEADER Y NAVBAR  -->
    	<?php include('includes/header.php'); ?>
    <!-- /HEADER Y NAVBAR  -->

    <!-- CONTENIDO -->
  <div class="container">
    <div class="row">
    	<div class="col-md-12">
            <div class="form-group col-md-4">
			    <label for="inputDesde" class="col-sm-2 control-label">Desde: </label>
			    <div class="col-md-12">
			      <input type="date" class="form-control" id="inputDesde" >
			    </div>
			</div>
			<div class="form-group col-md-4">
			    <label for="inputHasta" class="col-sm-2 control-label">Hasta: </label>
			    <div class="col-md-12">
			      <input type="date" class="form-control" id="inputHasta" >
			    </div>
			</div>
			<div class="form-group col-md-12">
			    <div class="col-md-12">
			      <button class="btn btn-primary" onclick="validarObtenerEstadisticas()">Descargar</button>
			    </div>
			</div>
    	</div>
    </div>
  </div>
    <!-- /CONTENIDO -->

	<!-- FOOTER -->
    	<?php include('includes/footer.php') ?>
    <!-- /FOOTER -->

    <!-- BAstrap -->
    <script src="lib/bastrap3/jquery.min.js"></script>
    <script src="lib/bastrap3/bootstrap.min.js"></script>
    <!-- JAVASCRIPT EXTRA -->
    <script type="text/javascript" src="lib/js/moment.js"></script>
    <script type="text/javascript" src="lib/js/datatables.min.js"></script>
    <script type="text/javascript" src="lib/js/estadisticas.js"></script>
  </body>
</html>
