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
  Checkbox,
} from "@mui/material";
import { Col, Input, Row } from "reactstrap";

const searchTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Company" },
  { id: 4, name: "Group" }
];

const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
  { id: 3, name: "Group 3" },
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

  // Custom Accordion state
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Sidebar width states for slow motion effect
  const [firstBoxWidth, setFirstBoxWidth] = useState(200);
  const [secondBoxWidth, setSecondBoxWidth] = useState(200);

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
      <div className="group-styling py-2" style={{ backgroundColor: "white !important" }}>
        <div className="group-aligment-heading">
          <Input className="group-name" type="checkbox" />
          <span>Select</span>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto">
        <div className="custom-accordion">
          <div
            className="custom-accordion-summary"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}
          >
            <p style={{ margin: 0 }}>Group</p>
            <i
              className={`fas fa-chevron-down transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`}
              style={{ transition: 'transform 0.3s ease' }}
            ></i>
          </div>
          <div
            className="custom-accordion-details"
            style={{
              maxHeight: isAccordionOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease, opacity 0.3s ease',
              opacity: isAccordionOpen ? 1 : 0,
            }}
          >
            <div className="group-name-list" style={{ padding: '16px' }}>
              {groups.map((g, index) => (
                <div key={index}>
                  <div
                    key={g.id}
                    className={`group-aligment  ${selectedGroupId === g.id ? "bg-light fw-semibold" : ""}`}
                    onClick={() => setSelectedGroupId(g.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Input className="group-name" type="checkbox" checked={selectedGroupId === g.id} />
                    <div className="group-name-div">
                      {g.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
        <i className="far fa-sort-alt ms-2 text-muted" style={{ cursor: 'pointer' }} />
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
                  style={{
                    width: 40, height: 40,
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
    <>      
      <div className="border-bottom">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div className="d-flex align-items-center w-25" style={{ flexGrow: 1 }}>
            <h3 className="mb-0 fw-bold ms-2 me-4">CRM</h3>
          </div>

          <div className="w-100 d-flex align-items-center justify-content-start" style={{ gap: 25 }}>
            {/* Search Bar (Re-using the improved structure) */}
            <div className="d-flex align-items-center flex-grow-1" style={{ maxWidth: '650px' }}>
              <div className="d-flex border rounded overflow-hidden flex-grow-1" style={{ backgroundColor: '#f8f9fa', height: '40px' }}>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 130, borderRight: '1px solid #ccc', '& .MuiInputBase-root': { height: '100%', padding: '4px 12px 5px 12px', }, '& .MuiInput-underline:before': { display: 'none' }, '& .MuiInput-underline:after': { display: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' }, }}>
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
                    style: { padding: '0px 0px 0px 10px', height: '40px' }
                  }}
                />
              </div>
            </div>

            {/* Import / Export Buttons (Right Side) */}
            <div className="d-flex align-items-center ms-4" style={{ gap: 10 }}>
              <Button variant="outlined" size="small" startIcon={<i className="far fa-upload" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Import </Button>
              <Button variant="outlined" size="small" startIcon={<i className="far fa-download" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Export </Button>

              {/* Toggles for Sidebars (Desktop: collapse/expand, Mobile: open drawers) */}
              <div className="d-flex align-items-center gap-1 ms-2">
                <IconButton size="small" onClick={() => isDesktop ? setIsGroupsOpen(!isGroupsOpen) : setGroupDrawerOpen(true)} sx={{ color: "#6c757d" }}><i className="far fa-bars" /></IconButton>
                <IconButton size="small" onClick={() => isDesktop ? setIsContactsOpen(!isContactsOpen) : setContactDrawerOpen(true)} sx={{ color: "#6c757d" }}><i className="far fa-address-book" /></IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-fluid d-flex p-0 border flex-grow-1 overflow-auto">
        <div className="border px-4 py-4 d-flex justify-content-end align-items-start" style={{ width: `${firstBoxWidth}px`, transition: 'width 0.3s ease' }}>
          <IconButton id="firstBox" onClick={() => setFirstBoxWidth(firstBoxWidth === 200 ? 100 : 200)}>
            <i class="fas fa-bars text-blue"></i>
          </IconButton>
        </div>
        <div className="border px-4 py-4 d-flex justify-content-end align-items-start" style={{ width: `${secondBoxWidth}px`, transition: 'width 0.3s ease' }}>
          <IconButton id="secondBox" onClick={() => setSecondBoxWidth(secondBoxWidth === 200 ? 100 : 200)}>
            <i class="fas fa-bars text-blue"></i>
          </IconButton>
        </div>
        <div id="mainBox" className="border p-4 w-100 h-100 overflow-auto">
          <div className="d-flex justify-content-end align-items-start">
            <p className="">OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8</p>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default Crm;
