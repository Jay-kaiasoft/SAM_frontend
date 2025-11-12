import React from "react";
import { ModalHeader, ModalBody, ModalFooter, Modal } from "reactstrap"
import { Button, Checkbox, FormControlLabel } from "@mui/material"
import $ from "jquery";

const ModalLinkedinPages = ({
    modalLinkedInPages,
    selectedLIPages,
    dataPagesLinkedIn,
    modalLIButton,
    globalAlert = () => { },
    callPostNow = () => { },
    callSaveSchedule = () => { },
    toggleLinkedInPages = () => { },
    handleChangeLIPages = () => { }
}) => {
    return (
        <Modal isOpen={modalLinkedInPages} toggle={toggleLinkedInPages}>
            <ModalHeader toggle={toggleLinkedInPages}>Linkedin Post Detail</ModalHeader>
            <ModalBody>
                <FormControlLabel className="m-0" control={<Checkbox color="primary" value="default" onChange={() => { handleChangeLIPages("default") }} checked={selectedLIPages.includes("default")} />} label="Post on Wall" />
                <h5>Page(s) List</h5>
                <div className="ml-5">
                    {
                        dataPagesLinkedIn.length > 0 ?
                            dataPagesLinkedIn.map((v, i) => {
                                return (
                                    <div key={i}>
                                        <FormControlLabel className="m-0" control={<Checkbox color="primary" value={v.pageId} onChange={() => { handleChangeLIPages(v.pageId) }} checked={selectedLIPages.includes(v.pageId)} />} label={v.pageName} />
                                    </div>
                                );
                            })
                            : null
                    }
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-3 postNow schedule"
                    onClick={() => {
                        if (selectedLIPages.length > 0) {
                            if (modalLIButton === "Schedule") {
                                $("button.schedule").hide();
                                $("button.schedule").after('<div class="lds-ellipsis"><div></div><div></div><div></div>');
                                callSaveSchedule();
                            } else {
                                $("button.postNow").hide();
                                $("button.postNow").after('<div class="lds-ellipsis"><div></div><div></div><div></div>');
                                callPostNow();
                            }
                        } else {
                            globalAlert({
                                type: "Error",
                                text: "Please select a page.",
                                open: true
                            });
                        }
                    }}
                >{modalLIButton}</Button>
                <Button variant="contained" color="primary" onClick={() => toggleLinkedInPages()} >CLOSE</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalLinkedinPages