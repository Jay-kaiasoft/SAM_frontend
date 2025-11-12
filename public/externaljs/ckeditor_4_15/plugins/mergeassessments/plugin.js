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
function setAsmtButtonStyle() {
	let clsname=$("#asmtbtndesignall .asmtbtndesignbtn a").attr("class");
	clsname=clsname.replace("bttn ","");
	let wv = "";
	if($('#asmtbtncus').is(':checked')) {
		wv = $("#asmtbtnwth").val()+"px";
	} else {
		wv = "auto";
	}
	let pad = $("#asmtbtnpadtop").val()+"px "+$("#asmtbtnpadright").val()+"px "+$("#asmtbtnpadbottom").val()+"px "+$("#asmtbtnpadleft").val()+"px";
	if(clsname==="btn-secondary") {
		let temptxtclr = (typeof $("#asmttextclrbox").val() !== "undefined" && $("#asmttextclrbox").val() !== "" && $("#asmttextclrbox").val() !== null) ? $("#asmttextclrbox").val() : "#FFFFFF";
		$("#asmtbtndesignall .asmtbtndesignbtn a").css("cssText",`background-color: ${$("#asmtbackclrbox").val()} !important;border-color: ${$("#asmtbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#asmtbtnbrdstyle").val()} !important;border-width: ${$("#asmtbtnbrdsize").val()}px !important;border-radius: ${$("#asmtbtnbrdradius").val()}px !important;padding:${pad};`);
	} else if(clsname==="btn-outline-secondary") {
		let temptxtclr = (typeof $("#asmttextclrbox").val() !== "undefined" && $("#asmttextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#asmttextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#asmttextclrbox").val() !== null) ? $("#asmttextclrbox").val() : $("#asmtbackclrbox").val();
		$("#asmtbtndesignall .asmtbtndesignbtn a").css("cssText",`background-color: transparent !important;border-color: ${$("#asmtbtnbrdclrbox").val()} !important;color: ${temptxtclr} !important;width:${wv};border-style: ${$("#asmtbtnbrdstyle").val()} !important;border-width: ${$("#asmtbtnbrdsize").val()}px !important;border-radius: ${$("#asmtbtnbrdradius").val()}px !important;padding:${pad};`);
	}
}
CKEDITOR.plugins.add("mergeassessments", {
    requires: ["richcombo"],
    init: function(a) {
		let assessmentstags=a.config.assessmentstags;
		let id = a.element.$.id;
        a.ui.addRichCombo("Mergeassessments", {
            label: "Assessments",
            title: "Assessments",
            voiceLabel: "Assessments",
            className: "cke_format",
            multiSelect: !1,
            panel: {
                css: [CKEDITOR.skin.getPath("editor")].concat(a.config.contentsCss)
            },
            init: function() {
                let b = this;
				for (let this_tag in assessmentstags){
					b.add(assessmentstags[this_tag][0], assessmentstags[this_tag][1]);
				}
				b._.list.commit()
            },
            onClick: function(e) {
				$('#clickAssessmentsTags').trigger('click');
				setTimeout(()=>{
					$('#asmturl').val(e);
					$('#asmturldiv').html(e);
					for (let this_tag in assessmentstags){
						$("#asmtsel").append('<option value="'+assessmentstags[this_tag][1]+'">'+assessmentstags[this_tag][1]+'</option>');
					}
					for (let this_tag in assessmentstags){
						if(assessmentstags[this_tag][0]===e){
							$('#asmttitle').val(assessmentstags[this_tag][2]);
							$(".asmtbtndesignbtn a").html(assessmentstags[this_tag][2]);
							$("#asmtsel").val(assessmentstags[this_tag][2]);
						}
					}
					$("#asmttitle").keyup(function() {
						$(".asmtbtndesignbtn a").html($("#asmttitle").val());
					});
					$("#asmtsel").click(function() {
						$('#asmttitle').val($(this).val());
						$(".asmtbtndesignbtn a").html($(this).val());
						for (let this_tag in assessmentstags){
							if(assessmentstags[this_tag][1]===$(this).val()){
								$('#asmturl').val(assessmentstags[this_tag][0]);
								$('#asmturldiv').html(assessmentstags[this_tag][0]);
							}
						}
					});
					let btnbaccol=rgb2hex($("#asmtbtndesignall .asmtbtndesignbtn a").css('background-color'));
					$("#asmtbackclrbox").val(btnbaccol);
					$("#asmtbackclrbox").spectrum({
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
								$("#asmtbackclrbox").val("transparent");
							} else {
								$("#asmtbackclrbox").val(color.toHexString());
							}
							setAsmtButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btntextcol=rgb2hex($("#asmtbtndesignall .asmtbtndesignbtn a").css('color'));
					$("#asmttextclrbox").val(btntextcol);
					$("#asmttextclrbox").spectrum({
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
								$("#asmttextclrbox").val("transparent");
							} else {
								$("#asmttextclrbox").val(color.toHexString());
							}
							setAsmtButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					let btnwidth="";
					$("#asmtlinkasbtn").unbind("change").change(function() {
						if(this.checked) {
							$("#asmtbtndesignall").slideDown(500);
						} else {
							$("#asmtbtndesignall").slideUp(500);
						}
					});
					$("#asmtbtnsty input[type='radio']").unbind("change").change(function() {
						if($('#asmtbtncus').is(':checked')) {
							$("#asmtbtnwthbox").css("display","inline-block");
						}
						if($('#asmtbtndef').is(':checked')) {
							$("#asmtbtnwthbox").removeAttr("style");
						}
						setAsmtButtonStyle();
					});
					$("#asmtbtnstyle input[type='radio']").unbind("change").change(function() {
						if($('#asmtbtnsol').is(':checked')) {
							$("#asmtbtndesignall .asmtbtndesignbtn a").removeClass("btn-outline-secondary").addClass("btn-secondary");
						}
						if($('#asmtbtnout').is(':checked')) {
							$("#asmtbtndesignall .asmtbtndesignbtn a").removeClass("btn-secondary").addClass("btn-outline-secondary");
						}
						setAsmtButtonStyle();
					});
					$("#asmtbtnwth").unbind("keyup").keyup(function() {
						if(parseInt($("#asmtbtnwth").val())>300) {
							$("#asmtbtnwth").val("300");
						}
						setAsmtButtonStyle();
					});
					$("#asmtbtnbrdstyle").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("border-left-style"));
					$("#asmtbtnbrdstyle").unbind("change").change(function() {
						setAsmtButtonStyle();
					});
					$("#asmtbtnbrdsize").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("border-left-width").replace("px",""));
					$("#asmtbtnbrdsize").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					let btnbrdcol=rgb2hex($("#asmtbtndesignall .asmtbtndesignbtn a").css('border-left-color'));
					$("#asmtbtnbrdclrbox").val(btnbrdcol);
					$("#asmtbtnbrdclrbox").spectrum({
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
								$("#asmtbtnbrdclrbox").val("transparent");
							} else {
								$("#asmtbtnbrdclrbox").val(color.toHexString());
							}
							setAsmtButtonStyle();
						},
						chooseText: "Select",
						palette: []
					});
					$("#asmtbtnbrdradius").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("border-radius").replace("px",""));
					$("#asmtbtnbrdradius").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					$("#asmtbtnpadtop").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("padding-top").replace("px",""));
					$("#asmtbtnpadtop").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					$("#asmtbtnpadbottom").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("padding-bottom").replace("px",""));
					$("#asmtbtnpadbottom").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					$("#asmtbtnpadleft").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("padding-left").replace("px",""));
					$("#asmtbtnpadleft").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					$("#asmtbtnpadright").val($("#asmtbtndesignall .asmtbtndesignbtn a").css("padding-right").replace("px",""));
					$("#asmtbtnpadright").unbind("keyup").keyup(function() {
						setAsmtButtonStyle();
					});
					$('#asmt_save_tooltips').unbind('click').click(function(){
						let sty='',sty2='';
						if($('#asmtlinkasbtn').is(":checked") && $('#asmtlinkasbtn').val('yes')){
							let clsname=$('#asmtbtndesignall a').attr("class");
							clsname=clsname.replace("bttn ","");
							let bgclr = clsname==="btn-outline-secondary" ? "transparent" : $('#asmtbackclrbox').val();
							let txtclr = clsname==="btn-outline-secondary" ? (typeof $("#asmttextclrbox").val() !== "undefined" && $("#asmttextclrbox").val().toLowerCase() !== "#FFFFFF".toLowerCase() && $("#asmttextclrbox").val().toLowerCase() !== "#FFF".toLowerCase() && $("#asmttextclrbox").val() !== null) ? $("#asmttextclrbox").val() : $("#asmtbackclrbox").val() : (typeof $("#asmttextclrbox").val() !== "undefined" && $("#asmttextclrbox").val() !== "" && $("#asmttextclrbox").val() !== null) ? $("#asmttextclrbox").val() : "#FFFFFF";
							let padding = $("#asmtbtnpadtop").val()+"px "+$("#asmtbtnpadright").val()+"px "+$("#asmtbtnpadbottom").val()+"px "+$("#asmtbtnpadleft").val()+"px";
							let clsstyle='color: '+txtclr+';background-color: '+ bgclr +';border-color: '+$('#asmtbtnbrdclrbox').val()+';border-style: '+$('#asmtbtnbrdstyle').val()+';border-width: '+$('#asmtbtnbrdsize').val()+'px;border-radius: '+$('#asmtbtnbrdradius').val()+'px;';
							if($('#asmtbtncus').is(":checked") && $('#asmtbtncus').val('c')){
								btnwidth="width:"+$('#asmtbtndesignall .asmtbtndesignbtn a').css("width")+";";
							} else {
								btnwidth="";
							}
							sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;mso-border-right-alt: none #FFFFFF 0; mso-border-bottom-alt: none #FFFFFF 0; mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';'+clsstyle+btnwidth+'"';
							sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;text-decoration: none !important;cursor: pointer;margin-right:3px;'+clsstyle+btnwidth+'"';
							$("#asmtbtnsol").trigger("click");
							$("#asmtbtndef").trigger("click");
							$("#asmtlinkasbtn").trigger("click");
						}
						let btnwidth2=parseInt($('#asmtbtndesignall .asmtbtndesignbtn a').css("width").replace("px",""));
						const markerId = 'cursor-marker-' + Date.now();
						let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#asmturl').val()+'" '+sty+'>'+$('#asmttitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> '+ `<span id="${markerId}">&nbsp;</span></div>`;
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
					$('#asmt_close_tooltips,.modal-header button.close').unbind('click').click(function(){
						$("#asmtbtndef").trigger("click");
						$("#asmtbtnsol").trigger("click");
						if($('#asmtlinkasbtn').is(":checked") && $('#asmtlinkasbtn').val('yes')) {
							$('#asmtlinkasbtn').trigger("click");
						}
					});
					$(".cke").hide();
				},1000);
            }
        });
    }
});