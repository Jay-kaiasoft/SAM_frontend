import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { optOut } from "../../../services/clientContactService";

const UnsubscribeModal = ({modalUnsubscribe, toggleUnsubscribe, dataUnsubscribe, globalAlert, encMemberId, displayContactList}) => {
    const [optOutValue, setOptOutValue] = useState("");
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
            "encMemberId": encMemberId,
            "encGroupId": dataUnsubscribe.encGroupId,
            "encEmailId": dataUnsubscribe.encEmailId,
            "email": (typeof dataUnsubscribe.email !== "undefined" && dataUnsubscribe.email !== "" && dataUnsubscribe.email !== null) ? dataUnsubscribe.email : "",
            "phoneNumber": (typeof dataUnsubscribe.phoneNumber !== "undefined" && dataUnsubscribe.phoneNumber !== "" && dataUnsubscribe.phoneNumber !== null) ? dataUnsubscribe.phoneNumber : "",
            "optOutType": optOutValue
        }
        optOut(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
                setOptOutValue("");
                displayContactList(dataUnsubscribe.groupId);
                toggleUnsubscribe();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    return (
        <Modal isOpen={modalUnsubscribe} toggle={toggleUnsubscribe}>
            <ModalHeader toggle={toggleUnsubscribe}>Unsubscribe Contact From Group</ModalHeader>
            <ModalBody>
                <p>You want to Opt Out {dataUnsubscribe?.fullName} from group name "{dataUnsubscribe.groupName}"</p>
                {(typeof dataUnsubscribe.email !== "undefined" && dataUnsubscribe.email !== "" && dataUnsubscribe.email !== null) && <p>Client email is {dataUnsubscribe.email}</p>}
                {(typeof dataUnsubscribe.phoneNumber !== "undefined" && dataUnsubscribe.phoneNumber !== "" && dataUnsubscribe.phoneNumber !== null) && <p>Client mobile no. is {dataUnsubscribe.phoneNumber}</p>}
                <div className="text-center">
                    <FormControl className="text-left mt-3">
                        <FormLabel id="demo-controlled-radio-buttons-group">If you want to Opt Out, please select option below</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={optOutValue}
                            onChange={(e)=>{setOptOutValue(e.target.value)}}
                        >
                            {(typeof dataUnsubscribe.phoneNumber !== "undefined" && dataUnsubscribe.phoneNumber !== "" && dataUnsubscribe.phoneNumber !== null) && <FormControlLabel value="phone" control={<Radio />} label="Do not contact me on this mobile phone" />}
                            {(typeof dataUnsubscribe.email !== "undefined" && dataUnsubscribe.email !== "" && dataUnsubscribe.email !== null) && <FormControlLabel value="email" control={<Radio />} label="Do not contact me with this email address" />}
                            <FormControlLabel value="removeThisList" control={<Radio />} label="Remove my contact from this list" />
                            <FormControlLabel value="removeAllList" control={<Radio />} label="Remove my contact from all lists" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=>{handleClickOptOut()}}>OPT OUT</Button>
                <Button variant="contained" color="primary" onClick={() => toggleUnsubscribe()} >CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}

export default UnsubscribeModal;