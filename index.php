<?php
$clean = true;
require_once "out.php";
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Online Link Checker</title>
		<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<?php if(!$already_in): ?>
		<script src="js/checker.js"></script>
		<script src="js/view.js"></script>
<?php endif; ?>
		<link href='http://fonts.googleapis.com/css?family=Architects+Daughter' rel='stylesheet' type='text/css'>
		<link href='css/style.css' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div class="wrapper">
			<h1><a href="http://www.akayado.com/linkchecker/">Online Link Checker</a></h1>	
			<p class="align-center">
				ENGLISH | <a href="ja.php">日本語</a>
			</p>

<?php if(!$already_in): ?>
			<form id="lcform" class="small-wrapper">
				<div class="inputgroup">
					<header><h2>URL to check</h2></header>
					<main>
						<input type="text" id="start-url" placeholder="http://..." />
					</main>
				</div>

				<div id="tags-to-check" class="inputgroup clearboth">
					<header><h2>Tags to check</h2></header>
					<main>
						<label><input type="checkbox" id="chk-a" checked />&lt;a&gt;</label>
						<label><input type="checkbox" id="chk-img" />&lt;img&gt;</label>
						<label><input type="checkbox" id="chk-link" />&lt;link&gt;</label>
						<label><input type="checkbox" id="chk-script" />&lt;script&gt;</label>
						<br />
						<label><input type="checkbox" id="chk-object" />&lt;object&gt;</label>
						<label><input type="checkbox" id="chk-embed" />&lt;embed&gt;</label>
						<label><input type="checkbox" id="chk-video" />&lt;video&gt;</label>
						<label><input type="checkbox" id="chk-audio" />&lt;audio&gt;</label>
					</main>
					<div class="align-center">
						<button type="button" id="chk-all">Check All</button>
						<button type="button" id="unchk-all">Uncheck All</button>
					</div>
				</div>

				<div id="advanced" class="inputgroup">
					<header><h2>Advanced</h2></header>
					<main>
						<label><input type="checkbox" id="chk-rec" checked />Check recursively</label><br />
						<label>Maximum level of recursion: <input type="number" id="rec-num" value="2" min="1" max="5" /></label><br />
						<p class="explanation">Links will be checked recursively. Maximum recursion level 1 would mean only checking the given URL(i.e. no recursion).</p>
						<p class="notice">Warning: Without domain restriction, the check may take extremely long time for large numbers of recursion. </p>
						<hr />
						<label><input type="checkbox" id="chk-only-domain" checked />Recurse only within the domain</label>
						<p class="explanation">Will check links TO other domains, but would not recurse further. Usually recommended.</p>
						<hr />
						<label><input type="checkbox" id="chk-report-redirects" />Report redirects as broken links</label>
					</main>
					<div class="align-right">
						<a href="javascript:void(0);" id="show-adv">Show</a>
					</div>
				</div>
				
				<div class="align-center">
					<button type="button" id="startbtn">Start</button>
				</div>
			</form>
<?php else: ?>
<div class="align-center">
	<p>Sorry, try again a few seconds later.</p>
	<p><a href="javascript:location.reload();">Reload</a></p>
</div>
<?php endif; ?>

			<div id="lcresults" class="hidden">
				<h2>Summary</h2>
				<div id="summary-outer">
					<table id="summary">
						<thead><tr><th width="50%">Missing document</th><th width="50%">Link found at</th></thead>
						<tbody></tbody>
					</table>
				</div>
				<h2>All Results</h2>
				<div id="result-table-outer">
					<table id="result-table" class="clearboth">
						<thead><tr><th width="45%">Link source</th><th width="5%">→</th><th width="45%">Link target</th><th width="5%">Status</th></tr></thead>
						<tbody></tbody>
					</table>
				</div>
				<div id="returnlnk">
					<a href="javascript:void(0);">Return to the beginning</a><span id="reloadtimer"></span>
				</div>


			</div>
		</div>
		<hr class="bottom" />
		<p>Copyright &copy; <a href="http://www.akayado.com/">akayado</a> All Rights Reserved.</p>
	</body>
</html>
