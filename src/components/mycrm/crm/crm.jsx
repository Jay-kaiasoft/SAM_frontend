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
} from "@mui/material";
import { Input } from "reactstrap";
import './crm.css'

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
  { id: 4, name: "Group 4", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
  { id: 5, name: "Group 5" },
  { id: 6, name: "Group 6" },
  { id: 7, name: "Group 7", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }, { id: 3, name: "Segment 3" }, { id: 4, name: "Segment 4" }] },
  { id: 8, name: "Group 8" },
  { id: 9, name: "Group 9", segment: [{ id: 1, name: "Segment 1" }, { id: 2, name: "Segment 2" }] },
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
];


const Crm = () => {
  const [searchType, setSearchType] = useState(searchTypes[0].id);
  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);
  const [searchText, setSearchText] = useState("");

  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const [isContactSectionOpen, setIsContactSectionOpen] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || null);

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const isDesktop = useMediaQuery("(min-width: 992px)");

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

  const renderGroupsContent = () => (
    <div className="h-100 d-flex flex-column">
      <div className="border-bottom py-2 d-flex align-items-center px-3 bg-white">
        {!isGroupsOpen && (
          <div className="d-flex align-items-center" style={{ flexGrow: 1, gap: 15 }}>
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
              sx={{ textTransform: "none", color: "#000"}}
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
        )}
        <div>
          <IconButton
            id="firstBox"
            onClick={() => setIsGroupsOpen(!isGroupsOpen)}
          >
            {isGroupsOpen ? (
              <i className="fas fa-bars text-blue" />
            ) : (
              <i className="fas fa-chevron-left" />
            )}
          </IconButton>
        </div>
      </div>

      {!isGroupsOpen && (
        <>
          <div className="group-styling py-2">
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
                        {/* GROUP ROW */}
                        <div
                          className={`group-aligment d-flex align-items-center justify-content-between fw-semibold`}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedGroupId === g.id ? "#E1E1E1" : "",
                            padding: "6px 8px",
                          }}
                          onClick={() => setSelectedGroupId(g.id)}
                        >
                          <div className="d-flex align-items-center">
                            <Input
                              className="group-name me-2"
                              type="checkbox"
                              checked={selectedGroupId === g.id}
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
                              >
                                <i
                                  className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                                    }`}
                                />
                              </IconButton>
                            )}
                            {/* {
                              selectedGroupId === g.id ? (
                                <IconButton
                                  size="small"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </IconButton>
                              ) : null
                            } */}
                          </div>
                        </div>

                        {/* SEGMENTS LIST */}
                        {hasSegments && isExpanded && (
                          <div
                            className="segment-list"
                            style={{
                              paddingLeft: "32px",
                              paddingTop: "4px",
                              paddingBottom: "6px",
                              backgroundColor: "#fafafa",
                              borderLeft: "2px solid #ddd",
                            }}
                          >
                            {g.segment.map((seg) => (
                              <div
                                key={seg.id}
                                className="d-flex align-items-center justify-content-between py-1 segment-row"
                                style={{ paddingRight: "8px" }}
                              >
                                <div className="d-flex align-items-center">
                                  <Input
                                    type="checkbox"
                                    className="me-2"
                                  />
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

  return (
    <>
      <div>
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
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid d-flex p-0  flex-grow-1 overflow-auto crm-layout">
        <div className={`crm-sidebar border ${isGroupsOpen ? "crm-sidebar--collapsed" : "crm-sidebar--expanded"}`}>
          {renderGroupsContent()}
        </div>

        <div
          id="mainBox"
          className={`crm-main p-4 w-100 h-100 overflow-auto ${isGroupsOpen ? "crm-main--wide" : "crm-main--narrow"
            }`}
        >
          <div className="d-flex justify-content-end align-items-start">
            <p >OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8OK1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK2 OK3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK4 OK5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK6 OK7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK8</p>
          </div>
        </div>
      </div>

    </>
  );
};

export default Crm;
