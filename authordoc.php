<?php
$conf_files = array("user_passwords.conf");
include 'password_protect_page.php'; //uncomment to turn on password protection
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="icon" href="images/favicon.png"/>
<link href="scripts/jquery-ui.css" rel="stylesheet" type="text/css"/>
<link href="scripts/readermain.css" rel="stylesheet" type="text/css"/>
<title>Annotated Reader Application</title>
<script src="scripts/jquery.js"></script>
<script src="scripts/jqueryui.js"></script>
<script src="scripts/xml2json.js"></script>

<!-- get URL paramaters script -->
<script src="scripts/getURL.js"></script>

<script src="scripts/commonui.js"></script>
<script src="scripts/language_modules.js"></script>
<script src="scripts/authorui.js"></script>
<script src="scripts/authorinit.js"></script>

</head>
<body>
	<div id="center">
		<div id="splash" class="dP" style="position:absolute; top:10px; height: 61px;">
			<img style="position:relative; left:-12px;display:inline;" src="images/splash.png"/>
			<div style="position:relative; float:right; top:20px; width: 140px;">Need help? Click <a href="authorhelp.html" target="_blank">here</a>.</div>
			<div style="position:relative; float:right; clear:both; top:20px; width: 180px;"><a href="authorhome.php">Back to Document List</a> | <a href="logout.php">Logout</a>.</div>
		</div>
		<div id="docbox" style="position:relative; top:28px; left: 150px; height: 51px; width:700px;">
			<table>
				<tr style="text-align:center;">
					<td style="text-align:left;"><b>Document Title:</b> <span id="doctitle"></span></td>
					<td>Document Text Language:</td><td>Annotation Language:</td>
				</tr>
				<tr style="text-align:center;">
					<td><b>Save As:</b> <input type="text" id="docsaveas" /><button id="docSaveButton">SAVE DOCUMENT</button></td>
					<td><select id="clang"></select></td><td><select id="tlang"></select></td>
				</tr>
			</table>
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
			<div style="position:relative; font-weight:bold; text-align:center; top: 15px; height: 23px;z-index:0;">
				<span id="activeA">Select a blue word</span>
			</div>
		</div>		
		<div id="app" class="dP" style="position:absolute; top:128px;">
			<div id="translation" style="position:absolute; cursor:move; border:solid 2px #666; z-index:3; top:140px; padding:20px; visibility:hidden; width:400px; background:#eee; left: 91px;">
				<table>
					<tr>
						<td><span onclick="document.getElementById('translation').style.visibility='hidden'" style="cursor:pointer; font-weight:bold; text-align:right; color:#333">close X</span></td>
						<td style="width:165px;"></td>
						<td><span>Translate to:</span> </td>
						<td><select id="changeLanguage" style="width:100px;"></select></td>
					</tr>
				</table>
				<br/>
				<div style="background:#fff; padding:10px;" id="wordsTranslate"></div>
			</div>
			<table id="theTable" style="position:relative; overflow:auto; top:0px; left:0px; width:100%; border-top:none; border-right:solid 1px #000; border-left:solid 1px #000; border-bottom:solid 1px #000;" >
				<tr>
					<td id="myDiv" style="border-right:solid 1px #000; width:70%;" valign="top">
						<div style="float:right"><img id="addpg" width="23" /></div>
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
					<td valign="top" id="rightPane" style="height:100%;">
						<img id="addgloss" width="23" style="float:right;position:relative;top:0px;" />
						<div id="annotations" style="position:relative; overflow-y:auto; top:10px; left:2%; width:98%; padding-right:10px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>

	<ul id="myMenu" class="contextMenu">
		<li><a href="#translate">Translate</a></li>
		<li><a href="#addgloss">Add Gloss</a></li>
	</ul>

	<!-- PAGE EDITOR DIALOG -->
	<table id="addPageScreen" title="Add Page" style="display:none;text-align:left;">
		<tr><td style="border-width:0px;"><h3 style="margin-bottom:0px;margin-top:0px;">Content</h3></td></tr>
		<tr><td colspan=4>Type, Copy & Paste, or choose content from the library below.</td></tr>
		<tr><td align='right'><b>Page Title:</b></td><td><input id="ptitle" type="text" /></td><!--<td>Content Language:</td><td>Translation Language</td>--></tr>
		<tr><td colspan=3 align='center'><b>Page Content:</b></td></tr>
		<tr><td colspan=3><textarea id="pcontent" rows="8" cols="77"></textarea></td></tr>
		<tr>
			<td><button id="pLibLoadDataButton">Load Page From Library</button></td><td align='center'><b>Library:</b></td>
			<td colspan=2 style="text-align:right;"><button id="pContentClearButton">Clear</button><button id="pAddtoLibButton">New Page</button></td>
		</tr>
		<tr><td colspan=3><select id="plibrary" size="5" style="width:565px;"></select></td></tr>
		<tr>
			<td><button id="pLibUpButton">Move Selection Up</button></td>
			<td><button id="pLibDownButton">Move Selection Down</button></td>
			<td style="text-align:right;"><button id="pDelButton">Delete from Library</button></td>
		</tr>
		<tr><td colspan=3 style="text-align:center;font-size:15pt;">
			<button id="pSaveButton">Save</button>
			<button id="pCancelButton">Cancel</button>
		</td></tr>
	</table>

	<!-- GLOSS EDITOR DIALOG -->
	<table id="addAnnotationsScreen" title="Add Annotations" style="border-collapse:collapse;display:none;">
		<tr><td colspan=3><h3>Annotations</h3></td></tr>
		<tr><td colspan=3>
			Type, Copy & Paste, or choose glossed words from the library below.<br/><br/>
		</td></tr><tr>
			<td style="border:solid black 1px;">
				Glossed Word:<br/>
				<input id="gword" type="text" /><br/>
				<button id="addGlossButton" style="align:right;">Add to Library</button><br/>
				Library:<br/>
				<select id="gwlibrary" size=13 style="width:150px;"></select>
			</td><td valign="top" style="border-top:solid black 1px;border-bottom:solid black 1px;">
				<br/>
				<button id="addTextButton">Add Text Annotation</button><br/>
				<button id="addImageButton">Add Image Annotation</button><br/>
				<button id="addAudioButton">Add Audio Annotation</button><br/>
				<button id="addVideoButton">Add Video Annotation</button><br/>
				<button id="delAnnButton">Delete Selected Annotation</button><hr/>
				<button id="delGlossButton">Delete Selected Gloss</button>
			</td><td style="border-top:solid black 1px;border-bottom:solid black 1px;border-right:solid black 1px;">
				Annotations:<br/>
				<select id="annlist" size=17 style="width:150px;"></select>
			</td>
		</tr><tr>
			<td colspan=3 style="text-align:center;">
				<button id="gSaveButton" style="font-size:15pt;">Save</button>
				<button id="gCancelButton" style="font-size:15pt;">Cancel</button>
			</td>
		</tr>
	</table>

	<!-- ANNOTATION EDITOR DIALOGS -->
	<div id="addTextAnnotation" title="Text Annotation" style="display:none;">
		<center>
			Title:<br/>
			<input id="tatitle" type="text" /><br/>
			Content:<br/>
			<textarea id="tacontent" rows="5" cols="40"></textarea><br/>
			<button id="taButton">Add</button><br/>
			<button id="taCancel">Cancel</button>
		</center>
	</div>
	<?php
	$dialogtypes = array("Image"=>"i","Audio"=>"a","Video"=>"v");
	foreach($dialogtypes as $name=>$prefix){
		?>
	<div id="add<?php echo $name;?>Annotation" title="<?php echo $name;?> Annotation" style="display:none;">
		<center>
			Title:<br/>
			<input id="<?php echo $prefix;?>atitle" type="text" style="width:90%;" /><br/>
			URL:<br/>
			<input id="<?php echo $prefix;?>aurl" type="text" /><br/>
			<form id="<?php echo $prefix;?>afile" enctype="multipart/form-data">
				<input type="hidden" name="MAX_FILE_SIZE" value="100000" />
				File: <input type="file" name="file" />
				<input type="submit" value="Upload" />
			</form><br/>
			Caption:<br/>
			<textarea id="<?php echo $prefix;?>acontent" rows="5" cols="40"></textarea><br/>
			<button id="<?php echo $prefix;?>aButton">Add</button><br/>
			<button id="<?php echo $prefix;?>aCancel">Cancel</button>
		</center>
	</div>
	<?php } ?>
		
	<!-- file uploader -->
	<script src="scripts/jquery.form.js" type="text/javascript"></script>

	<!-- right click menu -->
	<script src="scripts/jquery.contextMenu.js" type="text/javascript"></script>
	<link href="scripts/jquery.contextMenu.css" rel="stylesheet" type="text/css"/>
	
	<!-- google translate script -->
	<script type="text/javascript" src="http://www.google.com/jsapi"></script>
	<script type="text/javascript">
		google.load("language", "1");
	</script>

	<script src="scripts/noselect.js"></script>
	<script language="JavaScript" type="text/javascript">
	var width_toggle=false;
	var max_width=1100;
	var min_width=1012;

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
		document.getElementById("annotations").style.height = (viewportheight-185) + "px";
		document.getElementById("center").style.left = Math.max((viewportwidth-max_width)/2,0) + "px";
		if(width_toggle && viewportwidth > max_width){
			$(".dP").css({width:max_width});
			width_toggle = false;
		}else if(viewportwidth < max_width && viewportwidth > min_width){
			$(".dP").css({width:viewportwidth-10});
			width_toggle=true;
		}
	}

	//////////
	//		RUNTIME
	//////////

	// Jquery function that is the same as body.onload, but with Jquery functionality
	window.onbeforeunload=function(){return 'Are you sure you want to leave the editor?';};
	$(document).ready(function(){$(".dP").css({width:max_width});resizeApp();initAuthorApp();});
	$(window).resize(resizeApp);
	</script>
</body>
</html>
