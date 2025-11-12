import { IconButton, InputAdornment, Link, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Col, Input, Pagination, Row, Table } from 'reactstrap'
import EntriesPerPage from "../components/entriesPerPage";
import InputField from '../../shared/commonControlls/inputField';


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

const client = [
  {
    id: 1,
    name: "Ocean Marketing Agency",
    address: "CA 95820"
  },
  {
    id: 2,
    name: "Ematrix",
    address: "CA 95820"
  },
  {
    id: 3,
    name: "Kaiasoft",
    address: "CA 95820"
  }
]

const Projects = () => {
  const [clickedClient, setClickedClient] = useState(null);
  const [clientIdList, setClientIdList] = useState([]);
  const [selectedTab, setSelectedTabl] = useState(0);

  const [projects, setProjects] = useState([]);           // current client's projects
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);

  const handleChangePerPage = (event) => {
    setSelectedPage(0);
    setPerPage(event.target.value);
  }

  const handleSelectClient = (data) => {
    setClickedClient(data);
    setSelectedTabl(0);
    // TODO: replace with API call
    const mock = [
      { id: 38, name: "Digital Marketing", members: 10150, health: "Good", endDate: "30/08/2023", status: "Active" },
      { id: 21, name: "Social Media Marketing", members: 8500, health: "Need Attention", endDate: "15/09/2023", status: "Inactive" },
      { id: 38, name: "Digital Marketing", members: 10150, health: "Good", endDate: "30/08/2023", status: "Active" },
      { id: 38, name: "Digital Marketing", members: 10150, health: "At Risk", endDate: "30/08/2023", status: "Active" },
      { id: 38, name: "Digital Marketing", members: 10150, health: "Good", endDate: "30/08/2023", status: "Active" },
    ];
    setProjects(mock);
    setPage(0);
    setSelectedProjectIds([]);
  };

  const handleCheckClient = (id) => {
    if (clientIdList.includes(id)) {
      setClientIdList(prevState => (prevState.filter(x => x !== id)));
    } else {
      setClientIdList([...clientIdList, id]);
    }
  }

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const start = page * perPage;
  const current = filtered.slice(start, start + perPage);

  const allChecked = current.length > 0 && current.every(p => selectedProjectIds.includes(p.id));
  const toggleAll = () => {
    if (allChecked) {
      setSelectedProjectIds(prev => prev.filter(id => !current.some(p => p.id === id)));
    } else {
      setSelectedProjectIds(prev => [...new Set([...prev, ...current.map(p => p.id)])]);
    }
  };
  const toggleOne = (id) =>
    setSelectedProjectIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);


  return (
    <Row>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="p-0">
        <h3>Projects</h3>
        <Row>
          <Col xs={3}></Col>
          <Col xs={9}>
            <div className='d-flex items-center'>
              <div className="icon-wrapper w-100">
                <Link href='/addProject' component="a" className="btn-circle" data-toggle="tooltip" title="Add">
                  <i className="far fa-plus-square"></i>
                  <div className="bg-green"></div>
                </Link>
                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit">
                  <i className="far fa-pencil-alt"></i>
                  <div className="bg-blue"></div>
                </Link>
                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" >
                  <i className="far fa-trash-alt"></i>
                  <div className="bg-red"></div>
                </Link>
              </div>
              <div className='d-flex justify-end items-center w-100'>
                <div className='w-50'>
                  <EntriesPerPage perPage={perPage} handleChangePerPage={handleChangePerPage} />
                </div>
                <div className='w-100'>
                  <InputField
                    type="text"
                    id="text"
                    name="text"
                    onChange={(name, value) => { console.log("name", name) }}
                    InputProps={{
                      endAdornment:
                        <InputAdornment position="end">
                          <i className="far fa-search"></i>
                        </InputAdornment>
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} lg={3}>
            <div className="group-styling py-3">
              <div className="group-aligment-heading">
                <Input className="group-name" type="checkbox" />
                <span>Client Name</span>
              </div>
            </div>
            <div className="group-name-list">
              {client?.map((item, index) => {
                return (
                  <div key={index}>
                    <div className={`group-aligment ${clickedClient?.id === item.id ? "selected-class" : ""}`} >
                      <Input className="group-name" type="checkbox" checked={clientIdList.includes(item.id)} onChange={() => handleCheckClient(item.id)} value={item.id} />
                      <div className="group-name-div" onClick={() => { handleSelectClient(item, index) }}>
                        {item.name}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div>
              <p>Total Client : {client.length} | Selected: {clientIdList.length} </p>
            </div>
          </Col>

          <Col xs={12} lg={9}>
            <div className="group-styling py-2 px-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="mb-0">
                  {clickedClient
                    ? `${clickedClient.name} (client ID : ###) - ${projects.length} Projects`
                    : "Select a client"}
                </h5>
              </div>

              <div className="d-flex align-items-center gap-3">
                <TextField
                  // placeholder="Search"
                  variant="standard"
                  name="search"
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  InputProps={{
                    endAdornment:
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <i className="far fa-search text-white" />
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
                      <th className="text-center" style={{ width: 40 }}>
                        <Input type="checkbox" checked={allChecked} onChange={toggleAll} />
                      </th>
                      <th>Project Name</th>
                      <th>Total Member</th>
                      <th>Id</th>
                      <th>Health</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.length ? current.map((p, i) => (
                      <tr key={i}>
                        <td align="center">
                          <Input type="checkbox"
                            checked={selectedProjectIds.includes(p.id)}
                            onChange={() => toggleOne(p.id)} />
                        </td>
                        <td>{p.name}</td>
                        <td>{p.members?.toLocaleString()} Member</td>
                        <td>{p.id}</td>
                        <td><span>{p.health}</span></td>
                        <td>{p.endDate}</td>
                        <td><span>{p.status}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="text-center">No Projects Found.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <Row className="mt-2">
                <Col xs={6}>
                  <span className="align-middle" style={{ fontWeight: "bold" }}>
                    {`Total Projects : ${projects.length} | Selected : ${selectedProjectIds.length}`}
                  </span>
                </Col>
                <Col xs={6} className="text-right">
                  <Pagination
                    className="float-right"
                    count={Math.max(1, Math.ceil(total / perPage))}
                    variant="outlined"
                    shape="rounded"
                    page={page + 1}
                    showFirstButton
                    showLastButton
                    onChange={(_, val) => setPage(val - 1)}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Projects