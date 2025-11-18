

// src/pages/crm/crm.jsx
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import { Col, Row } from "reactstrap";

const groups = [
  { id: 1, name: "All Contacts" },
  { id: 2, name: "Hot Leads" },
  { id: 3, name: "Customers" },
];

const contacts = [
  {
    id: 1,
    name: "Becht Raph",
    company: "Metz Inc",
    email: "becht_raph@sample.com",
    phone: "727-702-9986",
    status: "Lead",
    score: 60,
    role: "Decision Maker",
    lastConnected: "Tue, 04 June 2024, 03:32 PM",
    stageChanged: "Mon, 03 June 2024, 05:30 PM",
  },
  {
    id: 2,
    name: "Bogisich Marcos",
    company: "Gottlieb Group",
    email: "Click to Add Email Address",
    phone: "704-508-8762",
    status: "Prospect",
    score: 48,
    role: "Influencer",
    lastConnected: "Mon, 10 June 2024, 11:14 AM",
    stageChanged: "Mon, 10 June 2024, 09:12 AM",
  },
  {
    id: 3,
    name: "Christian Sen",
    company: "Metz Inc",
    email: "christian_sen@hotmail.com",
    phone: "828-701-1112",
    status: "Customer",
    score: 92,
    role: "Decision Maker",
    lastConnected: "Fri, 07 June 2024, 02:45 PM",
    stageChanged: "Thu, 06 June 2024, 04:20 PM",
  },
];

const stages = [
  "New",
  "Connected",
  "Proposal",
  "Interested",
  "Negotiation",
  "Under Review",
  "Demo",
  "More",
];

const searchTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Company" },
  { id: 4, name: "Group" },
];

