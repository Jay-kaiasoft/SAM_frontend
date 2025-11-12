import { Button } from "@mui/material";
import React from "react";
import { Col, Row, Table } from "reactstrap";
import History from "../../history";
import { myPageImageUrl } from "../../config/api";

const innerHeading = {
    fontSize: 18
}


const Preview = ({
    data,
    memberId,
    page1,
    page2,
    handleBack = () => { },
    handleClickSendCampaign = () => { },
    handleClickSendEmailPreview = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>You are all set to send!</strong></p>
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
                                </tr>
                            }
                            {data.testingType && ![1, 4, 5].includes(data.testingType) &&
                                <tr>
                                    <td className="text-right"><strong>Subject :</strong></td>
                                    <td className="dettdright">{data.previewSubject}</td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    <Table className="w-100">
                        <thead className="thead-style">
                            <tr>
                                <th></th>
                                <th>For A</th>
                                <th>For B</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.testingType && [2, 5].includes(data.testingType) &&
                                <tr>
                                    <td style={{ width: "150px" }}><strong>Page Thumb</strong></td>
                                    <td id="prepageimga" className="dettdright"><div className="imgdiv" style={{ border: "1px solid #ccc" }}><img src={myPageImageUrl.replace("{{memberId}}", memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", data.mpId1)} className="img-responsive" alt="Page Thumb" /></div></td>
                                    <td id="prepageimgb" className="dettdright"><div className="imgdiv" style={{ border: "1px solid #ccc" }}><img src={myPageImageUrl.replace("{{memberId}}", memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", data.mpId2)} className="img-responsive" alt="Page Thumb" /></div></td>
                                </tr>
                            }
                            {data.testingType && [2, 5].includes(data.testingType) &&
                                <tr>
                                    <td><strong>Page Name</strong></td>
                                    <td className="dettdright">{page1[0].mpName}</td>
                                    <td className="dettdright">{page2[0].mpName}</td>
                                </tr>
                            }
                            {data.testingType && [3, 4, 5].includes(data.testingType) &&
                                <tr>
                                    <td><strong>From Name</strong></td>
                                    <td className="dettdright">{data.fromName1}</td>
                                    <td className="dettdright">{data.fromName2}</td>
                                </tr>
                            }
                            {data.testingType && [1, 4, 5].includes(data.testingType) &&
                                <tr>
                                    <td><strong>Subject</strong></td>
                                    <td className="dettdright">{data.previewSubject}</td>
                                    <td className="dettdright">{data.previewSubject2}</td>
                                </tr>
                            }
                            <tr>
                                <td><strong>Total Member</strong></td>
                                <td className="dettdright">{data.groupAValue}</td>
                                <td className="dettdright">{data.groupBValue}</td>
                            </tr>
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
                    <Button color="primary" variant="contained" className="ml-3" onClick={() => { History.push("/manageemailcampaign") }}>
                        <i className="far fa-times mr-2"></i>CANCEL
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default Preview