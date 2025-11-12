import React from "react";
import PrepareQuestion from "./prepareQuestion";
import $ from 'jquery';

const PreparePage = ({pageIndex, pageJson, setDataListJson, questionIndex, setFormData}) => {
    let height = `calc(100vh - ${parseInt($(".header-main-container")[0].offsetHeight)+parseInt($(".footer-container")[0].offsetHeight)+(parseInt($(".form-container").css("border-width").replaceAll("px",""))*2)+(parseInt($(".form-container").css("padding-top").replaceAll("px","")))+(parseInt($(".form-container").css("padding-bottom").replaceAll("px","")))+(parseInt($(".form-container").css("margin-top").replaceAll("px","")))+(parseInt($(".form-container").css("margin-bottom").replaceAll("px","")) + 22)}px)`;
    if(pageJson.assessmentsPages[pageIndex].apgType === "Question Page"){
            return (
                <div style={{height: height}}>
                    <div className="row">
                        {
                            ["imageBlockPageLayout2", "imageBlockPageLayout4"].includes(pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex justify-content-center md-height" style={{minHeight: height}}>
                                    <div className={pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout2" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                        <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ? "col-md-12 d-flex justify-content-center" : "col-md-6 col-xs-12 d-flex justify-content-center"} style={{backgroundImage:pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout6" ? pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutImage : "",backgroundSize:"cover",backgroundPosition:"center center",minHeight: height}}>
                            <div className="row w-100">
                                <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType)?"col-xl-8 col-md-8 col-sm-12 offset-xl-2 offset-md-2 col-xs-12":"col-md-12"}>
                                    <PrepareQuestion questionJson={pageJson.assessmentsPages[pageIndex].assessmentsQuestions[questionIndex]} pageIndex={pageIndex} setDataListJson={setDataListJson} setFormData={setFormData} pageJson={pageJson}/>
                                </div>
                            </div>
                        </div>
                        {
                            ["imageBlockPageLayout3", "imageBlockPageLayout5"].includes(pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex justify-content-center md-height" style={{minHeight: height}}>
                                    <div className={pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout3" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.assessmentsPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                    </div>
                </div>
            );
        
    } else if(pageJson.assessmentsPages[pageIndex].apgType === "Landing Page"){
        return (<div style={{height: height}} dangerouslySetInnerHTML={{ __html: pageJson.assessmentsPages[pageIndex].blockList.replaceAll("mojoMcBlock ","") }}></div>);
    }
}

export default PreparePage;