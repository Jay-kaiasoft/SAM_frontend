import React, { useEffect, useRef, useState } from "react";
import { Link } from "@mui/material";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import 'webrtc-adapter';
import { TelnyxRTC } from '@telnyx/webrtc';
import { callingStop } from "../../../services/clientContactService";

const ModalCalling = ({ modalCalling, toggleCalling, callingData, to, from }) => {
    const newClient = useRef("");
    const [newCall, setNewCall] = useState(null);
    const [newCallAnswer, setNewCallAnswer] = useState("no");

    if (newClient.current === "") {
        const client = new TelnyxRTC({
            login_token: callingData?.callingToken,
        });
        client.on('telnyx.notification', (notification) => {
            if (notification.type === 'callUpdate' && notification.call.state === 'active') {
                setNewCallAnswer("yes");
            }
        });
        client.remoteElement = "remoteMedia";
        client.connect();
        newClient.current = client;
    }
    const connectAndCall = () => {
        if (newClient.current !== "") {
            const call = newClient.current.newCall({
                destinationNumber: to,
                callerNumber: from,
                remoteElement: "remoteMedia"
            });
            setNewCall(call);
        }
    };
    const hangup = () => {
        if (newCall) {
            newCall.hangup();
            toggleCalling();
        }
    };
    
    useEffect(() => {
        if (newClient.current !== "") {
            setTimeout(()=>{
                connectAndCall();
            },2000);
        }
    }, [newClient.current]);
    useEffect(() => {
        let interval = null;
        if(newCall){
            interval = setInterval(() => {
                callingStop(callingData?.cpId).then(res => {
                    if (res.status === 200) {
                        toggleCalling();
                    }
                });
            }, 1000);
        }
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    }, [newCall])
    return (
        <Modal isOpen={modalCalling}>
            <ModalHeader>Calling</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={12}>
                        <div className="call-animation">
                            <i className="far fa-phone-volume"></i>
                        </div>
                        <audio id="remoteMedia" autoPlay={true} />
                    </Col>
                    <Col xs={12} className="text-center mt-4">
                        {`${newCallAnswer === "no" ? "Calling to" : "Connected to"} ${to}`}
                    </Col>
                    <Col xs={12} className="text-center mt-4" style={{ zIndex: "9" }}>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="End Call" onClick={hangup}>
                            <i className="far fa-phone-slash"></i>
                            <div className="bg-red"></div>
                        </Link>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default ModalCalling