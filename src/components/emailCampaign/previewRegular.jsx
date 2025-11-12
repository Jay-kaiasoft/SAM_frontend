import { Button } from "@mui/material";
import React from "react";
import { Col, Row, Table } from "reactstrap";
import history from "../../history";

const PreviewRegular = ({
    data,
    handleBack = () => { },
    handleClickSendCampaign = () => { },
    handleClickSendEmailPreview = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <p className="font-size-18"><strong>You are all set to send!</strong></p>
                <div>
                    <Table className="w-100">
                        <tbody>
                            <tr>
                                <td className="text-right" style={{ width: "35%" }}><strong>Name Of Campaign :</strong></td>
                                <td>{data.campaignName}</td>
                            </tr>
                            <tr>
                                <td className="text-right"><strong>Campaign Type :</strong></td>
                                <td>{data.mailType}</td>

                            </tr>
                            {data?.segNames?.length > 0 ?
                                <tr>
                                    <td className="text-right"><strong>Segment Name :</strong></td>
                                    <td>{data.segNames.join(", ")}</td>
                                </tr> :
                                <tr>
                                    <td className="text-right"><strong>Group :</strong></td>
                                    <td>{data.groupName}</td>
                                </tr>}
                            <tr>
                                <td className="text-right"><strong>Total Member :</strong></td>
                                <td>{data.totalMember}</td>
                            </tr>
                            <tr>
                                <td className="text-right"><strong>Subject :</strong></td>
                                <td dangerouslySetInnerHTML={{ __html: data?.emailSubject || "" }}></td>
                            </tr>
                            {
                                data.schType === 2 ?
                                    <tr>
                                        <td className="text-right"><strong>Send on Date and Time :</strong></td>
                                        <td>{data.sendOnDateTime} (PST)</td>
                                    </tr> :
                                    null
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="col-12 mb-3 mt-3" align="center">
                    <Button color="primary" variant="contained" onClick={() => handleBack(1)}>
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button color="primary" variant="contained" className="ml-3 sendCampaign" onClick={() => { handleClickSendCampaign() }}>
                        <i className="far fa-envelope-open-text mr-2"></i>SEND CAMPAIGN
                    </Button>
                    <Button color="primary" variant="contained" className="ml-3 sendEmail" onClick={() => { handleClickSendEmailPreview() }}>
                        <i className="far fa-envelope mr-2"></i>SEND TEST E-MAIL
                    </Button>
                    <Button color="primary" variant="contained" className="ml-3" onClick={() => { history.push("/manageemailcampaign") }}>
                        <i className="far fa-times mr-2"></i>CANCEL
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default PreviewRegular