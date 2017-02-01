<?php 
  session_start();

  $usuario = $contrasena = $error = '';

  if (isset($_SESSION['isActive'])) header('Location:index.php');

  if(isset($_POST['sub']))
  {
    $usuario    = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];

    if($usuario === 'backendtotem' && md5($contrasena) === '55deb7fd23a25aa863fb912ff7fc21d8')
    {
      $_SESSION['isActive'] = true;
      $_SESSION['role']     = 'superadmin';

      header('Location:index.php');
      die();
    }
    else
    {
      $error = '<span class="glyphicon glyphicon-remove"></span> Usuario y/o contraseña invalidos.';
    }
  }
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
    <link rel="shortcut icon" href="lib/bastrap3/favicon.ico">
    <link rel="apple-touch-icon-precomposed" href="lib/bastrap3/favicon-mobile.png">

    <!-- BAstrap -->
    <link rel="stylesheet" href="lib/bastrap3/bootstrap.min.css">
    <link rel="stylesheet" href="lib/bastrap3/bastrap.css">

    <!-- Estilos propios -->
    <link rel="stylesheet" href="lib/css/site.css">
  </head>
  <body>
    <!-- CONTENIDO -->
    <main class="main-container" role="main">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <form class="form-signin col-md-4 col-md-offset-4" action="login.php" method="post">
              <h2 class="form-signin-heading">Backend</h2>
              <input type="text" name="usuario" class="form-control" placeholder="Usuario" required="" autofocus="">
              <input type="password" name="contrasena" class="form-control" placeholder="Contraseña" required="">
              <h6 class="text-danger"> <?php echo $error; ?></h6>
              <button class="btn btn-lg btn-primary btn-block" name="sub" type="submit">Ingresar</button>
            </form>
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