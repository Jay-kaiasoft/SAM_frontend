import { Col, FormGroup, Input, Row, Table } from "reactstrap";
import CheckPermissionButton from "../../shared/commonControlls/checkPermissionButton";
import { Box, FormControlLabel, IconButton, InputAdornment, Link, Pagination, Radio, RadioGroup, Tab, Tabs, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import EntriesPerPage from "./entriesPerPage";
import History from "../../../history";
import InputField from "../../shared/commonControlls/inputField";
import { a11yProps } from "../../../assets/commonFunctions";
import { useEffect, useState } from "react";

const useStyles = {
    root: {
        color: "#ffffff !important",
        "&:hover": {
            backgroundColor: "transparent !important"
        },
        "span": {
            color: "#ffffff !important"
        }
    },
    textRoot: {
        color: "#ffffff !important",
        "&:hover:before": {
            borderBottomColor: "#ffffff !important"
        },
        "&:before": {
            borderBottomColor: "#ffffff !important"
        },
        "&:after": {
            borderBottomColor: "#ffffff !important"
        },
        "& input::placeholder": {
            color: "#ffffff !important",
            opacity: 1
        }
    }
};

export const Tab0 = ({
    globalAlert = () => { },
    confirmDialog = () => { },
    clickedGroup,
    perPage,
    selectedPage,
    tableCheckBoxValueGroupIdList,
    handleClickAddMember = () => { },
    clickedToEdit,
    sortBox,
    toggleMoveContact = () => { },
    toggleExportContact = () => { },
    deleteDuplicateContact = () => { },
    contactDetails,
    mainTablecheckBoxValue,
    mainTableCheckBox,
    deleteContact = () => { },
    toggleFullscreenModal = () => { },
    clickedButtonEditContact = () => { },
    showDuplicateContact = () => { },
    handleClickSort = () => { },
    showTableHead,
    handleChangeSearch = () => { },
    handleClickHelp = () => { },
    handleChangePerPage = () => { },
    totalContactsByGroup,
    handleClickSearch = () => { },
    clickedToEditContact = () => { },
    tableCheckBox = () => { },
    languages,
    totalPages,
    handleChangePagination = () => { },
    search,
    handleClickImport = () => { },
    handleClickUnsubscribe = () => { },
    handleClickOptInButton = () => { },
    selectedClientData = null
}) => {
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>        
            <div style={{ display: "flex", justifyContent: "end", alignItems: "center", gap: "40px" }}>
                <div>
                    <EntriesPerPage perPage={perPage} handleChangePerPage={handleChangePerPage} />
                </div>
                <div className="w-25">
                    <FormGroup>
                        <InputField
                            type="text"
                            id="text"
                            name="text"
                            // label="text"
                            onChange={(name, value) => { console.log("name", name) }}
                            // onBlur={(e) => { handleCheckUsername(e.target.value.replaceAll(/[^a-zA-Z0-9_@.]/g, "")) }}
                            // validation={"required"}
                            // value={data?.username || ""}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <i className="far fa-search"></i>
                                    </InputAdornment>
                            }}
                        />
                    </FormGroup>
                </div>
            </div>

            <div>
                <Typography sx={{ fontSize: "22px !important", fontWeight: 600 }}>{selectedClientData?.name}</Typography>
                <Typography sx={{ fontSize: "16px !important", fontWeight: 400 }}>{selectedClientData?.address}</Typography>
            </div>
            <div className="my-2">
                {
                    selectedClientData && (
                        <Tabs
                            color="black"
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            sx={{ textAlign: "left", fontWeight: 700 }}
                        >
                            <Tab label="Client Information" {...a11yProps(0)} />
                            <Tab label="Client Contact" {...a11yProps(1)} />
                            <Tab label="Client Address" {...a11yProps(2)} />
                            <Tab label="Client Projects" {...a11yProps(3)} />
                            <Tab label="Payment method" {...a11yProps(4)} />
                        </Tabs>
                    )
                }
                <div className="my-4 px-3">
                    {
                        selectedClientData && value === 0 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "max-content 12px 1fr",
                                    columnGap: 14,
                                    rowGap: 2,
                                    fontSize: 18,
                                    alignItems: "start",
                                }}
                            >
                                <Typography fontWeight={600} fontSize={16}>
                                    Client Name
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Company A</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Client Industry
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Technology</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Description
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>
                                    Company Provide Best Business Solution and CRM Platform to Customer
                                </Typography>
                            </Box>

                        )
                    }
                    {
                        selectedClientData && value === 1 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "max-content 12px 1fr",
                                    columnGap: 14,
                                    rowGap: 2,
                                    fontSize: 18,
                                    alignItems: "start",
                                }}
                            >
                                <Typography fontWeight={600} fontSize={16}>
                                    Contact Person
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Jhonathan Flower</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Email ID
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Jhonathan@emailsandsurveys.com</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Phone Number
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>+1 (717) 550-1675</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Mobile Number
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>+1 (857) 725-4327</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Website URL
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>www.emailsandsurveys.com</Typography>
                            </Box>

                        )
                    }
                    {
                        selectedClientData && value === 2 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "max-content 12px 1fr",
                                    columnGap: 14,
                                    rowGap: 2,
                                    fontSize: 18,
                                    alignItems: "start",
                                }}
                            >
                                <Typography fontWeight={600} fontSize={16}>
                                    Address 1
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Breanne Vista</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Address 2
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>2306 Myrtie Points</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    City
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Massachusetts</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    State
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>Darrenhaven</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Zip / Post Code
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>24456-5740</Typography>

                                <Typography fontWeight={600} fontSize={16}>
                                    Country
                                </Typography>
                                <Typography fontSize={16}>:</Typography>
                                <Typography fontSize={16}>www.emailsandsurveys.com</Typography>
                            </Box>

                        )
                    }
                </div>
            </div>
        </>
    )
}

