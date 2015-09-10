<?php

	require_once "config.inc.php";

	$ip_addr = $_SERVER['REMOTE_ADDR'];
	$datetime = date('Y-m-d H:i:s', time());
	if($ip_addr=="::1")$ip_addr="127.0.0.1";

	try{
		//create table in_ips(ip integer unsigned not null primary key, in_time DATETIME);
		$dbh = new PDO($dsn, $username, $password, $options);
		$st = $dbh->exec('insert into in_ips values(INET_ATON("'.$ip_addr.'"),"'.$datetime.'");');

		if($st==1){
			echo "ok";
			exit;
		}
	}catch(Exception $e){
		echo $e->getMessage();
	}

	echo "\nng\n";
?>
	
