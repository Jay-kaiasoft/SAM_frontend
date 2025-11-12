import React, { useState, useRef, createRef, Fragment, useEffect, useCallback } from 'react';
import { Row, Col, Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputField from '../shared/commonControlls/inputField.jsx';
import DropDownControls from '../shared/commonControlls/dropdownControl';
import { Switch, Button, Tabs, Tab } from '@mui/material';
import { getsecurityquestionstab } from '../../services/profileService.js'
import { connect } from 'react-redux';
import { updateSecurity, userLoggedIn } from '../../actions/userActions.js';
import {getSecurityQuestion} from "../../services/commonService";
import { setGlobalAlertAction } from '../../actions/globalAlertActions.js';
import { siteURL, websiteTitleWithExt } from '../../config/api.js';
import AuthIDComponent from '@authid/react-component';
import { a11yProps, getHostData, TabPanel } from '../../assets/commonFunctions.js';
import { authenticatorGenerate, authenticatorVerify, registrationAuthId, updateAuthenticator } from '../../services/userService.js';
import { setSubUserAction } from '../../actions/subUserActions.js';
import OTPInput from 'react-otp-input';


const Security = (props) => {
    const { user, subUser } = props
    const [data, setData] = useState({});
    const [question, setQuestion] = useState([]);
    const [twostepauth, setTwostepauth] = useState(false);
    const [value, setValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const fetchLookUp = () => {
        getSecurityQuestion().then(res => {
            if (res.result && res.result.securityQuestion) {
                let questation = []
                res.result.securityQuestion.map(x => (
                    questation.push({
                        "key": String(x.secId),
                        "value": x.secQuestion
                    })
                ));
                setQuestion(questation)
            }
        })
    }
    const handleSaveData = (loginPreference) => {
        let temp = subUser.memberId > 0 ? subUser : user;
        let requestData = {
            ...temp,
            "memberId": temp.memberId,
            "is2FA": twostepauth,
            "secQus1": Number(data.secQus1),
            "secAns1": data.secAns1,
            "secQus2": Number(data.secQus2),
            "secAns2": data.secAns2,
            "secQus3": Number(data.secQus3),
            "secAns3": data.secAns3,
            "loginPreference": loginPreference
        }
        if (twostepauth === true) {
            requestData.is2FA = Number(1)
        }else{
            requestData.is2FA = Number(0)
        }
        props.setSecurity(requestData);
    }
    
    useEffect(() => {
        fetchLookUp();
        getsecurityquestionstab().then(res => {
            if (res.result.member.is2FA === 1) {
                setTwostepauth(true);
            }
            setData(res.result.member);
        });
    }, []);
    
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center'>Security</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='mx-auto'>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChangeTab}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Security Questions" {...a11yProps(0)} />
                        <Tab label="Login Preference" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                    <TabPanel value={value} index={0}>
                        <SecurityQuestions
                            data={data}
                            props={props}
                            handleChange={handleChange}
                            question={question}
                            twostepauth={twostepauth}
                            setTwostepauth={setTwostepauth}
                            handleSaveData={handleSaveData}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <LoginPreference
                            data={data}
                            props={props}
                            user={user}
                            subUser={subUser}
                            handleChange={handleChange}
                            handleSaveData={handleSaveData}
                        />
                    </TabPanel>
                </Col>
            </Row>
        </Fragment>
    )
}
const  SecurityQuestions = ({data, props, handleChange, question, twostepauth, setTwostepauth, handleSaveData}) => {
    const inputRefs = useRef([createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);

    const handleSwitchChange = event => {
        setTwostepauth(event.target.checked)
    }
    const submitForm = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        if((Number(data.secQus1) === Number(data.secQus2)) || (Number(data.secQus1) === Number(data.secQus3)) || (Number(data.secQus2) === Number(data.secQus3))){
            props.globalAlert({
                type: "Error",
                text: "Please select different questions.",
                open: true
            });
            return false;
        }
        if((data.secAns1.toLowerCase() === data.secAns2.toLowerCase()) || (data.secAns1.toLowerCase() === data.secAns3.toLowerCase()) || (data.secAns2.toLowerCase() === data.secAns3.toLowerCase())){
            props.globalAlert({
                type: "Error",
                text: "Please select different answers.",
                open: true
            });
            return false;
        }
        handleSaveData(data?.loginPreference);
    }

    useEffect(() => {
        if (data.is2FA === 1) {
            setTwostepauth(true);
        }
    }, [data]);

    return (
        <Form onSubmit={submitForm}>
                <Row>
                    <Col sm="12" md="6" className='mx-auto mt-5'>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[0]}
                                name="secQus1"
                                label="Security Question One"
                                onChange={handleChange}
                                validation={"required"}
                                value={String(data?.secQus1 || "")}
                                dropdownList={question}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="secAns1"
                                name="secAns1"
                                label="Question One Answer"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.secAns1 || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[1]}
                                name="secQus2"
                                label="Security Question Two"
                                onChange={handleChange}
                                validation={"required"}
                                value={String(data?.secQus2 || "")}
                                dropdownList={question}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[1]}
                                type="text"
                                id="secAns2"
                                name="secAns2"
                                label="Question Two Answer"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.secAns2 || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[2]}
                                name="secQus3"
                                label="Security Question Three"
                                onChange={handleChange}
                                validation={"required"}
                                value={String(data?.secQus3 || "")}
                                dropdownList={question}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[2]}
                                type="text"
                                id="secAns3"
                                name="secAns3"
                                label="Question Three Answer"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.secAns3 || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <Row>
                                <Col md={5} className="pt-3"><h6>2 Step Authentication</h6></Col>
                                <Col md={3}><Switch color="primary" checked={twostepauth} onChange={handleSwitchChange} name='twostepauth' /></Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    
                    <Col sm="12" md="12" className='text-center'>
                        <Button type="submit" variant="contained" className="mt-3" color="primary">UPDATE</Button>
                    </Col>
                </Row>
            </Form>
    )
}
const LoginPreference = ({data, props, user, subUser, handleChange, handleSaveData}) => {
    let tempUser = subUser.memberId > 0 ? subUser : user;
    const [finalUrl, setFinalUrl] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [otp, setOtp] = useState("");
    const [authenticatorName, setAuthenticatorName] = useState("");

    const handleClickAuthenticator = (value) => {
        if(value === "authidAuthenticator" && (typeof tempUser.authidOperationId === "undefined" || tempUser.authidOperationId === "" || tempUser.authidOperationId === null)){
            getHostData().then((res1) => {
                let d = 2;
                if(res1.data.address.country === "United States"){
                    d = 2;
                } else if(res1.data.address.country === "India"){
                    d = 21;
                }
                registrationAuthId(tempUser.encMemberId, d).then(res => {
                    if (res.status === 200) {
                        handleChange("authidOperationId",res.result.operationId);
                        handleChange("oneTimeSecret",res.result.oneTimeSecret);
                        handleChange("authidAccountNumber",res.result.accountNumber);
                        setFinalUrl("https://id.authid.ai/?i="+res.result.operationId+"&s="+res.result.oneTimeSecret);
                    } else {
                        props.globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            })
        } else if((value === "googleAuthenticator" && (typeof tempUser.googleAuthenticatorSecret === "undefined" || tempUser.googleAuthenticatorSecret === "" || tempUser.googleAuthenticatorSecret === null)) || (value === "microsoftAuthenticator" && (typeof tempUser.microsoftAuthenticatorSecret === "undefined" || tempUser.microsoftAuthenticatorSecret === "" || tempUser.microsoftAuthenticatorSecret === null))){
            authenticatorGenerate(tempUser.username).then(res => {
                if (res.status === 200) {
                    handleChange("secret",res.result.secret);
                    handleChange("tempLoginPreference",value);
                    setQrUrl(res.result.qrUrl);
                    if(value === "googleAuthenticator"){
                        setAuthenticatorName("Google Authenticator");
                    } else {
                        setAuthenticatorName("Microsoft Authenticator");
                    }
                    setOtp("");
                    toggleModalOtp();
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        } else {
            handleChange("loginPreference",value);
            handleSaveData(value);
        }
    }
    const handleClickClose = () => {
        setFinalUrl(null);
    }
    const handleClickVerify = () => {
        let requestData = {
            "secret": data.secret,
            "code": otp,
            "username": tempUser.username,
            "loginPreference": data.tempLoginPreference
        };
        authenticatorVerify(requestData).then(res => {
            if (res.status === 200) {
                let title="";
                if(data.tempLoginPreference === "googleAuthenticator"){
                    title="googleAuthenticatorSecret";
                } else {
                    title="microsoftAuthenticatorSecret";
                }
                handleChange("loginPreference", data.tempLoginPreference);
                handleSaveData(data.tempLoginPreference);
                if(subUser.memberId > 0){
                    sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, [title]: data.secret }));
                    props.setSubUserAction({ ...subUser, [title]: data.secret });
                } else {
                    sessionStorage.setItem('user', JSON.stringify({ ...user, [title]: data.secret }));
                    props.userLoggedIn({ ...user, [title]: data.secret });
                }
                toggleModalOtp();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleMessage = useCallback((event) => {
        if(event.data.pageName === "verifiedPage"){
            if (event.data.success) {
                let requestData = {
                    "memberId": tempUser.memberId,
                    "authidOperationId": data.authidOperationId,
                    "authidAccountNumber": data.authidAccountNumber
                }
                updateAuthenticator(requestData).then(res => {
                    if (res.status === 200) {
                        handleChange("loginPreference", "authidAuthenticator");
                        handleSaveData("authidAuthenticator");
                        if(subUser.memberId > 0){
                            props.setSubUserAction({ ...subUser, "authidOperationId": data.authidOperationId });
                            sessionStorage.setItem('subUser', JSON.stringify({ ...subUser, "authidOperationId": data.authidOperationId }));
                        } else {
                            props.userLoggedIn({ ...user, "authidOperationId": data.authidOperationId });
                            sessionStorage.setItem('user', JSON.stringify({ ...user, "authidOperationId": data.authidOperationId }));
                        }
                    } else {
                        props.globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                    setFinalUrl(null);
                });
            } else {
                props.globalAlert({
                    type: "Error",
                    text: "An error occurred. Please try again.",
                    open: true
                });
            }
        }
    },[data]);

    useEffect(()=>{
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        }
    },[data]);

    return (
        <>
            <Row>
                <Col sm="12" md="10" className='mx-auto mt-5'>
                    <div className="d-flex justify-content-center">
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${data?.loginPreference === "microsoftAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("microsoftAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/microsoft-authenticator.svg"} alt="Microsoft Authenticator" />
                            <p className="mb-0">Microsoft Authenticator</p>
                        </div>
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${data?.loginPreference === "googleAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("googleAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/google-authenticator.svg"} alt="Google Authenticator" />
                            <p className="mb-0">Google Authenticator</p>
                        </div> 
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 ${data?.loginPreference === "authidAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("authidAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/authid-authenticator.svg"} alt="Biomatric Authenticator" />
                            <p className="mb-0">Biomatric Authenticator</p>
                        </div>
                        <div className={`authenticator-box p-3 cursor-pointer ${data?.loginPreference === "passwordAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("passwordAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/password-authenticator.svg"} alt="Password Authenticator" />
                            <p className="mb-0">Password</p>
                        </div>
                    </div>
                </Col>
            </Row>
            {
                finalUrl && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                    <i id='authenticator-close-icon' className='far fa-times font-size-20' onClick={()=>{handleClickClose();}}></i>
                    <div className='w-100 d-flex justify-content-between text-black'>
                        <div className='w-25 ml-3 text-center d-flex flex-column align-items-center'>
                            <h5>Did your camera not launch?</h5>
                            <p className="d-flex align-items-center font-weight-bold"><i className="fab fa-apple fa-2x pr-2"></i>iPhone Setting</p>
                            <p className="word-break-keep-all mb-0">Go to <strong>Settings</strong></p>
                            <p className="word-break-keep-all">Privacy & Security -&gt; Camera</p>
                            <img src={siteURL+"/img/ipone-camera-instruction.jpg"} alt="iPhone" className='shadow w-75' />
                        </div>
                        <div className='w-25 mr-3 text-center d-flex flex-column align-items-center'>
                            <h5>Did your camera not launch?</h5>
                            <p className="d-flex align-items-center font-weight-bold"><i className="fab fa-android fa-2x pr-2"></i>Android Setting</p>
                            <p className="word-break-keep-all mb-0">Go to <strong>Settings</strong></p>
                            <p className="word-break-keep-all mb-0">Apps -&gt; Camera</p>
                            <p className="word-break-keep-all mb-0">Permissions -&gt; Camera</p>
                            <p className="word-break-keep-all">See all apps with this permission -&gt; Chrome</p>
                            <img src={siteURL+"/img/android-camera-instruction.jpg"} alt="Android" className='shadow w-75' />
                        </div>
                    </div>
                    <AuthIDComponent
                        url={finalUrl}
                        webauth={true}
                    />
                </div>
            }
            <Modal isOpen={modalOtp}>
                <ModalHeader toggle={toggleModalOtp}>{authenticatorName}</ModalHeader>
                <ModalBody className="m-4">
                    <p className='text-center'>Please open {authenticatorName} App and scan QR code</p>
                    <div className='d-flex justify-content-center mb-5'>
                        <img src={qrUrl} alt='QR Link' />
                    </div>
                    <p className='text-center'>Please tap the name {websiteTitleWithExt} and enter code below</p>
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        inputStyle={{
                            width: 50,
                            height: 41,
                            borderWidth: 1,
                            borderColor: "#898989",
                            borderRadius: 3,
                            fontSize: 14,
                            lineHeight: 17,
                            color: "#898989",
                            backgroundColor: "#F3F3FF",
                            outline: "none"
                        }}
                        containerStyle={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                        inputType="tel"
                        renderInput={(props) => <input {...props} inputMode="tel" />}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-3" disabled={otp?.trim() === ''} onClick={()=>{setOtp("");}}>CLEAR</Button>
                    <Button variant="contained" color="primary" disabled={otp?.length < 6} onClick={()=>{handleClickVerify();}}>Verify</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        setSecurity: (data) => {
            dispatch(updateSecurity(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        }
    }
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Security);