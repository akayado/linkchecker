var LC = LC || {};
(function(LC){

	LC.urlgetter_path = "./urlgetter.php";
	LC.webmode = !(typeof process !== "undefined" && typeof require !== "undefined");

	LC.nodes = [];
	var nodeExists = function(url){
		return _.findIndex(LC.nodes, function(i){return i.url == url})!=-1;
	}
	var getNode = function(url){
		return LC.nodes[_.findIndex(LC.nodes, function(i){return i.url == url})];
	}

	LC.links = [];
	LC.prepareForD3 = function(){
		LC.links = LC.checklist.concat(LC.waiting).filter(function(i){return i.from!=null;});
		if(LC.links.length==0)return false;
		for(var i = 0;i < LC.links.length; i++){
			LC.links[i].source = LC.links[i].fromNode;
			LC.links[i].target = LC.links[i].toNode;
		}
		return true;
	}

	var initialDomain;
	LC.checkStart= function(url, opt){
		opt = opt || {};
		opt.debug = opt.debug || false;
		opt.maxLevel = opt.maxLevel || 2;
		opt.onlyDomain = opt.onlyDomain || false;
		initialDomain = getDomainOf(url);
		opt.tags = opt.tags || ["a"];

		if(opt.debug){
			console.log("Check begins from: "+url);
			console.log("Options", opt);
		}

		LC.nodes.push({url: url, state: "waiting"});

		LC.waiting.push({id: -1,
									from: null,
									fromNode: null,
									to: url,
									toNode: getNode(url),
									level: 0,
									state: "waiting",
									result: null});
		check(opt);
	}

	LC.nodelist=[];
	LC.checklist=[];
	LC.waiting=[];
	var count = -1;
	var check= function(opt){
		if(LC.waiting.length==0)return;
		
		var logs = [];
		function log(item, str){
			logs[item.id] = logs[item.id] || "";
			logs[item.id] += str+"\n";
		}
		function printlog(item){
			//console.log(logs[item.id]);
		}

		while(item = LC.waiting.shift()){
			if(item.level>opt.maxLevel)continue;

			count++;
			item.id = count;

			item.state = "checking";
			log(item, "Checking item id "+item.id);
			LC.checklist.push(item);

			if(noCheckNeeded(item)){
				log(item, "\tNo check needed for "+item.to);
				log(item, "\tChecked "+item.id);

				item.result = pastResultOf(item);
				item.state = "checked";
				printlog(item);

				if(opt.callback)opt.callback(item);

				continue;
			}

			log(item, "\tGetting "+item.to+" ...");
			
			get(item, function(data, message, item){
				item.state = "success";
				log(item, "\t"+message);

				if(data==""){
					item.result = "error";
					log(item, "\tError: Invalid URL");
					printlog(item);
					return;
				}

				var jsonstr = data.split("<!--JSON-END-->")[0];
				var htmlstr = _.rest(data.split("<!--JSON-END-->")).join("<!--JSON-END-->");
				var header = JSON.parse(jsonstr);
				item.result = getStatusCode(header);
				log(item, "\nStatus code: "+item.result);

				if(opt.callback)opt.callback(item);

				if(item.result=="200"){
					getNode(item.to).state = "found";

					var p = $.parseHTML(htmlstr);
					var base = $("base", p).attr("href") || item.to.replace(new RegExp("/[^/]*$"), "/");
					var tags = opt.tags;
					var selector = tags.join(",");

					if(item.level+1<=opt.maxLevel&&(!opt.onlyDomain||initialDomain==getDomainOf(item.to))){
						$(selector, p).filter(function(){ 											//Filter external links
							if(this.href){
								return base+this.href != item.to.split("#")[0] && !this.href.match(/^(javascript|mailto):/);
							}else return true;
						}).each(function(i,e){
							if($(e).is("object")){
								e.href = e.data || $("param[name=movie]", e).attr("value");
							}


							if(!e.href||e.href==""||e.href==void(0)||e.href==null)e.href = e.src;
							log("\tLink found: "+e.href);
							item.linkstr = e.href;
							item.basestr = base;

							item.linkstr = item.linkstr.replace(new RegExp("^(http|https)://"+document.domain+"/"), "/");

							//Get full url
							var url = fullUrl(item.to, item.basestr, item.linkstr);

							if(!nodeExists(url)){
								LC.nodes.push({url: url, state: "waiting"});
							}

							LC.waiting.push({from: item.to,
														fromNode: item.toNode,
														to: url,
														toNode: getNode(url),
														level: item.level+1,
														state: "waiting",
														result: null});
						});
					}
				}else if(item.result=="redirect"){
					getNode(item.to).state = "redirect";

					var loc = getRedirectLocation(header);
					var url;
					if(loc.indexOf("/")==0){
						url = item.to.replace(/^((http|https):\/\/[^\/]*)\/.*$/, "$1") + loc;
					}else url = loc;

					if(!nodeExists(url)){
						LC.nodes.push({url: url, state: "waiting"});
					}

					LC.waiting.push({from: item.to,
												fromNode: item.toNode,
												to: url,
												toNode: getNode(url),
												level: item.level,
												state: "waiting",
												result: null});
					log(item, "\tRedirect, Location: "+loc);
				}else{
					getNode(item.to).state = "notfound";
				}
				if(opt.debug)printlog(item);
				check(opt);
			}, function(message, item){
				item.state = "failure";
				log(item, message);
				if(opt.debug)printlog(item);
			});
		}
	}

	var fullUrl = function(from, base, to){
		var url = from + to;
		if(to.indexOf("/")==0){
			url = from.replace(/^((http|https):\/\/[^\/]*)\/*$/, "$1") + to;
		}else if((new RegExp("^(http|https)://")).test(to)){
			url = to;
		}else if(base!=null&&base!=void(0)&&base.length>0){
			url	= base + to;
		}else{
			url = from + to;
		}
		return url;
	}

	var getRedirectLocation = function(header){
		return header[_.findIndex(header, function(i){
			return /Location:/.test(i);
		})].replace(/Location[ \t]*:[ \t]*/, "");
	}

	var get = function(item, funcdone, funcfail){
		if(LC.webmode){
			jqxhr = $.ajax(LC.urlgetter_path + "?url=" + item.to, {context: item})
			.done(function(data){
				funcdone(data, "Ajax success", this);
			}).fail(function(){
				funcfail("Ajax failure", this);
			});
		}else{
		}
	}

	var noCheckNeeded = function(item){
		LC.checklist.filter(function(i){
			if(i.to == item.to && i.id != item.id)return true;
		});
		return false;
	}

	var pastResultOf = function(item){
		LC.checklist.filter(function(i){
			if(i.to == item.to)return i.result;
		});
		return null;
	}

	var getStatusCode = function(header_json){
		var tmp = header_json[_.findIndex(header_json, function(str){
			return str.search(/^HTTP/)!=-1;
		})];
		if(tmp.search(/200/)!=-1){
			return "200";
		}else if(tmp.search(/30[0-46-8]/)!=-1){
			return "redirect";
		}else if(tmp.search(/404/)!=-1){
			return "404";
		}else if(tmp.search(/403/)!=-1){
			return "403";
		}else if(tmp.search(/400/)!=-1){
			return "400";
		}else if(tmp.search(/401/)!=-1){
			return "401";
		}else if(tmp.search(/500/)!=-1){
			return "500";
		}else if(tmp.search(/503/)!=-1){
			return "503";
		}else{
			return "unknown";
		}
	}

	var getDomainOf = function(a){
		var b;
		b = a.replace(/^(http|https):\/\//, "");
		b = b.split("/")[0];
		return b;
	}
})(LC);
