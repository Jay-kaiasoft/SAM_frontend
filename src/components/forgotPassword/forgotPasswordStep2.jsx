import React, {useState, useRef, createRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import {Box, Button} from '@mui/material';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import InputField from '../shared/commonControlls/inputField.jsx';
import {forgotPasswordStep2} from "../../actions/userActions.js";
import {siteURL, staticUrl} from "../../config/api";

const ForgotPasswordStep2 = (props) => {
    const {user} = props;
    const inputRefs = useRef([createRef()]);
    const [data, setData] = useState(user);
    const [submitClick, setSubmitClick] = useState(false);

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
        setSubmitClick(true);
        props.forgotPasswordStep2(data);
    }
    useEffect(()=>{
        if(props.globalAlert.type === "Error" && props.globalAlert.open === true)
            setSubmitClick(false);
    },[props.globalAlert]);
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
                        <p>Select Security Question For This Account : {user?.username}</p>
                        <p>{user?.question}</p>
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="answer"
                                name="answer"
                                label="Answer"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.answer || ""}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Link to={"/"}><Button variant="contained" className="float-right" color="primary" >CANCEL</Button></Link>
                            <Button type="submit" variant="contained" className="float-right mr-3" color="primary" disabled={submitClick} >{submitClick ? <i className="fad fa-spinner-third fa-spin fa-2x white"></i> : "NEXT" }</Button>
                        </FormGroup>
                    </Form>
                </Box>
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        forgotPasswordStep2: (data) => {
            dispatch(forgotPasswordStep2(data))
        }
    }
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        globalAlert: state.globalAlert
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordStep2)