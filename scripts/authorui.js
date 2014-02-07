/*Implied global:
 document
 Content
 Option
 langlist
 $
 window
 currentPage
*/

function deepCopy(o){
	"use strict";
	var i,newO;
    if(typeof(o) !== 'object'){return o;} //functions, numbers, string, and booleans are not deep cloned.
    if(o === null || o instanceof RegExp){return o;}
	newO = (o instanceof Array)?[]:{};
	for(i in o){if(o.hasOwnProperty(i)){newO[i] = o[i] && (!!(o[i].deepCopy))?o[i].deepCopy():deepCopy(o[i]);}}
	newO.__proto__ = o.__proto__;
    return newO;
}

function makeAnnotations(parent,param){
	"use strict";
	var aSel;
	// Code for right click menu translation option
	$("#mainContent").contextMenu({menu: 'myMenu'},
		function(action, el, pos) {
			switch(action){
				case "translate": parent.displayTranslation();
					break;
				case "addgloss":
					aSel = getSelectedText();
					if(aSel!==""){
						param.ann_win().addGlossExtern(aSel.toString());
					}
			}
		}
	);
	
	return {
		get textmode(){return true;},
		get imagemode(){return true;},
		get audiomode(){return true;},
		get videomode(){return true;},
		get modemask(){return 15;},
		newPageCleanup:function(){}
	};
}

function extendAuthorMainWindow(thisObj,param){
	"use strict";
	var i;
	
	thisObj.annotationModes = makeAnnotations(thisObj,param);
	thisObj.annBox = document.getElementById(param.annBox);
	thisObj.saveAs = document.getElementById(param.saveAs);
	thisObj.tLangBox = document.getElementById(param.tLangBox);
	thisObj.cLangBox = document.getElementById(param.cLangBox);
	
	if(param.doc){
		//just get the filename, excluding the extension and the original directory path
		var dt=(/[\/\\]/.test(param.doc)?param.doc.match(/[\/\\](.*)$/)[1]:param.doc);
		document.getElementById("doctitle").innerHTML = dt;
		thisObj.saveAs.value = dt;
	}
	
	thisObj.editPages = null;
	thisObj.cLangBox.onchange = function(){
		TIARA.Content.contentLanguage = thisObj.cLangBox.value;
	};
	thisObj.tLangBox.onchange = function(){
		TIARA.Content.translationLanguage = thisObj.tLangBox.value;
	};
	thisObj.displayGlossList = function(){
		var thisword, newdiv, gwords = TIARA.Content.glossedWords; //maybe here define a new i?
		thisObj.annBox.innerHTML = "";
		thisObj.annBox.lang = TIARA.Content.contentLanguage;
		for (i=gwords.length-1;i>=0;i--){
			thisword = gwords[i].word;
			newdiv = document.createElement('div');
			newdiv.innerHTML = newdiv.title = thisword;
			newdiv.style.display="inline";
			newdiv.onclick = param.glossClick;
			thisObj.annBox.appendChild(newdiv);
			thisObj.annBox.appendChild(document.createElement('br'));
		}
		if(Languages.alignment.hasOwnProperty(TIARA.Content.contentLanguage)){
			thisObj.annBox.style.textAlign=Languages.alignment[TIARA.Content.contentLanguage];
		}
	};
	//language selection
	thisObj.translateBox.add(new Option("---"),null);
	for(i=0;i<Languages.list.length;i++){
		thisObj.translateBox.add(new Option(Languages.list[i][1],Languages.list[i][0]),null);
		thisObj.tLangBox.add(new Option(Languages.list[i][1],Languages.list[i][0]),null);
		thisObj.cLangBox.add(new Option(Languages.list[i][1],Languages.list[i][0]),null);
	}
}

