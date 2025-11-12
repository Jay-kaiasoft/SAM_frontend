import React, { useState } from "react";
import { connect } from "react-redux";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, TextField, Popover} from "@mui/material";
import { siteURL } from "../../../../config/api";
import CopyLink from "../../../shared/commonControlls/copyLink";
import History from "../../../../history";
import { checkAuthorized } from "../../../../services/commonService";
import { checkSmsWhiteFlag } from "../../../../services/userService";
import { setPendingTransactionAction } from "../../../../actions/pendingTransactionActions";
import $ from 'jquery';
import ModalBuyTwilioNo from "./modalBuyTwilioNo";

const ModalAppointmentLink = ({modalLink, toggleLink, user, globalAlert, setShareMedium, toggleShareModal, pendingTransaction, subUser}) => {
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
    };
    const [sharePopover, setSharePopover] = React.useState(null);
    const openPopver = Boolean(sharePopover);
    const id = openPopver ? 'share-popover' : undefined;
    const focusTextarea = () => {
        setTimeout(()=>{
            $("#message").focus();
        },1000);
    }
    const handleClickSendSMS = () => {
        if(typeof user.twilioNumber === "undefined" || user.twilioNumber === null || user.twilioNumber === "") {
            checkAuthorized().then(res => {
                if (res.status === 200) {
                    setSharePopover(null);
                    toggleLink();
                    toggleBuyTwilioNo();
                } else {
                    pendingTransaction([{
                        "pendingTransactionType": "myCalendar"
                    }]);
                    History.push("/carddetails");
                }
            });
        } else {
            checkSmsWhiteFlag().then(res => {
                if (res.status === 200) {
                    setSharePopover(null);
                    toggleLink();
                    setShareMedium("SMS");
                    toggleShareModal();
                    focusTextarea();
                } else if(res.status === 401) {
                    globalAlert({
                        type: "Warning",
                        text: res.message,
                        open: true
                    });
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    }
    return (
        <>
            <Modal isOpen={modalLink} toggle={toggleLink} size="lg">
                <ModalHeader toggle={toggleLink}>Appointment Link</ModalHeader>
                <ModalBody>
                    <p className="font-weight-bold">Send Public Appoinment Link in Email or Text</p>
                    <TextField
                        variant="standard"
                        name="link"
                        fullWidth
                        value={siteURL+"/appointment?v="+user.encMemberId}
                        readOnly={true}
                        onFocus={event => event.target.select()}
                        multiline
                        minRows={2}
                        InputProps={{
                            endAdornment: 
                                <>
                                    <CopyLink elementName="link" iconSelector="copyLink"/>
                                    <i className="far fa-eye mx-2 align-self-start" data-toggle="tooltip" title="Open Link"
                                        onClick={()=>{
                                            window.open(document.querySelector("[name='link']").value);
                                        }}
                                    ></i>
                                    <i className="far fa-share-alt mx-2 align-self-start" aria-describedby={id} data-toggle="tooltip" title="Share"
                                        onClick={(event)=>{
                                            setSharePopover(event.currentTarget);
                                        }}
                                    >
                                    </i>
                                    <Popover
                                        id={id}
                                        open={openPopver}
                                        anchorEl={sharePopover}
                                        onClose={()=>{setSharePopover(null)}}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <div
                                            className="px-3 py-2 mx-0 mt-1 cursor-pointer popover-item"
                                            onClick={()=>{ handleClickSendSMS() }}
                                        >
                                            <i className="far fa-sms mr-3" style={{fontSize: "18px"}}></i>Send SMS
                                        </div>
                                        <div
                                            className="px-3 py-2 mx-0 mb-1 cursor-pointer popover-item"
                                            onClick={()=>{
                                                setSharePopover(null);
                                                toggleLink();
                                                setShareMedium("Email");
                                                toggleShareModal();
                                                focusTextarea();
                                            }}
                                        >
                                            <i className="far fa-envelope mr-3" style={{fontSize: "18px"}} ></i>Send Email
                                        </div>
                                    </Popover>
                                </>
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleLink()} className="ml-3 publishGTCancel">CLOSE</Button>
                </ModalFooter>
            </Modal>
            <ModalBuyTwilioNo
                modalBuyTwilioNo={modalBuyTwilioNo}
                toggleBuyTwilioNo={toggleBuyTwilioNo}
                user={user}
                globalAlert={globalAlert}
                subUser={subUser}
            />
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ModalAppointmentLink);