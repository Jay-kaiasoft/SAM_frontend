import React, { useState, useRef, createRef, useEffect } from 'react';
import { Row, Col, Form, FormGroup } from "reactstrap";
import { Box, Button } from '@mui/material';
import CorousealsComponent from "../shared/carouselsComponent/corouselsComponent";
import InputField from '../shared/commonControlls/inputField.jsx';
import DropDownControls from '../shared/commonControlls/dropdownControl';
import { registerStep2UserAction } from "../../actions/userActions";
import { connect } from "react-redux";
import History from "../../history";
import {getSecurityQuestion} from "../../services/commonService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {siteURL, staticUrl} from "../../config/api";

const RegisterStep2 = (props) => {
    const { user } = props;
    const inputRefs = useRef([createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);
    const [data, setData] = useState({});
    const [question, setQuestion] = useState([]);
    const [submitClick, setSubmitClick] = useState(false);
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const fetchLookUp = () => {
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
    }
    const goBack = () => {
        History.push("/register?v="+user.planId);
    }
    useEffect(() => {
        fetchLookUp();
    }, []);
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
        setSubmitClick(true);
        let requestData ={
            ...user,
            ...data,
            memberId: 0
        }
        props.registerstep2(requestData);
    }
    useEffect(()=>{
        if(props.globalAlertState.type === "Error" && props.globalAlertState.open === true)
            setSubmitClick(false);
    },[props.globalAlertState]);
    return (
        <>
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
                        <h2 className="text-center mb-4">Great, now that your account is created, lets secure it</h2>
                        <p>
                            Security Questions:<br />
                            These security questions and answers will be used in the event you have fogotten your password, for online account recovery. Choose questions that are not easily guessed or researched, are simple and memorable to you and will not change over time.
                        </p>
                        <Form onSubmit={submitForm} >
                            <Row>
                                <Col md={1} style={{ paddingTop: "20px" }}>1</Col>
                                <Col md={11}>
                                    <FormGroup>
                                        <DropDownControls
                                            ref={dropDownRefs.current[0]}
                                            name="secQus1"
                                            label="Security Question One"
                                            onChange={handleChange}
                                            validation={"required"}
                                            dropdownList={question}
                                            value={data?.secQus1 || ""}
                                        />
                                    </FormGroup>
                                    <FormGroup>
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
                                </Col>
                                <Col md={1} style={{ paddingTop: "20px" }}>2</Col>
                                <Col md={11}>
                                    <FormGroup>
                                        <DropDownControls
                                            ref={dropDownRefs.current[1]}
                                            name="secQus2"
                                            label="Security Question Two"
                                            onChange={handleChange}
                                            validation={"required"}
                                            dropdownList={question}
                                            value={data?.secQus2 || ""}
                                        />
                                    </FormGroup>
                                    <FormGroup>
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
                                </Col>
                                <Col md={1} style={{ paddingTop: "20px" }}>3</Col>
                                <Col md={11}>
                                    <FormGroup>
                                        <DropDownControls
                                            ref={dropDownRefs.current[2]}
                                            name="secQus3"
                                            label="Security Question Three"
                                            onChange={handleChange}
                                            validation={"required"}
                                            dropdownList={question}
                                            value={data?.secQus3 || ""}
                                        />
                                    </FormGroup>
                                    <FormGroup>
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
                                </Col>
                            </Row>
                            <FormGroup className="text-center mt-5">
                                <Button id="setData" type="submit" variant="contained" color="primary" disabled={submitClick} >{submitClick ? <i className="fad fa-spinner-third fa-spin fa-2x white"></i> : "SET MY SECURITY" }</Button>
                                <Button type="button" variant="contained" className="ml-3" color="primary" onClick={()=>{goBack()}}>BACK</Button>
                            </FormGroup>
                        </Form>
                    </Box>
                </Col>
            </Row>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        globalAlertState: state.globalAlert
    }
}
const mapDispatchToProps = dispatch => {
    return {
        registerstep2: (data) => {
            dispatch(registerStep2UserAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterStep2)