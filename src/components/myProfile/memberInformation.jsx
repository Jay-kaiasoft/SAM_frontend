import React, { useState, useRef, createRef, Fragment, useEffect } from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import InputField from '../shared/commonControlls/inputField.jsx';
import DropDownControls from '../shared/commonControlls/dropdownControl.jsx';
import { connect } from 'react-redux';
import { updateprofile } from '../../actions/userActions.js';
import {getMemberprofileById} from '../../services/profileService.js'
import DropzoneControle from '../shared/commonControlls/dropeZone';
import {getCountry, getCountryToState, getLanguage, validatePhoneFormat} from "../../services/commonService";
import NumberField from "../shared/commonControlls/numberField";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import { websiteTitle } from '../../config/api.js';
import { checkUsername, verifyEmail } from '../../services/userService.js';
import { InputAdornment, Button } from '@mui/material';
import { validateEmail } from '../../assets/commonFunctions.js';

const MemberInformation = (props) => {
    const inputRefs = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);
    const numberRefsCreateContact = useRef([createRef(), createRef()]);
    const [data, setData] = useState([props.subUser.memberId > 0 ? props.subUser : props.user]);
    const [language, setLanguage] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [showCheckPasswordIcon, setShowCheckPasswordIcon] = useState("");
    const [showCheckEmailIcon, setShowCheckEmailIcon] = useState("");
    const [showProcessEmailIcon, setShowProcessEmailIcon] = useState("no");
    
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const fetchData = () => {
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
                let country = []
                res.result.country.map(x => (
                    country.push({
                        "key": String(x.id),
                        "value": x.cntName
                    })
                ));
                setCountry(country);
            }
        })
    }
    const changeCountry = (countryId) => {
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
    }
    const handleCheckUsername = async(username) => {
        if(username === ""){
            return false;
        }
        setShowCheckPasswordIcon("");
        const resC = await checkUsername(username, data?.memberId);
        if (resC.status !== 200) {
            props.globalAlert({
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
            props.globalAlert({
                type: "Error",
                text: "Please enter proper email",
                open: true
            });
            return false;
        }
        setShowCheckEmailIcon("");
        setShowProcessEmailIcon("yes");
        let temp = props.subUser.memberId > 0 ? props.subUser : props.user;
        let requestData = {
            "email": email,
            "memberId": temp.memberId
        }
        const resV = await verifyEmail(requestData);
        setShowProcessEmailIcon("no");
        if (resV.status === 409) {
            setShowCheckEmailIcon("no1");
            return false;
        } else if (resV.status !== 200) {
            props.globalAlert({
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
        fetchData();
        getMemberprofileById().then(res => {
            if (res) {
                setData(res);
                changeCountry(res.country);
            }
        });
    }, [])
    const submitForm = async (e) => {
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
        for (let i = 0; i < numberRefsCreateContact.current.length; i++) {
            const valid = numberRefsCreateContact.current[i].current.validateNumber()
            if (!valid) {
                isValid = false
            }
        }
        let validateMobile = "";
        if(typeof data.phone !== "undefined" && data.phone !== "" && data.phone !== null){
            validateMobile = await validatePhoneFormat(Number(data.country), data.phone);
            if(!validateMobile){
                props.globalAlert({
                    type: "Error",
                    text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
        }
        if(typeof data.cell !== "undefined" && data.cell !== "" && data.cell !== null){
            validateMobile = await validatePhoneFormat(Number(data.country), data.cell);
            if(!validateMobile){
                props.globalAlert({
                    type: "Error",
                    text: `Invalid cell number format or Do not put a national prefix on your cell number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
        }
        const resC = await checkUsername(data?.username, data?.memberId);
        if (resC.status !== 200) {
            props.globalAlert({
                type: "Error",
                text: resC.message,
                open: true,
            });
            setShowCheckPasswordIcon("no");
            return false;
        } else {
            setShowCheckPasswordIcon("yes");
        }
        setShowCheckEmailIcon("");
        setShowProcessEmailIcon("yes");
        let temp = props.subUser.memberId > 0 ? props.subUser : props.user;
        let requestData1 = {
            "email": data.email,
            "memberId": temp.memberId
        }
        const resV = await verifyEmail(requestData1);
        setShowProcessEmailIcon("no");
        if (resV.status === 409) {
            setShowCheckEmailIcon("no1");
            return false;
        } else if (resV.status !== 200) {
            props.globalAlert({
                type: "Error",
                text: resV.message,
                open: true,
            });
            setShowCheckEmailIcon("no");
            return false;
        } else {
            setShowCheckEmailIcon("yes");
        }
        if (!isValid) {
            return;
        }
        let requestData = {
            ...temp,
            "memberId": temp.memberId,
            "username": data.username,
            "email": data.email,
            "businessName": data.businessName,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "memberDefaultLanguage": data.memberDefaultLanguage,
            "country": Number(data.country),
            "state": data.state,
            "city": data.city,
            "address": data.address,
            "streetAddress": data.streetAddress,
            "postCode": data.postCode,
            "phone": data.phone,
            "cell": data.cell
        }
        props.setMemberInformation(requestData);
    }
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-4">
                    <div className="memberinfo-main">
                        <DropzoneControle manageusers />
                        <div className="member-info">
                            <h3 >Member Information</h3>
                            <h6 >Account Number : {data?.memberId}</h6>
                        </div>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={submitForm}>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[8]}
                                type="text"
                                id="username"
                                name="username"
                                label="Username"
                                onChange={(name, value)=>{handleChange(name, value.replaceAll(/[^a-zA-Z0-9_@.]/g, ""))}}
                                onBlur={(e)=>{handleCheckUsername(e.target.value.replaceAll(/[^a-zA-Z0-9_@.]/g, ""))}}
                                validation={"required"}
                                value={data?.username || ""}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            {showCheckPasswordIcon === "yes" ? <i className="far fa-check font-size-18 text-green"></i> : showCheckPasswordIcon === "no" ? <i className="far fa-times font-size-18 text-red"></i> : ""}
                                        </InputAdornment>
                                }}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[7]}
                                type="text"
                                id="email"
                                name="email"
                                label="Email"
                                onChange={handleChange}
                                onBlur={(e)=>{handleCheckEmail(e.target.value)}}
                                validation={"required"}
                                value={data?.email || ""}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            {showCheckEmailIcon === "yes" ? <i className="far fa-check font-size-18 text-green"></i> : (showCheckEmailIcon === "no" || showCheckEmailIcon === "no1") ? <i className="far fa-times font-size-18 text-red"></i> : ""}
                                        </InputAdornment>
                                }}
                            />
                            <p className={`mb-0 ${(showCheckEmailIcon === "yes" && showProcessEmailIcon === "no") && "text-green"} ${((showCheckEmailIcon === "no" || showCheckEmailIcon === "no1") && showProcessEmailIcon === "no") && "text-red"}`}>
                                { showProcessEmailIcon === "yes" && "Verifying email" }
                                { (showCheckEmailIcon === "yes" && showProcessEmailIcon === "no") && "This is a verified email" }
                                { (showCheckEmailIcon === "no" && showProcessEmailIcon === "no") &&  "This is not a valid email" }
                                { (showCheckEmailIcon === "no1" && showProcessEmailIcon === "no") &&  "Email is already register" }
                            </p>
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="businessName"
                                name="businessName"
                                label="Business Name"
                                onChange={handleChange}
                                value={data?.businessName || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[1]}
                                type="text"
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.firstName || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[2]}
                                type="text"
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.lastName || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[0]}
                                name="memberDefaultLanguage"
                                label="Language"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.memberDefaultLanguage || ""}
                                dropdownList={language}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[1]}
                                id="country"
                                name="country"
                                label="Country"
                                onChange={(e,v) => {handleChange(e,v);changeCountry(v);}}
                                validation={"required"}
                                value={Number(data?.country || "")}
                                dropdownList={country}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[2]}
                                name="state"
                                label="State"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.state || ""}
                                dropdownList={state}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[3]}
                                type="text"
                                id="address"
                                name="address"
                                label="Address 1"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.address || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[4]}
                                type="text"
                                id="streetAddress"
                                name="streetAddress"
                                label="Address 2"
                                onChange={handleChange}
                                value={data?.streetAddress || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[5]}
                                type="text"
                                id="city"
                                name="city"
                                label="City"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.city || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[6]}
                                type="text"
                                id="postCode"
                                name="postCode"
                                label="Zip / Post Code "
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.postCode || ""}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <NumberField
                                ref={numberRefsCreateContact.current[0]}
                                type="text"
                                id="phone"
                                name="phone"
                                label="Phone"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.phone || ""}
                                format="####################"
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <NumberField
                                ref={numberRefsCreateContact.current[1]}
                                type="text"
                                id="cell"
                                name="cell"
                                label="Cell"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.cell || ""}
                                format="####################"
                            />
                            <p className='mb-0'>By providing your cell phone number you opt in to receiving important products updates</p>
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
        setMemberInformation: (data) => {
            dispatch(updateprofile(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MemberInformation)