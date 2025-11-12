import React from "react";
import { Col, FormGroup, Row } from "reactstrap";
import InputField from "../shared/commonControlls/inputField";
import { TextField } from "@mui/material";

const innerHeading = {
    fontSize: 18
}


const AdditionalInformation = ({
    data,
    handleTextBoxChange = () => { },
    handleTextAreaChange = () => { }
}) => {
    return (
        <Row className="mx-0">
            <Col xs={12} sm={12} md={{ offset: 2, size: 8 }} lg={{ offset: 2, size: 8 }} xl={{ offset: 2, size: 8 }}>
                <p style={innerHeading}><strong>Additional Information</strong></p>
                <Row>
                    <Col sm={12}>
                        <FormGroup>
                            <InputField
                                type="text"
                                id="projectName"
                                name="bfmProjectName"
                                value={data.bfmProjectName}
                                onChange={handleTextBoxChange}
                                label="What is the name of this project?"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                            <InputField
                                type="text"
                                id="yourBusiness"
                                name="bfmYourBusiness"
                                value={data.bfmYourBusiness}
                                onChange={handleTextBoxChange}
                                label="What industry is your business in?"
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <InputField
                                type="text"
                                id="bfmWebsite"
                                name="bfmWebsite"
                                value={data.bfmWebsite}
                                onChange={handleTextBoxChange}
                                label="What is your website address, if you have one?"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                            <TextField
                                id="aboutYourCompany"
                                name="bfmAboutYourCompany"
                                label="Tell us about your company.What do you do? Who is your target audience?"
                                multiline
                                value={data.bfmAboutYourCompany}
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
                                id="mainGoalWithEt"
                                name="bfmMainGoalWithEt"
                                label="What is your main goal with this email template campaign?"
                                multiline
                                value={data.bfmMainGoalWithEt}
                                onChange={handleTextAreaChange}
                                fullWidth
                                minRows={4}
                                variant="standard"
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AdditionalInformation