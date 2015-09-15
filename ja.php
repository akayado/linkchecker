<?php
$clean = true;
require_once "out.php";
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>オンライン リンクチェッカー</title>
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
				<a href="index.php">ENGLISH</a> | 日本語
			</p>

<?php if(!$already_in): ?>
			<form id="lcform" class="small-wrapper">
				<div class="inputgroup">
					<header><h2>チェックするURL</h2></header>
					<main>
						<input type="text" id="start-url" placeholder="http://..." />
					</main>
				</div>

				<div id="tags-to-check" class="inputgroup clearboth">
					<header><h2>チェックするタグ</h2></header>
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
						<button type="button" id="chk-all">全て選択</button>
						<button type="button" id="unchk-all">全て非選択</button>
					</div>
				</div>

				<div id="advanced" class="inputgroup">
					<header><h2>高度な設定</h2></header>
					<main>
						<label><input type="checkbox" id="chk-rec" checked />再帰的にチェックする</label><br />
						<label>最大深度: <input type="number" id="rec-num" value="2" min="1" max="5" /></label><br />
						<p class="explanation">リンク先のリンク先も再帰的にチェックします。 最大深度1の場合は指定したURLのページ内のリンクだけのチェックとなります。</p>
						<p class="notice">注意: 対象ドメインの制限（下で設定）無しに再帰の深度を深くすると非常に長い時間がかかります。 </p>
						<hr />
						<label><input type="checkbox" id="chk-only-domain" checked />同一ドメイン内のページのみチェックする</label>
						<p class="explanation">他ドメインへのリンクはチェックされますが、それより先はチェックしません。通常推奨されます。</p>
						<hr />
						<label><input type="checkbox" id="chk-report-redirects" />リダイレクトもリンク切れとして報告する</label>
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
				<h2>リンク切れ</h2>
				<div id="summary-outer">
					<table id="summary">
						<thead><tr><th width="50%">Missing document</th><th width="50%">Link found at</th></thead>
						<tbody></tbody>
					</table>
				</div>
				<h2>全ての結果</h2>
				<div id="result-table-outer">
					<table id="result-table" class="clearboth">
						<thead><tr><th width="45%">Link source</th><th width="5%">→</th><th width="45%">Link target</th><th width="5%">Status</th></tr></thead>
						<tbody></tbody>
					</table>
				</div>
				<div id="returnlnk">
					<a href="javascript:void(0);">最初の画面に戻る</a><span id="reloadtimer"></span>
				</div>


			</div>
		</div>
		<hr class="bottom" />
		<p>Copyright &copy; <a href="http://www.akayado.com/">akayado</a> All Rights Reserved.</p>
	</body>
</html>
