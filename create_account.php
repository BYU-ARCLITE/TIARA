<?php
if(isset($_POST['u_password']) && isset($_POST['u_name'])){ //try to create account
	$u_name = $_POST['u_name'];
	if(array_key_exists($u_name,$users)){ //re-set password
		 header('Location: change_password.php' );
		 exit;
	}else{ //make an entirely new account
		$u_pass = $_POST['u_password'];
		$u_mail = $_POST['u_mail'];
		
		$to = $users['admin'][1];
		$subject = "TIARA Account Request";
		$from = "no-reply@byu.edu";
		$headers = "From: no-reply@byu.edu";
		$message = "Account Request:\n\nUsername:\t$u_name\nPassword:\t$u_pass\nContact Address:\t$u_mail";
		mail($to,$subject,$message,$headers);
	?>
	<html>
	<head>
		<title><?php echo $_SERVER['HTTP_HOST']; ?> : Creating Account</title>
	</head>
	<body bgcolor=#ffffff>
		<center>
		<h2>Account Request Logged for <?php echo $u_name ?></h2>
		<a href="authorhome.php">Return to Document List</a>
	<?php
	}
}else{
	?>
	<html>
	<head>
		<title><?php echo $_SERVER['HTTP_HOST']; ?> : Creating Account</title>
	</head>
	<body bgcolor=#ffffff>
		<center>
		<b>Error: No Account Data Provided</b>
	<?php
}
?>
	</center>
</body>
</html>
