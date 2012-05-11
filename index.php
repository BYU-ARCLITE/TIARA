<?php
$conf_files = array("user_passwords.conf","reader_passwords.conf");
include 'password_protect_page.php'; //uncomment to turn on password protection
//var_dump($users);
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="icon" href="images/favicon.png"/>
<link href="scripts/readermain.css" rel="stylesheet" type="text/css"/>
<link href="scripts/jquery.contextMenu.css" rel="stylesheet" type="text/css"/>

<title>Annotated Reader Application</title>
<script src="scripts/jquery.js"></script>
<script src="scripts/jqueryui.js"></script>
<script src="scripts/xml2json.js"></script>

<!-- right click menu -->
<script src="scripts/jquery.contextMenu.js" type="text/javascript"></script>

<!-- get URL paramaters script -->
<script src="scripts/getURL.js"></script>

<!-- google translate script -->
<script type="text/javascript" src="http://www.google.com/jsapi"></script>
<script type="text/javascript">
	google.load("language", "1");
</script>

<script src="scripts/noselect.js"></script>
<script src="scripts/commonui.js"></script>
<script src="scripts/language_modules.js"></script>
<script src="scripts/readerui.js"></script>
<script src="scripts/readerinit.js"></script>

<!-- script for playing sound swf -->
<script type="text/javascript" src="scripts/soundMachine.js"></script>
</head>
<body>
<div id="center">
	<div id="splash" class="dP" style="position:absolute; top:10px; height: 61px;">
		<img style="position:relative; left:-12px;display:inline;" src="images/splash.png"/>
		<div style="position:relative; float:right; top:20px; width: 140px;">Need help? Click <a href="help.html" target="_blank">here</a>.</div>
		<div style="position:relative; float:right; clear:both; top:20px; width: 140px;"><a href="authorhome.php">Back to Document List</a>.</div>
	</div>
	<div class="dP" style="position:absolute; top:76px; height: 52px; background:url('images/bar.png'); border-left:solid 1px #666;border-right:solid 1px #666;">
		<span id="nav" style="width:70%;">
			<div id="textbutton" class="barImg">
				<span>TEXT</span>
			</div>
			<div id="imagebutton" class="barImg">
				<span>IMAGE</span>
			</div>
			<div id="audiobutton" class="barImg">
				<span>AUDIO</span>
			</div>
			<div id="videobutton" class="barImg">
				<span>VIDEO</span>
			</div>
			<div id="allbutton" class="barImg">
				<span>ALL</span>
			</div>
		</span>
		<div style="position:relative; font-weight:bold; text-align:right; top: 15px; height: 23px;z-index:0;">
			<span id="activeA">Select a blue word</span>&nbsp;
			<img id="ti" src="images/texticon.png" style="visibility:hidden;"/>&nbsp;
			<img id="ii" src="images/imageicon.png" style="visibility:hidden;"/>&nbsp;
			<img id="ai" src="images/audioicon.png" style="visibility:hidden;"/>&nbsp;
			<img id="vi" src="images/videoicon.png" style="visibility:hidden;"/>
		</div>
	</div>
	<div id="app" class="dP" style="position:absolute; top:128px;">

		<div id="translation" style="position:absolute; cursor:move; border:solid 2px #666; z-index:3; top:140px; padding:20px; visibility:hidden; width:400px; background:#eee; left: 91px;">
			<table>
				<tr>
					<td><span onclick="document.getElementById('translation').style.visibility='hidden';" style="cursor:pointer; font-weight:bold; text-align:right; color:#333">close X</span></td>
					<td style="width:165px;"></td>
					<td><span>Translate to:</span> </td>
					<td><select id="changeLanguage" style="width:100px;"></select>
					</td>
				</tr>
			</table>
			<br/>
			<div style="background:#fff; padding:10px;" id="wordsTranslate"></div>
		</div>
		
		<div id="annpop" style="position:absolute; cursor:move; border:solid 2px #666; z-index:3; top:140px; padding:20px; visibility:hidden; background:#eee; left: 91px; width:300px;">
			<span onclick="document.getElementById('annpop').style.visibility='hidden';" style="cursor:pointer; font-weight:bold; text-align:right; color:#333">close X</span>
		</div>
		
		<table id="theTable" style="position:relative; overflow:auto; top:0px; left:0px; width:100%; border-top:none; border-right:solid 1px #000; border-left:solid 1px #000; border-bottom:solid 1px #000;" >
			<tr>
				<td id="leftPane" style="border-right:solid 1px #000; width:70%;" valign="top">
					<h1 id="theTitle" style="padding-left:20px;padding-right:20px;"></h1>
					<div id="mainContent" style="position:relative; overflow-y:auto; padding:20px;" ></div>
					<div style="float:right">
						<img id="prev" width="30" />
						<span style="position:relative;top:-12px;">
							<span id="currentP">1</span>
							<span>/</span>
							<span id="totalP">1</span>
						</span>
						<img id="next" width="30" />
					</div>
					<div style="width:100%;">
						<div style=" position:relative; width:387px; height:19px;float:left; background:url(images/des.png)"></div>
						<span style=" position:relative; top:1px; text-align:right;	width: 140px; "><a	style="color:#000; text-decoration:none;"href="credits.html" target="_blank">Credits</a></span>
					</div>
				</td>
				<td valign="top" id="rightPane" style="height:100%;width:30%">
					<div id="annotations" style="position:relative; overflow-y:auto; top:20px; left:2%; width:98%;"></div>
				</td>
			</tr>
		</table>
	</div>
