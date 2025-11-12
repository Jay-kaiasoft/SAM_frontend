import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Col, Row, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { handleClickHelp } from "../../assets/commonFunctions";
import { Button, FormControl, FormGroup, InputLabel, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Popover, Select, TextField } from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import InputField from "../shared/commonControlls/inputField";
import { deleteAnalyticsWebsite, getAllAnalyticsWebsites, saveAnalyticsWebsite } from "../../services/analyticsService";
import { getDomainList } from "../../services/profileService";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import CopyLink from "../shared/commonControlls/copyLink";
import UserMonetisation from "./userMonetisation";
import History from "../../history";
import DashboardAnalytics from "./dashboardAnalytics";
import CampaignMonetisation from "./campaignMonetisation";
import { analyticJsUrl, websiteColor } from "../../config/api";
import { useLocation } from "react-router-dom";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";

const drawerWidth = 240;
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const DisplayComponents = React.memo(({ analyticsWebId, globalAlert, setSelectedIndexDrawer, setSelectedIndexDrawerSecondary }) => {
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        switch (pathname) {
        default:
        case "/dashboardanalytics":
            setSelectedIndexDrawer(0);
            setSelectedIndexDrawerSecondary(-1);
            break;
        case "/usermonetisation":
            setSelectedIndexDrawer(1);
            setSelectedIndexDrawerSecondary(1);
            break;
        case "/campaignmonetisation":
            setSelectedIndexDrawer(1);
            setSelectedIndexDrawerSecondary(0);
            break;
        }
    }, [pathname, setSelectedIndexDrawer, setSelectedIndexDrawerSecondary]);

    switch (pathname) {
        default:
        case "/dashboardanalytics":
            return <DashboardAnalytics analyticsWebId={analyticsWebId} globalAlert={globalAlert} />;
        case "/usermonetisation":
            return <UserMonetisation analyticsWebId={analyticsWebId} />;
        case "/campaignmonetisation":
            return <CampaignMonetisation analyticsWebId={analyticsWebId} />;
    }
});

