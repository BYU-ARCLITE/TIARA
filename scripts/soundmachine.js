// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer() {
	"use strict";
	var versionRevision, tempArrayMajor,
		versionMajor, versionMinor,
		swVer2;
		// NS/Opera version >= 3 check for Flash plugin in plugin array
	if (navigator.plugins && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			tempArrayMajor = navigator.plugins["Shockwave Flash" + swVer2].description.split(" ")[2].split(".");			
			versionMajor = tempArrayMajor[0];
			versionMinor = tempArrayMajor[1];
			versionRevision = descArray[3] || descArray[4];
			if (versionRevision.indexOf("d") > 0) {
				versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
			} else if (versionRevision[0] === 'r') {
				versionRevision = versionRevision.substring(1);	
			}
			return versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") !== -1) {return '4';}
	// WebTV 2.5 supports Flash 3
	if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") !== -1) {return '3';}
	// older WebTV supports Flash 2
	if (navigator.userAgent.toLowerCase().indexOf("webtv") !== -1) {return '2';}
		return '';
}// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
	"use strict";
	var versionArray, versionMajor,
		versionMinor, versionRevision,
		versionStr = GetSwfVer();
	if (versionStr === '' ) {
		return false;
	} else {
		versionArray	= versionStr.split(".");
		versionMajor	= versionArray[0];
		versionMinor	= versionArray[1];
		versionRevision	= versionArray[2];
		// is the major.revision >= requested major.revision AND the minor version >= requested minor
		return (versionMajor > parseFloat(reqMajorVer) ||
			(versionMajor === parseFloat(reqMajorVer) &&
				(versionMinor > parseFloat(reqMinorVer) ||
					(versionMinor === parseFloat(reqMinorVer) && versionRevision >= parseFloat(reqRevision)))));
	}
}
function AC_AddExtension(src, ext) {
	"use strict";
	return (src.indexOf('?') !== -1)?
		src.replace(/\?/, ext+'?'):
		src + ext;
}
function AC_Generateobj(ext, classid, mimeType, args) {
	"use strict";
	var i, embed = document.createElement("embed"),
		embedAttrs = AC_GetArgs(ext, classid, mimeType, args);
	for (i in embedAttrs) if(embedAttrs.hasOwnProperty(i)) {
		embed[i] = embedAttrs[i];
	}
	document.body.appendChild(embed);
}
var AC_FL_RunContent = AC_Generateobj.bind(null,
		".swf", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
		"application/x-shockwave-flash"
	);
var AC_SW_RunContent = AC_Generateobj.bind(null,
		".dcr", "clsid:166B1BCA-3F9C-11CF-8075-444553540000",
		null
	);
function AC_GetArgs(ext, classid, mimeType, args){
	"use strict";
	var i, embedAttrs = {};
	for (i in args) if(args.hasOwnProperty(i)) {
		switch (i.toLowerCase()){	
			case "src":		case "movie":
				embedAttrs.src = AC_AddExtension(args[i], ext);
				break;
			case "id":		case "name":
			case "width":	case "height":
			case "align":	case "vspace":	case "hspace":
			case "class":	case "title":
			case "accesskey":	case "tabindex":
			case "pluginspage":
			default:
				embedAttrs[i] = args[i];
				break; //the rest of these are no-ops;
			case "classid":			case "codebase":
			case "onafterupdate":	case "onbeforeupdate":
			case "onblur":			case "oncellchange":
			case "onclick":			case "ondblclick":
			case "ondrag":			case "ondragend":
			case "ondragenter":		case "ondragleave":
			case "ondragover":		case "ondrop":
			case "onfinish":		case "onfocus":
			case "onhelp":			case "onmousedown":
			case "onmouseup":		case "onmouseover":
			case "onmousemove":		case "onmouseout":
			case "onkeypress":		case "onkeydown":
			case "onkeyup":			case "onload":
			case "onlosecapture":	case "onpropertychange":
			case "onreadystatechange":
			case "onrowsdelete":	case "onrowenter":
			case "onrowexit":		case "onrowsinserted":
			case "onstart":			case "onscroll":
			case "onbeforeeditfocus":
			case "onactivate":		case "onbeforedeactivate":
			case "ondeactivate":	case "type":
		}
	}
	if (mimeType) {embedAttrs.type = mimeType;}
	return embedAttrs;
}