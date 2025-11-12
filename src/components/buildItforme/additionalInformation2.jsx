import { TextField } from "@mui/material";
import React from "react";
import { Col, FormGroup, Row } from "reactstrap";
import MyDropzone from "./myDropZone";

const innerHeading = {
    fontSize: 18
}

const AdditionalInformation2 = ({
    data,
    user,
    id,
    setData = () => { },
    globalAlert = () => { },
    handleTextAreaChange = () => { },
    oldBfmAttachmentFile = () => { },
    setOldBfmAttachmentFile = () => { }
}) => {
    return (
        <Row className="mx-0">
            <Col xs={12} sm={12} md={{ offset: 2, size: 8 }} lg={{ offset: 2, size: 8 }} xl={{ offset: 2, size: 8 }}>
                <p style={innerHeading}><strong>Additional Information</strong></p>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                            <TextField
                                id="wantIncluded"
                                name="bfmWantIncluded"
                                label="Tell us what images, art work or text area MUST include. Example - inclusive, different ethnic people"
                                multiline
                                value={data.bfmWantIncluded}
                                onChange={handleTextAreaChange}
                                fullWidth
                                minRows={4}
                                variant="standard"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <TextField
                                id="communicateToTeam"
                                name="bfmCommunicateToTeam"
                                label="Is there anything else you would like to communicate to the team?"
                                multiline
                                value={data.bfmCommunicateToTeam}
                                onChange={handleTextAreaChange}
                                fullWidth
                                minRows={4}
                                variant="standard"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup className="">
                            <TextField
                                id="notWantIncluded"
                                name="bfmNotWantIncluded"
                                label="Tell us what images, art work or text area MUST NOT be in the template. Example – a busy template, brown and black colors"
                                multiline
                                value={data.bfmNotWantIncluded}
                                onChange={handleTextAreaChange}
                                fullWidth
                                minRows={5}
                                variant="standard"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <MyDropzone data={data} setData={setData} globalAlert={globalAlert} id={id} oldBfmAttachmentFile={oldBfmAttachmentFile} setOldBfmAttachmentFile={setOldBfmAttachmentFile} user={user} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AdditionalInformation2