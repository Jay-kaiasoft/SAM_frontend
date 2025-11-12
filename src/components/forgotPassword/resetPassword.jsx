import React, { useState, useRef, createRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import {Box,Button, IconButton, InputAdornment} from '@mui/material';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import InputField from '../shared/commonControlls/inputField.jsx';
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {resetPassword} from "../../actions/userActions";
import {siteURL, staticUrl} from "../../config/api";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { easUrlEncoder } from '../../assets/commonFunctions.js';

const ResetPassword = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = queryString.get("v") ? queryString.get("v") : "";
    const inputRefs = useRef([createRef(),createRef()]);
    const [data, setData] = useState({});
    const [num, setNum] = useState(0);
    const [low, setLow] = useState(0);
    const [upp, setUpp] = useState(0);
    const [spe, setSpe] = useState(0);
    const [len, setLen] = useState(0);
    const [showPassword, setShowPassword] = useState({"newPassword": false, "confirmPassword": false});
    const handleClickShowPassword = (name) => {
        let value = !showPassword[name];
        setShowPassword(prev => ({ ...prev, [name]: value }));
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleChange = (name, value) => {
        if (name === "newpassword" || name === "confirmpassword") {
            value=value.replace(/\s/gi, "");
        }
        setData(prev => ({ ...prev, [name]: value }))
        if (name === "newpassword") {
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
    const submitForm = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if(!checkValidationPass(data.newpassword)){
            props.globalAlert({
                type: "Error",
                text: "Invalid new password format.\nPlease use suggested combination in password",
                open: true
            });
            return false;
        }
        if (isValid && data.newpassword !== data.confirmpassword) {
            isValid = false
            props.globalAlert({
                type: "Error",
                text: "New Password and Confirm Password not Match",
                open: true
            })
        }
        if (!isValid) {
            return
        }
        let requestData = {
            "memId":id,
            "newPassword":data.newpassword
        };
        props.resetPassword(requestData);
    }

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
                    <h2 className="text-center mb-4">Reset Password</h2>
                    <Form onSubmit={submitForm} >
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type={showPassword.newPassword ? 'text' : 'password'}
                                id="newpassword"
                                name="newpassword"
                                label="New Password"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.newpassword || ""}
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
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[1]}
                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                id="confirmpassword"
                                name="confirmpassword"
                                label="Confirm Password"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.confirmpassword || ""}
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
                        <FormGroup>
                            <Link to={"/"}><Button variant="contained" className="float-right" color="primary" >CANCEL</Button></Link>
                            <Button type="submit" variant="contained" className="float-right mr-3" color="primary">NEXT</Button>
                        </FormGroup>
                    </Form>
                </Box>
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        resetPassword: (data) => {
            dispatch(resetPassword(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ResetPassword)