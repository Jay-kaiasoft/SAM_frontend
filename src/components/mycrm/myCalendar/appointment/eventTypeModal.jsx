import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Modal, ModalHeader, ModalBody, ModalFooter, Row, Col} from "reactstrap";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import InputField from "../../../shared/commonControlls/inputField";
import {saveEventType} from "../../../../services/myCalendarServices";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import $ from "jquery"

const EventTypeModal = ({eventTypeModal, toggleEventTypeModal, globalAlert, subMemberId, action, updateData})=>{
    const [eventData, setEventData] = useState({
        aetId: 0,
        aetTitle: "",
        aetDescription:"",
        aetDurationHours: 0,
        aetDurationMinutes: 0,
        subMemberId: subMemberId,
    });
    const handleChange = (name, Value)=>{
        setEventData((prev)=>{
            prev = {...prev, [name]: Value};
            return {...prev};
        });
    }
    const handleMinutesCombo = (e)=>{
        setEventData((prev)=>{
            prev = {...prev, aetDurationMinutes: e.target.value};
            return {...prev};
        });
    }
    const handleHoursCombo = (e)=>{
        setEventData((prev)=>{
            prev = {...prev, aetDurationHours: e.target.value};
            return {...prev};
        });
    }
    const handleAdd = ()=>{
        if(eventData.aetTitle === ""){
            globalAlert({
                type: "Error",
                text: `Please Enter Event Type Title`,
                open: true,
            })
            return;
        }
        if(eventData.aetDurationHours === 0 && eventData.aetDurationMinutes === 0){
            globalAlert({
                type: "Error",
                text: `Please Enter Event Duration`,
                open: true,
            })
            return;
        }
        $(`button.eventTypeAdd`).hide();
        $(`button.eventTypeAdd`).after(`<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>`);
        saveEventType(eventData).then((res)=>{
            if(res.status === 200){
                toggleEventTypeModal();
                setEventData((prev)=>{
                    prev = {
                        aetId: 0,
                        aetTitle: "",
                        aetDescription:"",
                        subMemberId: subMemberId,
                    };
                    return {...prev};
                });
                globalAlert({
                    type: "Success",
                    text: `Event Type ${action}ed Successfully`,
                    open: true,
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.eventTypeAdd`).show();
        })
    }
    useEffect(()=>{
        if(action === "Update"){
            setEventData((prev)=>{
                prev = {
                    aetId: updateData.aetId,
                    aetTitle: updateData.aetTitle,
                    aetDescription:updateData.aetDescription,
                    aetDurationHours: updateData.aetDurationHours,
                    aetDurationMinutes: updateData.aetDurationMinutes,
                    subMemberId: updateData.subMemberId
                };
                return {...prev};
            });
        } else {
            setEventData((prev)=>{
                prev = {
                    aetId: 0,
                    aetTitle: "",
                    aetDescription:"",
                    aetDurationHours: 0,
                    aetDurationMinutes: 0,
                    subMemberId: subMemberId,
                };
                return {...prev}
            })
        }
    }, [action, updateData.aetDescription, updateData.aetId, updateData.aetTitle, updateData.subMemberId, subMemberId, updateData.aetDurationHours, updateData.aetDurationMinutes]);
    return (
        <Modal isOpen={eventTypeModal}>
            <ModalHeader className="" toggle={toggleEventTypeModal}>{action} Appointment Event Type</ModalHeader>
            <ModalBody className="m-4">
                <Row className="mt-2">
                    <Col xs={10} className="mx-auto">
                        <InputField
                            type="text"
                            value={eventData.aetTitle}
                            name="aetTitle"
                            label="Event Title"
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xs={10} className="mx-auto">
                        <InputField
                            type="text"
                            value={eventData.aetDescription}
                            name="aetDescription"
                            label="Event Description"
                            onChange={handleChange}
                            minRows={2}
                            multiline
                        />
                    </Col>
                </Row>
                {/*<Row className="mt-2">*/}
                {/*    <Col xs={10} className="mx-auto">*/}
                {/*        <Row>*/}
                {/*            <Col xs={3} className="d-flex align-items-center">*/}
                {/*                <span className="mt-3">Hours</span>*/}
                {/*            </Col>*/}
                {/*            <Col xs={9}>*/}
                {/*                <Select*/}
                {/*                    name="aetDurationHours"*/}
                {/*                    onChange={handleHoursCombo}*/}
                {/*                    value={eventData.aetDurationHours}*/}
                {/*                    className="w-25"*/}
                {/*                    label="Hours"*/}
                {/*                >*/}
                {/*                    {*/}
                {/*                        Array.from({length: 23}, (_, i)=>(i+1)).map((v, i)=>{*/}
                {/*                            return (*/}
                {/*                                <MenuItem value={v} key={i}>{v}</MenuItem>*/}
                {/*                            )*/}
                {/*                        })*/}
                {/*                    }*/}
                {/*                </Select>*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row className="mt-2">*/}
                {/*    <Col xs={10} className="mx-auto">*/}
                {/*        <Row>*/}
                {/*            <Col xs={3} className="d-flex align-items-center">*/}
                {/*                Minutes*/}
                {/*            </Col>*/}
                {/*            <Col xs={9}>*/}
                {/*                <Select*/}
                {/*                    name="aetDurationMinutes"*/}
                {/*                    onChange={handleMinutesCombo}*/}
                {/*                    value={eventData.aetDurationMinutes}*/}
                {/*                    className="w-25"*/}
                {/*                    label="Minutes"*/}
                {/*                >*/}
                {/*                    {*/}
                {/*                        Array.from({length: 11}, (_, i)=>((i+1)*5)).map((v, i)=>{*/}
                {/*                            return (*/}
                {/*                                <MenuItem value={v} key={i}>{v}</MenuItem>*/}
                {/*                            )*/}
                {/*                        })*/}
                {/*                    }*/}
                {/*                </Select>*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="mt-3">
                    <Col xs={10} className="mx-auto">
                        <Row>
                            {/*<Col xs={2} className="d-flex align-items-center">Hours</Col>*/}
                            <Col xs={6}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel>Hours</InputLabel>
                                    <Select
                                        name="aetDurationHours"
                                        onChange={handleHoursCombo}
                                        value={eventData.aetDurationHours || 0}
                                        className="w-100"
                                        label="Hours"
                                    >
                                        <MenuItem value={0}>Select Hours</MenuItem>
                                        {
                                            Array.from({length: 24}, (_, i)=>(i)).map((v, i)=>{
                                                return (
                                                    <MenuItem value={v<10 ? `0${v}` : v} key={i}>{v<10 ? `0${v}` : v}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            </Col>
                            {/*<Col xs={2} className="d-flex align-items-center">*/}
                            {/*    Minutes*/}
                            {/*</Col>*/}
                            <Col xs={6}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel>Minutes</InputLabel>
                                    <Select
                                        name="aetDurationMinutes"
                                        onChange={handleMinutesCombo}
                                        value={eventData.aetDurationMinutes || 0}
                                        className="w-100"
                                        label="Minutes"
                                    >
                                        <MenuItem value={0}>Select Minutes</MenuItem>
                                        {
                                            Array.from({length: 4}, (_, i)=>((i)*15)).map((v, i)=>{
                                                return (
                                                    <MenuItem value={v<10 ? `0${v}` : v} key={i}>{v<10 ? `0${v}` : v}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary"  className="mr-2 eventTypeAdd" onClick={handleAdd}>{action}</Button>
                <Button variant="contained" color="primary" onClick={toggleEventTypeModal}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default  connect(null, mapDispatchToProps)(EventTypeModal);
