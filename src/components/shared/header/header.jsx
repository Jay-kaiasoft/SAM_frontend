import React, { Fragment, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { AppBar, Toolbar, Box, Typography, Button, Menu, MenuItem, useMediaQuery, Avatar } from '@mui/material';
import { styled, useTheme } from "@mui/material/styles";
import DrawerComponent from './drawerComponent/drawerComponent';
import { logoutUserAction } from '../../../actions/userActions'
import styles from "../../../assets/styles/componentStyles.js";
import history from "../../../history.js";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { siteURL, staticUrl } from "../../../config/api";
import { getHostData, getInitials } from '../../../assets/commonFunctions';
import { Link } from 'react-router-dom';
import { FormGroup } from 'reactstrap';
import DropDownControls from '../commonControlls/dropdownControl.jsx';

const clients = [{
    key: 1,
    value: "Client 1"
}]
const projects = [{
    key: 1,
    value: "Project 1"
}]
const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
    [theme.breakpoints.up("xs")]: {
        display: "block",
        width: 80,
    },
    [theme.breakpoints.up("sm")]: {
        display: "none",
    },
    [theme.breakpoints.up("lg")]: {
        display: "block",
        width: 280,
    }
}));
const Header = props => {
    const theme = useTheme();
    const { user, subUser } = props
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const [anchorE3, setAnchorE3] = useState(null);
    const [anchorE4, setAnchorE4] = useState(null);
    const isMatch = useMediaQuery(theme.breakpoints.down('lg'));

    const [time, setTime] = useState("");        // e.g., "6:47"
    const [period, setPeriod] = useState("");    // e.g., "pm"
    const [tzLabel, setTzLabel] = useState("");  // e.g., "IST / +5.30 GMT"
    const tzIdRef = useRef("UTC");

    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null)

    const handleChangeClient = (event, value) => {
        setSelectedClient(value)
    }

    const handleChangeProject = (event, value) => {
        setSelectedProject(value)
    }

    const handleLogout = () => {
        setAnchorEl(null);
        props.logOut();
    }
    const handleClick = e => {
        setAnchorE2(e.currentTarget);
    };
    const handleClose = (name) => {
        setAnchorE2(null);
        if (name !== "") {
            if (name === "support") {
                window.open(staticUrl + "/support/", "_blank");
            } else {
                history.push("/" + name);
            }
        }
    };
    const handleStart = e => {
        setAnchorEl(e.currentTarget);
    };
    const closeStart = (name) => {
        setAnchorEl(null);
        if (name !== "") {
            history.push("/" + name);
        }
    };
    const handleMyCrm = e => {
        setAnchorE3(e.currentTarget);
    };
    const closeMyCrm = (name) => {
        setAnchorE3(null);
        if (name !== "") {
            history.push("/" + name);
        }
    };
    const handleMyDesktop = e => {
        setAnchorE4(e.currentTarget);
    };
    const closeMyDesktop = (name) => {
        setAnchorE4(null);
        if (name !== "") {
            history.push("/" + name);
        }
    };
    const noPermission = () => {
        props.globalAlert({
            type: "Error",
            text: "You don't have permission. Please contact your admin.",
            open: true
        });
    }
    const noPermission2 = () => {
        props.globalAlert({
            type: "Error",
            text: "Your Plan doesn't have this functionality. Please upgrade your plan.",
            open: true
        });
    }

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
        <Fragment>
            <Box>
                <AppBar elevation={0} color="transparent" position="static" sx={styles.header}>
                    <Toolbar
                        disableGutters
                        sx={{
                            px: { xs: 1.5, sm: 2, md: 3 },
                            minHeight: { xs: 56, sm: 64 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 1, sm: 1.5, md: 2 },
                                minWidth: 0,
                                flexShrink: 0,
                            }}
                        >
                            <Link to={"dashboard"}>
                                <Box
                                    component="img"
                                    src={siteURL + "/img/logo-s.svg"}
                                    alt="logo"
                                    sx={{
                                        height: { xs: 28, sm: 32, md: 36 },
                                        width: "auto",
                                        display: "block",
                                    }}
                                />
                            </Link>

                            <Box sx={{ display: "block", width: { xs: 130, sm: 200, lg: 250 } }}>
                                <DropDownControls
                                    id="client"
                                    name="client"
                                    label="Client"
                                    onChange={handleChangeClient}
                                    value={selectedClient || null}
                                    dropdownList={clients}
                                />
                            </Box>

                            <Box sx={{ display: "block", width: { xs: 130, sm: 200, lg: 250, } }}>
                                <DropDownControls
                                    id="project"
                                    name="project"
                                    label="Project"
                                    onChange={handleChangeProject}
                                    value={selectedProject}
                                    dropdownList={projects}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1 }} />

                        <Box sx={{ display: ["none", "flex"], alignItems: "center", gap: 1 }}>
                            <Typography sx={{ fontSize: "30px !important", fontWeight: 600 }}>{time}</Typography>
                            <div>
                                <Typography sx={{ fontSize: "10px !important", fontWeight: 400, color: "#777", textTransform: "uppercase" }}>{period}</Typography>
                                <Typography sx={{ fontSize: "10px !important", fontWeight: 400, color: "#777" }}>{tzLabel}</Typography>
                            </div>
                        </Box>

                        {isMatch ? (
                            <DrawerComponent />
                        ) : (
                            <>
                                <Box>
                                    <Button onClick={() => { return history.push("/dashboard") }}>Dashboard</Button>
                                    <Button aria-controls="start-mycrm" aria-haspopup="true" onClick={handleMyCrm}>My CRM</Button>
                                    <Menu id="start-mycrm" anchorEl={anchorE3} keepMounted open={Boolean(anchorE3)} onClose={() => { closeMyCrm("") }}>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Client Contact") ? (props.menuLists.includes("my crm") || subUser.memberId === 0) ? closeMyCrm("clientContact") : noPermission() : noPermission2() }}>Client Contact</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("My Calendar") ? (props.menuLists.includes("my crm") || subUser.memberId === 0) ? closeMyCrm("mycalendar") : noPermission() : noPermission2() }}>My Calendar</MenuItem>
                                        {/*<MenuItem onClick={()=>{ return props.menuLists.includes("my crm") || subUser.memberId === 0 ? closeMyCrm("mypipeline") : noPermission()}}>My Pipeline</MenuItem>*/}
                                        {/*<MenuItem onClick={()=>{ return props.menuLists.includes("my crm") || subUser.memberId === 0 ? closeMyCrm("mytasks") : noPermission()}}>My Tasks</MenuItem>*/}
                                        <MenuItem onClick={() => { return user.planModuleList.includes("SMS Inbox") ? (props.menuLists.includes("my crm") || subUser.memberId === 0) ? closeMyCrm("managesmsinbox") : noPermission() : noPermission2() }}>SMS Inbox</MenuItem>
                                    </Menu>
                                    <Button onClick={() => { return user.planModuleList.includes("My Analytics") ? history.push("/myanalytics") : noPermission2() }}>My Analytics</Button>
                                    <Button aria-controls="start-mydesktop" aria-haspopup="true" onClick={handleMyDesktop}>My Desktop</Button>
                                    <Menu id="start-mydesktop" anchorEl={anchorE4} keepMounted open={Boolean(anchorE4)} onClose={() => { closeMyDesktop("") }}>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("My Pages Design") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("mypages") : noPermission() : noPermission2() }}>My Pages Design</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("SMS Templates") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("smstemplates") : noPermission() : noPermission2() }}>SMS Templates</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Build It For Me") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("builditforme") : noPermission() : noPermission2() }}>Build It For Me</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("My Forms Design") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("myforms") : noPermission() : noPermission2() }}>My Forms Design</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Survey Design") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("mysurveytemplates") : noPermission() : noPermission2() }}>Survey Design</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Assessment Design") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("myassessmenttemplates") : noPermission() : noPermission2() }}>Assessment Design</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("My Drive") ? (props.menuLists.includes("my desktop") || subUser.memberId === 0) ? closeMyDesktop("mydrive") : noPermission() : noPermission2() }}>My Drive</MenuItem>
                                    </Menu>
                                    <Button aria-controls="start-Campaign" aria-haspopup="true" onClick={handleStart}>
                                        My Campaigns
                                    </Button>
                                    <Menu id="start-Campaign" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => { closeStart("") }}>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Email Campaign") ? (props.menuLists.includes("email campaign") || subUser.memberId === 0) ? closeStart("manageemailcampaign") : noPermission() : noPermission2() }}>Email Campaign</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("SMS Campaign") ? (props.menuLists.includes("sms campaign") || subUser.memberId === 0) ? closeStart("managesmscampaign") : noPermission() : noPermission2() }}>SMS Campaign</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Social Media Post") ? (props.menuLists.includes("social media post") || subUser.memberId === 0) ? closeStart("managesocialmedia") : noPermission() : noPermission2() }}>Social Media Post</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Automation") ? (props.menuLists.includes("automation") || subUser.memberId === 0) ? closeStart("manageautomation") : noPermission() : noPermission2() }}>Automation</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Survey") ? (props.menuLists.includes("surveys") || subUser.memberId === 0) ? closeStart("managesurvey") : noPermission() : noPermission2() }}>Survey</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("SMS Polling") ? (props.menuLists.includes("sms polling") || subUser.memberId === 0) ? closeStart("managesmspolling") : noPermission() : noPermission2() }}>SMS Polling</MenuItem>
                                        <MenuItem onClick={() => { return user.planModuleList.includes("Assessment") ? (props.menuLists.includes("assessment") || subUser.memberId === 0) ? closeStart("manageassessment") : noPermission() : noPermission2() }}>Assessment</MenuItem>
                                    </Menu>
                                </Box>
                                {(user && subUser) &&
                                    <Fragment>
                                        {
                                            subUser.memberId > 0 ?
                                                typeof subUser.imageUrl === "undefined" || subUser.imageUrl === null || subUser.imageUrl === "" ?
                                                    <div className='profile-image ml-2 cursor-pointer' onClick={handleClick}>{getInitials(subUser.firstName, subUser.lastName)}</div>
                                                    :
                                                    <Avatar className="ml-2" alt="Avatar" src={subUser.imageUrl + `?v=${Math.floor(Math.random() * 100001)}`} onClick={handleClick} />
                                                :
                                                typeof user.imageUrl === "undefined" || user.imageUrl === null || user.imageUrl === "" ?
                                                    <div className='profile-image ml-2 cursor-pointer' onClick={handleClick}>{getInitials(user.firstName, user.lastName)}</div>
                                                    :
                                                    <Avatar className="ml-2" alt="Avatar" src={user.imageUrl + `?v=${Math.floor(Math.random() * 100001)}`} onClick={handleClick} />
                                        }
                                        <Menu id="simple-menu" anchorEl={anchorE2} keepMounted open={Boolean(anchorE2)} onClose={() => { handleClose("") }}>
                                            <MenuItem onClick={() => { return user.planModuleList.includes("Edit Profile") ? handleClose("memberinfo") : noPermission2() }}>Edit Profile</MenuItem>
                                            {subUser.memberId === 0 && <MenuItem onClick={() => { return user.planModuleList.includes("Manage User") ? handleClose("manageusers") : noPermission2() }}>Manage User</MenuItem>}
                                            <MenuItem onClick={() => { return user.planModuleList.includes("Domain & Email Verifications") ? (props.menuLists.includes("domain and email verification") || subUser.memberId === 0) ? handleClose("domainemailverification") : noPermission() : noPermission2() }}>Domain & Email Verifications</MenuItem>
                                            <MenuItem onClick={() => { return user.planModuleList.includes("Affiliate Program") ? handleClose("affiliateprogram") : noPermission2() }}>Affiliate Program</MenuItem>
                                            <MenuItem onClick={() => { return handleClose("contactus") }}>Contact Us</MenuItem>
                                            <MenuItem onClick={() => { return handleClose("managesupportticket") }}>Support Ticket</MenuItem>
                                            <MenuItem onClick={() => { return handleClose("support") }}>Knowledge Base</MenuItem>
                                            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                                        </Menu>
                                    </Fragment>
                                }
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </Fragment>
    )
}
const mapStateToProps = ({ user, subUser, menuLists }) => ({ user, subUser, menuLists })
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        logOut: () => {
            dispatch(logoutUserAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)