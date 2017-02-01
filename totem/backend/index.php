<?php
    session_start();

    if(!$_SESSION['isActive'])
    {
        header("Location: login.php");
        die();
    }

    $seccion = 'index';
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
  <body>
    <!-- HEADER Y NAVBAR  -->
    	<?php include('includes/header.php'); ?>
    <!-- /HEADER Y NAVBAR  -->

    <!-- CONTENIDO -->
    <main class="main-container" role="main">
      <div class="container">
        <div class="row">
        	<div class="col-md-12">

        	</div>
        </div>
      </div>
    </main>
    <!-- /CONTENIDO -->

	<!-- FOOTER -->
    	<?php include('includes/footer.php') ?>
    <!-- /FOOTER -->


    <!-- BAstrap -->
    <script src="lib/bastrap3/jquery.min.js"></script>
    <script src="lib/bastrap3/bootstrap.min.js"></script>
    <!-- JAVASCRIPT EXTRA -->
    <script src="lib/js/index.js"></script>
  </body>
</html>
