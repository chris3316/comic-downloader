var site_wnacg_fn = {
	getGallary:function(request, sender, sendResponse){
		var gallary_object_array = [];
		var ul = $("<ul class='gallary'>");
		var source_list = $("div.gallary_wrap ul").find("li");
		$(source_list).each(function(index){
			var name = $(this).find("div.title a").html();
			var href = $(this).find("div.pic_box a").attr("href");
			var img = $(this).find("div.pic_box a img").attr("src");
			var tmp = {name:name, href:href, img:img};
			gallary_object_array.push(tmp);
		})
		sendResponse({data: gallary_object_array, status: {type:"success"}}); //same as innerText
	},
	getPhotosPath:function(request, sender, sendResponse){
		var img_array;
		var photo_body;
		var href_temp;
		var title;
		var page = 1;
		function getNextImage(callback, next_url, photo_body){
			$.get( next_url, function( data ) {
				console.log(title," Page : ",page);
				page++;
				var new_span = $(data).filter("#photo_body");
				var next_url = $(new_span).find("a").attr("href");
				$(new_span).find("a").attr("href", "javascript:;");
				var now_html = $(photo_body).html();
				if(href_temp != next_url){
					var new_img_src = $(new_span).find("img").attr("src");
					img_array.push(new_img_src);
					$(photo_body).html(now_html + new_span.html());
					getNextImage(callback, next_url, photo_body);
				}else{
					callback();
				}
			});
		}
		$.get( request.data.url, function( index_data ) {
			var photo_href = ($(index_data).find("div.grid li:first-child a").attr("href"));
			$.get( photo_href, function( data ) {
				title = $(data).filter("title").html().split('-')[1].trim().replace(/\?/g,"");
				img_array = new Array();
				photo_body = $($(data).filter("#photo_body"));
				href_temp = $($(data).filter("#photo_body")).find("a").attr("href");
				img_array.push($($(data).filter("#photo_body")).find("img").attr("src"));
				getNextImage(function(){
					sendResponse({data:img_array, title:title, status: {type:"success"}});
				},href_temp, photo_body);
			});
		});
	}
}
var site_99770_fn = {
	getGallary:function(request, sender, sendResponse){
		var gallary_object_array = [];
		var ul = $("<ul class='gallary'>");
		var source_list = $("#subBookListAct").find("div");
		var img = $(".cDefaultImg img").attr("src");
		$(source_list).each(function(index){
			var name = $(this).find("a").first().html();
			var href = $(this).find("a").first().attr("href");
			var img = "";
			var tmp = {name:name, href:href, img:img};
			gallary_object_array.push(tmp);
		})
		sendResponse({data: gallary_object_array, status: {type:"success"}}); //same as innerText
	},
	getPhotosPath:function(request, sender, sendResponse){
		var img_array;
		var photo_body;
		var href_temp;
		var title;
		var page = 1;
		function getNextImage(callback, next_url, photo_body){
			$.get( next_url, function( data ) {
				console.log(title," Page : ",page);
				page++;
				var new_span = $(data).filter("#photo_body");
				var next_url = $(new_span).find("a").attr("href");
				$(new_span).find("a").attr("href", "javascript:;");
				var now_html = $(photo_body).html();
				if(href_temp != next_url){
					var new_img_src = $(new_span).find("img").attr("src");
					img_array.push(new_img_src);
					$(photo_body).html(now_html + new_span.html());
					getNextImage(callback, next_url, photo_body);
				}else{
					callback();
				}
			});
		}
		$.get( request.data.url, function( index_data ) {
			var photo_href = request.data.url;
			
			$.get( photo_href, function( data ) {
				var title = $(data).find("#spt2").html();
				console.log(title);
				var img_array = data.match(/var sFiles="(.*)";var/i)[1].split("|");
				for(var i in img_array){
					img_array[i] = "http://61.160.196.52:9728/dm12/"+img_array[i]
				}
				sendResponse({data:img_array, title:title, status: {type:"success"}});
			});
		});
	}
}
var site_fn =  {"www.wnacg.com":site_wnacg_fn, 'mh.99770.cc':site_99770_fn}
var site = '';
var listen = function(request, sender, sendResponse) {
		console.log("Using : " + request.method);
		site_fn[site][request.method](request, sender, sendResponse)
		//sendResponse({data: $("div").html(), status: {type:"success"}}); //same as innerText
	}
$(document).ready(function () {
	var href = document.location.href;
	for(var key in site_fn){
		if(href.indexOf(key) >= 0){
			site = key;
			break;
		}
	}
	chrome.extension.onRequest.addListener(listen);
});

/*

function getNextImage(callback, next_url, photo_body){
	$.get( next_url, function( data ) {
		var new_span = $(data).filter("#photo_body");
		var next_url = $(new_span).find("a").attr("href");
		$(new_span).find("a").attr("href", "javascript:;");
		var now_html = $(photo_body).html();
		if(href_temp != next_url){
			var new_img_src = $(new_span).find("img").attr("src");
			img_array.push(new_img_src);
			$(photo_body).html(now_html + new_span.html());
			getNextImage(callback, next_url, photo_body);
		}else{
			callback();
		}
	});
}

var img_array;
var photo_body;
var href_temp;

$.get( '/photos-index-aid-12221.html', function( index_data ) {
	var photo_href = ($(index_data).find("div.grid li:first-child a").attr("href"));
	$.get( photo_href, function( data ) {
		img_array = new Array();
		photo_body = $($(data).filter("#photo_body"));
		href_temp = $($(data).filter("#photo_body")).find("a").attr("href");
		img_array.push($($(data).filter("#photo_body")).find("img").attr("src"));
		console.log(href_temp);
		getNextImage(function(){
			console.log("Finsih");
			console.log(img_array);
		},href_temp, photo_body);
	});
});

*/