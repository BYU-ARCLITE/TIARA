Array.prototype.append = function(a){Array.prototype.push.apply(this, a);};
Array.prototype.remove = function(i){
	"use strict";
	var latch,
		j = (typeof(i) === 'number')?
		(i>=0?i:this.length+i):
		this.indexOf(i);
	if(j>=0){
		latch = this[j];
		for(i=this.length-1;j<i;j++){this[j]=this[j+1];}
		this.pop();
		return latch;
	}
};
Array.prototype.insert = function(newVal,i){
	"use strict";
	var j;
	switch(typeof(i)){
		case 'undefined': this.push(newVal);
			return;
		case 'number': j=(i>=0?i:this.length+i);
			break;
		default:
			j = this.indexOf(i);
	}
	if(j>=0){this.splice(j,0,newVal);}
};
Array.prototype.insertSorted = function(a,sfunc){
	"use strict";
	var i=this.length;
	if(i && sfunc(a,this[i-1])<0){
		for(i-=2;i>=0 && sfunc(a,this[i])<0;){i--;}
		this.splice(++i,0,a);
	}else{this.push(a);}
	return i;
};
Array.prototype.swap = function(i1,i2){
	"use strict";
	var tmp=this[i1];
	this[i1] = this[i2];
	this[i2] = tmp;
};

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") // closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");
		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this;
		return function () {
				return fToBind.apply(oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));    
			};
	};
}

function cmpGlosses(a,b){
	"use strict";
	return (b.word.length-a.word.length) || (b.word.toLowerCase().localeCompare(a.word.toLowerCase()));
}

// Use in right click menu for accessing selected text
var getSelectedText = //------------------------------------------------------ getSelectedText() ----------------->>>>>
	(window.getSelection)||
	(document.getSelection)||
	(
		(document.selection)?
		function(){return document.selection.createRange().text;}:
		function(){return "";}
	);

function map(obj,vals,callback){
	"use strict";
	var i;
	if(typeof obj !== 'object'){return;}
	if(obj instanceof Array){
		for(i=obj.length-1;i>=0;i--){
			map(obj[i],vals,callback);
		}
	}else{
		for(i=vals.length-1;i>=0;i--){
			obj[vals[i]] = callback(obj[vals[i]]);
		}
	}
}

/*String.prototype.htmlEntities = function () {
   return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
};*/

function entityToHTML(string) {
//	string = string.replace('&quot','"');
//	string = string.replace('&#39;',"'");
	return string?string.replace('&amp;','&').replace('&lt;','<').replace('&gt;','>'):"";
}

function HTMLToEntity(string){
	// /&(?!\w*;)/ //regex avoids messing up existing entitites, but we actually want to do that
	return string.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;');
}

//since this has to be shared with the page editor screen, it's easier to just leave it global
var TIARA = {
	Content:"",
	currentPage:0
};

