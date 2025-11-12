import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap";
import { Button, TextField, Typography, Autocomplete } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const AddMilestonesModel = ({ open, onClose }) => {
    const [attachments, setAttachments] = useState([]);

    const members = [
        { id: 1, name: "Ava Patel" },
        { id: 2, name: "Noah Khan" },
        { id: 3, name: "Zoe Smith" },
    ];

    const milestoneStatus = [
        { key: "1", value: "Not Started" },
        { key: "2", value: "In Progress" },
        { key: "3", value: "Completed" },
    ];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            milestoneName: "",
            milestoneStatus: null,
            assignMember: null,
            startDate: null,
            endDate: null,
            notes: "",
        },
    });

    const handleFiles = (e) => {
        const files = Array.from(e.target.files || []);
        setAttachments(files);
    };

    const onSubmit = (data) => {
        const payload = { ...data, attachments };
        console.log("Milestone Data:", payload);
        onClose();
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered size="lg">
            <ModalHeader toggle={onClose}>Add Project Milestone</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    <Typography fontWeight={600} fontSize={18} className="mb-3">
                        Milestone Details
                    </Typography>

                    <Row>
                        <Col md={6}>
                            <Controller
                                name="milestoneName"
                                control={control}
                                rules={{ required: "Milestone Name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="standard"
                                        fullWidth
                                        label="Milestone Name"
                                        error={!!errors.milestoneName}
                                    />
                                )}
                            />
                        </Col>

                        <Col md={6}>
                            <Controller
                                name="milestoneStatus"
                                control={control}
                                rules={{ required: "Milestone Status is required" }}
                                render={({ field }) => (
                                    <Autocomplete
                                        options={milestoneStatus}
                                        getOptionLabel={(o) => o.value}
                                        value={milestoneStatus.find((s) => s.key === field.value) || null}
                                        onChange={(_, v) => field.onChange(v?.key ?? null)}
                                        // 🔧 critical fixes
                                        disablePortal
                                        fullWidth
                                        slotProps={{ popper: { sx: { zIndex: 2000 } } }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Milestone Status"
                                                error={!!errors.milestoneStatus}
                                            />
                                        )}
                                        isOptionEqualToValue={(o, v) => o.key === v.key}
                                    />
                                )}
                            />
                        </Col>
                    </Row>

                    <Row className="my-3">
                        <Col sm={12}>
                            <Controller
                                name="assignMember"
                                control={control}
                                rules={{ required: "Assign Member is required" }}
                                render={({ field }) => (
                                    <Autocomplete
                                        options={members}
                                        getOptionLabel={(o) => o.name}
                                        value={members.find((m) => m.id === field.value) || null}
                                        onChange={(_, v) => field.onChange(v?.id ?? null)}
                                        // 🔧 critical fixes
                                        disablePortal
                                        fullWidth
                                        slotProps={{ popper: { sx: { zIndex: 2000 } } }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Assign Member"
                                                error={!!errors.assignMember}
                                            />
                                        )}
                                        isOptionEqualToValue={(o, v) => o.id === v.id}
                                    />
                                )}
                            />
                        </Col>
                    </Row>

                    <Row className="my-3">
                        <Col md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: "Start Date is required" }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="Start Date"
                                            slotProps={{
                                                textField: {
                                                    variant: "standard",
                                                    fullWidth: true,
                                                    error: !!errors.startDate,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>

                        <Col md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{ required: "End Date is required" }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="End Date"
                                            slotProps={{
                                                textField: {
                                                    variant: "standard",
                                                    fullWidth: true,
                                                    error: !!errors.endDate,
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={6}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="standard"
                                        fullWidth
                                        label="Notes or Comments"
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Col>

                        <Col md={6}>
                            <label
                                htmlFor="milestoneDocs"
                                style={{
                                    height: 120,
                                    border: "2px dashed #d9d9d9",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "#fafafa",
                                    textAlign: "center",
                                }}
                            >
                                <Typography sx={{ color: "#9e9e9e", fontWeight: 600 }}>
                                    Click to Upload Milestone <br /> Document / Attachments
                                </Typography>
                                <input
                                    id="milestoneDocs"
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFiles}
                                />
                            </label>

                            {attachments.length > 0 && (
                                <ul style={{ marginTop: 6, marginLeft: 18 }}>
                                    {attachments.map((f, i) => (
                                        <li key={i} style={{ fontSize: 13, color: "#666" }}>
                                            {f.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Col>
                    </Row>
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end px-4">
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        CREATE
                    </Button>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default AddMilestonesModel;
