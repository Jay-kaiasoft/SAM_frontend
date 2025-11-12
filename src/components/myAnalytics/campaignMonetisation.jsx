import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Col, Row, Table } from "reactstrap";
import { getDevicesUsersCampaigns, getSessionPageLogData } from "../../services/analyticsService";
import { format } from 'date-fns';
import { Button, Card, FormControl, Link, MenuItem, Popover, Select } from "@mui/material";
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineOppositeContent, timelineOppositeContentClasses, TimelineSeparator } from "@mui/lab";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { detectBrowser, detectDeviceType, detectOperatingSystem, msToHHMMSS, dateFilterData, dateFormat } from "../../assets/commonFunctions";
import { setViewVisitorProfileAction } from './../../actions/viewVisitorProfileActions';
import History from "../../history";

const CampaignMonetisation = ({ analyticsWebId, globalAlert, setViewVisitorProfile }) => {
	const [sessions, setSessions] = useState([]);
	const [visitLog, setVisitLog] = useState([]);
	const [campaignNameList, setCampaignNameList] = useState([]);
	const [filterData, setFilterData] = useState({"filterType": "ALL", "dateFilter": "LAST_7_DAYS", "startDate": new Date(new Date().setDate(new Date().getDate() - 7)), "endDate": new Date(), "dateFilterVisitLog": "LAST_7_DAYS", "startDateVisitLog": new Date(new Date().setDate(new Date().getDate() - 7)), "endDateVisitLog": new Date()});
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [selectedIndexVisitLog, setSelectedIndexVisitLog] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [anchorElVisitLog, setAnchorElVisitLog] = useState(null);
	const openVisitLog = Boolean(anchorElVisitLog);
	const idVisitLog = openVisitLog ? 'simple-popover' : undefined;

	const handleChange = (name, value) => {
		setFilterData((prev) => {
			return {
				...prev,
				[name]: value
			}
		});
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClickVisitLog = (event) => {
		setAnchorElVisitLog(event.currentTarget);
	};
	const handleCloseVisitLog = () => {
		setAnchorElVisitLog(null);
	};
	const handleUserClick = async (session, index, campaignIndex) => {
		setSelectedIndex(`${campaignIndex}_${index}`);
		setVisitLog([]);
		const payload = {
			id: session.value,
			websiteId: analyticsWebId,
			logDataBy: session.type,
			dateFilterType: filterData?.dateFilterVisitLog,
			startDate: dateFormat(filterData?.startDateVisitLog),
			endDate: dateFormat(filterData?.endDateVisitLog)
		}
		getSessionPageLogData(payload).then(response => {
			if (response.status === 200) {
				setVisitLog(response.result.sessionData);
			} else {
				globalAlert({
					type: "Error",
					text: "Failed to fetch sessions. Please try again later.",
					open: true
				});
			}
		});
	}
	const handleResetState = () => {
		setSelectedIndex(null);
		setVisitLog([]);
		setFilterData({ "filterType": "CAMPAIGN", "dateFilter": "LAST_7_DAYS", "startDate": new Date(new Date().setDate(new Date().getDate() - 7)), "endDate": new Date(), "dateFilterVisitLog": "LAST_7_DAYS", "startDateVisitLog": new Date(new Date().setDate(new Date().getDate() - 7)), "endDateVisitLog": new Date() });
	};
	const displayDeviceUserCampaigns = useCallback((filterData, isReset = false) => {
		let payload = {};
		if (analyticsWebId) {
			if (isReset) {
				handleResetState();
				payload = {
					"websiteId": analyticsWebId,
					"filterType": "CAMPAIGN",
					"dateFilterType": "LAST_7_DAYS",
					"startDate": dateFormat(new Date(new Date().setDate(new Date().getDate() - 7))),
					"endDate": dateFormat(new Date())
				}
			} else {
				payload = {
					"websiteId": analyticsWebId,
					"filterType": filterData.filterType,
					"dateFilterType": filterData.dateFilter,
					"startDate": dateFormat(filterData.startDate),
					"endDate": dateFormat(filterData.endDate)
				}
			}
			getDevicesUsersCampaigns(payload).then(response => {
				if (response.status === 200) {
					let temp = [];
					response.result.list.forEach((session, index) => {
						temp.push({
							name: session.name,
							value: session.value
						});
						if(index === 0) {
							setFilterData((prev) => {
								return {
									...prev,
									campaignFilter: session.value
								}
							});
						}
					});
					setCampaignNameList(temp);
					setSessions(response.result.list);
				} else {
					globalAlert({
						type: "Error",
						text: "Failed to fetch data. Please try again later.",
						open: true
					});
				}
			})
		}
	}, [analyticsWebId]);
	const handleClickViewVisitorProfile = (groupId, userId) => {
		setViewVisitorProfile({
			isSet: "Yes",
			groupId: groupId,
			userId: userId
		});
		History.push(`/clientContact`);
	}

	useEffect(() => {
		displayDeviceUserCampaigns(filterData, true);
	}, [analyticsWebId]);
	useEffect(() => {
		displayDeviceUserCampaigns(filterData);
	}, []);

	return (
		<Row>
			<Col xs={12} sm={12} md={3} lg={3} xl={3}>
				<div className="table-content-wrapper overflow-auto overflow-x-hidden" style={{ maxHeight: "calc(100vh - 210px)" }}>
					<Table striped className="table-layout-fixed">
						<thead>
							<tr>
								<th>
									<div>
										{ typeof filterData?.campaignFilter !== "undefined" && <Select
											name="campaignFilter"
											variant="standard"
											value={filterData?.campaignFilter}
											onChange={(event) => {
												handleChange("campaignFilter", event.target.value);
											}}
											fullWidth
											sx={{
												color: "#ffffff !important",
												"&:hover:before": {
													borderBottomColor: "#ffffff !important"
												},
												"&:before": {
													borderBottomColor: "#ffffff !important"
												},
												"&:after": {
													borderBottomColor: "#ffffff !important"
												},
												"& .MuiSelect-icon": {
													color: "#ffffff !important"
												}
											}}
										>
											{
												campaignNameList.map((value, index) => (
													<MenuItem key={index} value={value.value}>{value.name}</MenuItem>
												))
											}
										</Select>}
									</div>
									<div className="d-flex align-items-center justify-content-between mt-3">
										Users
										<i className="far fa-filter" aria-describedby={id} onClick={handleClick}></i>
										<Popover
											id={id}
											open={open}
											anchorEl={anchorEl}
											onClose={handleClose}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
										>
											<div className="p-3">
												<FormControl fullWidth>
													<Select
														name="dateFilter"
														variant="standard"
														value={filterData?.dateFilter}
														onChange={(event) => {
															handleChange("dateFilter", event.target.value);
														}}
														fullWidth
													>
														{
															dateFilterData.map((filter, index) => (
																<MenuItem key={index} value={filter.value}>{filter.label}</MenuItem>
															))
														}
													</Select>
												</FormControl>
												{filterData?.dateFilter === 'CUSTOM' && (
													<div className="d-flex flex-column">
														<LocalizationProvider dateAdapter={AdapterDateFns}>
															<DatePicker
																value={filterData?.startDate}
																label="Start Date"
																className='mt-3'
																inputFormat="MM/dd/yyyy"
																onChange={(date) => {handleChange("startDate", date)}}
																slotProps={{ textField: { variant: "standard" } }}
																maxDate={new Date()}
															/>
															<DatePicker
																value={filterData?.endDate}
																label="End Date"
																className='mt-3'
																inputFormat="MM/dd/yyyy"
																onChange={(date) => {handleChange("endDate", date)}}
																slotProps={{ textField: { variant: "standard" } }}
																minDate={filterData?.startDate}
																maxDate={new Date()}
															/>
														</LocalizationProvider>
													</div>
												)}
												<div className="d-flex justify-content-center mt-3">
													<Button variant="contained" color="primary" onClick={()=>{displayDeviceUserCampaigns(filterData); handleClose();}}>
														Apply
													</Button>
												</div>
											</div>
										</Popover>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{
								sessions.length > 0 ?
									sessions.map((session, index) => {
										return (
											<Fragment key={index}>
												{
													(session?.users?.length > 0 && session?.value === filterData?.campaignFilter) ?
														session.users.map((user, idx) => (
															<tr key={idx} className={selectedIndex === `${index}_${idx}` ? "active" : ""}>
																<td className="cursor-pointer overflow-x-hidden text-overflow-ellipsis" style={{ fontSize: "0.8rem" }} onClick={() => { handleUserClick(user, idx, index) }}>
																	{user.name}
																</td>
															</tr>
														))
													: null
												}
											</Fragment>
										)
									}) : null
							}
						</tbody>
					</Table>
				</div>
			</Col>
			<Col xs={12} sm={12} md={9} lg={9} xl={9} style={{ backgroundColor: "#f8f9fa", height: "calc(100vh - 210px)", overflowY: "auto" }}>
				<div className="d-flex align-items-center">
					<h4 className="py-2">Visit Log</h4>
					{selectedIndex !== null && 
						<>
							<i className="far fa-filter ml-3" aria-describedby={idVisitLog} onClick={handleClickVisitLog}></i>
							<Popover
								id={idVisitLog}
								open={openVisitLog}
								anchorEl={anchorElVisitLog}
								onClose={handleCloseVisitLog}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
							>
								<div className="p-3">
									<FormControl fullWidth>
										<Select
											name="dateFilterVisitLog"
											variant="standard"
											value={filterData?.dateFilterVisitLog}
											onChange={(event) => {
												handleChange("dateFilterVisitLog", event.target.value);
											}}
											fullWidth
										>
											{
												dateFilterData.map((filter, index) => (
													<MenuItem key={index} value={filter.value}>{filter.label}</MenuItem>
												))
											}
										</Select>
									</FormControl>
									{filterData?.dateFilterVisitLog === 'CUSTOM' && (
										<div className="d-flex flex-column">
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<DatePicker
													value={filterData?.startDateVisitLog}
													label="Start Date"
													className='mt-3'
													inputFormat="MM/dd/yyyy"
													onChange={(date) => {handleChange("startDateVisitLog", date)}}
													slotProps={{ textField: { variant: "standard" } }}
													maxDate={new Date()}
												/>
												<DatePicker
													value={filterData?.endDateVisitLog}
													label="End Date"
													className='mt-3'
													inputFormat="MM/dd/yyyy"
													onChange={(date) => {handleChange("endDateVisitLog", date)}}
													slotProps={{ textField: { variant: "standard" } }}
													minDate={filterData?.startDateVisitLog}
													maxDate={new Date()}
												/>
											</LocalizationProvider>
										</div>
									)}
									<div className="d-flex justify-content-center mt-3">
										<Button variant="contained" color="primary" onClick={()=>{handleUserClick(sessions?.[selectedIndex?.split("_")?.[0]]?.users?.[selectedIndex?.split("_")?.[1]], selectedIndex?.split("_")?.[1], selectedIndex?.split("_")?.[0]); handleCloseVisitLog();}}>
											Apply
										</Button>
									</div>
								</div>
							</Popover>
						</>
					}
				</div>
				{ visitLog.length > 0 ?
					visitLog.map((log, index) => (
						<Card className="p-2 mb-3" key={index}>
							<Row className="p-1">
								<Col sm={3} className="pr-0">
									<p className="mb-0" style={{ fontSize: "0.8rem" }}>
										<strong>
											{
												log?.timestamp && !isNaN(log.timestamp)
													? format(new Date(Number(log.timestamp)), "EEEE, MMMM d, yyyy - HH:mm:ss")
													: ""
											}
										</strong>
									</p>
									<p className="mb-0" style={{ fontSize: "0.8rem" }}>
										IP : {log?.deviceHostData?.host_data?.ip || ""}
									</p>
									<p style={{ fontSize: "0.8rem" }}>
										{log?.deviceHostData?.host_data?.address?.countryFlag} {log?.deviceHostData?.host_data?.address?.state} ({log?.deviceHostData?.host_data?.address?.city})
									</p>
								</Col>
								<Col sm={2} className="pr-0 d-flex justify-content-around align-items-start">
									{detectBrowser(log?.deviceHostData?.device_info?.browser)}
									{detectOperatingSystem(log?.deviceHostData?.device_info?.os)}
									{detectDeviceType(log?.deviceHostData?.device_info?.deviceType)}
								</Col>
								<Col sm={5} className="pr-0">
									{
										log?.pageLogs?.length > 0 ?
											<>
												<div className={`visit-log-container ${selectedIndexVisitLog === index ? "active" : ""}`}>
													<Timeline sx={{
														[`& .${timelineOppositeContentClasses.root}`]: {
															flex: 0.3,
														},
														padding: "0",
														marginBottom: "0"
													}}>
														{log?.pageLogs?.map((value, index) => (
															<TimelineItem key={index}>
																<TimelineOppositeContent style={{ fontSize: "0.8rem" }} color="text.secondary"
																	sx={{
																		padding: "0 7px 0 0",
																	}}
																>
																	{`${msToHHMMSS(value.duration)}`}
																</TimelineOppositeContent>
																<TimelineSeparator>
																	<i className="fas fa-folder" style={{ fontSize: "1.5em" }}></i>
																	{log.pageLogs?.length - 1 !== index && <TimelineConnector className="my-2" />}
																</TimelineSeparator>
																<TimelineContent style={{ fontSize: "0.8rem" }}
																	sx={{
																		padding: "0 0 0 7px",
																	}}
																>
																	<p className="mb-0">{value.pageTitle}</p>
																	<p className="mb-0">{value.pageUrl}</p>
																</TimelineContent>
															</TimelineItem>
														))}
													</Timeline>
												</div>
												<div className="d-flex align-items-center justify-content-center mt-2">
													{selectedIndexVisitLog === index ? (
														<>
															<div className="d-flex" style={{flex: 0.3}}></div>
															<div className="cursor-pointer text-blue pl-1" onClick={() => { setSelectedIndexVisitLog(null); }}>
																Less
															</div>
															<div className="d-flex" style={{flex: 1}}></div>
														</>
													) : (
														<>
															<div className="d-flex" style={{flex: 0.3}}></div>
															<div className="cursor-pointer text-blue pl-1" onClick={() => { setSelectedIndexVisitLog(index); }}>
																More
															</div>
															<div className="d-flex" style={{flex: 1}}></div>
														</>
													)}
												</div>
											</>
										: null
									}
								</Col>
								<Col sm={2} style={{ fontSize: "0.8rem" }}>
									<div className="d-flex align-items-center">
										<i className="fas fa-address-card mr-2" style={{ fontSize: "1.5em" }}></i>
										<Link component="a" className="cursor-pointer" onClick={() => { handleClickViewVisitorProfile(sessions?.[selectedIndex?.split("_")?.[0]]?.users[selectedIndex?.split("_")?.[1]]?.groupId, sessions?.[selectedIndex?.split("_")?.[0]]?.users[selectedIndex?.split("_")?.[1]]?.userId); }}>
											View visitor profile
										</Link>
									</div>
								</Col>
							</Row>
						</Card>
					))
					: <p className="text-center mt-3">No visit logs available for this user.</p>
				}
			</Col>
		</Row>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		globalAlert: (data) => {
			dispatch(setGlobalAlertAction(data))
		},
		setViewVisitorProfile: (data) => {
			dispatch(setViewVisitorProfileAction(data))
		}
	}
}

export default connect(null, mapDispatchToProps)(CampaignMonetisation);