const Crm = () => {
  const [searchType, setSearchType] = useState(searchTypes[0].id);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);
  const [searchText, setSearchText] = useState("");
  const [detailsTab, setDetailsTab] = useState(0);

  // collapsible desktop columns
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const [isContactsOpen, setIsContactsOpen] = useState(true);

  // mobile drawers
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const activeContact =
    filteredContacts.find((c) => c.id === selectedContactId) ||
    filteredContacts[0];

  const handleChangeSearchType = (event) => {
    setSearchType(event.target.value);
  };

  const handleChangeTab = (event, newValue) => {
    setDetailsTab(newValue);
  };

  // LEFT COLUMN: Groups
  const renderGroupsContent = () => (
    <div className="h-100 d-flex flex-column bg-light">
      {/* "Select" row */}
      <div
        className="d-flex align-items-center px-3 py-2 border-bottom"
        style={{ fontSize: 14 }}
      >
        <input className="form-check-input me-2" type="checkbox" />
        <span className="fw-semibold text-primary">Select</span>
      </div>

      {/* Group section */}
      <div className="border-bottom">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <i className="far fa-users" />
            <span className="fw-semibold">Group</span>
          </div>
          <i className="far fa-ellipsis-v" />
        </div>
      </div>

      {/* Tags section header (just visual) */}
      <div className="border-bottom">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center gap-2">
            <i className="far fa-tags" />
            <span className="fw-semibold">Tags</span>
          </div>
          <i className="far fa-ellipsis-v" />
        </div>
      </div>

      {/* Group list */}
      <div className="flex-grow-1 overflow-auto">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`d-flex align-items-center px-3 py-2 ${
              selectedGroupId === g.id ? "bg-white" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedGroupId(g.id)}
          >
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selectedGroupId === g.id}
              readOnly
            />
            <span className="text-truncate">{g.name}</span>
          </div>
        ))}
      </div>

      <div className="border-top px-3 py-2 small text-muted">
        Total Groups : {groups.length}
      </div>
    </div>
  );

  // MIDDLE COLUMN: Contacts list
  const renderContactsContent = () => (
    <div className="h-100 d-flex flex-column bg-white">
      {/* header (checkbox, title, sort) */}
      <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <input className="form-check-input" type="checkbox" />
          <span className="fw-semibold text-primary">Contact</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="far fa-sort-amount-down" />
        </div>
      </div>

      {/* "Add Contact / Delete" toolbar like screenshot */}
      <div className="d-flex align-items-center px-3 py-2 border-bottom">
        <i className="far fa-user me-2" />
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: "none", color: "#000" }}
          startIcon={<i className="far fa-user-plus" />}
        >
          Add Contact
        </Button>
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: "none", color: "#000", ml: 1 }}
          startIcon={<i className="far fa-trash-alt" />}
        >
          Delete
        </Button>
        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => setIsContactsOpen(false)}
            sx={{ marginLeft: "auto" }}
          >
            <i className="far fa-chevron-left" />
          </IconButton>
        )}
      </div>

      {/* contact rows */}
      <div className="flex-grow-1 overflow-auto">
        {filteredContacts.map((c) => {
          const initials = c.name
            .split(" ")
            .map((n) => n[0])
            .join("");
          const isActive = c.id === activeContact?.id;
          return (
            <div
              key={c.id}
              className={`d-flex align-items-center px-3 py-3 contact-row ${
                isActive ? "bg-primary bg-opacity-10" : ""
              }`}
              style={{
                cursor: "pointer",
                borderBottom: "1px solid #f1f1f1",
              }}
              onClick={() => setSelectedContactId(c.id)}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  bgcolor: isActive ? "primary.main" : "secondary.main",
                  fontSize: 14,
                }}
              >
                {initials}
              </Avatar>

              <div className="flex-grow-1">
                <div className="fw-semibold text-truncate">{c.name}</div>
                <div className="small text-muted text-truncate">
                  <i className="far fa-envelope me-1" />
                  {c.email}
                </div>
                <div className="small text-muted text-truncate">
                  <i className="far fa-phone me-1" />
                  {c.phone}
                </div>
                <div className="small text-muted text-truncate">
                  <i className="far fa-building me-1" />
                  {c.company}
                </div>
              </div>
            </div>
          );
        })}

        {filteredContacts.length === 0 && (
          <div className="p-3 text-muted small">No contacts found.</div>
        )}
      </div>
    </div>
  );

  // RIGHT COLUMN: detailed view
  const renderDetailsHeader = () => (
    <>
      {/* Top contact header */}
      <div className="d-flex align-items-start justify-content-between px-4 pt-3 pb-2">
        <div className="d-flex align-items-start">
          <Avatar
            sx={{ width: 64, height: 64, mr: 2, bgcolor: "secondary.main" }}
          >
            {activeContact?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>

          <div>
            <h5 className="mb-1">{activeContact?.name}</h5>
            <div className="small text-muted mb-1">
              <i className="far fa-building me-1" />
              {activeContact?.company}
            </div>

            <div className="d-flex align-items-center gap-3 small">
              <span>
                <i className="far fa-envelope me-1" />
              </span>
              <span>
                <i className="far fa-phone me-1" />
              </span>
              <span>
                <i className="far fa-comment-alt me-1" />
              </span>
              <span>
                <i className="far fa-calendar-alt me-1" />
              </span>
            </div>
          </div>
        </div>

        <div className="text-end small">
          <div className="mb-1">
            <span className="text-muted me-1">Contact Role :</span>
            <Button
              size="small"
              variant="text"
              sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              endIcon={<i className="far fa-chevron-down" />}
            >
              {activeContact?.role}
            </Button>
          </div>
          <div className="mb-1">
            <span className="text-muted me-1">Contact Status :</span>
            <Button
              size="small"
              variant="text"
              sx={{ textTransform: "none", p: 0, minWidth: 0, color: "green" }}
              endIcon={<i className="far fa-chevron-down" />}
            >
              {activeContact?.status}
            </Button>
          </div>
          <div className="mb-1">
            <span className="text-muted me-1">Contact Score :</span>
            <span style={{ color: "green", fontWeight: 600 }}>
              {activeContact?.score} <i className="far fa-line-chart ms-1" />
            </span>
          </div>
        </div>
      </div>

      {/* Interested / last connected row */}
      <div className="d-flex justify-content-between align-items-center px-4 pb-2 small">
        <div>
          <span className="text-muted me-1">Interested In :</span>
          <Button
            size="small"
            variant="text"
            sx={{
              textTransform: "none",
              p: 0,
              minWidth: 0,
            }}
            endIcon={<i className="far fa-chevron-down" />}
          >
            Product 1, Service 2
          </Button>
        </div>

        <div className="text-end">
          <div>
            <span className="text-muted me-1">Last Connected :</span>
            <span>{activeContact?.lastConnected}</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Stage bar */}
      <div className="d-flex align-items-center justify-content-between px-4 py-2 small">
        <div>
          <span className="text-muted me-1">Lead Stage Changed :</span>
          <span>{activeContact?.stageChanged}</span>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-1 px-4 pb-2">
        {stages.map((stage, index) => {
          const isActive = index === 3; // example: "Interested"
          return (
            <Button
              key={stage}
              size="small"
              variant={isActive ? "contained" : "outlined"}
              sx={{
                textTransform: "none",
                borderRadius: 20,
                fontSize: 12,
                py: 0.5,
              }}
            >
              {stage}
            </Button>
          );
        })}
      </div>

      <Divider />
    </>
  );

  const renderDetailsTabs = () => (
    <>
      {/* Tabs row */}
      <div className="px-4 pt-2">
        <Tabs
          value={detailsTab}
          onChange={handleChangeTab}
          variant="scrollable"
          TabIndicatorProps={{ style: { height: 2 } }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: 14,
              minHeight: 40,
            },
          }}
        >
          <Tab label="Contact Info" />
          <Tab label="Communication" />
          <Tab label="Status" />
          <Tab label="Social" />
        </Tabs>
      </div>
      <Divider />

      {/* Tab content */}
      <Box sx={{ p: 3, pb: 6 }}>
        {detailsTab === 0 && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <i className="far fa-edit" />
                <span>Edit</span>
              </div>
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: "none" }}
                startIcon={<i className="far fa-plus-square" />}
              >
                Add Fields
              </Button>
            </div>

            <h6 className="mb-3">Personal Information</h6>

            <Row>
              <Col md={6} className="mb-2">
                <div className="small text-muted">First name :</div>
                <div>Becht</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Last name :</div>
                <div>Raph</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Full name :</div>
                <div>Becht Raph</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Gender :</div>
                <div>Male</div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Phone :</div>
                <div>
                  <a href="tel:7277029986">727-702-9986</a>{" "}
                  <span className="text-muted">(Work)</span>
                </div>
                <div>
                  <a href="tel:7277029987">727-702-9987</a>{" "}
                  <span className="text-muted">(Personal)</span>
                </div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Email :</div>
                <div>
                  <a href="mailto:becht_raph@sample.com">
                    becht_raph@sample.com
                  </a>{" "}
                  <span className="text-muted">(Work)</span>
                </div>
                <div>
                  <a href="mailto:raph_becht@sample.com">
                    raph_becht@sample.com
                  </a>{" "}
                  <span className="text-muted">(Personal)</span>
                </div>
              </Col>
              <Col md={6} className="mb-2">
                <div className="small text-muted">Date of Birth :</div>
                <div>12/23/2001</div>
              </Col>
            </Row>
          </>
        )}

        {detailsTab === 1 && (
          <div className="text-muted">Communication timeline goes here.</div>
        )}
        {detailsTab === 2 && (
          <div className="text-muted">Status information goes here.</div>
        )}
        {detailsTab === 3 && (
          <div className="text-muted">Social profiles go here.</div>
        )}
      </Box>
    </>
  );

  const renderRightSideIcons = () => (
    <div
      className="d-none d-md-flex flex-column border-start align-items-center"
      style={{ width: 48 }}
    >
      <IconButton size="small" sx={{ mt: 1 }}>
        <i className="far fa-list-ul" />
      </IconButton>
      <IconButton size="small">
        <i className="far fa-clipboard" />
      </IconButton>
      <IconButton size="small">
        <i className="far fa-bell" />
      </IconButton>
      <IconButton size="small">
        <i className="far fa-sticky-note" />
      </IconButton>
      <IconButton size="small">
        <i className="far fa-paperclip" />
      </IconButton>
      <IconButton size="small">
        <i className="far fa-ellipsis-v" />
      </IconButton>
    </div>
  );

  return (
    <Row>
      <Col xs={12}>
        {/* =========== TOP MAIN BAR =========== */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
          <div className="d-flex align-items-center">
            {isMobile && (
              <IconButton
                size="small"
                className="me-2"
                onClick={() => setGroupDrawerOpen(true)}
              >
                <i className="far fa-bars" />
              </IconButton>
            )}
            <h3 className="mb-0 fw-bold">CRM</h3>
          </div>

          <div className="d-flex align-items-center flex-grow-1 mx-3">
            {/* Search-type select */}
            <FormControl
              variant="standard"
              sx={{
                backgroundColor: "#F5F5F5",
                borderRight: "1px solid #ccc",
                "& .MuiInputBase-root": {
                  height: "40px",
                  padding: "4px 12px 5px 12px",
                },
                "& .MuiInput-underline:before": { display: "none" },
                "& .MuiInput-underline:after": { display: "none" },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  display: "none",
                },
              }}
            >
              <Select
                value={searchType}
                onChange={handleChangeSearchType}
                disableUnderline
                sx={{
                  padding: 0,
                  minWidth: 90,
                  "& .MuiSelect-select": { minHeight: "auto" },
                }}
              >
                {searchTypes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search box */}
            <div style={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="Search Contact, Company or Group"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div
                        style={{
                          backgroundColor: "#0478DC",
                          width: 40,
                          height: 36,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <i className="far fa-search text-white" />
                      </div>
                    </InputAdornment>
                  ),
                  style: {
                    borderRadius: 0,
                    backgroundColor: "#f8f9fa",
                    padding: 0,
                  },
                }}
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<i className="far fa-upload" />}
              sx={{ textTransform: "none", color: "#000" }}
            >
              Import
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<i className="far fa-download" />}
              sx={{ textTransform: "none", color: "#000" }}
            >
              Export
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<i className="far fa-expand" />}
              sx={{ textTransform: "none", color: "#000" }}
            >
              Full Screen View
            </Button>
            <IconButton size="small">
              <i className="far fa-question-circle" />
            </IconButton>
          </div>
        </div>

        {/* =========== SECOND ACTION BAR =========== */}
        <div className="border-bottom py-2 d-flex align-items-center px-3 bg-white">
          <Button
            variant="text"
            size="small"
            startIcon={<i className="far fa-plus-square" />}
            sx={{ textTransform: "none", color: "#000", mr: 1 }}
          >
            Add
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<i className="far fa-pencil-alt" />}
            sx={{ textTransform: "none", color: "#000", mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<i className="far fa-trash-alt" />}
            sx={{ textTransform: "none", color: "#000" }}
          >
            Delete
          </Button>
        </div>

        {/* =========== MAIN 3-PANEL AREA =========== */}
        {!isMobile ? (
          <div
            className="d-flex bg-white"
            style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}
          >
            {/* Groups column or collapsed tab */}
            {isGroupsOpen ? (
              <div style={{ width: 260, borderRight: "1px solid #e5e5e5" }}>
                {renderGroupsContent()}
              </div>
            ) : (
              <div
                onClick={() => setIsGroupsOpen(true)}
                style={{
                  width: 32,
                  borderRight: "1px solid #e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: 12,
                  background: "#fafafa",
                }}
              >
                Groups
              </div>
            )}

            {/* Contacts column or collapsed tab */}
            {isContactsOpen ? (
              <div style={{ width: 320, borderRight: "1px solid #e5e5e5" }}>
                {renderContactsContent()}
              </div>
            ) : (
              <div
                onClick={() => setIsContactsOpen(true)}
                style={{
                  width: 32,
                  borderRight: "1px solid #e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: 12,
                  background: "#fafafa",
                }}
              >
                Contacts
              </div>
            )}

            {/* Details + right icons */}
            <div className="flex-grow-1 d-flex">
              <div className="flex-grow-1 d-flex flex-column overflow-auto">
                {renderDetailsHeader()}
                {renderDetailsTabs()}
              </div>
              {renderRightSideIcons()}
            </div>
          </div>
        ) : (
          // ======= MOBILE LAYOUT: contacts list + details stacked =======
          <div
            className="bg-white"
            style={{ maxHeight: "calc(100vh - 140px)", overflow: "auto" }}
          >
            {/* Toggle contacts drawer on mobile if you want full-screen list */}
            <div className="d-flex align-items-center justify-content-end px-2 pt-1">
              <IconButton
                size="small"
                onClick={() => setContactDrawerOpen(true)}
              >
                <i className="far fa-address-book" />
              </IconButton>
            </div>
            {renderContactsContent()}
            <Divider />
            {renderDetailsHeader()}
            {renderDetailsTabs()}
          </div>
        )}

        {/* ===== MOBILE DRAWERS ===== */}
        <Drawer
          anchor="left"
          open={groupDrawerOpen}
          onClose={() => setGroupDrawerOpen(false)}
        >
          <div style={{ width: 260, height: "100vh" }}>{renderGroupsContent()}</div>
        </Drawer>

        <Drawer
          anchor="left"
          open={contactDrawerOpen}
          onClose={() => setContactDrawerOpen(false)}
        >
          <div style={{ width: 320, height: "100vh" }}>
            {renderContactsContent()}
          </div>
        </Drawer>
      </Col>
    </Row>
  );
};

export default Crm;
