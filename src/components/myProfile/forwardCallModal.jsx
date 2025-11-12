import React, { createRef, useRef } from "react";
import { Button, FormGroup } from '@mui/material';
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import DropDownControls from '../shared/commonControlls/dropdownControl';
import InputField from '../shared/commonControlls/inputField';
import { saveNumberForwarding } from "../../services/numberForwardingService";

const ForwardCallModal = ({modalForwardCall, toggleForwardCall, dataForwardCall, handleChangeForwardCall, countryForwardCall, subUser, globalAlert, displayData}) => {
    const inputRefsForwardCall = useRef([createRef()]);
    const dropDownRefsForwardCall = useRef([createRef()]);
    const handleClickSaveForwardCall = () => {
        if(typeof dataForwardCall?.cfnForwardingNumber === "undefined" || dataForwardCall?.cfnForwardingNumber === "" || dataForwardCall?.cfnForwardingNumber === null){
            globalAlert({
                type: "Error",
                text: "Please enter forward number.",
                open: true
            });
            return false;
        }
        let requestData = {
            "cfnId": dataForwardCall?.cfnId,
            "cfnTwilioNumber": dataForwardCall?.cfnTwilioNumber,
            "cfnForwardingCountryCode": dataForwardCall?.cfnForwardingCountryCode ? countryForwardCall.filter((x)=>{ return x.key === dataForwardCall?.cfnForwardingCountryCode })[0].cntCode : "",
            "cfnForwardingNumber": dataForwardCall?.cfnForwardingNumber,
            "cfnTwilioPhoneSid": dataForwardCall?.cfnTwilioPhoneSid,
            "subMemberId": subUser.memberId
        }
        saveNumberForwarding(requestData).then(res => {
            if (res.status === 200) {
                displayData();
                toggleForwardCall();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    return (
        <Modal isOpen={modalForwardCall} toggle={toggleForwardCall}>
            <ModalHeader toggle={toggleForwardCall}>Forward Call Number</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={8} className="mx-auto">
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefsForwardCall.current[0]}
                                name="cfnForwardingCountryCode"
                                label="Select Country"
                                onChange={handleChangeForwardCall}
                                value={dataForwardCall?.cfnForwardingCountryCode || "US"}
                                dropdownList={countryForwardCall}
                            />
                        </FormGroup>
                        <FormGroup>
                            <InputField
                                ref={inputRefsForwardCall.current[0]}
                                type="text"
                                id="cfnForwardingNumber"
                                name="cfnForwardingNumber"
                                label="Please Enter Your Number"
                                onChange={handleChangeForwardCall}
                                value={dataForwardCall?.cfnForwardingNumber || ""}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=>{handleClickSaveForwardCall()}} >SAVE</Button>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleForwardCall()}} >CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ForwardCallModal;