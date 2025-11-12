import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Col, Input, Row, Table} from "reactstrap";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {get15MinuteSlots, availabilitySlots} from "./utility";
import {timeFormat, timeFormat24} from "../../../../assets/commonFunctions";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import {saveAvailabilitySlots, getAvailabilitySlotsList} from "../../../../services/myCalendarServices";
import $ from "jquery"

const Availability = ({user, subUser, globalAlert})=>{
    const [data, setData] = useState(availabilitySlots);
    const handleSave = () => {
        let requestData = data.map((v, i)=>{
            v.subMemberId = subUser.memberId;
            return {...v};
        })
        $(`button.handleSave`).hide();
        $(`button.handleSave`).after(`<div class="lds-ellipsis"><div></div><div></div><div></div>`);
        saveAvailabilitySlots(requestData).then(res=>{
            if(res.status === 200){
                globalAlert({
                    type: "Success",
                    text: `Availability Slots Added Successfully`,
                    open: true,
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true,
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.handleSave`).show();
        })
    }
    useEffect(()=>{
        getAvailabilitySlotsList(user.encMemberId).then(res=>{
            if(res.status === 200 && res.result?.availabilitySlotsList.length !== 0){
                setData(prevState => {
                    prevState = res.result?.availabilitySlotsList;
                    return [...prevState];
                });
            }
        })
    }, [user.encMemberId])
    return (
        <>
        <Row>
            <Col xs={10} className="mx-auto">
                <div className="">
                    <Table borderless>
                        <tbody>
                        {
                            data.map((v, i) => (
                                <tr key={i}>
                                    <td className="py-0 align-middle">
                                        <Input
                                            type="checkbox"
                                            className="mr-2 ml-0 position-relative"
                                            value={v.aasAvailableYN}
                                            checked={v.aasAvailableYN === "Y"}
                                            onChange={(e)=>{
                                                if(e.target.value === "Y"){
                                                    setData(prevState => {
                                                        prevState[i].aasAvailableYN = "N";
                                                        return [...prevState];
                                                    })
                                                } else {
                                                    setData(prevState => {
                                                        prevState[i].aasAvailableYN = "Y";
                                                        return [...prevState];
                                                    });
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="py-0 align-middle">
                                        {v.aasDayName}
                                    </td>
                                    <td className="py-0 align-middle">
                                        <FormControl variant="standard" fullWidth className="mb-3">
                                            <InputLabel>Start Time</InputLabel>
                                            <Select
                                                value={v.aasStartTime}
                                                label="Start Time"
                                                onChange = {(e)=>{
                                                    let [sh, sm, ss] = e.target.value.split(":");
                                                    let [eh, em, es] = v.aasEndTime.split(":");
                                                    let tempSDate = new Date(0);
                                                    let tempEDate = new Date(0);
                                                    tempSDate.setHours(parseInt(sh));
                                                    tempSDate.setMinutes(parseInt(sm));
                                                    tempSDate.setSeconds(parseInt(ss));
                                                    tempEDate.setHours(parseInt(eh));
                                                    tempEDate.setMinutes(parseInt(em));
                                                    tempEDate.setSeconds(parseInt(es));
                                                    if(tempSDate.getTime() >= tempEDate.getTime()){
                                                        globalAlert({
                                                            type: "Error",
                                                            text: `End Time must be greater then Start Time`,
                                                            open: true,
                                                        });
                                                    } else {
                                                        setData(prevState => {
                                                            prevState[i].aasStartTime = e.target.value;
                                                            return [...prevState];
                                                        })
                                                    }
                                                }}
                                            >
                                                {
                                                    get15MinuteSlots().map((val, j)=>(
                                                        <MenuItem key={j} value={timeFormat24(val)}>{timeFormat(val)}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td className="py-0 align-middle">
                                        <FormControl variant="standard" fullWidth className="mb-3">
                                            <InputLabel>End Time</InputLabel>
                                            <Select
                                                value={v.aasEndTime}
                                                label="End Time"
                                                onChange = {(e)=>{
                                                    let [sh, sm, ss] = v.aasStartTime.split(":");
                                                    let [eh, em, es] = e.target.value.split(":");
                                                    let tempSDate = new Date(0);
                                                    let tempEDate = new Date(0);
                                                    tempSDate.setHours(parseInt(sh));
                                                    tempSDate.setMinutes(parseInt(sm));
                                                    tempSDate.setSeconds(parseInt(ss));
                                                    tempEDate.setHours(parseInt(eh));
                                                    tempEDate.setMinutes(parseInt(em));
                                                    tempEDate.setSeconds(parseInt(es));
                                                    if(tempSDate.getTime() >= tempEDate.getTime()){
                                                        globalAlert({
                                                            type: "Error",
                                                            text: `End Time must be greater then Start Time`,
                                                            open: true,
                                                        });
                                                    } else {
                                                        setData(prevState => {
                                                            prevState[i].aasEndTime = e.target.value;
                                                            return [...prevState];
                                                        })
                                                    }
                                                }}
                                            >
                                                {
                                                    get15MinuteSlots().map((val, j)=>(
                                                        <MenuItem key={j} value={timeFormat24(val)}>{timeFormat(val)}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
        <div className="d-flex justify-content-center mb-0">
            <Button variant="contained" color="primary" onClick={handleSave} className="mb-0 handleSave">SAVE</Button>
        </div>
        </>
    );
};
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser,
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Availability);