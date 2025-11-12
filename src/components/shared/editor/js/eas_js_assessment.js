import $ from 'jquery';
import 'jquery-slimscroll/jquery.slimscroll.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
import 'jquery-ui/ui/widgets/sortable.js';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'jquery-ui/themes/base/all.css';
import 'jquery-ui/ui/widgets/slider.js';
import 'jquery-ui/ui/widgets/resizable.js';
import 'jquery-ui-touch-punch/jquery.ui.touch-punch.js';
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';
import 'color-thief-browser/dist/color-thief.min.js';
import {siteURL} from "../../../../config/api";
import {filemanager} from "../../fileManager/js/filemanager";
import {editImage} from "../../../../services/myDesktopService";
import {getSurveyAllList} from "../../../../services/surveyService";
import {getAssessmentAllList} from "../../../../services/assessmentService";
import {getCustomFormLinkList} from "../../../../services/customFormService";
import {socialfollow, droparraycommon, drop_link, droparraysettingcommon, loadeverytimecommon, loadeverytimecommonformtype, replaccon, unprotectSource, getCategoryListBox, emtmsedisplay, showdsm, hidedsm, mySlideronc, refleftimageandcaption, bigimagesetting, closeleanModal, browseimagebtnreload, blockdelete, tbfcontrol, dvdcontrol, imagescontrol, socfollowcontrol, imgcardcontrol, multiimgcardcontrol, mulimgcapcontrol, mulimgonecapcontrol, videocontrol, linkcontrol, blocksettingcommon, dividerSettingCommon, buttonSetting, editreplaceimagelinkcommon, blocksettingheadercommon, clickSelectItemCallCommon, formBlockSettingCommon, formBlockSettingCommon2, deleteSingleImage, formBlockControl, removeActive, resetCounter, pagesettingcommon, questioncontentsetting, getdrophtmlheader, getdrophtmlfooter, pageHeaderSettingCommon, pageFooterSetting, attachmentSetting, setMaxPoints, calculateMaxPoints} from "./eas_js_common.js";
import { v4 as uuidv4 } from 'uuid';

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
let found="";
let tembody="";
let lastformid=""
let fieldcountform=1;
let formpagecount=1;
let selectedpage=1;
let pixie4;
let surveystags=[];
let assessmentstags=[];
let customformstags=[];
let imageID="";
let filename="";
let type="";
let imageIDFullPath = "";
let fromEditorA = "";
let imagePath = "";

