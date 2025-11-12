import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import InputField from "../../shared/commonControlls/inputField"
import { Button } from "@mui/material"
import { useState } from "react";
import { copyContactNewGroup } from "../../../services/clientContactService";

const ModalCopyContact = ({
    user,
    modalCopyContact,
    copyInputRefs,
    toggleCopyContact = () => { },
    resetValues = () => { },
    globalAlert = () => { },
    displayGroupSegmentDetails = () => { },
    tableCheckBoxValueGroupIdList,
    clickedGroup,
    selectionType
}) => {
    const [copyContactData, setCopyContactData] = useState({});
    const copyContactHandleChange = (name, value) => {
        setCopyContactData(prev => ({ ...prev, [name]: value }))
    }
    const submitFormCopyContact = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < copyInputRefs.current.length; i++) {
            const valid = copyInputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let requestData = {
            "groupName": copyContactData.groupName,
            "memberId": user.memberId,
            "emailIds": tableCheckBoxValueGroupIdList
        };
        toggleCopyContact();
        copyContactNewGroup(clickedGroup.groupId, selectionType, requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                resetValues()
                displayGroupSegmentDetails()
                setCopyContactData([])
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    const toggle = () => {
        setCopyContactData([])
        toggleCopyContact()
    }
    return (
        <Modal isOpen={modalCopyContact} toggle={toggle}>
            <form onSubmit={submitFormCopyContact}>
                <ModalHeader toggle={toggleCopyContact}>Group Name</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <InputField
                                    ref={copyInputRefs.current[0]}
                                    type="text"
                                    id="groupName"
                                    name="groupName"
                                    label="Group Name"
                                    onChange={copyContactHandleChange}
                                    validation={"required"}
                                    value={copyContactData?.groupName || ""}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="contained" color="primary" className="mr-2">CREATE</Button>
                    <Button variant="contained" color="primary" onClick={() => toggleCopyContact()} >CANCEL</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}
export default ModalCopyContact