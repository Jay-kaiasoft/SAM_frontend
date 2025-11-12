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
function setSryButtonStyle() {
	let clsname=$('#btndesignall .btndesignbtn a').attr("class");
	clsname=clsname.replace("bttn ","");
	let wv = "";
	if($('#srybtncus').is(':checked')) {
		wv = $("#srybtnwth").val()+"px";
	} else {
		wv = "auto";
	}
	let pad = $("#srybtnpadtop").val()+"px "+$("#srybtnpadright").val()+"px "+$("#srybtnpadbottom").val()+"px "+$("#srybtnpadleft").val()+"px";
	if(clsname==="btn-secondary") {
		let temptxtclr = (typeof $("#srvytextclrbox").val() !== "undefined" && $("#srvytextclrbox").val() !== "" && $("#srvytextclrbox").val() !== null) ? $("#srvytextclrbox").val() : "#FFFFFF";
		$("#btndesignall .btndesignbtn a").css("cssText",`background-color: ${$("#srvybackclrbox").val()} !important;border-color: ${$("#srybtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#srybtnbrdstyle").val()} !important;border-width: ${$("#srybtnbrdsize").val()}px !important;border-radius: ${$("#srybtnbrdradius").val()}px !important;padding:${pad};`);
	} else if(clsname==="btn-outline-secondary") {
		let temptxtclr = (typeof $("#srvytextclrbox").val() !== "undefined" && $("#srvytextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#srvytextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#srvytextclrbox").val() !== null) ? $("#srvytextclrbox").val() : $("#srvybackclrbox").val();
		$("#btndesignall .btndesignbtn a").css("cssText",`background-color: transparent !important;border-color: ${$("#srybtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#srybtnbrdstyle").val()} !important;border-width: ${$("#srybtnbrdsize").val()}px !important;border-radius: ${$("#srybtnbrdradius").val()}px !important;padding:${pad};`);
	}
}
CKEDITOR.plugins.add("mergesurveys", {
    requires: ["richcombo"],
    init: function(a) {
		let surveystags=a.config.surveystags;
		let id = a.element.$.id;
		a.ui.addRichCombo("Mergesurveys", {
            label: "Surveys",
            title: "Surveys",
            voiceLabel: "Surveys",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                let b = this;
                for (let this_tag in surveystags){
	                  b.add(surveystags[this_tag][0], surveystags[this_tag][1], surveystags[this_tag][2]);
	               }
                    b._.list.commit()
            },
            onClick: function(e) {
				$('#clickSurveysTags').trigger('click');
				setTimeout(()=>{
					$('#sururl').val(e);
					$('#sururldiv').html(e);
					for (let this_tag in surveystags){
						$("#sursel").append('<option value="'+surveystags[this_tag][1]+'">'+surveystags[this_tag][1]+'</option>');
					}
					for (let this_tag in surveystags){
						if(surveystags[this_tag][0]===e){
							$('#surtitle').val(surveystags[this_tag][2]);
							$(".btndesignbtn a").html(surveystags[this_tag][2]);
							$("#sursel").val(surveystags[this_tag][2]);
						}
					}
					$("#surtitle").keyup(function() {
						$(".btndesignbtn a").html($("#surtitle").val());
					});
					$("#sursel").click(function() {
						$('#surtitle').val($(this).val());
						$(".btndesignbtn a").html($(this).val());
						for (let this_tag in surveystags){
							if(surveystags[this_tag][1]===$(this).val()){
								$('#sururl').val(surveystags[this_tag][0]);
								$('#sururldiv').html(surveystags[this_tag][0]);
							}
						}
					});
					let btnbaccol=rgb2hex($("#btndesignall .btndesignbtn a").css('background-color'));
					$("#srvybackclrbox").val(btnbaccol);
					$("#srvybackclrbox").spectrum({
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
								$("#srvybackclrbox").val("transparent");
							} else {
								$("#srvybackclrbox").val(color.toHexString());
							}
							setSryButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btntextcol=rgb2hex($("#btndesignall .btndesignbtn a").css('color'));
					$("#srvytextclrbox").val(btntextcol);
					$("#srvytextclrbox").spectrum({
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
								$("#srvytextclrbox").val("transparent");
							} else {
								$("#srvytextclrbox").val(color.toHexString());
							}
							setSryButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btnwidth="";
					$("#linkasbtn").unbind("change").change(function() {
						if(this.checked) {
							$("#btndesignall").slideDown(500);
						} else {
							$("#btndesignall").slideUp(500);
						}
					});
					$("#srybtnsty input[type='radio']").unbind("change").change(function() {
						if($('#srybtncus').is(':checked')) {
							$("#srybtnwthbox").css("display","inline-block");
						}
						if($('#srybtndef').is(':checked')) {
							$("#srybtnwthbox").removeAttr("style");
						}
						setSryButtonStyle();
					});
					$("#srybtnstyle input[type='radio']").unbind("change").change(function() {
						if($('#srybtnsol').is(':checked')) {
							$("#btndesignall .btndesignbtn a").removeClass("btn-outline-secondary").addClass("btn-secondary");
						}
						if($('#srybtnout').is(':checked')) {
							$("#btndesignall .btndesignbtn a").removeClass("btn-secondary").addClass("btn-outline-secondary");
						}
						setSryButtonStyle();
					});
					$("#srybtnwth").unbind("keyup").keyup(function() {
						if(parseInt($("#srybtnwth").val())>300) {
							$("#srybtnwth").val("300");
						}
						setSryButtonStyle();
					});
					$("#srybtnbrdstyle").val($("#btndesignall .btndesignbtn a").css("border-left-style"));
					$("#srybtnbrdstyle").unbind("change").change(function() {
						setSryButtonStyle();
					});
					$("#srybtnbrdsize").val($("#btndesignall .btndesignbtn a").css("border-left-width").replace("px",""));
					$("#srybtnbrdsize").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					let btnbrdcol=rgb2hex($("#btndesignall .btndesignbtn a").css('border-left-color'));
					$("#srybtnbrdclrbox").val(btnbrdcol);
					$("#srybtnbrdclrbox").spectrum({
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
								$("#srybtnbrdclrbox").val("transparent");
							} else {
								$("#srybtnbrdclrbox").val(color.toHexString());
							}
							setSryButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					$("#srybtnbrdradius").val($("#btndesignall .btndesignbtn a").css("border-radius").replace("px",""));
					$("#srybtnbrdradius").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					$("#srybtnpadtop").val($("#btndesignall .btndesignbtn a").css("padding-top").replace("px",""));
					$("#srybtnpadtop").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					$("#srybtnpadbottom").val($("#btndesignall .btndesignbtn a").css("padding-bottom").replace("px",""));
					$("#srybtnpadbottom").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					$("#srybtnpadleft").val($("#btndesignall .btndesignbtn a").css("padding-left").replace("px",""));
					$("#srybtnpadleft").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					$("#srybtnpadright").val($("#btndesignall .btndesignbtn a").css("padding-right").replace("px",""));
					$("#srybtnpadright").unbind("keyup").keyup(function() {
						setSryButtonStyle();
					});
					$('#save_tooltips').unbind('click').click(function(){
						let sty='',sty2='';
						if($('#linkasbtn').is(":checked") && $('#linkasbtn').val('yes')){
							let clsname=$('#btndesignall a').attr("class");
							clsname=clsname.replace("bttn ","");
							let bgclr = clsname==="btn-outline-secondary" ? "transparent" : $('#srvybackclrbox').val();
							let txtclr = clsname==="btn-outline-secondary" ? (typeof $("#srvytextclrbox").val() !== "undefined" && $("#srvytextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#srvytextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#srvytextclrbox").val() !== null) ? $("#srvytextclrbox").val() : $("#srvybackclrbox").val() : (typeof $("#srvytextclrbox").val() !== "undefined" && $("#srvytextclrbox").val() !== "" && $("#srvytextclrbox").val() !== null) ? $("#srvytextclrbox").val() : "#FFFFFF";
							let padding = $("#srybtnpadtop").val()+"px "+$("#srybtnpadright").val()+"px "+$("#srybtnpadbottom").val()+"px "+$("#srybtnpadleft").val()+"px";
							let clsstyle='color: '+txtclr+';background-color: '+ bgclr +';border-color: '+$('#srybtnbrdclrbox').val()+';border-style: '+$('#srybtnbrdstyle').val()+';border-width: '+$('#srybtnbrdsize').val()+'px;border-radius: '+$('#srybtnbrdradius').val()+'px;';
							if($('#srybtncus').is(":checked") && $('#srybtncus').val('c')){
								btnwidth="width:"+$('#btndesignall .btndesignbtn a').css("width")+";";
							} else {
								btnwidth="";
							}
							sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;mso-border-right-alt: none #FFFFFF 0; mso-border-bottom-alt: none #FFFFFF 0; mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';'+clsstyle+btnwidth+'"';
							sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;'+clsstyle+btnwidth+'"';
							$("#srybtnsol").trigger("click");
							$("#srybtndef").trigger("click");
							$("#linkasbtn").trigger("click");
						}
						let btnwidth2=parseInt($('#btndesignall .btndesignbtn a').css("width").replace("px",""));
						const markerId = 'cursor-marker-' + Date.now();
						let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#sururl').val()+'" '+sty+'>'+$('#surtitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> '+ `<span id="${markerId}">&nbsp;</span></div>`;
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
					$('#sry_close_tooltips,.modal-header button.close').unbind('click').click(function(){
						$("#srybtndef").trigger("click");
						$("#srybtnsol").trigger("click");
						if($('#linkasbtn').is(":checked") && $('#linkasbtn').val('yes')) {
							$('#linkasbtn').trigger("click");
						}
						CKEDITOR.instances[id].destroy();
					});
					$(".cke").hide();
				},1000);
			}
        });
    }
});