import React, { useState, useRef, createRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import {Box, Button} from '@mui/material';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import InputField from '../shared/commonControlls/inputField.jsx';
import {forgotPassword} from "../../actions/userActions.js";
import {siteURL, staticUrl, websiteTitle} from "../../config/api";
import { setGlobalAlertAction } from '../../actions/globalAlertActions.js';

const ForgotPassword = (props) => {
    const inputRefs = useRef([createRef()]);
    const [data, setData] = useState({});

    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
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
        props.forgotPassword(data);
    }
    useEffect(()=>{
        document.title = `Forgot Password - ${websiteTitle}`;
    },[]);
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
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    <Form onSubmit={submitForm} >
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="username"
                                name="username"
                                label="User Name"
                                onChange={(name,value)=>{handleChange(name,value.replaceAll(/[^a-zA-Z0-9_@.]/g, "")); }}
                                validation={"required"}
                                value={data?.username || ""}
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
        forgotPassword: (data) => {
            dispatch(forgotPassword(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ForgotPassword)