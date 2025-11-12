import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Drawer, IconButton, InputAdornment, TextField, } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { Row, Col } from "reactstrap";
import { getMyPagesList } from '../../services/myDesktopService';
import { myPageImageUrl } from '../../config/api';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import TimerComponent from './timerComponent';
import FromInfo from './screens/fromInfo';
import { searchIconTransparent } from '../../assets/commonFunctions';

const EmailAndTimerComponent = ({
    emailTimerModal,
    setEmailTimerModal,
    handleClickSubmitTimer,
    handleClickSubmitEmailTimer,
    nodeType,
    activeNodeData,
    globalAlert
}) => {
    const [data, setData] = useState({});
    const [emailTemplate, setEmailTemplate] = React.useState([]);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [search, setSearch] = useState("");

    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const getAllMyPageslList = () => {
        getMyPagesList(2).then(res => {
            if (res.result) {
                setEmailTemplate(res.result.mypage);
                setMyDataPublished(res.result.mypage);
            }
        });
    }

    const isDataValid = () => {
        if (nodeType === "Email" && !data?.emailTemplateSelected) {
            globalAlert({
                type: "Error",
                text: "Please select email template",
                open: true
            })
            return false
        } else if (nodeType === "Email" && !data?.fromEmail) {
            globalAlert({
                type: "Error",
                text: "Please Enter From Email",
                open: true
            })
            return
        } else if (nodeType === "Email" && !data?.fromName) {
            globalAlert({
                type: "Error",
                text: "Please Enter From Name",
                open: true
            })
            return
        } else if (nodeType === "Email" && !data?.subject) {
            globalAlert({
                type: "Error",
                text: "Please Enter Email Subject",
                open: true
            })
            return
        }
        if (activeNodeData?.type === "Email" && activeNodeData?.data?.emailTemplateSelected === undefined && data?.value) {
            if (!data?.value || isNaN(data?.value) || (nodeType !== "Email" && parseInt(data?.value) <= 0)) {
                globalAlert({
                    type: "Error",
                    text: "Please enter valid value",
                    open: true
                })
                return false
            } else if (!data?.duration) {
                globalAlert({
                    type: "Error",
                    text: "Please select duration",
                    open: true
                })
                return false
            }
        }
        if(nodeType === "Timer") {
            if(data.duration === "" || typeof data.duration === "undefined" || data.duration === null) {
                globalAlert({
                    type: "Error",
                    text: "Please select duration",
                    open: true
                })
                return false;
            }
            if(data.value === "" || typeof data.value === "undefined" || data.value === null) {
                globalAlert({
                    type: "Error",
                    text: "Please Enter Time",
                    open: true
                })
                return false;
            }
        }
        return true
    }
    const handleClickSearch = () => {
        if(search === ""){
            setEmailTemplate(myDataPublished);
        } else {
            setEmailTemplate( myDataPublished.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())}) )
        }
    }

    useEffect(() => {
        getAllMyPageslList();
        return () => {
            setEmailTemplate([]);
            setMyDataPublished([]);
            setSearch("");
        };
    }, [emailTimerModal]);

    useEffect(() => {
        setData(activeNodeData?.data)
    }, [activeNodeData?.data])

    return (
        <Drawer open={emailTimerModal} anchor={'right'} className="ComponentSidebarWrapper">
            <div className='cross-icon-container'>
                <i className="far fa-times fa-lg" onClick={() => { setEmailTimerModal(!emailTimerModal) }}></i>
            </div>
            {nodeType === "Email" ?
                <div className="p-4 width-40vw">
                    <Row>
                        <Col>
                            <p className='heading-style'>Select Email Template</p>
                            <div className='text-right pr-4'>
                                <TextField
                                    placeholder="Search"
                                    name="search"
                                    type="text"
                                    value={search}
                                    onChange={(event)=>{setSearch(event.target.value);}}
                                    variant="standard"
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </div>
                            <div className='p-4 email-template-card-container'>
                                {emailTemplate.map((template, index) => {
                                    return (
                                        <div key={index}
                                            className={`email-template-card mb-4 ${template.mpId === data?.emailTemplateSelected?.mpId ? "active-tmpt" : null}`}
                                            onClick={() => {
                                                handleDataChange("emailTemplateSelected", template)
                                                handleDataChange("label", template?.mpName)
                                            }}>
                                            <div className="email-template-card-img-wrapper">
                                                <img className="email-template-card-img-top" src={myPageImageUrl.replace("{{memberId}}", template.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", template.mpId)} alt="tile" />
                                            </div>
                                            <div className="email-template-card-body">
                                                <div className="email-template-card-title">{(template.mpType === 2 && template.groupName !== null) ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={template.groupName}></i> : null}{template.mpName}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>
                    {activeNodeData?.type === "Email" && activeNodeData?.data?.emailTemplateSelected === undefined && <div className="mb-4 px-4">
                        <TimerComponent data={data} handleDataChange={handleDataChange} />
                    </div>}
                    <div className="px-4">
                        <FromInfo data={data} handleDataChange={handleDataChange} callFrom={"Email"} />
                    </div>
                    <div className="d-flex justify-content-center w-100 mt-5">
                        <Button variant="contained" onClick={() => {
                            if (!isDataValid()) {
                                return
                            }
                            handleClickSubmitEmailTimer({ emailTemplateSelected: data.emailTemplateSelected, label: data?.emailTemplateSelected?.mpName, ...data })
                        }}>SUBMIT</Button>
                    </div>
                </div> :
                <div className="p-4 d-flex flex-column justify-content-between h-100 width-40vw">
                    <TimerComponent data={data} handleDataChange={handleDataChange} />
                    <div className="d-flex justify-content-center w-100 mt-5">
                        <Button variant="contained" onClick={() => {
                            if (!isDataValid()) {
                                return
                            }
                            handleClickSubmitTimer({
                                duration: data.duration,
                                value: data.value
                            })
                        }}>SUBMIT</Button>
                    </div>
                </div>
            }
        </Drawer>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(null, mapDispatchToProps)(EmailAndTimerComponent);