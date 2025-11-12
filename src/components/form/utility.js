import $ from "jquery";
import { validateCaptcha } from "../../assets/commonFunctions";
import {siteURL} from "../../config/api";

export function generateJSON(){
    const getWidth = ()=> ( `calc(100% - ${parseInt($('#preview-template')?.find('#stgHid')?.css("margin-left")?.split("px")[0]) + parseInt($('#preview-template')?.find('#stgHid')?.css("margin-right")?.split("px")[0])}px)`)
    let pageSettings = {
        backgroundColor:$('#preview-template').find('#cntr').css("background-color"),
        backgroundImage:$('#preview-template').find('#cntr').css("background-image"),
        backgroundSize:$('#preview-template').find('#cntr').css("background-size"),
        backgroundPosition:$('#preview-template').find('#cntr').css("background-position"),
        backgroundBlendMode:$('#preview-template').find('#cntr').css("background-blend-mode"),
        backgroundRepeat:$('#preview-template').find('#cntr').css("background-repeat"),
        borderWidth:$('#preview-template').find('#cntr').css("border-width"),
        borderColor:$('#preview-template').find('#cntr').css("border-color"),
        borderStyle:$('#preview-template').find('#cntr').css("border-style"),
        padding:$('#preview-template').find('#stgHid').css("padding"),
        margin:$('#preview-template').find('#stgHid').css("margin"),
        fontFamily:$('#preview-template').find('#cntr').css("font-family"),
        fontSize:$('#preview-template').find('#stgHid').css("font-size"),
        lineHeight:$('#preview-template').find('#stgHid').css("line-height"),
        fontWeight:$('#preview-template').find('#stgHid').css("font-weight"),
        fontStyle:$('#preview-template').find('#stgHid').css("font-style"),
        textDecoration:$('#preview-template').find('#stgHid').css("text-decoration"),
        color:$('#preview-template').find('#stgHid').css("color"),
        width: getWidth(),
    };
    let customFormPages = [];
    let pageTemp = [];
    $('.pagethumb').each(function(){
        if($(this).find("span").html().charAt(0) !== "C"){
            pageTemp = [
                ...pageTemp, 
                {pageType: "Question Page", pageNumber: parseInt($(this).find("span").html()), pageId:0}
            ];
        }
        else{
            pageTemp = [
                ...pageTemp, 
                {pageType: "Landing Page", pageNumber: parseInt($(this).find("span").html().replaceAll("C","")), pageId:0}
            ];
        }
    });
    let queNumber = 1;
    pageTemp.forEach(function(e){
        let pageTrans = $('#preview-template').contents().find("#templateBody"+e.pageNumber).attr("item-transition");
        let questionStyle = $('#preview-template').contents().find("#templateBody"+e.pageNumber).attr("question-style");
        if(e.pageType === "Question Page") {
            let questionsList = [];
            let questionDisplayOrder = 0;
            let radioTypes = ["gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
            let label = "";
            $('#preview-template').contents().find("#templateBody" + e.pageNumber).find('.mojoMcBlock.frm-block').unbind("each").each(function () {
                let question = "";
                if ($(this).attr("rolefor") === "open_ended" || $(this).attr("rolefor") === "age") {
                    question = {
                        longAnswer: $(this).find(".blockanswer").hasClass("longanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false
                    }
                } else if ($(this).attr("rolefor") === "single_answer" || $(this).attr("rolefor") === "single_answer_checkbox" || radioTypes.includes($(this).attr("rolefor"))) {
                    let i = 0;
                    let tanswer = [];
                    $(this).find(".blockanswer .blockoption span.singleAnswer").each(function () {
                        tanswer.push({optDisplayOrder: i, optValue: $(this).text() === ""?`option-${(i+1)}`:$(this).text(), optComment: $(this).parent("div").attr("addcomment")});
                        i++;
                    })
                    question = {
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        customFormOptions: tanswer
                    }
                } else if ($(this).attr("rolefor") === "single_answer_button") {
                    let i = 0;
                    let tanswer = [];
                    $(this).find(".blockanswer .blockoption div input[type=\"button\"]").each(function () {
                        tanswer.push({optDisplayOrder: i, optValue: $(this).val() === ""?`Option - ${i+1}`:$(this).val()});
                        i++;
                    })
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        customFormOptions: tanswer
                    }
                } else if ($(this).attr("rolefor") === "single_answer_combo") {
                    let i = 0;
                    let tanswer = [];
                    $(this).find(".blockanswer .blockoption select option").not(":first").each(function () {
                        tanswer.push({optDisplayOrder: i, optValue: $(this).text() === ""?`Option - ${i+1}`:$(this).text()});
                        i++;
                    })
                    question = {
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        customFormOptions: tanswer
                    }
                } else if ($(this).attr("rolefor") === "date_control") {
                    let start = null;
                    let end = null;
                    if ($(this).find(".blockanswer").hasClass("range")) {
                        start = $(this).find('span.startDate').html();
                        end = $(this).find('span.endDate').html();
                    }
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        startDate: start,
                        endDate: end,
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false
                    }
                } else if ($(this).attr("rolefor") === "time_control") {
                    let start = null;
                    let end = null;
                    if ($(this).find(".blockanswer").hasClass("range")) {
                        start = $(this).find('span.startTime').html();
                        end = $(this).find('span.endTime').html();
                    }
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        startTime: start,
                        endTime: end,
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false
                    }
                } else if ($(this).attr("rolefor") === "rating_box") {
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        aText: $(this).find("span.rating-text-a").text(),
                        bText: $(this).find("span.rating-text-b").text(),
                    }
                } else if ($(this).attr("rolefor") === "rating_symbol") {
                    question = {
                        customFormOptions: [{optDisplayOrder:0, optValue:$(this).find(".top-control #level").val()}],
                        symbol:$(this).find(".top-control #symbol").val().replaceAll("far ", "").replaceAll("p-2", "py-2 pr-2"),
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                    }
                } else if ($(this).attr("rolefor") === "rating_radio") {
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                    }
                } else if ($(this).attr("rolefor") === "yes_no") {
                    question = {
                        label: $(this).find(".top-control #labels").val(),
                        symbol: $(this).find(".top-control #yesNoSymbols").val(),
                        label1:$(this).find(".label-1").text(),
                        label2:$(this).find(".label-2").text(),
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        customFormOptions: [
                            {
                                optDisplayOrder: 0, 
                                optValue: $(this).find(".label-1").text(), 
                                optDescription: $(this).find(".top-control #yesNoSymbols").val().split("/")[0].replaceAll("far fa-", "")
                            },
                            {
                                optDisplayOrder: 1, 
                                optValue: $(this).find(".label-2").text(), 
                                optDescription: $(this).find(".top-control #yesNoSymbols").val().split("/")[1].replaceAll("far fa-", "")
                            },
                        ]
                    }
                } else if ($(this).attr("rolefor") === "matrix"){
                    let columns = [];
                    let rows = [];
                    let i = 0;
                    let j = 0;
                    $(this).find(".blockanswer table tr th span.answerTableSpan").each(function(){
                        columns.push({optDisplayOrder:i++, optValue: $(this).text()});
                    });
                    $(this).find(".blockanswer table tr td span.answerTableSpan").each(function(){
                        rows.push({optDisplayOrder:j++, optValue: $(this).text()});
                    });
                    question = {
                        answerType: $(this).find("#answerType").val(),
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        comments: $(this).find(".blockanswer").hasClass("comments") ? true : false,
                        commentsText: $(this).find(".matrixCommentTextArea").text(),
                        rows: rows,
                        columns: columns
                    }
                } else if ($(this).attr("rolefor") === "email" || $(this).attr("rolefor") === "phone"){
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false,
                        description: $(this).find(".blockanswer").find("div.w-95-p span.terms").text()
                    }
                } else if ($(this).attr("rolefor") === "rank"){
                    let rankList = [];
                    let i = 0;
                    $(this).find("div.d-flex.w-95-p.mt-2 div.rankTxt").each(function(){
                        rankList.push({optDisplayOrder:i++, optValue:$(this).text()===""?`Rank-${i}`:$(this).text()});
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        customFormOptions: rankList
                    }
                } else if ($(this).attr("rolefor") === "image_form"){
                    let imageList = [];
                    let i = 0;
                    $(this).find("div.mojoImageUploader div img.w-100").each(function(){
                        imageList.push({optDisplayOrder: i++,optValue:$(this).attr("src")});
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        customFormOptions: imageList
                    }
                } else if ($(this).attr("rolefor") === "image_with_text_form"){
                    let imageList = [];
                    let labelList = [];
                    let i = 0;

                    $(this).find("div.mojoImageUploader div img.w-100").each(function(){
                        imageList.push({optDisplayOrder: i++,optValue:$(this).attr("src")});
                    });
                    $(this).find("div span.textArea").each(function(){
                        labelList.push($(this).text());
                    });
                    labelList.forEach((v, i)=>{
                        imageList[i] = {...imageList[i], optDescription: v};
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        customFormOptions: imageList,
                    }
                } else if ($(this).attr("rolefor") === "contact_form"){
                    let labelList = [];
                    let customFormOptions = [];
                    let i = 0;
                    $(this).find(`.blockanswer input[type="text"]`).each(function(){
                        labelList.push({
                            name: $(this).attr("placeholder"),
                            icon: $(this).parent().find('label.far').attr("class").replace(" editor-icon-p", "").replace(" editor-icon", ""),
                            requireStatus: (typeof $(this).parent().siblings(`input[type="checkbox"]`).prop("checked") !== "undefined")? $(this).parent().siblings(`input[type="checkbox"]`).prop("checked"):null
                    });
                        customFormOptions.push({optDisplayOrder: i++, optValue: $(this).attr("placeholder")});
                        });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        vertically: $(this).find(".blockanswer").hasClass("vertically") ? true : false,
                        icons: $(this).find(".blockanswer").hasClass("showicon") ? true : false,
                        labelList: labelList,
                        customFormOptions: customFormOptions
                    }
                } else if ($(this).attr("rolefor") === "consent_agreement" || $(this).attr("rolefor") === "sms_consent_agreement"){
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        terms: $(this).find(".blockanswer").find("div.w-95-p span.terms").text(),
                        agreement: $(this).find(".blockanswer").find("div.w-95-p span.agreement").text()     
                    }
                } else if ($(this).attr("rolefor") === "constant_sum"){ 
                    let labelList = [];
                    let i = 0;
                    let tableClass = $(this).find("#inputType").val()+"Table";
                    $(this).find("."+tableClass).find("span.sumQuestion").each(function(){
                        labelList.push($(this).text()===""?`Question - ${i+1}`:$(this).text());
                        i++;
                    });
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        type: $(this).find("#inputType").val(),
                        showTotal: $(this).find(".blockanswer").hasClass("total") ? true : false,
                        description: $(this).find("span.descriptionText").text(),
                        labelList: labelList,
                        mustTotalTo: $(this).find("input.mTotal").val(),
                        lowerRange: $(this).find("input.lower").val(),
                        upperRange: $(this).find("input.upper").val(),
                        decimals: $(this).find("input.decimals").val(),
                        segments: $(this).find("input.segments").val()
                    }
                } else if ($(this).attr("rolefor") === "label"){
                    label = $(this).find(".ckeditableLabel").html();
                    return true;
                } else if ($(this).attr("rolefor") === "captcha"){
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false
                    }
                }
                let tempQueQuestion = "";
                if($(this).attr("rolefor") === "consent_agreement" || $(this).attr("rolefor") === "sms_consent_agreement"){
                    tempQueQuestion = "Consent Agreement";
                } else if($(this).attr("rolefor") === "captcha"){
                    tempQueQuestion = "Captcha";
                } else if($(this).find(".blockquestion input[type=\"text\"]").val() === ""){
                    tempQueQuestion = `Question-${questionDisplayOrder} Page-${e.pageNumber}`;
                } else if($(this).find(".blockquestion input[type=\"text\"]").val() !== ""){
                    tempQueQuestion = $(this).find(".blockquestion input[type=\"text\"]").val();
                }
                question = {
                    ...question, 
                    queId: 0, 
                    queDisplayOrder: questionDisplayOrder++,
                    queNumber:queNumber++,
                    queType: $(this).attr("rolefor"),
                    queQuestion: tempQueQuestion,
                    queTransition: $(this).attr("question-transition"),
                    label:label
                }
                label="";
                questionsList.push(question);
            });
            let imageBlockPageLayoutSetting={};
            if($('#preview-template').contents().find("#templateBody" + e.pageNumber).find('.imageBlock').length === 0){
                if($('#preview-template').contents().find("#templateBody" + e.pageNumber).css("background-image") === "none"){
                    imageBlockPageLayoutSetting={
                        layoutType:"imageBlockPageLayout1",
                        layoutImage:"",
                    }
                } else {
                    imageBlockPageLayoutSetting={
                        layoutType:"imageBlockPageLayout6",
                        layoutImage:$('#preview-template').contents().find("#templateBody" + e.pageNumber).css("background-image"),
                    }
                }
            } else {
                imageBlockPageLayoutSetting={
                    layoutType:$('#preview-template').contents().find("#templateBody" + e.pageNumber).find('.imageBlock').attr("class").split(" ")[1],
                    layoutImage:$('#preview-template').contents().find("#templateBody" + e.pageNumber + " .imageBlock .mojoImageUploader div").css("background-image"),
                }
            }
            customFormPages = [...customFormPages, {...e, pageTransition: pageTrans, questionStyle: questionStyle, "customFormQuestions": questionsList, imageBlockPageLayoutSetting: imageBlockPageLayoutSetting}];
        } else if(e.pageType === "Landing Page"){
            let blockList = $('#preview-template').contents().find("#templateBody" + e.pageNumber).find('.landingBlock').html().replaceAll('contenteditable="true"','').replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle"','');
            customFormPages = [...customFormPages, {...e, pageTransition: pageTrans, "blockList": blockList}];
        }
    });
    let header = "";
    let headerSettings = {};
    let c = "";
    if(typeof $("#pageheader").find("div.row").find("#headerdimg").html() !== "undefined" && $("#pageheader").find("div.row").find("#headerdimg").html() !== `<img src="${siteURL}/img/browse_image_text.png">`){
        c += $("#pageheader").find("div.row").find("#headerdimg").prop('outerHTML');
    }
    if(typeof $("#pageheader").find("div.row").find("#headerdtitle").html() !== "undefined" && $("#pageheader").find("div.row").find("#headerdtitle").html() !== "Enter Title Here"){
        c += $("#pageheader").find("div.row").find("#headerdtitle").prop('outerHTML');
    }
    if(typeof $("#pageheader").find("div.row").find("#headerddesc").html() !== "undefined" && $("#pageheader").find("div.row").find("#headerddesc").html() !== "Enter Tagline Here"){
        c += $("#pageheader").find("div.row").find("#headerddesc").prop('outerHTML');
    }
    if(c !== ""){
        header = `<div class="${$("#pageheader").find("div.row").attr("class")}">${c}</div>`;
        header = header.replaceAll('contenteditable="true"','');
        headerSettings={
            backgroundColor:$("#pageheader").find("div.row").css("background-color"),
            backgroundClip:$("#pageheader").find("div.row").css("background-clip"),
            border:$("#pageheader").find("div.row").css("border"),
            padding:$("#pageheader").find("div.row").css("padding")
        }
    }
    let footer = $("#pagefooter").find("div.row");
    let footerSettings = {};
    if(footer.length > 0){
        footer=footer[0].outerHTML.replaceAll('contenteditable="true"','');
        footer=footer.replaceAll($("#pagefooter").find("div.row").attr("style"),'');
        footer=footer.replaceAll(">Enter Footer Content Here<", "><");
        footerSettings={
            backgroundColor:$("#pagefooter").find("div.row").css("background-color"),
            backgroundClip:$("#pagefooter").find("div.row").css("background-clip"),
            border:$("#pagefooter").find("div.row").css("border"),
            padding:$("#pagefooter").find("div.row").css("padding")
        }
    } else {
        footer="";
    }
    return {
        "settings":{
            "pageSettings":pageSettings,
            "headerSettings":headerSettings,
            "footerSettings":footerSettings,
            "footerButtonSettings": typeof $("#pagefooter").attr("item-button-align") === "undefined" ? "text-right" : $("#pagefooter").attr("item-button-align")
        },
        "customFormPages":customFormPages,
        "pageCounter":$("#addpagethumb").html(),
        "header":header,
        "footer":footer,
        "thankYou":$('#preview-template')?.contents()?.find("#templateBodyEND")?.find('.landingBlock')?.html()?.replaceAll('contenteditable="true"','')?.replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle"','')?.replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle active"','') || "",
        "formType": $('#preview-template').attr("form-type")
    };
}
export function checkRequire(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    let singleValueControl = ["open_ended", "single_answer_button", "date_control", "time_control", "rating_box", "rating_symbol", "rating_radio", "yes_no", "email", "phone", "consent_agreement", "sms_consent_agreement", "age"];
    let singleMultipleValueControl = ["single_answer", "image_form", "image_with_text_form", "single_answer_checkbox", "single_answer_combo", "rank", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") && dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].required){
                if(singleValueControl.includes(qArray[i].queType) && (qArray[i].value === "" || !qArray[i].hasOwnProperty('value'))){
                    questionNumber = qArray[i].queQuestion;
                    break;
                } else if(singleMultipleValueControl.includes(qArray[i].queType)) {
                    if((qArray[i].multipleAnswer && (!qArray[i].hasOwnProperty('value') || qArray[i].value.length === 0)) || (!qArray[i].multipleAnswer && (!qArray[i].hasOwnProperty('value') || qArray[i].value === ""))){
                        questionNumber = qArray[i].queQuestion;
                        break;
                    }
                } else if(qArray[i].queType === "rank"){
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].queQuestion;
                        break;
                    }
                } else if(qArray[i].queType === "constant_sum"){
                    let f = false;
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].queQuestion;
                        break;
                    }
                    for(let j = 0; j < qArray[i].labelList.length; j++){
                        if(qArray[i].value.questions[qArray[i].labelList[j]] === ""){
                            f = true;
                            questionNumber = qArray[i].queQuestion;
                            break;
                        }
                    }
                    if(f){
                        break;
                    }
                } else if(qArray[i].queType === "matrix"){
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].queQuestion;
                        break;
                    } else {
                        let rows = qArray[i].rows.map((v, i)=>{
                            return v.optValue;
                        });
                        if(rows.length !== Object.keys(qArray[i].value).length) {
                            questionNumber = qArray[i].queQuestion;
                            break;
                        } else {
                            let f = false;
                            for(let j=0; j<rows.length; j++){
                                if(qArray[i].value[rows[j]].length === 0){
                                    questionNumber = qArray[i].queQuestion;
                                    f = true;
                                    break;    
                                }
                            }
                            if(f){
                                break;
                            }
                        }
                    }
                } else if(qArray[i].queType === "contact_form"){
                    let f = false;
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].queQuestion;
                        break;
                    } else {
                        for(let j = 0; j < qArray[i].labelList.length; j++){
                            if(qArray[i].labelList[j].requireStatus && qArray[i].value[qArray[i].labelList[j].name] === ""){
                                f = true;
                                questionNumber = qArray[i].queQuestion;
                                break;
                            }
                        }
                        if(f){
                            break;
                        }
                    } 
                } else if(qArray[i].queType === "captcha" && (qArray[i].value === "" || !qArray[i].hasOwnProperty('value'))){
                    questionNumber = "Captcha";
                    break;
                }
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.required){
            if(singleValueControl.includes(element.queType) && (element.value === "" || !element.hasOwnProperty('value'))){
                questionNumber = element.queQuestion;
            } else if(singleMultipleValueControl.includes(element.queType)){
                if((element.multipleAnswer && (!element.hasOwnProperty('value') || element.value.length === 0)) || (!element.multipleAnswer && (!element.hasOwnProperty('value') || element.value === ""))){
                    questionNumber = element.queQuestion;
                }
            } else if(element.queType === "rank"){
                if(element.hasOwnProperty('value'))
                    questionNumber = element.queQuestion;
            } else if(element.queType === "constant_sum"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.queQuestion;
                }
                for(let j = 0; j < element.labelList.length; j++){
                    if(element.labelList[j].requireStatus && element.value[element.labelList[j]] === ""){
                        questionNumber = element.queQuestion;
                        break;
                    }
                }
            } else if(element.queType === "matrix"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.queQuestion;
                } else {
                    let rows = element.rows.map((v, i)=>{
                        return v.optValue;
                    });
                    if(rows.length !== Object.keys(element.value).length) {
                        questionNumber = element.queQuestion;
                    } else {
                        for(let j=0; j<rows.length; j++){
                            if(element.value[rows[j]].length === 0){
                                questionNumber = element.queQuestion;
                                break;    
                            }
                        }
                    }
                }
            } else if(element.queType === "contact_form"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.queQuestion;
                } else {
                    for(let j = 0; j < element.labelList.length; j++){
                        if(element.labelList[j].requireStatus && element.value[element.labelList[j].name] === ""){
                            questionNumber = element.queQuestion;
                            break;
                        }
                    }
                }
            } else if(element.queType === "captcha" && (element.value === "" || !element.hasOwnProperty('value'))){
                questionNumber = "Captcha";
            } 
        }
    }
    return questionNumber;
}
export function checkDateRange(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    function parseTime(str){
        let ampm = str.split(" ")[1];
        let hours = parseInt(str.split(" ")[0].split(":")[0]);
        let minutes = str.split(" ")[0].split(":")[1];
        if(ampm === "AM" || ampm === "am"){
            if(hours === 12){
                hours = 0
            }
        } else {
            if(hours !== 12){
                hours += 12;
            }
        }
        return parseInt(""+hours+""+minutes);
    }
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].queType === "time_control"){
                if(!qArray[i].hasOwnProperty("value") && (qArray[i].startTime !== null || qArray[i].endTime !== null)){
                    questionNumber = [qArray[i].queQuestion, qArray[i].queType, qArray[i].startTime, qArray[i].endTime];
                    break;
                }
                if(((qArray[i].startTime !== null || qArray[i].endTime !== null) && (parseTime(qArray[i].value) < parseTime(qArray[i].startTime) || parseTime(qArray[i].value) > parseTime(qArray[i].endTime)))){
                    questionNumber = [qArray[i].queQuestion, qArray[i].queType, qArray[i].startTime, qArray[i].endTime];
                    break;
                }
            } else if(qArray[i].queType === "date_control"){
                if(!qArray[i].hasOwnProperty("value") ||  ((qArray[i].startDate !== null || qArray[i].endDate !== null) && (new Date(qArray[i].value) < new Date(qArray[i].startDate) || new Date(qArray[i].value) > new Date(qArray[i].endDate)))){
                    questionNumber = [qArray[i].queQuestion, qArray[i].queType, qArray[i].startDate, qArray[i].endDate];
                    break;
                }
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.queType === "time_control"){
            if(!element.hasOwnProperty("value") && (element.startTime !== null || element.endTime !== null)){
                questionNumber = [element.queQuestion, element.queType, element.startTime, element.endTime];
            }
            
            if(((element.startTime !== null || element.endTime !== null) && (parseTime(element.value) < parseTime(element.startTime) || parseTime(element.value) > parseTime(element.endTime)))){
                questionNumber = [element.queQuestion, element.queType, element.startTime, element.endTime];
            }
            
        } else if(element.queType === "date_control"){
            if(!element.hasOwnProperty("value") ||  ((element.startDate !== null || element.endDate !== null) && (new Date(element.value) < new Date(element.startDate) || new Date(element.value) > new Date(element.endDate)))){
                questionNumber = [element.queQuestion, element.queType, element.startDate, element.endDate];
            }
        }
    }
    return questionNumber;
}
export function checkMustTotalTo(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].queType === "constant_sum"){
                if((parseInt(qArray[i]?.mustTotalTo) > 0) && (parseInt(qArray[i]?.mustTotalTo) < parseInt(qArray[i]?.value?.total))){
                    questionNumber = [qArray[i]?.queQuestion, qArray[i]?.mustTotalTo];
                    break;
                }
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.queType === "constant_sum"){
            if(parseInt(element?.mustTotalTo) > 0 && parseInt(element?.mustTotalTo) < parseInt(element?.value?.total)){
                questionNumber = [element?.queQuestion, element?.mustTotalTo];
            }
        }
    }
    return questionNumber;
}
export  function checkPhone(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = {id:"", phoneNumber: "", questionNumber: ""};
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].hasOwnProperty("value") && qArray[i].queType === "phone"){
                questionNumber = {id: qArray[i].value.countryId, phoneNumber: qArray[i].value.PhoneNo, questionNumber: qArray[i].queQuestion};
                break;
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.hasOwnProperty("value") && element.queType === "phone") {
            questionNumber = {id: element.value.countryId, phoneNumber: element.value.PhoneNo, questionNumber: element.queQuestion};
        }
    }
    return questionNumber;
}
export function checkEmail(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].hasOwnProperty("value") && qArray[i].queType === "email" && !validateEmail(qArray[i].value) && qArray[i].value !== ""){
                questionNumber = qArray[i].queQuestion;
                break;
            } else if(qArray[i].hasOwnProperty("value") && qArray[i].queType === "contact_form" && qArray[i].labelList.map((v)=>(v.name)).includes("Email") && !validateEmail(qArray[i].value.Email) && qArray[i].value.Email !== ""){
                questionNumber = qArray[i].queQuestion;
                break;
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")) {
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.hasOwnProperty("value") && element.queType === "email" && !validateEmail(element.value) && element.value !== ""){
            questionNumber = element.queQuestion;
        } else if(element.hasOwnProperty("value") && element.queType === "contact_form" && element.labelList.map((v)=>(v.name)).includes("Email") && !validateEmail(element.value.Email) && element.value.Email !== ""){
            questionNumber = element.queQuestion;
        }
    }
    return questionNumber;
}
export function checkCaptcha(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.customFormPages[currentPageIndex].customFormQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].hasOwnProperty("value") && qArray[i].queType === "captcha" && !validateCaptcha(qArray[i].value) && qArray[i].value !== ""){
                questionNumber = "Captcha";
                break;
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")) {
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        if(element.hasOwnProperty("value") && element.queType === "captcha" && !validateCaptcha(element.value) && element.value !== ""){
            questionNumber = "Captcha";
        }
    }
    return questionNumber;
}
export function setAnswersToJson(dataListJson, ansJson){
    let temp = null;
    if(ansJson.hasOwnProperty("customFormAnswers")){
        temp = ansJson.customFormAnswers; 
    } else {
        temp = ansJson;
    }
    temp.forEach(e1 => {
        dataListJson.customFormPages.forEach((e2, i)=>{
            if(e2.hasOwnProperty("pageId") && e2.pageId === e1.ansPageId){
                e2.customFormQuestions.forEach((e3, j)=>{
                    if(e3.hasOwnProperty("queId") && e3.queId === e1.ansQueId){
                        dataListJson.customFormPages[i].customFormQuestions[j].value = JSON.parse(e1.ansAnswers).value;
                        dataListJson.customFormPages[i].customFormQuestions[j].ansId = e1.ansId;
                        dataListJson.customFormPages[i].customFormQuestions[j].ansStId = e1.ansStId;
                    }
                })
            }
        })
    });
    dataListJson.stId = ansJson.stId;
    dataListJson.stIsComplete = ansJson.stIsComplete;
    return dataListJson;
}
export function generateSaveAnswerJson(cfId, dataListJson, currentPageIndex, currentQuestionIndex, stSessionId, hostData, isSubmit=false, transType, otherId, reset){
    let ansJson = {
        stId: dataListJson.hasOwnProperty("stId")?dataListJson.stId:0,
        stCfId: cfId,
        stIsComplete: isSubmit?1:0,
        stSessionId: stSessionId,
        stIpAddress: hostData.ip,
        stCity: hostData.address.city,
        stState: hostData.address.state,
        stCountry: hostData.address.country,
        customFormAnswers: [],
        tranType: transType,
        id: otherId
    };
    let temp = [];
    if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.customFormPages[currentPageIndex].questionStyle === "all") {
        for(let i=0; i < dataListJson.customFormPages[currentPageIndex].customFormQuestions.length; i++){
            let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[i];
            let baseTemp = {
                ansId: element.ansId || 0,
                ansStId: element.ansStId || 0,
                ansPageId: dataListJson.customFormPages[currentPageIndex].pageId,
                ansQueId: element.queId,
                resetQuestion: reset.reset
            };
            let isAdded = false;
            if (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0)) {
                if (element.squeType === "consent_agreement" && reset.reset === "Yes") {
                    temp.push({ ...baseTemp, ansAnswers: JSON.stringify({ value: false }) });
                    isAdded = true;
                }
            } else {
                if (element.squeType === "contact_form") {
                    temp.push({
                        ...baseTemp,
                        ansAnswers: JSON.stringify(
                            {
                                value: {
                                    "Name": element.value.Name || '',
                                    "Email": element.value.Email || '',
                                    "Phone": element.value.Phone || '',
                                    "Address": element.value.Address || '',
                                    "Address 2": element.value["Address 2"] || '',
                                    "City": element.value.City || '',
                                    "State": element.value.State || '',
                                    "Country": element.value.Country || '',
                                    "zip": element.value.zip || '',
                                    "Company": element.value.Company || '',
                                },
                            }
                        )
                    });
                    isAdded = true;
                }
                if (element.type === "range" && element.value?.total === 0 && reset.reset === "Yes") {
                    temp.push({ ansId: baseTemp.ansId, resetQuestion: baseTemp.resetQuestion });
                    isAdded = true;
                }
                if (element.type === "range" && element.value?.total === 0 && reset.reset === "No") {
                    temp.push({});
                    isAdded = true;
                }
                if (element.type === "phone" && !element.value?.PhoneNo && !element.value?.countryCode) {
                    temp.push({ ansId: baseTemp.ansId, ansQueId: baseTemp.ansQueId });
                    isAdded = true;
                } else {
                    temp.push({ ...baseTemp, ansAnswers: JSON.stringify({ value: element.value }) });
                    isAdded = true;
                }
            }
            if (element.hasOwnProperty("comment") && (element.value !== "" || (typeof element.value === 'object' && Object.keys(element.value).length > 0)) && isAdded ) {
                temp[temp.length - 1] = { ...temp[temp.length - 1], ansComments: JSON.stringify(element.comment) };
            }
            if (reset.reset === "Yes" && (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0)) && isAdded) {
                temp[temp.length - 1] = { ...temp[temp.length - 1], ansId: baseTemp.ansId, resetQuestion: baseTemp.resetQuestion };
            }
        }
    } else if(dataListJson.customFormPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.customFormPages[currentPageIndex].customFormQuestions[currentQuestionIndex];
        let baseTemp = {
            ansId: element.ansId || 0,
            ansStId: element.ansStId || 0,
            ansPageId: dataListJson.customFormPages[currentPageIndex].pageId,
            ansQueId: element.queId,
            resetQuestion: reset.reset
        };
        if (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0)) {
            if (element.squeType === "consent_agreement" && element.value === false && reset.reset === "Yes") {
                temp.push({ ...baseTemp, ansAnswers: JSON.stringify({ value: false }) });
            }
        } else {
            if (element.squeType === "contact_form") {
                temp.push({
                    ...baseTemp,
                    ansAnswers: JSON.stringify(
                        {
                            value: {
                                "Name": element.value.Name || '',
                                "Email": element.value.Email || '',
                                "Phone": element.value.Phone || '',
                                "Address": element.value.Address || '',
                                "Address 2": element.value["Address 2"] || '',
                                "City": element.value.City || '',
                                "State": element.value.State || '',
                                "Country": element.value.Country || '',
                                "zip": element.value.zip || '',
                                "Company": element.value.Company || '',
                            },
                        }
                    )
                });
                ansJson.customFormAnswers = temp;
                return ansJson;
            }
            if (element.type === "range" && element.value?.total === 0 && reset.reset === "Yes") {
                temp.push({ ansId: baseTemp.ansId, resetQuestion: baseTemp.resetQuestion });
                ansJson.customFormAnswers = temp;
                return ansJson;
            }
            if (element.type === "range" && element.value?.total === 0 && reset.reset === "No") {
                ansJson.customFormAnswers = [];
                return ansJson;
            }
            if (element.type === "phone" && !element.value?.PhoneNo && !element.value?.countryCode) {
                temp.push({ ansId: baseTemp.ansId, ansQueId: baseTemp.ansQueId });
            } else {
                temp.push({ ...baseTemp, ansAnswers: JSON.stringify({ value: element.value }) });
            }
        }
        if (element.hasOwnProperty("comment") && (element.value !== "" || (typeof element.value === 'object' && Object.keys(element.value).length > 0))) {
            temp[0] = { ...temp[0], ansComments: JSON.stringify(element.comment) };
        }
        if (reset.reset === "Yes" && (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0))) {
            temp[0] = { ...temp[0], ansId: baseTemp.ansId, resetQuestion: baseTemp.resetQuestion };
        }
    }
    ansJson.customFormAnswers = temp;
    return ansJson;
}
export function getIconClass(type){
    switch(type){
        case "open_ended":
            return "openEndedIcon";
        case "single_answer":
            return "singleAnswerIcon";
        case "single_answer_checkbox":
            return "singleAnswerCIcon";
        case "single_answer_button":
            return "singleAnswerBIcon";
        case "single_answer_combo":
            return "singleAnswerComboIcon";
        case "date_control":
            return "dateControlIcon";
        case "time_control":
            return "timeControlIcon";
        case "rating_box":
            return "ratingBox";
        case "rating_symbol":
            return "ratingSymbol";
        case "rating_radio":
            return "ratingRadio";
        case "yes_no":
            return "yesNo";
        case "matrix":
            return "matrixIcon";
        case "email":
            return "emailIcon";
        case "phone":
            return "phoneIcon";
        case "rank":
            return "rank";
        case "image_form":
            return "imageFIcon";
        case "image_with_text_form":
            return "imageWithTextFIcon";
        case "contact_form":
            return "contactFormIcon";
        case "consent_agreement":
        case "sms_consent_agreement":
            return "consentAgreement";
        case "constant_sum":
            return "constantSum";
        default:
            return "";
    }
}
export const getAnswersForReport = (queType, valueJson)=>{
    let singleValueControl = ["open_ended", "single_answer_button", "date_control", "time_control", "rating_box", "rating_symbol", "rating_radio", "yes_no", "email", ];
    let singleMultipleValueControl = ["single_answer", "single_answer_checkbox", "single_answer_combo", "rank"];
    let keyValueControl = ["contact_form", "matrix"];
    let imageValueControl = ["image_form", "image_with_text_form"];
    if(valueJson === null){
        return "";
    } else if(singleValueControl.includes(queType)){
        return valueJson.value+"<br>";
    } else if(imageValueControl.includes(queType) || singleMultipleValueControl.includes(queType)){
        if(typeof valueJson.value === "string"){
            return valueJson.value+"<br>";
        } else {
            return valueJson.value.join("<br>");
        }
    } else if(keyValueControl.includes(queType)){
        return Object.keys(valueJson.value).map((val)=>{
            return `${val} : ${typeof valueJson.value[val] === "string"?
                valueJson.value[val]:
                valueJson.value[val] instanceof Array?
                valueJson.value[val].join(", "):
                printJsonHelper(valueJson.value[val])}`
        }).join("<br>");
    } else if(queType === "constant_sum"){
        let x = "";
        x += Object.keys(valueJson.value.questions).map((val, index)=>{
            return `${val} : ${valueJson.value.questions[val]}`
        }).join("<br>");
        x += `<br>Total : ${valueJson.value.total}${valueJson.value.mustTotalTo > 0?`/${valueJson.value.mustTotalTo}`:""}`
        return x; 
    } else if(queType === "consent_agreement" || queType === "sms_consent_agreement"){
        if(valueJson.value)
            return "Agree<br>";
        else
            return "Disagree<br>";
    } else if(queType === "phone"){
        return ` ${valueJson.value.countryCode.trim()} ${valueJson.value.PhoneNo} `
    } else
        return ""
}
export const generateReportTable = (questions, records)=>{
    let table = `<table border="1">`;
    table += `  <thead>`;
    table += `      <tr>`;
    table += `          <th>No</th>`;
    questions.forEach((qValue)=>{
        table += `          <th>${qValue.question}</th>`
    });
    table += `          <th>IP</th>`;
    table += `          <th>Date</th>`;
    table += `          <th>City</th>`;
    table += `          <th>State</th>`;
    table += `          <th>Country</th>`;
    table += `          <th>Technology</th>`;
    table += `          <th>Source</th>`;
    table += `      </tr>`;
    table += `  </thead>`;
    table += `  <tbody>`;
    records.forEach((rValue)=>{
        table += `      <tr>`;
        table += `          <td valign="top">${rValue[0]}</td>`;
        rValue[1].forEach((aValue)=>{
            table += `          <td valign="top">${aValue}</td>`;
        });
        table += `          <td valign="top">${rValue[2]}</td>`;
        table += `          <td valign="top">${rValue[3]}</td>`
        table += `          <td valign="top">${rValue[4]}</td>`
        table += `          <td valign="top">${rValue[5]}</td>`
        table += `          <td valign="top">${rValue[6]}</td>`
        table += `          <td valign="top">${rValue[7]}</td>`
        table += `          <td valign="top">${rValue[8]}</td>`
        table += `      </tr>`;
    })
    table += `  </tbody>`;
    table += `</table>`;
    return table;
}
const printJsonHelper = (obj) => {
    let x = ``;
    Object.keys(obj).forEach((val)=>{
        x += ` ${val} :- ${obj[val]},`
    })
    return x.slice(0, -1);
}
export const isPageHasContent = (type)=> {
    let msg = "";
    if(type === "next"){
        msg = "Sorry you can not move next because you forgot to put the content in one or more pages";
    } else {
        msg = "Sorry your form is not shown preview because you forgot to put the content in one or more pages";
    }
    let pages = $('#preview-template').contents().find('.templateBody').length;
    for(let i = 1; i < pages; i++){
        if($('#templateBody'+i).find(".questionBlock").length > 0 && $('#templateBody'+i).find(".questionBlock .frm-block").length === 0){
            $("#clickError").attr("data-type","Error");
            $("#clickError").val(msg);
            $("#clickError").trigger("click");
            return false;
        } else if($('#templateBody'+i).find(".landingBlock").length > 0 && $('#templateBody'+i).find(".landingBlock .mojoMcBlock").length === 0){
            $("#clickError").attr("data-type","Error");
            $("#clickError").val(msg);
            $("#clickError").trigger("click");
            return false;
        }
    }
    if($('#templateBodyEND').find(".landingBlock .mojoMcBlock").length === 0){
        $("#clickError").attr("data-type","Error");
        $("#clickError").val(msg);
        $("#clickError").trigger("click");
        return false;
    }
    if(type === "next"){
        msg = "Content only blocks must be on a Content or Landing Page";
    } else {
        msg = "Sorry your form is not shown preview because Content only blocks must be on a Content or Landing Page";
    }
    for(let i = 1; i < pages; i++){
        if($('#templateBody'+i).find(".questionBlock .frm-block:last-of-type").attr("rolefor") === "label"){
            $("#clickError").attr("data-type","Error");
            $("#clickError").val(msg);
            $("#clickError").trigger("click");
            return false;
        }
    }
    return true;
}
export function extractQuestionsFromJson(dataListJson){
    let questionPageJson = dataListJson.customFormPages.filter((val)=>{
        return val.pageType === "Question Page"; 
    });
    let temp = [];
    questionPageJson.forEach((val1,index)=>{
        val1.customFormQuestions.forEach((val2)=>{
            temp = [...temp, {...val2, pageNumber: val1.pageNumber, index:index}];
        })
    });
    return temp;
}