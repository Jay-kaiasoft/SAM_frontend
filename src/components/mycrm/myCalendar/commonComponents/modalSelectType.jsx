import React, { useState } from "react";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, FormControlLabel, FormLabel, Link, Radio, RadioGroup} from "@mui/material";
import { handleClickHelp } from "../../../../assets/commonFunctions";

const ModalSelectType = ({modalSelectType, toggleModalSelectType, handleClickSelectTypeGo}) => {
    const [selectType, setSelectType] = useState("");
    const handleReset = () => {
        setSelectType("");
        toggleModalSelectType();
    }
    return (
        <Modal size="xs" isOpen={modalSelectType}>
            <ModalHeader toggle={() => { handleReset(); }} className="d-flex align-items-center">
                <span>Select Type</span>
                <Link component="a" className="btn-circle ml-3" data-toggle="tooltip" title="Help Text" style={{zIndex:"9",lineHeight:0}} onClick={()=>{handleClickHelp("Calendar/Features/EventsAndReminders.html")}}>
                    <i className="far fa-question-circle"></i>
                    <div className="bg-grey"></div>
                </Link>
            </ModalHeader>
            <ModalBody>
                <div className="d-flex flex-column align-items-center">
                    <FormLabel id="selectType">You want to create</FormLabel>
                    <RadioGroup aria-label="selectType" id="selectType" name="selectType" value={selectType} onChange={(e)=>{setSelectType(e.target.value)}} >
                        <FormControlLabel value="event" control={<Radio color="primary" />} label="Event" />
                        <FormControlLabel value="reminder" control={<Radio color="primary" />} label="Reminder" />
                    </RadioGroup>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="mr-3" variant="contained" color="primary" onClick={() => { handleReset(); }}>CLOSE</Button>
                <Button variant="contained" color="primary" onClick={() => { handleClickSelectTypeGo(selectType);handleReset(); }}>GO</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalSelectType;