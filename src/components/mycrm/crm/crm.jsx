// src/pages/crm/crm.jsx

import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Link,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Col, Input, Row } from "reactstrap";
// import EntriesPerPage from "../components/entriesPerPage"; // Not used in this snippet
// import InputField from "../../shared/commonControlls/inputField"; // Not used in this snippet

// ... (Your existing useStyles, groups, contacts, stages, searchTypes data) ...

const searchTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Company" },
  { id: 4, name: "Group" }
];

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
  },
  {
    id: 2,
    name: "Bogisich Marcos",
    company: "Gottlieb Group",
    email: "bogisich@sample.com",
    phone: "704-508-8762",
    status: "Prospect",
    score: 48,
  },
  {
    id: 3,
    name: "Christian Sen",
    company: "Metz Inc",
    email: "christian_sen@hotmail.com",
    phone: "828-701-1112",
    status: "Customer",
    score: 92,
  },
  // Add more contacts to better illustrate the scrollable list
  { id: 4, name: "Hankeen Gerhard", company: "Moen and Sons", email: "hankeen_gerhard@sample.com", phone: "8430921690", status: "Lead", score: 55, },
  { id: 5, name: "Jacobs Steve", company: "Jacobs Inc", email: "jacobs_steve@hotmail.com", phone: "1234567890", status: "Customer", score: 99, },
];


