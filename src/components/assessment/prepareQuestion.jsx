import React from "react";
import {CSSstring} from '../../assets/commonFunctions';
import RenderQuestion from "../shared/commonControlls/prepareQuestionControls";

const PrepareQuestion = ({questionJson, setDataListJson, pageIndex, setFormData, pageJson})=>{
    const setValueJson = (val) => {
        setDataListJson((prev)=> {
            return {
                ...prev,
                ...prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].value=val
            };
        });
    }
    const setValueJsonText = (val) => {
        pageJson.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].value=val;
    }
    const setValueJsonComment = (val,comment) => {
        setDataListJson((prev)=> {
            if(typeof prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment === "undefined"){
                prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment = {[val]:comment};
            } else {
                if(typeof prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment[val] === "undefined"){
                    prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment = {...prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment, [val]:comment};
                } else {
                    prev.assessmentsPages[pageIndex].assessmentsQuestions[questionJson.aqueDisplayOrder].comment[val] = comment
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
                    questionJson?.aqueCatDisplay !== "no" ?
                        <>
                            {
                                typeof questionJson?.aqueCatStyle !== "undefined" && questionJson?.aqueCatStyle !== "" && questionJson?.aqueCatStyle !== null ?
                                    <p className="text-center" style={CSSstring(questionJson.aqueCatStyle)}>{questionJson.aqueCatName}</p>
                                :
                                    <p className="text-center font-weight-bold">{questionJson.aqueCatName}</p>
                            }
                            <hr className="mb-5"/>
                        </>
                    : null
                }
                {typeof questionJson?.label !== "undefined" && questionJson?.label !== "" && questionJson?.label !== null && <p className="font-size-18 mb-5" dangerouslySetInnerHTML={{ __html: questionJson.label }} />}
                {(questionJson.aqueType !== "consent_agreement" && questionJson.labellessAnswer !== true) && <p className="font-size-18">{questionJson.aqueQuestion}</p>}
                <RenderQuestion questionJson={questionJson} setValueJson={setValueJson} setValueJsonText={setValueJsonText} setValueJsonComment={setValueJsonComment} setFormData={setFormData} callFrom="fromAssessment" questionStyle={pageJson?.settings?.pageSettings}/>
            </div>
        </>
    );
}
export default PrepareQuestion;