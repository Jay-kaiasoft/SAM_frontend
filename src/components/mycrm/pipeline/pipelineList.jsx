import React, { useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Paper,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1.5rem', color: "#5EDF74", fontWeight: "bold" }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'transparent',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: 0,
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

// currency
const money = (n) => {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));
    } catch {
        return `$${n}`;
    }
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// priority colors (match screenshot vibe)
const priorityStyle = (p) => {
    const v = String(p || "").toLowerCase();
    if (v === "high") return { bg: "#ED6E40", fg: "#fff" };
    if (v === "medium") return { bg: "#8AD911", fg: "#0b1b0b" };
    if (v === "average") return { bg: "#4097ED", fg: "#fff" };
    if (v === "low") return { bg: "#9ca3af", fg: "#fff" };
    return { bg: "#e5e7eb", fg: "#111827" };
};

const stageStyle = (hex) => {
    // use your column color as stage bg
    return { bg: hex || "#6b7280", fg: "#fff" };
};

const ChipCell = ({ text, bg, fg }) => (
    <div
        style={{
            width: "100%",
            height: 34,          // ✅ was 44
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,        // ✅ smaller
            backgroundColor: bg,
            color: fg,
            userSelect: "none",
        }}
    >
        {text}
    </div>
);


const OwnerCell = ({ assignees = [] }) => {
    const shown = assignees.slice(0, 3);
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {shown.map((a) => (
                <Avatar
                    key={a.id}
                    src={a.src || ""}
                    sx={{
                        width: 22,     // ✅ was 28
                        height: 22,    // ✅ was 28
                        fontSize: 11,
                        bgcolor: "#111827",
                    }}
                >
                    {(a.name || "?").slice(0, 2).toUpperCase()}
                </Avatar>
            ))}
            {assignees.length > 3 && (
                <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "#6b7280" }}>
                    +{assignees.length - 3}
                </Avatar>
            )}
        </Box>
    );
};

export default function PipelineList({
    columns = [],
    onAddRow,
    height = "calc(100vh - 220px)",
}) {
    // selection
    const [selected, setSelected] = useState(() => new Set());

    // flatten columns -> rows (stage comes from column)
    const rows = useMemo(() => {
        const out = [];
        (columns || []).forEach((col) => {
            (col.items || []).forEach((it) => {
                // if your API already has these, keep them
                const dealLengthDays =
                    it.dealLengthDays ??
                    it.dealLength ??
                    // fallback: generate something stable-ish
                    clamp((String(it.id || "").length * 37) % 180, 15, 180);

                const dealValue =
                    it.dealValue ??
                    it.amount ??
                    0;

                out.push({
                    id: it.id,
                    deal: it.title || "Untitled",
                    assignees: it.assignees || [],
                    stage: col.title || "",
                    stageColor: col.color || "#6b7280",
                    priority: it.priority || "Medium",
                    dealLengthDays,
                    dealValue,
                });
            });
        });
        return out;
    }, [columns]);

    const totals = useMemo(() => {
        const count = rows.length || 1;
        const sumValue = rows.reduce((a, r) => a + Number(r.dealValue || 0), 0);
        const avgLen = rows.reduce((a, r) => a + Number(r.dealLengthDays || 0), 0) / count;
        return {
            sumValue,
            avgLen: Math.round(avgLen),
        };
    }, [rows]);

    const allChecked = rows.length > 0 && selected.size === rows.length;
    const someChecked = selected.size > 0 && selected.size < rows.length;

    const toggleAll = (checked) => {
        if (checked) setSelected(new Set(rows.map((r) => r.id)));
        else setSelected(new Set());
    };

    const toggleOne = (id) => {
        setSelected((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <Box sx={{ width: "100%" }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <span style={{ color: "#5EDF74", fontWeight: "bold", fontSize: "18px" }}>
                        New Orders
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={{
                            height,
                            border: "1px solid #e5e7eb",
                            borderRadius: 2,
                            overflow: "auto",
                        }}
                    >
                        <Table
                            stickyHeader
                            size="small"
                            sx={{
                                minWidth: 1100,

                                // ✅ Compact all cells (header + body)
                                "& .MuiTableCell-root": {
                                    paddingTop: "6px",
                                    paddingBottom: "6px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    fontSize: "13px",
                                    lineHeight: 1.2,
                                    whiteSpace: "nowrap",
                                },

                                // ✅ Header slightly taller but still compact
                                "& .MuiTableCell-head": {
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                },

                                // ✅ Body row height like screenshot
                                "& .MuiTableRow-root": {
                                    height: 40,
                                },

                                // ✅ Checkbox spacing smaller
                                "& .MuiCheckbox-root": {
                                    padding: "4px",
                                },

                                // ✅ Icon buttons smaller
                                "& .MuiIconButton-root": {
                                    padding: "4px",
                                },
                            }}
                        >
                            <TableHead>
                                <TableRow sx={{ height: 38 }}>
                                    <TableCell sx={{ width: 80 }}>
                                        <Checkbox
                                            checked={allChecked}
                                            indeterminate={someChecked}
                                            onChange={(e) => toggleAll(e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Deal</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Owner</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Stage</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Priority</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Deal length</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: "#4097ED" }}>Deal value</TableCell>
                                    <TableCell align="right" sx={{ width: 70 }}>
                                        <Tooltip title="Add Row" arrow>
                                            <IconButton size="small" onClick={onAddRow}>
                                                <AddBoxOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((r) => {
                                    const p = priorityStyle(r.priority);
                                    const s = stageStyle(r.stageColor);

                                    return (
                                        <TableRow key={r.id} hover>
                                            <TableCell>
                                                <Checkbox checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} />
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <span>{r.deal}</span>
                                                    <Tooltip title="Notes" arrow>
                                                        <i className="far fa-comment-dots" style={{ color: "#6b7280" }} />
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <OwnerCell assignees={r.assignees} />
                                            </TableCell>

                                            <TableCell sx={{ p: 0 }}>
                                                <ChipCell text={r.stage} bg={s.bg} fg={s.fg} />
                                            </TableCell>

                                            <TableCell sx={{ p: 0 }}>
                                                <ChipCell text={r.priority} bg={p.bg} fg={p.fg} />
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 600 }}>
                                                {r.dealLengthDays} Days
                                            </TableCell>

                                            <TableCell sx={{ fontWeight: 700 }}>
                                                {money(r.dealValue)}
                                            </TableCell>

                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                <TableRow>
                                    <TableCell colSpan={8} sx={{ borderTop: "1px solid #e5e7eb" }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                cursor: "pointer",
                                                width: "fit-content",
                                                px: 1,
                                                py: 1,
                                                borderRadius: 1,
                                                "&:hover": { bgcolor: "#f3f4f6" },
                                            }}
                                            onClick={onAddRow}
                                        >
                                            <AddBoxOutlinedIcon fontSize="small" />
                                            <Typography sx={{ fontWeight: 700 }}>Add Row</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell sx={{ fontWeight: 800 }}>
                                        {totals.avgLen} Days (Avg)
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>
                                        {money(totals.sumValue)} (Sum)
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

        </Box>
    );
}
