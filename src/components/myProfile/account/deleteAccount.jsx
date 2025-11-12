import React, {useState, Fragment, useRef, createRef, useEffect, useCallback} from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { Button, Checkbox, FormControlLabel, Link, IconButton, InputAdornment } from '@mui/material';
import InputField from '../../shared/commonControlls/inputField.jsx';
import History from "../../../history";
import {dateFormat, getHostData, timeFormat} from "../../../assets/commonFunctions";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setGlobalAlertAction } from './../../../actions/globalAlertActions';
import { checkPassword, deleteAccount, removeCreditCard } from '../../../services/profileService.js';
import { setConfirmDialogAction } from './../../../actions/confirmDialogActions';
import UninvoicedModal from './../uninvoicedModal';
import { logoutUserAction } from '../../../actions/userActions.js';
import { websiteTitle } from '../../../config/api.js';
import { checkLogin } from '../../../services/userService.js';
import AuthIDComponent from '@authid/react-component';

const DeleteAccount = ({globalAlert, confirmDialog, logOut, user}) => {
    const inputRefs = useRef([createRef(),createRef(),createRef()]);
    const [data, setData] = React.useState({
        knowwhy0: false,
        knowwhy1: false,
        knowwhy2: false,
        knowwhy3: false,
        knowwhy4: false,
        knowwhy5: false,
        knowwhy6: false,
        acn0: false,
        acn1: false
    });
    const cdate=new Date();
    const displayDate = dateFormat(cdate);
    const displayTime = timeFormat(cdate);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modalData, setModalData] = useState({});
    const [ipAddress, setIpAddress] = useState("");
    const [loginPreference, setLoginPreference] = useState("");
    const [loginCount, setLoginCount] = useState(1);
    const [finalUrl, setFinalUrl] = useState(null);
    const [authenticProceedSuccess, setAuthenticProceedSuccess] = useState(false);
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.checked });
    };

    const handleChangeInput = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const setDaLeavingDetails = () => {
        let i=1;
        let daLeavingDetails = "";
        if(data.knowwhy0 === true){
            daLeavingDetails+=i+". The pricing is confusing.<br>";
            i++;
        }
        if(data.knowwhy1 === true)
        {
            daLeavingDetails+=i+". The product is too difficult to use.<br>";
            i++;
        }

        if(data.knowwhy2 === true)
        {
            daLeavingDetails+=i+". I am going to use a different solution.<br>";
            i++;
        }

        if(data.knowwhy3 === true)
        {
            daLeavingDetails+=i+". The pricing is too high.<br>";
            i++;
        }

        if(data.knowwhy4 === true)
        {
            daLeavingDetails+=i+". I do not need the service anymore.<br>";
            i++;
        }

        if(data.knowwhy5 === true)
        {
            daLeavingDetails+=i+". The product lacks the necessary features.<br>";
            i++;
        }
        if(data.knowwhy6 === true)
        {
            daLeavingDetails+=i+". Other (Please explain).<br>";
            daLeavingDetails+=" -> "+data?.explanation;
        }
        return daLeavingDetails;
    }
    const handleCallDeleteAccount = () => {
        confirmDialog({
            open: true,
            title: `You are about to delete your account.\nAll of your account data will be deleted and can not be recovered.\nAre you sure you want to leave ${websiteTitle}?`,
            onConfirm: ()=>{
                if(modal === true){
                    toggle();
                }
                let daLeavingDetails = setDaLeavingDetails();
                let requestData = {
                    "daLeavingDetails": daLeavingDetails
                }
                deleteAccount(requestData).then((res)=>{
                    if(res.status === 200){
                        globalAlert({
                            type: "Success",
                            text: res?.message,
                            open: true
                        });
                        setTimeout(()=>{
                            logOut();
                        },2000);
                    } else{
                        globalAlert({
                            type: "Error",
                            text: res?.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleClickPayNow = () => {
        if(modal === true){
            toggle();
        }
        let daLeavingDetails = setDaLeavingDetails();
        let requestData = {
            "deleteProfileMode":2,
            "daLeavingDetails":daLeavingDetails,
            "chkPayNow":"",
            "newCc":""
        }
        removeCreditCard(requestData).then((res)=>{
            if(res.status === 200){
                globalAlert({
                    type: "Success",
                    text: res?.message,
                    open: true
                });
                setTimeout(()=>{
                    logOut();
                },2000);
            } else{
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const submitForm = (e) => {
        e.preventDefault();
        if(data.knowwhy0 === false && data.knowwhy1 === false && data.knowwhy2 === false && data.knowwhy3 === false && data.knowwhy4 === false && data.knowwhy5 === false && data.knowwhy6 === false){
            globalAlert({
                type: "Error",
                text: "Please let us know why you are leaving.",
                open: true
            });
            return false;
        }
        if(data.acn0 === false || data.acn1 === false){
            globalAlert({
                type: "Error",
                text: "Please click on the 2 acknowledge checkboxes if you agree!",
                open: true
            });
            return false;
        }
        let isValid = true;
        let isCheck;
        for (let i = 0; i < inputRefs.current.length; i++) {
            isCheck=1;
            if(i === 1 && loginPreference !== "passwordAuthenticator"){
                isCheck=0;
            }
            if(i === 2 && data.knowwhy6 === false) {
                isCheck=0;
            }
            if(isCheck === 1) {
                const valid = inputRefs.current[i].current.validate()
                if (!valid) {
                    isValid = false
                }
            }
        }
        if (!isValid) {
            return
        }
        if(data.typedelete !== "DELETE"){
            globalAlert({
                type: "Error",
                text: "Please DELETE statement in Type.",
                open: true
            });
            return false;
        }
        if(loginPreference === "authidAuthenticator" && !authenticProceedSuccess){
            globalAlert({
                type: "Error",
                text: 'Biometric Authentication is required to delete accout.\nPlease click "BIOMETRIC AUTHENTICATION" button.',
                open: true
            });
            return false;
        }
        let requestData = {
            "password": data.password,
            "flag": loginPreference === "passwordAuthenticator" ? 1 : 0
        }
        checkPassword(requestData).then((res)=>{
            if(res.status === 200){
                setModalData(res.result);
                if(res.result.authorizeCustomerProfileId === "" || res.result.authorizeCustomerProfileId === null || res.result.tranTotalMember === 0){
                    handleCallDeleteAccount();
                } else if(res.result.unInv === 1 && res.result.tranTotalMember>=res.result.invLessAmtNotCharge){
                    toggle();
                } else {
                    toggle();
                }
            } else{
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const handleProceed = () => {
        let requestData = {
            username: user?.username
        };
        checkLogin(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.loginPreference === "authidAuthenticator"){
                    setFinalUrl("https://id.authid.ai/?t="+res.result.transactionId+"&s="+res.result.oneTimeSecret);
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
    const handleClickClose = () => {
        setFinalUrl(null);
    }
    const handleMessage = useCallback((event) => {
        if (event?.data?.params?.message === "LIVENESS_FINISHED") {
            setLoginCount((prev)=>{return prev+1;});
        }
        if(event.data.pageName === "verifiedMatchFailPage" && event.data.success === false){
            setLoginCount((prev)=>{return prev+3;});
        }
        if(event.data.pageName === "verifiedPage"){
            if (event.data.success) {
                setAuthenticProceedSuccess(true);
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
            globalAlert({
                type: "Error",
                text: "Your biometric authentication failed multiple times.\n\nPlease try to delete using your password.",
                open: true
            });
            setLoginPreference("passwordAuthenticator");
            setFinalUrl(null);
        }
    },[loginCount]);
    useEffect(()=>{
        getHostData().then((res) => {
            setIpAddress(res.data.ip);
        });
        setLoginPreference(user.loginPreference);
    },[]);

    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    Thank you for using {websiteTitle}. If there is anything we can do to keep you as a customer, <Link component="button" onClick={()=>{History.push("/contactus")}}>Please let us know</Link>.
                </Col>
            </Row>
            <Form onSubmit={submitForm} className="pt-3">
                <p>Please take a moment to let us know why you are leaving:</p>
                <Row>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy0} color="primary" onChange={handleChange} name="knowwhy0" />}
                                label="The pricing is confusing."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy1} color="primary" onChange={handleChange} name="knowwhy1" />}
                                label="The product is too difficult to use."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy2} color="primary" onChange={handleChange} name="knowwhy2" />}
                                label="I am going to use a different solution."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy3} color="primary" onChange={handleChange} name="knowwhy3" />}
                                label="The pricing is too high"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy4} color="primary" onChange={handleChange} name="knowwhy4" />}
                                label="I do not need the service anymore."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy5} color="primary" onChange={handleChange} name="knowwhy5" />}
                                label="The product lacks the necessary features."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.knowwhy6} color="primary" onChange={handleChange} name="knowwhy6" />}
                                label="Other (Please explain)."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[2]}
                                type="text"
                                id="explanation"
                                name="explanation"
                                label="Explanation"
                                onChange={handleChangeInput}
                                validation={"required"}
                                value={data?.explanation || ""}
                                disabled={data.knowwhy6 ? false : true}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="pt-5 pb-5">
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}  >
                        If you have any pending financal transaction you will still be responsible for those charges:
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.acn0} color="primary" onChange={handleChange} name="acn0" />}
                                label="Yes, I achnowledge that i am still responsible for any outstanding charges."
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.acn1} color="primary" onChange={handleChange} name="acn1" />}
                                label={`Yes, I want to permanent delete this ${websiteTitle} Account and all its data.`}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        Please enter "DELETE" and your password below to confirm that you wish to close your account:
                    </Col>
                    <Col xs={6} sm={6} md={4} lg={4} xl={4}>
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="typedelete"
                                name="typedelete"
                                label="Type 'DELETE'"
                                onChange={handleChangeInput}
                                validation={"required"}
                                value={data?.typedelete || ""}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={6} sm={6} md={8} lg={8} xl={8} className="pt-4">
                        <p>Your Current IP Address And Location: {ipAddress}</p>

                    </Col>
                    <Col xs={6} sm={6} md={4} lg={4} xl={4} className='d-flex align-items-center'>
                        {
                            loginPreference === "passwordAuthenticator" ?
                                <FormGroup>
                                    <InputField
                                        ref={inputRefs.current[1]}
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        label="Password"
                                        onChange={handleChangeInput}
                                        validation={"required"}
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
                                </FormGroup>
                            :
                                loginPreference === "authidAuthenticator" &&
                                    authenticProceedSuccess ?
                                        <p className='mb-0 text-green'><i className="far fa-check font-size-18 text-green mr-3"></i>Biomatric Authentication Successfully</p>
                                    :
                                        <Button variant="contained" type="button" color="primary" onClick={()=>{handleProceed();}}>BIOMETRIC AUTHENTICATION</Button>
                        }
                    </Col>
                    <Col xs={6} sm={6} md={8} lg={8} xl={8} className='d-flex align-items-center'>
                        <p className='mb-0'>Date and Time: {displayDate} @ {displayTime}</p>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className='mt-3'>
                        <Button type="submit" variant="contained" color="error">DELETE ACCOUNT</Button>
                    </Col>
                </Row>
            </Form>
            <UninvoicedModal toggle={toggle} modal={modal} modalData={modalData} handleCallDeleteAccount={handleCallDeleteAccount} handleClickPayNow={handleClickPayNow} />
            {
                finalUrl && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                    <i id='authenticator-close-icon' className='far fa-times font-size-20' onClick={()=>{handleClickClose();}}></i>
                    <AuthIDComponent
                        url={finalUrl}
                        webauth={true}
                    />
                </div>
            }
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user
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
        logOut : () => {
            dispatch(logoutUserAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);