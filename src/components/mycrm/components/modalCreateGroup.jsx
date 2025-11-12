import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, FormGroup } from "reactstrap"
import { Button } from "@mui/material"
import InputField from "../../shared/commonControlls/inputField"
import DropDownControls from "../../shared/commonControlls/dropdownControl"

const ModalCreateGroup = ({
    modalCreateGroup,
    inputRefs,
    createGroupData,
    dropDownRefs,
    dropDownUDF,
    createUDFNo,
    totalUDFNo,
    submitFormCreateGroup = () => { },
    toggleCreateGroup = () => { },
    createGroupHandleChange = () => { }
}) => {
    return (
        <Modal isOpen={modalCreateGroup} toggle={toggleCreateGroup}>
            <form onSubmit={submitFormCreateGroup}>
                <ModalHeader toggle={toggleCreateGroup}>Add Groups</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="groupName"
                                    name="groupName"
                                    label="Group Name"
                                    onChange={createGroupHandleChange}
                                    validation={"required"}
                                    value={createGroupData?.groupName || ""}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={10} className="mx-auto">
                            <Row>
                                <Col md={10}>
                                    <FormGroup>
                                        <DropDownControls
                                            ref={dropDownRefs.current[0]}
                                            id="udf"
                                            name="udf"
                                            label="User Defined Fields"
                                            onChange={createGroupHandleChange}
                                            value={createGroupData?.udf || 0}
                                            dropdownList={dropDownUDF}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={2} className="d-flex align-items-center justify-content-center"><i className="far fa-question-circle" data-toggle="tooltip" title={`This is User Defined Field. e.g. "Sports Team" or "Designation"`}></i></Col>
                            </Row>
                        </Col>
                        {
                            createUDFNo > 0 ?
                                totalUDFNo.map((v, i) => (
                                    (i < createUDFNo) ?
                                        <Col key={i} md={10} className="mx-auto">
                                            <FormGroup>
                                                <InputField
                                                    ref={(el) => { (inputRefs.current[v].current = el) }}
                                                    type="text"
                                                    id={`udf${v}`}
                                                    name={`udf${v}`}
                                                    label={`Enter User Defined Field ${v}`}
                                                    onChange={createGroupHandleChange}
                                                    validation={"required"}
                                                    value={createGroupData[`udf${v}`] || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                        : null
                                ))
                                : null
                        }
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="contained" color="primary" className="mr-2 createGroup">CREATE</Button>
                    <Button variant="contained" color="primary" onClick={() => toggleCreateGroup()} >CANCEL</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ModalCreateGroup