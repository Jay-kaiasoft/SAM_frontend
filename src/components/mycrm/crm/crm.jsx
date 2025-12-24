import React, { useMemo, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  Button,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Link,
  Avatar,
  Autocomplete,
  Menu,
} from "@mui/material";
import { Col, Row } from "reactstrap";
import "./crm.css";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import AddTask from "./addTask";
import AddTags from "./addTags";
import AddNote from "./addNote";
import AddGroup from "./addGroup";
import SendMailModel from "./sendMailModel";

const searchTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Company" },
  { id: 4, name: "Group" },
];

const filter = [
  {
    key: 1,
    value: "Company",
  },
];

const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
  { id: 3, name: "Group 3" },
  {
    id: 4,
    name: "Group 4",
    segment: [
      { id: 1, name: "Segment 1" },
      { id: 2, name: "Segment 2" },
    ],
  },
  { id: 5, name: "Group 5" },
  { id: 6, name: "Group 6" },
  {
    id: 7,
    name: "Group 7",
    segment: [
      { id: 1, name: "Segment 1" },
      { id: 2, name: "Segment 2" },
      { id: 3, name: "Segment 3" },
      { id: 4, name: "Segment 4" },
    ],
  },
  { id: 8, name: "Group 8" },
  {
    id: 9,
    name: "Group 9",
    segment: [
      { id: 1, name: "Segment 1" },
      { id: 2, name: "Segment 2" },
    ],
  },
  {
    id: 10,
    name: "Group 10",
    segment: [
      { id: 1, name: "Segment 1" },
      { id: 2, name: "Segment 2" },
    ],
  },
];

const contacts = [
  {
    id: 1,
    name: "Brent Raph",
    email: "brent_raph@sample.com",
    phone: "727-702-9986",
    company: "Melt Inc",
    avatarType: "initials",
    initials: "BR",
  },
  {
    id: 2,
    name: "Bogisich Marcos",
    email: "",
    phone: "7045088762",
    company: "Gottlieb Group",
    avatarType: "initials",
    initials: "BM",
  },
  {
    id: 3,
    name: "Christian Sen",
    email: "Christian_sen@hotmail.com",
    phone: "8287071112",
    company: "Melt Inc",
    avatarType: "initials",
    initials: "CS",
  },
  {
    id: 4,
    name: "Hankeen Gerhard",
    email: "hankeen_gerhard@sample.com",
    phone: "8430921690",
    company: "Moen and Sons",
    avatarType: "initials",
    initials: "HG",
  },
];

// options for the header Autocompletes
const contactRoles = [
  { key: "1", label: "Decision Maker" },
  { key: "2", label: "Influencer" },
  { key: "3", label: "End User" },
];

const contactStatuses = [
  { key: "1", label: "Lead" },
  { key: "2", label: "Customer" },
  { key: "3", label: "Prospect" },
];

const interestedInOptions = [
  { key: "1", label: "Product 1" },
  { key: "2", label: "Product 2" },
  { key: "3", label: "Service 1" },
  { key: "4", label: "Service 2" },
];

const contactTabs = [
  { key: "contact", label: "Contact Info" },
  { key: "communication", label: "Communication" },
  { key: "status", label: "Status" },
  { key: "social", label: "Social" },
];

