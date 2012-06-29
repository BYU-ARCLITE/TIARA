<?php
$conf_files = array("user_passwords.conf");
include 'password_protect_page.php'; //uncomment to turn on password protection

// Date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
// always modified
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
// HTTP/1.0
header("Pragma: no-cache");
?>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="icon" href="images/favicon.png"/>
<link href="scripts/readermain.css" rel="stylesheet" type="text/css"/>
<title>Annotated Reader Authoring Application</title>
<script src="scripts/jquery.js"></script>
<script src="scripts/jqueryui.js"></script>
<script>
function newDoc(){window.location.assign('./authordoc.php');}
function editDoc(){
	var docsel = document.getElementById('doclist'),
		docname = docsel.value+"&";
	if(docsel.selectedIndex<0){alert("Please select a document.");return;}
	window.location.assign((docname == "New Document")?'./authordoc.php':'./authordoc.php?data='+docname);
}
function openDoc(){
	var docsel = document.getElementById('doclist'),
		docname = docsel.value+"&",
		docmode = document.getElementById('docmode').value;
	if(docsel.selectedIndex<0){alert("Please select a document.");return;}
	switch(docmode){
		case '3': docname+='&popup=true';
		case '1': docname+='&thumbnails=true';
			break;
		case '2': docname+='&popup=true';
	}
	window.location.assign('./?data='+docname);
}
function delDoc(){
	var docsel = document.getElementById('doclist'),
		docname = docsel.value.replace("/","\\"),
		index = docsel.selectedIndex;
	if(index<0){alert("Please select a document.");return;}
	if((docname != "New Document") && confirm("Are you sure you want to delete " + docsel.options[index].text + "?")){
		$.ajax({
			type: 'POST',
			url: 'saveJSON.php', //php script to save the data
			data: {mode:'delete',fname:docname}, //filename and JSON stringified Content object
			success: function(data, textStatus, XMLHttpRequest){
				if(parseInt(data)){
					docsel.remove(index);
				}else{
					alert("Error: file removal failed. You do not have permission to delete this document.");
				}
			}
		});
	}
}
</script>
</head>
<body>
<div id="center">
	<div id="splash" class="dP" style="position:absolute; top:10px; height: 61px;"><img style="position:relative;left:-12px;" src="images/splash.png"></div>
	<div id="nav" class="dP" style="position:absolute;top:76px;height:52px;background:url('images/bar.png');border-left:solid 1px #666;border-right:solid 1px #666;">
		<span style="position:absolute;left:780px;top:13px;width:250px;"><a href="help.html">Help with Reading.</a> | <a href="authorhelp.html">Help with Editing.</a></span>
		<span style="position:absolute;left:870px;top:33px;width:140px;"><a href="logout.php">Logout</a>.</span>
	</div>
	<div id="app" class="dP" style="position:absolute;top:128px;">
		<div id="appBorder" style="position:relative;top:0px;left:0px;width:100%;border-top:none;">
			<center>
				<table id="theTable" style="position:relative;overflow:hidden;">
					<tr>
						<td id="myDiv" style="height:520px;padding:20px; text-align:center;" valign="top">
							<button onclick="newDoc();">NEW DOCUMENT</button><br/>
							<button onclick="sortDocs();" id="sortbutton" style="font-size:8pt;">Sort by Author</button><br/>
							<select id="doclist" style="width:200px;" size=20>
							<!--<option selected>New Document</option>-->
							<?php
								// open the current directory
								$dhandle = opendir('docs');
								if ($dhandle) {
									// loop through all of the files
									while (false !== ($dname = readdir($dhandle))){
										if(substr($dname, 0, 1) == ".") continue;
										if(is_dir("docs/$dname")){
											$fhandle = opendir("docs/$dname");
											if ($fhandle) {
												// loop through all of the files
												while (false !== ($fname = readdir($fhandle))) {
													// if it's a data file, output it.
													if (preg_match('/\.json$/',$fname)) {
														$basename = implode('.',explode('.',$fname,-1));
														echo "<option value=\"$dname/$basename\">$dname: $basename</option>\n";
													}
												}
												// close the directory
												closedir($fhandle);
											}
										}else{ // if it's a data file, output it.
											if (preg_match('/\.json$/',$dname)) {
												$basename = implode('.',explode('.',$dname,-1));
												echo "<option value=\"$basename\">$basename</option>\n";
											}
										}
									}
									// close the directory
									closedir($dhandle);
								}
							?>
							</select><br/><button onclick="openDoc();">OPEN IN READER</button><br/>
							<select id="docmode">
								<option value="0">Normal Mode</option>
								<option value="1">Thumbnail Mode</option>
								<option value="2">Popup Mode</option>
								<option value="3">Popup with Thumbnails</option>
							</select><br/>
							<button onclick="delDoc();">DELETE DOCUMENT</button><button onclick="editDoc();">EDIT DOCUMENT</button>							
						</td>
					</tr>
				</table>
			</center>
			<div style="width:100%;">
				<div style="position:relative;width:387px;height:19px;float:left;background:url(images/des.png)"></div>
				<span style=" position:relative; top:1px; text-align:right;  width: 140px; "><a  style="color:#000; text-decoration:none;"href="credits.html">Credits</a></span>
			</div>
		</div>
	</div>
</div>
<script language="JavaScript" type="text/javascript">
var sortorder = 1,
	sortbutton = document.getElementById('sortbutton'),
	els = document.getElementById('doclist').options,
	len = els.length;
	
function resizeApp(){
	var viewportheight,viewportwidth;
  	if(typeof window.innerHeight != 'undefined'){
	//	viewportheight = window.innerHeight;
		viewportwidth = window.innerWidth;
	}else if(
		typeof document.documentElement != 'undefined' &&
		typeof document.documentElement.clientHeight != 'undefined' &&
		document.documentElement.clientHeight != 0
	){
 	//	viewportheight = document.documentElement.clientHeight;
		viewportwidth = document.documentElement.clientWidth;
	}else{
	//	viewportheight = document.getElementsByTagName('body')[0].clientHeight;
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
	}
	document.getElementById("center").style.left = Math.max((viewportwidth/2)-505,0) + "px";
}

function sortDocs(){
	var i,opts = [];
	for(i=0;i<len;i++){opts[i] = [els[i].text,els[i].value];}
	opts.sort(sortorder?function(a,b){
		var as = a[0].split(': ',2),
			bs = b[0].split(': ',2);
		return (as[1] || as[0]).toLowerCase()>(bs[1] || bs[0]).toLowerCase()?1:-1;
	}:null);
	sortorder = !sortorder;
	sortbutton.innerText = sortorder?"Sort by Title":"Sort by Author";
	for(i=0;i<len;i++){els[i] = new Option(opts[i][0],opts[i][1]);}
}

////////////		RUNTIME
//////////// Jquery function that is the same as body.onload, but with Jquery functionality
$(document).ready(function(){
	sortDocs();
	resizeApp();
});
$(window).resize(resizeApp);
</script>
</body>
</html>