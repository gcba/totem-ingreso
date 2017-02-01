<?php

/**
*	Acciones del backend
*/
class Notify
{
	private $fw;

	function __construct($fw)
	{
		$this->fw = $fw;
	}

	// UNICA FUNCION PUBLICA PARA ENVIAR LA NOTIFICACION
	public function send($idEmpleado, $id_tipo_doc, $numero_documento)
	{
		if (!$idEmpleado && !$id_tipo_doc && !$numero_documento) return false;


		$visitorName = $this->GetNombreVisitante($id_tipo_doc, $numero_documento);
		if (!$visitorName) return false;

		$slackName = $this->GetSlackById($idEmpleado);
		$mailData  = $this->GetMailById($idEmpleado);

		if ($slackName)
		{
			$this->SendToBot($slackName, $visitorName);
			return 'SLACK';
		}
		else if ($mailData)
		{
			$message = Config::get('mail_message');
			$message = str_replace("{{nombre_empleado}}", $mailData['nombre_apellido'], $message);
			$message = str_replace("{{nombre_visitante}}", $visitorName, $message);

			if($this->fw->mail->send($mailData['mail'], Config::get('mail_subject'), $message))
				return 'MAIL';
		}

		return 'NADA';
	}

	private function GetSlackById($idEmpleado)
	{
		$slackResult = $this->GetSourceById($idEmpleado);

		if ($slackResult['length']) return $slackResult[0]['slack'];

		return;
	}

	private function GetMailById($idEmpleado)
	{
		$mailResult = $this->GetSourceById($idEmpleado, 'mail');

		if ($mailResult['length']) return $mailResult[0];

		return;
	}

	private function SendToBot($slackName, $visitorName)
	{
		$post = array('slackName' => $slackName, 'visitorName' => $visitorName);

		$url = Config::get('slackBot');
		$data_json = json_encode($post);

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$res  = curl_exec($ch);
		curl_close($ch);
	}

	// Solo esta funcion hace una query a la base para optimizar la lectura del codigo.
	private function GetSourceById($idEmpleado, $source = 'slack')
	{
		$query = 'SELECT '. $source .', nombre_apellido FROM empleado WHERE id_empleado = '.$idEmpleado;

		return $this->fw->db->query($query);
	}

	private function GetNombreVisitante($id_tipo_doc, $numero_documento)
	{
		$query = 'SELECT nombre, apellido FROM visitante WHERE numero_documento = "'.$numero_documento.'" AND id_tipo_doc = '.$id_tipo_doc;

		$res = $this->fw->db->query($query);
		return ($res['length'])? $res[0]['nombre'].' '.$res[0]['apellido'] : null;
	}
}
