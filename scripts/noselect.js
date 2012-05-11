// JavaScript Document
/***********************************************
* Disable Text Selection script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/

//this actually doesn't look like the stuff for which we have that legal statement anymore

//var retfalse = function(){return false;};

function disableSelection(target){/*
	if (typeof target.onselectstart!="undefined"){ //IE route
		target.onselectstart=retfalse;
	}else if (typeof target.style.MozUserSelect!="undefined")} //Firefox route
		target.style.MozUserSelect="none"
	}else{ //All other route (ie: Opera)
		target.onselectstart=retfalse;
		target.onmousedown=retfalse;
	}*/
	$(target).attr('unselectable', 'on')
           .css('-moz-user-select', 'none')
           .each(function() { 
               this.onselectstart = function() { return false; };
            });
	target.style.cursor = "default"
}

//Sample usages
//disableSelection(document.body) //Disable text selection on entire body
//disableSelection(document.getElementById("mydiv")) //Disable text selection on element with id="mydiv"