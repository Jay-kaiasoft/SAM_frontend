import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";

const LinkClickModal = ({ linkClickModal, toggleLinkClickModal, linkSelected }) => {
    return (
        <Modal isOpen={linkClickModal} size="lg">
            <ModalHeader toggle={toggleLinkClickModal}>Link Click Report</ModalHeader>
            <ModalBody>
                <Row>
                    <Col>Campaign Link : {linkSelected?.campLink}</Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <div className="table-content-wrapper">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: "5%" }}>No</th>
                                        <th>User Name</th>
                                        <th className="text-center" style={{ width: "10%" }}>Link Click</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {linkSelected?.productLinksClickUser?.length > 0 ?
                                        linkSelected?.productLinksClickUser?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>{item?.userName}</td>
                                                    <td className="text-center">{item?.linkCount}</td>
                                                </tr>
                                            )
                                        }) :
                                        <tr>
                                            <td colSpan={3} className="text-center">No Data Found</td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}

export default LinkClickModal;
