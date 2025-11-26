import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap";
import { Button, TextField} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const AddGroup = ({ open, onClose }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            groupName: "",
        },
    });

    const onSubmit = (data) => {        
        onClose();
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered size="md">
            <ModalHeader toggle={onClose}>Add Group</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    <Row>
                        <Col md={12}>
                            <Controller
                                name="groupName"
                                control={control}
                                rules={{ required: "Group name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="standard"
                                        fullWidth
                                        label="Group Name"
                                        placeholder="Enter group name"                                                                                
                                        error={!!errors.groupName}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end px-4">
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        SAVE
                    </Button>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default AddGroup;
