import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ModalMoveContact = ({
    modalMoveContact,
    clickedGroup,
    moveContactHandleChange = () => { },
    toggleMoveContact = () => { },
    groupSegmentDetails
}) => {
    return (
        <Modal isOpen={modalMoveContact} toggle={toggleMoveContact}>
            <ModalHeader toggle={toggleMoveContact}>Select Group</ModalHeader>
            <ModalBody>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="groupId" name="groupId" value={Number(clickedGroup.groupId) || ""} onChange={(e) => { moveContactHandleChange(e.target.value); }}>
                        {groupSegmentDetails.map((value, index) => {
                            return (
                                value.lockGroup !== "Y" && <FormControlLabel key={index} className="mb-0 text-capitalize" value={value.groupId} control={<Radio color="primary" />} label={value.groupName} />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            </ModalBody>
        </Modal>
    )
}

export default ModalMoveContact