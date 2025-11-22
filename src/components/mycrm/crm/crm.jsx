import React, { useState } from "react";
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
} from "@mui/material";
import { Col, Input, Row } from "reactstrap";
import "./crm.css";
import DropDownControls from "../../shared/commonControlls/dropdownControl";

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

const Crm = () => {
  const [searchType, setSearchType] = useState(searchTypes[0].id);
  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const [isContactSectionOpen, setIsContactSectionOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(
    contacts[0]?.id || null
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("contact-info");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedFilter, setSelectedFilter] = useState(1);

  // header states
  const [contactRole, setContactRole] = useState(contactRoles[0]);
  const [contactStatus, setContactStatus] = useState(contactStatuses[0]);
  const [interestedIn, setInterestedIn] = useState([
    interestedInOptions[0],
    interestedInOptions[3],
  ]);

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

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const activeContact =
    filteredContacts.find((c) => c.id === selectedContactId) ||
    filteredContacts[0];

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
              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-plus-square" />}
                  sx={{ textTransform: "none", color: "#000", fontSize: '14px', fontWeight: 500 }}
                >
                  Add
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-pencil-alt" />}
                  sx={{ textTransform: "none", color: "#000", fontSize: '14px', fontWeight: 500 }}
                >
                  Edit
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-trash-alt" />}
                  sx={{ textTransform: "none", color: "#000", fontSize: '14px', fontWeight: 500 }}
                >
                  Delete
                </Button>
              </div>
              <IconButton
                id="firstBox"
                size="small"
                onClick={() => setIsGroupsOpen(true)}
                sx={{ padding: '4px' }}
              >
                <i className="fas fa-chevron-left" style={{ fontSize: '16px' }} />
              </IconButton>
            </div>
          </div>

          <div className="group-styling">
            <div className="group-aligment-heading">
              <Checkbox
                size="small"
                sx={{
                  "&.Mui-checked": {
                    color: "#0478DC !important",
                  },
                  color: "#6b7280 !important",
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
                  style={{ transition: "transform 0.3s ease", fontSize: '12px' }}
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

                          <div className="d-flex align-items-center" style={{ gap: 8 }}>
                            {hasSegments && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroupExpand(g.id);
                                }}
                                sx={{ padding: '4px' }}
                              >
                                <i
                                  className={`fas ${isExpanded
                                    ? "fa-chevron-up"
                                    : "fa-chevron-down"
                                    }`}
                                  style={{ fontSize: '12px' }}
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
                                  <span style={{ fontSize: '14px', color: '#374151' }}>{seg.name}</span>
                                </div>

                                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                                  <i className="far fa-copy" style={{ fontSize: '14px', color: '#6b7280', cursor: 'pointer' }} />
                                  <i className="far fa-pencil-alt" style={{ fontSize: '14px', color: '#6b7280', cursor: 'pointer' }} />
                                  <i className="far fa-trash-alt" style={{ fontSize: '14px', color: '#6b7280', cursor: 'pointer' }} />
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
              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-user" />}
                  sx={{ textTransform: "none", color: "#000", fontSize: '14px', fontWeight: 500 }}
                >
                  Add Contact
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<i className="far fa-trash-alt" />}
                  sx={{ textTransform: "none", color: "#000", fontSize: '14px', fontWeight: 500 }}
                >
                  Delete
                </Button>
              </div>
              <IconButton
                id="secondBox"
                size="small"
                onClick={() => setIsContactSectionOpen(true)}
                sx={{ padding: '4px' }}
              >
                <i className="fas fa-chevron-left" style={{ fontSize: '16px' }} />
              </IconButton>
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
              sx={{ minWidth: 'auto', padding: 0 }}
            >
              <i className="far fa-sort-alt" style={{ color: '#6b7280', fontSize: '16px' }} />
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
                  className={`contact-row ${isActive ? "contact-row--active" : ""}`}
                  onClick={() => setSelectedContactId(c.id)}
                >
                  <div className="d-flex align-items-center">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        bgcolor: isActive ? "#0478DC" : "#6b7280",
                        fontSize: 14,
                        fontWeight: "bold"
                      }}
                    >
                      {initials}
                    </Avatar>

                    <div className="flex-grow-1">
                      <div className="contact-main-text">
                        {c.name}
                      </div>

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

  const renderMainContent = () => (
    <div className="crm-main">
      {/* Header with full screen and help */}
      <div className="d-flex p-3 justify-content-between align-items-center border-bottom">
        <div></div>
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

      {/* Contact Header Section - UPDATED TO MATCH IMAGE 2 */}
      {/* ===================== HEADER (MATCHES IMAGE 2 EXACTLY) ===================== */}
      <div className="px-4 py-3 d-flex justify-content-between align-items-start">

        {/* ---------------- LEFT SIDE ---------------- */}
        <div className="d-flex align-items-start">
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: "#0A74DA",
              mr: 2,
              fontSize: 20,
              fontWeight: "bold"
            }}
          >
            BR
          </Avatar>

          <div>
            <h5 className="fw-bold mb-1" style={{ marginTop: 4 }}>Becht Raph</h5>

            <div className="d-flex align-items-center mb-2">
              <i className="far fa-building"></i>
              <span className="ms-2 text-muted">Metz Inc</span>
            </div>

            <div className="icon-wrapper w-100">
              <Link component="a" className="btn-circle" data-toggle="tooltip" title="Send Mail">
                <i className="far fa-envelope"></i>
                <div className="bg-blue"></div>
              </Link>
              <Link component="a" className="btn-circle" data-toggle="tooltip" title="Call">
                <i className="far fa-phone-alt"></i>
                <div className="bg-blue"></div>
              </Link>
              <Link component="a" className="btn-circle" data-toggle="tooltip" title="SMS" >
                <i className="fal fa-sms"></i>
                <div className="bg-blue"></div>
              </Link>
              <Link component="a" className="btn-circle" data-toggle="tooltip" title="Calender" >
                <i className="far fa-calendar-alt"></i>
                <div className="bg-blue"></div>
              </Link>
            </div>
            {/* <div className="d-flex align-items-center" style={{ gap: 15 }}>
            </div> */}
          </div>
        </div>

        {/* ---------------- RIGHT SIDE  ---------------- */}
        <div style={{ width: "55%" }}>
          <div className="d-flex align-items-center justify-content-between">

            {/* ---- Contact Role ---- */}
            <div className="mb-3 d-flex align-items-center">
              <span className="fw-bold mr-2">Contact Role :</span>
              <Autocomplete
                size="small"
                disablePortal
                options={contactRoles}
                value={contactRole}
                onChange={(_, v) => setContactRole(v)}
                sx={{ width: 170 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>{option.label}</li>
                )}
                getOptionLabel={(o) => o.label}
              />
            </div>

            {/* ---- Contact Status ---- */}
            <div className="mb-3 d-flex align-items-center">
              <span className="fw-bold mr-2">Contact Status :</span>
              <Autocomplete
                size="small"
                disablePortal
                options={contactStatuses}
                value={contactStatus}
                onChange={(_, v) => setContactStatus(v)}
                sx={{ width: 160 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                  />
                )}
                getOptionLabel={(o) => o.label}
              />
            </div>
          </div>

          <div>
            {/* ---- Contact Score ---- */}
            {/* <div className="col-6 d-flex align-items-center">
              <span className="text-muted me-1">Contact Score :</span>
              <span style={{ color: "green", fontWeight: 600, fontSize: 15 }}>
                30
              </span>
              <i className="far fa-chart-line ms-1 text-success" style={{ fontSize: 14 }}></i>
            </div> */}

            {/* ---- Interested In ---- */}
            <div className="d-flex align-items-center">
              <span className="fw-bold mr-2">Interested In :</span>
              <div className="w-100">
                <Autocomplete
                  multiple
                  fullWidth
                  size="small"
                  disablePortal
                  options={interestedInOptions}
                  value={interestedIn}
                  onChange={(_, v) => setInterestedIn(v)}
                  // sx={{ width: 220 }}
                  renderTags={(selected) =>
                    selected.map((op, i) => (
                      <span
                        key={i}
                        style={{
                          color: "#0A74DA",
                          fontSize: 13,
                          fontWeight: 600,
                          marginRight: 4
                        }}
                      >
                        {op.label}{i < selected.length - 1 ? "," : ""}
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
          </div>
        </div>
      </div>


      {/* Lead Stage Timeline */}
      {/* <div className="lead-stage-container">
        <div className="lead-stage-header">
          <div className="lead-stage-date">
            <span>Lead Stage Changed:</span> Mon, 03 June 2024, 05:30 PM
          </div>
          <div className="lead-stage-date">
            <span>Last Connected:</span> Tue, 04 June 2024, 03:32 PM
          </div>
        </div>

        <div className="lead-stage-wrapper">
          {[
            "New",
            "Connected",
            "Proposed",
            "Interested",
            "Negotiation",
            "Under Review",
            "Demo",
            "More"
          ].map((stage, index) => {
            const activeIndex = 3; // up to Interested is blue
            const isActive = index <= activeIndex;
            const isLast = index === 7;

            return (
              <div
                key={index}
                className={`stage-item ${isActive ? "active" : "inactive"} ${index === 0 ? "first-item" : ""} ${isLast ? "last-item" : ""}`}
              >
                <span className="stage-text">{stage}</span>
                {index < 7 && (
                  <div className={`stage-arrow ${isActive ? "arrow-active" : "arrow-inactive"}`} />
                )}
                {stage === "More" && (
                  <i className="far fa-chevron-down more-icon"></i>
                )}
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Tab Navigation */}
      <div className="contact-tabs-container">
        <div className="contact-tabs">
          {["Contact Info", "Communication", "Status", "Social"].map((tab) => (
            <div
              key={tab}
              className={`contact-tab ${activeTab === tab.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="tab-actions">
          <Button
            variant="text"
            size="small"
            startIcon={<i className="far fa-pencil-alt" />}
            sx={{ textTransform: "none", color: "#6b7280", fontSize: '14px', fontWeight: 500 }}
          >
            Edit
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<i className="far fa-plus" />}
            sx={{ textTransform: "none", color: "#6b7280", fontSize: '14px', fontWeight: 500 }}
          >
            Add Fields
          </Button>
        </div>
      </div>

      {/* Contact Info Content */}
      <div className="contact-info-section">
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <span className="contact-info-label">First name</span>
            <span className="contact-info-value">Becht</span>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-label">Last name</span>
            <span className="contact-info-value">Raph</span>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-label">Full name</span>
            <span className="contact-info-value">Becht Raph</span>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-label">Gender</span>
            <span className="contact-info-value">Male</span>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-label">Phone</span>
            <span className="contact-info-value">727-702-9986 (www)</span>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-label">Email</span>
            <span className="contact-info-value">becht_raph@sample.com (www)</span>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="p-0">
          <Row style={{ gap: !isDesktop ? 10 : 0, alignItems: 'center', marginBottom: '16px' }}>
            <Col xs={12} sm={2} md={2} lg={2} xl={2}>
              <h3 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>CRM</h3>
            </Col>
            <Col xs={12} sm={12} md={10} lg={10} xl={10}>
              <Row style={{ alignItems: "center", gap: !isDesktop ? 10 : 0 }}>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                  <div
                    className="d-flex border rounded"
                    style={{
                      backgroundColor: "#f8f9fa",
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
                          padding: 0,
                          "& .MuiSelect-select": {
                            minHeight: "auto",
                            fontSize: '14px'
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
                          fontSize: '14px'
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <div className="d-flex align-items-center" style={{ gap: 12 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<i className="far fa-upload" />}
                      sx={{
                        color: "#6b7280",
                        textTransform: "none",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: '14px',
                        fontWeight: 500,
                        "&:hover": {
                          background: "#f8f9fa",
                          border: "1px solid #d1d5db"
                        },
                      }}
                    >
                      Import
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<i className="far fa-download" />}
                      sx={{
                        color: "#6b7280",
                        textTransform: "none",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        fontSize: '14px',
                        fontWeight: 500,
                        "&:hover": {
                          background: "#f8f9fa",
                          border: "1px solid #d1d5db"
                        },
                      }}
                    >
                      Export
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="container-fluid d-flex p-0 crm-layout">
                {/* Groups Sidebar */}
                <div
                  className={`crm-sidebar ${isGroupsOpen
                    ? "crm-sidebar--collapsed"
                    : "crm-sidebar--expanded"
                    }`}
                >
                  {renderGroups()}
                </div>

                {/* Contacts Sidebar */}
                <div
                  className={`crm-sidebar ${isContactSectionOpen
                    ? "crm-sidebar--collapsed"
                    : "crm-sidebar--expanded"
                    }`}
                >
                  {renderContacts()}
                </div>

                {/* Main Content */}
                {renderMainContent()}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Crm;