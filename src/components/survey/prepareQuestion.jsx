import React from "react";
import {CSSstring} from '../../assets/commonFunctions';
import RenderQuestion from "../shared/commonControlls/prepareQuestionControls";

const PrepareQuestion = ({questionJson, setDataListJson, pageIndex, setFormData, pageJson, index=-1})=>{
    const setValueJson = (val) => {
        setDataListJson((prev)=> {
            return {
                ...prev,
                ...prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].value=val
            };
        });
    }
    const setValueJsonText = (val) => {
        pageJson.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].value=val;
    }
    const setValueJsonComment = (val,comment) => {
        setDataListJson((prev)=> {
            if(typeof prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment === "undefined"){
                prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment = {[val]:comment};
            } else {
                if(typeof prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment[val] === "undefined"){
                    prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment = {...prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment, [val]:comment};
                } else {
                    prev.surveysPages[pageIndex].surveysQuestions[questionJson.squeDisplayOrder].comment[val] = comment
                }
            }
            return {
                ...prev,
            };
        });
    }
    return (
        <>
            <div className="p-3">
                {
                    (questionJson?.squeCatName !== "None" && questionJson?.squeCatDisplay !== "no" && (index === 0 || index === -1)) ?
                        <>
                            {
                                typeof questionJson?.squeCatStyle !== "undefined" && questionJson?.squeCatStyle !== "" && questionJson?.squeCatStyle !== null ?
                                    <p className="text-center" style={CSSstring(questionJson.squeCatStyle)}>{questionJson.squeCatName}</p>
                                :
                                    <p className="text-center font-weight-bold">{questionJson.squeCatName}</p>
                            }
                            <hr className="mb-5"/>
                        </>
                    : null
                }
                {typeof questionJson?.label !== "undefined" && questionJson?.label !== "" && questionJson?.label !== null && <p className="font-size-18 mb-5" dangerouslySetInnerHTML={{ __html: questionJson.label }} />}
                {(questionJson.squeType !== "consent_agreement" && questionJson.labellessAnswer !== true) && <p className="font-size-18">{questionJson.squeQuestion}</p>}
                <RenderQuestion questionJson={questionJson} setValueJson={setValueJson} setValueJsonText={setValueJsonText} setValueJsonComment={setValueJsonComment} setFormData={setFormData} callFrom="fromSurvey" questionStyle={pageJson?.settings?.pageSettings}/>
            </div>
        </>
    );
}
export default PrepareQuestion;