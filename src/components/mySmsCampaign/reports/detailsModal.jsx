import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const DetailsModal = ({ detailsModal, toggleDetailsModal, details }) => {
    return (
        <Modal isOpen={detailsModal} size="md">
            <ModalHeader toggle={toggleDetailsModal}>Details</ModalHeader>
            <ModalBody className="m-4">
                <p>{details}</p>
            </ModalBody>
        </Modal>
    );
}


export default DetailsModal;