const MyAnalytics = ({globalAlert, confirmDialog}) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const selectedIndex = useRef(0);
    const open = Boolean(anchorEl);
    const [singleWebsiteData, setSingleWebsiteData] = useState({ id: 0, name: "", addedDate: "", domain: "", subdomain: "" });
    const [websiteModal, setWebsiteModal] = useState(false);
    const toggleWebsiteModal = () => {
        if (websiteModal) {
            setSingleWebsiteData({ id: 0, name: "", addedDate: "", domain: "", subdomain: "" });
        }
        setWebsiteModal(!websiteModal);
    };
    const [infoModal, setInfoModal] = useState(false);
    const toggleInfoModal = () => { setInfoModal(!infoModal); };
    const [codeModal, setCodeModal] = useState(false);
    const [code, setCode] = useState("");
    const toggleCodeModal = () => {
        if (codeModal) {
            setCode("");
        }
        setCodeModal(!codeModal);
    };
    const [verifiedDomains, setVerifiedDomains] = useState([]);
    const inputRefs = useRef([createRef()]);
    const [websiteData, setWebsiteData] = useState([]);
    const menuData = [
        {"name": "Dashboard", "icon": <i className="far fa-home"></i>, "url": "/dashboardanalytics"},
        {"name": "Reports", "icon": <i className="fas fa-analytics"></i>, "url": ""}
    ];
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
    const [analyticsWebId, setAnalyticsWebId] = useState(null);
    const [selectedIndexDrawer, setSelectedIndexDrawerState] = useState(-1);
    const [selectedIndexDrawerSecondary, setSelectedIndexDrawerSecondaryState] = useState(-1);

    const setSelectedIndexDrawer = useCallback((val) => setSelectedIndexDrawerState(val), []);
    const setSelectedIndexDrawerSecondary = useCallback((val) => setSelectedIndexDrawerSecondaryState(val), []);

    const handleSubmenuOpen = (event) => {
        setSubmenuAnchorEl(event.currentTarget);
    };
    const handleSubmenuClose = () => {
        setSubmenuAnchorEl(null);
    };
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (index) => {
        selectedIndex.current = index;
        setAnalyticsWebId(websiteData[index].analyticsWebId);
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickAdd = () => {
        toggleWebsiteModal();
    }
    const closeTimeout = useRef();
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };
    const handleDrawerClose = () => {
        closeTimeout.current = setTimeout(() => {
            handleSubmenuClose();
            setOpenDrawer(false);
        }, 300);
    };
    const cancelCloseTimeout = () => {
        clearTimeout(closeTimeout.current);
    };
    const handleClickAddWebsite = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let websiteUrl = "";
        if(typeof singleWebsiteData?.subdomain === "undefined" || singleWebsiteData?.subdomain === null || singleWebsiteData?.subdomain === "") {
            websiteUrl = singleWebsiteData.domain;
        } else {
            websiteUrl = singleWebsiteData?.subdomain  + "." + singleWebsiteData.domain;
        }
        saveAnalyticsWebsite({ websiteUrl: websiteUrl }).then((response) => {
            if (response.status === 200) {
                let id = response.result.websiteAnalyticsData.mwaId;
                displayDataList(id);
            } else {
                globalAlert({
                    type: "Error",
                    text: response.message,
                    open: true
                });
            }
        })
        toggleWebsiteModal();
    }
    const displayDataList = useCallback((setIndex = 0) => {
        setWebsiteData([]);
        getAllAnalyticsWebsites().then((response) => {
            if (response.status === 200) {
                if (response.result) {
                    setWebsiteData(response.result.websiteList);
                    if (setIndex !== 0) {
                        let index = response.result.websiteList.findIndex(item => item.mwaId === setIndex);
                        selectedIndex.current = index;
                        handleClickCode();
                    }
                    setAnalyticsWebId(response.result.websiteList[selectedIndex.current].analyticsWebId);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: response.message,
                    open: true
                });
            }
        });
    }, []);
    const handleClickCode = () => {
        let id = null;
        setWebsiteData((prev) =>{
            prev.map((item, index) => (
                (index === selectedIndex.current) && (id = item.analyticsWebId)
            ));
            setCode(
                `<!-- SAMAI Analytics Tag Start -->\n` +
                `<samai-web-id style="color: transparent;">${id}</samai-web-id>\n` +
                `<script src="${analyticJsUrl}"></script>\n` +
                `<!-- SAMAI Analytics Tag End -->\n`
            );
            toggleCodeModal();
            return prev;
        })
    }
    const handleClickDelete = () => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this website?',
            onConfirm: () => {
                deleteAnalyticsWebsite(websiteData?.[selectedIndex.current]?.mwaId).then((response) => {
                    if (response.status === 200) {
                        selectedIndex.current = 0;
                        displayDataList();
                        globalAlert({
                            type: "Success",
                            text: response.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: response.message,
                            open: true
                        });
                    }
                });
            }
        });
    }

    useEffect(() => {
        getDomainList().then((response) => {
            if (response.status === 200) {
                if (response.result) {
                    setVerifiedDomains(response.result.domain.filter(item => (item.status === 1)).map(item => item.domain));
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: response.message,
                    open: true
                });
            }
        });
    }, []);
    useEffect(() => {
        displayDataList();
    }, [displayDataList]);

    return (
        <Row className="midleMain pt-0" style={{"overflowX":"hidden", "overflowY":"auto"}}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-0" style={{"paddingLeft": "63px"}}>
                <Drawer variant="permanent" open={openDrawer} onMouseEnter={cancelCloseTimeout} onMouseLeave={handleDrawerClose} 
                PaperProps={{
                    sx: {
                        position: 'absolute',
                        zIndex: 999
                    }
                }}>
                    <List>
                        {menuData.map((text, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    selected={selectedIndexDrawer === index}
                                    onClick={(e) => {
                                        index === 0 ?
                                            History.push(`${text.url}`)
                                        :
                                            handleSubmenuOpen(e)
                                    }}
                                    onMouseEnter={handleDrawerOpen}
                                    sx={[
                                        {
                                            minHeight: 48,
                                            px: 2.5,
                                            '&.Mui-selected': {
                                                backgroundColor: websiteColor,
                                                color: '#fff',
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: websiteColor,
                                                color: '#fff',
                                            },
                                            '&.Mui-selected .MuiListItemIcon-root': {
                                                color: '#fff',
                                            },
                                        },
                                        openDrawer
                                            ? {
                                                justifyContent: 'initial',
                                            }
                                            : {
                                                justifyContent: 'center',
                                            },
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[
                                            {
                                                minWidth: 0,
                                                justifyContent: 'center',
                                            }
                                        ]}
                                    >
                                        {text.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={text.name}
                                        sx={[
                                            {
                                                ml: 3
                                            },
                                            openDrawer
                                                ? {
                                                    opacity: 1,
                                                    display: "block"
                                                }
                                                : {
                                                    opacity: 0,
                                                    display: "none"
                                                },
                                        ]}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Popover
                        open={Boolean(submenuAnchorEl)}
                        anchorEl={submenuAnchorEl}
                        onClose={() => setSubmenuAnchorEl(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        disableRestoreFocus
                    >
                        <List sx={{ minWidth: 150 }}>
                            <ListItemButton
                                selected={selectedIndexDrawerSecondary === 0}
                                onClick={()=>{handleSubmenuClose(); handleDrawerClose(); History.push(`/campaignmonetisation`);}}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: websiteColor,
                                        color: '#fff',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: websiteColor,
                                        color: '#fff',
                                    },
                                }}
                            >
                                <ListItemText primary="Campaign Monetisation" />
                            </ListItemButton>
                            <ListItemButton
                                selected={selectedIndexDrawerSecondary === 1}
                                onClick={()=>{handleSubmenuClose(); handleDrawerClose(); History.push(`/usermonetisation`);}}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: websiteColor,
                                        color: '#fff',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: websiteColor,
                                        color: '#fff',
                                    },
                                }}
                            >
                                <ListItemText primary="User Journey" />
                            </ListItemButton>
                        </List>
                    </Popover>
                </Drawer>
                <Paper className="d-flex align-items-center">
                    <div>
                        <List
                            component="nav"
                        >
                            <ListItemButton
                                id="lock-button"
                                aria-haspopup="listbox"
                                aria-controls="lock-menu"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClickListItem}
                                className="flex-row-reverse"
                            >
                                <ListItemIcon style={{ minWidth: "max-content", marginLeft: "10px" }}>
                                    <i className="fas fa-caret-down"></i>
                                </ListItemIcon>
                                <ListItemText
                                    primary={websiteData?.[selectedIndex.current]?.websiteUrl}
                                />
                            </ListItemButton>
                        </List>
                        <Menu
                            id="lock-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                list: {
                                    role: 'listbox',
                                },
                            }}
                        >
                            {websiteData.map((option, index) => (
                                <MenuItem
                                    key={index}
                                    selected={index === selectedIndex.current}
                                    onClick={() => handleMenuItemClick(index)}
                                >
                                    {option.websiteUrl}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                    <div style={{ zIndex: "9" }}>
                        <Link component="a" className="btn-circle" onClick={() => { handleClickAdd() }} data-toggle="tooltip" title="Add">
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                        <Link component="a" className="btn-circle" onClick={() => { handleClickCode() }} data-toggle="tooltip" title="Code">
                            <i className="far fa-code"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle" onClick={() => { handleClickDelete() }} data-toggle="tooltip" title="Delete">
                            <i className="far fa-trash-alt"></i>
                            <div className="bg-red"></div>
                        </Link>
                        <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("Analytics/Setup/WebSiteAnalytics.html") }} data-toggle="tooltip" title="Help">
                            <i className="far fa-question-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
                        <Link component="a" className="btn-circle" onClick={toggleInfoModal} data-toggle="tooltip" title="Help">
                            <i className="far fa-info-circle"></i>
                            <div className="bg-grey"></div>
                        </Link>
                    </div>
                </Paper>
                <div className="m-3">
                    <DisplayComponents
                        analyticsWebId={analyticsWebId}
                        globalAlert={globalAlert}
                        setSelectedIndexDrawer={setSelectedIndexDrawer}
                        setSelectedIndexDrawerSecondary={setSelectedIndexDrawerSecondary}
                    />
                </div>
            </Col>
            <Modal isOpen={websiteModal} toggle={() => { toggleWebsiteModal(); }}>
                <ModalHeader toggle={() => { toggleWebsiteModal(); }}>{singleWebsiteData.id === 0 ? "Add" : "Edit"} Website</ModalHeader>
                <ModalBody>
                    {
                        verifiedDomains.length > 0 ?
                            <Row>
                                <Col md={4} className='pr-0 d-flex align-items-end'>
                                    <FormGroup>
                                        <InputField
                                            ref={inputRefs.current[0]}
                                            type="text"
                                            id="subdomain"
                                            name="subdomain"
                                            label="Subdomain"
                                            onChange={(name, value) => { setSingleWebsiteData({ ...singleWebsiteData, [name]: value }) }}
                                            value={singleWebsiteData.subdomain}
                                        />
                                    </FormGroup>
                                    <div className='px-2'><strong>.</strong></div>
                                </Col>
                                <Col md={8} className='pl-0'>
                                    <FormControl fullWidth>
                                        <InputLabel id="domain-label" variant="standard">Domain</InputLabel>
                                        <Select
                                            label="domain"
                                            labelId="domain-label"
                                            variant="standard"
                                            value={singleWebsiteData?.domain || "Select Domain"}
                                            onChange={(event) => {
                                                setSingleWebsiteData(prevState => ({
                                                    ...prevState,
                                                    domain: event.target.value
                                                }))
                                            }}
                                            fullWidth
                                        >
                                            <MenuItem value="Select Domain">Select Domain</MenuItem>
                                            {
                                                verifiedDomains.map((domain, index) => (
                                                    <MenuItem key={index} value={domain}>{domain}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Col>
                            </Row>
                        : 
                            <Row>
                                <Col md={12}>
                                    <p className="">You don't have any verified domain.</p>
                                </Col>
                            </Row>
                    }
                    <p className="mt-3">Note : If your domain name isn’t listed in the dropdown, go to the <span onClick={() => {History.push("/domainemailverification");}} className='font-weight-bold cursor-pointer'>Domain and Email Verification</span> section to add it. Once added, return to this section to see it in the list.</p>
                </ModalBody>
                <ModalFooter>
                    {
                        verifiedDomains.length > 0 ?
                            <Button variant="contained" color="primary" onClick={handleClickAddWebsite} className="mr-3">{singleWebsiteData.id === 0 ? "ADD" : "SAVE"}</Button>
                            : null
                    }
                    <Button variant="contained" color="primary" onClick={() => { toggleWebsiteModal(); }}>CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal size='lg' isOpen={infoModal} toggle={toggleInfoModal}>
                <ModalHeader toggle={toggleInfoModal}>
                    <h4>
                        📊 SAMAI Custom Analytics – samAiTag() Integration Guide
                    </h4>
                </ModalHeader>
                <ModalBody>
                    <div className='p-3 overflow-auto' style={{ maxHeight: 'calc(100vh - 250px)' }}>
                        <p>
                            Add the following script to your website inside <code>&lt;head&gt;</code> tag:
                        </p>

                        <pre className="bg-light p-3 rounded text-wrap">
                            <p className='mb-0'>
                                {`<!-- SAMAI Analytics Tag Start -->`}
                            </p>
                            <p className='mb-0'>
                                {`<samai-web-id>YOUR_UNIQUE_SAMAI_WEB_ID</samai-web-id>`}
                            </p>
                            <p className='mb-0'>
                                {`<script src="https://atag.salesandmarketing.ai/js/analytics.js" defer></script>`}
                            </p>
                            <p className='mb-0'>
                                {`<!-- SAMAI Analytics Tag End -->`}   
                            </p>
                        </pre>
                        <h6 className="mt-4">🎯 Custom Event Tracking</h6>
                        <p>Track custom interactions using the <code>samAiTag()</code> function:</p>

                        <pre className="bg-light p-3 rounded">
                            <code>
                                {`samAiTag('event', 'signup_button_clicked', {
    location: 'hero_section',
    plan: 'Pro'
});`}
                            </code>
                        </pre>

                        <h6 className="mt-4">📨 Example: Form Submission</h6>
                        <pre className="bg-light p-3 rounded">
                            <code>
                                {`document.querySelector("#contact-form").addEventListener("submit", () => {
    samAiTag('event', 'contact_form_submitted', {
        form_type: 'lead',
        page: window.location.pathname
    });
});`}
                            </code>
                        </pre>

                        <h6 className="mt-4">⚙️ Optional Configuration</h6>
                        <p>Set a project or override the website ID:</p>
                        <pre className="bg-light p-3 rounded">
                            <code>
                                {`samAiTag('config', 'my-project-id', {
    website_id: 'your-site-id'
});`}
                            </code>
                        </pre>
                        <h6 className="mt-4">📞 Support</h6>
                        <p>
                            Have questions? Contact us at: <strong>support@salesandmarketing.ai</strong>
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={toggleInfoModal}>CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal size='lg' isOpen={codeModal} toggle={() => { toggleCodeModal(); }}>
                <ModalHeader toggle={() => { toggleCodeModal(); }}>Get Code</ModalHeader>
                <ModalBody>
                    <Row className='mb-3'>
                        <Col md={10} className="mx-auto">
                            <p className="">Copy the code below and paste it into the <strong>&lt;head&gt;</strong> section of your website.</p>
                            <p className="">This will enable analytics tracking for your website.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <FormGroup>
                                <TextField
                                    variant="standard"
                                    id="code"
                                    name="code"
                                    label="Code"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    value={code || ""}
                                    readOnly={true}
                                    onFocus={event => event.target.select()}
                                    InputProps={{
                                        endAdornment: <CopyLink elementName="code" iconSelector="copyCode" title="Copy Code" />
                                    }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={() => { toggleCodeModal(); }}>CLOSE</Button>
                </ModalFooter>
            </Modal>
        </Row>
    );
};
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
    }
}
export default connect(null, mapDispatchToProps)(MyAnalytics);