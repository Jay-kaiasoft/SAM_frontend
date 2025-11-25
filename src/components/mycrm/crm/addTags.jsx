import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap";
import { Button, TextField} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const AddTags = ({ open, onClose }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            tag: "",
        },
    });

    const onSubmit = (data) => {
        onClose();
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered size="md">
            <ModalHeader toggle={onClose}>Add New Tag</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    <Row>
                        <Col md={12}>
                            <Controller
                                name="tag"
                                control={control}
                                rules={{ required: "Tag is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="standard"
                                        fullWidth
                                        label="Tag"
                                        placeholder="Enter Tag"
                                        multiline
                                        rows={3}
                                        error={!!errors.tag}
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

export default AddTags;
