import {siteURL, websiteColor} from "../../../../config/api";
import $ from "jquery";
import {downloadFileDB, downloadFileGD, downloadFileOD, importVideoImageFromUrlED} from "../../../../services/myDesktopService";
import {filemanager} from "../../fileManager/js/filemanager";
import ColorThief from "color-thief-browser";
import { numberWithCommas } from "../../../../assets/commonFunctions";
import { getCountry } from "../../../../services/commonService";
import OpenAI from "openai/index.mjs";
import { v4 as uuidv4 } from 'uuid';

let SITEURL=siteURL;
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export const socialfollow={
    "facebook":{
        "forward_title":"Facebook",
        "forward_link":"*|FORWARD_FB|*",
        "forward_url":"http://www.facebook.com",
        "forward_urltitle":"Facebook Page URL",
        "forward_imgurl48":"color-facebook-48.png",
        "forward_imgurl_short":"facebook"
    },
    "tweet":{
        "forward_title":"Twitter",
        "forward_link":"*|FORWARD_TW|*",
        "forward_url":"http://www.twitter.com/",
        "forward_urltitle":"Twitter URL or Username",
        "forward_imgurl48":"color-twitter-48.png",
        "forward_imgurl_short":"twitter"
    },
    "linkedin":{
        "forward_title":"LinkedIn",
        "forward_link":"*|FORWARD_LI|*",
        "forward_url":"http://www.linkedin.com",
        "forward_urltitle":"LinkedIn Profile URL",
        "forward_imgurl48":"color-linkedin-48.png",
        "forward_imgurl_short":"linkedin"
    },
    "youtube":{
        "forward_title":"YouTube",
        "forward_link":"*|FORWARD_YT|*",
        "forward_url":"http://www.youtube.com",
        "forward_urltitle":"YouTube Channel URL",
        "forward_imgurl48":"color-youtube-48.png",
        "forward_imgurl_short":"youtube"
    },
    "pinterest":{
        "forward_title":"Pinterest",
        "forward_link":"*|FORWARD_PT|*",
        "forward_url":"http://www.pinterest.com",
        "forward_urltitle":"Pinterest Board URL",
        "forward_imgurl48":"color-pinterest-48.png",
        "forward_imgurl_short":"pinterest"
    },
    "tumblr":{
        "forward_title":"Tumblr",
        "forward_link":"*|FORWARD_TM|*",
        "forward_url":"http://www.tumblr.com",
        "forward_urltitle":"Tumblr Blog URL",
        "forward_imgurl48":"color-tumblr-48.png",
        "forward_imgurl_short":"tumblr"
    },
    "instagram":{
        "forward_title":"Instagram",
        "forward_link":"*|FORWARD_IG|*",
        "forward_url":"http://instagram.com",
        "forward_urltitle":"Instagram Profile URL",
        "forward_imgurl48":"color-instagram-48.png",
        "forward_imgurl_short":"instagram"
    },
    "soundcloud":{
        "forward_title":"SoundCloud",
        "forward_link":"*|FORWARD_SC|*",
        "forward_url":"http://www.soundcloud.com",
        "forward_urltitle":"SoundCloud URL",
        "forward_imgurl48":"color-soundcloud-48.png",
        "forward_imgurl_short":"soundcloud"
    },
    "website":{
        "forward_title":"Website",
        "forward_link":"*|FORWARD_WB|*",
        "forward_url":"http://www.example.com",
        "forward_urltitle":"Page URL",
        "forward_imgurl48":"color-link-48.png",
        "forward_imgurl_short":"link"
    },
    "emails":{
        "forward_title":"Email",
        "forward_link":"*|FORWARD_EM|*",
        "forward_url":"abc@example.com",
        "forward_urltitle":"Email URL",
        "forward_imgurl48":"color-emails-48.png",
        "forward_imgurl_short":"email"
    },
    "phones":{
        "forward_title":"Phone",
        "forward_link":"*|FORWARD_PH|*",
        "forward_url":"0123456789",
        "forward_urltitle":"Phone URL",
        "forward_imgurl48":"color-phones-48.png",
        "forward_imgurl_short":"phone"
    }
};

export const droparraycommon = {
    "replacedrop": 'Drop Content Blocks Here',
    "singleTextEditor": '<table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock ##textblockTBlock##" width="100%" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock ##textblockTdBlock##" valign="top" style="padding:5px;">{{textdetail}}</td></tr></tbody></table>',
    "singleTextBlockEditor": '{{blockHtml|safe}}',
    "singleTextBlockEditorContent": '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="textblockTBlock" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tr><td class="textblockTdBlock" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><table border="0" cellpadding="0" cellspacing="0" class="textTBlock" width="100%"><tr><td {{id}} contenteditable="true" valign="top" class="textTdBlock" style="padding:5px;">{{textdetail}}</td></tr></table></td></tr></table>',
    "dividerBlockEditor": '<table class="dividerTBlock" style="border-top: 1px solid rgb(153, 153, 153);" border="0" cellpadding="0" cellspacing="0" width="100%" align="center"><tr><td class="dividerTdBlock"><span></span></td></tr></table>',
    "ImageCardBlockEditor": '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ImageCardTBlock"><tbody><tr><td class="ImageCardTdBlock" valign="top" style="padding-top:{{innerPadding}}px; padding-right:{{totalPadding}}px; padding-bottom:{{innerPadding}}px; padding-left:{{totalPadding}}px;">{{blockHtml|safe}}</td></tr></tbody></table>',
    "ImageCardBlockEditorContent": '<table class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="imageTBlock" data-tbmc-id="{{image.tbindex}}"><tr><td class="imageTdBlock" valign="top" style="padding: 0px;"><table style="width:100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png"  style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table><!--[if (mso)|(IE)]></td><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock" width="100%" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock" valign="top" style="padding-top:7px; padding-right: 0px; padding-bottom: 7px; padding-left: 0px;">{{textdetail}}</td></tr></tbody></table></td></tr></tbody></table>',
    "ImageCardBlockEditor2Content": '<table class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock" width="100%" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock" valign="top" style="padding-top:7px; padding-right: 0px; padding-bottom: 7px; padding-left: 0px;">{{textdetail}}</td></tr></tbody></table><!--[if (mso)|(IE)]></td><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><![endif]--><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="imageTBlock" data-tbmc-id="{{image.tbindex}}"><tr><td class="imageTdBlock" valign="top" style="padding: 0px;"><table style="width:100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table></td></tr></tbody></table>',
    "2Image2CardBlockEditorContent": '<table style="{{stylecont}}" data-clo-num="{{clonum}}" class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" {{blockwidth}}><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="imageTBlock" data-tbmc-id="{{image.tbindex}}"><tr><td class="imageTdBlock" valign="top" style="padding: 5px;"><table style="width:100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table><table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock" {{textwidth}}><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock" valign="top" style="{{textstylecont}}padding-top:0px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px;" width="100%">{{textdetail}}</td></tr></tbody></table></td></tr></tbody></table>',
    "2Image1CardBlockEditorContent": '<table style="{{stylecont}}" data-clo-num="{{clonum}}" class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" {{blockwidth}}><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><table align="left" border="0" cellpadding="0" cellspacing="0" class="imageTBlock" width="100%" data-tbmc-id="{{image.tbindex}}"><tr><td class="imageTdBlock" align="left" valign="top" style=""><table style="width: 100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget" style="outline: none;"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table><!--textcontent--></td></tr></tbody></table>',
    "multiImageCardBlockEditorContent": '<table class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="" align="left" valign="top"><table align="left" border="0" cellpadding="0" cellspacing="0" class="ImagelistContentTBlock" width="100%"><tr><td class="ImagelistContentTdBlock" style="padding-top: 0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><!--imglist--></td></tr></table><!--[if (mso)|(IE)]></td><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock" width="100%" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock" valign="top" style="padding-top:7px; padding-right: 18px; padding-bottom: 7px; padding-left: 18px;">{{textdetail}}</td></tr></tbody></table></td></tr></tbody></table>',
    "multiImageCardBlockEditor2Content": '<table class="ImageCardAndCaptionTBlock" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="" align="left" valign="top"><table align="left" border="0" cellpadding="0" cellspacing="0" class="textTBlock" width="100%" select-split-option="{{split-clonum}}" data-table-columns="{{clonum}}"><tbody><tr><td {{id}} contenteditable="true" class="textTdBlock" valign="top" style="padding-top:7px; padding-right: 18px; padding-bottom: 7px; padding-left: 18px;">{{textdetail}}</td></tr></tbody></table><!--[if (mso)|(IE)]></td><td class="ImageCardAndCaptionTdBlock" data-cardposi="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><![endif]--><table align="left" border="0" cellpadding="0" cellspacing="0" class="ImagelistContentTBlock" width="100%"><tr><td class="ImagelistContentTdBlock" style="padding-top: 0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;" align="left" valign="top"><!--imglist--></td></tr></table></td></tr></tbody></table>',
    "multiImageCardAddNewContent": '<table align="left" border="0" cellpadding="0" cellspacing="0" class="imageTBlock" width="100%" data-tbmc-id="{{image.tbindex}}"><tr><td class="imageTdBlock" align="left" valign="top" style="{{twoingpadd}}"><table style="width: 100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget" style="outline: none;"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table>',
    "imageBlockEditor": '<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="imageTBlock ##imageGroupTBlock##"><tr><td class="imageTdBlock ##imageGroupTdBlock##" valign="top" style="padding: 5px;"><table style="width:100%;" data-mc-id="{{image.index}}" class="mcpreview-image-uploader"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table>',
    "imageGroupBlockEditor": '<!-- image_group_item -->',
    "templates/editorContainer/image_group/addnewcontent":'<table align="left" data-tbmc-id="{{image.tbindex}}" width="{{image.columnWidth}}" border="0" cellpadding="0" cellspacing="0" class="imageGroupTBlock" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><tr><td class="imageGroupTdBlock" valign="top" style="padding: 5px;"><table width="{{image.calculatedWidth}}" class="mcpreview-image-uploader" data-mc-id="{{image.index}}"><tr id="preview_ImageUploader_~COUNT~" class="mojoImageUploader blockDropTarget"><td><div class="imagePlaceholder"><img class="mojoImageItemIcon" src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Drop an image here</span><br>or</div><div><input data-dojo-attach-point="browseBtn" class="button-small p3" value="browse" type="button"></div></div></td></tr></table></td></tr></table>',
    "videoBlockEditor": '<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="videoTBlock ##imageGroupTBlock##" data-mc-id="0"><tr class="mojoImageUploader"><td class="videoTdBlock ##imageGroupTdBlock##" valign="top"><div class="imagePlaceholder"><img src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div><span>Add Video</span></div></div></td></tr></table>',
    "genericlinkBlockEditor": '<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="genericlinkTBlock" data-mc-id="0"><tr><td class="genericlinkTdBlock" valign="top" style="padding: 5px;text-align: center;">{{blockHtml|safe}}</td></tr></table>',
    "attachmentBlockEditor": '<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="attachmentTBlock" data-mc-id="0"><tr><td class="attachmentTdBlock" valign="top" style="padding: 5px; text-align: left;">{{blockHtml|safe}}</td></tr></table>',
    "socialFollowBlockEditor": '<table class="socialFollowTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" ><tr><td class="socialFollowTdBlock" valign="top" align="center" style="padding:5px;"><!--{% for item in items %}--><!--social_buttons--><!--{% endfor %} --></td></tr></table>',
    "codeTextEditor": '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="textTBlock" data-table-columns="1"><tbody><tr><td {{id}} contenteditable="true" valign="top" class="textTdBlock">{{html|safe}}</td></tr></tbody></table>',
    "DeleteDialog": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading">Are you sure?</span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button" tabindex="0"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">x</span></span></div><div style="width: auto; height: auto;" data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><p>You\u2019re about to delete a content block. Are you sure you want to do that?<br><span class="small-meta">Hint: Hold the "alt" key while clicking the delete button to skip this dialog.</span></p><div class="above-below15 below0 buttonsContainer"><a href="javascript:void(0);" class="button p0">Delete</a><a href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">Cancel</a></div></div></div>',
    "socialFollowButtonBlockEditor":'<table class="socialFollowItemTBlock" style="position: relative;" border="0" cellpadding="0" cellspacing="0" data-share-rolefor="{{forward.role}}"><tbody><tr class="displayIcon"><td class="followIconTdBlock" style="padding-right:5px;" align="center" valign="top"><a href="{{forward.href}}" target="_blank"><img src="'+SITEURL+'/img/icons/{{forward.imgurl96}}" alt="{{forward.title}}" class="followIconImgBlock" style="width:30px; max-width:30px; display:block;" width="30"></a></td></tr><tr class="displayText"><td class="followTextTdBlock" style="padding-right:5px;" align="center" valign="top"><a href="{{forward.href}}" target="_blank" style="color: #606060;font-family: Arial;font-size: 11px;font-weight: normal;line-height: 100%;text-align: center;text-decoration: none;">{{forward.title}}</a></td></tr></tbody></table><!--social_buttons-->',
    "templates/editorContainer/images/action1":'<li><a data-action-type="browse" href="javascript:void(0);">Browse</a></li>',
    "templates/editorContainer/images/imagecontent":'<a class="imglink" style="width: 100%" target="_blank"><img id="dndimg_{{id}}" alt="" src="{{drag.img.url}}" style="padding-bottom: 0; display: inline !important; vertical-align: bottom; background-color: transparent;margin:0px; width: inherit;" class="mcnImage blockDropTarget fullmcnImage" align="left" width="{{drag.img.width}}" data-mc-id="{{drag.img.mcid}}"></a>',
    "oitpdBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div style="padding-top: 5px;">Title</div><div style="padding-bottom: 5px;">$xx.xx</div><div><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /></div></div></td></tr></table>',
    "titpdBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div><div align="left" style="padding-bottom: 5px;">$xx.xx</div><div><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /></div></div></td></tr></table><table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="1" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div><div align="left" style="padding-bottom: 5px;">$xx.xx</div><div><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /><hr style="background-color: #3b589c;height: 3px;margin-bottom: 5px;" /></div></div></td></tr></table>',
    "oitpBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div style="padding-top: 5px;">Title</div><div style="padding-bottom: 5px;">$xx.xx</div></div></td></tr></table>',
    "titpBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}}><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div><div align="left" style="padding-bottom: 5px;">$xx.xx</div></div></td></tr></table><table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="1" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div><div align="left" style="padding-bottom: 5px;">$xx.xx</div></div></td></tr></table>',
    "oitBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div style="padding-top: 5px;">Title</div></div></td></tr></table>',
    "titBlockEditor": '<table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="0" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div></div></td></tr></table><table class="ecomTBlock" width="100%" cellspacing="0" cellpadding="0" border="0" data-mc-id="1" align="left"><tr><td class="ecomTdBlock" valign="top" align="center" style="padding:5px;" {{id}} ><div class="blankecom"><div style="background-color: #e7ebf3;padding: 20px 0px;">{{image}}</div><div align="left" style="padding-top: 5px;">Title</div></div></td></tr></table>',
    "blankformBlockEditor": '<div class="row row-bg" style="margin:10px;padding: 10px;"><div class="col-12 text-right top-control" ><p class="d-inline-block mb-0"><label class="switch ansrequired" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Required</p>&nbsp;&nbsp;<i class="far fa-list showhidelist text-black" style="padding:5px;"></i><i class="far fa-clone" style="padding:5px;"></i><i class="far fa-trash-alt" style="padding:5px;"></i></div>{{formControl}}<div class="col-12 bottom-control text-left" style="display: flex;"></div></div>',
    "questionBlockEditor": '<div class="col-12 blockquestion text-left d-flex align-items-center"><span class="counter text-center" style="width:5%; display:inline-block;">{{counter}}</span><input type="text" {{id}} {{name}} placeholder="Enter your question" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:100%; display:inline-block;" onkeyup="this.setAttribute(`value`, this.value)"/><div style="display:inline-block; margin-left: 10px;"><div class="ai-main" data-toggle="tooltip" title="Rewrite Question with AI"><img src="'+SITEURL+'/img/ai-logo-dark.svg" alt="AI" style="height: 32px;" /></div></div></div>',
    "answerBlockEditor": '{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><div class="blockoption" style="width:95%; display:inline-block;">{{answer}}</div></div>',
    "blankImageBlockEditor": '<div class="mojoImageUploader h-100 w-100 d-flex align-items-center justify-content-center" style="padding:0;outline:0;" unique-id="{{uniqueId}}"><div class="w-100"><div class="imagePlaceholder"><img src="'+SITEURL+'/img/browse_image.png" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Browse Image</span></div></div></div></div>',
    "landingPage": '<div id="templateBody{{i}}" item-value="0" item-transition="fade" class="templateBody d-flex"><div class="landingBlock w-100"><div class="containerEmptyMessage text-center">Drop Content Blocks Here</div></div></div>',
    "headerlayout1":'<div class="row w-100 text-left mx-0" style="padding:10px"><div class="col-12 px-0" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div><div id="headerdtitle" class="col-12 px-0 headerTitle ckeditable w-min-content pt-1" contenteditable="true">Enter Title Here</div><div id="headerddesc" class="col-12 px-0 ckeditable w-min-content pt-1" contenteditable="true">Enter Tagline Here</div></div>',
    "headerlayout2":'<div class="row w-100 text-left mx-0" style="padding:10px"><div id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div><div id="headerdtitle" class="pl-2 headerTitle d-flex align-items-center ckeditable" contenteditable="true">Enter Title Here</div><div id="headerddesc" class="col-12 px-0 ckeditable w-min-content pt-1" contenteditable="true">Enter Tagline Here</div></div>',
    "headerlayout3":'<div class="row w-100 mx-0" style="padding:10px"><div class="col-12 px-0 text-center" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div><div id="headerdtitle" class="col-12 px-0 headerTitle ckeditable w-min-content text-center pt-1" contenteditable="true">Enter Title Here</div><div id="headerddesc" class="col-12 px-0 ckeditable w-min-content text-center pt-1" contenteditable="true">Enter Tagline Here</div></div>',
    "headerlayout4":'<div class="row w-100 mx-0" style="padding:10px"><div class="col-12 px-0 text-left" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div></div>',
    "headerlayout5":'<div class="row w-100 mx-0" style="padding:10px"><div class="col-12 px-0 text-center" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div></div>',
    "headerlayout6":'<div class="row w-100 mx-0" style="padding:10px"><div class="col-12 px-0 text-right" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/></div></div>',
    "headerlayout7":'<div class="row w-100 mx-0" style="padding:10px"><div class="col-12 px-0 text-center headerdimg" id="headerdimg"><img src="'+SITEURL+'/img/browse_image_text.png"/><p class="mb-0 mt-2">Recommend Image Size 1024 x 300</p></div></div>',
    "footerlayout1":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-12 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div></div>',
    "footerlayout2":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-6 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc2" class="col-6 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div></div>',
    "footerlayout3":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-4 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc2" class="col-4 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc3" class="col-4 px-0 ckeditable w-min-content text-center" contenteditable="true">Enter Footer Content Here</div></div>',
    "footerlayout4":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-12 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div class="col-12 px-0 footerSocial"><!--social_buttons--></div></div>',
    "footerlayout5":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-6 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc2" class="col-6 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div class="col-12 px-0 footerSocial"><!--social_buttons--></div></div>',
    "footerlayout6":'<div class="row w-100" style="padding:10px"><div id="footerddesc1" class="col-4 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc2" class="col-4 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div id="footerddesc3" class="col-4 ckeditable p-0 w-min-content text-center" contenteditable="true">Enter Footer Content Here</div><div class="col-12 px-0 footerSocial"><!--social_buttons--></div></div>',
    "DeletePageDialog": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading">Are you sure?</span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button" tabindex="0"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">x</span></span></div><div style="width: auto; height: auto;" data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><p>You\u2019re about to delete a selected page. Are you sure you want to do that?<br><span class="small-meta">Hint: Hold the "alt" key while clicking the delete button to skip this dialog.</span></p><div class="above-below15 below0 buttonsContainer"><a href="javascript:void(0);" class="button p0">Delete</a><a href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">Cancel</a></div></div></div>',
}

export const droparraysettingcommon = {
    "textSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Background Color&nbsp;&nbsp;</label><input type="text" id="textboxbgbox" value=""/></div><div class="form-group"><label>Border(in Pixel)</label><input value="1px" id="textborwid" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"><select id="textselectbortsty"><option value="none" class="optpreview border-style none">None</option><option value="solid" class="optpreview border-style solid">Solid</option><option value="dashed" class="optpreview border-style dashed">Dashed</option><option value="dotted" class="optpreview border-style dotted">Dotted</option><option value="double" class="optpreview border-style double">Double</option><option value="groove" class="optpreview border-style groove">Groove</option><option value="ridge" class="optpreview border-style ridge">Ridge</option><option value="inset" class="optpreview border-style inset">Inset</option><option value="outset" class="optpreview border-style outset">Outset</option></select><input type="text" id="textboxborderbox" value=""/></div><div class="form-group"><label>Padding(in Pixel) <div class="table-section-r" style="display: inline-block; padding-left: 10px;"><input id="textbtnete" name="textbtnete" type="checkbox"/><span class="lbl"></span><span style="padding-left: 5px;">Edge To Edge</span></div></label><div style="margin-bottom: 10px;"><div style="float: left;">Top <input value="" id="textpadtop" tabindex="3" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Bottom <input value="" id="textpadbottom" tabindex="4" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div><div><div style="float: left;">Left <input value="" id="textpadleft" tabindex="1" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Right <input value="" id="textpadright" tabindex="2" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div></div><div class="form-group"><label class="display-inline-block">Line Height(in Pixel)&nbsp;&nbsp;</label><input class="display-inline-block" value="" id="textlineheight" tabindex="1" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div>',
    "imageSettingBlockEditor":'<div class="form-group"><label>Width/Height</label><div class="display-inline-block">Image Size : <span id="imgactsize"></span></div><div id="imgdisdiv">Display Size : <span id="imgdissize"></span></div><div id="imgdis"><div class="display-inline-block">Width <input type="text" id="imgtxtwidth" autocomplete="off" /></div><div id="linkicondiv"><div class="separator"><i id="linkicon" class="fas fa-link" data-toggle="tooltip"></i></div></div><div class="display-inline-block">Height <input type="text" id="imgtxtheight" autocomplete="off" /></div><input id="imgbtnar" name="imgbtnar" type="checkbox" style="display:none;"/></div><!--<div style="margin-top: 10px; margin-bottom: 10px; width: 250px;"><strong>Notes : </strong>Please ensure your image width is not bigger than <span class="imgwidthdis"></span> pixels.</div>--></div><div class="form-group"><label class="display-inline-block">Align&nbsp;&nbsp;</label><input id="imgbtnleft" name="imgbtnposgrp" type="radio" value="left"/><span class="btnpopspn">Left</span> <input id="imgbtncenter" name="imgbtnposgrp" type="radio" value="center"/><span class="btnpopspn">Center</span> <input id="imgbtnright" name="imgbtnposgrp" type="radio" value="right"/><span class="btnpopspn">Right</span></div><div class="form-group"><label>Padding (in Pixel) <div class="table-section-r" style="display: inline-block; padding-left: 10px;"><input id="imgbtnete" name="imgbtnete" type="checkbox"/><span class="lbl"></span><span style="padding-left: 5px;">Edge To Edge</span></div></label><div style="margin-bottom: 10px;"><div style="float: left;">Top <input id="imgpadtop" tabindex="0" autocomplete="off" type="text"></div><div style="float: right;">Bottom <input id="imgpadbottom" tabindex="0" autocomplete="off" type="text"></div><div style="clear: both;"></div></div><div><div style="float: left;">Left <input id="imgpadleft" tabindex="0" autocomplete="off" type="text"></div><div style="float: right;">Right <input id="imgpadright" tabindex="0" autocomplete="off" type="text"></div><div style="clear: both;"></div></div></div><div class="form-group"><label class="display-inline-block">Background Color&nbsp;&nbsp;</label><input type="text" id="imagebackclrbox" value=""/></div><div class="form-group"><label class="display-inline-block">URL&nbsp;&nbsp;</label><select id="imageurlset" class="form-control display-inline-block"><option value="http://">http://</option><option value="https://">https://</option></select><input class="form-control" type="text" placeholder="URL" id="imageurl"></div>',
    "headerImageSettingBlockEditor":'<div class="form-group"><label>Width/Height</label><div class="display-inline-block">Image Size : <span id="imgactsize"></span></div><div id="imgdisdiv">Display Size : <span id="imgdissize"></span></div><div id="imgdis"><div class="display-inline-block">Width <input type="text" id="imgtxtwidth" autocomplete="off" /></div><div id="linkicondiv"><div class="separator"><i id="linkicon" class="fas fa-link" data-toggle="tooltip"></i></div></div><div class="display-inline-block">Height <input type="text" id="imgtxtheight" autocomplete="off" /></div><input id="imgbtnar" name="imgbtnar" type="checkbox" style="display:none;"/></div></div>',
    "dividerSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Height(in Pixel)&nbsp;&nbsp;</label><input class="display-inline-block" value="1px" id="dvdborwid" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div class="form-group"><label class="display-inline-block">Width(in Pixel)&nbsp;&nbsp;</label><input class="display-inline-block" value="1px" id="dvdborwidth" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div class="form-group"><label class="display-inline-block">Style&nbsp;&nbsp;</label><select class="display-inline-block" id="dvdselectbortsty"><option value="" class="optpreview border-style none">None</option><option value="solid" class="optpreview border-style solid">Solid</option><option value="dashed" class="optpreview border-style dashed">Dashed</option><option value="dotted" class="optpreview border-style dotted">Dotted</option><option value="double" class="optpreview border-style double">Double</option><option value="groove" class="optpreview border-style groove">Groove</option><option value="ridge" class="optpreview border-style ridge">Ridge</option><option value="inset" class="optpreview border-style inset">Inset</option><option value="outset" class="optpreview border-style outset">Outset</option></select></div><div class="form-group"><label class="display-inline-block">Color&nbsp;&nbsp;</label><input type="text" id="dvdboxborderbox" value="" /></div>',
    "videoSettingBlockEditor":'<div class="form-group"><label>Video URL</label><input class="form-control" placeholder="Video Url" id="videourl"></div><div class="form-group" style="width: 300px;">Your video preview image can be set up selecting an image below. Youtube and Vimeo automatically generate preview image from the link url.</div>',
    "socialSettingBlockEditor":'<div class="form-group"><label>URL</label><input class="form-control" placeholder="Social Url" id="socialurl" type="text"></div><div class="form-group"><label>Title</label><input class="form-control" placeholder="Title" id="socialtitle" type="text"></div><div class="form-group"><div id="socialstyleicon"></div></div>',
    "ecomSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Background Color&nbsp;&nbsp;</label><input type="text" id="ecomboxbgbox" value=""/></div><div class="form-group"><label>Border(in Pixel)</label><input value="1px" id="ecomborwid" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"><select id="ecomselectbortsty"><option value="none" class="optpreview border-style none">None</option><option value="solid" class="optpreview border-style solid">Solid</option><option value="dashed" class="optpreview border-style dashed">Dashed</option><option value="dotted" class="optpreview border-style dotted">Dotted</option><option value="double" class="optpreview border-style double">Double</option><option value="groove" class="optpreview border-style groove">Groove</option><option value="ridge" class="optpreview border-style ridge">Ridge</option><option value="inset" class="optpreview border-style inset">Inset</option><option value="outset" class="optpreview border-style outset">Outset</option></select><input type="text" id="ecomboxborderbox" value=""/></div><div class="form-group"><label>Padding(in Pixel) <div class="table-section-r" style="display: inline-block; padding-left: 20px;"><input id="ecombtnete" name="ecombtnete" type="checkbox"/><span class="lbl"></span><span style="padding-left: 5px;">Edge To Edge</span></div></label><div style="margin-bottom: 10px;"><div style="float: left;">Top <input value="" id="ecompadtop" tabindex="3" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Bottom <input value="" id="ecompadbottom" tabindex="4" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div><div><div style="float: left;">Left <input value="" id="ecompadleft" tabindex="1" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Right <input value="" id="ecompadright" tabindex="2" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div></div>',
    "buttonSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Button Type&nbsp;&nbsp;</label><select class="display-inline-block" id="dsmgenbtntype"><option value="genericlink">Generic Link</option><option value="survey">Survey Link</option><option value="assessment">Assessment Link</option><option value="customform">Custom Form Link</option></select></div><div id="dsmurllink"><div class="form-group"><label class="display-inline-block" style="vertical-align: top;">URL&nbsp;&nbsp;</label><select id="dsmgenurlset" class="form-control display-inline-block"><option value="http://">http://</option><option value="https://">https://</option></select><input class="form-control" type="text" placeholder="Url" id="dsmgenurl"></div></div><div class="form-group"><label>Title</label><input class="form-control" type="text" placeholder="Title" id="dsmgentitle"></div><div id="dsmgenbtndesignall"><div class="form-group"><label class="display-inline-block">Button Color&nbsp;&nbsp;</label><input type="text" id="dsmgenbackclrbox" value="#6c757d"/><label class="display-inline-block ml-5">Text Color&nbsp;&nbsp;</label><input type="text" id="dsmgentextclrbox" value="#6c757d"/></div><div class="form-group"><label class="display-inline-block">Width&nbsp;&nbsp;</label><div class="display-inline-block" id="dsmgenbtnsty"><input id="dsmgenbtndef" name="dsmgenbtngrp" type="radio" value="d"/><span>Default</span> <input id="dsmgenbtncus" name="dsmgenbtngrp" type="radio" value="c"/><span>Custom&nbsp;&nbsp;</span></div><div id="dsmgenbtnwthbox" style="display: none;"><input type="text" id="dsmgenbtnwth" class="form-control" value="300"/> px</div></div><div class="form-group"><label class="display-inline-block">Position&nbsp;&nbsp;</label><div class="display-inline-block" id="dsmgenbtnpos"><input id="dsmgenbtnleft" name="dsmgenbtnposgrp" type="radio" value="left"/><span>Left</span> <input id="dsmgenbtncenter" name="dsmgenbtnposgrp" type="radio" value="center"/><span>Center</span> <input id="dsmgenbtnright" name="dsmgenbtnposgrp" type="radio" value="right"/><span>Right</span></div></div><div class="form-group"><label class="display-inline-block">Style&nbsp;&nbsp;</label><div class="display-inline-block" id="dsmgenbtnstyle"><input id="dsmgenbtnsol" name="dsmgenbtnstygrp" type="radio" value="sol"/><span>Solid</span> <input id="dsmgenbtnout" name="dsmgenbtnstygrp" type="radio" value="out"/><span>Outline</span></div></div><div class="form-group"><hr/></div><div class="form-group"><label class="display-inline-block">Border</label></div><div class="form-group"><label class="display-inline-block">Style&nbsp;&nbsp;</label><select id="dsmgenbtnbrdsty"><option value="">None</option><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="double">Double</option><option value="groove">Groove</option><option value="ridge">Ridge</option><option value="inset">Inset</option><option value="outset">Outset</option></select><span style="float: right;"><label class="display-inline-block">Size&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnbrdsize" class="form-control" value=""/> px</span></div><div class="form-group"><label class="display-inline-block">Color&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnbrdclrbox" value="#6c757d"/><span style="float: right;"><label class="display-inline-block">Radius&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnbrdradius" class="form-control" value=""/> px</span></div><div class="form-group"><hr/></div><div class="form-group"><label class="display-inline-block">Padding</label></div><div class="form-group"><label class="display-inline-block">Top&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnpadtop" class="form-control" value=""/> px<span style="float: right;"><label class="display-inline-block">Bottom&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnpadbottom" class="form-control" value=""/> px</span></div><div class="form-group"><label class="display-inline-block">Left&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnpadleft" class="form-control" value=""/> px<span style="float: right;"><label class="display-inline-block">Right&nbsp;&nbsp;</label><input type="text" id="dsmgenbtnpadright" class="form-control" value=""/> px</span></div></div>',
    "attachmentSettingBlockEditor":'<div class="form-group mb-0"><label class="display-inline-block">Position&nbsp;&nbsp;</label><div class="display-inline-block" id="dsmattchpos"><input id="dsmattchleft" class="dsmattch" name="dsmattchposgrp" type="radio" value="left"/><span>Left</span> <input id="dsmattchcenter" class="dsmattch" name="dsmattchposgrp" type="radio" value="center"/><span>Center</span> <input id="dsmattchright" class="dsmattch" name="dsmattchposgrp" type="radio" value="right"/><span>Right</span></div></div>',
    "formPageSettingBlockEditor":'<div class="form-group"><label>Page Type</label><div class="pagelayoutmain"><div class="pagelayout pagelayout1 active"><div></div></div><div class="pagelayout pagelayout2"><div></div></div><div class="pagelayout pagelayout3"><div></div></div><div class="pagelayout pagelayout4"><div></div></div><div class="pagelayout pagelayout5"><div></div></div><div class="pagelayout pagelayout6"><div></div></div></div></div><div class="form-group"><label>Page Transition</label><select id="pageTransition" class="mb-0"><option value="fade">Fade In/Out</option><option value="slideLeft">Slide Right To Left</option><option value="slideRight">Slide Left To Right</option><option value="slideTop">Slide Bottom to Top</option><option value="slideBottom">Slide Top To Bottom</option><option value="rollIn">Roll In</option><option value="scaleHorizontal">Horizontal Stretch</option><option value="scaleVertical">Vertical Stretch</option><option value="flipLeft">Flip Left</option><option value="flipRight">Flip Right</option><option value="flipTop">Flip Top</option><option value="flipBottom">Flip Bottom</option><option value="carouselLeft">Carousel Left</option><option value="carouselRight">Carousel Right</option><option value="carouselTop">Carousel Top</option><option value="carouselBottom">Carousel Bottom</option><option value="glueLeft">Glue Left</option><option value="glueRight">Glue Right</option><option value="glueTop">Glue Top</option><option value="glueBottom">Glue Bottom</option><option value="newsPaper">News Paper</option></select></div><div class="form-group"><label>Footer Button Align</label><div id="ftrbtnalgn"><input id="ftrbtnleft" class="ftrbtn" name="ftrbtnalgngrp" type="radio" value="text-left"/><span>Left</span> <input id="ftrbtncenter" class="ftrbtn" name="ftrbtnalgngrp" type="radio" value="text-center"/><span>Center</span> <input id="ftrbtnright" class="ftrbtn" name="ftrbtnalgngrp" type="radio" value="text-right"/><span>Right</span></div></div>',
}

export const drop_link= {
    "text":"singleTextEditor",
    "boxed_text":"singleTextBlockEditor",
    "boxed_text20":"singleTextBlockEditor",
    "boxed_text21":"singleTextBlockEditor",
    "boxed_text22":"singleTextBlockEditor",
    "divider":"dividerBlockEditor",
    "image":"imageBlockEditor",
    "logoicon":"imageBlockEditor",
    "image_group_2h":"imageGroupBlockEditor",
    "image_group_2s":"imageGroupBlockEditor",
    "image_group_3h":"imageGroupBlockEditor",
    "image_group_3s":"imageGroupBlockEditor",
    "image_group":"imageGroupBlockEditor",
    "image_card":"ImageCardBlockEditor",
    "image_+_caption11":"ImageCardBlockEditor",
    "image_+_caption12":"ImageCardBlockEditor",
    "image_+_caption":"ImageCardBlockEditor",
    "image_+_caption21":"ImageCardBlockEditor",
    "image_+_caption22":"ImageCardBlockEditor",
    "image_+_caption31":"ImageCardBlockEditor",
    "image_+_caption32":"ImageCardBlockEditor",
    "image_+_caption12_+_h":"ImageCardBlockEditor",
    "image_+_caption_+_h":"ImageCardBlockEditor",
    "image_+_caption21_+_h":"ImageCardBlockEditor",
    "image_+_caption22_+_h":"ImageCardBlockEditor",
    "image_+_caption31_+_h":"ImageCardBlockEditor",
    "image_+_caption32_+_h":"ImageCardBlockEditor",
    "2image_+_2caption":"ImageCardBlockEditor",
    "3image_+_3caption":"ImageCardBlockEditor",
    "2image_+_1caption1":"ImageCardBlockEditor",
    "2image_+_1caption2":"ImageCardBlockEditor",
    "facebook":"socialFollowBlockEditor",
    "tweet":"socialFollowBlockEditor",
    "linkedin":"socialFollowBlockEditor",
    "youtube":"socialFollowBlockEditor",
    "tumblr":"socialFollowBlockEditor",
    "instagram":"socialFollowBlockEditor",
    "soundcloud":"socialFollowBlockEditor",
    "pinterest":"socialFollowBlockEditor",
    "website":"socialFollowBlockEditor",
    "emails":"socialFollowBlockEditor",
    "phones":"socialFollowBlockEditor",
    "footer":"singleTextEditor",
    "code":"codeTextEditor",
    "video":"videoBlockEditor",
    "genericlink":"genericlinkBlockEditor",
    "attachment":"attachmentBlockEditor",
    "soitpd":"oitpdBlockEditor",
    "stitpd":"titpdBlockEditor",
    "soitp":"oitpBlockEditor",
    "stitp":"titpBlockEditor",
    "soit":"oitBlockEditor",
    "stit":"titBlockEditor",
    "moitpd":"oitpdBlockEditor",
    "mtitpd":"titpdBlockEditor",
    "moitp":"oitpBlockEditor",
    "mtitp":"titpBlockEditor",
    "moit":"oitBlockEditor",
    "mtit":"titBlockEditor",
    "boitpd":"oitpdBlockEditor",
    "btitpd":"titpdBlockEditor",
    "boitp":"oitpBlockEditor",
    "btitp":"titpBlockEditor",
    "boit":"oitBlockEditor",
    "btit":"titBlockEditor",
    "open_ended":"openendedBlockEditor",
    "single_answer":"answerBlockEditor",
    "single_answer_checkbox":"answerBlockEditor",
    "single_answer_button":"answerBlockEditor",
    "single_answer_combo":"answerBlockEditor",
    "email":"emailBlockEditor",
    "phone":"phoneBlockEditor",
    "matrix":"matrixBlockEditor",
    "contact_form": "contactFormBlockEditor",
    "date_control": "dateBlockEditor",
    "time_control": "timeBlockEditor",
    "image_form": "imageFBlockEditor",
    "image_with_text_form": "imageWithTextBlockEditor",
    "rating_box": "ratingBoxBlockEditor",
    "rating_symbol": "ratingBoxSymbolEditor",
    "rating_radio": "ratingRadioBlockEditor",
    "yes_no": "yesNoBlockEditor",
    "consent_agreement":"consentAgreementBlockEditor",
    "sms_consent_agreement":"consentAgreementBlockEditor",
    "rank":"rankBlcokEditor",
    "constant_sum": "constantSumBlockEditor",
    "gender":"answerBlockEditor",
    "age": "openendedBlockEditor",
    "marital_status":"answerBlockEditor",
    "education":"answerBlockEditor",
    "employment_status":"answerBlockEditor",
    "employer_type": "answerBlockEditor",
    "housing": "answerBlockEditor",
    "household_income": "answerBlockEditor",
    "race": "answerBlockEditor",
    "label": "labelBlockEditor",
    "captcha": "captchaBlockEditor",
    "signature": "signatureBlockEditor"
}

