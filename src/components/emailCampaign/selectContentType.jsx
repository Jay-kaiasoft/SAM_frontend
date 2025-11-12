import React from "react";
import { Col, Row } from "reactstrap";
import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";

const SelectContentType = ({
    data,
    handleChange = () => { },
    handleNext = () => { },
    handleBack = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                <p className="font-size-18"><strong>Choose A Content Type Of Campaign To Send</strong></p>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="campType" id="campType" name="campType" value={data.campType} onChange={handleChange}>
                        <Row>
                            <Col md={12}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Simple Text Email" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={2} control={<Radio color="primary" />} label="HTML Email" />
                            </Col>
                        </Row>
                    </RadioGroup>
                </FormControl>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(3)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={data.campType !== 0 ? () => handleNext(1) : null}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default SelectContentType