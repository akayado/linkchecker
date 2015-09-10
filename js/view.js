$(document).ready(function(){

	$("#chk-all").click(function(){
		$("#tags-to-check main input").prop("checked", true);
	});
	$("#unchk-all").click(function(){
		$("#tags-to-check main input").prop("checked", false);
	});

	$("#advanced main").hide();
	$("#show-adv").click(function(){
		if($(this).html()=="Show")$(this).html("Hide");
		else $(this).html("Show");
		$("#advanced main").toggle(300);
	});

	function updateInterface(){
		$("#rec-num").prop("disabled", !$("#chk-rec").is(":checked"));
	}
	updateInterface();
	$("#lcform *").change(updateInterface);

	$("#startbtn").click(function(){
		var url = $("#start-url").val();
		var maxLevel = Number($("#rec-num").val());
		if(!$("#chk-rec").is(':checked'))maxLevel=1;
		var onlyDomain = $("#chk-only-domain").is(':checked');

		var tags = [];
		if($("#chk-a").is(':checked'))tags.push("a");
		if($("#chk-img").is(':checked'))tags.push("img");
		if($("#chk-link").is(':checked'))tags.push("link");
		if($("#chk-script").is(':checked'))tags.push("script");
		if($("#chk-object").is(':checked'))tags.push("object");
		if($("#chk-embed").is(':checked'))tags.push("embed");
		if($("#chk-video").is(':checked'))tags.push("video");
		if($("#chk-audio").is(':checked'))tags.push("audio");
		if(tags==[])tags=["a"];


		jqxhr = $.ajax("in.php").done(function(data){
			if(data=="ok"){
				setInterval(updateInTime, 5000);

				$("#lcform > *").hide(300);
				$("#lcresults").show(300);

				LC.checkStart(url, {tags:tags, maxLevel:maxLevel, onlyDomain:onlyDomain, callback:function(item){
					if(item.fromNode==null)return;
					var trclass = "";
					var reportRedirects = $("#chk-report-redirects").is(':checked');
					if(item.result!="200"&&item.result!="redirect")trclass="red";
					if(item.result=="redirect"&&reportRedirects)trclass="red";
					
					$("#result-table tbody").append('<tr class="'+trclass+'"><td>'+item.fromNode.url+'</td><td>→</td><td>'+item.toNode.url+'</td><td>'+item.result+'</td></tr>');

					if(trclass=="red"){
						$("#summary tbody").append('<tr><td>'+item.toNode.url+'</td><td>'+item.fromNode.url+'</td></tr>');
					}
				}});

			}else{
				console.log(data);
			}
		});

		var updateInTime = function(){
			jqxhr = $.ajax("update.php");
		}

	});

});

