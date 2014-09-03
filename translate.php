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
              'word' => trim($_POST['text']));

$options = array(
    'http' => array(
        'header'  => array("Content-type: application/x-www-form-urlencoded","Authorization: $translation_key"),
        'method'  => 'POST',
        'content' => http_build_query($data),
		'ignore_errors'=> true
    )
);
$context  = stream_context_create($options);
$body = file_get_contents($translation_endpoint, false, $context);

echo $body;
?>