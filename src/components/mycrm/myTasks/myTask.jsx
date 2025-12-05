import { Link } from '@mui/material';
import { Col, Row, Progress, Input, Table, InputGroup, Button } from 'reactstrap'

const MyTask = () => {
    const taskData = [
        {
            title: 'Assigned Tasks',
            count: '24',
            color: 'success', // Green
            progress: 70
        },
        {
            title: 'Finished Tasks',
            count: '12',
            color: 'warning', // Orange
            progress: 45
        },
        {
            title: 'On Hold Tasks',
            count: '09',
            color: 'primary', // Blue/Indigo
            progress: 30
        },
        {
            title: 'Terminated Tasks',
            count: '06',
            color: 'info', // Light Blue
            progress: 20
        },
    ]

    // --- NEW MOCK TABLE DATA ---
    // Creating repeating data to match the image appearance
    const tableRows = new Array(7).fill({
        ticketId: '100004',
        status: 'Open',
        subject: 'Need help with software installation',
        queue: 'Queue',
        client: 'Client',
        owner: 'Owner'
    });


    return (
        <>
            <h4 className="text-primary fw-bold mb-4">My Tasks</h4>
            <Row className="mb-4">
                {taskData?.map((item, index) => (
                    <Col xs={12} sm={12} md={6} lg={3} xl={3} key={index} className="mb-3 mb-lg-0">
                        <div className="p-4 rounded-lg h-100" style={{ background: "#F8F8F8" }}>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold text-dark">{item.title}</h5>
                                <h5 className="fw-bold text-dark">{item.count}</h5>
                            </div>

                            <Progress
                                color={item.color}
                                value={item.progress}
                                style={{ height: '5px' }}
                            />
                        </div>
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
                <div className="w-25">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" style={{ zIndex: 1 }}>
                        <i className="far fa-plus-square"></i>
                        <div className="bg-green"></div>
                    </Link>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit" style={{ zIndex: 1 }}>
                        <i className="far fa-pencil-alt"></i>
                        <div className="bg-blue"></div>
                    </Link>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" style={{ zIndex: 1 }}>
                        <i className="far fa-trash-alt"></i>
                        <div className="bg-red"></div>
                    </Link>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-end w-75" style={{ gap: 10 }}>
                    <span className="text-muted text-black fw-bold" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Pages 1 of 1</span>

                    <Input type="select" bsSize="sm" style={{ width: '60px', color: "black" }}>
                        <option>1</option>
                        <option>2</option>
                    </Input>

                    <Input type="select" bsSize="sm" style={{ width: '130px' }}>
                        <option>First Name</option>
                        <option>Last Name</option>
                    </Input>

                    <InputGroup size="sm" style={{ maxWidth: '200px' }}>
                        <Input placeholder="Search" />
                        <Button color="primary" className="d-flex align-items-center">
                            <i className="far fa-search"></i>
                        </Button>
                    </InputGroup>

                    <Button color="primary" size="sm" className="px-3">All</Button>
                    <Button outline color="primary" size="sm" className="px-3">Queue</Button>
                    <Button outline color="primary" size="sm" className="px-3">Bulk Action</Button>
                </div>
            </div>

            <div className="table-content-wrapper">
                <div className="contact-table-div table-responsive">
                    <Table striped hover className="align-middle mb-0 text-nowrap">
                        <thead style={{ backgroundColor: '#333333', color: '#ffffff' }}>
                            <tr>
                                <th className="text-center" style={{ width: '50px' }}>
                                    <Input type="checkbox" style={{ cursor: 'pointer' }} />
                                </th>
                                <th>Ticket Id</th>
                                <th>Status</th>
                                <th>Subject</th>
                                <th>Queue</th>
                                <th>Client</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <Input type="checkbox" style={{ cursor: 'pointer' }} />
                                    </td>
                                    <td className="fw-bold">{row.ticketId}</td>
                                    <td>{row.status}</td>
                                    <td>{row.subject}</td>
                                    <td>{row.queue}</td>
                                    <td>{row.client}</td>
                                    <td>{row.owner}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default MyTask