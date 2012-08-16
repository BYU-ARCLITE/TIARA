<?php
session_start();

$path = (isset($HTTP_SESSION_VARS['user']))
	?"xmldocs\\".$HTTP_SESSION_VARS['user']."\\media\\"
	:"xmldocs\\media\\";

if(!file_exists($path)) mkdir($path,0,true) or	die("[{error:'Could not create directory.'}]");
$upload = $_FILES['file'];
$fname = basename($upload['name']);
$fdata = array('name'=>$fname);
if(!empty($upload['error'])){
	switch($upload['error']){
		case '1':
			$fdata['error'] = 'The uploaded file exceeds the upload_max_filesize directive in php.ini.';
			break;
		case '2':
			$fdata['error'] = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.';
			break;
		case '3':
			$fdata['error'] = 'The uploaded file was only partially uploaded.';
			break;
		case '4':
			$fdata['error'] = 'No file was uploaded.';
			break;
		case '6':
			$fdata['error'] = 'Missing a temporary folder.';
			break;
		case '7':
			$fdata['error'] = 'Failed to write file to disk.';
			break;
		case '8':
			$fdata['error'] = 'File upload stopped by extension.';
			break;
		default:
			$fdata['error'] = 'No error code avaiable.';
	}
}
if(empty($upload['tmp_name']) || $upload['tmp_name'] == 'none'){
	$fdata['error'] = 'No file was uploaded.';
}

$fpath = $path.$fname;
if(move_uploaded_file($upload['tmp_name'], $fpath)){
	$fdata['path']=str_replace('\\','/',$fpath);
}else{
	$fdata['error'] = "Error saving file.";
}
echo json_encode($fdata);
?>