let droparray = {
	...droparraycommon,
	"replaceimagedrop":'<td><div class="imagePlaceholder"><img src="'+SITEURL+'/img/browse_image.png" alt="Empty" style="display: block;"><div data-dojo-attach-point="uploadText"><span>Browse Image</span><br/><span class="deleteblock">[ Delete ]</span></div></div></td>',
	"openendedBlockEditor": '{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><input type="text" {{aid}} {{aname}} placeholder="Enter your answer" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;" readonly /></div>',
	"radioBlockEditor": '<div class="col-12 text-left p-0 d-flex align-items-center" style="margin-bottom:10px;" addcomment="no" unique-id="{{uniqueId}}"><input type="radio" name="singleanswer_option" style="margin-right:10px;" disabled><input class="singleAnswer" type="text" placeholder="Enter description for this option" /><input class="pointsbox" placeholder="Points" type="text" /><span class="d-flex addcommentspan" style="margin-left:10px;" data-toggle="tooltip" data-trigger="hover" title="Add comment box for this option"><input type="checkbox" class="addcomment" /></span><i class="far fa-trash-alt" style="padding-left:10px;"></i></div>',
	"checkboxBlockEditor": '<div class="col-12 text-left p-0 d-flex align-items-center" style="margin-bottom:10px;" addcomment="no" unique-id="{{uniqueId}}"><input type="checkbox" name="singleanswer_option" style="margin-right:10px;" disabled><input class="singleAnswer" type="text" placeholder="Enter description for this option" /><input class="pointsbox" placeholder="Points" type="text" /><span class="d-flex addcommentspan" style="margin-left:10px;" data-toggle="tooltip" data-trigger="hover" title="Add comment box for this option"><input type="checkbox" class="addcomment" /></span><i class="far fa-trash-alt" style="padding-left:10px;"></i></div>',
	"buttonBlockEditor": '<div class="col-12 p-0 d-flex align-items-center" style="margin-bottom:10px;" unique-id="{{uniqueId}}"><input type="text" placeholder="Enter description for this option" /><input class="pointsbox" placeholder="Points" type="text" /><i class="far fa-trash-alt" style="padding-left:10px;"></i></div>',
    "emailBlockEditor": '{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><input type="text" {{aid}} {{aname}} placeholder="Enter your answer" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;" readonly /></div>',
	"phoneBlockEditor": '{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-flex;"></span><span style="width:95%; display:inline-flex;"><select style="height:40px;width:20%;margin-right:10px;margin-top:10px;margin-bottom: 0;border-radius: 0;min-width: 65px;" disabled><option value="USA">USA</option></select><input type="text" {{aid}} {{aname}} placeholder="Enter your answer" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2;" readonly /></span></div>',
	"matrixAnsBlockEditor":'<div class="col-12 blockanswer" style="display:flex;flex-direction:row"><span style="width:5%; display:inline-block;"></span><table style="width:95%;" id="answerTable"><tr style="text-align:center;height:40px"><th style="width:20%"></th><th><input style="" type="text" value="Column 1"/></th><th><input style="" type="text" value="Column 2"/></th><th><input type="text" style="" value="Column 3"/></th></tr><tr style="text-align:center;height:40px"><td><input style="" type="text" value="Row 1"/></td><td><input type="radio" name="title1" disabled readonly/></td><td><input type="radio" name="title1" disabled readonly/></td><td><input type="radio" name="title1" disabled readonly/></td><td><i class="far fa-trash-alt DeleteButtonRow" style="padding:5px;"></i></td></tr><tr style="text-align:center;height:40px"><td><input style="" type="text" value="Row 2"/></td><td><input type="radio" name="title2" disabled readonly/></td><td><input type="radio" name="title2" disabled readonly/></td><td><input type="radio" name="title2" disabled readonly/></td><td><i class="far fa-trash-alt DeleteButtonRow" style="padding:5px;"></i></td></tr><tr style="text-align:center;height:40px"><td></td><td><i class="far fa-trash-alt DeleteButtonCol" style="padding:5px;"></i></td><td><i class="far fa-trash-alt DeleteButtonCol" style="padding:5px;"></i></td><td><i class="far fa-trash-alt DeleteButtonCol" style="padding:5px;"></i></td></tr></table></div><div class="col-12"><span style="width:5%; display:inline-block;"></span><div class="divComment" style="width:95%;display: inline-block"></div></div>',
	"matrixBlockEditor":'{{question}}{{matrix_ans_block}}',
    "contactFormBlockEditor": '{{question}} <div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><span style="width:95%; display:inline-block;"><div class="row"><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{nid}} {{nname}} placeholder="Name" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{nfor}} class="far fa-user-alt" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{eid}} {{ename}} placeholder="Email" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{efor}} class="far fa-envelope" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{pid}} {{pname}} placeholder="Phone" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{pfor}} class="far fa-phone-volume" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{aid}} {{aname}} placeholder="Address" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{afor}} class="far fa-address-card" style="display:none"></label></span>&nbsp;&nbsp; <i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{a2id}} {{a2name}} placeholder="Address 2" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{a2for}} class="far fa-address-card" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{cid}} {{cname}} placeholder="City" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{cfor}} class="far fa-map-marker-alt" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{sid}} {{sname}} placeholder="State" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{sfor}} class="far fa-map-marker-alt" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{c2id}} {{c2name}} placeholder="Country" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{c2for}} class="far fa-map-marker-alt" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{zid}} {{zname}} placeholder="zip" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{zfor}} class="far fa-map-marker-alt" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div><div class="col-6 d-flex align-items-center"><span style="position: relative;width:95%"><input type="text" {{c3id}} {{c3name}} placeholder="Company" class="" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; display:inline-block;padding-left:36px !important" readonly /><label {{c3for}} class="far fa-building" style="display:none"></label></span> &nbsp;&nbsp;<i class="far fa-trash-alt" style="text-align: right"></i></div></div></span></div>',
    "dateBlockEditor": '{{question}}<div class="col-12 blockanswer"><div class="row"><div class="col-12"><span style="width:5%; display:inline-block;"></span><input type="text" {{did}} {{dname}} placeholder="Please input date in format of mm/dd/yyyy" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;" readonly /><label {{dfor}} class="far fa-calendar-alt editor-icon-l"></label></div></div></div>',
	"timeBlockEditor": '{{question}}<div class="col-12 blockanswer"><div class="row"><div class="col-12"><span style="width:5%; display:inline-block;"></span><input type="text" {{tid}} {{tname}} placeholder="Please input time" style="margin-bottom:10px; margin-top:10px; border: 1px solid #d2d2d2; width:95%; display:inline-block;" readonly /><label {{tfor}} class="far fa-clock editor-icon-l"></label></div></div></div>',
	"imageFBlockEditor":'{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><span style="width:95%; display:inline-block;"><div class="row"><div class="col-3 pb-3 d-flex flex-column" item-value="0" style="min-width: 175px;">{{image}}<div class="text-center selecttype"><input type="radio" disabled readonly /></div><div><input class="pointsbox mx-auto my-1" placeholder="Points" type="text"></div><div class="text-center"><i class="far fa-trash-alt"></i></div></div></div></span></div>',
	"imageWithTextBlockEditor":'{{question}}<div class="col-12 blockanswer"><span style="width:5%; display:inline-block;"></span><span style="width:95%; display:inline-block;"><div class="row"><div class="col-12 pb-3" style="display: flex;align-items: center;justify-content: space-between;" item-value="0"><div class="selecttype" style="padding-right: 10px;"><input type="radio" disabled readonly /></div><div style="min-width: 145px;padding-right: 10px;width:40%;">{{image}}</div><div><textarea style="height:auto;" class="textArea"></textarea></div><input class="pointsbox" placeholder="Points" type="text"><i class="far fa-trash-alt" style="padding-left: 10px;"></i></div></div></span></div>',
	"ratingBoxBlockEditor":'{{question}}<div class="col-12 blockanswer"><div class="row"><div class="col-12"><div class="d-flex justify-content-end"><button class="p-2 rating-button" disabled>1</button><button class="p-2 rating-button" disabled>2</button><button class="p-2 rating-button" disabled>3</button><button class="p-2 rating-button" disabled>4</button><button class="p-2 rating-button" disabled>5</button><button class="p-2 rating-button" disabled>6</button><button class="p-2 rating-button" disabled>7</button><button class="p-2 rating-button" disabled>8</button><button class="p-2 rating-button" disabled>9</button><button class="p-2 rating-button" disabled>10</button></div></div></div><div class="row"><div class="col-12"><div class="d-flex justify-content-end mt-1"><div class="d-flex justify-content-between w-95-p"><input type="text" class="rating-text-a" placeholder="Not at all likely" style="width:10rem"><input type="text" class="rating-text-b" placeholder="Extremely likely" style="width:10rem"></div></div></div></div></div>',
	"ratingRadioBlockEditor":'{{question}}<div class="col-12 blockanswer"><div class="row"><div class="col-12"><div class="d-flex justify-content-end"><table class="w-95-p"><tr><td class="text-center">1</td><td class="text-center">2</td><td class="text-center">3</td><td class="text-center">4</td><td class="text-center">5</td><td class="text-center">6</td><td class="text-center">7</td><td class="text-center">8</td><td class="text-center">9</td><td class="text-center">10</td></tr><tr><td class="text-center"><input type="radio" class="" name="rating-radio" value="1" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="2" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="3" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="4" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="5" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="6" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="7" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="8" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="9" disabled readonly/></th><td class="text-center"><input type="radio" class="" name="rating-radio" value="10" disabled readonly/></th></tr></table></div></div></div></div>',
	"ratingBoxSymbolEditor":'{{question}} <div class="col-12 blockanswer"> <div class="row"> <div class="col-12"> <div class="d-flex justify-content-start w-95-p" style="margin-left:5%;"> <i class="far fa-star p-2" style="font-size: 18px;cursor: not-allowed; width: 30px;"></i> <i class="far fa-star p-2" style="font-size: 18px;cursor: not-allowed; width: 30px;"></i> <i class="far fa-star p-2" style="font-size: 18px;cursor: not-allowed; width: 30px;"></i> <i class="far fa-star p-2" style="font-size: 18px;cursor: not-allowed; width: 30px;"></i> <i class="far fa-star p-2" style="font-size: 18px;cursor: not-allowed; width: 30px;"></i> </div> </div> </div> </div>',
	"yesNoBlockEditor": '{{question}} <div class="col-12 blockanswer"> <div class="row"> <div class="col-12"> <div class="d-flex justify-content-start w-95-p" style="margin-left:5%;"> <div class="" unique-id="{{uniqueId}}"> <div style="width: 100px;height: 100px;cursor: not-allowed;" class="d-flex justify-content-center align-items-center p-3 border border-1 rounded symbol-1"> <i class="far fa-check-circle" style="font-size: 50px;cursor: not-allowed;"></i> </div> <p class="label-1 text-center mb-0">Yes</p><input class="pointsbox mx-auto my-1" placeholder="Points" type="text"> </div> <div class="ml-3" unique-id="{{uniqueId}}"> <div style="width: 100px;height: 100px;cursor: not-allowed;" class="d-flex justify-content-center align-items-center p-3 border border-1 rounded symbol-2"> <i class="far fa-times-circle" style="font-size: 50px;cursor: not-allowed;"></i> </div> <p class="label-2 text-center mb-0">No</p><input class="pointsbox mx-auto my-1" placeholder="Points" type="text"> </div> </div> </div> </div> </div>',
	"consentAgreementBlockEditor": '{{question}} <div class="col-12 blockanswer"> <div class="row"> <div class="col-12"> <div class="d-flex justify-content-start w-95-p" style="margin-left:5%;"><textarea placeholder="Add agreement" class="terms" style="margin-bottom:10px; margin-top:10px; height: auto;"></textarea></div> <div class="d-flex justify-content-start align-items-center w-95-p" style="margin-left:5%;"> <input type="checkbox" style="display: inline-block;" readonly disabled><input type="text" class="agreement" style="margin-bottom:10px; margin-top:10px;margin-left: 10px;display: inline-block;" placeholder="I agree to terms and conditions" value="I agree to terms and conditions"> </div> </div> </div> </div>',
	"rankBlcokEditor":'{{question}} <div class="col-12 blockanswer"><div class="row"><div class="col-12"><div class="d-flex w-95-p mt-2" style="margin-left: 5%;"><input type="text" class="rankTxt"><i class="fas fa-grip-vertical ml-2" style="margin: auto;cursor: not-allowed;"></i><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.remove()"></i></div><div class="d-flex w-95-p mt-2" style="margin-left: 5%;"><input type="text" class="rankTxt"><i class="fas fa-grip-vertical ml-2" style="margin: auto;cursor: not-allowed;"></i><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.remove()"></i></div></div></div></div>',
	"constantSumBlockEditor":'{{question}} <div class="col-12 blockanswer"><span style="width: 5%; display: inline-block;"></span><span style="width: 95%; display: inline-block;"><div class="row"><div class="col-12"><textarea rows="10" class="descriptionText" style="height: 80px;" placeholder="Enter the description to your questions"></textarea></div></div><div class="row"><div class="col-12"><table style="width: 100%;" class="mt-3 rangeTable"><tr class="segmentRow"><td style="width: 20%;"></td><td style="border-bottom: 1px solid black;"><div style="width: 100%;" class="d-flex justify-content-between"><span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span></div></td><td style="width: 10%"></td><td></td></tr><tr class="rangeRow"><td style="width: 20%;" class="pr-3"><input type="text" class="my-3 sumQuestion" style="min-width: 100px;" placeholder="Enter question"></td><td style="padding: 0;"><input type="range" min="0" max="100" value="0" style="width: 100%;margin-top: 7px;" readonly disabled></td><td style="width:10%; padding-left: 5px; padding-right: 5px;"><input type="text" style="text-align: right;" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="rangeRow"><td style="width: 20%;" class="pr-3"><input type="text" class="my-3 sumQuestion" style="min-width: 100px;" placeholder="Enter question"></td><td style="padding: 0;"><input type="range" min="0" max="100" value="0" style="width: 100%;margin-top: 7px;" readonly disabled></td><td style="width:10%; padding-left: 5px; padding-right: 5px;"><input type="text" style="text-align: right;" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="rangeRow"><td style="width: 20%;" class="pr-3"><input type="text" class="my-3 sumQuestion" style="min-width: 100px;" placeholder="Enter question"></td><td style="padding: 0;"><input type="range" min="0" max="100" value="0" style="width: 100%;margin-top: 7px;" readonly disabled></td><td style="width:10%; padding-left: 5px; padding-right: 5px; "><input type="text" style="text-align: right;" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="totalBox" style="display: none;"><td style="width: 20%;" class="pr-3"></td><td style="text-align: right;">Total :</td><td class="" style="padding-left: 5px; padding-right: 5px;"><input type="text" value="0" style="display: inline; text-align: right;" readonly></td><td></td></tr></table><table style="width: 100%;display:none" class="mt-3 inputTable mb-3"><tr class="py-3"><td style="width: 80%;"><input type="text" placeholder="Enter the question here" class="sumQuestion"></td><td><input type="text" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="py-3"><td style="width: 80%;"><input type="text" placeholder="Enter the question here" class="sumQuestion"></td><td><input type="text" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="py-3"><td style="width: 80%;"><input type="text" placeholder="Enter the question here" class="sumQuestion"></td><td><input type="text" value="0" readonly></td><td><i class="far fa-trash-alt ml-2" style="margin: auto;" onclick="this.parentElement.parentElement.remove()"></i></td></tr><tr class="totalInputRow" style="display: none;"><td style="width: 80%;" class="text-right" class="sumQuestion">Total : </td><td><input type="text" value="0" style="display: inline; width: 100%;" readonly></td><td></td></tr></table></div></div></span></div>',
	"labelBlockEditor":'<div class="col-12"><span class="counter" style="width:5%; display:inline-block; vertical-align: top;">{{counter}}</span><div style="width:95%; display:inline-block;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="ckeditableTLabel"><tbody><tr><td id="{{labelId}}" contenteditable="true" valign="top" class="ckeditableLabel">{{textdetail}}</td></tr></tbody></table></div></div>',
	"formPage": '<div id="templateBody{{i}}" item-value="0" item-transition="fade" question-style="horizontal" page-category="{{cat}}" page-category-id="{{catId}}" page-category-color="{{catColor}}" page-unique-id="{{uniqueId}}" class="templateBody d-flex"><div class="questionBlock w-100"><div class="catmaxpointsmain">Max Points : <span class="catmaxpoints">0</span></div><div class="containerEmptyMessage text-center">Drop Content Blocks Here</div></div></div>',
}
let droparraysetting = {
	...droparraysettingcommon,
	"blockSettingBlockEditor":'<div class="form-group"><label class="display-inline-block">Background Color&nbsp;&nbsp;</label><input type="text" id="blockboxbgbox" value=""/></div><div class="form-group"><label>Border(in Pixel)</label><input value="1px" id="blockborwid" tabindex="0" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"><select id="blockselectbortsty"><option value="none" class="optpreview border-style none">None</option><option value="solid" class="optpreview border-style solid">Solid</option><option value="dashed" class="optpreview border-style dashed">Dashed</option><option value="dotted" class="optpreview border-style dotted">Dotted</option><option value="double" class="optpreview border-style double">Double</option><option value="groove" class="optpreview border-style groove">Groove</option><option value="ridge" class="optpreview border-style ridge">Ridge</option><option value="inset" class="optpreview border-style inset">Inset</option><option value="outset" class="optpreview border-style outset">Outset</option></select><input type="text" id="blockboxborderbox" value=""/></div><div class="form-group"><label>Padding(in Pixel) <div class="table-section-r" style="display: inline-block; padding-left: 10px;"><input id="blockbtnete" name="blockbtnete" type="checkbox"/><span class="lbl"></span><span style="padding-left: 5px;">Edge To Edge</span></div></label><div style="margin-bottom: 10px;"><div style="float: left;">Top <input value="" id="blockpadtop" tabindex="3" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Bottom <input value="" id="blockpadbottom" tabindex="4" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div><div><div style="float: left;">Left <input value="" id="blockpadleft" tabindex="1" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="float: right;">Right <input value="" id="blockpadright" tabindex="2" data-dojo-attach-point="textbox,focusNode" autocomplete="off" type="text"></div><div style="clear: both;"></div></div></div><div id="pageTransitionMain" class="form-group"><label>Page Transition</label><select id="pageTransition" class="mb-0"><option value="fade">Fade In/Out</option><option value="slideLeft">Slide Right To Left</option><option value="slideRight">Slide Left To Right</option><option value="slideTop">Slide Bottom to Top</option><option value="slideBottom">Slide Top To Bottom</option><option value="rollIn">Roll In</option><option value="scaleHorizontal">Horizontal Stretch</option><option value="scaleVertical">Vertical Stretch</option><option value="flipLeft">Flip Left</option><option value="flipRight">Flip Right</option><option value="flipTop">Flip Top</option><option value="flipBottom">Flip Bottom</option><option value="carouselLeft">Carousel Left</option><option value="carouselRight">Carousel Right</option><option value="carouselTop">Carousel Top</option><option value="carouselBottom">Carousel Bottom</option><option value="glueLeft">Glue Left</option><option value="glueRight">Glue Right</option><option value="glueTop">Glue Top</option><option value="glueBottom">Glue Bottom</option><option value="newsPaper">News Paper</option></select></div>',
	"contentSettingBlockEditor": '<div class="form-group"><label>Question Layout</label><select id="questionStyle" class="mb-0"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></div><div class="form-group" id="qTran" style="display:none"><label>Question Transition</label><select id="questionTransition" class="mb-0"></select></div>',
}