export const Tab1 = ({
    perPage,
    selectedPage,
    tableCheckBoxValueGroupIdList,
    sortBox,
    mainTablecheckBoxValue,
    mainTableCheckBox,
    deleteContact = () => { },
    handleClickSort = () => { },
    handleChangeSearch = () => { },
    handleChangePerPage = () => { },
    totalContactsByGroup,
    handleClickSearch = () => { },
    tableCheckBox = () => { },
    totalPages,
    handleChangePagination = () => { },
    search,
    confirmDialog = () => { },
    globalAlert = () => { },
    unsubscribedContactList,
    handleClickExportNotGroup = () => { },
    handleClickSendSubscribeLink = () => { },
    unsubscribedEmailSmsTab,
    setUnsubscribedEmailSmsTab = () => { }
}) => {
    return (
        <>
            <Row>
                <Col xs={9}>
                    <div className="icon-wrapper">                       
                        <CheckPermissionButton module="member" action="export">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export" onClick={() => { handleClickExportNotGroup(unsubscribedEmailSmsTab) }}>
                                <i className="far fa-download"></i>
                                <div className="bg-dark-blue"></div>
                            </Link>
                        </CheckPermissionButton>
                    </div>
                </Col>
                <Col xs={3} className="text-right">
                    <EntriesPerPage perPage={perPage} handleChangePerPage={handleChangePerPage} />
                </Col>
            </Row>
            <div className="group-styling">
                <div className="group-aligment-heading">
                    <FormGroup className="my-0">
                        <RadioGroup
                            row
                            name="unsubscribedEmailSmsTab"
                            value={unsubscribedEmailSmsTab}
                            onChange={(e) => { setUnsubscribedEmailSmsTab(e.target.value) }}
                        >
                            <FormControlLabel value="unsubscribedEmail" control={<Radio sx={useStyles.root} className="mr-2" />} label="Unsubscribed Email" className="ml-0 mr-2 my-0" />
                            <FormControlLabel value="unsubscribedSms" control={<Radio sx={useStyles.root} className="mr-2" />} label="Unsubscribed SMS" className="ml-0 mr-2 my-0" />
                        </RadioGroup>
                    </FormGroup>
                </div>
                <div>
                    <TextField
                        placeholder="Search"
                        variant="standard"
                        name="search"
                        type="text"
                        value={search}
                        onChange={handleChangeSearch}
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                handleClickSearch();
                            }
                        }}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton sx={useStyles.root} onClick={handleClickSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>,
                            sx: useStyles.textRoot
                        }}
                    />
                </div>
            </div>
            <div className="table-content-wrapper">
                <div className="contact-table-div">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">
                                    <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                </th>
                                <th key={0} onClick={() => { handleClickSort("firstName", 0) }}>First Name
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} onClick={() => { handleClickSort("lastName", 1) }}>Last Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={2} onClick={() => { handleClickSort("email", 2) }}>Email
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={3} onClick={() => { handleClickSort("phoneNumber", 3) }}>Mobile Number
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th>Group</th>
                                <th key={4} onClick={() => { handleClickSort("optDate", 4) }}>Date
                                    <span>
                                        {typeof sortBox[4] !== "undefined"
                                            ? (sortBox[4] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                {unsubscribedEmailSmsTab === "unsubscribedEmail" && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                unsubscribedContactList.length > 0 ?
                                    unsubscribedContactList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="center">
                                                    <Input className="clientCheck" type="checkbox" checked={tableCheckBoxValueGroupIdList.includes(item.emailId)} onChange={() => tableCheckBox(item.emailId)} />
                                                </td>
                                                <td>{item.firstName}</td>
                                                <td>{item.lastName}</td>
                                                <td>{item.email}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.groupName}</td>
                                                <td>{item.optDate}</td>
                                                {unsubscribedEmailSmsTab === "unsubscribedEmail" && <td>
                                                    {
                                                        (typeof item.email !== "undefined" && item.email !== "" && item.email !== null) ?
                                                            <i className="far fa-link mr-3" data-toggle="tooltip" title="Send Subscribe Link" onClick={() => { handleClickSendSubscribeLink(item.groupId, item.emailId) }}></i>
                                                            :
                                                            <i className="far fa-link mr-3" data-toggle="tooltip" title="Send Subscribe Link" onClick={() => {
                                                                globalAlert({
                                                                    type: "Error",
                                                                    text: "This unsubscribed contact has no email address.",
                                                                    open: true
                                                                });
                                                            }}></i>
                                                    }
                                                </td>}
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={unsubscribedEmailSmsTab === "unsubscribedEmail" ? 8 : 7} className="text-center">No Members Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${unsubscribedContactList.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + unsubscribedContactList.length - 1} of ${totalContactsByGroup} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </div>
        </>
    )
}

