import React, {useState, useRef, createRef, useEffect, useMemo, useCallback} from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, Button, IconButton, InputAdornment } from '@mui/material';
import { Row, Col, Form, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import {loginUserAction, resendActivateEmailUserAction} from '../../actions/userActions.js';
import InputField from '../shared/commonControlls/inputField.jsx';
import $ from "jquery";
import {siteURL, staticUrl, tokenName, websiteTitle, websiteTitleWithExt} from "../../config/api";
import { easUrlEncoder } from '../../assets/commonFunctions.js';
import { resetGlobalAlertAction, setGlobalAlertAction } from '../../actions/globalAlertActions.js';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getCookie } from 'react-use-cookie';
import History from '../../history.js';
import AuthIDComponent from '@authid/react-component';
import { checkLogin, authenticatorVerify } from '../../services/userService.js';
import OTPInput from 'react-otp-input';

const Login = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const inputRefs = useRef([createRef(),createRef()]);
    const [data, setData] = useState({});
    const [submitClick, setSubmitClick] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [checkToken, setCheckToken] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [loginCount, setLoginCount] = useState(1);
    const [finalUrl, setFinalUrl] = useState(null);
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [otp, setOtp] = useState("");
    const [authenticatorName, setAuthenticatorName] = useState("");
    const callLogin = props?.login;

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
    }

    const submitForm = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            if(i===1 && showPasswordField){
                const valid = inputRefs.current[i].current.validate()
                if (!valid) {
                    isValid = false
                }
            }
        }
        if (!isValid) {
            return
        }
        setSubmitClick(true);
        if(showPasswordField){
            props.login(data);
        } else {
            let requestData = {
                username: data?.username
            };
            checkLogin(requestData).then(res => {
                if (res.status === 200) {
                    handleChange("loginPreference", res.result.loginPreference);
                    if(res.result.loginPreference === "passwordAuthenticator" || res.result.loginPreference === "" || res.result.loginPreference === null){
                        setShowPasswordField(true);
                        setSubmitClick(false);
                    } else if(res.result.loginPreference === "authidAuthenticator"){
                        handleChange("transactionId", res.result.transactionId);
                        handleChange("oneTimeSecret", res.result.oneTimeSecret);
                        setFinalUrl("https://id.authid.ai/?t="+res.result.transactionId+"&s="+res.result.oneTimeSecret);
                    } else if(res.result.loginPreference === "googleAuthenticator" || res.result.loginPreference === "microsoftAuthenticator") {
                        if(res.result.loginPreference === "googleAuthenticator"){
                            setAuthenticatorName("Google Authenticator");
                        } else {
                            setAuthenticatorName("Microsoft Authenticator");
                        }
                        handleChange("secret", res.result.secret);
                        toggleModalOtp();
                    }
                } else {
                    props.globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    }
    const handleClickClose = () => {
        setFinalUrl(null);
    }
    const handleClickVerify = () => {
        let requestData = {
            "secret": data.secret,
            "code": otp,
            "username": data.username,
            "loginPreference": data.loginPreference
        };
        authenticatorVerify(requestData).then(res => {
            if (res.status === 200) {
                props.login({...data, "authenticatorCode": otp});
                toggleModalOtp();
                setOtp("");
            } else {
                setLoginCount((prev)=>{return prev+1;});
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    useEffect(()=>{
        document.title = `Login - ${websiteTitle}`;
        if(props.globalAlertState.type === "Error" && props.globalAlertState.open === true)
        {
            setSubmitClick(false);
            setTimeout(function(){
                $("#resendemail").click(function (){
                    props.resendactivateemail($("#resendemail").attr("data-item-id"));
                });
                $("#choosePlan").click(function (){
                    History.push("/chooseplan?v="+localStorage.getItem("encId"));
                    localStorage.removeItem("encId");
                    props.resetGlobalAlert();
                });
            },1000);
        }
        return ()=>{
            document.title = websiteTitle;
        }
    },[props]);
    useEffect(()=>{
        if(typeof getCookie(tokenName) !== "undefined" && getCookie(tokenName) !== "" && getCookie(tokenName) !== null){
            let requestData = {
                "alreadyExistsToken" : getCookie(tokenName)
            }
            callLogin(requestData);
        } else {
            setCheckToken(true);
        }
    },[callLogin]);
    useEffect(()=>{
        if(sessionStorage.getItem('isLoggedInUser') === "yes" && queryString.get("t") === "z"){
            History.push("/managesupportticket")
        } else {
            localStorage.setItem("t", queryString.get("t"));
        }
    },[queryString]);
    const handleMessage = useCallback((event) => {
        if (event?.data?.params?.message === "LIVENESS_FINISHED") {
            setLoginCount((prev)=>{return prev+1;});
        }
        if(event.data.pageName === "verifiedMatchFailPage" && event.data.success === false){
            setLoginCount((prev)=>{return prev+3;});
        }
        if(event.data.pageName === "verifiedPage"){
            if (event.data.success) {
                props.login(data);
                setFinalUrl(null);
            }
        }
    },[data]);
    useEffect(()=>{
        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        }
    },[data]);
    useEffect(()=>{
        if(loginCount > 3){
            let title = "";
            if(data.loginPreference === "authidAuthenticator"){
                setFinalUrl(null);
                title = "biometric";
            } else if(data.loginPreference === "googleAuthenticator"){
                toggleModalOtp();
                setOtp("");
                title = "google";
            }
            handleChange("loginPreference", "passwordAuthenticator");
            props.globalAlert({
                type: "Error",
                text: `Your ${title} authentication failed multiple times.\n\nPlease try to login using your password.`,
                open: true
            });
            setShowPasswordField(true);
            setSubmitClick(false);
        }
    },[loginCount]);

    return (
        checkToken &&
        <Row>
            <Col xs={12} sm={8} md={7} lg={7} xl={7} className="pl-0">
                <CorousealsComponent />
            </Col>
            <Col xs={12} sm={4} md={5} lg={5} xl={5} className="formBox">
                <Box className="formMidle">
                    <p className="text-center pt-1">
                        <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                            <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                    </p>
                    <br />
                    <h2 className="text-center mb-4">Sign In</h2>
                    <Form onSubmit={submitForm} >
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="username"
                                name="username"
                                label="User Name/Email"
                                onChange={(name, value)=>{handleChange(name, value.replaceAll(/[^a-zA-Z0-9_@.]/g, ""))}}
                                validation={"required"}
                                value={data?.username || ""}
                            />
                        </FormGroup>
                        {showPasswordField && <FormGroup>
                            <InputField
                                ref={inputRefs.current[1]}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                validation="required"
                                onChange={handleChange}
                                value={data?.password || ""}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                        </FormGroup>}
                        <FormGroup>
                            {showPasswordField && <><Link to={"forgotpassword"} >Forgot Password?</Link> | </>}<Link to="#" onClick={()=>{ staticUrl !== "" ? window.location.href=`${staticUrl}/pricing.html` : window.location.href="/register?v=Jw==" }} >Registration</Link>
                            <Button type="submit" variant="contained" className="float-right" color="primary" disabled={submitClick}>{submitClick ? <i className="fad fa-spinner-third fa-spin fa-2x white mx-3 cursor-not-allowed"></i> : "SIGN IN" }</Button>
                        </FormGroup>
                    </Form>
                </Box>
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
            </Col>
        </Row>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        globalAlertState: state.globalAlert
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (creds) => {
            dispatch(loginUserAction(creds))
        },
        resendactivateemail: (data) => {
            dispatch(resendActivateEmailUserAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        resetGlobalAlert: () => {
            dispatch(resetGlobalAlertAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)