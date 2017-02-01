function isNodeElement(object){
	/**
	 * Chequea si un objeto enviado es o no un DOM node
	 * @param 	{Object} object
	 * @return 	{boolean}
	 */


	return (
		typeof Node === "object" ? object instanceof Node : 
		object && typeof object === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string"
	);
}



function isDOMElement(object){
	/**
	 * Chequea si un objeto enviado es o no un DOM element
	 * @param 	{Object} object
	 * @return 	{boolean}
	 */


	return (
		typeof HTMLElement === "object" ? object instanceof HTMLElement : //DOM2
		object && typeof object === "object" && object !== null && object.nodeType === 1 && typeof object.nodeName === "string"
	);
}



function triggerEvent(name, element)
{
	/**
	 * Simula un evento en un elemento
	 * @param 	{String} name, {DOM Element} element
	 * @return 	{void}
	 */


    if ('createEvent' in document)
    {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(name, false, true);
        element.dispatchEvent(evt);
    }
    else
        element.fireEvent('on' + name);
}



function getStyleDuration(style, element)
{
	/**
	 * Devuelve el tiempo que tarda la animación/transición en milisegundos
	 * @param 	{String} style, {DOM Element} element
	 * @return 	{int} miliseconds
	 */


	return ( parseFloat( window.getComputedStyle(element).getPropertyValue(style + '-duration') ) * 1000 );
}



function getAbsoluteHeight(element)
{
	/**
	 * Devuelve el alto absoluto de un elemento
	 * @param 	{DOM element} element
	 * @return 	{int} height
	 */


	var styles = window.getComputedStyle(element),
		margin = parseFloat( styles['marginTop'] ) + parseFloat( styles['marginBottom'] );


	return Math.ceil( element.offsetHeight + margin );
}



function getObjectLength(object)
{
	/**
	 * Devuelve el largo de un objeto
	 * @param 	{Object} object
	 * @return 	{int} size
	 */


	var size = 0;


	if (typeof Object === 'function')
		size = Object.keys(object).length;
	// Fix IE < 9
	else
		for (var key in object)
			if (object.hasOwnProperty(key))
				size++;


	return size;
}



function getVerticalScrollBarWidth()
{
	/**
	 * Devuelve el ancho del scroll vertical
	 * @return 	{int} width
	 */


	var inner = window.document.createElement('p');
		inner.style.width 		= '100%';
		inner.style.height 		= '200px';

	var outer = window.document.createElement('div');
		outer.style.position 	= 'absolute';
		outer.style.top 		= '0px';
		outer.style.left 		= '0px';
		outer.style.width 		= '200px';
		outer.style.height 		= '150px';
		outer.style.overflow 	= 'hidden';
		outer.style.visibility 	= 'hidden';
		outer.appendChild(inner);

	window.document.body.appendChild(outer);

	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;

	if (w1 == w2)
		w2 = outer.clientWidth;

	window.document.body.removeChild(outer);

	return (w1 - w2);
}
/* ========================================================================
 * 	DOCUMENT EVENTS
 * ======================================================================== */

	window.document.addEventListener('DOMContentLoaded', function(e){
		/**
		 * Función de carga del documento, llama a la funciones y eventos iniciales.
		 * @param 	{Object} e
		 * @return 	{void}
		 */

		// Prevengo otros eventos
		e.preventDefault();


		// Llamo a la función para iniciar los input
		inputPlugin.init();


		// Evento que se ejecuta cuando un elemento es insertado
		window.document.addEventListener('DOMNodeInserted', function(e){ onDOMNodeInserted } , false);


		// Remuevo el evento de load
		window.document.removeEventListener('DOMContentLoaded', function(){});
	}, true);


	function onDOMNodeInserted(e)
	{
		/**
		 * Se llama cuando un elemento es insertado en el documento
		 * @param 	{event} e
		 * @return 	{void}
		 */

		if(e.target instanceof Element)
		{

			// Dropdown
			inputPlugin.init();

		}
	}





