/*Implied global:
 $
 disableSelection
 document
 makeMainWindow
 extendAuthorMainWindow
 makePageWindow
 makeGlossWindow
 saveDocument
 Content
 langlist
*/

var page_cache = false,gloss_cache = false;

function JSONglosses(){
	var obj = {word:this.word};
	//eliminates extraneous bookkeeping properties and filters out zero-length annotation arrays
	if(this.textAnnotation.length){
		obj.textAnnotation = this.textAnnotation;
	}
	if(this.imageAnnotation.length){
		obj.imageAnnotation = this.imageAnnotation;
	}
	if(this.audioAnnotation.length){
		obj.audioAnnotation = this.audioAnnotation;
	}
	if(this.videoAnnotation.length){
		obj.videoAnnotation = this.videoAnnotation;
	}
	return obj;
}

function initAuthorApp(){
	"use strict";

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

	//interface objects
	var scMain,scPage,scAnn;
	
	scPage = makePageWindow({
		screen:		"addPageScreen",
		pageTitle:	"ptitle",
		pageContent:"pcontent",
		pLibrary:	"plibrary",
		main_win: function(){return scMain;}
	});

	scAnn = makeGlossWindow({
		screen:		"addAnnotationsScreen",
		glossLib:	"gwlibrary",
		annLib:		"annlist",
		gword:		"gword",
		main_win:	function(){return scMain;},
		textScreen:	"addTextAnnotation",
		textTitle:	"tatitle",
		textContent:"tacontent",
		imageScreen:"addImageAnnotation",
		imageTitle:	"iatitle",
		imageURL:	"iaurl",
		imageFile:	"iafile",
		imageContent:	"iacontent",
		audioScreen:	"addAudioAnnotation",
		audioTitle:		"aatitle",
		audioURL:		"aaurl",
		audioFile:		"aafile",
		audioContent:	"aacontent",
		videoScreen:	"addVideoAnnotation",
		videoTitle:		"vatitle",
		videoURL:		"vaurl",
		videoFile:		"vafile",
		videoContent:	"vacontent",
	});
	
	scMain = makeMainWindow({
		annBox: 'annotations',
		saveAs: 'docsaveas',
		translateBox: 'changeLanguage',
		tLangBox:'tlang',
		cLangBox: 'clang',
		glossClick: function(gloss){scAnn.editGloss(gloss);},
		nextPageButton: 'next',
		prevPageButton: 'prev',
		curPageDisp: 'currentP',
		doc: gup('data'),
		page_win: function(){return scPage;}, //we have to do it this way to take care of circular dependency & asynchronicity
		ann_win: function(){return scAnn;},
		extension:extendAuthorMainWindow,
		onContentLoaded:function(content){
			var i;
				
			content.glossedWords.forEach(function(gloss){ gloss.toJSON = JSONglosses; });
			
			i=Languages.list.length-1;
			while(i>-1 && content.contentLanguage !== Languages.list[i][0]){i--;}
			scMain.cLangBox.selectedIndex = i;
			
			i=Languages.list.length-1;
			while(i>-1 && content.translationLanguage !== Languages.list[i][0]){i--;}
			scMain.tLangBox.selectedIndex = i;
			
			scMain.displayGlossList();
			scAnn.updateGlossLib();
		}
	});

	// <-- dialog box buttons -->

	//Page editor
	scPage.attachButton('pLibLoadDataButton','changeEditPage');
	scPage.attachButton('pContentClearButton','clearPageEditor');
	scPage.attachButton('pAddtoLibButton','addPage');
	scPage.attachButton('pLibUpButton','movePage',[-1]);
	scPage.attachButton('pLibDownButton','movePage',[1]);
	scPage.attachButton('pDelButton','delPage');
	scPage.attachButton('pSaveButton','savePageData');
	scPage.attachButton('pCancelButton','cancelPageData');

	//Gloss editor
	scAnn.attachButton("addTextButton",'addAnnotation',["text",null]);
	scAnn.attachButton("addImageButton",'addAnnotation',["image",null]);
	scAnn.attachButton("addAudioButton",'addAnnotation',["audio",null]);
	scAnn.attachButton("addVideoButton",'addAnnotation',["video",null]);
	scAnn.attachButton("delAnnButton",'delAnnotation');
	scAnn.attachButton("delGlossButton",'delGloss');
	scAnn.attachButton("addGlossButton",'addGloss');
	scAnn.attachButton("gSaveButton",'saveGlossData');
	scAnn.attachButton("gCancelButton",'cancelGlossData');

	//Annotation dialogs
	//scAnn.attachButton("taButton",'saveAnnotation',["text"]);
	//scAnn.attachButton("iaButton",'saveAnnotation',["image"]);
	//scAnn.attachButton("aaButton",'saveAnnotation',["audio"]);
	//scAnn.attachButton("vaButton",'saveAnnotation',["video"]);
	
	scAnn.attachButton("taCancel",'cancelAnnotation',["text"]);
	scAnn.attachButton("iaCancel",'cancelAnnotation',["image"]);
	scAnn.attachButton("aaCancel",'cancelAnnotation',["audio"]);
	scAnn.attachButton("vaCancel",'cancelAnnotation',["video"]);

	//main page buttons
	$('#docSaveButton').click(function(){saveDocument(scMain,TIARA.Content);});	
}