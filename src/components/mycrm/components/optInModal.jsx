import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const OptInModal = ({modalOptIn, toggleOptIn, optInType, setOptInType, optInTypeButton, handleClickOptIn}) => {
    return (
        <Modal isOpen={modalOptIn} toggle={toggleOptIn}>
            <ModalHeader toggle={toggleOptIn}>Opt In</ModalHeader>
            <ModalBody>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">If you want to send Opt In message to {optInTypeButton}, please select option below</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="optInType"
                        value={optInType}
                        onChange={(e)=>{setOptInType(e.target.value);}}
                    >
                        <FormControlLabel className="mb-0" value="email" control={<Radio />} label="Email" />
                        <FormControlLabel className="mb-0" value="sms" control={<Radio />} label="SMS" />
                        <FormControlLabel className="mb-0" value="both" control={<Radio />} label="Both" />
                    </RadioGroup>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=>{handleClickOptIn()}}>OPT IN</Button>
                <Button variant="contained" color="primary" onClick={() => toggleOptIn()} >CANCEL</Button>
            </ModalFooter>
        </Modal>
    )
}

export default OptInModal;