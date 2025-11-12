import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Col, Row} from "reactstrap";
import {Link, Tab, Tabs} from "@mui/material";
import history from "../../history";
import CustomCard from "../shared/commonControlls/customCard";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {deleteAssessmentTemplate, getAssessmentTemplateCopy, getAssessmentTemplateList, getAssessmentTemplateOnlyDataById} from "../../services/assessmentService";
import PreviewAssessment from "../assessment/previewAssessment";
import {TabPanel, a11yProps} from "../../assets/commonFunctions";


const MyAssessmentTemplates = ({globalAlert,confirmDialog,subUser}) => {
    const [value, setValue] = useState(0);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataDrafted, setMyDataDrafted] = useState([]);
    const [showPreviewForm, setShowPreviewForm] = useState(false);
    const [dataListJson, setDataListJson] = useState({});
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClickCloneAssessment = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to copy selected published assessment?',
            onConfirm: () => {
                getAssessmentTemplateCopy(subUser.memberId,id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        getAssessmentTemplateList(1).then(res => {
                            if (res.result) {
                                let t = [];
                                res.result.assessmentTemplate.map((v)=>(
                                    t.push({...v,id:v.atId,name:v.atName})
                                ))
                                setMyDataPublished(t);
                            }
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleClickEditAssessmentTemplate = (id) => {
        history.push("/addmyassessmenttemplates?v="+id);
    }
    const closePreviewForm = () => {
        setShowPreviewForm(false);
    };
    const handleClickPreviewAssessment = (id) => {
        getAssessmentTemplateOnlyDataById(id).then(res => {
            if (res.status === 200) {
                setDataListJson(JSON.parse(res.result.assessmentTemplate.atData));
                setShowPreviewForm(true);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickDeleteDrafted = (id) => {
        confirmDialog({
            open: true,
            title: "Are you sure you want to delete selected drafted assessment?",
            onConfirm: () => {
                deleteAssessmentTemplate(id).then(res => {
                    if (res.status === 200) {
                        setMyDataDrafted(myDataDrafted.filter((v) => v.id !== id));
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        })
                    }
                })
            }
        })
    }
    const handleClickDeletePublished = (id) => {
        confirmDialog({
            open: true,
            title: "Are you sure you want to delete selected published assessment?",
            onConfirm: () => {
                deleteAssessmentTemplate(id).then(res => {
                    if (res.status === 200) {
                        setMyDataPublished(myDataPublished.filter((v) => v.id !== id));
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        })
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        })
                    }
                })
            }
        })
    }
    useEffect(()=>{
        getAssessmentTemplateList(1).then(res => {
            if (res.result) {
                let t = [];
                res.result.assessmentTemplate.map((v)=>(
                    t.push({...v,id:v.atId,name:v.atName})
                ))
                setMyDataPublished(t);
            }
        });
        getAssessmentTemplateList(0).then(res => {
            if (res.result) {
                let t = [];
                res.result.assessmentTemplate.map((v)=>(
                    t.push({...v,id:v.atId,name:v.atName})
                ))
                setMyDataDrafted(t);
            }
        });
        return () => {
            setMyDataPublished([]);
            setMyDataDrafted([]);
        };
    },[]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="d-inline-block mb-0 align-middle">Assessment Design</h3>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmyassessmenttemplates")}}>
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                        <CheckPermissionButton module="assessment category" action="view">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Manage Category" onClick={()=>{history.push("/manageassessmentcategory")}}>
                                <i className="far fa-sitemap"></i>
                                <div className="bg-dark-blue"></div>
                            </Link>
                        </CheckPermissionButton>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text">
                            <i className="far fa-question-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Published Assessment" {...a11yProps(0)} />
                        <Tab label="Drafted Assessment" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        {
                            myDataPublished.length > 0 ?
                                <Row>
                                    <CustomCard myData={myDataPublished} type="myPublishedAssessmentTemplates" handleClickDeletePublished={handleClickDeletePublished} handleClickEditAssessmentTemplate={handleClickEditAssessmentTemplate} handleClickCloneAssessment={handleClickCloneAssessment} handleClickPreviewAssessment={handleClickPreviewAssessment} folderName="assessmenttemplate" />
                                </Row>
                                :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create An Assessment Design</p>
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmyassessmenttemplates")}}>
                                            <i className="far fa-plus-square"></i>
                                            <div className="bg-green"></div>
                                        </Link>
                                    </Col>
                                </Row>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {
                            myDataDrafted.length > 0 ?
                                <Row>
                                    <CustomCard myData={myDataDrafted} type="myDraftedAssessmentTemplates" handleClickDeleteDrafted={handleClickDeleteDrafted} handleClickEditAssessmentTemplate={handleClickEditAssessmentTemplate} folderName="assessmenttemplate" />
                                </Row>
                                :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create An Assessment Design</p>
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmyassessmenttemplates")}}>
                                            <i className="far fa-plus-square"></i>
                                            <div className="bg-green"></div>
                                        </Link>
                                    </Col>
                                </Row>
                        }
                    </TabPanel>
                </Col>
            </Row>
            {
                showPreviewForm && <PreviewAssessment dataListJson={dataListJson} setDataListJson={setDataListJson} togglePreviewForm={closePreviewForm} saveMode={false}/>
            }
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyAssessmentTemplates);