<?php
session_start();

if(isset($_SESSION['user'])){
	$user = $_SESSION['user'];
	$link = '/'.$user.'/';
}else{
	$link = '/';
	$user = '/';
}
$fname = str_replace('\\\\','\\',$_POST['fname']);
switch($_POST['mode']){
	case 'delete':
		$path = 'docs/'.$fname;
		if(
			strpos($fname,'/')===false or //public files
			strpos($fname,$user)===0 //current user's files
		){
			if(file_exists($path.'.json')){echo unlink($path.'.json');}
			else{echo 1;}
		}else{echo 0;} //not allowed
		break;
	case 'save':
		$path = 'docs'.$link;
		if(!file_exists($path) or !is_dir($path)){mkdir($path);}
		$path .= $fname;
		$fh = fopen($path.'.json', 'w') or die("0 can't open file");
		$doc = str_replace('\\"','"',$_POST['content']);
		$doc = str_replace("\\'","'",$doc); /*HACK*/
		$doc = str_replace('\\\\','\\',$doc);
		fwrite($fh,$doc);
		fclose($fh);
		echo 1;
		break;
	case 'check':
		$path = 'docs'.$link.$fname;
		echo file_exists($path.'.json')?1:0;
}
?>