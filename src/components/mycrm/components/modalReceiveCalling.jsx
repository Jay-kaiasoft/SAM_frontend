import React, { useEffect, useRef, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Link } from "@mui/material";
import { TelnyxRTC } from '@telnyx/webrtc';
import { siteURL } from "../../../config/api";
import { getUsernamePassword } from "../../../services/smsCampaignService";
import { connect } from "react-redux";

const ModalReceiveCalling = ({user}) => {
    const [modalReceiveCalling, setModalReceiveCalling] = useState(false);
    const toggleReceiveCalling = () => setModalReceiveCalling(!modalReceiveCalling);
    const newClient = useRef("");
    const [newCall, setNewCall] = useState(null);
    const [newCallAnswer, setNewCallAnswer] = useState("no");
    useEffect(()=>{
        if (newClient.current === "") {
            getUsernamePassword().then(res => {
                if (res.status === 200 && res.result.username !== "" && res.result.password !== "") {
                    const client = new TelnyxRTC({
                        login: res.result.username,
                        password: res.result.password,
                        socketUrl: 'wss://rtc.telnyx.com:5061',
                        ringtoneFile: siteURL+'/sounds/ringback_tone.mp3'
                    });
                    client.on('telnyx.socket.open', () => {
                        console.log('Connected to Telnyx WebRTC');
                    });
                    client.on('telnyx.notification', (notification) => {
                        if (notification.type === 'callUpdate' && notification.call.state === 'ringing') {
                            setModalReceiveCalling(true);
                            setNewCall(notification.call);
                        }
                        if (notification.type === 'callUpdate' && notification.call.state === 'active') {
                            console.log('Call answered');
                            const remoteAudio = document.getElementById('remoteAudio');
                            remoteAudio.srcObject = notification.call.remoteStream;
                        }
                        if (notification.type === 'callUpdate' && notification.call.state === 'hangup') {
                            console.log('Call ended');
                            setNewCall(null);
                            setModalReceiveCalling(false);
                        }
                    });
                    client.connect();
                    newClient.current = client;
                }
            });
        }
    },[user.twilioNumber]);
    const handleClickAnswerCall = () => {
        newCall.answer();
        setNewCallAnswer("yes");
    }
    const handleClickEndCall = () => {
        newCall.hangup();
        setNewCall(null);
        setModalReceiveCalling(false);
    }
    return (
        <Modal isOpen={modalReceiveCalling}>
            <ModalHeader toggle={toggleReceiveCalling}>Receive Calling</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={12}>
                        <div className="call-animation">
                            <i className="far fa-phone-volume"></i>
                        </div>
                        <audio id="remoteAudio" autoPlay={true} />
                    </Col>
                    {
                        newCall !== null &&
                        <Col xs={12} className="text-center mt-4">
                            {`${newCallAnswer === "no" ? "Incoming call from" : "Connected to"} ${newCall.options.remoteCallerNumber}`}
                        </Col>
                    }
                    <Col xs={12} className="text-center mt-4" style={{ zIndex: "9" }}>
                        {(newCall !== null && newCallAnswer === "no") && <Link component="a" className="btn-circle" data-toggle="tooltip" title="Answer Call" onClick={handleClickAnswerCall}>
                            <i className="far fa-phone"></i>
                            <div className="bg-green"></div>
                        </Link>}
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="End Call" onClick={handleClickEndCall}>
                            <i className="far fa-phone-slash"></i>
                            <div className="bg-red"></div>
                        </Link>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps)(ModalReceiveCalling);