const Crm = () => {
  const [searchType, setSearchType] = useState(searchTypes[0].id); // Default to 'All'
  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);
  const [searchText, setSearchText] = useState("");
  const [perPage, setPerPage] = useState(25);

  // Persistent / Collapsible Sidebars state (Desktop View)
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const [isContactsOpen, setIsContactsOpen] = useState(true);

  // Mobile Drawer state
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);

  // Use a higher breakpoint for the sidebars to be persistent
  const isDesktop = useMediaQuery("(min-width: 992px)"); 

  // ... (Your existing handleChangePerPage, filteredContacts, activeContact logic) ...

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const activeContact =
    filteredContacts.find((c) => c.id === selectedContactId) ||
    filteredContacts[0];


  // Reusable sidebar content (Groups)
  const renderGroupsContent = () => (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <i className="far fa-layer-group" />
          <span className="fw-semibold text-primary">Groups</span>
        </div>
        {isDesktop && (
          <IconButton size="small" onClick={() => setIsGroupsOpen(false)}>
            <i className="far fa-chevron-left" />
          </IconButton>
        )}
      </div>

      <div className="flex-grow-1 overflow-auto">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`d-flex align-items-center px-3 py-2 group-item ${selectedGroupId === g.id ? "bg-light fw-semibold" : ""
              }`}
            onClick={() => setSelectedGroupId(g.id)}
            style={{ cursor: "pointer" }}
          >
            <Input
              className="me-2"
              type="checkbox"
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

  // Reusable sidebar content (Contacts list) - Now with a top action bar for image matching
  const renderContactsContent = () => (
    <div className="h-100 d-flex flex-column">
      
      {/* Top Action Bar (Add Contact, Delete, Close) */}
      <div className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom flex-shrink-0">
        <IconButton size="small">
          <i className="far fa-user-plus me-1" />
          <span className="small text-muted text-nowrap ms-1">Add Contact</span>
        </IconButton>
        <div className="d-flex align-items-center" style={{ gap: 5 }}>
          <IconButton size="small">
            <i className="far fa-trash-alt" />
          </IconButton>
          {isDesktop && (
            <IconButton size="small" onClick={() => setIsContactsOpen(false)}>
              <i className="far fa-chevron-right" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Contact List Filter/Sort Header */}
      <div className="d-flex align-items-center px-3 py-2 border-bottom flex-shrink-0">
        <Input type="checkbox" className="me-3" />
        <FormControl variant="standard" sx={{ minWidth: 120, flexGrow: 1 }}>
          <Select 
            disableUnderline 
            value={"Company"}
            sx={{
              '& .MuiSelect-select': { paddingRight: '24px !important' },
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <MenuItem value="Company">Company</MenuItem>
            <MenuItem value="Name">Name</MenuItem>
          </Select>
        </FormControl>
        <i className="far fa-sort-alt ms-2 text-muted" style={{ cursor: 'pointer' }}/>
      </div>


      {/* Scrollable Contacts List */}
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
              className={`d-flex align-items-start px-2 py-2 contact-row ${isActive ? "bg-primary bg-opacity-10" : ""
                }`}
              style={{ cursor: "pointer", borderBottom: "1px solid #f1f1f1" }}
              onClick={() => setSelectedContactId(c.id)}
            >
              <div className="d-flex flex-column align-items-center me-3 flex-shrink-0 pt-1">
                <Input type="checkbox" className="mb-2" />
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${isActive ? "bg-primary text-white" : "bg-secondary text-white"
                    }`}
                  style={{ width: 40, height: 40, 
                    // Use Image Tag for contact profile images
                    backgroundImage: c.id === 1 ? 'url()' : (c.id === 3 ? 'url()' : 'none'), 
                    backgroundSize: 'cover',
                  }}
                >
                  {/* Only show initials if no image is present */}
                  {!(c.id === 1 || c.id === 3) && <span className="small fw-bold">{initials}</span>}
                </div>
              </div>
              
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


  // --- MAIN COMPONENT RETURN ---
  return (
    <Row className="g-0 vh-100" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      
      {/* ----------------------------------------------------------------------------------
      1. Header Row (CRM, Search, Import/Export) - Full Width
      ---------------------------------------------------------------------------------- */}
      <Col xs={12} className="border-bottom flex-shrink-0">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          
          {/* CRM Title and Toggle for Groups Sidebar */}
          <div className="d-flex align-items-center">
            {isDesktop && !isGroupsOpen && (
              <IconButton size="small" onClick={() => setIsGroupsOpen(true)}>
                <i className="far fa-chevron-right" />
              </IconButton>
            )}
            <h3 className="mb-0 fw-bold ms-2 me-4">CRM</h3>
          </div>

          {/* Search Bar (Re-using the improved structure) */}
          <div className="d-flex align-items-center flex-grow-1" style={{ maxWidth: '650px' }}>
            <div className="d-flex border rounded overflow-hidden flex-grow-1" style={{ backgroundColor: '#f8f9fa', height: '40px' }}>
              <FormControl variant="standard" sx={{ m: 0, minWidth: 120, borderRight: '1px solid #ccc', '& .MuiInputBase-root': { height: '100%', padding: '4px 12px 5px 12px', }, '& .MuiInput-underline:before': { display: 'none' }, '& .MuiInput-underline:after': { display: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' }, }}>
                <Select
                  value={searchType}
                  onChange={handleChange}
                  disableUnderline
                  sx={{ padding: 0, '& .MuiSelect-select': { minHeight: 'auto', }, }}
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
                sx={{ '& .MuiInput-underline:before': { display: 'none' }, '& .MuiInput-underline:after': { display: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' }, }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div className="bg-primary" style={{ borderRadius: "0 4px 4px 0", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", margin: 0, cursor: 'pointer' }}>
                        <i className="far fa-search text-white" />
                      </div>
                    </InputAdornment>
                  ),
                  style: { padding: '0 8px', height: '40px' }
                }}
              />
            </div>
          </div>

          {/* Import / Export Buttons (Right Side) */}
          <div className="d-flex align-items-center ms-4" style={{ gap: 10 }}>
            <Button variant="outlined" size="small" startIcon={<i className="far fa-upload" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Import </Button>
            <Button variant="outlined" size="small" startIcon={<i className="far fa-download" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Export </Button>

            {/* Mobile Toggles for Drawers (still needed for mobile) */}
            {!isDesktop && (
              <div className="d-flex align-items-center gap-1 ms-2">
                <IconButton size="small" onClick={() => setGroupDrawerOpen(true)} sx={{ color: "#6c757d" }}><i className="far fa-bars" /></IconButton>
                <IconButton size="small" onClick={() => setContactDrawerOpen(true)} sx={{ color: "#6c757d" }}><i className="far fa-address-book" /></IconButton>
              </div>
            )}
          </div>

        </div>
      </Col>

      {/* ----------------------------------------------------------------------------------
      2. Body Columns Row (Groups | Contacts List | Content)
      ---------------------------------------------------------------------------------- */}
      <Col xs={12} className="d-flex flex-grow-1" style={{ height: 'calc(100vh - 65px)' }}>

        {/* --------------------------------------
        A. Groups Sidebar (Leftmost)
        -------------------------------------- */}
        {isDesktop && isGroupsOpen && (
          <Col md={2} lg={2} className="border-end h-100 flex-shrink-0" style={{ maxWidth: '200px' }}>
            {renderGroupsContent()}
          </Col>
        )}

        {/* --------------------------------------
        B. Contacts List Sidebar (Middle)
        -------------------------------------- */}
        {isDesktop && isContactsOpen && (
          <Col md={4} lg={3} className="border-end h-100 flex-shrink-0" style={{ maxWidth: '300px' }}>
            {renderContactsContent()}
          </Col>
        )}

        {/* --------------------------------------
        C. Main Content Area (Details + Actions)
        -------------------------------------- */}
        <Col className="h-100 d-flex flex-column flex-grow-1">

          {/* Actions Bar (Add, Edit, Delete, Full Screen) */}
          <div className="d-flex align-items-center justify-content-between border-bottom p-2 flex-shrink-0">
            <div className="d-flex align-items-center" style={{ gap: 10 }}>
              {isDesktop && !isContactsOpen && (
                 <IconButton size="small" onClick={() => setIsContactsOpen(true)}>
                    <i className="far fa-chevron-left" />
                 </IconButton>
              )}
              <Button variant="outlined" size="small" startIcon={<i className="far fa-user-plus" />} sx={{ color: "#000", textTransform: "none", border: 0, '&:hover': { background: "none", border: 0 } }}> Add Contact </Button>
              <Button variant="outlined" size="small" startIcon={<i className="far fa-trash-alt" />} sx={{ color: "#000", textTransform: "none", border: 0, '&:hover': { background: "none", border: 0 } }}> Delete </Button>
            </div>
            <div className="d-flex align-items-center" style={{ gap: 10 }}>
              <Button variant="outlined" size="small" startIcon={<i className="far fa-expand-arrows" />} sx={{ color: "#000", textTransform: "none", border: 0, '&:hover': { background: "none", border: 0 } }}> Full Screen View </Button>
              <Button variant="outlined" size="small" startIcon={<i className="far fa-question-circle" />} sx={{ color: "#000", textTransform: "none", border: 0, '&:hover': { background: "none", border: 0 } }}> Help </Button>
            </div>
          </div>
          
          {/* Contact Details Content (Scrollable) */}
          <div className="flex-grow-1 overflow-auto p-3">
             {/* This is where the Contact Details UI will go */}
             <h2>Contact Details for: {activeContact?.name}</h2>
             <p className="small text-muted">A full-featured Contact Detail panel would be rendered here.</p>
             <div style={{ height: '1000px' }} className="border-dashed p-3">
               {/* Placeholder for the rest of the contact detail fields */}
               Details Content Area
             </div>
          </div>

        </Col>
      </Col>
      
      {/* ----------------------------------------------------------------------------------
      3. Mobile Drawers (Hidden on Desktop)
      ---------------------------------------------------------------------------------- */}
      <Drawer
        anchor="left"
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
      >
        <div style={{ width: 260 }}>{renderGroupsContent()}</div>
      </Drawer>

      <Drawer
        anchor="left"
        open={contactDrawerOpen}
        onClose={() => setContactDrawerOpen(false)}
      >
        <div style={{ width: 300 }}>{renderContactsContent()}</div>
      </Drawer>
    </Row>
  );
};

export default Crm;

{/* SECONDARY TOOLBAR (Add / Edit / Delete + entries + search) */ }
{/* <div className="border-top px-3 py-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <Link href="/addProject" component="button">
              <Button
                size="small"
                variant="outlined"
                startIcon={<i className="far fa-plus-square" />}
              >
                Add
              </Button>
            </Link>
            <Button
              size="small"
              variant="outlined"
              startIcon={<i className="far fa-pencil-alt" />}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<i className="far fa-trash-alt" />}
            >
              Delete
            </Button>
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <EntriesPerPage
              perPage={perPage}
              handleChangePerPage={handleChangePerPage}
            />
            <div style={{ minWidth: 230 }}>
              <InputField
                type="text"
                id="toolbarSearch"
                name="toolbarSearch"
                onChange={(name, value) => {
                  setSearchText(value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <i className="far fa-search" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div> */}

{/* MAIN 3-PANE LAYOUT */ }
{/* <Col xs={12} className="g-0">
        <div
          className="d-flex"
          style={{ height: "calc(100vh - 112px)", overflow: "hidden" }}
        >
          {!isMobile && (
            <>
              {isGroupsOpen ? (
                <div
                  className="border-end bg-white"
                  style={{ width: 240, minWidth: 240 }}
                >
                  {renderGroupsContent()}
                </div>
              ) : (
                <div
                  className="border-end bg-white d-flex flex-column align-items-center justify-content-between py-3 px-2"
                  style={{ width: 48, minWidth: 48 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setIsGroupsOpen(true)}
                  >
                    <i className="far fa-bars" />
                  </IconButton>
                  <div
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Groups
                  </div>
                </div>
              )}
            </>
          )}

          {!isMobile && (
            <>
              {isContactsOpen ? (
                <div
                  className="border-end bg-white"
                  style={{ width: 280, minWidth: 280 }}
                >
                  {renderContactsContent()}
                </div>
              ) : (
                <div
                  className="border-end bg-white d-flex flex-column align-items-center justify-content-between py-3 px-2"
                  style={{ width: 48, minWidth: 48 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setIsContactsOpen(true)}
                  >
                    <i className="far fa-users" />
                  </IconButton>
                  <div
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Contacts
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex-grow-1 bg-white">
            {activeContact ? (
              <div className="h-100 d-flex flex-column overflow-auto">
                <div className="d-flex flex-wrap align-items-center justify-content-between px-4 py-3 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 60, height: 60 }}
                    >
                      <span className="h5 mb-0">
                        {activeContact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h5 className="mb-1">{activeContact.name}</h5>
                      <div className="text-muted small">
                        <i className="far fa-building me-1" />
                        {activeContact.company}
                      </div>
                      <div className="mt-1 d-flex gap-3 small text-muted">
                        <i className="far fa-envelope-open-text" />
                        <i className="far fa-phone" />
                        <i className="far fa-comment-dots" />
                        <i className="far fa-calendar-alt" />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end gap-2 mt-3 mt-md-0">
                    <div className="small">
                      <span className="text-muted me-1">Contact Role :</span>
                      <Link component="button" underline="hover">
                        Decision Maker
                      </Link>
                    </div>
                    <div className="small">
                      <span className="text-muted me-1">Contact Status :</span>
                      <Link component="button" underline="hover">
                        {activeContact.status}
                      </Link>
                    </div>
                    <div className="small">
                      <span className="text-muted me-1">Contact Score :</span>
                      <span className="text-success fw-bold">
                        {activeContact.score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-bottom">
                  <div className="small text-muted mb-2">
                    Lead Stage Changed :{" "}
                    <span className="fw-semibold">
                      Mon, 03 June 2024, 05:30 PM
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {stages.map((stage, index) => {
                      const isActive = index === 2; // example: Proposal
                      const isCompleted = index < 2;
                      let className =
                        "px-3 py-1 rounded-pill small fw-semibold border";
                      if (isActive) {
                        className += " bg-primary text-white border-primary";
                      } else if (isCompleted) {
                        className +=
                          " bg-primary bg-opacity-10 text-primary border-0";
                      } else {
                        className += " bg-light text-muted border-0";
                      }
                      return (
                        <span key={stage} className={className}>
                          {stage}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="px-4 pt-3">
                  <div className="d-flex border-bottom mb-3">
                    <button className="btn btn-link px-0 me-4 border-0 text-decoration-none fw-semibold position-relative">
                      Contact Info
                      <span
                        className="position-absolute start-0 w-100"
                        style={{
                          bottom: -1,
                          borderBottom: "2px solid #0478DC",
                        }}
                      />
                    </button>
                    <button className="btn btn-link px-0 me-4 border-0 text-decoration-none text-muted">
                      Communication
                    </button>
                    <button className="btn btn-link px-0 me-4 border-0 text-decoration-none text-muted">
                      Status
                    </button>
                    <button className="btn btn-link px-0 me-4 border-0 text-decoration-none text-muted">
                      Social
                    </button>
                  </div>

                  <div className="pb-5">
                    <h6 className="mb-3">Personal Information</h6>
                    <Row className="gy-3">
                      <Col xs={12} md={6}>
                        <div className="d-flex">
                          <div className="text-muted small me-2">
                            First name :
                          </div>
                          <div className="fw-semibold small">
                            {activeContact.name.split(" ")[0]}
                          </div>
                        </div>
                        <div className="d-flex mt-2">
                          <div className="text-muted small me-2">
                            Full name :
                          </div>
                          <div className="fw-semibold small">
                            {activeContact.name}
                          </div>
                        </div>
                        <div className="d-flex mt-2">
                          <div className="text-muted small me-2">
                            Phone :
                          </div>
                          <div className="fw-semibold small">
                            {activeContact.phone}
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={6}>
                        <div className="d-flex">
                          <div className="text-muted small me-2">Email :</div>
                          <div className="fw-semibold small text-truncate">
                            {activeContact.email}
                          </div>
                        </div>
                        <div className="d-flex mt-2">
                          <div className="text-muted small me-2">
                            Company :
                          </div>
                          <div className="fw-semibold small">
                            {activeContact.company}
                          </div>
                        </div>
                        <div className="d-flex mt-2">
                          <div className="text-muted small me-2">
                            Status :
                          </div>
                          <div className="fw-semibold small">
                            {activeContact.status}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                Select a contact from the list
              </div>
            )}
          </div>
        </div>
      </Col> */}