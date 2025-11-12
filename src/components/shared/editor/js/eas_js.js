import $ from 'jquery';
import 'jquery-slimscroll/jquery.slimscroll.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
import 'jquery-ui/themes/base/all.css';
import 'jquery-ui/ui/widgets/slider.js';
import 'jquery-ui/ui/widgets/resizable.js';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.js';
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';
import 'color-thief-browser/dist/color-thief.min.js';
import {myPageImageUrl, siteURL, websiteTitle} from "../../../../config/api";
import {filemanager} from "../../fileManager/js/filemanager";
import ColorThief from "color-thief-browser";
import {editImage} from "../../../../services/myDesktopService";
import {getSurveyAllListAuto} from "../../../../services/surveyService";
import {getAssessmentAllListAuto} from "../../../../services/assessmentService";
import {getCustomFormLinkListAuto} from "../../../../services/customFormService";
import {socialfollow, droparraycommon, drop_link, droparraysettingcommon, loadeverytimecommon, replaccon, rgb2hex, unprotectSource, showdsm, hidedsm, refleftimageandcaption, bigimagesetting, browseimagebtn, browseimagebtnreload, blockdelete, dvdcontrol, imagescontrol, socfollowcontrol, videocontrol, blocksettingcommon, textSetting, textSetting2, dividerSettingCommon, buttonSetting, editreplaceimagelinkcommon, clickSelectItemCallCommon, findImageSize, attachmentSetting, ckButtonSetting, hexToRGB} from "./eas_js_common.js";
import {getShopifyCollectionList, getShopifyProductById, getShopifyProductList} from "../../../../services/shopifyService";
import {encoderQuote} from "../../../../assets/commonFunctions";
import { getEmailSignatureList } from '../../../../services/profileService.js';

let user = "";
let SITEURL=siteURL;
let deftextcont="Input Your Content Here.";
let fieldcount=1;
let fieldimgcount=1;
let imgwidfull=600;
let editorWidth=600;
let editorMax=600;
let FOOTER_CURRENT_YEAR=new Date().getFullYear();
let FOOTER_COMPANY="";
let FOOTER_EMAIL="";
let changeWidth="";
let blockhover="";
let lastbloclid="";
let block_id="";
let found="";
let tembody="";
let tags=[];
let surveystags=[];
let assessmentstags=[];
let customformstags=[];
let edful="";
let pixie1;
let mpType="";
let imageID="";
let filename="";
let imageIDFullPath = "";
let fromEditor = "";
let imagePath = "";
let signaturestags = [];

let droparray = {
	...droparraycommon,
	"replaceimagedrop":'<td><div class="imagePlaceholder"><img src="'+SITEURL+'/img/browse_image.png" alt="Empty" style="display: block;"><div><span>Browse Image</span></div><div data-dojo-attach-point="uploadText"><span>Recommend Image Size 260 x 218</span><br/><span class="deleteblock">[ Delete ]</span></div></div></td>',
}
let droparraysetting = {
	...droparraysettingcommon,
	"blockSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Background Color&nbsp;&nbsp;</label><input type="text" id="blockboxbgbox" value=""/></div><div class="form-group"><label>Border(in Pixel)</label><input value="1px" id="blockborwid" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"><select id="blockselectbortsty"><option value="none" class="optpreview border-style none">None</option><option value="solid" class="optpreview border-style solid">Solid</option><option value="dashed" class="optpreview border-style dashed">Dashed</option><option value="dotted" class="optpreview border-style dotted">Dotted</option><option value="double" class="optpreview border-style double">Double</option><option value="groove" class="optpreview border-style groove">Groove</option><option value="ridge" class="optpreview border-style ridge">Ridge</option><option value="inset" class="optpreview border-style inset">Inset</option><option value="outset" class="optpreview border-style outset">Outset</option></select><input type="text" id="blockboxborderbox" value=""/></div><div class="form-group"><label>Padding(in Pixel) <div class="table-section-r" style="display: inline-block; padding-left: 10px;"><input id="blockbtnete" name="blockbtnete" type="checkbox"/><span class="lbl"></span><span style="padding-left: 5px;">Edge To Edge</span></div></label><div style="margin-bottom: 10px;"><div style="float: left;">Top <input value="" id="blockpadtop" tabindex="3" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Bottom <input value="" id="blockpadbottom" tabindex="4" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div><div><div style="float: left;">Left <input value="" id="blockpadleft" tabindex="1" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Right <input value="" id="blockpadright" tabindex="2" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div></div>',
}

let shopifyarr = {
	"mainshopifyarrcontent": '<div id="Shopify_{{dlInd}}_{{tarInd}}" class="topsliderpane-container shopify-container" style="display: none; opacity: 1; z-index: 99;"><div class="wizard-top-container"><div class="float-left mx-2"><img src="'+SITEURL+'/img/shopify.png" style="height: 20px;" /></div><div class="exitnav relative zin-lv3 float-right pad-lv3"><ul class="linear-list vbars" data-dojo-attach-point="topBarActions"><li><a href="javascript:void(0);" data-dojo-attach-point="closeLink" class="inline-i"><span class="freddicon cross-fill float-right"></span></a></li></ul></div><div class="float-left"><div class="builder-bar get-started"><span data-dojo-attach-point="title">Shopify</span><span data-dojo-attach-point="emailTitle" class="emailTitle"></span></div></div></div><div style="opacity: 1;overflow:auto;" data-dojo-attach-point="content" class="content"><div class="line main-section" data-dojo-attach-point="filesSection"><!--files list --><div class="file-manager lastUnit size1of1 overflow-auto" data-dojo-attach-point="listContainer" id="list-container"><div class="lastUnit size1of1"><div class="grid-slat-module grid-active"><div id="infotxt">For cloud drives we only read files and download the selected file by the users. Selected files will be downloaded and moved to SAM Drive.<br/> You will not be able to upload or create folder from '+websiteTitle+' on the cloud drives for your content security.</div><div id="imageview"><ul class="files-list selfclear" data-dojo-attach-point="fileList" data-dojo-type="mojo/analytics/List" id="files-list" data-dojo-props="\'lazy\': true, url:\'/file/list\', sort: \'created_at\', asc: false"></ul></div></div></div><div data-dojo-attach-point="paginationControls" class="fm-pagination bg-white absolute border-top pad-lv2 pad-lr0"></div></div></div></div></div>'
}

