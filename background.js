sendRequest = function(data, callback){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, data, function(response) {
			log(response);
			callback(response);
		});
	});
};

var downloadFile = function(callback, data, i, title){
	if(i == undefined){
		i = 0;
	}
	if(data.length == i){
		callback();
	}else{
		var file_name = data[i].split("/");
		file_name = file_name[file_name.length - 1].replace(/\?.*/, '');
		file_name = title + "/" + file_name;
		chrome.downloads.download({
		  url: data[i],
		  filename: file_name,
		  conflictAction: "overwrite"
		}, function(){
			if(i%20 == 0){
				log(title + " : " + (i /  data.length ) * 100 + "% ( " + i + "/" + data.length + " )");
			}
			i++;
			downloadFile(callback, data, i, title);
		});
	}
}

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(data) {
	console.log('Background : ',data);
	sendRequest(data, function(response) {
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

function log (text){
	console.log(text);
}