export function loadeverytimecommon(){
    $('#bodyTable').before( "<!--RT3S-->" );
    $('#templateContainer').before( "<!--RT3E-->" );
    $('#templateContainer').after( "<!--RT3S-->" );
    $('#templateContainer').css( {width:"100%",maxWidth:"100%"} );
    $('#bodyTable').after( "<!--RT3E-->" );

    $(".editormenuitem div.em").unbind("click").click(function () {
        $(".cke").hide();
        hidedsm();
        if ($(this).parent(".editormenuitem").hasClass("active") === true) {
            $(this).parent(".editormenuitem").removeClass("active");
        } else {
            $(".editormenuitem").removeClass("active");
            $(".subitem").removeClass("active");
            $(this).parent(".editormenuitem").addClass("active");
        }
    });
    $(".subitem .subitemtext").unbind("click").click(function(){
        if($(this).parent(".subitem").hasClass("active")===true) {
            $(this).parent(".subitem").removeClass("active");
        } else {
            $(".subitem").removeClass("active");
            $(this).parent(".subitem").addClass("active");
            return false;
        }
    });
    $('.esmhtml .esmdata').slimScroll({height:'90%' ,color:'#ffffff',distance : '10px',alwaysVisible:true,railColor:'#535353',railVisible : true,opacity:1,railOpacity:1});
    $('.esmecom .esmdata .subitem .subsubitem .subsubitemcon').slimScroll({height:'90%' ,color:'#ffffff',distance : '0px',alwaysVisible:true,railColor:'#535353',railVisible : true,opacity:1,railOpacity:1});
    $('#preview-template').slimScroll({height:'100%' ,color:'#535353',distance : '0px',alwaysVisible:true,railColor:'#ffffff',railVisible : true,opacity:1,railOpacity:0,size:"10px"});
    $("#draggable-menu").draggable();
    $("#droppable-menu-3").droppable({
        drop: function (event, ui) {
            if($(this).attr('id')==="droppable-menu-3" && ui.draggable.attr("id")==="draggable-menu") {
                $(this).append(ui.draggable);
                ui.draggable.removeAttr("style");
                ui.draggable.css({"position":"relative"});
            }
        }
    });
    $("#droppable-menu-2").droppable({
        drop: function (event, ui) {
            if($(this).attr('id')==="droppable-menu-2" && ui.draggable.attr("id")==="draggable-menu") {
                $(this).append(ui.draggable);
                ui.draggable.removeAttr("style");
                ui.draggable.css({"position":"relative"});
            }
        }
    });

    /* CONTENT BLOCKS */
    $("#blocks-container li").draggable({
        helper: "clone",
        appendTo: "body",
        containment: "document",
        cursor: "grabbing",
        iframeFix: true,
        start: function() {
            $("#preview-template").contents().find("#templateContainer").addClass("templateContainer");
            $(".editormenuitem").removeClass("active");
        },
        stop: function() {
            $("#preview-template").contents().find("#templateContainer").removeClass("templateContainer");
        }
    });
    /* CONTENT BLOCKS */

    /* SOCIAL MEDIA */
    $(".esmsocial .esmdata img").draggable({
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
    /* SOCIAL MEDIA */
}
export function loadeverytimecommonformtype(){
    /* DEFAULT SETTINGS */
    /* Page Background */
    let pdconbaccol=$('#preview-template').contents().find('#cntr').css('background-color');
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
            setPageBackgroundSettingCommon();
        },
        chooseText: "Select",
        palette: []
    });
    if(typeof $('#preview-template').contents().find('#cntr').attr("item-path")!=="undefined") {
        let itempath=$('#preview-template').contents().find('#cntr').attr("item-path");
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
            $('#preview-template').contents().find('#cntr').removeAttr("item-path");
            $('#preview-template').contents().find('#cntr').css('background-image','');
            $('#preview-template').contents().find('#cntr').attr("item-value","0");
            $("#pdconbrightness span.ui-slider-handle").css("left","0%");
            $("#pdcongrid .grid").removeClass("active");
            $('#pdcongrid .grid[item-value="stretch"]').addClass("active");
            $("#pdconposition .pos").removeClass("active");
            $("#pdconposition .pos[item-value='0% 0%']").addClass("active");
            $("#pdconblend").val('normal');
            setPageBackgroundSettingCommon();
        });
    }
    if($('#preview-template').contents().find('#cntr').css('background-size')==="cover" || $('#preview-template').contents().find('#cntr').css('background-size')==="auto") {
        $('#pdcongrid .grid[item-value="stretch"]').addClass("active");
    } else {
        $('#pdcongrid .grid[item-value="'+$('#preview-template').contents().find('#cntr').css('background-repeat')+'"]').addClass("active");
    }
    $("#pdcongrid .grid").unbind("click").click(function(){
        $("#pdcongrid .grid").removeClass("active");
        $(this).addClass("active");
        setPageBackgroundSettingCommon();
    });
    let pdconbrightnessvalue=$('#preview-template').contents().find('#cntr').attr("item-value");
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
            $('#preview-template').contents().find('#cntr').attr("item-value",value);
            setPageBackgroundSettingCommon();
        }
    }).find(".ui-slider-handle").append(tooltippdconbrightness).hover(function() {
        tooltippdconbrightness.show()
    }, function() {
        tooltippdconbrightness.hide()
    });
    $("#pdconposition .pos[item-value='"+$('#preview-template').contents().find('#cntr').css('background-position')+"']").addClass("active");
    $("#pdconposition .pos").unbind("click").click(function(){
        $("#pdconposition .pos").removeClass("active");
        $(this).addClass("active");
        setPageBackgroundSettingCommon();
    });
    $("#pdconblend").val($('#preview-template').contents().find('#cntr').css('background-blend-mode'));
    $("#pdconblend").unbind("change").change(function(){
        setPageBackgroundSettingCommon();
    });
    /* Page Background */

    /* Text Settings */
    let texffamily=$('#preview-template').contents().find('#cntr').css('fontFamily');
    texffamily=replaccon('"',"",texffamily);
    $("#pdselectfamily").unbind("change").change(function(){
        $('#preview-template').contents().find('#cntr').css('font-family',$(this).val());
    });
    if(texffamily!==""){
        $("#pdselectfamily").val(texffamily).trigger("change");
    }
    let texfsize=$('#preview-template').contents().find('#stgHid').css('fontSize');
    if(!texfsize || parseInt(texfsize.replace("px", ""))<=0){texfsize=14+"px";}
    $("#pdselectfontsize").unbind("change").change(function(){
        $('#preview-template').contents().find('#stgHid').css('font-size',$(this).val());
        let temp = parseInt($(this)?.val()?.replace("px", ""));
        $('#preview-template').contents().find('#stgHid').css('line-height',temp+'px');
        $("#pdtextlineheight").val(temp);
    }).val(texfsize).trigger("change");
    let texlineheight=$('#preview-template').contents().find('#stgHid').css('line-height');
    $("#pdtextlineheight").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('line-height',$(this).val()+'px');
    }).val((texlineheight===undefined)?0:texlineheight.replace("px", "")).trigger("keyup");
    if($('#preview-template').contents().find('#stgHid').css('font-weight') === 'bold' || parseInt($('#preview-template').contents().find('#stgHid').css('font-weight')) >= 700) {
        $("#pgstlbold .pagestyle").addClass("active");
    } else {
        $("#pgstlbold .pagestyle").removeClass("active");
    }
    $("#pgstlbold").unbind("click").click(function(){
        if($("#pgstlbold .pagestyle").hasClass("active")===true) {
            $("#pgstlbold .pagestyle").removeClass("active");
            $('#preview-template').contents().find('#stgHid').css('font-weight','normal');
        } else {
            $("#pgstlbold .pagestyle").addClass("active");
            $('#preview-template').contents().find('#stgHid').css('font-weight','bold');
        }
    });
    if($('#preview-template').contents().find('#stgHid').css('font-style') === 'italic') {
        $("#pgstlitalic .pagestyle").addClass("active");
    } else {
        $("#pgstlitalic .pagestyle").removeClass("active");
    }
    $("#pgstlitalic").unbind("click").click(function(){
        if($("#pgstlitalic .pagestyle").hasClass("active")===true) {
            $("#pgstlitalic .pagestyle").removeClass("active");
            $('#preview-template').contents().find('#stgHid').css('font-style','normal');
        } else {
            $("#pgstlitalic .pagestyle").addClass("active");
            $('#preview-template').contents().find('#stgHid').css('font-style','italic');
        }
    });
    if($('#preview-template').contents().find('#stgHid').css('text-decoration') === 'underline') {
        $("#pgstlunderline .pagestyle").addClass("active");
    } else {
        $("#pgstlunderline .pagestyle").removeClass("active");
    }
    $("#pgstlunderline").unbind("click").click(function(){
        if($("#pgstlunderline .pagestyle").hasClass("active")===true) {
            $("#pgstlunderline .pagestyle").removeClass("active");
            $('#preview-template').contents().find('#stgHid').css('text-decoration','none');
        } else {
            $("#pgstlunderline .pagestyle").addClass("active");
            $('#preview-template').contents().find('#stgHid').css('text-decoration','underline');
        }
    });
    let texcolobx=rgb2hex($('#preview-template').contents().find('#stgHid').css('color'));
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
                $('#preview-template').contents().find('#stgHid').css('color','transparent');
            } else {
                $('#preview-template').contents().find('#stgHid').css('color',color.toHexString());
            }
        },
        chooseText: "Select",
        palette: []
    });
    /* Text Settings */

    /* Border */
    let texbortsty=$('#preview-template').contents().find('#cntr').css('border-top-style') === "none" ? "" : $('#preview-template').contents().find('#cntr').css('border-top-style');
    let texborwidth=($('#preview-template').contents().find('#cntr').outerWidth() - $('#preview-template').contents().find('#cntr').innerWidth())/2;
    let texborcol=rgb2hex($('#preview-template').contents().find('#cntr').css('border-left-color'));
    $('#preview-template').contents().find('#cntr').css('border-style',texbortsty);
    $("#pdconselectbortsty").unbind("change").change(function(){
        $('#preview-template').contents().find('#cntr').css('border-style',$(this).val());
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
        $('#preview-template').contents().find('#cntr').css('border-width',t+"px");
    }).val(texborwidth).keyup();
    $("#pdconborwid").unbind("blur").blur(function(){
        if($(this).val()==="px" || $(this).val()==="" || $(this).val()==="0"){
            $(this).val("0");
            $("#pdconselectbortsty").val("");
            $("#pdconselectbortsty").trigger("change");
        }
    });
    $('#preview-template').contents().find('#cntr').css('border-color',texborcol);
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
                $('#preview-template').contents().find('#cntr').css('border-color','transparent');
            } else {
                $('#preview-template').contents().find('#cntr').css('border-color',color.toHexString());
            }
        },
        chooseText: "Select",
        palette: []
    });
    /* Border */

    /* Margin */
    let texlmrgtop=$('#preview-template').contents().find('#stgHid').css('marginTop');
    let texlmrgbottom=$('#preview-template').contents().find('#stgHid').css('marginBottom');
    let texlmrgleft=$('#preview-template').contents().find('#stgHid').css('marginLeft');
    let texlmrgright=$('#preview-template').contents().find('#stgHid').css('marginRight');
    $("#boxmrgtop").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('margin-top',$(this).val()+'px');
    }).val((texlmrgtop===undefined)?0:texlmrgtop.replace("px", ""));
    $("#boxmrgbottom").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('margin-bottom',$(this).val()+'px');
    }).val((texlmrgbottom===undefined)?0:texlmrgbottom.replace("px", ""));
    $("#boxmrgleft").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('margin-left',$(this).val()+'px');
    }).val((texlmrgleft===undefined)?0:texlmrgleft.replace("px", ""));
    $("#boxmrgright").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('margin-right',$(this).val()+'px');
    }).val((texlmrgright===undefined)?0:texlmrgright.replace("px", ""));
    /* Margin */

    /* Padding */
    let texlpadtop=$('#preview-template').contents().find('#stgHid').css('paddingTop');
    let texlpadbottom=$('#preview-template').contents().find('#stgHid').css('paddingBottom');
    let texlpadleft=$('#preview-template').contents().find('#stgHid').css('paddingLeft');
    let texlpadright=$('#preview-template').contents().find('#stgHid').css('paddingRight');
    $("#boxpadtop").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('padding-top',$(this).val()+'px');
    }).val((texlpadtop===undefined)?0:texlpadtop.replace("px", ""));
    $("#boxpadbottom").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('padding-bottom',$(this).val()+'px');
    }).val((texlpadbottom===undefined)?0:texlpadbottom.replace("px", ""));
    $("#boxpadleft").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('padding-left',$(this).val()+'px');
    }).val((texlpadleft===undefined)?0:texlpadleft.replace("px", ""));
    $("#boxpadright").unbind("keyup").keyup(function(){
        $('#preview-template').contents().find('#stgHid').css('padding-right',$(this).val()+'px');
    }).val((texlpadright===undefined)?0:texlpadright.replace("px", ""));
    /* Padding */
    /* DEFAULT SETTINGS */

    /* CONTENT FORM BLOCKS */
    $("#blocks-container-form li, #blocks-container-form-demographics li").draggable({
        helper: "clone",
        appendTo: "body",
        containment: "document",
        cursor: "grabbing",
        iframeFix: true,
        start: function() {
            $("#preview-template").contents().find("#templateContainer").addClass("templateContainer");
            $(".editormenuitem").removeClass("active");
        },
        stop: function() {
            $("#preview-template").contents().find("#templateContainer").removeClass("templateContainer");
        }
    });
    $("#blocks-container-header li").draggable({
        helper: "clone",
        appendTo: "body",
        containment: "document",
        cursor: "grabbing",
        iframeFix: true,
        start: function() {
            $("#preview-template").contents().find("#templateContainer").addClass("templateContainer");
            $(".editormenuitem").removeClass("active");
        },
        stop: function() {
            $("#preview-template").contents().find("#templateContainer").removeClass("templateContainer");
        }
    });
    $("#blocks-container-footer li").draggable({
        helper: "clone",
        appendTo: "body",
        containment: "document",
        cursor: "grabbing",
        iframeFix: true,
        start: function() {
            $("#preview-template").contents().find("#templateContainer").addClass("templateContainer");
            $(".editormenuitem").removeClass("active");
        },
        stop: function() {
            $("#preview-template").contents().find("#templateContainer").removeClass("templateContainer");
        }
    });
    /* CONTENT FORM BLOCKS */

    /* DSM Events */
    $("#draggable-setting-menu").draggable({ containment: "parent", scroll: false }).resizable({ containment: "parent" });
    $("#draggable-category-list").draggable({ containment: "parent", scroll: false }).resizable({ containment: "parent" });
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
    /* DSM Events */

    /* Form */
    $(".addpage").unbind("click").click(function (){
        $(".pageTypeMain").fadeToggle();
    });
    $(".showhidelist").unbind("click").click(function (e){
        e.stopPropagation();
        $("#draggable-category-list").fadeToggle();
    });
    /* Form */
}
function setPageBackgroundSettingCommon(){
	let op=parseFloat(Math.abs($('#preview-template').contents().find('#cntr').attr("item-value"))/100);
	if($("#pdconboxbackbox").val() !== "") {
		$('#preview-template').contents().find('#cntr').css('background-color',hexToRGB($("#pdconboxbackbox").val(), op));
	} else {
		$('#preview-template').contents().find('#cntr').css('background-color','rgba(255, 255, 255, '+op+')');
	}
	if($("#pdcongrid .grid.active").attr("item-value")==="stretch") {
		$('#preview-template').contents().find('#cntr').css('background-size','cover');
		$('#preview-template').contents().find('#cntr').css('background-repeat','unset');
	} else {
		$('#preview-template').contents().find('#cntr').css('background-size','contain');
		$('#preview-template').contents().find('#cntr').css('background-repeat',$("#pdcongrid .grid.active").attr("item-value"));
	}
	$('#preview-template').contents().find('#cntr').css('background-position',$("#pdconposition .pos.active").attr("item-value"));
	$('#preview-template').contents().find('#cntr').css('background-blend-mode',$("#pdconblend").val());
}
export function replaccon(conten,contenval,str) {
    if(typeof str !== typeof undefined && str !== false && str.includes(conten)){
        let innerPadding=str.match(new RegExp(conten, "g")).length
        for(let i=0;i<innerPadding;i++) {
            str=str.replace(conten,contenval);
        }
    }else{
        if(typeof str === typeof undefined && str === false){
            str="";
        }
    }
    return str;
}
export function rgb2hex(rgbaString) {
    const result = rgbaString.match(/\d+(\.\d+)?/g);
    const hex = result.map((num, index) => {
        if (index === 3) {
            const alphaHex = Math.round(parseFloat(num) * 255).toString(16);
            return alphaHex.length === 1 ? '0' + alphaHex : alphaHex;
        }
        const hexNum = parseInt(num).toString(16);
        return hexNum.length === 1 ? '0' + hexNum : hexNum;
    });
    if(hex.length > 3){
        return `#${hex.slice(0, 3).join('')}${hex[3]}`;
    } else {
        return `#${hex.slice(0, 3).join('')}`;
    }
}
export function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
export function unprotectSource( html ) {
    html = html.replace( /<!--{cke_protected}{C}([\s\S]+?)-->/g, function( match, data ) {
        return decodeURIComponent( data );
    });
    html = html.replace( /<!--{C}([\s\S]+?)-->/g, function( match, data ) {
        return decodeURIComponent( data );
    });
    html = html.replace( /&lt;!--{C}([\s\S]+?)--&gt;/g, function( match, data ) {
        return decodeURIComponent( data );
    });
    return html.replace( /&lt;!--{cke_protected}{C}([\s\S]+?)--&gt;/g, function( match, data ) {
        return decodeURIComponent( data );
    });
}
export function getCategoryListBox(type){
    let t = '';
    t+='<div class="d-flex justify-content-between">';
    t+='<div class="lfCatColorBox"></div>';
    t+='<div class="catCatNo"><strong>#</strong></div>';
    t+='<div class="d-flex lfCatName"><strong>Category</strong></div>';
    if(type === "assessment") {
        t += '<div class="d-flex justify-content-center catCatTotal"><strong>Max PTs</strong></div>';
    }
    t+='<div class="catCatTotal"></div>';
    t+='</div>';
    t+='<hr class="my-2"/>';
    $("#addpagethumb").find(".pagethumb").each(function(){
        t+='<div class="d-flex justify-content-between">';
        if($(this).find("span").html().substr(0,1)==="C"){
            t+='<div class="lfCatColorBox" style="background-color: '+websiteColor+'"></div>';
            t+='<div class="catCatNo">'+$(this).find("span").html()+'</div>';
            t+='<div class="d-flex lfCatName">Content Page</div>';
            if(type === "assessment") {
                t += '<div class="d-flex justify-content-center catCatTotal"></div>';
            }
            t+='<div class="catCatTotal"></div>';
        } else {
            let bg = $(this).find(".fold").css("background-color");
            if(bg === "rgb(255, 255, 255)"){
                bg = $(this).find(".fold").css("border-color");
            }
            t+='<div class="lfCatColorBox" style="background-color: '+bg+'"></div>';
            t+='<div class="catCatNo">'+$(this).find("span").html()+'</div>';
            t+='<div class="d-flex lfCatName">'+$("#preview-template").find("#templateBody"+$(this).find("span").html()).attr("page-category")+'</div>';
            if(type === "assessment") {
                t += '<div class="d-flex justify-content-center catCatTotal">' + $("#preview-template").find("#templateBody" + $(this).find("span").html()).find(".catmaxpoints").html() + '</div>';
            }
            let elementCount = $(this).find("span").html();
            t+=`<div class="catCatTotal"><i class="far fa-pencil-alt mr-2" data-toggle="tooltip" title="Edit Style" onclick="editCategoryStyle(${elementCount})"></i>`;
            if($("#preview-template").find("#templateBody"+$(this).find("span").html()).attr("page-category-id") !== "1"){
                if($("#preview-template").find("#templateBody"+$(this).find("span").html()).attr("page-category-display") === "no"){
                    t+=`<i class="far fa-eye-slash" data-toggle="tooltip" title="Show" onclick="showHideCategory('${type}',${elementCount},'yes')"></i>`;
                } else {
                    t+=`<i class="far fa-eye" data-toggle="tooltip" title="Hide" onclick="showHideCategory('${type}',${elementCount},'no')"></i>`;
                }
            }
            t+='</div>';
        }
        t+='</div>';
        t+='<hr class="my-2"/>';
    });
    t+='<div class="d-flex justify-content-between">';
    t+='<div class="lfCatColorBox" style="background-color: '+websiteColor+'"></div>';
    t+='<div class="catCatNo">END</div>';
    t+='<div class="d-flex lfCatName">Thank You Page</div>';
    if(type === "assessment") {
        t+='<div class="d-flex justify-content-center catCatTotal"></div>';
    }
    t+='<div class="catCatTotal"></div>';
    t+='</div>';
    $("#dcllist").html(t);
}
function showHideCategory(type,elementCount,displayValue){
    $("#preview-template").find("#templateBody"+elementCount).attr("page-category-display",displayValue);
    getCategoryListBox(type);
}
window.showHideCategory=showHideCategory;
function setCategoryStyle(save=""){
    let fw="",fs="",td="";
    if($("#ecsstlbold .pagestyle").hasClass("active")===true) {
        fw='bold';
    } else {
        fw='normal';
    }
    if($("#ecsstlitalic .pagestyle").hasClass("active")===true) {
        fs='italic';
    } else {
        fs='normal';
    }
    if($("#ecsstlunderline .pagestyle").hasClass("active")===true) {
        td='underline';
    } else {
        td='none';
    }
    let padding = `${$("#ecspadtop").val()}px ${$("#ecspadright").val()}px ${$("#ecspadbottom").val()}px ${$("#ecspadleft").val()}px`;
    let style = `font-family: ${$("#ecsselectfamily").val()}; font-size: ${$("#ecsselectfontsize").val()}; line-height: ${$("#ecstextlineheight").val().replace("px", "")}px; font-weight: ${fw}; font-style: ${fs}; text-decoration: ${td}; color: ${$("#ecstextcolorbox").val()}; background-color: ${$("#ecsbgcolorbox").val()}; padding: ${padding};`;
    if(save === ""){
        $("#catNamePreview").css("cssText",style);
    } else {
        return style;
    }
}
function editCategoryStyle(elementCount){
    $("#clickEditCategoryStyle").trigger("click");
    setTimeout(()=>{
        let texffamily="",texfsize="",texlineheight="",texcolobx="",texbgcolobx="",tempcatid="",tempcatname="",tempcatcolor="";
        $("#catNamePreview").html($("#preview-template").find("#templateBody"+elementCount).attr("page-category"));
        $('#editcatprev').unbind('click').click(function(){
            if(tempcatid === ""){
                $("#ecsselectcategory").val($("#preview-template").find("#templateBody"+elementCount).attr("page-category-id"));
            } else {
                $("#ecsselectcategory").val(tempcatid);
            }
            $("#ecscatprevmain").removeClass("d-flex").addClass("d-none");
            $("#ecscatcombomain").removeClass("d-none").addClass("d-flex");
        });
        $('#closecatcombo').unbind('click').click(function(){
            $("#ecscatcombomain").removeClass("d-flex").addClass("d-none");
            $("#ecscatprevmain").removeClass("d-none").addClass("d-flex");
        });
        $('#ecsselectcategory').unbind('change').change(function(){
            tempcatid=$("#ecsselectcategory").val();
            tempcatname=$("#ecsselectcategory option:selected").text();
            $("#catNamePreview").html($("#ecsselectcategory option:selected").text());
            $("#ecscatcombomain").removeClass("d-flex").addClass("d-none");
            $("#ecscatprevmain").removeClass("d-none").addClass("d-flex");
        });
        tempcatcolor=$("#preview-template").find("#templateBody"+elementCount).attr("page-category-color");
        $("#ecscatcolorbox").val(tempcatcolor);
        $("#ecscatcolorbox").spectrum({
            allowEmpty:true,
            color: tempcatcolor,
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
                    $("#ecscatcolorbox").val('transparent');
                } else {
                    $("#ecscatcolorbox").val(color.toHexString());
                }
            },
            chooseText: "Select",
            palette: []
        });
        if(typeof $("#preview-template").find("#templateBody"+elementCount).attr("page-category-style") === "undefined"){
            texffamily="Arial, Helvetica Neue, Helvetica, sans-serif";
            texfsize=14+"px";
            texlineheight=20+"px";
            texcolobx="#242424";
            texbgcolobx="#FFFFFF";
            $("#ecspadtop").val(0);
            $("#ecspadbottom").val(0);
            $("#ecspadleft").val(0);
            $("#ecspadright").val(0);
        } else {
            $("#catNamePreview").css("cssText",$("#preview-template").find("#templateBody"+elementCount).attr("page-category-style"));
            texffamily=$("#catNamePreview").css("font-family");
            texfsize=$("#catNamePreview").css("font-size");
            texlineheight=$("#catNamePreview").css("line-height");
            texcolobx=$("#catNamePreview").css("color");
            texbgcolobx=$("#catNamePreview").css("background-color");
            if($("#catNamePreview").css("font-weight") === 'bold' || $("#catNamePreview").css("font-weight") === '700'){
                $("#ecsstlbold .pagestyle").addClass("active");
            }
            if($("#catNamePreview").css("font-style") === 'italic'){
                $("#ecsstlitalic .pagestyle").addClass("active");
            }
            if($("#catNamePreview").css("text-decoration-line") === 'underline'){
                $("#ecsstlunderline .pagestyle").addClass("active");
            }
            $("#ecspadtop").val($("#catNamePreview").css("padding-top").replace("px",""));
            $("#ecspadbottom").val($("#catNamePreview").css("padding-bottom").replace("px",""));
            $("#ecspadleft").val($("#catNamePreview").css("padding-left").replace("px",""));
            $("#ecspadright").val($("#catNamePreview").css("padding-right").replace("px",""));
        }
        $("#ecsselectfamily").unbind("change").change(function(){
            setCategoryStyle();
        }).val(texffamily).trigger("change");
        $("#ecsselectfontsize").unbind("change").change(function(){
            setCategoryStyle();
        }).val(texfsize).trigger("change");
        $("#ecstextlineheight").unbind("keyup").keyup(function(){
            $("#ecstextlineheight").val($(this).val().replace("px", ""))
            setCategoryStyle();
        }).val((texlineheight===undefined)?0:texlineheight.replace("px", ""));
        $("#ecsstlbold").unbind("click").click(function(){
            if($("#ecsstlbold .pagestyle").hasClass("active")===true) {
                $("#ecsstlbold .pagestyle").removeClass("active");
            } else {
                $("#ecsstlbold .pagestyle").addClass("active");
            }
            setCategoryStyle();
        });
        $("#ecsstlitalic").unbind("click").click(function(){
            if($("#ecsstlitalic .pagestyle").hasClass("active")===true) {
                $("#ecsstlitalic .pagestyle").removeClass("active");
            } else {
                $("#ecsstlitalic .pagestyle").addClass("active");
            }
            setCategoryStyle();
        });
        $("#ecsstlunderline").unbind("click").click(function(){
            if($("#ecsstlunderline .pagestyle").hasClass("active")===true) {
                $("#ecsstlunderline .pagestyle").removeClass("active");
            } else {
                $("#ecsstlunderline .pagestyle").addClass("active");
            }
            setCategoryStyle();
        });
        $("#ecstextcolorbox").val(texcolobx);
        $("#ecstextcolorbox").spectrum({
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
                    $("#ecstextcolorbox").val('transparent');
                } else {
                    $("#ecstextcolorbox").val(color.toHexString());
                }
                setCategoryStyle();
            },
            chooseText: "Select",
            palette: []
        });
        $("#ecsbgcolorbox").val(texbgcolobx);
        $("#ecsbgcolorbox").spectrum({
            allowEmpty:true,
            color: texbgcolobx,
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
                    $("#ecsbgcolorbox").val('transparent');
                } else {
                    $("#ecsbgcolorbox").val(color.toHexString());
                }
                setCategoryStyle();
            },
            chooseText: "Select",
            palette: []
        });
        $("#ecspadtop").unbind("keyup").keyup(function() {
            setCategoryStyle();
        });
        $("#ecspadbottom").unbind("keyup").keyup(function() {
            setCategoryStyle();
        });
        $("#ecspadleft").unbind("keyup").keyup(function() {
            setCategoryStyle();
        });
        $("#ecspadright").unbind("keyup").keyup(function() {
            setCategoryStyle();
        });
        setCategoryStyle();
        $('#clickSaveCategoryStyle').unbind('click').click(function(){
            if(tempcatid !== ""){
                if(tempcatid === "1"){
                    $("#preview-template").find("#templateBody"+elementCount).attr("page-category-display","no");
                }
                $(".pagethumb").eq(parseInt(elementCount)-1).attr("data-original-title",tempcatname);
                $("#preview-template").find("#templateBody"+elementCount).attr("page-category",tempcatname);
                $("#preview-template").find("#templateBody"+elementCount).attr("page-category-id",tempcatid);
                getCategoryListBox($("#editorType").val());
            }
            if($("#preview-template").find("#templateBody"+elementCount).attr("page-category-color") !== $("#ecscatcolorbox").val()){
                $("#preview-template").find("#templateBody"+elementCount).attr("page-category-color",$("#ecscatcolorbox").val());
                if($(".pagethumb").eq(parseInt(elementCount)-1).find(".fold").attr("style").indexOf("background-color") !== -1){
                    $(".pagethumb").eq(parseInt(elementCount)-1).find(".fold").css("background-color",$("#ecscatcolorbox").val());
                } else {
                    $(".pagethumb").eq(parseInt(elementCount)-1).find(".fold").css("border","2px solid "+$("#ecscatcolorbox").val());
                }
                getCategoryListBox($("#editorType").val());
            }
            $("#preview-template").find("#templateBody"+elementCount).attr("page-category-style",setCategoryStyle("yes"));
            $("#clickEditCategoryStyle").trigger("click");
        });
    },1000);
}
window.editCategoryStyle=editCategoryStyle;
export function emtmsedisplay() {
    $('#preview-template').contents().find('.templateBody').each(function( key_id ) {
        if($(this).find('div.mojoMcBlock').length){
            $(this).find('div.containerEmptyMessage').hide();
        }else{
            $(this).find('div.containerEmptyMessage').show();
        }
        if($(this).find('div.mojoMcBlock.frm-block').length){
            $(this).find('span.formEmptyMessage').hide();
        }else{
            $(this).find('span.formEmptyMessage').show();
        }
    });
    if($('#preview-template').contents().find('#pageheader div.row').length){
        $(".headerEmptyMessage").hide();
    } else {
        $(".headerEmptyMessage").show();
    }
    if($('#preview-template').contents().find('#pagefooter div.row').length){
        $(".footerEmptyMessage").hide();
    } else {
        $(".footerEmptyMessage").show();
    }
}
export function showdsm(i) {
    $(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    $(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone,.tpl-block-delete").show();
    if(i==="image") {
        $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
    }
    if(i==="social") {
        $(".dsmbsettingbutton i.tpl-specific-s").addClass("tpl-specific-active");
    }
    if(i==="ecom") {
        $(".dsmbsettingbutton i.tpl-specific-e").addClass("tpl-specific-active");
    }
    if(i==="attachment") {
        $(".dsmbsettingbutton i.tpl-specific-a").addClass("tpl-specific-active");
    }
    if(i==="header" || i==="footer"){
        $(".dsmbsettingbutton").find(".tpl-block-move-up,.tpl-block-move-down,.tpl-block-clone").hide();
    }
    if(i==="button" || i==="attachment"){
        $(".dsmbsettingbutton").find(".tpl-block-clone").hide();
    }
    if(i==="formBlock"){
        $(".dsmbsettingbutton").find(".tpl-block-clone,.tpl-block-delete").hide();
    }
    $("#draggable-setting-menu").show();
}
export function hidedsm() {
    $(".dsmbsettingbutton i").removeClass("tpl-specific-active");
    $("#draggable-setting-menu").hide();
    $(".mojoMcBlock.tpl-block").removeClass("active");
}
export function mySlideronc() {
    let selection,texdewid,texdewid1,texdewid2,ImageCardAndCaptionTdBlock,imageTBlock,mcnImage,textTBlock,textTdBlock,mcnICCwidth,mcnTCCwidth,imgtextwidfull1,datatablecolumns1,datatablecolumns2,imgwidfull1,ImageCardAndCaptionTBlock,block_id;
    $('#preview-template').contents().find('#templateContainer,#templatePreheader,#templateHeader,.templateBody,#templateFooter').attr("width","100%");
    $('#preview-template').contents().find('.mojoMcBlock.dojoDndItem').unbind("each").each(function(){
        block_id=$(this).attr("id");
        $('#'+block_id).css("width","100%");
        let blockid=$('#preview-template').contents().find('#'+block_id);
        blockid.find(".imageTdBlock").css("display","flex");
        blockid.find(".imageGroupTdBlock").css("display","flex");
        if(blockid.attr("rolefor")==="text" || blockid.attr("rolefor")==="footer" || blockid.attr("rolefor")==="boxed_text" || blockid.attr("rolefor")==="boxed_text20" || blockid.attr("rolefor")==="boxed_text21" || blockid.attr("rolefor")==="boxed_text22"){
            selection=$('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]').attr("select-split-option");
            texdewid=100;
            if(selection==="0") {
                texdewid1=parseInt(texdewid/2);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="1") {
                texdewid1=parseInt(texdewid/3);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="2") {
                texdewid2=parseInt(texdewid/3);
                texdewid1=texdewid-texdewid2;
            }else if(selection==="-1") {
                texdewid1=texdewid;
            }
            $('#preview-template').contents().find('#'+block_id).find('[data-table-columns]').attr("select-split-option",selection);

            datatablecolumns1 = $('#preview-template').contents().find('#'+block_id).find('[data-table-columns="1"]');
            datatablecolumns1.attr("width",(texdewid1)+"%");
            datatablecolumns1.find('.textTdBlock').css({width:(texdewid)+"%"});
            datatablecolumns1.find(".textTdBlock").css("word-break","break-word");

            datatablecolumns2 = $('#preview-template').contents().find('#'+block_id).find('[data-table-columns="2"]');
            datatablecolumns2.attr("width",(texdewid2)+"%");
            datatablecolumns2.find('.textTdBlock').css({width:(texdewid)+"%"});
            datatablecolumns2.find(".textTdBlock").css("word-break","break-word");
        }
        if(blockid.attr("rolefor")==="image_card" || blockid.attr("rolefor")==="image_+_caption" || blockid.attr("rolefor")==="image_+_caption11" || blockid.attr("rolefor")==="image_+_caption12" || blockid.attr("rolefor")==="image_+_caption21" || blockid.attr("rolefor")==="image_+_caption22" || blockid.attr("rolefor")==="image_+_caption31" || blockid.attr("rolefor")==="image_+_caption32"){
            ImageCardAndCaptionTdBlock=$('#preview-template').contents().find('#'+block_id).find(".ImageCardAndCaptionTdBlock");
            imageTBlock=$('#preview-template').contents().find('#'+block_id).find(".imageTBlock");
            mcnImage=$('#preview-template').contents().find('#'+block_id).find(".mcnImage");
            textTBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock");
            textTdBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock tbody tr td.textTdBlock");
            mcnICCwidth=Math.floor(100/3);
            mcnTCCwidth=Math.floor(100-mcnICCwidth);
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='top'){
                ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;");
                imageTBlock.css({float:""});
                imgwidfull1="100%";
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width",imgwidfull1);
                    mcnImage.css("width",imgwidfull1);
                    mcnImage.attr("height",imgwidfull1);
                    mcnImage.css("height",imgwidfull1);
                }
                textTBlock.attr("width","100%");
                textTBlock.css({float:""}).css("word-break","break-word").attr("align","");
                imgtextwidfull1="100%";
                textTdBlock.attr("width",(imgtextwidfull1));
                textTBlock.insertAfter(imageTBlock);
            }
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='bottom'){
                ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;");
                imageTBlock.css({float:""}).attr("align","left");
                imgwidfull1="100%";
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width",imgwidfull1);
                    mcnImage.css("width",imgwidfull1);
                    mcnImage.attr("height",imgwidfull1);
                    mcnImage.css("height",imgwidfull1);
                }
                textTBlock.attr("width","100%");
                textTBlock.css({float:""}).css("word-break","break-word").attr("align","");
                imgtextwidfull1="100%";
                textTdBlock.attr("width",(imgtextwidfull1));
                imageTBlock.insertAfter(textTBlock);
            }
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='left'){
                ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
                ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth)+"%");
                if(ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").length>0) {
                    imageTBlock.attr("width","100%");
                } else {
                    imageTBlock.attr("width",(mcnICCwidth)+"%");
                }
                if(blockid.attr("rolefor")==="image_+_caption") {
                    imageTBlock.css({float:"left"}).attr("align","left");
                } else {
                    imageTBlock.css({float:"left"}).attr("align","");
                }
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width","100%");
                    mcnImage.css("width","100%");
                    mcnImage.attr("height","100%");
                    mcnImage.css("height","100%");
                }
                textTBlock.attr("width",mcnTCCwidth+"%").attr("valign","top").attr("align","right");
                textTdBlock.attr("width",(mcnTCCwidth)+"%");
            }
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='right'){
                ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
                ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth)+"%");
                if(ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").length>0) {
                    imageTBlock.attr("width","100%");
                } else {
                    imageTBlock.attr("width",(mcnICCwidth)+"%");
                }
                imageTBlock.css({float:"right"}).attr("align","right");
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width","100%");
                    mcnImage.css("width","100%");
                    mcnImage.attr("height","100%");
                    mcnImage.css("height","100%");
                }
                textTBlock.attr("width", mcnTCCwidth+"%").attr("align","left");
                textTdBlock.attr("width",(mcnTCCwidth)+"%");
            }
        }
        if(blockid.attr("rolefor")==="image_+_caption_+_h" || blockid.attr("rolefor")==="image_+_caption12_+_h" || blockid.attr("rolefor")==="image_+_caption21_+_h" || blockid.attr("rolefor")==="image_+_caption22_+_h" || blockid.attr("rolefor")==="image_+_caption31_+_h" || blockid.attr("rolefor")==="image_+_caption32_+_h"){
            ImageCardAndCaptionTdBlock=$('#preview-template').contents().find('#'+block_id).find(".ImageCardAndCaptionTdBlock");
            imageTBlock=$('#preview-template').contents().find('#'+block_id).find(".imageTBlock");
            mcnImage=$('#preview-template').contents().find('#'+block_id).find(".mcnImage");
            textTBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock");
            textTdBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock tbody tr td.textTdBlock");
            mcnICCwidth=Math.floor(100/2);
            mcnTCCwidth=Math.floor(100-mcnICCwidth);
            ImageCardAndCaptionTdBlock.attr("style","mso-table-lspace: 0pt;mso-table-rspace: 0pt;display: flex;");
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='left'){
                ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth)+"%");
                if(ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").length>0) {
                    imageTBlock.attr("width","100%");
                } else {
                    imageTBlock.attr("width",(mcnICCwidth)+"%");
                }
                if(blockid.attr("rolefor")==="image_+_caption_+_h") {
                    imageTBlock.css({float:"left"}).attr("align","left");
                } else {
                    imageTBlock.css({float:"left"}).attr("align","");
                }
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width","100%");
                    mcnImage.css("width","100%");
                    mcnImage.attr("height","100%");
                    mcnImage.css("height","100%");
                }
                textTBlock.attr("width",mcnTCCwidth+"%").attr("valign","top").attr("align","right");
                textTdBlock.attr("width",(mcnTCCwidth)+"%");
            }
            if(ImageCardAndCaptionTdBlock.attr('data-cardposi')==='right'){
                ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").attr("width",(mcnICCwidth)+"%");
                if(ImageCardAndCaptionTdBlock.find("table.ImagelistContentTBlock").length>0) {
                    imageTBlock.attr("width","100%");
                } else {
                    imageTBlock.attr("width",(mcnICCwidth)+"%");
                }
                imageTBlock.css({float:"right"}).attr("align","right");
                if(mcnImage.attr("changeWidth")!=="yes") {
                    mcnImage.attr("width","100%");
                    mcnImage.css("width","100%");
                    mcnImage.attr("height","100%");
                    mcnImage.css("height","100%");
                }
                textTBlock.attr("width", mcnTCCwidth+"%").attr("align","left");
                textTdBlock.attr("width",(mcnTCCwidth)+"%");
            }
        }
        ImageCardAndCaptionTBlock=blockid.find(".ImageCardAndCaptionTBlock").length;
        if((blockid.attr("rolefor")==="2image_+_2caption") && ImageCardAndCaptionTBlock===2) {
            selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
            texdewid=100;
            if(selection==="0") {
                texdewid1=parseInt(texdewid/2);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="1") {
                texdewid1=parseInt(texdewid/3);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="2") {
                texdewid2=parseInt(texdewid/3);
                texdewid1=texdewid-texdewid2;
            }

            blockid.find('[data-clo-num="0"]').css({width:texdewid1+"%"});
            blockid.find('[data-clo-num="0"]').attr("width",texdewid1+"%");
            if(blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("changeWidth")!=="yes") {
                blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%"});
                blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("width","100%");
                blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("height","100%");
                blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height","100%");
            }
            blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width","100%");
            blockid.find('[data-clo-num="0"]').find('table.textTBlock').attr("width","100%").attr("align","");
            blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
            blockid.find('[data-clo-num="0"]').find(".textTdBlock").css("word-break","break-word");

            blockid.find('[data-clo-num="1"]').css({width:texdewid2+"%"});
            blockid.find('[data-clo-num="1"]').attr("width",texdewid2+"%");
            if(blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("changeWidth")!=="yes") {
                blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%"});
                blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("width","100%");
                blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("height","100%");
                blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height","100%");
            }
            blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width","100%");
            blockid.find('[data-clo-num="1"]').find('table.textTBlock').attr("width","100%").attr("align","");
            blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
            blockid.find('[data-clo-num="1"]').find(".textTdBlock").css("word-break","break-word");
        }
        if((blockid.attr("rolefor")==="2image_+_1caption1" || blockid.attr("rolefor")==="2image_+_1caption2") && ImageCardAndCaptionTBlock===2) {
            selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
            texdewid=100;
            blockid.find('[data-clo-num="1"]').css({marginLeft:"0px"});
            blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
            if(selection==="0") {
                texdewid1=parseInt(texdewid/2);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="1") {
                texdewid1=parseInt(texdewid/3);
                texdewid2=texdewid-texdewid1;
            }else if(selection==="2") {
                texdewid2=parseInt(texdewid/3);
                texdewid1=texdewid-texdewid2;
            }
            blockid.find('[data-clo-num="0"]').css({width:texdewid1+"%"});
            blockid.find('[data-clo-num="0"]').attr("width",texdewid1+"%");
            if(blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("changeWidth")!=="yes") {
                blockid.find('[data-clo-num="0"]').find('.mcnImage').css({width:"100%"});
                blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("width","100%");
                blockid.find('[data-clo-num="0"]').find('.mcnImage').attr("height","100%");
                blockid.find('[data-clo-num="0"]').find('.mcnImage').css("height","100%");
            }
            blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width","100%");
            blockid.find('[data-clo-num="0"]').find('table.textTBlock').attr("width","100%").attr("align","");
            blockid.find('[data-clo-num="0"]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
            blockid.find('[data-clo-num="0"]').find(".textTdBlock").css("word-break","break-word");

            blockid.find('[data-clo-num="1"]').css({width:texdewid2+"%"});
            blockid.find('[data-clo-num="1"]').attr("width",texdewid2+"%");
            if(blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("changeWidth")!=="yes") {
                blockid.find('[data-clo-num="1"]').find('.mcnImage').css({width:"100%"});
                blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("width","100%");
                blockid.find('[data-clo-num="1"]').find('.mcnImage').attr("height","100%");
                blockid.find('[data-clo-num="1"]').find('.mcnImage').css("height","100%");
            }
            blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width","100%");
            blockid.find('[data-clo-num="1"]').find('table.textTBlock').attr("width","100%").attr("align","");
            blockid.find('[data-clo-num="1"]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
            blockid.find('[data-clo-num="1"]').find(".textTdBlock").css("word-break","break-word");
        }
        if((blockid.attr("rolefor")==="2image_+_2caption" && ImageCardAndCaptionTBlock===3) || (blockid.attr("rolefor")==="3image_+_3caption" && ImageCardAndCaptionTBlock===3)) {
            selection=blockid.find('[data-clo-num="1"]').attr("select-split-option");
            texdewid=parseInt(100/3);
            blockid.find('[data-clo-num="1"]').css({marginLeft:"0px"});
            blockid.find('[data-clo-num="2"]').css({marginLeft:"0px"});
            blockid.find('[data-clo-num="1"]').css({marginTop:"0px"});
            blockid.find('[data-clo-num="2"]').css({marginTop:"0px"});
            for(let i=0;i<3;i++) {
                blockid.find('[data-clo-num="'+i+'"]').css({width:texdewid+"%"});
                blockid.find('[data-clo-num="'+i+'"]').attr("width",texdewid+"%");
                if(blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("changeWidth")!=="yes") {
                    blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').css({width:"100%"});
                    blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("width","100%");
                    blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').attr("height","100%");
                    blockid.find('[data-clo-num="'+i+'"]').find('.mcnImage').css("height","100%");
                }
                blockid.find('[data-clo-num="'+i+'"]').find('table.textTBlock tbody tr td.textTdBlock').attr("width","100%");
            }
            blockid.find('[data-clo-num]').find('table.textTBlock tbody tr td.textTdBlock').css({wordBreak:"break-word"});
            blockid.find('[data-clo-num]').find('table.textTBlock').attr("align","");
            blockid.find('[data-clo-num]').find(".textTdBlock").css("word-break","break-word");
        }
        if(blockid.attr("rolefor")==="image_group") {
            texdewid=(100/2);
            blockid.find("table.imageGroupTBlock").attr("width",texdewid+"%");
            blockid.find("td.listTdBlock").css({"display":"flex","flex-wrap":"wrap"});
            for(let i=0;i<4;i++) {
                if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("height","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("width","100%");
                }
                blockid.find("table[data-tbmc-id="+i+"] table.mcpreview-image-uploader").attr("width","100%");
            }
            blockid.find("table[data-tbmc-id=1]").removeAttr("align");
        }
        if(blockid.attr("rolefor")==="image_group_3h" || blockid.attr("rolefor")==="image_group_3s") {
            texdewid=parseInt(100/3);
            blockid.find('table.imageGroupTBlock td.imageGroupTdBlock').css({"position":"relative"});
            blockid.find("table.imageGroupTBlock").attr("width",texdewid+"%");
            for(let i=0;i<3;i++) {
                blockid.find("table[data-tbmc-id="+i+"]").find("table.mcpreview-image-uploader").attr("width","100%");
                if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("width","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("width","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("height","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height","100%");
                }
            }
        }
        if(blockid.attr("rolefor")==="image_group_2h" || blockid.attr("rolefor")==="image_group_2s") {
            texdewid=(100/2);
            blockid.find('table.imageGroupTBlock td.imageGroupTdBlock').css({"position":"relative"});
            blockid.find("table.imageGroupTBlock").attr("width",texdewid+"%");
            for(let i=0;i<2;i++) {
                blockid.find("table[data-tbmc-id="+i+"]").find("table.mcpreview-image-uploader").attr("width","100%");
                if(blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("changeWidth")!=="yes") {
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("width","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("width","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").attr("height","100%");
                    blockid.find("table[data-tbmc-id="+i+"]").find("img.mcnImage").css("height","100%");
                }
            }
        }
        if(blockid.attr("rolefor")==="image") {
            texdewid=100;
            blockid.find("table.imageTBlock").attr("width",texdewid+"%");
            blockid.find("table.imageTBlock td.imageTdBlock").attr("width",texdewid+"%");
            if(blockid.find("table.imageTBlock td.imageTdBlock img").attr("changeWidth")!=="yes") {
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("width","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("width","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("height","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("height","100%");
            }
            blockid.find("table.imageTBlock table.mcpreview-image-uploader").attr("width",texdewid+"%");
            blockid.find("table.imageTBlock table.mcpreview-image-uploader").css({width:texdewid+"%"});
        }
        if(blockid.attr("rolefor")==="logoicon") {
            texdewid=100;
            blockid.find("table.imageTBlock").attr("width",texdewid+"%");
            blockid.find("table.imageTBlock td.imageTdBlock").attr("width",texdewid+"%");
            if(blockid.find("table.imageTBlock td.imageTdBlock img").attr("changeWidth")!=="yes") {
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("width","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("width","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").attr("height","100%");
                blockid.find("table.imageTBlock td.imageTdBlock img.mcnImage").css("height","100%");
            }
            blockid.find("table.imageTBlock table.mcpreview-image-uploader").attr("width",texdewid+"%");
            blockid.find("table.imageTBlock table.mcpreview-image-uploader").css({width:texdewid+"%"});
        }
        if(blockid.attr("rolefor")==="ecommerce") {
            texdewid=100;
            selection = blockid.find("td.ecomTdBlock");
            texdewid1=texdewid/selection.length;
            for(let i=0;i<selection.length;i++) {
                blockid.find('table.ecomTBlock[data-mc-id="'+i+'"]').attr("width",texdewid1+"%");
                blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').attr("width",texdewid1+"%");
                blockid.find('table.ecomTBlock[data-mc-id="'+i+'"] td.ecomTdBlock').find(".ecomimg").attr("width",texdewid+"%");
            }
        }
        if(blockid.attr("rolefor")==="divider") {
            texdewid=100;
            if(blockid.find("table.dividerTBlock").attr("changeWidth")!=="yes") {
                blockid.find('table.dividerTBlock').attr("width",texdewid+"%");
            }
        }
    });
}
export function refleftimageandcaption(found,lastbloclid,editorMax,editorWidth,imgwidfull){
    if(found==="image_+_caption" || found==="image_+_caption_+_h"){
        setleftimageandcaption(lastbloclid,1,"left",editorMax,editorWidth,imgwidfull);
    }
    if(found==="image_+_caption12" || found==="image_+_caption12_+_h"){
        setleftimageandcaption(lastbloclid,1,"right",editorMax,editorWidth,imgwidfull);
    }
    if(found==="image_+_caption11"){
        setleftimageandcaption(lastbloclid,1,"bottom",editorMax,editorWidth,imgwidfull);
    }
    if(found==="image_card"){
        setleftimageandcaption(lastbloclid,1,"top",editorMax,editorWidth,imgwidfull);
    }
    if(found==="image_+_caption21" || found==="image_+_caption31" || found==="image_+_caption21_+_h" || found==="image_+_caption31_+_h"){
        setleftimageandcaption(lastbloclid,1,"left",editorMax,editorWidth,imgwidfull);
    }
    if(found==="image_+_caption22" || found==="image_+_caption32" || found==="image_+_caption22_+_h" || found==="image_+_caption32_+_h"){
        setleftimageandcaption(lastbloclid,1,"right",editorMax,editorWidth,imgwidfull);
    }
    if(found==="2image_+_2caption"){
        //setleftimageandcaption(lastbloclid,1,"comtop",editorMax,editorWidth,imgwidfull);
    }
    if(found==="2image_+_1caption1" || found==="2image_+_1caption2"){
        setleftimageandcaption(lastbloclid,1,"comtop",editorMax,editorWidth,imgwidfull);
    }
}
function setleftimageandcaption(block_id,contentblockid,datacardposi,editorMax,editorWidth,imgwidfull){
    let imgwidfull1,imgtextwidfull1;
    let rolefor=$('#preview-template').contents().find('#'+block_id).attr("rolefor");
    let ITB="imageTBlock";
    if(rolefor==="image_+_caption21" || rolefor==="image_+_caption22" || rolefor==="image_+_caption31" || rolefor==="image_+_caption32" || rolefor==="image_+_caption21_+_h" || rolefor==="image_+_caption22_+_h" || rolefor==="image_+_caption31_+_h" || rolefor==="image_+_caption32_+_h") {
        ITB="ImagelistContentTBlock";
    }
    let ImageCardAndCaptionTdBlock=$('#preview-template').contents().find('#'+block_id).find(".ImageCardAndCaptionTdBlock");
    let imageTBlock=$('#preview-template').contents().find('#'+block_id).find("."+ITB);
    let ImagelistContentTBlock=$('#preview-template').contents().find('#'+block_id).find(".ImagelistContentTBlock");
    let mcnImage=$('#preview-template').contents().find('#'+block_id).find(".imageTdBlock .mcnImage.fullmcnImage");
    let textTBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock");
    let textTdBlock=$('#preview-template').contents().find('#'+block_id).find(".textTBlock tbody tr td.textTdBlock");

    let mcnICCwidth=Math.floor(ImageCardAndCaptionTdBlock.width()/3);
    let mcnTCCwidth=Math.floor(ImageCardAndCaptionTdBlock.width()-(ImageCardAndCaptionTdBlock.width()/3)-2);
    if(editorWidth<=350) {
        mcnICCwidth=editorWidth;
        mcnTCCwidth=editorWidth;
    }
    let imgslidermax=editorMax;
    if($('#preview-template').contents().find('#'+block_id).find('.mcnImage.fullmcnImage').attr("dt-tmar")!=="1"){
        imgslidermax=imgwidfull;
    }
    ImageCardAndCaptionTdBlock.attr('data-cardposi',datacardposi);
    if(datacardposi==='comtop'){
        ImagelistContentTBlock.attr("width","100%");
        imageTBlock.css({float:""});
        imageTBlock.find(".imageTdBlock").css({padding:"5px"});
        imgwidfull1=(imgslidermax*editorWidth)/editorMax;
        mcnImage.attr("width",imgwidfull1);
        textTBlock.removeAttr("width");
        textTBlock.css({float:""}).css("word-break","break-word");
        imgtextwidfull1=(editorMax*editorWidth)/editorMax;
        textTdBlock.attr("width",(imgtextwidfull1-36));
        textTdBlock.css({paddingLeft:"5px",paddingRight:"0px",wordBreak:"break-word"});
    }
    if(datacardposi==='top'){
        ImagelistContentTBlock.attr("width","100%");
        imageTBlock.css({float:""});
        imageTBlock.find(".imageTdBlock").css({paddingLeft:"5px",paddingRight:"5px",paddingTop:"5px"});
        imgwidfull1=(imgslidermax*editorWidth)/editorMax;
        mcnImage.attr("width",imgwidfull1);
        textTBlock.removeAttr("width");
        textTBlock.css({float:""}).css("word-break","break-word");
        imgtextwidfull1=(editorMax*editorWidth)/editorMax;
        textTdBlock.attr("width",(imgtextwidfull1-36));
        textTdBlock.css({paddingLeft:"5px",paddingRight:"5px",wordBreak:"break-word"});
        textTBlock.insertAfter(imageTBlock);
    }
    if(datacardposi==='bottom'){
        ImagelistContentTBlock.attr("width","100%");
        imageTBlock.css({float:""}).attr("align","left");
        imageTBlock.find(".imageTdBlock").css({paddingLeft:"5px",paddingRight:"5px",paddingBottom:"5px"});
        imgwidfull1=(imgslidermax*editorWidth)/editorMax;
        mcnImage.attr("width",imgwidfull1);
        textTBlock.removeAttr("width");
        textTBlock.css({float:""}).css("word-break","break-word").attr("align","left");
        imgtextwidfull1=(editorMax*editorWidth)/editorMax;
        textTdBlock.attr("width",(imgtextwidfull1));
        textTdBlock.css({paddingLeft:"5px",paddingRight:"5px",wordBreak:"break-word"});
        imageTBlock.insertAfter(textTBlock);
    }
    if(datacardposi==='left'){
        ImagelistContentTBlock.attr("width",(mcnICCwidth));
        imageTBlock.attr("width",(mcnICCwidth));
        imageTBlock.css({float:"left"}).attr("align","left");
        imageTBlock.find(".imageTdBlock").css({paddingLeft:"5px",paddingTop:"5px",paddingBottom:"5px"});
        mcnImage.attr("width",(mcnICCwidth-18));
        textTBlock.attr("width",mcnTCCwidth);
        textTdBlock.attr("width",(mcnTCCwidth-18));
        textTdBlock.css({paddingLeft:"5px",paddingRight:"5px",paddingTop:"5px",paddingBottom:"0px",wordBreak:"break-word"});
    }
    if(datacardposi==='right'){
        ImagelistContentTBlock.attr("width",(mcnICCwidth));
        imageTBlock.attr("width",(mcnICCwidth));
        imageTBlock.css({float:"right"}).attr("align","right");
        imageTBlock.find(".imageTdBlock").css({paddingRight:"5px",paddingTop:"5px",paddingBottom:"5px"});
        mcnImage.attr("width",(mcnICCwidth-18));
        textTBlock.attr("width", mcnTCCwidth);
        textTBlock.attr("align","left");
        textTdBlock.attr("width",(mcnTCCwidth-18));
        textTdBlock.css({paddingLeft:"5px",paddingRight:"5px",paddingTop:"5px",paddingBottom:"0px",wordBreak:"break-word"});
    }
}
export function bigimagesetting() {
    $('#preview-template').contents().find('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
        let rolefortemp=$(this).attr("rolefor");
        if(rolefortemp==="image_+_caption" || rolefortemp==="image_+_caption12" || rolefortemp==="image_+_caption_+_h" || rolefortemp==="image_+_caption12_+_h") {
            $(this).contents().find('.mcpreview-image-uploader tbody tr td').find('div.imagePlaceholder').css('padding-top',"110px").css('padding-bottom',"110px");
        }
        if(rolefortemp==="2image_+_1caption1") {
            $(this).contents().find('[data-clo-num="0"]').find('.imagePlaceholder').css('padding-top',"110px").css('padding-bottom',"110px");
        }
        if(rolefortemp==="2image_+_1caption2") {
            $(this).contents().find('[data-clo-num="1"]').find('.imagePlaceholder').css('padding-top',"110px").css('padding-bottom',"110px");
        }
        if(rolefortemp==="image_group_3h" || rolefortemp==="image_group_2h") {
            $(this).contents().find('.imagePlaceholder').css('padding-top',"110px").css('padding-bottom',"110px");
        }
    });
}
export function closeleanModal() {
    $("span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]").unbind("click").click(function(){
        $(".link-modal.dijitDialogShow,.link-modal,#lean_overlay").remove();
    });
}
export function matchYoutubeUrl(url,wantId = false) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let matches = url.match(p);
    if(matches){
        if(!wantId){
            return 'https://www.youtube.com/embed/' + matches[1];
        }else{
            return 'http://img.youtube.com/vi/' + matches[1] + '/maxresdefault.jpg';
        }
    }
    return false;
}
export function matchVimeoUrl(url,wantId) {
    let p = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    let matches = url.match(p);
    if(matches){
        if(wantId === undefined){
            return 'https://player.vimeo.com/video/' + matches[5];
        }else{
            return 'https://i.vimeocdn.com/video/' + matches[5] + '_640.webp';
        }
    }
    return false;
}
function createVideoIframe(url,img) {
    let ranid = 'def' + Math.floor((Math.random() * 100) + 1);
    setTimeout(() => {
        createThumbnailImage(ranid,img);
    }, 500);
    return '<a href="' + url + '" target="_blank"><img class="mcnImage" width="100%" id="'+ranid+'" src="' + img + '"/></a>';
}
function createVideo(url) {
    if(url === 'default'){url = '';}
    return '<video width="100%" height="315" poster="" controls><source src="' + url + '#t=1"></video>';
}
function createThumbnailImage(imgid,imgurl) {
    let requestData = {
        "downloadImageUrl":imgurl
    }
    importVideoImageFromUrlED(requestData).then(res => {
        if (res.status === 200) {
            let cimg = document.getElementById(imgid);
            cimg.src = res.result.imageUrl;
        } else {
            $("#clickError").attr("data-type","Error");
            $("#clickError").val("Something went wrong...Please try again later...");
            $("#clickError").trigger("click");
        }
    });
}
export function browseimagebtn(block_id,contentblockid) {
    let totalbtn = $("#"+block_id).find('table.mcpreview-image-uploader');
    setTimeout(function(){
        for(let target_id=0;target_id<totalbtn.length;target_id++) {
            $("#"+block_id).find('table[data-mc-id="'+target_id+'"]').unbind("click").click(function(){
                target_id=$(this).closest('table').attr("data-mc-id");
                filemanager(block_id,target_id,contentblockid);
            });
        }
    },500);
}
export function browseimagebtnreload(block_id,contentblockid) {
    let totalbtn = $("#"+block_id).find('table.mcpreview-image-uploader');
    setTimeout(function(){
        for(let target_id=0;target_id<totalbtn.length;target_id++) {
            let y=totalbtn[target_id].attributes["data-mc-id"].nodeValue;
            $("#"+block_id).find('table[data-mc-id="'+y+'"]').unbind("click").click(function(){
                target_id=$(this).closest('table').attr("data-mc-id");
                filemanager(block_id,target_id,contentblockid);
            });
        }
    },500);
}
export function blockdelete(blo_id,block_id,droparray,emtmsedisplay,savefullcontent) {
    $("#"+blo_id+",#a"+blo_id).remove();
    let dilogstring=droparray["DeleteDialog"];
    dilogstring=replaccon("{{Dialog.id}}",blo_id,dilogstring);
    $("body").append(dilogstring);
    $("#a"+blo_id).leanModal({ top :100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
    closeleanModal();
    setTimeout(function(){
        $("#a"+blo_id)[0].click();
    },500);
    let delEle=$("#"+blo_id+" div div a.button");
    delEle.unbind("click");
    delEle.click(function(){
        $("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
        $('#preview-template').contents().find('#'+block_id).remove();
        emtmsedisplay();
        savefullcontent();
    });
}
export function browsevideobtn(block_id,droparraysetting,blocksetting) {
    $("#"+block_id).find("td.videoTdBlock a").click(function(e) {
        e.preventDefault();
    });
    $("#"+block_id).find('table.videoTBlock').unbind("click").click(function(){
        $("#videourl").val("");
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["videoSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksetting(block_id);
        $("#videourl").val($("#"+block_id).find('table[data-mc-id="0"] tr td a[target="_blank"]').attr("href"));
        $("#videourl").unbind("keyup").keyup(function(){
            let saveurl = $("#"+block_id).find('table[data-mc-id="0"] tr td a[target="_blank"]').attr("href");
            let url = $("#videourl").val();
            let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            let matches = url.match(p);
            let matches1,img;
            if(!matches) {
                matches="";
            }
            if(typeof saveurl!=="undefined") {
                matches1 = saveurl.match(p);
            } else {
                matches1 = "";
            }
            if (typeof url !== "undefined" && url !== '' && matches[1] !== matches1[1]) {
                $("#"+block_id).find('table.videoTBlock tr').removeAttr("class");
                if(matchYoutubeUrl(url)!==false || matchVimeoUrl(url)!==false){
                    img = "";
                    if (matchYoutubeUrl(url)!==false) {
                        img = matchYoutubeUrl(url,true);
                        url = matchYoutubeUrl(url);
                    } else if (matchVimeoUrl(url)!==false) {
                        img = matchVimeoUrl(url, true);
                        url = matchVimeoUrl(url);
                    }
                    $("#"+block_id).find('table.videoTBlock tr td.videoTdBlock').html(createVideoIframe(url,img));
                } else {
                    $("#"+block_id).find('table.videoTBlock tr td.videoTdBlock').html(createVideo(url));
                }
            }
            $("#"+block_id).find("td.videoTdBlock a").click(function(e) {
                e.preventDefault();
            });
        });
        showdsm("");
    });
}
export function tbfcontrol(block_id,surveystags,assessmentstags,customformstags,droparraysetting,blocksetting) {
    let textDecoration=$('#preview-template').contents().find('.templateBody').css("text-decoration-color");
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find(".listTdBlock table[data-table-columns='1'] .textTdBlock,.listTdBlock table[data-table-columns='2'] .textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
    textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
    setTimeout(function(){
        createckeditor(block_id,surveystags,assessmentstags,customformstags);
    },1500);
}
export function dvdcontrol(block_id,dividerSetting) {
    dividerSetting(block_id);
}
export function imagescontrol(block_id,editreplaceimagelink) {
    let contentblockid=replaccon("preview_McBlock_","",block_id);
    browseimagebtn(block_id,contentblockid);
    editreplaceimagelink(block_id,contentblockid);
}
export function socfollowcontrol(block_id,droparray,droparraysetting,savefullcontent,blocksetting) {
    $('#pagefooter').find('.footerSocial').droppable({
        iframeFix: true,
        hoverClass: "drop_hover",
        greedy: true,
        accept: ".socialmedia",
        drop: function( event, ui ) {
            if(ui.draggable.hasClass("socialmedia")) {
                let html = ui.draggable[0];
                let found = $(html).attr("data-title");
                if($(this).find('table.btable tr.btr table[data-share-rolefor="'+found+'"]').length===0) {
                    let fullhtml=droparray['socialFollowButtonBlockEditor'];
                    fullhtml=replaccon("{{forward.role}}",found,fullhtml);
                    fullhtml=replaccon("{{forward.href}}",socialfollow[found]['forward_url'],fullhtml);
                    fullhtml=replaccon("{{forward.imgurl96}}",socialfollow[found]['forward_imgurl48'],fullhtml);
                    fullhtml=replaccon("{{forward.title}}",socialfollow[found]['forward_title'],fullhtml);
                    $(this).find('table.btable tr.btr').append("<td>"+fullhtml+"</td>");
                    settingSocialFooter(droparraysetting,droparray,savefullcontent);
                }
            }
        }
    });
    settingSocialFooter(droparraysetting,droparray,savefullcontent);
    $('#'+block_id).find('table.socialFollowTBlock td.socialFollowTdBlock').droppable({
        iframeFix: true,
        hoverClass: "drop_hover",
        greedy: true,
        accept: ".socialmedia",
        drop: function( event, ui ) {
            if(ui.draggable.hasClass("socialmedia")) {
                let html = ui.draggable[0];
                let found = $(html).attr("data-title");
                if($("#"+block_id).find('table[data-share-rolefor="'+found+'"]').length===0) {
                    let fullhtml=droparray['socialFollowButtonBlockEditor'];
                    fullhtml=replaccon("{{forward.role}}",found,fullhtml);
                    fullhtml=replaccon("{{forward.href}}",socialfollow[found]['forward_url'],fullhtml);
                    fullhtml=replaccon("{{forward.imgurl96}}",socialfollow[found]['forward_imgurl48'],fullhtml);
                    fullhtml=replaccon("{{forward.title}}",socialfollow[found]['forward_title'],fullhtml);
                    $(this).find("table.btable tr.btr").append("<td>"+fullhtml+"</td>");
                    settingSocial(block_id,droparraysetting,blocksetting,savefullcontent);
                }
            }
        }
    });
    settingSocial(block_id,droparraysetting,blocksetting,savefullcontent);
}
export function imgcardcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting) {
    let textDecoration=$('#preview-template').contents().find('.templateBody').css("text-decoration-color");
    let contentblockid=replaccon("preview_McBlock_","",block_id);
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
    textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
    setTimeout(function(){
        createckeditor(block_id,surveystags,assessmentstags,customformstags);
        browseimagebtn(block_id,contentblockid);
        editreplaceimagelink(block_id,contentblockid);
    },1500);
}
export function multiimgcardcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting) {
    let textDecoration=$('#preview-template').contents().find('.templateBody').css("text-decoration-color");
    let contentblockid=replaccon("preview_McBlock_","",block_id);
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
    textSetting(block_id,droparraysetting,blocksetting,mySlideronc);
    setTimeout(function(){
        createckeditor(block_id,surveystags,assessmentstags,customformstags);
        browseimagebtn(block_id,contentblockid);
        editreplaceimagelink(block_id,contentblockid);
    },1500);
}
export function mulimgcapcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting) {
    let textDecoration=$('#preview-template').contents().find('.templateBody').css("text-decoration-color");
    let contentblockid=replaccon("preview_McBlock_","",block_id);
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
    textSetting2(block_id,droparraysetting,blocksetting,mySlideronc);
    setTimeout(function(){
        createckeditor(block_id,surveystags,assessmentstags,customformstags);
        browseimagebtn(block_id,contentblockid);
        editreplaceimagelink(block_id,contentblockid);
    },1500);
}
export function mulimgonecapcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting) {
    let textDecoration=$('#preview-template').contents().find('.templateBody').css("text-decoration-color");
    let contentblockid=replaccon("preview_McBlock_","",block_id);
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find(".textTdBlock").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight'),color:colstyl.css('color'),textDecoration:textDecoration});
    textSetting2(block_id,droparraysetting,blocksetting,mySlideronc);
    setTimeout(function(){
        createckeditor(block_id,surveystags,assessmentstags,customformstags);
        browseimagebtn(block_id,contentblockid);
        editreplaceimagelink(block_id,contentblockid);
    },1500);
}
export function videocontrol(block_id,droparraysetting,blocksetting) {
    browsevideobtn(block_id,droparraysetting,blocksetting);
}
export function linkcontrol(block_id) {
    let colstyl=$('#preview-template').contents().find('#stgHid');
    $('#preview-template').contents().find('#'+block_id).find("table[class*='TBlock'][data-mc-id='0'] td[class*='TdBlock']").css({fontFamily:colstyl.css('font-family'),fontSize:colstyl.css('font-size'),fontWeight:colstyl.css('font-weight')});
}
/* CKEditor */
function createckeditor(ckediterid,surveystags,assessmentstags,customformstags) {
    let introduction = $("#"+ckediterid).find(".textTdBlock");
    let texffamily = replaccon('"',"",introduction.css('fontFamily')).split(",")[0];
    if(texffamily==='Raleway'){texffamily="Arial";}
    let texfsize = introduction.css('fontSize');
    if(texffamily === ""){
        texffamily = "Arial";
    }
    if(texfsize === ""){
        texfsize = "14px";
    }
    window.CKEDITOR.dtd.$editable.td = 1;
    let tempUser = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	let tempBrandKits = tempUser?.brandKits || [];
    for(let i=0;i<introduction.length;i++) {
        $("#"+introduction[i].id).unbind("click").click(function(){
            let id=$(this).attr("id");
            if(window.CKEDITOR.instances[id]===undefined) {
                window.CKEDITOR.inline(id,{
                    on: {
                        configLoaded: function() {
                            this.config.font_defaultLabel= texffamily;
                            this.config.fontSize_defaultLabel= texfsize;
                            this.config.title = false;
                            this.config.forcePasteAsPlainText = true;
                            this.config.removePlugins = 'tableselection,mergeudfs,mergepropertieslabel,mergepropertiesheader,mergepropertiesfooter,mergeaddsignature';
                            this.config.surveystags = surveystags;
                            this.config.assessmentstags = assessmentstags;
                            this.config.customformstags = customformstags;
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
                    }
                });
                setTimeout(()=>{
                    $("#"+introduction[i].id+" a").unbind("click").click(function(e){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        e.stopPropagation();
                        hidedsm();
                        ckButtonSetting($(this));
                    });
                },1000);
            }
			$("#"+introduction[i].id+" a").unbind("click").click(function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				e.stopPropagation();
                hidedsm();
				ckButtonSetting($(this));
			});
        });
		$("#"+introduction[i].id+" a").unbind("click").click(function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
			e.stopPropagation();
            hidedsm();
			ckButtonSetting($(this));
		});
    }
}
export function createckeditorforheader(){
    $(".ckeditable").unbind("click").click(function(){
        let id=$(this).attr("id");
        if(typeof window.CKEDITOR.instances[id] === "undefined" && id !== "") {
            let tempUser = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	        let tempBrandKits = tempUser?.brandKits || [];
            window.CKEDITOR.inline(id,{
                on: {
                    configLoaded: function() {
                        this.config.title = false;
                        this.config.forcePasteAsPlainText = true;
                        this.config.removePlugins = 'tableselection,mergeudfs,mergesurveys,mergeassessments,mergecustomforms,mergebutton,onchange,mergepropertiestext,mergepropertieslabel,mergepropertiesfooter,mergeaddsignature';
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
                }
            });
        }
    });
}
export function createckeditorforfooter(){
    $(".ckeditable").unbind("click").click(function(){
        let id=$(this).attr("id");
        if(typeof window.CKEDITOR.instances[id] === "undefined" && id !== "") {
            let tempUser = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	        let tempBrandKits = tempUser?.brandKits || [];
            window.CKEDITOR.inline(id,{
                on: {
                    configLoaded: function() {
                        this.config.title = false;
                        this.config.forcePasteAsPlainText = true;
                        this.config.removePlugins = 'tableselection,mergeudfs,mergesurveys,mergeassessments,mergecustomforms,mergebutton,onchange,mergepropertiestext,mergepropertieslabel,mergepropertiesheader,mergeaddsignature';
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
                }
            });
        }
    });
}
function createckeditorforLabel(block_id){
    let introduction = $("#"+block_id).find(".ckeditableLabel");
    window.CKEDITOR.dtd.$editable.td = 1;
    for(let i=0;i<introduction.length;i++) {
        $("#"+introduction[i].id).unbind("click").click(function(){
            let id=$(this).attr("id");
            if (typeof window.CKEDITOR.instances[id] === "undefined" && id !== "") {
                window.CKEDITOR.inline(id, {
                    on: {
                        configLoaded: function () {
                            this.config.title = false;
                            this.config.forcePasteAsPlainText = true;
                            this.config.removePlugins = 'tableselection,mergeudfs,mergesurveys,mergeassessments,mergecustomforms,mergebutton,onchange,mergepropertiestext,mergepropertiesheader,mergepropertiesfooter,mergeaddsignature';
                        },
                        customConfig: 'config.js'
                    }
                });
            }
        });
    }
}
/* CKEditor */
export function blocksettingcommon(block_id,mySlideronc){
    let blockbgclr,blockborclr;
    if($("#"+block_id+" td.listTdBlock").css("background-color")==="rgba(0, 0, 0, 0)") {
        blockbgclr="#ffffff";
    } else {
        blockbgclr=rgb2hex($("#"+block_id+" td.listTdBlock").css("background-color"));
    }
    $("#blockboxbgbox").val(blockbgclr);
    $("#blockboxbgbox").spectrum({
        allowEmpty:true,
        color: blockbgclr,
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
    $("#blockborwid").val($("#"+block_id+" td.listTdBlock").css('border-left-width').replace("px",""));
    $("#blockselectbortsty").val($("#"+block_id+" td.listTdBlock").css('border-left-style'));
    if($("#"+block_id+" td.listTdBlock").css('border-left-style')==="none") {
        blockborclr="#ffffff";
    } else {
        blockborclr=rgb2hex($("#"+block_id+" td.listTdBlock").css('border-left-color'));
    }
    $("#blockboxborderbox").val(blockborclr);
    $("#blockboxborderbox").spectrum({
        allowEmpty:true,
        color: blockborclr,
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
    $("#blockpadleft").val($("#"+block_id+" td.listTdBlock").css('padding-left').replace("px",""));
    $("#blockpadright").val($("#"+block_id+" td.listTdBlock").css('padding-right').replace("px",""));
    $("#blockpadtop").val($("#"+block_id+" td.listTdBlock").css('padding-top').replace("px",""));
    $("#blockpadbottom").val($("#"+block_id+" td.listTdBlock").css('padding-bottom').replace("px",""));
    if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
        $('#blockbtnete').prop('checked',true);
    } else {
        $('#blockbtnete').prop('checked',false);
    }
    $("#blockpadtop,#blockpadright,#blockpadbottom,#blockpadleft").unbind('keyup').keyup(function() {
        if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
            $('#blockbtnete').prop('checked',true);
        } else {
            $('#blockbtnete').prop('checked',false);
        }
        $("#"+block_id+" td.listTdBlock").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
        mySlideronc();
    });
    $('#blockbtnete').unbind('change').change(function(){
        if ($(this).prop('checked')===true){
            $("#blockpadtop").val("0");
            $("#blockpadright").val("0");
            $("#blockpadbottom").val("0");
            $("#blockpadleft").val("0");
        } else {
            $("#blockpadtop").val("5");
            $("#blockpadright").val("5");
            $("#blockpadbottom").val("5");
            $("#blockpadleft").val("5");
        }
        $("#"+block_id+" td.listTdBlock").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
        mySlideronc();
    });
    $("#blockborwid").unbind("keyup").keyup(function(){
        $("#"+block_id+" td.listTdBlock").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#"+block_id+" td.listTdBlock").css('border-style',$("#blockselectbortsty").val());
        mySlideronc();
    });
    $("#blockselectbortsty,#blockboxborderbox").unbind("change").change(function(){
        $("#"+block_id+" td.listTdBlock").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#"+block_id+" td.listTdBlock").css('border-style',$("#blockselectbortsty").val());
        mySlideronc();
    });
    $("#blockboxbgbox").unbind("change").change(function(){
        $("#"+block_id+" td.listTdBlock").css("background-color",$("#blockboxbgbox").val());
        $("#"+block_id+" td.listTdBlock").css('background-clip','padding-box');
        mySlideronc();
    });
    $(".tpl-block-move-up").unbind("click").click(function(){
        if($('#'+block_id).prev("div.mojoMcBlock").length > 0) {
            $(".cke").hide();
            $('#'+block_id).insertBefore($('#'+block_id).prev("div.mojoMcBlock"));
        }
    });
    $(".tpl-block-move-down").unbind("click").click(function(){
        if($('#'+block_id).next("div.mojoMcBlock").length > 0) {
            $(".cke").hide();
            $('#'+block_id).insertAfter($('#'+block_id).next("div.mojoMcBlock"));
        }
    });
}
export function textSetting(block_id,droparraysetting,blocksetting,mySlideronc) {
    $("#"+block_id+" table.textTBlock").unbind("click").click(function(){
        hidedsm();
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["textSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksetting(block_id);
        let rolefor=$("#"+block_id).attr("rolefor");
        let texttargetid,textbgclr,textborclr;
        if(rolefor==="text" || rolefor==="code" || rolefor==="image_+_caption11" || rolefor==="image_card" || rolefor==="image_+_caption" || rolefor==="image_+_caption12" || rolefor==="image_+_caption21" || rolefor==="image_+_caption22" || rolefor==="image_+_caption31" || rolefor==="image_+_caption32" || rolefor==="footer" || rolefor==="image_+_caption_+_h" || rolefor==="image_+_caption12_+_h" || rolefor==="image_+_caption21_+_h" || rolefor==="image_+_caption22_+_h" || rolefor==="image_+_caption31_+_h" || rolefor==="image_+_caption32_+_h") {
            texttargetid=$(this).closest(".textTBlock").attr("data-table-columns");
        } else {
            texttargetid=$(this).closest(".textblockTBlock").attr("data-table-columns");
        }
        $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").focus();
        let id=$("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").attr("id");
        setTimeout(function(){
            $("#cke_"+id).show();
        },100);
        if($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css("background-color")==="rgba(0, 0, 0, 0)") {
            textbgclr="#ffffff";
        } else {
            textbgclr=rgb2hex($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css("background-color"));
        }
        $("#textboxbgbox").val(textbgclr);
        $("#textboxbgbox").spectrum({
            allowEmpty:true,
            color: textbgclr,
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
        $("#textborwid").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-left-width').replace("px",""));
        $("#textselectbortsty").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-left-style'));
        if($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-left-style')==="none") {
            textborclr="#ffffff";
        } else {
            textborclr=rgb2hex($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-left-color'));
        }
        $("#textboxborderbox").val(textborclr);
        $("#textboxborderbox").spectrum({
            allowEmpty:true,
            color: textborclr,
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
        $("#textpadleft").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding-left').replace("px",""));
        $("#textpadright").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding-right').replace("px",""));
        $("#textpadtop").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding-top').replace("px",""));
        $("#textpadbottom").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding-bottom').replace("px",""));
        $("#textlineheight").val($("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('line-height').replace("px",""));
        if($("#textpadtop").val()==="0" && $("#textpadright").val()==="0" && $("#textpadbottom").val()==="0" && $("#textpadleft").val()==="0") {
            $('#textbtnete').prop('checked',true);
        } else {
            $('#textbtnete').prop('checked',false);
        }
        $("#textpadtop,#textpadright,#textpadbottom,#textpadleft").unbind('keyup').keyup(function() {
            if($("#textpadtop").val()==="0" && $("#textpadright").val()==="0" && $("#textpadbottom").val()==="0" && $("#textpadleft").val()==="0") {
                $('#textbtnete').prop('checked',true);
            } else {
                $('#textbtnete').prop('checked',false);
            }
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding',$("#textpadtop").val()+"px "+$("#textpadright").val()+"px "+$("#textpadbottom").val()+"px "+$("#textpadleft").val()+"px");
            mySlideronc();
        });
        $('#textbtnete').unbind('change').change(function(){
            if ($(this).prop('checked')===true){
                $("#textpadtop").val("0");
                $("#textpadright").val("0");
                $("#textpadbottom").val("0");
                $("#textpadleft").val("0");
            } else {
                $("#textpadtop").val("5");
                $("#textpadright").val("5");
                $("#textpadbottom").val("5");
                $("#textpadleft").val("5");
            }
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('padding',$("#textpadtop").val()+"px "+$("#textpadright").val()+"px "+$("#textpadbottom").val()+"px "+$("#textpadleft").val()+"px");
            mySlideronc();
        });
        $("#textlineheight").unbind("keyup").keyup(function(){
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('line-height',$("#textlineheight").val()+"px");
            mySlideronc();
        });
        $("#textborwid").unbind("keyup").keyup(function(){
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border',$("#textborwid").val()+"px "+$("#textselectbortsty").val()+" "+$("#textboxborderbox").val());
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-style',$("#textselectbortsty").val());
            mySlideronc();
        });
        $("#textselectbortsty,#textboxborderbox").unbind("change").change(function(){
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border',$("#textborwid").val()+"px "+$("#textselectbortsty").val()+" "+$("#textboxborderbox").val());
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('border-style',$("#textselectbortsty").val());
            mySlideronc();
        });
        $("#textboxbgbox").unbind("change").change(function(){
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('background-color',$("#textboxbgbox").val());
            $("#"+block_id+" table[data-table-columns="+texttargetid+"] td.textTdBlock").css('background-clip','padding-box');
            mySlideronc();
        });
        $("#"+block_id+" table.textTBlock td.textTdBlock a").unbind("click").click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            e.stopPropagation();
            hidedsm();
            ckButtonSetting($(this));
        });
    });
    $("#"+block_id+" table.textTBlock td.textTdBlock a").unbind("click").click(function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        hidedsm();
        ckButtonSetting($(this));
    });
}
export function textSetting2(block_id,droparraysetting,blocksetting,mySlideronc) {
    $("#"+block_id+" table.textTBlock").unbind("click").click(function(){
        hidedsm();
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["textSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksetting(block_id);
        let texttargetid=$(this).closest(".ImageCardAndCaptionTBlock").attr("data-clo-num");
        $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").focus();
        let id=$("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").attr("id");
        setTimeout(function(){
            $("#cke_"+id).show();
        },100);
        let textbgclr,textborclr;
        if($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css("background-color")==="rgba(0, 0, 0, 0)") {
            textbgclr="#ffffff";
        } else {
            textbgclr=rgb2hex($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css("background-color"));
        }
        $("#textboxbgbox").val(textbgclr);
        $("#textboxbgbox").spectrum({
            allowEmpty:true,
            color: textbgclr,
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
        $("#textborwid").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-left-width').replace("px",""));
        $("#textselectbortsty").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-left-style'));
        if($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-left-style')==="none") {
            textborclr="#ffffff";
        } else {
            textborclr=rgb2hex($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-left-color'));
        }
        $("#textboxborderbox").val(textborclr);
        $("#textboxborderbox").spectrum({
            allowEmpty:true,
            color: textborclr,
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
        $("#textpadleft").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding-left').replace("px",""));
        $("#textpadright").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding-right').replace("px",""));
        $("#textpadtop").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding-top').replace("px",""));
        $("#textpadbottom").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding-bottom').replace("px",""));
        $("#textlineheight").val($("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('line-height').replace("px",""));
        if($("#textpadtop").val()==="0" && $("#textpadright").val()==="0" && $("#textpadbottom").val()==="0" && $("#textpadleft").val()==="0") {
            $('#textbtnete').prop('checked',true);
        } else {
            $('#textbtnete').prop('checked',false);
        }
        $("#textpadtop,#textpadright,#textpadbottom,#textpadleft").unbind('keyup').keyup(function() {
            if($("#textpadtop").val()==="0" && $("#textpadright").val()==="0" && $("#textpadbottom").val()==="0" && $("#textpadleft").val()==="0") {
                $('#textbtnete').prop('checked',true);
            } else {
                $('#textbtnete').prop('checked',false);
            }
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding',$("#textpadtop").val()+"px "+$("#textpadright").val()+"px "+$("#textpadbottom").val()+"px "+$("#textpadleft").val()+"px");
            mySlideronc();
        });
        $('#textbtnete').unbind('change').change(function(){
            if ($(this).prop('checked')===true){
                $("#textpadtop").val("0");
                $("#textpadright").val("0");
                $("#textpadbottom").val("0");
                $("#textpadleft").val("0");
            } else {
                $("#textpadtop").val("5");
                $("#textpadright").val("5");
                $("#textpadbottom").val("5");
                $("#textpadleft").val("5");
            }
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('padding',$("#textpadtop").val()+"px "+$("#textpadright").val()+"px "+$("#textpadbottom").val()+"px "+$("#textpadleft").val()+"px");
            mySlideronc();
        });
        $("#textlineheight").unbind("keyup").keyup(function(){
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('line-height',$("#textlineheight").val()+"px");
            mySlideronc();
        });
        $("#textborwid").unbind("keyup").keyup(function(){
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border',$("#textborwid").val()+"px "+$("#textselectbortsty").val()+" "+$("#textboxborderbox").val());
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-style',$("#textselectbortsty").val());
            mySlideronc();
        });
        $("#textselectbortsty,#textboxborderbox").unbind("change").change(function(){
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border',$("#textborwid").val()+"px "+$("#textselectbortsty").val()+" "+$("#textboxborderbox").val());
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('border-style',$("#textselectbortsty").val());
            mySlideronc();
        });
        $("#textboxbgbox").unbind("change").change(function(){
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('background-color',$("#textboxbgbox").val());
            $("#"+block_id+" table[data-clo-num="+texttargetid+"] td.textTdBlock").css('background-clip','padding-box');
            mySlideronc();
        });
    });
}
export function dividerSettingCommon(block_id){
    $("#dvdborwid").val($("#"+block_id+" table.dividerTBlock").css('border-top-width').replace("px",""));
    $("#dvdborwidth").val($("#"+block_id+" table.dividerTBlock").attr('width').replace("px","")).val($("#"+block_id+" table.dividerTBlock").attr('width').replace("%",""));
    $("#dvdselectbortsty").val($("#"+block_id+" table.dividerTBlock").css('border-top-style'));
    let dvdclr=rgb2hex($("#"+block_id+" table.dividerTBlock").css('border-top-color'));
    $("#dvdboxborderbox").val(dvdclr);
    $("#dvdboxborderbox").spectrum({
        allowEmpty:true,
        color: dvdclr,
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
    $("#dvdborwid").unbind('keyup').keyup(function() {
        $("#"+block_id+" table.dividerTBlock").css('border-top',$("#dvdborwid").val()+"px "+$("#dvdselectbortsty").val()+" "+$("#dvdboxborderbox").val());
    });
    $("#dvdselectbortsty,#dvdboxborderbox").unbind('change').change(function() {
        $("#"+block_id+" table.dividerTBlock").css('border-top',$("#dvdborwid").val()+"px "+$("#dvdselectbortsty").val()+" "+$("#dvdboxborderbox").val());
    });
}
export function settingSocialFooter(droparraysetting,droparray,savefullcontent) {
    $("#pagefooter").find("td.followIconTdBlock a").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#pagefooter").find("td.followTextTdBlock a").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#pagefooter table.socialFollowItemTBlock").unbind("click").click(function(e){
        e.stopPropagation();
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#dsmcsetting").html(droparraysetting["socialSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksettingfooter(droparray,savefullcontent);
        let socialcontrolname = $(this).attr("data-share-rolefor");
        if(socialcontrolname === "phones"){
            let options = '';
            getCountry().then(res => {
                if (res.status === 200) {
                    res.result.country.map(x => (
                        options += '<option value="'+x.cntCode+'">'+x.cntName+'</option>'
                    ));
                    $("#dsmcsetting").find("div.form-group:first-of-type").before('<div class="form-group"><label>Country</label><select id="socialcountry" class="mb-0">'+options+'</select></div>');
                    if(typeof $(this).find("td.followIconTdBlock a").attr("data-cntrycode") !== "undefined"){
                        $("#socialcountry").val($(this).find("td.followIconTdBlock a").attr("data-cntrycode"));
                    }
                    $("#socialcountry").unbind("change").change(function(){
                        $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","tel:"+$(this).val()+$("#socialurl").val()).attr("data-cntrycode",$(this).val());
                        $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","tel:"+$(this).val()+$("#socialurl").val()).attr("data-cntrycode",$(this).val());
                    }).trigger("change");
                }
            });
        }
        if(socialcontrolname === "emails"){
            $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href").replaceAll("mailto:",""));
        } else if(socialcontrolname === "phones"){
            if(typeof $(this).find("td.followIconTdBlock a").attr("data-url") !== "undefined"){
                $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("data-url").replaceAll("tel:",""));
            } else {
                $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href").replaceAll("tel:",""));
            }
        } else {
            $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href"));
        }
        $("#socialtitle").val($(this).find("td.followTextTdBlock a").text());
        let socialcontrolname1=socialcontrolname;
        if(socialcontrolname==="tweet") {
            socialcontrolname1="twitter";
        }
        if(socialcontrolname==="website") {
            socialcontrolname1="link";
        }
        let imageUrl = $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"] img').attr("src");
        let scolor,sdark,sgray,slight,soutlinecolor,soutlinedark,soutlinegray,soutlinelight;
        scolor=sdark=sgray=slight=soutlinecolor=soutlinedark=soutlinegray=soutlinelight="";
        if(imageUrl===siteURL+"/img/icons/color-"+socialcontrolname1+"-48.png") {
            scolor="active";
        }
        if(imageUrl===siteURL+"/img/icons/dark-"+socialcontrolname1+"-48.png") {
            sdark="active";
        }
        if(imageUrl===siteURL+"/img/icons/gray-"+socialcontrolname1+"-48.png") {
            sgray="active";
        }
        if(imageUrl===siteURL+"/img/icons/light-"+socialcontrolname1+"-48.png") {
            slight="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-color-"+socialcontrolname1+"-48.png") {
            soutlinecolor="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-dark-"+socialcontrolname1+"-48.png") {
            soutlinedark="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-gray-"+socialcontrolname1+"-48.png") {
            soutlinegray="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-light-"+socialcontrolname1+"-48.png") {
            soutlinelight="active";
        }
        $("#socialstyleicon").html("<img class='"+scolor+"' src='"+siteURL+"/img/icons/color-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+sdark+"' src='"+siteURL+"/img/icons/dark-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+sgray+"' src='"+siteURL+"/img/icons/gray-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+slight+"' src='"+siteURL+"/img/icons/light-"+socialcontrolname1+"-48.png' alt='social'/><br/><img class='"+soutlinecolor+"' src='"+siteURL+"/img/icons/outline-color-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinedark+"' src='"+siteURL+"/img/icons/outline-dark-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinegray+"' src='"+siteURL+"/img/icons/outline-gray-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinelight+"' src='"+siteURL+"/img/icons/outline-light-"+socialcontrolname1+"-48.png' alt='social'/>");
        showdsm("social");
        $("#socialurl").unbind("keyup").keyup(function(){
            if(socialcontrolname === "emails"){
                $("#socialurl").val($("#socialurl").val().replaceAll("mailto:",""));
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","mailto:"+$("#socialurl").val().replaceAll("mailto:",""));
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","mailto:"+$("#socialurl").val().replaceAll("mailto:",""));
            } else if(socialcontrolname === "phones"){
                $("#socialurl").val($("#socialurl").val().replaceAll("tel:",""));
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","tel:"+$("#socialcountry").val()+$("#socialurl").val().replaceAll("tel:","")).attr("data-url",$("#socialurl").val().replaceAll("tel:",""));
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","tel:"+$("#socialcountry").val()+$("#socialurl").val().replaceAll("tel:","")).attr("data-url",$("#socialurl").val().replaceAll("tel:",""));
            } else {
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href",$("#socialurl").val());
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href",$("#socialurl").val());
            }
        });
        $("#socialtitle").unbind("keyup").keyup(function(){
            $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').text($("#socialtitle").val());
        });
        $("#socialstyleicon img").unbind("click").click(function(){
            if($(this).hasClass("active")===false) {
                $("#socialstyleicon img").removeClass("active");
                $(this).addClass("active");
                $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"] img').attr("src",$("#socialstyleicon img.active").attr("src"));
            }
        });
        $(".tpl-social-delete").unbind("click").click(function(){
            $("#pagefooter").find('table[data-share-rolefor="'+socialcontrolname+'"]').remove();
            savefullcontent();
            hidedsm();
        });
    });
}
function settingSocial(block_id,droparraysetting,blocksetting,savefullcontent) {
    $("#"+block_id).find("td.followIconTdBlock a").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#"+block_id).find("td.followTextTdBlock a").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#"+block_id+" table.socialFollowItemTBlock").unbind("click").click(function(){
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["socialSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksetting(block_id);
        let socialcontrolname = $(this).attr("data-share-rolefor");
        if(socialcontrolname === "phones"){
            let options = '';
            getCountry().then(res => {
                if (res.status === 200) {
                    res.result.country.map(x => (
                        options += '<option value="'+x.cntCode+'">'+x.cntName+'</option>'
                    ));
                    $("#dsmcsetting").find("div.form-group:first-of-type").before('<div class="form-group"><label>Country</label><select id="socialcountry" class="mb-0">'+options+'</select></div>');
                    if(typeof $(this).find("td.followIconTdBlock a").attr("data-cntrycode") !== "undefined"){
                        $("#socialcountry").val($(this).find("td.followIconTdBlock a").attr("data-cntrycode"));
                    }
                    $("#socialcountry").unbind("change").change(function(){
                        $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","tel:"+$(this).val()+$("#socialurl").val()).attr("data-cntrycode",$(this).val());
                        $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","tel:"+$(this).val()+$("#socialurl").val()).attr("data-cntrycode",$(this).val());
                    }).trigger("change");
                }
            });
        }
        if(socialcontrolname === "emails"){
            $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href").replaceAll("mailto:",""));
        } else if(socialcontrolname === "phones"){
            if(typeof $(this).find("td.followIconTdBlock a").attr("data-url") !== "undefined"){
                $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("data-url").replaceAll("tel:",""));
            } else {
                $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href").replaceAll("tel:",""));
            }
        } else {
            $("#socialurl").val($(this).find("td.followIconTdBlock a").attr("href"));
        }
        $("#socialtitle").val($(this).find("td.followTextTdBlock a").text());
        let socialcontrolname1=socialcontrolname;
        if(socialcontrolname==="tweet") {
            socialcontrolname1="twitter";
        }
        if(socialcontrolname==="website") {
            socialcontrolname1="link";
        }
        let imageUrl = $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"] img').attr("src");
        let scolor,sdark,sgray,slight,soutlinecolor,soutlinedark,soutlinegray,soutlinelight;
        scolor=sdark=sgray=slight=soutlinecolor=soutlinedark=soutlinegray=soutlinelight="";
        if(imageUrl===siteURL+"/img/icons/color-"+socialcontrolname1+"-48.png") {
            scolor="active";
        }
        if(imageUrl===siteURL+"/img/icons/dark-"+socialcontrolname1+"-48.png") {
            sdark="active";
        }
        if(imageUrl===siteURL+"/img/icons/gray-"+socialcontrolname1+"-48.png") {
            sgray="active";
        }
        if(imageUrl===siteURL+"/img/icons/light-"+socialcontrolname1+"-48.png") {
            slight="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-color-"+socialcontrolname1+"-48.png") {
            soutlinecolor="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-dark-"+socialcontrolname1+"-48.png") {
            soutlinedark="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-gray-"+socialcontrolname1+"-48.png") {
            soutlinegray="active";
        }
        if(imageUrl===siteURL+"/img/icons/outline-light-"+socialcontrolname1+"-48.png") {
            soutlinelight="active";
        }
        $("#socialstyleicon").html("<img class='"+scolor+"' src='"+siteURL+"/img/icons/color-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+sdark+"' src='"+siteURL+"/img/icons/dark-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+sgray+"' src='"+siteURL+"/img/icons/gray-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+slight+"' src='"+siteURL+"/img/icons/light-"+socialcontrolname1+"-48.png' alt='social'/><br/><img class='"+soutlinecolor+"' src='"+siteURL+"/img/icons/outline-color-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinedark+"' src='"+siteURL+"/img/icons/outline-dark-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinegray+"' src='"+siteURL+"/img/icons/outline-gray-"+socialcontrolname1+"-48.png' alt='social'/><img class='"+soutlinelight+"' src='"+siteURL+"/img/icons/outline-light-"+socialcontrolname1+"-48.png' alt='social'/>");
        showdsm("social");
        $("#socialurl").unbind("keyup").keyup(function(){
            if(socialcontrolname === "emails"){
                $("#socialurl").val($("#socialurl").val().replaceAll("mailto:",""));
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","mailto:"+$("#socialurl").val().replaceAll("mailto:",""));
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","mailto:"+$("#socialurl").val().replaceAll("mailto:",""));
            } else if(socialcontrolname === "phones"){
                $("#socialurl").val($("#socialurl").val().replaceAll("tel:",""));
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href","tel:"+$("#socialcountry").val()+$("#socialurl").val().replaceAll("tel:","")).attr("data-url",$("#socialurl").val().replaceAll("tel:",""));
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href","tel:"+$("#socialcountry").val()+$("#socialurl").val().replaceAll("tel:","")).attr("data-url",$("#socialurl").val().replaceAll("tel:",""));
            } else {
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"]').attr("href",$("#socialurl").val());
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').attr("href",$("#socialurl").val());
            }
        });
        $("#socialtitle").unbind("keyup").keyup(function(){
            $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayText td a').text($("#socialtitle").val());
        });
        $("#socialstyleicon img").unbind("click").click(function(){
            if($(this).hasClass("active")===false) {
                $("#socialstyleicon img").removeClass("active");
                $(this).addClass("active");
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"] tr.displayIcon td a[target="_blank"] img').attr("src",$("#socialstyleicon img.active").attr("src"));
            }
        });
        $(".tpl-social-delete").unbind("click").click(function(){
            let c=$("#"+block_id).find("table.socialFollowItemTBlock").length;
            if(c===1) {
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"]').remove();
                $("#"+block_id).remove();
                emtmsedisplay();
                savefullcontent();
                hidedsm();
            } else {
                $("#"+block_id).find('table[data-share-rolefor="'+socialcontrolname+'"]').remove();
                hidedsm();
            }
        });
    });
}
export function buttonSetting(block_id,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags) {
    linkcontrol(block_id);
    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#"+block_id+" table.genericlinkTBlock").unbind("click").click(function(){
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["buttonSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        blocksetting(block_id);
        let genurl=$("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href");
        let url=$("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href");
        let si,v,clr,txtclr;
        if(typeof genurl!=="undefined") {
            if(genurl.indexOf("/survey") !== -1){
                $("#dsmgenbtntype").val("survey");
                $("#dsmurllink").html('<div class="form-group"><label>Select Survey</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                for (let this_tag in surveystags){
                    $("#dsmsel").append('<option value="'+surveystags[this_tag][1]+'">'+surveystags[this_tag][1]+'</option>');
                }
                si=surveystags.findIndex(function(el) { return el.includes(genurl); });
                $('#dsmurl').val(genurl);
                $('#dsmurldiv').html(genurl);
                if(si !== -1){
                    $("#dsmsel").val(surveystags[si][1]);
                    $('#dsmgentitle').val(surveystags[si][1]);
                } else {
                    $('#dsmgentitle').val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html());
                    $("#clickError").attr("data-type","Error");
					$("#clickError").val("This survey is no longer because it is deleted.");
					$("#clickError").trigger("click");
                }
                $("#dsmsel").unbind("click").click(function() {
                    $("#dsmsel").val($(this).val());
                    $('#dsmgentitle').val($(this).val());
                    v=$(this).val();
                    si=surveystags.findIndex(function(el) { return el.includes(v); });
                    url=surveystags[si][0];
                    $('#dsmurl').val(surveystags[si][0]);
                    $('#dsmurldiv').html(surveystags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",surveystags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                });
            } else if(genurl.indexOf("assessment") !== -1){
                $("#dsmgenbtntype").val("assessment");
                $("#dsmurllink").html('<div class="form-group"><label>Select Assessment</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                for (let this_tag in assessmentstags){
                    $("#dsmsel").append('<option value="'+assessmentstags[this_tag][1]+'">'+assessmentstags[this_tag][1]+'</option>');
                }
                si=assessmentstags.findIndex(function(el) { return el.includes(genurl); });
                $("#dsmsel").val(assessmentstags[si][1]);
                $('#dsmgentitle').val(assessmentstags[si][1]);
                if(si !== -1){
                    $('#dsmurl').val(genurl);
                    $('#dsmurldiv').html(genurl);
                } else {
                    $('#dsmgentitle').val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html());
                    $("#clickError").attr("data-type","Error");
					$("#clickError").val("This assessment is no longer because it is deleted.");
					$("#clickError").trigger("click");
                }
                $("#dsmsel").unbind("click").click(function() {
                    $("#dsmsel").val($(this).val());
                    $('#dsmgentitle').val($(this).val());
                    v=$(this).val();
                    si=assessmentstags.findIndex(function(el) { return el.includes(v); });
                    url=assessmentstags[si][0];
                    $('#dsmurl').val(assessmentstags[si][0]);
                    $('#dsmurldiv').html(assessmentstags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",assessmentstags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                });
            } else if(genurl.indexOf("customform") !== -1){
                $("#dsmgenbtntype").val("customform");
                $("#dsmurllink").html('<div class="form-group"><label>Select Custom Form</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                for (let this_tag in customformstags){
                    $("#dsmsel").append('<option value="'+customformstags[this_tag][1]+'">'+customformstags[this_tag][1]+'</option>');
                }
                si=customformstags.findIndex(function(el) { return el.includes(genurl); });
                $('#dsmurl').val(genurl);
                $('#dsmurldiv').html(genurl);
                if(si !== -1){
                    $("#dsmsel").val(customformstags[si][1]);
                    $('#dsmgentitle').val(customformstags[si][1]);
                } else {
                    $('#dsmgentitle').val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html());
                    $("#clickError").attr("data-type","Error");
					$("#clickError").val("This form is no longer because it is deleted.");
					$("#clickError").trigger("click");
                }
                $("#dsmsel").unbind("click").click(function() {
                    $("#dsmsel").val($(this).val());
                    $('#dsmgentitle').val($(this).val());
                    v=$(this).val();
                    si=customformstags.findIndex(function(el) { return el.includes(v); });
                    url=customformstags[si][0];
                    $('#dsmurl').val(customformstags[si][0]);
                    $('#dsmurldiv').html(customformstags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",customformstags[si][0]);
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                });
            } else {
                if(genurl.substr(0, 7)==='http://') {
                    $("#dsmgenurlset").val('http://');
                    genurl=genurl.replace("http://", "");
                    $("#dsmgenurl").val(genurl);
                }
                if(genurl.substr(0, 8)==='https://') {
                    $("#dsmgenurlset").val('https://');
                    genurl=genurl.replace("https://", "");
                    $("#dsmgenurl").val(genurl);
                }
                $("#dsmgentitle").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").text());
                $("#dsmgenurlset").unbind("change").change(function() {
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, ''));
                    url=$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, '');
                });
                $("#dsmgenurl").unbind("keyup").keyup(function() {
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, ''));
                    url=$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, '');
                });
            }
        } else {
            $("#dsmgenurlset").val('http://');
            $("#dsmgenurl").val("");
            $("#dsmgentitle").val("");
        }

        $("#dsmgenbtntype").unbind("change").change(function() {
            let genurl=$("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href");
            if($(this).val()==="genericlink") {
                $("#dsmurllink").html('<div class="form-group"><label class="display-inline-block" style="vertical-align: top;">URL&nbsp;&nbsp;</label><select id="dsmgenurlset" class="form-control display-inline-block"><option value="http://">http://</option><option value="https://">https://</option></select><input class="form-control" type="text" placeholder="Url" id="dsmgenurl" value="http://www.example.com"></div>');
                $("#dsmgentitle").val("Button");
                $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href","www.example.com");
                $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html("Button");
                $("#dsmgenurlset").unbind("change").change(function() {
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, ''));
                    url=$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, '');
                });
                $("#dsmgenurl").unbind("keyup").keyup(function() {
                    $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, ''));
                    url=$("#dsmgenurlset").val()+$("#dsmgenurl").val().replace(/(^\w+:|^)\/\//, '');
                });
            }
            if($(this).val()==="survey" && typeof genurl!=="undefined" && genurl.indexOf("/survey") === -1) {
                if(surveystags.length>0) {
                    $("#dsmurllink").html('<div class="form-group"><label>Select Survey</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                    for (let this_tag in surveystags){
                        $("#dsmsel").append('<option value="'+surveystags[this_tag][1]+'">'+surveystags[this_tag][1]+'</option>');
                    }
                    $("#dsmsel").val(surveystags[0][1]);
                    $('#dsmgentitle').val(surveystags[0][1]);
                    $('#dsmurl').val(surveystags[0][0]);
                    $('#dsmurldiv').html(surveystags[0][0]);
                    url=surveystags[0][0];
                    $("#dsmsel").unbind("click").click(function() {
                        $("#dsmsel").val($(this).val());
                        $('#dsmgentitle').val($(this).val());
                        v=$(this).val();
                        si=surveystags.findIndex(function(el) { return el.includes(v); });
                        url=surveystags[si][0];
                        $('#dsmurl').val(surveystags[si][0]);
                        $('#dsmurldiv').html(surveystags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",surveystags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                    }).trigger("click");
                }
            }
            if($(this).val()==="assessment" && typeof genurl!=="undefined" && genurl.indexOf("assessment") === -1) {
                if(assessmentstags.length>0) {
                    $("#dsmurllink").html('<div class="form-group"><label>Select Assessment</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                    for (let this_tag in assessmentstags){
                        $("#dsmsel").append('<option value="'+assessmentstags[this_tag][1]+'">'+assessmentstags[this_tag][1]+'</option>');
                    }
                    $("#dsmsel").val(assessmentstags[0][1]);
                    $('#dsmgentitle').val(assessmentstags[0][1]);
                    $('#dsmurl').val(assessmentstags[0][0]);
                    $('#dsmurldiv').html(assessmentstags[0][0]);
                    url=assessmentstags[0][0];
                    $("#dsmsel").unbind("click").click(function() {
                        $("#dsmsel").val($(this).val());
                        $('#dsmgentitle').val($(this).val());
                        v=$(this).val();
                        si=assessmentstags.findIndex(function(el) { return el.includes(v); });
                        url=assessmentstags[si][0];
                        $('#dsmurl').val(assessmentstags[si][0]);
                        $('#dsmurldiv').html(assessmentstags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",assessmentstags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                    }).trigger("click");
                }
            }
            if($(this).val()==="customform" && typeof genurl!=="undefined" && genurl.indexOf("customform") === -1) {
                if(customformstags.length>0) {
                    $("#dsmurllink").html('<div class="form-group"><label>Select Custom Form</label><select id="dsmsel"></select></div><div class="form-group"><label style="display: inline-block; padding-bottom: 0px;">URL : </label><div id="dsmurldiv"></div><input class="form-control" placeholder="Url" id="dsmurl" type="hidden"></div>');
                    for (let this_tag in customformstags){
                        $("#dsmsel").append('<option value="'+customformstags[this_tag][1]+'">'+customformstags[this_tag][1]+'</option>');
                    }
                    $("#dsmsel").val(customformstags[0][1]);
                    $('#dsmgentitle').val(customformstags[0][1]);
                    $('#dsmurl').val(customformstags[0][0]);
                    $('#dsmurldiv').html(customformstags[0][0]);
                    url=customformstags[0][0];
                    $("#dsmsel").unbind("click").click(function() {
                        $("#dsmsel").val($(this).val());
                        $('#dsmgentitle').val($(this).val());
                        v=$(this).val();
                        si=customformstags.findIndex(function(el) { return el.includes(v); });
                        url=customformstags[si][0];
                        $('#dsmurl').val(customformstags[si][0]);
                        $('#dsmurldiv').html(customformstags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr("href",customformstags[si][0]);
                        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($(this).val());
                    }).trigger("click");
                }
            }
        });
        $("#dsmgentitle").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").html($("#dsmgentitle").val());
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        let btnbaccol;
        if($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("background-color")==="rgba(0, 0, 0, 0)") {
            btnbaccol="#6c757d";
        } else {
            btnbaccol=rgb2hex($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("background-color"));
        }
        $("#dsmgenbackclrbox").val(btnbaccol);
        $("#dsmgenbackclrbox").spectrum({
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
                    clr='transparent';
                } else {
                    clr=color.toHexString();
                }
                $("#dsmgenbackclrbox").val(clr);
                $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
            },
            chooseText: "Select",
            palette: []
        });
        let btntextcol=rgb2hex($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("color"));
        $("#dsmgentextclrbox").val(btntextcol);
        $("#dsmgentextclrbox").spectrum({
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
                    txtclr='transparent';
                } else {
                    txtclr=color.toHexString();
                }
                $("#dsmgentextclrbox").val(txtclr);
                $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
            },
            chooseText: "Select",
            palette: []
        });
        $("#dsmgenbtnsty input[type='radio']").unbind("change").change(function() {
            if($('#dsmgenbtncus').is(':checked')) {
                $("#dsmgenbtnwthbox").css("display","inline-block");
                $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css({'width':$("#dsmgenbtnwth").val()});
            }
            if($('#dsmgenbtndef').is(':checked')) {
                $("#dsmgenbtnwthbox").css("display","none");
                $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css({'width':""});
            }
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnwth").bind("keyup").keyup(function() {
            if(parseInt($("#dsmgenbtnwth").val())>300) {
                $("#dsmgenbtnwth").val("300");
            }
            $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css({'width':$("#dsmgenbtnwth").val()});
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $('input[name="dsmgenbtnposgrp"]').unbind("change").change(function(){
            $("#"+block_id+" td.genericlinkTdBlock").css("text-align",$(this).val());
        });
        $('input[name="dsmgenbtnstygrp"]').unbind("change").change(function(){
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnbrdsty").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("border-left-style"));
        $("#dsmgenbtnbrdsty").unbind("change").change(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnbrdsize").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("border-left-width").replace("px",""));
        $("#dsmgenbtnbrdsize").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        let btnbrdclr=rgb2hex($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("border-left-color"));
        $("#dsmgenbtnbrdclrbox").val(btnbrdclr);
        $("#dsmgenbtnbrdclrbox").spectrum({
            allowEmpty:true,
            color: btnbrdclr,
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
                    clr='transparent';
                } else {
                    clr=color.toHexString();
                }
                $("#dsmgenbtnbrdclrbox").val(clr);
                $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
            },
            chooseText: "Select",
            palette: []
        });
        $("#dsmgenbtnbrdradius").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("border-radius").replace("px",""));
        $("#dsmgenbtnbrdradius").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnpadtop").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("padding-top").replace("px",""));
        $("#dsmgenbtnpadtop").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnpadbottom").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("padding-bottom").replace("px",""));
        $("#dsmgenbtnpadbottom").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnpadleft").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("padding-left").replace("px",""));
        $("#dsmgenbtnpadleft").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        $("#dsmgenbtnpadright").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("padding-right").replace("px",""));
        $("#dsmgenbtnpadright").unbind("keyup").keyup(function() {
            $("#"+block_id+" td.genericlinkTdBlock").html(buttonLinkGenerate(url,block_id));
        });
        let pos=$("#"+block_id+" td.genericlinkTdBlock").css("text-align");
        $('input[name="dsmgenbtnposgrp"][value="'+pos+'"]').trigger("click");
        if($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr('style').indexOf(';width')!==-1 || $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").attr('style').indexOf('; width')!==-1) {
            $("#dsmgenbtnwth").val($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("width").replace("px",""));
            $("#dsmgenbtncus").trigger("click");
        } else {
            $("#dsmgenbtndef").trigger("click");
        }
        if($("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").css("background-color")==="rgba(0, 0, 0, 0)") {
            $("#dsmgenbtnout").trigger("click");
        } else {
            $("#dsmgenbtnsol").trigger("click");
        }
        showdsm("button");
        $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").unbind("click").click(function(e) {
            e.preventDefault();
        });
    });
}
function buttonLinkGenerate(url,block_id) {
    let ws,sty,sty2,ae,temptxtclr;
    let title = $("#dsmgentitle").val();
    let color = $("#dsmgenbackclrbox").val();
    let wstyle = $('input[name="dsmgenbtngrp"]:checked').val();
    let width = $("#"+block_id+" td.genericlinkTdBlock a[target='_blank']").width();
    let style = $('input[name="dsmgenbtnstygrp"]:checked').val();
    let textcolor = $("#dsmgentextclrbox").val();
    let brdsty = $("#dsmgenbtnbrdsty").val();
    let brdsize = $("#dsmgenbtnbrdsize").val();
    let brdcolor = $("#dsmgenbtnbrdclrbox").val();
    let brdradius = $("#dsmgenbtnbrdradius").val();
    let padtop = $("#dsmgenbtnpadtop").val();
    let padbottom = $("#dsmgenbtnpadbottom").val();
    let padleft = $("#dsmgenbtnpadleft").val();
    let padright = $("#dsmgenbtnpadright").val();
    let padding = padtop+"px "+padright+"px "+padbottom+"px "+padleft+"px";
    if(wstyle==="c") {
        ws="width:"+parseInt(width+parseInt(padleft)+parseInt(padright)+Math.ceil(brdsize*2))+"px;";
    } else {
        ws="";
    }
    let gtw = parseInt(width+parseInt(padleft)+parseInt(padright)+Math.ceil(brdsize*2));
    if(style==="sol") {
        temptxtclr = (typeof textcolor !== "undefined" && textcolor !== "" && textcolor !== null) ? textcolor : "#FFFFFF";
        sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;mso-border-right-alt: none #FFFFFF 0;mso-border-bottom-alt: none #FFFFFF 0;mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';border-radius: '+brdradius+'px;text-decoration: none !important;cursor: pointer;color: '+temptxtclr+';background-color: '+color+';border-style: '+brdsty+';border-width: '+brdsize+'px;border-color: '+brdcolor+';'+ws+'"';
        sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;border-radius: '+brdradius+'px;text-decoration: none !important;cursor: pointer;color: '+temptxtclr+';background-color: '+color+';border-style: '+brdsty+';border-width: '+brdsize+'px;border-color: '+brdcolor+';"';
        ae=' <!--[if true]><table role="presentation" width="'+gtw+'" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+gtw+'"><![endif]--><a target="_blank" width="'+gtw+'" href="'+url+'" '+sty+'>'+title+'</a><!--[if true]></td></tr></table><![endif]-->';
    }
    if(style==="out") {
        temptxtclr = (typeof textcolor !== "undefined" && textcolor.toLowerCase() !== "#FFFFFF".toLowerCase() && textcolor.toLowerCase() !== "#FFF".toLowerCase() && textcolor !== null) ? textcolor : color;
        sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;mso-border-right-alt: none #FFFFFF 0;mso-border-bottom-alt: none #FFFFFF 0;mso-border-left-alt: none #FFFFFF 0;mso-border-top-alt: none #FFFFFF 0;padding: '+padding+';border-radius: '+brdradius+'px;text-decoration: none !important;cursor: pointer;color: '+temptxtclr+';background-color: transparent;border-style: '+brdsty+';border-width: '+brdsize+'px;border-color: '+brdcolor+';'+ws+'"';
        sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;border-radius: '+brdradius+'px;text-decoration: none !important;cursor: pointer;color: '+temptxtclr+';background-color: transparent;border-style: '+brdsty+';border-width: '+brdsize+'px;border-color: '+brdcolor+';"';
        ae=' <!--[if true]><table role="presentation" width="'+gtw+'" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+gtw+'"><![endif]--><a target="_blank" width="'+gtw+'" href="'+url+'" '+sty+'>'+title+'</a><!--[if true]></td></tr></table><![endif]-->';
    }
    return ae;
}
export function attachmentSetting(block_id,droparraysetting,blocksetting) {
    $("#"+block_id+" td.attachmentTdBlock a[target='_blank']").unbind("click").click(function(e) {
        e.preventDefault();
    });
    $("#"+block_id+" table.attachmentTBlock").unbind("click").click(function(){
        $(".mojoMcBlock.tpl-block").removeClass("active");
        $("#"+block_id).addClass("active");
        $("#dsmcsetting").html(droparraysetting["attachmentSettingBlockEditor"]);
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#cbutton").trigger("click");
        $('input[name="dsmattchposgrp"]').unbind("change").change(function(){
            $("#"+block_id+" td.attachmentTdBlock").css("text-align",$(this).val());
        });
        let pos=$("#"+block_id+" td.attachmentTdBlock").css("text-align");
        $('input[name="dsmattchposgrp"][value="'+pos+'"]').trigger("click");
        blocksetting(block_id);
        showdsm("attachment");
        $('.tpl-attachment-edit').unbind("click").click(function () {
            filemanager(block_id,"attachment","attachment","","");
            hidedsm();
        });
    });
}
export function editreplaceimagelinkcommon(block_id,mySlideronc,t){
    let align, imgbaccol, imgpadtop, imgpadright, imgpadbottom, imgpadleft, imgurl;
    if ($("#" + block_id).attr("rolefor") === "image_group" || $("#" + block_id).attr("rolefor") === "image_group_3h" || $("#" + block_id).attr("rolefor") === "image_group_3s" || $("#" + block_id).attr("rolefor") === "image_group_2h" || $("#" + block_id).attr("rolefor") === "image_group_2s") {
        let u = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img");
        $("#imgactsize").html(u[0].naturalWidth + " x " + u[0].naturalHeight);
        $("#imgdissize").html(u[0].width + " x " + u[0].height);
        $("#imgtxtwidth").val(u[0].width);
        $("#imgtxtheight").val(u[0].height);
        align = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("align");
        if (align === "middle") {
            align = "center";
        }
        $('input[name="imgbtnposgrp"][value="' + align + '"]').prop('checked', true);
        if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('background-color') === "rgba(0, 0, 0, 0)") {
            imgbaccol = rgb2hex("rgb(255, 255, 255)");
        } else {
            imgbaccol = rgb2hex($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('background-color'));
        }
        imgpadtop = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('padding-top').replace("px", "");
        imgpadright = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('padding-right').replace("px", "");
        imgpadbottom = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('padding-bottom').replace("px", "");
        imgpadleft = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css('padding-left').replace("px", "");
        $(".imgwidthdis").html($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css("width").replace("px", "") - imgpadleft - imgpadright);
        imgurl = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock a").attr("href");
        if (typeof $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("aspectratio") === "undefined") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("aspectratio", "yes");
        } else if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("aspectratio") === "yes") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
        } else {
            $("#imgbtnar").prop('checked', '');
            $("#linkicondiv .separator").addClass("separatorhide");
            $("#linkicon").attr("title", "Click To Set Constrain Proportions");
        }
        $("#linkicondiv").unbind("click").click(function () {
            if ($("#imgbtnar").prop('checked') === true) {
                $("#imgbtnar").prop('checked', '');
                $("#linkicondiv .separator").addClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Set Constrain Proportions");
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("aspectratio", "no");
            } else {
                $("#imgbtnar").prop('checked', 'checked');
                $("#linkicondiv .separator").removeClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Unset Constrain Proportions");
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("aspectratio", "yes");
            }
        });
        $('input[name="imgbtnposgrp"]').unbind("change").change(function () {
            if (typeof $('input[name="imgbtnposgrp"]:checked').val() !== "undefined") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
            }
        }).trigger("change");
        $('#imagebackclrbox').unbind('change').change(function () {
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css("background-color", $("#imagebackclrbox").val());
        });
        $('#imageurlset').unbind('change').change(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imageurl").unbind('keyup').keyup(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imgpadtop,#imgpadright,#imgpadbottom,#imgpadleft").unbind('keyup').keyup(function () {
            if ($("#imgpadtop").val() === "0" && $("#imgpadright").val() === "0" && $("#imgpadbottom").val() === "0" && $("#imgpadleft").val() === "0") {
                $('#imgbtnete').prop('checked', true);
            } else {
                $('#imgbtnete').prop('checked', false);
            }
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
        $('#imgbtnete').unbind('change').change(function () {
            if ($(this).prop('checked') === true) {
                $("#imgpadtop").val("0");
                $("#imgpadright").val("0");
                $("#imgpadbottom").val("0");
                $("#imgpadleft").val("0");
            } else {
                $("#imgpadtop").val("5");
                $("#imgpadright").val("5");
                $("#imgpadbottom").val("5");
                $("#imgpadleft").val("5");
            }
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
    } else if (($("#" + block_id).attr("rolefor") === "image_+_caption21") || ($("#" + block_id).attr("rolefor") === "image_+_caption22") || ($("#" + block_id).attr("rolefor") === "image_+_caption31") || ($("#" + block_id).attr("rolefor") === "image_+_caption32") || ($("#" + block_id).attr("rolefor") === "image_+_caption21_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption22_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption31_+_h") || ($("#" + block_id).attr("rolefor") === "image_+_caption32_+_h") || ($("#" + block_id).attr("rolefor") === "2image_+_2caption") || ($("#" + block_id).attr("rolefor") === "3image_+_3caption") || ($("#" + block_id).attr("rolefor") === "2image_+_1caption1") || ($("#" + block_id).attr("rolefor") === "2image_+_1caption2")) {
        let u = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img");
        $("#imgactsize").html(u[0].naturalWidth + " x " + u[0].naturalHeight);
        $("#imgdissize").html(u[0].width + " x " + u[0].height);
        $("#imgtxtwidth").val(u[0].width);
        $("#imgtxtheight").val(u[0].height);
        align = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("align");
        if (align === "middle") {
            align = "center";
        }
        $('input[name="imgbtnposgrp"][value="' + align + '"]').prop('checked', true);
        if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('background-color') === "rgba(0, 0, 0, 0)") {
            imgbaccol = rgb2hex("rgb(255, 255, 255)");
        } else {
            imgbaccol = rgb2hex($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('background-color'));
        }
        imgpadtop = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('padding-top').replace("px", "");
        imgpadright = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('padding-right').replace("px", "");
        imgpadbottom = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('padding-bottom').replace("px", "");
        imgpadleft = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css('padding-left').replace("px", "");
        $(".imgwidthdis").html($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css("width").replace("px", "") - imgpadleft - imgpadright);
        imgurl = $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock a").attr("href");
        if (typeof $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("aspectratio") === "undefined") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("aspectratio", "yes");
        } else if ($("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("aspectratio") === "yes") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
        } else {
            $("#imgbtnar").prop('checked', '');
            $("#linkicondiv .separator").addClass("separatorhide");
            $("#linkicon").attr("title", "Click To Set Constrain Proportions");
        }
        $("#linkicondiv").unbind("click").click(function () {
            if ($("#imgbtnar").prop('checked') === true) {
                $("#imgbtnar").prop('checked', '');
                $("#linkicondiv .separator").addClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Set Constrain Proportions");
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("aspectratio", "no");
            } else {
                $("#imgbtnar").prop('checked', 'checked');
                $("#linkicondiv .separator").removeClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Unset Constrain Proportions");
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("aspectratio", "yes");
            }
        });
        $('input[name="imgbtnposgrp"]').unbind("change").change(function () {
            if (typeof $('input[name="imgbtnposgrp"]:checked').val() !== "undefined") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock img").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
            }
        }).trigger("change");
        $('#imagebackclrbox').unbind('change').change(function () {
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css("background-color", $("#imagebackclrbox").val());
        });
        $('#imageurlset').unbind('change').change(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imageurl").unbind('keyup').keyup(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imgpadtop,#imgpadright,#imgpadbottom,#imgpadleft").unbind('keyup').keyup(function () {
            if ($("#imgpadtop").val() === "0" && $("#imgpadright").val() === "0" && $("#imgpadbottom").val() === "0" && $("#imgpadleft").val() === "0") {
                $('#imgbtnete').prop('checked', true);
            } else {
                $('#imgbtnete').prop('checked', false);
            }
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
        $('#imgbtnete').unbind('change').change(function () {
            if ($(this).prop('checked') === true) {
                $("#imgpadtop").val("0");
                $("#imgpadright").val("0");
                $("#imgpadbottom").val("0");
                $("#imgpadleft").val("0");
            } else {
                $("#imgpadtop").val("5");
                $("#imgpadright").val("5");
                $("#imgpadbottom").val("5");
                $("#imgpadleft").val("5");
            }
            $("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
    } else {
        t = 0;
        let u = $("#" + block_id).find("td.imageTdBlock img");
        $("#imgactsize").html(u[0].naturalWidth + " x " + u[0].naturalHeight);
        $("#imgdissize").html(u[0].width + " x " + u[0].height);
        $("#imgtxtwidth").val(u[0].width);
        $("#imgtxtheight").val(u[0].height);
        align = $("#" + block_id).find("td.imageTdBlock img").attr("align");
        if (align === "middle") {
            align = "center";
        }
        $('input[name="imgbtnposgrp"][value="' + align + '"]').prop('checked', true);
        if ($("#" + block_id).find("td.imageTdBlock").css('background-color') === "rgba(0, 0, 0, 0)") {
            imgbaccol = rgb2hex("rgb(255, 255, 255)");
        } else {
            imgbaccol = rgb2hex($("#" + block_id).find("td.imageTdBlock").css('background-color'));
        }
        imgpadtop = $("#" + block_id).find("td.imageTdBlock").css('padding-top').replace("px", "");
        imgpadright = $("#" + block_id).find("td.imageTdBlock").css('padding-right').replace("px", "");
        imgpadbottom = $("#" + block_id).find("td.imageTdBlock").css('padding-bottom').replace("px", "");
        imgpadleft = $("#" + block_id).find("td.imageTdBlock").css('padding-left').replace("px", "");
        $(".imgwidthdis").html($("#" + block_id).find("td.imageTdBlock").css("width").replace("px", "") - imgpadleft - imgpadright);
        imgurl = $("#" + block_id).find("td.imageTdBlock a").attr("href");
        if (typeof $("#" + block_id).find("td.imageTdBlock img").attr("aspectratio") === "undefined") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
            $("#" + block_id).find("td.imageTdBlock img").attr("aspectratio", "yes");
        } else if ($("#" + block_id).find("td.imageTdBlock img").attr("aspectratio") === "yes") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
        } else {
            $("#imgbtnar").prop('checked', '');
            $("#linkicondiv .separator").addClass("separatorhide");
            $("#linkicon").attr("title", "Click To Set Constrain Proportions");
        }
        $("#linkicondiv").unbind("click").click(function () {
            if ($("#imgbtnar").prop('checked') === true) {
                $("#imgbtnar").prop('checked', '');
                $("#linkicondiv .separator").addClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Set Constrain Proportions");
                $("#" + block_id).find("td.imageTdBlock img").attr("aspectratio", "no");
            } else {
                $("#imgbtnar").prop('checked', 'checked');
                $("#linkicondiv .separator").removeClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Unset Constrain Proportions");
                $("#" + block_id).find("td.imageTdBlock img").attr("aspectratio", "yes");
            }
        });
        $('input[name="imgbtnposgrp"]').unbind("change").change(function () {
            if (typeof $('input[name="imgbtnposgrp"]:checked').val() !== "undefined") {
                $("#" + block_id).find("td.imageTdBlock").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
                $("#" + block_id).find("td.imageTdBlock").css("justify-content", $('input[name="imgbtnposgrp"]:checked').val());
                $("#" + block_id).find("td.imageTdBlock img").attr("align", $('input[name="imgbtnposgrp"]:checked').val());
            }
        }).trigger("change");
        $('#imagebackclrbox').unbind('change').change(function () {
            $("#" + block_id).find("td.imageTdBlock").css("background-color", $("#imagebackclrbox").val());
        });
        $('#imageurlset').unbind('change').change(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("td.imageTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("td.imageTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imageurl").unbind('keyup').keyup(function () {
            if ($("#imageurl").val() !== "") {
                $("#" + block_id).find("td.imageTdBlock a.imglink").attr("href", $("#imageurlset").val() + $("#imageurl").val().replace(/(^\w+:|^)\/\//, ''));
            } else {
                $("#" + block_id).find("td.imageTdBlock a.imglink").removeAttr("href");
            }
        });
        $("#imgpadtop,#imgpadright,#imgpadbottom,#imgpadleft").unbind('keyup').keyup(function () {
            if ($("#imgpadtop").val() === "0" && $("#imgpadright").val() === "0" && $("#imgpadbottom").val() === "0" && $("#imgpadleft").val() === "0") {
                $('#imgbtnete').prop('checked', true);
            } else {
                $('#imgbtnete').prop('checked', false);
            }
            $("#" + block_id).find("td.imageTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
        $('#imgbtnete').unbind('change').change(function () {
            if ($(this).prop('checked') === true) {
                $("#imgpadtop").val("0");
                $("#imgpadright").val("0");
                $("#imgpadbottom").val("0");
                $("#imgpadleft").val("0");
            } else {
                $("#imgpadtop").val("5");
                $("#imgpadright").val("5");
                $("#imgpadbottom").val("5");
                $("#imgpadleft").val("5");
            }
            $("#" + block_id).find("td.imageTdBlock").css({"padding-top": $("#imgpadtop").val() + "px", "padding-right": $("#imgpadright").val() + "px", "padding-bottom": $("#imgpadbottom").val() + "px", "padding-left": $("#imgpadleft").val() + "px"});
            mySlideronc();
        });
    }
    $("#imagebackclrbox").val(imgbaccol);
    $("#imagebackclrbox").spectrum({
        allowEmpty: true,
        color: imgbaccol,
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
    $("#imgpadtop").val(imgpadtop);
    $("#imgpadright").val(imgpadright);
    $("#imgpadbottom").val(imgpadbottom);
    $("#imgpadleft").val(imgpadleft);
    if (typeof imgurl !== "undefined") {
        if (imgurl.substr(0, 7) === 'http://') {
            $("#imageurlset").val('http://');
            imgurl = imgurl.replace("http://", "");
            $("#imageurl").val(imgurl);
        }
        if (imgurl.substr(0, 8) === 'https://') {
            $("#imageurlset").val('https://');
            imgurl = imgurl.replace("https://", "");
            $("#imageurl").val(imgurl);
        }
    } else {
        $("#imageurlset").val('http://');
        $("#imageurl").val("");
    }
    if ($("#imgpadtop").val() === "0" && $("#imgpadright").val() === "0" && $("#imgpadbottom").val() === "0" && $("#imgpadleft").val() === "0") {
        $('#imgbtnete').prop('checked', true);
    } else {
        $('#imgbtnete').prop('checked', false);
    }
}
export function blocksettingheadercommon(){
    let blockbgclr,blockborclr;
    if($("#pageheader .row").css("background-color")==="rgba(0, 0, 0, 0)") {
        blockbgclr="#ffffff";
    } else {
        blockbgclr=rgb2hex($("#pageheader .row").css("background-color"));
    }
    $("#blockboxbgbox").val(blockbgclr);
    $("#blockboxbgbox").spectrum({
        allowEmpty:true,
        color: blockbgclr,
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
    $("#blockborwid").val($("#pageheader .row").css('border-left-width').replace("px",""));
    $("#blockselectbortsty").val($("#pageheader .row").css('border-left-style'));
    if($("#pageheader .row").css('border-left-style')==="none") {
        blockborclr="#ffffff";
    } else {
        blockborclr=rgb2hex($("#pageheader .row").css('border-left-color'));
    }
    $("#blockboxborderbox").val(blockborclr);
    $("#blockboxborderbox").spectrum({
        allowEmpty:true,
        color: blockborclr,
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
    $("#blockpadleft").val($("#pageheader .row").css('padding-left').replace("px",""));
    $("#blockpadright").val($("#pageheader .row").css('padding-right').replace("px",""));
    $("#blockpadtop").val($("#pageheader .row").css('padding-top').replace("px",""));
    $("#blockpadbottom").val($("#pageheader .row").css('padding-bottom').replace("px",""));
    if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
        $('#blockbtnete').prop('checked',true);
    } else {
        $('#blockbtnete').prop('checked',false);
    }
    $("#blockpadtop,#blockpadright,#blockpadbottom,#blockpadleft").unbind('keyup').keyup(function() {
        if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
            $('#blockbtnete').prop('checked',true);
            $("#pageheader").find("#headerdimg img.mcnImage").css({"width":"100%","height":"100%","max-width":"","max-height":""});
            $("#pageheader").find("#headerdimg img.mcnImage").attr("width","100%");
            $("#pageheader").find("#headerdimg img.mcnImage").attr("height","100%");
            if($("#headerdtitle").hasClass("pl-2") && $("#pageheader").find("#headerdimg img").hasClass("mcnImage")){
                $("#headerdtitle").removeClass("pl-2").addClass("pl-0 pt-1 col-12");
                $("#headerdimg").addClass("col-12 px-0");
            }
        } else {
            $('#blockbtnete').prop('checked',false);
            $("#pageheader").find("#headerdimg img.mcnImage").css({"width":"","height":"","max-width":"100px","max-height":"100px"});
            $("#pageheader").find("#headerdimg img.mcnImage").attr("width","");
            $("#pageheader").find("#headerdimg img.mcnImage").attr("height","");
            if($("#headerdtitle").hasClass("pl-0")){
                $("#headerdtitle").removeClass("pl-0 pt-1 col-12").addClass("pl-2");
                $("#headerdimg").removeClass("col-12 px-0");
            }
        }
        $("#pageheader .row").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
        if($('#pageheader').find('div.row').find("#headerdimg img").hasClass("mcnImage")) {
            let u = $('#pageheader').find('div.row').find("#headerdimg img.mcnImage");
            $("#imgdissize").html(u[0].width + " x " + u[0].height);
            $("#imgtxtwidth").val(u[0].width);
            $("#imgtxtheight").val(u[0].height);
        }
    });
    $('#blockbtnete').unbind('change').change(function(){
        if ($(this).prop('checked')===true){
            $("#blockpadtop").val("0");
            $("#blockpadright").val("0");
            $("#blockpadbottom").val("0");
            $("#blockpadleft").val("0");
            $("#pageheader").find("#headerdimg img.mcnImage").css({"width":"100%","height":"100%","max-width":"","max-height":""});
            $("#pageheader").find("#headerdimg img.mcnImage").attr("width","100%");
            $("#pageheader").find("#headerdimg img.mcnImage").attr("height","100%");
            if($("#headerdtitle").hasClass("pl-2") && $("#pageheader").find("#headerdimg img").hasClass("mcnImage")){
                $("#headerdtitle").removeClass("pl-2").addClass("pl-0 pt-1 col-12");
                $("#headerdimg").addClass("col-12 px-0");
            }
        } else {
            $("#blockpadtop").val("10");
            $("#blockpadright").val("10");
            $("#blockpadbottom").val("10");
            $("#blockpadleft").val("10");
            $("#pageheader").find("#headerdimg img.mcnImage").css({"width":"","height":"","max-width":"100px","max-height":"100px"});
            $("#pageheader").find("#headerdimg img.mcnImage").attr("width","");
            $("#pageheader").find("#headerdimg img.mcnImage").attr("height","");
            if($("#headerdtitle").hasClass("pl-0")){
                $("#headerdtitle").removeClass("pl-0 pt-1 col-12").addClass("pl-2");
                $("#headerdimg").removeClass("col-12 px-0");
            }
        }
        $("#pageheader .row").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
        if($('#pageheader').find('div.row').find("#headerdimg img").hasClass("mcnImage")) {
            let u = $('#pageheader').find('div.row').find("#headerdimg img.mcnImage");
            $("#imgdissize").html(u[0].width + " x " + u[0].height);
            $("#imgtxtwidth").val(u[0].width);
            $("#imgtxtheight").val(u[0].height);
        }
    });
    $("#blockborwid").unbind("keyup").keyup(function(){
        $("#pageheader .row").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#pageheader .row").css('border-style',$("#blockselectbortsty").val());
    });
    $("#blockselectbortsty,#blockboxborderbox").unbind("change").change(function(){
        $("#pageheader .row").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#pageheader .row").css('border-style',$("#blockselectbortsty").val());
    });
    $("#blockboxbgbox").unbind("change").change(function(){
        $("#pageheader .row").css("background-color",$("#blockboxbgbox").val());
        $("#pageheader .row").css('background-clip','padding-box');
    });
    $(".tpl-block-clone").hide();
    if($('#pageheader').find('div.row').find("#headerdimg img").hasClass("mcnImage")) {
        let u = $('#pageheader').find('div.row').find("#headerdimg img.mcnImage");
        $("#imgactsize").html(u[0].naturalWidth + " x " + u[0].naturalHeight);
        $("#imgdissize").html(u[0].width + " x " + u[0].height);
        $("#imgtxtwidth").val(u[0].width);
        $("#imgtxtheight").val(u[0].height);
        if(!$('#pageheader').find('div.row').find("#headerdimg").hasClass("headerdimg")) {
            $("#pageheader").find("#headerdimg img").css({"max-width": "", "max-height": "", "width": u[0].width, "height": u[0].height});
        }
        if (typeof $('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("aspectratio") === "undefined") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
            $('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("aspectratio", "yes");
        } else if ($('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("aspectratio") === "yes") {
            $("#imgbtnar").prop('checked', 'checked');
            $("#linkicondiv .separator").removeClass("separatorhide");
            $("#linkicon").attr("title", "Click To Unset Constrain Proportions");
        } else {
            $("#imgbtnar").prop('checked', '');
            $("#linkicondiv .separator").addClass("separatorhide");
            $("#linkicon").attr("title", "Click To Set Constrain Proportions");
        }
        $("#linkicondiv").unbind("click").click(function () {
            if ($("#imgbtnar").prop('checked') === true) {
                $("#imgbtnar").prop('checked', '');
                $("#linkicondiv .separator").addClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Set Constrain Proportions");
                $('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("aspectratio", "no");
            } else {
                $("#imgbtnar").prop('checked', 'checked');
                $("#linkicondiv .separator").removeClass("separatorhide");
                $("#linkicon").attr("data-original-title", "Click To Unset Constrain Proportions");
                $('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("aspectratio", "yes");
            }
        });
    }
}
function blocksettingfooter(droparray,savefullcontent){
    let blockbgclr,blockborclr;
    if($("#pagefooter .row").css("background-color")==="rgba(0, 0, 0, 0)") {
        blockbgclr="#ffffff";
    } else {
        blockbgclr=rgb2hex($("#pagefooter .row").css("background-color"));
    }
    $("#blockboxbgbox").val(blockbgclr);
    $("#blockboxbgbox").spectrum({
        allowEmpty:true,
        color: blockbgclr,
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
    $("#blockborwid").val($("#pagefooter .row").css('border-left-width').replace("px",""));
    $("#blockselectbortsty").val($("#pagefooter .row").css('border-left-style'));
    if($("#pagefooter .row").css('border-left-style')==="none") {
        blockborclr="#ffffff";
    } else {
        blockborclr=rgb2hex($("#pagefooter .row").css('border-left-color'));
    }
    $("#blockboxborderbox").val(blockborclr);
    $("#blockboxborderbox").spectrum({
        allowEmpty:true,
        color: blockborclr,
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
    $("#blockpadleft").val($("#pagefooter .row").css('padding-left').replace("px",""));
    $("#blockpadright").val($("#pagefooter .row").css('padding-right').replace("px",""));
    $("#blockpadtop").val($("#pagefooter .row").css('padding-top').replace("px",""));
    $("#blockpadbottom").val($("#pagefooter .row").css('padding-bottom').replace("px",""));
    if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
        $('#blockbtnete').prop('checked',true);
    } else {
        $('#blockbtnete').prop('checked',false);
    }
    $("#blockpadtop,#blockpadright,#blockpadbottom,#blockpadleft").unbind('keyup').keyup(function() {
        if($("#blockpadtop").val()==="0" && $("#blockpadright").val()==="0" && $("#blockpadbottom").val()==="0" && $("#blockpadleft").val()==="0") {
            $('#blockbtnete').prop('checked',true);
        } else {
            $('#blockbtnete').prop('checked',false);
        }
        $("#pagefooter .row").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
    });
    $('#blockbtnete').unbind('change').change(function(){
        if ($(this).prop('checked')===true){
            $("#blockpadtop").val("0");
            $("#blockpadright").val("0");
            $("#blockpadbottom").val("0");
            $("#blockpadleft").val("0");
        } else {
            $("#blockpadtop").val("10");
            $("#blockpadright").val("10");
            $("#blockpadbottom").val("10");
            $("#blockpadleft").val("10");
        }
        $("#pagefooter .row").css('padding',$("#blockpadtop").val()+"px "+$("#blockpadright").val()+"px "+$("#blockpadbottom").val()+"px "+$("#blockpadleft").val()+"px");
    });
    $("#blockborwid").unbind("keyup").keyup(function(){
        $("#pagefooter .row").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#pagefooter .row").css('border-style',$("#blockselectbortsty").val());
    });
    $("#blockselectbortsty,#blockboxborderbox").unbind("change").change(function(){
        $("#pagefooter .row").css('border',$("#blockborwid").val()+"px "+$("#blockselectbortsty").val()+" "+$("#blockboxborderbox").val());
        $("#pagefooter .row").css('border-style',$("#blockselectbortsty").val());
    });
    $("#blockboxbgbox").unbind("change").change(function(){
        $("#pagefooter .row").css("background-color",$("#blockboxbgbox").val());
        $("#pagefooter .row").css('background-clip','padding-box');
    });
    $(".tpl-block-clone").hide();
    $(".tpl-block-delete").unbind("click").click(function(e){
        $(".cke").hide();
        let blo_id="Dialog_2_footer";
        if(e.altKey) {
            $("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay").remove();
            $('#pagefooter').find('div.row').remove();
        }else{
            $("#"+blo_id+",#a"+blo_id).remove();
            let dilogstring=droparray["DeleteDialog"];
            dilogstring=replaccon("{{Dialog.id}}",blo_id,dilogstring);
            $("body").append(dilogstring);
            $("#a"+blo_id).leanModal({ top :100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
            closeleanModal();
            setTimeout(function(){
                $("#a"+blo_id)[0].click();
            },500);
            let delEle=$("#"+blo_id+" div div a.button");
            delEle.unbind("click");
            delEle.click(function(){
                $("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
                $('#pagefooter').find('div.row').remove();
                emtmsedisplay();
                savefullcontent();
            });
        }
        hidedsm();
        emtmsedisplay();
        savefullcontent();
    });
}
export function clickSelectItemCallCommon(block_id,target_id,contentblockid,newItemCall,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,selectedpage,editreplaceimagelink){
    $('#files-list li div.thumb-image img').unbind("click").click(function(){
        let sd=$(".drivebox.active").attr("id");
        let id=$(".filemanager-container").attr("id");
        id=id.split("_");
        if(sd==="easdrive") {
            let itempath = $(this).attr("item-path");
            if(id[1]==="temp") {
                newItemCall(itempath);
            } else {
                existingItemCall(block_id,target_id,contentblockid,itempath,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,editreplaceimagelink);
            }
            findImageSize(selectedpage,id[1],block_id,itempath,target_id);
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    if(id[1]==="temp") {
                        newItemCall(res.result.imagePath);
                    } else {
                        existingItemCall(block_id,target_id,contentblockid,res.result.imagePath,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,editreplaceimagelink);
                    }
                    findImageSize(selectedpage,id[1],block_id,res.result.imagePath,target_id);
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    if(id[1]==="temp") {
                        newItemCall(res.result.downloadPath);
                    } else {
                        existingItemCall(block_id,target_id,contentblockid,res.result.downloadPath,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,editreplaceimagelink);
                    }
                    findImageSize(selectedpage,id[1],block_id,res.result.downloadPath,target_id);
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    if(id[1]==="temp") {
                        newItemCall(res.result.downloadPath);
                    } else {
                        existingItemCall(block_id,target_id,contentblockid,res.result.downloadPath,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,editreplaceimagelink);
                    }
                    findImageSize(selectedpage,id[1],block_id,res.result.downloadPath,target_id);
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
    });
    let sourceImage = document.createElement('img');
    let colorThief = new ColorThief();
    $('#FileManager_canimg_canimg #files-list li div.thumb-image img').unbind("click").click(function(){
        let itempath=$(this).attr("item-path");
        let op=parseFloat(Math.abs($('#preview-template').find('.mcd.np').attr("item-value"))/100);
        sourceImage.setAttribute('src', itempath);
        let color = colorThief.getColor(sourceImage);
        $('#preview-template').find('.mcd.np').css('background-color','rgb(' + color + ')');
        let newcolor=rgb2hex('rgb('+color+')');
        $("#canboxbackbox").spectrum("set",newcolor);
        $("#canboxbackbox").val(newcolor);
        $('#preview-template').find('.mcd.np').attr("item-path",itempath);
        $('#preview-template').find('.mcd.np').css('background-image','url("'+itempath+'")');
        $('#preview-template').find('.mcd.np').css('background-color',hexToRGB(newcolor, op));
        if($(".grid.active").attr("item-value")==="stretch") {
            $('#preview-template').find('.mcd.np').css('background-size','cover');
        } else {
            $('#preview-template').find('.mcd.np').css('background-size','contain');
        }
        $('#preview-template').find('.mcd.np').css('background-position',$("#canposition .pos.active").attr("item-value"));
        $("#canblend").val("overlay");
        $('#preview-template').find('.mcd.np').css('background-blend-mode',"overlay");
        $("#candispimg").attr("src",itempath);
        $("#candispimg,#candeleteimg").show();
        $("#canuploadimg").hide();
        $("#candispimg").click(function(){
            $("#canuploadimg").trigger("click");
        });
        $("#candeleteimg").click(function(){
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
        });
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
    });
    if(selectedpage !== ""){
        $('#FileManager_pdconimg_pdconimg #files-list li div.thumb-image img').unbind("click").click(function(){
            let itempath=$(this).attr("item-path");
            let op=parseFloat(Math.abs($('#preview-template').contents().find('#cntr').attr("item-value"))/100);
            sourceImage.setAttribute('src', itempath);
            let color = colorThief.getColor(sourceImage);
            $('#preview-template').contents().find('#cntr').css('background-color','rgb(' + color + ')');
            let newcolor=rgb2hex('rgb('+color+')');
            $("#pdconboxbackbox").spectrum("set",newcolor);
            $("#pdconboxbackbox").val(newcolor);
            $('#preview-template').contents().find('#cntr').attr("item-path",itempath);
            $('#preview-template').contents().find('#cntr').css('background-image','url("'+itempath+'")');
            $('#preview-template').contents().find('#cntr').css('background-color',hexToRGB(newcolor, op));
            if($("#pdcongrid .grid.active").attr("item-value")==="stretch") {
                $('#preview-template').contents().find('#cntr').css('background-size','cover');
            } else {
                $('#preview-template').contents().find('#cntr').css('background-size','contain');
            }
            $('#preview-template').contents().find('#cntr').css('background-position',$("#pdconposition .pos.active").attr("item-value"));
            $("#pdconblend").val("overlay");
            $('#preview-template').contents().find('#cntr').css('background-blend-mode',"overlay");
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
                $('#preview-template').contents().find('#cntr').removeAttr("item-path");
                $('#preview-template').contents().find('#cntr').css('background-image','');
                $('#preview-template').contents().find('#cntr').attr("item-value","0");
                $("#pdconbrightness span.ui-slider-handle").css("left","0%");
                $("#pdcongrid .grid").removeClass("active");
                $('#pdcongrid .grid[item-value="stretch"]').addClass("active");
                $("#pdconposition .pos").removeClass("active");
                $("#pdconposition .pos[item-value='0% 0%']").addClass("active");
                $("#pdconblend").val('normal');
                setPageBackgroundSettingCommon();
            });
            $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        });
    }
    $('#FileManager_form_form #files-list li div.thumb-image img').unbind("click").click(function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        if($("#templateBody"+selectedpage).find('.imageBlock').hasClass("imageBlockPageLayout4") || $("#templateBody"+selectedpage).find('.imageBlock').hasClass("imageBlockPageLayout5")){
            $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-50 h-50"></div>');
        } else {
            $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-100 h-100"></div>');
        }
        $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image':'url("'+itempath + '")','background-size':'cover','background-position':'center center'});
        $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader').addClass("bg-white");
        let tid = $("#templateBody"+selectedpage).find('.questionBlock .mojoMcBlock.frm-block.active').attr("id");
        $("#"+tid).trigger("click");
    });
    $('#FileManager_form6_form6 #files-list li div.thumb-image img').unbind("click").click(function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        $("#templateBody"+selectedpage).css({"background-image": "url("+itempath + ")",'background-size':'cover','background-position':'center center'});
    });
    $('#FileManager_header_header #files-list li div.thumb-image img').unbind("click").click(function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        $("#pageheader").find("#headerdimg img").attr("src",itempath);
        $("#pageheader").find("#headerdimg img").addClass("mcnImage");
        $("#pageheader").find("#headerdimg img").unbind("click");
        $("#pageheader").find("#headerdimg img").css({"max-width":"100px","max-height":"100px"});
        $("#pageheader").find("#headerdimg img").one('load',function() {
            $("#pageheader").find("div.row").trigger("click");
        });
    });
    $('#FileManager_header2_header2 #files-list li div.thumb-image img').unbind("click").click(function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        $("#pageheader").find("#headerdimg p").remove();
        $("#pageheader").find("#headerdimg img").attr("src",itempath);
        $("#pageheader").find("#headerdimg img").addClass("mcnImage");
        $("#pageheader").find("#headerdimg img").unbind("click");
        $("#pageheader").find("#headerdimg img").css({"width":"100%","height":"100%"});
        $("#pageheader").find("#headerdimg img").attr("width","100%");
        $("#pageheader").find("#headerdimg img").attr("height","100%");
        $("#pageheader").find("#headerdimg img").one('load',function() {
            $("#pageheader").find("div.row").trigger("click");
        });
    });
    $('#FileManager_imagecontrol_imagecontrol #files-list li div.thumb-image img').unbind("click").click(function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            let itemname=$(this).attr("item-name");
            downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            let itemname=$(this).attr("item-name");
            downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        let id = block_id.split("_");
        let bid = id.slice(0,-1).join("_");
        $("#"+bid).find('[item-value="'+id[3]+'"]').find('div.mojoImageUploader div').replaceWith('<div><img src="'+itempath+'" class="w-100 mcnImage" /></div>');
    });
    $('#FileManager_attachment_attachment #files-list li div.thumb-image div.thumb-i, #FileManager_attachment_attachment #files-list li div.thumb-image img').unbind("click").click(async function() {
        let sd=$(".drivebox.active").attr("id");
        let itempath = "";
        let itemname = "";
        if(sd==="easdrive") {
            itempath = $(this).attr("item-path");
            itemname = $(this).attr("item-name");
        } else if(sd==="googledrive") {
            let itemfileid=$(this).attr("item-fileid");
            itemname = $(this).attr("item-name");
            await downloadFileGD(itemfileid).then(res => {
                if (res.status === 200) {
                    itempath = res.result.imagePath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="dropbox") {
            let itemfilepath=$(this).attr("item-filepath");
            itemname=$(this).attr("item-name");
            await downloadFileDB(itemfilepath,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        } else if(sd==="onedrive") {
            let itemid=$(this).attr("item-id");
            itemname=$(this).attr("item-name");
            await downloadFileOD(itemid,itemname).then(res => {
                if (res.status === 200) {
                    itempath = res.result.downloadPath;
                } else {
                    $("#downloadImageError").trigger("click");
                }
            })
        }
        $('a[data-dojo-attach-point="closeLink"]').trigger('click');
        $("#"+block_id).find('td.attachmentTdBlock a').attr("href",itempath);
        $("#"+block_id).find('td.attachmentTdBlock a').html(itemname);
    });
}
export function findImageSize(selectedpage,typeBlock,block_id,itempath,target_id){
    if(selectedpage === ""){
        let rf = "", cWidth = 0, cHeight = 0;
        if(typeBlock==="temp"){
            rf = $('#preview-template').contents().find('.mojoMcBlock.tpl-block.dojoDndItem:last-of-type').attr("rolefor");
        } else {
            rf = $("#"+block_id).attr("rolefor");
        }
        if(rf==="image_card" || rf==="image_+_caption" || rf==="image_+_caption11" || rf==="image_+_caption12" || rf==="image_+_caption21" || rf==="image_+_caption22" || rf==="image_+_caption31" || rf==="image_+_caption32" || rf==="3image_+_3caption" || rf==="image_group_3s"){
            cWidth = 180;
            cHeight = 218;
        } else if(rf==="image_group_3h"){
            cWidth = 180;
            cHeight = 436;
        } else if(rf==="image_group_2h"){
            cWidth = 260;
            cHeight = 436;
        } else if(rf==="image" || rf==="logoicon" || rf==="image_card" || rf==="image_+_caption11"){
            cWidth = 580;
            cHeight = 218;
        } else if(rf==="2image_+_2caption_+_custom"){
            let s=$("#"+block_id).find('[data-clo-num="1"]').attr("select-split-option");
            if(s==="1") {
                if(target_id === "0"){
                    cWidth = 180;
                    cHeight = 218;
                } else {
                    cWidth = 400;
                    cHeight = 218;
                }
            } else {
                if(target_id === "0"){
                    cWidth = 400;
                    cHeight = 218;
                } else {
                    cWidth = 180;
                    cHeight = 218;
                }
            }
        } else {
            cWidth = 260;
            cHeight = 218;
        }
        setTimeout(function(){
            let tmpImg = new Image();
            tmpImg.src = itempath;
            $(tmpImg).one('load', function () {
                let orgWidth = tmpImg.width;
                let orgHeight = tmpImg.height;
                if (orgWidth < cWidth || orgHeight < cHeight) {
                    $("#clickError").attr("data-type","Warning");
                    $("#clickError").val("You have selected an image " + orgWidth + " by " + orgHeight + ". It is smaller than required size " + cWidth + " by " + cHeight + " for the template design. So it may not render properly.");
                    $("#clickError").trigger("click");
                }
                mySlideronc();
            });
        },2000);
    }
}
function existingItemCall(block_id,target_id,contentblockid,itempath,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,editreplaceimagelink) {
    $('li.mojoImageItem.dojoDndItem[data-image-index="' + target_id + '"] img.mojoImageItemIcon').attr("src", itempath);
    $('a[data-dojo-attach-point="closeLink"]').trigger('click');
    let fullhtml1 = droparray["templates/editorContainer/images/imagecontent"];
    fullhtml1 = replaccon("{{id}}", contentblockid + "_" + target_id, fullhtml1);
    fullhtml1 = replaccon("{{drag.img.url}}", itempath, fullhtml1);
    fullhtml1 = replaccon("{{drag.img.mcid}}", target_id, fullhtml1);
    let imgwidfull1=(imgwidfull*editorWidth)/editorMax;
    fullhtml1 = replaccon("{{drag.img.width}}", imgwidfull1, fullhtml1);
    let controle = $('#preview-template').contents().find('#' + block_id).attr("rolefor");
    let contclass = ((controle === "image" || controle === "logoicon" || controle === "image_card" || controle === "image_+_caption" || controle === "image_+_caption11" || controle === "image_+_caption12" || controle === "2image_+_2caption" || controle === "2image_+_2caption_+_custom" || controle === "3image_+_3caption" || controle === "image_+_caption21" || controle === "image_+_caption22" || controle === "image_+_caption31" || controle === "image_+_caption32" || controle === "image_+_caption21_+_h" || controle === "image_+_caption22_+_h" || controle === "image_+_caption31_+_h" || controle === "image_+_caption32_+_h" || controle === "2image_+_1caption1" || controle === "2image_+_1caption2" || controle === "image_+_caption_+_h" || controle === "image_+_caption12_+_h") ? "imageTdBlock" : "imageGroupTdBlock");
    $('#preview-template').contents().find('#' + block_id).find('.' + contclass + ' [data-mc-id="' + target_id + '"]').parent("a").contents().unwrap();
    $('#preview-template').contents().find('#' + block_id).find('.' + contclass + ' [data-mc-id="' + target_id + '"]').replaceWith(fullhtml1);
    setTimeout(function () {
        $('#preview-template').contents().find('#' + block_id).find('.' + contclass + ' [data-mc-id="' + target_id + '"]').trigger("click");
    }, 3000);
    if (controle === "image_group") {
        $("#" + block_id).find("td.imageGroupTdBlock").css({ "vertical-align": "middle", "text-align": "center", "position": "relative" });
        $("#" + block_id).find("img.mcnImage").removeAttr("width");
        $("#" + block_id).find("img.mcnImage").attr("align", "middle");
    }
    setTimeout(function () {
        if (controle === "image" || controle === "logoicon" || controle === "image_group" || controle === "image_group_3h" || controle === "image_group_3s" || controle === "image_group_2h" || controle === "image_group_2s") {
            imagescontrol(block_id,editreplaceimagelink);
        }
        blockedtblocan(block_id);
        mySlideronc();
    }, 1000);
}
export function formBlockSettingCommon(block_id,removeActive,formType){
    removeActive(formType);
    $("#"+block_id).find("[name*='question']").focus();
    $("#"+block_id).find(".top-control,.bottom-control").show();
    $("#"+block_id).find(".row:first").addClass("row-bg");
    $('#preview-template').contents().find("[rolefor='single_answer_button'] .row.row-bg .blockanswer .blockoption input[type='button']").attr("type","text").removeClass("btn btn-default");
    $("#"+block_id).find("span.answerTableSpan").each(function(){
        $(this).replaceWith(`<input type="text" value="${$(this).html()}"/>`);
    });
    $("#"+block_id).find("span.terms").each(function(){
        $(this).replaceWith(`<textarea placeholder="Add agreement" class="terms" style="margin-bottom:10px; margin-top:10px; height: auto;">${$(this).html()}</textarea>`);
    });
    $("#"+block_id).find("span.agreement").each(function(){
        $(this).replaceWith(`<input type="text" class="agreement" style="margin-bottom:10px; margin-top:10px;margin-left: 10px;display: inline-block;" placeholder="I agree to terms and conditions" value="${$(this).html()}">`);
    });
    $("#"+block_id).find("span.matrixCommentTextArea").each(function(){
        let t = $(this).html();
        $(this).replaceWith(`<textarea class="matrixCommentTextArea" placeholder="Use this text box if you would like to give additional instructions to the respondent" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:100%; height:72px;display:inline-block;">${t}</textarea>`);
    });
    $("#"+block_id).find("span.textArea").each(function(){
        let t = $(this).html();
        $(this).replaceWith(`<textarea class="textArea" style="border: 1px solid #d2d2d2; height:auto;" rows="2">${t}</textarea>`);
    });
    $("#"+block_id).find("span.rangeSpan").each(function(){
        $(this).replaceWith(`<input type="text" style="display: inline-block;width: 120px;" class="rangeSpan" autocomplete="off" value="${$(this).html()}">`);
        $("#"+block_id).find("input.rangeSpan:even").attr("name", "startRange");
        $("#"+block_id).find("input.rangeSpan:odd").attr("name", "endRange");
        setTimeout(function(){
            let dateFormat = "mm/dd/yy";
            let from = $("#" + block_id).find("#dateRangeDiv").find("input[name='startRange']").datepicker({
                defaultDate: getDate(new Date())
            }).on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            });
            let to = $("#" + block_id).find("#dateRangeDiv").find("input[name='endRange']").datepicker({
                defaultDate: getDate(new Date())
            }).on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });
            function getDate(element) {
                let date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch (error) {
                    date = null;
                }
                return date;
            }
        }, 1000);
    });
    $("#"+block_id).find("span.rangeTimeSpan").each(function(){
        $(this).replaceWith(`<input type="text" style="display: inline-block;width: 120px;" class="rangeTimeSpan" autocomplete="off" value="${$(this).html()}">`);
        $("#"+block_id).find("input.rangeTimeSpan:even").attr("name", "startTimeRange");
        $("#"+block_id).find("input.rangeTimeSpan:odd").attr("name", "endTimeRange");
        setTimeout(() => {
            let startDateTextBox = $("#"+block_id).find("#timeRangeDiv").find("input[name='startTimeRange']");
            let endDateTextBox = $("#"+block_id).find("#timeRangeDiv").find("input[name='endTimeRange']");
            startDateTextBox.timepicker({
                timeFormat: "hh:mm tt",
                onClose: function(dateText, inst){
                    if (endDateTextBox.val() !== '') {
                        let testStartDate = startDateTextBox.datetimepicker('getDate');
                        let testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            endDateTextBox.datetimepicker('setDate', testStartDate);
                    } else {
                        endDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                }
            });
            endDateTextBox.timepicker({
                timeFormat: "hh:mm tt",
                onClose: function(dateText, inst) {
                    if (startDateTextBox.val() !== '') {
                        let testStartDate = startDateTextBox.datetimepicker('getDate');
                        let testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            startDateTextBox.datetimepicker('setDate', testEndDate);
                    } else {
                        startDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                }
            });
        }, 1000);
    });
    $("#"+block_id).find("span.singleAnswer").each(function(){
        $(this).replaceWith(`<input type="text" class="singleAnswer" placeholder="Enter description for this option" value="${$(this).html()}" />`);
    });
    $("#"+block_id).find("span.starthours").each(function(){
        $(this).replaceWith(`
            <select class="starthours" style="display: inline-block;width: 64px; margin-bottom:0px">
                <option value="01">01</option><option value="02">02</option><option value="03">03</option>
                <option value="04">04</option><option value="05">05</option><option value="06">06</option>
                <option value="07">07</option><option value="08">08</option><option value="09">09</option>
                <option value="10">10</option><option value="11">11</option><option value="12">12</option>
            </select>
        `);
        $("#"+block_id).find(`select.starthours option[value='${$(this).html()}']`).attr("selected", "true");
    });
    $("#"+block_id).find("span.endhours").each(function(){
        $(this).replaceWith(`
            <select class="endhours" style="display: inline-block;width: 64px; margin-bottom:0px">
                <option value="01">01</option><option value="02">02</option><option value="03">03</option>
                <option value="04">04</option><option value="05">05</option><option value="06">06</option>
                <option value="07">07</option><option value="08">08</option><option value="09">09</option>
                <option value="10">10</option><option value="11">11</option><option value="12">12</option>
            </select>	
        `);
        $("#"+block_id).find(`select.endhours option[value='${$(this).html()}']`).attr("selected", "true");
    });
    $("#"+block_id).find("span.startminutes").each(function(){
        let t = $(this).html();
        $(this).replaceWith(` <select class="startminutes" style="display: inline-block;width: 64px; margin-bottom:0px"></select> `);
        setTimeout(() => {
            let temp = "";
            for(let i=0; i<=9; i++){
                temp += `<option value="0${i}" ${t===`0${i}`?"selected":""}>0${i}</option>`;
            }
            for(let i=10; i<=59; i++){
                temp += `<option value="${i}" ${t===`${i}`?"selected":""}>${i}</option>`;
            }
            $("#"+block_id).find("select.startminutes").html(temp);
        }, 500);
        $("#"+block_id).find("select.startminutes").val(t===null?"00":t);
    });
    $("#"+block_id).find("span.endminutes").each(function(){
        let t = $(this).html();
        $(this).replaceWith(` <select class="endminutes" style="display: inline-block;width: 64px; margin-bottom:0px"></select> `);
        setTimeout(() => {
            let temp = "";
            for(let i=0; i<=9; i++){
                temp += `<option value="0${i}" ${t===`0${i}`?"selected":""}>0${i}</option>`;
            }
            for(let i=10; i<=59; i++){
                temp += `<option value="${i}" ${t===`${i}`?"selected":""}>${i}</option>`;
            }
            $("#"+block_id).find("select.endminutes").html(temp);
        }, 500);
        $("#"+block_id).find(`select.endminutes option[value="${t}"]`).prop('selected', true);
    });
    $("#"+block_id).find("span.starta").each(function(){
        $(this).replaceWith(`
            <select class="starta" style="display: inline-block;width: 70px; margin-bottom:0px">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        `);
        $("#"+block_id).find(`select.starta option[value='${$(this).html()}']`).attr("selected", "true");
    });
    $("#"+block_id).find("span.enda").each(function(){
        $(this).replaceWith(`
            <select class="enda" style="display: inline-block;width: 70px; margin-bottom:0px">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        `);
        $("#"+block_id).find(`select.enda option[value='${$(this).html()}']`).attr("selected", "true");
    });
    $("#"+block_id).find("span.rating-text-a").each(function(){
        $(this).replaceWith(`<input class="rating-text-a" style="width:10rem" placeholder="Not at all likely" type="text" value="${$(this).html()}"/>`);
    });
    $("#"+block_id).find("span.rating-text-b").each(function(){
        $(this).replaceWith(`<input class="rating-text-b" type="text" style="width:10rem" placeholder="Extremely likely" value="${$(this).html()}"/>`);
    });
    $("#"+block_id).find("div.rankTxt").each(function(){
        $(this).replaceWith(` <input type="text" class="rankTxt" value="${$(this).html()}"> `);
    });
    $("#"+block_id).find("span.sumQuestion").each(function(){
        $(this).replaceWith(` <input type="text" class="sumQuestion" style="min-width: 100px;" placeholder="Enter the question here" value="${$(this).html()}"> `);
        let v = $("#"+block_id).find("#inputType").val();
        if(v === "range"){
            $("#"+block_id).find("input.sumQuestion").addClass("my-3");
        } else {
            $("#"+block_id).find("input.sumQuestion").removeClass("my-3");
        }
    });
    $("#"+block_id).find("span.descriptionText").each(function(){
        $(this).replaceWith(` <textarea rows="10" class="descriptionText" style="height: 80px;" placeholder="Enter the description to your questions">${$(this).html()}</textarea> `);
    });
    if($("#"+block_id).attr("rolefor") === "single_answer_combo"){
        $("#"+block_id).find(".blockoption").find("select.singleanswercombo").hide();
        $("#"+block_id).find(".blockoption").find("div").addClass("d-flex").show();
        $("#"+block_id).find(".blockoption").find('input[type="text"]:not(.pointsbox)').unbind("keyup").keyup(function(){
            $(this).attr("value",$(this).val());
        });
    }
    $("#"+block_id).find(".blockanswer .blockoption div").each(function(){
        if($(this).attr("addcomment") === "yes"){
            $(this).find("span.addcommentspan input[type='checkbox']").prop("checked",true);
        }
    });
    $("#"+block_id).find("i.far.fa-trash-alt").show();
    $("#"+block_id).find("span.addcommentspan").removeClass("d-none").addClass("d-flex");
    $('input[type="text"],label.switch,textarea,select,input[type="checkbox"]').unbind("click").unbind("focus").on("click focus",function(e) {
        e.stopPropagation();
    });
    $(".showhidelist").unbind("click").click(function (e){
        e.stopPropagation();
        $("#draggable-category-list").fadeToggle();
    });
    $("#"+block_id).find('.col-6 input[type="checkbox"]').css("display", "inline-block");
    $(".mojoMcBlock.frm-block").removeClass("active");
    $("#"+block_id).addClass("active");
}
export function formBlockSettingCommon2(block_id,removeActive,formType,droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting){
    $("#"+block_id).find("table.ckeditableTLabel").unbind("click").click(function (){
        $(this).find("td.ckeditableLabel").focus();
        let id=$(this).find("td.ckeditableLabel").attr("id");
        setTimeout(function(){
            $("#cke_"+id).show();
        },100);
    });
    $("#"+block_id).find(".ckeditableLabel").each(function(){
        let id = $(this).attr("id");
        if($("#"+id).hasClass("cke_editable")===false && window.CKEDITOR?.instances[id]){
            window.CKEDITOR.instances[id].destroy();
        }
    });
    createckeditorforLabel(block_id);
    $("#"+block_id).unbind("click").click(function(){
        if($("#"+block_id).attr("question-transition") !== ""){
            $("#qTran").show();
            $(`#questionTransition option[value="${$("#"+block_id).attr("question-transition")}"]`).prop('selected', true);
        }
        if(!$("#"+block_id).find("div.row-bg").length) {
            formBlockSettingCommon(block_id,removeActive,formType);
        }
        if(formType !== "traditional") {
            $("#dsmcsetting").html(droparraysetting["contentSettingBlockEditor"]);
        } else {
            $("#dsmcsetting").html("No setting available for traditional one page...");
        }
        questioncontentsetting(block_id,selectedpage,formBlockSetting);
        $("#dsmbsetting").html(droparraysetting["formPageSettingBlockEditor"]);
        $("#bbutton").trigger("click");
        pagesetting("queControl");
        if($("#"+block_id).attr("rolefor") !== "label"){
            showdsm("formBlock");
        } else {
            hidedsm();
        }
        if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
            if($("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
                $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
            }
        } else {
            if($("#templateBody"+selectedpage).css("background-image") !== "none"){
                $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
            }
        }
    });
    $("#"+block_id).find(".ansrequired input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        $("#"+block_id).find(".ansrequired .slider").toggleClass("offSlider");
        $("#"+block_id).find(".blockanswer").toggleClass("required");
        if($("#"+block_id).attr("rolefor") === "contact_form"){
            if($(this).prop("checked") === true){
                $("#"+block_id).find(".col-6 span").each(function(){
                    $(this).before(` <input type="checkbox" class="requireCheckBox" style="display: inline-block; margin-right: 7px" checked> `);
                });
                $("#"+block_id).find("span .row .col-12 span").each(function(){
                    $(this).before(` <input type="checkbox" class="requireCheckBox" style="display: inline-block; margin-right: 7px" checked> `);
                });
            }else{
                $("#"+block_id).find(".requireCheckBox").each(function(){
                    $(this).remove();
                });
            }
            $(".requireCheckBox").on("change click", function(e){
                e.stopPropagation();
            })
        }
    });
    $("#"+block_id).find(".longans input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        $("#"+block_id).find(".longans .slider").toggleClass("offSlider");
        let aid=$("#"+block_id).find("[name*='answer']").attr("id");
        let tempPlaceHolder = "";
        if($("#"+block_id).find(".blockanswer").hasClass("labellessanswer")){
            tempPlaceHolder = $("#"+block_id).find(".blockquestion").find("input[name*='question']").val();
        } else {
            tempPlaceHolder = "Enter your answer";
        }
        if($(this).prop("checked")===true) {
            $("#"+block_id).find("[name*='answer']").replaceWith('<textarea rows="2" id="'+aid+'" name="'+aid+'" placeholder="'+tempPlaceHolder+'" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;height:auto;padding: 5px 10px;" readonly></textarea>');
            $("#"+block_id).find(".blockanswer").addClass("longanswer");
        } else {
            $("#"+block_id).find("[name*='answer']").replaceWith('<input type="text" id="'+aid+'" name="'+aid+'" placeholder="'+tempPlaceHolder+'" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;" readonly />');
            $("#"+block_id).find(".blockanswer").removeClass("longanswer");
        }
    });
    $("#"+block_id).find(".labelless input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        $("#"+block_id).find(".labelless .slider").toggleClass("offSlider");
        if($(this).prop("checked")===true) {
            $("#"+block_id).find("[name*='answer']").attr("placeholder",$("#"+block_id).find(".blockquestion").find("input[name*='question']").val());
            $("#"+block_id).find("[name*='date']").attr("placeholder",$("#"+block_id).find(".blockquestion").find("input[name*='question']").val());
            $("#"+block_id).find("[name*='time']").attr("placeholder",$("#"+block_id).find(".blockquestion").find("input[name*='question']").val());
            $("#"+block_id).find(".blockanswer").addClass("labellessanswer");
            $("#"+block_id).find(".blockquestion").find("input[name*='question']").unbind("keydown").keydown(function(e){
                setTimeout(()=>{
                    $("#"+block_id).find("[name*='answer']").attr("placeholder",e.target.value);
                    $("#"+block_id).find("[name*='date']").attr("placeholder",e.target.value);
                    $("#"+block_id).find("[name*='time']").attr("placeholder",e.target.value);
                },100);
            });
        } else {
            $("#"+block_id).find("[name*='answer']").attr("placeholder","Enter your answer");
            $("#"+block_id).find("[name*='date']").attr("placeholder","Please input date in format of mm/dd/yyyy");
            $("#"+block_id).find("[name*='time']").attr("placeholder","Please input time");
            $("#"+block_id).find(".blockanswer").removeClass("labellessanswer");
            $("#"+block_id).find(".blockquestion").find("input[name*='question']").unbind("keypress");
        }
    });
    if(($("#"+block_id).attr("rolefor")==="open_ended" || $("#"+block_id).attr("rolefor")==="age" || $("#"+block_id).attr("rolefor")==="date_control" || $("#"+block_id).attr("rolefor")==="time_control" || $("#"+block_id).attr("rolefor")==="email" || $("#"+block_id).attr("rolefor")==="phone") && $("#"+block_id).find(".blockanswer").hasClass("labellessanswer")){
        $("#"+block_id).find(".blockquestion").find("input[name*='question']").unbind("keydown").keydown(function(e){
            setTimeout(()=>{
                $("#"+block_id).find("[name*='answer']").attr("placeholder",e.target.value);
                $("#"+block_id).find("[name*='date']").attr("placeholder",e.target.value);
                $("#"+block_id).find("[name*='time']").attr("placeholder",e.target.value);
            },100);
        });
    }
    $("#"+block_id).find(".multians input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        $("#"+block_id).find(".multians .slider").toggleClass("offSlider");
        if($("#"+block_id).attr("rolefor")==="single_answer" || $("#"+block_id).attr("rolefor")==="single_answer_checkbox" || $("#"+block_id).attr("rolefor")==="single_answer_combo" || $("#"+block_id).attr("rolefor")==="gender" || $("#"+block_id).attr("rolefor")==="marital_status" || $("#"+block_id).attr("rolefor")==="education" || $("#"+block_id).attr("rolefor")==="employment_status" || $("#"+block_id).attr("rolefor")==="employer_type" || $("#"+block_id).attr("rolefor")==="housing" || $("#"+block_id).attr("rolefor")==="household_income" || $("#"+block_id).attr("rolefor")==="race") {
            if ($(this).prop("checked") === true) {
                $("#" + block_id).find(".blockoption").find("[type='radio']").attr("type", "checkbox");
                $("#" + block_id).find(".blockanswer").addClass("multipleanswer");
            } else {
                $("#" + block_id).find(".blockoption").find("[type='checkbox']:not(.addcomment)").attr("type", "radio");
                $("#" + block_id).find(".blockanswer").removeClass("multipleanswer");
            }
        } else if($("#"+block_id).attr("rolefor")==="image_form" || $("#"+block_id).attr("rolefor")==="image_with_text_form"){
            if ($(this).prop("checked") === true) {
                $("#" + block_id).find(".blockanswer .selecttype").find("[type='radio']").attr("type", "checkbox");
                $("#" + block_id).find(".blockanswer").addClass("multipleanswer");
            } else {
                $("#" + block_id).find(".blockanswer .selecttype").find("[type='checkbox']").attr("type", "radio");
                $("#" + block_id).find(".blockanswer").removeClass("multipleanswer");
            }
        }
        $("#" + block_id).find(".blockanswer").find(".pointsbox:first").trigger("keyup");
    });
    deleteSingleImage(block_id,formType,selectedpage);
    $("#"+block_id).find(".blockanswer .row .col-6 .fa-trash-alt").unbind("click").click(function(){
        $(this).closest(".col-6").remove();
    });
    $(`#${block_id}:not([rolefor="image_form"],[rolefor="image_with_text_form"])`).find(".bottom-control .addoption").unbind("click").click(function(e){
        e.stopPropagation();
        if($("#"+block_id).attr("rolefor")==="single_answer") {
            if($("#"+block_id).find(".multians input[type='checkbox']").prop("checked")===true) {
                $("#"+block_id).find(".blockanswer .blockoption").append(droparray["checkboxBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()));
            } else {
                $("#"+block_id).find(".blockanswer .blockoption").append(droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()));
            }
        } else if($("#"+block_id).attr("rolefor")==="single_answer_checkbox") {
            if($("#"+block_id).find(".multians input[type='checkbox']").prop("checked")===true) {
                $("#"+block_id).find(".blockanswer .blockoption").append(droparray["checkboxBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()));
            } else {
                $("#"+block_id).find(".blockanswer .blockoption").append(droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()));
            }
        } else if($("#"+block_id).attr("rolefor")==="single_answer_button" || $("#"+block_id).attr("rolefor")==="single_answer_combo") {
            $("#"+block_id).find(".blockanswer .blockoption").append(droparray["buttonBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()));
            $("#"+block_id).find(".blockoption").find('input[type="text"]:not(.pointsbox)').unbind("keyup").keyup(function(){
                $(this).attr("value",$(this).val());
            });
        } else if($("#"+block_id).attr("rolefor")==="rank"){
            $("#"+block_id).find(".blockanswer .row .col-12").append(`
				<div class="d-flex w-95-p mt-2" style="margin-left: 5%;">
					<input type="text" class="rankTxt">
					<i class="fas fa-grip-vertical ml-2" style="margin: auto;cursor: not-allowed;"></i>
                	<i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.remove()"></i>
            	</div>
			`);
        } else if($("#"+block_id).attr("rolefor")==="constant_sum"){
            if($("#"+block_id).find("#inputType").val() === "range"){
                $("#"+block_id).find("table.rangeTable tbody tr").last().before(`
					<tr class="rangeRow">
						<td style="width: 20%;" class="pr-3">
							<input type="text" class="my-3 sumQuestion" style="min-width: 100px;" placeholder="Enter question">
						</td>
						<td style="padding: 0;">
							<input type="range" min="0" max="100" value="0" readonly disabled style="width: 100%;margin-top: 7px">
						</td>
						<td style="width:10%; padding-left: 5px; padding-right: 5px;">
                            <input type="text" style="text-align: right;" value="0" readonly>
						</td>
						<td>
							<i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i>
						</td>
					</tr>
				`);
            } else{
                $("#"+block_id).find("table.inputTable tbody tr").last().before(`
				<tr class="py-3">
					<td style="width: 80%;">
						<input type="text" placeholder="Enter the question here" class="sumQuestion">
					</td>
					<td>
						<input type="text" value="0" readonly>  
					</td>
					<td>
						<i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i>
					</td>
				</tr>
				`);
            }
        }
        $('input[type="text"],label.switch,textarea,select,input[type="checkbox"]').unbind("click").unbind("focus").on("click focus",function(e) {
            e.stopPropagation();
        });
        formBlockSettingCommon2(block_id,removeActive,formType,droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting);
        if(formType === "assessment"){
            setMaxPoints(block_id,selectedpage);
        }
    });
    $("#" + block_id).find(".lower").unbind("blur").blur(function (e){
        let lower = parseInt($(this).val());
        let upper =  parseInt($("#" + block_id).find(".upper").val());
        let segment = parseInt($("#" + block_id).find(".segments").val());
        let incr = 1;
        if(lower < 0){
            $(this).val(0);
            lower = parseInt($(this).val());
        }
        if(lower >= upper){
            $("#" + block_id).find(".upper").val(lower + 1);
            upper=$("#" + block_id).find(".upper").val();
            $("#" + block_id).find(".segments").val(1);
            incr = 1;
        } else{
            incr = Math.ceil((upper-lower)/segment);
        }
        if(incr === 1){
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(` <span>${numberWithCommas(lower)}</span><span>${numberWithCommas(upper)}</span> `);
        } else{
            let h = ``;
            for(let i=0; i<segment; i++){
                h+=` <span>${numberWithCommas(lower+(i*incr))}</span> `;
            }
            h += `<span>${numberWithCommas(upper)}</span>`;
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(h);
        }
    });
    $("#" + block_id).find(".upper").unbind("blur").blur(function (e){
        let lower = parseInt($("#" + block_id).find(".lower").val());
        let upper =  parseInt($("#" + block_id).find(".upper").val());
        let segment = parseInt($("#" + block_id).find(".segments").val());
        let incr = 1;
        if(lower >= upper || upper < 0){
            $("#" + block_id).find(".upper").val(lower + 1);
            upper=$("#" + block_id).find(".upper").val();
            $("#" + block_id).find(".segments").val(1);
            incr = 1;
        } else{
            incr = Math.ceil((upper-lower)/segment);
        }
        if(incr === 1){
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(` <span>${numberWithCommas(lower)}</span><span>${numberWithCommas(upper)}</span> `);
        } else{
            let h = ``;
            for(let i=0; i<segment; i++){
                h+=` <span>${numberWithCommas(lower+(i*incr))}</span> `;
            }
            h += `<span>${numberWithCommas(upper)}</span>`;
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(h);
        }
    });
    $("#" + block_id).find(".segments").unbind("keyup").keyup(function (e){
        let lower = parseInt($("#" + block_id).find(".lower").val());
        let upper =  parseInt($("#" + block_id).find(".upper").val());
        let segment = parseInt($("#" + block_id).find(".segments").val());
        let incr = 1;
        if(lower >= upper || segment <= 0){
            $("#" + block_id).find(".upper").val(lower + 1);
            upper=$("#" + block_id).find(".upper").val();
            $("#" + block_id).find(".segments").val(1);
            incr = 1;
        } else{
            incr = Math.ceil((upper-lower)/segment);
        }
        if(incr === 1){
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(` <span>${numberWithCommas(lower)}</span><span>${numberWithCommas(upper)}</span> `);
        } else{
            let h = ``;
            for(let i=0; i<segment; i++){
                h+=` <span>${numberWithCommas(lower+(i*incr))}</span> `;
            }
            h += `<span>${numberWithCommas(upper)}</span>`;
            $("#" + block_id).find(".segmentRow td .d-flex").html('');
            $("#" + block_id).find(".segmentRow td .d-flex").append(h);
        }
    });
    $("#" + block_id).find("#answerType").unbind("change").change(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        if ($(this).val() === "1") {
            $("#" + block_id).find("input[disabled]").attr("type", "radio").css({ 'width': "", "height": "" })
        } else if ($(this).val() === "2") {
            $("#" + block_id).find("input[disabled]").attr("type", "checkbox").css({ 'width': "", "height": "" })
        } else if ($(this).val() === "3") {
            $("#" + block_id).find("input[disabled]").attr("type", "text").css({ 'width': "60%", "height": "40%" })
        }
    });
    $("#" + block_id).find("#addoption").unbind("click").click(function (e) {
        e.stopPropagation();
        const colCount = $("#" + block_id).find("#answerTable > tbody > tr:first > th").length;
        $("#" + block_id).find('#answerTable tr').each(function () {
            let inputType = $("#" + block_id).find('#answerType').val()
            if (inputType === "1") {
                inputType = "radio"
            } else if (inputType === "2") {
                inputType = "checkbox"
            } else if (inputType === "3") {
                inputType = "text"
            }
            const currentRowInputName = $(this).find('td').eq(colCount - 1).find('input').attr('name')
            $(this).find('th').eq(colCount - 1).after(`<th><input style="" type="text" value="Column ${colCount}"/></th>`);
            $(this).find('td').eq(colCount - 1).after(`<td><input type="${inputType}" name="${currentRowInputName}" disabled readonly/></td>`);
            if (inputType === "text") {
                $(this).find('td input[disabled]').css({ 'width': "60%", "height": "40%" });
            }
        });
        $("#" + block_id).find('#answerTable tr:last td:last').replaceWith('<td><i class="far fa-trash-alt DeleteButtonCol" style="padding:5px;"></i></td>');
        formBlockSettingCommon2(block_id,removeActive,formType,droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting);
    });
    $("#" + block_id).find("#addstatement").unbind("click").click(function (e) {
        e.stopPropagation();
        const rowCount = $("#" + block_id).find("#answerTable tr").length;
        const colCount = $("#" + block_id).find("#answerTable > tbody > tr:last > td").length;
        let inputType = $("#" + block_id).find('#answerType').val()
        if (inputType === "1") {
            inputType = "radio"
        } else if (inputType === "2") {
            inputType = "checkbox"
        } else if (inputType === "3") {
            inputType = "text"
        }
        $("#" + block_id).find("#answerTable tr:last").prev().after(`<tr style="text-align:center;height:40px"><td><input style="" type="text" value="Row ${rowCount - 1}"/></td></tr>`);
        for (let i = 1; i < colCount; i++) {
            $("#" + block_id).find("#answerTable tr:last").prev().append(`<td><input type="${inputType}" name="title${rowCount - 1}" disabled readonly/></td>`);
            if (inputType === "text") {
                $("#" + block_id).find("input[disabled]").css({ 'width': "60%", "height": "40%" });
            }
        }
        $("#" + block_id).find("#answerTable tr:last").prev().append(`<td><i class="far fa-trash-alt DeleteButtonRow" style="padding:5px;"></i></td>`);
        formBlockSettingCommon2(block_id,removeActive,formType,droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting);
    });
    $("#"+block_id).find("#answerTable").find(".DeleteButtonRow").unbind("click").click(function(){
        $(this).closest("tr").remove();
    });
    $("#"+block_id).find("#answerTable").find(".DeleteButtonCol").unbind("click").click(function(){
        let index = $(this).parent().index()
        $("#" + block_id).find('#answerTable tr').each(function () {
            $(this).children(`th:eq(${index})`).remove();
            $(this).children(`td:eq(${index})`).remove();
        });
    });
    if($("#"+block_id).attr("rolefor")==="contact_form"){
        $("#"+block_id).find(".vertical input[type='checkbox']").unbind("change").change(function(){
            $(this).attr("checked",$(this).prop("checked"));
            if($(this).prop("checked") === true){
                $("#"+block_id).find(".blockanswer").addClass("vertically");
                $("#"+block_id).find(".blockanswer .row .col-6").addClass("col-12");
                $("#"+block_id).find(".blockanswer .row .col-12").removeClass("col-6");
                $("#"+block_id).find(".blockanswer .row div label").removeClass("editor-icon");
                $("#"+block_id).find(".blockanswer .row div label").addClass("editor-icon-p")
                $("#"+block_id).find(".blockanswer .row div label").css({left: "18px"});
                $("#"+block_id).find(".blockanswer .row div span input").css("padding-left", "36px !important");
            } else {
                $("#"+block_id).find(".blockanswer").removeClass("vertically");
                $("#"+block_id).find(".blockanswer .row .col-12").addClass("col-6");
                $("#"+block_id).find(".blockanswer .row .col-6").removeClass("col-12");
                $("#"+block_id).find(".blockanswer .row div label").removeClass("editor-icon-p");
                $("#"+block_id).find(".blockanswer .row div label").addClass("editor-icon");
                $("#"+block_id).find(".blockanswer .row div span input").css("padding-left", "24px !important");
                if($("#"+block_id).find(".ansrequired input[type='checkbox']").prop("checked")){
                    $("#"+block_id).find(".blockanswer .row div label").css({left: "18px"});
                }
            }
            formBlockSettingCommon2(block_id,removeActive,formType,droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting);
        });
        $("#"+block_id).find(".icons input[type='checkbox']").unbind("change").change(function(){
            $(this).attr("checked",$(this).prop("checked"));
            if($(this).prop("checked") === true){
                $(".blockanswer").addClass("showicon");
                if($("#"+block_id).find(".vertical input[type='checkbox']").prop("checked") === true){
                    $("#"+block_id).find(".blockanswer .row div label").removeClass("editor-icon");
                    $("#"+block_id).find(".blockanswer .row div label").addClass("editor-icon-p")
                } else {
                    $("#"+block_id).find(".blockanswer .row div label").removeClass("editor-icon-p");
                    $("#"+block_id).find(".blockanswer .row div label").addClass("editor-icon")
                }
                $("#"+block_id).find(".blockanswer .row div input").css({"padding-left": "36px !important"});
                $("#"+block_id).find(".blockanswer .row div label").attr("style", "");
                if($("#"+block_id).find(".ansrequired input[type='checkbox']").prop("checked")){
                    $("#"+block_id).find(".blockanswer .row div label").css({left: "18px"});
                }
            } else {
                $("#"+block_id).find(".blockanswer").removeClass("showicon");
                $("#"+block_id).find(".blockanswer .row div label").attr("style", "display:none");
                $("#"+block_id).find(".blockanswer .row div input").css({"padding-left": "24px !important"});
            }
        });
    }
    $("#"+block_id).find(".comments input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        if($(this).prop("checked") === true) {
            $("#"+block_id).find(".blockanswer").addClass("comments");
            $("#"+block_id).find(".divComment").html(`<div class="commentsDiv" style="text-align:left"> <textarea class="matrixCommentTextArea" placeholder="Use this text box if you would like to give additional instructions to the respondent" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:100%; height:72px;display:inline-block;"></textarea> </div>`);
            $("textarea").unbind("change").change(function(e){
                e.stopPropagation();
            });
            $("textarea").unbind("focus").focus(function(e){
                e.stopPropagation();
            });
        } else {
            $("#"+block_id).find(".blockanswer").removeClass("comments");
            $("#"+block_id).find(".commentsDiv").remove();
        }
    });
    if($("#"+block_id).attr("rolefor")==="date_control"){
        $("#"+block_id).find(".dateRange input[type='checkbox']").unbind("change").change(function(){
            $(this).attr("checked",$(this).prop("checked"));
            if($(this).prop("checked") === true){
                $("#"+block_id).find(".blockanswer").addClass("range");
                $("#"+block_id).find("#dateRangeDiv").css({"display": "block"});
            } else {
                $("#"+block_id).find(".blockanswer").removeClass("range");
                $("#"+block_id).find("#dateRangeDiv").css({"display": "none"});
            }
        });
    }
    if($("#"+block_id).attr("rolefor")==="time_control"){
        $("#"+block_id).find(".timeRange input[type='checkbox']").unbind("change").change(function(){
            $(this).attr("checked",$(this).prop("checked"));
            if($(this).prop("checked") === true){
                $("#"+block_id).find(".blockanswer").addClass("range");
                $("#"+block_id).find("#timeRangeDiv").css({"display": "block"});
            } else {
                $("#"+block_id).find(".blockanswer").removeClass("range");
                $("#"+block_id).find("#timeRangeDiv").css({"display": "none"});
            }
        });
    }
    $("#"+block_id).find("#inputType").unbind("change").change(function(e){
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        if($(this).val() === "range"){
            $("#"+block_id).find(".rangeTable").css({"display": "block"});
            $("#"+block_id).find(".inputTable").css({"display": "none"});
            $("#"+block_id).find(".forSlider").removeClass("d-none").addClass("d-inline-block");
            $("#"+block_id).find("input.sumQuestion").addClass("my-3");
            if($("#"+block_id).find(".total input[type='checkbox']").prop("checked"))
                $("#"+block_id).find(".totalBox").css({"display": "table-row"});
            else
                $("#"+block_id).find(".totalBox").css({"display": "none"});
        } else {
            $("#"+block_id).find(".rangeTable").css({"display": "none"});
            $("#"+block_id).find(".inputTable").css({"display": "block"});
            $("#"+block_id).find(".forSlider").removeClass("d-inline-block").addClass("d-none");
            $("#"+block_id).find("input.sumQuestion").removeClass("my-3");
            if($("#"+block_id).find(".total input[type='checkbox']").prop("checked"))
                $("#"+block_id).find(".totalInputRow").css({"display": "table-row"});
            else
                $("#"+block_id).find(".totalInputRow").css({"display": "none"});
        }
    });
    $("#"+block_id).find(".total input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        if($(this).prop("checked")===true){
            $("#"+block_id).find(".blockanswer").addClass("total");
            if($("#"+block_id).find("#inputType").val() === "range")
                $("#"+block_id).find(".totalBox").css({"display": "table-row"});
            else
                $("#"+block_id).find(".totalInputRow").css({"display": "table-row"});
        } else {
            $("#"+block_id).find(".blockanswer").removeClass("total");
            if($("#"+block_id).find("#inputType").val() === "range")
                $("#"+block_id).find(".totalBox").css({"display": "none"});
            else
                $("#"+block_id).find(".totalInputRow").css({"display": "none"});
        }
    });
    $("#"+block_id).find(".postion input[type='checkbox']").unbind("change").change(function(){
        $(this).attr("checked",$(this).prop("checked"));
        if($(this).prop("checked")===true){
            $("#"+block_id).find(".blockanswer").addClass("position");
        } else {
            $("#"+block_id).find(".blockanswer").removeClass("position");
        }
    });
    $("#"+block_id).find("select#level").unbind("change").change(function(e){
        e.stopPropagation();
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        let levels = $("#"+block_id).find("select#level").val();
        let symbol = $("#"+block_id).find("select#symbol").val();
        let symbolStr = ``;
        for(let i=0; i<levels; i++){
            symbolStr+=`<i class="${symbol}" style="font-size: 18px;cursor: not-allowed; width:30px"></i>`;
        }
        $("#"+block_id).find("div.col-12.blockanswer div.row div.col-12 div").html(symbolStr);
    });
    $("#"+block_id).find("select#symbol").unbind("change").change(function(e){
        e.stopPropagation();
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        let levels = $("#"+block_id).find("select#level").val();
        let symbol = $("#"+block_id).find("select#symbol").val();
        let symbolStr = ``;
        for(let i=0; i<levels; i++){
            symbolStr+=`<i class="${symbol}" style="font-size: 18px;cursor: not-allowed; width:30px"></i>`;
        }
        $("#"+block_id).find("div.col-12.blockanswer div.row div.col-12 div").html(symbolStr);
    });
    $("#"+block_id).find("select#labels").unbind("change").change(function(e){
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        if($(this).val() !== "Custom"){
            $("#"+block_id).find("div.lblTxts").css({"display": "none"});
            let label1 = $(this).val().split("/")[0];
            let label2 = $(this).val().split("/")[1];
            $("#"+block_id).find("p.label-1").html(label1);
            $("#"+block_id).find("p.label-2").html(label2);
        } else {
            $("#"+block_id).find("div.lblTxts").css({"display": "block"});
            $("#"+block_id).find("div.lblTxts input.lblTxt1").val($("#"+block_id).find("p.label-1").html());
            $("#"+block_id).find("div.lblTxts input.lblTxt2").val($("#"+block_id).find("p.label-2").html());
        }
    });
    $("#"+block_id).find("div.lblTxts input.lblTxt1").unbind("keyup").keyup(function(){
        $("#"+block_id).find("p.label-1").html($(this).val());
    });
    $("#"+block_id).find("div.lblTxts input.lblTxt2").unbind("keyup").keyup(function(){
        $("#"+block_id).find("p.label-2").html($(this).val());
    });
    $("#"+block_id).find("select#yesNoSymbols").unbind("change").change(function(e){
        $(this).find('option').removeAttr("selected");
        $(this).find('option[value="'+$(this).val()+'"]').attr("selected","selected");
        let symbol1 = $(this).val().split("/")[0];
        let symbol2 = $(this).val().split("/")[1];
        $("#"+block_id).find("div.symbol-1 i").attr("class", symbol1);
        $("#"+block_id).find("div.symbol-2 i").attr("class", symbol2);
    });
    $('input[type="text"],label.switch,textarea,select,input[type="checkbox"]').unbind("click").unbind("focus").on("click focus",function(e) {
        e.stopPropagation();
    });
    if(formType === "assessment"){
        setMaxPoints(block_id,selectedpage);
    }
    $("#"+block_id).find("input[type='checkbox'][class='addcomment']").unbind("change").change(function(){
        if($(this).prop("checked")===true){
            $(this).parent("span").parent("div").attr("addcomment","yes");
            $(this).parent("span").parent("div").after('<div class="w-100 commentdiv" style="margin-bottom:10px;"><input type="text" placeholder="Enter comment" style="border: 1px solid #d2d2d2;" readonly/></div>');
        } else {
            $(this).parent("span").parent("div").attr("addcomment","no");
            $(this).parent("span").parent("div").nextAll("div.commentdiv:first").remove();
        }
    });
    $("#"+block_id).find(".blockquestion .ai-main").unbind("click").click(function(e){
        e.stopPropagation();
        window.setOpenAiButton($("#" + block_id).find(".blockquestion input[type=text]"),"question");
    });
}
export function deleteSingleImage(block_id,formType,selectedpage){
    $("#"+block_id).find(".blockanswer .col-12 .fa-trash-alt").unbind("click").click(function(){
        $(this).closest(".col-12").remove();
        setTimeout(function(){
            $("#"+block_id).find("[name*='question']").trigger("click");
        },100);
        if($("#"+block_id).attr("rolefor")==="image_with_text_form"){
            if($("#"+block_id).find(".blockanswer div.row div[item-value]").length < 10){
                $("#"+block_id).find(".bottom-control").show();
            }
            let i=0;
            $("#"+block_id).find(".blockanswer div.row div[item-value]").each(function(){
                $(this).attr("item-value",i);
                i++;
            });
        }
        if(formType === "assessment"){
            calculateMaxPoints(selectedpage);
            getCategoryListBox("assessment");
        }
    });
    $("#"+block_id).find(".blockanswer .col-3 .fa-trash-alt").unbind("click").click(function(){
        $(this).closest(".col-3").remove();
        setTimeout(function(){
            $("#"+block_id).find("[name*='question']").trigger("click");
        },100);
        if($("#"+block_id).attr("rolefor")==="image_form"){
            if($("#"+block_id).find(".blockanswer div.row div[item-value]").length < 10){
                $("#"+block_id).find(".bottom-control").show();
            }
            let i=0;
            $("#"+block_id).find(".blockanswer div.row div[item-value]").each(function(){
                $(this).attr("item-value",i);
                i++;
            });
        }
        if(formType === "assessment"){
            calculateMaxPoints(selectedpage);
            getCategoryListBox("assessment");
        }
    });
}
export function calculateMaxPoints(selectedpage){
    let tempTotal = 0;
    let notIncluded = ["open_ended","age"];
    let radioCheckboxType = ["single_answer","single_answer_checkbox","single_answer_button","single_answer_combo","gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race","image_form","image_with_text_form","yes_no"];
    $("#templateBody"+selectedpage).find('.mojoMcBlock.frm-block').unbind("each").each(function () {
        let rf = $(this).attr("rolefor");
        if(!notIncluded.includes(rf)){
            if(radioCheckboxType.includes(rf)){
                if($(this).find(".blockanswer").hasClass("multipleanswer")){
                    $(this).find(".pointsbox").each(function () {
                        if($(this).val() !== ""){
                            tempTotal += parseInt($(this).val());
                        }
                    });
                } else {
                    let t=0;
                    $(this).find(".pointsbox").each(function () {
                        if(parseInt($(this).val()) >= t) {
                            t = parseInt($(this).val());
                        }
                    });
                    tempTotal += parseInt(t);
                }
            }
        }
    });
    $("#templateBody"+selectedpage).find(".catmaxpointsmain .catmaxpoints").html(tempTotal);
}
export function setMaxPoints(block_id,selectedpage){
    $("#"+block_id).find(".pointsbox").unbind("keyup").keyup(function(){
        $(this).attr("value",$(this).val().replace(/[^\d]/g, ""));
        $(this).val($(this).val().replace(/[^\d]/g, ""));
        calculateMaxPoints(selectedpage);
        getCategoryListBox("assessment");
    });
    $('input[type="text"],label.switch,textarea,select,input[type="checkbox"]').unbind("click").unbind("focus").on("click focus",function(e) {
        e.stopPropagation();
    });
}
export function formBlockControl(block_id,formBlockSetting) {
    let rolefor = $("#"+block_id).attr("rolefor");
    let x = ["gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
    if(rolefor==="open_ended" || rolefor==="age") {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch longans" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Long Answer</p>');
        $("#"+block_id).find(".top-control p.d-inline-block:first").before('<p class="d-inline-block mb-0"><label class="switch labelless" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Labelless</p>');
    }
    if(rolefor==="single_answer" || rolefor==="single_answer_checkbox" || x.includes(rolefor)) {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch multians" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Multiple Answers</p>');
        if(rolefor==="single_answer_checkbox") {
            setTimeout(function() {
                $("#" + block_id).find(".multians").trigger("click");
            },1000);
        }
    }
    if(rolefor==="single_answer_combo") {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch multians" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Allow Multiple Choices</p>');
    }
    if(rolefor==="single_answer" || rolefor==="single_answer_checkbox" || rolefor==="single_answer_button" || rolefor==="single_answer_combo") {
        $("#"+block_id).find(".bottom-control").append('<p class="addoption mb-0" style="margin-top: 5px;"><i class="fas fa-plus" style="margin-right:15px;"></i>Add Option</p>');
    }
    if (rolefor === "email") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is your email?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        $("#"+block_id).find(".top-control p.d-inline-block:first").before('<p class="d-inline-block mb-0"><label class="switch labelless" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Labelless</p>');
    }
    if (rolefor === "phone") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is your phone?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        $("#"+block_id).find(".top-control p.d-inline-block:first").before('<p class="d-inline-block mb-0"><label class="switch labelless" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Labelless</p>');
    }
    if (rolefor === "matrix") {
        $("#" + block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0">Answers <select id="answerType" style="width:150px;margin-top:5px;border-radius:0;vertical-align:baseline !important;margin-bottom:unset"><option value="1">Single Answer</option><option value="2">Multiple Answer</option><option value="3">Text Answer</option></select></p><p class="d-inline-block mb-0"><label class="switch comments" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Additional Instructions</p>');
        $("#" + block_id).find(".bottom-control").append('<p class="d-inline-block mb-0" id="addoption" style="margin-top: 5px;"><i class="fas fa-plus" style="margin-right:10px;"></i>Add Columns</p><p class="d-inline-block mb-0"  id="addstatement" style="margin-left:15px; margin-top: 5px;"><i class="fas fa-plus" style="margin-right:10px;"></i>Add Rows</p>');
    }
    if(rolefor==="contact_form") {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch vertical" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Vertically</p><p class="d-inline-block mb-0"><label class="switch icons" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Show Icons</p>');
    }
    if(rolefor==="date_control") {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch dateRange" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Range</p>');
        $("#"+block_id).find(".top-control p.d-inline-block:first").before('<p class="d-inline-block mb-0"><label class="switch labelless" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Labelless</p>');
        $("#"+block_id).find(".bottom-control").before('<div class="col-12" id="dateRangeDiv" style="display:none;"><p class="d-inline-block mb-1 pr-3"><strong>Start : </strong> <input type="text" name="startRange" style="display: inline-block;width: 120px;" class="rangeSpan"></p><p class="d-inline-block mb-1"><strong>End : </strong><input type="text" name="endRange" style="display: inline-block;width: 120px;" class="rangeSpan"></p></div>');
        setTimeout(function(){
            let dateFormat = "mm/dd/yy";
            let from = $("#" + block_id).find("#dateRangeDiv").find("input[name='startRange']").datepicker({
                defaultDate: getDate(new Date())
            }).on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            });
            let to = $("#" + block_id).find("#dateRangeDiv").find("input[name='endRange']").datepicker({
                defaultDate: getDate(new Date())
            }).on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });
            function getDate(element) {
                let date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch (error) {
                    date = null;
                }
                return date;
            }
        }, 1000);
    }
    if(rolefor==="time_control") {
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch timeRange" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Range</p>');
        $("#"+block_id).find(".top-control p.d-inline-block:first").before('<p class="d-inline-block mb-0"><label class="switch labelless" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Labelless</p>');
        $("#"+block_id).find(".bottom-control").before(`<div class="col-12" id="timeRangeDiv" style="display:none;"><p class="d-inline-block mb-1 pr-3"><strong>Start : </strong> <input type="text" name="startTimeRange" style="display: inline-block;width: 120px;" class="rangeTimeSpan"></p><p class="d-inline-block mb-1"><strong>End : </strong><input type="text" name="endTimeRange" style="display: inline-block;width: 120px;" class="rangeTimeSpan"></p></div>`);
        setTimeout(() => {
            let startDateTextBox = $("#"+block_id).find("#timeRangeDiv").find("input[name='startTimeRange']");
            let endDateTextBox = $("#"+block_id).find("#timeRangeDiv").find("input[name='endTimeRange']");
            startDateTextBox.timepicker({
                timeFormat: "hh:mm tt",
                onClose: function(dateText, inst){
                    if (endDateTextBox.val() !== '') {
                        let testStartDate = startDateTextBox.datetimepicker('getDate');
                        let testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            endDateTextBox.datetimepicker('setDate', testStartDate);
                    } else {
                        endDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                }
            });
            endDateTextBox.timepicker({
                timeFormat: "hh:mm tt",
                onClose: function(dateText, inst) {
                    if (startDateTextBox.val() !== '') {
                        let testStartDate = startDateTextBox.datetimepicker('getDate');
                        let testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            startDateTextBox.datetimepicker('setDate', testEndDate);
                    } else {
                        startDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                }
            });
        }, 1000);
    }
    if(rolefor === "image_form" || rolefor === "image_with_text_form"){
        $("#"+block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0"><label class="switch multians" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Multiple Answers</p>');
        $("#"+block_id).find(".bottom-control").append('<p class="addoption" style="margin-top: 5px;"><i class="fas fa-plus" style="margin-right:15px;"></i>Add Option</p>');
    }
    if(rolefor === "rating_symbol"){
        $("#" + block_id).find(".top-control p.d-inline-block").css({"margin-left":"10px"});
        $("#" + block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0">Levels <select id="level" style="width:55px;border-radius:0px;vertical-align:baseline !important;margin-bottom:unset; padding-left:1px;margin-right: 10px; margin-left: 5px;"> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> <option value="9">9</option> <option value="10">10</option></select></p><p class="d-inline-block mb-0"> Symbol <select id="symbol" style="width:80px;border-radius:0;vertical-align:baseline !important;margin-bottom:unset; padding-left:1px;margin-left: 5px;"> <option value="p-2 far fa-star">Star</option> <option value="p-2 far fa-smile">Smile</option> <option value="p-2 far fa-frown">Sad</option> <option value="p-2 far fa-crown">Crown</option> <option value="p-2 far fa-heart">Heart</option> <option value="p-2 far fa-thumbs-up">Like</option> <option value="p-2 far fa-user">User</option> <option value="p-2 far fa-bolt">Flash</option> <option value="p-2 far fa-lightbulb">Idea</option> </select></p>');
    }
    if(rolefor === "yes_no"){
        $("#" + block_id).find(".top-control p.d-inline-block").css({"margin-left":"10px"});
        $("#" + block_id).find(".top-control p.d-inline-block").before('<p class="d-inline-block mb-0">Label <select id="labels" style="width:130px;border-radius:0px;vertical-align:baseline !important;margin-bottom:unset; padding-left:1px;margin-right: 10px; margin-left: 5px;"> <option value="Yes/No">Yes / No</option> <option value="Like/Dislike">Like / Dislike</option> <option value="True/False">True / False</option> <option value="Male/Female">Male / Female</option> <option value="Custom">Custom</option> </select></p><p class="d-inline-block mb-0"> Symbol <select id="yesNoSymbols" style="width:160px;border-radius:0;vertical-align:baseline !important;margin-bottom:unset; padding-left:1px;margin-left: 5px;"> <option value="far fa-check-circle/far fa-times-circle">Check Mark / Cross</option> <option value="far fa-plus/far fa-minus">Plus / Minus</option> <option value="far fa-thumbs-up/far fa-thumbs-down">Thumbs Up / Down</option> <option value="far fa-male/far fa-female">Male / Female</option> <option value="far fa-arrow-up/far fa-arrow-down">Up / Down</option> <option value="far fa-smile/far fa-frown">Smile / Sad</option> </select></p>');
        $("#"+block_id).find(".bottom-control").append('<div class="lblTxts" style="display: none;margin-top: 5px;"><p class="d-inline-block mb-1 pr-3">Label - 1 : <input class="lblTxt1" type="text" style="display:inline; width: 100px"></p><p class="d-inline-block mb-1">Label - 2 : <input class="lblTxt2" type="text" style="display:inline; width: 100px"></p></div>');
    }
    if(rolefor === "rank"){
        $("#"+block_id).find(".bottom-control").append('<p class="addoption mb-0" style="margin-top: 15px;"><i class="fas fa-plus" style="margin-right:15px;"></i>Add Option</p>');
    }
    if(rolefor === "constant_sum"){
        $("#" + block_id).find(".top-control p.d-inline-block").before(`<p class="d-inline-block mb-0">Type <select id="inputType" style="height:35px;width:130px;border-radius:0px;vertical-align:baseline !important;margin-bottom:unset; padding-left:1px;margin-right: 10px; margin-left: 5px;"><option value="range">Slider</option><option value="input">Input</option></select></p><p class="d-inline-block mb-0"><label class="switch total" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Show Total</p><p class="d-inline-block mb-0"><label class="switch postion" style="margin: 6px 10px 8px;"><input type="checkbox"><span class="slider round offSlider"></span></label>Start Position</p>`);
        $("#"+block_id).find(".bottom-control").append(`<p class="addoption d-inline-block mb-0 mt-4" style="height: fit-content"><i class="fas fa-plus" style="margin-right:15px;display:inline;width: 100px;"></i>Add Option</p><div style="text-align: right; margin-top: 10px; margin-left: auto"><p class="forSlider d-inline-block mb-1"><span class="rangedSpan">Range : </span><input type="text" class="lower" style="display:inline;width: 150px;" value="0" onkeyup="$(this).attr('value',$(this).val())"> - <input type="text" class="upper" value="100" onkeyup="$(this).attr('value',$(this).val())" style="display:inline;width: 150px;"></p><p class="forSlider d-inline-block mb-1"><span class="segmentSpan ml-1">Segments : </span><input type="text" style="display:inline;width: 150px;" class="segments" value="5" onkeyup="$(this).attr('value',$(this).val())"></p><br/><p class="d-inline-block mb-1 mt-1"><span>Must total to : </span><input type="text" class="mTotal" value="0" style="display:inline;width: 150px;" onkeyup="$(this).attr('value',$(this).val())"></p><p class="forSlider d-inline-block mb-1 ml-1">Decimals : <input type="text" class="decimals" value="1" style="display:inline;width: 150px;" onkeyup="$(this).attr('value',$(this).val())"></p></div>`);
    }
    if (rolefor === "gender") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is your gender?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Male", "Female"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "age") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("In what year were you born?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
    }
    if (rolefor === "marital_status") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is your marital status?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Now married", "Widowed", "Divorced", "Separated", "Never married"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "education") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is the highest degree or level of school you have completed? If currently enrolled, mark the previous grade or highest degree received.");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["No schooling completed", "Nursery school to 8th grade", "9th, 10th or 11th grade", "12th grade, no diploma", "High school graduate - high school diploma or the equivalent (for example: GED)", "Some college credit, but less than 1 year", "1 or more years of college, no degree", "Associate degree (for example: AA, AS)", "Bachelor's degree (for example: BA, AB, BS)", "Master's degree (for example: MA, MS, MEng, MEd, MSW, MBA)", "Professional degree (for example: MD, DDS, DVM, LLB, JD)", "Doctorate degree (for example: PhD, EdD)"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "employment_status") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("Are you currently...?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Employed for wages", "Self-employed", "Out of work and looking for work", "Out of work but not currently looking for work", "A homemaker", "A student", "Retired", "Unable to work"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "employer_type") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("Please describe your work.");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Employee of a for-profit company or business or of an individual, for wages, salary, or commissions", "Employee of a not-for-profit, tax-exempt, or charitable organization", "Local government employee (city, county, etc.)", "State government employee", "Federal government employee", "Self-employed in own not-incorporated business, professional practice, or farm", "Self-employed in own incorporated business, professional practice, or farm", "Working without pay in family business or farm"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "housing") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("Is this house, apartment, or mobile home:");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Owned by you or someone in this household with a mortgage or loan?", "Owned by you or someone in this household free and clear (without a mortgage or loan)?", "Rented for cash rent?", "Occupied without payment of cash rent?"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "household_income") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("What is your total household income?");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Less than $10,000", "$10,000 to $19,999", "$20,000 to $29,999", "$30,000 to $39,999", "$40,000 to $49,999", "$50,000 to $59,999", "$60,000 to $69,999", "$70,000 to $79,999", "$80,000 to $89,999", "$90,000 to $99,999", "$100,000 to $149,999", "$150,000 or more"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if (rolefor === "race") {
        $("#" + block_id).find(".blockquestion input[type=text]").val("Please specify your race.");
        $("#" + block_id).find(".blockquestion input[type=text]").trigger("keyup");
        let answers = ["Hispanic or Latino", "American Indian or Alaska Native", "Asian", "Black or African American", "Native Hawaiian or Other Pacific Islander", "White"];
        let i = 0;
        $("#" + block_id).find(".singleAnswer").each(function(){
            $(this).val(answers[i]);
            i++;
        });
    }
    if(rolefor === "label"){
        $("#" + block_id).find(".top-control p.d-inline-block:first-of-type").remove();
    }
    if(rolefor === "captcha"){
        $("#" + block_id).find(".top-control i.far.fa-clone:first-of-type").remove();
    }
    formBlockSetting(block_id);
}
export function removeActive(type) {
    $("#preview-template").find(".col-6 input[type='checkbox']").css("display", "none");
    $('#preview-template').contents().find('.top-control,.bottom-control').hide();
    $('#preview-template').contents().find(".row.row-bg").removeClass("row-bg");
    $('#preview-template').contents().find("[rolefor='single_answer_button'] .blockanswer .blockoption input[type='text']:not(.pointsbox)").attr("type","button").addClass("btn btn-default");
    $('#preview-template').contents().find("[rolefor='matrix'] .blockanswer #answerTable input[type='text']").not(':input[readonly]').each(function(){
        $(this).replaceWith(`<span class="answerTableSpan">${$(this).val()}</span>`)
    })
    $("#preview-template").contents().find("textarea.terms").each(function(){
        $(this).replaceWith(`<span class="terms" style="margin-bottom:10px; margin-top:10px;">${$(this).val()}</span>`);
    });
    $("#preview-template").contents().find("input.agreement").each(function(){
        $(this).replaceWith(`<span class="agreement ml-4" style="margin-bottom:10px; margin-top:10px;display: inline-block">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("textarea.matrixCommentTextArea").each(function(){
        $(this).replaceWith(`<span class="matrixCommentTextArea">${$(this).val()}</span>`)
    });
    $('#preview-template').contents().find("textarea.textArea").each(function(){
        $(this).replaceWith(`<span class="textArea">${$(this).val()}</span>`)
    });
    $('#preview-template').contents().find("input.rangeSpan").each(function(){
        $(this).replaceWith(`<span class="rangeSpan">${$(this).val()}</span>`);
        $("span.rangeSpan:even").addClass("startDate");
        $("span.rangeSpan:odd").addClass("endDate");
    });
    $('#preview-template').contents().find("input.rangeTimeSpan").each(function(){
        $(this).replaceWith(`<span class="rangeTimeSpan">${$(this).val()}</span>`);
        $("span.rangeTimeSpan:even").addClass("startTime");
        $("span.rangeTimeSpan:odd").addClass("endTime");
    });
    $('#preview-template').contents().find("input.singleAnswer").each(function(){
        $(this).replaceWith(`<span class="singleAnswer w-100">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.starthours").each(function(){
        $(this).replaceWith(`<span class="starthours">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.startminutes").each(function(){
        $(this).replaceWith(`<span class="startminutes">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.starta").each(function(){
        $(this).replaceWith(`<span class="starta">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.endhours").each(function(){
        $(this).replaceWith(`<span class="endhours">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.endminutes").each(function(){
        $(this).replaceWith(`<span class="endminutes">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("select.enda").each(function(){
        $(this).replaceWith(`<span class="enda">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("input.rating-text-a").each(function(){
        $(this).replaceWith(`<span class="rating-text-a">${$(this).val()}</span>`);
    });
    $('#preview-template').contents().find("input.rating-text-b").each(function(){
        $(this).replaceWith(`<span class="rating-text-b">${$(this).val()}</span>`);
    });
    $("#preview-template").find("input.rankTxt").each(function(){
        $(this).replaceWith(`
			<div class="rankTxt" style="width:98%; text-align:left">${$(this).val()}</div>
		`);
    });
    $("#preview-template").find("input.sumQuestion").each(function(){
        $(this).replaceWith(`
			<span class="sumQuestion">${$(this).val()}</span>
		`);
    });
    $("#preview-template").find("textarea.descriptionText").each(function(){
        $(this).replaceWith(`
			<span class="descriptionText">${$(this).val()}</span>
		`);
    });
    $('#preview-template').contents().find("[rolefor='single_answer_combo']").each(function(){
        let op = "";
        if(type === "assessment") {
            op += "<option>Select answer</option>";
            $(this).find('.blockoption input[type="text"]:not(.pointsbox)').each(function () {
                op += "<option value='" + $(this).siblings(".pointsbox").val() + "'>" + $(this).val() + "</option>";
            });
        } else {
            op += "<option>Select answer</option>";
            $(this).find('.blockoption input[type="text"]').each(function(){
                op += "<option>"+$(this).val()+"</option>";
            });
        }
        if(op !== ""){
            $(this).find(".blockoption").find("select.singleanswercombo").html(op);
            $(this).find(".blockoption").find("select.singleanswercombo").show();
            $(this).find(".blockoption").find("div").hide().removeClass("d-flex");
        }
    });
    $('#preview-template').contents().find("i.far.fa-trash-alt").hide();
    $('#preview-template').contents().find("span.addcommentspan").removeClass("d-flex").addClass("d-none");
}
export function resetCounter(formBlockSetting) {
    let s;
    $('#preview-template').contents().find('.templateBody').unbind("each").each(function() {
        let c = 1;
        s = $(this).attr("id").replaceAll("templateBody","");
        $(this).contents().find('.mojoMcBlock.frm-block').unbind("each").each(function () {
            $(this).find("span.counter").html(c);
            $(this).attr("id","preview_Form_"+s+c);
            formBlockSetting("preview_Form_"+s+c);
            c++;
        });
    });
}
export function pagesettingcommon(selectedpage,droparray){
    $(".pagelayout").removeClass("active");
    if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
        if($("#templateBody"+selectedpage).find(".imageBlock").hasClass("imageBlockPageLayout2")){
            $(".pagelayout2").addClass("active");
        } else if($("#templateBody"+selectedpage).find(".imageBlock").hasClass("imageBlockPageLayout3")){
            $(".pagelayout3").addClass("active");
        } else if($("#templateBody"+selectedpage).find(".imageBlock").hasClass("imageBlockPageLayout4")){
            $(".pagelayout4").addClass("active");
        } else if($("#templateBody"+selectedpage).find(".imageBlock").hasClass("imageBlockPageLayout5")){
            $(".pagelayout5").addClass("active");
        }
    } else {
        if($("#templateBody"+selectedpage).css("background-image") === "none"){
            $(".pagelayout1").addClass("active");
        } else {
            $(".pagelayout6").addClass("active");
        }
    }
    $(`#pageTransition option[value="${$("#templateBody"+selectedpage).attr("item-transition")}"]`).attr("selected", true);
    if($("#templateBody"+selectedpage).find(".imageBlock").length > 0 && $("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
        $("#templateBody"+selectedpage).find('.imageBlock div.mojoImageUploader').unbind("click").click(function(){
            let tid = $("#templateBody"+selectedpage).find('.questionBlock .mojoMcBlock.frm-block.active').attr("id");
            $("#"+tid).trigger("click");
        });
    } else {
        $("#templateBody"+selectedpage).find('.imageBlock div.mojoImageUploader').unbind("click").click(function(){
            hidedsm();
            filemanager("templateBody"+selectedpage,"form","form");
        });
    }
    $(".pagelayout").unbind("click").click(function(){
        $(".pagelayout").removeClass("active");
        $(this).addClass("active");
        let bgImage = "";
        if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
            bgImage = $("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image");
        } else {
            bgImage = $("#templateBody"+selectedpage).css("background-image");
        }
        $("#templateBody"+selectedpage).find(".imageBlock").remove();
        $("#templateBody"+selectedpage).find(".questionBlock").removeClass("w-50").addClass("w-100");
        $("#templateBody"+selectedpage).css("background-image","");
        if($(this).hasClass("pagelayout1")){
            $(".dsmbsettingbutton i.tpl-specific-i").removeClass("tpl-specific-active");
        } else if($(this).hasClass("pagelayout2")){
            $("#templateBody"+selectedpage).find(".questionBlock").before("<div class='imageBlock imageBlockPageLayout2'>"+droparray["blankImageBlockEditor"]+"</div>");
            $("#templateBody"+selectedpage).find(".questionBlock").removeClass("w-100").addClass("w-50");
            $("#templateBody"+selectedpage).find(".imageBlock").addClass("w-50");
            if(bgImage !== "" && bgImage !== "none"){
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-100 h-100"></div>');
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image':bgImage,'background-size':'cover','background-position':'center center'});
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader').addClass("bg-white");
            }
        } else if($(this).hasClass("pagelayout3")){
            $("#templateBody"+selectedpage).find(".questionBlock").after("<div class='imageBlock imageBlockPageLayout3'>"+droparray["blankImageBlockEditor"]+"</div>");
            $("#templateBody"+selectedpage).find(".questionBlock").removeClass("w-100").addClass("w-50");
            $("#templateBody"+selectedpage).find(".imageBlock").addClass("w-50");
            if(bgImage !== "" && bgImage !== "none"){
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-100 h-100"></div>');
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image':bgImage,'background-size':'cover','background-position':'center center'});
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader').addClass("bg-white");
            }
        } else if($(this).hasClass("pagelayout4")){
            $("#templateBody"+selectedpage).find(".questionBlock").before("<div class='imageBlock imageBlockPageLayout4'>"+droparray["blankImageBlockEditor"]+"</div>");
            $("#templateBody"+selectedpage).find(".questionBlock").removeClass("w-100").addClass("w-50");
            $("#templateBody"+selectedpage).find(".imageBlock").addClass("w-50");
            if(bgImage !== "" && bgImage !== "none"){
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-50 h-50"></div>');
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image':bgImage,'background-size':'cover','background-position':'center center'});
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader').addClass("bg-white");
            }
        } else if($(this).hasClass("pagelayout5")){
            $("#templateBody"+selectedpage).find(".questionBlock").after("<div class='imageBlock imageBlockPageLayout5'>"+droparray["blankImageBlockEditor"]+"</div>");
            $("#templateBody"+selectedpage).find(".questionBlock").removeClass("w-100").addClass("w-50");
            $("#templateBody"+selectedpage).find(".imageBlock").addClass("w-50");
            if(bgImage !== "" && bgImage !== "none"){
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').replaceWith('<div class="w-50 h-50"></div>');
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image':bgImage,'background-size':'cover','background-position':'center center'});
                $("#templateBody"+selectedpage).find('.imageBlock .mojoImageUploader').addClass("bg-white");
            }
        } else if($(this).hasClass("pagelayout6")){
            if(bgImage !== "" && bgImage !== "none"){
                $("#templateBody"+selectedpage).css({"background-image": bgImage, 'background-size': 'cover', 'background-position': 'center center'});
            } else {
                hidedsm();
                filemanager("templateBody" + selectedpage, "form6", "form6");
            }
        }
        if($("#templateBody"+selectedpage).find(".imageBlock").length > 0 && $("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
            $("#templateBody"+selectedpage).find('.imageBlock div.mojoImageUploader').unbind("click").click(function(){
                let tid = $("#templateBody"+selectedpage).find('.questionBlock .mojoMcBlock.frm-block.active').attr("id");
                $("#"+tid).trigger("click");
            });
        } else {
            $("#templateBody"+selectedpage).find('.imageBlock div.mojoImageUploader').unbind("click").click(function(){
                hidedsm();
                filemanager("templateBody"+selectedpage,"form","form");
            });
        }
    });
    $("#pageTransition").unbind("change").change(function(){
        $("#templateBody"+selectedpage).attr("item-transition", $("#pageTransition").val());
    });
    $('input[name="ftrbtnalgngrp"]').unbind("change").change(function(){
        $("#pagefooter").attr("item-button-align",$(this).val());
    });
    if(typeof $("#pagefooter").attr("item-button-align") === "undefined"){
        $('input[name="ftrbtnalgngrp"][value="text-right"]').trigger("click");
    } else {
        $('input[name="ftrbtnalgngrp"][value="'+$("#pagefooter").attr("item-button-align")+'"]').trigger("click");
    }
}
export function questioncontentsetting(block_id,selectedpage,formBlockSetting){
    $(`#questionStyle option[value="${$("#templateBody"+selectedpage).attr("question-style")}"]`).attr("selected", true);
    if($("#templateBody"+selectedpage).attr("question-style") !== "all"){
        $("#qTran").show();
        if($("#templateBody"+selectedpage).attr("question-style") === "horizontal"){
            $("#questionTransition").html(`
				<option value="slideLeft">Slide Right to Left</option>
				<option value="slideRight">Slide Left to Right</option>
				<option value="scaleHorizontal">Horizontal Stretch</option>
				<option value="flipLeft">Flip Left</option>
				<option value="flipRight">Flip Right</option>
				<option value="carouselLeft">Carousel Left</option>
				<option value="carouselRight">Carousel Right</option>
				<option value="glueLeft">Glue Left</option>
				<option value="glueRight">Glue Right</option>
			`);
            if(typeof $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition") === "undefined" || $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")=== "") {
                $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition", "slideLeft");
            } else{
                $(`#questionTransition option[value="${$(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")}"]`).prop("selected", true);
            }
        } else if($("#templateBody"+selectedpage).attr("question-style") === "vertical"){
            $("#questionTransition").html(`
				<option value="slideTop">Slide Bottom to Top</option>
				<option value="slideBottom">Slide Top to Bottom</option>
				<option value="scaleVertical">Horizontal Stretch</option>
				<option value="flipTop">Flip Top</option>
				<option value="flipBottom">Flip Bottom</option>
				<option value="carouselTop">Carousel Top</option>
				<option value="carouselBottom">Carousel Bottom</option>
				<option value="glueTop">Glue Top</option>
				<option value="glueBottom">Glue Bottom</option>
			`);
            if(typeof $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition") === "undefined" || $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")=== "") {
                $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition", "slideTop");
            } else{
                $(`#questionTransition option[value="${$(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")}"]`).prop("selected", true);
            }
        }
    } else {
        $("#qTran").hide();
    }
    let qStyle = $("#templateBody"+selectedpage).attr("question-style");
    $(`#questionStyle option[value="${qStyle}"]`).attr("selected", true);
    $("#questionStyle").unbind("change").change(function(){
        $("#templateBody"+selectedpage).attr("question-style", $(this).val());
        if($(this).val() !== "all"){
            $("#qTran").show();
            if($(this).val() === "horizontal"){
                $("#questionTransition").html(`
					<option value="slideLeft">Slide Right to Left</option>
					<option value="slideRight">Slide Left to Right</option>
					<option value="scaleHorizontal">Horizontal Stretch</option>
					<option value="flipLeft">Flip Left</option>
					<option value="flipRight">Flip Right</option>
					<option value="carouselLeft">Carousel Left</option>
					<option value="carouselRight">Carousel Right</option>
					<option value="glueLeft">Glue Left</option>
					<option value="glueRight">Glue Right</option>
				`);
                $(`#templateBody${selectedpage}`).find('div.mojoMcBlock.frm-block.dojoDndItem.focus').attr("question-transition", "slideLeft");
                if(typeof $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition") === "undefined" || $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")=== ""){
                    $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition", "slideLeft");
                } else {
                    $(`#questionTransition option[value="${$(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")}"]`).prop("selected", true);
                }
            } else if($(this).val() === "vertical"){
                $("#questionTransition").html(`
					<option value="slideTop">Slide Bottom to Top</option>
					<option value="slideBottom">Slide Top to Bottom</option>
					<option value="scaleVertical">Horizontal Stretch</option>
					<option value="flipTop">Flip Top</option>
					<option value="flipBottom">Flip Bottom</option>
					<option value="carouselTop">Carousel Top</option>
					<option value="carouselBottom">Carousel Bottom</option>
					<option value="glueTop">Glue Top</option>
					<option value="glueBottom">Glue Bottom</option>
				`);
                $(`#templateBody${selectedpage}`).find('div.mojoMcBlock.frm-block.dojoDndItem.focus').attr("question-transition", "slideTop");
                if(typeof $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition") === "undefined" || $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")=== ""){
                    $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition", "slideTop");
                } else {
                    $(`#questionTransition option[value="${$(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition")}"]`).prop("selected", true);
                }
            }
        } else {
            $("#qTran").hide();
            $(`#templateBody${selectedpage}`).find('div.mojoMcBlock.frm-block.dojoDndItem.focus').attr("question-transition", "");
        }
    });
    $("#questionTransition").unbind("change").change(function(){
        $(`#templateBody${selectedpage}`).find("#"+block_id).attr("question-transition", $(this).val());
    });
    $(".tpl-block-move-up").unbind("click").click(function(){
        if($('#'+block_id).prev("div.mojoMcBlock.frm-block").length > 0) {
            $('#'+block_id).insertBefore($('#'+block_id).prev("div.mojoMcBlock.frm-block"));
            resetCounter(formBlockSetting);
        }
    });
    $(".tpl-block-move-down").unbind("click").click(function(){
        if($('#'+block_id).next("div.mojoMcBlock.frm-block").length > 0) {
            $('#'+block_id).insertAfter($('#'+block_id).next("div.mojoMcBlock.frm-block"));
            resetCounter(formBlockSetting);
        }
    });
}
export function getdrophtmlheader(key,droparray) {
    return droparray[key];
}
export function getdrophtmlfooter(key,droparray) {
    let fullhtml=droparray[key];
    if(key === "footerlayout4" || key === "footerlayout5" || key === "footerlayout6") {
        fullhtml = replaccon("<!--social_buttons-->", "<table class='btable mx-auto'><tr class='btr'><td>" + droparray['socialFollowButtonBlockEditor'] + "</td></tr></table>", fullhtml);
        fullhtml = replaccon("{{forward.role}}", "facebook", fullhtml);
        fullhtml = replaccon("{{forward.href}}", socialfollow['facebook']['forward_url'], fullhtml);
        fullhtml = replaccon("{{forward.imgurl96}}", socialfollow['facebook']['forward_imgurl48'], fullhtml);
        fullhtml = replaccon("{{forward.title}}", socialfollow['facebook']['forward_title'], fullhtml);
    }
    return fullhtml;
}
export function pageHeaderSettingCommon(droparraysetting,blocksettingheader){
    $("#pageheader").find("div.row").unbind("click").click(function(e){
        e.stopPropagation();
        hidedsm();
        $("#dsmcsetting").html("Setting is not available...");
        if($("#headerdimg img").hasClass("mcnImage")){
            $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]+droparraysetting["headerImageSettingBlockEditor"]);
        } else {
            $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        }
        $("#dsmbsetting").find("#pageTransitionMain").remove();
        blocksettingheader();
        $("#bbutton").trigger("click");
        if($("#headerdimg img").hasClass("mcnImage")) {
            $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
        }
    });
    $("#pageheader").find("div.row #headerdimg").unbind("click").click(function(e){
        e.stopPropagation();
        e.preventDefault();
        hidedsm();
        $("#dsmcsetting").html("Setting is not available...");
        if($("#headerdimg img").hasClass("mcnImage")){
            $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]+droparraysetting["headerImageSettingBlockEditor"]);
        } else {
            $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        }
        $("#dsmbsetting").find("#pageTransitionMain").remove();
        blocksettingheader();
        $("#bbutton").trigger("click");
        showdsm("header");
        if($("#headerdimg img").hasClass("mcnImage")) {
            $(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
        }
    });
    if($("#headerdtitle").hasClass("cke_editable")===false && window.CKEDITOR?.instances["headerdtitle"]){
        window.CKEDITOR.instances["headerdtitle"].destroy();
    }
    if($("#headerddesc").hasClass("cke_editable")===false && window.CKEDITOR?.instances["headerddesc"]){
        window.CKEDITOR.instances["headerddesc"].destroy();
    }
    createckeditorforheader();
}
export function pageFooterSetting(droparraysetting,droparray,savefullcontent,blocksetting) {
    $("#pagefooter").find("div.row").unbind("click").click(function (e) {
        e.stopPropagation();
        hidedsm();
        $("#dsmcsetting").html("Setting is not available...");
        $("#dsmbsetting").html(droparraysetting["blockSettingBlockEditor"]);
        $("#dsmbsetting").find("#pageTransitionMain").remove();
        blocksettingfooter(droparray,savefullcontent);
        $("#bbutton").trigger("click");
    });
    $("#pagefooter").find(".ckeditable").each(function(){
        let id = $(this).attr("id");
        if($("#"+id).hasClass("cke_editable")===false && window.CKEDITOR?.instances[id]){
            window.CKEDITOR.instances[id].destroy();
        }
    });
    createckeditorforfooter();
    socfollowcontrol("noBlock",droparray,droparraysetting,savefullcontent,blocksetting);
}
export function ckButtonSetting(element){
    let url = $(element).attr("href");
    if(url.indexOf("/survey") !== -1){
        ckSryButtonSetting(element);
    } else if(url.indexOf("assessment") !== -1){
        ckAsmtButtonSetting(element);
    } else if(url.indexOf("customform") !== -1){
        ckCfButtonSetting(element);
    } else {
        ckGenButtonSetting(element);
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
function ckGenButtonSetting(element) {
    $('#clickButtonModal').trigger('click');
    setTimeout(()=>{
        let url = $(element).attr("href");
        if(typeof url!=="undefined") {
            if(url.substr(0, 7)==='http://') {
                $("#genurlset").val('http://');
                url=url.replace("http://", "");
                $("#genurl").val(url);
            }
            if(url.substr(0, 8)==='https://') {
                $("#genurlset").val('https://');
                url=url.replace("https://", "");
                $("#genurl").val(url);
            }
        } else {
            $("#genurlset").val('http://');
            $("#genurl").val("");
            $("#gentitle").val("");
        }
        $("#gentitle").val($(element).text());
        $(".genbtndesignbtn a").html($(element).text()).attr("href",$(element).attr("href"));
        $("#gentitle").keyup(function() {
            $(".genbtndesignbtn a").html($("#gentitle").val());
        });
        let btnbaccol;
        if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
            btnbaccol="#6c757d";
        } else {
            btnbaccol=rgb2hex($(element).css("background-color"));
        }
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
        let btntextcol=rgb2hex($(element).css('color'));
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
        $("#genbtnbrdstyle").val($(element).css("border-left-style"));
        $("#genbtnbrdstyle").unbind("change").change(function() {
            setGenButtonStyle();
        });
        $("#genbtnbrdsize").val($(element).css("border-left-width").replace("px",""));
        $("#genbtnbrdsize").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        let btnbrdcol=rgb2hex($(element).css('border-left-color'));
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
        $("#genbtnbrdradius").val($(element).css("border-radius").replace("px",""));
        $("#genbtnbrdradius").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        $("#genbtnpadtop").val($(element).css("padding-top").replace("px",""));
        $("#genbtnpadtop").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        $("#genbtnpadbottom").val($(element).css("padding-bottom").replace("px",""));
        $("#genbtnpadbottom").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        $("#genbtnpadleft").val($(element).css("padding-left").replace("px",""));
        $("#genbtnpadleft").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        $("#genbtnpadright").val($(element).css("padding-right").replace("px",""));
        $("#genbtnpadright").unbind("keyup").keyup(function() {
            setGenButtonStyle();
        });
        setGenButtonStyle();
        if(typeof $(element).attr('style') !== "undefined"){
            if($(element).attr('style').indexOf(';width')!==-1 || $(element).attr('style').indexOf('; width')!==-1) {
                $("#genbtnwth").val(parseInt($(element).css("width").replace("px","")));
                $("#genbtncus").trigger("click");
            } else {
                $("#genbtndef").trigger("click");
            }
            if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
                $("#genbtnout").trigger("click");
            } else {
                $("#genbtnsol").trigger("click");
            }
            $("#genlinkasbtn").trigger("click");
        }
        $('#save_buttonstg').unbind('click').click(function(){
            let sty='',sty2='',btnwidth='';
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
            let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$("#genurlset").val()+$('#genurl').val().replace(/(^\w+:|^)\/\//, '')+'" '+sty+'>'+$('#gentitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> ';
            $(element)[0].previousSibling.remove();
            $(element)[0].nextSibling.remove();
            $(element).replaceWith(ae);
        });
        $('#close_buttonstg,.modal-header button.close').unbind('click').click(function(){
            $("#genbtndef").trigger("click");
            $("#genbtnsol").trigger("click");
            if($('#genlinkasbtn').is(":checked") && $('#genlinkasbtn').val('yes')) {
                $('#genlinkasbtn').trigger("click");
            }
        });
        $('#delete_buttonstg').unbind('click').click(function(){
            $(element)[0].previousSibling.remove();
            $(element)[0].nextSibling.remove();
            $(element).remove();
        });
        $(".cke").hide();
    },1000);
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
function ckSryButtonSetting(element) {
    $('#clickSurveysTags').trigger('click');
    setTimeout(()=>{
        let url = $(element).attr("href");
        $('#sururl').val(url);
        $('#sururldiv').html(url);
        $('#surtitle').val($(element).html());
        $(".btndesignbtn a").html($(element).html());
        let surveystags = JSON.parse(localStorage.getItem("surveystags"));
        for (let this_tag in surveystags){
            $("#sursel").append('<option value="'+surveystags[this_tag][1]+'">'+surveystags[this_tag][1]+'</option>');
            if(surveystags[this_tag][0]===url){
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
        let btnbaccol;
        if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
            btnbaccol="#6c757d";
        } else {
            btnbaccol=rgb2hex($(element).css("background-color"));
        }
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
        let btntextcol=rgb2hex($(element).css('color'));
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
        $("#srybtnbrdstyle").val($(element).css("border-left-style"));
        $("#srybtnbrdstyle").unbind("change").change(function() {
            setSryButtonStyle();
        });
        $("#srybtnbrdsize").val($(element).css("border-left-width").replace("px",""));
        $("#srybtnbrdsize").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        let btnbrdcol=rgb2hex($(element).css('border-left-color'));
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
        $("#srybtnbrdradius").val($(element).css("border-radius").replace("px",""));
        $("#srybtnbrdradius").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        $("#srybtnpadtop").val($(element).css("padding-top").replace("px",""));
        $("#srybtnpadtop").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        $("#srybtnpadbottom").val($(element).css("padding-bottom").replace("px",""));
        $("#srybtnpadbottom").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        $("#srybtnpadleft").val($(element).css("padding-left").replace("px",""));
        $("#srybtnpadleft").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        $("#srybtnpadright").val($(element).css("padding-right").replace("px",""));
        $("#srybtnpadright").unbind("keyup").keyup(function() {
            setSryButtonStyle();
        });
        setSryButtonStyle();
        if(typeof $(element).attr('style') !== "undefined"){
            if($(element).attr('style').indexOf(';width')!==-1 || $(element).attr('style').indexOf('; width')!==-1) {
                $("#srybtnwth").val(parseInt($(element).css("width").replace("px","")));
                $("#srybtncus").trigger("click");
            } else {
                $("#srybtndef").trigger("click");
            }
            if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
                $("#srybtnout").trigger("click");
            } else {
                $("#srybtnsol").trigger("click");
            }
            $("#linkasbtn").trigger("click");
        }
        $('#save_tooltips').unbind('click').click(function(){
            let sty='',sty2='',btnwidth='';
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
            let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#sururl').val()+'" '+sty+'>'+$('#surtitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> ';
            $(element)[0].previousSibling.remove();
            $(element)[0].nextSibling.remove();
            $(element).replaceWith(ae);
        });
        $('#sry_close_tooltips,.modal-header button.close').unbind('click').click(function(){
            $("#srybtndef").trigger("click");
            $("#srybtnsol").trigger("click");
            if($('#linkasbtn').is(":checked") && $('#linkasbtn').val('yes')) {
                $('#linkasbtn').trigger("click");
            }
        });
        $(".cke").hide();
    },1000);
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
function ckAsmtButtonSetting(element) {
    $('#clickAssessmentsTags').trigger('click');
    setTimeout(()=>{
        let url = $(element).attr("href");
        $('#asmturl').val(url);
        $('#asmturldiv').html(url);
        $('#asmttitle').val($(element).html());
        $(".asmtbtndesignbtn a").html($(element).html());
        let assessmentstags = JSON.parse(localStorage.getItem("assessmentstags"));
        for (let this_tag in assessmentstags){
            $("#asmtsel").append('<option value="'+assessmentstags[this_tag][1]+'">'+assessmentstags[this_tag][1]+'</option>');
            if(assessmentstags[this_tag][0]===url){
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
        let btnbaccol;
        if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
            btnbaccol="#6c757d";
        } else {
            btnbaccol=rgb2hex($(element).css("background-color"));
        }
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
        let btntextcol=rgb2hex($(element).css('color'));
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
        $("#asmtbtnbrdstyle").val($(element).css("border-left-style"));
        $("#asmtbtnbrdstyle").unbind("change").change(function() {
            setAsmtButtonStyle();
        });
        $("#asmtbtnbrdsize").val($(element).css("border-left-width").replace("px",""));
        $("#asmtbtnbrdsize").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        let btnbrdcol=rgb2hex($(element).css('border-left-color'));
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
        $("#asmtbtnbrdradius").val($(element).css("border-radius").replace("px",""));
        $("#asmtbtnbrdradius").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        $("#asmtbtnpadtop").val($(element).css("padding-top").replace("px",""));
        $("#asmtbtnpadtop").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        $("#asmtbtnpadbottom").val($(element).css("padding-bottom").replace("px",""));
        $("#asmtbtnpadbottom").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        $("#asmtbtnpadleft").val($(element).css("padding-left").replace("px",""));
        $("#asmtbtnpadleft").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        $("#asmtbtnpadright").val($(element).css("padding-right").replace("px",""));
        $("#asmtbtnpadright").unbind("keyup").keyup(function() {
            setAsmtButtonStyle();
        });
        setAsmtButtonStyle();
        if(typeof $(element).attr('style') !== "undefined"){
            if($(element).attr('style').indexOf(';width')!==-1 || $(element).attr('style').indexOf('; width')!==-1) {
                $("#asmtbtnwth").val(parseInt($(element).css("width").replace("px","")));
                $("#asmtbtncus").trigger("click");
            } else {
                $("#asmtbtndef").trigger("click");
            }
            if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
                $("#asmtbtnout").trigger("click");
            } else {
                $("#asmtbtnsol").trigger("click");
            }
            $("#asmtlinkasbtn").trigger("click");
        }
        $('#asmt_save_tooltips').unbind('click').click(function(){
            let sty='',sty2='',btnwidth='';
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
            let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#asmturl').val()+'" '+sty+'>'+$('#asmttitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> ';
            $(element)[0].previousSibling.remove();
            $(element)[0].nextSibling.remove();
            $(element).replaceWith(ae);
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
function ckCfButtonSetting(element) {
    $('#clickCustomFormsTags').trigger('click');
    setTimeout(()=>{
        let url = $(element).attr("href");
        $('#cfurl').val(url);
        $('#cfurldiv').html(url);
        $('#cftitle').val($(element).html());
        $(".cfbtndesignbtn a").html($(element).html());
        let customformstags = JSON.parse(localStorage.getItem("customformstags"));
        for (let this_tag in customformstags){
            $("#cfsel").append('<option value="'+customformstags[this_tag][1]+'">'+customformstags[this_tag][1]+'</option>');
            if(customformstags[this_tag][0]===url){
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
        let btnbaccol;
        if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
            btnbaccol="#6c757d";
        } else {
            btnbaccol=rgb2hex($(element).css("background-color"));
        }
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
        let btntextcol=rgb2hex($(element).css('color'));
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
        $("#cfbtnbrdstyle").val($(element).css("border-left-style"));
        $("#cfbtnbrdstyle").unbind("change").change(function() {
            setCFButtonStyle();
        });
        $("#cfbtnbrdsize").val($(element).css("border-left-width").replace("px",""));
        $("#cfbtnbrdsize").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        let btnbrdcol=rgb2hex($(element).css('border-left-color'));
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
        $("#cfbtnbrdradius").val($(element).css("border-radius").replace("px",""));
        $("#cfbtnbrdradius").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        $("#cfbtnpadtop").val($(element).css("padding-top").replace("px",""));
        $("#cfbtnpadtop").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        $("#cfbtnpadbottom").val($(element).css("padding-bottom").replace("px",""));
        $("#cfbtnpadbottom").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        $("#cfbtnpadleft").val($(element).css("padding-left").replace("px",""));
        $("#cfbtnpadleft").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        $("#cfbtnpadright").val($(element).css("padding-right").replace("px",""));
        $("#cfbtnpadright").unbind("keyup").keyup(function() {
            setCFButtonStyle();
        });
        setCFButtonStyle();
        if(typeof $(element).attr('style') !== "undefined"){
            if($(element).attr('style').indexOf(';width')!==-1 || $(element).attr('style').indexOf('; width')!==-1) {
                $("#cfbtnwth").val(parseInt($(element).css("width").replace("px","")));
                $("#cfbtncus").trigger("click");
            } else {
                $("#cfbtndef").trigger("click");
            }
            if($(element).css("background-color")==="rgba(0, 0, 0, 0)") {
                $("#cfbtnout").trigger("click");
            } else {
                $("#cfbtnsol").trigger("click");
            }
            $("#cflinkasbtn").trigger("click");
        }
        $('#cf_save_tooltips').unbind('click').click(function(){
            let sty='',sty2='',btnwidth='';
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
            let ae=' <!--[if true]><table role="presentation" width="'+btnwidth2+'" align="left" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="'+btnwidth2+'"><![endif]--><a target="_blank" width="'+btnwidth2+'" href="'+$('#cfurl').val()+'" '+sty+'>'+$('#cftitle').val()+'</a><!--[if true]></td></tr></table><![endif]--> ';
            $(element)[0].previousSibling.remove();
            $(element)[0].nextSibling.remove();
            $(element).replaceWith(ae);
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
function setOpenAiButton(selector, type="text"){
    $('#clickOpenAiModal').trigger('click');
    let suggestiondata = [];
    let suggestionIndex = 0;
    setTimeout(()=>{
        $("#modalopenai").draggable();
        $("#suggestiontext").html("");
        $("#writetoask").val("");
        $("#openaiwrite").unbind("click").click(function(e){
            if(suggestiondata.length > 0){
                e.preventDefault();
                $('#clickOaConfirmModal').trigger('click');
                setTimeout(()=>{
                    $("#oaconfirm-text").html('Your suggestion(s) will be cleared and it can not be undone.\nAre you sure you want to continue?');
                    $("#yes_oaconfirm").unbind("click").click(function(){
                        $("#openaiwrite").prop("checked", true);
                        $("#rewrite_openaistg").hide();
                        $("#rewritethecontentmain").hide();
                        $("#suggestionmain").hide();
                        $("#write_openaistg").show();
                        $("#writetoaskmain").show();
                        $("#writetoask").val("");
                        suggestiondata = [];
                        suggestionIndex = 0;
                    });
                },100);
            } else {
                $("#rewrite_openaistg").hide();
                $("#rewritethecontentmain").hide();
                $("#suggestionmain").hide();
                $("#write_openaistg").show();
                $("#writetoaskmain").show();
                $("#writetoask").val("");
                suggestiondata = [];
                suggestionIndex = 0;
            }
        });
        $("#openairewrite").unbind("click").click(function(e){
            if(suggestiondata.length > 0){
                e.preventDefault();
                $('#clickOaConfirmModal').trigger('click');
                setTimeout(()=>{
                    $("#oaconfirm-text").html('Your suggestion(s) will be cleared and it can not be undone.\nAre you sure you want to continue?');
                    $("#yes_oaconfirm").unbind("click").click(function(){
                        $("#openairewrite").prop("checked", true);
                        $("#write_openaistg").hide();
                        $("#writetoaskmain").hide();
                        $("#suggestionmain").hide();
                        if(type === "question"){
                            $("#rewriteoriginalcontent").html(selector.val());
                        } else {
                            $("#rewriteoriginalcontent").html($("#"+selector).html());
                        }
                        $("#rewrite_openaistg").show();
                        $("#rewritethecontentmain").show();
                        $("#rewritethecontent").val("");
                        suggestiondata = [];
                        suggestionIndex = 0;
                    });
                },100);
            } else {
                $("#write_openaistg").hide();
                $("#writetoaskmain").hide();
                $("#suggestionmain").hide();
                if(type === "question"){
                    $("#rewriteoriginalcontent").html(selector.val());
                } else {
                    $("#rewriteoriginalcontent").html($("#"+selector).html());
                }
                $("#rewrite_openaistg").show();
                $("#rewritethecontentmain").show();
                $("#rewritethecontent").val("");
                suggestiondata = [];
                suggestionIndex = 0;
            }
        });
        if(type === "question"){
            $("#openairewrite")[0].click();
        }
        $('#write_openaistg').unbind('click').click(async function(){
            $("#clickLoader").val(true);
            $("#clickLoader").trigger("click");
            try {
                let promt = "";
                if($("#suggestiontext").html() === ""){
                    if(type === "question"){
                        promt = "Write 1 questions for " + $("#writetoask").val() + ". no other information";
                    } else {
                        promt = $("#writetoask").val();
                    }
                } else {
                    promt = $("#writetoask").val() + "\n" + $("#suggestiontext").text();
                }
                const result = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: 'user', content: promt }],
                });
                suggestiondata.push(result.choices[0].message.content);
                suggestionIndex=suggestiondata.length;
                $("#suggestionindex").html(suggestionIndex);
                $("#suggestiontotal").html(suggestionIndex);
                function setNavigationButton(){
                    if(suggestionIndex > 1){
                        $('#suggestionprev').removeClass("cursor-not-allowed").addClass("text-blue");
                    } else {
                        $('#suggestionprev').removeClass("text-blue").addClass("cursor-not-allowed");
                    }
                    if(suggestionIndex < suggestiondata.length){
                        $('#suggestionnext').removeClass("cursor-not-allowed").addClass("text-blue");
                    } else {
                        $('#suggestionnext').removeClass("text-blue").addClass("cursor-not-allowed");
                    }
                }
                setNavigationButton();
                $('#suggestionprev').unbind('click').click(function(){
                    if(suggestionIndex > 1){
                        suggestionIndex = suggestionIndex-1;
                        $("#suggestionindex").html(suggestionIndex);
                        setNavigationButton();
                        document.getElementById("suggestiontext").innerHTML=suggestiondata[suggestionIndex-1];
                    }
                });
                $('#suggestionnext').unbind('click').click(function(){
                    if(suggestionIndex < suggestiondata.length){
                        suggestionIndex = suggestionIndex+1;
                        $("#suggestionindex").html(suggestionIndex);
                        setNavigationButton();
                        document.getElementById("suggestiontext").innerHTML=suggestiondata[suggestionIndex-1];
                    }
                });
                $("#suggestionmain").show();
                let speed = 10;
                let i = 0;
                document.getElementById("suggestiontext").innerHTML="";
                function typeWriter() {
                    if (i < result.choices[0].message.content.length) {
                        document.getElementById("suggestiontext").innerHTML += result.choices[0].message.content.charAt(i);
                        i++;
                        var objDiv = document.getElementById("suggestiontext");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        setTimeout(typeWriter, speed);
                    }
                }
                typeWriter();
                $('#useit_openaistg').show();
                $("#clickLoader").val(false);
                $("#clickLoader").trigger("click");
            } catch (e) {
                $("#clickError").attr("data-type","Error");
                $("#clickError").val("Something went wrong...Please try again later...");
                $("#clickError").trigger("click");
                $("#clickLoader").val(false);
                $("#clickLoader").trigger("click");
            }
        });
        $('#rewrite_openaistg').unbind('click').click(async function(){
            $("#clickLoader").val(true);
            $("#clickLoader").trigger("click");
            try {
                const result = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: 'user', content: "Rewrite the following content:\n"+$("#rewritethecontent").val()+"\n"+$("#rewriteoriginalcontent").text().replaceAll("<br/>","\n").replaceAll("<br>","\n").replaceAll('<br type="_moz">','\n')+".\n\nKeep word as it is which is between ##." }],
                });
                $("#suggestiontext").html(result.choices[0].message.content);
                suggestiondata.push(result.choices[0].message.content);
                suggestionIndex=suggestiondata.length;
                $("#suggestionindex").html(suggestionIndex);
                $("#suggestiontotal").html(suggestionIndex);
                function setNavigationButton(){
                    if(suggestionIndex > 1){
                        $('#suggestionprev').removeClass("cursor-not-allowed").addClass("text-blue");
                    } else {
                        $('#suggestionprev').removeClass("text-blue").addClass("cursor-not-allowed");
                    }
                    if(suggestionIndex < suggestiondata.length){
                        $('#suggestionnext').removeClass("cursor-not-allowed").addClass("text-blue");
                    } else {
                        $('#suggestionnext').removeClass("text-blue").addClass("cursor-not-allowed");
                    }
                }
                setNavigationButton();
                $('#suggestionprev').unbind('click').click(function(){
                    if(suggestionIndex > 1){
                        suggestionIndex = suggestionIndex-1;
                        $("#suggestionindex").html(suggestionIndex);
                        setNavigationButton();
                        document.getElementById("suggestiontext").innerHTML=suggestiondata[suggestionIndex-1];
                    }
                });
                $('#suggestionnext').unbind('click').click(function(){
                    if(suggestionIndex < suggestiondata.length){
                        suggestionIndex = suggestionIndex+1;
                        $("#suggestionindex").html(suggestionIndex);
                        setNavigationButton();
                        document.getElementById("suggestiontext").innerHTML=suggestiondata[suggestionIndex-1];
                    }
                });
                $("#suggestionmain").show();
                let speed = 10;
                let i = 0;
                document.getElementById("suggestiontext").innerHTML="";
                function typeWriter() {
                    if (i < result.choices[0].message.content.length) {
                        document.getElementById("suggestiontext").innerHTML += result.choices[0].message.content.charAt(i);
                        i++;
                        var objDiv = document.getElementById("suggestiontext");
                        objDiv.scrollTop = objDiv.scrollHeight;
                        setTimeout(typeWriter, speed);
                    }
                }
                typeWriter();
                $('#useit_openaistg').show();
                $("#clickLoader").val(false);
                $("#clickLoader").trigger("click");
            } catch (e) {
                $("#clickError").attr("data-type","Error");
                $("#clickError").val("Something went wrong...Please try again later...");
                $("#clickError").trigger("click");
                $("#clickLoader").val(false);
                $("#clickLoader").trigger("click");
            }
        });
        $('#useit_openaistg').unbind('click').click(function(){
            $('#clickOaConfirmModal').trigger('click');
            setTimeout(()=>{
                $("#oaconfirm-text").html('Your original content will be replaced by new content and it can not be undone.\nAre you sure you want to continue?');
                $("#yes_oaconfirm").unbind("click").click(function(){
                    if(type === "question"){
                        selector.val($("#suggestiontext").html());
                        selector.trigger("keyup");
                    } else {
                        $("#"+selector).html($("#suggestiontext").html().replaceAll("\n","<br/>").replace(/(##.*?##)/g, '<span class="notranslate">$1</span>'));
                    }
                    $('#clickOpenAiModal').trigger('click');
                });
            },100);
        });
        $('#write_new').unbind('click').click(function(){
            $("#openaiwrite")[0].click();
        });
        $('#rewrite_new').unbind('click').click(function(){
            $("#openaiwrite")[0].click();
        });
    },1000);
}
window.setOpenAiButton=setOpenAiButton;