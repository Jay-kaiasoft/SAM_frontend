import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";
import { getSmsCampaignsReportsLinksDataDetails } from "../../../services/smsCampaignService";

const LinkTraceReportModal = ({ linkModal, toggleLinksModal, encLinkId = "" }) => {
    const [linksReportData, setLinksReportData] = useState({})
    useEffect(() => {
        if (encLinkId !== "") {
            const data = `encLinkId=${encLinkId}`
            getSmsCampaignsReportsLinksDataDetails(data).then(res => {
                if (res?.status === 200) {
                    setLinksReportData(res?.result)
                }
            })
        }
    }, [encLinkId])

    return (
        <Modal isOpen={linkModal} size="xl">
            <ModalHeader toggle={toggleLinksModal}>Links Report</ModalHeader>
            <ModalBody className="m-1">
                <Row>
                    <Col>
                        <p><strong>Link Name :</strong> {linksReportData?.linkName}</p>
                        <p><strong>Main Link :</strong> {linksReportData?.mainLink}</p>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col lg={4} sm={12}>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            <i className="far fa-desktop mr-3" style={{ fontSize: 100 }}></i>
                            <h3>{linksReportData?.desktopTotal}</h3>
                        </div>
                        <div>
                            <div className="table-content-wrapper">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th colSpan={3} className="text-center">Desktop</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">Mac</td>
                                            <td className="text-center">Windows</td>
                                            <td className="text-center">Others</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center">{linksReportData?.macintosh}</td>
                                            <td className="text-center">{linksReportData?.windows}</td>
                                            <td className="text-center">{linksReportData?.pcOther}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} sm={12}>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            <i className="far fa-mobile mr-3" style={{ fontSize: 100 }}></i>
                            <h3>{linksReportData?.mobileTotal}</h3>
                        </div>
                        <div>
                            <div className="table-content-wrapper">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th colSpan={3} className="text-center">Smart Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">Android</td>
                                            <td className="text-center">iPhone</td>
                                            <td className="text-center">Others</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center">{linksReportData?.android}</td>
                                            <td className="text-center">{linksReportData?.iPhone}</td>
                                            <td className="text-center">{linksReportData?.mobileOther}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} sm={12}>
                        <div className="d-flex justify-content-center align-items-center mb-2">
                            <i className="far fa-tablet mr-3" style={{ fontSize: 100 }}></i>
                            <h3>{linksReportData?.tabletTotal}</h3>
                        </div>
                        <div>
                            <div className="table-content-wrapper">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th colSpan={2} className="text-center">Tablets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">Android</td>
                                            <td className="text-center">iPad</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center">{linksReportData?.androidTab}</td>
                                            <td className="text-center">{linksReportData?.iPad}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col lg={6} sm={12} className="mx-auto">
                        <div className="table-content-wrapper">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th className="text-center">Region</th>
                                        <th className="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        linksReportData?.regionData && Object.keys(linksReportData?.regionData)?.map((region, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center" style={{ width: "90%" }}>{region}</td>
                                                    <td className="text-center">{linksReportData?.regionData[region]}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
}


export default LinkTraceReportModal;
