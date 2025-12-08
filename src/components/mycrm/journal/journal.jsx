import {
    Divider,
    Typography,
    Table,   
    TextField,
    IconButton,
    Stack,
    Link
} from '@mui/material';
import { Col, Input, Row } from 'reactstrap';

const timeSlots = [
    "6am - 7am", "7am - 8am", "8am - 9am", "9am - 10am",
    "10am - 11am", "11am - 12pm", "12pm - 1pm", "1pm - 2pm",
    "2pm - 3pm", "3pm - 4pm", "4pm - 5pm", "5pm - 6pm",
];

const tasks = [
    { id: 38, projectName: "Digital Marketing", assignDate: "13/08/2023" },
    { id: 48, projectName: "Social Media Marketing", assignDate: "15/08/2023" },
];

const Journal = () => {
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-4 p-md-0">
                <h4 className="fw-bold">Today's Journal</h4>

                <div className='my-3'>
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

                <Row>
                    <Col xs={12} lg={7} className="mb-4 mb-lg-0">
                        <div>
                            <div className="d-flex align-items-center mb-2" style={{ gap: 20 }}>
                                <Typography variant="body1" fontWeight={600}>
                                    Today
                                </Typography>
                                <Stack direction="row" alignItems="center">
                                    <IconButton size="small">
                                        <i className="fas fa-chevron-left text-black" style={{ fontSize: '14px' }}></i>
                                    </IconButton>

                                    <Typography variant="body2" sx={{ mx: 1, fontWeight: 600 }}>
                                        AUG 14, 2023
                                    </Typography>

                                    <IconButton size="small">
                                        <i className="fas fa-chevron-right text-black" style={{ fontSize: '14px' }}></i>
                                    </IconButton>

                                    <IconButton size="small">
                                        <i className="fas fa-chevron-down text-black" style={{ fontSize: '14px' }}></i>
                                    </IconButton>
                                </Stack>
                            </div>
                            <Divider />

                            <div
                                style={{
                                    overflowY: "auto",
                                    paddingRight: '10px'
                                }}
                            >
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot}
                                        style={{
                                            padding: "12px 0",
                                            borderBottom: "1px solid #e0e0e0",
                                            fontSize: 14,
                                            fontWeight: 600
                                        }}
                                    >
                                        {slot}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} lg={5} className="pl-lg-4">
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Tasks
                        </Typography>
                        <div className="table-content-wrapper mb-4">
                            <div className="contact-table-div">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: 40 }}>
                                                <Input type="checkbox" />
                                            </th>
                                            <th>Id</th>
                                            <th>Project Name</th>
                                            <th>Assign Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.length ? tasks.map((p, i) => (
                                            <tr key={i}>
                                                <td align="center">
                                                    <Input type="checkbox" />
                                                </td>
                                                <td>{p.id}</td>
                                                <td>{p.projectName}</td>
                                                <td>{p.assignDate}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={7} className="text-center">No Task Found.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        {/* --- Sales Targets Section --- */}
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Sales Targets
                        </Typography>
                        <TextField
                            id="sales-targets"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 4, backgroundColor: '#fff' }}
                        />

                        {/* --- Notes Section --- */}
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Notes
                        </Typography>
                        <TextField
                            id="notes"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Journal;