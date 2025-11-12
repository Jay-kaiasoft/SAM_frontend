function rgb2hex(rgb) {
	if(rgb==="transparent") {
		return "";
	}
	if(typeof rgb !== typeof undefined && rgb !== false && rgb!=="") {
		let rgbstring = rgb;
		if(rgbstring.match(/rgba/)){
			rgb = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
		} else if(rgbstring.match(/rgb/)){
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		}
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}else{
		return "";
	}
}
function setGenButtonStyle() {
	let clsname=$('#genbtndesignall .genbtndesignbtn a').attr("class");
	clsname=clsname.replace("bttn ","");
	let wv = "";
	if($('#genbtncus').is(':checked')) {
		wv = $("#genbtnwth").val()+"px";
	} else {
		wv = "auto";
	}
	let pad = $("#genbtnpadtop").val()+"px "+$("#genbtnpadright").val()+"px "+$("#genbtnpadbottom").val()+"px "+$("#genbtnpadleft").val()+"px";
	if(clsname==="btn-secondary") {
		let temptxtclr = (typeof $("#gentextclrbox").val() !== "undefined" && $("#gentextclrbox").val() !== "" && $("#gentextclrbox").val() !== null) ? $("#gentextclrbox").val() : "#FFFFFF";
		$("#genbtndesignall .genbtndesignbtn a").css("cssText",`background-color: ${$("#genbackclrbox").val()} !important;border-color: ${$("#genbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#genbtnbrdstyle").val()} !important;border-width: ${$("#genbtnbrdsize").val()}px !important;border-radius: ${$("#genbtnbrdradius").val()}px !important;padding:${pad};`);
	} else if(clsname==="btn-outline-secondary") {
		let temptxtclr = (typeof $("#gentextclrbox").val() !== "undefined" && $("#gentextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#gentextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#gentextclrbox").val() !== null) ? $("#gentextclrbox").val() : $("#genbackclrbox").val();
		$("#genbtndesignall .genbtndesignbtn a").css("cssText",`background-color: transparent !important;border-color: ${$("#genbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#genbtnbrdstyle").val()} !important;border-width: ${$("#genbtnbrdsize").val()}px !important;border-radius: ${$("#genbtnbrdradius").val()}px !important;padding:${pad};`);
	}
}
CKEDITOR.plugins.add("mergebutton", {
    init: function(a) {
		let id = a.element.$.id;
        a.ui.addButton("mergeButton", {
            label: "Button",
            title: "Button",
            command: 'mergeButton',
        });
        a.addCommand( 'mergeButton', {
            exec: function( b ) {
				$('#clickButtonModal').trigger('click');
				setTimeout(()=>{
					$("#delete_buttonstg").remove();
					$("#gentitle").val("");
					$("#genurl").val("");
					$("#gentitle").keyup(function() {
						$(".genbtndesignbtn a").html($("#gentitle").val());
					});
					let btnbaccol=rgb2hex($("#genbtndesignall .genbtndesignbtn a").css('background-color'));
					$("#genbackclrbox").val(btnbaccol);
					$("#genbackclrbox").spectrum({
						allowEmpty:true,
						color:btnbaccol,
						showInput: true,
						className: "full-spectrum",
						showInitial: true,
						showPalette: true,
						showSelectionPalette: true,
						showAlpha: true,
						maxSelectionSize: 1000,
						preferredFormat: "hex",
						localStorageKey: "spectrum.homepage",
						change: function(color) {
							if(color===null) {
								$("#genbackclrbox").val("transparent");
							} else {
								$("#genbackclrbox").val(color.toHexString());
							}
							setGenButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btntextcol=rgb2hex($("#genbtndesignall .genbtndesignbtn a").css('color'));
					$("#gentextclrbox").val(btntextcol);
					$("#gentextclrbox").spectrum({
						allowEmpty:true,
						color:btntextcol,
						showInput: true,
						className: "full-spectrum",
						showInitial: true,
						showPalette: true,
						showSelectionPalette: true,
						showAlpha: true,
						maxSelectionSize: 1000,
						preferredFormat: "hex",
						localStorageKey: "spectrum.homepage",
						change: function(color) {
							if(color===null) {
								$("#gentextclrbox").val("transparent");
							} else {
								$("#gentextclrbox").val(color.toHexString());
							}
							setGenButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btnwidth="";
					$("#genlinkasbtn").unbind("change").change(function() {
						if(this.checked) {
							$("#genbtndesignall").slideDown(500);
						} else {
							$("#genbtndesignall").slideUp(500);
						}
					});
					$("#genbtnsty input[type='radio']").unbind("change").change(function() {
						if($('#genbtncus').is(':checked')) {
							$("#genbtnwthbox").css("display","inline-block");
						}
						if($('#genbtndef').is(':checked')) {
							$("#genbtnwthbox").removeAttr("style");
						}
						setGenButtonStyle();
					});
					$("#genbtnstyle input[type='radio']").unbind("change").change(function() {
						if($('#genbtnsol').is(':checked')) {
							$("#genbtndesignall .genbtndesignbtn a").removeClass("btn-outline-secondary").addClass("btn-secondary");
						}
						if($('#genbtnout').is(':checked')) {
							$("#genbtndesignall .genbtndesignbtn a").removeClass("btn-secondary").addClass("btn-outline-secondary");
						}
						setGenButtonStyle();
					});
					$("#genbtnwth").unbind("keyup").keyup(function() {
						if(parseInt($("#genbtnwth").val())>300) {
							$("#genbtnwth").val("300");
						}
						setGenButtonStyle();
					});
					$("#genbtnbrdstyle").val($("#genbtndesignall .genbtndesignbtn a").css("border-left-style"));
					$("#genbtnbrdstyle").unbind("change").change(function() {
						setGenButtonStyle();
					});
					$("#genbtnbrdsize").val($("#genbtndesignall .genbtndesignbtn a").css("border-left-width").replace("px",""));
					$("#genbtnbrdsize").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					let btnbrdcol=rgb2hex($("#genbtndesignall .genbtndesignbtn a").css('border-left-color'));
					$("#genbtnbrdclrbox").val(btnbrdcol);
					$("#genbtnbrdclrbox").spectrum({
						allowEmpty:true,
						color:btnbrdcol,
						showInput: true,
						className: "full-spectrum",
						showInitial: true,
						showPalette: true,
						showSelectionPalette: true,
						showAlpha: true,
						maxSelectionSize: 1000,
						preferredFormat: "hex",
						localStorageKey: "spectrum.homepage",
						change: function(color) {
							if(color===null) {
								$("#genbtnbrdclrbox").val("transparent");
							} else {
								$("#genbtnbrdclrbox").val(color.toHexString());
							}
							setGenButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					$("#genbtnbrdradius").val($("#genbtndesignall .genbtndesignbtn a").css("border-radius").replace("px",""));
					$("#genbtnbrdradius").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					$("#genbtnpadtop").val($("#genbtndesignall .genbtndesignbtn a").css("padding-top").replace("px",""));
					$("#genbtnpadtop").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					$("#genbtnpadbottom").val($("#genbtndesignall .genbtndesignbtn a").css("padding-bottom").replace("px",""));
					$("#genbtnpadbottom").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					$("#genbtnpadleft").val($("#genbtndesignall .genbtndesignbtn a").css("padding-left").replace("px",""));
					$("#genbtnpadleft").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					$("#genbtnpadright").val($("#genbtndesignall .genbtndesignbtn a").css("padding-right").replace("px",""));
					$("#genbtnpadright").unbind("keyup").keyup(function() {
						setGenButtonStyle();
					});
					$('#save_buttonstg').unbind('click').click(function(){
						let sty='',sty2='';
						if($('#genlinkasbtn').is(":checked") && $('#genlinkasbtn').val('yes')){
							let clsname=$('#genbtndesignall .genbtndesignbtn a').attr("class");
							clsname=clsname.replace("bttn ","");
							let bgclr = clsname==="btn-outline-secondary" ? "transparent" : $('#genbackclrbox').val();
							let txtclr = clsname==="btn-outline-secondary" ? (typeof $("#gentextclrbox").val() !== "undefined" && $("#gentextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#gentextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#gentextclrbox").val() !== null) ? $("#gentextclrbox").val() : $("#genbackclrbox").val() : (typeof $("#gentextclrbox").val() !== "undefined" && $("#gentextclrbox").val() !== "" && $("#gentextclrbox").val() !== null) ? $("#gentextclrbox").val() : "#FFFFFF";
							let padding = $("#genbtnpadtop").val()+"px "+$("#genbtnpadright").val()+"px "+$("#genbtnpadbottom").val()+"px "+$("#genbtnpadleft").val()+"px";
							let clsstyle='color: '+txtclr+';background-color: '+ bgclr +';border-color: '+$('#genbtnbrdclrbox').val()+';border-style: '+$('#genbtnbrdstyle').val()+';border-width: '+$('#genbtnbrdsize').val()+'px;border-radius: '+$('#genbtnbrdradius').val()+'px;';
							if($('#genbtncus').is(":checked") && $('#genbtncus').val('c')){
								btnwidth="width:"+$('#genbtndesignall .genbtndesignbtn a').css("width")+";";
							} else {
								btnwidth="";
							}
							sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;mso-border-right-alt: none #FFFFFF 0; mso-border-bottom-alt: none #FFFFFF 0; mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';'+clsstyle+btnwidth+'"';
							sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;'+clsstyle+btnwidth+'"';
							$("#genbtnsol").trigger("click");
							$("#genbtndef").trigger("click");
							$("#genlinkasbtn").trigger("click");
						}
						let btnwidth2=parseInt($('#genbtndesignall .genbtndesignbtn a').css("width").replace("px",""));
						const markerId = 'cursor-marker-' + Date.now();
						let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$("#genurlset").val()+$('#genurl').val().replace(/(^\w+:|^)\/\//, '')+'" '+sty+'>'+$('#gentitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> '+ `<span id="${markerId}">&nbsp;</span></div>`;
						a.focus();
						a.insertHtml(ae);
						setTimeout(() => {
							const markerElement = a.document.getById(markerId);
							if (markerElement) {
								const range = a.createRange();
								range.moveToPosition(markerElement, CKEDITOR.POSITION_AFTER_END);
								const sel = a.getSelection();
								sel.selectRanges([range]);
								markerElement.remove();
							}
						}, 0);
						$("#" + id).html(a.element.$.innerHTML);
					});
					$('#close_buttonstg,.modal-header button.close').unbind('click').click(function(){
						$("#genbtndef").trigger("click");
						$("#genbtnsol").trigger("click");
						if($('#genlinkasbtn').is(":checked") && $('#genlinkasbtn').val('yes')) {
							$('#genlinkasbtn').trigger("click");
						}
					});
					$(".cke").hide();
				},1000);
            }
        });
    }
});