<?php

/**
*	Libreria de encryptacion.
*
*
*/
class Crypto
{
	private $pass = "Patata123456";
	private $characters = array("+", "/", "=");

	
	function __construct()
	{
		// Empty
	}


	/**
	 *	@Funcion: fnEncrypt
	 *	@Descripcion: Genera un base64 basado en un AES
	 *	@Param:
	 *			$sValue (String): Valor que se quiere encriptar.
	 *  @return: String
	 */
	private function fnEncrypt($sValue)
	{
		return rtrim(
        base64_encode(
            mcrypt_encrypt(
                MCRYPT_RIJNDAEL_128,
                $this->pass, $sValue, 
                MCRYPT_MODE_ECB, 
                mcrypt_create_iv(
                    mcrypt_get_iv_size(
                        MCRYPT_RIJNDAEL_128, 
                        MCRYPT_MODE_ECB
                    ), 
                    MCRYPT_RAND)
                )
            ), "\0"
        );
	}


	/**
	 *	@Funcion: getRandomKey
	 *	@Descripcion: Genera un token random de 8 caracteres alfanumerico.
	 *  @return: String
	 */
	public function getRandomKey()
	{
	    $phrase     = time().rand();

	    $crypted    = $this->fnEncrypt($phrase);
	    $crypted    = str_replace($this->characters, "", $crypted);
	    $crypted    = substr($crypted, 0, 8);

	    return $crypted;
	}
}