import $ from "jquery";
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
    let assessmentsPages = [];
    let pageTemp = [];
    $('.pagethumb').each(function(){
        if($(this).find("span").html().charAt(0) !== "C"){
            pageTemp = [
                ...pageTemp, 
                {apgType: "Question Page", apgNumber: parseInt($(this).find("span").html()), apgId:0}
            ];
        }
        else{
            pageTemp = [
                ...pageTemp, 
                {apgType: "Landing Page", apgNumber: parseInt($(this).find("span").html().replaceAll("C","")), apgId:0}
            ];
        }
    });
    let queNumber = 1;
    pageTemp.forEach(function(e){
        let pageTrans = $('#preview-template').contents().find("#templateBody"+e.apgNumber).attr("item-transition");
        let questionStyle = $('#preview-template').contents().find("#templateBody"+e.apgNumber).attr("question-style");
        if(e.apgType === "Question Page") {
            let questionsList = [];
            let questionDisplayOrder = 0;
            let radioTypes = ["gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
            let label = "";
            $('#preview-template').contents().find("#templateBody" + e.apgNumber).find('.mojoMcBlock.frm-block').unbind("each").each(function () {
                let question = "";
                if ($(this).attr("rolefor") === "open_ended" || $(this).attr("rolefor") === "age") {
                    question = {
                        longAnswer: $(this).find(".blockanswer").hasClass("longanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false
                    }
                } else if ($(this).attr("rolefor") === "single_answer" || $(this).attr("rolefor") === "single_answer_checkbox" || radioTypes.includes($(this).attr("rolefor"))) {
                    let i = 0;
                    let th = $(this);
                    let tanswer = [];
                    $(this).find(".blockanswer .blockoption span.singleAnswer").each(function () {
                        let pts = th.find(".pointsbox").get(i).getAttribute("value");
                        tanswer.push({aoptDisplayOrder: i, aoptValue: $(this).text() === ""?`option-${(i+1)}`:$(this).text(), aoptComment: $(this).parent("div").attr("addcomment"), aoptUniqueId: $(this).parent("div").attr("unique-id"), aoptPoints: pts === null || pts === ""?0:pts});
                        i++;
                    });
                    question = {
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        assessmentsOptions: tanswer
                    }
                } else if ($(this).attr("rolefor") === "single_answer_button") {
                    let i = 0;
                    let tanswer = [];
                    let th = $(this);
                    $(this).find(".blockanswer .blockoption div input[type=\"button\"]").each(function () {
                        let pts = th.find(".pointsbox").get(i).getAttribute("value");
                        tanswer.push({aoptDisplayOrder: i, aoptValue: $(this).val() === ""?`Option - ${i+1}`:$(this).val(), aoptUniqueId: $(this).parent("div").attr("unique-id"), aoptPoints: pts === null || pts === ""?0:pts});
                        i++;
                    })
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        assessmentsOptions: tanswer
                    }
                } else if ($(this).attr("rolefor") === "single_answer_combo") {
                    let i = 0;
                    let tanswer = [];
                    $(this).find(".blockanswer .blockoption select option").not(":first").each(function () {
                        let pts = $(this).val();
                        tanswer.push({aoptDisplayOrder: i, aoptValue: $(this).text() === ""?`Option - ${i+1}`:$(this).text(), aoptUniqueId: $(this).parent("div").attr("unique-id"), aoptPoints: pts === null || pts === ""?0:pts});
                        i++;
                    })
                    question = {
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        assessmentsOptions: tanswer
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
                        formLinks: Array.from({ length: 10 }, (_, i) =>(i+1)).map((_, i)=>({formLink: ""})),
                        formNames: Array.from({ length: 10 }, (_, i) =>(i+1)).map((_, i)=>({formName: ""})),
                    }
                } else if ($(this).attr("rolefor") === "rating_symbol") {
                    question = {
                        assessmentsOptions: [{aoptDisplayOrder:0, aoptValue:$(this).find(".top-control #level").val()}],
                        symbol:$(this).find(".top-control #symbol").val().replaceAll("far ", "").replaceAll("p-2", "py-2 pr-2"),
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        formLinks: Array.from({ length: parseInt($(this).find(".top-control #level").val()) }, (_, i) =>("")).map((_, i)=>({formLink: ""})),
                        formNames: Array.from({ length: parseInt($(this).find(".top-control #level").val()) }, (_, i) =>("")).map((_, i)=>({formName: ""})),
                    }
                } else if ($(this).attr("rolefor") === "rating_radio") {
                    question = {
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        formLinks: Array.from({ length: 10 }, (_, i) =>(i+1)).map((_, i)=>({formLink: ""})),
                        formNames: Array.from({ length: 10 }, (_, i) =>(i+1)).map((_, i)=>({formName: ""})),
                    }
                } else if ($(this).attr("rolefor") === "yes_no") {
                    let th = $(this);
                    question = {
                        label: $(this).find(".top-control #labels").val(),
                        symbol: $(this).find(".top-control #yesNoSymbols").val(),
                        label1:$(this).find(".label-1").text(),
                        label2:$(this).find(".label-2").text(),
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        assessmentsOptions: [
                            {
                                aoptDisplayOrder: 0, 
                                aoptValue: $(this).find(".label-1").text(), 
                                aoptDescription: $(this).find(".top-control #yesNoSymbols").val().split("/")[0].replaceAll("far fa-", ""), 
                                aoptUniqueId: $(this).find(".label-1").parent("div").attr("unique-id"),
                                aoptPoints: th.find(".pointsbox").get(0).getAttribute("value") === null || th.find(".pointsbox").get(0).getAttribute("value") === ""?0:th.find(".pointsbox").get(0).getAttribute("value")
                            },
                            {
                                aoptDisplayOrder: 1, 
                                aoptValue: $(this).find(".label-2").text(), 
                                aoptDescription: $(this).find(".top-control #yesNoSymbols").val().split("/")[1].replaceAll("far fa-", ""), 
                                aoptUniqueId: $(this).find(".label-2").parent("div").attr("unique-id"),
                                aoptPoints: th.find(".pointsbox").get(1).getAttribute("value") === null || th.find(".pointsbox").get(1).getAttribute("value") === ""?0:th.find(".pointsbox").get(1).getAttribute("value")
                            },
                        ]
                    }
                } else if ($(this).attr("rolefor") === "matrix"){
                    let columns = [];
                    let rows = [];
                    let i = 0;
                    let j = 0;
                    $(this).find(".blockanswer table tr th span.answerTableSpan").each(function(){
                        columns.push({aoptDisplayOrder:i++, aoptValue: $(this).text()});
                    });
                    $(this).find(".blockanswer table tr td span.answerTableSpan").each(function(){
                        rows.push({aoptDisplayOrder:j++, aoptValue: $(this).text()});
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
                        labellessAnswer: $(this).find(".blockanswer").hasClass("labellessanswer") ? true : false
                    }
                } else if ($(this).attr("rolefor") === "rank"){
                    let rankList = [];
                    let i = 0;
                    $(this).find("div.d-flex.w-95-p.mt-2 div.rankTxt").each(function(){
                        rankList.push({aoptDisplayOrder:i++, aoptValue:$(this).text()===""?`Rank-${i}`:$(this).text()});
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        assessmentsOptions: rankList
                    }
                } else if ($(this).attr("rolefor") === "image_form"){
                    let imageList = [];
                    let i = 0;
                    let th = $(this);
                    $(this).find("div.mojoImageUploader div img.w-100").each(function(){
                        let pts = th.find(".pointsbox").get(i).getAttribute("value");
                        imageList.push({aoptDisplayOrder: i,aoptValue:$(this).attr("src"),aoptUniqueId: $(this).closest("div.mojoImageUploader").attr("unique-id"), aoptPoints: pts === null || pts === ""?0:pts});
                        i++;
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        assessmentsOptions: imageList
                    }
                } else if ($(this).attr("rolefor") === "image_with_text_form"){
                    let imageList = [];
                    let labelList = [];
                    let i = 0;
                    let th = $(this);
                    $(this).find("div.mojoImageUploader div img.w-100").each(function(){
                        let pts = th.find(".pointsbox").get(i).getAttribute("value");
                        imageList.push({aoptDisplayOrder: i,aoptValue:$(this).attr("src"),aoptUniqueId: $(this).closest("div.mojoImageUploader").attr("unique-id"), aoptPoints: pts === null || pts === ""?0:pts});
                        i++;
                    });
                    $(this).find("div span.textArea").each(function(){
                        labelList.push($(this).text());
                    });
                    labelList.forEach((v, i)=>{
                        imageList[i] = {...imageList[i], aoptDescription: v};
                    });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        multipleAnswer: $(this).find(".blockanswer").hasClass("multipleanswer") ? true : false,
                        assessmentsOptions: imageList,
                    }
                } else if ($(this).attr("rolefor") === "contact_form"){
                    let labelList = [];
                    let assessmentsOptions = [];
                    let i = 0;
                    $(this).find(`.blockanswer input[type="text"]`).each(function(){
                        labelList.push({
                            name: $(this).attr("placeholder"),
                            icon: $(this).parent().find('label.far').attr("class").replace(" editor-icon-p", "").replace(" editor-icon", ""),
                            requireStatus: (typeof $(this).parent().siblings(`input[type="checkbox"]`).prop("checked") !== "undefined")? $(this).parent().siblings(`input[type="checkbox"]`).prop("checked"):null
                    });
                        assessmentsOptions.push({aoptDisplayOrder: i++, aoptValue: $(this).attr("placeholder")});
                        });
                    question={
                        required: $(this).find(".blockanswer").hasClass("required") ? true : false,
                        vertically: $(this).find(".blockanswer").hasClass("vertically") ? true : false,
                        icons: $(this).find(".blockanswer").hasClass("showicon") ? true : false,
                        labelList: labelList,
                        assessmentsOptions: assessmentsOptions
                    }
                } else if ($(this).attr("rolefor") === "consent_agreement"){
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
                }
                let tempAqueQuestion = "";
                if($(this).attr("rolefor") === "consent_agreement"){
                    tempAqueQuestion = "Consent Agreement";
                } else if($(this).find(".blockquestion input[type=\"text\"]").val() === ""){
                    tempAqueQuestion = `Question-${questionDisplayOrder} Page-${e.apgNumber}`;
                } else if($(this).find(".blockquestion input[type=\"text\"]").val() !== ""){
                    tempAqueQuestion = $(this).find(".blockquestion input[type=\"text\"]").val();
                }
                question = {
                    ...question, 
                    aqueId: 0, 
                    aqueDisplayOrder: questionDisplayOrder++,
                    aqueNumber:queNumber++,
                    aqueType: $(this).attr("rolefor"),
                    aqueQuestion: tempAqueQuestion,
                    queTransition: $(this).attr("question-transition"),
                    uniqueId: $(this).attr("data-unique-id"),
                    next: [],
                    prev: [],
                    aqueCatId:$('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-id"),
                    aqueCatName:$('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category"),
                    aqueCatColor:$('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-color"),
					aqueCatDisplay:$('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-display"),
                    aqueCatStyle:$('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-style"),
                    label:label
                }
                label="";
                questionsList.push(question);
            });
            let imageBlockPageLayoutSetting={};
            if($('#preview-template').contents().find("#templateBody" + e.apgNumber).find('.imageBlock').length === 0){
                if($('#preview-template').contents().find("#templateBody" + e.apgNumber).css("background-image") === "none"){
                    imageBlockPageLayoutSetting={
                        layoutType:"imageBlockPageLayout1",
                        layoutImage:"",
                    }
                } else {
                    imageBlockPageLayoutSetting={
                        layoutType:"imageBlockPageLayout6",
                        layoutImage:$('#preview-template').contents().find("#templateBody" + e.apgNumber).css("background-image"),
                    }
                }
            } else {
                imageBlockPageLayoutSetting={
                    layoutType:$('#preview-template').contents().find("#templateBody" + e.apgNumber).find('.imageBlock').attr("class").split(" ")[1],
                    layoutImage:$('#preview-template').contents().find("#templateBody" + e.apgNumber + " .imageBlock .mojoImageUploader div").css("background-image"),
                }
            }
            let catId = $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-id");
            let catName = $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category");
            let catMaxPoints =  parseInt($('#preview-template').contents().find("#templateBody" + e.apgNumber).find(".catmaxpoints").html());
            let catColor =  $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-color");
			let catDisplay =  $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-display");
            let catStyle =  $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-category-style");
            let uniqueId =  $('#preview-template').contents().find("#templateBody" + e.apgNumber).attr("page-unique-id");
            assessmentsPages = [...assessmentsPages, {...e, apgTransition: pageTrans, questionStyle: questionStyle, "assessmentsQuestions": questionsList, imageBlockPageLayoutSetting: imageBlockPageLayoutSetting, catMaxPoints: catMaxPoints, aqueCatId: catId, aqueCatName: catName, aqueCatColor: catColor, aqueCatDisplay: catDisplay, aqueCatStyle: catStyle, uniqueId: uniqueId}];
        } else if(e.apgType === "Landing Page"){
            let blockList = $('#preview-template').contents().find("#templateBody" + e.apgNumber).find('.landingBlock').html().replaceAll('contenteditable="true"','').replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle"','');
            assessmentsPages = [...assessmentsPages, {...e, apgTransition: pageTrans, "blockList": blockList}];
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
    let radioTypes = ["single_answer", "single_answer_button", "single_answer_checkbox", "single_answer_combo", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race", "yes_no", "image_form", "image_with_text_form"];
    let ratingTypes = ["rating_symbol", "rating_radio", "rating_box"];
    
    let temp = pageTemp.filter((v)=>(v.apgType === "Question Page"));
    temp.forEach((page)=>{
        let currentPageIndex = page.apgNumber - 1;
        //For Next
        if(currentPageIndex === assessmentsPages.length - 1){
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === assessmentsPages[currentPageIndex].assessmentsQuestions.length - 1){
                    question.next = {default: null};
                    if(radioTypes.includes(question.aqueType)){
                        question.assessmentsOptions.forEach((option)=>{
                            question.next = {...question.next, [option.aoptValue]: null};
                        })
                    }
                    if(ratingTypes.includes(question.aqueType)){
                        let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                        Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                            question.next = {...question.next, [l+1]: null};
                        });
                    }
                } else {
                    question.next = {default: {pageIndex: currentPageIndex, questionIndex: j + 1}};
                    if(radioTypes.includes(question.aqueType)){
                        question.assessmentsOptions.forEach((option)=>{
                            question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex, questionIndex: j + 1, aoptUniqueId:option.aoptUniqueId}};
                        })
                    }
                    if(ratingTypes.includes(question.aqueType)){
                        let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                        Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                            question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex, questionIndex: j + 1}};

                        });
                    }
                }
                return question;
            });
        } else if(assessmentsPages[currentPageIndex + 1].apgType !== "Question Page") {
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === assessmentsPages[currentPageIndex].assessmentsQuestions.length - 1){
                    question.next = {default: {pageIndex: currentPageIndex + 1}};
                    if(radioTypes.includes(question.aqueType)){
                        question.assessmentsOptions.forEach((option)=>{
                            question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex + 1,aoptUniqueId:option.aoptUniqueId}};
                        })
                    }
                    if(ratingTypes.includes(question.aqueType)){
                        let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                        Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                            question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex + 1}};

                        });
                    }
                } else {
                    question.next = {default: {pageIndex: currentPageIndex, questionIndex: j + 1}};
                    if(radioTypes.includes(question.aqueType)){
                        question.assessmentsOptions.forEach((option)=>{
                            question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex, questionIndex: j + 1,aoptUniqueId:option.aoptUniqueId}};
                        })
                    }
                    if(ratingTypes.includes(question.aqueType)){
                        let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                        Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                            question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex, questionIndex: j + 1}};

                        });
                    }
                }
                return question;
            });
        } else {
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === assessmentsPages[currentPageIndex].assessmentsQuestions.length - 1){
                    if(assessmentsPages[currentPageIndex + 1].assessmentsQuestions.length > 0){
                        question.next = {default: {pageIndex: currentPageIndex + 1, questionIndex: 0}};
                        if(radioTypes.includes(question.aqueType)){
                            question.assessmentsOptions.forEach((option)=>{
                                question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex + 1, questionIndex: 0,aoptUniqueId:option.aoptUniqueId}};
                            })
                        }
                        if(ratingTypes.includes(question.aqueType)){
                            let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                            Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                                question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex + 1, questionIndex: 0}};
    
                            });
                        }
                    } else {
                        question.next = {default: {pageIndex: currentPageIndex + 1}};
                        if(radioTypes.includes(question.aqueType)){
                            question.assessmentsOptions.forEach((option)=>{
                                question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex + 1,aoptUniqueId:option.aoptUniqueId}};
                            })
                        }
                        if(ratingTypes.includes(question.aqueType)){
                            let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                            Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                                question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex + 1}};
    
                            });
                        }
                    }
                } else {
                    question.next = {default: {pageIndex: currentPageIndex, questionIndex: j + 1}};
                    if(radioTypes.includes(question.aqueType)){
                        question.assessmentsOptions.forEach((option)=>{
                            question.next = {...question.next, [option.aoptValue]: {pageIndex: currentPageIndex, questionIndex: j + 1,aoptUniqueId:option.aoptUniqueId}};
                        })
                    }
                    if(ratingTypes.includes(question.aqueType)){
                        let ratings = question.aqueType === "rating_symbol"?parseInt(question.assessmentsOptions[0].aoptValue):10;
                        Array.from({ length: ratings }, (_, k) =>(k+1)).forEach((_, l)=>{
                            question.next = {...question.next, [l+1]: {pageIndex: currentPageIndex, questionIndex: j + 1}};

                        });
                    }
                }
                return question;
            });
        }
        //For Previous
        if(currentPageIndex === 0){
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === 0) {
                    question.prev = null;
                } else {
                    question.prev = {pageIndex: currentPageIndex, questionIndex: j - 1};
                }
                return question;
            });
        } else if(assessmentsPages[currentPageIndex - 1].apgType !== "Question Page") {
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === 0) {
                    question.prev = {pageIndex: currentPageIndex - 1};
                } else {
                    question.prev = {pageIndex: currentPageIndex, questionIndex: j - 1};
                }
                return question;
            });
        } else {
            assessmentsPages[currentPageIndex].assessmentsQuestions = assessmentsPages[currentPageIndex].assessmentsQuestions.map((question, j)=>{
                if(j === 0){
                    if(assessmentsPages[currentPageIndex - 1].assessmentsQuestions.length > 0) {
                        question.prev = {pageIndex: currentPageIndex - 1, questionIndex: assessmentsPages[currentPageIndex - 1].assessmentsQuestions.length - 1};
                    } else {
                        question.prev = {pageIndex: currentPageIndex - 1};
                    }
                } else {
                    question.prev = {pageIndex: currentPageIndex, questionIndex: j - 1};
                }
                return question;
            });
        }
    });
    temp = pageTemp.filter((v)=>(v.apgType !== "Question Page"));
    temp.forEach((page)=>{
        let currentPageIndex = page.apgNumber - 1;
        //For Next
        if(currentPageIndex === assessmentsPages.length - 1) {
            assessmentsPages[currentPageIndex].next = null;
        } else if(assessmentsPages[currentPageIndex + 1].apgType !== "Question Page") {
            assessmentsPages[currentPageIndex].next = {pageIndex: currentPageIndex + 1}
        } else {
            if(assessmentsPages[currentPageIndex + 1].assessmentsQuestions.length > 0) { 
                assessmentsPages[currentPageIndex].next = {pageIndex: currentPageIndex + 1, questionIndex: 0}
            } else {
                assessmentsPages[currentPageIndex].next = {pageIndex: currentPageIndex + 1}
            }
        }
        //For Previous
        if(currentPageIndex === 0){
            assessmentsPages[currentPageIndex].prev = null;
        } else if(assessmentsPages[currentPageIndex - 1].apgType !== "Question Page"){
            assessmentsPages[currentPageIndex].prev = {pageIndex: currentPageIndex - 1}
        } else {
            if(assessmentsPages[currentPageIndex - 1].assessmentsQuestions.length > 0) { 
                assessmentsPages[currentPageIndex].prev = {pageIndex: currentPageIndex - 1, questionIndex: assessmentsPages[currentPageIndex - 1].assessmentsQuestions.length - 1}
            } else {
                assessmentsPages[currentPageIndex].prev = {pageIndex: currentPageIndex - 1}
            }
        }
    });
    return {
        "settings":{
            "pageSettings":pageSettings,
            "headerSettings":headerSettings,
            "footerSettings":footerSettings,
            "footerButtonSettings": typeof $("#pagefooter").attr("item-button-align") === "undefined" ? "text-right" : $("#pagefooter").attr("item-button-align")
        },
        "assessmentsPages":assessmentsPages,
        "pageCounter":$("#addpagethumb").html(),
        "header":header,
        "footer":footer,
        "thankYou":$('#preview-template')?.contents()?.find("#templateBodyEND")?.find('.landingBlock')?.html()?.replaceAll('contenteditable="true"','')?.replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle"','')?.replaceAll('class="mojoMcBlock tpl-block dojoDndItem focus ui-sortable-handle active"','') || ""
    };
}
export function checkRequire(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    let singleValueControl = ["open_ended", "single_answer_button", "date_control", "time_control", "rating_box", "rating_symbol", "rating_radio", "yes_no", "email", "phone", "consent_agreement", "age"];
    let singleMultipleValueControl = ["single_answer", "image_form", "image_with_text_form", "single_answer_checkbox", "single_answer_combo", "rank", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race"];
    if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.assessmentsPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].required){
                if(singleValueControl.includes(qArray[i].aqueType) && (qArray[i].value === "" || !qArray[i].hasOwnProperty('value'))){
                    questionNumber = qArray[i].aqueQuestion;
                    break;
                } else if(singleMultipleValueControl.includes(qArray[i].aqueType)) {
                    if((qArray[i].multipleAnswer && (!qArray[i].hasOwnProperty('value') || qArray[i].value.length === 0)) || (!qArray[i].multipleAnswer && (!qArray[i].hasOwnProperty('value') || qArray[i].value === ""))){
                        questionNumber = qArray[i].aqueQuestion;
                        break;
                    }
                } else if(qArray[i].aqueType === "rank"){
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].aqueQuestion;
                        break;
                    }
                } else if(qArray[i].aqueType === "constant_sum"){

                    let f = false;
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].aqueQuestion;
                        break;
                    }
                    for(let j = 0; j < qArray[i].labelList.length; j++){
                        if(qArray[i].value.questions[qArray[i].labelList[j]] === ""){
                            f = true;
                            questionNumber = qArray[i].aqueQuestion;
                            break;
                        }
                    }
                    if(f){
                        break;
                    }
                } else if(qArray[i].aqueType === "matrix"){
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].aqueQuestion;
                        break;
                    } else {
                        let rows = qArray[i].rows.map((v, i)=>{
                            return v.aoptValue;
                        });
                        if(rows.length !== Object.keys(qArray[i].value).length) {
                            questionNumber = qArray[i].aqueQuestion;
                            break;
                        } else {
                            let f = false;
                            for(let j=0; j<rows.length; j++){
                                if(qArray[i].value[rows[j]].length === 0){
                                    questionNumber = qArray[i].aqueQuestion;
                                    f = true;
                                    break;    
                                }
                            }
                            if(f){
                                break;
                            }
                        }
                    }
                } else if(qArray[i].aqueType === "contact_form"){
                    let f = false;
                    if(!qArray[i].hasOwnProperty('value')){
                        questionNumber = qArray[i].aqueQuestion;
                        break;
                    } else {
                        for(let j = 0; j < qArray[i].labelList.length; j++){
                            if(qArray[i].labelList[j].requireStatus && qArray[i].value[qArray[i].labelList[j].name] === ""){
                                f = true;
                                questionNumber = qArray[i].aqueQuestion;
                                break;
                            }
                        }
                        if(f){
                            break;
                        }
                    }
                } 
            } 
        }
    } else if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        if(element.required){
            if(singleValueControl.includes(element.aqueType) && (element.value === "" || !element.hasOwnProperty('value'))){
                questionNumber = element.aqueQuestion;
            } else if(singleMultipleValueControl.includes(element.aqueType)){
                if((element.multipleAnswer && (!element.hasOwnProperty('value') || element.value.length === 0)) || (!element.multipleAnswer && (!element.hasOwnProperty('value') || element.value === ""))){
                    questionNumber = element.aqueQuestion;
                }
            } else if(element.aqueType === "rank"){
                if(element.hasOwnProperty('value'))
                    questionNumber = element.aqueQuestion;
            } else if(element.aqueType === "constant_sum"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.aqueQuestion;
                }
                for(let j = 0; j < element.labelList.length; j++){
                    if(element.labelList[j].requireStatus && element.value[element.labelList[j]] === ""){
                        questionNumber = element.aqueQuestion;
                        break;
                    }
                }
            } else if(element.aqueType === "matrix"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.aqueQuestion;
                } else {
                    let rows = element.rows.map((v, i)=>{
                        return v.aoptValue;
                    });
                    if(rows.length !== Object.keys(element.value).length) {
                        questionNumber = element.aqueQuestion;
                    } else {
                        for(let j=0; j<rows.length; j++){
                            if(element.value[rows[j]].length === 0){
                                questionNumber = element.aqueQuestion;
                                break;    
                            }
                        }
                    }
                }
            } else if(element.aqueType === "contact_form"){
                if(!element.hasOwnProperty('value')){
                    questionNumber = element.aqueQuestion;
                }else{
                    for(let j = 0; j < element.labelList.length; j++){
                        if(element.labelList[j].requireStatus && element.value[element.labelList[j].name] === ""){
                            questionNumber = element.aqueQuestion;
                            break;
                        }
                    }
                }
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
    if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.assessmentsPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].aqueType === "time_control"){
                if(!qArray[i].hasOwnProperty("value") && (qArray[i].startTime !== null || qArray[i].endTime !== null)){
                    questionNumber = [qArray[i].aqueQuestion, qArray[i].aqueType, qArray[i].startTime, qArray[i].endTime];
                    break;
                }
                if(((qArray[i].startTime !== null || qArray[i].endTime !== null) && (parseTime(qArray[i].value) < parseTime(qArray[i].startTime) || parseTime(qArray[i].value) > parseTime(qArray[i].endTime)))){
                    questionNumber = [qArray[i].aqueQuestion, qArray[i].aqueType, qArray[i].startTime, qArray[i].endTime];
                    break;
                }
            } else if(qArray[i].aqueType === "date_control"){
                if(!qArray[i].hasOwnProperty("value") ||  ((qArray[i].startDate !== null || qArray[i].endDate !== null) && (new Date(qArray[i].value) < new Date(qArray[i].startDate) || new Date(qArray[i].value) > new Date(qArray[i].endDate)))){
                    questionNumber = [qArray[i].aqueQuestion, qArray[i].aqueType, qArray[i].startDate, qArray[i].endDate];
                    break;
                }
            }
        }
    } else if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        if(element.aqueType === "time_control"){
            if(!element.hasOwnProperty("value") && (element.startTime !== null || element.endTime !== null)){
                questionNumber = [element.aqueQuestion, element.aqueType, element.startTime, element.endTime];
            }
            
            if(((element.startTime !== null || element.endTime !== null) && (parseTime(element.value) < parseTime(element.startTime) || parseTime(element.value) > parseTime(element.endTime)))){
                questionNumber = [element.aqueQuestion, element.aqueType, element.startTime, element.endTime];
            }
            
        } else if(element.aqueType === "date_control"){
            if(!element.hasOwnProperty("value") ||  ((element.startDate !== null || element.endDate !== null) && (new Date(element.value) < new Date(element.startDate) || new Date(element.value) > new Date(element.endDate)))){
                questionNumber = [element.aqueQuestion, element.aqueType, element.startDate, element.endDate];
            }
        }
    }
    return questionNumber;
}
export function checkMustTotalTo(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = "";
    if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.assessmentsPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].aqueType === "constant_sum"){
                if(parseInt(qArray[i].mustTotalTo) > 0 && parseInt(qArray[i].mustTotalTo) < parseInt(qArray[i].value.total)){
                    questionNumber = [qArray[i].aqueQuestion, qArray[i].mustTotalTo];
                    break;
                }
            }
        }
    } else if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        if(element.aqueType === "constant_sum"){
            if(parseInt(element.mustTotalTo) > 0 && parseInt(element.mustTotalTo) < parseInt(element.value.total)){
                questionNumber = [element.aqueQuestion, element.mustTotalTo];
            }
        }
    }
    return questionNumber;
}
export  function checkPhone(dataListJson, currentPageIndex, currentQuestionIndex){
    let questionNumber = {id:"", phoneNumber: "", questionNumber: ""};
     if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        if(element.hasOwnProperty("value") && element.aqueType === "phone") {
            questionNumber = {id: element.value.countryId, phoneNumber: element.value.PhoneNo, questionNumber: element.aqueQuestion};
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
    if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.assessmentsPages[currentPageIndex].questionStyle === "all") {
        let qArray = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions;
        for(let i = 0; i < qArray.length; i++){
            if(qArray[i].hasOwnProperty("value") && qArray[i].aqueType === "email" && !validateEmail(qArray[i].value) && qArray[i].value !== ""){
                questionNumber = qArray[i].aqueQuestion;
                break;
            } else if(qArray[i].hasOwnProperty("value") && qArray[i].aqueType === "contact_form" && qArray[i].labelList.map((v)=>(v.name)).includes("Email") && !validateEmail(qArray[i].value.Email) && qArray[i].value.Email !== ""){
                questionNumber = qArray[i].aqueQuestion;
                break;
            }
        }
    } else if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")) {
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        if(element.hasOwnProperty("value") && element.aqueType === "email" && !validateEmail(element.value) && element.value !== ""){
            questionNumber = element.aqueQuestion;
        } else if(element.hasOwnProperty("value") && element.aqueType === "contact_form" && element.labelList.map((v)=>(v.name)).includes("Email") && !validateEmail(element.value.Email) && element.value.Email !== "" && JSON.stringify(element.value) !== `{}`){
            questionNumber = element.aqueQuestion;
        }
    }
    return questionNumber;
}
export function setAnswersToJson(dataListJson, ansJson){
    let temp = null;
    if(ansJson.hasOwnProperty("assessmentAnswers")){
        temp = ansJson.assessmentAnswers;
    } else {
        temp = ansJson;
    }
    temp.forEach(e1 => {
        dataListJson.assessmentsPages.forEach((e2, i)=>{
            if(e2.hasOwnProperty("apgId") && e2.apgId === e1.aansApgId){
                e2.assessmentsQuestions.forEach((e3, j)=>{
                    if(e3.hasOwnProperty("aqueId") && e3.aqueId === e1.aansAqueId){
                        dataListJson.assessmentsPages[i].assessmentsQuestions[j].value = JSON.parse(e1.aansAnswers).value;
                        dataListJson.assessmentsPages[i].assessmentsQuestions[j].aansId = e1.aansId;
                        dataListJson.assessmentsPages[i].assessmentsQuestions[j].ansStId = e1.aansAsId;
                    }
                })
            }
        })
    });
    dataListJson.asId = ansJson.asId;
    dataListJson.asIsComplete = ansJson.asIsComplete;
    return dataListJson;
}
export function generateSaveAnswerJson(asmtId, dataListJson, currentPageIndex, currentQuestionIndex, asSessionId, hostData, isSubmit=false, questionNext=null, reset){
    let ansJson = {
        asId: dataListJson.hasOwnProperty("asId")?dataListJson.asId:0,
        asAssId: asmtId,
        asIsComplete: isSubmit?1:0,
        asSessionId: asSessionId,
        asIpAddress: hostData.ip,
        asCity: hostData.address.city,
        asState: hostData.address.state,
        asCountry: hostData.address.country,
        assessmentAnswers: []
    };
    let temp = [];
    if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle") &&  dataListJson.assessmentsPages[currentPageIndex].questionStyle === "all") {
        for(let i=0; i < dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions.length; i++){
            if(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].hasOwnProperty("value")){
                temp.push({
                    aansId: dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].hasOwnProperty("aansId")?dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].aansId:0,
                    ansStId:dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].hasOwnProperty("ansStId")?dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].ansStId:0,
                    aansApgId: dataListJson.assessmentsPages[currentPageIndex].apgId,
                    aansAqueId: dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].aqueId,
                    aansAnswers: JSON.stringify({value: dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].value})
                });
            }
            if(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].hasOwnProperty("comment")){
                temp[i] = {
                    ...temp[i],
                    aansComments: JSON.stringify(dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[i].comment)
                };
            }
        }
    } else if(dataListJson.assessmentsPages[currentPageIndex].hasOwnProperty("questionStyle")){
        let element = dataListJson.assessmentsPages[currentPageIndex].assessmentsQuestions[currentQuestionIndex];
        let baseTemp = {
            aansId: element.aansId || 0,
            ansStId:element.ansStId || 0,
            aansApgId: dataListJson.assessmentsPages[currentPageIndex].apgId,
            aansAqueId: element.aqueId,
            resetQuestion: reset.reset
        };
        if (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0)) {
            if (element.aqueType === "consent_agreement" && element.value === false && reset.reset === "Yes") {
                temp.push({ ...baseTemp, aansAnswers: JSON.stringify({ value: false }) });
            }
        } else {
            if (element.squeType === "contact_form") {
                temp.push({
                    ...baseTemp,
                    aansAnswers: JSON.stringify(
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
                ansJson.assessmentAnswers = temp;
                return ansJson;
            }
            if (element.type === "range" && element.value?.total === 0 && reset.reset === "Yes") {
                temp.push({ aansId: baseTemp.aansId, resetQuestion: baseTemp.resetQuestion });
                ansJson.assessmentAnswers = temp;
                return ansJson;
            }
            if (element.type === "range" && element.value?.total === 0 && reset.reset === "No") {
                ansJson.assessmentAnswers = [];
                return ansJson;
            }
            if (element.type === "phone" && !element.value?.PhoneNo && !element.value?.countryCode) {
                temp.push({ aansId: baseTemp.aansId, aansAqueId: baseTemp.aansAqueId });
            } else {
                temp.push({ ...baseTemp, aansAnswers: JSON.stringify({ value: element.value }) });
            }
        }
        if (element.hasOwnProperty("comment") && (element.value !== "" || (typeof element.value === 'object' && Object.keys(element.value).length > 0))) {
            temp[0] = { ...temp[0], aansComments: JSON.stringify(element.comment) };
        }
        if (reset.reset === "Yes" && (!element.value || (typeof element.value === 'object' && Object.keys(element.value).length === 0))) {
            temp[0] = { ...temp[0], aansId: baseTemp.aansId, resetQuestion: baseTemp.resetQuestion };
        }
    }
    ansJson.assessmentAnswers = temp;
    return ansJson;
}
export function extractQuestionsFromJson(dataListJson){
    let questionPageJson = dataListJson.assessmentsPages.filter((val)=>{
        return val.apgType === "Question Page"; 
    });
    let temp = [];
    questionPageJson.forEach((val1,index)=>{
        val1.assessmentsQuestions.forEach((val2)=>{
            temp = [...temp, {...val2, apgNumber: val1.apgNumber, index:index}];
        })
    });
    return temp;
}
export function generateJSONForNode(questions, setLinkInSetData, categoryPageList){
    let xPos = 50;
    let yPos = 100;
    let total = 50;
    let temp = questions.map((v, i)=>{
        let nodeId = `dndnode_${v.apgNumber}${v.aqueDisplayOrder}`;
        let radioTypes = ["single_answer", "single_answer_button", "single_answer_checkbox", "single_answer_combo", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race", "yes_no"];
        let imageTypes = ["image_form", "image_with_text_form"];
        let ratingTypes = ["rating_symbol", "rating_radio", "rating_box"];
        if(typeof v.assessmentsOptions === "undefined" && !ratingTypes.includes(v.aqueType)){
            total+=(yPos)+(30);
        } else if(ratingTypes.includes(v.aqueType)) {
            total+=(yPos)+(40*(v.aqueType === "rating_symbol"?parseInt(v.assessmentsOptions[0].aoptValue):10));
        } else if(imageTypes.includes(v.aqueType)) {
            total+=(yPos)+(60*v.assessmentsOptions.length);
        } else {
            total+=(yPos)+(40*v.assessmentsOptions.length);
        }
        if(radioTypes.includes(v.aqueType)){
            return {
                id: nodeId,
                type: 'Radio',
                data:{
                    question: `${i+1} ${v.aqueQuestion}`,
                    options: v.assessmentsOptions.map((val)=>val.aoptValue),
                    points: v.assessmentsOptions.map((val)=>val.aoptPoints),
                    id: nodeId,
                    isFirst: i === 0,
                    pageIndex: v.apgNumber-1,
                    questionIndex: v.aqueDisplayOrder,
                    setLinkInSetData: setLinkInSetData,
                    formLinks:  v.assessmentsOptions.map((val)=>{
                        if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                            return val?.formLink;
                        } else {
                            return "";
                        }
                    }),
                    formNames:  v.assessmentsOptions.map((val)=>{
                        if(val.hasOwnProperty("formName") && val?.formName !== ""){
                            return val?.formName;
                        } else {
                            return "";
                        }
                    }),
                    type: v.aqueType,
                    borderColor: categoryPageList[v.index].color,
                    categoryPageList:v.aqueCatName
                },
                position:{x: xPos, y: (total-((yPos)+(40*v.assessmentsOptions.length)))}
            }
        } else if(imageTypes.includes(v.aqueType)){
            return {
                id: nodeId,
                type: 'Image',
                data:{
                    question: `${i+1} ${v.aqueQuestion}`,
                    images: v.assessmentsOptions.map((val)=>val.aoptValue),
                    points: v.assessmentsOptions.map((val)=>val.aoptPoints),
                    id: nodeId,
                    isFirst: i === 0,
                    pageIndex: v.apgNumber-1,
                    questionIndex: v.aqueDisplayOrder,
                    setLinkInSetData: setLinkInSetData,
                    type: v.aqueType,
                    formLinks:  v.assessmentsOptions.map((val)=>{
                        if(val.hasOwnProperty("formLink") && val?.formLink !== ""){
                            return val?.formLink;
                        } else {
                            return "";
                        }
                    }),
                    formNames:  v.assessmentsOptions.map((val)=>{
                        if(val.hasOwnProperty("formName") && val?.formName !== ""){
                            return val?.formName;
                        } else {
                            return "";
                        }
                    }),
                    borderColor: categoryPageList[v.index].color,
                    categoryPageList:v.aqueCatName
                },
                position:{x: xPos, y: (total-((yPos)+(60*v.assessmentsOptions.length)))}
            }
        } else if(ratingTypes.includes(v.aqueType)){
            return {
                id: nodeId,
                type: 'Rating',
                data:{
                    question: `${i+1} ${v.aqueQuestion}`,
                    ratings: v.aqueType === "rating_symbol"?v.assessmentsOptions[0].aoptValue:10,
                    id: nodeId,
                    type: v.aqueType,
                    isFirst: i === 0,
                    pageIndex: v.apgNumber-1,
                    questionIndex: v.aqueDisplayOrder,
                    setLinkInSetData: setLinkInSetData,
                    formLinks:  v.formLinks.map((val)=>{
                        return val.formLink;
                    }),
                    formNames:  v.formNames.map((val)=>{
                        return val.formName;
                    }),
                    borderColor: categoryPageList[v.index].color,
                    categoryPageList:v.aqueCatName
                },
                position:{x: xPos, y: (total-((yPos)+(40*(v.aqueType === "rating_symbol"?parseInt(v.assessmentsOptions[0].aoptValue):10))))}
            }
        } else{
            return {
                id: nodeId,
                type: 'Other',
                data: {
                    question: `${i+1} ${v.aqueQuestion}`,
                    id: nodeId,
                    isFirst: i === 0,
                    pageIndex: v.apgNumber-1,
                    questionIndex: v.aqueDisplayOrder,
                    borderColor: categoryPageList[v.index].color,
                    categoryPageList:v.aqueCatName
                },
                position:{x: xPos, y: (total-((yPos)+(30)))}
            }
        }
    });
    total+=(yPos)+(30);
    temp = temp.map((e)=>{
        e.data.setLinkInSetData = setLinkInSetData;
        return e;
    });
    temp = [
        ...temp,
        {
            id: "dnd_node_end",
            type: "End",
            data: {
                id: "dnd_node_end"
            },
            position:{x: xPos, y: (total-((yPos)+(30)))}
        }
    ];
    return temp;
}
export function generateJSONForEdges(nodeJson){
    let temp = [];
    nodeJson.forEach((v, i, a) => {
        if(i < (a.length - 1)){
            if(v.type === "Radio"){
                v.data.options.forEach((val, j)=>{
                    temp = [...temp, {id: `${v.id}_src_${j}`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_${j}`, targetHandle: `${a[i+1].id}_target`, type: 'step', option: val}];
                });
            } else if(v.type === "Image"){
                v.data.images.forEach((val, j)=>{
                    temp = [...temp, {id: `${v.id}_src_${j}`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_${j}`, targetHandle: `${a[i+1].id}_target`, type: 'step', option: val}];
                });
            } else if(v.type === "Rating"){
                Array.from({ length: parseInt(v.data.ratings) }, (_, i1) =>(i1+1)).forEach((_, j)=>{
                    temp = [...temp, {id: `${v.id}_src_${j}`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_${j}`, targetHandle: `${a[i+1].id}_target`, type: 'step', option: j+1}];
                });
            } else if(v.type === "Matrix"){
                v.data.rows.forEach((_, j)=>{
                    temp = [...temp, {id: `${v.id}_src_${j}`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_${j}`, targetHandle: `${a[i+1].id}_target`, type: 'step'}];
                });
            } else {
                temp = [...temp, {id: `${v.id}_src_0`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_0`, targetHandle: `${a[i+1].id}_target`, type: 'step'}];
            }
        }
    });
    return temp;
}
export function removePropertiesFromJson(arr){
    let temp = arr.filter((x)=>x.apgType === "Question Page");
    return temp;
}
export function objectEquals(x, y) {
    let result = "yes";
    if(x.length === y.length){
        x.forEach((xValue1,xIndex1)=>{
            if(xValue1.uniqueId === y[xIndex1].uniqueId){
                if(xValue1.assessmentsQuestions.length === y[xIndex1].assessmentsQuestions.length){
                    xValue1.assessmentsQuestions.forEach((xValue2,xIndex2)=>{
                        if(xValue2.uniqueId === y[xIndex1].assessmentsQuestions[xIndex2].uniqueId) {
                            if(xValue2.hasOwnProperty("assessmentsOptions")) {
                                if(xValue2.assessmentsOptions.length === y[xIndex1].assessmentsQuestions[xIndex2].assessmentsOptions.length){
                                    xValue2.assessmentsOptions.forEach((xValue3,xIndex3)=>{
                                        if(xValue3.aoptUniqueId !== y[xIndex1].assessmentsQuestions[xIndex2].assessmentsOptions[xIndex3].aoptUniqueId){
                                            result="no";
                                        }
                                    })
                                } else {
                                    result="no";
                                }
                            }
                        } else {
                            result="no";
                        }
                    });
                } else {
                    result="no";
                }
            } else {
                result="no";
            }
        });
    } else {
        result="no";
    }
    if(result === "no"){
        return false;
    } else {
        return true;
    }
}
export const isPageHasContent = (type)=> {
    let msg = "";
    if(type === "next"){
        msg = "Sorry you can not move next because you forgot to put the content in one or more pages";
    } else {
        msg = "Sorry your assessment is not shown preview because you forgot to put the content in one or more pages";
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
        msg = "Sorry your assessment is not shown preview because content only blocks must be on a Content or Landing Page";
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
export function setOldNextPrev(oldArr, newArr){
    let temp = newArr.map((val1,index1) => {
        if(val1.apgType === "Question Page") {
            val1.assessmentsQuestions = val1.assessmentsQuestions.map((val2,index2) => {
                let tempNext = {};
                Object.keys(oldArr[index1].assessmentsQuestions[index2].next).forEach(key => {
                    if (oldArr[index1].assessmentsQuestions[index2].next.hasOwnProperty(key)) {
                        if(key === "default"){
                            tempNext = {...tempNext, "default": oldArr[index1].assessmentsQuestions[index2].next[key]};
                        } else if(typeof oldArr[index1].assessmentsQuestions[index2].next[key]?.aoptUniqueId !== "undefined") {
                            let tempValue = val2?.assessmentsOptions?.filter((x) => {return x.aoptUniqueId === oldArr[index1].assessmentsQuestions[index2].next[key].aoptUniqueId});
                            tempNext = {...tempNext, [tempValue[0].aoptValue]: oldArr[index1].assessmentsQuestions[index2].next[key]};
                        }
                    }
                });
                val2?.assessmentsOptions?.forEach((aoValue)=>{
                    if(!Object.keys(tempNext).includes(aoValue.aoptValue)){
                        tempNext[aoValue.aoptValue] = null;
                    }
                });
                val2.next = tempNext;
                val2.prev = oldArr[index1].assessmentsQuestions[index2].prev;
                return val2;
            });
            return val1;
        } else {
            return val1;
        }
    });
    return temp;
}