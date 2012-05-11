// JavaScript Document
// Gets URL parameter
function gup(name){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var results = (new RegExp("[\\?&]"+name+"=([^&#]*)")).exec(window.location.href);
  return (results == null)?"":results[1];
}