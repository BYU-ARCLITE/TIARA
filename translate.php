<?php
session_start();

if(!isset($_SESSION['user'])){
	http_response_code(403);
	die;
}

include "apikeys.php";

$source = $_POST['source'];
$target = $_POST['target'];
$text = urlencode($_POST['text']);
echo file_get_contents("https://www.googleapis.com/language/translate/v2?source=$source&target=$target&q=$text&key=$googleKey");