import "./inventory.css";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
} from "@mui/material";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Col,
} from "reactstrap";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const AddSeviceModel = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // Product Details
            serviceName: "",
            serviceActive: false,
            numberOfUnits: "",
            usageUnit: "",
            category: "",
            serviceStartDate: null,
            serviceEndDate: null,
            supportStartDate: null,
            supportExpiryDate: null,
            serviceProviderCode: "",
            serviceProviderName: "",
            serviceDescription: "",

            // Pricing Information
            unitPrice: "",
            commissionRate: "",
            taxes: "",

            // Stock Information
            usageUnit: "",
            unit: "",
            qtyInStock: "",
            renderLevel: "",
            handler: "",
            qtyDemand: "",

            // Custom Fields
            discount: "",
        },
    });

    const onSubmit = (data) => {
        // console.log(data);
        onClose();
    };

    const serviceCategories = ["Consulting", "Support", "Maintenance"];
    const serviceProviders = ["Provider A", "Provider B", "Provider C"];
    const usageUnits = ["Hours", "Days", "Months"];   // or whatever you prefer

    const handlers = ["Handler A", "Handler B", "Handler C"];
    const discountOptions = ["5%", "10%", "15%", "20%"];

    const textFieldSx = {
        "& .MuiInputBase-root": {
            fontSize: 14,
        },
        "& .MuiInputLabel-root": {
            fontSize: 14,
        },
    };

    const renderProductDetailsTab = () => (
        <>
            {/* Row 1: Service Name + Service Active */}
            <Row className="mt-3">
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="serviceName"
                        control={control}
                        rules={{ required: "Service Name is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Service Name"
                                variant="standard"
                                fullWidth
                                error={!!errors.serviceName}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    className="mb-3 d-flex align-items-center justify-content-start"
                >
                    <Controller
                        name="serviceActive"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={!!field.value}
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label="Service Active"
                                sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                            />
                        )}
                    />
                </Col>
            </Row>

            {/* Row 2: Number of Units + Usage Unit */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="numberOfUnits"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Number of Units"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="usageUnit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Usage Unit"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {usageUnits.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
            </Row>

            {/* Row 3: Category */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Category"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {serviceCategories.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3" />
            </Row>

            {/* Row 4: Service Start / End Date */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            control={control}
                            name="serviceStartDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Service Start Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.serviceStartDate,
                                        },
                                        popper: {
                                            disablePortal: true,
                                            sx: { zIndex: 2000 },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>

                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            control={control}
                            name="serviceEndDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Service End Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.serviceEndDate,
                                        },
                                        popper: {
                                            disablePortal: true,
                                            sx: { zIndex: 2000 },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>
            </Row>

            {/* Row 5: Support Start / Expiry Date */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            control={control}
                            name="supportStartDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Support Start Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.supportStartDate,
                                        },
                                        popper: {
                                            disablePortal: true,
                                            sx: { zIndex: 2000 },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            control={control}
                            name="supportExpiryDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Support Expiry Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.supportExpiryDate,
                                        },
                                        popper: {
                                            disablePortal: true,
                                            sx: { zIndex: 2000 },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>
            </Row>

            {/* Row 6: Service Provider Code / Name */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="serviceProviderCode"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Service Provider Code"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="serviceProviderName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Service Provider Name"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {serviceProviders.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
            </Row>

            {/* Row 7: Service Description + Add Fields */}
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="serviceDescription"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Service Description"
                                variant="standard"
                                fullWidth
                                multiline
                                rows={3}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3" />
            </Row>

            <Row>
                <Col
                    xs={12}
                    className="mb-3 d-flex align-items-center justify-content-start"
                    style={{ marginTop: 10 }}
                >
                    <i className="far fa-plus mr-2" />
                    <span style={{ fontSize: 14 }}>Add Fields</span>
                </Col>
            </Row>
        </>
    );


    const renderPricingTab = () => (
        <>
            <Row className="mt-3">
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="unitPrice"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Unit Price"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="commissionRate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Commission Rate"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="taxes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Taxes"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col
                    xs={12} sm={12} md={6} lg={6} xl={6}
                    className="mb-3 d-flex align-items-center"
                    style={{ marginTop: 20 }}
                >
                    <i className="far fa-plus mr-2" />
                    <span style={{ fontSize: 14 }}>Add Fields</span>
                </Col>
            </Row>
        </>
    );

    const renderStockTab = () => (
        <>
            <Row className="mt-3">
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="usageUnit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Usage Unit"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {usageUnits.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="unit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Qty / Unit"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="qtyInStock"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Qty. in Stock"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="renderLevel"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Reorder Level"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="handler"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Handler"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {handlers.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="qtyDemand"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Qty. in Demand"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col
                    md={12}
                    className="mb-3 d-flex align-items-center"
                    style={{ marginTop: 4 }}
                >
                    <i className="far fa-plus mr-2" />
                    <span style={{ fontSize: 14 }}>Add Fields</span>
                </Col>
            </Row>
        </>
    );

    const renderCustomFieldsTab = () => (
        <>
            <Row className="mt-3">
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Discount"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {discountOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
                <Col
                    xs={12} sm={12} md={6} lg={6} xl={6}
                    className="mb-3 d-flex align-items-center"
                    style={{ marginTop: 20 }}
                >
                    <i className="far fa-plus mr-2" />
                    <span style={{ fontSize: 14 }}>Add Fields</span>
                </Col>
            </Row>
        </>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 0:
                return renderProductDetailsTab();
            case 1:
                return renderPricingTab();
            case 2:
                return renderStockTab();
            case 3:
                return renderCustomFieldsTab();
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered size="lg">
            <ModalHeader toggle={onClose}>Add Service</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    {/* Tabs */}
                    <Row>
                        <Col md={12}>
                            <div className="tabs">
                                {[
                                    "Service Details",
                                    "Pricing Information",
                                    "Stock Information",
                                    "Custom Fields",
                                ].map((tab, index) => (
                                    <div
                                        key={tab}
                                        className={`tab ${activeTab === index ? "active" : ""}`}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        {tab}
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>

                    {/* Tab content */}
                    {renderActiveTab()}
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end px-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mr-3"
                    >
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

export default AddSeviceModel;
