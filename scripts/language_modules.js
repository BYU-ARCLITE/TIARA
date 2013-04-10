var Languages = {
	list:[
		["af","Afrikaans"],
		["sq","Albanian"],
		["ar","Arabic"],
		["hy","Armenian ALPHA"],
		["az","Azerbaijani ALPHA"],
		["eu","Basque ALPHA"],
		["be","Belarusian"],
		["bg","Bulgarian"],
		["ca","Catalan"],
		["zh","Chinese"],
		["hr","Croatian"],
		["cs","Czech"],
		["da","Danish"],
		["nl","Dutch"],
		["en","English"],
		["et","Estonian"],
		["tl","Filipino"],
		["fi","Finnish"],
		["fr","French"],
		["gl","Galician"],
		["ka","Georgian ALPHA"],
		["de","German"],
		["el","Greek"],
		["ht","Haitian Creole ALPHA"],
		["iw","Hebrew"],
		["hi","Hindi"],
		["hu","Hungarian"],
		["is","Icelandic"],
		["id","Indonesian"],
		["ga","Irish"],
		["it","Italian"],
		["ja","Japanese"],
		["ko","Korean"],
		["lv","Latvian"],
		["lt","Lithuanian"],
		["mk","Macedonian"],
		["ms","Malay"],
		["mt","Maltese"],
		["no","Norwegian"],
		["fa","Persian"],
		["pl","Polish"],
		["pt","Portuguese"],
		["ro","Romanian"],
		["ru","Russian"],
		["sr","Serbian"],
		["sk","Slovak"],
		["sl","Slovenian"],
		["es","Spanish"],
		["sw","Swahili"],
		["sv","Swedish"],
		["th","Thai"],
		["tr","Turkish"],
		["uk","Ukrainian"],
		["ur","Urdu ALPHA"],
		["vi","Vietnamese"],
		["cy","Welsh"],
		["yi","Yiddish"]
	],
	c_format:{
		ar: function(page){
			page.title="<div style='text-align:right;' dir='rtl'>"+page.title+"</div>";
			page.content="<div style='position:relative;width:100%;font-size:20px;text-align:right;' dir='rtl'>"+page.content+"</div>";
		},
		iw: function(page){
			page.title="<div style='text-align:right;' dir='rtl'>"+page.title+"</div>";
			page.content="<div style='position:relative;width:100%;text-align:right;' dir='rtl'>"+page.content+"</div>";
		},
		fa: function(page){
			page.title="<div style='text-align:right;' dir='rtl'>"+page.title+"</div>";
			page.content="<div style='position:relative;width:100%;text-align:right;' dir='rtl'>"+page.content+"</div>";
		}/*,
		ja:function(page){
			page.title="<div>"+page.title+"</div>";
			page.content="<div>"+page.content+"</div>";
			$("#mainContent").css({
				'writing-mode':'tb-rl',
				'-webkit-transform':'rotate(90deg)',
				'-moz-transform':'rotate(90deg)'
			});				
		}*/
	},
	a_format:{
		ar:function(ann){
			ann.title = "<div style='font-size:20px;' dir='rtl'>"+ann.title+"</div>";
			ann.content = "<div style='font-size:16px;display:block;' dir='rtl'>"+ann.content+"</div>";
		},
		_default:function(ann){
			ann.title = "<div style='font-weight:bold;font-size:12px;'>"+ann.title+"</div>";
			ann.content = "<div style='display:block;'>"+ann.content+"</div>";
		}
	},
	alignment:{
		ar:'right',
		iw:'right',
		fa:'right'
	},
	parsers:(function(){
		//closure scope stuff goes here
		function overwrite_exec(i,j){
			return function exec(s){
				var ret,
					res = RegExp.prototype.exec.call(this,s);
				if(res){
					ret = [res[i],res[j]];
					ret.index = res.index;
					return ret;
				}
				return null;
			};
		}
		
		function parse_no_spaces(word){
			var lastIndex=0,
				tag_word=word+'\\@',
				wlen=tag_word.length;
			return {
				test:function(s){
					return s.indexOf(tag_word)>=0;
				},
				exec:function(s){
					var ret, index = s.indexOf(tag_word,lastIndex);
					if(index>=0){
						lastIndex = index+wlen;
						ret = [word,word];
						ret.index = index-1;
						return ret;
					}
					return null;
				},
				deepCopy:function(){return this;},
				get lastIndex(){return lastIndex;},
				set lastIndex(i){lastIndex=i;}
			};
		}
	
		return {
			ar:(function(){
				//ARABIC FULL STOP - U+06D4 ARABIC QUESTION MARK - U+061F ARABIC COMMA - U+060C ARABIC SEMICOLON - U+061B ARABIC DECIMAL SEPARATOR - U+066B
				var arpunctuation = "\\s\\u06D4\\u061F\\u060C\\u061B\\u066B\\u061E!.",
					arletters = "\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF",
					arprefixes = "\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF",
					rf = "(?:^|[^"+arletters+"])(["+arprefixes+"]?(",
					rl = "))(?=$|["+arpunctuation+"]|[^"+arletters+"])",
					exec = overwrite_exec(2,1);
				
				return function(word){
					var regex = RegExp(rf+word.replace(/[\-\/\\?.*\^$\[{()|+]/g,"\\$&")+rl,'gim');
					regex.exec = exec;
					return regex;
				};
			}()),
			ja:parse_no_spaces,
			zh:parse_no_spaces,
			_default:(function(){
				var latin_non_word = "\\s~`'\";:.,/?><[\\]{}\\\\|)(*&^%$#@!=\\-—",
					rf = "(?:^|["+latin_non_word+"])(",
					rl = ")(?=$|["+latin_non_word+"])",
					exec = overwrite_exec(1,1);
				return function(word){
					var regex = RegExp(rf+word.replace(/[\-\/\\?.*\^$\[{()|+]/g,"\\$&")+rl,'gim');
					regex.exec = exec;
					return regex;
				};
			}())
		};
	}()),
	alignment:{
		ar:'right',
		iw:'right',
		fa:'right'
	},
	gloss_markers:(function(){
		function basic_marker(text,word){
			var regex = RegExp(
				word.replace(/[\-\/\\?.*\^$\[{()|+]/g,"\\$&") // escape those characters before forming the regex
				+'(?!\\\\@)', // replace if it doesn't have a \@ after it
			'gi');
			return regex.test(text) && text.replace(regex,"$&\\@"); //add a \@ after matching words
		}
		return {
			ja:basic_marker,
			zh:basic_marker
		};
	}())
};