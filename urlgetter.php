<?php
	require_once "config.inc.php";

	$ip_addr = $_SERVER['REMOTE_ADDR'];
	$datetime = date('Y-m-d H:i:s', time());
	if($ip_addr=="::1")$ip_addr="127.0.0.1";

	try{
		//create table in_ips(ip integer unsigned not null primary key, in_time DATETIME);
		$dbh = new PDO($dsn, $username, $password, $options);
		$sql = 'select * from in_ips where ip = INET_ATON("'.$ip_addr.'");';
		
		$stmt = $dbh->query($sql);
		while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
			if(strtotime($datetime) - strtotime($row['in_time']) > 6){
				die();
			}
		}
	}catch(Exception $e){
		echo $e->getMessage();
	}



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
