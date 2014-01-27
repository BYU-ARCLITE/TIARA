var Languages = (function(){
	return {
		af:{name:"Afrikaans"},
		sq:{name:"Albanian"},
		ar:{name:"Arabic"},
		hy:{name:"Armenian ALPHA"},
		az:{name:"Azerbaijani ALPHA"},
		eu:{name:"Basque ALPHA"},
		be:{name:"Belarusian"},
		bg:{name:"Bulgarian"},
		ca:{name:"Catalan"},
		zh-CN:{name:"Chinese"},
		hr:{name:"Croatian"},
		cs:{name:"Czech"},
		da:{name:"Danish"},
		nl:{name:"Dutch"},
		en:{name:"English"},
		et:{name:"Estonian"},
		tl:{name:"Filipino"},
		fi:{name:"Finnish"},
		fr:{name:"French"},
		gl:{name:"Galician"},
		ka:{name:"Georgian ALPHA"},
		de:{name:"German"},
		el:{name:"Greek"},
		ht:{name:"Haitian Creole ALPHA"},
		iw:{name:"Hebrew"},
		hi:{name:"Hindi"},
		hu:{name:"Hungarian"},
		is:{name:"Icelandic"},
		id:{name:"Indonesian"},
		ga:{name:"Irish"},
		it:{name:"Italian"},
		ja:{name:"Japanese"},
		ko:{name:"Korean"},
		lv:{name:"Latvian"},
		lt:{name:"Lithuanian"},
		mk:{name:"Macedonian"},
		ms:{name:"Malay"},
		mt:{name:"Maltese"},
		no:{name:"Norwegian"},
		fa:{name:"Persian"},
		pl:{name:"Polish"},
		pt:{name:"Portuguese"},
		ro:{name:"Romanian"},
		ru:{name:"Russian"},
		sr:{name:"Serbian"},
		sk:{name:"Slovak"},
		sl:{name:"Slovenian"},
		es:{name:"Spanish"},
		sw:{name:"Swahili"},
		sv:{name:"Swedish"},
		th:{name:"Thai"},
		tr:{name:"Turkish"},
		uk:{name:"Ukrainian"},
		ur:{name:"Urdu ALPHA"},
		vi:{name:"Vietnamese"},
		cy:{name:"Welsh"},
		yi:{name:"Yiddish"}
	],
	formatters:{
		ar:function(page){
			page.title="<div style='text-align:right;' dir='rtl'>"+page.title+"</div>";
			page.content="<div style='position:relative; width:100%;font-size:20px; text-align:right;' dir='rtl'>"+page.content+"</div>";
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
	ann_formatters:{
		ar:function(ann){
			ann.title = "<div style='font-size:20px;'>"+ann.title+"</div>";
			ann.content = "<div style='font-size:16px; display:block;'>"+ann.content+"</div>";
		},
		default:function(ann){
			ann.title = "<div style='font-weight:bold;font-size:12px;'>"+ann.title+"</div>";
			ann.content = "<div class='v-ellip' style='display:block;'>"+ann.content+"</div>";
		}
	},
	parsers:(function(){
		//closure scope stuff goes here
		function overwrite_exec(i,j){
			return function exec(s){
				var res = RegExp.prototype.exec.call(this,s);
				return res && {
					match: res[i],
					fullmatch: res[j],
					index: res.index
				};
			};
		};
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
			ja:(function(){
				/*var jaletters = "\\u4E00-\\u9FBF\\u3040-\\u309F\\u30A0-\\u30FF",
					rf = "(?:^|.)(", //TODO: treat katakana-kanji and punctuation as word boundaries
					rl = ")(?=$|.)";
				*/
				return function(word){
					var lastIndex=0,
						tag_word=word+'\\@',
						wlen=tag_word.length;
					return {
						test:function(s){return s.indexOf(tag_word)>=0;},
						exec:function(s){
							var index = s.indexOf(tag_word,lastIndex);
							if(index>=0){
								lastIndex = index+wlen;
								return {
									match: word,
									fullmatch: word,
									index: index-1
								};
							}
							return null;
						},
						get lastIndex(){return lastIndex;},
						set lastIndex(i){lastIndex=i;}
					};
				};
			}()),
			default:(function(){
				var latin_non_word = "\\s~`'\";:.,/?><[\\]{}\\\\|)(*&^%$#@!=\\-�",
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
	alignments:{
		ar:'right'
	},
	gloss_markers:{
		ja:function(text,word){
			return text.replace(RegExp(word.replace(/[\-\/\\?.*\^$\[{()|+]/g,"\\$&"),'gi'),"$&\\@");
		}
	}
};