/*
	======================================================
	================= Variables globales =================
	======================================================
*/
	var _pantallas 					= [];
		_pantallas['bienvenida'] 	= [{id: 0, siguiente: false, anterior: false}],
		_pantallas['busqueda'] 		= [{id: 1, siguiente: true, anterior: false}, {id: 2, siguiente: true, anterior: true}],
		_pantallas['registro'] 		= [{id: 3, siguiente: true, anterior: true}],
		_pantallas['info']			= [{id: 4, siguiente: false, anterior: false}];

	var _flujo_actual 	= 'bienvenida',
		_puntero_actual = 0;

	var anterior 	= null,
		siguiente 	= null;

	var urls = {
		imagenes: {
			input_radios: {
				checked: 'templates/check.png',
				no_checked: 'templates/no_check.png'
			}
		},
		php: {
			consulta_bdd: 'php/functions.php'
		}
	};

	var intentosFallidos = 0;

	var array_empleados;


	var counter = {
		timer: null,
		isFreezed: false,
		timeToReturn: 30,
		currentTimeToReturn: 0,
		home: 'bienvenida',
		callback: null,
		refreshTimer: function()
		{
			// Limpia el timer
			this.clearTimer();

			if (_flujo_actual != this.home)
			{

				this.currentTimeToReturn = this.timeToReturn;

				var _that = this;

				this.timer = setInterval(function(){

					if(!_that.isFreezed) _that.currentTimeToReturn --;

					if(_that.currentTimeToReturn <= 0)
					{
						_that.clearTimer();

						if (_that.callback) _that.callback();
					}

					// console.log(_that.currentTimeToReturn)

				}, 1000);
			}
		},
		clearTimer: function()
		{
			if(this.timer) clearTimeout(this.timer);
		},
		setCallback: function(callback)
		{
			if (typeof callback == 'function') this.callback = callback;
		}
	};

	counter.setCallback(function(){
		location.reload();
	});

	window.addEventListener('click', function()
	{
		counter.refreshTimer();
	});

	window.addEventListener('keypress', function()
	{
		counter.refreshTimer();
	});


	var printer = {
		electronEnabled: false,
		ipc: null,
		init: function()
		{
			if (typeof require == 'function')
			{
				this.electronEnabled = true;
				this.ipc = require('electron').ipcRenderer;

				this.ipc.on('print-return', function (event, arg) {
					console.log('Impresion enviada');
				});
			}

		},
		print: function()
		{
			if (this.electronEnabled)
				this.ipc.send('print-silent', 'Imprimir');
			else
				window.print();
		}
	};

/*
	======================================================
	================= Funciones de Carga =================
	======================================================
*/
	function funciones_de_carga()
	{
		printer.init();
		// Pedidos a MySQL
			pedidoMySQL('h=obtenerEmpleados', urls.php.consulta_bdd);
			pedidoMySQL('h=obtenerTiposDoc', urls.php.consulta_bdd);

		// Acciones de los botones de navegacion
			anterior  = window.document.getElementById('boton-anterior'),
			siguiente = window.document.getElementById('boton-siguiente');

			anterior.addEventListener('click', function(){
				anterior_pantalla();
			});

			siguiente.addEventListener('click', function(){
				siguiente_pantalla();
			});

		// Acciones de loader
			fuera_loader();
			setTimeout(function(){
				mostrar_pantalla( _flujo_actual, _puntero_actual );
			},900);
	}

/*
	======================================================
	================ Funciones Entrada ===================
	======================================================
*/

	function fuera_loader()
	{
		var loader = window.document.getElementById('loader');

		setTimeout(function(){

			loader.style.opacity = '0';

			setTimeout(function(){
				loader.style.display = 'none';
			}, 300);

		}, 1000);
	}
