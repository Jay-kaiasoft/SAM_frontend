import React, { useMemo, useState } from "react";
import {Row, Col} from "reactstrap";
import { Link, Tab, Tabs } from "@mui/material";
import History from "../../../../history";
import { TabPanel, a11yProps, easUrlEncoder } from "../../../../assets/commonFunctions";
import { setGlobalAlertAction } from "../../../../actions/globalAlertActions";
import { connect } from "react-redux";
import DashboardData from "./dashboardData";
import ProductLinks from "./productLinks";
import Sources from "./sources";
import Members from "./members";

const EmailCampaignAutomationReport = ({location, globalAlert}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [value, setValue] = useState(0);
    const [memberData, setMemberData] = useState({});
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} className="mb-3">
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="d-flex align-items-center">
                                <div className="icon-wrapper mr-3">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { History.push(`/manageautomation`) }}>
                                        <i className="far fa-long-arrow-left"></i>
                                        <div className="bg-dark-grey"></div>
                                    </Link>
                                </div>
                                <h3>Email Campaign Automation Reports</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                            <Tabs
                                indicatorColor="primary"
                                value={value}
                                onChange={handleChange}
                                className="mt-2"
                                variant="fullWidth"
                            >
                                <Tab component={Link} to="" label="Dashboard" {...a11yProps(0)} />
                                <Tab component={Link} to="" label="Product Links" {...a11yProps(1)} />
                                <Tab component={Link} to="" label="Members" {...a11yProps(2)} />
                                <Tab component={Link} to="" label="Sources" {...a11yProps(3)} />
                            </Tabs>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TabPanel value={value} index={0}>
                                <DashboardData id={id} globalAlert={globalAlert} setMemberData={setMemberData} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ProductLinks id={id} globalAlert={globalAlert} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <Members memberData={memberData} globalAlert={globalAlert} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <Sources id={id} globalAlert={globalAlert} />
                            </TabPanel>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}

export default connect(null, mapDispatchToProps)(EmailCampaignAutomationReport);