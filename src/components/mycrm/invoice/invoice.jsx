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

const Invoice = () => {
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
            { id: 1, name: "Digital Marketing", total: 10150, endDate: "30/08/2023", balance: 2324, },
            { id: 2, name: "Social Media Marketing", total: 8500, endDate: "15/09/2023", balance: 5305, },
            { id: 3, name: "Digital Marketing", total: 10150, endDate: "30/08/2023", balance: 6545, },
            { id: 4, name: "Digital Marketing", total: 10150, endDate: "30/08/2023", balance: 1435, },
            { id: 5, name: "Digital Marketing", total: 10150, endDate: "30/08/2023", balance: 7686, },
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
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 p-md-0">
                <h3>Invoice</h3>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                        <div className='d-md-flex items-center'>
                            <div className="icon-wrapper w-100">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add">
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
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={9} xl={9}>
                        <div className='d-md-flex items-center'>
                            <div className="icon-wrapper w-100">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add">
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
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={12} lg={3}>
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

                    <Col xs={12} md={12} lg={9}>
                        <div className="group-styling py-2 px-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0">
                                    {clickedClient
                                        ? `${clickedClient.name} (client ID : ###) - ${projects.length} Invoice`
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
                                            <th>Id</th>
                                            <th>Project Name</th>
                                            <th>Total</th>
                                            <th>Issue Date</th>
                                            <th>Balance</th>
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
                                                <td>{p.id}</td>
                                                <td>{p.name}</td>
                                                <td>$ {p.total}</td>
                                                <td>{p.endDate}</td>
                                                <td>$ {p.balance}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={7} className="text-center">No Invoice Found.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            <Row className="mt-2">
                                <Col xs={12}>
                                    <span className="align-middle" style={{ fontWeight: "bold" }}>
                                        {`Total Invoice : ${projects.length} | Selected : ${selectedProjectIds.length}`}
                                    </span>
                                </Col>
                                <Col xs={12} className="text-right">
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

export default Invoice