<?php
# Simple password protection
# Include this file at the top of a php page to protect it.

include "read_users.php";
$users = read_users("#",$conf_files);

session_start();

if(isset($_POST['n_account']) && $_POST['n_account']==true){
	include "create_account.php";
	exit;
}

if(!isset($_SESSION['user'])){
	if(isset($_POST['u_password'])){$u_password = $_POST['u_password'];}
	if(isset($_POST['u_name'])){
		$u_name = $_POST['u_name'];

		if(isset($_SESSION['adb_password'])){ //check to see if we're already logged in
			if($u_name != $_SESSION['user'] || $users[$u_name] != $_SESSION['adb_password']){
				login_error($_SERVER['HTTP_HOST'],$_SERVER['PHP_SELF']);
			}
		}else{ //log us in
			if(!$u_name || !isset($users[$u_name]) || $users[$u_name] != $u_password){ //password doesn't match user name
				login_error($_SERVER['HTTP_HOST'],$_SERVER['PHP_SELF']);
			}else{
				$_SESSION['adb_password'] = $user_password;
				$_SESSION['user'] = $u_name;
			}
			$page_location = $_SERVER['PHP_SELF'];
			if(isset($_SERVER["QUERY_STRING"])){$page_location .= "?".$_SERVER["QUERY_STRING"];}
			header("Location: ". $page_location);
		}
	}else{ //no current session and no user name provided
		authentication_required();
	}
}else{ //if $_SESSION['user'] is set, make sure they're in the right group
	if(!isset($users[$_SESSION['user']])){
		authentication_required();
	}
}

function login_error($host,$php_self){
	?>
	<html><head>
	<title>$host :  Administration</title>
	</head><body bgcolor=#ffffff>
	<table border=0 cellspacing=0 cellpadding=0 width=100%>
		 <tr><TD align=left>
		 <font face=verdana size=2><B>  You Need to log on to access this part of the site! </b> </font></td>
		 </tr></table>
	<P></P>
	<font face=verdana size=2>
	<center>
	"Error: You are not authorized to access this part of the site!
	<B><a href=<?php
		$page_location = $_SERVER['PHP_SELF'];
		if(isset($_SERVER["QUERY_STRING"])){$page_location .= "?".$_SERVER["QUERY_STRING"];}
		echo $page_location;
		?>>Click here</a></b> to login again.<P>
	</center>
	</font>
	</body>
	</html>
	<?php

	unset($_SESSION['adb_password']);
	unset($_SESSION['user']);
	exit;
}

function authentication_required(){?>
<html>
	<head>
		<title><?php echo $_SERVER['HTTP_HOST']; ?> : Authentication Required</title>
	</head>
	<body bgcolor=#ffffff>
		<table border=0 cellspacing=0 cellpadding=0 width=100%>
			 <tr><td>
			 <font face="verdana" size=2><B>(Access Restricted to Authorized Personnel)</b></font>
			 </td></tr>
		</table>
		<br/><br/>
		<center>
			<?php
				$form_to = "http://$_SERVER[HTTP_HOST]$_SERVER[PHP_SELF]";
				if(isset($_SERVER['QUERY_STRING'])){$form_to .= "?". $_SERVER['QUERY_STRING'];}
			?>
			<form method="post" action="<?php echo $form_to; ?>">
				<table border=0 width=350>
					<tr>
						<td><font face="verdana" size=2><B>User Name</B></font></td>
						<td><input type="text" name="u_name" size=20></td>
					</tr><tr>
						<td><font face="verdana" size=2><B>Password</B></font></td>
						<td><input type="password" name="u_password" size=20></td>
					</tr><tr id="mailrow">
						<td><font face="verdana" size=2><B>E-mail</B></font></td>
						<td><input type="text" name="u_mail" size=20></td>
					</tr><tr>
						<td><font face="verdana" size=2><B>Create Account</B></font></td>
						<td><input id="newcheck" type="checkbox" name="n_account" onchange="toggle();"></td>
					</tr>
				</table>
				<input type="submit" value="Login">
			</form>
			<a href="change_password.php">Change Password</a>
		</center>
		<script>
		var mailform = document.getElementById("mailrow"),
			checkform = document.getElementById("newcheck");
		mailform.style.display = "none";
		function toggle(){
			mailform.style.display = checkform.checked?"table-row":"none";
		}
		</script>
	</body>
</html>
<?php

	unset($_SESSION['adb_password']);
	unset($_SESSION['user']);
	exit;
}

?>