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
} from "@mui/material";
import { Col, Input, Row } from "reactstrap";
import './crm.css'
import DropDownControls from "../../shared/commonControlls/dropdownControl";

const searchTypes = [
  { id: 1, name: "All" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Company" },
  { id: 4, name: "Group" }
];

const filter = [{
  key: 1,
  value: "Companay"
}]
const groups = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
  { id: 3, name: "Group 3" },
  { id: 4, name: "Group 4", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 5, name: "Group 5" },
  { id: 6, name: "Group 6" },
  { id: 7, name: "Group 7", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }, { id: 3, name: "Segment 3" }, { id: 4, name: "Segment 4" }] },
  { id: 8, name: "Group 8" },
  { id: 9, name: "Group 9", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 10, name: "Group 10", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 11, name: "Group 11", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 12, name: "Group 12", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 13, name: "Group 13", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 14, name: "Group 14", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },

];

const contacts = [
  {
    id: 1,
    name: "Becht Raph",
    email: "becht_raph@sample.com",
    phone: "727-702-9986",
    company: "Metz Inc",
    avatarType: "image",
    avatarUrl: "https://via.placeholder.com/40"
  },
  {
    id: 2,
    name: "Bogisich Marcos",
    email: "",
    phone: "7045088762",
    company: "Gottlieb Group",
    avatarType: "initials",
    initials: "BM"
  },
  {
    id: 3,
    name: "Christian Sen",
    email: "Christian_sen@hotmail.com",
    phone: "8287071112",
    company: "Metz Inc",
    avatarType: "image",
    avatarUrl: "https://via.placeholder.com/40"
  },
  {
    id: 4,
    name: "Hankeen Gerhard",
    email: "hankeen_gerhard@sample.com",
    phone: "8430921690",
    company: "Moen and Sons",
    avatarType: "initials",
    initials: "KG"
  },
  {
    id: 5,
    name: "Bogisich Marcos",
    email: "",
    phone: "7045088762",
    company: "Gottlieb Group",
    avatarType: "initials",
    initials: "BM"
  },
  {
    id: 6,
    name: "Christian Sen",
    email: "Christian_sen@hotmail.com",
    phone: "8287071112",
    company: "Metz Inc",
    avatarType: "image",
    avatarUrl: "https://via.placeholder.com/40"
  },
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
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || null);

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedFilter, setSelectedFilter] = useState(1)

  const handleChangeFilter = (event, value) => {
    setSelectedFilter(value)
  }

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups((prev) => {
      const isCurrentlyOpen = !!prev[groupId];

      // if same group clicked again → close all
      if (isCurrentlyOpen) {
        return {};
      }

      // only keep this group open
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
          <div className="border-bottom py-2 d-flex align-items-center px-3 bg-white">
            <div
              className="d-flex align-items-center"
              style={{ flexGrow: 1, gap: 15 }}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<i className="far fa-plus-square" />}
                sx={{ textTransform: "none", color: "#000" }}
              >
                Add
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<i className="far fa-pencil-alt" />}
                sx={{ textTransform: "none", color: "#000" }}
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
            <div>
              <IconButton
                id="firstBox"
                onClick={() => setIsGroupsOpen(true)}  // collapse
              >
                <i className="fas fa-chevron-left" />
              </IconButton>
            </div>
          </div>

          <div className="group-styling py-1">
            <div className="group-aligment-heading">
              <Checkbox
                size="small"
                className="group-name"
                sx={{
                  "&.Mui-checked": {
                    color: "#ffffff !important",
                  },
                  "&.MuiSvgIcon-root": {
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
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  backgroundColor: "#E1E1E1",
                  border: "1px solid #E1E1E1",
                }}
              >
                <p style={{ margin: 0 }}>Group</p>
                <i
                  className={`fas fa-chevron-down transition-transform ${isAccordionOpen ? "rotate-180" : ""
                    }`}
                  style={{ transition: "transform 0.3s ease" }}
                />
              </div>

              <div
                className="custom-accordion-details"
                style={{
                  maxHeight: isAccordionOpen ? "500px" : "",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                  opacity: isAccordionOpen ? 1 : 0,
                }}
              >
                <div className="group-name-list" style={{ padding: 0 }}>
                  {groups.map((g) => {
                    const hasSegments =
                      Array.isArray(g.segment) && g.segment.length > 0;
                    const isExpanded = !!expandedGroups[g.id];

                    return (
                      <div key={g.id}>
                        <div
                          className="group-aligment d-flex align-items-center justify-content-between fw-semibold"
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedGroupId === g.id ? "#E1E1E1" : "",
                            padding: "2px 8px",
                          }}
                          onClick={() => setSelectedGroupId(g.id)}
                        >
                          <div className="d-flex align-items-center">
                            <Checkbox
                              size="small"
                              className="group-name me-2"
                              checked={selectedGroupId === g.id}
                              onChange={() => setSelectedGroupId(g.id)}
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
                              >
                                <i
                                  className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                                    }`}
                                />
                              </IconButton>
                            )}
                          </div>
                        </div>

                        {hasSegments && isExpanded && (
                          <div
                            className="segment-list"
                            style={{
                              paddingLeft: "30px",
                              backgroundColor: "#fafafa",
                              borderLeft: "2px solid #ddd",
                            }}
                          >
                            {g.segment.map((seg) => (
                              <div
                                key={seg.id}
                                className="d-flex align-items-center justify-content-between segment-row cursor-pointer"
                                style={{ paddingRight: "8px" }}
                              >
                                <div className="d-flex align-items-center">
                                  <Checkbox size="small" className="me-2" />
                                  <span>{seg.name}</span>
                                </div>

                                <div
                                  className="d-flex align-items-center"
                                  style={{ gap: 8 }}
                                >
                                  <i className="far fa-copy cursor-pointer" />
                                  <i className="far fa-pencil-alt cursor-pointer" />
                                  <i className="far fa-trash-alt cursor-pointer" />
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

  const renderContent = () => (
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
          <div className="crm-contact-header py-2 d-flex align-items-center px-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ flexGrow: 1, gap: 20 }}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<i className="far fa-user" />}
                sx={{ textTransform: "none", color: "#000" }}
              >
                Add Contact
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
            <div>
              <IconButton
                id="secondBox"
                onClick={() => setIsContactSectionOpen(true)} // collapse
              >
                <i className="fas fa-chevron-left" />
              </IconButton>
            </div>
          </div>

          <div className="crm-contact-filter d-flex justify-content-start align-items-center" style={{ gap: 8 }}>
            <div
              className="d-flex justify-content-start align-items-center"
              style={{ gap: 8, flexGrow: 1 }}
            >
              <Checkbox size="small" />
              <div className="mb-0">
                <DropDownControls
                  id="filter"
                  name="filter"
                  onChange={handleChangeFilter}
                  value={selectedFilter}
                  dropdownList={filter}
                />
              </div>
            </div>

            <div className="icon-wrapper">
              <Link
                component="a"
                className="btn-circle"
                data-toggle="tooltip"
                title="Filter"
              >
                <i className="far fa-sort-alt text-black" />
                <div className="bg-blue"></div>
              </Link>
            </div>
          </div>

          <div className="crm-contact-list d-flex flex-column">
            {filteredContacts?.map((c) => {
              const initials = c.name
                .split(" ")
                .map((n) => n[0])
                .join("");
              const isActive = c.id === activeContact?.id;

              return (
                <div
                  key={c.id}
                  className={`d-flex align-items-center px-3 py-3 contact-row ${isActive ? "contact-row--active" : ""
                    }`}
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
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="contact-main-text text-truncate">
                        {c.name}
                      </span>
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
              );
            })}
          </div>
        </>
      )}
    </div>
  );


  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="p-0">
          <Row style={{ gap: !isDesktop ? 10 : 0 }}>
            <Col xs={12} sm={2} md={2} lg={2} xl={2}>
              <h3 className="mb-0 fw-bold">CRM</h3>
            </Col>
            <Col xs={12} sm={12} md={10} lg={10} xl={10}>
              <Row style={{ alignItems: "center", gap: !isDesktop ? 10 : 0 }}>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                  <div className="d-flex border rounded" style={{ backgroundColor: '#f8f9fa', height: '40px' }}>
                    <FormControl variant="standard" sx={{ m: 0, minWidth: { xs: 80, md: 130 }, borderRight: '1px solid #ccc', '& .MuiInputBase-root': { height: '100%', padding: '4px 12px 5px 12px', }, '& .MuiInput-underline:before': { display: 'none' }, '& .MuiInput-underline:after': { display: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' }, }}>
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
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <Button variant="outlined" size="small" startIcon={<i className="far fa-upload" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Import </Button>
                    <Button variant="outlined" size="small" startIcon={<i className="far fa-download" />} sx={{ color: "#000", textTransform: "none", borderRadius: "6px", border: 0, '&:hover': { background: "none", border: 0 } }}> Export </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="container-fluid d-flex p-0 crm-layout mt-2">
                <div className={`crm-sidebar border ${isGroupsOpen ? "crm-sidebar--collapsed" : "crm-sidebar--expanded"}`}>
                  {renderGroups()}
                </div>

                <div className={`crm-sidebar border ${isContactSectionOpen ? "crm-sidebar--collapsed" : "crm-sidebar--expanded"}`}>
                  {renderContent()}
                </div>

                <div
                  className={`crm-main w-100 h-100 ${isGroupsOpen || isContactSectionOpen ? "crm-main--wide" : "crm-main--narrow"
                    }`}
                >
                  <div className="d-flex p-4 justify-content-end align-items-center border-bottom" style={{ gap: 15 }}>
                    <div>
                      <i className="far fa-expand mr-2"></i>
                      <span className="text-black">
                        Full Screen View
                      </span>
                    </div>
                    <div>
                      <i className="far fa-question-circle mr-2"></i>
                      <span className="text-black">
                        Help
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <div>
                      <div
                        className={`d-flex align-items-center px-3 py-3`}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            mr: 2,
                            bgcolor: "primary.main",
                            fontSize: 14,
                          }}
                        >
                          OK
                        </Avatar>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="contact-main-text text-truncate">
                              Becht Raph
                            </span>
                          </div>

                          <div className="contact-info-row">
                            <i className="far fa-building" />
                            <span className="contact-sub-text">
                              Metz Inc
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Crm;