export const Tab2 = ({
    perPage,
    selectedPage,
    tableCheckBoxValueGroupIdList,
    sortBox,
    mainTablecheckBoxValue,
    mainTableCheckBox,
    deleteContact = () => { },
    handleClickSort = () => { },
    handleChangeSearch = () => { },
    handleChangePerPage = () => { },
    totalContactsByGroup,
    handleClickSearch = () => { },
    tableCheckBox = () => { },
    totalPages,
    handleChangePagination = () => { },
    search,
    confirmDialog = () => { },
    globalAlert = () => { },
    clickedToEditContactNotGroup = () => { },
    handleClickExportNotGroup = () => { },
    badEmailSmsTab,
    badEmailAndSMSContactList,
    setBadEmailSmsTab = () => { }
}) => {
    return (
        <>
            <Row>
                <Col xs={9}>
                    <div className="icon-wrapper">
                        <CheckPermissionButton module="member" action="delete">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete"
                                onClick={() => {
                                    if (tableCheckBoxValueGroupIdList.length > 0) {
                                        confirmDialog({
                                            open: true,
                                            title: 'Are you sure you want to delete selected members?',
                                            onConfirm: () => { deleteContact() }
                                        })
                                    } else {
                                        globalAlert({
                                            type: "Error",
                                            text: "You must check one of the checkboxes.",
                                            open: true
                                        });
                                    }
                                }}
                            >
                                <i className="far fa-trash-alt"></i>
                                <div className="bg-red"></div>
                            </Link>
                        </CheckPermissionButton>
                        <CheckPermissionButton module="member" action="export">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export" onClick={() => { handleClickExportNotGroup(badEmailSmsTab) }}>
                                <i className="far fa-download"></i>
                                <div className="bg-dark-blue"></div>
                            </Link>
                        </CheckPermissionButton>
                    </div>
                </Col>
                <Col xs={3} className="text-right">
                    <EntriesPerPage perPage={perPage} handleChangePerPage={handleChangePerPage} />
                </Col>
            </Row>
            <div className="group-styling">
                <div className="group-aligment-heading">
                    <FormGroup className="my-0">
                        <RadioGroup
                            row
                            name="BadEmailSmsTab"
                            value={badEmailSmsTab}
                            onChange={(e) => { setBadEmailSmsTab(e.target.value) }}
                        >
                            <FormControlLabel value="badEmail" control={<Radio sx={useStyles.root} className="mr-2" />} label="Bad Email" className="ml-0 mr-2 my-0" />
                            <FormControlLabel value="badSms" control={<Radio sx={useStyles.root} className="mr-2" />} label="Bad SMS" className="ml-0 mr-2 my-0" />
                        </RadioGroup>
                    </FormGroup>
                </div>
                <div>
                    <TextField
                        placeholder="Search"
                        variant="standard"
                        name="search"
                        type="text"
                        value={search}
                        onChange={handleChangeSearch}
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                handleClickSearch();
                            }
                        }}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton sx={useStyles.root} onClick={handleClickSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>,
                            sx: useStyles.textRoot
                        }}
                    />
                </div>
            </div>
            <div className="table-content-wrapper">
                <div className="contact-table-div">
                    <Table striped>
                        <thead className="table-heading">
                            <tr>
                                <th className="text-center">
                                    <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()} />
                                </th>
                                <th key={0} onClick={() => { handleClickSort("firstName", 0) }}>First Name
                                    <span>
                                        {typeof sortBox[0] !== "undefined"
                                            ? (sortBox[0] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={1} onClick={() => { handleClickSort("lastName", 1) }}>Last Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={2} onClick={() => { handleClickSort("email", 2) }}>Email
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th key={3} onClick={() => { handleClickSort("phoneNumber", 3) }}>Mobile Number
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th>Group</th>
                                {
                                    badEmailSmsTab === "badEmail" && <>
                                        <th>Bounce Reason</th>
                                        <th>Send Email To Verification</th>
                                    </>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                badEmailAndSMSContactList.length > 0 ?
                                    badEmailAndSMSContactList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td align="center">
                                                    <Input className="clientCheck" type="checkbox" checked={tableCheckBoxValueGroupIdList.includes(item.emailId)} onChange={() => tableCheckBox(item.emailId)} />
                                                </td>
                                                <td onClick={() => { clickedToEditContactNotGroup(item.emailId, item.groupId, item.groupName) }}>{item.firstName}</td>
                                                <td onClick={() => { clickedToEditContactNotGroup(item.emailId, item.groupId, item.groupName) }}>{item.lastName}</td>
                                                <td onClick={() => { clickedToEditContactNotGroup(item.emailId, item.groupId, item.groupName) }}>{item.email}</td>
                                                <td onClick={() => { clickedToEditContactNotGroup(item.emailId, item.groupId, item.groupName) }}>{item.phoneNumber}</td>
                                                <td>{item.groupName}</td>
                                                {
                                                    badEmailSmsTab === "badEmail" && <td>{item.bounceReason}</td>
                                                }
                                                {
                                                    badEmailSmsTab === "badEmail" && <td>{item.sendToEmailVerification}</td>
                                                }
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={badEmailSmsTab === "badEmail" ? 8 : 6} className="text-center">No Members Found.</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${badEmailAndSMSContactList.length > 0 ? (perPage * selectedPage) + 1 : 0} to ${((perPage * selectedPage) + 1) + badEmailAndSMSContactList.length - 1} of ${totalContactsByGroup} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage + 1} showFirstButton showLastButton onChange={handleChangePagination} /></Col>
                </Row>
            </div>
        </>
    )
}