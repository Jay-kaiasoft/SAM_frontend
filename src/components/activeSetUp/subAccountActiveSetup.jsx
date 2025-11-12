import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Button, IconButton, InputAdornment, Box, AppBar, Toolbar, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { siteURL, staticUrl, websiteTitleWithExt } from "../../config/api";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { getSecurityQuestion } from "../../services/commonService";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { activeSubaccount, authenticatorGenerate, authenticatorVerify, checkActiveSubaccount, checkUsername, registration } from "../../services/userService";
import History from './../../history';
import { easUrlEncoder, getHostData, QontoConnector, QontoStepIcon } from "../../assets/commonFunctions";
import Footer from "../shared/footer/footer";
import styles from "../../assets/styles/componentStyles.js";
import AuthIDComponent from "@authid/react-component";
import OTPInput from "react-otp-input";

const SubAccountActiveSetup = ({globalAlert, location}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = queryString.get("v") ? queryString.get("v") : "";
    const inputRefsDetails = useRef([createRef(), createRef(), createRef()]);
    const inputRefsSecurity = useRef([createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);
    const [data, setData] = useState({});
    const [question, setQuestion] = useState([]);
    const [num, setNum] = useState(0);
    const [low, setLow] = useState(0);
    const [upp, setUpp] = useState(0);
    const [spe, setSpe] = useState(0);
    const [len, setLen] = useState(0);
    const [showPassword, setShowPassword] = useState({"newPassword": false, "confirmPassword": false});
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["1", "2", "3"];
    const [finalUrl, setFinalUrl] = useState(null);
    const [showCheckPasswordIcon, setShowCheckPasswordIcon] = useState("");
    const [qrUrl, setQrUrl] = useState(null);
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [otp, setOtp] = useState("");
    const [authenticatorName, setAuthenticatorName] = useState("");

    const handleClickShowPassword = (name) => {
        let value = !showPassword[name];
        setShowPassword(prev => ({ ...prev, [name]: value }));
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleChange = (name, value) => {
        if (name === "password" || name === "confirmnewpassword") {
            value=value.replace(/\s/gi, "");
        }
        if(name === "loginPreference"){
            if(value === "googleAuthenticator" || value === "microsoftAuthenticator") {
                authenticatorGenerate(data?.username).then(res => {
                    if (res.status === 200) {
                        setQrUrl(res.result.qrUrl);
                        if(value === "googleAuthenticator"){
                            setAuthenticatorName("Google Authenticator");
                        } else {
                            setAuthenticatorName("Microsoft Authenticator");
                        }
                        setData(prev => ({ ...prev, "secret": res.result.secret, "loginPreference": value}));
                        toggleModalOtp();
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            } else {
                setData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
        if (name === "password") {
            checkValidationPass(value);
        }
    }
    const checkValidationPass = (str) => {
        let upperCase = new RegExp('[A-Z]','g');
        let lowerCase = new RegExp('[a-z]','g');
        let numbers = new RegExp('[0-9]','g');
        let splChars = new RegExp("[,*\":<>\\[\\]{}();@&$#%!]", "g");
        let num = 0;
        let low = 0;
        let upp = 0;
        let spe = 0;
        let len = 0;
        if (str.match(numbers)) {
            num = 1;
            setNum(1);
        } else {
            num = 0;
            setNum(0);
        }
        if (str.match(lowerCase)) {
            low = 1;
            setLow(1);
        } else {
            low = 0;
            setLow(0);
        }
        if (str.match(upperCase)) {
            upp = 1;
            setUpp(1);
        } else {
            upp = 0;
            setUpp(0);
        }
        if (str.match(splChars)) {
            spe = 1;
            setSpe(1);
        } else {
            spe = 0;
            setSpe(0);
        }
        if (str.length > 7) {
            len = 1;
            setLen(1);
        } else {
            len = 0;
            setLen(0);
        }
        if (num === 1 && low === 1 && upp === 1 && spe === 1 && len === 1) {
            return true;
        } else {
            return false;
        }
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
    const handleNext = () => {
        if(activeStep === 0){
            let isValid = true;
            for (let i = 0; i < inputRefsDetails.current.length; i++) {
                const valid = inputRefsDetails.current[i].current.validate()
                if (!valid) {
                    isValid = false
                }
            }
            if (!isValid) {
                return
            }
            if(!checkValidationPass(data.password)){
                globalAlert({
                    type: "Error",
                    text: "Invalid new password format.\nPlease use suggested combination in password",
                    open: true
                });
                return false;
            }
            if (data.password !== data.confirmnewpassword) {
                globalAlert({
                    type: "Error",
                    text: "New Password and Confirm Password not Match",
                    open: true
                });
                return false;
            }
        } else if(activeStep === 2){
            let isValid = true;
            for (let i = 0; i < dropDownRefs.current.length; i++) {
                const valid = dropDownRefs.current[i].current.validateDropDown()
                if (!valid) {
                    isValid = false
                }
            }
            for (let i = 0; i < inputRefsSecurity.current.length; i++) {
                const valid = inputRefsSecurity.current[i].current.validate()
                if (!valid) {
                    isValid = false
                }
            }
            if (!isValid) {
                return
            }
            if(typeof data.loginPreference === "undefined" || data.loginPreference === "" || data.loginPreference === null){
                globalAlert({
                    type: "Error",
                    text: `Please select login preference`,
                    open: true
                });
                return;
            }
            if((Number(data.secQus1) === Number(data.secQus2)) || (Number(data.secQus1) === Number(data.secQus3)) || (Number(data.secQus2) === Number(data.secQus3))){
                globalAlert({
                    type: "Error",
                    text: "Please select different questions.",
                    open: true
                });
                return false;
            }
            if((data.secAns1.toLowerCase() === data.secAns2.toLowerCase()) || (data.secAns1.toLowerCase() === data.secAns3.toLowerCase()) || (data.secAns2.toLowerCase() === data.secAns3.toLowerCase())){
                globalAlert({
                    type: "Error",
                    text: "Please select different answers.",
                    open: true
                });
                return false;
            }
            activeSubaccount(data).then(res => {
                if (res.status === 200) {
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    History.push("/");
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
            return false;
        }
        setActiveStep((prev) => {return prev + 1});
    }
    const handleBack = () => {
        setActiveStep((prev) => {return prev - 1});
    }
    const handleCancel = () => {
        History.push("/");
    }
    const handleProceed = () => {
        getHostData().then((res) => {
            let d = 2;
            if(res.data.address.country === "United States"){
                d = 2;
            } else if(res.data.address.country === "India"){
                d = 21;
            }
            let requestData = {
                ...data,
                "authidDocumentType":d,
                "registrationStep":1
            }
            registration(requestData).then(res1 => {
                if (res1.status === 200) {
                    handleChange("authidOperationId", res1.result.operationId);
                    handleChange("authidAccountNumber", res1.result.accountNumber);
                    handleChange("authidDocumentType", d);
                    setFinalUrl("https://id.authid.ai/?i=" + res1.result.operationId + "&s=" + res1.result.oneTimeSecret);
                } else {
                    globalAlert({
                        type: "Error",
                        text: res1.message,
                        open: true
                    });
                }
            });
        })
    }
    const handleAuthenticatorSuccess = () => {
        setActiveStep((prev) => {return prev + 1});
    }
    const handleAuthenticatorFailure = () => {
        globalAlert({
            type: "Error",
            text: "An error occurred. Please try again.",
            open: true
        });
    }
    const handleCheckUsername = async(username) => {
        if(username === ""){
            return false;
        }
        setShowCheckPasswordIcon("");
        const resC = await checkUsername(username, data?.memberId || 0);
        if (resC.status !== 200) {
            globalAlert({
                type: "Error",
                text: resC.message,
                open: true,
            });
            setShowCheckPasswordIcon("no");
            return false;
        } else {
            setShowCheckPasswordIcon("yes");
        }
    }
    const handleClickClose = () => {
        setFinalUrl(null);
    }
    
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Row>
                        <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto">
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsDetails.current[0]}
                                    type="text"
                                    id="username"
                                    name="username"
                                    label="Username"
                                    onChange={(name, value)=>{handleChange(name, value.replaceAll(/[^a-zA-Z0-9_@.]/g, ""))}}
                                    onBlur={(e)=>{handleCheckUsername(e.target.value.replaceAll(/[^a-zA-Z0-9_@.]/g, ""))}}
                                    validation={"required"}
                                    value={data?.username || ""}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                {showCheckPasswordIcon === "yes" ? <i className="far fa-check font-size-18 text-green"></i> : showCheckPasswordIcon === "no" ? <i className="far fa-times font-size-18 text-red"></i> : ""}
                                            </InputAdornment>
                                    }}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsDetails.current[1]}
                                    type={showPassword.newPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    label="New password"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.password || ""}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility" onClick={()=>{handleClickShowPassword("newPassword")}} onMouseDown={handleMouseDownPassword} >
                                                    {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </FormGroup>
                            <FormGroup className='m-0'>
                                <div className="password-requirements">
                                    <ul className="padding-all-0">
                                        <li className={`lowercase-char ${(low === 0) ? "completed" : ""}`}>One lowercase character</li>
                                        <li className={`special-char ${(spe === 0) ? "completed" : ""}`}>One special character</li>
                                        <li className={`uppercase-char ${(upp === 0) ? "completed" : ""}`}>One uppercase character</li>
                                        <li className={`8-char ${(len === 0) ? "completed" : ""}`}>Eight characters minimum</li>
                                        <li className={`number-char ${(num === 0) ? "completed" : ""}`}>One number</li>
                                    </ul>
                                </div>
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsDetails.current[2]}
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    id="confirmnewpassword"
                                    name="confirmnewpassword"
                                    label="Confirm New Password"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.confirmnewpassword || ""}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility" onClick={()=>{handleClickShowPassword("confirmPassword")}} onMouseDown={handleMouseDownPassword} >
                                                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <Row>
                        <Col xs={10} sm={10} md={6} lg={6} xl={6} className="mx-auto text-center">
                            <h3 className="my-3">Identity Verification Required - Biometric Check</h3>
                            <div className="d-flex">
                                <div className="pr-5"><img src={siteURL+"/img/authid-signup.svg"} style={{width:"170px"}} alt="Authid Signup" /></div>
                                <div>
                                    <p className="text-left">
                                        To ensure the security of both your account and our platform, we need to confirm your identity due to the advanced capabilities of our tools. {websiteTitleWithExt} uses the industry-leading biometric solution <a href="https://www.authid.ai/" target="_blank" rel="noreferrer">AuthID</a> for verification. You'll need a valid <strong>Driver's License</strong> and your <strong>cell phone</strong> to complete the process.
                                    </p>
                                    <p className="text-left">
                                        You can choose a one-time biometric verification or continue using a traditional password for future logins - though we recommend going passwordless for a faster and more secure experience.
                                    </p>
                                </div>
                            </div>
                            <div className="my-4">
                                <div><strong>Powered by</strong></div>
                                <div className="d-flex align-items-center justify-content-center">
                                    <div><a href="https://www.authid.ai/" target="_blank" rel="noreferrer"><img src={siteURL+"/img/authid-logo.svg"} style={{height:"70px"}} alt="Authid" /></a></div>
                                    <div><a href="https://www.kaiasoft.com/" target="_blank" rel="noreferrer"><img src={siteURL+"/img/kaiasoft-logo.png"} className="w-75" alt="Kaiasoft" /></a></div>
                                </div>
                            </div>
                            <p className="mb-3">
                                Would you like to enable password less Authentication for your SaaS contact <a href="https://kaiasoft.com/contact.php" target="_blank" rel="noreferrer">Kaiasoft.com</a>
                            </p>
                            {
                                (finalUrl) && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                                    <i id='authenticator-close-icon' className='far fa-times font-size-20' onClick={()=>{handleClickClose();}}></i>
                                    <AuthIDComponent
                                        url={finalUrl}
                                        webauth={true}
                                    />
                                </div>
                            }
                        </Col>
                    </Row>
                );
            case 2:
                return (
                    <>
                        <Row>
                            <Col xs={10} sm={10} md={8} lg={8} xl={8} className="mx-auto">
                                <h5 className="text-center my-4">Choose your Login Preference</h5>
                                <div className="d-flex justify-content-center">
                                    <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${data?.loginPreference === "microsoftAuthenticator" ? "active" : ""}`} onClick={()=>handleChange("loginPreference", "microsoftAuthenticator")}>
                                        <img className="authenticator-icon" src={siteURL+"/img/microsoft-authenticator.svg"} alt="Microsoft Authenticator" />
                                        <p className="mb-0">Microsoft Authenticator</p>
                                    </div>
                                    <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${data?.loginPreference === "googleAuthenticator" ? "active" : ""}`} onClick={()=>handleChange("loginPreference", "googleAuthenticator")}>
                                        <img className="authenticator-icon" src={siteURL+"/img/google-authenticator.svg"} alt="Google Authenticator" />
                                        <p className="mb-0">Google Authenticator</p>
                                    </div>
                                    <div className={`authenticator-box p-3 cursor-pointer mr-3 ${data?.loginPreference === "authidAuthenticator" ? "active" : ""}`} onClick={()=>{handleChange("loginPreference", "authidAuthenticator")}}>
                                        <img className="authenticator-icon" src={siteURL+"/img/authid-authenticator.svg"} alt="Biomatric Authenticator" />
                                        <p className="mb-0">Biomatric Authenticator</p>
                                    </div>
                                    <div className={`authenticator-box p-3 cursor-pointer ${data?.loginPreference === "passwordAuthenticator" ? "active" : ""}`} onClick={()=>{handleChange("loginPreference", "passwordAuthenticator")}}>
                                        <img className="authenticator-icon" src={siteURL+"/img/password-authenticator.svg"} alt="Password Authenticator" />
                                        <p className="mb-0">Password</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto">
                                <h5 className='text-center my-4'>Security Questions</h5>
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
                                        ref={inputRefsSecurity.current[0]}
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
                                        ref={inputRefsSecurity.current[1]}
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
                                        ref={inputRefsSecurity.current[2]}
                                        type="text"
                                        id="secAns3"
                                        name="secAns3"
                                        label="Question Three Answer"
                                        onChange={handleChange}
                                        validation={"required"}
                                        value={data?.secAns3 || ""}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </>
                );

            default:
                return "unknown step";
        }
    }
    const handleClickVerify = () => {
        let requestData = {
            "secret": data?.secret,
            "code": otp,
            "username": data?.username,
            "loginPreference": data?.loginPreference
        };
        authenticatorVerify(requestData).then(res => {
            if (res.status === 200) {
                toggleModalOtp();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    useEffect(() => {
        fetchLookUp();
        window.addEventListener("message", (event) => {
            if(event.data.pageName === "verifiedPage"){
                if (event.data.success) {
                    handleAuthenticatorSuccess();
                } else {
                    handleAuthenticatorFailure();
                }
            }
        });
    },[]);
    useEffect(() => {
        if(typeof id === "undefined" || id === "" || id === null){
            globalAlert({
                type: "Error",
                text: "Something went wrong with Link.\nPlease contact your Administrator",
                open: true
            });
            return false;
        } else {
            checkActiveSubaccount(id).then(res => {
                if (res.status === 200) {
                    setData((prev)=>{
                        return {
                            ...prev,
                            "firstName": res.result.firstName,
                            "lastName": res.result.lastName,
                            "email": res.result.email,
                            "memberId": res.result.memberId
                        }
                    })
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                    // History.push("/");
                    return false;
                }
            });
        }
    },[id,globalAlert]);
    return (
        <>
            <Row className="headerMain">
                <Col className='p-0'>
                    <Box>
                        <AppBar elevation={0} color='transparent' position='static' sx={styles.header}>
                            <Toolbar>
                                <a className="navbar-brand mr-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </Col>
            </Row>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="d-flex">
                        <div className="w-25 d-flex align-items-center">
                            <h3 className="mb-0">Onboarding</h3>
                        </div>
                        <div className="w-50">
                            <Stepper style={{ width: "50%", margin: "0 auto" }} alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </div>
                    <h3 className='text-center mb-3'>Welcome, let get you setup</h3>
                    <p className='text-center'>Now please tell us a little more about yourself.</p>
                    {activeStep === steps.length ? (
                        <Typography variant="h3" align="center">
                            Thank You
                        </Typography>
                    ) : (
                        <>
                            {getStepContent(activeStep)}
                            <div className="row">
                                <div className="col-md-12 py-3 text-center">
                                    <>
                                        {(activeStep !== 0) && <Button
                                            onClick={handleBack}
                                            variant="contained"
                                            color="primary"
                                        >
                                            BACK
                                        </Button>}
                                        <Button
                                            className={(activeStep !== 0) ? "ml-3" : ""}
                                            onClick={handleCancel}
                                            variant="contained"
                                            color="primary"
                                        >
                                            CANCEL
                                        </Button>
                                        {
                                            activeStep !== 1 ?
                                                <Button
                                                    className={"ml-3"}
                                                    onClick={handleNext}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    {activeStep === steps.length - 1 ? "LET'S GO!" : "NEXT"}
                                                </Button>
                                            :
                                                <Button className="ml-3" variant="contained" type="button" color="primary" onClick={()=>{handleProceed();}}>PROCEED FOR BIOMETRIC AUTHENTICATION</Button>
                                        }
                                    </>
                                </div>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
            <Row className="footerMain">
                <Col>
                    <Footer />
                </Col>
            </Row>
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
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(SubAccountActiveSetup);