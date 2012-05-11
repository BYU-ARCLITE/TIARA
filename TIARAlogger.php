<?php
ini_set("display_errors", "1");

$con = mysql_connect("host", "username", "password") or die('Could not connect: ' . mysql_error());
mysql_select_db("database",$con);
mysql_query("SET NAMES utf8");

//Insert
$type=$_POST["type"];
$data=$_POST["data"];
$document=$_POST["doc"];
$page=$_POST["page"];
session_start();

$user = isset($_SESSION['user'])?$_SESSION['user']:$_SERVER['REMOTE_ADDR'];
if(mysql_query("INSERT INTO TIARA_LOG (TYPE, DATA, DOCUMENT, PAGE, USER) VALUES ('$type', '$data', '$document', $page, '$user')")){
	echo "Saved log.";
}else if(mysql_query("INSERT INTO TIARA_LOG (TYPE, DATA, DOCUMENT, PAGE, USER) VALUES ('$type', '', '$document', $page, '$user')")){
	echo "Saved log with data errors.";
}else{
	echo mysql_error();
}
mysql_close($con);
?>


