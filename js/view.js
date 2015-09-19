$(document).ready(function(){

	var interval;

	$("#chk-all").click(function(){
		$("#items-to-check main input").prop("checked", true);
	});
	$("#unchk-all").click(function(){
		$("#items-to-check main input").prop("checked", false);
	});

	$("#advanced main").hide();
	$("#show-adv").click(function(){
		if($(this).html()=="Show")$(this).html("Hide");
		else $(this).html("Show");
		$("#advanced main").toggle(300);
	});

	$("#returnlnk a").click(function(){
		var tick = function(t){
			$("#reloadtimer").html($("#reloadtimer").html()+".");
			if(t%8==0)$("#reloadtimer").html("");
			if(t<200)setTimeout(function(){tick(t+1);}, 100);
		}
		tick(0);
		setTimeout(function(){location.reload();}, 6000);
		clearInterval(interval);
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

		var stylesheets = false;
		if($("#chk-stylesheets").is(':checked'))stylesheets=true;


		jqxhr = $.ajax("in.php").done(function(data){
			if(data=="ok"){
				interval = setInterval(updateInTime, 5000);

				$("#lcform > *").hide(300);
				$("#lcresults").show(300);

				LC.checkStart(url, {stylesheets:stylesheets, tags:tags, maxLevel:maxLevel, onlyDomain:onlyDomain, callback:function(item){
					if(item.fromNode==null)return;
					var trclass = "";
					var reportRedirects = $("#chk-report-redirects").is(':checked');
					if(item.result!="200"&&item.result!="redirect")trclass="red";
					if(item.result=="redirect"&&reportRedirects)trclass="red";
					
					$("#result-table tbody").append('<tr id="r'+item.id+'" class="'+trclass+'"><td>'+item.fromNode.url+'</td><td class="align-center">→</td><td>'+item.toNode.url+'</td><td>'+item.result+'</td></tr>');

					if(trclass.match(/red/)){
						$("#summary tbody").append('<tr><td>'+item.toNode.url+'</td><td>'+item.fromNode.url+'</td></tr>');
					}

					var past;
					if((past = LC.checklist.filter(function(i){
						return i.to == item.from && i.result == "redirect";
					})).length>0){
						var pitem = past[0];
						$("#r"+pitem.id).html('<td>'+pitem.fromNode.url+'</td><td class="align-center">→</td><td>'+pitem.toNode.url+'</td><td><a href="#r'+item.id+'" onclick="activate('+item.id+','+pitem.id+');">'+pitem.result+'</a></td>');
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

function activate(id1, id2){
	$("#result-table tr").removeClass("active");
	$("#r"+id1).addClass("active");
	$("#r"+id2).addClass("active");
}
