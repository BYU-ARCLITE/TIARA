/*Implied global:
 document 2,3,4,5,132,217,227,240,251,274,277,278,281,297,306,315,330,
 TIARA 35,36,59,60,175,261,339,371,372,376,
 $ 48,68,74,81,198,381,382,383,384,388,389,390,391,
 Option 58,60,
 gup 69,
*/

// soundPlay accesses the soundMachine swf file or native Audio object and passes the url to be played
var soundPlay; //wait until the page is loaded and grab the function ref once in the initiation
//it remains global because of being assigned to an onclick event in an HTML string.

function makeAnnotations(parent,param){
	"use strict";
	//toggles for whether a mode is active or not
	var tmode=1,imode=2,amode=4,vmode=8,
		mode=((param.textmode?1:0) | (param.imagemode?2:0) | (param.audiomode?4:0) | (param.videomode?8:0)),
		nav_buttons = $("#" + param.nav_buttons), //change to get this from the main window object
		thumbnails=gup('thumbnails'), // get thumbnails parameter to activate thumbnails mode,
		allb = document.getElementById("allbutton"),
		thisObj,
		container = container = param.annotation_div,
		btypes={
			src1:"url('images/b1.png')",
			src2:"url('images/b2.png')",
			src3:"url('images/b3.png')",
			src4:"url('images/b4.png')",
			color1:"#666",
			color2:"#000",
			color3:"#0000d2",
			color4:"#0000d2"
		},bmap={};

	function generateModeFuncs(id){
		switch(id){
			case "textbutton": return function(onoff){if(onoff){mode|=tmode;}else{mode^=tmode;}};
			case "imagebutton": return function(onoff){if(onoff){mode|=imode;}else{mode^=imode;}};
			case "audiobutton": return function(onoff){if(onoff){mode|=amode;}else{mode^=amode;}};
			case "videobutton": return function(onoff){if(onoff){mode|=vmode;}else{mode^=vmode;}};
		}
		return function(){};
	}
	nav_buttons.each(function(){
		var _hover=false,_active=false,that=this,
			glow=btypes.src4,glowC=btypes.color4,
			base=btypes.src3,baseC=btypes.color3,
			updateMode = generateModeFuncs(this.id);
		
		function updateButton(){
			if(_hover){									
				this.style.background=glow;
				this.style.color=glowC;
			}else{									
				this.style.background=base;
				this.style.color=baseC;
			}
		}
			
		bmap[this.id] = {
			get hover(){return _hover;},
			set hover(value){
				if((!!value)===_hover){return;}
				_hover=!!value;
				updateButton.call(that);
			},
			get active(){return _active;},
			set active(value){
				if((!!value)===_active){return;}
				if(_active=(!!value)){
					glow=btypes.src4;glowC=btypes.color4;
					base=btypes.src3;baseC=btypes.color3;
				}else{
					glow=btypes.src2;glowC=btypes.color2;
					base=btypes.src1;baseC=btypes.color1;
				}
				updateButton.call(that);
				updateMode(_active);
			},
			obj:that
		};
		this.style.background=btypes.src3;
		this.style.color=btypes.color3;
	});
		
	// Code for right click menu
	// translation option
	$("#myDiv").contextMenu({menu: 'myMenu'},
		function(action, el, pos) {
			if(action==="translate"){
				parent.displayTranslation();
			}else{
				nav_buttons.each(function(){
					if(this.id===action){
						$(this).trigger('click');
						return false;
					}
				});
			}
		}
	);
	
	thisObj	= {
		//setter/accessors
		get textmode(){return !!(mode&tmode);},
		get imagemode(){return !!(mode&imode);},
		get audiomode(){return !!(mode&amode);},
		get videomode(){return !!(mode&vmode);},
		get modemask(){return mode;},
		modeToggle:function(props){
			var allb,key,
				onoff=!props.active;
			parent.log("Turned Annotation Type O"+(onoff?"n":"ff"),props.obj.id);
			if(props.obj.id==='allbutton'){
				for(key in bmap){if(bmap.hasOwnProperty(key)){
					bmap[key].active=onoff;
				}}
			}else{
				props.active=onoff;
				bmap.allbutton.active=(mode===15);
			}
			if(onoff){//positive change
				thisObj.clearAnnotations();
				thisObj.loadAnnotations();
			}else{//negative change
				thisObj.removeAnnotations();
			}
		},
		// loads annotations into the annotations frame
		loadAnnotations:(function(){ //constructor function for loadAnnotations(clickedGloss)
			//private variables
			var br="<br/>",
				splashes=[[null,null],[null,null],[null,null],[null,null]],
				t_splash = splashes[0], //0=container,1=text
				i_splash = splashes[1], //these are just useful aliases
				a_splash = splashes[2],
				v_splash = splashes[3],
				boxtypes,
				textcounter,
				tHTML,iHTML,aHTML,vHTML,
				unFloat,textFloat,imageFloat,audioFloat,videoFloat,
				display_function;
		
			//private functions
			function dispAnnotations(annclass,element,thisann,HTMLFunc){
				var	new_el,y;
				if(!thisann){return;}
				textcounter = 1;
				for(y=0;y<thisann.length;y++){if(!!thisann[y]){
					new_el = HTMLFunc(thisann[y]);
					if(new_el!==null){
						new_el.className = annclass;
						element.appendChild(new_el);
					}
				}}
			}
			
			if(thumbnails){
				// Collapses thumbnails
				unFloat = function(x){
					var i,splash;
					for(i=0;i<4;i++){if(i!==x){
						splash = splashes[i];
						if(!splash[0]){continue;}
						splash[0].innerHTML = '';
						splash[1].innerHTML = '';
					}}
				};
				
				// Loads text when a text thumbnail is clicked
				textFloat = function(obj){
					unFloat(0);
					(Languages.a_format[TIARA.Content.contentLanguage] || Languages.a_format._default)(obj);
					t_splash[0].innerHTML = "<hr/>"+obj.title+"<br/>";
					t_splash[1].innerHTML = obj.content+"<hr/>";
					t_splash[0].appendChild(t_splash[1]);
				};

				// Loads a large image when an image thumbnail is clicked
				imageFloat = function(obj){
					unFloat(1);
					i_splash[0].innerHTML = '<hr/><img width="250px" src="'+obj.src+'"/><br/>';
					i_splash[1].innerHTML = obj.alt+"<hr/>";
					i_splash[0].appendChild(i_splash[1]);
				};

				// Loads a audio control when an audio thumbnail is clicked
				audioFloat = function(obj,desc){
					unFloat(2);
					a_splash[0].innerHTML = "<hr/><img src='images/play.png' class='audioplay' width='160px'/><br/>";
					a_splash[1].innerHTML = desc+"<hr/>";
					a_splash[0].appendChild(a_splash[1]);
					var jQObj = $('.audioplay');
					//do we really need to do this every time?
					jQObj.mouseover(function(){this.src="images/playover.png";});
					jQObj.mouseout(function(){this.src="images/play.png";});
					jQObj.mousedown(function(){this.src="images/playpress.png";});
					jQObj.mouseup(function(){this.src="images/playover.png";});
					jQObj.click(function(){soundPlay(obj.title);});
				};

				// Loads a large video when a video thumbnail is clicked
				videoFloat = function(obj,desc){
					unFloat(3);
					v_splash[0].innerHTML =
						(/youtube/i.test(obj.title))?'<hr/><iframe src="'+obj.title.replace("&.*","").replace("watch?v=","v/")+'" frameborder="0" scrolling="no" width="100%"></iframe><br/>':
						(/youtu\.be/i.test(obj.title))?'<hr/><iframe src="'+obj.title.replace(/.*youtu\.be/i,"http://www.youtube.com/v")+'" frameborder="0" scrolling="no" width="100%"></iframe><br/>':
						"<hr/><video src='"+obj.title+"' controls='controls' width='100%'>Your browser does not support this video.</video><br/>";
					v_splash[1].innerHTML = desc+"<hr/>";
					v_splash[0].appendChild(v_splash[1]);
				};
				
				tHTML = function(a){
					if(a.content!==""){
						var divTitle = a.title||("Click for Text "+textcounter++),
							new_el = document.createElement('span');
						new_el.onclick = function(){
							textFloat({title:a.title,content:a.content});
							parent.log("Viewed Text Annotation",a.title||a.content);
						};
						new_el.innerHTML = "<b>"+divTitle+"</b><br/>";
						new_el.className = "v-ellip";
						new_el.style.cursor = "pointer";
						return new_el;
					}else{return null;}
				};
				iHTML = function(a){
					if(a.url!==""){
						var divTitle = a.title||"",
							divContent = a.content||"",
							new_el = document.createElement('img');
						new_el.onclick = function(){
							imageFloat(new_el);
							parent.log("Viewed Image Annotation",a.title||a.content||a.url);
						};
						new_el.title = divTitle+': '+divContent;
						new_el.src = a.url;
						new_el.alt = '<b>'+divTitle+'</b><br/>'+divContent+'<br/>';
						new_el.style.width = '40px';
						new_el.style.cursor = "pointer";
						return new_el;
					}else{return null;}
				};
				aHTML = function(a){
					if(a.url!==""){
						var divTitle = (a.title)?"<b>"+a.title+"</b><br/>":"",
							divContent = a.content||"",
							new_el = document.createElement('span');
						new_el.title = a.url;
						new_el.onclick = function(){
							audioFloat(new_el,divContent);
							parent.log("Viewed Audio Annotation",a.title||a.content||a.url);
						};
						new_el.innerHTML = divTitle+'<img src="images/audioicon.png"/><br/>';
						new_el.style.cursor = "pointer";
						return new_el;
					}else{return null;}
				};
				vHTML = function(a){
					if(a.url!==""){
						var divTitle = (a.title)?"<b>"+a.title+"</b><br/>":"",
							divContent = a.content||"",
							new_el = document.createElement('span');
						new_el.title = a.url.replace("&.*","").replace("watch?v=","v/");
						new_el.onclick = function(){
							videoFloat(new_el,divContent);
							parent.log("Viewed Video Annotation",a.title||a.content||a.url);
						};
						new_el.innerHTML = divTitle+'<img src="images/videoicon.png"/><br/>';
						new_el.style.cursor = "pointer";
						return new_el;
					}else{return null;}
				};
				display_function = function(thisgloss){
					var x,newdiv,nd2;
					// sets title and content styles
					// create containers for the annotations, named respectively textAnnotationBox, imageAnnotationBox, etc...
					for(x=0;x<4;x++){
						if(
								thisObj[boxtypes[x][0]] && //this.textmode, this.imagemode, etc.
								thisgloss[boxtypes[x][1]].length //and the annotations exist on this gloss
						){
							newdiv = document.createElement('div');
							newdiv.className=boxtypes[x][2];
							newdiv.id=boxtypes[x][3];
							newdiv.appendChild(document.createElement('br'));
							nd2 = document.createElement('div');
							splashes[x][0] = nd2;
							newdiv.appendChild(nd2);
							splashes[x][1] = document.createElement('div');
							container.appendChild(newdiv);
							
							dispAnnotations(boxtypes[x][2],newdiv,
								thisgloss[boxtypes[x][1]],
								boxtypes[x][4]
							);
						}
					}
				};
			}else{
				tHTML = function(a){
					var obj,newdiv;
					if(a.title||a.content){
						obj={
							title: a.title || "",
							content: a.content || ""
						};
						(Languages.a_format[TIARA.Content.contentLanguage] || Languages.a_format._default)(obj);
						newdiv = document.createElement('div');
						newdiv.innerHTML = br+obj.title+br+obj.content;
						return newdiv;
					}else{return null;}
				};
				iHTML = function(a){
					var obj,newdiv;
					if(a.url!==""){
						obj={
							title: a.title || "",
							content: a.content || ""
						};
						(Languages.a_format[TIARA.Content.contentLanguage] || Languages.a_format._default)(obj);
						newdiv = document.createElement('div');
						newdiv.innerHTML = '<hr/>'+obj.title+br+'<img src="'+a.url+'" width="250px"/>'+br+br+obj.content;
						return newdiv;
					}else{return null;}
				};
				aHTML = function(a){
					var obj,newdiv;
					if(a.url!==""){
						obj={
							title: a.title || "",
							content: a.content || ""
						};
						(Languages.a_format[TIARA.Content.contentLanguage] || Languages.a_format._default)(obj);
						newdiv = document.createElement('div');
						newdiv.innerHTML = "<hr/>"+obj.title+br+"<img src='images/play.png' class='audioplay' width='160px' "+
							"onmouseover='this.src=\"images/playover.png\";' "+
							"onmouseout='this.src=\"images/play.png\";' "+
							"onmousedown='this.src=\"images/playpress.png\"; '"+
							"onmouseup='this.src=\"images/playover.png\";' "+
							"onclick='soundPlay(\""+a.url+"\");' "+
							"/>"+br+br+obj.content;
						return newdiv;
						}else{return null;}
				};
				vHTML = function(a){
					var obj,newdiv;
					if(a.url!==""){
						obj={
							title: a.title || "",
							content: a.content || ""
						};
						(Languages.a_format[TIARA.Content.contentLanguage] || Languages.a_format._default)(obj);
						newdiv = document.createElement('div');
						console.log(a.url);
						newdiv.innerHTML = '<hr/>'+obj.title+br+(
								(/youtube/i.test(a.url))?'<iframe src="'+a.url.replace("&.*","").replace("watch?v=","v/")+'" frameborder="0" scrolling="no" width="100%"></iframe>':
								(/youtu\.be/i.test(a.url))?'<iframe src="'+a.url.replace(/.*youtu\.be/i,"http://www.youtube.com/v")+'" frameborder="0" scrolling="no" width="100%"></iframe>':
								"<video src='"+a.url+"' controls='controls' width='100%'>Your browser does not support this video.</video>"
							)+br+br+obj.content;
						return newdiv;
					}else{return null;}
				};
				display_function = function(thisgloss){
					for(var x=0;x<4;x++){
						if(
							thisObj[boxtypes[x][0]] && //this.textmode, this.imagemode, etc.
							thisgloss[boxtypes[x][1]].length //and the annotations exist on this gloss
						){
							dispAnnotations(boxtypes[x][2],container,
								thisgloss[boxtypes[x][1]],
								boxtypes[x][4]
							);
						}
					}
				};
			}
			boxtypes = [
				['imagemode','imageAnnotation','imageannotation','imageAnnotationBox',iHTML],
				['videomode','videoAnnotation','videoannotation','videoAnnotationBox',vHTML],
				['audiomode','audioAnnotation','audioannotation','audioAnnotationBox',aHTML],
				['textmode','textAnnotation','textannotation','textAnnotationBox',tHTML]
			];
			
			return function(clickedGloss){//------------------------------------------------------ loadAnnotations() ----------------->>>>>
				if(!clickedGloss){
					if(!parent.activeGloss){return;}
					clickedGloss = parent.activeGloss;
				}
				// find the gloss corresponding to the current active word
				var glossL = clickedGloss.toLowerCase();
				if(glossL in TIARA.Content.glossMap){
					parent.activeGloss=clickedGloss;
					display_function(TIARA.Content.glossMap[glossL]);
					container.style.visibility = 'visible';
				}else{ //this should never happen
					alert(glossL + " not in annotation list.");
				}
			};
		}()),
		// removes annotations from the annotations frame if the annotation is turned off
		removeAnnotations:function(){
			mode&tmode || $('.textannotation').remove(); //remove text annotation blocks
			mode&imode || $('.imageannotation').remove(); //remove image annotation blocks
			mode&amode || $('.audioannotation').remove(); //remove audio annotation blocks
			mode&vmode || $('.videoannotation').remove(); //remove video annotation blocks
		},
		// where the actual removing happens
		clearAnnotations:function(){
			$('.textannotation').remove();
			$('.imageannotation').remove();
			$('.audioannotation').remove();
			$('.videoannotation').remove();
		},
		newPageCleanup:
			(param.popup
			?function(){
				thisObj.clearAnnotations();
				param.annotation_div.style.visibility = 'hidden';
				parent.activeGloss = "";
				parent.clearGloss();
			}
			:function(){
				thisObj.clearAnnotations();
				parent.activeGloss = "";
				parent.clearGloss();
			})
	};
	
	//annotation button logic
	nav_buttons.mouseover(function(){bmap[this.id].hover=true;});
	nav_buttons.mouseout(function(){bmap[this.id].hover=false;});
	nav_buttons.click(function(){
		thisObj.modeToggle(bmap[this.id]);
		parent.loadPage();
	});
	
	bmap["allbutton"].active=(mode===15);
	bmap["textbutton"].active=!!param.textmode;
	bmap["imagebutton"].active=!!param.imagemode;
	bmap["audiobutton"].active=!!param.audiomode;
	bmap["videobutton"].active=!!param.videomode;
	
	return thisObj;
}

