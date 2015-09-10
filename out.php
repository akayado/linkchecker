<?php

	require_once "config.inc.php";

	$ip_addr = $_SERVER['REMOTE_ADDR'];
	$datetime = date('Y-m-d H:i:s', time());
	if($ip_addr=="::1")$ip_addr="127.0.0.1";

	$already_in = false;

	try{
		//create table in_ips(ip integer unsigned not null primary key, in_time DATETIME);
		$dbh = new PDO($dsn, $username, $password, $options);
		$sql = 'select * from in_ips where ip = INET_ATON("'.$ip_addr.'");';
		
		$stmt = $dbh->query($sql);
		while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
			if(strtotime($datetime) - strtotime($row['in_time']) < 6){
				$already_in = true;
			}
		}

		if(!$already_in&&$clean){
			$sql = 'delete from in_ips where ip = INET_ATON("'.$ip_addr.'");';
			$dbh->exec($sql);
		}

	}catch(Exception $e){
		echo $e->getMessage();
		exit;
	}

?>
	
