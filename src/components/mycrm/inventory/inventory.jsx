import { Button, FormControl, IconButton, InputAdornment, Menu, MenuItem, Select, TextField, useMediaQuery } from "@mui/material"
import { useMemo, useState } from "react";
import { Col, Row } from "reactstrap"
import "./inventory.css";
import AddProductModel from "./addProductModel";
import AddSeviceModel from "./addSeviceModel";

const searchTypes = [
    { id: 1, name: "All" },
    { id: 2, name: "Contact" },
    { id: 3, name: "Company" },
];

const inventoryData = [
    {
        id: 1,
        name: "Products"
    },
    {
        id: 2,
        name: "Service"
    }
]

const createRow = (id, productName, partNumber, commissionRate, qtyInStock, qtyPerUnit) => ({
    id,
    productName,
    partNumber,
    commissionRate,
    qtyInStock,
    qtyPerUnit,
});

const tableRows = [
    createRow(1, "Gorgeous Granite Chips", "01", 0.0, 629, 40),
    createRow(2, "Handmade Plastic Ball", "02", 0.0, 422, 40),
    createRow(3, "Bespoke Soft Mouse", "01", 0.0, 0, 40),
    createRow(4, "Practical Frozen Gloves", "02", 0.0, 150, 40),
    createRow(5, "Generic Metal Chair", "04", 0.0, 866, 40),
    createRow(6, "Fantastic Fresh Bacon", "01", 0.0, 40, 40),
    createRow(7, "Fantastic Plastic Chicken", "01", 0.0, 67, 40),
    createRow(8, "Gorgeous Granite Chips", "01", 0.0, 629, 40),
    createRow(9, "Gorgeous Granite Chips", "01", 0.0, 629, 40),
    createRow(10, "Handmade Plastic Ball", "02", 0.0, 422, 40),
    createRow(11, "Bespoke Soft Mouse", "01", 0.0, 0, 40),
    createRow(12, "Practical Frozen Gloves", "02", 0.0, 150, 40),
    createRow(13, "Generic Metal Chair", "04", 0.0, 866, 40),
    createRow(14, "Fantastic Fresh Bacon", "01", 0.0, 40, 40),
    createRow(15, "Fantastic Plastic Chicken", "01", 0.0, 67, 40),
    createRow(16, "Gorgeous Granite Chips", "01", 0.0, 629, 40),
];
const Inventory = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [openProductModel, setOpenProductModel] = useState(false);
    const [openServiceModel, setOpenServiceModel] = useState(false);

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [searchType, setSearchType] = useState(searchTypes[0].id);
    const [searchText, setSearchText] = useState("");

    const [selectedInventory, setSelectedInventory] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setSearchType(event.target.value);
    };

    const renderInventory = () => (
        <div className="h-100 d-flex flex-column">
            {isSideBarOpen ? (
                <div className="crm-sidebar-collapsed-inner">
                    <div className="border-bottom w-100 text-center py-3">
                        <IconButton
                            id="firstBox"
                            size="small"
                            onClick={() => setIsSideBarOpen(false)}
                        >
                            <i className="fas fa-bars crm-collapsed-icon" />
                        </IconButton>
                    </div>

                    <div>
                        <span className="crm-vertical-text">Inventory</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="crm-contact-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center" style={{ gap: 15 }}>
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<i className="far fa-plus" />}
                                    sx={{
                                        textTransform: "none",
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<i className="far fa-pencil-alt" />}
                                    sx={{
                                        textTransform: "none",
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<i className="far fa-trash-alt" />}
                                    sx={{
                                        textTransform: "none",
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Delete
                                </Button>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                    PaperProps={{
                                        sx: {
                                            width: 170
                                        }
                                    }}
                                >
                                    <MenuItem>
                                        <i className="far fa-users mr-2" />
                                        Group
                                    </MenuItem>
                                    <MenuItem>
                                        <i className="far fa-tag mr-2"></i>
                                        Tag
                                    </MenuItem>
                                </Menu>
                            </div>
                            <div className="icon-wrapper">
                                <span
                                    className="btn-circle"
                                    data-toggle="tooltip"
                                    title="Collapse Grid"
                                    onClick={() => setIsSideBarOpen(true)}
                                    style={{ zIndex: 1 }}
                                >
                                    <i className="fas fa-chevron-left" />
                                    <div className="bg-blue"></div>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-bottom">
                        <p style={{ color: "#0478DC", fontSize: 16, padding: "10px", margin: "0px" }}>Inventory</p>
                    </div>

                    <div>
                        {
                            inventoryData?.map((row, index) => (
                                <div key={index} onClick={() => setSelectedInventory(index)}>
                                    <div className="contact-row p-2" style={{ backgroundColor: selectedInventory === index ? "#e4e4e4" : "" }}>
                                        <span>
                                            {
                                                row.name
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </>
            )}
        </div>
    );

    const filteredRows = useMemo(() => {
        if (!searchText) return tableRows;
        const text = searchText.toLowerCase();
        return tableRows.filter(
            (row) =>
                row.productName.toLowerCase().includes(text) ||
                row.partNumber.toLowerCase().includes(text)
        );
    }, [searchText]);

    const renderMainContent = () => (
        <div className="crm-main">
            <div className="d-flex p-3 justify-content-between align-items-center border-bottom">
                <div className="d-flex align-items-center" style={{ gap: 25 }}>
                    <Button
                        onClick={(e) => handleClick(e)}
                        variant="text"
                        size="small"
                        startIcon={<i className="far fa-plus" />}
                        sx={{
                            textTransform: "none",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Quick Add
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<i className="far fa-pencil-alt" />}
                        sx={{
                            textTransform: "none",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<i className="far fa-trash-alt" />}
                        sx={{
                            textTransform: "none",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<i class="fa-sharp far fa-print"></i>}
                        sx={{
                            textTransform: "none",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Print
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<i class="far fa-columns"></i>}
                        sx={{
                            textTransform: "none",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        View/Hide Columns
                    </Button>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            list: {
                                'aria-labelledby': 'basic-button',
                            },
                        }}
                        PaperProps={{
                            sx: {
                                width: 170
                            }
                        }}
                    >
                        <MenuItem onClick={() => { setAnchorEl(null); setOpenProductModel(true) }}>
                            Product
                        </MenuItem>
                        <MenuItem onClick={() => { setAnchorEl(null); setOpenServiceModel(true) }}>
                            Service
                        </MenuItem>
                    </Menu>
                </div>
                <div className="utility-buttons">
                    <div className="utility-btn">
                        <i className="far fa-expand"></i>
                        <span>Full Screen View</span>
                    </div>
                    <div className="utility-btn">
                        <i className="far fa-question-circle"></i>
                        <span>Help</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow-1">
                <div
                    className="table-responsive"
                    style={{
                        maxHeight: "calc(100vh - 260px)",
                        overflowY: "auto",
                    }}
                >
                    <table className="table mb-0">
                        <thead
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                background: "#fff",
                            }}
                        >
                            <tr>
                                <th style={{ width: 40 }}>
                                    <input type="checkbox" />
                                </th>
                                <th className="fw-semibold text-primary">Product Name</th>
                                <th className="fw-semibold text-primary">Part Number</th>
                                <th className="fw-semibold text-primary">Commission Rate</th>
                                <th className="fw-semibold text-primary">Qty. in Stock</th>
                                <th className="fw-semibold text-primary">Qty./Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td className="fw-semibold">{row.productName}</td>
                                    <td className="fw-semibold">{row.partNumber}</td>
                                    <td className="fw-semibold">{row.commissionRate.toFixed(3)}</td>
                                    <td className="fw-semibold">{row.qtyInStock}</td>
                                    <td className="fw-semibold">{row.qtyPerUnit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 p-md-0">
                <Row
                    style={{
                        gap: !isDesktop ? 10 : 0,
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <Col xs={12} sm={2} md={2} lg={2} xl={2}>
                        <h3 className="mb-0 fw-bold" style={{ color: "#1f2937" }}>
                            Inventory
                        </h3>
                    </Col>
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                        <Row
                            style={{ alignItems: "center", gap: !isDesktop ? 10 : 0 }}
                        >
                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <div
                                    className="d-flex border rounded"
                                    style={{
                                        height: "40px",
                                    }}
                                >
                                    <FormControl
                                        variant="standard"
                                        sx={{
                                            m: 0,
                                            minWidth: { xs: 80, md: 130 },
                                            borderRight: "1px solid #ccc",
                                            "& .MuiInputBase-root": {
                                                height: "100%",
                                                padding: "4px 12px 5px 12px",
                                            },
                                            "& .MuiInput-underline:before": { display: "none" },
                                            "& .MuiInput-underline:after": { display: "none" },
                                        }}
                                    >
                                        <Select
                                            value={searchType}
                                            onChange={handleChange}
                                            disableUnderline
                                            sx={{
                                                backgroundColor: "#f8f9fa",
                                                padding: 0,
                                                "& .MuiSelect-select": {
                                                    minHeight: "auto",
                                                    fontSize: "14px",
                                                },
                                            }}
                                        >
                                            {searchTypes?.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        placeholder="Search Product Or Service"
                                        variant="standard"
                                        size="small"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        sx={{
                                            "& .MuiInput-underline:before": { display: "none" },
                                            "& .MuiInput-underline:after": { display: "none" },
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <div
                                                        className="bg-primary"
                                                        style={{
                                                            borderRadius: "0 4px 4px 0",
                                                            width: "40px",
                                                            height: "40px",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            margin: 0,
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <i className="far fa-search text-white" />
                                                    </div>
                                                </InputAdornment>
                                            ),
                                            style: {
                                                padding: "0px 0px 0px 10px",
                                                height: "40px",
                                                fontSize: "14px",
                                            },
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ gap: 25 }}
                                >
                                    <div style={{ cursor: "pointer" }}>
                                        <i className="far fa-upload" />
                                        <span className="ml-2">Import</span>
                                    </div>
                                    <div style={{ cursor: "pointer" }}>
                                        <i className="far fa-download" />
                                        <span className="ml-2">Export</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
                        <div className="container-fluid d-flex p-0 crm-layout">
                            <div
                                className={`crm-sidebar ${isSideBarOpen
                                    ? "crm-sidebar--collapsed"
                                    : "crm-sidebar--expanded"
                                    }`}
                            >
                                {renderInventory()}
                            </div>
                            {renderMainContent()}
                        </div>
                    </Col>
                </Row>
            </Col>
            <AddProductModel open={openProductModel} onClose={() => setOpenProductModel(false)} />
            <AddSeviceModel open={openServiceModel} onClose={() => setOpenServiceModel(false)} />

        </Row>
    )
}

export default Inventory