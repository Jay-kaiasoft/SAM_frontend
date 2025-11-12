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
function setCFButtonStyle() {
	let clsname=$("#cfbtndesignall .cfbtndesignbtn a").attr("class");
	clsname=clsname.replace("bttn ","");
	let wv = "";
	if($('#cfbtncus').is(':checked')) {
		wv = $("#cfbtnwth").val()+"px";
	} else {
		wv = "auto";
	}
	let pad = $("#cfbtnpadtop").val()+"px "+$("#cfbtnpadright").val()+"px "+$("#cfbtnpadbottom").val()+"px "+$("#cfbtnpadleft").val()+"px";
	if(clsname==="btn-secondary") {
		let temptxtclr = (typeof $("#cftextclrbox").val() !== "undefined" && $("#cftextclrbox").val() !== "" && $("#cftextclrbox").val() !== null) ? $("#cftextclrbox").val() : "#FFFFFF";
		$("#cfbtndesignall .cfbtndesignbtn a").css("cssText",`background-color: ${$("#cfbackclrbox").val()} !important;border-color: ${$("#cfbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#cfbtnbrdstyle").val()} !important;border-width: ${$("#cfbtnbrdsize").val()}px !important;border-radius: ${$("#cfbtnbrdradius").val()}px !important;padding:${pad};`);
	} else if(clsname==="btn-outline-secondary") {
		let temptxtclr = (typeof $("#cftextclrbox").val() !== "undefined" && $("#cftextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#cftextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#cftextclrbox").val() !== null) ? $("#cftextclrbox").val() : $("#cfbackclrbox").val();
		$("#cfbtndesignall .cfbtndesignbtn a").css("cssText",`background-color: transparent !important;border-color: ${$("#cfbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#cfbtnbrdstyle").val()} !important;border-width: ${$("#cfbtnbrdsize").val()}px !important;border-radius: ${$("#cfbtnbrdradius").val()}px !important;padding:${pad};`);
	}
}
CKEDITOR.plugins.add("mergecustomforms", {
    requires: ["richcombo"],
    init: function(a) {
		let customformstags=a.config.customformstags;
		let id = a.element.$.id;
        a.ui.addRichCombo("Mergecustomforms", {
            label: "Custom Forms",
            title: "Custom Forms",
            voiceLabel: "Custom Forms",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                let b = this;
                for (let this_tag in customformstags){
					b.add(customformstags[this_tag][0], customformstags[this_tag][1], customformstags[this_tag][2]);
				}
				b._.list.commit()
            },
            onClick: function(e) {
				$('#clickCustomFormsTags').trigger('click');
				setTimeout(()=>{
					$('#cfurl').val(e);
					$('#cfurldiv').html(e);
					for (let this_tag in customformstags){
						$("#cfsel").append('<option value="'+customformstags[this_tag][1]+'">'+customformstags[this_tag][1]+'</option>');
					}
					for (let this_tag in customformstags){
						if(customformstags[this_tag][0]===e){
							$('#cftitle').val(customformstags[this_tag][2]);
							$(".cfbtndesignbtn a").html(customformstags[this_tag][2]);
							$("#cfsel").val(customformstags[this_tag][2]);
						}
					}
					$("#cftitle").keyup(function() {
						$(".cfbtndesignbtn a").html($("#cftitle").val());
					});
					$("#cfsel").click(function() {
						$('#cftitle').val($(this).val());
						$(".cfbtndesignbtn a").html($(this).val());
						for (let this_tag in customformstags){
							if(customformstags[this_tag][1]===$(this).val()){
								$('#cfurl').val(customformstags[this_tag][0]);
								$('#cfurldiv').html(customformstags[this_tag][0]);
							}
						}
					});
					let btnbaccol=rgb2hex($("#cfbtndesignall .cfbtndesignbtn a").css('background-color'));
					$("#cfbackclrbox").val(btnbaccol);
					$("#cfbackclrbox").spectrum({
						allowEmpty:true,
						color: btnbaccol,
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
								$("#cfbackclrbox").val("transparent");
							} else {
								$("#cfbackclrbox").val(color.toHexString());
							}
							setCFButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btntextcol=rgb2hex($("#cfbtndesignall .cfbtndesignbtn a").css('color'));
					$("#cftextclrbox").val(btntextcol);
					$("#cftextclrbox").spectrum({
						allowEmpty:true,
						color: btntextcol,
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
								$("#cftextclrbox").val("transparent");
							} else {
								$("#cftextclrbox").val(color.toHexString());
							}
							setCFButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btnwidth="";
					$("#cflinkasbtn").unbind("change").change(function() {
						if(this.checked) {
							$("#cfbtndesignall").slideDown(500);
						} else {
							$("#cfbtndesignall").slideUp(500);
						}
					});
					$("#cfbtnsty input[type='radio']").unbind("change").change(function() {
						if($('#cfbtncus').is(':checked')) {
							$("#cfbtnwthbox").css("display","inline-block");
						}
						if($('#cfbtndef').is(':checked')) {
							$("#cfbtnwthbox").removeAttr("style");
						}
						setCFButtonStyle();
					});
					$("#cfbtnstyle input[type='radio']").unbind("change").change(function() {
						if($('#cfbtnsol').is(':checked')) {
							$("#cfbtndesignall .cfbtndesignbtn a").removeClass("btn-outline-secondary").addClass("btn-secondary");
						}
						if($('#cfbtnout').is(':checked')) {
							$("#cfbtndesignall .cfbtndesignbtn a").removeClass("btn-secondary").addClass("btn-outline-secondary");
						}
						setCFButtonStyle();
					});
					$("#cfbtnwth").unbind("keyup").keyup(function() {
						if(parseInt($("#cfbtnwth").val())>300) {
							$("#cfbtnwth").val("300");
						}
						setCFButtonStyle();
					});
					$("#cfbtnbrdstyle").val($("#cfbtndesignall .cfbtndesignbtn a").css("border-left-style"));
					$("#cfbtnbrdstyle").unbind("change").change(function() {
						setCFButtonStyle();
					});
					$("#cfbtnbrdsize").val($("#cfbtndesignall .cfbtndesignbtn a").css("border-left-width").replace("px",""));
					$("#cfbtnbrdsize").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					let btnbrdcol=rgb2hex($("#cfbtndesignall .cfbtndesignbtn a").css('border-left-color'));
					$("#cfbtnbrdclrbox").val(btnbrdcol);
					$("#cfbtnbrdclrbox").spectrum({
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
								$("#cfbtnbrdclrbox").val("transparent");
							} else {
								$("#cfbtnbrdclrbox").val(color.toHexString());
							}
							setCFButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					$("#cfbtnbrdradius").val($("#cfbtndesignall .cfbtndesignbtn a").css("border-radius").replace("px",""));
					$("#cfbtnbrdradius").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					$("#cfbtnpadtop").val($("#cfbtndesignall .cfbtndesignbtn a").css("padding-top").replace("px",""));
					$("#cfbtnpadtop").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					$("#cfbtnpadbottom").val($("#cfbtndesignall .cfbtndesignbtn a").css("padding-bottom").replace("px",""));
					$("#cfbtnpadbottom").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					$("#cfbtnpadleft").val($("#cfbtndesignall .cfbtndesignbtn a").css("padding-left").replace("px",""));
					$("#cfbtnpadleft").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					$("#cfbtnpadright").val($("#cfbtndesignall .cfbtndesignbtn a").css("padding-right").replace("px",""));
					$("#cfbtnpadright").unbind("keyup").keyup(function() {
						setCFButtonStyle();
					});
					$('#cf_save_tooltips').unbind('click').click(function(){
						let sty='',sty2='';
						if($('#cflinkasbtn').is(":checked") && $('#cflinkasbtn').val('yes')){
							let clsname=$('#cfbtndesignall a').attr("class");
							clsname=clsname.replace("bttn ","");
							let bgclr = clsname==="btn-outline-secondary" ? "transparent" : $('#cfbackclrbox').val();
							let txtclr = clsname==="btn-outline-secondary" ? (typeof $("#cftextclrbox").val() !== "undefined" && $("#cftextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#cftextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#cftextclrbox").val() !== null) ? $("#cftextclrbox").val() : $("#cfbackclrbox").val() : (typeof $("#cftextclrbox").val() !== "undefined" && $("#cftextclrbox").val() !== "" && $("#cftextclrbox").val() !== null) ? $("#cftextclrbox").val() : "#FFFFFF";
							let padding = $("#cfbtnpadtop").val()+"px "+$("#cfbtnpadright").val()+"px "+$("#cfbtnpadbottom").val()+"px "+$("#cfbtnpadleft").val()+"px";
							let clsstyle='color: '+txtclr+';background-color: '+ bgclr +';border-color: '+$('#cfbtnbrdclrbox').val()+';border-style: '+$('#cfbtnbrdstyle').val()+';border-width: '+$('#cfbtnbrdsize').val()+'px;border-radius: '+$('#cfbtnbrdradius').val()+'px;';
							if($('#cfbtncus').is(":checked") && $('#cfbtncus').val('c')){
								btnwidth="width:"+$('#cfbtndesignall .cfbtndesignbtn a').css("width")+";";
							} else {
								btnwidth="";
							}
							sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;mso-border-right-alt: none #FFFFFF 0; mso-border-bottom-alt: none #FFFFFF 0; mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';'+clsstyle+btnwidth+'"';
							sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;'+clsstyle+btnwidth+'"';
							$("#cfbtnsol").trigger("click");
							$("#cfbtndef").trigger("click");
							$("#cflinkasbtn").trigger("click");
						}
						let btnwidth2=parseInt($('#cfbtndesignall .cfbtndesignbtn a').css("width").replace("px",""));
						const markerId = 'cursor-marker-' + Date.now();
						let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#cfurl').val()+'" '+sty+'>'+$('#cftitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> '+ `<span id="${markerId}">&nbsp;</span></div>`;
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
					$('#cf_close_tooltips,.modal-header button.close').unbind('click').click(function(){
						$("#cfbtndef").trigger("click");
						$("#cfbtnsol").trigger("click");
						if($('#cflinkasbtn').is(":checked") && $('#cflinkasbtn').val('yes')) {
							$('#cflinkasbtn').trigger("click");
						}
					});
					$(".cke").hide();
				},1000);
            }
        });
    }
});