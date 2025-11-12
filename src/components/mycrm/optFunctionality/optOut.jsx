import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Col, Row } from 'reactstrap';
import { siteURL, staticUrl } from "../../../config/api";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { optOut, optOutDetails } from "../../../services/clientContactService";
import { easUrlEncoder } from "../../../assets/commonFunctions";

const OptOut = ({location, globalAlert}) => {
    const querySting = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const [optOutValue, setOptOutValue] = useState("");
    const [data, setData] = useState({});
    const handleClickOptOut = () => {
        if(optOutValue === ""){
            globalAlert({
                type: "Error",
                text: "Please select option",
                open: true
            });
            return false;
        }
        let requestData = {
            "encMemberId": querySting.get("v") ? querySting.get("v") : "",
            "encGroupId": querySting.get("w") ? querySting.get("w") : "",
            "encEmailId": querySting.get("y") ? querySting.get("y") : "",
            "email": (typeof data?.clientEmail !== "undefined" && data?.clientEmail !== "" && data?.clientEmail !== null) ? data?.clientEmail : "",
            "phoneNumber": (typeof data?.clientPhoneNumber !== "undefined" && data?.clientPhoneNumber !== "" && data?.clientPhoneNumber !== null) ? data?.clientPhoneNumber : "",
            "optOutType": optOutValue
        }
        optOut(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                setTimeout(()=>{
                    window.location.href=`${staticUrl}/index.html`;
                },3000);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    useEffect(()=>{
        let requestData = {
            "encMemberId": querySting.get("v") ? querySting.get("v") : "",
            "encGroupId": querySting.get("w") ? querySting.get("w") : "",
            "encEmailId": querySting.get("y") ? querySting.get("y") : ""
        }
        optOutDetails(requestData).then(res => {
            if (res.status === 200) {
                setData(res.result.optOutDetails);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    },[globalAlert,querySting]);
    return (
        <>
            <div className="overflow-auto" style={{height: "calc(100% - 70px)"}}>
                <Row className="mx-0 my-5">
                    <Col xs={12}>
                        {
                            (typeof data?.whiteListingLogo !== "undefined" && data?.whiteListingLogo !== "" && data?.whiteListingLogo !== null) &&
                            <p className="text-center mb-5">
                                <img src={data?.whiteListingLogo} alt="logo" className="logo-main" />
                            </p>
                        }
                        <div className="d-flex flex-column align-items-center">
                            <div>
                                <p>Hi {data?.clientName}</p>
                                <p>You have previously opt-in to group name "{data?.groupName}" by {(typeof data?.businessName !== "undefined" && data?.businessName !== "" && data?.businessName !== null) ? data?.businessName : data?.memberName}</p>
                                {(typeof data?.clientEmail !== "undefined" && data?.clientEmail !== "" && data?.clientEmail !== null) && <p>Your email is {data?.clientEmail}</p>}
                                {(typeof data?.clientPhoneNumber !== "undefined" && data?.clientPhoneNumber !== "" && data?.clientPhoneNumber !== null) && <p>Your mobile no. is {data?.clientPhoneNumber}</p>}
                            </div>
                        </div>
                        <div className="text-center">
                            <FormControl className="text-left mt-5">
                                <FormLabel id="demo-controlled-radio-buttons-group">If you want to Opt Out, please select option below</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={optOutValue}
                                    onChange={(e)=>{setOptOutValue(e.target.value)}}
                                >
                                    {(typeof data?.clientPhoneNumber !== "undefined" && data?.clientPhoneNumber !== "" && data?.clientPhoneNumber !== null) && <FormControlLabel value="phone" control={<Radio />} label="Do not contact me on this mobile phone" />}
                                    {(typeof data?.clientEmail !== "undefined" && data?.clientEmail !== "" && data?.clientEmail !== null) && <FormControlLabel value="email" control={<Radio />} label="Do not contact me with this email address" />}
                                    <FormControlLabel value="removeThisList" control={<Radio />} label="Remove my contact from this list" />
                                    <FormControlLabel value="removeAllList" control={<Radio />} label="Remove my contact from all lists" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className="text-center">
                            <Button variant="contained" color="primary" className="mt-3" onClick={()=>{handleClickOptOut()}} >OPT OUT</Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row className="footerMain">
                <Col xs={12} className="p-0">
                    <hr class="mt-0"/>
                </Col>
                <Col xs={12} className="mb-3 text-center">
                    Powered by <a className="navbar-brand mr-0 p-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-footer" /></a>
                </Col>
            </Row>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) }
    }
}
export default connect(null, mapDispatchToProps)(OptOut);