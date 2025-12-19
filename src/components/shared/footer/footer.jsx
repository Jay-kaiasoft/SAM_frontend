import React, { useEffect, useRef, useState } from 'react'
import { Row, Col } from 'reactstrap'
import styles from "../../../assets/styles/componentStyles.js";
import { siteURL, websiteTitleWithExt } from "../../../config/api";
import { getHostData } from '../../../assets/commonFunctions.js';
import { Box, Typography } from '@mui/material';

const Footer = props => {
    const [time, setTime] = useState("");        // e.g., "6:47"
    const [period, setPeriod] = useState("");    // e.g., "pm"
    const [tzLabel, setTzLabel] = useState("");  // e.g., "IST / +5.30 GMT"
    const tzIdRef = useRef("UTC");

    // Helper: "+5.30 GMT" from utcOffset seconds (e.g., 19800)
    const formatOffsetLabel = (seconds) => {
        if (typeof seconds !== "number" || Number.isNaN(seconds)) return "GMT";
        const sign = seconds >= 0 ? "+" : "-";
        const abs = Math.abs(seconds);
        const hh = Math.floor(abs / 3600).toString().padStart(2, "0");
        const mm = Math.floor((abs % 3600) / 60).toString().padStart(2, "0");
        // You used dot style "+5.30 GMT"; keep that to match your UI
        return `${sign}${hh}.${mm} GMT`;
    };

    // Fallback: try to get "GMT+5:30" from Intl and convert to "+5.30 GMT"
    const fallbackOffsetLabel = (tzId) => {
        try {
            const parts = new Intl.DateTimeFormat("en-US", {
                timeZone: tzId,
                timeZoneName: "shortOffset",
            }).formatToParts(new Date());
            const off = parts.find((p) => p.type === "timeZoneName")?.value || "GMT";
            // "GMT+5:30" -> "+5.30 GMT"
            return off.replace("GMT", "").replace(":", ".").trim() + " GMT";
        } catch {
            return "GMT";
        }
    };

    const tick = () => {
        const now = new Date();
        const fmt = new Intl.DateTimeFormat("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: tzIdRef.current,
        }).format(now);
        const [hrsMins, ampm] = fmt.split(" ");
        setTime(hrsMins);
        setPeriod((ampm || "").toLowerCase()); // 'am' | 'pm'
    };

    useEffect(() => {
        let interval;

        const init = async () => {
            try {
                // 1) Fetch ONCE
                const res = await getHostData();
                const tzInfo = res?.data?.address?.timeZone || {};
                const tzId =
                    tzInfo.id ||
                    Intl.DateTimeFormat().resolvedOptions().timeZone ||
                    "UTC";

                tzIdRef.current = tzId;

                // 2) Build dynamic label (code + offset)
                const code =
                    tzInfo.code ||
                    // very light fallback: short name, else tz id
                    new Intl.DateTimeFormat("en-US", {
                        timeZone: tzId,
                        timeZoneName: "short",
                    })
                        .formatToParts(new Date())
                        .find((p) => p.type === "timeZoneName")?.value ||
                    tzId;

                const offsetLabel =
                    typeof tzInfo.utcOffset === "number"
                        ? formatOffsetLabel(tzInfo.utcOffset)
                        : fallbackOffsetLabel(tzId);

                // Optional: include country flag if you like
                // const flag = res?.data?.address?.countryFlag || "";

                setTzLabel(`${code} / ${offsetLabel}`);

            } catch {
                // Absolute fallback: use local environment timezone
                const tzId = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
                tzIdRef.current = tzId;
                setTzLabel(`${tzId} / ${fallbackOffsetLabel(tzId)}`);
            }

            // 3) Start ticking every second (no more network calls)
            tick();
            interval = setInterval(tick, 1000);
        };

        init();
        return () => clearInterval(interval);
    }, []);
    return (
        <Row className='bg-white' style={{ zIndex: 999 }}>
            <Col xs={12} sm={12} md={12} lg={12} className='p-0'><hr className='mt-0' /></Col>
            <Col xs={12} sm={12} md={3} lg={3}>
                <div className='d-flex align-items-center' style={{ gap: 30 }}>
                    <img src={siteURL + "/img/logo.svg"} alt="logo" style={styles.footerLogo} />
                    <Box sx={{ display: ["none", "flex"], alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: "20px !important", fontWeight: 600 }}>{time}</Typography>
                        <div>
                            <Typography sx={{ fontSize: "10px !important", fontWeight: 400, color: "#777", textTransform: "uppercase" }}>{period}</Typography>
                            <Typography sx={{ fontSize: "10px !important", fontWeight: 400, color: "#777" }}>{tzLabel}</Typography>
                        </div>
                    </Box>

                </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} className="text-center">Copyright &copy; {new Date().getFullYear()} {websiteTitleWithExt}. All Rights Reserved.</Col>
            <Col xs={12} sm={12} md={3} lg={3} className="text-right"></Col>
            <Col xs={12} sm={12} md={12} lg={12} className='p-0 mb-3'></Col>
        </Row>
    )
}

export default Footer