/* ========================================================================
 * 	INPUT
 * ======================================================================== */

 	var inputPlugin = {

 		init: function() {
			/**
			 * Inicio del plugin de input
			 * @return 	{void}
			 */


 			/* #inputTextfields */
			this.loadInputTextfields();


 			/* #inputFiles */
			this.loadInputFiles();

 			/* #inputSelects */
			this.loadInputSelects();
 		},


 	/* #inputTextfields */
 		loadInputTextfields: function() {
			/**
			 * Carga los input textfield
			 * @return 	{void}
			 */

			var _inputs = window.document.getElementsByClassName('input-group');


			for (var i = 0; i < _inputs.length; i++)
			{
				var _textfield = _inputs[i].getElementsByClassName('input-textfield')[0];


				// Compruebo que el textfield sea un DOM Element
				if(isDOMElement(_textfield))
				{
					// Agrego los listeners
					_textfield.addEventListener('focus', inputPlugin.textfieldEventsHandler, false);
					_textfield.addEventListener('blur', inputPlugin.textfieldEventsHandler, false);
					_textfield.addEventListener('keyup', inputPlugin.textfieldEventsHandler, false);
					_textfield.addEventListener('keydown', inputPlugin.textfieldEventsHandler, false);


					// Agrego el character count si tiene max length
					// if(_textfield.hasAttribute('maxlength'))
					// {
					// 	var span = window.document.createElement('span');
					// 		span.classList.add('input-character-counter-label');
					// 		span.innerHTML = '0/' + _textfield.getAttribute('maxlength');

					// 		_textfield.parentNode.appendChild(span);


					// 	// Clean
					// 		span = null;
					// }


					// Compruebo si es válido
					inputPlugin.isValidTextfield(_textfield);


					// Actualizo el character count si tiene max length
					inputPlugin.updateCharacterCounter(_textfield);
				}


				// Clean
					_textfield = null;
			}


			// Clean
				_inputs = null;
 		},

 		textfieldEventsHandler: function(e) {
			/**
			 * Handler para los event listener del textfield
			 * @param 	{event} e
			 * @return 	{void}
			 */

			switch(e.type)
			{
				case 'focus':
					this.classList.add('focus');
				break;

				case 'blur':
					this.classList.remove('focus');
				break;

				case 'keyup':
					// Compruebo si es válido
					inputPlugin.isValidTextfield(this);
				break;

				case 'keydown':
					// Actualizo el character count si tiene max length
					inputPlugin.updateCharacterCounter(this);

					// if(this.nodeName.toLowerCase() == 'textarea')
					// 	inputPlugin.updateTextareaSize(this);
				break;
			}
 		},

 		isValidTextfield: function(_textfield) {
			/**
			 * Comprueba si un textfield es valido
			 * @param 	{DOM element} _textfield
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				if(_textfield.value != '')
					_textfield.classList.add('valid');
				else
					_textfield.classList.remove('valid');


				// Clean
					_textfield = null;
			}
 		},

 		updateCharacterCounter: function(_textfield) {
			/**
			 * Actualiza el character counter
			 * @param 	{DOM element} _textfield
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				// Si el textfield tiene el atributo maxlength
				if(_textfield.hasAttribute('maxlength'))
				{
					var	span = _textfield.parentNode.getElementsByClassName('input-character-counter-label')[0];


					// Compruebo que el span no sea nulo ni indefinido
					if(span != null && typeof span !== 'undefined')
					{
						setTimeout(function(){
							var currentLength 	= _textfield.value.length,
								maxLength 		= _textfield.getAttribute('maxlength');


							// Actualizo el texto
							span.innerHTML = currentLength + '/' + maxLength;


							// Si se alcanzó el máximo o no
							if(currentLength == maxLength)
							{
								span.classList.add('maxlength');
								_textfield.classList.add('maxlength-error');
							}
							else
							{
								span.classList.remove('maxlength');
								_textfield.classList.remove('maxlength-error');
							}



							// Clean
								_textfield = span = currentLength = maxLength = null;
						}, 5);
					}
				}
			}
 		},

 		updateTextareaSize: function(_textfield) {
			/**
			 * Resizea el textarea según el alto del contenido
			 * @param 	{DOM element} _textfield
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				setTimeout(function(){
	 				_textfield.style.height = 'auto';
	 				_textfield.style.height = _textfield.scrollHeight + 'px';
					

					// Clean
						_textfield = null;
				}, 100);
			}
 		},

 		addError: function(_textfield, text) {
			/**
			 * Le agrega la clase de error al textfield enviado por parámetro
			 * @param 	{DOM element} _textfield, {string} text
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				// Compruebo que el text no sea nulo ni indefinido
				if(text != null && typeof text !== 'undefined')
				{
					// Compruebo que el text no esté vacío
					if(text.trim() != '')
					{
						var span = window.document.createElement('span');
							span.classList.add('input-error-label');
							span.innerHTML = text;

							_textfield.parentNode.appendChild(span);


						// Clean
							span = null;
					}
				}
			}


			// Clean
				_textfield = text = null;
 		},

 		modifyError: function(_textfield, text) {
			/**
			 * Le agrega la clase de error al textfield enviado por parámetro
			 * @param 	{DOM element} _textfield, {string} text
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				// Compruebo que el text no sea nulo ni indefinido
				if(text != null && typeof text !== 'undefined')
				{
					// Compruebo que el text no esté vacío
					if(text.trim() != '')
					{
						var span = _textfield.parentNode.getElementsByClassName('input-error-label')[0];


						// Compruebo que el span no sea nulo ni indefinido
						if(span != null && typeof span !== 'undefined')
							span.innerHTML = text;


						// Clean
							span = null;
					}
				}
			}


			// Clean
				_textfield = text = null;
 		},

 		showError: function(_textfield) {
			/**
			 * Muestra el error del textfield enviado por parámetro
			 * @param 	{DOM element} _textfield
			 * @return 	{void}
			 */

			 console.log('tengo error')
			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				// Agrego la clase del error
				_textfield.classList.add('input-error');

			}
 		},

 		hideError: function(_textfield) {
			/**
			 * Oculta el error del textfield enviado por parámetro
			 * @param 	{DOM element} _textfield
			 * @return 	{void}
			 */


			// Compruebo que el textfield sea un DOM Element
			if(isDOMElement(_textfield))
			{
				// Agrego la clase del error
				_textfield.classList.remove('input-error');

			}
 		},


 	/* #inputFiles */
 		loadInputFiles: function() {
			/**
			 * Carga los input file
			 * @return 	{void}
			 */

			var _inputs = window.document.getElementsByClassName('input-group');


			for (var i = 0; i < _inputs.length; i++)
			{
				var _file 	= _inputs[i].getElementsByClassName('input')[0],
					_button = _inputs[i].getElementsByClassName('input-file')[0];

			
				// Compruebo que el file sea un DOM Element
				if(isDOMElement(_file))
				{
					// Agrego los listeners
					_file.addEventListener('change', inputPlugin.inputFileEventsHandler, false);
				}

				
				// Compruebo que el button sea un DOM Element
				if(isDOMElement(_button))
				{
					// Agrego los listeners
					_button.addEventListener('click', inputPlugin.inputFileEventsHandler, false);
				}


				// Clean
					_file = _button = null;
			}


			// Clean
				_inputs = null;
 		},

 		inputFileEventsHandler: function(e) {
			/**
			 * Handler para los event listener del input file
			 * @param 	{event} e
			 * @return 	{void}
			 */

			switch(e.type)
			{
				case 'change':
					var _wrapper = this.parentNode.getElementsByClassName('input-file-wrapper')[0];

					// Compruebo que el wrapper sea un DOM Element
					if(isDOMElement(_wrapper))
					{
						var _textfield = _wrapper.getElementsByClassName('input-textfield')[0];


						// Compruebo que el textfield sea un DOM Element
						if(isDOMElement(_textfield))
						{
							// Agarro los archivos del input file
							var files = this.files;


							// Reseteo el textfield
							_textfield.value = '';


							// Los recorro y los muestro
							for (var i = 0; i < files.length; i++)
							{
								_textfield.value += files[i].name;
								

								// Si hay más de uno y es el ante último, le agrego una coma
								if(files.length > 1 && i < files.length - 1)
									_textfield.value += ';  ';
							}
						}
					}
				break;

				case 'click':
					var _file = this.parentNode.getElementsByClassName('input')[0];
					

					// Compruebo que el file sea un DOM Element
					if(isDOMElement(_file))
					{
						// Le simulo un click
						triggerEvent('click', _file);
					}
				break;
			}
 		},


 	/* #inputSelects */
 		loadInputSelects: function() {
			/**
			 * Carga los input select
			 * @return 	{void}
			 */

			var _inputs = window.document.getElementsByClassName('input-group');


			for (var i = 0; i < _inputs.length; i++)
			{
				var _select = _inputs[i].getElementsByClassName('input-select')[0];

			
				// Compruebo que el select sea un DOM Element
				if(isDOMElement(_select))
				{
					// Agrego los listeners
					_select.addEventListener('change', inputPlugin.inputSelectEventsHandler, false);
				}


				// Compruebo si es válido
				inputPlugin.isValidTextfield(_select);


				// Clean
					_select = null;
			}


			// Clean
				_inputs = null;
 		},

 		inputSelectEventsHandler: function(e) {
			/**
			 * Handler para los event listener del input select
			 * @param 	{event} e
			 * @return 	{void}
			 */

			switch(e.type)
			{
				case 'change':
					// Valido el select
					inputPlugin.isValidTextfield(this);


					// Remuevo el error si es que tiene
					this.classList.remove('input-error');
				break;
			}
 		}

 	};
