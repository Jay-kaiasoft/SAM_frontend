import React from "react";
import RenderQuestion from "../shared/commonControlls/prepareQuestionControls";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { staticUrl } from "../../config/api";

const PrepareQuestion = ({questionJson, setDataListJson, pageJson, pageIndex, cfId, globalAlert})=>{
    const setValueJson = (val) => {
        setDataListJson((prev)=> {
            prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].value=val;
            return {
                ...prev
            };
        });
    }
    const setValueJsonText = (val) => {
        pageJson.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].value=val;
    }
    const setValueJsonComment = (val,comment) => {
        setDataListJson((prev)=> {
            if(typeof prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment === "undefined"){
                prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment = {[val]:comment};
            } else {
                if(typeof prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment[val] === "undefined"){
                    prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment = {...prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment, [val]:comment};
                } else {
                    prev.customFormPages[pageIndex].customFormQuestions[questionJson.queDisplayOrder].comment[val] = comment
                }
            }
            return {
                ...prev,
            };
        });
    }
    const handleClickInfoIcon = () => {
        globalAlert({
            type: "Success",
            text: `You are agreeing to receive SMS from this company.\nMessage frequency may vary. Standard Message and Data Rates may apply.\nReply STOP to opt out.\nReply Help for help.\n<a href="${staticUrl}/privacy-policy.html" target="_blank">${staticUrl}/privacy-policy.html</a>`,
            open: true
        });
    }
    return (
        <>
            <div className="p-3">
                {typeof questionJson?.label !== "undefined" && questionJson?.label !== "" && questionJson?.label !== null && <p className="font-size-18 mb-5" dangerouslySetInnerHTML={{ __html: questionJson.label }} />}
                {
                    (questionJson.queType === "phone" && parseInt(cfId) === 224) ? 
                        <p className="font-size-18">{questionJson.queQuestion}<span className="ml-3 text-blue cursor-pointer" onClick={()=>{handleClickInfoIcon();}}>Privacy Policy</span></p>
                    :
                        (questionJson.queType !== "consent_agreement" && questionJson.queType !== "sms_consent_agreement" && questionJson.queType !== "captcha" && questionJson.labellessAnswer !== true) && <p className="font-size-18">{questionJson.queQuestion}</p>    
                }
                <RenderQuestion questionJson={questionJson} setValueJson={setValueJson} setValueJsonText={setValueJsonText} setValueJsonComment={setValueJsonComment} setFormData={()=>{}} callFrom="fromForm" questionStyle={pageJson?.settings?.pageSettings}/>
            </div>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(PrepareQuestion);