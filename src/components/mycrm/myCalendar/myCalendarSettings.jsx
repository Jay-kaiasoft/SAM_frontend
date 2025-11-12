import React, { useState} from 'react';
import {Col, Row} from "reactstrap";
import {Link, Tab, Tabs} from "@mui/material";
import {a11yProps, TabPanel} from "../../../assets/commonFunctions";
import history from "../../../history";
import AppointmentEvents from "./appointment/appointmentEvents";
import Availability from "./appointment/availability";
import GeneralSettings from "./appointment/generalSettings";

const MyCalendarSettings = ()=>{
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Row className="midleMain">
                <Col xs={12}>
                    <Row>
                        <Col xs={12}>
                            <div className="d-flex align-items-center">
                                <div className="icon-wrapper mr-3">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={()=>{history.push("/mycalendar")}}>
                                        <i className="far fa-long-arrow-left"></i>
                                        <div className="bg-dark-grey"></div>
                                    </Link>
                                </div>
                                <h3>My Calendar Settings</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex mt-3">
                            <Tabs
                                orientation="vertical"
                                color="black"
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab {...a11yProps(0)} label="Appointment Event Type"/>
                                <Tab {...a11yProps(1)} label="Availability"/>
                                <Tab {...a11yProps(2)} label="General Settings"/>
                            </Tabs>
                            <TabPanel value={value} index={0} className="w-100">
                                <AppointmentEvents/>
                            </TabPanel>
                            <TabPanel value={value} index={1} className="w-100">
                                <Availability/>
                            </TabPanel>
                            <TabPanel value={value} index={2} className="w-100">
                                <GeneralSettings/>
                            </TabPanel>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
export default MyCalendarSettings;
