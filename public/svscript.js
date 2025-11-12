var pathWebApp = "https://webapp.salesandmarketing.ai/";
var pathWWWApp = "https://www.salesandmarketing.ai/";

function loadjscssfile(filename, filetype) {
	if (filetype == "js") { //if filename is a external JavaScript file
		var fileref = document.createElement('script')
		fileref.setAttribute("type", "text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype == "css") { //if filename is an external CSS file
		var fileref = document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	document.getElementsByTagName("head")[0].appendChild(fileref);
}
function include(filename, onload) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	script.onload = script.onreadystatechange = function () {
		if (script.readyState) {
			if (script.readyState === 'complete' || script.readyState === 'loaded') {
				script.onreadystatechange = null;
				onload();
			}
		}
		else {
			onload();
		}
	};
	head.appendChild(script);
}
function parseQuery(query) {
	var Params = new Object();
	if (!query) return Params; // return empty object
	var Pairs = query.split(/[;&]/);
	for (var i = 0; i < Pairs.length; i++) {
		if(Pairs[i].substr(0, 6)==='entid='){
			Params['id'] = Pairs[i].replace('entid=','');
		}
		if(Pairs[i].substr(0, 4)==='~t~='){
			Params['t'] = Pairs[i].replace('~t~=','');
		}
	}
	return Params;
}
function unloadPopupBox() {    // TO Unload the Popupbox
	$('#popup_box_main').removeClass("active");
}
function loadPopupBox() {    // To Load the Popupbox
	$('#popup_box_main').addClass("active");
}
var scripts = document.getElementsByTagName('script');
var myScript = scripts[scripts.length - 1];
var queryString = myScript.src.replace(/^[^\?]+\??/, '');
var params = parseQuery(queryString);
var eg_htmlfile = "";
var tt = "survey";
if (params['t'] == "survey" || typeof (params['t']) == "undefined" || params['t'] == "") {
	eg_htmlfile = pathWebApp + 'survey/' + params['id'];
}
if (params['t'] == "assessment") {
	tt = "assessment";
	eg_htmlfile = pathWebApp + 'assessment/' + params['id'];
}
if (params['t'] == "customform") {
	tt = "custom form";
	eg_htmlfile = pathWebApp + 'customform/' + params['id'];
}
loadjscssfile(pathWebApp+'style.css',"css");
include(pathWebApp + '1.11.3-jquery.min.js', function () {
	$(document).ready(function () {
		var iDiv = document.createElement('div')
		iDiv.id = 'popup_box_main';
		document.getElementsByTagName('body')[0].appendChild(iDiv);
		iDiv.innerHTML = "<div id='popup_box'><div id='popupBoxContent'><h3 style='text-align:left'>Would you like to participate in a " + tt + "?</h3><h5>We'd love your feedback about your experience. Please answer just a few short questions so we can improve our service and your experience. <br /><br />Thank You!</h5></div><div id='popupBoxButton'><div class='popupBoxLBtn'><a href='javascript:void(0);' id='yesclick' class='lbtn buttons'>Yes</a></div><div class='popupBoxRBtn'><a href='javascript:void(0);' id='noclick' class='rbtn buttons'>No</a></div></div><div  id='popupBoxfooter'><a href='" + pathWWWApp + "' target='_blank'><strong>Powered By SalesAndMarketing.ai</strong></a></div></div>";
		loadPopupBox();
		$('#yesclick').click(function () {
			$("#popupBoxContent").css("width", "95vw");
			$("#popupBoxContent").css("height", "90vh");
			$("#popupBoxButton").hide();
			$("#popupBoxContent").html("<div id='closeButton'></div><iframe frameBorder='0' id='eg_iframe' name='eg_iframe' border='0' src='" + eg_htmlfile + "' width='100%' height='100%'></iframe>");
			$('#closeButton').click(function () {
				unloadPopupBox();
			});
		});
		$('#noclick').click(function () {
			unloadPopupBox();
		});
	});
});