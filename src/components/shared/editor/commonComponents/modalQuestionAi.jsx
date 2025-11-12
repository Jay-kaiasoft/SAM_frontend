import { Link } from '@mui/material';
import React, { useCallback, useState } from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";

const ModalQuestionAi = ({stSurveyAbout, stSurveyGoal, stSurveyGoalDescription, stNoOfQuestion, handleChange}) => {
    const [modalQuestionAi, setModalQuestionAi] = useState(false);
    const toggleQuestionAi = useCallback(() => setModalQuestionAi(!modalQuestionAi),[modalQuestionAi]);
    const surveyGoalData = [
        {
            "key": "Data Collection",
            "value": "Data Collection"
        },
        {
            "key": "Decision Making",
            "value": "Decision Making"
        },
        {
            "key": "Understanding Trends or Patterns",
            "value": "Understanding Trends or Patterns"
        },
        {
            "key": "Needs Assessment",
            "value": "Needs Assessment"
        },
        {
            "key": "Feedback Gathering",
            "value": "Feedback Gathering"
        },
        {
            "key": "Evaluating Impact",
            "value": "Evaluating Impact"
        },
        {
            "key": "Segmentation",
            "value": "Segmentation"
        },
        {
            "key": "Other",
            "value": "Other"
        }
    ];
    const handleClickGo = () => {
        handleChange("stSurveyAbout",document.getElementById("about").value);
        handleChange("stSurveyGoal",document.getElementById("goal").value);
        handleChange("stSurveyGoalDescription",document.getElementById("goaldescription").value);
        handleChange("stNoOfQuestion",document.getElementById("noofquestion").value);
    }
    return(
        <>
            <Modal id="modalquestionai" size="lg" isOpen={modalQuestionAi} toggle={toggleQuestionAi}>
                <ModalHeader toggle={toggleQuestionAi}>Survey With AI Assistant</ModalHeader>
                <ModalBody>
                    <div className="w-75 mx-auto">
                        <div className="form-group">
                            <label><strong>Tell me what is this survey about?</strong></label>
                            <input className="w-100 aitextbox" type="text" id="about" defaultValue={stSurveyAbout} disabled={stSurveyAbout === "" ? "" : "disabled"} />
                        </div>
                        <div className="form-group">
                            <label><strong>What is the goal or objective of this survey?</strong></label>
                            <select id="goal" className="aitextbox" defaultValue={stSurveyGoal} disabled={stSurveyGoal === "" ? "" : "disabled"}>
                                {
                                    surveyGoalData.map((value, index)=>{
                                        return <option key={index} value={value.key}>{value.value}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div id="goaldescriptiondiv" className="form-group" style={{display:(stSurveyGoal === "" || stSurveyGoal !== "Other") ? "none" : ""}}>
                            <label><strong>Survey goal description</strong></label>
                            <input className="w-100 aitextbox" type="text" id="goaldescription" defaultValue={stSurveyGoalDescription} disabled={stSurveyGoalDescription === "" ? "" : "disabled"} />
                        </div>
                        <div className="form-group">
                            <label>
                                <strong>How many questions do you want to ask?</strong>
                                <br/><br/>My suggestion is :<br/>Short Surveys (5 to 10)<br/>Medium Surveys (10 to 20)<br/>Long Surveys (20 to 40)
                            </label>
                            <input className="w-100 aitextbox" type="text" id="noofquestion" defaultValue={stNoOfQuestion} />
                        </div>
                        <div className="form-group text-center">
                            <Link component="a" id="ask_questions" className="btn-circle active" style={{ zIndex: "9" }} onClick={()=>{handleClickGo()}}>
                                <i className="far fa-arrow-right"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <input type="hidden" id="clickQuestionAiModal" onClick={()=>{toggleQuestionAi()}}/>
        </>
    );
}

export default ModalQuestionAi;