export function loadeverytime(){
	loadeverytimecommon();
	$("#main").unbind("click").click(function(event){
		// if(($(event.target).hasClass("textTdBlock")===false && $(event.target).closest("td.textTdBlock").length<=0 && $(event.target).closest("div.textTdBlock").length<=0) && ($(event.target).hasClass("ckeditableLabel")===false && $(event.target).closest("td.ckeditableLabel").length<=0)) {
		// 	$(".cke").hide();
		// }
		if(($(event.target).hasClass("em")===false) && ($(event.target).hasClass("subitem")===false) && ($(event.target).hasClass("subitemtext")===false) && ($(event.target).hasClass("fa")===false) && ($(event.target).hasClass("fas")===false) && ($(event.target).closest("div.subsubitem").length<=0)) {
			$(".editormenuitem").removeClass("active");
		}
		if($(event.target).closest(".mojoMcBlock.active").length<=0 && $(event.target).closest(".imageBlock").length<=0 ) {
			hidedsm();
		}
	});
	blockdrop();

	/* DEFAULT SETTINGS */
	loadeverytimecommonformtype();
	/* Page Background */
	$("#pdconuploadimg").unbind("click").click(function(){
		$(".editormenuitem").removeClass("active");
		filemanager("preview_McBlock_pdconimg","pdconimg","pdconimg");
		setTimeout(function(){
			$("#FileManager_pdconimg_pdconimg").css("padding-top",$(".navbar").height()-52);
			$(".topsliderpane-container .content").css("top",parseInt($(".navbar").height())+8);
			clickSelectItemCallAssessment("preview_McBlock_pdconimg","pdconimg","pdconimg");
		},1000);
	});
	/* Page Background */
	/* DEFAULT SETTINGS */

    /* DSM Events */
    $("#dsmclosemenu").unbind("click").click(function(){
        hidedsm();
        $(".cke").hide();
    });
    /* DSM Events */

    /* Form */
	$("#addpage").unbind("click").click(function (){
		$(".addpage").trigger("click");
		$("#clickAddCategoryPage").trigger("click");
	});
	$("#addlandingpage").unbind("click").click(function (){
		removeActive("assessment");
		savefullcontent();
		formpagecount++;
		selectedpage=formpagecount;
		let html = droparray["landingPage"];
		html=replaccon("{{i}}",formpagecount,html);
		$("#preview-template").find(".templateBody").removeClass("d-flex").addClass("d-none");
		$("#preview-template").find(".thankYouPage").before(html);
		if($("#addpagethumb div#thankYouPage.active").find("span").html()!=="END" && $("#addpagethumb div.pagethumb.active").find("span").html().substr(0,1)!=="C"){
			let bg = $("#addpagethumb div.pagethumb.active").find(".fold").css("background-color");
			$("#addpagethumb div.pagethumb.active").find(".fold").removeAttr("style");
			$("#addpagethumb div.pagethumb.active").find(".fold").css("border","2px solid "+bg);
		}
		$("#addpagethumb div.pagethumb,#thankYouPage").removeClass("active");
		$("#addpagethumb").find("#thankYouPage").before(`<div class="pagethumb active" title="Content Page" data-toggle="tooltip"><div class="fold"></div><span>C${formpagecount}</span></div>`);
		$("#landingpagecontrol").find(".modulebutton:first").trigger("click");
		$("#landingpagecontrol").show();
		$("#questioncontrol").hide();
		loadeverytime();
		$(".addpage").trigger("click");
		$(".deletepage").show();
		getCategoryListBox("assessment");
	});
	$(".pagethumb").unbind("click").click(function (){
		selectedpage=$(this).find("span").html().replaceAll("C","");
		if($("#addpagethumb div#thankYouPage.active").find("span").html()!=="END" && $("#addpagethumb div.pagethumb.active").find("span").html().substr(0,1)!=="C"){
			let bg = $("#addpagethumb div.pagethumb.active").find(".fold").css("background-color");
			$("#addpagethumb div.pagethumb.active").find(".fold").removeAttr("style");
			$("#addpagethumb div.pagethumb.active").find(".fold").css("border","2px solid "+bg);
		}
		$(".pagethumb,#thankYouPage").removeClass("active");
		$(this).addClass("active");
		if($("#addpagethumb div#thankYouPage.active").find("span").html()!=="END" && $("#addpagethumb div.pagethumb.active").find("span").html().substr(0,1)!=="C"){
			let bg = $("#addpagethumb div.pagethumb.active").find(".fold").css("border-color");
			$("#addpagethumb div.pagethumb.active").find(".fold").removeAttr("style");
			$("#addpagethumb div.pagethumb.active").find(".fold").css("background-color",bg);
		}
		$("#preview-template").find(".templateBody").removeClass("d-flex").addClass("d-none");
		$("#preview-template").find("#templateBody" + selectedpage).removeClass("d-none").addClass("d-flex");
		if($("#preview-template").find("#templateBody" + selectedpage + " div:first").hasClass("questionBlock") === true){
			$("#questioncontrol").find(".modulebutton:first").trigger("click");
			$("#questioncontrol").show();
			$("#landingpagecontrol").hide();
		}
		if($("#preview-template").find("#templateBody" + selectedpage + " div:first").hasClass("landingBlock") === true){
			$("#landingpagecontrol").find(".modulebutton:first").trigger("click");
			$("#landingpagecontrol").show();
			$("#questioncontrol").hide();
		}
		$(".pageTypeMain").fadeOut();
		hidedsm();
		$("#preview-template").find("#templateBody" + selectedpage + " .mojoMcBlock.frm-block").each(function () {
			formBlockSetting($(this).attr("id"));
		});
		$("#preview-template").find("#templateBody" + selectedpage).find(".mojoMcBlock.tpl-block").each(function () {
			blockedtblocan($(this).attr("id"));
		});
		if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
			if($("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
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
		} else {
			if($("#templateBody"+selectedpage).css("background-image") !== "none"){
				$("#templateBody"+selectedpage).find('.imageBlock div.mojoImageUploader').unbind("click").click(function(){
					hidedsm();
					filemanager("templateBody"+selectedpage,"form6","form6");
				});
			}
		}
		savefullcontent();
		pageHeaderSetting();
		pageFooterSetting(droparraysetting,droparray,savefullcontent,blocksetting);
		$(".deletepage").show();
	});
	$("#thankYouPage").unbind("click").click(function (){
		selectedpage="END";
		if($("#addpagethumb div#thankYouPage.active").find("span").html()!=="END" && $("#addpagethumb div.pagethumb.active").find("span").html().substr(0,1)!=="C"){
			let bg = $("#addpagethumb div.pagethumb.active").find(".fold").css("background-color");
			$("#addpagethumb div.pagethumb.active").find(".fold").removeAttr("style");
			$("#addpagethumb div.pagethumb.active").find(".fold").css("border","2px solid "+bg);
		}
		$(".pagethumb").removeClass("active");
		$(this).addClass("active");
		$("#preview-template").find(".templateBody").removeClass("d-flex").addClass("d-none");
		$("#preview-template").find("#templateBody" + selectedpage).removeClass("d-none").addClass("d-flex");
		$("#landingpagecontrol").find(".modulebutton:first").trigger("click");
		$("#landingpagecontrol").show();
		$("#questioncontrol").hide();
		$(".pageTypeMain").fadeOut();
		$("#preview-template").find("#templateBodyEND").find(".mojoMcBlock.tpl-block").each(function () {
			blockedtblocan($(this).attr("id"));
		});
		hidedsm();
		savefullcontent();
		$(".deletepage").hide();
	});
	pageHeaderSetting();
	pageFooterSetting(droparraysetting,droparray,savefullcontent,blocksetting);
    /* Form */
}
export function reloadfirst(demographicQuestions, brandData) {
	user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : [];
	FOOTER_COMPANY=user["businessName"] ? user["businessName"] : user["firstName"]+' '+user["lastName"];
	FOOTER_EMAIL=user["email"];
	if(typeof brandData.selectFont !== "undefined"){
		$("#pdselectfamily").val(brandData.selectFont).trigger("change");
	} else if(user.hasOwnProperty("brandKits")){
		if(typeof user?.brandKits?.[0]?.brandFonts?.textSetting !== "undefined" && user?.brandKits?.[0]?.brandFonts?.textSetting !== "" && user?.brandKits?.[0]?.brandFonts?.textSetting !== null && $('#preview-template').contents().find('#cntr').attr("style").includes("font-family") === false){
			$("#pdselectfamily").val(user?.brandKits?.[0]?.brandFonts?.textSetting).trigger("change");
		} else {
			$("#pdselectfamily").val("Arial, Helvetica Neue, Helvetica, sans-serif").trigger("change");
		}
	} else {
		$("#pdselectfamily").val("Arial, Helvetica Neue, Helvetica, sans-serif").trigger("change");
	}
	if(typeof brandData.brandBgColor !== "undefined" && brandData.brandBgColor !== ""){
		$('#preview-template').contents().find('#cntr').css('background-color',brandData.brandBgColor);
	}
	if(typeof brandData.brandTextColor !== "undefined" && brandData.brandTextColor !== ""){
		$('#preview-template').contents().find('#stgHid').css('color',brandData.brandTextColor);
	}
	if(typeof brandData.selectedFontSize !== "undefined" && brandData.selectedFontSize !== ""){
		$('#preview-template').contents().find('#stgHid').css('font-size',brandData.selectedFontSize);
	}
	if(typeof brandData.lineHeight !== "undefined" && brandData.lineHeight !== ""){
		$('#preview-template').contents().find('#stgHid').css('line-height',brandData.lineHeight+"px");
	}
	if(typeof brandData.styleBold !== "undefined" && brandData.styleBold === true){
		$('#preview-template').contents().find('#stgHid').css('font-weight','bold');
	} else {
		$('#preview-template').contents().find('#stgHid').css('font-weight','normal');
	}
	if(typeof brandData.styleItalic !== "undefined" && brandData.styleItalic === true){
		$('#preview-template').contents().find('#stgHid').css('font-style','italic');
	} else {
		$('#preview-template').contents().find('#stgHid').css('font-style','normal');
	}
	if(typeof brandData.styleUnderline !== "undefined" && brandData.styleUnderline === true){
		$('#preview-template').contents().find('#stgHid').css('text-decoration','underline');
	} else {
		$('#preview-template').contents().find('#stgHid').css('text-decoration','none');
	}
	if(typeof demographicQuestions !== "undefined" && demographicQuestions.length > 0){
		for(let i=0; i<demographicQuestions.length; i++){
			let fullhtml = getdrophtmlform(demographicQuestions[i].replace(/\s/g, '_').toLowerCase());
			$("#templateBody"+selectedpage).find(".questionBlock").append(fullhtml);
			blockedtblocan(lastformid);
			blockdrag();
			resetCounter(formBlockSetting);
			emtmsedisplay();
			savefullcontent();
		}
	}
	let droppableTargethei=0;
	$('#preview-template').contents().find('.templateBody').each(function(){
		droppableTargethei=0;
		$(this).find(".questionBlock .frm-block").each(function(){
			droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
		});
		$(this).find(".landingBlock .mojoMcBlock").each(function(){
			droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
		});
		if(droppableTargethei<=300){droppableTargethei=300;} else { droppableTargethei=(parseInt(droppableTargethei)); }
		$(this).find('.questionBlock').css({"min-height":droppableTargethei+"px"});
	});
	$('#preview-temp').contents().find('.mojoMcBlock.tpl-block.dojoDndItem').each(function(){
		$('#preview-temp11').hide();
	});
	tembody = $('.templateBody');
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
	$('#preview-template').find('center#cntr').css({"box-shadow":"1px 1px 10px #555","width":"62%"});
	savefullcontent();
	emtmsedisplay();
	$('#preview-template').find('meta').remove();
	$('#preview-template').find('title').remove();
	setTimeout(function () {
		$("#addpagethumb").find("div.pagethumb:first").trigger("click");
		formpagecount=$("#addpagethumb").find("div.pagethumb").length;
		getCategoryListBox("assessment");
	},1000);
	getSurveyAllList().then(res => {
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
	getAssessmentAllList().then(res => {
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
	getCustomFormLinkList().then(res => {
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
}
export function addPage(catId, catName, catColor){
	removeActive("assessment");
	savefullcontent();
	formpagecount++;
	selectedpage=formpagecount;
	let html = droparray["formPage"];
	html=replaccon("{{i}}",formpagecount,html);
	html=replaccon("{{cat}}",catName,html);
	html=replaccon("{{catId}}",catId,html);
	html=replaccon("{{catColor}}",catColor,html);
	html=replaccon("{{uniqueId}}",uuidv4(),html);
	$("#preview-template").find(".templateBody").removeClass("d-flex").addClass("d-none");
	$("#preview-template").find(".thankYouPage").before(html);
	if($("#addpagethumb div#thankYouPage.active").find("span").html()!=="END" && $("#addpagethumb div.pagethumb.active").find("span").html().substr(0,1)!=="C"){
		let bg = $("#addpagethumb div.pagethumb.active").find(".fold").css("background-color");
		$("#addpagethumb div.pagethumb.active").find(".fold").removeAttr("style");
		$("#addpagethumb div.pagethumb.active").find(".fold").css("border","2px solid "+bg);
	}
	$("#addpagethumb div.pagethumb,#thankYouPage").removeClass("active");
	$("#addpagethumb").find("#thankYouPage").before(`<div class="pagethumb active" title="${catName}" data-toggle="tooltip"><div class="fold" style="background-color:${catColor}"></div><span>${formpagecount}</span></div>`);
	$("#questioncontrol").find(".modulebutton:first").trigger("click");
	$("#questioncontrol").show();
	$("#landingpagecontrol").hide();
	if(catId === "1"){
		$("#preview-template").find("#templateBody"+formpagecount).attr("page-category-display","no");
	}
	loadeverytime();
	$(".deletepage").show();
	getCategoryListBox("assessment");
}
export function deletePage(e, setCategoryPageList){
	e.stopPropagation();
	$(".cke").hide();
	let blo_id="DialogDeletePage";
	let t = $("#addpagethumb").find(".pagethumb.active span").html().replaceAll("C","");
	let item = $("#addpagethumb").find(".pagethumb.active");
	if($("#addpagethumb").find(".pagethumb span").length < 2){
		$("#clickError").attr("data-type","Error");
		$("#clickError").val("Your design should have at least one landing page or question page, so you can not delete this page.\nTo delete current page add new question page or landing page in your design.");
		$("#clickError").trigger("click");
		return;
	}
	if(e.altKey) {
		$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
		if(!$("#addpagethumb").find(".pagethumb.active span").html().includes("C")){
			let setItem, ii=0;
			$("#addpagethumb").find(".pagethumb:not([data-original-title=\"Content Page\"])").each(function(){
				if($(this).hasClass("active")){
					setItem=ii;
					return true;
				}
				ii++;
			});
			setCategoryPageList((prev)=>([...prev.filter((val,index)=>(index !== setItem))]));
		}
		$("#preview-template").find("#templateBody" + t).remove();
		item.siblings(".pagethumb").click();
		item.remove();
		let i = 1;
		$("#addpagethumb").find(".pagethumb").each(function(){
			if($(this).find("span").html().substr(0,1)==="C"){
				$(this).find("span").html("C"+i);
			} else {
				$(this).find("span").html(i);
			}
			i++;
		});
		i = 1;
		$("#preview-template").find(".templateBody").not(".thankYouPage").each(function(){
			$(this).attr("id","templateBody"+i);
			i++;
		});
		formpagecount--;
		selectedpage=$(".pagethumb.active").find("span").html().replaceAll("C","");
		$(".pagethumb.active").trigger("click");
		savefullcontent();
		getCategoryListBox("assessment");
	}else{
		$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
		let dilogstring=droparray["DeletePageDialog"];
		dilogstring=replaccon("{{Dialog.id}}",blo_id,dilogstring);
		$("body").append(dilogstring);
		$("#a"+blo_id).leanModal({ top :100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
		closeleanModal();
		setTimeout(function(){
			$("#a"+blo_id)[0].click();
		},500);
		$("#"+blo_id+" div div a.button").unbind("click").click(function(){
			$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
			if(!$("#addpagethumb").find(".pagethumb.active span").html().includes("C")){
				let setItem, ii=0;
				$("#addpagethumb").find(".pagethumb:not([data-original-title=\"Content Page\"])").each(function(){
					if($(this).hasClass("active")){
						setItem=ii;
						return true;
					}
					ii++;
				});
				setCategoryPageList((prev)=>([...prev.filter((val,index)=>(index !== setItem))]));
			}
			$("#preview-template").find("#templateBody" + t).remove();
			item.siblings(".pagethumb").click();
			item.remove();
			let i = 1;
			$("#addpagethumb").find(".pagethumb").each(function(){
				if($(this).find("span").html().substr(0,1)==="C"){
					$(this).find("span").html("C"+i);
				} else {
					$(this).find("span").html(i);
				}
				i++;
			});
			i = 1;
			$("#preview-template").find(".templateBody").not(".thankYouPage").each(function(){
				$(this).attr("id","templateBody"+i);
				i++;
			});
			formpagecount--;
			selectedpage=$(".pagethumb.active").find("span").html().replaceAll("C","");
			$(".pagethumb.active").trigger("click");
			savefullcontent();
			getCategoryListBox("assessment");
		});
	}
	hidedsm();
	savefullcontent();
}
function blockdrag() {
	blockdrop();
}
function blockdrop() {
	$('#preview-template').find('.templateBody .questionBlock').droppable({
		iframeFix: true,
		hoverClass: "drop_hover",
		tolerance: "pointer",
		accept: ".mojoBlockFormItem",
		drop: function( event, ui ) {
			$(".editormenuitem").removeClass("active");
			let  bi="no";
			if(ui.draggable.hasClass("mojoBlockFormItem")) {
				let html = ui.draggable.text();
				found = html.replace('<!--', '').replace('-->', '').replace(/\s/g, '_').toLowerCase();
				let fullhtml = getdrophtmlform(found);
				if(blockhover==="") {
					$(this).append(fullhtml);
				} else {
					$(this).find("#"+blockhover).after(fullhtml);
				}
				blockedtblocan(lastformid);
				blockdrag();
				resetCounter(formBlockSetting);
				emtmsedisplay();
				savefullcontent();
				bi="yes";
			} else {
				$(ui.helper).clone(false);
				let html = ui.draggable.removeClass('ui-draggable-dragging').removeAttr("style");
				lastbloclid=ui.draggable.attr("id");
				$(this).append(html);
			}
			if(bi==="no") {
				refleftimageandcaption(found,lastbloclid,editorMax,editorWidth,imgwidfull);
				blockedtblocan(lastbloclid);
				blockdrag();
				emtmsedisplay();
				savefullcontent();
			}
			mySlideronc();
		}
	});
	$('#preview-template').find('.templateBody .landingBlock').droppable({
		iframeFix: true,
		hoverClass: "drop_hover",
		tolerance: "pointer",
		accept: ".mojoBlockSourceItem,.mojoMcBlock,.socialmedia",
		drop: function( event, ui ) {
			$(".editormenuitem").removeClass("active");
			let  bi="no";
			if(ui.draggable.hasClass("buttonIcon")) {
				buttoncontrol($(this));
				bi="yes";
			} else if(ui.draggable.hasClass("attachmentIcon")) {
				attachmentcontrol($(this));
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
			} else {
				$(ui.helper).clone(false);
				let html = ui.draggable.removeClass('ui-draggable-dragging').removeAttr("style");
				lastbloclid=ui.draggable.attr("id");
				$(this).append(html);
			}
			if(bi==="no") {
				refleftimageandcaption(found,lastbloclid,editorMax,editorWidth,imgwidfull);
				blockedtblocan(lastbloclid);
				blockdrag();
				emtmsedisplay();
				savefullcontent();
			}
			mySlideronc();
		}
	});
	$('#preview-template').find('#pageheader').droppable({
		iframeFix: true,
		hoverClass: "drop_hover",
		tolerance: "pointer",
		accept: ".mojoBlockSourceItem",
		drop: function (event, ui) {
			$(".editormenuitem").removeClass("active");
			if(ui.draggable.hasClass("mojoBlockSourceItem")) {
				let html = ui.draggable.text();
				found = html.replace('<!--', '').replace('-->', '').replace(/\s/g, '').toLowerCase();
				let fullhtml = getdrophtmlheader(found,droparray);
				$(this).find("div.row").remove();
				$(this).append(fullhtml);
				emtmsedisplay();
				savefullcontent();
				hidedsm();
				pageHeaderSetting();
			}
		}
	});
	$('#preview-template').find('#pagefooter').droppable({
		iframeFix: true,
		hoverClass: "drop_hover",
		tolerance: "pointer",
		accept: ".mojoBlockSourceItem",
		drop: function (event, ui) {
			$(".editormenuitem").removeClass("active");
			if(ui.draggable.hasClass("mojoBlockSourceItem")) {
				let html = ui.draggable.text();
				found = html.replace('<!--', '').replace('-->', '').replace(/\s/g, '').toLowerCase();
				let fullhtml = getdrophtmlfooter(found,droparray);
				$(this).find("div.row").remove();
				$(this).append(fullhtml);
				emtmsedisplay();
				savefullcontent();
				hidedsm();
				pageFooterSetting(droparraysetting,droparray,savefullcontent,blocksetting);
			}
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
		fullhtml=replaccon('class="listTdBlock"','class="listTdBlock" style="padding: 10px 0px;"',fullhtml);
	}
	if(key==="image" || key==="logoicon" || key==="image_group") {
		if(key==="image_group") {
			fullhtml=fullhtml.replace(' ##imageGroupTBlock##',' imageGroupTBlock');
			fullhtml=fullhtml.replace(' ##imageGroupTdBlock##',' imageGroupTdBlock');
			fullhtml=fullhtml.replace('<!-- image_group_item -->',droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td></tr><tr><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]+"<!--[if (mso)|(IE)]></td><td class=\"listTdBlock\" align=\"left\" valign=\"top\"><![endif]-->"+droparray["templates/editorContainer/image_group/addnewcontent"]);
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
			if(i===0) {
				fullhtml=fullhtml.replace('style="height:170px;"','style="height:170px;padding: 5px;"');
			}
			if(i===1) {
				fullhtml=fullhtml.replace('style="height:170px;"','style="height:170px;padding: 5px;"');
			}
			if(i===2) {
				fullhtml=fullhtml.replace('style="height:170px;"','style="height:170px;padding: 5px;"');
			}
			if(i===3) {
				fullhtml=fullhtml.replace('style="height:170px;"','style="height:170px;padding: 5px;"');
			}
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
			fullhtml=fullhtml.replace('height="170"','');
			fullhtml=fullhtml.replace('style="height:170px;"','style="padding: 5px;"');
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
			fullhtml=fullhtml.replace('height="170"','');
			fullhtml=fullhtml.replace('style="height:170px;"','style="padding: 5px;"');
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
	if(key==="video") {
		fullhtml=replaccon('class="listTdBlock"','class="listTdBlock" style="padding: 5px;"',fullhtml);
	}
	fieldcount++;
	return fullhtml;
}
export function savefullcontent() {
	let droppableTargethei=0;
	$('#preview-template').contents().find('.templateBody').each(function(){
		droppableTargethei=0;
		$(this).find(".questionBlock .frm-block").each(function(){
			droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
		});
		$(this).find(".landingBlock .mojoMcBlock").each(function(){
			droppableTargethei=(parseInt(droppableTargethei)+$(this).height());
		});
		if(droppableTargethei<=300){droppableTargethei=300;} else { droppableTargethei=(parseInt(droppableTargethei)); }
		$(this).find('.questionBlock').css({"min-height":droppableTargethei+"px"});
	});
	$('#preview-template').find('div.mcd').attr("id","mcd");
	$('#preview-template').contents().find('.textTdBlock').each(function(){
		$(this).css("word-break","break-word");
	});
	$('#preview-template').contents().find('.mcpreview-image-uploader tbody tr').html('');
	$('#preview-template').contents().find('.mojoMcContainerEmptyMessage').html('');
	tembody = $('.templateBody');
	tembody.attr("data-width",tembody.attr("width"));

	let fullhtmlfornext=$('#preview-template').html();
	fullhtmlfornext=replaccon('<meta charset="UTF-8">',"",fullhtmlfornext);
	fullhtmlfornext=replaccon('<meta name="viewport" content="width=device-width, initial-scale=1"><title>SAM</title>',"",fullhtmlfornext);
	fullhtmlfornext = fullhtmlfornext.replace(/<sc[r]ipt[\s\S]*?<\/sc[r]ipt>/gi,'');
	fullhtmlfornext=unprotectSource(fullhtmlfornext);
	document.getElementById('all_temp_data').value='<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8"><title>SAM</title></head><body>' + fullhtmlfornext + "</body></html>";

	tembody = $('.templateBody');
	tembody.attr("width",tembody.attr("data-width"));
	$('#preview-template').contents().find('.mcpreview-image-uploader tbody tr').html(droparray['replaceimagedrop']);
	$('#preview-template').contents().find('div.mojoMcBlock.tpl-block[rolefor="image"],[rolefor="logoicon"],[rolefor="image_card"],[rolefor="image_+_caption11"]').each(function( key_id ) {
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
	$("#addpagethumb").sortable({
		items: '.pagethumb',
		cancel: ".unsortable",
		placeholder: "ui-state-highlight",
		helper:'clone',
		revert: true,
		forceHelperSize: true,
		forcePlaceholderSize: true,
		connectWith: "#addpagethumb",
		cursor: 'move',
		stop: function( event, ui ) {
			let selectedI = ui["item"][0].innerText.split("\n")[0].replaceAll("C","");
			if(ui["item"][0].previousSibling !== null){
				let selectedPrevI = ui["item"][0].previousSibling.innerText.split("\n")[0].replaceAll("C","");
				$("#preview-template").find("#templateBody"+selectedI).insertAfter($("#preview-template").find("#templateBody"+selectedPrevI));
			} else if(ui["item"][0].nextSibling !== null){
				let selectedNextI = ui["item"][0].nextSibling.innerText.split("\n")[0].replaceAll("C","");
				$("#preview-template").find("#templateBody"+selectedI).insertBefore($("#preview-template").find("#templateBody"+selectedNextI));
			}
			let i = 1;
			$("#addpagethumb").find(".pagethumb").each(function(){
				if($(this).find("span").html().substr(0,1)==="C"){
					$(this).find("span").html("C"+i);
				} else {
					$(this).find("span").html(i);
				}
				i++;
			});
			i = 1;
			let j = 1;
			$("#preview-template").find(".templateBody").not(".thankYouPage").each(function(){
				$(this).attr("id","templateBody"+i);
				j = 1;
				$(this).contents().find('.mojoMcBlock.frm-block').unbind("each").each(function () {
					$(this).attr("id","preview_Form_"+i+j);
					formBlockSetting("preview_Form_"+i+j);
					j++;
				});
				i++;
			});
			selectedpage=$(".pagethumb.active").find("span").html().replaceAll("C","");
			$(".pagethumb.active").trigger("click");
			getCategoryListBox("assessment");
		}
	});
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
	$(".mojoMcBlock.dojoDndItem").hover(function(){
		blockhover=$(this).attr("id");
	});
	blockhover="";
	emtmsedisplay();
	bigimagesetting();
}
export function blockedtblocan(block_id) {
	let rolefor=$('#preview-template').contents().find('#'+block_id).attr("rolefor");
	if(rolefor==="text" || rolefor==="boxed_text" || rolefor==="boxed_text20" || rolefor==="boxed_text21" || rolefor==="boxed_text22" || rolefor==="footer") {
		tbfcontrol(block_id,surveystags,assessmentstags,customformstags,droparraysetting,blocksetting);
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
		imgcardcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting);
	}
	if(rolefor==="image_+_caption21" || rolefor==="image_+_caption22" || rolefor==="image_+_caption31" || rolefor==="image_+_caption32" || rolefor==="image_+_caption21_+_h" || rolefor==="image_+_caption22_+_h" || rolefor==="image_+_caption31_+_h" || rolefor==="image_+_caption32_+_h") {
		multiimgcardcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting);
	}
	if(rolefor==="2image_+_2caption" || rolefor==="3image_+_3caption") {
		mulimgcapcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting);
	}
	if(rolefor==="2image_+_1caption1" || rolefor==="2image_+_1caption2") {
		mulimgonecapcontrol(block_id,surveystags,assessmentstags,customformstags,editreplaceimagelink,droparraysetting,blocksetting);
	}
	if(rolefor==="video") {
		videocontrol(block_id,droparraysetting,blocksetting);
	}
	if(rolefor==="genericlink") {
		buttonSetting(block_id,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
	}
	if(rolefor==="open_ended" || rolefor==="single_answer" || rolefor==="single_answer_checkbox" || rolefor==="single_answer_button" || rolefor==="single_answer_combo" || rolefor === "email" || rolefor === "phone" || rolefor==="matrix" || rolefor==="contact_form" || rolefor==="date_control" || rolefor==="time_control" || rolefor==="image_form" || rolefor==="image_with_text_form" || rolefor==="rating_box" || rolefor==="rating_radio" ||rolefor==="rating_symbol" || rolefor==="yes_no" || rolefor==="rank" || rolefor==="constant_sum" || rolefor==="consent_agreement" || rolefor==="gender" || rolefor==="age" || rolefor==="marital_status" || rolefor==="education" || rolefor==="employment_status" || rolefor==="employer_type" || rolefor==="housing" || rolefor==="household_income" || rolefor==="race" || rolefor==="label" ) {
		formBlockControl(block_id,formBlockSetting);
	}
	if(rolefor==="attachment") {
		attachmentSetting(block_id,droparraysetting,blocksetting);
	}
}
function buttoncontrol(block_id) {
	let sty,sty2,ae;
	sty='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff !important;background-color: #6c757d;border-color: #6c757d;"';
	sty2='style="display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid #6c757d;padding: 5px;border-radius: 4px;text-decoration: none !important;cursor: pointer;color: #fff;background-color: #6c757d;border-color: #6c757d;"';
	ae=' <!--[if true]><table role="presentation" width="65" cellpadding="0" cellspacing="0" border="0" '+sty2+'><tr><td width="65"><![endif]--><a target="_blank" href="http://www.example.com" '+sty+'>Button</a><!--[if true]></td></tr></table><![endif]-->';
	let fullHTML=getdrophtml("genericlink");
	fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
	fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
	if(blockhover==="") {
		block_id.append(fullHTML);
	} else {
		block_id.find("#"+blockhover).after(fullHTML);
	}
	buttonSetting(lastbloclid,droparraysetting,blocksetting,linkcontrol,surveystags,assessmentstags,customformstags);
	emtmsedisplay();
}
function attachmentcontrol(block_id) {
	let ae=' <!--[if true]><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><a target="_blank" href="http://www.example.com" download>Attachment Link</a><!--[if true]></td></tr></table><![endif]-->';
	let fullHTML=getdrophtml("attachment");
	fullHTML=replaccon("{{blockHtml|safe}}",ae,fullHTML);
	fullHTML=fullHTML.replace('{{lbid}}',lastbloclid);
	if(blockhover==="") {
		block_id.append(fullHTML);
	} else {
		block_id.find("#"+blockhover).after(fullHTML);
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
			let fullhtml = getdrophtml(found.attr("rolefor"));
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
	let pTrans = $("#templateBody"+selectedpage).attr("item-transition");
	$(`#pageTransition option[value="${pTrans}"]`).attr("selected", true);
	$("#pageTransition").unbind("change").change(function(){
		$("#templateBody"+selectedpage).attr("item-transition", $("#pageTransition").val());
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
			changeWidth="yes";
			$("#"+block_id+" table.dividerTBlock").attr('width',$("#dvdborwidth").val().replace("px",""));
			if($("#"+block_id).find("table.dividerTBlock").attr("changeWidth")!=="yes") {
				$("#"+block_id).find("table.dividerTBlock").attr("changeWidth",changeWidth);
			}
			changeWidth="";
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
					$("#" + block_id).find("table[data-tbmc-id=" + t + "] td.imageGroupTdBlock img").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
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
				type="tblControl";
				fromEditorA="self";
				$("#clickLoader").val(true);
				$("#clickLoader").trigger("click");
				launchPixieEditor();
				hidedsm();
			});
			$('.tpl-image-replace').unbind("click").click(function () {
				filemanager(block_id,t,contentblockid);
				hidedsm();
			});
		})
	));
}
function blocksettingheader() {
	blocksettingheadercommon()
	$(".tpl-block-delete").unbind("click").click(function(e){
		$(".cke").hide();
		let blo_id="Dialog_2_header";
		if(e.altKey) {
			$("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay").remove();
			$('#pageheader').find('div.row').remove();
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
				$('#pageheader').find('div.row').remove();
				emtmsedisplay();
				savefullcontent();
			});
		}
		hidedsm();
		emtmsedisplay();
		savefullcontent();
	});
	if($('#pageheader').find('div.row').find("#headerdimg img").hasClass("mcnImage")) {
		let imgh,imgw,imgh1,imgw1;
		$("#imgtxtwidth,#imgtxtheight").unbind("focus").focus(function () {
			imgh = $("#imgtxtheight").val();
			imgw = $("#imgtxtwidth").val();
		});
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
			$('#pageheader').find('div.row').find("#headerdimg img.mcnImage").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
			if ($('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("changeWidth") !== "yes") {
				$('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("changeWidth", changeWidth);
			}
			changeWidth = "";
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
			$('#pageheader').find('div.row').find("#headerdimg img.mcnImage").css({"width": $("#imgtxtwidth").val(), "height": $("#imgtxtheight").val()});
			if ($('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("changeWidth") !== "yes") {
				$('#pageheader').find('div.row').find("#headerdimg img.mcnImage").attr("changeWidth", changeWidth);
			}
			changeWidth = "";
		});
		$('.tpl-image-edit').unbind("click").click(function () {
			imageIDFullPath = $("#headerdimg img.mcnImage").attr("src")
			if (imageIDFullPath.indexOf("?v=") > -1) {
				filename = imageIDFullPath.split("?")[0].split("/").pop();
				imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
			} else {
				filename = imageIDFullPath.split("/").pop();
				imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
			}
			filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
			type="header";
			fromEditorA="self";
			$("#clickLoader").val(true);
			$("#clickLoader").trigger("click");
			launchPixieEditor();
			hidedsm();
		});
		$('.tpl-image-replace').unbind("click").click(function () {
			hidedsm();
			if($('#pageheader').find('div.row').find("#headerdimg").hasClass("headerdimg")) {
				filemanager("preview_McBlock_header", "header2", "header2");
				setTimeout(function () {
					clickSelectItemCallAssessment("preview_McBlock_header", "header2", "header2");
				}, 1000);
			} else {
				filemanager("preview_McBlock_header","header","header");
				setTimeout(function(){
					clickSelectItemCallAssessment("preview_McBlock_header","header","header");
				},1000);
			}
		});
	}
}
/* Setting functions */

/* File Manager */
function clickSelectItemCallAssessment(block_id,target_id,contentblockid) {
	clickSelectItemCallCommon(block_id,target_id,contentblockid,newItemCall,droparray,imgwidfull,editorWidth,editorMax,imagescontrol,blockedtblocan,mySlideronc,selectedpage,editreplaceimagelink);
	$(".pixie-edit").unbind("click").click(function() {
		imageIDFullPath = $(this).attr('item-url');
		filename = $(this).attr('item-file-name');
		filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
		imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
		fromEditorA="manager";
		$("#clickLoader").val(true);
		$("#clickLoader").trigger("click");
		launchPixieEditor();
	})
}
window.clickSelectItemCallAssessment=clickSelectItemCallAssessment;
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

/* Form Control */
function getdrophtmlform(key) {
	lastformid="";
	let links=drop_link[key];
	fieldcountform=$("#templateBody"+selectedpage).find(".mojoMcBlock.frm-block").length;
	fieldcountform++;
	let ids="preview_Form_"+selectedpage+fieldcountform;
	lastformid=ids;
	let qTransition = "slideLeft";
	if(typeof $("#templateBody"+selectedpage).attr("question-style") !== "undefined"){
		if($("#templateBody"+selectedpage).attr("question-style") === "horizontal"){
			qTransition = "slideLeft";
		} else {
			qTransition = "slideTop";
		}
		$("#qTran").show();
	}
	let fullhtml= '<div id="'+ids+'" class="mojoMcBlock frm-block dojoDndItem focus" question-transition="'+qTransition+'" rolefor="'+key+'" data-unique-id="'+uuidv4()+'"><div data-dojo-attach-point="containerNode" style="width: 100%;">';
	fullhtml+= droparray["blankformBlockEditor"];
	fullhtml=replaccon("{{formControl}}",droparray[links],fullhtml);
	if(key === "consent_agreement"){
		let tempquestionBlockEditor = document.createElement("div");
		tempquestionBlockEditor.innerHTML = droparray["questionBlockEditor"];
		tempquestionBlockEditor.querySelector("input").remove();
		tempquestionBlockEditor.querySelector("div.ai-main").parentElement.remove();
		fullhtml=replaccon("{{question}}",tempquestionBlockEditor.innerHTML,fullhtml);
		tempquestionBlockEditor.remove();
	} else {
		let tempquestionBlockEditor = document.createElement("div");
		tempquestionBlockEditor.innerHTML = droparray["questionBlockEditor"];
		tempquestionBlockEditor.querySelector("div.ai-main").parentElement.remove();
		fullhtml=replaccon("{{question}}",tempquestionBlockEditor.innerHTML,fullhtml);
		tempquestionBlockEditor.remove();
	}
	fullhtml=replaccon("{{counter}}",fieldcountform,fullhtml);
	fullhtml=replaccon("{{id}}",'id="question'+selectedpage+fieldcountform+'"',fullhtml);
	fullhtml=replaccon("{{name}}",'name="question'+selectedpage+fieldcountform+'"',fullhtml);
	if(key==="open_ended" || key === "age" || key === "email" || key === "phone") {
		fullhtml=replaccon("{{aid}}",'id="answer'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{aname}}",'name="answer'+selectedpage+fieldcountform+'"',fullhtml);
	}
	if(key==="single_answer" || key==="single_answer_checkbox") {
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key==="single_answer_button" || key==="single_answer_combo") {
		fullhtml=replaccon("{{answer}}",'<select class="singleanswercombo" style="margin-bottom: 10px;border-radius: 0;display:none;"></select>'+droparray["buttonBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["buttonBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key==="matrix"){
		fullhtml=replaccon("{{matrix_ans_block}}",droparray["matrixAnsBlockEditor"],fullhtml);
	}
    if(key === "contact_form") {
		fullhtml=replaccon("{{nid}}",'id="name'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{eid}}",'id="email'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{pid}}",'id="phone'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{aid}}",'id="address'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{a2id}}",'id="address2'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{cid}}",'id="city'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{sid}}",'id="state'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c2id}}",'id="country'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{zid}}",'id="zip'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c3id}}",'id="company'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{nname}}",'name="name'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{ename}}",'name="email'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{pname}}",'name="phone'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{aname}}",'name="address'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{a2name}}",'name="address2'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{cname}}",'name="city'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{sname}}",'name="state'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c2name}}",'name="country'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{zname}}",'name="zip'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c3name}}",'name="company'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{nfor}}",'for="name'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{efor}}",'for="email'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{pfor}}",'for="phone'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{afor}}",'for="address'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{a2for}}",'for="address2'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{cfor}}",'for="city'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{sfor}}",'for="state'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c2for}}",'for="country'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{zfor}}",'for="zip'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{c3for}}",'for="company'+selectedpage+fieldcountform+'"',fullhtml);
	}
	if(key === "date_control"){
		fullhtml=replaccon("{{did}}",'id="date'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{dname}}",'name="date'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{dfor}}",'for="date'+selectedpage+fieldcountform+'"',fullhtml);
	}
	if(key === "time_control"){
		fullhtml=replaccon("{{tid}}",'id="time'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{tname}}",'name="time'+selectedpage+fieldcountform+'"',fullhtml);
		fullhtml=replaccon("{{tfor}}",'for="time'+selectedpage+fieldcountform+'"',fullhtml);
	}
	if(key === "image_form" || key === "image_with_text_form"){
		fullhtml=replaccon("{{image}}",droparray["blankImageBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key==="gender"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "marital_status"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "education"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "employment_status"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "employer_type"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "housing"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "household_income"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "race"){
		fullhtml=replaccon("{{answer}}",droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4())+droparray["radioBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()),fullhtml);
	}
	if(key === "label"){
		fullhtml=replaccon("{{textdetail}}",deftextcont,fullhtml);
		fullhtml=replaccon("{{labelId}}","label_"+selectedpage+fieldcountform,fullhtml);
	}
	fullhtml+='</div></div>';
	return fullhtml;
}
export function formBlockSetting(block_id) {
	formBlockSettingCommon(block_id,removeActive,"assessment");
	formBlockSettingCommon2(block_id,removeActive,"assessment",droparraysetting,pagesetting,selectedpage,droparray,formBlockSetting);
	$("#"+block_id).find(".top-control .fa-trash-alt").unbind("click").click(function(){
		$("#"+block_id).remove();
		calculateMaxPoints(selectedpage);
		getCategoryListBox("assessment");
		resetCounter(formBlockSetting);
		emtmsedisplay();
		savefullcontent();
	});
	$("#"+block_id).find(".fa-clone").unbind("click").click(function(e){
		e.stopPropagation();
		removeActive("assessment");
		let found=$('#preview-template').contents().find('#'+block_id);
		let fullhtml = getdrophtmlform(found.attr("rolefor"));
		found.after(fullhtml);
		blockdrag();
		blockedtblocan(lastformid);
		emtmsedisplay();
		savefullcontent();
		setTimeout(function(){
			$("#"+lastformid).find("[name*='question']").trigger("click");
		},100);
		resetCounter(formBlockSetting);
	});
	$(`#${block_id}[rolefor="image_form"],#${block_id}[rolefor="image_with_text_form"]`).find(".bottom-control .addoption").unbind("click").click(function(e){
		e.stopPropagation();
		if($("#"+block_id).attr("rolefor")==="image_form" || $("#"+block_id).attr("rolefor")==="image_with_text_form") {
			let type = "";
			if ($("#" + block_id).find(".multians input[type='checkbox']").prop("checked") === true) {
				type = "checkbox";
			} else {
				type = "radio";
			}
			let i = $("#" + block_id).find(".blockanswer div.row div[item-value]").length;
			if ($("#" + block_id).attr("rolefor") === "image_form") {
				$("#" + block_id).find(".blockanswer div.row").append('<div class="col-3 pb-3 d-flex flex-column" item-value="' + i + '" style="min-width: 175px;">' + droparray["blankImageBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()) + '<div class="text-center selecttype"><input type="' + type + '" disabled readonly></div><div><input class="pointsbox mx-auto my-1" placeholder="Points" type="text"></div><div class="text-center"><i class="far fa-trash-alt"></i></div></div>');
			} else if ($("#" + block_id).attr("rolefor") === "image_with_text_form") {
				$("#" + block_id).find(".blockanswer div.row:first").append('<div class="col-12 pb-3" item-value="' + i + '" style="display: flex;align-items: center;justify-content: space-between;"><div class="selecttype" style="padding-right: 10px;"><input type="' + type + '" disabled readOnly/></div><div style="min-width: 145px;padding-right: 10px;width:40%;">' + droparray["blankImageBlockEditor"].replaceAll("{{uniqueId}}",uuidv4()) + '</div><div><textarea style="height:auto;" class="textArea"></textarea></div><input class="pointsbox" placeholder="Points" type="text"><i class="far fa-trash-alt" style="padding-left: 10px;"></i></div>');
			}
			$("#" + block_id).find("div.mojoImageUploader").unbind("click").click(function (e) {
				e.stopPropagation();
				let target_id=$(this).closest('div[item-value]').attr('item-value');
				if($(this).find("img").hasClass("mcnImage")){
					imageID = block_id+"_"+target_id;
					imageIDFullPath = $(this).find("img").attr("src");
					if (imageIDFullPath.indexOf("?v=") > -1) {
						filename = imageIDFullPath.split("?")[0].split("/").pop();
					} else {
						filename = imageIDFullPath.split("/").pop();
					}
					type="imgControl";
					$("#dsmcsetting").html(droparraysetting["contentSettingBlockEditor"]);
					$("#dsmbsetting").html(droparraysetting["formPageSettingBlockEditor"]);
					$("#bbutton").trigger("click");
					pagesetting("imgControl");
					questioncontentsetting(block_id,selectedpage,formBlockSetting);
					showdsm("formBlock");
					$(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
				} else {
					hidedsm();
					filemanager(block_id + "_" + target_id, "imagecontrol", "imagecontrol");
				}
			});
			if ($("#" + block_id).find(".blockanswer div.row div[item-value]").length >= 10) {
				$("#" + block_id).find(".bottom-control").hide();
			}
		}
		deleteSingleImage(block_id,"assessment",selectedpage);
		$('input[type="text"],label.switch,textarea,select,input[type="checkbox"]').on("click focus",function(e) {
			e.stopPropagation();
		});
		setMaxPoints(block_id,selectedpage);
	});
	$("#"+block_id).find("div.mojoImageUploader").unbind("click").click(function(e){
		e.stopPropagation();
		let target_id=$(this).closest('div[item-value]').attr('item-value');
		if($(this).find("img").hasClass("mcnImage")){
			imageID = block_id+"_"+target_id;
			imageIDFullPath = $(this).find("img").attr("src");
			if (imageIDFullPath.indexOf("?v=") > -1) {
				filename = imageIDFullPath.split("?")[0].split("/").pop();
			} else {
				filename = imageIDFullPath.split("/").pop();
			}
			type="imgControl";
			$("#dsmcsetting").html(droparraysetting["contentSettingBlockEditor"]);
			$("#dsmbsetting").html(droparraysetting["formPageSettingBlockEditor"]);
			$("#bbutton").trigger("click");
			pagesetting("imgControl");
			questioncontentsetting(block_id,selectedpage,formBlockSetting);
			showdsm("formBlock");
			$(".dsmbsettingbutton i.tpl-specific-i").addClass("tpl-specific-active");
		} else {
			hidedsm();
			filemanager(block_id+"_"+target_id,"imagecontrol","imagecontrol");
		}
	});
}
/* Form Control */

/* Page Control */
function pagesetting(from) {
	pagesettingcommon(selectedpage,droparray);
	$('.tpl-image-edit').unbind("click").click(function () {
		if(from === "queControl") {
			if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
				if($("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
					imageIDFullPath = $("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image");
					imageIDFullPath = imageIDFullPath.replace('url(','').replace(')','').replace(/"/gi, "");
				}
			} else {
				if($("#templateBody"+selectedpage).css("background-image") !== "none"){
					imageIDFullPath = $("#templateBody"+selectedpage).css("background-image");
					imageIDFullPath = imageIDFullPath.replace('url(','').replace(')','').replace(/"/gi, "");
				}
			}
			if (imageIDFullPath.indexOf("?v=") > -1) {
				filename = imageIDFullPath.split("?")[0].split("/").pop();
				imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
			} else {
				filename = imageIDFullPath.split("/").pop();
				imagePath = imageIDFullPath.split("/images/").pop().replace(imageIDFullPath.split("/").pop(),"");
			}
			filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
			type="queControl";
		} else {
			type = "imgControl";
		}
		fromEditorA="self";
		$("#clickLoader").val(true);
		$("#clickLoader").trigger("click");
		launchPixieEditor();
		hidedsm();
	});
	$('.tpl-image-replace').unbind("click").click(function () {
		hidedsm();
		if(from === "queControl") {
			if($("#templateBody"+selectedpage).find(".imageBlock").length > 0){
				if($("#templateBody"+selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none"){
					filemanager("templateBody"+selectedpage,"form","form");
				}
			} else {
				if($("#templateBody"+selectedpage).css("background-image") !== "none"){
					filemanager("templateBody" + selectedpage, "form6", "form6");
				}
			}
		} else {
			filemanager(imageID,"imagecontrol","imagecontrol");
		}
	});
}
function pageHeaderSetting(){
	pageHeaderSettingCommon(droparraysetting,blocksettingheader);
	$("#headerdimg img:not(.mcnImage)").unbind("click").click(function(e){
		e.stopPropagation();
		hidedsm();
		if($('#pageheader').find('div.row').find("#headerdimg").hasClass("headerdimg")) {
			filemanager("preview_McBlock_header", "header2", "header2");
		} else {
			filemanager("preview_McBlock_header","header","header");
			setTimeout(function(){
				clickSelectItemCallAssessment("preview_McBlock_header","header","header");
			},1000);
		}
	});
}
/* Page Control */

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
		onLoad: function () {},
		onSave: function(data, name) {
			let requestData = {
				"imageName": filename,
				"imageData": data,
				"imagePath": imagePath
			};
			editImage(requestData).then(res => {
				if (res.status === 200 && res.result.imagePath) {
					if(fromEditorA === "self") {
						let turl = res.result.imagePath + `?v=${Math.floor(Math.random()*100001)}`;
						setTimeout(function() {
							if (type === "tblControl") {
								let str_array = imageID.split('_');
								let tid = str_array[2];
								let img = document.getElementById(imageID);
								img.src = turl;
								let edtimg = $('.mojoImageItem.dojoDndItem[data-image-index="'+tid+'"]');
								edtimg.find('.mojoImageItemIcon').removeAttr("src").attr("src",turl);
							} else if (type === "header") {
								$('#pageheader').find('div.row').find("#headerdimg img.mcnImage").removeAttr("src").attr("src", turl);
							} else if (type === "queControl") {
								if ($("#templateBody" + selectedpage).find(".imageBlock").length > 0) {
									if ($("#templateBody" + selectedpage).find(".imageBlock .mojoImageUploader div").css("background-image") !== "none") {
										$("#templateBody" + selectedpage).find('.imageBlock .mojoImageUploader div').css({'background-image': 'url("' + turl + '")', 'background-size': 'cover', 'background-position': 'center center'});
									}
								} else {
									if ($("#templateBody" + selectedpage).css("background-image") !== "none") {
										$("#templateBody" + selectedpage).css({'background-image': 'url("' + turl + '")', 'background-size': 'cover', 'background-position': 'center center'});
									}
								}
							} else if (type === "imgControl") {
								let id = imageID.split("_");
								let bid = id.slice(0,-1).join("_");
								$("#"+bid).find('[item-value="'+id[3]+'"]').find('div.mojoImageUploader div').find('img.mcnImage').removeAttr("src").attr("src", turl);
							}
						pixie4.close();
						},1000);
					} else {
						$('.treeview ul li:first-of-type').trigger("click");
						pixie4.close();
					}
				} else {
					pixie4.close();
					$("#clickError").attr("data-type","Error");
					$("#clickError").val("Sorry your image is not save please try again.");
					$("#clickError").trigger("click");
				}
			});
		},
		onClose: function() {
			delete window.Pixie;
			document.body.removeChild(script);
		}
	};
	pixie4 = null;
	let interval = setInterval(() => {
		if(typeof window.Pixie !== "undefined"){
			clearInterval(interval);
			interval = null;
			$("#clickLoader").val(false);
			$("#clickLoader").trigger("click");
		}
		pixie4 = new window.Pixie({...config});
		pixie4.setConfig({image: imageIDFullPath})
	}, 1000);
}
/* Image Editor */