const Crm = () => {
  const [searchType, setSearchType] = useState(searchTypes[0].id);
  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openAddTaks, setOpenAddTaks] = useState(false)
  const [openAddTags, setOpenAddTags] = useState(false)
  const [openAddNotes, setOpenAddNotes] = useState(false)
  const [openAddGroup, setOpenAddGroup] = useState(false)

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const [isContactSectionOpen, setIsContactSectionOpen] = useState(false);

  // ✅ contacts in state + pin support
  const [contactList, setContactList] = useState(
    contacts.map((c) => ({ ...c, isPinned: c.isPinned ?? false }))
  );

  const [selectedContactId, setSelectedContactId] = useState(
    contactList[0]?.id || null
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("contact-info");
  const [activeContactTab, setActiveContactTab] = useState("contact");

  // 0 = Contacts, 1 = Groups, 2 = Pinned
  const [headerActiveTab, setHeaderActiveTab] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedFilter, setSelectedFilter] = useState(1);

  // header states
  const [contactRole, setContactRole] = useState(contactRoles[0]);
  const [contactStatus, setContactStatus] = useState(contactStatuses[0]);
  const [interestedIn, setInterestedIn] = useState([
    interestedInOptions[0],
    interestedInOptions[3],
  ]);

  // NEW: right-side Task panel open/close
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isReminderPannelOpen, setIsReminderPannelOpen] = useState(false);
  const [isNotePannelOpen, setIsNotePannelOpen] = useState(false);
  const [tabMenuAnchor, setTabMenuAnchor] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [openMailModel, setOpenMailModel] = useState(false);

  const openTabMenu = (event, tabKey) => {
    event.stopPropagation(); // prevent tab switch
    setTabMenuAnchor(event.currentTarget);
    setActiveTabKey(tabKey);
  };

  const closeTabMenu = () => {
    setTabMenuAnchor(null);
    setActiveTabKey(null);
  };


  const handleChangeFilter = (event, value) => {
    setSelectedFilter(value);
  };

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => {
      const isCurrentlyOpen = !!prev[groupId];

      if (isCurrentlyOpen) {
        return {};
      }

      return { [groupId]: true };
    });
  };

  const togglePinContact = (contactId) => {
    setContactList((prev) =>
      prev.map((c) =>
        c.id === contactId ? { ...c, isPinned: !c.isPinned } : c
      )
    );
  };

  const filteredContacts = useMemo(() => {
    const baseFiltered = contactList.filter((c) =>
      (c.name || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const list = headerActiveTab === 2
      ? baseFiltered.filter((c) => c.isPinned)
      : baseFiltered;

    // pinned on top
    return list
    // .slice()
    // .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [contactList, searchText, headerActiveTab]);

  const activeContact =
    filteredContacts.find((c) => c.id === selectedContactId) ||
    filteredContacts[0];

  // keep selection valid (e.g., when switching to Pinned tab)
  React.useEffect(() => {
    if (!selectedContactId) return;
    const stillExists = filteredContacts.some((c) => c.id === selectedContactId);
    if (!stillExists) {
      setSelectedContactId(filteredContacts[0]?.id || null);
    }
  }, [filteredContacts, selectedContactId]);

  const closeAllPanels = () => {
    setIsTaskPanelOpen(false);
    setIsTagOpen(false);
    setIsReminderPannelOpen(false);
    setIsNotePannelOpen(false);
  };

  const handleOpenPanel = (panel) => {
    // close any previously open panel
    closeAllPanels();

    // open the requested one
    switch (panel) {
      case "task":
        setIsTaskPanelOpen(true);
        break;
      case "tag":
        setIsTagOpen(true);
        break;
      case "reminder":
        setIsReminderPannelOpen(true);
        break;
      case "note":
        setIsNotePannelOpen(true);
        break;
      default:
        break;
    }
  };

  const renderGroups = () => (
    <div className="h-100 d-flex flex-column">
      {isGroupsOpen ? (
        <div className="crm-sidebar-collapsed-inner">
          <div className="border-bottom w-100 text-center py-3">
            <IconButton
              id="firstBox"
              size="small"
              onClick={() => setIsGroupsOpen(false)}
            >
              <i className="fas fa-bars crm-collapsed-icon" />
            </IconButton>
          </div>
          <div>
            <span className="crm-vertical-text">Groups</span>
          </div>
        </div>
      ) : (
        <>
          <div className="crm-contact-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center" style={{ gap: 15 }}>
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
                  <MenuItem onClick={() => { setAnchorEl(null); setOpenAddGroup(true) }}>
                    <i className="far fa-users mr-2" />
                    Group
                  </MenuItem>
                  <MenuItem onClick={() => { setAnchorEl(null); setOpenAddTags(true) }}>
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
                  onClick={() => setIsGroupsOpen(true)}
                  style={{ zIndex: 1 }}
                >
                  <i className="fas fa-chevron-left" />
                  <div className="bg-blue"></div>
                </span>
              </div>
            </div>
          </div>

          <div className="group-styling">
            <div className="group-aligment-heading">
              <Checkbox
                size="small"
                sx={{
                  "&.Mui-checked": {
                    color: "#ffffff !important",
                  },
                  color: "#ffffff !important",
                }}
              />
              <span>Select</span>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="custom-accordion">
              <div
                className="custom-accordion-summary"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              >
                <span>Group</span>
                <i
                  className={`fas fa-chevron-down transition-transform ${isAccordionOpen ? "rotate-180" : ""
                    }`}
                  style={{ transition: "transform 0.3s ease", fontSize: "12px" }}
                />
              </div>

              <div
                className="custom-accordion-details"
                style={{
                  maxHeight: isAccordionOpen ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                  opacity: isAccordionOpen ? 1 : 0,
                }}
              >
                <div className="group-name-list">
                  {groups.map((g) => {
                    const hasSegments =
                      Array.isArray(g.segment) && g.segment.length > 0;
                    const isExpanded = !!expandedGroups[g.id];

                    return (
                      <div key={g.id}>
                        <div
                          className="group-aligment d-flex align-items-center justify-content-between"
                          style={{
                            backgroundColor:
                              selectedGroupId === g.id ? "#f1f5ff" : "transparent",
                          }}
                          onClick={() => setSelectedGroupId(g.id)}
                        >
                          <div className="d-flex align-items-center">
                            <Checkbox
                              size="small"
                              checked={selectedGroupId === g.id}
                              onChange={() => setSelectedGroupId(g.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#0478DC !important",
                                },
                                color: "#6b7280 !important",
                              }}
                            />
                            <div className="group-name-div">{g.name}</div>
                          </div>

                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 8 }}
                          >
                            {hasSegments && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroupExpand(g.id);
                                }}
                                sx={{ padding: "4px" }}
                              >
                                <i
                                  className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                                    }`}
                                  style={{ fontSize: "12px" }}
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>

                        {hasSegments && isExpanded && (
                          <div className="segment-list">
                            {g.segment.map((seg) => (
                              <div
                                key={seg.id}
                                className="d-flex align-items-center justify-content-between segment-row"
                              >
                                <div className="d-flex align-items-center">
                                  <Checkbox
                                    size="small"
                                    sx={{
                                      "&.Mui-checked": {
                                        color: "#0478DC !important",
                                      },
                                      color: "#6b7280 !important",
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#374151",
                                    }}
                                  >
                                    {seg.name}
                                  </span>
                                </div>

                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: 8 }}
                                >
                                  <i
                                    className="far fa-copy"
                                    style={{
                                      fontSize: "14px",
                                      color: "#6b7280",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <i
                                    className="far fa-pencil-alt"
                                    style={{
                                      fontSize: "14px",
                                      color: "#6b7280",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <i
                                    className="far fa-trash-alt"
                                    style={{
                                      fontSize: "14px",
                                      color: "#6b7280",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-top px-3 py-2 small text-muted">
            Total Groups : {groups.length}
          </div>
        </>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="h-100 d-flex flex-column">
      {isContactSectionOpen ? (
        <div className="crm-sidebar-collapsed-inner">
          <div className="border-bottom w-100 text-center py-3">
            <IconButton
              id="secondBox"
              size="small"
              onClick={() => setIsContactSectionOpen(false)}
            >
              <i className="fas fa-bars crm-collapsed-icon" />
            </IconButton>
          </div>
          <div>
            <span className="crm-vertical-text">Contacts</span>
          </div>
        </div>
      ) : (
        <>
          <div className="crm-contact-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center" style={{ gap: 20 }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-user" />}
                  sx={{
                    textTransform: "none",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Add Contact
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
              </div>
              <div className="icon-wrapper">
                <span
                  className="btn-circle"
                  data-toggle="tooltip"
                  title="Collapse Grid"
                  onClick={() => setIsContactSectionOpen(true)}
                  style={{ zIndex: 1 }}
                >
                  <i className="fas fa-chevron-left" style={{ fontSize: "16px" }} />
                  <div className="bg-blue"></div>
                </span>
              </div>
            </div>
          </div>

          <div className="crm-contact-filter d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ gap: 8 }}>
              <Checkbox
                size="small"
                sx={{
                  "&.Mui-checked": {
                    color: "#0478DC !important",
                  },
                  color: "#6b7280 !important",
                }}
              />
              <DropDownControls
                id="filter"
                name="filter"
                onChange={handleChangeFilter}
                value={selectedFilter}
                dropdownList={filter}
              />
            </div>

            <Link
              component="button"
              className="btn-circle"
              title="Filter"
              sx={{ minWidth: "auto", padding: 0 }}
            >
              <i
                className="far fa-sort-alt"
                style={{ color: "#6b7280", fontSize: "16px" }}
              />
            </Link>
          </div>

          <div className="crm-contact-list">
            {filteredContacts?.map((c) => {
              const initials = c.name
                .split(" ")
                .map((n) => n[0])
                .join("");
              const isActive = c.id === activeContact?.id;

              return (
                <div
                  key={c.id}
                  className={`contact-row ${isActive ? "contact-row--active" : ""
                    }`}
                  onClick={() => setSelectedContactId(c.id)}
                >
                  <div className="d-flex align-items-start justify-content-between" style={{ gap: 0 }}>
                    <div>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          mr: 2,
                          bgcolor: isActive ? "#0478DC" : "#6b7280",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {initials}
                      </Avatar>
                    </div>

                    <div className="flex-grow-1">
                      <div className="contact-main-text">{c.name}</div>

                      {c.email && (
                        <div className="contact-info-row">
                          <i className="far fa-envelope" />
                          <span className="contact-sub-text">{c.email}</span>
                        </div>
                      )}

                      {c.phone && (
                        <div className="contact-info-row">
                          <i className="far fa-phone" />
                          <span className="contact-sub-text">{c.phone}</span>
                        </div>
                      )}

                      {c.company && (
                        <div className="contact-info-row">
                          <i className="far fa-building" />
                          <span className="contact-sub-text">{c.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  const renderMainContent = () => {
    const headerName = activeContact?.name || "-";
    const headerInitials =
      activeContact?.initials ||
      (activeContact?.name || "")
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const headerCompany = activeContact?.company || "-";

    return (
      <div className="crm-main" style={{ position: "relative" }}>
        {/* HEADER */}
        <div className="px-4 py-3 d-flex justify-content-start align-items-start" style={{ gap: 30 }}>
          {/* LEFT SIDE */}
          <div className="d-flex align-items-center justify-content-center" style={{ width: "25%" }}>
            <div>
              <div className="d-flex justify-content-center items-center mb-2">
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "#0A74DA",
                    mr: 2,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {headerInitials || "-"}
                </Avatar>
              </div>

              <h5 className="fw-bold text-center">
                {headerName}
                <span className="text-center ml-2">
                  <IconButton
                    size="small"
                    onClick={() => activeContact?.id && togglePinContact(activeContact.id)}
                    title={activeContact?.isPinned ? "Unpin" : "Pin"}
                  >
                    <i
                      className="far fa-thumbtack"
                      style={{
                        color: activeContact?.isPinned ? "#0478DC" : "#9ca3af",
                        // fontSize: 18,
                        transform: activeContact?.isPinned
                          ? "rotate(0deg)"
                          : "rotate(40deg)",
                        transition: "transform 0.25s ease, color 0.25s ease",
                      }}
                    />

                  </IconButton>
                </span>
              </h5>

              <div className="d-flex align-items-center my-2 text-center justify-content-center">
                <i className="far fa-building"></i>
                <span className="text-muted ml-2">{headerCompany}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE HEADER FORM */}
          <div className="w-100">
            <div className="mb-3 d-flex align-items-center justify-content-start" style={{ gap: 20 }}>
              <div className="d-flex align-items-center w-100">
                <span className="fw-bold">Role:</span>
                <div className="ml-4 w-100">
                  <Autocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    options={contactRoles}
                    value={contactRole}
                    onChange={(_, v) => setContactRole(v)}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" />
                    )}
                    renderOption={(props, option) => <li {...props}>{option.label}</li>}
                    getOptionLabel={(o) => o.label}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center w-100">
                <span className="fw-bold">Status:</span>
                <div className="ml-4 w-100">
                  <Autocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    options={contactStatuses}
                    value={contactStatus}
                    onChange={(_, v) => setContactStatus(v)}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" />
                    )}
                    getOptionLabel={(o) => o.label}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center w-100" style={{ marginBottom: "13px" }}>
              <span className="fw-bold">Interest:</span>
              <div className="ml-4 w-100">
                <Autocomplete
                  fullWidth
                  multiple
                  size="small"
                  disablePortal
                  options={interestedInOptions}
                  value={interestedIn}
                  onChange={(_, v) => setInterestedIn(v)}
                  renderTags={(selected) =>
                    selected.map((op, i) => (
                      <span
                        key={i}
                        style={{
                          color: "#0A74DA",
                          fontSize: 13,
                          fontWeight: 600,
                          marginRight: 4,
                        }}
                      >
                        {op.label}
                        {i < selected.length - 1 ? "," : ""}
                      </span>
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                  getOptionLabel={(o) => o.label}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: 10 }}>
              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Send Mail"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                onClick={() => setOpenMailModel(true)}
              >
                <i className="far fa-envelope" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Call"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-phone-alt" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="SMS"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="fal fa-sms" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Calender"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-calendar-alt" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Add Task"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                onClick={() => handleOpenPanel("task")}
              >
                <i className="fas fa-list-ul" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Tags"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                onClick={() => handleOpenPanel("tag")}
              >
                <i className="far fa-tag" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Reminder"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                onClick={() => handleOpenPanel("reminder")}
              >
                <i className="far fa-clock" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Notes"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                onClick={() => handleOpenPanel("note")}
              >
                <i className="far fa-edit" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Invoice"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-file-alt" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Sign Document"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-file" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Book & Schedule"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-calendar-alt" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Trake Inquiries"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-archive" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>

              <span
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Manage Project"
                style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
              >
                <i className="far fa-briefcase" style={{ fontSize: '16px' }}></i>
                <div className="bg-blue"></div>
              </span>
            </div>
          </div>
        </div>

        {/* CONTACT INFO + RIGHT ICONS + TASK PANEL */}
        <Row>
          {/* MAIN CONTENT */}
          <Col xs={12}>
            <div className="contact-tabs-container">
              <div className="contact-tabs">
                <div className="crm-contact-tabs">
                  {contactTabs.map((tab) => (
                    <div
                      key={tab.key}
                      className={`crm-contact-tab ${activeContactTab === tab.key ? "active" : ""
                        }`}
                      onClick={() => setActiveContactTab(tab.key)}
                    >
                      <span>{tab.label}</span>

                      {/* Settings icon per tab */}
                      <IconButton
                        size="small"
                        className="tab-setting-btn"
                        onClick={(e) => openTabMenu(e, tab.key)}
                      >
                        <i className="far fa-cog" />
                      </IconButton>
                    </div>
                  ))}
                </div>

                <Menu
                  anchorEl={tabMenuAnchor}
                  open={Boolean(tabMenuAnchor)}
                  onClose={closeTabMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      console.log("Edit clicked for tab:", activeTabKey);
                      closeTabMenu();
                    }}
                  >
                    <i className="far fa-pencil-alt mr-2" />
                    Edit
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      console.log("Add Fields clicked for tab:", activeTabKey);
                      closeTabMenu();
                    }}
                  >
                    <i className="far fa-plus mr-2" />
                    Add Fields
                  </MenuItem>
                </Menu>


              </div>

              <div>
                <span
                  component="a"
                  className="btn-circle "
                  data-toggle="tooltip"
                  title="Add Tab"
                  style={{ zIndex: 1, border: "1px solid #808080", borderRadius: "50%" }}
                >
                  <i className="far fa-plus" style={{ fontSize: '16px' }}></i>
                  <div className="bg-blue"></div>
                </span>
              </div>
            </div>

            <div className="mt-3 px-4">

              <div className="border-bottom">
                <h5 className="text-blue mb-3">Personal Information</h5>
                <Row>
                  <Col sm={12} md={6} style={{ gap: 20 }}>
                    <div className="info-item">
                      <span className="info-label">First name:</span>
                      <span className="info-value">Becht</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Full name:</span>
                      <span className="info-value">Becht Raph</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-value">
                        727-702-9986 (Work) <br />
                        727-702-9986 (Personal)
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date of birth:</span>
                      <span className="info-value">12/23/2001</span>
                    </div>
                  </Col>
                  <Col sm={12} md={6}>
                    <div className="info-item">
                      <span className="info-label">Last name:</span>
                      <span className="info-value">Raph</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender:</span>
                      <span className="info-value">Male</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <p
                        className="info-value"
                        style={{ color: "#0A74DA !important" }}
                      >
                        becht_raph@sample.com (Work) <br />
                        becht_raph@sample.com (Personal)
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="border-bottom">
                <h5 className="text-blue my-3">Demographic Information</h5>
                <Row>
                  <Col sm={12} md={6} style={{ gap: 20 }}>
                    <div className="info-item">
                      <span className="info-label">Country:</span>
                      <span className="info-value">United States</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Street Address 1:</span>
                      <span className="info-value">28067 Haag Skyway</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">City:</span>
                      <span className="info-value">Auburn</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Language:</span>
                      <p className="info-value">English</p>
                    </div>
                  </Col>
                  <Col sm={12} md={6}>
                    <div className="info-item">
                      <span className="info-label">State/Prov/Region:</span>
                      <span className="info-value">Alabama</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Street Address 2:</span>
                      <span className="info-value">28067 Haag Skyway</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Zip / Post Code:</span>
                      <span className="info-value">12509</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Time Zone</span>
                      <span className="info-value">-05.00 CDT</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* CORPORATE INFORMATION */}
              <div className="border-bottom">
                <h5 className="text-blue my-3">Corporate Information</h5>

                <Row>
                  <Col sm={12} md={6} style={{ gap: 20 }}>
                    <div className="info-item">
                      <span className="info-label">Company :</span>
                      <span className="info-value">Metz Inc</span>
                    </div>
                  </Col>

                  <Col sm={12} md={6} style={{ gap: 20 }}>
                    <span className="info-label ml-2">Group(s) :</span>
                    <div className="info-item d-flex align-items-center flex-wrap">
                      <div className="info-value d-flex flex-wrap">
                        <span className="badge rounded-pill bg-primary text-white ml-2 mb-2 p-2">
                          Sales <span className="mr-1">&times;</span>
                        </span>
                        <span className="badge rounded-pill bg-primary text-white ml-2 mb-2 p-2">
                          Marketing <span className="mr-1">&times;</span>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Edit button */}
                <div className="text-center my-3">
                  <Button
                    variant="contained"
                    color="primary"
                  // size="small"
                  >
                    Edit Information
                  </Button>
                </div>
              </div>

            </div>
          </Col>
        </Row>

        {/* TASK PANEL - BETWEEN MAIN CONTENT AND ICON STRIP */}
        {isTaskPanelOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0, // keep space for icon strip on desktop
              width: isDesktop ? "28%" : "100%",
              minWidth: 260,
              backgroundColor: "#ffffff",
              border: "1px solid #E1E1E1",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              zIndex: 5,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #E1E1E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-list-ul" style={{ fontSize: 16 }} />
                <span style={{ fontSize: 16, paddingRight: 5 }}>Task</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Add Task"
                    onClick={() => setOpenAddTaks(true)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-plus" style={{ fontSize: "16px" }} />
                    <div className="bg-green"></div>
                  </span>
                </div>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Close"
                    onClick={() => setIsTaskPanelOpen(false)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-times" style={{ fontSize: "16px" }} />
                    <div className="bg-red"></div>
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              No Task found
            </div>
          </div>
        )}

        {/* TAG PANEL - BETWEEN MAIN CONTENT AND ICON STRIP */}
        {isTagOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0, // keep space for icon strip on desktop
              width: isDesktop ? "28%" : "100%",
              minWidth: 260,
              backgroundColor: "#ffffff",
              border: "1px solid #E1E1E1",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              zIndex: 5,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #E1E1E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <i className="far fa-tag" style={{ fontSize: 16 }} ></i>
                <span style={{ fontSize: 16, paddingRight: 5 }}>Tags</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Add Tags"
                    onClick={() => setOpenAddTags(true)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-plus" style={{ fontSize: "16px" }} />
                    <div className="bg-green"></div>
                  </span>
                </div>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Close"
                    onClick={() => setIsTagOpen(false)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-times" style={{ fontSize: "16px" }} />
                    <div className="bg-red"></div>
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              No tags found
            </div>
          </div>
        )}

        {/* REMINDER PANEL - BETWEEN MAIN CONTENT AND ICON STRIP */}
        {isReminderPannelOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0, // keep space for icon strip on desktop
              width: isDesktop ? "28%" : "100%",
              minWidth: 260,
              backgroundColor: "#ffffff",
              border: "1px solid #E1E1E1",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              zIndex: 5,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #E1E1E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <i className="far fa-clock" style={{ fontSize: 16 }}></i>
                <span style={{ fontSize: 16, paddingRight: 5 }}>Reminder</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Close"
                    onClick={() => setIsReminderPannelOpen(false)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-times" style={{ fontSize: "16px" }} />
                    <div className="bg-red"></div>
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              No reminder found
            </div>
          </div>
        )}

        {/* REMINDER PANEL - BETWEEN MAIN CONTENT AND ICON STRIP */}
        {isNotePannelOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0, // keep space for icon strip on desktop
              width: isDesktop ? "28%" : "100%",
              minWidth: 260,
              backgroundColor: "#ffffff",
              border: "1px solid #E1E1E1",
              boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              zIndex: 5,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #E1E1E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <i className="far fa-edit" style={{ fontSize: 16 }}></i>
                <span style={{ fontSize: 16, paddingRight: 5 }}>Notes</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Add Note"
                    onClick={() => setOpenAddNotes(true)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-plus" style={{ fontSize: "16px" }} />
                    <div className="bg-green"></div>
                  </span>
                </div>
                <div className="icon-wrapper">
                  <span
                    className="btn-circle"
                    data-toggle="tooltip"
                    title="Close"
                    onClick={() => setIsNotePannelOpen(false)}
                    style={{ zIndex: 1 }}
                  >
                    <i className="far fa-times" style={{ fontSize: "16px" }} />
                    <div className="bg-red"></div>
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              No notes found
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
                CRM
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
                      placeholder="Search Contact, Company or Group"
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
              <div className="contact-tabs mb-2">
                <div style={{ flex: 1, display: 'flex' }}>
                  {["Contacts", "Groups", "Pinned"].map(
                    (tab, index) => (
                      <div
                        key={tab}
                        className={`contact-tab ${headerActiveTab === index
                          ? "active"
                          : ""
                          }`}
                        onClick={() =>
                          setHeaderActiveTab(index)
                        }
                      >
                        {tab}
                      </div>
                    )
                  )}
                </div>
                <div className="utility-btn">
                  <i className="far fa-question-circle"></i>
                  <span>Help</span>
                </div>
              </div>
              <div className="container-fluid d-flex p-0 crm-layout">
                {
                  headerActiveTab === 1 && (
                    <>
                      <div
                        className={`crm-sidebar ${isGroupsOpen
                          ? "crm-sidebar--collapsed"
                          : "crm-sidebar--expanded"
                          }`}
                      >
                        {renderGroups()}
                      </div>

                      <div
                        className={`crm-sidebar ${isContactSectionOpen
                          ? "crm-sidebar--collapsed"
                          : "crm-sidebar--expanded"
                          }`}
                      >
                        {renderContacts()}
                      </div>
                    </>
                  )
                }
                {
                  headerActiveTab === 0 && (
                    <div
                      className={`crm-sidebar ${isContactSectionOpen
                        ? "crm-sidebar--collapsed"
                        : "crm-sidebar--expanded"
                        }`}
                    >
                      {renderContacts()}
                    </div>
                  )
                }
                {
                  headerActiveTab === 2 && (
                    <div
                      className={`crm-sidebar ${isContactSectionOpen
                        ? "crm-sidebar--collapsed"
                        : "crm-sidebar--expanded"
                        }`}
                    >
                      {renderContacts()}
                    </div>
                  )
                }
                {/* Main Content */}
                {renderMainContent()}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <SendMailModel open={openMailModel} onClose={() => setOpenMailModel(false)} />
      <AddGroup open={openAddGroup} onClose={() => setOpenAddGroup(false)} />
      <AddTask open={openAddTaks} onClose={() => setOpenAddTaks(false)} />
      <AddTags open={openAddTags} onClose={() => setOpenAddTags(false)} />
      <AddNote open={openAddNotes} onClose={() => setOpenAddNotes(false)} />
    </>
  );
};

export default Crm;
