import React, { createRef, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Col, FormGroup, Row } from 'reactstrap';
import { siteURL, staticUrl } from './../../config/api';
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import InputField from "../shared/commonControlls/inputField";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { unsubscribe } from "../../services/commonService";

const OptIn = ({location, globalAlert}) => {
    const querySting = useMemo(() => { return new URLSearchParams(location.search) }, [location.search]);
    const inputRefs = useRef([createRef()]);
    const [data, setData] = useState({
        manyEmail: 0,
        notRel: 0,
        perEmail: 0,
        longerEmail: 0,
        other: 0,
        otherMsg: "",
        outType: ""
    });
    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.checked ? 1 : 0 });
    };
    const handleChangeInput = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const handleClickContinue = () => {
        if(data.manyEmail === 0 && data.notRel === 0 && data.perEmail === 0 && data.longerEmail === 0 && data.other === 0){
            globalAlert({
                type: "Error",
                text: "You must check one of the checkboxes.",
                open: true
            });
            return false;
        }
        if(data.outType === ""){
            globalAlert({
                type: "Error",
                text: "Please select option",
                open: true
            });
            return false;
        }
        let isValid = true;
        let isCheck;
        for (let i = 0; i < inputRefs.current.length; i++) {
            isCheck=1;
            if(i === 0 && data.other === 0) {
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
        let requestData = {
            ...data,
            "ui": querySting.get("ui") ? querySting.get("ui") : "",
            "ci": querySting.get("ci") ? querySting.get("ci") : "",
            "m": querySting.get("m") ? querySting.get("m") : ""
        }
        unsubscribe(requestData).then((res)=>{
            if(res.status === 200){
                globalAlert({
                    type: "Success",
                    text: res?.message,
                    open: true
                });
                setTimeout(()=>{
                    window.location.href=`${staticUrl}/index.html`;
                },3000);
            } else{
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    return (
        <Row className="py-5">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <p className="text-center mb-5">
                    <a className="navbar-brand mr-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                </p>
                <h3 className="text-center">Unsubscribed</h3>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <Row>
                    <p>We are sorry to see you go.</p>
                    <p>Can you please tell us why you are leaving so we can better manage our customers?</p>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.manyEmail === 1} color="primary" onChange={handleChange} name="manyEmail" />}
                                label="Too many emails"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.notRel === 1} color="primary" onChange={handleChange} name="notRel" />}
                                label="Not relevant to what I want"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.perEmail === 1} color="primary" onChange={handleChange} name="perEmail" />}
                                label="I never registered with this company or gave them permission to use my email address"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.longerEmail === 1} color="primary" onChange={handleChange} name="longerEmail" />}
                                label="I just no longer want to receive emails from this company"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup className="m-0">
                            <FormControlLabel
                                control={<Checkbox checked={data.other === 1} color="primary" onChange={handleChange} name="other" />}
                                label="Other"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="otherMsg"
                                name="otherMsg"
                                label="Explanation"
                                onChange={handleChangeInput}
                                validation={"required"}
                                value={data?.otherMsg || ""}
                                disabled={data.other === 1 ? false : true}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FormControl className="text-left mt-5">
                            <FormLabel id="demo-controlled-radio-buttons-group">If you want to unsubscribe, please select option below</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="outType"
                                value={data?.outType}
                                onChange={(e)=>{handleChangeInput(e.target.name, e.target.value)}}
                            >
                                <FormControlLabel value="removeThisList" control={<Radio />} label="Remove my contact from this list" />
                                <FormControlLabel value="removeAllList" control={<Radio />} label="Remove my contact from all lists" />
                            </RadioGroup>
                        </FormControl>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <Button type="button" variant="contained" className="mt-5" color="primary" onClick={()=>{handleClickContinue()}}>CONTINUE</Button>
                    </Col>
                </Row>
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
export default connect(null, mapDispatchToProps)(OptIn);