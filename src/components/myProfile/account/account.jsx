import React, { Fragment, Suspense, lazy } from 'react';
import { Row, Col } from 'reactstrap';
import { Tabs, Tab } from '@mui/material';
import { TabPanel, a11yProps } from "../../../assets/commonFunctions";
import Loader from '../../shared/loaderV2/loader.jsx';
const UnInvoiced = lazy(() => import("../account/uninvoiced.jsx"))
const Invoice = lazy(() => import("../account/invoice.jsx"))
const DeleteAccount = lazy(() => import("../account/deleteAccount.jsx"))

const Account = (props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center'>Account</h3>
                </Col>
                <Col sm="12" md={{ size: 4, offset: 4 }} className='text-center'>
                    <img alt="sealserver" src="https://sealserver.trustwave.com/seal_image.php?customerId=ded751cddc1046b69288437788ee373b&size=105x54&style=invert" />
                    <img alt="authorize" className="pl-3" src="https://verify.authorize.net/anetseal/images/secure90x72.gif" />
                </Col>
            </Row>
            <Row>
                <Col xs={8} sm={8} md={6} lg={6} xl={6}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Uninvoiced" {...a11yProps(0)} />
                        <Tab label="Invoice" {...a11yProps(1)} />
                        <Tab label="Delete Account" {...a11yProps(2)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TabPanel value={value} index={0}>
                        <Suspense fallback={<Loader />}>
                            <UnInvoiced />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Suspense fallback={<Loader />}>
                            <Invoice />
                        </Suspense>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Suspense fallback={<Loader />}>
                            <DeleteAccount />
                        </Suspense>
                    </TabPanel>
                </Col>
            </Row>
        </Fragment>
    )
}
export default Account;