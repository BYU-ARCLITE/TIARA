<?php
$conf_files = array("user_passwords.conf","reader_passwords.conf");
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

// open the current directory
$dhandle = opendir('docs');
$doc_array = array();
if ($dhandle) {
	// loop through all of the files
	while (false !== ($dname = readdir($dhandle))){
		if(substr($dname, 0, 1) == ".") continue;
		if(is_dir("docs/$dname")){
			$fhandle = opendir("docs/$dname");
			if ($fhandle) {
				$dir_array = array();
				// loop through all of the files
				while (false !== ($fname = readdir($fhandle))) {
					// if it's a data file, output it.
					if (preg_match('/\.(xml|json)$/',$fname)) {
						$basename = implode('.',explode('.',$fname,-1));
						$dir_array[] = $basename;
					}
				}
				// close the directory
				closedir($fhandle);
				$doc_array[$dname] = $dir_array;
			}
		}
	}
	// close the directory
	closedir($dhandle);
}
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
</head>
<body>
<div id="center">
	<div id="splash" class="dP" style="position:absolute; top:10px; height: 61px;"><img style="position:relative;left:-12px;" src="images/splash.png"></div>
	<div id="nav" class="dP" style="position:absolute;top:76px;height:52px;background:url('images/bar.png');border-left:solid 1px #666;border-right:solid 1px #666;">
		<span style="position:absolute;left:850px;top:13px;width:140px;">Need help? Click <a href="help.html">here</a>.</span>
		<span style="position:absolute;left:870px;top:33px;width:140px;"><a href="logout.php">Logout</a>.</span>
	</div>
	<div id="app" class="dP" style="position:absolute;top:128px;">
		<div id="appBorder" style="position:relative;top:0px;left:0px;width:100%;border-top:none;">
			<center>
				<table id="theTable" style="position:relative;overflow:hidden;">
					<tr>
						<td id="myDiv" style="height:520px;padding:20px; text-align:center;" valign="top">
							<button onclick="openDoc();">OPEN IN READER</button><br/>
							<button id="sortbutton" style="font-size:8pt;">Sort by Document</button><br/>
							<select id="docmode">
								<option value="0">Normal Mode</option>
								<option value="1">Thumbnail Mode</option>
								<option value="2">Popup Mode</option>
								<option value="3">Popup with Thumbnails</option>
							</select><br/>
							<select id="authorlist" style="width:200px;" size=20>
							<?php
								foreach(array_keys($doc_array) as $author){
									echo "<option value=\"$author\">$author</option>\n";
								}
							?>
							</select>
							<select id="doclist" style="width:200px;" size=20></select>				
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
var	authorlist = document.getElementById('authorlist'),
	doclist = document.getElementById('doclist'),
	authormap = {<?php
foreach($doc_array as $author => $doclist){
	echo "$author:['".implode("','",$doclist)."'],";
}
?>_:''},
	a_or_d=true,
	docmap={},docs,i,j;
delete authormap._;
for(i in authormap) if(authormap.hasOwnProperty(i)){
	docs = authormap[i];
	for(j=docs.length-1;j>=0;j--) if(docs[j]){
		if(!(docs[j] in docmap)){
			docmap[docs[j]] = [i];
		}else{
			docmap[docs[j]].push(i);
		}
	}
}
	
function openDoc(){
	var author = authorlist.value,
		docname = doclist.value;
	if(!author & authorlist.options.length===1){author = authorlist.options[0].value;}
	if(!docname & doclist.options.length===1){docname = doclist.options[0].value;}
	if(!author || !docname){alert("Please select a document.");return;}
	switch(document.getElementById('docmode').value){
		case '3': docname+='&popup=true';
		case '1': docname+='&thumbnails=true';
			break;
		case '2': docname+='&popup=true';
	}
	window.location.assign('./?data='+author+"/"+docname);
}

document.getElementById('sortbutton').onclick = function(){
	var i;
	authorlist.innerHTML = "";
	doclist.innerHTML = "";
	a_or_d = !a_or_d;
	if(a_or_d){
		Object.keys(authormap).sort(function(a,b){
			return a.toLowerCase()<b.toLowerCase()?1:-1;
		}).map(function(k){
			authorlist.options.add(new Option(k),null);
		});
		authorlist.onchange = disp;
		doclist.onchange = null;
		this.innerText = "Sort by Document";
	}else{
		Object.keys(docmap).sort(function(a,b){
			return a.toLowerCase()<b.toLowerCase()?1:-1;
		}).map(function(k){
			doclist.options.add(new Option(k),null);
		});
		authorlist.onchange = null;
		doclist.onchange = disp;
		this.innerText = "Sort by Author";
	}
}
	
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

function disp(){
	var els = (a_or_d?authormap:docmap)[this.value],
		sel = (a_or_d?doclist:authorlist),
		i,len = els.length;
	sel.innerHTML = "";
	for(i=0;i<len;i++){sel.options[i] = new Option(els[i])}
}

authorlist.onchange = disp;

////////////		RUNTIME
//////////// Jquery function that is the same as body.onload, but with Jquery functionality
$(document).ready(resizeApp);
$(window).resize(resizeApp);
</script>
</body>
</html>