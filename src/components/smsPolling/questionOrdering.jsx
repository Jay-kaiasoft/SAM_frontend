import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Col, Row, FormGroup } from "reactstrap";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {connect} from "react-redux";
import {saveFinalizeQuestionOrder} from "../../services/smsPollingService";
import $ from "jquery";

const QuestionOrdering = ({
    data,
    handleBack,
    handleNext,
    handleDataChange,
    globalAlert
}) => {
    const [questions, setQuestions] = useState([]);
    const [editOrder, setEditOrder] = useState(false);

    useEffect(() => {
        setQuestions(JSON.parse(JSON.stringify(data.questions)));
    }, [data.questions])

    let orderDropDownValues = []
    for (let index = 0; index < data.questions.length; index++) {
        orderDropDownValues.push({
            key: index + 1,
            value: index + 1
        })
    }
    const handleClickNext = () => {
        if(editOrder){
            let qId = [];
            questions.map((v)=>(
               qId.push(v.queId)
            ));
            let requestData = {
                "iid": data.iid,
                "questions":qId
            }
            $("button.nextClick").hide();
            $("button.nextClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
            saveFinalizeQuestionOrder(requestData).then(res => {
                if (res.status === 200) {
                    if(data.hasOwnProperty("questionFlowJson")){
                        delete data.questionFlowJson;
                    }
                    if(data.hasOwnProperty("questionFlow")){
                        delete data.questionFlow;
                    }
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    handleNext(1);
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $(".lds-ellipsis").remove();
                $("button.nextClick").show();
            });
        } else {
            handleNext(1);
        }
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={5} lg={4} xl={4} className="mx-auto">
                <p><strong>Finalize Question Order</strong></p>
                <p><strong>Name : </strong>{`${data.vheading}`}</p>
                <p><strong>Description : </strong>{`${data.tdetail}`}</p>
                <p><strong>Questions</strong></p>
                {questions.map((question, index) => {
                    return (
                        <div key={index} className="mb-3">
                            <p className="mb-1">{`${index + 1}. ${question.question}`}</p>
                            <p className="mb-1" style={{color: "#adadad" }}>{question.queTypeId === 1 ? "Single Answer" : "Open Ended"}</p>
                            <FormGroup>
                                <DropDownControls
                                    name="order"
                                    label="Select Order"
                                    onChange={(name, value) => {
                                        setEditOrder(true);
                                        const questionsToModify = JSON.parse(JSON.stringify(questions));
                                        const temp = questionsToModify[index];
                                        const questionsToRemain = questionsToModify.filter((v)=>{return v.queId !== temp.queId});
                                        questionsToRemain.splice(value-1, 0, temp);
                                        handleDataChange("questions", questionsToRemain);
                                    }}
                                    validation={"required"}
                                    dropdownList={orderDropDownValues}
                                    value={index + 1 || ""}
                                />
                            </FormGroup>
                        </div>
                    )
                })}
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(1)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3 nextClick"
                        onClick={() => handleClickNext()}
                        title="Changes will be committed!!"
                        data-toggle="tooltip"
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => {
            dispatch(setGlobalAlertAction(payload))
        }
    }
}
export default connect(null, mapDispatchToProps)(QuestionOrdering);