function extendReaderMainWindow(thisObj,param){
	"use strict";
	var ti = document.getElementById('ti'),
		ii = document.getElementById('ii'),
		ai = document.getElementById('ai'),
		vi = document.getElementById('vi'),
		container = param.annotation_div,
		popup = param.popup,
		x;

	thisObj.annotationModes = makeAnnotations(thisObj,param);
	
	thisObj.activeGloss="";
	thisObj.clearGloss = function(){
		// clear icons
		ti.style.visibility='hidden';
		ii.style.visibility='hidden';
		ai.style.visibility='hidden';
		vi.style.visibility='hidden';
		if(!thisObj.activeGloss){
			$('#activeA').html("Select a blue word");
		}
	};
	thisObj.setGloss = function(gloss){ // sets the word in the right window to what ever glossed word was clicked as well as loads icons
		var	x,y,thisgloss,glossL,gwords,
			loadAnnIcons = function(anntype,element,uorc){
				if(!anntype){return;}
				for(y=anntype.length-1;y>=0;y--){
					if(anntype[y] && anntype[y][uorc]!==""){
						element.style.visibility='visible';
						break;
					}
				}
			};
			
		// checks capital first letter or lowercase first letter
		glossL = gloss.toLowerCase();
		if(glossL!==thisObj.activeGloss.toLowerCase()){
			thisObj.activeGloss = gloss;
			thisObj.clearGloss();
			if(!gloss){return;}
			
			// load icon depending on whether the glossed word has that annotation
			gwords = TIARA.Content.glossMap;
			if(gwords.hasOwnProperty(glossL)){
				thisgloss = gwords[glossL];
				loadAnnIcons(thisgloss.textAnnotation,ti,'title'); //text icon
				loadAnnIcons(thisgloss.textAnnotation,ti,'content'); //text icon
				loadAnnIcons(thisgloss.imageAnnotation,ii,'url'); //image icon
				loadAnnIcons(thisgloss.audioAnnotation,ai,'url'); //audio icon
				loadAnnIcons(thisgloss.videoAnnotation,vi,'url'); //video icon
			}else{alert(glossL + " not in the gloss list.");}

			// load the word in the right panel to the clicked glossed word
			$('#activeA').html(gloss.replace(/(^|.)\\@/g,function(a,b){return b==='\\'?'\\@':b;})+"&nbsp;&nbsp;&nbsp;");
			// clear any existing annotations
			thisObj.annotationModes.clearAnnotations();
			// load the new annotations available to the clicked glossed word
			thisObj.annotationModes.loadAnnotations(gloss);
		}
		
		if(popup){container.style.visibility = 'visible';}
		thisObj.log("Clicked Gloss",gloss);
	};
	
	thisObj.translateBox.add(new Option("---"),null);
	for(x=0;x<Languages.list.length;x++){
		thisObj.translateBox.add(new Option(Languages.list[x][1],Languages.list[x][0]),null);
	}
}