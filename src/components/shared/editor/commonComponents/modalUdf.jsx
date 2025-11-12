import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, Checkbox, FormControlLabel} from "@mui/material";

const ModalUdf = ({modalUDF,toggleUDF,memberId}) => {
    const handleClickDontShow = () => {
        document.cookie = "edtfild=editorfield"+memberId+";";
    }
    return(
        <>
            <Modal isOpen={modalUDF} toggle={toggleUDF}>
                <ModalHeader toggle={toggleUDF}>Notes</ModalHeader>
                <ModalBody>
                    <div className="text-center">We are showing data of your first record from your contact list</div>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <FormControlLabel control={<Checkbox onChange={()=>{handleClickDontShow()}} color="primary" />} label="Don’t show again." />
                    <Button variant="contained" color="primary" onClick={()=>toggleUDF()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickUDFModal" onClick={()=>{toggleUDF()}}/>
        </>
    );
}

export default ModalUdf;