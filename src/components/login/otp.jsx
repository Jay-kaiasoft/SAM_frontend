import React, { useState, useRef, createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import { verifiedOtpAction } from '../../actions/userActions.js';
import Button from '@mui/material/Button';
import InputField from '../shared/commonControlls/inputField.jsx';
import {numberOnly} from "../../assets/commonFunctions";
import {siteURL, staticUrl} from "../../config/api";
import { sendOtpAuthenticationCode } from '../../services/userService.js';
import { setGlobalAlertAction } from '../../actions/globalAlertActions.js';

const Otp = (props) => {
    const inputRefs = useRef([createRef()]);
    const [data, setData] = useState({VerifyedOtp:""});
    const [counter, setCounter] = useState(30);

    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: (numberOnly(value) !== "" ? numberOnly(value) : "") }));
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
        if (!isValid) {
            return
        }
        let requestData = {
            otp:localStorage.getItem("otp"),
            memberId:Number(localStorage.getItem("id")),
            verifyedOtp:data.VerifyedOtp
        }
        props.verifiedOtp(requestData);
    }
    const handleClickResendOtp = () => {
        sendOtpAuthenticationCode(Number(localStorage.getItem("id"))).then(res => {
            if (res.status === 304) {
                localStorage.setItem("otp", res.result.otp);
                setCounter(30);
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    useEffect(()=>{
        let interval = null;
        interval = setInterval(() => {
            if(counter !== 0){
                setCounter((prev)=>{
                    return prev-1;
                })
            }
        }, 1000);
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    },[counter]);

    return (
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
                    <h2 className="text-center mb-4">Authentication Code</h2>
                    <br></br>
                    <Form onSubmit={submitForm} >
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="VerifyedOtp"
                                name="VerifyedOtp"
                                label="Authentication Code"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.VerifyedOtp || ""}
                            />
                        </FormGroup>
                        <FormGroup className="d-flex align-items-center justify-content-end">
                            {
                                counter === 0 ?
                                    <Button type="button" variant="contained" className="mr-3" color="primary" onClick={()=>{handleClickResendOtp();}}>RESEND OTP</Button>
                                :
                                    <p className="mb-0 mr-3">{`00:${counter > 9 ? counter : "0"+counter}`}</p>
                            }
                            <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                        </FormGroup>
                    </Form>
                </Box>
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        verifiedOtp: (data) => {
            dispatch(verifiedOtpAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Otp)