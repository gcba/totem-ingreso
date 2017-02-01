<?php
class Config
{
    public static $config = array(

        // DATABASE
        'db_server'       => '127.0.0.1',
        'db_user'         => 'root',
        'db_password'     => '',
        'db_name'         => 'totem_entrada',
        'db_engine'       => 'mysql',

        // MAIL
        'mail_smtp'       => 'smtp.buenosaires.gob.ar',
        'mail_username'   => '',
        'mail_password'   => '',
        'mail_port'       => '',
        'mail_fromemail'  => '',
        'mail_fromname'   => 'Totem ingreso',
        'mail_subject'    => 'INGRESO AL EDIFICIO',
        'mail_message'    => 'Hola {{nombre_empleado}}! {{nombre_visitante}} ingreso al edificio para verte.',

        // SLACK
        'slackBot'        => 'http://localhost:3000/api/v1/visitante/new'
    );

    // public static function set($key, $val)
    // {
    //     self::$config[$key] = $val;
    // }

    // Obtener un valor del config Config::get('indice');
    public static function get($key)
    {
        return self::$config[$key];
    }
}
