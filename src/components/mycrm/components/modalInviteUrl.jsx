import { TextField } from "@mui/material";
import React from "react";
import { Col, FormGroup, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ModalInviteUrl = ({
    modalInviteUrl,
    toggleInviteUrl = () => { },
    inviteUrlData
}) => {
    return (
        <Modal size="lg" isOpen={modalInviteUrl} toggle={toggleInviteUrl}>
            <ModalHeader toggle={toggleInviteUrl}>Copy this link</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={10} className="mx-auto">
                        <FormGroup>
                            <TextField
                                variant="standard"
                                type="text"
                                id="inviteurl"
                                name="inviteurl"
                                value={inviteUrlData}
                                multiline
                                minRows={2}
                                fullWidth
                                inputProps={
                                    { readOnly: true, }
                                }
                                onFocus={(e) => { e.target.select() }}
                                className="bg-light"
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default ModalInviteUrl