function saveDocument(main_win,doc){
	"use strict";
	var fname = $.trim(main_win.saveAs.value);
	if(!/^[-A-Za-z0-9~ ]+$/.test(fname)){
		return alert("Invalid Document Name; please use only alphanumeric characters and spaces.");
	}
	$.ajax({
		type: 'POST',
		url: 'saveJSON.php',
		data: {mode:'check',fname:fname}, //filename
		success: function(data, textStatus){
			if(data==='1' && !confirm("Replace existing document?")){ return; }
			var datastr = JSON.stringify({
				contentLanguage:doc.contentLanguage,
				translationLanguage:doc.translationLanguage,
				glossedWords:doc.glossedWords,
				pages:doc.pages
			},null,'\t');
			
			$.ajax({
				type: 'POST',
				url: 'saveJSON.php',
				//filename and stringified Content
				data: {mode:'save',fname:fname,content:datastr},
				//redirect to authorhome
				success: function(){ window.location.assign('./authorhome.php'); }
			});
		}
	});
}

function makePageWindow(param){
	"use strict";
	//private variables
	var screen = $("#"+param.screen),
		pageTitle = document.getElementById(param.pageTitle),
		pageContent = document.getElementById(param.pageContent),
		pLibrary = document.getElementById(param.pLibrary),
		editPages,
		curPage = 0,
		thisObj,
		saved=false,
		main_win = param.main_win;

	screen.dialog({
		width: 600,
		resizable: false,
		autoOpen: false,
		modal: true,
		beforeClose: function() { return saved || confirm("Close without saving?"); }
	});

	//private functions
	pageTitle.onkeyup = function(){pLibrary.options[curPage].text = pageTitle.value||"(untitled)";};
	function savePageChanges(){
		editPages[curPage].title = pageTitle.value;
		pLibrary.options[curPage].text = pageTitle.value||"(untitled)";
		editPages[curPage].content = pageContent.value;
	}
	function loadLibraryPage(){
		curPage = pLibrary.selectedIndex;
		pageTitle.value = editPages[curPage].title;
		pageContent.value = editPages[curPage].content;
	}
	function updatePageLibrary(index){
		var opt,i;
		if(index<0){index=0;}
		pLibrary.innerHTML = "";
		if(curPage === pLibrary.selectedIndex){curpage = index;}
		for(i=0;i<editPages.length;i++){
			opt = new Option(editPages[i].title||"(untitled)");
			opt.ondblclick = thisObj.changeEditPage;
			pLibrary.add(opt,null);
		}
		pLibrary.selectedIndex = index;
	}
	
	function editPage(){
		editPages = deepCopy(TIARA.Content.pages);
		pageTitle.value = editPages[TIARA.currentPage].title;
		pageContent.value = editPages[TIARA.currentPage].content;
		updatePageLibrary(TIARA.currentPage);
		curPage = TIARA.currentPage;
		screen.dialog("open");
	}
	
	//public functions
	function _changeEditPage(){
		savePageChanges();
		loadLibraryPage();
	}
	function _clearPageEditor(){pageContent.value = "";}
	function _addPage(){
		var opt;
		savePageChanges();
		curPage = pLibrary.selectedIndex+1;
		editPages.insert(
			{title:"",content:""},
			curPage
		);
		pageTitle.value = "";
		pageContent.value = "";
		opt = new Option("(untitled)");
		opt.ondblclick = thisObj.changeEditPage;
		pLibrary.add(opt,
			(curPage===pLibrary.length)?null:pLibrary.options[curPage]);
		pLibrary.selectedIndex++;
	}
	function _delPage(){
		editPages.remove(pLibrary.selectedIndex);
		if(!editPages.length){
			editPages.push({title:"",content:""});
			updatePageLibrary(0);
		}else{
			updatePageLibrary(editPages.length===curPage?curPage-1:curPage);
		}
		loadLibraryPage();
	}
	function _movePage(i){
		var selPage = pLibrary.selectedIndex,
			swapPage,text;
		if(
			(selPage===0 && i<0) ||
			(selPage===editPages.length-1 && i>0)
		){return;}
		swapPage = selPage+i;
		editPages.swap(selPage,swapPage);
		text = pLibrary.options[selPage].text;
		pLibrary.options[selPage].text = pLibrary.options[swapPage].text;
		pLibrary.options[swapPage].text = text;
		pLibrary.selectedIndex=swapPage;
		switch(curPage){
			case swapPage: curPage=selPage;	break;
			case selPage: curPage=swapPage;
		}
	}
	function _savePageData(){
		savePageChanges();
		saved = true;
		screen.dialog("close");
		TIARA.Content.pages = editPages;
		TIARA.currentPage = curPage;
		saved = false;
		main_win().loadPage(); //somewhat inefficient, but good enough for now.
	}
	function _cancelPageData(){
		screen.dialog("close");
	}
	function _attachButton(id,func,args){
		$("#"+id).click(args?function(){thisObj[func].apply(null,args);}:thisObj[func]);
	}

	var jqObj=$('#addpg');
	jqObj.attr("src","images/plus.png");
	jqObj.click(editPage);
	
	thisObj = { //we use this variable solely to provide a reference for attachButton
		changeEditPage: _changeEditPage,
		clearPageEditor: _clearPageEditor,
		addPage: _addPage,
		delPage: _delPage,
		movePage: _movePage,
		savePageData: _savePageData,
		cancelPageData: _cancelPageData,
		attachButton: _attachButton
	};
	
	return thisObj;
}

