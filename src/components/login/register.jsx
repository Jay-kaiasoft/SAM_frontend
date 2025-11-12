import React, { useCallback, useEffect, useMemo, useState } from "react";
import {Typography, TextField, Button, Stepper, Step, StepLabel, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel, InputAdornment, Link, Box, AppBar, Toolbar, IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {useForm, Controller, FormProvider, useFormContext,} from "react-hook-form";
import { siteURL, staticUrl, tokenName, websiteColor, websiteSmallTitleWithExt, websiteTitle, websiteTitleWithExt } from "../../config/api";
import ImportStyleModal from "../shared/commonControlls/importStyleModal";
import Footer from "../shared/footer/footer";
import styles from "../../assets/styles/componentStyles.js";
import { cancelRegistration, checkUsername, getPlanById, authenticatorGenerate, authenticatorVerify, registration, sendOtpOnboarding, verifyEmail, checkRegistrationLink } from "../../services/userService";
import { connect } from "react-redux";
import AuthIDComponent from "@authid/react-component";
import titleize from "titleize";
import { getCountry, getCountryToState, getLanguage, getSecurityQuestion, validatePhoneFormat } from "../../services/commonService";
import { characterNumberOnly, checkCreateURL, easUrlEncoder, getClientTimeZone, getHostData, numberOnly, setBrandColorsToLocal, validateEmail } from "../../assets/commonFunctions";
import { setGlobalAlertAction } from "../../actions/globalAlertActions.js";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions.js";
import { getSync } from "../../services/myCalendarServices.js";
import History from "../../history.js";
import { userLoggedIn } from "../../actions/userActions.js";
import { setSubUserAction } from "../../actions/subUserActions.js";
import { setMenuListAction } from "../../actions/menuListActions.js";
import { setModuleListAction } from "../../actions/moduleListActions.js";
import { setCountrySettingAction } from "../../actions/countrySettingActions.js";
import OtpModal from "../shared/commonControlls/otpModal.jsx";
import OTPInput from "react-otp-input";

const removeSpaces = (value) => {
    if (!value.trim().length) {
        return "";
    } else {
        return value;
    }
}
const checkValidationPass = (str, setNum=()=>{}, setLow=()=>{}, setUpp=()=>{}, setSpe=()=>{}, setLen=()=>{}) => {
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

const AccountDetailsForm = ({queryString, globalAlert}) => {
    const [plan, setPlan] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showCheckEmailIcon, setShowCheckEmailIcon] = useState("");
    const [showCheckPasswordIcon, setShowCheckPasswordIcon] = useState("");
    const [showProcessEmailIcon, setShowProcessEmailIcon] = useState("no");
    const [prshowhide, setPrshowhide] = useState(false);
    const [num, setNum] = useState(0);
    const [low, setLow] = useState(0);
    const [upp, setUpp] = useState(0);
    const [spe, setSpe] = useState(0);
    const [len, setLen] = useState(0);
    const [pricingPageLink, setPricingPageLink] = useState("");
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const { control, formState: { errors }, setValue } = useFormContext();

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleCheckUsername = async(username) => {
        if(username === ""){
            return false;
        }
        setShowCheckPasswordIcon("");
        const resC = await checkUsername(username, 0);
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
    const handleCheckEmail = async(email) => {
        if(email === ""){
            return false;
        }
        if(!validateEmail(email)){
            globalAlert({
                type: "Error",
                text: "Please enter proper email",
                open: true
            });
            return false;
        }
        setShowCheckEmailIcon("");
        setShowProcessEmailIcon("yes");
        let requestData = {
            "email": email,
            "memberId": 0
        }
        const resV = await verifyEmail(requestData);
        setShowProcessEmailIcon("no");
        if (resV.status === 409) {
            setShowCheckEmailIcon("no1");
            return false;
        } else if (resV.status !== 200) {
            globalAlert({
                type: "Error",
                text: resV.message,
                open: true,
            });
            setShowCheckEmailIcon("no");
            return false;
        } else {
            setShowCheckEmailIcon("yes");
        }
    }

    useEffect(() => {
        let w = "";
        if(typeof queryString.get("w") !== "undefined" && queryString.get("w") !== "" && queryString.get("w") !== null){
            w = `?w=${queryString.get("w")}`;
        }
        if(typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null){
            checkRegistrationLink(queryString.get("v")).then(res1=>{
                if(res1.status === 200){
                    let requestData = `countryId=100&planId=${queryString.get("v")}`
                    getPlanById(requestData).then(res=>{
                        if(res.status === 200){
                            setPlan(res.result.plan);
                            setValue("planId", queryString.get("v"));
                        } else {
                            window.location.href=`${staticUrl}/pricing.html${w}`;
                        }
                    })
                } else {
                    History.push("/login");
                    globalAlert({
                        type: "Error",
                        text: res1.message,
                        open: true,
                    });
                }
            });
        } else {
            window.location.href=`${staticUrl}/pricing.html${w}`;
        }
        setPricingPageLink(`${staticUrl}/pricing.html${w}`);
    }, [queryString]);

    return (
        <Row>
            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                {
                    ((typeof plan.hasOwnProperty("planName") !== "undefined" && plan.hasOwnProperty("planName") !== "" && plan.hasOwnProperty("planName") !== null) && (typeof plan.hasOwnProperty("countrySetting") !== "undefined" && plan.hasOwnProperty("countrySetting") !== "" && plan.hasOwnProperty("countrySetting"))) &&
                        <div className="border-gray border rounded p-3 mb-4">
                            <p>Your selected plan</p>
                            <p className="d-flex justify-content-between">
                                <span>{plan?.planName}</span>
                                <span>{plan?.countrySetting?.cntyPriceSymbol+plan?.countrySetting?.cntyPlanPrice}</span>
                            </p>
                            <p className="mb-0 text-right"><a href={pricingPageLink}>Change Plan...</a></p>
                        </div>
                }
                <Controller
                    control={control}
                    name="username"
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            variant="standard"
                            id="username"
                            label="User Name"
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        {showCheckPasswordIcon === "yes" ? <i className="far fa-check font-size-18 text-green"></i> : showCheckPasswordIcon === "no" ? <i className="far fa-times font-size-18 text-red"></i> : ""}
                                    </InputAdornment>
                            }}
                            {...field}
                            value={field.value}
                            onChange={(e)=>{field.onChange(removeSpaces(e.target.value.replaceAll(/[^a-zA-Z0-9_@.]/g, "")))}}
                            onBlur={(e)=>{handleCheckUsername(removeSpaces(e.target.value.replaceAll(/[^a-zA-Z0-9_@.]/g, "")))}}
                            error={Boolean(errors?.username)}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="email"
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            variant="standard"
                            id="email"
                            label="Email"
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        {showCheckEmailIcon === "yes" ? <i className="far fa-check font-size-18 text-green"></i> : (showCheckEmailIcon === "no" || showCheckEmailIcon === "no1") ? <i className="far fa-times font-size-18 text-red"></i> : ""}
                                    </InputAdornment>
                            }}
                            {...field}
                            value={field.value}
                            onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            onBlur={(e)=>{handleCheckEmail(removeSpaces(e.target.value))}}
                            error={Boolean(errors?.email)}
                        />
                    )}
                />
                <p className={`mb-0 ${(showCheckEmailIcon === "yes" && showProcessEmailIcon === "no") && "text-green"} ${((showCheckEmailIcon === "no" || showCheckEmailIcon === "no1") && showProcessEmailIcon === "no") && "text-red"}`}>
                    { showProcessEmailIcon === "yes" && "Verifying email" }
                    { (showCheckEmailIcon === "yes" && showProcessEmailIcon === "no") && "This is a verified email" }
                    { (showCheckEmailIcon === "no" && showProcessEmailIcon === "no") &&  "This is not a valid email" }
                    { (showCheckEmailIcon === "no1" && showProcessEmailIcon === "no") &&  "Email is already register" }
                </p>
                <Controller
                    control={control}
                    name="cell"
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            variant="standard"
                            id="cell"
                            label="Cell Phone"
                            fullWidth
                            margin="normal"
                            {...field}
                            value={field.value}
                            onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            error={Boolean(errors?.cell)}
                        />
                    )}
                />
                <p className="mb-0">By giving us your cell phone number, you agree to receive text messages from {websiteTitleWithExt}. We will only use this method for immediate issues that require your attention.</p>
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            variant="standard"
                            id="password"
                            label="Password"
                            fullWidth
                            margin="normal"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                            {...field}
                            value={field.value}
                            onChange={(e)=>{field.onChange(removeSpaces(e.target.value)); checkValidationPass(e.target.value, setNum, setLow, setUpp, setSpe, setLen);}}
                            onFocus={(e)=>{setPrshowhide(true); checkValidationPass(e.target.value, setNum, setLow, setUpp, setSpe, setLen);}}
                            onBlur={()=>{setPrshowhide(false)}}
                            error={Boolean(errors?.password)}
                        />
                    )}
                />
                <div className="position-relative" style={{zIndex:9}}>
                    <div className={`password-requirements-reg w-100 ${prshowhide ? "prshowhide" : ""}`} style={{marginTop:"-150px"}}>
                        <ul className="mb-0 padding-all-0">
                            <li className={`lowercase-char ${(low === 0) ? "completed" : ""}`}>One lowercase character</li>
                            <li className={`special-char ${(spe === 0) ? "completed" : ""}`}>One special character</li>
                            <li className={`uppercase-char ${(upp === 0) ? "completed" : ""}`}>One uppercase character</li>
                            <li className={`8-char ${(len === 0) ? "completed" : ""}`}>Eight characters minimum</li>
                            <li className={`number-char ${(num === 0) ? "completed" : ""}`}>One number</li>
                        </ul>
                    </div>
                </div>
            </Col>
        </Row>
    );
}
const Authenticator = ({handleAuthenticatorSuccess, handleAuthenticatorFailure, handleBack, handleCancel, globalAlert, data, reset}) => {
    const [finalUrl, setFinalUrl] = useState(null);

    const handleProceed = () => {
        setFinalUrl("https://id.authid.ai/?i=" + data.operationId + "&s=" + data.oneTimeSecret);
    }
    const handleClickClose = () => {
        setFinalUrl(null);
    }

    useEffect(()=>{
        window.addEventListener("message", (event) => {
            if(event.data.pageName === "verifiedPage"){
                if (event.data.success) {
                    handleAuthenticatorSuccess(setFinalUrl);
                } else {
                    handleAuthenticatorFailure();
                }
            }
        });
    },[]);
    return (
        <>
            <div className="w-50 mx-auto text-center mt-3">
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
                <p className="mb-5">
                    Would you like to enable passwordless Authentication for your SaaS contact <a href="https://kaiasoft.com/contact.php" target="_blank" rel="noreferrer">Kaiasoft.com</a>
                </p>
                <Button onClick={handleBack} variant="contained" color="primary">BACK</Button>
                <Button className="ml-3" variant="contained" type="button" color="primary" onClick={()=>{handleCancel();}}>CANCEL</Button>
                <Button className="ml-3" variant="contained" type="button" color="primary" onClick={()=>{handleProceed();}}>PROCEED FOR BIOMETRIC AUTHENTICATION</Button>
            </div>
            {
                (finalUrl) && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
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
        </>
    );
}
const LoginPreference = ({globalAlert}) => {
    const classes = {
        formControl: {
            minWidth: 200,
            width: '100%',
            marginTop: "16px",
            marginBottom: "8px"
        }
    };
    const { control, formState: { errors }, setValue, getValues } = useFormContext();
    const [ loginPreference, setLoginPreference ] = useState(getValues("loginPreference"));
    const [question, setQuestion] = useState([]);
    const [qrUrl, setQrUrl] = useState(null);
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [otp, setOtp] = useState("");
    const [authenticatorName, setAuthenticatorName] = useState("");

    const handleClickAuthenticator = (value) => {
        if(value === "googleAuthenticator" || value === "microsoftAuthenticator") {
            authenticatorGenerate(getValues("username")).then(res => {
                if (res.status === 200) {
                    setValue("secret",res.result.secret);
                    setQrUrl(res.result.qrUrl);
                    if(value === "googleAuthenticator"){
                        setAuthenticatorName("Google Authenticator");
                    } else {
                        setAuthenticatorName("Microsoft Authenticator");
                    }
                    setValue("loginPreference", value);
                    setLoginPreference(value);
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
            setValue("loginPreference", value);
            setLoginPreference(value);
        }
    }
    const handleClickVerify = () => {
        let requestData = {
            "secret": getValues("secret"),
            "code": otp,
            "username": getValues("username"),
            "loginPreference": loginPreference
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

    useEffect(()=>{
        getSecurityQuestion().then(res => {
            if (res.result && res.result.securityQuestion) {
                let questation = []
                res.result.securityQuestion.map(x => (
                    questation.push({
                        "key": Number(x.secId),
                        "value": x.secQuestion
                    })
                ));
                setQuestion(questation)
            }
        })
    },[]);

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="w-75 mx-auto">
                    <h5 className="text-center my-4">Choose your Login Preference</h5>
                    <div className="d-flex justify-content-center">
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${loginPreference === "microsoftAuthenticator" ? "active" : ""}`} onClick={()=>handleClickAuthenticator("microsoftAuthenticator")}>
                            <img className="authenticator-icon" src={siteURL+"/img/microsoft-authenticator.svg"} alt="Microsoft Authenticator" />
                            <p className="mb-0">Microsoft Authenticator</p>
                        </div>
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 position-relative ${loginPreference === "googleAuthenticator" ? "active" : ""}`} onClick={()=>handleClickAuthenticator("googleAuthenticator")}>
                            <img className="authenticator-icon" src={siteURL+"/img/google-authenticator.svg"} alt="Google Authenticator" />
                            <p className="mb-0">Google Authenticator</p>
                        </div> 
                        <div className={`authenticator-box p-3 cursor-pointer mr-3 ${loginPreference === "authidAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("authidAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/authid-authenticator.svg"} alt="Biomatric Authenticator" />
                            <p className="mb-0">Biomatric Authenticator</p>
                        </div>
                        <div className={`authenticator-box p-3 cursor-pointer ${loginPreference === "passwordAuthenticator" ? "active" : ""}`} onClick={()=>{handleClickAuthenticator("passwordAuthenticator")}}>
                            <img className="authenticator-icon" src={siteURL+"/img/password-authenticator.svg"} alt="Password Authenticator" />
                            <p className="mb-0">Password</p>
                        </div>
                    </div>
                </div>
            </Col>
            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto mt-4">
                <div className="d-flex">
                    <div className="pt-5 pr-4">1</div>
                    <div>
                        <FormControl sx={classes.formControl} variant="standard" >
                            <InputLabel id="secQus1-label" error={Boolean(errors?.secQus1)}>Security Question One</InputLabel>
                            <Controller
                                control={control}
                                name="secQus1"
                                rules={{ required: true }}
                                render={(props) => (
                                    <Select id="secQus1" variant="standard" labelId="secQus1-label" value={props.field.value?props.field.value:""} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth error={Boolean(errors?.secQus1)}>
                                        {question.map((ele, i) => (
                                            <MenuItem key={i} value={ele.key}>
                                                {ele.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <Controller
                            control={control}
                            name="secAns1"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    variant="standard"
                                    id="secAns1"
                                    label="Question One Answer"
                                    fullWidth
                                    margin="normal"
                                    {...field}
                                    value={field.value}
                                    onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    error={Boolean(errors?.secAns1)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="d-flex">
                    <div className="pt-5 pr-4">2</div>
                    <div>
                        <FormControl sx={classes.formControl} variant="standard" >
                            <InputLabel id="secQus2-label" error={Boolean(errors?.secQus2)}>Security Question Two</InputLabel>
                            <Controller
                                control={control}
                                name="secQus2"
                                rules={{ required: true }}
                                render={(props) => (
                                    <Select id="secQus2" labelId="secQus2-label" value={props.field.value?props.field.value:""} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth className="mb-2" error={Boolean(errors?.secQus2)}>
                                        {question.map((ele, i) => (
                                            <MenuItem key={i} value={ele.key}>
                                                {ele.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <Controller
                            control={control}
                            name="secAns2"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    variant="standard"
                                    id="secAns2"
                                    label="Question Two Answer"
                                    fullWidth
                                    margin="normal"
                                    {...field}
                                    value={field.value}
                                    onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    error={Boolean(errors?.secAns2)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="d-flex">
                    <div className="pt-5 pr-4">3</div>
                    <div>
                        <FormControl sx={classes.formControl} variant="standard" >
                            <InputLabel id="secQus3-label" error={Boolean(errors?.secQus3)}>Security Question Three</InputLabel>
                            <Controller
                                control={control}
                                name="secQus3"
                                rules={{ required: true }}
                                render={(props) => (
                                    <Select id="secQus3" labelId="secQus3-label" value={props.field.value?props.field.value:""} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth className="mb-2" error={Boolean(errors?.secQus3)}>
                                        {question.map((ele, i) => (
                                            <MenuItem key={i} value={ele.key}>
                                                {ele.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <Controller
                            control={control}
                            name="secAns3"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    variant="standard"
                                    id="secAns3"
                                    label="Question Three Answer"
                                    fullWidth
                                    margin="normal"
                                    {...field}
                                    value={field.value}
                                    onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    error={Boolean(errors?.secAns3)}
                                />
                            )}
                        />
                    </div>
                </div>
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
            </Col>
        </Row>
    )
}
const DetailsForm = () => {
    const classes = {
        formControl: {
            minWidth: 200,
            width: '100%',
            marginTop: "16px",
            marginBottom: "8px"
        }
    };
    const { control, formState: { errors },setValue,getValues } = useFormContext();
    const [language, setLanguage] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [state2, setState2] = useState([]);
    const [countryCode,setCountryCode] = useState("+1");
    const [countryCode2,setCountryCode2] = useState("+1");
    const [billingSameAs,setBillingSameAs] = useState(parseInt(getValues("billingSameAs")));

    const fetchData = async () => {
        getLanguage().then(res => {
            if (res.result.language) {
                let language = []
                res.result.language.map(x => (
                    language.push({
                        "key": x.lgName,
                        "value": x.lgLongName
                    })
                ));
                setLanguage(language)
            }
        })
        getCountry().then(res => {
            if (res.result.country) {
                let c = [];
                res.result.country.map(x => (
                    c.push({
                        "key": String(x.id),
                        "value": x.cntName,
                        "cntCode":x.cntCode
                    })
                ));
                setCountry(c);
            }
        })
    }

    const changeCountry = useCallback((countryId) => {
        getCountryToState(countryId).then(res => {
            if (res.result.state) {
                let state = [];
                res.result.state.map(x => (
                    state.push({
                        "key": x.stateLong,
                        "value": x.stateLong
                    })
                ));
                setState(state);
            }
        });
        if(country.length > 0) {
            let sc = country.find(o => Number(o.key) === Number(countryId));
            setCountryCode(sc.cntCode);
        }
    },[country]);
    const changeCountry2 = useCallback((countryId) => {
        getCountryToState(countryId).then(res => {
            if (res.result.state) {
                let state = [];
                res.result.state.map(x => (
                    state.push({
                        "key": x.stateLong,
                        "value": x.stateLong
                    })
                ));
                setState2(state);
            }
        });
        if(country.length > 0) {
            let sc = country.find(o => Number(o.key) === Number(countryId));
            setCountryCode2(sc.cntCode);
        }
    },[country]);
    const handleChangeCheckbox = (e) => {
        if(e.target.checked){
            setValue("billingSameAs", 1);
            setBillingSameAs(1);
            setValue("billingFirstName", getValues("firstName"));
            setValue("billingLastName", getValues("lastName"));
            setValue("billingAddress", getValues("address"));
            setValue("billingCountry", getValues("country"));
            setValue("billingCity", getValues("city"));
            setValue("billingState", getValues("state"));
            setValue("billingPostCode", getValues("postCode"));
            setValue("billingPhone", getValues("phone"));
            setValue("billingCountrycodephone", getValues("countrycodephone"));
        } else {
            setValue("billingSameAs", 0);
            setBillingSameAs(0);
            setValue("billingFirstName", "");
            setValue("billingLastName", "");
            setValue("billingAddress", "");
            setValue("billingCountry", 100);
            setValue("billingCity", "");
            setValue("billingState", "");
            setValue("billingPostCode", "");
            setValue("billingPhone", "");
            setValue("billingCountrycodephone", "");
        }
    }

    useEffect(() => {
        fetchData();
    },[]);    
    useEffect(() => {
        setValue("countrycodephone",countryCode);
        setValue("billingCountrycodephone",countryCode2);
    }, [setValue,countryCode,countryCode2]);
    useEffect(()=>{
        changeCountry(getValues("country"));
        changeCountry2(getValues("billingCountry"));
    },[changeCountry,getValues]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="firstName"
                                label="First Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.firstName)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="last-name"
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.lastName)}
                            />
                        )}
                    />
                    <FormControl sx={classes.formControl} variant="standard" >
                        <InputLabel id="language-label" error={Boolean(errors?.memberDefaultLanguage)}>Select Language</InputLabel>
                        <Controller
                            control={control}
                            name="memberDefaultLanguage"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select id="memberDefaultLanguage" labelId="language-label" value={props.field.value?props.field.value:"en"} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth error={Boolean(errors?.memberDefaultLanguage)}>
                                    {language.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        control={control}
                        name="address"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="address"
                                label="Address 1"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.address)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="streetAddress"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="streetAddress"
                                label="Address 2"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="city"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="city"
                                label="City"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                error={Boolean(errors?.city)}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="postCode"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="postCode"
                                label="Post Code"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(characterNumberOnly(e.target.value));}}
                                error={Boolean(errors?.postCode)}
                                className="mb-4"
                            />
                        )}
                    />
                    <FormControl sx={classes.formControl} variant="standard">
                        <InputLabel id="country-label" error={Boolean(errors?.country)}>Select Country</InputLabel>
                        <Controller
                            control={control}
                            name="country"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select labelId="country-label" value={props.field.value?props.field.value:100} onChange={(e) => {props.field.onChange(parseInt(e.target.value));changeCountry(e.target.value)}} fullWidth error={Boolean(errors?.country)}>
                                    {country.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl sx={classes.formControl} variant="standard">
                        <InputLabel id="state-label" error={Boolean(errors?.state)}>Select State</InputLabel>
                        <Controller
                            control={control}
                            name="state"
                            rules={{ required: true }}
                            render={(props) => (
                                <Select labelId="state-label" value={props.field.value} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth error={Boolean(errors?.state)}>
                                    {state.map((ele, i) => (
                                        <MenuItem key={i} value={ele.key}>
                                            {ele.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="phone"
                                label="Phone"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                InputProps={{startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="cell"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="cell"
                                label="Cell"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                error={Boolean(errors?.cell)}
                                InputProps={{startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,}}
                            />
                        )}
                    />
                    <p className="mb-0">By providing your cell phone number you opt in to receiving important products updates</p>
                    <Controller
                        control={control}
                        name="countrycodephone"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="countrycodephone"
                                type="hidden"
                                {...field}
                                value={field.value}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <FormControlLabel control={
                        <Controller
                            control={control}
                            name="billingSameAs"
                            render={({ field }) => (
                                <Checkbox id="billingSameAs" color="primary" {...field} checked={billingSameAs === 1} onChange={(e)=>{handleChangeCheckbox(e);}} />
                            )}
                        />
                    } label={`My Billing Address Is The Same As My Address`} className="mt-4" />
                    { billingSameAs === 0 && 
                        <>
                            <Controller
                                control={control}
                                name="billingFirstName"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingFirstName"
                                        label="First Name"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        value={field.value}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                        error={Boolean(errors?.billingFirstName)}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="billingLastName"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingLastName"
                                        label="Last Name"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        value={field.value}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                        error={Boolean(errors?.billingLastName)}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="billingAddress"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingAddress"
                                        label="Address"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                        error={Boolean(errors?.billingAddress)}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="billingCity"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingCity"
                                        label="City"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                        error={Boolean(errors?.billingCity)}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="billingPostCode"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingPostCode"
                                        label="Post Code"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        onChange={(e) => {field.onChange(characterNumberOnly(e.target.value));}}
                                        error={Boolean(errors?.billingPostCode)}
                                        className="mb-4"
                                    />
                                )}
                            />
                            <FormControl sx={classes.formControl} variant="standard">
                                <InputLabel id="billing-country-label" error={Boolean(errors?.billingCountry)}>Select Country</InputLabel>
                                <Controller
                                    control={control}
                                    name="billingCountry"
                                    rules={{ required: true }}
                                    render={(props) => (
                                        <Select labelId="billing-country-label" value={props.field.value?props.field.value:100} onChange={(e) => {props.field.onChange(parseInt(e.target.value));changeCountry2(e.target.value)}} fullWidth error={Boolean(errors?.billingCountry)}>
                                            {country.map((ele, i) => (
                                                <MenuItem key={i} value={ele.key}>
                                                    {ele.value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <FormControl sx={classes.formControl} variant="standard">
                                <InputLabel id="billing-state-label" error={Boolean(errors?.billingState)}>Select State</InputLabel>
                                <Controller
                                    control={control}
                                    name="billingState"
                                    rules={{ required: true }}
                                    render={(props) => (
                                        <Select labelId="billing-state-label" value={props.field.value} onChange={(e) => {props.field.onChange(e.target.value);}} fullWidth error={Boolean(errors?.billingState)}>
                                            {state2.map((ele, i) => (
                                                <MenuItem key={i} value={ele.key}>
                                                    {ele.value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <Controller
                                control={control}
                                name="billingPhone"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingPhone"
                                        label="Phone"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        onChange={(e) => {field.onChange(numberOnly(e.target.value));}}
                                        error={Boolean(errors?.billingPhone)}
                                        InputProps={{startAdornment: <InputAdornment position="start">{countryCode2}</InputAdornment>,}}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="billingCountrycodephone"
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="billingCountrycodephone"
                                        type="hidden"
                                        {...field}
                                        value={field.value}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    />
                                )}
                            />
                        </>
                    }
                </Col>
            </Row>
        </>
    );
};
const CompanyInfoForm = ({handleClickImport}) => {
    const { control, watch, formState: { errors } } = useFormContext();
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="offset-md-2 offset-lg-2 offset-xl-2">
                    <h3 className='text-center mb-3'>What is your business name, brand name and brand website?</h3>
                    <p className='text-center'>Tell us little bit more about what you do. This information will appear in your emails to help your recipients find your organization.</p>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <Controller
                        control={control}
                        name="businessName"
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="businessName"
                                label="Business Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="brandName"
                        rules={{ required: (watch("brandWebsite", false) === "" || watch("brandWebsite", false) === false) ? false : true }}
                        render={({ field }) => (
                            <TextField
                                variant="standard"
                                id="brandName"
                                label="Brand Name"
                                fullWidth
                                margin="normal"
                                {...field}
                                error={Boolean(errors?.brandName)}
                                onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                            />
                        )}
                    />
                    <div className='d-flex align-items-end'>
                        <div className='w-100'>
                            <Controller
                                control={control}
                                name="brandWebsite"
                                rules={{ required: (watch("brandName", false) === "" || watch("brandName", false) === false) ? false : true }}
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        id="brandWebsite"
                                        label="Brand Website"
                                        fullWidth
                                        margin="normal"
                                        {...field}
                                        error={Boolean(errors?.brandWebsite)}
                                        onChange={(e)=>{field.onChange(removeSpaces(e.target.value))}}
                                    />
                                )}
                            />
                        </div>
                        <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="Add your brand logo and colors automatically" onClick={()=>{handleClickImport()}}>
                            <i className="far fa-upload pl-1"></i>
                            <div className="bg-dark-blue"></div>
                        </Link>
                    </div>
                </Col>
            </Row>
        </>
    );
};
const FinalstepForm = () => {
    const { control, setValue, getValues } = useFormContext();

    const handleChangeCheckbox = (e) => {
        if(e.target.checked){
            setValue("newsletterSubscribe", 1);
        } else {
            setValue("newsletterSubscribe", 0);
        }
    }

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center'>{getValues("firstName")}, Your Account Is Ready!!</h3>
                    <p className='text-center'>Let's set up your list now and build your first campaigns.</p>
                    <h5 className='text-center'>Want to improve your {websiteTitle} skills?</h5>
                    <p className='text-center m-0'>
                        <FormControlLabel control={
                            <Controller
                            control={control}
                            name="newsletterSubscribe"
                            render={({ field }) => (
                                <Checkbox id="newsletterSubscribe" color="primary" {...field} checked={parseInt(getValues("newsletterSubscribe")) === 1} onChange={(e)=>{handleChangeCheckbox(e);}} />
                            )}
                            />
                        } label={`Subscribe to ${websiteTitle} Skills and Update (Optional)`} />
                    </p>
                    <p className='text-center'>A newsletter of special offers, tips, feature updates, and marketing news delivered right to your inbox</p>
                </Col>
            </Row>
        </>
    );
};

const Register = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["","","","","",""];
    const [modalOtp, setModalOtp] = useState(false);
    const toggleModalOtp = ()=>{setModalOtp(!modalOtp)};
    const [modalImport, setModalImport] = useState(false);
    const toggleImport = () => { setModalImport(!modalImport); }

    const classes = {
        '& .MuiStepLabel-root .Mui-completed': {
            color: websiteColor,
        },
        '& .MuiStepLabel-root .Mui-active': {
            color: websiteColor,
        },
        '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: websiteColor,
        },
        '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: websiteColor,
        },
    }
    const methods = useForm({
        defaultValues: {
            authidDocumentType: 2,
            memberId: 0,
            username: "",
            email: "",
            password: "",
            loginPreference:"",
            secQus1:null,
            secAns1:"",
            secQus2:null,
            secAns2:"",
            secQus3:null,
            secAns3:"",
            firstName: "",
            lastName: "",
            address: "",
            streetAddress: "",
            memberDefaultLanguage: "en",
            country: 100,
            city: "",
            state: "",
            postCode: "",
            phone: "",
            cell: "",
            countrycodephone: "",
            billingSameAs: 1,
            billingFirstName: "",
            billingLastName: "",
            billingAddress: "",
            billingCountry: 100,
            billingCity: "",
            billingState: "",
            billingPostCode: "",
            billingPhone: "",
            billingCountrycodephone: "",
            businessName: "",
            brandName: "",
            brandWebsite: "",
            brandWebsiteURL:"",
            newsletterSubscribe: 1,
            
        },
    });
    const isStepFalied = () => {
        return Boolean(Object.keys(methods.formState.errors).length);
    };
    const handleNext =async (data) => {
        if (activeStep === 0) {
            if(!validateEmail(data?.email)){
                props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
            if(!checkValidationPass(data?.password)){
                props.globalAlert({
                    type: "Error",
                    text: "Invalid password format.\nPlease use suggested combination in password",
                    open: true
                });
                return false;
            }
            const resC = await checkUsername(data?.username, 0);
            if (resC.status !== 200) {
                props.globalAlert({
                    type: "Error",
                    text: resC.message,
                    open: true,
                });
                return false;
            }
            let requestData = {
                "email": data?.email,
                "memberId": 0
            }
            const resV = await verifyEmail(requestData)
            if (resV.status !== 200) {
                props.globalAlert({
                    type: "Error",
                    text: resV.message,
                    open: true,
                });
                return false;
            }
        } else if (activeStep === 2) {
            if(typeof data.loginPreference === "undefined" || data.loginPreference === "" || data.loginPreference === null){
                props.globalAlert({
                    type: "Error",
                    text: `Please select login preference`,
                    open: true
                });
                return;
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
        } else if (activeStep === 3) {
            let isValidPh;
            if(!modalOtp){
                if(typeof data.phone !== "undefined" && data.phone !== "" && data.phone !== null){
                    isValidPh = await validatePhoneFormat(data.country, data.phone);
                    if(!isValidPh){
                        props.globalAlert({
                            type: "Error",
                            text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                            open: true
                        });
                        return;
                    }
                }
                isValidPh = await validatePhoneFormat(data.country, data.cell);
                if(!isValidPh){
                    props.globalAlert({
                        type: "Error",
                        text: `Invalid cell number format or Do not put a national prefix on your cell number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                        open: true
                    });
                    return;
                }
                if(parseInt(methods.getValues("billingSameAs")) === 1){
                    methods.setValue("billingFirstName", methods.getValues("firstName"));
                    methods.setValue("billingLastName", methods.getValues("lastName"));
                    methods.setValue("billingAddress", methods.getValues("address"));
                    methods.setValue("billingCountry", methods.getValues("country"));
                    methods.setValue("billingCity", methods.getValues("city"));
                    methods.setValue("billingState", methods.getValues("state"));
                    methods.setValue("billingPostCode", methods.getValues("postCode"));
                    methods.setValue("billingPhone", methods.getValues("phone"));
                    methods.setValue("billingCountrycodephone", methods.getValues("countrycodephone"));
                } else {
                    methods.setValue("billingFirstName", "");
                    methods.setValue("billingLastName", "");
                    methods.setValue("billingAddress", "");
                    methods.setValue("billingCountry", 100);
                    methods.setValue("billingCity", "");
                    methods.setValue("billingState", "");
                    methods.setValue("billingPostCode", "");
                    methods.setValue("billingPhone", "");
                    methods.setValue("billingCountrycodephone", "");
                }
                if(parseInt(methods.getValues("billingSameAs")) === 0){
                    isValidPh = await validatePhoneFormat(data.billingCountry, data.billingPhone);
                    if(!isValidPh){
                        props.globalAlert({
                            type: "Error",
                            text: `Invalid billing phone number format or Do not put a national prefix on your billing phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                            open: true
                        });
                        return;
                    }
                }
                if(data.loginPreference === "passwordAuthenticator"){
                    handleSendOtp("send");
                    return false;
                }
            }
        } else if (activeStep === 4) {
            if((typeof data.brandName !== "undefined" && data.brandName !== "" && data.brandName !== null) && (typeof data.brandWebsite !== "undefined" && data.brandWebsite !== "" && data.brandWebsite !== null)){
                if(typeof data.brandWebsite !== "undefined" && data.brandWebsite !== "" && data.brandWebsite !== null && data.brandWebsite.match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm) === null){
                    props.globalAlert({
                        type: "Error",
                        text: `Please enter proper brand website`,
                        open: true
                    });
                    return;
                }
                if((typeof data.brandLogo === "undefined" || data.brandLogo === "" || data.brandLogo === null) || (typeof data.brandColors === "undefined" || data.brandColors === "" || data.brandColors === null)){
                    props.confirmDialog({
                        open: true,
                        title: `You can import your branding styles from your webiste by clicking import icon (<i class="far fa-upload"></i>) near website name.\n\nYou can import it later also from Edit Profile -> My Branding Kit section.\n\nAre you sure, you want to continue without importing branding styles ?`,
                        onConfirm: async() => {
                            let requestData = {
                                ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
                                "registrationStep":5
                            }
                            const res = await registration(requestData);
                            if (res.status === 200) {
                                setActiveStep((prev) => {return prev + 1});
                            } else { 
                                props.globalAlert({
                                    type: "Error",
                                    text: res.message,
                                    open: true,
                                });
                                return false;
                            }
                        }
                    });
                    return false;
                }
            }
        }
        if(activeStep !== 1){
            let requestData = {};
            let d = 2;
            if(activeStep === 0){
                const res2 = await getHostData()
                if(res2.data.address.country === "United States"){
                    d = 2;
                } else if(res2.data.address.country === "India"){
                    d = 21;
                }
                requestData = {
                    ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
                    "authidDocumentType":d,
                    "registrationStep":1
                }
            } else if(activeStep === 5){
                requestData = {
                    ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
                    "code": queryString.get("w") ? queryString.get("w") : "",
                    "registrationStep": activeStep+1
                }
            } else {
                requestData = {
                    ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
                    "registrationStep": activeStep+1
                }
            }
            const res = await registration(requestData);
            if (res.status === 200) {
                if(activeStep === 5){
                    setBrandColorsToLocal(res.result.member.brandKits);
                    sessionStorage.setItem("user", JSON.stringify(res.result.member));
                    sessionStorage.setItem("subUser", JSON.stringify(res.result.subMember));
                    sessionStorage.setItem("menuList", JSON.stringify(res.result.menuList));
                    sessionStorage.setItem("moduleList", JSON.stringify(res.result.moduleList));
                    sessionStorage.setItem("countrySetting", JSON.stringify(res.result.countrySetting));
                    sessionStorage.setItem("isLoggedInUser", "yes");
                    props.userLoggedIn(res.result.member);
                    props.setSubUserAction(res.result.subMember);
                    props.setMenuListAction(res.result.menuList);
                    props.setModuleListAction(res.result.moduleList);
                    props.setCountrySettingAction(res.result.countrySetting);
                    History.push("/dashboard");
                    let tz = (typeof res.timeZone === "undefined" || res.timeZone === "" || res.timeZone === null) ? getClientTimeZone() : res.timeZone;
                    getSync(tz);
                    let time = new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * 1));
                    document.cookie = `${tokenName}=${res.result.token}; expires=${time}; path=${websiteSmallTitleWithExt}`;
                } else if(activeStep === 0){
                    methods.reset({
                        ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
                        "operationId":res.result.operationId,	
                        "authidOperationId":res.result.operationId,	
                        "oneTimeSecret":res.result.oneTimeSecret,	
                        "authidAccountNumber":res.result.accountNumber,
                        "authidDocumentType": d	
                    });
                }
                setActiveStep((prev) => {return prev + 1});
            } else { 
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true,
                });
                return false;
            }
        } else {
            setActiveStep((prev) => {return prev + 1});
        }
    };
    const handleBack = () => {
        setActiveStep((prev) => {return prev - 1});
    };
    const handleAuthenticatorSuccess = (setFinalUrl) => {
        let requestData = {
            ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
            "registrationStep":2
        }
        registration(requestData).then(res => {
            if (res.status === 200) {
                methods.setValue("memberId", res.result.member.memberId);
                if(parseInt(methods.getValues("authidDocumentType")) === 21){
                    let name = res?.result?.userInfo?.NameOfHolder?.split(" ") || [];
                    if(name.length > 0){
                        methods.setValue("firstName",titleize(name[0].toLowerCase()));
                        methods.setValue("lastName",titleize(name[1].toLowerCase()));
                    }
                    methods.setValue("address",titleize(res?.result?.userInfo?.Address?.toLowerCase()?.replaceAll(/[^a-zA-Z0-9.,\-\s]/gi," ")));
                } else if(parseInt(methods.getValues("authidDocumentType")) === 2){
                    methods.setValue("firstName",titleize(res?.result?.userInfo?.FirstName?.toLowerCase()));
                    methods.setValue("lastName",titleize(res?.result?.userInfo?.primaryID?.toLowerCase()));
                    methods.setValue("city",titleize(res?.result?.userInfo?.AddressCity?.toLowerCase()));
                    let pc = res?.result?.userInfo?.AddressPostalCode?.split("-");
                    if(pc.length > 0){
                        methods.setValue("postCode",pc[0]);
                    }
                    methods.setValue("address",titleize(res?.result?.userInfo?.AddressStreet?.toLowerCase()?.replaceAll(/[^a-zA-Z0-9.,\-\s]/gi," ")));
                }
                getCountry().then(res1 => {
                    if (res1.result.country) {
                        let c = res1.result.country.filter(x => x.cntName === res?.result?.userInfo?.issuerName);
                        if(c.length > 0){
                            methods.setValue("country",c[0].id);
                        }
                    }
                })
                let tempState = "";
                if(res?.result?.userInfo?.AddressState){
                    tempState = titleize(res?.result?.userInfo?.AddressState?.toLowerCase());
                }
                methods.setValue("state", tempState);
                handleNext();
            } else {
                setFinalUrl();
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleAuthenticatorFailure = () => {
        props.globalAlert({
            type: "Error",
            text: "An error occurred. Please try again.",
            open: true
        });
    }
    const handleClickImport = () => {
        if((typeof methods.getValues("brandName") === "undefined" || methods.getValues("brandName") === "" || methods.getValues("brandName") === null) && (typeof methods.getValues("brandWebsite") === "undefined" || methods.getValues("brandWebsite") === "" || methods.getValues("brandWebsite") === null)){
            props.globalAlert({
                type: "Error",
                text: `If you want to add brand logo and colors, please enter brand name and brand website`,
                open: true
            });
            return;
        }
        if(typeof methods.getValues("brandWebsite") !== "undefined" && methods.getValues("brandWebsite") !== "" && methods.getValues("brandWebsite") !== null && methods.getValues("brandWebsite").match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm) === null){
            props.globalAlert({
                type: "Error",
                text: `Please enter proper brand website`,
                open: true
            });
            return;
        }
        let isUrlCorrect = checkCreateURL(methods.getValues("brandWebsite"),props.globalAlert);
        methods.setValue("brandWebsiteURL",isUrlCorrect)
        toggleImport();
    }
    const handleCancel = () => {
        let requestData = {
            ...JSON.parse(JSON.stringify(methods.watch(),null,2)),
            "registrationStep": activeStep+1
        }
        cancelRegistration(requestData).then(res => {
            if (res.status === 200) {
                window.location.href=`${staticUrl}/index.html`;
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });   
    }
    const handleSendOtp = (type) => {
        let requestData = {
            "memberId": Number(methods.getValues("memberId")),
            "cell": methods.getValues("cell"),
            "countryCode": methods.getValues("countrycodephone")
        }
        sendOtpOnboarding(requestData).then(res => {
            if (res.status === 200) {
                if(type === "send"){
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
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <AccountDetailsForm queryString={queryString} globalAlert={props.globalAlert} />;
            case 1:
                return <Authenticator handleAuthenticatorSuccess={handleAuthenticatorSuccess} handleAuthenticatorFailure={handleAuthenticatorFailure} handleBack={handleBack} handleCancel={handleCancel} globalAlert={props.globalAlert} data={JSON.parse(JSON.stringify(methods.watch(),null,2))} reset={methods.reset} />;
            case 2:
                return <LoginPreference globalAlert={props.globalAlert} />;
            case 3:
                return <DetailsForm />;
            case 4:
                return <CompanyInfoForm handleClickImport={handleClickImport} />;
            case 5:
                return <FinalstepForm/>;
    
            default:
                return "unknown step";
        }
    }

    useEffect(() => {
        document.title = `Register - ${websiteTitle}`;
    }, []);

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
                            <h3 className="mb-0">Registration</h3>
                        </div>
                        <div className="w-50">
                            <Stepper alternativeLabel activeStep={activeStep}>
                                {steps.map((step, index) => {
                                    const labelProps = {};
                                    const stepProps = {};
                                    if (isStepFalied() && activeStep === index) {
                                        labelProps.error = true;
                                    }
                                    return (
                                        <Step {...stepProps} key={index} sx={classes}>
                                            <StepLabel {...labelProps} >{step}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                        </div>
                    </div>
                    {activeStep === steps.length ? (
                        <Typography variant="h3" align="center">
                            Thank You
                        </Typography>
                    ) : (
                        <>
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(handleNext)}>
                                    {getStepContent(activeStep)}
                                    <div className="row">
                                        <div className="col-md-12 py-3 text-center">
                                            {activeStep !== 1 ? (
                                                <>
                                                    {(activeStep !== 0 && activeStep !== 2) && <Button
                                                        onClick={handleBack}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        BACK
                                                    </Button>}
                                                    <Button
                                                        className={(activeStep !== 0 && activeStep !== 2) ? "ml-3" : ""}
                                                        onClick={handleCancel}
                                                        variant="contained"
                                                        color="primary"
                                                    >
                                                        CANCEL
                                                    </Button>
                                                    <Button
                                                        className={"ml-3"}
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        {activeStep === steps.length - 1 ? "LET'S GO!" : "NEXT"}
                                                    </Button>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </>
                    )}
                </Col>
            </Row>
            <Row className="footerMain">
                <Col>
                    <Footer />
                </Col>
            </Row>
            <OtpModal modalOtp={modalOtp} toggleModalOtp={toggleModalOtp} cell={methods.getValues("cell")} memberId={methods.getValues("memberId")} handleSendOtp={handleSendOtp} globalAlert={props.globalAlert} handleNext={handleNext}/>
            {modalImport && <ImportStyleModal modalImport={modalImport} toggleImport={toggleImport} selectedBrand={methods} />}
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        },
        setMenuListAction: (data) => {
            dispatch(setMenuListAction(data))
        },
        setModuleListAction: (data) => {
            dispatch(setModuleListAction(data))
        },
        setCountrySettingAction: (data) => {
            dispatch(setCountrySettingAction(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(Register);