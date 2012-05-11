<!doctype html>
<html>
<head>
<title>Change Password</title>
</head>
<body>
<?php
include "read_users.php";

$group_files = array("user_passwords.conf","reader_passwords.conf");

function save_config($file,$users){
	$fp=fopen($file,"w");
	foreach($users as $user => $pass){
		fwrite($fp,"$user\t$pass[0]".($pass[1]==''?"\n":"\t$pass[1]\n"));
	}
	fclose($fp);
}

session_start();
//$users = read_users("#",$conf_files);
unset($_SESSION['adb_password']);
unset($_SESSION['user']);

if(isset($_POST['name']) && isset($_POST['o_pass']) && isset($_POST['n_pass'])){
	$name = $_POST['name'];
	$o_pass = $_POST['o_pass'];
	$n_pass = $_POST['n_pass'];
	foreach($group_files as $file){
		$users = read_all("#",array($file));
		if(isset($users[$name]) && $users[$name][0] == $o_pass){
			$users[$name][0] = $n_pass;
			save_config($file,$users);
			echo "<h2>Password Successfully Changed</h2></body></html>";
			exit;
		}
	}
	?>
	<font face=verdana size=2>
	<center>
	Error: Incorrect Username or Password
	<B><a href=<?php echo $_SERVER['PHP_SELF'] ?>>Click here</a></b> to login again.<P>
	</center>
	</font>
	<?php
}else{
	$form_to = "http://$_SERVER[HTTP_HOST]$_SERVER[PHP_SELF]";
	if(isset($_SERVER['QUERY_STRING'])){$form_to .= "?". $_SERVER['QUERY_STRING'];}
	?>
	<center>
		<form method="post" action="<?php echo $form_to; ?>">
			<table border=0 width=350>
				<tr>
					<td><font face="verdana" size=2><B>User Name</B></font></td>
					<td><input type="text" name="name" size=20></td>
				</tr><tr>
					<td><font face="verdana" size=2><B>Old Password</B></font></td>
					<td><input type="password" name="o_pass" size=20></td>
				</tr><tr id="mailrow">
					<td><font face="verdana" size=2><B>New Password</B></font></td>
					<td><input type="password" name="n_pass" size=20></td>
				</tr>
			</table>
			<input type="submit" value="Change Password">
		</form>
	</center>
	<?php
}
?>
</body>
</html>