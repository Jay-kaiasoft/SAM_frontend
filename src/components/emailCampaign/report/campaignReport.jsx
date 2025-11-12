import React, { useMemo, useState } from "react"
import { Col, Row } from "reactstrap"
import { Link } from "@mui/material"
import History from "../../../history"
import { Tabs, Tab } from '@mui/material';
import Sources from "./regular/sources";
import Members from "./regular/members";
import ProductLinks from "./regular/productLinks";
import Dashboard from "./regular/dashboard";
import Analytics from "./regular/analytics";
import ABTestingDashboard from "./abTesting/dashboard"
import ABTestingProductLinks from "./abTesting/productLinks"
import ABTestingSources from "./abTesting/sources"
import ABTestingMembers from "./abTesting/members"
import { TabPanel, a11yProps, easUrlEncoder } from "../../../assets/commonFunctions";
import html2canvas from "html2canvas";
import { connect } from "react-redux";
import { setLoader } from "../../../actions/loaderActions";


const CampaignReport = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const campId = (typeof queryString.get("y") !== "undefined" && queryString.get("y") !== "" && queryString.get("y") !== null) ? queryString.get("y") : "";
    const { path } = props.match
    const type = path === "/campaignreport" ? 1 : 2;
    const [value, setValue] = useState(0);
    const [viewSelectedData, setViewSelectedData] = useState(0);
    const [isAnimated, setIsAnimated] = useState(true);

    const handleChange = (event, newValue) => {
        setIsAnimated(true);
        setViewSelectedData(0);
        setValue(newValue);
    };

    const handleClickPrint = () => {
        props.setLoader({
            load: true,
            text: "Please wait !!!"
        })
        if(type === 1){
            setValue(0);
            setIsAnimated(false);
            setTimeout(()=> {
                html2canvas(document.querySelector("#dashboard"), {
                    scrollX: 0,
                    scrollY: -window.scrollY
                }).then(canvas => {
                    sessionStorage.setItem("canvasData", canvas.toDataURL());
                    window.open(`/campaignreportpdf?v=${id}&y=${campId}`);
                    props.setLoader({
                        load: false
                    })
                });
            },1000);
        } else {
            setValue(0);
            setIsAnimated(false);
            setViewSelectedData(2);
            setTimeout(()=> {
                document.getElementById("dashboardAll").click();
                html2canvas(document.querySelector("#dashboard"), {
                    scrollX: 0,
                    scrollY: -window.scrollY
                }).then(canvas => {
                    sessionStorage.setItem("canvasData", canvas.toDataURL());
                    window.open(`/campaignreportpdfabtesting?v=${id}&y=${campId}`);
                    props.setLoader({
                        load: false
                    })
                });
            },1000);
        }
    }

    return (
        <Row className="midleMain">
            <Col xs={12}>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className="d-flex align-items-center">
                            <div className="icon-wrapper mr-3">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { History.push(`/managecampaignreport?v=${id}`) }}>
                                    <i className="far fa-long-arrow-left"></i>
                                    <div className="bg-dark-grey"></div>
                                </Link>
                            </div>
                            <h3>Email Campaign Reports</h3>
                            <Link component="a" className="btn-circle mx-5" data-toggle="tooltip" title="Print" onClick={() => { handleClickPrint() }}>
                                <i className="far fa-print"></i>
                                <div className="bg-dark-blue"></div>
                            </Link>
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
                            {type === 1 && <Tab component={Link} to="" label="Analytics" {...a11yProps(4)} />}
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TabPanel value={value} index={0}>
                            {type === 1 ? <Dashboard id={id} campId={campId} isAnimated={isAnimated} /> : <ABTestingDashboard id={id} campId={campId} isAnimated={isAnimated} viewSelectedData={viewSelectedData} />}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {type === 1 ? <ProductLinks id={id} campId={campId} /> : <ABTestingProductLinks id={id} campId={campId} />}
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            {type === 1 ? <Members id={id} campId={campId} /> : <ABTestingMembers id={id} campId={campId} />}
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            {type === 1 ? <Sources id={id} campId={campId} /> : <ABTestingSources id={id} campId={campId} />}
                        </TabPanel>
                        {type === 1 && <TabPanel value={value} index={4}>
                            <Analytics id={id} campId={campId} />
                        </TabPanel>}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}


export default connect(null, mapDispatchToProps)(CampaignReport);