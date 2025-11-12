import React, { useState, useEffect } from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Button } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import {addSmsPollingCategory, deleteSmsPollingQuestion, saveSmsPollingQuestion} from "../../services/smsPollingService";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {siteURL} from "../../config/api";
import $ from "jquery";

const WriteQuestions = ({
    data,
    handleDataChange,
    handleNext,
    handleBack,
    globalAlert,
    confirmDialog,
    subUser
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(data.questions.length);
    const [currentSelected, setCurrentSelected] = useState(0)
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [currentPreviewQuestion, setCurrentPreviewQuestion] = useState(currentSelected)

    useEffect(() => {
        const presentQuestions = JSON.parse(JSON.stringify(data.questions));
        setQuestions(presentQuestions)
        setOpenModal(data.questions.length === 0 ? true : false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const addQuestion = (type) => {
        setQuestions([...questions, {
            queId: 0,
            queTypeId: type,
            catId: 1,
            question: "",
            optionVal: [""]
        }])
        setTotalQuestions((prevState) => (prevState+1))
        setCurrentSelected(totalQuestions)
        setOpenModal(false)
        if(data.hasOwnProperty("questionFlowJson")){
            delete data.questionFlowJson;
        }
        if(data.hasOwnProperty("questionFlow")){
            delete data.questionFlow;
        }
    }
    const handleClickSaveSmsPollingQuestion = () => {
        if (questions[currentSelected].catId === null) {
            globalAlert({
                type: "Error",
                text: "Please Select Category",
                open: true
            })
            return
        }
        if (questions[currentSelected].question === "") {
            globalAlert({
                type: "Error",
                text: "Please enter question text",
                open: true
            })
            return
        }
        if(questions[currentSelected].queTypeId !== 2) {
            for (let index = 0; index < questions[currentSelected].optionVal.length; index++) {
                if (questions[currentSelected].optionVal[index] === "") {
                    globalAlert({
                        type: "Error",
                        text: "Please enter answer text",
                        open: true
                    })
                    return
                }
            }
        }
        let requestData = {
            "iid": data.iid,
            "queId": questions[currentSelected].queId,
            "queTypeId":questions[currentSelected].queTypeId,
            "question":questions[currentSelected].question,
            "catId":questions[currentSelected].catId,
            "optionVal":questions[currentSelected].optionVal,
            "rndHash": data.rndHash
        }
        $("button.saveSmsPollingQuestion").hide();
        $("button.saveSmsPollingQuestion").after('<div class="lds-ellipsis mt-2"><div></div><div></div><div></div>');
        saveSmsPollingQuestion(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                questions[currentSelected].queId = res.result.question.queId;
                let questionsToSave = JSON.parse(JSON.stringify(data.questions));
                const index = questionsToSave.findIndex(it => it.queId === questions[currentSelected].queId)
                if (index === -1) {
                    questionsToSave.push(questions[currentSelected]);
                }
                else {
                    questionsToSave[currentSelected] = questions[currentSelected];
                }
                handleDataChange("questions", questionsToSave);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.saveSmsPollingQuestion").show();
        });
    }
    const handleClickDeleteSmsPollingQuestion = () => {
        let requestData = {
            "iid": data.iid,
            "queId":questions[currentSelected].queId,
            "queTypeId":questions[currentSelected].queTypeId,
            "catId":questions[currentSelected].catId
        }
        $("button.deleteSmsPollingQuestion").hide();
        $("button.deleteSmsPollingQuestion").after('<div class="lds-ellipsis mt-2 ml-3"><div></div><div></div><div></div>');
        deleteSmsPollingQuestion(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                if(data.hasOwnProperty("questionFlowJson")){
                    delete data.questionFlowJson;
                }
                if(data.hasOwnProperty("questionFlow")){
                    delete data.questionFlow;
                }
                let questionsToSave = JSON.parse(JSON.stringify(data.questions));
                let q = questionsToSave.filter(it => it.queId !== requestData.queId);
                setCurrentSelected(0);
                setQuestions(q);
                handleDataChange("questions", q);
                setTotalQuestions(q.length);
                if(q.length === 0) {
                    setOpenModal(true);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.deleteSmsPollingQuestion").show();
        });
    }
    const renderAddCategory = () => {
        const handleCategoryChange = (name, value) => {
            setNewCategory(value)
        }
        const createNewCategory = () => {
            if (newCategory === "") {
                globalAlert({
                    type: "Error",
                    text: "Please Enter Category Name",
                    open: true
                })
                return
            }
            let requestData = {
                "catName": newCategory,
                "subMemberId":subUser.memberId
            }
            $("button.createCategory").hide();
            $("button.createCategory").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
            addSmsPollingCategory(requestData).then(res => {
                if (res.status === 200) {
                    const categories = [...data.category, { key: res.result.category.id, value: newCategory }];
                    handleDataChange("category", categories);
                    setOpenCategoryModal(false);
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $(".lds-ellipsis").remove();
                $("button.createCategory").show();
            });
        }
        return (
            <Modal isOpen={openCategoryModal} toggle={() => { setOpenCategoryModal(false) }}>
                <ModalHeader toggle={() => { setOpenCategoryModal(false) }}>Add Category</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10} xl={10} className="mx-auto modal-card">
                            <FormGroup>
                                <InputField
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={newCategory || ""}
                                    onChange={handleCategoryChange}
                                    label="Category Name"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <div className="col-12 mt-3 mb-3" align="center">
                        <Button
                            color="primary"
                            variant="contained"
                            className="createCategory"
                            onClick={() => createNewCategory()}
                        >
                            CREATE
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            className="ml-3"
                            onClick={() => { setOpenCategoryModal(false) }}
                        >
                            CANCEL
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        )
    }
    const renderModal = () => {
        return (
            <Modal size="lg" isOpen={openModal} toggle={() => { setOpenModal(false) }}>
                <ModalHeader toggle={() => { setOpenModal(false) }}>Select A Question Format</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="modal-card">
                            <div className={`card`} onClick={() => { addQuestion(1) }}>
                                <div className="card-img-wrapper">
                                    <img className="card-img-top" src={siteURL+"/img/question-type-1.png"} alt="tile" />
                                </div>
                                <div className="card-body">
                                    <div className="card-title">Select Single Answer</div>
                                </div>
                            </div>
                            <div className={`card mb-3`} onClick={() => { addQuestion(2) }}>
                                <div className="card-img-wrapper">
                                    <img className="card-img-top" src={siteURL+"/img/question-type-2.png"} alt="tile" />
                                </div>
                                <div className="card-body">
                                    <div className="card-title">Select Open Ended</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }
    const renderSideTabs = () => {
        let tabs = []
        for (let index = 0; index < totalQuestions; index++) {
            const element = <li key={index} className={`${index === currentSelected ? "tab-active" : "tab-inactive"} cursor-pointer`} onClick={() => { setCurrentSelected(index) }}>
                {index + 1}
            </li>;
            tabs.push(element)
        }
        return tabs;
    }
    const renderQuestion = () => {
        const currentQuestion = questions[currentSelected]
        switch (currentQuestion?.queTypeId) {
            case 1:
                return (
                    <div>
                        <p><strong>Enter Question Here</strong></p>
                        <p>Question Type: Single answer</p>
                        {/*<div className="row-container">*/}
                        {/*    <FormGroup className="input-box">*/}
                        {/*        <DropDownControls*/}
                        {/*            name="catId"*/}
                        {/*            label="Select Category"*/}
                        {/*            onChange={(name, value) => {*/}
                        {/*                const editedQuestions = JSON.parse(JSON.stringify(questions))*/}
                        {/*                editedQuestions[currentSelected].catId = value*/}
                        {/*                setQuestions(editedQuestions)*/}
                        {/*            }}*/}
                        {/*            validation={"required"}*/}
                        {/*            dropdownList={data.category}*/}
                        {/*            value={currentQuestion.catId || ""}*/}
                        {/*        />*/}
                        {/*    </FormGroup>*/}
                        {/*    <Button*/}
                        {/*        color="primary"*/}
                        {/*        variant="contained"*/}
                        {/*        onClick={() => { setOpenCategoryModal(true) }}*/}
                        {/*        className="ml-3"*/}
                        {/*    >*/}
                        {/*        ADD*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                        <FormGroup>
                            <InputField
                                type="text"
                                id="question"
                                name="question"
                                value={currentQuestion?.question || ""}
                                onChange={(name, value) => {
                                    const editedQuestions = JSON.parse(JSON.stringify(questions))
                                    editedQuestions[currentSelected].question = value
                                    setQuestions(editedQuestions)
                                }}
                                label="Enter Question Text"
                                multiline={true}
                                minRows={4}
                            />
                        </FormGroup>
                        {
                            currentQuestion?.optionVal.map((answer, index) => {
                                return (
                                    <div className="row-container" key={index}>
                                        <FormGroup>
                                            <InputField
                                                type="text"
                                                id="optionVal"
                                                name="optionVal"
                                                value={answer || ""}
                                                onChange={(name, value) => {
                                                    const optionVal = currentQuestion?.optionVal
                                                    optionVal[index] = value
                                                    const editedQuestions = JSON.parse(JSON.stringify(questions))
                                                    editedQuestions[currentSelected].optionVal = optionVal
                                                    setQuestions(editedQuestions)
                                                }}
                                                label="Enter Answer Text"
                                            />
                                        </FormGroup>
                                        <button className="segment-btn btn-delete ml-2"
                                            onClick={() => {
                                                currentQuestion?.optionVal.splice(index, 1)
                                                const editedQuestions = JSON.parse(JSON.stringify(questions))
                                                editedQuestions[currentSelected].optionVal = currentQuestion.optionVal
                                                setQuestions(editedQuestions)
                                            }}
                                        ><i className="far fa-trash-alt"></i></button>
                                        {index === currentQuestion?.optionVal.length - 1 &&
                                            <button className="segment-btn btn-edit ml-2"
                                                onClick={() => {
                                                    currentQuestion?.optionVal.push("")
                                                    const editedQuestions = JSON.parse(JSON.stringify(questions))
                                                    editedQuestions[currentSelected].optionVal = currentQuestion.optionVal
                                                    setQuestions(editedQuestions)
                                                }}>
                                                <i className="far fa-plus-square"></i>
                                            </button>
                                        }
                                    </div>
                                )
                            })
                        }
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => { handleClickSaveSmsPollingQuestion() }}
                            className="mt-2 saveSmsPollingQuestion"
                        >
                            SAVE
                        </Button>
                        { currentQuestion?.queId > 0 &&
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    confirmDialog({
                                        open: true,
                                        title: 'Warning, if you delete a question all of your Answer Logic Flow will be deleted and you will need to enter it again.',
                                        onConfirm: () => {handleClickDeleteSmsPollingQuestion()}
                                    })
                                }}
                                className="mt-2 ml-3 deleteSmsPollingQuestion"
                            >
                                DELETE
                            </Button>
                        }
                    </div>
                )
            case 2:
                return (
                    <div>
                        <p><strong>Enter Question Here</strong></p>
                        <p>Question Type: Open ended</p>
                        {/*<div className="row-container">*/}
                        {/*    <FormGroup className="input-box">*/}
                        {/*        <DropDownControls*/}
                        {/*            name="catId"*/}
                        {/*            label="Select Category"*/}
                        {/*            onChange={(name, value) => {*/}
                        {/*                const editedQuestions = JSON.parse(JSON.stringify(questions))*/}
                        {/*                editedQuestions[currentSelected].catId = value*/}
                        {/*                setQuestions(editedQuestions)*/}
                        {/*            }}*/}
                        {/*            validation={"required"}*/}
                        {/*            dropdownList={data.category}*/}
                        {/*            value={currentQuestion.catId || ""}*/}
                        {/*        />*/}
                        {/*    </FormGroup>*/}
                        {/*    <Button*/}
                        {/*        color="primary"*/}
                        {/*        variant="contained"*/}
                        {/*        onClick={() => { setOpenCategoryModal(true) }}*/}
                        {/*        className="ml-3"*/}
                        {/*    >*/}
                        {/*        ADD*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                        <FormGroup>
                            <InputField
                                type="text"
                                id="question"
                                name="question"
                                value={currentQuestion?.question || ""}
                                onChange={(name, value) => {
                                    const editedQuestions = JSON.parse(JSON.stringify(questions))
                                    editedQuestions[currentSelected].question = value
                                    setQuestions(editedQuestions)
                                }}
                                label="Enter Question Text"
                                multiline={true}
                                minRows={4}
                            />
                        </FormGroup>
                        <FormGroup>
                            <InputField
                                type="text"
                                id="optionVal"
                                name="optionVal"
                                value={currentQuestion?.optionVal[0] || ""}
                                onChange={(name, value) => {
                                    const editedQuestions = JSON.parse(JSON.stringify(questions))
                                    editedQuestions[currentSelected].optionVal[0] = value
                                    setQuestions(editedQuestions)
                                }}
                                disabled={true}
                                label="Enter Answer Text"
                            />
                        </FormGroup>
                        <Button
                            color="primary"
                            variant="contained"
                            className="mt-2 saveSmsPollingQuestion"
                            onClick={() => { handleClickSaveSmsPollingQuestion() }}
                        >
                            SAVE
                        </Button>
                        { currentQuestion?.queId > 0 &&
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    confirmDialog({
                                        open: true,
                                        title: 'Warning, if you delete a question all of your Answer Logic Flow will be deleted and you will need to enter it again.',
                                        onConfirm: () => {handleClickDeleteSmsPollingQuestion()}
                                    })
                                }}
                                className="mt-2 ml-3 deleteSmsPollingQuestion"
                            >
                                DELETE
                            </Button>
                        }
                    </div>
                )
            default:
                return null;
        }
    }
    const renderPreview = () => {
        const currentQuestion = questions[currentSelected]
        switch (currentQuestion?.queTypeId) {
            case 1:
                return (
                    <div>
                        <p className="white-space-pre-line"><strong>Question Preview</strong></p>
                        <div style={{ backgroundColor: "#f9f9f9", padding: "20px" }}>
                            <p>{`${currentQuestion.question !== "" ? currentQuestion.question : "Enter Question Text"}`}</p>
                            <ol type="1">
                                {currentQuestion.optionVal.map((answer, index) => {
                                    return (
                                        <li key={index}>{`${answer === "" ? "Enter Answer Text" : answer}`}</li>
                                    )
                                })}
                            </ol>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <p><strong>Question Preview</strong></p>
                        <div style={{ backgroundColor: "#f9f9f9", padding: "20px" }}>
                            <p>{`${currentQuestion.question !== "" ? currentQuestion.question : "Enter Question Text"}`}</p>
                            <FormGroup>
                                <InputField
                                    type="text"
                                    id="optionVal"
                                    name="optionVal"
                                    value={currentQuestion.optionVal[0] || ""}
                                    label="Enter Answer Text"
                                    disabled={true}
                                    multiline={true}
                                    minRows={3}
                                />
                            </FormGroup>
                            <Button
                                color="primary"
                                variant="contained"
                                className="mt-2"
                            >
                                SUBMIT
                            </Button>
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }
    const renderPreviewModal = () => {
        const currentQuestion = questions[currentPreviewQuestion]
        return (
            <Modal size="lg" isOpen={openPreviewModal} toggle={() => { setOpenPreviewModal(false) }}>
                <ModalHeader toggle={() => { setOpenPreviewModal(false) }}>{data.vheading}</ModalHeader>
                <ModalBody>
                    <Row style={{ display: "flex", alignItems: "center" }}>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                            {currentPreviewQuestion > 0 && <i className="far fa-chevron-left icon-style" onClick={() => {
                                if (currentPreviewQuestion > 0) {
                                    setCurrentPreviewQuestion(currentPreviewQuestion - 1)
                                }
                            }}></i>}
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                            {questions[currentPreviewQuestion]?.queTypeId === 1 ?
                                <div>
                                    <div style={{ padding: "10px" }}>
                                        <p>{`${currentQuestion?.question !== "" ? currentQuestion?.question : "Enter Question Text"}`}</p>
                                        <ol type="1">
                                            {currentQuestion?.optionVal.map((answer, index) => {
                                                return (
                                                    <li style={{listStyleType: "unset"}} key={index}>{`${answer === "" ? "Enter Answer Text" : answer}`}</li>
                                                )
                                            })}
                                        </ol>
                                    </div>
                                </div> :
                                <div>
                                    <div style={{ padding: "10px" }}>
                                        <p>{`${currentQuestion?.question !== "" ? currentQuestion?.question : "Enter Question Text"}`}</p>
                                        <FormGroup>
                                            <InputField
                                                type="text"
                                                id="optionVal"
                                                name="optionVal"
                                                value={currentQuestion?.optionVal[0] || ""}
                                                label="Enter Answer Text"
                                                disabled={true}
                                                multiline={true}
                                                minRows={3}
                                            />
                                        </FormGroup>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            className="mt-2"
                                        >
                                            SUBMIT
                                        </Button>
                                    </div>
                                </div>}
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} align="right">
                            {currentPreviewQuestion < questions.length - 1 && <i className="far fa-chevron-right icon-style" onClick={() => {
                                setCurrentPreviewQuestion(currentPreviewQuestion + 1)
                            }}></i>}
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        )
    }
    return (
        <div>
            <Row>
                <Col align="left" className="pl-5">
                    <p><strong>{`Write a question for your SMS polling "${data.vheading}"`}</strong></p>
                    <div className="col-12 mt-3 mb-3" >
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                if (questions.length !== data.questions.length) {
                                    globalAlert({
                                        type: "Error",
                                        text: "Please Save Last Question",
                                        open: true
                                    })
                                    return
                                }
                                setOpenModal(true)
                            }}
                        >
                            ADD NEW QUESTION
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            className="ml-3"
                            onClick={() => setOpenPreviewModal(true)}
                        >
                            PREVIEW QUESTIONS
                        </Button>
                    </div>
                </Col>
            </Row>
            {renderModal()}
            {renderPreviewModal()}
            {renderAddCategory()}
            <Row className="mt-4">
                <Col xs={2} sm={2} md={1} lg={1} xl={1} className="pl-5">
                    <div>
                        <ul className="side-nav">
                            {renderSideTabs()}
                        </ul>
                    </div>
                </Col>
                <Col xs={10} sm={10} md={5} lg={5} xl={5}>
                    {renderQuestion()}
                </Col>
                <Col xs={10} sm={10} md={5} lg={5} xl={5} className="ml-5">
                    {renderPreview()}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col align="center">
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
                            className="ml-3"
                            onClick={() => {
                                if (questions.length !== data.questions.length) {
                                    globalAlert({
                                        type: "Error",
                                        text: "Please Save Last Question",
                                        open: true
                                    })
                                    return
                                }
                                handleNext(1)
                            }}
                            title="Changes will be committed!!"
                            data-toggle="tooltip"
                        >
                            <i className="far fa-long-arrow-right mr-2"></i>NEXT
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        subUser: state.subUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        confirmDialog: (data) => {dispatch(setConfirmDialogAction(data))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WriteQuestions);