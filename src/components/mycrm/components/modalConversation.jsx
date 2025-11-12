import React from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import ConversationBox from "../conversationBox";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import InputField from "../../shared/commonControlls/inputField";
import { Button } from "@mui/material";


const ModalConversation = ({
    modalConversation,
    isLoad,
    dataCurrentConversations,
    dropDownRefsConversation,
    dataConversation,
    inputRefsConversation,
    conversationTemplateList,
    conversationSMSCount,
    conversationCharacterCount,
    toggleConversation = () => { },
    handleChangeConversation = () => { },
    sendConversation = () => { },
    closeConversation = () => { }
}) => {
    return (
        <Modal isOpen={modalConversation} toggle={toggleConversation}>
            <ModalHeader toggle={toggleConversation}>Conversations</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={12}>
                        <div className="conversation-list mb-4">
                            <ConversationBox conversationData={dataCurrentConversations} isLoad={isLoad} />
                        </div>
                    </Col>
                    <Col xs={12}>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefsConversation.current[0]}
                                id="sstId"
                                name="sstId"
                                label="Select Template"
                                onChange={handleChangeConversation}
                                value={dataConversation?.sstId || ""}
                                dropdownList={conversationTemplateList}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup className='mb-0'>
                            <InputField
                                ref={inputRefsConversation.current[0]}
                                type="text"
                                id="sendMessage"
                                name="sendMessage"
                                label="Content"
                                validation={"required"}
                                onChange={handleChangeConversation}
                                value={dataConversation?.sendMessage || ""}
                                multiline={true}
                                minRows={4}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <div className="conversation-char-count">
                            <Row>
                                <Col xs={6}><span className="mx-3 my-1 d-block">Approx SMS : {conversationSMSCount}</span></Col>
                                <Col xs={6} className="text-right"><span className="mx-3 my-1 d-block">Characters : {conversationCharacterCount}</span></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <input type="hidden" id="checkConversationsRows" value={0} />
                <Button variant="contained" color="primary" className="mr-2" onClick={() => sendConversation()} >SEND</Button>
                <Button variant="contained" color="primary" className="mr-2" onClick={() => toggleConversation()} >CANCEL</Button>
                <Button variant="contained" color="primary" onClick={() => closeConversation()}>CLOSE CONVERSATION</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalConversation