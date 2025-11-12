import React, { Fragment, Suspense, lazy } from 'react';
import { Tabs, Tab, Link } from '@mui/material';
import { Row, Col } from 'reactstrap';
import History from "../../history";
import { TabPanel, a11yProps } from "../../assets/commonFunctions";
import Loader from '../shared/loaderV2/loader.jsx';
const SubAcountsList = lazy(() => import("./sabAccountList.jsx"))
const SubAccountTypeList = lazy(() => import("./subAccountTypeList.jsx"))

const ManageUsers = (props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        if (newValue === 0) {
            document.getElementById("add").setAttribute("data-original-title", "Add Sub-Accounts");
        } else {
            document.getElementById("add").setAttribute("data-original-title", "Add Sub-Accounts Type");
        }
        setValue(newValue);
    };

    return (
        <Fragment>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h3 className="d-inline-block mb-0 align-middle">Manage Sub-Accounts</h3>
                            <div className="icon-wrapper d-inline-block mx-5">
                                <Link id="add" component="a" className="btn-circle" data-toggle="tooltip" title="Add Sub-Accounts" onClick={() => { value === 0 ? History.push('/subaccount') : History.push('/subaccounttype') }}>
                                    <i className="far fa-plus-square"></i>
                                    <div className="bg-green"></div>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Tabs
                                color="black"
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Sub-Accounts" {...a11yProps(0)} />
                                <Tab label="Sub-Accounts Type" {...a11yProps(1)} />

                            </Tabs>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="rightTabs">
                            <TabPanel value={value} index={0}>
                                <Suspense fallback={<Loader />}>
                                    <SubAcountsList />
                                </Suspense>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Suspense fallback={<Loader />}>
                                    <SubAccountTypeList />
                                </Suspense>
                            </TabPanel>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    )
}
export default ManageUsers;