function makeMainWindow(param){
	"use strict";
	var glossClickFunction = param.glossClick,
		curPageNum = $('#currentP'),
		totalPageNum = $('#totalP'),
		pageTitleBox = $('#theTitle'),
		mainContentBox = document.getElementById('mainContent'),
		contentLanguage,
		translationLanguage,
		aSel,getTranslation,
		thisObj,local_path,index;
	
	mainContentBox.innerHTML = "Loading...";
	
	function _log(type,data){
		data+="";
		if(window.console){console.log(data.substring(0,100));}
		$.ajax({
			type: 'POST',
			url: "TIARAlogger.php",
			success: function(data){if(window.console){console.log(data);}},
			error: null,
			data:{
				type:type.substring(0,50),
				data:data.substring(0,100),
				doc:param.doc.substring(0,100),
				page:(TIARA.currentPage+1)
			}
		});
	}
	
	//call google translator and put the result in the dialog box
	getTranslation = (function(){
		var tboxstyle = document.getElementById('translation').style,
			ttext = document.getElementById('wordsTranslate');
		return function(str,from,to){
			google.language.translate(str, from, to, function(result) {
				_log("Translation",str+" -> "+(result.translation || "Error"));
				if (!result.error){
					ttext.innerHTML = result.translation;
					tboxstyle.visibility='visible';
				}else{alert("Translation Error.");}
			});
		};
	}());
	
	// handler for when a language is selected from the drop down menu in the language translation pop-up window
	// I didn't just stick this in an anonymous handler function just in case we might want to call it in other circumstances
	function setLanguage(lang){//------------------------------------------------------ setLanguage() ----------------->>>>>
		translationLanguage = lang;
		getTranslation(aSel, contentLanguage, translationLanguage);
	}

	function unescape_content(text){
		var node = document.createElement('span');
		node.innerHTML = text.replace(
			/\n|(^|.)\\@/g,
			function(a,b){return (
				a==='\n'?'<br/>\n':
				b==='\\'?'\\@':
				b
			);}
		);
		return node;
	}
	
	function makeGlossNode(node,gloss){
		node.classList.add("gloss");
		node.addEventListener('click',glossClickFunction.bind(null,gloss));
		return node;
	}
	
	function HCString(text,glosses,filter,modnode){
		var span, pos, workstr,
			glen = glosses.length;
		if(glen===0){
			return filter(text);
		}else{
			span = document.createElement('span');
			pos = 0;
			workstr = " "+text;
			(function HCrecurse(strlen,index){
				var regex,regResult;	//divide workstr into 3 parts, accumulate 1&2 into the dom tree
				do{	{					//set workstr to part 3 until part 3 is zero-length
						regex = glosses[index--];	//save stack depth by decreasing index until we find something
						regex.lastIndex = pos;
					} //this block loops based on the following while() & the enclosing do...while() 
					if(index === -1){ break; }
					while(!!(regResult = regex.exec(workstr)) && (regex.lastIndex<=strlen)){
							HCrecurse(regResult.index+1,index); //part 1
							span.appendChild(modnode(filter(regResult[0]),regResult[1])); //part 2
							pos = regex.lastIndex;
					}
				}while(true);
				while(!!(regResult = regex.exec(workstr)) && (regex.lastIndex<=strlen)){
					span.appendChild(filter(workstr.substring(pos,regResult.index+1)));	//part 1
					span.appendChild(modnode(filter(regResult[0]),regResult[1]));		//part 2
					pos = regex.lastIndex;
				}
				span.appendChild(filter(workstr.substring(pos,strlen)));
			}(text.length+1,glen-1));
			return span;
		}
	}
			
	function highlightContent(content,glosses,filter,modnode){
		var root, nodes, n;
		if(glosses.length===0){
			return filter(content);
		}else{
			root = document.createElement('span');
			root.innerHTML = content;
			nodes = [root];
			while(n = nodes.pop()) switch(n.nodeType){
				case Node.ELEMENT_NODE:
					Array.prototype.push.apply(nodes,n.childNodes);
					continue;
				case Node.TEXT_NODE:
					n.parentNode.replaceChild(HCString(n.nodeValue,glosses,filter,modnode),n);
			}
			return root;
		}
	}
	
	// loads the page.  This is called several times whenever a new toggle (text image audio video) is selected in order
	// to set the glossed words in the page.
	function _loadPage(p){//------------------------------------------------------ loadPage() ----------------->>>>>
		var page,matcher,ptype;
		if(typeof p === 'number'){
			if(p <=0 || p > TIARA.Content.pages.length){return;}
			TIARA.currentPage = p-1;
			_log("Loaded Page",TIARA.currentPage);
		}
		// set the current page number between the black arrows
		curPageNum.html(TIARA.currentPage+1);
		// set the total page count between the black arrows
		totalPageNum.html(TIARA.Content.pages.length);
		page = {
			content:TIARA.Content.pages[TIARA.currentPage].content,
			title:TIARA.Content.pages[TIARA.currentPage].title || "&nbsp;"
		};
		if(Languages.c_format[contentLanguage]){Languages.c_format[contentLanguage](page);}
		matcher = Languages.parsers[contentLanguage] || Languages.parsers._default;
		
		// Load the title with the title and the main content area with the content
		ptype = thisObj.annotationModes.modemask;
		if(page_cache){ //In the reader, we don't worry about annotations changing, so we can cache every highlighted page
			if(!page_cache[TIARA.currentPage]){page_cache[TIARA.currentPage] = [];}
			mainContentBox.replaceChild(
				page_cache[TIARA.currentPage][ptype] ||
				(page_cache[TIARA.currentPage][ptype] = highlightContent(page.content,calcHighlightList(),unescape_content,makeGlossNode)),
				mainContentBox.firstChild
			);
		}else{
			mainContentBox.replaceChild(
				highlightContent(page.content,calcHighlightList(),unescape_content,makeGlossNode),
				mainContentBox.firstChild
			);
		}
		pageTitleBox.html(page.title);
		
		function calcHighlightList(){
			var i,x,thisgloss, regex, glosses=null, patterns = [],
				gwords = TIARA.Content.glossedWords;
			if(gloss_cache && gloss_cache[ptype]){glosses = gloss_cache[ptype];}
			else{
				glosses = gwords.filter(match_mask(ptype));
				if(gloss_cache){gloss_cache[ptype]=glosses;}
			}
			for (i=glosses.length-1,x=0;i>=0;i--){
				thisgloss = glosses[i];
				regex = thisgloss.matcher || matcher(thisgloss.word);
				if(!thisgloss.matcher){thisgloss.matcher = regex;}
				if(regex.test(page.content)){patterns.push(regex);}
			}
			return patterns;
		}

		function match_mask(mask){
			return [
				function(gloss){return false;},
				function(gloss){return gloss.textAnnotation.length;},
				function(gloss){return gloss.imageAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.imageAnnotation.length;},
				function(gloss){return gloss.audioAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.audioAnnotation.length;},
				function(gloss){return gloss.imageAnnotation.length || gloss.audioAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.imageAnnotation.length || gloss.audioAnnotation.length;},
				function(gloss){return gloss.videoAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.imageAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.imageAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.audioAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.audioAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.imageAnnotation.length || gloss.audioAnnotation.length || gloss.videoAnnotation.length;},
				function(gloss){return gloss.textAnnotation.length || gloss.imageAnnotation.length || gloss.audioAnnotation.length || gloss.videoAnnotation.length;}
			][mask];
		}
	}

	// handler for navigating to the next page
	function _nextPage(){//------------------------------------------------------ nextPage() ----------------->>>>>
		if(TIARA.Content.pages.length===1){return;}
		if(TIARA.currentPage<TIARA.Content.pages.length-1){
			TIARA.currentPage++;
		}else{
			TIARA.currentPage=0;
		}
		_log("Loaded Page",TIARA.currentPage);
		_loadPage();
		thisObj.annotationModes.newPageCleanup();
	}
	
	// handler for navigating to the previous page
	function _prevPage(){//------------------------------------------------------ prevPage() ----------------->>>>>
		if(TIARA.Content.pages.length===1){return;}
		if(TIARA.currentPage>0){
			TIARA.currentPage--;
		}else{
			TIARA.currentPage = TIARA.Content.pages.length-1;
		}
		_log("Loaded Page",TIARA.currentPage);
		_loadPage();
		thisObj.annotationModes.newPageCleanup();
	}

	//handler for the right-click menu translation option
	function _displayTranslation(){
		aSel = getSelectedText();
		if(aSel!==""){
			aSel = aSel.toString();
			getTranslation(aSel, contentLanguage, translationLanguage);
		}
	}
	
	thisObj = {
		annotationModes: null,
		translateBox: document.getElementById(param.translateBox),
		loadPage: _loadPage,
		nextPage: _nextPage,
		prevPage: _prevPage,
		displayTranslation: _displayTranslation,
		log: _log
	};
	
	function normalizeGlosses(content){
		var i,x=0,thatgloss={word:""},thisgloss,glosses,
			ann_props={
				textAnnotation:['title','content'],
				imageAnnotation:['title','url','content'],
				audioAnnotation:['title','url','content'],
				videoAnnotation:['title','url','content']
			};
		
		//normalize annotations so that even single annotations are contained in arrays, and merge
		//any glosses that have the same word value (sometimes happens in hand-edited files)
		if(!(content.glossedWords instanceof Array)){content.glossedWords = [content.glossedWords];}
		else{content.glossedWords.sort(cmpGlosses);}
		glosses = content.glossedWords;
		while(x<glosses.length){
			thisgloss = glosses[x];
			if(thisgloss.word.toLowerCase() === thatgloss.word.toLowerCase()){
				//collapse glosses with the same word
				for(i in ann_props){if(thisgloss.hasOwnProperty(i)){
					map(thisgloss[i],ann_props[i],entityToHTML);
					thatgloss[i][(thisgloss[i] instanceof Array)?'append':'push'](thisgloss[i]);
				}}
				glosses.remove(x);
			}else{
				for(i in ann_props){
					if(thisgloss.hasOwnProperty(i)){
						map(thisgloss[i],ann_props[i],entityToHTML);
						if(!(thisgloss[i] instanceof Array)){thisgloss[i] = [thisgloss[i]];}
					}else if(ann_props.hasOwnProperty(i)){thisgloss[i] = [];}
				}
				//thatgloss is the gloss from the previous iteration
				thatgloss = thisgloss;
				x++;
			}
		}
	}
	
	function parseJSONContent(jsonContent){//------------------------------------------------------ setContent() ----------------->>>>>
		var x;
		if(jsonContent.pages){
			if(!(jsonContent.pages instanceof Array)){
				map(jsonContent.pages,['title','content'],entityToHTML);//unescape);
				jsonContent.pages = [jsonContent.pages];
			}else{
				for(x=jsonContent.pages.length-1;x>=0;x--){
					map(jsonContent.pages[x],['title','content'],entityToHTML);//unescape);
				}
			}
		}else{jsonContent.pages = [{title:"",content:""}];}
		if(!jsonContent.contentLanguage){jsonContent.contentLanguage="es";}
		if(!jsonContent.translationLanguage){jsonContent.translationLanguage="en";}
		if(!jsonContent.glossedWords){jsonContent.glossedWords = [];}
		else{normalizeGlosses(jsonContent);}

		contentLanguage=jsonContent.contentLanguage;
		translationLanguage=jsonContent.translationLanguage;

		return jsonContent;
	}
	
	// sets Content to the json object, then loads the page
	function setContent(data){
		TIARA.Content = parseJSONContent(data);
		if(param.onContentLoaded){param.onContentLoaded(TIARA.Content);}
		_loadPage();
	}
	
	if(param.doc){
		param.doc = unescape(param.doc);
		local_path = window.location.href;
		index = local_path.search(/\/[^\/]*\?/);
		if(index === -1){local_path.lastIndexOf('/');}
		local_path = local_path.substring(0,index)+"/docs/"+param.doc;
		// call jQuery ajax to retrieve the document
		$.ajax({
			url: local_path+".json?time="+(+new Date),
			success: setContent,
			error: function(http,text,err){
				if(window.console){console.log(err);}
				alert("Error "+http.status+" loading document.");
			},
			dataType: "json"
		});
	}else{
		TIARA.Content = {
			glossedWords: [],
			contentLanguage: "en",
			translationLanguage: "es",
			pages: [{title:"",content:""}]
		};
	}
	
	//prev and next buttons
	var jqObj = $('#'+param.nextPageButton);
	jqObj.attr("src","images/right.png");
	jqObj.mouseover(function(){this.src="images/rightover.png";});
	jqObj.mouseout(function(){this.src="images/right.png";});
	jqObj.mousedown(function(){this.src="images/rightdown.png";});
	jqObj.mouseup(function(){this.src="images/right.png";});
	jqObj.click(thisObj.nextPage);

	(jqObj=$('#'+param.prevPageButton)).attr("src","images/left.png");
	jqObj.mouseover(function(){this.src="images/leftover.png";});
	jqObj.mouseout(function(){this.src="images/left.png";});
	jqObj.mousedown(function(){this.src="images/leftdown.png";});
	jqObj.mouseup(function(){this.src="images/left.png";});
	jqObj.click(thisObj.prevPage);
	
	(jqObj=$('#'+param.curPageDisp)).dblclick(function(){
		var p = prompt("Jump to Page:");
		if(!p || !(p=parseInt(p,10))){return;}
		thisObj.loadPage(p);
	});
	jqObj.css("cursor","pointer");
	
	thisObj.translateBox.onchange = function(){setLanguage(this.value);};
	
	if(param.extension){param.extension(thisObj,param);}
	
	return thisObj;
}