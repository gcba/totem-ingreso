<?php
    session_start();

    if(!$_SESSION['isActive'])
    {
        header("Location: login.php");
        die();
    }

    $seccion = 'empleados';
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
  <body onload="funcionDeCarga('empleados')">
    <!-- HEADER Y NAVBAR  -->
    	<?php include('includes/header.php'); ?>
    <!-- /HEADER Y NAVBAR  -->

    <!-- CONTENIDO -->
  <div class="container">
    <div class="row">
    	<div class="col-md-12">
            <button type="button" class="btn btn-sm btn-primary pull-right" style="margin-left: 10px;" onclick="descargarEmpleados()">Descargar Lista</button>
            <button type="button" class="btn btn-sm btn-info pull-right" onclick="abrirModalAgregarEmpleado()"><span class="glyphicon glyphicon-plus"></span> Agregar</button>
        		<table class="table table-hover" id="tablaEmpleados"></table>
    	</div>
    </div>
  </div>
    <!-- /CONTENIDO -->

    <!-- MODAL EDITAR -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">Editando empleado</h4>
          </div>
          <div class="modal-body">
                    <input type="hidden" id="modalIdEmpleado">
                <div class="form-group">
                    <label>Nombre y Apellido</label>
                    <input type="text" class="form-control" maxlength="45" id="modalNombreApellido" >
                </div>
                <div class="form-group">
                    <label>Interno</label>
                    <input type="text" class="form-control" maxlength="4" id="modalInterno">
                </div>
                <div class="form-group">
                    <label>Direccion General</label>
                    <input type="text" class="form-control" maxlength="45" id="modalDireccionGeneral">
                </div>
                <div class="form-group">
                    <label>Subsecretaria</label>
                    <input type="text" class="form-control" maxlength="45" id="modalSubsecretaria">
                </div>
                <div class="form-group">
                    <label>Usuario Slack</label>
                    <input type="text" class="form-control" maxlength="20" id="modalSlack">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control" maxlength="50" id="modalMail">
                </div>
                <h6 id="mensajeError" class="text-danger"><span class="glyphicon glyphicon-remove"></span> No se pudo modificar el empleado. Intente mas tarde.</h6>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger pull-left" title="Eliminar" onclick="abrirModalEliminar()"><span class="glyphicon glyphicon-remove"></span></button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="validarModalEditarEmpleado()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /MODAL EDITAR -->


    <div class="modal fade" id="eliminarEmpleado" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Eliminar empleado</h4>
          </div>
          <div class="modal-body">
            <p>Estas seguro que queres eliminar a <strong id="nombreEmpleadoEliminar"></strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" onclick="cancelarModalEliminar()">Cancelar</button>
            <button type="button" class="btn btn-danger" onclick="eliminarEmpleado()">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL AGREGAR -->
    <div class="modal fade" id="agregarEmpleado" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">Agregando empleado</h4>
          </div>
          <div class="modal-body">
                    <input type="hidden" id="modalIdEmpleado">
                <div class="form-group">
                    <label>Nombre y Apellido</label>
                    <input type="text" class="form-control" maxlength="45" id="modalAgregarNombreApellido" >
                </div>
                <div class="form-group">
                    <label>Interno</label>
                    <input type="text" class="form-control" maxlength="4" id="modalAgregarInterno">
                </div>
                <div class="form-group">
                    <label>Direccion General</label>
                    <input type="text" class="form-control" maxlength="45" id="modalAgregarDireccionGeneral">
                </div>
                <div class="form-group">
                    <label>Subsecretaria</label>
                    <input type="text" class="form-control" maxlength="45" id="modalAgregarSubsecretaria">
                </div>
                <div class="form-group">
                    <label>Usuario Slack</label>
                    <input type="text" class="form-control" maxlength="45" id="modalAgregarSlack">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control" maxlength="45" id="modalAgregarMail">
                </div>
                <h6 id="mensajeErrorAgregar" class="text-danger"><span class="glyphicon glyphicon-remove"></span> No se pudo crear el empleado. Intente mas tarde.</h6>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="validarModalAgregarEmpleado()">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- /MODAL AGREGAR -->

	<!-- FOOTER -->
    	<?php include('includes/footer.php') ?>
    <!-- /FOOTER -->

    <!-- BAstrap -->
    <script src="lib/bastrap3/jquery.min.js"></script>
    <script src="lib/bastrap3/bootstrap.min.js"></script>
    <!-- JAVASCRIPT EXTRA -->
    <script type="text/javascript" src="lib/js/datatables.min.js"></script>
    <script type="text/javascript" src="lib/js/empleados.js"></script>
  </body>
</html>
