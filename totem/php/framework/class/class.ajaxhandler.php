<?php 

/**
*	Acciones del backend
*/
class AjaxHandler
{
	private $params;
	private $case;
	private $fw;

	function __construct($fw, $case)
	{
		$this->fw 	= $fw;
		$this->case = $case;

		$this->parseParameters();
	}

	private function parseParameters()
	{
		if (isset($_POST[$this->case]))
		{
			$this->params = $_POST;
		}
	}

	public function listen($case, $callback)
	{
		if ($case == $this->params[$this->case])
		{
			$r = [];

			$aux = $callback($this->params, $r, $this->fw);

			$r = (($aux != null)? $aux : $r);

			// Return
			$this->returnData($r);
		}
	}

	private function returnData($r)
	{
		header('Content-Type: application/json');
		die(json_encode($r));
	}
}