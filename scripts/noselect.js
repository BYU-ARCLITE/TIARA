function disableSelection(target){
	$(target).attr('unselectable', 'on')
           .css('-moz-user-select', 'none')
           .each(function() { 
               this.onselectstart = function() { return false; };
            });
	target.style.cursor = "default"
}