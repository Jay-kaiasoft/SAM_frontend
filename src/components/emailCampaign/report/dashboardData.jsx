import React, {useState} from "react"
import { dateTimeFormat } from "../../../assets/commonFunctions";
import AnimatedCircleDiagram from "../../shared/commonControlls/animatedCircleDiagram";
import { Link } from "@mui/material";
import {Col, Modal, Row, ModalHeader, ModalBody, Table} from "reactstrap"
import {getBouncedEmailReportList} from "../../../services/emailCampaignService";

const DashboardData = ({ isAnimated, heading, winner, byAutoManual, handleClickWinner, dashboardData, inHalfScreen = false, className = "", campId, globalAlert }) => {
    const [bounceModal, setBounceModal] = useState(false);
    const [bounceData, setBounceData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClickBounceModal = () => {
        let splitGroup = "";
        if(heading === "For A"){
            splitGroup = "A";
        } else if(heading === "For B"){
            splitGroup = "B";
        } else if(heading === "For Winner"){
            splitGroup = "O";
        }
        setBounceData([]);
        setLoading(true);
        setBounceModal(true);
        const data = `campSendId=${campId}&splitGroup=${splitGroup}`;
        getBouncedEmailReportList(data).then(res => {
            if (res?.status === 200) {
                setBounceData(res?.result?.bouncedEmailList);
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
            setLoading(false);
        })
    }

    return (
        <Col xs={12} sm={12} md={12} lg={inHalfScreen ? 6 : 12} xl={inHalfScreen ? 6 : 12} className={className}>
            {heading &&
                <div className="d-flex justify-content-between px-3 pt-3">
                    <span className="font-size-18">{heading}</span>
                    {
                        heading === "For A" ?
                            winner === "A" ?
                                <span className="font-size-18">Winner</span>
                            :
                                byAutoManual === "manual" && winner === "" ?
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Choose Winner A" onClick={() => { handleClickWinner("A") }} data-html2canvas-ignore="false">
                                        <i className="far fa-trophy"></i>
                                        <div className="bg-dark-grey"></div>
                                    </Link>
                                :
                                    byAutoManual === "auto" && winner === "" ?
                                        <span className="font-size-18">Evaluating</span>
                                    : null
                        : null
                    }
                    {
                        heading === "For B" ?
                            winner === "B" ?
                                <span className="font-size-18">Winner</span>
                            :
                                byAutoManual === "manual" && winner === "" ?
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Choose Winner B" onClick={() => { handleClickWinner("B") }} data-html2canvas-ignore="false">
                                        <i className="far fa-trophy"></i>
                                        <div className="bg-dark-grey"></div>
                                    </Link>
                                :
                                    byAutoManual === "auto" && winner === "" ?
                                        <span className="font-size-18">Evaluating</span>
                                    : null
                        : null
                    }
                </div>
            }
            <Row className="px-3 pt-3">
                <Col xs={12} sm={12} md={12} lg={inHalfScreen ? 12 : 6} xl={inHalfScreen ? 12 : 6}>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-calendar-alt font-size-20 icon-main"></i>Sent On</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dateTimeFormat(dashboardData?.sentOn)}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-users font-size-20 icon-main"></i>Mailing Group</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dashboardData?.mailingGroup}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-file-edit font-size-20 icon-main"></i>Subject</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dashboardData?.subject}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-user font-size-20 icon-main"></i>Sender Name</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dashboardData?.senderName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Sender Email</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dashboardData?.senderEmail}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-mailbox font-size-20 icon-main"></i>Total Queued</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dashboardData?.totalQueued || dashboardData?.sent}</Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={12} lg={inHalfScreen ? 12 : 3} xl={inHalfScreen ? 12 : 3}>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-mail-bulk font-size-20 icon-main"></i>Sent</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.sent}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-shipping-fast font-size-20 icon-main"></i>Delivered</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.delivered}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between cursor-pointer" data-toggle="tooltip" title="Exception/Error returned by Receiver Mail Server."><span className="d-flex"><i className="far fa-exclamation-triangle font-size-20 icon-main"></i>Non Deliverable</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.exception}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between cursor-pointer" data-toggle="tooltip" title="Email Address Invalid/doesn't exist."><span className="d-flex"><i className="far fa-reply font-size-20 icon-main"></i>Bounced</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.bounced}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope-open-text font-size-20 icon-main"></i>Opened</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.opened}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={inHalfScreen ? 5 : 7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Unread</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={inHalfScreen ? 7 : 5}>{dashboardData?.unread}</Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={12} lg={inHalfScreen ? 12 : 3} xl={inHalfScreen ? 12 : 3} className={`d-flex ${inHalfScreen ? "" : "flex-column"} align-items-center justify-content-center`}>
                    <Row className="w-100">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className={`text-center d-flex flex-column ${inHalfScreen ? "mb-2" : ""}`}>
                            Link Click
                        </Col>
                        <Col xs={inHalfScreen ? 6 : 12} sm={inHalfScreen ? 6 : 12} md={inHalfScreen ? 6 : 12} lg={inHalfScreen ? 6 : 12} xl={inHalfScreen ? 6 : 12} className={`text-center d-flex flex-column ${inHalfScreen ? "" : "mt-2"}`}>
                            <i className="far fa-desktop font-size-50"></i>
                            <span className="mt-2">{dashboardData?.totalDesktop}</span>
                        </Col>
                        <Col xs={inHalfScreen ? 6 : 12} sm={inHalfScreen ? 6 : 12} md={inHalfScreen ? 6 : 12} lg={inHalfScreen ? 6 : 12} xl={inHalfScreen ? 6 : 12} className={`text-center d-flex flex-column ${inHalfScreen ? "" : "mt-2"}`}>
                            <i className="far fa-mobile font-size-50"></i>
                            <span className="mt-2">{dashboardData?.totalMobile}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="px-3 py-3">
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.successfulDeliveriesPer} pathColor="#009999" isAnimated={isAnimated} />
                    <p className="text-center mt-3">{`Successful Deliveries - ${dashboardData?.successfulDeliveries}`}</p>
                </Col>
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.bouncedPer} pathColor="#ab0178" isAnimated={isAnimated} />
                    <p className="text-center mt-3"><Link component="a" style={{ cursor: "pointer" }} onClick={() => { handleClickBounceModal() }} className="text-center mt-3">{`Bounced - ${dashboardData?.bounced}`}</Link></p>
                </Col>
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.unsubscribedPer} pathColor="#f0f000" isAnimated={isAnimated} />
                    <p className="text-center mt-3">{`Unsubscribed - ${dashboardData?.unsubscribed}`}</p>
                </Col>
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.openRatePer} pathColor="#BD380F" isAnimated={isAnimated} />
                    <p className="text-center mt-3">{`Open Rate - ${dashboardData?.opened}`}</p>
                </Col>
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.totalClickThroughRatePer} pathColor="#FF0000" isAnimated={isAnimated} />
                    <p className="text-center mt-3">{`Total Click Through Rate (TCTR) - ${dashboardData?.totalClickThroughRate}`}</p>
                </Col>
                <Col lg={inHalfScreen ? 6 : 4} md={12} sm={12} xs={12}>
                    <AnimatedCircleDiagram percentage={dashboardData?.uniqueClickThroughRatePer} pathColor="#999966" isAnimated={isAnimated} />
                    <p className="text-center mt-3">{`Unique Click Through Rate (UCTR) - ${dashboardData?.uniqueClickThroughRate}`}</p>
                </Col>
            </Row>
            <Modal size="xl" isOpen={bounceModal} toggle={() => { setBounceModal(false) }}>
                <ModalHeader toggle={() => { setBounceModal(false) }}>{`Bounced Email List ${typeof heading !== "undefined" ? heading : ""}`}</ModalHeader>
                <ModalBody style={{maxHeight: "calc(100vh - 120px)", overflowY: "auto"}}>
                    <div className="table-content-wrapper">
                        <Table striped>
                            <thead>
                            <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                                <td width="20%">First Name</td>
                                <td width="20%">Last Name</td>
                                <td width="30%">Email</td>
                                <td width="30%">Reason</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                bounceData.length > 0 ?
                                    bounceData.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td style={{whiteSpace:"unset"}}>{v.firstName}</td>
                                                <td style={{whiteSpace:"unset"}}>{v.lastName}</td>
                                                <td style={{whiteSpace:"unset"}}>{v.email}</td>
                                                <td style={{whiteSpace:"unset"}}>{v.bounceReason}</td>
                                            </tr>
                                        )
                                    })
                                :
                                    <tr>
                                        <td colSpan={4} align="center">
                                            {
                                                loading ?
                                                    "Please wait... We are fetching the data."
                                                :
                                                    "No data found."
                                            }
                                        </td>
                                    </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
            </Modal>
        </Col>
    )
}

export default DashboardData