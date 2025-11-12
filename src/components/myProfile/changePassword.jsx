import React, { useState, useRef, createRef, Fragment } from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import InputField from '../shared/commonControlls/inputField.jsx';
import { Button, IconButton, InputAdornment } from '@mui/material';
import { changePassword } from '../../actions/userActions.js';
import { connect } from 'react-redux';
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = (props) => {
    const { user } = props
    const inputRefs = useRef([createRef(), createRef(), createRef()]);
    const [data, setData] = useState({});
    const [num, setNum] = useState(0);
    const [low, setLow] = useState(0);
    const [upp, setUpp] = useState(0);
    const [spe, setSpe] = useState(0);
    const [len, setLen] = useState(0);
    const [showPassword, setShowPassword] = useState({"oldPassword": false, "newPassword": false, "confirmPassword": false});
    const handleClickShowPassword = (name) => {
        let value = !showPassword[name];
        setShowPassword(prev => ({ ...prev, [name]: value }));
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleChange = (name, value) => {
        if (name === "newpassword" || name === "confirmnewpassword") {
            value=value.replace(/\s/gi, "");
        }
        setData(prev => ({ ...prev, [name]: value }));
        if (name === "newpassword") {
            checkValidationPass(value);
        }
    }
    const checkValidationPass = (str) => {
        let upperCase = new RegExp('[A-Z]');
        let lowerCase = new RegExp('[a-z]');
        let numbers = new RegExp('[0-9]');
        let splChars = "*|,\":<>[]{}`';()@&$#%!";

        let num = 0;
        let low = 0;
        let upp = 0;
        let spe = 0;
        let len = 0;
        let i;
        for (i = 0; i < str.length; i++) {
            if (str[i].match(numbers)) {
                num = 1;
            }
            else if (str[i].match(lowerCase)) {
                low = 1;
            }
            else if (str[i].match(upperCase)) {
                upp = 1;
            }
            else if (splChars.indexOf(str.charAt(i)) !== -1) {
                spe = 1;
            }
        }
        if (str.length > 7) {
            len = 1;
        }

        if (num === 1) {
            setNum(1);
        }
        else {
            setNum(0);
        }

        if (low === 1) {
            setLow(1);
        }
        else {
            setLow(0);
        }

        if (upp === 1) {
            setUpp(1);
        }
        else {
            setUpp(0);
        }


        if (spe === 1) {
            setSpe(1);
        }
        else {
            setSpe(0);
        }

        if (len === 1) {
            setLen(1);
        }
        else {
            setLen(0);
        }

        if (num === 1 && low === 1 && upp === 1 && spe === 1 && len === 1) {
            return true;
        }
        else {
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
        if (data.newpassword !== data.confirmnewpassword) {
            isValid = false
            props.globalAlert({
                type: "Error",
                text: "NewPassword and Confirm Password not Match",
                open: true
            })
        }
        if (!isValid) {
            return
        }

        let payload = {
            ...user,
            "memberId": user.memberId,
            "newPassword": data.newpassword,
            "password": data.verifycurrentpassword
        }
        props.changePassword(payload);
    }
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>Change Password</h3>
                </Col>
            </Row>

            <Form onSubmit={submitForm}>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[0]}
                                type={showPassword.oldPassword ? 'text' : 'password'}
                                id="verifycurrentpassword"
                                name="verifycurrentpassword"
                                label="Verify Current Password"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.verifycurrentpassword || ""}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={()=>{handleClickShowPassword("oldPassword")}} onMouseDown={handleMouseDownPassword} >
                                                {showPassword.oldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[1]}
                                type={showPassword.newPassword ? 'text' : 'password'}
                                id="newPassword"
                                name="newpassword"
                                label="New password"
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
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[2]}
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
                        <Button type="submit" variant="contained" className="mt-3" color="primary">UPDATE</Button>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        changePassword: (data) => {
            dispatch(changePassword(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)