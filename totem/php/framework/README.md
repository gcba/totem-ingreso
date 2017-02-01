# Framework PHP

Framework para manejo de request AJAX de JavaScript a PHP.  
Retorna en formato JSON.


### Version
0.5.0


### Tecnologías

* **PHP:** 5.3 o superior.
* **MySQL:** 5.5.49 o superior.


### Instalación  

1. Descargamos la carpeta del framework.  
2. La movemos a nuestro directorio de trabajo. Ej: "/var/www/html/my_app/php/**framework**"
3. Copiamos el archivo config al directorio de trabajo. Ej: "/var/www/html/my_app/php/**config.php**"
4. Incluimos el framework al archivo php principal.
    ```php
        // Hacemos un require del archivo.
        require_once 'framework/framework.php';
    ```
5. Listo!

**Nota:** Recorda cambiar los datos del config.php por los que correspondan a tu desarrollo.

### Ejemplos de uso

- Simple retorno desde php
    ```php
        /**
         *  'case': Es el parametro eviado desde js por POST en la clave 'h'.
         *  $params (Object): Objeto que contiene todos los parametros de la consulta.
         *  $r (Object): Objeto vacio para retornar los datos al JavaScript.
         *  $fw (Framework): Clase framework para llamar funciones internas desde la funcion.
         *  @return: Esta funcion devuelve en un Objecto en el indice ['params'] todos los
         *  parametros enviados en la consulta.
         */
        $fw->ajax->listen('case', function($params, $r, $fw)
        {
        	$r['params'] = $params;
        	return $r;
        });
    ```

- Consulta a base de datos y retorno a JavaScript por JSON
    ```php
        /**
         *  @return: Devuelve todos los empleados de la tabla.
         */
        $fw->ajax->listen('obtenerEmpleados', function($params, $r, $fw)
        {
        	$r = $fw->db->query('SELECT * FROM empleado');
        	return $r;
        });
    ```
    
### Dependencias

Este framework no posee dependencias.


### Todos

    - Aplicar consultas seguras (Login o tokens).
    - Politicas de acceso de origen.
    - Optimizar la POO.
 

### License
**GCBA**
