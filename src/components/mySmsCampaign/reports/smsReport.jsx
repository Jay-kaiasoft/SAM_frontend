import React, { useMemo, useState } from "react";
import {connect} from "react-redux";
import { Row, Col } from 'reactstrap';
import { Link, Tabs, Tab } from "@mui/material";
import {TabPanel, a11yProps, dateTimeFormat, tableToExcel, easUrlEncoder} from "../../../assets/commonFunctions";
import Overview from "./overview";
import Links from "./links";
import Unsubscribed from "./unsubscribed";
import DetailsView from "./detailsView";
import Replies from "./replies";
import history from "../../../history";
import CheckPermissionButton from "../../shared/commonControlls/checkPermissionButton";
import {getSmsCampaignsReportDataForPdf} from "../../../services/smsCampaignService";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import html2canvas from "html2canvas";

const SmsReport = ({location,globalAlert}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const smsId = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const csId = (typeof queryString.get("y") !== "undefined" && queryString.get("y") !== "" && queryString.get("y") !== null) ? queryString.get("y") : "";
    const [value, setValue] = useState(0);
    const [isAnimated, setIsAnimated] = useState(true);
    const handleChange = (event, newValue) => {
        setIsAnimated(true);
        setValue(newValue);
    };
    const handlePrint = () => {
        setIsAnimated(false);
        setValue(0);
        setTimeout(()=> {
            html2canvas(document.querySelector("#overview"), {
                scrollX: 0,
                scrollY: -window.scrollY
            }).then(canvas => {
                sessionStorage.setItem("canvasData", canvas.toDataURL());
                window.open(`/smscampaignreportpdf?v=${smsId}&y=${csId}`);
            });
        },2000);
    };
    const handleClickExcel = () => {
        let requestData = `csId=${csId}&smsId=${smsId}`;
        getSmsCampaignsReportDataForPdf(requestData).then(res => {
            if(res.status === 200){
                if (res.result) {
                    let table = `<table border="1">`;
                    table += `<tbody>`;
                    table += `<tr>`;
                    table += `<td align="center"><strong>${res.result.smsName}</strong></td>`;
                    table += `</tr>`;
                    table += `<tr><td></td></tr>`;
                    if(res.result.smsDeliveriesData.length > 0 || res.result.mmsDeliveriesData.length > 0){
                        table += `<tr>`;
                        table += `<td align="center"><strong>Deliveries</strong></td>`;
                        table += `</tr>`;
                        table += `<tr><td></td></tr>`;
                        if(res.result.smsDeliveriesData.length > 0){
                            table += `<tr>`;
                            table += `<td align="center"><strong>SMS</strong></td>`;
                            table += `</tr>`;
                            table += `<tr>`;
                            table += `<td>`;
                            table += `<table border="1">`;
                            table += `<thead>`;
                            table += `<tr>`;
                            table += `<th>No</th>`;
                            table += `<th>First Name</th>`;
                            table += `<th>Last Name</th>`;
                            table += `<th>Contact</th>`;
                            table += `<th>Date</th>`;
                            table += `</tr>`;
                            table += `</thead>`;
                            table += `<tbody>`;
                            res.result.smsDeliveriesData.forEach((value, index) => {
                                table += `<tr>`;
                                table += `<td>${index + 1}</td>`;
                                table += `<td>${value.firstName}</td>`;
                                table += `<td>${value.lastName}</td>`;
                                table += `<td>${value.contact}</td>`;
                                table += `<td>${dateTimeFormat(value.date)}</td>`;
                                table += `</tr>`;
                            });
                            table += `</tbody>`;
                            table += `</table>`;
                            table += `</td>`;
                            table += `</tr>`;
                        }
                        if(res.result.mmsDeliveriesData.length > 0){
                            table += `<tr>`;
                            table += `<td align="center"><strong>MMS</strong></td>`;
                            table += `</tr>`;
                            table += `<tr>`;
                            table += `<td>`;
                            table += `<table border="1">`;
                            table += `<thead>`;
                            table += `<tr>`;
                            table += `<th>No</th>`;
                            table += `<th>First Name</th>`;
                            table += `<th>Last Name</th>`;
                            table += `<th>Contact</th>`;
                            table += `<th>Date</th>`;
                            table += `</tr>`;
                            table += `</thead>`;
                            table += `<tbody>`;
                            res.result.mmsDeliveriesData.forEach((value, index) => {
                                table += `<tr>`;
                                table += `<td>${index + 1}</td>`;
                                table += `<td>${value.firstName}</td>`;
                                table += `<td>${value.lastName}</td>`;
                                table += `<td>${value.contact}</td>`;
                                table += `<td>${dateTimeFormat(value.date)}</td>`;
                                table += `</tr>`;
                            });
                            table += `</tbody>`;
                            table += `</table>`;
                            table += `</td>`;
                            table += `</tr>`;
                        }
                    }
                    if(res.result.unDeliveredSmsData.length > 0){
                        table += `<tr><td></td></tr>`;
                        table += `<tr>`;
                        table += `<td align="center"><strong>Undelivered</strong></td>`;
                        table += `</tr>`;
                        table += `<tr>`;
                        table += `<td>`;
                        table += `<table border="1">`;
                        table += `<thead>`;
                        table += `<tr>`;
                        table += `<th>No</th>`;
                        table += `<th>First Name</th>`;
                        table += `<th>Last Name</th>`;
                        table += `<th>Contact</th>`;
                        table += `<th>Date</th>`;
                        table += `</tr>`;
                        table += `</thead>`;
                        table += `<tbody>`;
                        res.result.unDeliveredSmsData.forEach((value, index) => {
                            table += `<tr>`;
                            table += `<td>${index + 1}</td>`;
                            table += `<td>${value.firstName}</td>`;
                            table += `<td>${value.lastName}</td>`;
                            table += `<td>${value.contact}</td>`;
                            table += `<td>${dateTimeFormat(value.date)}</td>`;
                            table += `</tr>`;
                        });
                        table += `</tbody>`;
                        table += `</table>`;
                        table += `</td>`;
                        table += `</tr>`;
                    }
                    if(res.result.notSentSmsData.length > 0){
                        table += `<tr><td></td></tr>`;
                        table += `<tr>`;
                        table += `<td align="center"><strong>Not Send</strong></td>`;
                        table += `</tr>`;
                        table += `<tr>`;
                        table += `<td>`;
                        table += `<table border="1">`;
                        table += `<thead>`;
                        table += `<tr>`;
                        table += `<th>No</th>`;
                        table += `<th>First Name</th>`;
                        table += `<th>Last Name</th>`;
                        table += `<th>Contact</th>`;
                        table += `<th>Date</th>`;
                        table += `</tr>`;
                        table += `</thead>`;
                        table += `<tbody>`;
                        res.result.notSentSmsData.forEach((value, index) => {
                            table += `<tr>`;
                            table += `<td>${index + 1}</td>`;
                            table += `<td>${value.firstName}</td>`;
                            table += `<td>${value.lastName}</td>`;
                            table += `<td>${value.contact}</td>`;
                            table += `<td>${dateTimeFormat(value.date)}</td>`;
                            table += `</tr>`;
                        });
                        table += `</tbody>`;
                        table += `</table>`;
                        table += `</td>`;
                        table += `</tr>`;
                    }
                    if(res.result.linksData.length > 0){
                        table += `<tr><td></td></tr>`;
                        table += `<tr>`;
                        table += `<td align="center"><strong>Links</strong></td>`;
                        table += `</tr>`;
                        table += `<tr>`;
                        table += `<td>`;
                        table += `<table border="1">`;
                        table += `<thead>`;
                        table += `<tr>`;
                        table += `<th>No</th>`;
                        table += `<th>Link Name</th>`;
                        table += `<th>Main Link</th>`;
                        table += `<th>Link Click</th>`;
                        table += `</tr>`;
                        table += `</thead>`;
                        table += `<tbody>`;
                        res.result.linksData.forEach((value, index) => {
                            table += `<tr>`;
                            table += `<td valign="top">${index + 1}</td>`;
                            table += `<td valign="top">${value.linkName}</td>`;
                            table += `<td valign="top">${value.mainLink}</td>`;
                            table += `<td valign="top" align="center">${value.linkCount}</td>`;
                            table += `</tr>`;
                        });
                        table += `</tbody>`;
                        table += `</table>`;
                        table += `</td>`;
                        table += `</tr>`;
                    }
                    if(res.result.unsubscribedData.length > 0){
                        table += `<tr><td></td></tr>`;
                        table += `<tr>`;
                        table += `<td align="center"><strong>Unsubscribed</strong></td>`;
                        table += `</tr>`;
                        table += `<tr>`;
                        table += `<td>`;
                        table += `<table border="1">`;
                        table += `<thead>`;
                        table += `<tr>`;
                        table += `<th>No</th>`;
                        table += `<th>First Name</th>`;
                        table += `<th>Last Name</th>`;
                        table += `<th>Contact</th>`;
                        table += `<th>Date</th>`;
                        table += `</tr>`;
                        table += `</thead>`;
                        table += `<tbody>`;
                        res.result.unsubscribedData.forEach((value, index) => {
                            table += `<tr>`;
                            table += `<td>${index + 1}</td>`;
                            table += `<td>${value.firstName}</td>`;
                            table += `<td>${value.lastName}</td>`;
                            table += `<td>${value.contact}</td>`;
                            table += `<td>${dateTimeFormat(value.date)}</td>`;
                            table += `</tr>`;
                        });
                        table += `</tbody>`;
                        table += `</table>`;
                        table += `</td>`;
                        table += `</tr>`;
                    }
                    if(res.result.repliesSms.length > 0){
                        table += `<tr><td></td></tr>`;
                        table += `<tr>`;
                        table += `<td align="center"><strong>SMS Replies</strong></td>`;
                        table += `</tr>`;
                        table += `<tr>`;
                        table += `<td>`;
                        table += `<table border="1">`;
                        table += `<thead>`;
                        table += `<tr>`;
                        table += `<th>No</th>`;
                        table += `<th>First Name</th>`;
                        table += `<th>Last Name</th>`;
                        table += `<th>Contact</th>`;
                        table += `<th>Date</th>`;
                        table += `<th>Details</th>`;
                        table += `</tr>`;
                        table += `</thead>`;
                        table += `<tbody>`;
                        res.result.repliesSms.forEach((value, index) => {
                            table += `<tr>`;
                            table += `<td>${index + 1}</td>`;
                            table += `<td>${value.firstName}</td>`;
                            table += `<td>${value.lastName}</td>`;
                            table += `<td>${value.contact}</td>`;
                            table += `<td>${dateTimeFormat(value.date)}</td>`;
                            table += `<td>${value.details}</td>`;
                            table += `</tr>`;
                        });
                        table += `</tbody>`;
                        table += `</table>`;
                        table += `</td>`;
                        table += `</tr>`;
                    }
                    table += `</tbody>`;
                    table += `</table>`;
                    tableToExcel(table, "Work Sheet 1", `smscampaignreport.xls`);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    return (
        <Row className="midleMain">
            <Col xs={12}>
                <Row>
                    <Col xs={12}>
                        <div className="d-flex align-items-center">
                            <div className="icon-wrapper mr-3">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={() => { history.push(`/managesmsreport?v=${smsId}`) }}>
                                    <i className="far fa-long-arrow-left"></i>
                                    <div className="bg-dark-grey"></div>
                                </Link>
                            </div>
                            <h3>SMS/MMS Campaign Report</h3>
                            <div className="icon-wrapper d-inline-block mx-5">
                                <CheckPermissionButton module="sms campaign" action="print">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Print" onClick={handlePrint}>
                                        <i className="far fa-print"></i>
                                        <div className="bg-dark-blue"></div>
                                    </Link>
                                </CheckPermissionButton>
                                <CheckPermissionButton module="sms campaign" action="print">
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export To Excel" onClick={() => {handleClickExcel()}}>
                                        <i className="far fa-file-excel"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </CheckPermissionButton>
                            </div>
                        </div>
                    </Col>
                </Row>
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
                            <Tab label="Overview" {...a11yProps(0)} />
                            <Tab label="Links" {...a11yProps(1)} />
                            <Tab label="Unsubscribed" {...a11yProps(2)} />
                            <Tab label="Replies" {...a11yProps(3)} />
                            <Tab label="Details View" {...a11yProps(4)} />
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TabPanel value={value} index={0}><Overview csId={csId} smsId={smsId} isAnimated={isAnimated} /></TabPanel>
                        <TabPanel value={value} index={1}><Links csId={csId} smsId={smsId}/></TabPanel>
                        <TabPanel value={value} index={2}><Unsubscribed csId={csId} smsId={smsId}/></TabPanel>
                        <TabPanel value={value} index={3}><Replies csId={csId} smsId={smsId}/></TabPanel>
                        <TabPanel value={value} index={4}><DetailsView csId={csId} smsId={smsId}/></TabPanel>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(SmsReport);