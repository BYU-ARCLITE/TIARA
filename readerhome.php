<?php
$conf_files = array("user_passwords.conf","reader_passwords.conf");
include 'password_protect_page.php'; //uncomment to turn on password protection
include 'home_header.php';
?>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="icon" href="images/favicon.png"/>
<link href="css/readermain.css" rel="stylesheet" type="text/css"/>
<title>Annotated Reader Authoring Application</title>
<script src="scripts/jquery.js"></script>
<script src="scripts/jqueryui.js"></script>
<script>
var	authmap = {<?php
foreach($doc_array as $author => $doclist){
	echo "$author:['".implode("','",$doclist)."'],";
}
?>_:''};
</script>
<script src="scripts/home.js"></script>
</head>
<body>
<div id="center">
	<div id="splash" class="dP" style="position:absolute; top:10px; height: 61px;"><img style="position:relative;left:-12px;" src="images/splash.png"></div>
	<div id="nav" class="dP" style="position:absolute;top:76px;height:52px;background:url('images/bar.png');border-left:solid 1px #666;border-right:solid 1px #666;">
		<span style="position:absolute;left:850px;top:13px;width:140px;">Need help? Click <a href="help.html">here</a>.</span>
		<span style="position:absolute;left:870px;top:33px;width:140px;"><a href="logout.php">Logout</a>.</span>
	</div>
	<div id="app" class="dP" style="position:absolute;top:148px;">
		<div id="appBorder" style="position:relative;top:0px;left:0px;width:100%;border-top:none;">
			<center>
				<table id="theTable" style="position:relative;overflow:hidden;text-align:center;">
					<tr>
						<td id="myDiv" valign="top" colspan="6">
							<button id="openbutton">OPEN IN READER</button><br/>
							<select id="docmode">
								<option value="0">Normal Mode</option>
								<option value="1">Thumbnail Mode</option>
								<option value="2">Popup Mode</option>
								<option value="3">Popup with Thumbnails</option>
							</select>
						</td>
					</tr>
					<tr>
						<td colspan="2"><h3>Authors</h3></td>
						<td colspan="2"><button id="sortbutton" style="font-size:8pt;width:80pt;">Sort by Document</button></td>
						<td colspan="2"><h3>Documents</h3></td></tr>
					<tr>
						<td colspan="3">
							<select id="authlist" style="width:200px;" size=20>
							<?php foreach(array_keys($doc_array) as $author){
								echo "<option value=\"$author\">$author</option>\n";
							}?>
							</select>
						</td><td colspan="3">
							<select id="doclist" style="width:200px;" size=20></select>
						</td>
					</tr>
				</table>
			</center>
			<br/>
			<div style="width:100%;">
				<div style="position:relative;width:387px;height:19px;float:left;background:url(images/des.png)"></div>
				<span style=" position:relative; top:1px; text-align:right;  width: 140px; "><a  style="color:#000; text-decoration:none;"href="credits.html">Credits</a></span>
			</div>
		</div>
	</div>
</div>
</body>
</html>