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

const AddProductModel = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // Product Details
            productName: "",
            productActive: false,
            productNumber: "",
            productCategory: "",
            manufacturer: "",
            salesStartDate: null,
            salesEndDate: null,
            supportStartDate: null,
            supportExpiryDate: null,
            vendorCode: "",
            vendorName: "",
            vendorPartNo: "",
            partNo: "",
            productSheet: "",
            serialNo: "",
            productDescription: "",

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

    const productCategories = ["Hardware", "Software", "Service"];
    const manufacturers = ["Manufacturer A", "Manufacturer B", "Manufacturer C"];
    const vendorNames = ["Vendor A", "Vendor B", "Vendor C"];
    const usageUnits = ["Pieces", "Box", "Kg", "Liters"];
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
            <Row className="mt-3">
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="productName"
                        control={control}
                        rules={{ required: "Product Name is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Product Name"
                                variant="standard"
                                fullWidth
                                error={!!errors.productName}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col
                    xs={12} sm={12} md={6} lg={6} xl={6}
                    className="mb-3 d-flex align-items-center justify-content-start"
                >
                    <Controller
                        name="productActive"
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
                                label="Product Active"
                                sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="productNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Part Number"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="productCategory"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Product Category"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {productCategories.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="manufacturer"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Manufacturer"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {manufacturers.map((opt) => (
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

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            control={control}
                            name="salesStartDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Sales Start Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.salesStartDate,
                                        },
                                        popper: {
                                            disablePortal: true,     // render inside the modal
                                            sx: { zIndex: 2000 },    // higher than Reactstrap modal (1050)
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
                            name="salesEndDate"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Sales End Date"
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date)}
                                    format="MM/dd/yyyy"
                                    slotProps={{
                                        textField: {
                                            variant: "standard",
                                            fullWidth: true,
                                            margin: "none",
                                            error: !!errors.salesStartDate,
                                        },
                                        popper: {
                                            disablePortal: true,     // render inside the modal
                                            sx: { zIndex: 2000 },    // higher than Reactstrap modal (1050)
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>
            </Row>

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
                                            disablePortal: true,     // render inside the modal
                                            sx: { zIndex: 2000 },    // higher than Reactstrap modal (1050)
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
                                            disablePortal: true,     // render inside the modal
                                            sx: { zIndex: 2000 },    // higher than Reactstrap modal (1050)
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="vendorCode"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Vendor Code"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="vendorName"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Vendor Name"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            >
                                {vendorNames.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="vendorPartNo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Vendor Part No."
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="partNo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Mfr. Part No."
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
                        name="productSheet"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Product Sheet"
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                    <Controller
                        name="serialNo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Serial No."
                                variant="standard"
                                fullWidth
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-2">
                    <Controller
                        name="productDescription"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Product Description"
                                variant="standard"
                                fullWidth
                                multiline
                                rows={5}
                                sx={textFieldSx}
                            />
                        )}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-2">
                    <div
                        style={{
                            width: "100%",
                            height: "110px",
                            border: "2px dashed #ccc",
                            borderRadius: "6px",
                            backgroundColor: "#fafafa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "border-color 0.3s ease",
                            marginTop: 15
                        }}
                    >
                        <p
                            style={{
                                color: "#999",
                                fontSize: "14px",
                                fontWeight: 500,
                                margin: 0,
                                textAlign: "center",
                            }}
                        >
                            Click To Upload Product Image
                        </p>
                    </div>
                </Col>
            </Row>
            <Row>
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
            <ModalHeader toggle={onClose}>Add Product</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    {/* Tabs */}
                    <Row>
                        <Col md={12}>
                            <div className="tabs">
                                {[
                                    "Product Details",
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

export default AddProductModel;
