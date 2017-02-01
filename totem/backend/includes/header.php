<!-- HEADER -->
<div class="navbar navbar-primary navbar-top">
  <div class="container h100">
    <div class="col-sm-6 col-xs-12 display-table h100">
      <div class="display-table-cell vertical-align">
        <a href="#" class="navbar-title pull-left pull-none-xs">
          <h1 class="text-center text-black">Totem Ingreso</h1>
        </a>
      </div>
    </div>
    <div class="col-sm-6 display-table h100 hidden-xs">
      <div class="display-table-cell vertical-align"><a href="#" class="navbar-brand image pull-right"><img src="lib/bastrap3/ba-header.png"></a></div>
    </div>
  </div>
</div>
<!-- /HEADER -->

<!-- NAVBAR -->
<nav class="navbar navbar-default" role="navigation">
  <div class="container">
    <div class="row">
      <div class="navbar-collapse" id="main-nav">
        <ul class="nav navbar-nav navbar-right">
          <li class="<?php if ($seccion == 'index') echo 'active'; ?>"><a href="index.php">Inicio</a></li>
          <li class="<?php if ($seccion == 'empleados') echo 'active'; ?>"><a href="empleados.php">Empleados</a></li>
          <li class="<?php if ($seccion == 'estadisticas') echo 'active'; ?>"><a href="estadisticas.php">Estadisticas</a></li>
          <!-- <li><a href="visitantes.php">Visitantes</a></li> -->
          <li><a href="logout.php">Salir</a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>
<!-- /NAVBAR -->
