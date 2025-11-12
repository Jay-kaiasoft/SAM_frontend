import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { getDownloadContactFile } from "../../../services/clientContactService";


const ModalExportContact = ({
    modalExportContact,
    clickedGroup,
    toggleExportContact = () => { },
    setLoader = () => { },
    setSelectionType = () => { },
    globalAlert = () => { },
    toggleMoveContact = () => { },
    resetValues = () => { },
    toggleCopyContact = () => { }
}) => {
    const exportContactHandleChange = (exportAction) => {
        toggleExportContact();
        if (exportAction === "download") {
            setLoader({
                load: true,
                text: "Please wait !!!"
            });
            getDownloadContactFile(clickedGroup.groupId).then(res => {
                if (res.status === 200) {
                    if (res.result.filePath) {
                        window.open(res.result.filePath);
                    }
                    resetValues()
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                setLoader({
                    load: false
                });
            });
        } else if (exportAction === "moveSelected") {
            setSelectionType("selected");
            toggleMoveContact();
        } else if (exportAction === "moveAll") {
            setSelectionType("all");
            toggleMoveContact();
        } else if (exportAction === "copySelected") {
            setSelectionType("selected");
            toggleCopyContact();
        } else if (exportAction === "copyAll") {
            setSelectionType("all");
            toggleCopyContact();
        }
    }
    return (
        <Modal isOpen={modalExportContact} toggle={toggleExportContact}>
            <ModalHeader toggle={toggleExportContact}>Select</ModalHeader>
            <ModalBody>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="exportAction" name="exportAction" value={""} onChange={(e) => { exportContactHandleChange(e.target.value); }}>
                        <FormControlLabel className="mb-0 text-capitalize" value="download" control={<Radio color="primary" />} label="Download To File" />
                        <FormControlLabel className="mb-0 text-capitalize" value="moveSelected" control={<Radio color="primary" />} label="Move Selected Contact(s) To Existing Group" />
                        <FormControlLabel className="mb-0 text-capitalize" value="moveAll" control={<Radio color="primary" />} label="Move All Contact(s) To Existing Group" />
                        <FormControlLabel className="mb-0 text-capitalize" value="copySelected" control={<Radio color="primary" />} label="Copy Selected Contact(s) To New Contact Group" />
                        <FormControlLabel className="mb-0 text-capitalize" value="copyAll" control={<Radio color="primary" />} label="Copy All Contact(s) To New Contact Group" />
                    </RadioGroup>
                </FormControl>
            </ModalBody>
        </Modal>
    )
}

export default ModalExportContact