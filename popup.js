var downloadFile = function(callback, data, i, title){
	if(i == undefined){
		i = 0;
	}
	if(data.length == i){
		callback();
	}else{
		var file_name = data[i].split("/");
		file_name = file_name[file_name.length - 1].replace(/\?.*/, '');;
		file_name = title + "/" + file_name;
		chrome.downloads.download({
		  url: data[i],
		  filename: file_name,
		  conflictAction: "overwrite"
		}, function(){
			log(i + " : finsih");
			i++;
			downloadFile(callback, data, i, title);
		});
	}
}

function refresh(e){
	sendRequest({method: "getGallary"}, function(response){
		var data = response.data;
		var ul = $('<ul class="gallary">');
		$(data).each(function(i){
			var li = $('<li class="gallary-item" data-href="'+data[i].href+'">');
			var box = $('<div class="gallary-box">');
			var img = $('<div class="gallary-img">').append($('<img>').attr("src", data[i].img));
			box = box.append(img);
			var info = $('<div class="gallary-info">');
			var title = $('<div class="gallary-title">').append($("<h3>").html(data[i].name));
			info = info.append(title);
			box = box.append(info);
			li = li.append(box);
			ul = ul.append(li);
			$( box ).bind( "click", function() {
				var temp_href = $(this).closest("li").attr('data-href');
				sendRequestToBackground({data:{url:temp_href},method: "getPhotosPath"}, function(response) {
					log(response);
					var data = response.data;
					var title = response.title;
					log(title);
					downloadFile(function(){
						console.log("Finish");
					}, data, 0, title)
				});
			});	
		});
		$("#main").html(ul);
	});
}

function log (text){
	chrome.extension.getBackgroundPage().console.log(text);
}

var port = chrome.extension.connect({name: "Background"});

document.addEventListener('DOMContentLoaded', function() {
	var btn_refresh = document.getElementById('btn-refresh').addEventListener("click", refresh);
	refresh();
});

sendRequest = function(data, callback){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, data, function(response) {
			log(response);
			callback(response);
		});
	});
};

sendRequestToBackground = function(data){
	port.postMessage(data);
}