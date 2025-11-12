import React, { useCallback, useEffect, useState, useRef, useMemo, Fragment } from 'react';
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import ChartJs from '../shared/chartJsComponent/chartJs';
import { v4 as uuidv4 } from 'uuid';
import { websiteColor, websiteSmallTitleWithExt } from '../../config/api';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dateFilterData, dateFormat, getColors, normalizeUrl } from '../../assets/commonFunctions';
import { getDashBoardComboList, getDashboardData, getMinuteActiveUsers } from '../../services/analyticsService';
import History from '../../history';
import WorldMap from 'react-svg-worldmap';

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return Number.isInteger(value) ? value : null;
                }
            },
            grid: {
                display: false,
            }
        },
        x: {
            offset: true,
            ticks: {
                autoSkip: true,
                maxTicksLimit: 7
            },
            grid: {
                display: false,
            }
        }
    },
}
const MAX_BARS = 30;
const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: {
            grid: { display: false, drawBorder: false, drawOnChartArea: false, drawTicks: true, },
        },
        y: {
            display: false,
            grid: { display: false, drawBorder: false },
        }
    }
}
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        // tooltip: { enabled: false  },
    },
}

const DashboardAnalytics = ({ analyticsWebId, globalAlert }) => {
    const [filterData, setFilterData] = useState({"dateFilter": "LAST_7_DAYS", "startDate": new Date(new Date().setDate(new Date().getDate() - 7)), "endDate": new Date(), "showToActiveUsers": "country", "selectedDomain": "All", "selectedCountry": "All", "selectedUserType": "All"});
    const [lineChartData, setLineChartData] = useState([]);
    const [barChartData, setBarChartData] = useState(Array(MAX_BARS).fill(0));
    const [pieChartData, setPieChartData] = useState([]);
    const [worldMapData, setWorldMapData] = useState([]);
    const [activeUserData, setActiveUserData] = useState({});
    const [activeUserTotal, setActiveUserTotal] = useState(0);
    const [aggregatedData, setAggregatedData] = useState({});
    const [selectedAggregatedDataView, setSelectedAggregatedDataView] = useState("uniqueVisitorsChartData");
    const [tc, setTc] = useState([]);
    const [referrerData, setReferrerData] = useState({});
    const [dashBoardComboList, setDashBoardComboList] = useState({});
    const lineChartCounter = useRef(uuidv4());
    const barChartCounter = useRef(uuidv4());
    const pieChartCounter = useRef(uuidv4());
    let callCount = useRef(1);
    const [modalReferrerLink, setModalReferrerLink] = useState(false);
    const toggleReferrerLink = () => setModalReferrerLink(!modalReferrerLink);

    const handleFilterDataChange = (name, value) => {
        setFilterData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const displayActiveUsers = useCallback(() => {
        if(analyticsWebId){
            let requestData = {
                "websiteId": analyticsWebId,
                "dateFilterType": filterData.dateFilter,
                "startDate": dateFormat(filterData.startDate),
                "endDate": dateFormat(filterData.endDate),
                "countryFilter": filterData.selectedCountry,
                "domainFilter": filterData.selectedDomain,
                "userFilter": filterData.selectedUserType
            }
            getDashboardData(requestData).then((response) => {
                if (response.status === 200) {
                    setLineChartData(response.result.chartData);
                    setAggregatedData(response.result.cardData);
                    const merged = Object.values(
                        response?.result?.pageData?.reduce((acc, item) => {
                            const normalized = normalizeUrl(item.page_url);
                            if (!acc[normalized]) {
                                acc[normalized] = { page_url: normalized, count: 0 };
                            }
                            acc[normalized].count += item.count;
                            return acc;
                        }, {})
                    );
                    const finalMerged = merged
                        .map(({ page_url, count }) => ({ page_url, count }))
                        .sort((a, b) => b.count - a.count);
                    setPieChartData(finalMerged || []);
                    const allReferrers = response?.result?.pageData?.flatMap(item => item.referrers);
                    const emptyCount = allReferrers.filter(r => r === "").length;
                    const referrerCount = allReferrers.filter(r => r !== "" && !r.includes(websiteSmallTitleWithExt)).length;
                    const validReferrers = allReferrers.filter(r => r && r.trim() !== "" && !r.includes(websiteSmallTitleWithExt));
                    const cleanedReferrers = validReferrers.map(r => r.split("?")[0]);
                    const refCountMap = cleanedReferrers.reduce((acc, url) => {
                        acc[url] = (acc[url] || 0) + 1;
                        return acc;
                    }, {});
                    const uniqueReferrers = Object.entries(refCountMap)
                        .map(([url, count]) => ({ url, count }))
                        .sort((a, b) => b.count - a.count);
                    setReferrerData({ emptyCount, referrerCount, uniqueReferrers });
                    setTc(getColors(response?.result?.pageData?.length || 0));
                    setWorldMapData(response?.result?.countryData?.filter(item => item.country !== null) || []);
                } else {
                    globalAlert({
                        type: "Error",
                        text: response.message,
                        open: true
                    });
                }
            });
        }
    }, [analyticsWebId, filterData]);
    const displayMinuteActiveUsers = useCallback(() => {
        if(analyticsWebId){
            let requestData = {
                "websiteId": analyticsWebId,
                "timeStamp": new Date().getTime(),
                "callCount": callCount.current
            }
            getMinuteActiveUsers(requestData).then((response) => {
                if (response.status === 200) {
                    setBarChartData(prev => {
                        const newArr = prev.slice(1).concat(response.result.activeUsersCount);
                        return newArr;
                    });
                    setActiveUserData(response.result.activeUsersData);
                    let temp = 0;
                    if(Object.keys(response.result.activeUsersData).length > 0) {
                        Object.entries(response.result.activeUsersData.country || {}).map(([key, value]) => (
                            temp += value
                        ))
                    }
                    setActiveUserTotal(temp);
                    callCount.current += 1;
                } else {
                    globalAlert({
                        type: "Error",
                        text: response.message,
                        open: true
                    });
                }
            });
        }
    }, [analyticsWebId]);
    const createLineDataObject = (data) => {
        return {
            labels: data?.[selectedAggregatedDataView]?.map((e) => Object.keys(e)[0]),
            datasets: [{
                label: '',
                data: data?.[selectedAggregatedDataView]?.map((e) => Object.values(e)[0]),
                fill: false,
                borderColor: websiteColor,
                tension: 0
            }]
        };
    }
    const createBarDataObject = (dataArr) => {
        return {
            labels: Array(MAX_BARS).fill(''),
            datasets: [{
                label: '',
                data: dataArr,
                backgroundColor: websiteColor,
                borderWidth: 0
            }]
        };
    }
    const createPieDataObject = (dataValue) => {
        return {
            labels: dataValue?.map((e) => e.page_url),
            datasets: [{
                label: '',
                data: dataValue?.map((e) => e.count),
                backgroundColor: getColors(dataValue?.length),
                borderWidth:0
            }]
        };
    }

    const memoizedBarChartData = useMemo(() => createBarDataObject(barChartData), [barChartData]);
    const memoizedLineChartData = useMemo(() => createLineDataObject(lineChartData), [lineChartData, selectedAggregatedDataView]);
    const memoizedPieChartData = useMemo(() => createPieDataObject(pieChartData), [pieChartData]);

    useEffect(()=>{
        displayActiveUsers();
    }, [displayActiveUsers]);
    useEffect(() => {
        let interval = null;
        if(interval === null){
            displayMinuteActiveUsers();
        }
        interval = setInterval(() => {
            displayMinuteActiveUsers();
        }, 60 * 1000);
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    }, [displayMinuteActiveUsers]);
    useEffect(() => {
        if(analyticsWebId){
            getDashBoardComboList(analyticsWebId).then((response) => {
                if (response.status === 200) {
                    let tempDomainList = response.result?.domainList || [];
                    tempDomainList = ["All", ...tempDomainList];
                    tempDomainList = tempDomainList.sort();
                    let tempCountryList = response.result?.countryList || [];
                    tempCountryList = ["All", ...tempCountryList];
                    tempCountryList = tempCountryList.sort();
                    setDashBoardComboList({domainList: tempDomainList, countryList: tempCountryList});
                } else {
                    globalAlert({
                        type: "Error",
                        text: response.message,
                        open: true
                    });
                }
            });
        }
    }, [analyticsWebId]);

    return (
        typeof analyticsWebId === 'undefined' || analyticsWebId === null || analyticsWebId === "" ? (
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className='mx-auto d-flex justify-content-center align-items-center'>
                    <Paper className='p-3'>
                        <h5>Use SAMAI Analytics with Your Website</h5>
                        <p>SAMAI Analytics allows you to collect powerful real-time and historical user interaction data from your website. It helps you track campaign ROI and uncover meaningful insights into customer engagement on your platform.</p>
                        <p>With SAMAI Analytics, you’re not just tracking page views—you’re connecting website behavior to campaign ROI:</p>
                        <div className="table-content-wrapper">
                            <Table striped className="table-layout-fixed">
                                <thead>
                                    <tr>
                                        <th style={{width: "30%", backgroundColor:"#6b29d5"}}>Campaign Type</th>
                                        <th style={{width: "70%", backgroundColor:"#6b29d5"}}>What You Can Track</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Email</td>
                                        <td>See which emails lead to website visits & conversions</td>
                                    </tr>
                                    <tr>
                                        <td>Survey</td>
                                        <td>Track completions and where survey participants came from</td>
                                    </tr>
                                    <tr>
                                        <td>Social Media</td>
                                        <td>Measure traffic and engagement from each platform</td>
                                    </tr>
                                    <tr>
                                        <td>Assessments</td>
                                        <td>Analyze quiz/assessment completion and drop-off</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <p className='font-weight-bold mt-5'>Step 1 : Add Domain</p>
                        <p>This guide walks you through how to add your website, install the tracking code, and view live and historical data via the SAMAI dashboard.</p>
                        <p>1. Click the <i className='far fa-plus-square'></i> Plus button next to the website list.</p>
                        <p>2. Enter your website domain (e.g., www.yourcompany.com) and click Save.</p>
                        <p>Note : If your domain name isn’t listed in the dropdown, go to the <span onClick={() => {History.push("/domainemailverification");}} className='font-weight-bold cursor-pointer'>Domain and Email Verification</span> section to add it. Once added, return to this section to see it in the list.</p>
                        <p className='font-weight-bold mt-5'>Step 2 : Add the Analytics Tag to Your Website</p>
                        <p>Once your website is added, copy the custom code snippet you were given and paste it into the <code>&lt;head&gt;</code> section of every website page you want to track on your website.</p>
                        <p className='font-weight-bold mt-5'>Step 3 : See Your Data in SAMAI Analytics</p>
                        <p>Once installed, return to the SAMAI dashboard and open My Analytics to see customer behavior.</p>
                    </Paper>
                </Col>
            </Row>
        ) : (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className='mb-3'>
                    <Paper className='p-3 h-100'>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="select-domain-label">Select Domain</InputLabel>
                                    <Select
                                        labelId="select-domain-label"
                                        name="selectedDomain"
                                        label="Select Domain"
                                        value={filterData?.selectedDomain}
                                        onChange={(event) => { handleFilterDataChange("selectedDomain", event.target.value); }}
                                        fullWidth
                                    >
                                        {
                                            dashBoardComboList?.domainList?.map((filter, index) => (
                                                <MenuItem key={index} value={filter}>{filter}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="select-user-type-label">Select User Type</InputLabel>
                                    <Select
                                        labelId="select-user-type-label"
                                        name="selectedUserType"
                                        label="Select User Type"
                                        value={filterData?.selectedUserType}
                                        onChange={(event) => { handleFilterDataChange("selectedUserType", event.target.value); }}
                                        fullWidth
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="Identified">Identified</MenuItem>
                                        <MenuItem value="Unknown">Anonymous</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="select-country-label">Select Country</InputLabel>
                                    <Select
                                        labelId="select-country-label"
                                        name="selectedCountry"
                                        label="Select Country"
                                        value={filterData?.selectedCountry}
                                        onChange={(event) => { handleFilterDataChange("selectedCountry", event.target.value); }}
                                        fullWidth
                                    >
                                        {
                                            dashBoardComboList?.countryList?.map((filter, index) => (
                                                <MenuItem key={index} value={filter}>{filter}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} className='d-flex align-items-end'>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="dateFilter">Date Filter</InputLabel>
                                    <Select
                                        name="dateFilter"
                                        variant="standard"
                                        value={filterData?.dateFilter}
                                        onChange={(event) => { handleFilterDataChange("dateFilter", event.target.value); }}
                                        fullWidth
                                    >
                                        {
                                            dateFilterData.map((filter, index) => (
                                                <MenuItem key={index} value={filter.value}>{filter.label}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col xs={12} sm={12} md={8} lg={8} xl={8} className='d-flex'>
                                {filterData?.dateFilter === 'CUSTOM' && (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={filterData?.startDate}
                                            label="Start Date"
                                            inputFormat="MM/dd/yyyy"
                                            onChange={(date) => { handleFilterDataChange("startDate", date); }}
                                            slotProps={{ textField: { variant: "standard", fullWidth: true } }}
                                            maxDate={filterData?.endDate || new Date()}
                                        />
                                        <DatePicker
                                            value={filterData?.endDate}
                                            label="End Date"
                                            className='ml-4'
                                            inputFormat="MM/dd/yyyy"
                                            onChange={(date) => { handleFilterDataChange("endDate", date); }}
                                            slotProps={{ textField: { variant: "standard", fullWidth: true } }}
                                            minDate={filterData?.startDate}
                                            maxDate={new Date()}
                                            fullWidth
                                        />
                                    </LocalizationProvider>
                                )}
                            </Col>
                        </Row>
                    </Paper>
                </Col>
                <Col xs={12} sm={12} md={7} lg={7} xl={7}>
                    <Paper className='p-3 h-100'>
                        <div style={{height: '49vh'}}>
                            <ChartJs counter={lineChartCounter.current} type={"line"} data={memoizedLineChartData} options={lineChartOptions} />
                        </div>
                        <Row className='mt-3'>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <div className={`${selectedAggregatedDataView !== "visitsChartData" ? "border" : ""} d-flex align-items-center justify-content-center flex-column p-2 cursor-pointer`} onClick={() => setSelectedAggregatedDataView("visitsChartData")} style={selectedAggregatedDataView === "visitsChartData" ? {border: `1px solid ${websiteColor}`} : {}}>
                                    <p>Visits</p>
                                    <p className='mb-0'>{aggregatedData?.visits || 0}</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <div className={`${selectedAggregatedDataView !== "uniqueVisitorsChartData" ? "border" : ""} d-flex align-items-center justify-content-center flex-column p-2 cursor-pointer`} onClick={() => setSelectedAggregatedDataView("uniqueVisitorsChartData")} style={selectedAggregatedDataView === "uniqueVisitorsChartData" ? {border: `1px solid ${websiteColor}`} : {}}>
                                    <p>Unique Visitors</p>
                                    <p className='mb-0'>{aggregatedData?.uniqueVisitors || 0}</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <div className={`${selectedAggregatedDataView !== "pageViewsChartData" ? "border" : ""} d-flex align-items-center justify-content-center flex-column p-2 cursor-pointer`} onClick={() => setSelectedAggregatedDataView("pageViewsChartData")} style={selectedAggregatedDataView === "pageViewsChartData" ? {border: `1px solid ${websiteColor}`} : {}}>
                                    <p>Page Views</p>
                                    <p className='mb-0'>{aggregatedData?.pageViews || 0}</p>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <div className={`${selectedAggregatedDataView !== "pagePerVisitsChartData" ? "border" : ""} d-flex align-items-center justify-content-center flex-column p-2 cursor-pointer`} onClick={() => setSelectedAggregatedDataView("pagePerVisitsChartData")} style={selectedAggregatedDataView === "pagePerVisitsChartData" ? {border: `1px solid ${websiteColor}`} : {}}>
                                    <p>Page Per Visit</p>
                                    <p className='mb-0'>{aggregatedData?.pagePerVisits || 0}</p>
                                </div>
                            </Col>
                        </Row>
                    </Paper>
                </Col>
                <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                    <Paper className='p-3 h-100'>
                        <h5 className='mb-4'>Active users in last 30 minutes : {activeUserTotal}</h5>
                        <p>Active users per minute</p>
                        <div style={{height: '70px'}}>
                            <ChartJs counter={barChartCounter.current} type={"bar"} data={memoizedBarChartData} options={barChartOptions} isBreakLine={true} />
                        </div>
                        <div>
                            <FormControl className='w-25'>
                                <Select
                                    name="showToActiveUsers"
                                    variant="standard"
                                    value={filterData?.showToActiveUsers}
                                    onChange={(event) => { handleFilterDataChange("showToActiveUsers", event.target.value); }}
                                    fullWidth
                                >
                                    <MenuItem value={"country"}>Country</MenuItem>
                                    <MenuItem value={"state"}>State</MenuItem>
                                    <MenuItem value={"city"}>City</MenuItem>
                                    <MenuItem value={"os"}>OS</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <hr className='my-3'/>
                        <div style={{maxHeight: "24vh", height: "24vh", overflowY: "auto", paddingRight: "20px", marginRight: "-20px"}}>
                            { Object.keys(activeUserData).length > 0 &&
                                Object.entries(activeUserData[filterData?.showToActiveUsers] || {}).map(([key, value]) => (
                                    <div key={key} className='d-flex justify-content-between'>
                                        <div>{key}</div>
                                        <div>{value}</div>
                                    </div>
                                ))
                            }
                        </div>
                        <hr className='my-3'/>
                        <div>
                            <p className='mb-0'><span className='font-weight-bold'>Direct Visits</span> : {referrerData?.emptyCount || 0}</p>
                        </div>
                        <div>
                            <p className='mb-0'><span className='font-weight-bold'>Referrer Visits</span> : {referrerData?.referrerCount || 0}<i className='far fa-eye ml-3' onClick={() => {toggleReferrerLink();}}></i></p>
                        </div>
                    </Paper>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className='mt-3'>
                    <Paper className='p-3 h-100 d-flex flex-column justify-content-center align-items-center'>
                        <h5 className='mb-4'>Users by Page</h5>
                        <Row className='w-100'>
                            <Col xs={12} sm={12} md={7} lg={7} xl={7}>
                                {
                                    pieChartData.length > 0 && (
                                        <>
                                            <Row className='w-100 mb-2'>
                                                <Col xs={12} sm={12} md={1} lg={1} xl={1} className='font-weight-bold'>Color</Col>
                                                <Col xs={12} sm={12} md={10} lg={10} xl={10} className='font-weight-bold'>Page URL</Col>
                                                <Col xs={12} sm={12} md={1} lg={1} xl={1} className='font-weight-bold'>Count</Col>
                                            </Row>
                                            <Row className='w-100' style={{maxHeight: "300px", overflowY: "auto"}}>
                                                {
                                                    pieChartData.map((item, index) => (
                                                        <Fragment key={index}>
                                                            <Col xs={12} sm={12} md={1} lg={1} xl={1} className='d-flex align-items-center justify-content-center py-1'>
                                                                <span className="small-color-box" style={{backgroundColor:tc[index]}}></span>
                                                            </Col>
                                                            <Col xs={12} sm={12} md={10} lg={10} xl={10} className='py-1 text-break-all'>{item.page_url}</Col>
                                                            <Col xs={12} sm={12} md={1} lg={1} xl={1} className='py-1'>{item.count}</Col>
                                                        </Fragment>
                                                    ))
                                                }
                                            </Row>
                                        </>
                                    )
                                }
                            </Col>
                            <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                                <div className='w-100'>
                                    <ChartJs counter={pieChartCounter.current} type={"pie"} data={memoizedPieChartData} options={pieChartOptions} />
                                </div>
                            </Col>
                        </Row>
                    </Paper>
                </Col>
                <Col xs={12} sm={12} md={7} lg={7} xl={7} className='mt-3'>
                    <Paper className='p-3 h-100 d-flex flex-column justify-content-center align-items-center'>
                        <h5 className='mb-4'>Users by Country</h5>
                        <WorldMap
                            color={websiteColor}
                            title=""
                            size="lg"
                            data={worldMapData}
                        />
                    </Paper>
                </Col>
                <Modal size="lg" isOpen={modalReferrerLink} toggle={toggleReferrerLink}>
                    <ModalHeader toggle={toggleReferrerLink}>Referrer Links</ModalHeader>
                    <ModalBody>
                        <div className="table-content-wrapper">
                            <Table striped className='text-break scrollable-tbody'>
                                <thead>
                                    <tr>
                                        <th style={{width:"85%"}}>Referrer Link</th>
                                        <th style={{width:"15%"}} className='text-center'>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrerData?.uniqueReferrers?.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className='text-center'>No Referrer Links Available</td>
                                        </tr>
                                    ) : (   
                                        referrerData?.uniqueReferrers?.map((link, index) => (
                                            <tr key={index}>
                                                <td className='text-white-space' style={{width:"85%"}}>{link.url}</td>
                                                <td className='text-white-space text-center' style={{width:"15%"}}>{link.count}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="contained" color="primary" onClick={()=>toggleReferrerLink()} >CLOSE</Button>
                    </ModalFooter>
                </Modal>
            </Row>
        )
    );
}

export default DashboardAnalytics;