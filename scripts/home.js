var authlist, doclist, docmode,
	a_or_d=false,
	docmap={};

delete authmap._;
Object.keys(authmap).forEach(function(i){
	authmap[i].forEach(function(doc){
		if(!doc){ return; }
		if(docmap.hasOwnProperty(doc)){ docmap[doc].push(i); }
		else{ docmap[doc] = [i]; }
	});
});

$(window).resize(resizeApp);
$(document).ready(function(){
	authlist = document.getElementById('authlist');
	doclist = document.getElementById('doclist');
	docmode = document.getElementById('docmode');
	doclist.addEventListener('change',disp.bind(doclist,docmap,authlist,false));
	authlist.addEventListener('change',disp.bind(authlist,authmap,doclist,true));
	document.getElementById('sortbutton').addEventListener('click',sortDocs); 
	document.getElementById('openbutton').addEventListener('click',openDoc); 
	sortDocs();
	resizeApp();
});

function getVal(list){
	return list.value?list.value:
		list.options.length===1?list.options[0].value:
		'';
}

function openDoc(){
	var author = getVal(authlist),
		docname = getVal(doclist);
	if(!(author && docname)){alert("Please select a document.");return;}
	switch(docmode.value){
	case '3': docname+='&popup=true';
	case '1': docname+='&thumbnails=true';
		break;
	case '2': docname+='&popup=true';
	}
	window.location.assign('./?data='+author+"/"+docname);
}

function disp(map,list,which){
	if(which !== a_or_d){ return; }
	list.innerHTML = "";
	map[this.value].forEach(function(el){ list.options.add(new Option(el)); });
}

function sortLists(map,list){
	Object.keys(map).sort(function(a,b){
		return a.toLowerCase()<b.toLowerCase()?1:-1;
	}).forEach(function(k){
		list.options.add(new Option(k),null);
	});
}

function sortDocs(){
	authlist.innerHTML = "";
	doclist.innerHTML = "";
	a_or_d = !a_or_d;
	if(a_or_d){
		sortLists(authmap,authlist);
		this.innerText = "Sort by Document";
	}else{
		sortLists(docmap,doclist);
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