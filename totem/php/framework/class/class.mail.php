<?php

/**
*	Libreria de encryptacion.
*/
class Mail
{
	private $params = array();
	private $mail;


	function __construct()
	{
	}


	private function prepare()
	{
		// $this->mail->SMTPDebug = 3;	// Debug


		// Config
		$this->mail->isSMTP();
		$this->mail->Host = Config::get('mail_smtp');
		$this->mail->SMTPAuth = true;
		$this->mail->Username = Config::get('mail_username');
		$this->mail->Password = Config::get('mail_password');
		$this->mail->SMTPSecure = 'tls';
		$this->mail->Port = Config::get('mail_port');
		$this->mail->setFrom(Config::get('mail_fromemail'), Config::get('mail_fromname'));
		$this->mail->isHTML(true);

		if(!$this->mail->send())
		{
			// die('Mailer Error: ' . $this->mail->ErrorInfo);
			return false;
		}
		else
		{
		    return true;
		}
	}


	public function send($recipients, $subject = '', $message = '')
	{
		$this->mail = new PHPMailer;
		$this->mail->Subject 	= $subject;
		$this->mail->Body 		= $message;
		if (!is_array($recipients))
		{
			if (PHPMailer::validateAddress($recipients))
			{
				$this->mail->addAddress($recipients);

				return $this->prepare();
			}
			return false;
		}
		else
		{
			for ($i=0; $i < count($recipients); $i++)
				if (PHPMailer::validateAddress($recipients[$i]))
					$this->mail->addAddress($recipients[$i]);

			if (count($recipients) > 0)
				return $this->prepare();

			return false;
		}
	}
}

//$mail = new Mail();

//$mail->send(['manzanapplee@gmail.com', 'lfvillafranca@gmail.com','lucasr92@hotmail.com'], 'Oliwis :3', 'Testeando ando');
