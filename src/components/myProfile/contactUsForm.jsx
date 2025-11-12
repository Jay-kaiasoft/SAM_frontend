import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import {Button} from "@mui/material";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {sendContactUs} from "../../services/profileService";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import { validateEmail } from '../../assets/commonFunctions';
import { websiteTitleWithExt } from '../../config/api';

const ContactUsForm = (props) => {
    const servicesList = [{"key":"Abuse","value":"Abuse"},{"key":"Account/Membership","value":"Account & Membership"},{"key":"Advertising","value":"Advertising"},{"key":"Website Related Issues","value":"Website Related Issues"},{"key":"Feedback","value":"Feedback"}];
    const inputRefs = useRef([createRef(),createRef(),createRef()]);
    const dropDownRefs = useRef([createRef()]);
    const [data, setData] = useState({});
    const [submitClick, setSubmitClick] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const handleReCaptchaVerify = useCallback(async () => {
        if (executeRecaptcha) {
            const token = await executeRecaptcha('contactus');
            setData(prev => ({ ...prev, "reCaptchaToken": token }));
        }
    }, [executeRecaptcha]);
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
        if(typeof data.email !== "undefined" && data.email !== "" && data.email !== null){
            if(!validateEmail(data.email)){
                props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
        }
        setSubmitClick(true);
        sendContactUs(data).then(res => {
            if(res.status === 200) {
                document.getElementById("contactForm").reset();
                setData({});
                setSubmitClick(false);
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            }
            else{
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                setSubmitClick(false);
            }
        });
    }
    useEffect(() => {
        handleReCaptchaVerify().then();
    }, [handleReCaptchaVerify]);
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={5} lg={5} xl={5} className="mx-auto">
                <h3 className="text-center">Support</h3>
                <p>Please contact {websiteTitleWithExt} by email or phone for technical support. We will respond all inquiries within 24 hours.</p>
                <form id="contactForm" name="contactForm" onSubmit={submitForm}>
                    <FormGroup>
                        <InputField
                            ref={inputRefs.current[0]}
                            type="text"
                            id="userName"
                            name="userName"
                            label="Your Name"
                            onChange={handleChange}
                            validation={"required"}
                            value={data?.userName || ""}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputField
                            ref={inputRefs.current[1]}
                            type="text"
                            id="email"
                            name="email"
                            label="Email"
                            onChange={handleChange}
                            validation={"required"}
                            value={data?.email || ""}
                        />
                    </FormGroup>
                    <FormGroup>
                        <DropDownControls
                            ref={dropDownRefs.current[0]}
                            id="services"
                            name="services"
                            label="Services"
                            onChange={handleChange}
                            dropdownList={servicesList}
                            validation={"required"}
                            value={data?.services || ""}
                        />
                    </FormGroup>
                    <FormGroup>
                        <InputField
                            ref={inputRefs.current[2]}
                            type="text"
                            id="message"
                            name="message"
                            label="Message"
                            onChange={handleChange}
                            validation={"required"}
                            value={data?.message || ""}
                            multiline={true}
                            minRows={4}
                        />
                    </FormGroup>
                    <Button variant="contained" color="primary" type="submit" disabled={submitClick}>{submitClick ? <i className="fad fa-spinner-third fa-spin fa-2x white"></i> : "SUBMIT" }</Button>
                </form>
            </Col>
        </Row>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(ContactUsForm);