function makeGlossWindow(param){
	//private variables
	var	screen = $("#"+param.screen),
		glossLib = document.getElementById(param.glossLib),
		annLib = document.getElementById(param.annLib),
		gword = document.getElementById(param.gword),
		curAnnList, //we need this basically so that we can delete things
		editGlosses,
		curGloss,
		saved = false,
		main_win = param.main_win,
		ann_latch,type_latch,
		dg = {
			text:{
				screen:		$("#"+param.textScreen),
				title:		document.getElementById(param.textTitle),
				content:	document.getElementById(param.textContent)
			},image:{
				screen:		$("#"+param.imageScreen),
				title:		document.getElementById(param.imageTitle),
				url:		document.getElementById(param.imageURL),
				file:		document.getElementById(param.imageFile),
				content:	document.getElementById(param.imageContent)
			},audio:{
				screen:		$("#"+param.audioScreen),
				title:		document.getElementById(param.audioTitle),
				url:		document.getElementById(param.audioURL),
				file:		document.getElementById(param.audioFile),
				content:	document.getElementById(param.audioContent)
			},video:{
				screen:		$("#"+param.videoScreen),
				title:		document.getElementById(param.videoTitle),
				url:		document.getElementById(param.videoURL),
				file:		document.getElementById(param.videoFile),
				content:	document.getElementById(param.videoContent)
			}
		},
		thisObj;
	
	screen.dialog({
		width: 457,
		resizable: false,
		autoOpen: false,
		modal: true,
		beforeClose: function() { return saved || confirm("Close without saving?"); }
	});
	dg.text.screen.dialog({ width: 350, resizable: true, autoOpen: false, modal: true });
	dg.image.screen.dialog({ width: 350, resizable: true, autoOpen: false, modal: true });
	dg.audio.screen.dialog({ width: 350, resizable: true, autoOpen: false, modal: true });
	dg.video.screen.dialog({ width: 350, resizable: true, autoOpen: false, modal: true });
	
	function set_uploader(dialog){
		"use strict";
		dialog.file.addEventListener('change',function(e){
			var	formData = new FormData(),
				xhr = new XMLHttpRequest();
			formData.append('file', this.files[0]);
			xhr.onreadystatechange = function(){
				var data;
				if(this.readyState !== 4){ return; }
				data = JSON.parse(this.responseText);
				if(data.error){alert('Error uploading '+data.name+':\n'+data.error);}
				else{dialog.url.value = data.path;}
			};
			xhr.open('POST', 'uploader.php', true);
			xhr.send(formData);
		});
	}
	
	set_uploader(dg.image);
	set_uploader(dg.audio);
	set_uploader(dg.video);

	glossLib.onclick = function(){thisObj.loadGloss(this.value);};

	//private functions
	function clear_func(){this.value="";};
	function annotationName(ann){return ann.title||ann.url||(ann.content?ann.content.substr(0,15):null)||"";}
	function loadAnnType(anntype, type){
		var y,dispname,thisann,opt,
			prefix = {"text":"T: ","image":"I: ","audio":"A: ","video":"V: "}[type];
		if(anntype){
			for(y=anntype.length;y>=0;y--){ if(!!anntype[y]){
				thisann = anntype[y];
				dispname = annotationName(thisann);
				if(dispname!==""){
					opt = new Option(prefix+dispname,curAnnList.length);
					annLib.options.add(opt,null);
					curAnnList.push(thisann);
					with({annlatch:thisann}){
						opt.ondblclick = function(){thisObj.editAnnotation(type,annlatch);};
					}
				}
			}}
		}
	}
	function loadAnnLibrary(thisgloss){
		"use strict";
		annLib.innerHTML = "";
		curAnnList = [];
		loadAnnType(thisgloss.textAnnotation, "text");
		loadAnnType(thisgloss.imageAnnotation, "image");
		loadAnnType(thisgloss.audioAnnotation, "audio");
		loadAnnType(thisgloss.videoAnnotation, "video");
	}
	
	function markGlosses(word){
		var page, newcontent,
			marker = Languages.gloss_markers[TIARA.Content.contentLanguage];
		if(marker){
			page = TIARA.Content.pages[TIARA.currentPage];
			newcontent = marker(page.content,word);
			if(newcontent && confirm("Automatically mark "+word+" on the current page?")){
				page.content = newcontent;
			}
		}
	}
	
	function updateGlosses(word){
		"use strict";
		word = $.trim(word);
		if(!word){return;}
		var x,i,marker,page,newgloss,
			normgloss = word.toLowerCase();
		make_new: {
			for(i=editGlosses.length-1;i>=0;i--){
				if(normgloss===editGlosses[i].word.toLowerCase()){
					//populate form elements
					thisObj.updateGlossLib();
					x=glossLib.options.length-1;
					while(x>=0&&glossLib.options[x].value.toLowerCase()!==normgloss){x--;}
					glossLib.selectedIndex=x;
					thisObj.loadGloss(word);
					break make_new;
				}
			}
			newgloss = {
				word:word,
				textAnnotation:[],
				imageAnnotation:[],
				audioAnnotation:[],
				videoAnnotation:[],
				toJSON: JSONglosses
			};
			i = editGlosses.insertSorted(newgloss,cmpGlosses);
			glossLib.add(new Option(word),glossLib.options[i] || null);
			glossLib.selectedIndex=i;
			_loadGloss(glossLib.value);
		}
		markGlosses(word);
	}
	
	//public functions
	function _updateGlossLib(){
		"use strict";
		var x, thisword, gwords=TIARA.Content.glossedWords;
		glossLib.innerHTML = "";
		for (x=gwords.length-1;x>=0;x--){
			thisword = gwords[x].word;
			glossLib.options.add(new Option(thisword,thisword.toLowerCase()),null);
		}
	}
	function _loadGloss(thisword){
		"use strict";
		var thisgloss,x;
		gword.value = thisword;
		// find data field for this gloss
		for (x=editGlosses.length-1;x>=0;x--){
			thisgloss = editGlosses[x];
			if(thisword.toLowerCase()===thisgloss.word.toLowerCase()){
				curGloss = thisgloss;
				loadAnnLibrary(thisgloss);
				break;
			}
		}
	}
	function _editGloss(gloss){
		"use strict";
		var x,normgloss;
		editGlosses = deepCopy(TIARA.Content.glossedWords);
		if(typeof(gloss)==="string"){
			//populate form elements
			thisObj.updateGlossLib();
			normgloss = gloss.toLowerCase();
			x=glossLib.options.length-1;
			while(x>=0&&glossLib.options[x].value.toLowerCase()!==normgloss){x--;}
			glossLib.selectedIndex=x;
			thisObj.loadGloss(gloss);
			screen.dialog("open");
			markGlosses(gloss);
		}else{
			gword.value = ""; //clear form elements
			thisObj.updateGlossLib();
			glossLib.selectedIndex=-1;
			annLib.innerHTML="";
			screen.dialog("open");
		}
		gword.onfocus=clear_func;
	}
	function _addGlossExtern(word){
		"use strict";
		if(!word){return;}
		_editGloss();
		updateGlosses(word);
	}
	function _addGloss(){
		updateGlosses(gword.value);
	}
	function _delGloss(){
		"use strict";
		var x,
			word = glossLib.value.toLowerCase();
		for (x=editGlosses.length-1;x>=0;x--){
			if(word===editGlosses[x].word.toLowerCase()){
				editGlosses.remove(x);
				break;
			}
		}
		glossLib.remove(glossLib.selectedIndex);
		if(glossLib.length){
			glossLib.selectedIndex=0;
			_loadGloss(glossLib.value);
		}else{annLib.innerHTML = "";}
	}
	function _addAnnotation(type){
		"use strict";
		if(!curGloss){return;}
		var annvals = dg[type];
		annvals.title.value = "";
		annvals.content.value = "";
		if(type!=='text'){annvals.url.value = "";}
		_attachButton.apply(null,{
			text:["taButton",'saveAnnotation',["text"]],
			image:["iaButton",'saveAnnotation',["image"]],
			audio:["aaButton",'saveAnnotation',["audio"]],
			video:["vaButton",'saveAnnotation',["video"]]
		}[type]);
		annvals.screen.dialog("open");
	}
	function _editAnnotation(type,ann){
		"use strict";
		if(!curGloss){return;}
		var annvals = dg[type];
		annvals.title.value = ann.title||"";
		annvals.content.value = ann.content||"";
		if(type!=='text'){annvals.url.value = ann.url||"";}
		ann_latch = ann;
		type_latch = type;
		_attachButton({
			text:"taButton",
			image:"iaButton",
			audio:"aaButton",
			video:"vaButton",
		}[type],'saveEditAnnotation');
		annvals.screen.dialog("open");
	}
	function _delAnnotation(){
		"use strict";
		var ann,x = annLib.value;
		if(!x){return;}
		x = parseInt(x,10);
		ann = curAnnList[x];
		curAnnList.remove(x);
		annLib.remove(annLib.selectedIndex);
		curGloss.textAnnotation.remove(ann);
		curGloss.imageAnnotation.remove(ann);
		curGloss.audioAnnotation.remove(ann);
		curGloss.videoAnnotation.remove(ann);
	}
	function _saveAnnotation(type){
		"use strict";
		var annvals = dg[type];
		annvals.screen.dialog("close");
		curGloss[type+"Annotation"].push((type==='text')?
			{title:annvals.title.value,content:annvals.content.value}:
			{title:annvals.title.value,url:annvals.url.value,content:annvals.content.value});
		loadAnnLibrary(curGloss);
	}
	function _saveEditAnnotation(){
		"use strict";
		var annvals = dg[type_latch];
		annvals.screen.dialog("close");
		if(type_latch!=='text'){ann_latch.url = annvals.url.value;}
		ann_latch.title = annvals.title.value;
		ann_latch.content = annvals.content.value;
		loadAnnLibrary(curGloss);
	}
	function _cancelAnnotation(type){
		dg[type].screen.dialog("close");
	}
	function _saveGlossData(){
		"use strict";
		saved = true;
		screen.dialog("close");
		gword.onfocus=null;
		TIARA.Content.glossedWords = editGlosses;
		saved = false;
		main_win().displayGlossList();
		main_win().loadPage(); //somewhat inefficient, but good enough for now.
	}
	function _cancelGlossData(){
		"use strict";
		screen.dialog("close");
	}
	function _attachButton(id,func,args){
		"use strict";
		var jqObj=$("#"+id);
		jqObj.unbind('click');
		jqObj.click(args?function(){thisObj[func].apply(null,args);}:thisObj[func]);
	}
	
	thisObj = { //name for internal reference
		updateGlossLib: _updateGlossLib,
		loadGloss: _loadGloss,
		editGloss: _editGloss,
		addGlossExtern: _addGlossExtern,
		addGloss: _addGloss,
		delGloss: _delGloss,
		addAnnotation: _addAnnotation,
		editAnnotation: _editAnnotation,
		delAnnotation: _delAnnotation,
		saveAnnotation: _saveAnnotation,
		saveEditAnnotation: _saveEditAnnotation,
		cancelAnnotation: _cancelAnnotation,
		saveGlossData: _saveGlossData,
		cancelGlossData: _cancelGlossData,
		attachButton: _attachButton
	};

	var jqObj=$('#addgloss');
	jqObj.attr("src","images/plus.png");
	jqObj.click(_editGloss);
	
	return thisObj;
}