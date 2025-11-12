import React, { useEffect, useState } from "react";
import {Row, Col, Modal, ModalHeader, ModalBody, Table} from "reactstrap";
import { ConditionCommonComponent } from "../commonComponents/emailCampaignCommonComponents";
import { getAutomationBouncedReportList, getAutomationReportDashboard } from "../../../../services/automationService";
import { dateTimeFormat } from "../../../../assets/commonFunctions";
import { Link } from "@mui/material";

const DashboardData = ({id, globalAlert, setMemberData}) => {
    const [data, setData] = useState({});
    const [bounceModal, setBounceModal] = useState(false);
    const [bounceData, setBounceData] = useState([]);

    const handleClickBounce = (id) => {
        getAutomationBouncedReportList(id === null ? 0 : id).then((res) => {
            if (res.status === 200) {
                setBounceData(res.result.bouncedEmailList);
                setBounceModal(true);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    useEffect(()=>{
        if(id !== 0){
            getAutomationReportDashboard(id).then((res) => {
                if (res.status === 200) {
                    setData(res.result);
                    let t = [];
                    res.result.conditionDetails.forEach((value)=>{
                        t.push({
                            "conditionType": value.conditionType,
                            "yes": {
                                "campSendId": value.yes.campSendId,
                                "sendMypage": value.yes.sendMypage,
                                "oldMypage": value.yes.oldMypage

                            },
                            "no": {
                                "campSendId": value.no.campSendId,
                                "sendMypage": value.no.sendMypage,
                                "oldMypage": value.no.oldMypage
                            }
                        });
                    });
                    setMemberData({
                        "campaignDetails": {
                            "name": res.result.campaignDetails.name,
                            "campSendId": res.result.campaignDetails.campSendId
                        },
                        "conditionDetails": t
                    })
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        }
    },[]);

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="text-center mb-3">{data?.campaignDetails?.name}</h3>
                </Col>
            </Row>
            <Row className="px-3 pt-3">
                <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-calendar-alt font-size-20 icon-main"></i>Sent On</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{dateTimeFormat(data?.campaignDetails?.sentOn)}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-users font-size-20 icon-main"></i>Mailing Group</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.mailingGroup}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-file-edit font-size-20 icon-main"></i>Subject</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.subject}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-user font-size-20 icon-main"></i>Sender Name</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.senderName}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Sender Email</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.senderEmail}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-mailbox font-size-20 icon-main"></i>Total Queued</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.totalQueued || data?.campaignDetails?.sent}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5}className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-mail-bulk font-size-20 icon-main"></i>Sent</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.sent}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5}className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-shipping-fast font-size-20 icon-main"></i>Delivered</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7}>{data?.campaignDetails?.delivered}</Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between cursor-pointer" data-toggle="tooltip" title="Exception/Error returned by Receiver Mail Server."><span className="d-flex"><i className="far fa-exclamation-triangle font-size-20 icon-main"></i>Non Deliverable</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.exception}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between cursor-pointer" data-toggle="tooltip" title="Email Address Invalid/doesn't exist."><span className="d-flex"><i className="far fa-reply font-size-20 icon-main"></i><Link component="a" onClick={() => { handleClickBounce(data?.campaignDetails?.campSendId) }} className="text-center cursor-pointer">Bounced</Link></span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.bounced}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope-open-text font-size-20 icon-main"></i>Opened</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.opened}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Unread</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.unread}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-bell-slash font-size-20 icon-main"></i>Unsubscribed</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.unsubscribed}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-link font-size-20 icon-main"></i>Total Click Through Rate (TCTR)</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.totalClickThroughRate}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs={4} md={5} lg={7} className="d-flex justify-content-between"><span className="d-flex"><i className="far fa-link font-size-20 icon-main"></i>Unique Click Through Rate (UCTR)</span><span className="d-flex">:</span></Col>
                        <Col xs={8} md={7} lg={5}>{data?.campaignDetails?.uniqueClickThroughRate}</Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={12} lg={2} xl={2} className={`d-flex align-items-center justify-content-center`}>
                    <Row className="w-100">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className={`text-center d-flex flex-column mb-2`}>
                            Link Click
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center d-flex flex-column mb-2">
                            <i className="far fa-desktop font-size-50"></i>
                            <span className="mt-2">{data?.campaignDetails?.totalDesktop}</span>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className={`text-center d-flex flex-column`}>
                            <i className="far fa-mobile font-size-50"></i>
                            <span className="mt-2">{data?.campaignDetails?.totalMobile}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                data?.conditionDetails?.length > 0 ?
                    data?.conditionDetails?.map((value,index)=>(
                        <ConditionCommonComponent key={index} data={value} handleClickBounce={handleClickBounce} />
                    ))
                : null
            }
            <Modal size="xl" isOpen={bounceModal} toggle={() => { setBounceModal(false) }}>
                <ModalHeader toggle={() => { setBounceModal(false) }}>{`Bounced Email List`}</ModalHeader>
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
                                    <tr><td colSpan={4} align="center">No data found.</td></tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default DashboardData;