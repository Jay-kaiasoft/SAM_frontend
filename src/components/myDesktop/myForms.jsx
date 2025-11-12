import React, {useEffect, useState} from "react";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {Tab, Tabs, Link, Button, TextField} from "@mui/material";
import CustomCard from "../shared/commonControlls/customCard";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {deleteCustomForm, getCustomFormCopy, getCustomFormList} from "../../services/customFormService";
import history from "../../history";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {connect} from "react-redux";
import MyFormData from "./myFormData";
import {siteURL} from "../../config/api";
import CopyLink from "../shared/commonControlls/copyLink";
import {TabPanel, a11yProps, handleClickHelp} from "../../assets/commonFunctions";

const MyForms = ({globalAlert,confirmDialog,subUser}) => {
    const [value, setValue] = useState(0);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataDrafted, setMyDataDrafted] = useState([]);
    const [modalLink, setModalLink] = useState(false);
    const toggleLink = () => setModalLink(!modalLink);
    const [link, setLink] = useState({});
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClickDeleteCustomForm = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete selected form?',
            onConfirm: () => {
                deleteCustomForm(id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        if(value === 0){
                            setMyDataPublished(myDataPublished.filter(v => v.cfId !== id));
                        } else {
                            setMyDataDrafted(myDataDrafted.filter(v => v.cfId !== id));
                        }
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
    const handleClickEditDraft = (id) => {
        history.push("/createform?v="+id);
    }
    const handleClickEditPublish = (id) => {
        confirmDialog({
            open: true,
            title: 'This form already publish, so we are creating copy of the form.',
            onConfirm: () => {
                getCustomFormCopy(subUser.memberId,id).then(res => {
                    if (res.status === 200) {
                        history.push("/createform?v="+res.result.cfId);
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
    const handleClickLink = (link) => {
        let jsLink = `<script type="text/javascript" src="${siteURL}/svscript.js?entid=${link.split("/").pop()}&~t~=customform"></script>`;
        let embedLink = `<iframe src="${link}" style="border:none;" height="100%" width="100%"></iframe>`;
        setLink({"link":link,"jsLink":jsLink,"embedLink":embedLink});
        toggleLink();
    }
    useEffect(()=>{
        getCustomFormList(1).then(res => {
            if (res.result) {
                let t = [];
                res.result.customFormList.map((v)=>(
                    t.push({...v,id:v.cfId,name:v.cfFormName})
                ))
                setMyDataPublished(t);
            }
        });
        getCustomFormList(0).then(res => {
            if (res.result) {
                let t = [];
                res.result.customFormList.map((v)=>(
                    t.push({...v,id:v.cfId,name:v.cfFormName})
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
                    <h3 className="d-inline-block mb-0 align-middle">My Forms Design</h3>
                    <div className="icon-wrapper d-inline-block mx-5">
                        <CheckPermissionButton module="custom form" action="add">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/createform")}}>
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("Form/Features/createform/HowtoCreateFormsAndLandingPages.html")}}>
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
                        <Tab label="My Published Forms" {...a11yProps(0)} />
                        <Tab label="My Drafted Forms" {...a11yProps(1)} />
                        <Tab label="My Forms Data" {...a11yProps(2)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        {
                            myDataPublished.length > 0 ?
                                <Row>
                                    <CustomCard myData={myDataPublished} type="myPublishedForms" handleClickDeleteCustomForm={handleClickDeleteCustomForm} handleClickEditPublish={handleClickEditPublish} handleClickLink={handleClickLink} folderName="customform" />
                                </Row>
                            :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create A Form Design</p>
                                        <CheckPermissionButton module="custom form" action="add">
                                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/createform")}}>
                                                <i className="far fa-plus-square"></i>
                                                <div className="bg-green"></div>
                                            </Link>
                                        </CheckPermissionButton>
                                    </Col>
                                </Row>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {
                            myDataDrafted.length > 0 ?
                                <Row>
                                    <CustomCard myData={myDataDrafted} type="myDraftedForms" handleClickDeleteCustomForm={handleClickDeleteCustomForm} handleClickEditDraft={handleClickEditDraft} folderName="customform" />
                                </Row>
                            :
                                <Row style={{height:"50vh"}} className="row align-items-center">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                        <p>Create A Form Design</p>
                                        <CheckPermissionButton module="custom form" action="add">
                                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{history.push("/createform")}}>
                                                <i className="far fa-plus-square"></i>
                                                <div className="bg-green"></div>
                                            </Link>
                                        </CheckPermissionButton>
                                    </Col>
                                </Row>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <MyFormData handleClickLink={handleClickLink} />
                    </TabPanel>
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalLink} toggle={toggleLink}>
                <ModalHeader toggle={toggleLink}>Published Link</ModalHeader>
                <ModalBody>
                    <h4>Form Publishing Options</h4>
                    <p className="font-weight-bold">Put javascript snippet below to into your website home page</p>
                    <TextField
                        variant="standard"
                        name="jsLink"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.jsLink}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="jsLink" iconSelector="copyJsLink"/> }}
                    />
                    <p className="font-weight-bold mt-5">Send Link in Email or Text</p>
                    <TextField
                        variant="standard"
                        name="link"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.link}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="link" iconSelector="copyLink"/> }}
                    />
                    <p className="font-weight-bold mt-5">Embed in Your Page</p>
                    <TextField
                        variant="standard"
                        name="embedLink"
                        multiline
                        fullWidth
                        minRows={2}
                        value={link.embedLink}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        InputProps={{endAdornment: <CopyLink elementName="embedLink" iconSelector="copyEmbedLink"/> }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleLink()} className="ml-3 publishGTCancel">CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser:state.subUser
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
export default connect(mapStateToProps,mapDispatchToProps)(MyForms);