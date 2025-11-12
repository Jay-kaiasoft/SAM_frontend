import React, { useMemo, useState } from 'react';
import { Link, Tab, Tabs } from "@mui/material";
import history from "../../../history";
import { Col, Row } from "reactstrap";
import { a11yProps, easUrlEncoder, TabPanel } from "../../../assets/commonFunctions";
import FacebookReport from "./facebookReport";
import TwitterReport from "./twitterReport";
import LinkedInReport from "./linkedInReport";

const SocialMediaReport = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const smId = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const encSsId = (typeof queryString.get("y") !== "undefined" && queryString.get("y") !== "" && queryString.get("y") !== null) ? queryString.get("y") : "";
    const [value, setValue] = useState(0);
    const [smName, setSmName] = useState("");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="d-flex align-items-center">
                    <div className="icon-wrapper mr-3">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { history.push("/managesocialmediareport?v=" + smId) }}>
                            <i className="far fa-long-arrow-left"></i>
                            <div className="bg-dark-grey"></div>
                        </Link>
                    </div>
                    <h3>Social Media Post Report</h3>
                </div>
                <h5>Social Media Name : {smName}</h5>
                <Row>
                    <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                        <Tabs
                            color="black"
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Facebook" {...a11yProps(0)} />
                            <Tab label="Twitter" {...a11yProps(1)} />
                            <Tab label="LinkedIn" {...a11yProps(2)} />
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TabPanel value={value} index={0}><FacebookReport smId={smId} encSsId={encSsId} setSmName={setSmName} /></TabPanel>
                        <TabPanel value={value} index={1}><TwitterReport smId={smId} encSsId={encSsId} setSmName={setSmName} /></TabPanel>
                        <TabPanel value={value} index={2}><LinkedInReport smId={smId} encSsId={encSsId} setSmName={setSmName} /></TabPanel>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default SocialMediaReport;