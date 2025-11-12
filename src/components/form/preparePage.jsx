import React from "react";
import PrepareQuestion from "./prepareQuestion";
import $ from 'jquery';

const PreparePage = ({pageIndex, pageJson, setDataListJson, questionIndex, cfId}) => {
    let height = `calc(100vh - ${parseInt($(".header-main-container")[0].offsetHeight)+parseInt($(".footer-container")[0].offsetHeight)+(parseInt($(".form-container").css("border-width").replaceAll("px",""))*2)+(parseInt($(".form-container").css("padding-top").replaceAll("px","")))+(parseInt($(".form-container").css("padding-bottom").replaceAll("px","")))+(parseInt($(".form-container").css("margin-top").replaceAll("px","")))+(parseInt($(".form-container").css("margin-bottom").replaceAll("px","")) + 22)}px)`;
    if(pageJson.customFormPages[pageIndex].pageType === "Question Page"){
        if(pageJson.customFormPages[pageIndex].questionStyle === "all"){
            return (
                <div style={{height: height}}>
                    <div className="row">
                        {
                            ["imageBlockPageLayout2", "imageBlockPageLayout4"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex align-items-center md-height"  style={{minHeight: height}}>
                                    <div className={pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout2" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                        <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ? "col-md-12 d-flex align-items-center flex-column" : "col-md-6 col-xs-12 d-flex align-items-center flex-column"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout6" ? pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage : "",backgroundSize:"cover",backgroundPosition:"center center",minHeight: height}}>
                            {
                                pageJson.customFormPages[pageIndex].customFormQuestions.map((e, index)=>{
                                    return (
                                        <div className="row w-100" key={index}>
                                            <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType)?"col-xl-8 col-md-8 col-sm-12 offset-xl-2 offset-md-2 col-xs-12":"col-md-12"}>
                                                <PrepareQuestion questionJson={e} setDataListJson={setDataListJson} pageJson={pageJson} pageIndex={pageIndex} cfId={cfId}/>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            ["imageBlockPageLayout3", "imageBlockPageLayout5"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex align-items-center md-height" style={{minHeight: height}}>
                                    <div className={pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout3" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{height: height}}>
                    <div className="row">
                        {
                            ["imageBlockPageLayout2", "imageBlockPageLayout4"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex align-items-center md-height" style={{minHeight: height}}>
                                    <div className={pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout2" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                        <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ? "col-md-12 d-flex align-items-center flex-column" : "col-md-6 col-xs-12 d-flex align-items-center flex-column"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout6" ? pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage : "",backgroundSize:"cover",backgroundPosition:"center center",minHeight: height}}>
                            <div className="row w-100">
                                <div className={["imageBlockPageLayout1", "imageBlockPageLayout6"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType)?"col-xl-8 col-md-8 col-sm-12 offset-xl-2 offset-md-2 col-xs-12":"col-md-12"}>
                                    <PrepareQuestion questionJson={pageJson.customFormPages[pageIndex].customFormQuestions[questionIndex]} pageIndex={pageIndex} setDataListJson={setDataListJson} pageJson={pageJson}/>
                                </div>
                            </div>
                        </div>
                        {
                            ["imageBlockPageLayout3", "imageBlockPageLayout5"].includes(pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType) ?
                                <div className="col-md-6 col-xs-12 d-flex align-items-center md-height" style={{minHeight: height}}>
                                    <div className={pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutType === "imageBlockPageLayout3" ? "w-100 h-100" : "w-50 h-50"} style={{backgroundImage:pageJson.customFormPages[pageIndex].imageBlockPageLayoutSetting.layoutImage,backgroundSize:"cover",backgroundPosition:"center center"}}></div>
                                </div>
                            : null
                        }
                    </div>
                </div>
            );
        }
    } else if(pageJson.customFormPages[pageIndex].pageType === "Landing Page"){
        return (<div style={{height: height}} dangerouslySetInnerHTML={{ __html: pageJson.customFormPages[pageIndex].blockList.replaceAll("mojoMcBlock ","") }}></div>);
    }
}

export default PreparePage;