'use strict';


/*
 * Material Design Keyboard
 * Version: 1.0.0
 * Author:  Leandro Gaspari
 * Date:    -
 * Purpose: A virtual keyboard for material design developments
 */


var mdkeyboard = {

	// Guarda el teclado
	keyboard: null,

	// Guardo el body
	body: null,

	// Elemento seleccionado
	focus: false,

	// Todas las teclas
	buttons: [],

	// Shift trabado
	shiftLock: false,

	// Alt trabado
	altLock: false,

	/*
		Estados:
		0: normal
		1: shift on
		2: alt
		3: alt+shift
    */
	state: 0,

	// Idioma actual
	locale: null,

	// Configuraciones
	default: {

		// Todos los idiomas
		locales: [],

		// Idioma por default
		locale: 'default'

	},


	// Teclas especiales
	specialKeys: {

		'backspace': function (e) {
			var target = mdkeyboard.focus;

			target.value = target.value.substring(0, target.value.length - 1);
		},

		'check': function(e) {
			var open = false;

			mdkeyboard._setOpen( open );

			mdkeyboard.focus.blur();
			mdkeyboard.focus = null;
		},

		'enter': function (e) {
			var target = mdkeyboard.focus;

			if(target.nodeName.toLowerCase() == 'textarea') {
				target.value += '\r\n';
			}
		},

		'shift': function (e) {
			// Obtengo el estado actual del keyboard
			var state = mdkeyboard.state;


			// Depende del estado del teclado ejecuta una acción en particular
			switch(state) {

				// Si está en 'normal' lo paso a 'shift on' y activo el shift
				case 0:
					state = 1;
					mdkeyboard._setKeyActive('shift', 1);
				break;

				// Si está en 'shift on' y no está lockeado, lockeo el shift
				// Sino, Si está en 'shift on' y está lockeado, deslockeo el shift y lo paso a 'normal'
				case 1:
					if(!mdkeyboard.shiftLock) {
						mdkeyboard.shiftLock = true;

						mdkeyboard._setKeyActive('shift', 2);
					}
					else {
						mdkeyboard.shiftLock = false;

						state = 0;
						mdkeyboard._setKeyActive('shift', 0);
					}
				break;

				// Si está en 'alt' lo paso a 'alt+shift' y activo el shift
				case 2:
					state = 3;
					mdkeyboard._setKeyActive('shift', 1);
				break;

				// Si está en 'alt+shift' lo paso a 'alt' y desactivo el shift
				case 3:
					state = 2;
					mdkeyboard._setKeyActive('shift', 0);
				break;

			}


			// Seteo el estado
			mdkeyboard.setState( state );
		},

		'alt': function (e) {
			// Obtengo el estado actual del keyboard
			var state = mdkeyboard.state;


			// Depende del estado del teclado ejecuta una acción en particular
			switch(state) {

				// Si está en 'normal' lo paso a 'alt' y activo el alt
				case 0:
					state = 2;
					mdkeyboard._setKeyActive('alt', 1);
				break;

				// Si está en 'shift' lo paso a 'alt+shift' y activo el alt
				case 1:
					state = 3;
					mdkeyboard._setKeyActive('alt', 0);
				break;

				// Si está en 'alt' y no está lockeado, lockeo el alt
				// Sino, Si está en 'alt' y está lockeado, deslockeo el alt y lo paso a 'normal'
				case 2:
					if(!mdkeyboard.altLock) {
						mdkeyboard.altLock = true;

						mdkeyboard._setKeyActive('alt', 2);
					}
					else {
						mdkeyboard.altLock = false;

						state = 0;
						mdkeyboard._setKeyActive('alt', 0);
					}
				break;

				// Si está en 'alt+shift' lo paso a 'shift' y desactivo el alt
				case 3:
					state = 1;
					mdkeyboard._setKeyActive('alt', 0);
				break;

			}

			// Seteo el estado
			mdkeyboard.setState( state );
		}
	},

	// Init
	init: function () {

		// Guardo el body
		mdkeyboard.body = window.document.getElementsByTagName('body')[0];


		// Agrega el evento click/touchstart a la ventana
		if( mdkeyboard._hasEvent('touchstart') )
			window.addEventListener('touchstart', this.onClick, true);
		else
			window.addEventListener('click', this.onClick, true);

		// window.addEventListener('mouseup', this.onRelease, true);
		// window.addEventListener('touchleave', this.onRelease, true);


		// Carga todos los teclados disponibles
		mdkeyboard._loadLocales();

		// Construye el teclado
		mdkeyboard.buildKeyboard();


		// Agrego el evento focus al window
		window.addEventListener('focus', this.onFocus, true);

		// Remuevo el evento load del window
		window.removeEventListener('load', this.init, true);

	},

	_setOpen: function (open) {

		var wrapper 	= window.document.getElementById('mdkeyboard-wrapper'),
			alphabetic 	= window.document.getElementById('mdkeyboard-alphabetic'),
			numeric 	= window.document.getElementById('mdkeyboard-numeric');


		// Si se abre, chequeo el teclado y lo muestro
		if(open) {

			// Variable del timeout
			var timeout = parseFloat( getComputedStyle(mdkeyboard.keyboard)['transitionDuration'] ) * 1000;


			// Si el bottom nes válido y no es 0
			if( parseInt( mdkeyboard.keyboard.style.bottom ) )
				timeout = 0;


			// Lo cierro
			mdkeyboard._setOpen( false );


			setTimeout(function(){

				if(mdkeyboard.focus) {
					switch(mdkeyboard.focus.getAttribute('data-mdkeyboard')) {
						case 'alphabetic':
							alphabetic.style.display = 'block';
							numeric.style.display 	 = 'none';
							wrapper.setAttribute('flex', '');
						break;

						case 'numeric':
							numeric.style.display 	 = 'block';
							alphabetic.style.display = 'none';
							wrapper.setAttribute('flex', '');
						break;

						case 'alphanumeric':
						default:
							alphabetic.style.display = 'block';
							numeric.style.display 	 = 'block';
							wrapper.removeAttribute('flex');
						break;
					}
				}

				mdkeyboard.keyboard.style.bottom = '0px';

				// Chequeo las mayusculas
				mdkeyboard.capslock();


				// Le devuelvo el focus al input
				if(mdkeyboard.focus)
					mdkeyboard.focus.focus();


				// Clear
					wrapper = alphabetic = numeric = null;

			}, timeout);


			// Clear
				timeout = null;

		}
		else {
			// Le saco el focus al input
			// if(mdkeyboard.focus)
			// 	mdkeyboard.keyboard.focus();

			mdkeyboard.keyboard.style.bottom = - mdkeyboard.keyboard.offsetHeight + 'px';
		}


		// Redibujo los botones
		mdkeyboard.redrawButtons();
	},

	isOpen: function() {

		if( parseFloat(mdkeyboard.keyboard.offsetBottom) == 0 )
			return true;

		return false;
	},

	// Cuando un elemento recibe el focus
	onFocus: function (e) {

		// Lista de elementos y tipos que abren el teclado
		var availableNodeNameList = [ 'input', 'select', 'option', 'textarea', 'textbox' ],
			availableNodeTypeList = [ 'text', 'password', 'url', 'color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'range', 'search', 'tel', 'time', 'week' ];


		var open  = false,
			focus = e.target;


		// Si el nuevo focus es el mismo que el actual
		if(focus == mdkeyboard.focus)
			return;


		// Si es el teclado
		if((focus.nodeType === 1) && (mdkeyboard.keyboard == focus || mdkeyboard.keyboard.contains( focus ))) {
			// Le devuelvo el focus al input
			if(mdkeyboard.focus)
				mdkeyboard.focus.focus();

			return;
		}


		// Primero necesito comprobar si el elemento focuseado requiere teclado
		if (focus) {

			var nodeName = focus.nodeName,
				nodeType = focus.type;


			// Si lo encuentra dentro de la lista de los elementos disponibles
			if((typeof nodeName !== 'undefined') && (availableNodeNameList.indexOf( nodeName.toLowerCase() ) != -1)) {

				// Debe mostrar el teclado
				open = true;

				// Guardo el elemento en el objeto
				mdkeyboard.focus = focus;

			}
			else {

				// Si lo encuentra dentro de la lista de los tipos disponibles
				if((typeof nodeType !== 'undefined') && (availableNodeTypeList.indexOf( nodeType.toLowerCase() ) != -1)) {

					// Debe mostrar el teclado
					open = true;

					// Guardo el elemento en el objeto
					mdkeyboard.focus = focus;

				}
				else {

					// Si no cumple ninguna, remuevo el focus
					mdkeyboard.focus = false;

				}
			}


			// Clear
				nodeName = nodeType = null;
		}


		// Seteo el teclado
		mdkeyboard._setOpen(open);


		// Clear
			availableNodeNameList = availableNodeTypeList = open = focus = null;
	},

	// Cuando un elemento recibe el click
	onClick: function (e) {


		var open  = false,
			focus = e.target;


		// Si el nuevo focus es el mismo que el actual
		if(focus == mdkeyboard.focus) return;


		// Si es el teclado
		if((focus.nodeType === 1) && (mdkeyboard.keyboard == focus || mdkeyboard.keyboard.contains( focus ))) {
			// Le devuelvo el focus al input
			if(mdkeyboard.focus) mdkeyboard.focus.focus();

			return;
		}


		// Si el target es el body
		// if(e.target != mdkeyboard.focus) {

		// Si no hay input seleccionado
		if (!window.document.querySelector(':focus'))
		{
			// Reseteo el focus
			mdkeyboard.focus = false;

			// Cierro el teclado
			mdkeyboard._setOpen( open );
		}
	},

	// Chequea si tiene que poner o sacar las mayúsculas
	capslock: function() {

		if(mdkeyboard.focus) {

			var value = mdkeyboard.focus.value,
				state = mdkeyboard.state;


			// Si existe un valor
			if(value != null && typeof value !== 'undefined') {

				// Si el largo es 0
				if(value.length == 0) {

					// si está en 'normal' lo paso a 'shift on'
					if(state === 0) {
						state = 1;
						mdkeyboard._setKeyActive('shift', 1);
					}

				}
				// O sino
				else {
					var one  = value.substr(value.length - 1, value.length),
						two  = value.substr(value.length - 2, value.length);
					// var tres = value.substr(value.length - 3, value.length);

					if(one == '\n' || two == '. ' || two == '? ' || two == '! ' || two == '.\n') {

						// Si está en 'normal', lo paso a 'shift on'
						if(state === 0) {
							state = 1;
							mdkeyboard._setKeyActive('shift', 1);
						}

					}
					else {

						// Si está en 'shift on' sin lockear, lo paso a 'normal'
						if(state === 1 && !mdkeyboard.shiftLock) {
							// console.log("holo3")
							state = 0;
							mdkeyboard._setKeyActive('shift', 0);
						}

					}

					// Clear
						one = two = null;
				}

			}


			// Actualiza el estado del teclado
			mdkeyboard.setState(state);


			// Clear
				value = state = null;
		}
	},

	// Cambia el estado del teclado
	setState: function (state) {

		// Si es el mismo estado que el actual
		if (state === mdkeyboard.state)
			return;


		// Setea el estado y redibuja los botones
		mdkeyboard.state = state;
		mdkeyboard.redrawButtons();


		// Clear
			state = null;
	},

	// Crea un botón
	createButton: function(item) {

		// Creo el botón y su contenedor
		var button = window.document.createElement('button');
			button.classList.add('mdkeyboard-key');

		var container = window.document.createElement('div');
			container.classList.add("mdkeyboard-container");

			// Agrega el container al botón
 			button.appendChild(container);
 			container = null;


		function press(e) {

			// Proceso el click
			mdkeyboard._processPress(item, e);


			// Activo la tecla
			this.classList.add('active');


			// Clear
				e = null;

		}


		function release(e) {

			// Le saco la clase activa al botón
				if( this.classList.contains('active') )
					this.classList.remove('active');

			// Clear
				e = null;
		}


		// Datos
		button.fxkbdata = item;


		// Eventos
		button.addEventListener('mousedown', press, true);
		button.addEventListener('mouseup', release, true);
		button.addEventListener('mouseleave', release, true);


		// Guarda el botón en el array de botones del teclado
		mdkeyboard.buttons.push(button);


		return button;
	},

	// Genera un teclado según el locale
	buildCustomKeyboard: function(locale, keyboard) {

		var DOMKeyboard = window.document.createElement('div');
			DOMKeyboard.setAttribute('id', 'mdkeyboard-' + keyboard);

		// Recorro todas las filas del alfabetico
		locale.forEach(function (rowItems) {

			var row = window.document.createElement('div');
				row.classList.add('mdkeyboard-row');

			// Recorro todos los items de la fila
			rowItems.forEach(function (item) {

				var button = mdkeyboard.createButton( item );


				// Agrego el boton a la fila
				row.appendChild( button );
				button = null;


				// Clear
					item = null;
			});

			// Agrego la fila al teclado alfabetico
			DOMKeyboard.appendChild(row);


			// Clear
				rowItems = row = null;

		});


		// Clear
			locale = keyboard = null;


		return DOMKeyboard;
	},

	// Crea los botones
	buildKeyboard: function () {


		// Setea el lenguaje por defecto
		var locale = mdkeyboard.default.locales[ mdkeyboard.default.locale ];


		// Si existe el lenguaje
		if (!locale) {
			console.error('Material Design Keyboard: No se encontró un lenguaje de teclado para mostrar.');
			return;
		}


		// Resetea las variables del teclado anterior
		mdkeyboard.locale 	= locale;
		mdkeyboard.buttons 	= [];
		mdkeyboard.state 	= 0;


		// Variables del DOM
		var keyboard = window.document.createElement('div');
			keyboard.setAttribute('id', 'mdkeyboard');
			keyboard.classList.add('non-printable');

			var keyboardMain = window.document.createElement('div');
				keyboardMain.setAttribute('id', 'mdkeyboard-main');

				var keyboardWrapper = window.document.createElement('div');
					keyboardWrapper.setAttribute('id', 'mdkeyboard-wrapper');

					keyboardWrapper.appendChild( mdkeyboard.buildCustomKeyboard(locale.alphabetic, 'alphabetic') );
					keyboardWrapper.appendChild( mdkeyboard.buildCustomKeyboard(locale.numeric, 'numeric') );

			keyboardMain.appendChild(keyboardWrapper);
			keyboardWrapper = null;

		keyboard.appendChild(keyboardMain);
		keyboardMain = null;


		// Remuevo el teclado anterior si es que existe
		if(mdkeyboard.keyboard != null)
			if(mdkeyboard.body.contains(mdkeyboard.keyboard))
				mdkeyboard.body.removeChild(mdkeyboard.keyboard);


		// Guardo y agrego el teclado nuevo
		mdkeyboard.keyboard = keyboard;
		mdkeyboard.body.appendChild(mdkeyboard.keyboard);
		keyboard = null;


		// Repinto los botones
		mdkeyboard.redrawButtons();


		// Lo oculto
		mdkeyboard._setOpen( false );


		// Clear
			locale = null;
	},

	// Redibuja los botones según el estado
	redrawButtons: function () {

		mdkeyboard.buttons.forEach(function (button) {

			// Agarro el container del button
			var container = button.getElementsByClassName('mdkeyboard-container')[0];


			// Variables para redibujar los botones
			var item 	= button.fxkbdata,
				state 	= mdkeyboard.state,
				key 	= '';


			// Si el estado excede el largo del item (le falta algún caracter)
			if (state > item.length - 1) {
				key = item[0];
			}
			// Sino le asigna el estado que le corresponde
			else {
				key = item[state];
			}


			// Si la key es de tipo STRING
			if (typeof key === 'string') {

				// Si es un string vacío
				if (key === '') {
					container.innerHTML = '\u0020';
				}
				// Sino agrego la letra
				else {
					container.innerHTML = key;
				}

			}
			// Si es un objeto
			else {

				// Le agrego la letra del objeto
				container.innerHTML = key.label;

				// Si tiene un atributo
				if (key.attribute_field) {
					button.setAttribute( key.attribute_field, key.attribute_value );
				}

				// Si tiene una clase
				if (key.class) {
					key.class.split(' ').forEach(function (c) {

						// Le agrega un ancho en pixeles segun la clase "w[xxx]"
						if(c.match(/^[w]/i)){
							button.style.width = c.substring(1, c.length) + "px";
						}
						else {
							button.classList.add(c);
						}
					});
				}

			}


			// Clear
				button = container = item = state = key = null;

		});
	},
	_checkInputLength: function(elem)
	{
		var maxlength 	= elem.getAttribute("maxlength"),
				valueLength = elem.value.length;

		return maxlength > valueLength;
	},
	_processPress: function (item, e) {

		var key,
			state = mdkeyboard.state;


		// Según el estado del teclado guardo una tecla
		if (state > item.length -1) {
			if (state === 3 && item.length > 2)
				key = item[2];
			else
				key = item[0];
		}
		else {
			key = item[state];
		}

		// Si la tecla es un string
		if (typeof key === 'string' && mdkeyboard._checkInputLength(mdkeyboard.focus))
		{
			mdkeyboard._enterString(key, mdkeyboard.focus);
		}
		// Si es un objeto
		else
		{
			// Si es una tecla especial
			if (key.special)
			{
				// Si tiene una acción especial, la ejecuta
				if (mdkeyboard.specialKeys[key.special])
				{
					mdkeyboard.specialKeys[key.special](e);
				}

				mdkeyboard._dispatchAltKey(key.special, mdkeyboard.focus);
			}
			// Sino, si es un string
			else if (key.string && mdkeyboard._checkInputLength(mdkeyboard.focus))
			{
				mdkeyboard._enterString(key.string, mdkeyboard.focus);
			}
			// Sino, si es un char
			else if (key.char && mdkeyboard._checkInputLength(mdkeyboard.focus))
			{
				mdkeyboard._dispatchKey(key.char, mdkeyboard.focus);
			}

		}


		// Si no estoy apretando shift
		if ( key.special != 'shift' )
			mdkeyboard.capslock();


		// Clear
			item = e = key = state = null;
	},

	// Escribe un texto en un elemento seleccionado
	_enterString: function (string, target) {

		if (!target)
			return;

		// Escribe un string en el target
		for (var i = 0, len = string.length; i < len; i++)
			mdkeyboard._dispatchKey( string[i].charCodeAt(0) , target );


		// Clear
			string = target = null;
	},

	// Escribe una tecla en un elemento seleccionado
	_dispatchKey: function (key, target) {

		if (!target)
			return;

		var evt = window.document.createEvent('KeyboardEvent');
		evt.initKeyEvent('keypress', true, true, null, false, false, false, false, 0, key);
		target.dispatchEvent(evt);

		target.value += String.fromCharCode(key);

		evt = window.document.createEvent('KeyboardEvent');
		evt.initKeyEvent('keyup', true, true, null, false, false, false, false, 0, key);
		target.dispatchEvent(evt);


		// Clear
			key = target = evt = null;

	},

	// Ejecuta el evento de las teclas especiales
	_dispatchAltKey: function (key, target) {

		if (!target)
			return;

		var evt = window.document.createEvent('KeyboardEvent');
		evt.initKeyEvent('keypress', true, true, null, false, false, false, false, key, 0);
		target.dispatchEvent(evt);

		// target.value += String.fromCharCode(key);

		var evt = window.document.createEvent('KeyboardEvent');
		evt.initKeyEvent('keyup', true, true, null, false, false, false, false, key, 0);
		target.dispatchEvent(evt);


		// Clear
			key = target = evt = null;

	},


	// Setea el estado de los botones
	_setKeyActive: function (key, state) {

		/*
         0: not active
         1: active
         2: locked
        */
		var buttons = window.document.querySelectorAll('.mdkeyboard-key[mdkeyboard-key-action="' + key + '"]');


		// Si encuentra botones
		if (buttons.length > 0) {

			// Los recorro
			[].forEach.call(buttons, function (button) {

				// Si no están inactivos
				if (state > 0) {

					// Y están activos, los trabo
					if (state == 2) {
						button.classList.add('locked');
					}
				}
				// Sino los destrabo
				else {
					button.classList.remove('locked');
				}

			});
		}


		// Clear
			key = state = buttons = null;

	},

	_loadLocales: function() {

		// Default
		mdkeyboard.default.locales['default'] = {
					alphabetic: [
						[
							['q', 'Q', '1', ''],
							['w', 'W', '2', ''],
							['e', 'E', '3', ''],
							['r', 'R', '4', ''],
							['t', 'T', '5', ''],
							['y', 'Y', '6', ''],
							['u', 'U', '7', ''],
							['i', 'I', '8', ''],
							['o', 'O', '9', ''],
							['p', 'P', '0', ''],
							[{'label': '', special: 'backspace', attribute_field: 'mdkeyboard-key-action', attribute_value: 'backspace'}], // backspace
							// [{'label': "", flex: '0', char: 0, class: 'empty w25'}]
						],
						[
							[{'label': "", class: 'empty w25'}],
							['a', 'A', '', ''],
							['s', 'S', '', ''],
							['d', 'D', '', ''],
							['f', 'F', '', ''],
							['g', 'G', '', ''],
							['h', 'H', '', ''],
							['j', 'J', '', ''],
							['k', 'K', '', ''],
							['l', 'L', '', ''],
							[{'label': '', special: 'enter', attribute_field: 'mdkeyboard-key-action', attribute_value: 'enter'}], // enter
							// [{'label': "", flex: '0', char: 0, class: 'empty w25'}]
						],
						[
							[{'label': '', special: 'shift', attribute_field: 'mdkeyboard-key-action', attribute_value: 'shift'}], // shift / caps
							['z', 'Z', '', ''],
							['x', 'X', '', ''],
							['c', 'C', '', ''],
							['v', 'V', '', ''],
							['b', 'B', '', ''],
							['n', 'N', '', ''],
							['m', 'M', '', ''],
							['-', '-', '', ''],
							['_', '_', '', ''],
							[{'label': '', special: 'shift', attribute_field: 'mdkeyboard-key-action', attribute_value: 'shift'}], // shift / caps
							// [{'label': "", flex: '0', char: 0, class: 'empty w25'}]
						],
						[
							[{'label': '', class: 'empty w25'}],
							[{'label': '', class: 'mdkeyboard-key empty'}],
							// [{'label': "", special: 'alt', attribute_field: 'mdkeyboard-key-action', attribute_value: 'alt'}], // alt
							[',', ',', '', ''],
							// ['@', '@', '', ''],
							// [{'label': ".com", special: 'com', class: ''}],
							[{'label': '', string: ' ', attribute_field: 'mdkeyboard-key-action', attribute_value: 'space'}], // space
							['.', '.', '', ''],
							[{'label': 'Fin.', special: 'check', attribute_field: 'mdkeyboard-key-action', attribute_value: 'check'}], // check
							// [{'label': 'Limpiar campo', special: 'clear', attribute_field: 'mdkeyboard-key-action', attribute_value: 'clear'}] // clear
						]
					],
					numeric: [
						[
							['7', '7', '', ''],
							['8', '8', '', ''],
							['9', '9', '', ''],
						],
						[
							['4', '4', '', ''],
							['5', '5', '', ''],
							['6', '6', '', ''],
						],
						[
							['1', '1', '', ''],
							['2', '2', '', ''],
							['3', '3', '', ''],
						],
						[
							[{'label': '', class: 'empty'}],
							[{'label': '', special: 'backspace', attribute_field: 'mdkeyboard-key-action', attribute_value: 'backspace'}], // backspace
							['0', '0', '', ''],
							[{'label': 'Fin.', special: 'check', attribute_field: 'mdkeyboard-key-action', attribute_value: 'check'}], // check
						]
					]
				};
	},

	// Devuelve si existe el evento en la ventana
	_hasEvent: function (event) {
		return (('on' + event) in window);
	}

};

// Evento de carga
window.addEventListener('load', function(e) { mdkeyboard.init(); }, false);
