

/*
This script is needed to play audio through the playSound.swf flash movie.
*/

// This will be a pointer to the Flash sound player.
var flash;

// This will run when the page is finished loading. 
function initialize_sound() {
  // LAME! if the term "Microsoft" is "not not" found... It must be IE.
  if (navigator.appName.indexOf("Microsoft") != -1) {
    flash = window.playSound;
  }
  else {
    flash = window.document.playSound;
  }
  return true;
}

function playTrack(track_url) {
  flash.playerPlay(track_url);
}

// We don't really need this function, since none of audio has stop buttons... Do they?
function stopTrack() {
  flash.playerStop(); 
}

function play(thisSound) {
  if (initialize_sound() == true) {
    playTrack(thisSound);
  }
}