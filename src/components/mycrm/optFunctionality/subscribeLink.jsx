import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { Col, Row } from 'reactstrap';
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { siteURL, staticUrl } from "../../../config/api";
import { optIn, optInDetails } from "../../../services/clientContactService";
import { easUrlEncoder } from "../../../assets/commonFunctions";

const SubscribeLink = ({location, globalAlert}) => {
    const querySting = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const [groupValue, setGroupValue] = useState([]);
    const [data, setData] = useState({});
    const [groupData, setGroupData] = useState([]);
    console.log("querySting",querySting);
    const handleChange = (groupId, selectValue) => {
        if(selectValue){
            setGroupValue((prev)=>{ return [...prev, groupId]});
        } else {
            setGroupValue((prev)=>{
                return prev.filter((v)=> v !== groupId)
            })
        }
    }
    const handleChangeSelectAll = (selectValue) => {
        if(selectValue){
            let t = [];
            groupData.map((v)=>(
                t.push(v.groupId)
            ))
            setGroupValue(t);
        } else {
            setGroupValue([]);
        }
    }
    const handleClickOptIn = () => {
        if(groupValue.length === 0){
            globalAlert({
                type: "Error",
                text: "Please select group",
                open: true
            });
            return false;
        }
        let requestData = {
            "encMemberId": querySting.get("v") ? querySting.get("v") : "",
            "email": (typeof data?.clientEmail !== "undefined" && data?.clientEmail !== "" && data?.clientEmail !== null) ? data?.clientEmail : "",
            "phoneNumber": (typeof data?.clientPhoneNumber !== "undefined" && data?.clientPhoneNumber !== "" && data?.clientPhoneNumber !== null) ? data?.clientPhoneNumber : "",
            "groupList": groupValue
        }
        optIn(requestData).then(res => {
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
        optInDetails(requestData).then(res => {
            if (res.status === 200) {
                setData(res.result.optInDetails);
                setGroupData(res.result.groupList);
                let t = [];
                res.result.groupList.map((v)=>(
                    t.push(v.groupId)
                ))
                setGroupValue(t);
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
                                <p>You are currently not included in Group "{data?.groupName}" which was created by {(typeof data?.businessName !== "undefined" && data?.businessName !== "" && data?.businessName !== null) ? data?.businessName : data?.memberName}</p>
                                {(typeof data?.clientEmail !== "undefined" && data?.clientEmail !== "" && data?.clientEmail !== null) && <p>Your email is {data?.clientEmail}</p>}
                                {(typeof data?.clientPhoneNumber !== "undefined" && data?.clientPhoneNumber !== "" && data?.clientPhoneNumber !== null) && <p>Your mobile no. is {data?.clientPhoneNumber}</p>}
                            </div>
                        </div>
                        <div className="text-center">
                            <FormControl className="mt-5" component="fieldset" variant="standard">
                                <FormLabel component="legend">If you would like to Opt-In, please select the group(s) below</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={ <Checkbox checked={groupData.length === groupValue.length && groupData.length !== 0} onChange={(e)=>{handleChangeSelectAll(e.target.checked)}} /> } label="Select All" />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                        {
                                            groupData.map((v,i)=>(
                                                <FormControlLabel key={i} control={ <Checkbox checked={groupValue.includes(v.groupId)} onChange={(e)=>{handleChange(v.groupId,e.target.checked)}} /> } label={v.groupName} />
                                            ))
                                        }
                                    </Box>
                                </FormGroup>
                            </FormControl>
                        </div>
                        <div className="text-center">
                            <Button variant="contained" color="primary" className="mt-3" onClick={()=>{handleClickOptIn()}} >OPT IN</Button>
                        </div>
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
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) }
    }
}
export default connect(null, mapDispatchToProps)(SubscribeLink);