</div>

<ul id="myMenu" class="contextMenu">
	<li><a href="#translate">Translate</a></li>
	<li><a href="#blank"></a></li>
	<li><a href="#textbutton">Text</a></li>
	<li><a href="#imagebutton">Image</a></li>
	<li><a href="#audiobutton">Audio</a></li>
	<li><a href="#videobutton">Video</a></li>
	<li><a href="#allbutton">All</a></li>
</ul>

<script language="JavaScript" type="text/javascript">
AC_FL_RunContent({ //Flash SoundMachine fallback
	width: 1, height: 1,
	src:'soundMachine',
	name:'soundMachine',
	id:'soundMachine',
	quality:'high',
	pluginspage:'http://www.adobe.com/go/getflashplayer',
	align:'middle',
	play:true,
	loop:true,
	scale:'showall',
	wmode:'window',
	devicefont:false,
	menu:false,
	bgcolor:'#ffffff',
	allowFullScreen:false,
	allowScriptAccess:'sameDomain'
}); //end AC code

var width_toggle=false;
var max_width=1100;
var min_width=802;

function resizeApp(){
	var viewportheight,viewportwidth;  
	if(typeof window.innerHeight != 'undefined'){
		viewportheight = window.innerHeight;
		viewportwidth = window.innerWidth;
	}else if(
		typeof document.documentElement != 'undefined' &&
		typeof document.documentElement.clientHeight != 'undefined' &&
		document.documentElement.clientHeight != 0
	){ 
		viewportheight = document.documentElement.clientHeight;
		viewportwidth = document.documentElement.clientWidth;
	}else{
		viewportheight = document.getElementsByTagName('body')[0].clientHeight;
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
	}
	document.getElementById("mainContent").style.height = (viewportheight-290) + "px";
	document.getElementById("annotations").style.height = (viewportheight-170) + "px";
	document.getElementById("center").style.left = Math.max((viewportwidth-max_width)/2,0) + "px";
	if(width_toggle && viewportwidth > max_width){
		$(".dP").css({width:max_width});
		width_toggle = false;
	}else if(viewportwidth < max_width && viewportwidth > min_width){
		$(".dP").css({width:viewportwidth-5});
		width_toggle=true;
	}
}

//////////
//		RUNTIME
//////////

// Jquery function that is the same as body.onload, but with Jquery functionality
$(document).ready(function(){$(".dP").css({width:max_width});resizeApp();initReaderApp();});
$(window).resize(resizeApp);
</script>
<!--
Nothing works without JS anyway, so this is kind of pointless.
<noscript>
	<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="1" height="1" id="soundMachine" align="middle">
	<param name="allowScriptAccess" value="sameDomain" />
	<param name="allowFullScreen" value="false" />
	<param name="movie" value="soundMachine.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />	<embed src="soundMachine.swf" quality="high" bgcolor="#ffffff" width="1" height="1" name="soundMachine" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" />
	</object>
</noscript>-->

</body>
</html>
