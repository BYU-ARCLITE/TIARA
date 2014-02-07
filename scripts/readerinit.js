/*Implied global:
$ 12,
soundPlay 18,
navigator 33,
window 33,
document 33,54,
Audio 36,42,
gup 52,
makeMainWindow 56,
extendReaderMainWindow 69,
disableSelection 83,
Content 92,
map 99,
setTimeout 108
*/

var page_cache = [],gloss_cache = [];

function initReaderApp(){
	"use strict";
	
	//sets the annotation pop-up to be draggable
	$('#annpop').draggable();
	
	// sets the translation window to be draggable
	$('#translation').draggable();

	//Disable Selections
	disableSelection(document.getElementById("next"));
	disableSelection(document.getElementById("prev"));
	disableSelection(document.getElementById("textbutton"));
	disableSelection(document.getElementById("imagebutton"));
	disableSelection(document.getElementById("audiobutton"));
	disableSelection(document.getElementById("videobutton"));
	disableSelection(document.getElementById("allbutton"));
	
	//grab a reference to the sound player
	soundPlay = (function(){
		var mimetypes = {
			mp3:"audio/mpeg",
			mp4:"audio/mp4",
			ogg:"audio/ogg",
			wav:"audio/x-wav",
			au:"audio/basic",
			snd:"audio/basic",
			aif:"audio/x-aiff",
			aifc:"audio/x-aiff",
			aiff:"audio/x-aiff",
			mid:"audio/mid",
			rmi:"audio/mid",
			ra:"audio/x-pn-realaudio",
			ram:"audio/x-pn-realaudio"
		},audioObj,flashSound = document.getElementById('soundMachine');
		//soundcache={};
		try{
			audioObj = new Audio("");
			if(!!(audioObj.canPlayType)){
				return function(url){
					var ext = url.match(/\.([^\.]+)\s*$/)[1],audio,
						playstr = (mimetypes[ext])?audioObj.canPlayType(mimetypes[ext]):"";
					if(playstr!=="" && playstr!=="no"){
						/*audio=soundcache[url];
						if(audio){
							audio.currentTime=0;
							audio.play();
						}
						else{(soundcache[url] = new Audio(url)).play();}*/
						(new Audio(url)).play();
					}else{flashSound.playSound(url);}
				};
			}
		}catch (e){}
		return function(url){flashSound.playSound(url);};
	}());
	
	//interface objects
	var anndiv,scMain,popup;
	if(gup('popup')){
		anndiv='annpop';
		popup = true;
		document.getElementById('rightPane').style.display="none";
		document.getElementById('leftPane').style.border="none";
	}else{
		anndiv='annotations';
		popup = false;
	}
	scMain = makeMainWindow({
		nav_buttons:"nav > div",
		nextPageButton: 'next',
		prevPageButton: 'prev',
		curPageDisp: 'currentP',
		glossClick:function(gloss){scMain.setGloss(gloss);},
		doc: gup('data')||"admin/data.xml",
		translateBox: 'changeLanguage',
		videomode:true,
		audiomode:true,
		imagemode:true,
		textmode:true,
		annotation_div:document.getElementById(anndiv),
		popup:popup,
		extension:extendReaderMainWindow,
		onContentLoaded:function(content){
			var i,j,thisgloss,
				preserveWhitespace = function(str){return str.replace(/\n/g,"<br/>\n");},
				ann_types = ['textAnnotation','imageAnnotation','audioAnnotation','videoAnnotation'],
				glosses = content.glossedWords;
			content.glossMap = {};
			for(i=glosses.length-1;i>=0;i--){
				thisgloss = glosses[i];
				content.glossMap[thisgloss.word.toLowerCase()] = thisgloss;
				for(j=0;j<4;j++){if(thisgloss[ann_types[j]].length){
					map(thisgloss[ann_types[j]],['content'],preserveWhitespace);
				}}
			}
		}
	});
}