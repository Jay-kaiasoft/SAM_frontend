import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Col, FormGroup, Row} from "reactstrap";
import {Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import {getTimeZoneList, saveMemberTimeZone, saveWebConference, saveEmailNotification, saveSmsNotification} from "../../../../services/myCalendarServices";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import {userLoggedIn} from "../../../../actions/userActions";
import InputField from "../../../shared/commonControlls/inputField";
import {convertMinsToHrsMins} from "../../../../assets/commonFunctions";
import { setSubUserAction } from "../../../../actions/subUserActions";

const GeneralSettings = ({globalAlert,userLoggedIn,setSubUserAction,user,subUser}) => {
    const [timeZone, setTimeZone] = useState();
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [emailNotification, setEmailNotification] = useState([0]);
    const [webConference, setWebConference] = useState();
    const [smsNotification, setSmsNotification] = useState("");
    const [minTimeSlot, setMinTimeSlot] = useState([]);
    const [multipleControlTypes, setMultipleControlTypes] = useState(false);
    const handleChangeTimeZone = (value) => {
        let requestData = {
            "timeZone": value
        }
        saveMemberTimeZone(requestData).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({...subUser, "timeZone": value});
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "timeZone": value}));
                } else {
                    sessionStorage.setItem('user',JSON.stringify({...user, "timeZone": value}));
                    userLoggedIn({...user, "timeZone": value});
                }
                setTimeZone(value);
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const handleEmailNotification = () => {
        let requestData = {
            "emailNotification": emailNotification.join(",")
        }
        saveEmailNotification(requestData).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({...subUser, "emailNotification": emailNotification.join(",")});
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "emailNotification": emailNotification.join(",")}));
                } else {
                    sessionStorage.setItem('user',JSON.stringify({...user, "emailNotification": emailNotification.join(",")}));
                    userLoggedIn({...user, "emailNotification": emailNotification.join(",")});
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const handleSmsNotification = (value) => {
        let v = value === true ? "Y" : "N";
        let requestData = {
            "smsNotification": v
        }
        saveSmsNotification(requestData).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({...subUser, "smsNotification": v});
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "smsNotification": v}));
                } else {
                    sessionStorage.setItem('user',JSON.stringify({...user, "smsNotification": v}));
                    userLoggedIn({...user, "smsNotification": v});
                }
                setSmsNotification(v);
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const handleWebConferenceClick = () => {
        let requestData = {
            "webConference": webConference
        }
        saveWebConference(requestData).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0){
                    setSubUserAction({...subUser, "webConference": webConference});
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "webConference": webConference}));
                } else {
                    sessionStorage.setItem('user',JSON.stringify({...user, "webConference": webConference}));
                    userLoggedIn({...user, "webConference": webConference});
                }
                globalAlert({
                    type: "Success",
                    text: res?.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const renderTimeDropdown = () => {
        let mins = [];
        for(let i=15; i<=1440; i=i+15){
            mins.push(`${i}`);
        }
        setMinTimeSlot(mins);
    }
    useEffect(()=> {
        renderTimeDropdown();
        getTimeZoneList().then(res => {
            if (res.status === 200) {
                const formattedTimeZoneList = res?.result?.timeZoneList.map((zone) => {
                    return {
                        id: zone?.tmzId,
                        value: zone?.tmzTitle,
                        key: zone?.tmzValue
                    }
                })
                setTimeZoneList(formattedTimeZoneList)
            }
        });
        if(subUser.memberId > 0){
            setTimeZone(subUser?.timeZone || "");
            setEmailNotification(subUser?.emailNotification?.split(",") || [0]);
            setWebConference(subUser?.webConference || "");
            setSmsNotification(subUser?.smsNotification || "N");
        } else{
            setTimeZone(user?.timeZone || "");
            setEmailNotification(user?.emailNotification?.split(",") || [0]);
            setWebConference(user?.webConference || "");
            setSmsNotification(user?.smsNotification || "N");
        }
    },[]);
    return(
        <Row>
            <Col md={11} className="mx-auto">
                <Row>
                    <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mb-5 mx-auto">
                        <h4 className="separator" style={{color:"#242424"}}>Time Zone</h4>
                        <div className='mb-4 d-flex'>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="combo-label">Select Timezone</InputLabel>
                                <Select
                                    value={timeZone || ""}
                                    onChange={(event) => { handleChangeTimeZone(event.target.value); }}
                                    className="mb-2 pt-1"
                                    label="Time Zone"
                                    fullWidth
                                >
                                    {
                                        timeZoneList.map((ele, index) => {
                                            return (
                                                <MenuItem key={index} value={ele.key}>{ele.value}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Col>
                    <Col xs={10} sm={10} md={8} lg={5} xl={5} className="shadow p-5 justify-items-center mb-5 mx-auto">
                        <h4 className="separator" style={{color:"#242424"}}>Notification</h4>
                        <div className='mb-2 d-flex'>
                            <FormControl variant="standard" className="w-75">
                                <InputLabel id="combo-label">Select Time</InputLabel>
                                <Select
                                    value={emailNotification}
                                    onChange={(event,value) => {
                                        let v = event.target.value;
                                        if(value.props.value === 0 || event.target.value.length === 0) {
                                            setEmailNotification([0]);
                                            setMultipleControlTypes(false);
                                        } else {
                                            if (v.indexOf(0) > -1) {
                                                v.splice(v.indexOf(0), 1);
                                            }
                                            setEmailNotification(v);
                                        }
                                    }}
                                    className="mb-2 pt-1"
                                    label="Time Zone"
                                    fullWidth
                                    multiple={true}
                                    open={multipleControlTypes}
                                    onOpen={()=>{setMultipleControlTypes(true)}}
                                    onClose={()=>{setMultipleControlTypes(false)}}
                                >
                                    <MenuItem value={0}>Select Time</MenuItem>
                                    {
                                        minTimeSlot.map((v,i)=>(
                                            <MenuItem key={i} value={v}>{convertMinsToHrsMins(v)}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" className="w-25">
                                <Button variant="contained" color="primary" className="ml-3 mt-3" onClick={handleEmailNotification}>Save</Button>
                            </FormControl>
                        </div>
                        <div className='d-flex'>
                            <hr className="w-100"/>
                        </div>
                        <div className='d-flex'>
                            <FormControlLabel
                                checked={smsNotification === "Y"}
                                control={<Checkbox color="primary" onClick={(event) => handleSmsNotification(event.target.checked) }/>}
                                label="SMS Notification"/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={11} sm={11} md={11} lg={11} xl={11} className="shadow p-5 justify-items-center mb-5 mx-auto">
                        <h4 className="separator" style={{color:"#242424"}}>Web Conference Link</h4>
                        <div className='mb-4 d-flex'>
                            <FormGroup >
                                <InputField type="text" name="webConference" value={webConference} onChange={(_, value)=>{setWebConference(value)}} label="Web Conference Link" minRows={3} multiline/>
                            </FormGroup>
                        </div>
                        <Button variant="contained" color="primary" onClick={handleWebConferenceClick} className="mr-3">Save</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        setSubUserAction: (data) => {
            dispatch(setSubUserAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);