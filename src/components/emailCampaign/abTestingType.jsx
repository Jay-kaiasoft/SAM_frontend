import { Button, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { Col, Row } from "reactstrap";

const innerHeading = {
    fontSize: 18
}

const ABTestingType = ({
    data = {},
    handleChange = () => { },
    handleBack = () => { },
    globalAlert = () => { },
    handleNext = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>A/B Testing Type</strong></p>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="testingType" id="testingType" name="testingType" value={data.testingType} onChange={handleChange}>
                        <Row>
                            <Col md={12}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Email Subject" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={2} control={<Radio color="primary" />} label="Email Content" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={3} control={<Radio color="primary" />} label="From Name" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={4} control={<Radio color="primary" />} label="Email Subject & From Name" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={5} control={<Radio color="primary" />} label="Email Subject & From Name & Email Content" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={6} control={<Radio color="primary" />} label="Delivery Date & Time" />
                            </Col>
                        </Row>
                    </RadioGroup>
                </FormControl>
                <div className="form-group">
                    <p style={innerHeading}><strong>Split Group Slider</strong>
                        <span style={{ float: "right" }}><strong>Total Member : </strong>
                            <span id="sgtotmem"><strong>{data.totalMember}</strong></span>
                        </span>
                    </p>
                    <div id="mainselectsplitgroup">
                        <div id="selectsplitgroup" className="splitter_panel" style={{ width: "100%", height: "70px" }}>
                            <div id="selectper" className="left_panel" style={{ left: "0%", width: `${data.groupValue}%` }}>
                                <div className="a">A <span style={{ fontSize: "14px" }}>{`(${data.groupAValue})`}</span></div>
                                <div className="b">B <span style={{ fontSize: "14px" }}>{`(${data.groupBValue})`}</span></div>
                            </div>
                            <div id="slider">
                                <div id="custom-handle" className="vsplitter" style={{ left: `${data.groupValue}%` }}></div>
                            </div>
                            <div id="otherper" className="right_panel" style={{ width: `${100 - data.groupValue}%`, left: `${data.groupValue}%` }}>
                                <span id="totO">{`(${data.remainingGroupValue})`}</span>
                            </div>
                        </div>
                    </div>
                    <div id="displayper">
                        <div>Selected Group : <span id="selectgroupper">{`${data.groupValue}%`}</span></div>
                        <div>Remain Group : <span id="othergroupper">{`${100 - data.groupValue}%`}</span></div>
                    </div>
                </div>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(1)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                            if (data?.testingType === undefined || data?.testingType === 0) {
                                globalAlert({
                                    type: "Error",
                                    text: "Select a/b testing type.",
                                    open: true
                                })
                                return
                            }
                            handleNext(1)
                        }}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default ABTestingType