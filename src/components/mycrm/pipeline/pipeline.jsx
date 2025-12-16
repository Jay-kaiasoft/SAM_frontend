
import React, { useMemo, useState } from "react";
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    Link,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Row, Col } from "reactstrap";
import PipelineList from "./pipelineList";

// ---------- demo dynamic data (replace with API response) ----------
const demoColumns = [
    {
        id: "unassigned",
        title: "Proposal",
        count: 8,
        color: "#377D50",
        total: 1020,
        items: Array.from({ length: 1 }).map((_, i) => ({
            id: `u-${i}`,
            title: "Need New Design for Website",
            amount: 3800,
            dateText: "July 21 2024",
            priority: "High",
            assignees: [
                { id: 1, name: "A", src: "" },
                { id: 2, name: "B", src: "" },
                { id: 3, name: "C", src: "" },
                { id: 4, name: "D", src: "" },
                { id: 5, name: "E", src: "" },
            ],
        })),
    },
    {
        id: "responsible",
        title: "Proposal",
        count: 8,
        color: "#377D50",
        total: 1020,
        items: Array.from({ length: 1 }).map((_, i) => ({
            id: `r-${i}`,
            title: "Need New Design for Website",
            amount: 3800,
            dateText: "July 21 2024",
            priority: "Medium",
            assignees: [{ id: 1, name: "D", src: "" }],
        })),
    },
    {
        id: "inprocess",
        title: "In Process",
        count: 3,
        color: "#4097ED",
        total: 1020,
        items: Array.from({ length: 1 }).map((_, i) => ({
            id: `p-${i}`,
            title: "Need New Design for Website",
            amount: 3800,
            dateText: "July 21 2024",
            priority: "Average",
            assignees: [
                { id: 1, name: "E", src: "" },
                { id: 2, name: "F", src: "" },
            ],
        })),
    },
    {
        id: "processed",
        title: "Processed",
        count: 8,
        color: "#f7b731",
        total: 1020,
        items: Array.from({ length: 1 }).map((_, i) => ({
            id: `d-${i}`,
            title: "Need New Design for Website",
            amount: 3800,
            dateText: "July 21 2024",
            priority: "Medium",
            assignees: [
                { id: 1, name: "G", src: "" },
                { id: 2, name: "H", src: "" },
                { id: 3, name: "I", src: "" },
            ],
        })),
    },
];

const searchTypes = [
    { id: 1, name: "All" },
    { id: 2, name: "Pipeline" },
    { id: 3, name: "Assignee" },
    { id: 4, name: "Issue" },
];

const money = (n) => {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));
    } catch {
        return `$${n}`;
    }
};

