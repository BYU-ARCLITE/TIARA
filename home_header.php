<?php
// Date in the past
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
// always modified
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
// HTTP/1.0
header("Pragma: no-cache");

// open the current directory
$dhandle = opendir('docs');
$doc_array = array();
if ($dhandle) {
	// loop through all of the files
	while (false !== ($dname = readdir($dhandle))){
		if(substr($dname, 0, 1) == ".") continue;
		if(is_dir("docs/$dname")){
			$fhandle = opendir("docs/$dname");
			if ($fhandle) {
				$dir_array = array();
				// loop through all of the files
				while (false !== ($fname = readdir($fhandle))) {
					// if it's a data file, output it.
					if (preg_match('/\.json$/',$fname)) {
						$basename = implode('.',explode('.',$fname,-1));
						$dir_array[] = $basename;
					}
				}
				// close the directory
				closedir($fhandle);
				$doc_array[$dname] = $dir_array;
			}
		}
	}
	// close the directory
	closedir($dhandle);
}
?>