/*
	======================================================
	================= Funciones pantalla =================
	======================================================
*/

	function mostrar_pantalla( flujo, puntero )
	{
		if(typeof _pantallas[ flujo ] !== 'undefined') {

			var pantallas = window.document.getElementsByClassName('pantalla');

			if(pantallas.length) {

				for (var i = 0; i < pantallas.length; i++) {
					pantallas[i].classList.add('display-none');
				}

			}

			var id = _pantallas[ flujo ][ puntero ].id;

			var pantalla = window.document.getElementById('pantalla-' + id);
				pantalla.classList.remove('display-none');


			cargar_pantalla( _pantallas[ flujo ][ puntero ] );

			_flujo_actual 	= flujo;
			_puntero_actual = puntero;
		}
	}

	function cargar_pantalla( objeto )
	{
		var boton_siguiente = window.document.getElementById('boton-siguiente'),
			boton_anterior 	= window.document.getElementById('boton-anterior');

		switch(objeto.id)
		{
			case 1:
				var input_empleado = window.document.getElementById('buscar-persona');

					input_empleado.focus();

					input_empleado.addEventListener('blur', function(e)
					{
						setTimeout(function(){ e.target.focus(); }, 1);
					});

				if(input_empleado.value != '')
					desactivar_disable(boton_siguiente);
				else
					activar_disable(boton_siguiente);


			break;

			case 2:

				var input_dni = window.document.getElementById('ingreso-dni');

					input_dni.focus();

					input_dni.addEventListener('blur', function(e)
					{
						setTimeout(function(){ e.target.focus(); }, 1);
					});


				validar_ingreso_documento()

				cargar_accion_checkeds();

			break;

			case 3:

				var input_nombre 	= window.document.getElementById('registro-nombre'),
					input_apellido 	= window.document.getElementById('registro-apellido');

					input_nombre.focus();

					var isNombreActive 		= false,
						isApellidoActive 	= false;


					input_nombre.addEventListener('blur', function(e)
					{
						setTimeout(function(){
							isNombreActive = false;

							if (!isApellidoActive)
								e.target.focus();
						}, 1);
					});

					input_nombre.addEventListener('focus', function(e)
					{
						isNombreActive = true;
					});


					input_apellido.addEventListener('blur', function(e)
					{
						setTimeout(function(){
							isApellidoActive = false;

							if (!isNombreActive)
								e.target.focus();
						}, 1);
					});

					input_apellido.addEventListener('focus', function(e)
					{
						isApellidoActive = true;
					});


				if(input_nombre.value != "" && input_apellido.value != "")
					desactivar_disable(boton_siguiente);
				else
					activar_disable(boton_siguiente);

			break;

			case 4:

				if(typeof mdkeyboard !== 'undefined' && window.document.querySelector(':focus')) mdkeyboard._setOpen(false);

				var input_hidden_info = window.document.getElementById('hidden-verif-info');

				window.document.getElementById('nombre-html').innerHTML = input_hidden_info.getAttribute('nombre-visitante');

				cargar_nueva_cita(input_hidden_info);

			break;

		}

		if(objeto.siguiente)
			siguiente.classList.remove('display-none');
		else
			siguiente.classList.add('display-none');

		if(objeto.anterior)
				anterior.classList.remove('display-none');
			else
				anterior.classList.add('display-none');
	}


	function validar_pantalla( id )
	{
		/*
			return true, es valida la pantalla
			return false, no es valida la pantalla
		*/

		switch( id )
		{
			case 1:

				var input_value = window.document.getElementById('buscar-persona').value,
					input_verif = window.document.getElementById('hidden-verif-info').getAttribute('nombre-empleado');

				if(input_value == input_verif)
					return true;

			break;

			case 2:

				var input_tipos_documento 	= window.document.getElementsByClassName('item-tipo-documento'),
					input_hidden 			= window.document.getElementById('hidden-verif-info'),
					input_num_doc 			= window.document.getElementById('ingreso-dni').value,
					cont_tipo_dni 			= 0,
					params					= '';

				for (var i = 0; i < input_tipos_documento.length; i++)
				{
					if(input_tipos_documento[i].hasAttribute('checked'))
					{
						input_hidden.setAttribute('tipo-doc-visitante', input_tipos_documento[i].getAttribute('data-tipo-doc'));
						input_hidden.setAttribute('nombre-doc-visitante', input_tipos_documento[i].getAttribute('data-tipo-nombre'));


						cont_tipo_dni++;
					}
				};

				input_hidden.setAttribute('numero-doc-visitante', input_num_doc);

				if(input_hidden.getAttribute('tipo-doc-visitante') != "" &&
					input_hidden.getAttribute('numero-doc-visitante') != "")
				{

					params = 'h=consultarExistenciaVisitante&num-doc='+input_num_doc+'&tipo-doc='+input_hidden.getAttribute('tipo-doc-visitante');
					pedidoMySQL(params, urls.php.consulta_bdd);
				}

			break;

			case 3:

				var input_nombre 	= mayuscula_primer_letra(window.document.getElementById('registro-nombre').value),
					input_apellido 	= mayuscula_primer_letra(window.document.getElementById('registro-apellido').value),
					input_hidden	= window.document.getElementById('hidden-verif-info');

				if(input_nombre != "" && input_apellido != "")
				{
					input_hidden.setAttribute('nombre-visitante', input_nombre.toUpperCase());
					input_hidden.setAttribute('apellido-visitante', input_apellido.toUpperCase());

					params = 'h=ingresarVisitante&nombre='+input_nombre.toUpperCase()+'&apellido='+input_apellido.toUpperCase()+'&tipo-doc='+input_hidden.getAttribute('tipo-doc-visitante')+'&num-doc='+input_hidden.getAttribute('numero-doc-visitante');
					pedidoMySQL(params, urls.php.consulta_bdd);

					return true;
				}

			break;

			default:
				return true;
			break;
		}
	}

	function siguiente_pantalla()
	{
		var flujo 	= _flujo_actual,
			puntero = _puntero_actual;

		var error 	= false,
			id 		= _pantallas[ flujo ][ puntero ].id;


		if(validar_pantalla( id ))
		{

			if( puntero < _pantallas[ flujo ].length - 1 )
			{

				puntero++;

			}
			else
			{
				switch( id )
				{

					case 0:
						flujo 	= 'busqueda',
						puntero = 0;
					break;

					case 2:
						flujo = 'info',
						puntero = 0;
					break;

					case 3:
						flujo = 'info',
						puntero = 0;
					break;

				}
			}

		}
		else
		{
			error = true;
		}


		if(!error)
			mostrar_pantalla( flujo, puntero );
	}

	function anterior_pantalla()
	{

		var flujo 	= _flujo_actual,
			puntero = _puntero_actual;


		if( puntero > 0 )
		{
			puntero--;
		}
		else
		{
			var id = _pantallas[ flujo ][ puntero ].id;

			switch( id )
			{

				case 2:

					flujo 	= 'inicio',
					puntero = 0;

				break;

				case 3:
					flujo 	= 'busqueda',
					puntero = 1;
				break;

			}
		}


		mostrar_pantalla( flujo, puntero );
	}

	function cambio_etapa_stepper(etapa)
	{
		// Log de la funcion.

		var items_stepper = window.document.getElementsByClassName('item-stepper');

		if(etapa <= items_stepper.length && etapa != undefined)
		{
			for (var i = 0; i < items_stepper.length; i++)
			{
				items_stepper[i].classList.remove('activo');
			}

			for (var j = 0; j < etapa; j++)
			{
				items_stepper[j].classList.add('activo');
			}
		}
		else
		{
			console.warn('Error: el selector de la etapa es mayor a la cantidad de etapas.');
		}
	}

