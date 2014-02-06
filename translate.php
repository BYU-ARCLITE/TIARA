<?php
session_start();

if(!isset($_SESSION['user'])){
	http_response_code(403);
	die;
}

// For 4.3.0 <= PHP <= 5.4.0
if (!function_exists('http_response_code')){
	function http_response_code($code){
		header("X-PHP-Response-Code: $code", true, $code);
    }
}

include "apikeys.php";
$data = array('srcLang' => $_POST['source'],
              'destLang' => $_POST['target'],
              'word' => $_POST['text']);
$body = file_get_contents("$translation_endpoint?".http_build_query($data));
foreach($http_response_header as $header) {
	if ('HTTP/' === substr($header, 0, 5)) {
		list($version, $code, $phrase) = explode(' ', $header, 3);
		http_response_code((int) $code);
	} else {
		header($header);
	}
}
echo $body;
?>