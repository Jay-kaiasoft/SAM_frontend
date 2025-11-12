import React from 'react';
import {Col, Row} from "reactstrap";
import {Tab, Tabs, Link} from "@mui/material";
import History from "../../history";
import ManageBuildItForMeOrder from "../buildItforme/manageBuildItForMeOrder";
import ManageBuildItForMeApproval from "../buildItforme/manageBuildItForMeApproval";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import {TabPanel, a11yProps} from "../../assets/commonFunctions";

const BuildItForMe = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const addBuildItForMe = ()=>{
        History.push("/buildbuilditforme");
    }
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="d-inline-block mb-0 align-middle">Build It For Me</h3> 
                    <div className="icon-wrapper d-inline-block mx-5">
                        <CheckPermissionButton module="build it for me" action="add">
                            <Link 
                                component="a" 
                                className="btn-circle" 
                                data-toggle="tooltip" 
                                title="Add"
                                onClick={addBuildItForMe}
                            >
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </CheckPermissionButton>
                    </div>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Order" {...a11yProps(0)} />
                        <Tab label="Request For Approval" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        <ManageBuildItForMeOrder/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ManageBuildItForMeApproval/>
                    </TabPanel>
                </Col>
            </Row>
        </>
    );
}

export default BuildItForMe;