<?php 

/**
*	
*/
class DBHandler
{
	private $fw;
	private $c;

	function __construct($fw)
	{
		$this->fw = $fw;
	}

	private function connectDB()
	{
		$this->c = @mysqli_connect(Config::get('db_server'),Config::get('db_user'),Config::get('db_password'),Config::get('db_name'));
	}

	private function closeDB()
	{
		@mysqli_close($this->c);
		$this->c = null;
	}

	public function query($sql)
	{
		$this->connectDB();

		$return = [];

		if ($this->c) 
		{
			$result =  mysqli_query($this->c, $sql);

			$cont = 0;

		    if ($result)
		    {
		    	while($row = $result->fetch_assoc())
	          	{
		            foreach ($row as $key => $value)
		            {
		              $return[$cont][$key] = utf8_encode($value);
		            }
		            $cont++;
	          	}
		    }

		    $return['length'] = $cont;
		    $return['status'] = 1;
		}
		else
		{
			$return['status'] 	= 0;
			$return['desc']		= "No se pudo conectar a la base de datos.";
		}

		$this->closeDB();
		return $return;
	}

	public function insert($sql)
	{
		$this->connectDB();

		$return = [];

		if ($this->c) 
		{
			$result =  mysqli_query($this->c, $sql);

		    if ($result)
		    	$return['status'] = 1;
		    else
		    	$return['status'] = 0;
		}
		else
		{
			$return['status'] 	= 0;
			$return['desc']		= "No se pudo conectar a la base de datos.";
		}

		$this->closeDB();
		return $return;
	}
}