export function loadeverytime(){
	loadeverytimecommon();
	$("#main").unbind("click").click(function(event){
		// if($(event.target).hasClass("textTdBlock")===false && $(event.target).closest("td.textTdBlock").length<=0 && $(event.target).closest("div.textTdBlock").length<=0) {
		// 	$(".cke").hide();
		// 	window.getSelection().removeAllRanges();
		// }
		if(($(event.target).hasClass("em")===false) && ($(event.target).hasClass("subitem")===false) && ($(event.target).hasClass("subitemtext")===false) && ($(event.target).hasClass("fa")===false) && ($(event.target).hasClass("fas")===false) && ($(event.target).closest("div.subsubitem").length<=0)) {
			$(".editormenuitem").removeClass("active");
		}
		if($(event.target).closest(".mojoMcBlock.active").length<=0 && event.target.tagName !== "A") {
			hidedsm();
		}
	});
	$("#posformob").unbind("click").click(function(){
		$(".devisbtn").removeClass("ac");
		$(this).addClass("ac");
		editorWidth=300;
		mySlideronc();
	});
	$("#posfortab").unbind("click").click(function(){
		$(".devisbtn").removeClass("ac");
		$(this).addClass("ac");
		editorWidth=450;
		mySlideronc();
	});
	$("#posfordes").unbind("click").click(function(){
		$(".devisbtn").removeClass("ac");
		$(this).addClass("ac");
		editorWidth=600;
		mySlideronc();
	});
	blockdrop();
	$("#posfordes").trigger("click");

	/* DEFAULT SETTINGS */
	let pageContent=$('#preview-template').contents().find('#templateBody');
	/* Canvas Background */
	let canbaccol;
	if($('#preview-template').find('.mcd.np').css("background-color")==="rgba(0, 0, 0, 0)") {
		canbaccol="";
	} else {
		canbaccol=$('#preview-template').find('.mcd.np').css('background-color');
	}
	$("#canboxbackbox").val(canbaccol);
	$("#canboxbackbox").spectrum({
		allowEmpty:true,
		color: canbaccol,
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
				$("#canboxbackbox").val('transparent');
			} else {
				$("#canboxbackbox").val(color.toHexString());
			}
			setCanvasBackgroundSetting();
		},
		chooseText: "Select",
		palette: []
	});
	if(typeof $('#preview-template').find('.mcd.np').attr("item-path")!=="undefined") {
		let itempath=$('#preview-template').find('.mcd.np').attr("item-path");
		$("#candispimg").attr("src",itempath);
		$("#candispimg,#candeleteimg").show();
		$("#canuploadimg").hide();
		$("#candispimg").unbind("click").click(function(){
			$("#canuploadimg").trigger("click");
		});
		$("#candeleteimg").unbind("click").click(function(){
			$("#candispimg").attr("src","");
			$("#candispimg,#candeleteimg").hide();
			$("#canuploadimg").show();
			$('#preview-template').find('.mcd.np').removeAttr("item-path");
			$('#preview-template').find('.mcd.np').css('background-image','');
			$('#preview-template').find('.mcd.np').attr("item-value","0");
			$("#canbrightness span.ui-slider-handle").css("left","0%");
			$("#grid .grid").removeClass("active");
			$('#grid .grid[item-value="stretch"]').addClass("active");
			$("#canposition .pos").removeClass("active");
			$("#canposition .pos[item-value='0% 0%']").addClass("active");
			$("#canblend").val('normal');
			setCanvasBackgroundSetting();
		});
	}
	$("#canuploadimg").unbind("click").click(function(){
		$(".editormenuitem").removeClass("active");
		filemanager("preview_McBlock_canimg","canimg","canimg");
		setTimeout(function(){
			$("#FileManager_canimg_canimg").css("padding-top",$(".navbar").height()-52);
			$(".topsliderpane-container .content").css("top",parseInt($(".navbar").height())+8);
			clickSelectItemCall("preview_McBlock_canimg","canimg","canimg");
		},1000);
	});
	$("#grid .grid").removeClass("active");
	if($('#preview-template').find('.mcd.np').css('background-size')==="cover" || $('#preview-template').find('.mcd.np').css('background-size')==="auto") {
		$('#grid .grid[item-value="stretch"]').addClass("active");
	} else {
		$('#grid .grid[item-value="'+$('#preview-template').find('.mcd.np').css('background-repeat')+'"]').addClass("active");
	}
	$("#grid .grid").unbind("click").click(function(){
		$("#grid .grid").removeClass("active");
		$(this).addClass("active");
		setCanvasBackgroundSetting();
	});
	let canbrightnessvalue=$('#preview-template').find('.mcd.np').attr("item-value");
	let tooltipcanbrightness = $('<div id="tooltipcanbrightness" />').css({
		position: 'absolute',
		top: -35,
		left: -10,
		'background-color': 'rgb(255, 255, 255)',
		color:'rgb(36,36,36)',
		padding: '5px',
		'font-size': '12px',
		width: '40px',
		'text-align': 'center'
	}).hide();
	tooltipcanbrightness.text(canbrightnessvalue);
	$("#canbrightness").slider({
		min: 0,
		max: 100,
		values: [canbrightnessvalue],
		step: 1,
		slide: function(event, ui) {
			tooltipcanbrightness.text(ui.value);
			let value = ui.values[0];
			$('#preview-template').find('.mcd.np').attr("item-value",value);
			setCanvasBackgroundSetting();
		}
	}).find(".ui-slider-handle").append(tooltipcanbrightness).hover(function() {
		tooltipcanbrightness.show()
	}, function() {
		tooltipcanbrightness.hide()
	});
	$("#canposition .pos[item-value='"+$('#preview-template').find('.mcd.np').css('background-position')+"']").addClass("active");
	$("#canposition .pos").unbind("click").click(function(){
		$("#canposition .pos").removeClass("active");
		$(this).addClass("active");
		setCanvasBackgroundSetting();
	});
	$("#canblend").val($('#preview-template').find('.mcd.np').css('background-blend-mode'));
	$("#canblend").unbind("change").change(function(){
		setCanvasBackgroundSetting();
	});
	/* Canvas Background */

	/* Page Background */
	let pdconbaccol=pageContent.css('background-color');
	$("#pdconboxbackbox").val(pdconbaccol);
	$("#pdconboxbackbox").spectrum({
		allowEmpty:true,
		color: pdconbaccol,
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
				$("#pdconboxbackbox").val('transparent');
			} else {
				$("#pdconboxbackbox").val(color.toHexString());
			}
			setPageBackgroundSetting();
		},
		chooseText: "Select",
		palette: []
	});
	if(typeof $('#preview-template').contents().find('#templateBody').attr("item-path")!=="undefined") {
		let itempath=$('#preview-template').contents().find('#templateBody').attr("item-path");
		$("#pdcondispimg").attr("src",itempath);
		$("#pdcondispimg,#pdcondeleteimg").show();
		$("#pdconuploadimg").hide();
		$("#pdcondispimg").unbind("click").click(function(){
			$("#pdconuploadimg").trigger("click");
		});
		$("#pdcondeleteimg").unbind("click").click(function(){
			$("#pdcondispimg").attr("src","");
			$("#pdcondispimg,#pdcondeleteimg").hide();
			$("#pdconuploadimg").show();
			$('#preview-template').contents().find('#templateBody').removeAttr("item-path");
			$('#preview-template').contents().find('#templateBody').css('background-image','');
			$('#preview-template').contents().find('#templateBody').attr("item-value","0");
			$("#pdconbrightness span.ui-slider-handle").css("left","0%");
			$("#pdcongrid .grid").removeClass("active");
			$('#pdcongrid .grid[item-value="stretch"]').addClass("active");
			$("#pdconposition .pos").removeClass("active");
			$("#pdconposition .pos[item-value='0% 0%']").addClass("active");
			$("#pdconblend").val('normal');
			setPageBackgroundSetting();
		});
	}
	$("#pdconuploadimg").unbind("click").click(function(){
		$(".editormenuitem").removeClass("active");
		filemanager("preview_McBlock_pdconimg","pdconimg","pdconimg");
		setTimeout(function(){
			$("#FileManager_pdconimg_pdconimg").css("padding-top",$(".navbar").height()-52);
			$(".topsliderpane-container .content").css("top",parseInt($(".navbar").height())+8);
			clickSelectItemCall("preview_McBlock_pdconimg","pdconimg","pdconimg");
		},1000);
	});
	$("#pdcongrid .grid").removeClass("active");
	if($('#preview-template').contents().find('#templateBody').css('background-size')==="cover" || $('#preview-template').contents().find('#templateBody').css('background-size')==="auto") {
		$('#pdcongrid .grid[item-value="stretch"]').addClass("active");
	} else {
		$('#pdcongrid .grid[item-value="'+$('#preview-template').contents().find('#templateBody').css('background-repeat')+'"]').addClass("active");
	}
	$("#pdcongrid .grid").unbind("click").click(function(){
		$("#pdcongrid .grid").removeClass("active");
		$(this).addClass("active");
		setPageBackgroundSetting();
	});
	let pdconbrightnessvalue=$('#preview-template').contents().find('#templateBody').attr("item-value");
	let tooltippdconbrightness = $('<div id="tooltippdconbrightness" />').css({
		position: 'absolute',
		top: -35,
		left: -10,
		'background-color': 'rgb(255, 255, 255)',
		color:'rgb(36,36,36)',
		padding: '5px',
		'font-size': '12px',
		width: '40px',
		'text-align': 'center'
	}).hide();
	tooltippdconbrightness.text(pdconbrightnessvalue);
	$("#pdconbrightness").slider({
		min: 0,
		max: 100,
		values: [pdconbrightnessvalue],
		step: 1,
		slide: function(event, ui) {
			tooltippdconbrightness.text(ui.value);
			let value = ui.values[0];
			$('#preview-template').contents().find('#templateBody').attr("item-value",value);
			setPageBackgroundSetting();
		}
	}).find(".ui-slider-handle").append(tooltippdconbrightness).hover(function() {
		tooltippdconbrightness.show()
	}, function() {
		tooltippdconbrightness.hide()
	});
	$("#pdconposition .pos[item-value='"+$('#preview-template').contents().find('#templateBody').css('background-position')+"']").addClass("active");
	$("#pdconposition .pos").unbind("click").click(function(){
		$("#pdconposition .pos").removeClass("active");
		$(this).addClass("active");
		setPageBackgroundSetting();
	});
	$("#pdconblend").val($('#preview-template').contents().find('#templateBody').css('background-blend-mode'));
	$("#pdconblend").unbind("change").change(function(){
		setPageBackgroundSetting();
	});
	/* Page Background */

	/* Text Settings */
	user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	let texffamily=pageContent.css('fontFamily');
	texffamily=replaccon('"',"",texffamily);
	if(texffamily==='Poppins, sans-serif' || texffamily==='Helvetica Neue, Helvetica, Arial, sans-serif' || texffamily===""){texffamily="Arial, Helvetica Neue, Helvetica, sans-serif";}
	if(user.hasOwnProperty("brandKits")){
		if(typeof user?.brandKits?.[0]?.brandFonts?.textSetting !== "undefined" && user?.brandKits?.[0]?.brandFonts?.textSetting !== "" && user?.brandKits?.[0]?.brandFonts?.textSetting !== null && $('#preview-template').contents().find('#templateBody').attr("style").includes("font-family") === false){
			texffamily=user?.brandKits?.[0]?.brandFonts?.textSetting;
		}
	}
	$("#pdselectfamily").unbind("change").change(function(){
		$('#preview-template').contents().find('#templateBody').css('font-family',$(this).val());
	}).val(texffamily).trigger("change");
	let texfsize=pageContent.css('fontSize');
	if(texfsize.replace("px", "")<=0){texfsize=14+"px";}
	$("#pdselectfontsize").unbind("change").change(function(){
		$('#preview-template').contents().find('#templateBody').css('font-size',$(this).val());
	}).val(texfsize).trigger("change");
	let texlineheight=pageContent.css('line-height');
	$("#pdtextlineheight").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody').css('line-height',$(this).val()+'px');
	}).val((texlineheight===undefined)?0:texlineheight.replace("px", ""));
	$("#pgstlbold").unbind("click").click(function(){
		if($("#pgstlbold .pagestyle").hasClass("active")===true) {
			$("#pgstlbold .pagestyle").removeClass("active");
			$('#preview-template').contents().find('#templateBody').css('font-weight','normal');
		} else {
			$("#pgstlbold .pagestyle").addClass("active");
			$('#preview-template').contents().find('#templateBody').css('font-weight','bold');
		}
	});
	$("#pgstlitalic").unbind("click").click(function(){
		if($("#pgstlitalic .pagestyle").hasClass("active")===true) {
			$("#pgstlitalic .pagestyle").removeClass("active");
			$('#preview-template').contents().find('#templateBody').css('font-style','normal');
		} else {
			$("#pgstlitalic .pagestyle").addClass("active");
			$('#preview-template').contents().find('#templateBody').css('font-style','italic');
		}
	});
	$("#pgstlunderline").unbind("click").click(function(){
		if($("#pgstlunderline .pagestyle").hasClass("active")===true) {
			$("#pgstlunderline .pagestyle").removeClass("active");
			$('#preview-template').contents().find('#templateBody').css('text-decoration','none');
		} else {
			$("#pgstlunderline .pagestyle").addClass("active");
			$('#preview-template').contents().find('#templateBody').css('text-decoration','underline');
		}
	});
	let texcolobx=rgb2hex(pageContent.css('color'));
	$("#pdtextcolorbox").val(texcolobx);
	$("#pdtextcolorbox").spectrum({
		allowEmpty:true,
		color: texcolobx,
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
				$('#preview-template').contents().find('#templateBody').css('color','transparent');
			} else {
				$('#preview-template').contents().find('#templateBody').css('color',color.toHexString());
			}
		},
		chooseText: "Select",
		palette: []
	});
	/* Text Settings */

	/* Border */
	let texbortsty=pageContent.css('border-top-style') === "none" ? "" : pageContent.css('border-top-style');
	let texborwidth=(pageContent.outerWidth() - pageContent.innerWidth())/2;
	let texborcol=rgb2hex(pageContent.css('border-left-color'));
	$('#preview-template').contents().find('#templateBody').css('border-style',texbortsty);
	$("#pdconselectbortsty").unbind("change").change(function(){
		$('#preview-template').contents().find('#templateBody').css('border-style',$(this).val());
	}).val(texbortsty);
	$("#pdconborwid").unbind("keyup").keyup(function(){
		if($(this).val()==="px" || $(this).val()==="" || $(this).val()==="0"){
		}else{
			let vla=$(this).val().replace('/([~!@#$%^&*()_+=`{}[]|\\:;\'<>,./? ])+/g', '-').replace('/^(-)+|(-)+$/g','').replace('/[A-Za-z$-]/gi', "");
			if(vla.length>1) {
				vla=vla.replace(/^[0]/,'');
			}
			$(this).val((vla===""?"0":vla));
		}
		let t = $(this).val()==="px" || $(this).val()==="" || $(this).val()==="0" ? 0 : $(this).val();
		$('#preview-template').contents().find('#templateBody').css('border-width',t+"px");
	}).val(texborwidth).keyup();
	$("#pdconborwid").unbind("blur").blur(function(){
		if($(this).val()==="px" || $(this).val()==="" || $(this).val()==="0"){
			$(this).val("0");
			$("#pdconselectbortsty").val("");
			$("#pdconselectbortsty").trigger("change");
		}
	});
	$('#preview-template').contents().find('#templateBody').css('border-color',texborcol);
	$("#pdconboxborderbox").val(texborcol);
	$("#pdconboxborderbox").spectrum({
		allowEmpty:true,
		color: texborcol,
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
				$('#preview-template').contents().find('#templateBody').css('border-color','transparent');
			} else {
				$('#preview-template').contents().find('#templateBody').css('border-color',color.toHexString());
			}
		},
		chooseText: "Select",
		palette: []
	});
	/* Border */

	/* Margin */
	let texlmrgtop=pageContent.css('marginTop');
	let texlmrgbottom=pageContent.css('marginBottom');
	let texlmrgleft=pageContent.css('marginLeft');
	let texlmrgright=pageContent.css('marginRight');
	$("#boxmrgtop").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody').css('margin-top',$(this).val()+'px');
	}).val((texlmrgtop===undefined)?0:texlmrgtop.replace("px", ""));
	$("#boxmrgbottom").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody').css('margin-bottom',$(this).val()+'px');
	}).val((texlmrgbottom===undefined)?0:texlmrgbottom.replace("px", ""));
	$("#boxmrgleft").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody').css('margin-left',$(this).val()+'px');
		mySlideronc();
	}).val((texlmrgleft===undefined)?0:texlmrgleft.replace("px", ""));
	$("#boxmrgright").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody').css('margin-right',$(this).val()+'px');
		mySlideronc();
	}).val((texlmrgright===undefined)?0:texlmrgright.replace("px", ""));
	/* Margin */

	/* Padding */
	let texlpadtop=$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('paddingTop');
	let texlpadbottom=$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('paddingBottom');
	let texlpadleft=$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('paddingLeft');
	let texlpadright=$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('paddingRight');
	$("#boxpadtop").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('padding-top',$(this).val()+'px');
	}).val((texlpadtop===undefined)?0:texlpadtop.replace("px", ""));
	$("#boxpadbottom").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('padding-bottom',$(this).val()+'px');
	}).val((texlpadbottom===undefined)?0:texlpadbottom.replace("px", ""));
	$("#boxpadleft").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('padding-left',$(this).val()+'px');
		mySlideronc();
	}).val((texlpadleft===undefined)?0:texlpadleft.replace("px", ""));
	$("#boxpadright").unbind("keyup").keyup(function(){
		$('#preview-template').contents().find('#templateBody tr td.bodyContainer').css('padding-right',$(this).val()+'px');
		mySlideronc();
	}).val((texlpadright===undefined)?0:texlpadright.replace("px", ""));
	/* Padding */
	/* DEFAULT SETTINGS */

	/* eCOMMERCE */
	$(".esmecom .esmdata .subitem .subsubitem .subsubitemcon img").draggable({
		helper: "clone",
		appendTo: "body",
		containment: "document",
		cursor: "grabbing",
		iframeFix: true,
		zIndex:99,
		start: function() {
			$("#preview-template").contents().find("#templateContainer").addClass("templateContainer");
			$(".editormenuitem").removeClass("active");
		},
		stop: function() {
			$("#preview-template").contents().find("#templateContainer").removeClass("templateContainer");
		}
	});
	/* eCOMMERCE */

	/* DSM Events */
    $("#draggable-setting-menu").draggable({ containment: "parent", scroll: false }).resizable({ containment: "parent" });
    $("#cbutton").unbind("click").click(function(){
        $("#cbutton").addClass("active");
        $("#bbutton").removeClass("active");
        $("#dsmcsetting").show();
        $("#dsmbsetting").hide();
    });
    $("#bbutton").unbind("click").click(function(){
        $("#cbutton").removeClass("active");
        $("#bbutton").addClass("active");
        $("#dsmcsetting").hide();
        $("#dsmbsetting").show();
    });
    $("#dsmclosemenu").unbind("click").click(function(){
        hidedsm();
        $(".cke").hide();
    });
    /* DSM Events */

    /* File Manager */
	$(".filemanager").unbind("click").click(function(){
		filemanager("preview_McBlock_temp","temp","temp");
	});
    /* File Manager */

    /* Quick Links */
	$("#srvylist").unbind("click").click(function(){
		if(surveystags.length>0) {
			let sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let ae=' <!--[if true]><table role="presentation" width="65" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="65"><![endif]--><a target="_blank" href="'+surveystags[0][0]+'" '+sty+'>'+surveystags[0][1]+'</a><!--[if true]></td></tr></table><![endif]-->';
			let fullHTML=getdrophtml("genericlink");
			fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
			fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
			if(blockhover==="") {
				$('td.bodyContainer').append(fullHTML);
			} else {
				$('td.bodyContainer').find("#"+blockhover).after(fullHTML);
			}
			buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
			emtmsedisplay();
		}
	});
	$("#asmtlist").unbind("click").click(function(){
		if(assessmentstags.length>0) {
			let sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let ae=' <!--[if true]><table role="presentation" width="65" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="65"><![endif]--><a target="_blank" href="'+assessmentstags[0][0]+'" '+sty+'>'+assessmentstags[0][1]+'</a><!--[if true]></td></tr></table><![endif]-->';
			let fullHTML=getdrophtml("genericlink");
			fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
			fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
			if(blockhover==="") {
				$('td.bodyContainer').append(fullHTML);
			} else {
				$('td.bodyContainer').find("#"+blockhover).after(fullHTML);
			}
			buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
			emtmsedisplay();
		}
	});
	$("#cflist").unbind("click").click(function(){
		if(customformstags.length>0) {
			let sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
			let ae=' <!--[if true]><table role="presentation" width="65" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="65"><![endif]--><a target="_blank" href="'+customformstags[0][0]+'" '+sty+'>'+customformstags[0][1]+'</a><!--[if true]></td></tr></table><![endif]-->';
			let fullHTML=getdrophtml("genericlink");
			fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
			fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
			if(blockhover==="") {
				$('td.bodyContainer').append(fullHTML);
			} else {
				$('td.bodyContainer').find("#"+blockhover).after(fullHTML);
			}
			buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
			emtmsedisplay();
		}
	});
    /* Quick Links */
}
export function setCanvasBackgroundSetting(){
	let op=parseFloat(Math.abs($('#preview-template').find('.mcd.np').attr("item-value"))/100);
	if($("#canboxbackbox").val() !== "") {
		$('#preview-template').find('.mcd.np').css('background-color',hexToRGB($("#canboxbackbox").val(), op));
	} else {
		$('#preview-template').find('.mcd.np').css('background-color','rgba(255, 255, 255, '+op+')');
	}
	if($("#grid .grid.active").attr("item-value")==="stretch") {
		$('#preview-template').find('.mcd.np').css('background-size','cover');
		$('#preview-template').find('.mcd.np').css('background-repeat','unset');
	} else {
		$('#preview-template').find('.mcd.np').css('background-size','contain');
		$('#preview-template').find('.mcd.np').css('background-repeat',$("#grid .grid.active").attr("item-value"));
	}
	$('#preview-template').find('.mcd.np').css('background-position',$("#canposition .pos.active").attr("item-value"));
	$('#preview-template').find('.mcd.np').css('background-blend-mode',$("#canblend").val());
}
function setPageBackgroundSetting(){
	let op=parseFloat(Math.abs($('#preview-template').contents().find('#templateBody').attr("item-value"))/100);
	if($("#pdconboxbackbox").val() !== "") {
		$('#preview-template').contents().find('#templateBody').css('background-color',hexToRGB($("#pdconboxbackbox").val(), op));
	} else {
		$('#preview-template').contents().find('#templateBody').css('background-color','rgba(255, 255, 255, '+op+')');
	}
	if($("#pdcongrid .grid.active").attr("item-value")==="stretch") {
		$('#preview-template').contents().find('#templateBody').css('background-size','cover');
		$('#preview-template').contents().find('#templateBody').css('background-repeat','unset');
	} else {
		$('#preview-template').contents().find('#templateBody').css('background-size','contain');
		$('#preview-template').contents().find('#templateBody').css('background-repeat',$("#pdcongrid .grid.active").attr("item-value"));
	}
	$('#preview-template').contents().find('#templateBody').css('background-position',$("#pdconposition .pos.active").attr("item-value"));
	$('#preview-template').contents().find('#templateBody').css('background-blend-mode',$("#pdconblend").val());
}
export function reloadfirst(mpTypeData,groupId,memberId)
{
	mpType=mpTypeData;
	edful=memberId;
	user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	FOOTER_COMPANY=user["businessName"] ? user["businessName"] : user["firstName"]+' '+user["lastName"];
	FOOTER_EMAIL=user["email"];
	if(user.hasOwnProperty("brandKits")){
		if(typeof user?.brandKits[0]?.brandFonts?.textSetting !== "undefined" && user?.brandKits[0]?.brandFonts?.textSetting !== "" && user?.brandKits[0]?.brandFonts?.textSetting !== null&& $('#preview-template').contents().find('#templateBody').attr("style").includes("font-family") === false){
			$("#pdselectfamily").val(user?.brandKits[0]?.brandFonts?.textSetting).trigger("change");
		}
	}
	let droppableTargethei=0;
	$('#preview-template').contents().find('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
	});
	$('#preview-temp').contents().find('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		$('#preview-temp11').hide();
	});
	if(droppableTargethei<=447){droppableTargethei=447;}
	$('#preview-template').contents().find('.droppableTarget').css({height:droppableTargethei+"px"});
	tembody = $('#templateBody');
	tembody.attr("width",tembody.attr("data-width"));
	$('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		$(this).find('td.tpl-text-controls').remove();
		$(this).find('div.tpl-block-controls').remove();
		$(this).find('div.tpl-image-controls').remove();
		$(this).find('div.tpl-social-controls').remove();
		$(this).find('div.tpl-social-controls2').remove();
		$(this).find('div.tpl-video-controls').remove();
		$(this).find('div.tpl-button-controls').remove();
		$(this).find('div.tpl-ecom-controls').remove();
		lastbloclid=$(this).attr('id');
		let lastbloclidforchk=replaccon("preview_McBlock_","",$(this).attr('id'));
		lastbloclidforchk=parseInt(lastbloclidforchk);
		if(fieldcount<=lastbloclidforchk) {
			fieldcount=lastbloclidforchk;
		}
		blockedtblocan(lastbloclid)
		browseimagebtnreload(lastbloclid,lastbloclidforchk);
		buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
		emtmsedisplay();
	});
	fieldcount++;
	if(typeof $('#preview-template').find('#templateBody').css("background-color") === "undefined" || $('#preview-template').find('#templateBody').css("background-color") === "rgb(255, 255, 255)"){
		$('#preview-template').find('#templateBody').css("background-color","#ffffff");
	}
	$('#preview-template').find('div.mcd.np').css({display: "flex"});
	$('#preview-template').find('center#cntr').css({boxShadow: "1px 1px 10px #555", padding:"1px 0", display: "flex", justifyContent: "center", margin: "0 auto", width: ""});
	$('#preview-template').find('#templateBody').css({width: "", maxWidth: ""});
	savefullcontent();
	emtmsedisplay();
	$('#preview-template').find('meta').remove();
	$('#preview-template').find('title').remove();
	getSurveyAllListAuto().then(res => {
		if (res.status === 200) {
			surveystags=[];
			res.result.surveyList.map((v)=>(
				surveystags.push([v.sryUrl,v.sryName,v.sryName])
			));
			localStorage.setItem("surveystags",JSON.stringify(surveystags));
		} else {
			$("#clickError").attr("data-type","Error");
			$("#clickError").val("Something went wrong...Please try again later...");
			$("#clickError").trigger("click");
		}
	});
	getAssessmentAllListAuto().then(res => {
		if (res.status === 200) {
			assessmentstags=[];
			res.result.assessmentList.map((v)=>(
				assessmentstags.push([v.assUrl,v.assName,v.assName])
			));
			localStorage.setItem("assessmentstags",JSON.stringify(assessmentstags));
		} else {
			$("#clickError").attr("data-type","Error");
			$("#clickError").val("Something went wrong...Please try again later...");
			$("#clickError").trigger("click");
		}
	});
	getCustomFormLinkListAuto().then(res => {
		if (res.status === 200) {
			customformstags=[];
			res.result.customFormList.map((v)=>(
				customformstags.push([v.customFormUrl,v.cfFormName,v.cfFormName])
			));
			localStorage.setItem("customformstags",JSON.stringify(customformstags));
		} else {
			$("#clickError").attr("data-type","Error");
			$("#clickError").val("Something went wrong...Please try again later...");
			$("#clickError").trigger("click");
		}
	});
	getEmailSignatureList().then(res => {
		if (res.status === 200) {
			signaturestags=[];
			res.result.emailSignature.map((v)=>(
				signaturestags.push([v.signDescription,v.signTitle])
			));
			localStorage.setItem("signaturestags",JSON.stringify(signaturestags));
		} else {
			$("#clickError").attr("data-type","Error");
			$("#clickError").val("Something went wrong...Please try again later...");
			$("#clickError").trigger("click");
		}
	});
	let fields = ["Your_First_Name", "Your_Last_Name", "Client_First_Name", "Client_Last_Name", "Email", "Contact_No", "Street_Address1", "Street_Address2", "City", "State", "Country"];
	tags=[];
	fields.map((value) => (
		tags.push(["", value.replaceAll("_", " "), value.replaceAll("_", " ")])
	));
}
function emtmsedisplay()
{
	$('#preview-template').contents().find('.droppableTarget').each(function( key_id ) {
		if($(this).find('div.mojoMcBlock').length){
			$(this).find('div.mojoMcContainerEmptyMessage').hide();
		}else{
			$(this).find('div.mojoMcContainerEmptyMessage').show();
		}
	});
}
function blockdrag() {
	blockdrop();
}
function blockdrop() {
	$('#preview-template').contents().find('#templateBody td.droppableTarget').droppable({
		iframeFix: true,
		hoverClass: "drop_hover",
		tolerance: "pointer",
		accept: ".mojoBlockSourceItem,.mojoMcBlock,.socialmedia,.ecommerceimg",
		drop: function( event, ui ) {
			$(".editormenuitem").removeClass("active");
			let  bi="no";
			if(ui.draggable.hasClass("buttonIcon")) {
				buttoncontrol();
				bi="yes";
			} else if(ui.draggable.hasClass("attachmentIcon")) {
				attachmentcontrol();
				bi="yes";
			} else if(ui.draggable.hasClass("mojoBlockSourceItem")) {
				let html = ui.draggable.text();
				found = html.replace('<!--', '').replace('-->', '').replace(/\s/g, '_').toLowerCase();
				let fullhtml = getdrophtml(found);
				if(blockhover==="") {
					$(this).append(fullhtml);
				} else {
					$(this).find("#"+blockhover).after(fullhtml);
				}
			} else if(ui.draggable.hasClass("socialmedia")) {
				let html = ui.draggable[0];
				found = $(html).attr("data-title");
				let fullhtml = getdrophtml(found);
				if(blockhover==="") {
					$(this).append(fullhtml);
				} else {
					$(this).find("#"+blockhover).after(fullhtml);
				}
			} else if(ui.draggable.hasClass("ecommerceimg")) {
				let html = ui.draggable[0];
				found = $(html).attr("data-title");
				let fullhtml = getdrophtml(found);
				if(blockhover==="") {
					$(this).append(fullhtml);
				} else {
					$(this).find("#"+blockhover).after(fullhtml);
				}
			} else {
				$(ui.helper).clone(false);
				let html = ui.draggable.removeClass('ui-draggable-dragging').removeAttr("style");
				lastbloclid=ui.draggable.attr("id");
				$(this).append(html);
			}
			if(bi==="no") {
				blockdrag();
				emtmsedisplay();
				savefullcontent();
				refleftimageandcaption(found,lastbloclid,editorMax,editorWidth,imgwidfull);
				blockedtblocan(lastbloclid);
			}
			mySlideronc();
		}
	});
}
function getdrophtml(key) {
	if(key==="social_follow") {
		key="facebook";
	}
	lastbloclid="";
	let links=drop_link[key];
	console.log("key : "+key);
	console.log("links : "+links);
	let ids="preview_McBlock_"+fieldcount;
	lastbloclid=ids;
	let fullhtml,fullhtml1,fullhtml2,fullhtml3,lastcount,marlef,splitclonum,texdewid,texdewid1,texdewid2,co,widforcol,columnWidth,calculatedWidth;
	if(key==="facebook" || key==="tweet" || key==="linkedin" || key==="youtube" || key==="tumblr" || key==="instagram" || key==="soundcloud" || key==="pinterest" || key==="website" || key==="emails" || key==="phones") {
		fullhtml= '<div id="'+ids+'" class="mojoMcBlock tpl-block dojoDndItem focus" rolefor="social_follow" ><div data-dojo-attach-point="containerNode" style="width: 100%;">';
	} else if(key==="soitpd" || key==="stitpd" || key==="soitp" || key==="stitp" || key==="soit" || key==="stit" || key==="moitpd" || key==="mtitpd" || key==="moitp" || key==="mtitp" || key==="moit" || key==="mtit" || key==="boitpd" || key==="btitpd" || key==="boitp" || key==="btitp" || key==="boit" || key==="btit") {
		fullhtml= '<div id="'+ids+'" class="mojoMcBlock tpl-block dojoDndItem focus" rolefor="ecommerce" ><div data-dojo-attach-point="containerNode" style="width: 100%;">';
	} else {
		fullhtml= '<div id="'+ids+'" class="mojoMcBlock tpl-block dojoDndItem focus" rolefor="'+key+'" ><div data-dojo-attach-point="containerNode" style="width: 100%;">';
	}

	fullhtml+= '<table align="left" border="0" cellpadding="0" cellspacing="0" class="mainTBlock" width="100%"><tbody><tr><td class="mainTdBlock" align="left" valign="top"><table align="left" border="0" cellpadding="0" cellspacing="0" class="listTBlock" width="100%"><tbody><tr><td class="listTdBlock" align="left" valign="top">';
	fullhtml+= droparray[links];
	fullhtml+= '</td></tr></tbody></table></td></tr></tbody></table></div>';

	if(key==="text" || key==="footer") {
		fullhtml.replace("{{clonum}}","1").replace("{{split-clonum}}","-1");

		fullhtml=replaccon('{{clonum}}','1',fullhtml);
		fullhtml=replaccon('{{split-clonum}}','-1',fullhtml);
		fullhtml=replaccon('##textblockTBlock##','',fullhtml);
		if(key==="text") {
			fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
			fullhtml=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml);
		}
		if(key==="footer") {
			fullhtml=replaccon("{{textdetail}}","<center><em>Copyright © "+FOOTER_CURRENT_YEAR+" "+FOOTER_COMPANY+", All rights reserved.</em><br><br><strong>Our mailing address is:</strong><br><a style='color: #242424;' href='mailto:"+FOOTER_EMAIL+"'>"+FOOTER_EMAIL+"</a><br></center>",fullhtml);
			fullhtml=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml);
		}
	}

	if(key==="boxed_text" || key==="boxed_text20" || key==="boxed_text21" || key==="boxed_text22") {
		marlef=""
		texdewid=editorWidth;
		if(key==="boxed_text20") {
			texdewid1=texdewid/2;
			texdewid2=texdewid/2;
		} else if(key==="boxed_text21") {
			texdewid1=texdewid/3;
			texdewid2=texdewid-texdewid1;
		} else if(key==="boxed_text22") {
			texdewid2=texdewid/3;
			texdewid1=texdewid-texdewid2;
		}
		if(editorWidth<=350) {
			texdewid2=editorWidth;
			texdewid1=editorWidth;
		}
		splitclonum=-1;
		if(key==="boxed_text20"){splitclonum=0;}
		else if(key==="boxed_text21"){splitclonum=1;}
		else if(key==="boxed_text22"){splitclonum=2;}
		if(key!=="boxed_text") {
			fullhtml2="<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["singleTextBlockEditorContent"]
				.replace('width="100%"','width="'+(texdewid2)+'px"')
				.replace("{{clonum}}","2")
				.replace("{{split-clonum}}",splitclonum);
			fullhtml2=replaccon('{{id}}','id="textTdBlock'+fieldcount+'2"',fullhtml2);
		} else {
			fullhtml2="";
			texdewid1=texdewid;
		}
		fullhtml1=droparray["singleTextBlockEditorContent"]
			.replace('width="100%"','width="'+(texdewid1)+'px"')
			.replace("{{clonum}}","1")
			.replace("{{split-clonum}}",splitclonum);
		if(key==="boxed_text") {
			fullhtml1=replaccon('style="padding:5px;"','style="padding:5px; border:1px solid #f6a604; background-color:#eaf4fe; background-clip:padding-box;"',fullhtml1);
		}
		fullhtml1=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml1);
		fullhtml=replaccon("{{blockHtml|safe}}",fullhtml1+fullhtml2,fullhtml);
		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
	}
	if(key==="divider") {
		fullhtml=replaccon('class="listTdBlock"','class="listTdBlock" style="padding: 10px 0px; display: flex;"',fullhtml);
	}
	if(key==="image" || key==="logoicon" || key==="image_group") {
		if(key==="image_group") {
			fullhtml=fullhtml.replace(' ##imageGroupTBlock##',' imageGroupTBlock');
			fullhtml=fullhtml.replace(' ##imageGroupTdBlock##',' imageGroupTdBlock');
			fullhtml=fullhtml.replace('<!-- image_group_item -->',droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]+"<div style=\"clear:both;\"></div><!--[if (mso)|(IE)]></td></tr><tr><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]);
		} else {
			fullhtml=fullhtml.replace(' ##imageGroupTBlock##','');
			fullhtml=fullhtml.replace(' ##imageGroupTdBlock##','');
		}
		co=fullhtml.match(/~COUNT~/g).length;
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
		co=fullhtml.match(/{{image.index}}/g).length;
		for(let i=0;i<co;i++) {
			fullhtml=fullhtml.replace("{{image.tbindex}}",i);
			fullhtml=fullhtml.replace("{{image.index}}",i);
		}

		columnWidth=editorWidth/2;
		fullhtml=fullhtml.replace(/{{image.columnWidth}}/ig,columnWidth);
		calculatedWidth=columnWidth;
		fullhtml=fullhtml.replace(/{{image.calculatedWidth}}/ig,calculatedWidth);
	}
	if(key==="image_group_3h" || key==="image_group_3s") {
		fullhtml=fullhtml.replace(' ##imageGroupTBlock##',' imageGroupTBlock');
		fullhtml=fullhtml.replace(' ##imageGroupTdBlock##',' imageGroupTdBlock');
		fullhtml=fullhtml.replace('<!-- image_group_item -->',droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]);
		co=fullhtml.match(/~COUNT~/g).length;
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
		co=fullhtml.match(/{{image.index}}/g).length;
		for(let i=0;i<co;i++) {
			fullhtml=fullhtml.replace("{{image.tbindex}}",i);
			fullhtml=fullhtml.replace("{{image.index}}",i);
		}
		columnWidth=editorWidth/3;
		fullhtml=fullhtml.replace(/{{image.columnWidth}}/ig,columnWidth);
		calculatedWidth=columnWidth;
		fullhtml=fullhtml.replace(/{{image.calculatedWidth}}/ig,calculatedWidth);
	}
	if(key==="image_group_2h" || key==="image_group_2s") {
		fullhtml=fullhtml.replace(' ##imageGroupTBlock##',' imageGroupTBlock');
		fullhtml=fullhtml.replace(' ##imageGroupTdBlock##',' imageGroupTdBlock');
		fullhtml=fullhtml.replace('<!-- image_group_item -->',droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]);
		co=fullhtml.match(/~COUNT~/g).length;
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
		co=fullhtml.match(/{{image.index}}/g).length;
		for(let i=0;i<co;i++) {
			fullhtml=fullhtml.replace("{{image.tbindex}}",i);
			fullhtml=fullhtml.replace("{{image.index}}",i);
		}
		columnWidth=editorWidth/2;
		fullhtml=fullhtml.replace(/{{image.columnWidth}}/ig,columnWidth);
		calculatedWidth=columnWidth;
		fullhtml=fullhtml.replace(/{{image.calculatedWidth}}/ig,calculatedWidth);
	}
	if(key==="image_card" || key==="image_+_caption" || key==="image_+_caption11" || key==="image_+_caption12" || key==="image_+_caption_+_h" || key==="image_+_caption12_+_h") {
		fullhtml=replaccon("{{totalPadding}}","0",fullhtml);
		fullhtml=replaccon("{{innerPadding}}","0",fullhtml);
		if(key==="image_+_caption12" || key==="image_+_caption12_+_h"){
			fullhtml=replaccon("{{blockHtml|safe}}",droparray["ImageCardBlockEditor2Content"],fullhtml);
		} else {
			fullhtml=replaccon("{{blockHtml|safe}}",droparray["ImageCardBlockEditorContent"],fullhtml);
		}
		fullhtml=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml);
		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
		fullhtml=replaccon("{{image.index}}","0",fullhtml);
		fullhtml=replaccon("{{image.tbindex}}","0",fullhtml);
		fullhtml=fullhtml.replace('{{clonum}}','1');
		co=fullhtml.match(/~COUNT~/g).length;
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
		if(key==="image_+_caption" || key==="image_+_caption_+_h"){
			fullhtml=fullhtml.replace("background-color: #EBEBEB;","");
			fullhtml=fullhtml.replace('data-cardposi="top"','data-cardposi="left"');
			fullhtml=fullhtml.replace('{{phpadd}}','110px 0px;');
			fullhtml=fullhtml.replace('data-tbmc-id="0"','data-tbmc-id="0" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;float:left;"');
			fullhtml=fullhtml.replace('data-table-columns="1"','data-table-columns="1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;float:right;top:0;"');
		}
		if(key==="image_+_caption11"){
			fullhtml=fullhtml.replace("background-color: #EBEBEB;","");
			fullhtml=fullhtml.replace('data-cardposi="top"','data-cardposi="bottom"');
		}
		if(key==="image_+_caption12" || key==="image_+_caption12_+_h"){
			fullhtml=fullhtml.replace("background-color: #EBEBEB;","");
			fullhtml=fullhtml.replace('data-cardposi="top"','data-cardposi="right"');
			fullhtml=fullhtml.replace('{{phpadd}}','110px 0px;');
			fullhtml=fullhtml.replace('data-tbmc-id="0"','data-tbmc-id="0" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;float:right;"');
			fullhtml=fullhtml.replace('data-table-columns="1"','data-table-columns="1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;float:left;top:0;"');
		}
	}
	if(key==="image_+_caption21" || key==="image_+_caption22" || key==="image_+_caption31" || key==="image_+_caption32" || key==="image_+_caption21_+_h" || key==="image_+_caption22_+_h" || key==="image_+_caption31_+_h" || key==="image_+_caption32_+_h") {
		fullhtml=replaccon("{{totalPadding}}","0",fullhtml);
		fullhtml=replaccon("{{innerPadding}}","0",fullhtml);
		if(key==="image_+_caption22" || key==="image_+_caption22_+_h" || key==="image_+_caption32" || key==="image_+_caption32_+_h"){
			fullhtml=replaccon("{{blockHtml|safe}}",droparray["multiImageCardBlockEditor2Content"],fullhtml);
		} else {
			fullhtml=replaccon("{{blockHtml|safe}}",droparray["multiImageCardBlockEditorContent"],fullhtml);
		}
		fullhtml=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml);
		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
		fullhtml=fullhtml.replace('{{clonum}}','1');
		if(key==="image_+_caption21" || key==="image_+_caption22" || key==="image_+_caption21_+_h" || key==="image_+_caption22_+_h"){
			co=2;
		}else if(key==="image_+_caption31" || key==="image_+_caption32" || key==="image_+_caption31_+_h" || key==="image_+_caption32_+_h"){
			co=3;
		}
		for(let i=0;i<co;i++) {
			fullhtml=replaccon("<!--imglist-->",droparray["multiImageCardAddNewContent"]+"<!--imglist-->",fullhtml);
			fullhtml=replaccon("{{twoingpadd}}","padding-bottom: 5px;",fullhtml);
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
		for(let i=0;i<co;i++) {
			fullhtml=fullhtml.replace("{{image.tbindex}}",i);
			fullhtml=fullhtml.replace("{{image.index}}",i);
		}
		if(key==="image_+_caption21" || key==="image_+_caption31" || key==="image_+_caption21_+_h" || key==="image_+_caption31_+_h"){
			fullhtml=fullhtml.replace('data-cardposi="top"','data-cardposi="left"');
		}
		if(key==="image_+_caption22" || key==="image_+_caption32" || key==="image_+_caption22_+_h" || key==="image_+_caption32_+_h"){
			fullhtml=fullhtml.replace('data-cardposi="top"','data-cardposi="right"');
			fullhtml=fullhtml.replace('data-table-columns="1"','data-table-columns="1" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;"');
		}
	}
	if(key==="2image_+_1caption1" || key==="2image_+_1caption2") {
		fullhtml=replaccon("{{totalPadding}}","0",fullhtml);
		fullhtml=replaccon("{{innerPadding}}","0",fullhtml);
		marlef="margin-left:0px;";
		widforcol=((editorWidth)/2)-8;
		if(editorWidth<=350) {
			widforcol=editorWidth-36;
			marlef="";
		}
		fullhtml1=droparray["2Image1CardBlockEditorContent"]
			.replace("{{stylecont}}","")
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","0");
		fullhtml1=replaccon("{{image.index}}","0",fullhtml1);
		fullhtml1=replaccon("{{image.tbindex}}","0",fullhtml1);
		fullhtml2=droparray["2Image1CardBlockEditorContent"]
			.replace("{{stylecont}}",marlef+'" select-split-option="0')
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","1");
		fullhtml2=replaccon("{{image.index}}","1",fullhtml2);
		fullhtml2=replaccon("{{image.tbindex}}","1",fullhtml2);
		if(key==="2image_+_1caption2") {
			fullhtml1=replaccon("<!--textcontent-->",droparray["singleTextEditor"],fullhtml1);
			fullhtml1=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml1);
			fullhtml2=replaccon("<!--textcontent-->","",fullhtml2);
		}
		if(key==="2image_+_1caption1") {
			fullhtml1=replaccon("<!--textcontent-->","",fullhtml1);
			fullhtml2=replaccon("<!--textcontent-->",droparray["singleTextEditor"],fullhtml2);
			fullhtml2=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml2);
		}
		fullhtml=replaccon("{{blockHtml|safe}}",fullhtml1+"<!--[if (mso)|(IE)]></td><td class=\"ImageCardTdBlock\" valign=\"top\" style=\"padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><![endif]-->"+fullhtml2,fullhtml);

		fullhtml=replaccon('data-table-columns="{{clonum}}"','',fullhtml);
		fullhtml=replaccon('select-split-option="{{split-clonum}}"','',fullhtml);
		fullhtml=replaccon('##textblockTBlock##','',fullhtml);
		fullhtml=replaccon('##textblockTdBlock##','',fullhtml);

		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);

		co=fullhtml.match(/~COUNT~/g).length
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
	}

	if(key==="2image_+_2caption") {
		fullhtml=replaccon("{{totalPadding}}","0",fullhtml);
		fullhtml=replaccon("{{innerPadding}}","0",fullhtml);
		marlef="margin-left:0px;";
		widforcol=((editorWidth)/2);
		if(editorWidth<=350) {
			widforcol=editorWidth;
			marlef="";
		}
		fullhtml1=droparray["2Image2CardBlockEditorContent"]
			.replace("{{stylecont}}",'')
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{textwidth}}",'width="'+(widforcol)+'"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","0");
		fullhtml1=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml1);
		fullhtml1=replaccon("{{image.index}}","0",fullhtml1);
		fullhtml1=replaccon("{{image.tbindex}}","0",fullhtml1);
		fullhtml2=droparray["2Image2CardBlockEditorContent"]
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{stylecont}}",marlef+'" select-split-option="0')
			.replace("{{textwidth}}",'width="'+(widforcol)+'"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","1");
		fullhtml2=replaccon('{{id}}','id="textTdBlock'+fieldcount+'1"',fullhtml2);
		fullhtml2=replaccon("{{image.index}}","1",fullhtml2);
		fullhtml2=replaccon("{{image.tbindex}}","1",fullhtml2);
		fullhtml=replaccon("{{blockHtml|safe}}",fullhtml1+"<!--[if (mso)|(IE)]></td><td class=\"ImageCardTdBlock\" valign=\"top\" style=\"padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><![endif]-->"+fullhtml2,fullhtml);

		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
		co=fullhtml.match(/~COUNT~/g).length
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
	}
	if(key==="3image_+_3caption") {
		fullhtml=replaccon("{{totalPadding}}","0",fullhtml);
		fullhtml=replaccon("{{innerPadding}}","0",fullhtml);
		marlef="margin-left:0px;";
		widforcol=((editorWidth)/3);
		if(editorWidth<=350) {
			widforcol=editorWidth;
			marlef="";
		}
		fullhtml1=droparray["2Image2CardBlockEditorContent"]
			.replace("{{stylecont}}",'')
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{textwidth}}",'width="100%"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","0");
		fullhtml1=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml1);
		fullhtml1=replaccon("{{image.index}}","0",fullhtml1);
		fullhtml1=replaccon("{{image.tbindex}}","0",fullhtml1);
		fullhtml2=droparray["2Image2CardBlockEditorContent"]
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{stylecont}}",marlef+'" select-split-option="3')
			.replace("{{textwidth}}",'width="100%"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","1");
		fullhtml2=replaccon('{{id}}','id="textTdBlock'+fieldcount+'1"',fullhtml2);
		fullhtml2=replaccon("{{image.index}}","1",fullhtml2);
		fullhtml2=replaccon("{{image.tbindex}}","1",fullhtml2);
		fullhtml3=droparray["2Image2CardBlockEditorContent"]
			.replace("{{blockwidth}}",'width="'+widforcol+'"')
			.replace("{{stylecont}}",marlef)
			.replace("{{textwidth}}",'width="100%"')
			.replace("{{textstylecont}}","word-break: break-word;")
			.replace("{{clonum}}","2");
		fullhtml3=replaccon('{{id}}','id="textTdBlock'+fieldcount+'2"',fullhtml3);
		fullhtml3=replaccon("{{image.index}}","2",fullhtml3);
		fullhtml3=replaccon("{{image.tbindex}}","2",fullhtml3);
		fullhtml=replaccon("{{blockHtml|safe}}",fullhtml1+"<!--[if (mso)|(IE)]></td><td class=\"ImageCardTdBlock\" valign=\"top\" style=\"padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><![endif]-->"+fullhtml2+"<!--[if (mso)|(IE)]></td><td class=\"ImageCardTdBlock\" valign=\"top\" style=\"padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;\"><![endif]-->"+fullhtml3,fullhtml);
		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
		co=fullhtml.match(/~COUNT~/g).length
		for(let i=0;i<co;i++) {
			lastcount=fieldimgcount++;
			fullhtml=fullhtml.replace("~COUNT~",lastcount);
		}
	}

	if(key==="facebook" || key==="tweet" || key==="linkedin" || key==="youtube" || key==="tumblr" || key==="instagram" || key==="soundcloud" || key==="pinterest" || key==="website" || key==="emails" || key==="phones") {
		fullhtml=replaccon('class="listTdBlock"','class="listTdBlock" style="padding: 5px;background-color: #FAFAFA;border-style: solid; border-width: 1px; border-color: #EEE;"',fullhtml);
		fullhtml=replaccon("<!--social_buttons-->","<table class='btable'><tr class='btr'><td>"+droparray['socialFollowButtonBlockEditor']+"</td></tr></table>",fullhtml);
		fullhtml=replaccon("{{forward.role}}",key,fullhtml);
		fullhtml=replaccon("{{forward.href}}",socialfollow[key]['forward_url'],fullhtml);
		fullhtml=replaccon("{{forward.imgurl96}}",socialfollow[key]['forward_imgurl48'],fullhtml);
		fullhtml=replaccon("{{forward.title}}",socialfollow[key]['forward_title'],fullhtml);
	}
	if(key==="soitpd" || key==="stitpd" || key==="soitp" || key==="stitp" || key==="soit" || key==="stit") {
		fullhtml=replaccon("{{image}}",'<img src="'+SITEURL+'/img/shopify.png" />',fullhtml);
		fullhtml=replaccon("{{id}}",'data-type-id="'+key+'"',fullhtml);
	}
	if(key==="moitpd" || key==="mtitpd" || key==="moitp" || key==="mtitp" || key==="moit" || key==="mtit") {
		fullhtml=replaccon("{{image}}",'<img src="./images/magento.png" />',fullhtml);
		fullhtml=replaccon("{{id}}",'data-type-id="'+key+'"',fullhtml);
	}
	if(key==="boitpd" || key==="btitpd" || key==="boitp" || key==="btitp" || key==="boit" || key==="btit") {
		fullhtml=replaccon("{{image}}",'<img src="./images/bigcommerce.png" />',fullhtml);
		fullhtml=replaccon("{{id}}",'data-type-id="'+key+'"',fullhtml);
	}
	if(key==="code") {
		fullhtml=replaccon("{{html|safe}}","<div class=\"textTdBlock\">Use your own custom HTML</div>",fullhtml);
		fullhtml=replaccon('{{id}}','id="textTdBlock'+fieldcount+'"',fullhtml);
	}
	if(key==="video") {
		fullhtml=replaccon('class="listTdBlock"','class="listTdBlock" style="padding: 5px;"',fullhtml);
	}
	fieldcount++;
	return fullhtml;
}
function mySlideronc() {
	let selection,texdewid,texdewid1,texdewid2,ImageCardAndCaptionTdBlock,imageTBlock,mcnImage,textTBlock,textTdBlock,mcnICCwidth,mcnTCCwidth,left,right,imgh1,imgtextwidfull1;
	let mainminus=parseInt($("#templateBody").css("margin-left"))+parseInt($("#templateBody").css("margin-right"))+(parseInt($("#templateBody").css("border-left-width"))*2);
	$('#preview-template').contents().find('#templateContainer,#templatePreheader,#templateHeader,#templateBody,#templateFooter').attr("width",editorWidth-mainminus);
	let imgwidfull1=(imgwidfull*editorWidth)/editorMax;
	$('#preview-template').contents().find('.mojoMcBlock.dojoDndItem').unbind("each").each(function(){
		block_id=$(this).attr("id");
		let imgw1 = parseInt($('#preview-template').contents().find('#'+block_id).find(".mcnImage").css("width"));
		mainminus=parseInt($("#templateBody").css("margin-left"))+parseInt($("#templateBody").css("margin-right"))+(parseInt($("#templateBody").css("border-left-width"))*2);
		let mpleft=parseInt($("td.bodyContainer").css("padding-left"));
		let mpright=parseInt($("td.bodyContainer").css("padding-right"));
		$('#'+block_id).css({"width": "100%","max-width":"600px"});
		let blockid=$('#preview-template').contents().find('#'+block_id);
		let blockleft=parseInt($('#'+block_id).find("td.listTdBlock").css("padding-left"));
		let blockright=parseInt($('#'+block_id).find("td.listTdBlock").css("padding-right"));
		let blockborder=(parseInt($('#'+block_id).find("td.listTdBlock").css("border-left-width"))*2);
		mainminus=mainminus+blockleft+blockright+blockborder;
		if(blockid.attr("rolefor")==="text" || blockid.attr("rolefor")==="footer" || blockid.attr("rolefor")==="boxed_text" || blockid.attr("rolefor")==="boxed_text20" || blockid.attr("rolefor")==="boxed_text21" || blockid.attr("rolefor")==="boxed_text22"){
			selection=$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').attr("select-split-option");
			if(blockid.attr("rolefor")==="text" || blockid.attr("rolefor")==="footer"){
				texdewid=editorWidth-mainminus-mpleft-mpright;
			}
			if(blockid.attr("rolefor")==="boxed_text" || blockid.attr("rolefor")==="boxed_text20" || blockid.attr("rolefor")==="boxed_text21" || blockid.attr("rolefor")==="boxed_text22"){
				texdewid=editorWidth-mainminus-mpleft-mpright;
			}

			if(selection==="0") {
				texdewid1=parseInt(texdewid/2);
				texdewid2=texdewid-texdewid1;
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').css({width:"50%", maxWidth: "300px",float:"left"});
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="2"]').css({width:"50%", maxWidth: "300px",float:"left"});
			} else if(selection==="1") {
				texdewid1=parseInt(texdewid/3);
				texdewid2=texdewid-texdewid1;
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').css({width:"33%", maxWidth: "200px",float:"left"});
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="2"]').css({width:"67%", maxWidth: "400px",float:"left"});
			} else if(selection==="2") {
				texdewid2=parseInt(texdewid/3);
				texdewid1=texdewid-texdewid2;
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').css({width:"67%", maxWidth: "400px",float:"left"});
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="2"]').css({width:"33%", maxWidth: "200px",float:"left"});
			} else if(selection==="-1") {
				texdewid1=texdewid;
				$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').css({width:"100%", maxWidth: "600px"});
			}
			if(editorWidth<=350) {
				texdewid2=editorWidth-mainminus-mpleft-mpright;
				texdewid1=editorWidth-mainminus-mpleft-mpright;
			}
			$('#preview-template').contents().find('#'+block_id).find('[data-table-columns]').attr("select-split-option",selection);
			let datatablecolumns1 = $('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]');
			datatablecolumns1.attr("width",(texdewid1));
			datatablecolumns1.find('.textTdBlock').css({width:"100%"});
			datatablecolumns1.find(".textTdBlock").css("word-break","break-word");

			let datatablecolumns2 = $('#preview-template').contents().find('#'+block_id).find('[data-table-columns="2"]');
			datatablecolumns2.attr("width",(texdewid2));
			datatablecolumns2.find('.textTdBlock').css({width:"100%"});
			datatablecolumns2.find(".textTdBlock").css("word-break","break-word");
		}

		if(blockid.attr("rolefor")==="image_card" || blockid.attr("rolefor")==="image_+_caption" || blockid.attr("rolefor")==="image_+_caption11" || blockid.attr("rolefor")==="image_+_caption12" || blockid.attr("rolefor")==="image_+_caption21" || blockid.attr("rolefor")==="image_+_caption22" || blockid.attr("rolefor")==="image_+_caption31" || blockid.attr("rolefor")==="image_+_caption32"){
			ImageCardAndCaptionTdBlock=$('#preview-template').contents().find('#'+block_id).find(".ImageCardAndCaptionTdBlock");
			imageTBlock=$('#preview-template').contents().find('#'+block_id).find(".imageTBlock");
			if(blockid.attr("rolefor")==="image_+_caption" || blockid.attr("rolefor")==="image_+_caption12") {
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
			}
			if(blockid.attr("rolefor")==="image_+_caption21" || blockid.attr("rolefor")==="image_+_caption22" || blockid.attr("rolefor")==="image_+_caption31" || blockid.attr("rolefor")==="image_+_caption32"){
				imageTBlock=$('#preview-template').contents().find('#'+block_id).find(".imageTBlock");
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
			}
			mcnImage=$('#preview-template').contents().find('#'+block_id).find(".mcnImage");
			textTBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock");
			textTdBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock tbody tr td.textTdBlock");
			mcnICCwidth=Math.floor((editorWidth-mainminus-mpleft-mpright)*33/100);
			mcnTCCwidth=Math.floor(editorWidth-mainminus-mpleft-mpright-mcnICCwidth);
			if(editorWidth<=350) {
				mcnICCwidth=editorWidth-mainminus-mpleft-mpright;
				mcnTCCwidth=editorWidth-mainminus-mpleft-mpright;
			}
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='top'){
				ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;");
				imageTBlock.css({float:""});
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgwidfull1=editorWidth-mainminus-mpleft-mpright-left-right;
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(imgwidfull1))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",imgwidfull1);
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width","100%");
				textTBlock.css({float:""}).css("word-break","break-word").attr("align","");
				imgtextwidfull1=editorWidth-mainminus-mpleft-mpright;
				textTdBlock.attr("width",(imgtextwidfull1));
				textTBlock.insertAfter(imageTBlock);
			}
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='bottom'){
				ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;");
				imageTBlock.css({float:""}).attr("align","left");
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgwidfull1=editorWidth-mainminus-mpleft-mpright-left-right;
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(imgwidfull1))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",imgwidfull1);
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width","100%");
				textTBlock.css({float:""}).css("word-break","break-word").attr("align","");

				imgtextwidfull1=editorWidth-mainminus-mpleft-mpright;
				textTdBlock.attr("width",(imgtextwidfull1));
				imageTBlock.insertAfter(textTBlock);
			}
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='left'){
				ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth));
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").css({width:"33%", maxWidth: "200px", float: "left"});
				if(blockid.attr("rolefor")==="image_+_caption") {
					imageTBlock.css({float:"left"}).attr("align","left");
					imageTBlock.attr("width","33%");
					imageTBlock.css({width:"33%", maxWidth: "200px"});
				} else {
					imageTBlock.css({float:"left"}).attr("align","");
					imageTBlock.attr("width","100%");
					imageTBlock.css({width:"100%", maxWidth: "200px"});
				}
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(mcnICCwidth-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",(mcnICCwidth-left-right));
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width", "67%").attr("valign", "top").attr("align", "left");
				textTBlock.css({width:"67%", maxWidth: "400px", float: "left"});
				textTdBlock.attr("width", "67%");
			}
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='right'){
				ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth));
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").css({width:"33%", maxWidth: "200px", float: "left"});
				if(blockid.attr("rolefor")==="image_+_caption12") {
					imageTBlock.attr("width","33%");
					imageTBlock.css({width:"33%", maxWidth: "200px"});
				} else {
					imageTBlock.attr("width","100%");
					imageTBlock.css({width:"100%", maxWidth: "200px"});
				}
				imageTBlock.css({float:"right"}).attr("align","left");
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(mcnICCwidth-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",(mcnICCwidth-left-right));
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width", "67%").attr("align","left");
				textTBlock.css({width:"67%", maxWidth: "400px", float: "left"});
				textTdBlock.attr("width","67%");
			}
		}

		if(blockid.attr("rolefor")==="image_+_caption_+_h" || blockid.attr("rolefor")==="image_+_caption12_+_h" || blockid.attr("rolefor")==="image_+_caption21_+_h" || blockid.attr("rolefor")==="image_+_caption22_+_h" || blockid.attr("rolefor")==="image_+_caption31_+_h" || blockid.attr("rolefor")==="image_+_caption32_+_h"){
			ImageCardAndCaptionTdBlock=$('#preview-template').contents().find('#'+block_id).find(".ImageCardAndCaptionTdBlock");
			imageTBlock=$('#preview-template').contents().find('#'+block_id).find(".imageTBlock");
			mcnImage=$('#preview-template').contents().find('#'+block_id).find(".mcnImage");
			textTBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock");
			textTdBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock tbody tr td.textTdBlock");
			mcnICCwidth=Math.floor((editorWidth-mainminus-mpleft-mpright)/2);
			mcnTCCwidth=Math.floor(editorWidth-mainminus-mpleft-mpright-mcnICCwidth);
			if(editorWidth<=350) {
				mcnICCwidth=editorWidth-mainminus-mpleft-mpright;
				mcnTCCwidth=editorWidth-mainminus-mpleft-mpright;
			}
			ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='left'){
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth));
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").css({width:"50%", maxWidth: "300px", float: "left"});
				imageTBlock.attr("width",(mcnICCwidth));
				if(blockid.attr("rolefor")==="image_+_caption_+_h") {
					imageTBlock.css({float:"left"}).attr("align","left");
					imageTBlock.css({width:"50%", maxWidth: "300px"});
				} else {
					imageTBlock.css({float:"left"}).attr("align","");
					imageTBlock.css({width:"100%", maxWidth: "300px"});
				}
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(mcnICCwidth-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",(mcnICCwidth-left-right));
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width",mcnTCCwidth).attr("valign","top").attr("align","left");
				textTBlock.css({width:"50%", maxWidth: "300px", float: "left"});
				textTdBlock.attr("width",(mcnTCCwidth));
			}
			if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='right'){
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth));
				ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").css({width:"50%", maxWidth: "300px", float: "left"});
				imageTBlock.attr("width",(mcnICCwidth));
				if(blockid.attr("rolefor")==="image_+_caption12_+_h") {
					imageTBlock.css({width:"50%", maxWidth: "300px"});
				} else {
					imageTBlock.css({width:"100%", maxWidth: "300px"});
				}
				imageTBlock.css({float:"right"}).attr("align","left");
				left=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-left"));
				right=parseInt(mcnImage.parent("a").parent(".imageTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(mcnImage.css("height"))*parseInt(mcnICCwidth-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(mcnImage.attr("changeWidth")!=="yes") {
					mcnImage.attr("width",(mcnICCwidth-left-right));
					mcnImage.css({width:"100%"});
					mcnImage.attr("height",imgh1);
					mcnImage.css("height","auto");
				}
				textTBlock.attr("width", mcnTCCwidth).attr("align","left");
				textTBlock.css({width:"50%", maxWidth: "300px", float: "left"});
				textTdBlock.attr("width",(mcnTCCwidth));
			}
		}
		if(blockid.attr("rolefor")==="2image_+_2caption_+_custom") {
			selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
			texdewid=editorWidth-mainminus-mpleft-mpright;
			if(selection==="1") {
				texdewid1=parseInt(texdewid/3);
				texdewid2=texdewid-texdewid1;
				blockid.find('[data-clo-num="0"] div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
				blockid.find('[data-clo-num="1"] div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 400 x 218</span>");
			} else if(selection==="2") {
				texdewid2=parseInt(texdewid/3);
				texdewid1=texdewid-texdewid2;
				blockid.find('[data-clo-num="0"] div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 400 x 218</span>");
				blockid.find('[data-clo-num="1"] div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
			}
			if(editorWidth<=350) {
				texdewid2=editorWidth-mainminus-mpleft-mpright;
				texdewid1=editorWidth-mainminus-mpleft-mpright;
			}

			if(selection==="1") {
				blockid.find('[data-clo-num="0"]').css({width:"33%", maxWidth: "200px", float: "left"});
			} else if(selection==="2") {
				blockid.find('[data-clo-num="0"]').css({width:"67%", maxWidth: "400px", float: "left"});
			}
			blockid.find('[data-clo-num="0"]').attr("width",(texdewid1));
			blockid.find('[data-clo-num="0"]').find('table.textTBlock,table.imageTBlock').css({width:"100%"});
			left=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height"))*parseInt(texdewid1-left-right))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				if(selection==="1") {
					blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%", maxWidth: "200px"});
				} else if(selection==="2") {
					blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%", maxWidth: "400px"});
				}
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("width",texdewid1-left-right);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid1));
			blockid.find('[data-clo-num="0"]').find('table.textTBlock').attr("width",(texdewid1)).attr("align","");
			if(selection==="1") {
				blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "200px"});
			} else if(selection==="2") {
				blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "400px"});
			}
			blockid.find('[data-clo-num="0"]').find(".textTdBlock").css("word-break","break-word");

			if(selection==="1") {
				blockid.find('[data-clo-num="1"]').css({width:"67%", maxWidth: "400px", float: "left"});
			} else if(selection==="2") {
				blockid.find('[data-clo-num="1"]').css({width:"33%", maxWidth: "200px", float: "left"});
			}
			blockid.find('[data-clo-num="1"]').attr("width",(texdewid2));
			blockid.find('[data-clo-num="1"]').find('table.textTBlock,table.imageTBlock').css({width:"100%"});
			left=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height"))*parseInt(texdewid2-left-right))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				if(selection==="1") {
					blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%", maxWidth: "400px"});
				} else if(selection==="2") {
					blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%", maxWidth: "200px"});
				}
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("width",texdewid2-left-right);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid2));
			blockid.find('[data-clo-num="1"]').find('table.textTBlock').attr("width",(texdewid2)).attr("align","");
			if(selection==="1") {
				blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "400px"});
			} else if(selection==="2") {
				blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "200px"});
			}
			blockid.find('[data-clo-num="1"]').find(".textTdBlock").css("word-break","break-word");
		}
		let ImageCardAndCaptionTBlock=blockid.find(".ImageCardAndCaptionTBlock").length;
		if((blockid.attr("rolefor")==="2image_+_2caption") && ImageCardAndCaptionTBlock===2) {
			selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
			texdewid=editorWidth-mainminus-mpleft-mpright;
			if(selection==="0") {
				texdewid1=parseInt(texdewid/2);
				texdewid2=texdewid-texdewid1;
			}
			if(editorWidth<=350) {
				texdewid2=editorWidth-mainminus-mpleft-mpright;
				texdewid1=editorWidth-mainminus-mpleft-mpright;
			}

			blockid.find('[data-clo-num="0"]').css({width:"50%", maxWidth: "300px", float: "left"});
			blockid.find('[data-clo-num="0"]').attr("width",(texdewid1));
			blockid.find('[data-clo-num="0"]').find('table.textTBlock,table.imageTBlock').css({width:"100%"});
			left=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height"))*parseInt(texdewid1-left-right))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%", maxWidth: "300px"});
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("width",texdewid1-left-right);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid1));
			blockid.find('[data-clo-num="0"]').find('table.textTBlock').attr("width",(texdewid1)).attr("align","");
			blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="0"]').find(".textTdBlock").css("word-break","break-word");

			blockid.find('[data-clo-num="1"]').css({width:"50%", maxWidth: "300px", float: "left"});
			blockid.find('[data-clo-num="1"]').attr("width",(texdewid2));
			blockid.find('[data-clo-num="1"]').find('table.textTBlock,table.imageTBlock').css({width:"100%"});
			left=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height"))*parseInt(texdewid2-left-right))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%", maxWidth: "300px"});
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("width",texdewid2-left-right);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid2));
			blockid.find('[data-clo-num="1"]').find('table.textTBlock').attr("width",(texdewid2)).attr("align","");
			blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="1"]').find(".textTdBlock").css("word-break","break-word");
		}
		if((blockid.attr("rolefor")==="2image_+_1caption1" || blockid.attr("rolefor")==="2image_+_1caption2") && ImageCardAndCaptionTBlock===2) {
			selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
			texdewid=editorWidth-mainminus-mpleft-mpright;

			blockid.find('[data-clo-num="1"]').css({marginLeft:"0px"});
			blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
			if(selection==="0") {
				texdewid1=parseInt(texdewid/2);
				texdewid2=texdewid-texdewid1;
			} else if(selection==="1") {
				texdewid1=parseInt(texdewid/3);
				texdewid2=texdewid-texdewid1;
			} else if(selection==="2") {
				texdewid2=parseInt(texdewid/3);
				texdewid1=texdewid-texdewid2;
			}
			if(editorWidth<=350) {
				texdewid2=editorWidth-mainminus-mpleft-mpright;
				texdewid1=editorWidth-mainminus-mpleft-mpright;
				blockid.find('[data-clo-num="1"]').css({marginLeft:"0px"});
				blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
			}
			blockid.find('[data-clo-num="0"]').css({width:"50%", maxWidth: "300px", float: "left"});
			blockid.find('[data-clo-num="0"]').attr("width",(texdewid1));
			left=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="0"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height"))*parseInt(texdewid1-left-right))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%", maxWidth: "300px"});
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("width",texdewid1-left-right);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid1));
			blockid.find('[data-clo-num="0"]').find('table.textTBlock').attr("width",(texdewid1)).attr("align","").css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="0"]').find(".textTdBlock").css("word-break","break-word");

			let marginleft=parseInt(blockid.find('[data-clo-num="1"]').css("margin-left"));
			blockid.find('[data-clo-num="1"]').css({width:"50%", maxWidth: "300px", float: "left"});
			blockid.find('[data-clo-num="1"]').attr("width",(texdewid2-marginleft));
			left=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-left"));
			right=parseInt(blockid.find('[data-clo-num="1"]').find(".imageTdBlock").css("padding-right"));
			imgh1=parseInt((parseInt(blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height"))*parseInt(texdewid2-left-right-marginleft))/parseInt(imgw1));
			if(imgh1===0) imgh1="";
			if(blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("changeWidth")!=="yes") {
				blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%", maxWidth: "300px"});
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("width",texdewid2-left-right-marginleft);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("height",imgh1);
				blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height","auto");
			}
			blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",(texdewid2-marginleft));
			blockid.find('[data-clo-num="1"]').find('table.textTBlock').attr("width",(texdewid2-marginleft)).attr("align","").css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"100%", maxWidth: "300px"});
			blockid.find('[data-clo-num="1"]').find(".textTdBlock").css("word-break","break-word");
		}
		if((blockid.attr("rolefor")==="2image_+_2caption" && ImageCardAndCaptionTBlock===3) || (blockid.attr("rolefor")==="3image_+_3caption" && ImageCardAndCaptionTBlock===3)) {
			selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
			texdewid=parseInt((editorWidth-mainminus-mpleft-mpright)/3);
			blockid.find('[data-clo-num="1"]').css({marginLeft:"0px"});
			blockid.find('[data-clo-num="2"]').css({marginLeft:"0px"});
			blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
			blockid.find('[data-clo-num="2"]').css({marginTop:"0px"});
			if(editorWidth<=350) {
				texdewid=editorWidth-mainminus-mpleft-mpright;
				blockid.find('[data-clo-num="1"]').css({marginLeft:""});
				blockid.find('[data-clo-num="2"]').css({marginLeft:""});
				blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
				blockid.find('[data-clo-num="2"]').css({marginTop:"0px"});
			}
			for(let i=0;i<3;i++) {
				blockid.find('[data-clo-num="'+i+'"]').css({width:"33%", maxWidth: "200px", float: "left"});
				blockid.find('[data-clo-num="'+i+'"]').attr("width",(texdewid));
				blockid.find('[data-clo-num="'+i+'"]').find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
				left=parseInt(blockid.find('[data-clo-num="'+i+'"]').find(".imageTdBlock").css("padding-left"));
				right=parseInt(blockid.find('[data-clo-num="'+i+'"]').find(".imageTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').css("height"))*parseInt(texdewid-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				if(blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("changeWidth")!=="yes") {
					blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').css({width:"100%", maxWidth: "200px"});
					blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("width",texdewid-left-right);
					blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("height",imgh1);
					blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').css("height","auto");
				}
				blockid.find('[data-clo-num="'+i+'"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width",texdewid);
				blockid.find('[data-clo-num="'+i+'"]').find('table.textTBlock tbody tr td.textTdBlock').css({width:"33%", maxWidth: "200px"});
			}
			blockid.find('[data-clo-num]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
			blockid.find('[data-clo-num]').find('table.textTBlock').attr("align","");
			blockid.find('[data-clo-num]').find(".textTdBlock").css("word-break","break-word");
		}
		if(blockid.attr("rolefor")==="image_group") {
			texdewid=((editorWidth-mainminus-mpleft-mpright)/2);
			if(editorWidth<=350) {
				texdewid=editorWidth-mainminus-mpleft-mpright;
			}
			blockid.find("table.imageGroupTBlock").attr("width",(texdewid));
			blockid.find("table.imageGroupTBlock").css({width:"50%", maxWidth: "300px", float: "left"});
			for(let i=0;i<4;i++) {
				left=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-left"));
				right=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-right"));
				if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
					let bimg=blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage");
					if(bimg.length===1) {
						blockid.find("table[data-tbmc-id="+i+"]").find('.mcnImage').css({width:"100%", maxWidth: "300px"});
						blockid.find("table[data-tbmc-id="+i+"]").find('.mcnImage').attr("width",texdewid-left-right);
						blockid.find("table[data-tbmc-id="+i+"]").find('.mcnImage').attr("height",imgh1);
						blockid.find("table[data-tbmc-id="+i+"]").find('.mcnImage').css("height","auto");
					}
				}
				blockid.find("table[data-tbmc-id="+i+"] table.mcpreview-image-uploader").attr("width",(texdewid-left-right));
			}
			blockid.find("table[data-tbmc-id=1]").removeAttr("align");
		}
		if(blockid.attr("rolefor")==="image_group_3h" || blockid.attr("rolefor")==="image_group_3s") {
			texdewid=parseInt((editorWidth-mainminus-mpleft-mpright)/3);
			if(editorWidth<=350) {
				texdewid=editorWidth-mainminus-mpleft-mpright;
			}
			blockid.find('table.imageGroupTBlock td.imageGroupTdBlock').css({"position":"relative"});
			blockid.find("table.imageGroupTBlock").attr("width",(texdewid));
			blockid.find("table.imageGroupTBlock").css({width:"33%", maxWidth: "200px", float: "left"});
			for(let i=0;i<3;i++) {
				left=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-left"));
				right=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height"))*parseInt(texdewid-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				blockid.find("table[data-tbmc-id="+i+"]").find("table.mcpreview-image-uploader").attr("width",(texdewid-left-right));
				if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("width",(texdewid-left-right));
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css({width:"100%"});
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("height",imgh1);
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height","auto");
				}
			}
			if(blockid.attr("rolefor")==="image_group_3h") {
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 436</span>");
			} else {
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 180 x 218</span>");
			}
		}
		if(blockid.attr("rolefor")==="image_group_2h" || blockid.attr("rolefor")==="image_group_2s") {
			texdewid=((editorWidth-mainminus-mpleft-mpright)/2);
			if(editorWidth<=350) {
				texdewid=editorWidth-mainminus-mpleft-mpright;
			}
			blockid.find('table.imageGroupTBlock td.imageGroupTdBlock').css({"position":"relative"});
			blockid.find("table.imageGroupTBlock").attr("width",(texdewid));
			blockid.find("table.imageGroupTBlock").css({width:"50%", maxWidth: "300px",float: "left"});
			for(let i=0;i<2;i++) {
				left=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-left"));
				right=parseInt(blockid.find("table[data-tbmc-id="+i+"]").find(".imageGroupTdBlock").css("padding-right"));
				imgh1=parseInt((parseInt(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height"))*parseInt(texdewid-left-right))/parseInt(imgw1));
				if(imgh1===0) imgh1="";
				blockid.find("table[data-tbmc-id="+i+"]").find("table.mcpreview-image-uploader").attr("width",texdewid-left-right);
				if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("width",(texdewid-left-right));
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css({width:"100%"});
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("height",imgh1);
					blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height","auto");
				}
			}
			if(blockid.attr("rolefor")==="image_group_2h") {
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 260 x 436</span>");
			} else {
				blockid.find('div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 260 x 218</span>");
			}
		}
		if(blockid.attr("rolefor")==="image") {
			texdewid=editorWidth-mainminus-mpleft-mpright;
			left=blockid.find("table.imageTBlock td.imageTdBlock").css("padding-left").replace("px","");
			right=blockid.find("table.imageTBlock td.imageTdBlock").css("padding-right").replace("px","");
			imgh1=parseInt((parseInt(blockid.find("table.imageTBlock td.imageTdBlock img").css("height"))*parseInt(texdewid-left-right))/parseInt(blockid.find("table.imageTBlock td.imageTdBlock img").css("width")));
			if(imgh1===0) imgh1="";
			blockid.find("table.imageTBlock").attr("width",(texdewid));
			blockid.find("table.imageTBlock").css({width:"100%", maxWidth: "600px"});
			blockid.find("table.imageTBlock td.imageTdBlock").attr("width",(texdewid));
			blockid.find("table.imageTBlock td.imageTdBlock").css({width:"100%", maxWidth: "600px"});
			if(blockid.find("table.imageTBlock td.imageTdBlock img").attr("changeWidth")!=="yes") {
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("width",(texdewid-left-right));
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css({width:"100%"});
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("height",imgh1);
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("height","auto");
			}
			blockid.find("table.imageTBlock table.mcpreview-image-uploader").attr("width",(texdewid-10));
			blockid.find("table.imageTBlock table.mcpreview-image-uploader").css({width:(texdewid-10)+"px"});
		}
		if(blockid.attr("rolefor")==="logoicon") {
			texdewid=editorWidth-mainminus-mpleft-mpright;
			left=blockid.find("table.imageTBlock td.imageTdBlock").css("padding-left").replace("px","");
			right=blockid.find("table.imageTBlock td.imageTdBlock").css("padding-right").replace("px","");
			imgh1=parseInt((parseInt(blockid.find("table.imageTBlock td.imageTdBlock img").css("height"))*parseInt(texdewid-left-right))/parseInt(blockid.find("table.imageTBlock td.imageTdBlock img").css("width")));
			if(imgh1===0) imgh1="";
			blockid.find("table.imageTBlock").attr("width",(texdewid));
			blockid.find("table.imageTBlock").css({width:"100%", maxWidth: "600px"});
			blockid.find("table.imageTBlock td.imageTdBlock").attr("width",(texdewid));
			blockid.find("table.imageTBlock td.imageTdBlock").css({width:"100%", maxWidth: "600px"});
			if(blockid.find("table.imageTBlock td.imageTdBlock img").attr("changeWidth")!=="yes") {
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("width",(texdewid-left-right));
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css({width:"100%"});
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("height",imgh1);
				blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("height","auto");
			}
			blockid.find("table.imageTBlock table.mcpreview-image-uploader").attr("width",(texdewid-10));
			blockid.find("table.imageTBlock table.mcpreview-image-uploader").css({width:(texdewid-10)+"px"});
		}
		if(blockid.attr("rolefor")==="video") {
			texdewid=editorWidth-mainminus-mpleft-mpright;
			left=blockid.find("table.videoTBlock td.videoTdBlock").css("padding-left").replace("px","");
			right=blockid.find("table.videoTBlock td.videoTdBlock").css("padding-right").replace("px","");
			imgh1=parseInt((parseInt(blockid.find("table.videoTBlock td.videoTdBlock img").css("height"))*parseInt(texdewid-left-right))/parseInt(blockid.find("table.videoTBlock td.videoTdBlock img").css("width")));
			if(imgh1===0) imgh1="";
			blockid.find("table.videoTBlock").attr("width",(texdewid));
			blockid.find("table.videoTBlock").css({width:"100%", maxWidth: "600px"});
			blockid.find("table.videoTBlock td.videoTdBlock").attr("width",(texdewid));
			blockid.find("table.videoTBlock td.videoTdBlock").css({width:"100%", maxWidth: "600px"});
			blockid.find("table.videoTBlock td.videoTdBlock img.mcnImage").attr("width",(texdewid-left-right));
			blockid.find("table.videoTBlock td.videoTdBlock img.mcnImage").css({width:"100%"});
			blockid.find("table.videoTBlock td.videoTdBlock img.mcnImage").attr("height",imgh1);
			blockid.find("table.videoTBlock td.videoTdBlock img.mcnImage").css("height","auto");
		}
		if(blockid.attr("rolefor")==="ecommerce") {
			texdewid=editorWidth-mainminus-mpleft-mpright;
			selection = blockid.find("td.ecomTdBlock");
			texdewid1=texdewid/selection.length;
			if(editorWidth<=350) {
				texdewid1=texdewid;
			}
			if(selection.length > 1){
				for(let i=0;i<selection.length;i++) {
					left=blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]  td.ecomTdBlock').css("padding-left").replace("px","");
					right=blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]  td.ecomTdBlock').css("padding-right").replace("px","");
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]').attr("width",(texdewid1));
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]').css({width:"50%", maxWidth: "300px"});
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').attr("width",(texdewid1-left-right));
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').css({width:"100%", maxWidth: "300px"});
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').find(".ecomimg").attr("width",(texdewid1-left-right));
					blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').find(".ecomimg").css({width:"100%"});
				}
			} else {
				let i=0;
				left=blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]  td.ecomTdBlock').css("padding-left").replace("px","");
				right=blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]  td.ecomTdBlock').css("padding-right").replace("px","");
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]').attr("width",(texdewid1));
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]').css({width:"100%", maxWidth: "600px"});
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').attr("width",(texdewid1-left-right));
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').css({width:"100%", maxWidth: "600px"});
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').find(".ecomimg").attr("width",(texdewid1-left-right));
				blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').find(".ecomimg").css({width:"100%"});
			}
		}
		if(blockid.attr("rolefor")==="divider") {
			texdewid=editorWidth-mainminus-mpleft-mpright;
			blockid.find('td.listTdBlock').css({"width": "100%","display": "flex"});
			blockid.find('td.listTdBlock').attr("width",texdewid);
			if(blockid.find("table.dividerTBlock").attr("changeWidth")!=="yes") {
				blockid.find('table.dividerTBlock').attr("width","100%").css("width","100%");
			}
		}
	});
}
export function savefullcontent(actionType="") {
	if(actionType === "save"){
		let tw = parseInt($('#templateBody').css("margin-left").replace("px",""))+parseInt($('#templateBody').css("margin-right").replace("px",""))+"px";
		$("#posfordes").trigger("click");
		$("#cntr").css({"box-shadow": "",width: "600px"});
		$('#preview-template').find('#templateBody').css({width: `calc(100% - ${tw})`, maxWidth: "600px"});
		$('#preview-template').contents().find('[contenteditable="true"]').each(function(){
			$(this).html($(this).html().replaceAll(/\s</g, "&nbsp;<").replaceAll(/>\s/g, ">&nbsp;"));
		});
	}
	let droppableTargethei=0;
	$('#preview-template').find('div.mcd').attr("id","mcd");
	$('#preview-template').contents().find('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
	});
	let pageDescription = "";
	$('#preview-template').contents().find('.textTdBlock').each(function(){
		$(this).css("word-break","break-word");
		pageDescription += $(this)[0].innerText.trim()+ " ";
	});
	if(pageDescription === ""){
		pageDescription = "Online digital marketing platform to built Email Marketing, Social Media Marketing, SMS Marketing, Survey, and Assessment to engage with your customers."
	} else {
		pageDescription = pageDescription.substring(0,150).trim();
	}
	if(droppableTargethei<=447){droppableTargethei="447px";}else{droppableTargethei="auto";}
	$('#preview-template').contents().find('.droppableTarget').css({height:droppableTargethei});
	$('#preview-template').contents().find('.mcpreview-image-uploader tbody tr').html('');
	$('#preview-template').contents().find('.mojoMcContainerEmptyMessage').html('');
	tembody = $('#templateBody');
	tembody.attr("data-width",tembody.attr("width"));
	let fullhtmlfornext="";
	if(actionType === "save"){
		let htmlText = '<style>#templateBody { background-color: #FFFFFF; border: 0px none #FFFFFF; } #templateFooter { background-color: #FFFFFF; border-top: 0; border-bottom: 0; } @media only screen and (max-width: 480px) { body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; } body { width: 100% !important; min-width: 100% !important; } td[id=bodyCell] { padding: 10px !important; } table[class=mcpreview-image-uploader] { width: 100% !important; display: none !important; } img[class=mcnImage] { width: 100% !important; } h1 { font-size: 24px !important; line-height: 125% !important; } h2 { font-size: 20px !important; line-height: 125% !important; } h3 { font-size: 18px !important; line-height: 125% !important; } h4 { font-size: 16px !important; line-height: 125% !important; } } @media only screen and (max-width: 600px) { table.textblockTBlock, table.textTBlock, table.imageTBlock, td.imageTdBlock, table.imageGroupTBlock, table.ImagelistContentTBlock, table.ImageCardAndCaptionTBlock, table.ecomTBlock, #cntr, .tpl-block, table.listTBlock, td.listTdBlock, #templateBody { width: 100% !important; max-width: 100% !important; } img.mcnImage, img.ecomimg { width: 100% !important; height: auto !important; max-width: 100% !important; } } @-moz-document url-prefix(http), url-prefix(file) { img: -moz-broken { -moz-force-broken-image-icon: 1; width: 24px; height: 24px; } } i.fa { background-image: none; } .marker { background-color: Yellow; } .w-100{ width: 100% !important; }</style><!--[if (mso)|(IE)]><table style="'+encoderQuote($("div.mcd.np").attr("style"))+'width:100%;"><tr><td align="center"><![endif]--><div class="mcd np" style="'+encoderQuote($("div.mcd.np").attr("style"))+'"';
		if(typeof $("div.mcd.np").attr("item-value") === "undefined"){
			htmlText += ' item-value="0"';
		} else {
			htmlText += ' item-value="'+$("div.mcd.np").attr("item-value")+'"';
		}
		if(typeof $("div.mcd.np").attr("item-path") !== "undefined"){
			htmlText += ' item-path="'+$("div.mcd.np").attr("item-path")+'"';
		}
		htmlText += ' id="mcd"><!--[if (mso)|(IE)]><table style="'+$("#cntr").attr("style")+' width:600px;" align="center"><tr><td><![endif]-->' + $("#cntr")[0].outerHTML + '<!--[if (mso)|(IE)]></td></tr></table><![endif]--></div><!--[if (mso)|(IE)]></td></tr></table><![endif]-->';
		fullhtmlfornext=htmlText;
	} else {
		fullhtmlfornext=$('#preview-template').html();
	}
	fullhtmlfornext = fullhtmlfornext.replace(/<sc[r]ipt[\s\S]*?<\/sc[r]ipt>/gi,'');
	fullhtmlfornext = fullhtmlfornext.replace(/<head[\s\S]*?<\/head>/gi,'');
	fullhtmlfornext=unprotectSource(fullhtmlfornext);
	let pageTitle = $('body').contents().find('.editor-buttons .col-md-5 span').text().replaceAll("Page Name : ","");
	document.getElementById('all_temp_data').value='<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8"><title>'+pageTitle+'</title><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta property="og:title" content="'+pageTitle+'" /><meta property="og:description" content="'+pageDescription+'" /><meta property="og:image" content="'+myPageImageUrl.replace("{{folderName}}", "mypage")+'" /><meta name="twitter:title" content="'+pageTitle+'" /><meta name="twitter:description" content="'+pageDescription+'" /><meta name="twitter:image" content="'+myPageImageUrl.replace("{{folderName}}", "mypage")+'" /></head><body>' + fullhtmlfornext + "</body></html>";

	tembody = $('#templateBody');
	tembody.attr("width",tembody.attr("data-width"));
	$('#preview-template').contents().find('.mcpreview-image-uploader tbody tr').html(droparray['replaceimagedrop']);
	$('#preview-template').contents().find('div.mojoMcBlock.tpl-block[rolefor="image"],[rolefor="logoicon"],[rolefor="image_card"],[rolefor="image_+_caption11"]').each(function( key_id ) {
		$(this).find('div.imagePlaceholder div[data-dojo-attach-point="uploadText"] span:first-child').replaceWith("<span>Recommend Image Size 580 x 218</span>");
		let searchParams = new URLSearchParams(window.location.search);
		let param = searchParams.get('trbtn');
		if (param==="demo13") {
			if ($(this).attr("rolefor")==="logoicon" && $(this).attr("id")==="preview_McBlock_4") {
				$(this).find('div.imagePlaceholder img').before('<span>Your Company Logo</span><br/>');
			}
		}
	});
	$('#preview-template').contents().find('div.mojoMcBlock.tpl-block[rolefor="footer"]').each(function( key_id ) {
		$(this).find('center a').attr("href","mailto:"+$(this).find('center a').text());
		$(this).find('center a').attr("data-cke-saved-href","mailto:"+$(this).find('center a').text());
	});
	$('#preview-template').contents().find('.mojoMcContainerEmptyMessage').html(droparray['replacedrop']);
	setTimeout(function(){
		mySlideronc();
	},1500);
	$('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		$(this).find('span.deleteblock').unbind("click").click(function(e){
			e.stopImmediatePropagation();
			let b=$(this).closest('.mojoMcBlock.tpl-block.dojoDndItem').attr("id");
			let blo_id="Dialog_2"+replaccon("preview_McBlock_","",b);
			if(e.altKey) {
				$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay").remove();
				$('#preview-template').contents().find('#'+b).remove();
			}else{
				blockdelete(blo_id,b,droparray,emtmsedisplay,savefullcontent);
			}
			hidedsm();
			emtmsedisplay();
			savefullcontent();
		});
	});
	$(".mojoMcBlock.tpl-block.dojoDndItem").hover(function(){
		blockhover=$(this).attr("id");
	});
	blockhover="";
	emtmsedisplay();
	bigimagesetting();
}
export function blockedtblocan(block_id) {
	let rolefor=$('#preview-template').contents().find('#'+block_id).attr("rolefor");
	if(rolefor==="text" || rolefor==="boxed_text" || rolefor==="boxed_text20" || rolefor==="boxed_text21" || rolefor==="boxed_text22" || rolefor==="footer") {
		tbfcontrol(block_id);
	}
	if(rolefor==="divider") {
		dvdcontrol(block_id,dividerSetting);
	}
	if(rolefor==="image" || rolefor==="logoicon" || rolefor==="image_group" || rolefor==="image_group_3h" || rolefor==="image_group_3s" || rolefor==="image_group_2h" || rolefor==="image_group_2s") {
		imagescontrol(block_id,editreplaceimagelink);
	}
	if(rolefor==="social_follow") {
		socfollowcontrol(block_id,droparray,droparraysetting,savefullcontent,blocksetting);
	}
	if(rolefor==="image_card" || rolefor==="image_+_caption" || rolefor==="image_+_caption11" || rolefor==="image_+_caption12" || rolefor==="image_+_caption_+_h" || rolefor==="image_+_caption12_+_h") {
		imgcardcontrol(block_id);
	}
	if(rolefor==="image_+_caption21" || rolefor==="image_+_caption22" || rolefor==="image_+_caption31" || rolefor==="image_+_caption32" || rolefor==="image_+_caption21_+_h" || rolefor==="image_+_caption22_+_h" || rolefor==="image_+_caption31_+_h" || rolefor==="image_+_caption32_+_h") {
		multiimgcardcontrol(block_id);
	}
	if(rolefor==="2image_+_2caption" || rolefor==="3image_+_3caption" || rolefor==="2image_+_2caption_+_custom") {
		mulimgcapcontrol(block_id);
	}
	if(rolefor==="2image_+_1caption1" || rolefor==="2image_+_1caption2") {
		mulimgonecapcontrol(block_id);
	}
	if(rolefor==="code") {
		codcontrol(block_id);
	}
	if(rolefor==="video") {
		videocontrol(block_id,droparraysetting,blocksetting);
	}
	if(rolefor==="ecommerce") {
		ecommercecontrol(block_id);
	}
	if(rolefor==="genericlink") {
		buttonSetting(block_id,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
	}
	if(rolefor==="attachment") {
		attachmentSetting(block_id,droparraysetting,blocksetting);
	}
}
function tbfcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".listTdBlock table[data-table-columns='1'] .textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".listTdBlock table[data-table-columns='1'] .textTdBlock,.listTdBlock table[data-table-columns='2'] .textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
	textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditor(block_id);
	},1500);
}
function imgcardcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let contentblockid=replaccon("preview_McBlock_","",block_id);
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
	textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditor(block_id);
		browseimagebtn(block_id,contentblockid);
		editreplaceimagelink(block_id,contentblockid);
	},1500);
}
function multiimgcardcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let contentblockid=replaccon("preview_McBlock_","",block_id);
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
	textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditor(block_id);
		browseimagebtn(block_id,contentblockid);
		editreplaceimagelink(block_id,contentblockid);
	},1500);
}
function mulimgcapcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let contentblockid=replaccon("preview_McBlock_","",block_id);
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
	textSetting2(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditor(block_id);
		browseimagebtn(block_id,contentblockid);
		editreplaceimagelink(block_id,contentblockid);
	},1500);
}
function mulimgonecapcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let contentblockid=replaccon("preview_McBlock_","",block_id);
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
	textSetting2(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditor(block_id);
		browseimagebtn(block_id,contentblockid);
		editreplaceimagelink(block_id,contentblockid);
	},1500);
}
function codcontrol(block_id) {
	let textDecoration=$('#preview-template').contents().find('#templateBody').css("text-decoration");
	let colstyl=$('#preview-template').contents().find('#'+block_id).find(".listTdBlock .textTdBlock");
	$('#preview-template').contents().find('#'+block_id).find(".listTdBlock table td.textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),lineHeight:colstyl.css('line-height'),color:colstyl.css('color'),textDecoration:textDecoration,padding:"5px"});
	textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
	setTimeout(function(){
		createckeditorforcode(block_id);
	},1500);
}
function ecommercecontrol(block_id) {
	let introduction = $("#"+block_id).find(".textTdBlock");
	for(let i=0;i<introduction.length;i++) {
		if(window.CKEDITOR.instances[introduction[i].id]!==undefined)
		{
			window.CKEDITOR.instances[introduction[i].id].destroy();
		}
	}
	setTimeout(function() {
		createckeditor(block_id);
	}, 1000);
	let contentblockid=replaccon("preview_McBlock_","",block_id);
	let totalbtn = $("#"+block_id).find("table.ecomTBlock");
	setTimeout(function(){
		for(let target_id=0;target_id<totalbtn.length;target_id++) {
			$("#"+block_id).find('table.ecomTBlock[data-mc-id="'+target_id+'"] td.ecomTdBlock .blankecom').unbind("click").click(function(e){
				let key = $(this).parent("td.ecomTdBlock").attr("data-type-id");
				target_id = $(this).closest("table.ecomTBlock").attr("data-mc-id");
				if(key==="soitpd" || key==="stitpd" || key==="soitp" || key==="stitp" || key==="soit" || key==="stit") {
					e.stopImmediatePropagation();
					shopify(block_id,target_id,contentblockid,key);
				}
			});
			$("#"+block_id).find("td.ecomTdBlock a").click(function(e) {
				e.preventDefault();
			});
			$("#"+block_id).find('table.ecomTBlock[data-mc-id="'+target_id+'"]').unbind("click").click(function(){
				$(".mojoMcBlock.tpl-block").removeClass("active");
				$("#"+block_id).addClass("active");
				$("#dsmcsetting").html(droparraysetting["ecomSettingBlockEditor"]);
				$("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
				$("#cbutton").trigger("click");
				blocksetting(block_id);
				target_id = $(this).attr("data-mc-id");
				let ecombgclr,ecomborclr;
				if($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css("background-color")==="rgba(0, 0, 0, 0)") {
					ecombgclr="#ffffff";
				} else {
					ecombgclr=rgb2hex($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css("background-color"));
				}
				$("#ecomboxbgbox").val(ecombgclr);
				$("#ecomboxbgbox").spectrum({
					allowEmpty:true,
					color: ecombgclr,
					showInput: true,
					className: "full-spectrum",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					showAlpha: true,
					maxSelectionSize: 1000,
					preferredFormat: "hex",
					localStorageKey: "spectrum.homepage",
					chooseText: "Select",
					palette: []
				});
				$("#ecomborwid").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-left-width').replace("px",""));
				$("#ecomselectbortsty").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-left-style'));
				if($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-left-style')==="none") {
					ecomborclr="#ffffff";
				} else {
					ecomborclr=rgb2hex($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-left-color'));
				}
				$("#ecomboxborderbox").val(ecomborclr);
				$("#ecomboxborderbox").spectrum({
					allowEmpty:true,
					color: ecomborclr,
					showInput: true,
					className: "full-spectrum",
					showInitial: true,
					showPalette: true,
					showSelectionPalette: true,
					showAlpha: true,
					maxSelectionSize: 1000,
					preferredFormat: "hex",
					localStorageKey: "spectrum.homepage",
					chooseText: "Select",
					palette: []
				});
				$("#ecompadleft").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding-left').replace("px",""));
				$("#ecompadright").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding-right').replace("px",""));
				$("#ecompadtop").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding-top').replace("px",""));
				$("#ecompadbottom").val($("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding-bottom').replace("px",""));
				if($("#ecompadtop").val()==="0" && $("#ecompadright").val()==="0" && $("#ecompadbottom").val()==="0" && $("#ecompadleft").val()==="0") {
					$('#ecombtnete').prop('checked',true);
				} else {
					$('#ecombtnete').prop('checked',false);
				}
				$("#ecompadtop,#ecompadright,#ecompadbottom,#ecompadleft").unbind('keyup').keyup(function() {
					if($("#ecompadtop").val()==="0" && $("#ecompadright").val()==="0" && $("#ecompadbottom").val()==="0" && $("#ecompadleft").val()==="0") {
						$('#ecombtnete').prop('checked',true);
					} else {
						$('#ecombtnete').prop('checked',false);
					}
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding',$("#ecompadtop").val()+"px "+$("#ecompadright").val()+"px "+$("#ecompadbottom").val()+"px "+$("#ecompadleft").val()+"px");
					mySlideronc();
				});
				$('#ecombtnete').unbind('change').change(function(){
					if ($(this).prop('checked')===true){
						$("#ecompadtop").val("0");
						$("#ecompadright").val("0");
						$("#ecompadbottom").val("0");
						$("#ecompadleft").val("0");
					} else {
						$("#ecompadtop").val("5");
						$("#ecompadright").val("5");
						$("#ecompadbottom").val("5");
						$("#ecompadleft").val("5");
					}
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('padding',$("#ecompadtop").val()+"px "+$("#ecompadright").val()+"px "+$("#ecompadbottom").val()+"px "+$("#ecompadleft").val()+"px");
					mySlideronc();
				});
				$('#ecomboxbgbox').unbind('change').change(function(){
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('background-color',$("#ecomboxbgbox").val());
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('background-clip','padding-box');
				});
				$("#ecomborwid").unbind('keyup').keyup(function() {
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border',$("#ecomborwid").val()+"px "+$("#ecomselectbortsty").val()+" "+$("#ecomboxborderbox").val());
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-style',$("#ecomselectbortsty").val());
				});
				$("#ecomselectbortsty,#ecomboxborderbox").unbind('change').change(function() {
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border',$("#ecomborwid").val()+"px "+$("#ecomselectbortsty").val()+" "+$("#ecomboxborderbox").val());
					$("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").css('border-style',$("#ecomselectbortsty").val());
				});
				$('.tpl-ecom-edit').unbind("click").click(function(){
					let key = $("#"+block_id+" table.ecomTBlock[data-mc-id="+target_id+"] td.ecomTdBlock").attr("data-type-id");
					if(key==="soitpd" || key==="stitpd" || key==="soitp" || key==="stitp" || key==="soit" || key==="stit") {
						hidedsm();
						shopify(block_id,target_id,contentblockid,key);
					}
				});
				showdsm("ecom");
			});
		}
	},500);
}
function linkcontrol(block_id) {
	let colstyl=$('#preview-template').contents().find('#templateBody');
	$('#preview-template').contents().find('#'+block_id).find("table[class*='TBlock'][data-mc-id='0'] td[class*='TdBlock']").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight')});
}
function buttoncontrol() {
	let sty,sty2,ae;
	sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff !important;background-color: #6c757d;border-color: #6c757d;"';
	sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
	ae=' <!--[if true]><table role="presentation" width="65" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="65"><![endif]--><a target="_blank" href="http://www.example.com" '+sty+'>Button</a><!--[if true]></td></tr></table><![endif]-->';
	let fullHTML=getdrophtml("genericlink");
	fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
	fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
	if(blockhover==="") {
		$('td.bodyContainer').append(fullHTML);
	} else {
		$('td.bodyContainer').find("#"+blockhover).after(fullHTML);
	}
	buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
	emtmsedisplay();
}
function attachmentcontrol() {
	let ae=' <!--[if true]><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><a target="_blank" href="http://www.example.com" download>Attachment Link</a><!--[if true]></td></tr></table><![endif]-->';
	let fullHTML=getdrophtml("attachment");
	fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
	fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
	if(blockhover==="") {
		$('td.bodyContainer').append(fullHTML);
	} else {
		$('td.bodyContainer').find("#"+blockhover).after(fullHTML);
	}
	filemanager(lastbloclid,"attachment","attachment","","");
	attachmentSetting(lastbloclid,droparraysetting,blocksetting);
	emtmsedisplay();
}

/* Setting functions */
function blocksetting(block_id) {
	blocksettingcommon(block_id,mySlideronc);
	if($("#"+block_id).attr("rolefor")==="genericlink") {
		$(".tpl-block-clone").hide();
	} else {
		$(".tpl-block-clone").show();
		$(".tpl-block-clone").unbind("click").click(function(){
			$(".cke").hide();
			let found=$('#preview-template').contents().find('#'+block_id);
			let fullhtml = "";
			if(found.attr("rolefor") === "ecommerce"){
				fullhtml = getdrophtml($('#'+block_id).find(".ecomTdBlock").attr("data-type-id"));
			} else {
				fullhtml = getdrophtml(found.attr("rolefor"));
			}
			found.after(fullhtml);
			blockdrag();
			blockedtblocan(lastbloclid);
			let found1 = $('#preview-template').contents().find('#'+lastbloclid).attr("rolefor");
			refleftimageandcaption(found1,lastbloclid,editorMax,editorWidth,imgwidfull);
			emtmsedisplay();
			savefullcontent();
		});
	}
	$(".tpl-block-delete").unbind("click").click(function(e){
		$(".cke").hide();
		let blo_id="Dialog_2"+replaccon("preview_McBlock_","",block_id);
		if(e.altKey) {
			$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay").remove();
			$('#preview-template').contents().find('#'+block_id).remove();
		}else{
			blockdelete(blo_id,block_id,droparray,emtmsedisplay,savefullcontent);
		}
		hidedsm();
		emtmsedisplay();
		savefullcontent();
	});
}
function dividerSetting(block_id) {
	$("#"+block_id).unbind("click").click(function(){
		$(".mojoMcBlock.tpl-block").removeClass("active");
		$("#"+block_id).addClass("active");
		$("#dsmcsetting").html(droparraysetting["dividerSettingBlockEditor"]);
		$("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
		$("#cbutton").trigger("click");
		blocksetting(block_id);
		dividerSettingCommon(block_id);
		$("#dvdborwidth").unbind('keyup').keyup(function() {
			if($("#dvdborwidth").val().replace("%", "") !== "" && ($("#dvdborwidth").val().replace("%", "")<=0 || $("#dvdborwidth").val().replace("%", "")>100)) {
				$("#dvdborwidth").val(100);
			}
			changeWidth = "yes";
			$("#" + block_id + " table.dividerTBlock").attr('width', $("#dvdborwidth").val().replace("%", "") + "%").css('width', $("#dvdborwidth").val().replace("%", "") + "%");
			if ($("#" + block_id).find("table.dividerTBlock").attr("changeWidth") !== "yes") {
				$("#" + block_id).find("table.dividerTBlock").attr("changeWidth", changeWidth);
			}
			changeWidth = "";
			mySlideronc();
		});
		showdsm("");
	});
}
function editreplaceimagelink(block_id,contentblockid) {
	let totalimg = $("#"+block_id).find("img");
	$("#"+block_id).find("td.imageTdBlock a, td.imageGroupTdBlock a").unbind("click").click(function(e) {
		e.preventDefault();
	});
	totalimg.map(()=> (
		$("#" + block_id).find('table.imageTBlock img.mcnImage,table.imageGroupTBlock img.mcnImage').unbind("click").click(function () {
			$(".mojoMcBlock.tpl-block").removeClass("active");
			$("#" + block_id).addClass("active");
			$("#dsmcsetting").html(droparraysetting["imageSettingBlockEditor"]);
			$("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
			$("#cbutton").trigger("click");
			blocksetting(block_id);

			let t, imgh, imgw, imgh1, imgw1;
			$("#imgtxtwidth,#imgtxtheight").unbind("focus").focus(function () {
				imgh = $("#imgtxtheight").val();
				imgw = $("#imgtxtwidth").val();
			});
			if ($("#" + block_id).attr("rolefor") === "image_group" || $("#" + block_id).attr("rolefor") === "image_group_3h" || $("#" + block_id).attr("rolefor") === "image_group_3s" || $("#" + block_id).attr("rolefor") === "image_group_2h" || $("#" + block_id).attr("rolefor") === "image_group_2s") {
				t = $(this).closest("table.imageGroupTBlock").attr("data-tbmc-id");
				$("#imgtxtwidth").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgh1 = parseInt((parseInt(imgh) * parseInt($("#imgtxtwidth").val())) / parseInt(imgw));
						if (isNaN(imgh1)) {
							imgh1 = 0;
						}
						$("#imgtxtheight").val(imgh1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").css({
						"width": $("#imgtxtwidth").val(),
						"height": $("#imgtxtheight").val()
					});
					if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
				$("#imgtxtheight").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgw1 = parseInt((parseInt(imgw) * parseInt($("#imgtxtheight").val())) / parseInt(imgh));
						if (isNaN(imgw1)) {
							imgw1 = 0;
						}
						$("#imgtxtwidth").val(imgw1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
					if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
			} else if (($("#" + block_id).attr("rolefor") === "image_+_caption21") || ($("#" + block_id).attr("rolefor") === "image_+_caption22") || ($("#" + block_id).attr("rolefor") === "image_+_caption31") || ($("#" + block_id).attr("rolefor") === "image_+_caption32") || ($("#" + block_id).attr("rolefor") === "image_+_caption21_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption22_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption31_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption32_+_h") || ($("#" + block_id).attr("rolefor") === "2image_+_2caption") || ($("#" + block_id).attr("rolefor") === "3image_+_3caption") || ($("#" + block_id).attr("rolefor") === "2image_+_1caption1") || ($("#" + block_id).attr("rolefor") === "2image_+_1caption2")) {
				t = $(this).closest("table.imageTBlock").attr("data-tbmc-id");
				$("#imgtxtwidth").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgh1 = parseInt((parseInt(imgh) * parseInt($("#imgtxtwidth").val())) / parseInt(imgw));
						if (isNaN(imgh1)) {
							imgh1 = 0;
						}
						$("#imgtxtheight").val(imgh1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
					if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
				$("#imgtxtheight").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgw1 = parseInt((parseInt(imgw) * parseInt($("#imgtxtheight").val())) / parseInt(imgh));
						if (isNaN(imgw1)) {
							imgw1 = 0;
						}
						$("#imgtxtwidth").val(imgw1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
					if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
			} else {
				t = 0;
				$("#imgtxtwidth").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgh1 = parseInt((parseInt(imgh) * parseInt($("#imgtxtwidth").val())) / parseInt(imgw));
						if (isNaN(imgh1)) {
							imgh1 = 0;
						}
						$("#imgtxtheight").val(imgh1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("td.imageTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
					if ($("#" + block_id).find("td.imageTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("td.imageTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("td.imageTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("td.imageTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
				$("#imgtxtheight").unbind("keyup").keyup(function () {
					if ($("#imgbtnar").prop('checked') === true) {
						imgw1 = parseInt((parseInt(imgw) * parseInt($("#imgtxtheight").val())) / parseInt(imgh));
						if (isNaN(imgw1)) {
							imgw1 = 0;
						}
						$("#imgtxtwidth").val(imgw1);
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					} else {
						$("#imgdissize").html($("#imgtxtwidth").val() + " x " + $("#imgtxtheight").val());
					}
					changeWidth = "yes";
					$("#" + block_id).find("td.imageTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
					if ($("#" + block_id).find("td.imageTdBlock img").attr("changeWidth") !== "yes") {
						$("#" + block_id).find("td.imageTdBlock img").attr("changeWidth", changeWidth);
					}
					$("#" + block_id).find("td.imageTdBlock img").attr("width", $("#imgtxtwidth").val());
					$("#" + block_id).find("td.imageTdBlock img").attr("height", $("#imgtxtheight").val());
					changeWidth = "";
					mySlideronc();
				});
			}
			editreplaceimagelinkcommon(block_id,mySlideronc,t);
			showdsm("image");
			$('.tpl-image-edit').unbind("click").click(function () {
				imageID ="dndimg_"+contentblockid+"_"+t;
				imageIDFullPath = $("#" + imageID).attr("src");
				if (imageIDFullPath.indexOf("?v=") > -1) {
					filename = imageIDFullPath.split("?")[0].split("/").pop();
					imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
				} else {
					filename = imageIDFullPath.split("/").pop();
					imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
				}
				filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
				fromEditor="self";
				$("#clickLoader").val(true);
				$("#clickLoader").trigger("click");
				launchPixieEditor();
				hidedsm();
			});
			$('.tpl-image-edit-ai').unbind("click").click(function () {
				filemanager(block_id,t,contentblockid);
				setTimeout(()=>{
					$("#imagewithai").trigger("click");
					setTimeout(()=>{
						imageID ="dndimg_"+contentblockid+"_"+t;
						imageIDFullPath = $("#" + imageID).attr("src");
						$("#aigeneratedimagemain").before('<div id="aioriginalimagemain" class="d-flex flex-column align-items-center justify-content-center w-100 mb-3"><img id="aioriginalimage" src="'+imageIDFullPath+'" alt="Original" class="w-50" /></div>');
					},1000);
				},1000);
				hidedsm();
			});
			$('.tpl-image-replace').unbind("click").click(function () {
				filemanager(block_id,t,contentblockid);
				hidedsm();
			});
		})
	));
}
/* Setting functions */

/* CKEditor */
function createckeditor(ckediterid) {
	let introduction = $("#"+ckediterid).find(".textTdBlock");
	let texffamily = "";
	if(introduction.length > 0){
		texffamily = replaccon('"',"",introduction.css('fontFamily')).split(",")[0];
	}
	if(texffamily==='Raleway'){texffamily="Arial";}
	let texfsize = introduction.css('fontSize');
	if(texffamily === ""){
		texffamily = "Arial";
	}
	if(texfsize === ""){
		texfsize = "14px";
	}
	window.CKEDITOR.dtd.$editable.td = 1;
	let mpTypeLocal = mpType;
	let edfulLocal = edful;
	let surveystagsLocal = surveystags;
	let assessmentstagsLocal = assessmentstags;
	let customformstagsLocal = customformstags;
	let tagsLocal = tags;
	let tempUser = user;
	let tempBrandKits = user?.brandKits || [];
	let tempSignature = signaturestags || [];
	for(let i=0;i<introduction.length;i++) {
		$("#"+introduction[i].id).unbind("click").click(function(){
			let id=$(this).attr("id");
			if(window.CKEDITOR.instances[id]===undefined) {
				if(mpTypeLocal===3) {
					window.CKEDITOR.inline(id,{
						extraPlugins: 'mergeudfs,mergesurveys,mergeassessments,mergecustomforms,mergeaddsignature,mergetextai,closebtn',
						toolbar: [{name: "basicstyles", items: ['Mergeudfs','Mergesurveys','Mergeassessments','Mergecustomforms','mergeAddSignature','mergeTextAi','closebtn']}],
						on: {
							configLoaded: function() {
								this.config.surveystags = surveystagsLocal;
								this.config.assessmentstags = assessmentstagsLocal;
								this.config.customformstags = customformstagsLocal;
								this.config.tags = tagsLocal;
								this.config.signature = tempSignature;
							}
						}
					});
				} else if(mpTypeLocal===2) {
					window.CKEDITOR.inline(id,{
						on: {
							configLoaded: function() {
								this.config.font_defaultLabel= texffamily;
								this.config.fontSize_defaultLabel= texfsize;
								this.config.title = false;
								this.config.forcePasteAsPlainText = true;
								this.config.removePlugins = 'tableselection,mergepropertieslabel,mergepropertiesheader,mergepropertiesfooter';
								this.config.surveystags = surveystagsLocal;
								this.config.assessmentstags = assessmentstagsLocal;
								this.config.customformstags = customformstagsLocal;
								this.config.tags = tagsLocal;
								this.config.edful = edfulLocal;
								this.config.signature = tempSignature;
								if(tempUser.hasOwnProperty("brandKits")){
									let tempBrandColors = "";
									for (let bc = 0; bc < tempBrandKits?.length; bc++) {
										if (typeof tempBrandKits[bc]?.brandColors !== "undefined" && tempBrandKits[bc]?.brandColors !== "" && tempBrandKits[bc]?.brandColors !== null) {
											if (tempBrandColors !== "")
												tempBrandColors = tempBrandColors + ";" + tempBrandKits[bc]?.brandColors;
											else
												tempBrandColors = tempBrandKits[bc]?.brandColors;
										}
									}
									if (tempBrandColors !== "") {
										let tempObj = tempBrandColors.split(";").map(JSON.stringify);
										let uniqueObj = new Set(tempObj);
										let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
										tempBrandColors = uniqueArr.join(";");
										let oldTempBrandColors = tempBrandColors.split(";");
										let newTempBrandColors = [];
										for (let i = 0; i < oldTempBrandColors.length; i++) {
											newTempBrandColors.push(rgb2hex(oldTempBrandColors[i]));
										}
										tempBrandColors = newTempBrandColors.join(",");
										this.config.colorButton_colors = tempBrandColors.replaceAll("#","");
									}
								}
							},
							customConfig: 'config.js'
						},
					});
					setTimeout(()=>{
						$("#"+introduction[i].id+" a").unbind("click").click(function(e){
							e.stopImmediatePropagation();
							e.preventDefault();
							e.stopPropagation();
							ckButtonSetting($(this));
						});
					},1000);
				}
			}
			$("#"+introduction[i].id+" a").unbind("click").click(function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				e.stopPropagation();
				ckButtonSetting($(this));
			});
		});
		$("#"+introduction[i].id+" a").unbind("click").click(function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			e.stopPropagation();
			ckButtonSetting($(this));
		});
	}
}
function createckeditorforcode(ckediterid) {
	let introduction = $("#"+ckediterid).find("td.textTdBlock");
	window.CKEDITOR.dtd.$editable.td = 1;
	for(let i=0;i<introduction.length;i++) {
		$("#"+introduction[i].id).unbind("click").click(function(){
			let id=$(this).attr("id");
			if(typeof window.CKEDITOR.instances[id] === "undefined" && id !== "") {
				window.CKEDITOR.inline(id,{
					extraPlugins: 'sourcedialog,mergepropertiestext',
					toolbar: [{name: "basicstyles", items: ["Sourcedialog",'mergePropertiesText']}]
				});
			}
		});
	}
}
/* CKEditor */

/* File Manager */
function clickSelectItemCall(block_id,target_id,contentblockid) {
	clickSelectItemCallCommon(block_id,target_id,contentblockid,newItemCall,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,"",editreplaceimagelink);
	$('#FileManager_pdconimg_pdconimg #files-list li div.thumb-image img').unbind("click").click(function(){
		let sourceImage = document.createElement('img');
		let colorThief = new ColorThief();
		let itempath=$(this).attr("item-path");
		let op=parseFloat(Math.abs($('#preview-template').contents().find('#templateBody').attr("item-value"))/100);
		sourceImage.setAttribute('src', itempath);
		let color = colorThief.getColor(sourceImage);
		$('#preview-template').contents().find('#templateBody').css('background-color','rgb(' + color + ')');
		let newcolor=rgb2hex('rgb('+color+')');
		$("#pdconboxbackbox").spectrum("set",newcolor);
		$("#pdconboxbackbox").val(newcolor);
		$('#preview-template').contents().find('#templateBody').attr("item-path",itempath);
		$('#preview-template').contents().find('#templateBody').css('background-image','url("'+itempath+'")');
		$('#preview-template').contents().find('#templateBody').css('background-color',hexToRGB(newcolor, op));
		if($("#pdcongrid .grid.active").attr("item-value")==="stretch") {
			$('#preview-template').contents().find('#templateBody').css('background-size','cover');
		} else {
			$('#preview-template').contents().find('#templateBody').css('background-size','contain');
		}
		$('#preview-template').contents().find('#templateBody').css('background-position',$("#pdconposition .pos.active").attr("item-value"));
		$("#pdconblend").val("overlay");
		$('#preview-template').contents().find('#templateBody').css('background-blend-mode',"overlay");
		$("#pdcondispimg").attr("src",itempath);
		$("#pdcondispimg,#pdcondeleteimg").show();
		$("#pdconuploadimg").hide();
		$("#pdcondispimg").click(function(){
			$("#pdconuploadimg").trigger("click");
		});
		$("#pdcondeleteimg").click(function(){
			$("#pdcondispimg").attr("src","");
			$("#pdcondispimg,#pdcondeleteimg").hide();
			$("#pdconuploadimg").show();
			$('#preview-template').contents().find('#templateBody').removeAttr("item-path");
			$('#preview-template').contents().find('#templateBody').css('background-image','');
			$('#preview-template').contents().find('#templateBody').attr("item-value","0");
			$("#pdconbrightness span.ui-slider-handle").css("left","0%");
			$("#pdcongrid .grid").removeClass("active");
			$('#pdcongrid .grid[item-value="stretch"]').addClass("active");
			$("#pdconposition .pos").removeClass("active");
			$("#pdconposition .pos[item-value='0% 0%']").addClass("active");
			$("#pdconblend").val('normal');
			setPageBackgroundSetting();
		});
		$('a[data-dojo-attach-point="closeLink"]').trigger('click');
	});
	$(".pixie-edit").unbind("click").click(function() {
		imageIDFullPath = $(this).attr('item-url');
		filename = $(this).attr('item-file-name');
		filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
		imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
		fromEditor="manager";
		$("#clickLoader").val(true);
		$("#clickLoader").trigger("click");
		launchPixieEditor();
	})
}
window.clickSelectItemCall=clickSelectItemCall;
function newItemCall(itempath) {
	let fullhtml = getdrophtml("image");
	$('td.bodyContainer').append(fullhtml);
	blockedtblocan(lastbloclid);
	emtmsedisplay();
	savefullcontent();
	let contentblockid=replaccon("preview_McBlock_","",lastbloclid);
	let target_id=0;
	$('li.mojoImageItem.dojoDndItem[data-image-index="'+target_id+'"] img.mojoImageItemIcon').attr("src",itempath);
	$('a[data-dojo-attach-point="closeLink"]').trigger('click');
	let fullhtml1=droparray["templates/editorContainer/images/imagecontent"];
	fullhtml1=replaccon("{{id}}",contentblockid+"_"+target_id,fullhtml1);
	fullhtml1=replaccon("{{drag.img.url}}",itempath,fullhtml1);
	fullhtml1=replaccon("{{drag.img.mcid}}",target_id,fullhtml1);
	let imgwidfull1=(imgwidfull*editorWidth)/editorMax;
	fullhtml1=replaccon("{{drag.img.width}}",imgwidfull1,fullhtml1);
	$('#preview-template').contents().find('#'+lastbloclid).find('.imageTdBlock [data-mc-id="'+target_id+'"]').replaceWith(fullhtml1);
	setTimeout(function(){
		imagescontrol(lastbloclid,editreplaceimagelink);
		blockedtblocan(lastbloclid);
		mySlideronc();
	},1000);
}
/* File Manager */

/* Image Editor */
function launchPixieEditor() {
	const script = document.createElement('script');
	script.src = siteURL+'/externaljs/pixie/pixie.umd.js';
	script.async = false;
	document.body.appendChild(script);
	$('body').find("#pixie-editor-container").remove();
	$('body').append('<div id="pixie-editor-container"></div>');
	const ui = {
		mode: 'overlay',
		visible: false,
		menubar: {
			items: [
				{
					type: 'button',
					icon: [
						{
							tag: 'path',
							attr: {
								d: 'm11.99 18.54-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z',
							},
						},
					],
					align: 'right',
					position: 0,
					action: editor => {
						console.log("onClose Btn");
						// editor.togglePanel('objects');
					},
				},
				{
					type: 'button',
					icon: [
						{
							tag: 'path',
							attr: {
								d: 'M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z',
							},
						},
					],
					align: 'left',
					buttonVariant: 'outline',
					menuItems: [
						{
							action: editor => {
								editor.tools.import.uploadAndReplaceMainImage();
							},
							label: 'Background Image',
						},
						{
							action: editor => {
								editor.tools.import.uploadAndAddImage();
							},
							label: 'Overlay Image',
						},
						{
							action: editor => {
								editor.tools.import.uploadAndOpenStateFile();
							},
							label: 'Editor Project File',
						},
					],
				},
			],
		},
		toolbar: {
			hide: false,
			hideOpenButton: false,
			hideSaveButton: false,
			hideCloseButton: false,
		}
	};
	const config = {
		selector: "#pixie-editor-container",
		baseUrl: siteURL+'/externaljs/pixie/assets',
		ui: {...ui, visible: true},
		onLoad: function() {},
		onSave: function(data, name) {
			let requestData = {
				"imageName": filename,
				"imageData": data,
				"imagePath": imagePath
			}
			editImage(requestData).then(res => {
				if (res.status === 200 && res.result.imagePath) {
					if(fromEditor === "self") {
						let turl = res.result.imagePath + `?v=${Math.floor(Math.random() * 100001)}`;
						let img = document.getElementById(imageID);
						img.src = turl;
						findImageSize("","",block_id,turl,"");
						pixie1.close();
					} else {
						$('.treeview ul li:first-of-type').trigger("click");
						pixie1.close();
					}
				} else {
					$("#clickError").attr("data-type","Error");
					$("#clickError").val("Sorry your image is not save please try again.");
					$("#clickError").trigger("click");
					pixie1.close();
				}
			});
		},
		onClose: function() {
			delete window.Pixie;
			document.body.removeChild(script);
		}
	};
	pixie1 = null;
	let interval = setInterval(() => {
		if(typeof window.Pixie !== "undefined"){
			clearInterval(interval);
			interval = null;
			$("#clickLoader").val(false);
			$("#clickLoader").trigger("click");
		}
		pixie1 = new window.Pixie({...config});
		pixie1.setConfig({image: imageIDFullPath})
	}, 1000);
}
/* Image Editor */

/* Shopify */
function shopify(block_id,target_id,contentblockid,key){
	$(".shopify-container").remove();
	let fullhtml=shopifyarr["mainshopifyarrcontent"];
	fullhtml=replaccon("{{dlInd}}",contentblockid,fullhtml);
	fullhtml=replaccon("{{tarInd}}",target_id,fullhtml);
	$("body").append(fullhtml);
	let Shopify_ = $("#Shopify_"+contentblockid+"_"+target_id);
	Shopify_.find('a[data-dojo-attach-point="closeLink"]').unbind("click").click(function(){
		Shopify_.remove();
	});
	Shopify_.show();
	getcatshopify(block_id,target_id,contentblockid,key);
}
function getcatshopify(block_id,target_id,contentblockid,key)
{
	$('#imageview').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your categories...");
	getShopifyCollectionList().then(res => {
		if (res.status === 200) {
			let t = '<p style="font-weight: bold;margin-bottom: 15px;">Category List</p>';
			t += '<ul class="files-list selfclear" data-dojo-attach-point="fileList" data-dojo-type="mojo/analytics/List" id="files-list" data-dojo-props="\'lazy\': true, url:\'/file/list\', sort: \'created_at\', asc: false">';
			res.result.collectionsList.map((v)=>(
				t += '<li className="selfclear"><a style="color: #242424 !important;" data-collection-id="'+v.id+'" className="collectionid"><img src="'+v.image+'" alt="'+v.title+'"><p class="mb-0" data-mc-file-name="'+v.title+'" title="'+v.title+'" data-toggle="tooltip">'+v.title+'</p></a></li>'
			));
			t += '</ul>';
			$('#imageview').html(t);
			getprodshopify(block_id,target_id,contentblockid,key);
		} else {
			$("#clickError").attr("data-type","Error");
			$("#clickError").val("Something went wrong...Please try again later...");
			$("#clickError").trigger("click");
		}
	});
}
function getprodshopify(block_id,target_id,contentblockid,key)
{
	$('.shopify-container #files-list li a').unbind("click").click(function(){
		$('#imageview').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your products...");
		let requestData = `id=${$(this).attr("data-collection-id")}&title=${$(this).find("p").attr("data-mc-file-name")}&sinceId=0`;
		getShopifyProductList(requestData).then(res => {
			if (res.status === 200) {
				let t = '<p style="font-weight: bold;margin-bottom: 15px;"><a href="javascript:void(0);" id="catlist" style="color: #242424 !important;border: 0;cursor: pointer;">Category List</a><i class="fas fa-chevron-right" style="margin: 0 5px;"></i><span id="ecomcatid" data-id="'+$(this).attr("data-collection-id")+'" style="display: inline-block;">'+$(this).find("p").attr("data-mc-file-name")+'</span></p>';
				t += '<ul class="files-list selfclear" data-dojo-attach-point="fileList" data-dojo-type="mojo/analytics/List" id="files-list" data-dojo-props="\'lazy\': true, url:\'/file/list\', sort: \'created_at\', asc: false">';
				res.result.productList.map((v)=>(
					t += '<li class="selfclear" id="'+v.id+'"><a title="'+v.title+'" data-toggle="tooltip" class="grid-image thumb-image" href="'+v.image+'" target="_blank"><img class="w-100" src="'+v.image+'"></a><div class="grid-meta"><p class="mb-0" data-mc-file-name="'+v.title+'" title="'+v.title+'" data-toggle="tooltip">'+(v.title.length > 20 ? v.title.substr(0,17)+"..." : v.title)+'</p><p class="mb-0">$'+v.price+'</p></div><a href="javascript:void(0);" data-dojo-attach-point="select-item" item-id="'+v.id+'" class="button" onclick="">Select</a></li>'
				));
				t += '<input type="hidden" id="currentProductCount" value="'+res.result.currentProductCount+'"><input type="hidden" id="all" value="'+res.result.totalProduct+'"></ul><div class="row"><button type="button" class="btn btn-default load-more" style="margin:0px auto;">Load More</button><div class="lds-ellipsis lds-ellipsis-ecom" style="display: none; margin:0px auto;"><div></div><div></div><div></div></div>';
				$('#imageview').html(t);
				$('#catlist').unbind("click").click(function(){
					getcatshopify(block_id,target_id,contentblockid,key);
				});
				shopifyselectitembind(block_id,target_id,contentblockid,key);
				shopifyloadmorebutton(block_id,target_id,contentblockid,key);
			} else {
				$("#clickError").attr("data-type","Error");
				$("#clickError").val("Something went wrong...Please try again later...");
				$("#clickError").trigger("click");
			}
		});
	});
}
function shopifyselectitembind(block_id,target_id,contentblockid,key)
{
	$('.shopify-container #files-list li a[data-dojo-attach-point="select-item"]').unbind("click").click(function(){
		let requestData = `id=${$(this).attr("item-id")}`;
		getShopifyProductById(requestData).then(res => {
			if (res.status === 200) {
				let t = "";
				if(key === "soitpd") {
					t +=' <div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div><div id="textTdBlock'+contentblockid+target_id+'2" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">$'+res.result.product.price+'</a></div><div id="textTdBlock'+contentblockid+target_id+'3" style="font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock">'+res.result.product.bodyHtml+'</div></div>';
				} else if(key === "stitpd") {
					t += '<div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div><div id="textTdBlock'+contentblockid+target_id+'2" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">$'+res.result.product.price+'</a></div><div id="textTdBlock'+contentblockid+target_id+'3" style="font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock">'+res.result.product.bodyHtml+'</div></div>';
				} else if(key === "soitp") {
					t += '<div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div><div id="textTdBlock'+contentblockid+target_id+'2" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">$'+res.result.product.price+'</a></div></div>';
				} else if(key === "stitp") {
					t += '<div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div><div id="textTdBlock'+contentblockid+target_id+'2" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">$'+res.result.product.price+'</a></div></div>';
				} else if(key === "soit") {
					t += '<div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div></div>';
				} else if(key === "stit") {
					t += '<div><a href="'+res.result.product.storeUrl+'" target="_blank"><img class="ecomimg" src="'+res.result.product.image+'" /></a><div id="textTdBlock'+contentblockid+target_id+'1" style="padding-top: 5px;font-family: Roboto, sans-serif; font-size: 14px; font-weight: 400;" align="left" contenteditable="true" class="textTdBlock"><a href="'+res.result.product.storeUrl+'" target="_blank">'+res.result.product.title+'</a></div></div>';
				}
				$('.shopify-container').remove();
				$('#preview-template').contents().find('#'+block_id).find('table.ecomTBlock[data-mc-id="'+target_id+'"] td.ecomTdBlock').html(t);
				ecommercecontrol(block_id);
				mySlideronc();
			} else {
				$("#clickError").attr("data-type","Error");
				$("#clickError").val("Sorry your product is not imported please try again...");
				$("#clickError").trigger("click");
			}
		});
	});
}
function shopifyloadmorebutton(block_id,target_id,contentblockid,key)
{
	let all = Number($('#all').val());
	let currentProductCount = Number($('#currentProductCount').val());
	if (currentProductCount >= all) {
		$('.load-more').hide();
	}
	$('.load-more').click(function() {
		let all = Number($('#all').val());
		let currentProductCount = Number($('#currentProductCount').val());
		let id = $('#files-list').children('li').last().attr('id');
		if (currentProductCount <= all) {
			$(".load-more").hide();
			$(".lds-ellipsis-ecom").show();
			let requestData = `id=${$("#ecomcatid").attr("data-id")}&title=${$("#ecomcatid").text()}&sinceId=${id}`;
			getShopifyProductList(requestData).then(res => {
				if (res.status === 200) {
					let t = '';
					res.result.productList.map((v)=>(
						t += '<li class="selfclear" id="'+v.id+'"><a title="'+v.title+'" data-toggle="tooltip" class="grid-image thumb-image" href="'+v.image+'" target="_blank"><img class="w-100" src="'+v.image+'"></a><div class="grid-meta"><p class="mb-0" data-mc-file-name="'+v.title+'" title="'+v.title+'" data-toggle="tooltip">'+(v.title.length > 20 ? v.title.substr(0,17)+"..." : v.title)+'</p><p class="mb-0">$'+v.price+'</p></div><a href="javascript:void(0);" data-dojo-attach-point="select-item" item-id="'+v.id+'" class="button">Select</a></li>'
					));
					$('#files-list').children('li').last().after(t).show().fadeIn("slow");
					shopifyselectitembind(block_id,target_id,contentblockid,key);
					$('#currentProductCount').val(Number($('#currentProductCount').val())+Number(res.result.currentProductCount));
					if (currentProductCount >= all) {
						$('.load-more').hide();
						$(".lds-ellipsis-ecom").hide();
					} else {
						$(".lds-ellipsis-ecom").hide();
						$(".load-more").show();
					}
				} else {
					$("#clickError").attr("data-type","Error");
					$("#clickError").val("Something went wrong...Please try again later...");
					$("#clickError").trigger("click");
				}
			});
		} else {
			$(".load-more").hide();
			$(".lds-ellipsis-ecom").hide();
		}
	});
}
/* Shopify */