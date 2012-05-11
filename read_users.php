<?php
function read_users($comment,$config_files){
	foreach($config_files as $config_file){
		$fp=fopen($config_file,"r");
		while(!feof($fp)){
			$line=fgets($fp);
			if($line && !preg_match("/^$comment/",$line)){
				$pieces = explode("\t",$line);
				$username = trim($pieces[0]);
				$users[$username]=trim($pieces[1]);
			}
		}
		fclose($fp);
	}
	return $users;
}

function read_all($comment,$config_files){ //includes e-mails
	foreach($config_files as $config_file){
		$fp=fopen($config_file,"r");
		while(!feof($fp)){
			$line=fgets($fp);
			if($line && !preg_match("/^$comment/",$line)){
				$pieces = explode("\t",$line);
				$users[trim($pieces[0])]=array(trim($pieces[1]),count($pieces)>2?trim($pieces[2]):'');
			}
		}
		fclose($fp);
	}
	return $users;
}
?>