const Pipeline = ({
    height = "calc(100vh - 220px)",
}) => {
    const isDesktop = useMediaQuery("(min-width: 992px)");
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState(searchTypes[0].id);
    const [viewType, setViewType] = useState("grid");

    const handleChange = (event) => {
        setSearchType(event.target.value);
    };

    const filteredColumns = useMemo(() => {
        if (!searchText) return demoColumns;
        const q = searchText.toLowerCase();
        return demoColumns.map((c) => ({
            ...c,
            items: (c.items || []).filter((it) => (it.title || "").toLowerCase().includes(q)),
        }));
    }, [demoColumns, searchText]);

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
                    <Col xs={12} sm={3} md={3} lg={3} xl={3}>
                        <div className="d-flex item-center" style={{ gap: 10 }}>
                            <h3 className="mb-0 fw-bold" style={{ color: "#1f2937" }}>
                                Pipeline
                            </h3>
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add">
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                            <div className="d-flex justify-contant-center align-items-center" style={{ gap: 15 }}>
                                <div onClick={() => setViewType("grid")} className="border rounded d-flex justify-content-center align-items-center" style={{ backgroundColor: viewType === "grid" ? "#007BFF" : "transparent", cursor: "pointer", padding: "10px 12px" }}>
                                    <i className="far fa-th-large" style={{ fontSize: "20px", color: viewType === "grid" ? "#ffffff" : "#000000" }}></i>
                                </div>
                                <div onClick={() => setViewType("list")} className="border rounded d-flex justify-content-center align-items-center" style={{ backgroundColor: viewType === "list" ? "#007BFF" : "transparent", cursor: "pointer", padding: "10px 12px" }}>
                                    <i className="far fa-bars" style={{ fontSize: "20px", color: viewType === "list" ? "#ffffff" : "#000000" }}></i>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={9} md={9} lg={9} xl={9}>
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
                                        placeholder="Search Pipeline , Assignee , Ticket or Issue"
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
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {
                            viewType === "grid" ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,               // Spacing between columns
                                        height: height,       // Full height
                                        width: "100%",        // Full width
                                        overflowX: "auto",    // Scroll if screen is too narrow
                                        overflowY: "hidden",
                                        pb: 1,
                                        px: 0, // Remove padding to align with edges
                                    }}
                                >
                                    {filteredColumns?.map((col) => (
                                        <Box
                                            key={col.id}
                                            sx={{
                                                // THIS IS THE KEY CHANGE:
                                                flex: 1,            // Grow to fill available space evenly
                                                minWidth: "300px",  // Don't shrink below 300px (prevents squashing)
                                                height: "100%"
                                            }}
                                        >
                                            <Column col={col} />
                                        </Box>
                                    ))}
                                </Box>

                            ) :
                                <PipelineList
                                    columns={filteredColumns}
                                    height={height}
                                    onAddRow={() => {
                                        // hook this to your real add-row logic (API / state update)
                                        console.log("Add Row clicked");
                                    }}
                                />
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

const Column = ({ col }) => {
    return (
        <Box
            // elevation={0}
            sx={{
                // CHANGE: Use 100% width so it fills the flex container
                width: "100%",
                // borderRadius: 2,
                border: "1px solid #ffffff",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#fff",
            }}
        >
            {/* Column header */}
            <Box
                sx={{
                    px: 1.5,
                    py: 1.2,
                    background: col.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                        {col.title}  ({col.count || (col.items || []).length})
                    </span>
                </Box>
                <IconButton size="small" sx={{ color: "#fff" }}>
                    <AddBoxOutlinedIcon fontSize="small" />
                </IconButton>

            </Box>

            {/* Column summary */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", textAlign: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "13px", margin: "10px 0px" }}>
                    {money(col.total)}
                </span>
            </Box>
            {/* Cards list */}
            <Box
                sx={{
                    // p: 1.2,
                    overflowY: "auto",
                    flex: 1,
                    // Optional: Custom scrollbar for the internal list
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#ddd", borderRadius: "4px" }
                }}
            >
                {(col.items || []).map((item) => (
                    <CardItem key={item.id} item={item} accentColor={col.color} />
                ))}

                {(col.items || []).length === 0 && (
                    <Typography fontSize={12} sx={{ color: "#6b7280", p: 1, textAlign: "center" }}>
                        No records
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

const CardItem = ({ item, accentColor }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 1.2,
                borderRadius: 1.5,
                border: "1px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
            }}
        >
            {/* left accent line */}
            <Box sx={{ display: "flex" }}>
                <Box sx={{ width: 4, background: accentColor }} />
                <Box sx={{ p: 1.2, flex: 1 }}>
                    <p style={{ color: "#111827", fontWeight: "bold", fontSize: "12px" }}>
                        {item.title}
                    </p>

                    <p style={{ color: "#6b7280", fontWeight: "bold", fontSize: "12px" }}>
                        {money(item.amount)}
                    </p>

                    <p style={{ color: "#9ca3af", fontWeight: "bold", fontSize: "12px" }}>
                        {item.dateText}
                    </p>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", mt: 1, gap: 2 }}>
                        <span>
                            <i className="fal fa-envelope"></i>
                        </span>
                        <span>
                            <i className="far fa-phone-alt"></i>
                        </span>
                        <span>
                            <i className="far fa-comments-alt"></i>
                        </span>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default Pipeline;