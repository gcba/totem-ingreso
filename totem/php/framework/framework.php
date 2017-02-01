<?php

require_once 'phpmailer/PHPMailerAutoload.php';

require_once 'config.php';
require_once 'class/class.crypto.php';
require_once 'class/class.dbhandler.php';
require_once 'class/class.ajaxhandler.php';
require_once 'class/class.notify.php';
require_once 'class/class.mail.php';


class Framework
{
	public $db;
	public $ajax;
	public $crypto;
	public $mail;
	public $notify;

	function __construct()
	{
		$this->db 		= new DBHandler($this);
		$this->ajax 	= new AjaxHandler($this, 'h');
		$this->crypto = new Crypto();
		$this->notify = new notify($this);
		$this->mail 	= new Mail();
	}
}

// Se inicializa el framework
$fw = new Framework();