(function(){


/* *******************************************************************************************************************
*	FUNCIONES PRIVADAS
*/

	/**
	 * Función constructor
	 * @param 	{Object} arguments
	 * @return 	{void}
	 */
	this.Modal = function()
	{
		var defaults = {

			// Puede ser modal, snackbar
			type: 			'alert',

			// Nombre de modal
			name: 			'default',
			
			// Es un objeto que depende del contentType
			content: 		null,

			// Si es true, lo muestra ni bien se crea
			showOnStartup: 	false,

			// Si es true, lo destruye ni bien se oculta. Si se va a reutilizar se recomienda false
			destroyOnHide: 	false,

			// Variable para guardar si tiene algun error el modal
			hasError: 		false
		};


		// Agarro el body
		_body 			= window.document.getElementsByTagName('body')[0],
		this.element 	= null;


		// Si lo argumentos no son nulos y son un objeto los parseo
		if (arguments[0] && typeof arguments[0] === 'object')
			this.options = parseParameters.call(this, defaults, arguments[0]);
		// Sino dejo los default
		else
			this.options = defaults;


		// Llamo a la función para construir el modal
		build.call(this);
	}

	/**
	 * Parsea parámetros dados unos default y otras propiedades
	 * @param 	{Object} source, {Object} properties
	 * @return 	{Object} defaults
	 */
	function parseParameters(source, properties)
	{
		var defaults = {};


		// Parche para parsear parámetros
		for (var property in source)
			if (source.hasOwnProperty(property))
				defaults[property] = source[property];


		// Parseo de parámetros
		for (var property in properties)
			if (properties.hasOwnProperty(property))
				defaults[property] = properties[property];

		return defaults;
	}


	/**
	 * Constructor principal
	 * @return 	{void}
	 */
	function build()
	{
		var that 	= this;
			modal 	= null;


		// Si lo argumentos no son nulos y son un objeto los parseo
		if (that.options.content && typeof that.options.content === 'object')
			that.options.content = parseParameters.call(that, _defaultContent[that.options.type], that.options.content);
		// Sino dejo los default
		else
			that.options.content = _defaultContent[that.options.type];


		// Construyo el modal
		that.element = modal = buildModal.call(that);

		// Agrego el modal al body
		_body.appendChild(modal);


		// Si no hay errores
		if(!that.options.hasError)
			// Si lo tengo que mostrar al construir
			if(that.options.showOnStartup)
				that.show();
	}


	/**
	 * Constructor del modal
	 * @return 	{DOM Element} _modal
	 */
	function buildModal()
	{
		var that = this;

		// Modal
		var _modal = window.document.createElement('div');
			_modal.classList.add('modal');
			_modal.setAttribute('name', that.options.name);
			_modal.setAttribute('data-type', that.options.type);
			_modal.setAttribute('tabIndex', 1);

			if(that.options.type == 'options')
				_modal.setAttribute('data-content', that.options.content.type);

			_modal.addEventListener('click', function(e){
				
				// Puede que el target sea un objeto dentro del modal, yo quiero que sea el modal
				if(e.target == this)
					that.hide( Modal.response.cancel );

			}, false);

			_modal.addEventListener('keyup', function(e){

				// Escape
				if(e.keyCode == 27)
					that.hide(Modal.response.cancel);
				// Enter
				else if(e.keyCode == 13)
					that.hide(Modal.response.ok);

			}, false);

			// Modal container
			var _modalContainer = window.document.createElement('div');
				_modalContainer.classList.add('modal-container', 'col-md-10', 'col-xs-10');

				// Modal title
				if(that.options.content.title && that.options.content.title.trim() != '')
				{
					var _modalTitle = window.document.createElement('div');
						_modalTitle.classList.add('modal-title');
						_modalTitle.textContent = that.options.content.title;

					_modalContainer.appendChild(_modalTitle);
				}

				// Modal content
				var _modalContent = window.document.createElement('div');
					_modalContent.classList.add('modal-content');


					var content = null;

					switch(that.options.type)
					{
						case 'alert':
							content = buildAlert.call(this);
						break;

						case 'confirmation':
							content = buildConfirmation.call(this);
						break;

						case 'options':
							content = buildOptions.call(this);
						break;

						case 'custom':
							content = buildCustom.call(this);
						break;
					}

					_modalContent.appendChild( content );


				_modalContainer.appendChild(_modalContent);


				// Si el contenido del modal es tipo select
				if(that.options.content.type != 'select')
				{
					// Si no hay acciones, busco si le corresponden algunas por default
					if(getObjectLength(that.options.content.actions) == 0)
						that.options.content.actions = _defaultContent[that.options.type].actions;

					// Modal actions
					var _modalActions = window.document.createElement('div');
						_modalActions.classList.add('modal-actions');

						for(var action in that.options.content.actions)
						{
							var _modalAction = window.document.createElement('div');
								_modalAction.classList.add('modal-button');
								_modalAction.setAttribute('data-value', that.options.content.actions[action]);
								_modalAction.innerHTML = action.toUpperCase();
								_modalAction.addEventListener('click', function(){
									that.hide( parseInt(this.getAttribute('data-value')) );
								}, false);

								_modalActions.appendChild(_modalAction);
						}

					_modalContainer.appendChild(_modalActions);
				}

			_modal.appendChild(_modalContainer);

		return _modal;
	}


	/**
	 * Constructor los modal de tipo alerta
	 * @return 	{DOM Element} _alertContainer
	 */
	function buildAlert()
	{
		var that = this;

		// Alert container
		var _alertContainer = window.document.createElement('div');
			_alertContainer.classList.add('modal-alert-container');

			// Alert message
			var _alertMessage = window.document.createElement('div');
				_alertMessage.classList.add('modal-message');
				_alertMessage.innerHTML = that.options.content.message;

			_alertContainer.appendChild(_alertMessage);

		return _alertContainer;
	}


	/**
	 * Constructor de los modal de tipo confirmacion
	 * @return 	{DOM Element} _confirmationContainer
	 */
	function buildConfirmation()
	{
		var that = this;

		// Confirmation container
		var _confirmationContainer = window.document.createElement('div');
			_confirmationContainer.classList.add('modal-confirmation-container');

			// Confirmation message
			var _confirmationMessage = window.document.createElement('div');
				_confirmationMessage.classList.add('modal-message');
				_confirmationMessage.textContent = that.options.content.message;

			_confirmationContainer.appendChild(_confirmationMessage);

		return _confirmationContainer;
	}


	/**
	 * Constructor de los modal de tipo opciones
	 * @return 	{DOM Element} _optionsContainer
	 */
	function buildOptions()
	{
		var that = this;

		// Options container
		var _optionsContainer = window.document.createElement('div');
			_optionsContainer.classList.add('modal-options-container');

		// Options
		if(that.options.content.options != null)
		{
			// Checkeo los items seleccionados
			// if(that.options.content.itemsSelected && typeof that.options.content.itemsSelected === 'object')
			// 	if(that.options.content.itemsSelected.length == 0)
			// 		that.options.content.itemsSelected = [ 0 ];

			for (var i = 0; i < that.options.content.options.length; i++)
			{
				var content = '',
					_option = window.document.createElement('div');
					_option.classList.add('modal-option');


				switch(that.options.content.type)
				{
					case 'checkbox':
						content += '<div class="row">\
										<label class="input-group input-group-selector" for="' + that.options.name + '-checkbox-' + i + '">\
											<input class="form-input" type="checkbox" name="' + that.options.name + '-checkbox-' + i + '" id="' + that.options.name + '-checkbox-' + i + '"';

						if(that.options.content.options[i].isSelected)
							content += ' checked';

						content += 			'>\
											<span class="input-selector"></span>\
											<span class="input-label">' + that.options.content.options[i].value + '</span>\
										</label>\
									</div>';
					break;

					case 'radio':
						content += '<div class="row">\
										<label class="input-group input-group-selector" for="' + that.options.name + '-radio-button-' + i + '">\
											<input class="input" type="radio" name="' + that.options.name + '-radio" id="' + that.options.name + '-radio-button-' + i + '"';

						if(that.options.content.options[i].isSelected)
							content += ' checked';

						content += 			'>\
											<span class="input-selector"></span>\
											<span class="input-label">' + that.options.content.options[i].value + '</span>\
										</label>\
									</div>';

					break;

					case 'select':
						content += '<label class="modal-select-option">\
										<span class="modal-select-label">' + that.options.content.options[i] + '</span>\
									</label>';

						_option.setAttribute('data-value', i);
						_option.addEventListener('click', function(){
							_selectedOption = this.getAttribute('data-value');

							that.hide( Modal.response.ok );
						}, false);

					break;
				}

				_option.innerHTML = content;
				_optionsContainer.appendChild(_option);
			}
		}
		else
			that.options.hasError = true;


		return _optionsContainer;
	}


	/**
	 * Constructor de los modal de tipo custom
	 * @return 	{DOM Element} _customContainer
	 */
	function buildCustom()
	{
		var that = this;


		// Custom container
		var _customContainer = window.document.createElement('div');
			_customContainer.classList.add('modal-custom-container');


		// Html
		if(that.options.content.html != null)
			_customContainer.innerHTML = that.options.content.html;


		return _customContainer;
	}


	/**
	 * Devuelve la opción seleccionada en los modal de tipo opciones
	 * @return 	{DOM Element} _modal
	 */
	// function getSelectedOptions()
	// {
	// 	var that 			= this,
	// 		selectedOption 	= [];


	// 	// Si el contenido del modal es de tipo select
	// 	if(that.options.content.type == 'select')
	// 	{
	// 		// Agarro la opción seleccionada
	// 		selectedOption[0] = parseInt(_selectedOption);
	// 	}
	// 	// Sino la busco en los form-input
	// 	else
	// 	{
	// 		var options = that.element.getElementsByClassName('form-input');

	// 		for (var i = 0; i < options.length; i++)
	// 			if(options[i].checked)
	// 				selectedOption.push(i);
	// 	}


	// 	return selectedOption;
	// }


	/**
	 * #ward
	 * @return
	 */
	function updateOptions()
	{
		var that 	= this,
			options = that.element.querySelectorAll('.input-group-selector .input');


		// Si hay opciones ( para evitar bugs )
		if(options.length)
			// Recorro las opciones
			for (var i = 0; i < that.options.content.options.length; i++)
				// Añado al objeto la opción como key y si está seleccionada o no como value
				that.options.content.options[i].isSelected = options[i].checked;
	}


/* *******************************************************************************************************************
*	FUNCIONES PÚBLICAS
*/


	/**
	 * Muestra el modal
	 * @return 	{void}
	 */
	Modal.prototype.show = function()
	{
		var that = this;

		if(!that.options.hasError)
		{
			// Modifico el body para que no se mueva el contenido cuando se oculta la barra
			_body.style.overflow 		= 'hidden';
			// _body.style.paddingRight 	= getVerticalScrollBarWidth() + 'px';


			// Muestro el modal
			that.element.classList.add('show');


			setTimeout(function(){

				// Abro el modal con la animación
				that.element.classList.add('in');
				that.element.focus();

			}, 5);
		}
		else
			// Si está definido el callback y es una función lo llamo
			if(that.options.callback && typeof that.options.callback === 'function')
				that.options.callback.call(this, { response: Modal.response.error });
	}


	/**
	 * Oculta el modal
	 * @param 	{int} res
	 * @return 	{void}
	 */
	Modal.prototype.hide = function(res)
	{
		var that  	= this,
			
			// Guardo la respuesta en un objeto
			data 	= { response: res };


		if(!that.options.hasError)
		{
			// Obtengo la duracion de la transicion
			timer = getStyleDuration('transition', that.element);


			// Si es un modal de tipo opciones, busco la(s) opcion(es)
			if(data.response == Modal.response.ok && that.options.type == 'options')
			{
				data.options = that.getOptions();

				// Si las opciones son nulas es porque hay un error en las opciones
				if(data.options != null)
				{
					// Lo cierro con la animacion
					that.element.classList.remove('in');


					setTimeout(function(){

						// Oculto el modal
						that.element.classList.remove('show');

						// Vuelvo el body a su estado original
						// _body.style.paddingRight 	= '0px';
						_body.style.overflow 		= 'auto';

						// Si tiene la opción de "destruir al ocultar", lo destruyo
						if(that.options.destroyOnHide)
							that.destroy();

					}, timer);

					// Si está definido el callback y es una función lo llamo
					if(that.options.callback && typeof that.options.callback === 'function')
						that.options.callback.call(this, data);
				}
			}
			else
			{
				// Lo cierro con la animacion
				that.element.classList.remove('in');


				setTimeout(function(){

					// Oculto el modal
					that.element.classList.remove('show');

					// Vuelvo el body a su estado original
					// _body.style.paddingRight 	= '0px';
					_body.style.overflow 		= 'auto';

					// Si tiene la opción de "destruir al ocultar", lo destruyo
					if(that.options.destroyOnHide)
						that.destroy();

				}, timer);

				// Si está definido el callback y es una función lo llamo
				if(that.options.callback && typeof that.options.callback === 'function')
					that.options.callback.call(this, data);
			}


		}
		else
			// Si está definido el callback y es una función lo llamo
			if(that.options.callback && typeof that.options.callback === 'function')
				that.options.callback.call(this, data);
	}


	/**
	 * Destruye el modal
	 * @return 	{void}
	 */
	Modal.prototype.destroy = function()
	{
		var that = this;

		// Fix para prevenir errores
		// Si el body contiene al elemento, lo remuevo
		if(_body.contains(that.element))
			_body.removeChild(that.element);
	}


	/**
	 * Obtiene las opciones y si estan seleccionadas o no
	 * @return 	{array} options
	 // */
	Modal.prototype.getOptions = function()
	{
		var that 	= this,
			options = null;

		updateOptions.call(that);

		switch(that.options.content.type)
		{
			case 'checkbox':
				options = that.options.content.options;
			break;

			case 'radio':
				for(var option in that.options.content.options)
					if(that.options.content.options[option].isSelected)
						options = that.options.content.options[option];
			break;
		}

		return options;
	}


	/**
	 * Setea el array de opciones
	 * @return 	{array} options
	 // */
	Modal.prototype.setOptions = function(options)
	{
		var that = this;

		that.options.content.options = options;
		that.options.hasError = false;


		// Le agrego las opciones al contenido
		var modalContent = that.element.getElementsByClassName('modal-content')[0];
			modalContent.innerHTML = '';
			modalContent.appendChild( buildOptions.call(that) );
	}


	/**
	 * Setea el array de opciones
	 * @return 	{array} options
	 // */
	Modal.prototype.setHTML = function(html)
	{
		var that = this;

		that.options.content.html = html;
		that.options.hasError = false;


		// Le agrego las opciones al contenido
		var modalContent = that.element.getElementsByClassName('modal-content')[0];
			modalContent.innerHTML = '';
			modalContent.appendChild( buildCustom.call(that) );
	}


/* *******************************************************************************************************************
*	VARIABLES PUBLICAS
*/

	Modal.response = {
						error: 	-1,
						cancel:  0,
						ok: 	 1
					};


/* *******************************************************************************************************************
*	VARIABLES PRIVADAS
*/

	var _body 							= null,
		_defaultContent 				= [];
		_defaultContent['alert'] 		= { 
											message: 'Default message',
											actions: {
														ok: Modal.response.ok
													}
										},
		_defaultContent['confirmation'] = { 
											title: 'Default title',
											message: 'Default message',
											actions: {
														cancel: Modal.response.cancel,
														ok: Modal.response.ok
													}
										},
		_defaultContent['options'] 		= {
											// Puede ser radio o checkbox
											type: 'checkbox',
											title: 'Default title',
											options: [ 
														{
															value: 		'Option 1',
															isSelected: false
														},
														{
															value: 		'Option 2',
															isSelected: false
														}
													],
											actions: {
														cancel: Modal.response.cancel,
														ok: Modal.response.ok
													}
										},
		_defaultContent['select'] 		= {
											title: 'Default title',
											options: [ 'Option 1', 'Option 2' ]
										},
		_defaultContent['custom'] 		= {
											title: 'Default title',
											html: '<div>This is a div test</div>',
											actions: {
														cancel: Modal.response.cancel,
														ok: Modal.response.ok
													}
										};

}());