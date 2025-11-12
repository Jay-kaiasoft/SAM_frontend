import React from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Table} from "reactstrap";
import {Button} from "@mui/material";

const AttachFormModal = ({attachFormModal, toggleAttachFormModal, customFormLinkList, optionIndices, setLinkInSetData, type, setOptionCheckBoxValFunction, setOptionCheckBoxFormNameValFunction})=>{
    return (
        <Modal isOpen={attachFormModal} size="xl">
            <ModalHeader className="" toggle={toggleAttachFormModal}>Attach Form</ModalHeader>
            <ModalBody className="m-4">
            <div className="table-content-wrapper height-58 overflow-auto">
                <Table striped>
                    <thead>
                        <tr>
                            <th className="text-center">
                                No.
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                URL
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customFormLinkList.map((element, index) => {
                                const handleRowclick = (url, name) => {
                                    setLinkInSetData(type, optionIndices.pageIndex, optionIndices.questionIndex, optionIndices.optionIndex, url, name);
                                    toggleAttachFormModal();
                                    setOptionCheckBoxValFunction(optionIndices.optionIndex, url);
                                    setOptionCheckBoxFormNameValFunction(optionIndices.optionIndex, name);
                                }
                                return (
                                    <tr key={index} onDoubleClick={() => { handleRowclick(element.url, element.name) }} onClick={() => { handleRowclick(element.url, element.name) }} className="cursorPointer">
                                        <td className="text-center">{index + 1}</td>
                                        <td>{element.name}</td>
                                        <td>{element.url}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={toggleAttachFormModal}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}

export default AttachFormModal;