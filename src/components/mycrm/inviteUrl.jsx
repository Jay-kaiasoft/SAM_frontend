import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Col, Form, FormGroup, Row} from "reactstrap";
import InputField from "../shared/commonControlls/inputField";
import NumberField from "../shared/commonControlls/numberField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import $ from "jquery";
import {addInviteByUrlContact, getContact, getInviteByUrlData} from "../../services/clientContactService";
import {getCountry, getCountryToState, getLanguage, validatePhoneFormat} from "../../services/commonService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {Button, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {dateFormat, validateEmail} from "../../assets/commonFunctions";
import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {reCaptchaSiteKey, siteURL, staticUrl, websiteTitle} from "../../config/api";

export const InviteUrlForm = (props) => {
    const inputRefs = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef(), createRef()]);
    const numberRefs = useRef([createRef()]);
    const [data, setData] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [language, setLanguage] = useState([]);
    const [inviteByUrlData, setInviteByUrlData] = useState(null);
    let inputRefsCount = 8;
    const { executeRecaptcha } = useGoogleReCaptcha();
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
        if(name === "email"){
            let t = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if(t !== null){
                value = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)[0];
            }
        }
        if(name === "firstName"){
            setData((prev) => ({ ...prev, [name]: value, "fullName":`${value} ${typeof data?.lastName !== "undefined" ? data?.lastName : ""}`.trim() }));
        } else if(name === "lastName"){
            setData((prev) => ({ ...prev, [name]: value, "fullName":`${typeof data.firstName !== "undefined" ? data.firstName : "" } ${value}`.trim() }));
        } else {
            setData((prev) => ({ ...prev, [name]: value }));
        }
    }
    const fetchData = useCallback(async () => {
        await getCountry().then(res => {
            if (res.result.country) {
                let country = []
                res.result.country.map(x => (
                    country.push({
                        "key": x.cntName,
                        "value": x.cntName,
                        "id": x.id
                    })
                ));
                if(typeof data.country !== "undefined" && data.country !== "" && data.country !== null){
                    changeCountry(country.find((val)=> (data.country === val.value)).id);
                }
                setCountry(country);
            }
        })
        let requestData = {
            "q":props.props.location.search.replace("?q=","")
        }
        await getInviteByUrlData(requestData).then(res => {
            if (res.status === 200) {
                setInviteByUrlData(res.result);
                if(res.result.emailId !== 0){
                    getContact(res.result.emailId).then(res1 => {
                        if (res1.status === 200) {
                            if(typeof res1.result.country !== "undefined" && res1.result.country !== "" && res1.result.country !== null){
                                setData(prev => ({ ...prev, ...res1.result }));
                            } else {
                                setData(prev => ({ ...prev, ...res1.result, "country": "United States" }));
                            }
                        } else {
                            props.props.globalAlert({
                                type: "Error",
                                text: res1.message,
                                open: true
                            });
                            setTimeout(()=>{
                                window.location.href=`${staticUrl}/index.html`;
                            },3000);
                        }
                    });
                } else {
                    setData(prev => ({ ...prev, "country": "United States" }));
                }
            } else {
                props.props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
        await getLanguage().then(res => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
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
    const submitForm =async (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if((typeof data.email === "undefined" || data.email === "" || data.email === null) && (typeof data.phoneNumber === "undefined" || data.phoneNumber === "" || data.phoneNumber === null)){
            isValid = false;
            props.props.globalAlert({
                type: "Error",
                text: `Please Enter Email Or Mobile Number`,
                open: true
            });
            return;
        } else if(typeof data.email !== "undefined" && data.email !== "" && data.email !== null){
            if(!validateEmail(data.email)){
                props.props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
        }
        let cntId = country.find((val)=> (data.country === val.value)).id;
        if(typeof data.phoneNumber !== "undefined" && data.phoneNumber !== "" && data.phoneNumber !== null) {
            let isValidPh = await validatePhoneFormat(cntId, data.phoneNumber);
            if(!isValidPh){
                props.props.globalAlert({
                    type: "Error",
                    text: `Invalid mobile number format or Do not put a national prefix on your mobile number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                });
                return;
            }
        }
        if (!isValid) {
            return
        }
        const token = await executeRecaptcha('invitebyurl');
        let requestData = {
            ...data,
            "reCaptchaToken": token,
            "phoneNumber":data.phoneNumber,
            "groupId":inviteByUrlData.groupId,
            "memberId":inviteByUrlData.memberId,
            "subMemberId":inviteByUrlData.subMemberId,
            "emailId":inviteByUrlData.emailId
        }
        addInviteByUrlContact(requestData).then(async (res) => {
            if (res.status === 200) {
                setData([]);
                const token = await executeRecaptcha('invitebyurl');
                setData(prev => ({ ...prev, "reCaptchaToken": token }));
                props.props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                props.props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(()=>{
        fetchData();
    },[fetchData]);
    return (
        <>
            <div className="overflow-auto" style={{height: "calc(100% - 70px)"}}>
                <Row className="mx-0 my-5">
                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                        {
                            (typeof inviteByUrlData?.whiteListingLogo !== "undefined" && inviteByUrlData?.whiteListingLogo !== "" && inviteByUrlData?.whiteListingLogo !== null) &&
                            <p className="text-center mb-5">
                                <img src={inviteByUrlData?.whiteListingLogo} alt="logo" className="logo-main" />
                            </p>
                        }
                        <Form onSubmit={submitForm}>
                            <h3 className="text-center">{inviteByUrlData?.emailId === 0 ? "Add" : "Edit"} Member</h3>
                            <h4 className="mt-4">Member Fields</h4>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    onChange={handleChange}
                                    value={data?.firstName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[1]}
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    onChange={handleChange}
                                    value={data?.lastName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[2]}
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    label="Full Name"
                                    onChange={handleChange}
                                    value={data?.fullName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[3]}
                                    type="text"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={handleChange}
                                    value={data?.email || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <NumberField
                                    ref={numberRefs.current[0]}
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Mobile Number"
                                    onChange={handleChange}
                                    value={data?.phoneNumber || ""}
                                    format="####################"
                                />
                            </FormGroup>
                            <FormGroup component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup row aria-label="gender" name="gender" value={data?.gender || ""} onChange={(e)=>{handleChange(e.target.name,e.target.value)}}>
                                    <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
                                </RadioGroup>
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={new Date(data?.birthday) || null}
                                        label="Date Of Birth (MM/DD/YYYY)"
                                        inputFormat="MM/dd/yyyy"
                                        onChange={(Value) => {
                                            handleChange("birthday", dateFormat(Value))
                                        }}
                                        slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                        maxDate={new Date()}
                                    />
                                </LocalizationProvider>
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefs.current[0]}
                                    id="country"
                                    name="country"
                                    label="Country"
                                    onChange={(e,v) => {handleChange(e,v);changeCountry(country.find((val)=> (v === val.value)).id);}}
                                    validation={"required"}
                                    value={data?.country || ''}
                                    dropdownList={country}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefs.current[1]}
                                    id="stateProvRegion"
                                    name="stateProvRegion"
                                    label="State"
                                    onChange={handleChange}
                                    value={data?.stateProvRegion || ''}
                                    dropdownList={state}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[4]}
                                    type="text"
                                    id="streetAddress1"
                                    name="streetAddress1"
                                    label="Street Address1"
                                    onChange={handleChange}
                                    value={data?.streetAddress1 || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[5]}
                                    type="text"
                                    id="streetAddress2"
                                    name="streetAddress2"
                                    label="Street Address2"
                                    onChange={handleChange}
                                    value={data?.streetAddress2 || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[6]}
                                    type="text"
                                    id="city"
                                    name="city"
                                    label="City"
                                    onChange={handleChange}
                                    value={data?.city || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[7]}
                                    type="text"
                                    id="zipPostalCode"
                                    name="zipPostalCode"
                                    label="Zip / Post Code "
                                    onChange={handleChange}
                                    value={data?.zipPostalCode || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefs.current[2]}
                                    id="usDefaultLanguage"
                                    name="usDefaultLanguage"
                                    label="Language"
                                    onChange={handleChange}
                                    value={data?.usDefaultLanguage || ""}
                                    dropdownList={language}
                                />
                            </FormGroup>
                            { inviteByUrlData?.udfs?.length > 0 && <h4 className="mt-4">Custom Fields</h4>}
                            {
                                !$.isEmptyObject(inviteByUrlData) ?
                                    inviteByUrlData["udfs"].map((value,index)=> {
                                        return (<FormGroup key={index} className='mb-4'>
                                            <InputField
                                                ref={inputRefs.current[inputRefsCount++]}
                                                type="text"
                                                id={`udf${value.udfLabel}`}
                                                name={`udf${value.udfLabel}`}
                                                label={value.udf}
                                                onChange={handleChange}
                                                value={data[`udf${value.udfLabel}`] || ""}
                                            />
                                        </FormGroup>);
                                    })
                                :
                                    null
                            }
                            <Button type="submit" variant="contained" className="mt-3" color="primary">{inviteByUrlData?.emailId === 0 ? "CREATE" : "UPDATE"}</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
            <Row className="footerMain">
                <Col xs={12} className="p-0">
                    <hr className="mt-0"/>
                </Col>
                <Col xs={12} className="mb-3 text-center">
                    Powered by <a className="navbar-brand mr-0 p-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-footer" /></a>
                </Col>
            </Row>
        </>
    )
}
const InviteUrl = (props) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={reCaptchaSiteKey}>
            <InviteUrlForm props={props}/>
        </GoogleReCaptchaProvider>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(InviteUrl);