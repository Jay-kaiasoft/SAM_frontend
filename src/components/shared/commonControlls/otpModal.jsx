import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from '@mui/material';
import OtpInput from 'react-otp-input';
import { verifiedOtpCell } from "../../../services/userService";

const OtpModal = ({modalOtp, toggleModalOtp, cell, memberId,  handleSendOtp, globalAlert, handleNext}) => {
    const [otp, setOtp] = useState("");
    const handleClickNext = () => {
        let requestData = {
            verifyedOtp:otp,
            memberId:Number(memberId)
        }
        verifiedOtpCell(requestData).then(res => {
            if (res.status === 200) {
                handleNext();
                setOtp("");
                toggleModalOtp();    
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true,
                });
            }
        });
    }
    return (
        <Modal isOpen={modalOtp}>
            <ModalHeader>Verify Cell Number</ModalHeader>
            <ModalBody className="m-4">
                <h5>Verify the OTP Code</h5>
                <p>Send To {cell}</p>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={{
                        width: 50,
                        height: 41,
                        borderWidth: 1,
                        borderColor: "#898989",
                        borderRadius: 3,
                        fontSize: 14,
                        lineHeight: 17,
                        color: "#898989",
                        backgroundColor: "#F3F3FF",
                        outline: "none"
                    }}
                    containerStyle={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                    }}
                    inputType="tel"
                    renderInput={(props) => <input {...props} inputMode="tel" />}
                />
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-3" onClick={()=>{handleSendOtp("resend");}}>RESEND OTP</Button>
                <Button variant="contained" color="primary" className="mr-3" disabled={otp.trim() === ''} onClick={()=>{setOtp("");}}>CLEAR</Button>
                <Button variant="contained" color="primary" disabled={otp.length < 6} onClick={()=>{handleClickNext();}}>NEXT</Button>
            </ModalFooter>
        </Modal>
    )
}

export default OtpModal;