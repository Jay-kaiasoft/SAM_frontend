import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Col, Row} from "reactstrap";
import {Link, Tab, Tabs} from "@mui/material";
import history from "../../history";
import CustomCard from "../shared/commonControlls/customCard";
import {deleteSurveyTemplate, getSurveyTemplateCopy, getSurveyTemplateList, getSurveyTemplateOnlyDataById} from "../../services/surveyService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import PreviewSurvey from "../survey/previewSurvey";
import {TabPanel, a11yProps, handleClickHelp} from "../../assets/commonFunctions";

const MySurveyTemplates = ({globalAlert,confirmDialog,subUser}) => {
    const [value, setValue] = useState(0);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataDrafted, setMyDataDrafted] = useState([]);
    const [showPreviewForm, setShowPreviewForm] = useState(false);
    const [dataListJson, setDataListJson] = useState({});
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClickCloneSurvey = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to copy selected published survey?',
            onConfirm: () => {
                getSurveyTemplateCopy(subUser.memberId,id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        getSurveyTemplateList(1).then(res => {
                            if (res.result) {
                                let t = [];
                                res.result.surveyTemplate.map((v)=>(
                                    t.push({...v,id:v.stId,name:v.stName})
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
    const handleClickEditSurveyTemplate = (id) => {
        history.push("/addmysurveytemplates?v="+id);
    }
    const closePreviewForm = () => {
        setShowPreviewForm(false);
    };
    const handleClickPreviewSurvey = (id) => {
        getSurveyTemplateOnlyDataById(id).then(res => {
            if (res.status === 200) {
                setDataListJson(JSON.parse(res.result.surveyTemplate.stData));
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
            title: "Are you sure you want to delete selected drafted survey?",
            onConfirm: () => {
                deleteSurveyTemplate(id).then(res => {
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
            title: "Are you sure you want to delete selected published survey?",
            onConfirm: () => {
                deleteSurveyTemplate(id).then(res => {
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
        getSurveyTemplateList(1).then(res => {
            if (res.result) {
                let t = [];
                res.result.surveyTemplate.map((v)=>(
                    t.push({...v,id:v.stId,name:v.stName})
                ))
                setMyDataPublished(t);
            }
        });
        getSurveyTemplateList(0).then(res => {
            if (res.result) {
                let t = [];
                res.result.surveyTemplate.map((v)=>(
                    t.push({...v,id:v.stId,name:v.stName})
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
                    <h3 className="d-inline-block mb-0 align-middle">Survey Design</h3>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmysurveytemplates")}}>
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                        <CheckPermissionButton module="survey category" action="view">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Manage Category" onClick={()=>{history.push("/managesurveycategory")}}>
                                <i className="far fa-sitemap"></i>
                                <div className="bg-dark-blue"></div>
                            </Link>
                        </CheckPermissionButton>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("Survey/Features/Createsurvey/HowtoCreateYourFirstSurvey.html")}}>
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
                        <Tab label="Published Survey" {...a11yProps(0)} />
                        <Tab label="Drafted Survey" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        {
                            myDataPublished.length > 0 ?
                                <Row>
                                    <CustomCard myData={myDataPublished} type="myPublishedSurveyTemplates" handleClickDeletePublished={handleClickDeletePublished} handleClickEditSurveyTemplate={handleClickEditSurveyTemplate} handleClickCloneSurvey={handleClickCloneSurvey} handleClickPreviewSurvey={handleClickPreviewSurvey}  folderName="surveytemplate" />
                                </Row>
                            :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create A Survey Design</p>
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmysurveytemplates")}}>
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
                                    <CustomCard myData={myDataDrafted} type="myDraftedSurveyTemplates" handleClickDeleteDrafted={handleClickDeleteDrafted} handleClickEditSurveyTemplate={handleClickEditSurveyTemplate} folderName="surveytemplate" />
                                </Row>
                            :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create A Survey Design</p>
                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/addmysurveytemplates")}}>
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
                showPreviewForm && <PreviewSurvey dataListJson={dataListJson} setDataListJson={setDataListJson} togglePreviewForm={closePreviewForm} saveMode={false} setFormData={(obj)=>{}}/>
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
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MySurveyTemplates);