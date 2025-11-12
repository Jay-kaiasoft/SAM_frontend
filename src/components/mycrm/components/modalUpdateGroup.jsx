import React from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import InputField from "../../shared/commonControlls/inputField";
import { Button } from "@mui/material";

const ModalUpdateGroup = ({
    modalUpdateGroup,
    updateInputRefs,
    updateGroupData,
    submitFormUpdateGroup = () => { },
    updateGroupHandleChange = () => { },
    toggleUpdateGroup = () => { },
}) => {
    return (
        <Modal isOpen={modalUpdateGroup} toggle={toggleUpdateGroup}>
            <form onSubmit={submitFormUpdateGroup}>
                <ModalHeader toggle={toggleUpdateGroup}>Edit Group</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <InputField
                                    ref={updateInputRefs.current[0]}
                                    type="text"
                                    id="groupName"
                                    name="groupName"
                                    label="Group Name"
                                    onChange={updateGroupHandleChange}
                                    validation={"required"}
                                    value={updateGroupData?.groupName || ""}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="contained" color="primary" className="mr-2 updateGroup">UPDATE</Button>
                    <Button variant="contained" color="primary" onClick={() => toggleUpdateGroup()} >CANCEL</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ModalUpdateGroup