/*
	======================================================
	================= Funciones cliente ==================
	======================================================
*/

	function buscar_lista_personas(element)
	{
		var id_lista		= element.getAttribute('reference-list'),
			lista_dinamica 	= window.document.getElementById(id_lista),
			hidden_info 	= window.document.getElementById('hidden-verif-info'),
			boton_siguiente = window.document.getElementById('boton-siguiente'),
			value_texto		= element.value,
			contenido		= '';

		if(value_texto.length >= 3 )
		{

			if (lista_dinamica.classList.contains('display-none'))
				mostrar_lista_personas(lista_dinamica);

			var cont = 0;
			for (var i = 0; i < array_empleados.length; i++)
			{
				if(removeDiacritics(array_empleados[i].nombre_apellido.toLowerCase()).indexOf(value_texto.toLowerCase()) != -1)
				{
					intentosFallidos = 0;
					var contenidoTemp = '<div class="item-lista-inner display-table" data-nombre="{{nombre_apellido}}" data-id-empleado="{{id_empleado}}" data-subsecretaria-empleado="{{subsecretaria_empleado}}" data-interno-empleado="{{interno}}" onclick="fijar_persona(this)">\
									<div class="item-lista-nombre display-table-cell vertical-align-middle">{{nombre_apellido}}</div>\
									<div class="item-lista-icono display-table text-align-center">\
										<div class="display-table-cell vertical-align-middle">\
											<i class="material-icons">add</i>\
										</div>\
									</div>\
								</div>';

					contenidoTemp = contenidoTemp.replace(new RegExp("{{nombre_apellido}}", 'g'), array_empleados[i].nombre_apellido);
					contenidoTemp = contenidoTemp.replace(new RegExp("{{id_empleado}}", 'g'), array_empleados[i].id_empleado);
					contenidoTemp = contenidoTemp.replace(new RegExp("{{subsecretaria_empleado}}", 'g'), array_empleados[i].subsecretaria);
					contenidoTemp = contenidoTemp.replace(new RegExp("{{interno}}", 'g'), array_empleados[i].interno);
					contenido += contenidoTemp;

					cont++;
				}

				if(cont >= 5) break;
			};

			if (cont == 0)
			{
				intentosFallidos++;

				if (intentosFallidos <= 5)
				{
					contenido = '<div class="item-lista-inner display-table">\
									<div class="item-lista-nombre display-table-cell vertical-align-middle">Por favor, chequeá que el nombre y el apellido de la persona estén bien escritos.</div>\
									<div class="item-lista-icono display-table text-align-center">\
									</div>\
								</div>';
				}
				else
				{
					contenido = '<div class="item-lista-inner display-table">\
									<div class="item-lista-nombre item-lista-red display-table-cell vertical-align-middle">La persona que buscás no está en esta lista. Por favor, hacé tu consulta en Mesa de Entrada. Muchas gracias.</div>\
									<div class="item-lista-icono display-table text-align-center">\
									</div>\
								</div>';
				}
			}

			lista_dinamica.innerHTML = contenido;
		}
		else
		{
			if (!lista_dinamica.classList.contains('display-none'))
				ocultar_lista_personas(lista_dinamica);
		}

		if(hidden_info.getAttribute('nombre-empleado') == value_texto)
			desactivar_disable(boton_siguiente);
		else
			activar_disable(boton_siguiente);
	}

	function ocultar_lista_personas(lista_dinamica)
	{
		// Oculta la lista
		if( lista_dinamica.classList.contains('fadeInUp'))
			lista_dinamica.classList.remove('fadeInUp');

		lista_dinamica.classList.add( 'fadeOutDown' );

		setTimeout(function(){
			lista_dinamica.classList.add( 'display-none' );
		}, 100);
	}

	function mostrar_lista_personas(lista_dinamica)
	{
		if( lista_dinamica.classList.contains( 'fadeOutDown' ) )
			lista_dinamica.classList.remove( 'fadeOutDown' );

		lista_dinamica.classList.add( 'fadeInUp' );

		setTimeout(function(){
			lista_dinamica.classList.remove( 'display-none' );
		}, 1);
	}

	function fijar_persona(element)
	{
		_this = element;

		var input_fijar 	= window.document.getElementById('buscar-persona'),
			input_hidden 	= window.document.getElementById('hidden-verif-info'),
			lista_dinamica 	= window.document.getElementById('busqueda-persona'),
			boton_siguiente = window.document.getElementById('boton-siguiente');

		input_fijar.value = _this.getAttribute('data-nombre');

		input_hidden.setAttribute('nombre-empleado', _this.getAttribute('data-nombre'));
		input_hidden.setAttribute('id-empleado', _this.getAttribute('data-id-empleado'));
		input_hidden.setAttribute('subsecretaria-empleado', _this.getAttribute('data-subsecretaria-empleado'));
		input_hidden.setAttribute('interno-empleado', _this.getAttribute('data-interno-empleado'));

		ocultar_lista_personas(lista_dinamica);

		desactivar_disable(boton_siguiente);
	}

	function cargar_accion_checkeds()
	{
		var tipos_documentos 	= window.document.getElementById('tipo-documento').querySelectorAll('.item-tipo-documento');

		for (var i = 0; i < tipos_documentos.length; i++)
		{
			tipos_documentos[i].addEventListener('click', function(){

				_this = this;

				for (var j = 0; j < tipos_documentos.length; j++)
				{
					cambio_estado_checkeds(tipos_documentos[j], 0);
				};

				cambio_estado_checkeds(_this, 1);

				window.document.getElementById('ingreso-dni').focus();

			});
		};
	}

	function cambio_estado_checkeds(element, value)
	{
		/*
			value = 0 --> no check
			value = 1 --> check
		*/

		var image_element = element.getElementsByTagName('img')[0];

		if(value == 1)
		{
			element.setAttribute('checked', 'checked');
			image_element.src = urls.imagenes.input_radios.checked;
		}
		else if(value == 0)
		{
			if(element.hasAttribute('checked'))
				element.removeAttribute('checked');

			image_element.src = urls.imagenes.input_radios.no_checked;
		}
		else
		{
			console.warn('Function error: cambio_estado_checkeds(element, value). Value error.');
		}
	}

	function validar_ingreso_documento()
	{
		var boton_siguiente = window.document.getElementById('boton-siguiente'),
			input 			= window.document.getElementById('ingreso-dni'),
			valido 			= false;

		if(input.value != '')
			valido = true;

		if(valido)
			desactivar_disable(boton_siguiente);
		else
			activar_disable(boton_siguiente);
	}

	function verificar_input_registro()
	{
		var boton_siguiente = window.document.getElementById('boton-siguiente'),
			input_apellido 	= window.document.getElementById('registro-apellido'),
			input_nombre 	= window.document.getElementById('registro-nombre'),
			valido 			= false;

			if(input_apellido.value != '' && input_nombre.value != '')
				valido = true;

			if(valido)
				desactivar_disable(boton_siguiente);
			else
				activar_disable(boton_siguiente);
	}

	function imprimir_ticket_entrada(element_info)
	{
		var ticket = {
				contenedor: window.document.getElementById('ticket'),
				header: {
					fecha: window.document.getElementById('ticket-fecha'),
					hora: window.document.getElementById('ticket-hora')
				},
				main: {
					visitante: window.document.getElementById('ticket-visitante'),
					documento: {
						tipo: window.document.getElementById('ticket-tipo'),
						numero: window.document.getElementById('ticket-numero'),
					},
					empleado: window.document.getElementById('ticket-empleado'),
					interno: window.document.getElementById('ticket-interno')
				},
				footer: {
					secretaria: window.document.getElementById('ticket-secretaria'),
					ministerio: window.document.getElementById('ticket-ministerio'),
					ubicacion: window.document.getElementById('ticket-ubicacion'),
					direccion: window.document.getElementById('ticket-direccion')
				}
			},
			fecha_hora = obtener_fecha_hora();

			ticket.header.fecha.innerHTML 			= fecha_hora[0];
			ticket.header.hora.innerHTML 			= fecha_hora[1];
			ticket.main.visitante.innerHTML 		= element_info.getAttribute('nombre-visitante') + ' ' + element_info.getAttribute('apellido-visitante');
			ticket.main.documento.tipo.innerHTML 	= element_info.getAttribute('nombre-doc-visitante');
			ticket.main.documento.numero.innerHTML 	= element_info.getAttribute('numero-doc-visitante');
			ticket.main.empleado.innerHTML 			= element_info.getAttribute('nombre-empleado');
			ticket.main.interno.innerHTML 			= element_info.getAttribute('interno-empleado');
			ticket.footer.secretaria.innerHTML 		= element_info.getAttribute('subsecretaria-empleado');
			ticket.footer.ministerio.innerHTML 		= 'MMIT';
			ticket.footer.ubicacion.innerHTML 		= "Piso 2";
			ticket.footer.direccion.innerHTML 		= 'Av. Martín García 346 - C.A.B.A';

			ticket.contenedor.classList.remove('display-none');

			printer.print();

			ticket.contenedor.classList.add('display-none');
	}

	function cargar_nueva_cita(hidden)
	{
		var params = 'h=cargarNuevaCita';

			params += '&id_empleado=' + hidden.getAttribute('id-empleado');
			params += '&id_tipo_doc=' + hidden.getAttribute('tipo-doc-visitante');
			params += '&numero_documento=' + hidden.getAttribute('numero-doc-visitante');

		pedidoMySQL(params, urls.php.consulta_bdd);
	}

	function desactivar_disable(element)
	{
		element.removeAttribute('disabled');
		element.setAttribute('z-shadow', '3');

	}

	function activar_disable(element)
	{
		element.setAttribute('z-shadow', '2');
		element.setAttribute('disabled', 'disabled');

	}

	function obtener_fecha_hora()
	{
		var date = new Date(),
			fecha,
			hora;

		fecha 	= agregaZero(date.getDate()) + '-' + agregaZero((date.getMonth()+1)) + '-' + agregaZero(date.getFullYear());
		hora 	= agregaZero(date.getHours()) + ':' + agregaZero(date.getMinutes()) + ':' + agregaZero(date.getSeconds());

		return [fecha, hora];
	}

	function agregaZero(a = "0")
	{
		return (a.toString().length < 2)? '0'+a : a;
	}

	function bloquear_caracteres(event, tipo)
	{
		var keycode = event.charCode;

		//console.log(keycode)

		switch(tipo)
		{
			case 'alfabetico':

				switch(keycode)
				{
					case 39:
					case 42:
					case 43:
					case 44:
					case 45:
					case 46:
					case 47:
					case 48:
					case 49:
					case 50:
					case 51:
					case 52:
					case 53:
					case 54:
					case 55:
					case 56:
					case 57:
					case 123:
					case 124:
					case 125:
					case 180:
					case 191:
						event.preventDefault();
					break;
					default:
						return true;
				}

			break;

			case 'numerico':

				switch(keycode)
				{
					case 0:
					case 48:
					case 49:
					case 50:
					case 51:
					case 52:
					case 53:
					case 54:
					case 55:
					case 56:
					case 57:
						return true;
					break;
					default:
						event.preventDefault();
				}

			break;
		}
	}

	function removeDiacritics (str)
	{

		var defaultDiacriticsRemovalMap = [
			{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
			{'base':'AA','letters':/[\uA732]/g},
			{'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
			{'base':'AO','letters':/[\uA734]/g},
			{'base':'AU','letters':/[\uA736]/g},
			{'base':'AV','letters':/[\uA738\uA73A]/g},
			{'base':'AY','letters':/[\uA73C]/g},
			{'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
			{'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
			{'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
			{'base':'DZ','letters':/[\u01F1\u01C4]/g},
			{'base':'Dz','letters':/[\u01F2\u01C5]/g},
			{'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
			{'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
			{'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
			{'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
			{'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
			{'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
			{'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
			{'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
			{'base':'LJ','letters':/[\u01C7]/g},
			{'base':'Lj','letters':/[\u01C8]/g},
			{'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
			{'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
			{'base':'NJ','letters':/[\u01CA]/g},
			{'base':'Nj','letters':/[\u01CB]/g},
			{'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
			{'base':'OI','letters':/[\u01A2]/g},
			{'base':'OO','letters':/[\uA74E]/g},
			{'base':'OU','letters':/[\u0222]/g},
			{'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
			{'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
			{'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
			{'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
			{'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
			{'base':'TZ','letters':/[\uA728]/g},
			{'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
			{'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
			{'base':'VY','letters':/[\uA760]/g},
			{'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
			{'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
			{'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
			{'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
			{'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
			{'base':'aa','letters':/[\uA733]/g},
			{'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
			{'base':'ao','letters':/[\uA735]/g},
			{'base':'au','letters':/[\uA737]/g},
			{'base':'av','letters':/[\uA739\uA73B]/g},
			{'base':'ay','letters':/[\uA73D]/g},
			{'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
			{'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
			{'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
			{'base':'dz','letters':/[\u01F3\u01C6]/g},
			{'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
			{'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
			{'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
			{'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
			{'base':'hv','letters':/[\u0195]/g},
			{'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
			{'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
			{'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
			{'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
			{'base':'lj','letters':/[\u01C9]/g},
			{'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
			{'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
			{'base':'nj','letters':/[\u01CC]/g},
			{'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
			{'base':'oi','letters':/[\u01A3]/g},
			{'base':'ou','letters':/[\u0223]/g},
			{'base':'oo','letters':/[\uA74F]/g},
			{'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
			{'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
			{'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
			{'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
			{'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
			{'base':'tz','letters':/[\uA729]/g},
			{'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
			{'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
			{'base':'vy','letters':/[\uA761]/g},
			{'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
			{'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
			{'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
			{'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
		];

		for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
			str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
		}

		return str;
	}

	function mayuscula_primer_letra(string)
	{
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}

/*
	======================================================
	================= Conexion a la bdd ==================
	======================================================
*/
	function pedidoMySQL(params, url)
	{
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("POST", url, true);

		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {

				if(xmlhttp.status == 200)
				{
					terminaMySQL(JSON.parse(xmlhttp.responseText));
				}
				else if(xmlhttp.status == 400)
				{
					console.warn('There was an error 400');
				}
				else
				{
					console.warn('Something else other than 200 was returned');
				}
			}
		}

		xmlhttp.send(params);
	}

	function terminaMySQL(r)
	{

		switch(r.params.h)
		{
			case 'obtenerEmpleados':
				array_empleados = r;

				//console.log(r)

			break;

			case 'obtenerTiposDoc':

				var cont_tipo_doc 	= window.document.getElementById('tipo-documento');
					contenido 		= '',
					checked 		= {};


				for (var i = 0; i < r.length; i++)
				{
					if(r[i].id_tipo_doc == 1)
						checked = {attr: 'checked="checked"', img: urls.imagenes.input_radios.checked}
					else
						checked = {attr: '', img: urls.imagenes.input_radios.no_checked}

					contenido += '<div data-tipo-doc="'+r[i].id_tipo_doc+'" data-tipo-nombre="'+r[i].nombre+'" class="item-tipo-documento display-table" '+checked.attr+'>\
									<div class="display-table-cell">\
										<div class="imagen-check">\
											<img draggable="false" src="'+checked.img+'">\
										</div>\
									</div>\
									<div class="display-table-cell vertical-align-middle">\
										<div class="tipo-doc">'+r[i].nombre+'</div>\
									</div>\
								</div>';
				};

				if(contenido != "")
					cont_tipo_doc.innerHTML = contenido;

			break;

			case 'consultarExistenciaVisitante':


				if(r[0].cant == 1)
				{
					window.document.getElementById('hidden-verif-info').setAttribute('nombre-visitante', r[0].nombre.toUpperCase());
					window.document.getElementById('hidden-verif-info').setAttribute('apellido-visitante', r[0].apellido.toUpperCase());

					mostrar_pantalla('info', 0);
				}
				else
				{
					mostrar_pantalla('registro', 0);
				}

			break;

			case 'cargarNuevaCita':

				var element_info = window.document.getElementById('hidden-verif-info');

					imprimir_ticket_entrada(element_info);


				setTimeout(function()
				{
					location.reload()
				}, 5000);

			break;
		}
	}
