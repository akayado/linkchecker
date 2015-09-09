<?php
$url = $_GET["url"];
if(!isset($url)) die();
if(empty($url)) die();
if(!mb_ereg_match("^(http|https)://.*", $url)) die();
if(mb_ereg_match("urlgetter.php", $url)) die();

$content = @file_get_contents($url);
echo json_encode($http_response_header);
echo "<!--JSON-END-->";
echo $content;
?>
