import { Button, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React from "react";
import { Col, Input, Row } from "reactstrap";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { dateTimeFormat } from "../../assets/commonFunctions";

const innerHeading = {
    fontSize: 18
}


const Scheduler = ({
    data,
    timeValues,
    globalAlert = () => { },
    handleDataChange = () => { },
    handleChangeDefaultName = () => { },
    handleWinnerTypeChange = () => { },
    handleBack = () => { },
    handleNext = () => { },
    setData = () => { }
}) => {
    return (
        <Row>
            <Col xs={10} sm={8} md={6} lg={5} xl={5} className="mx-auto">
                <div>
                    <p style={innerHeading}><strong>{`${data.testingType === 6 ? `Scheduler A` : `Scheduler`}`}</strong></p>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="schType1" id="schType1" name="schType1" value={data.schType1} onChange={handleChangeDefaultName}>
                            <Row>
                                <Col md={12}>
                                    <FormControlLabel value={1} control={<Radio color="primary" />} label="Send Now" />
                                </Col>
                                <Col md={12}>
                                    <FormControlLabel value={2} control={<Radio color="primary" />} label="Schedule For Later" />
                                </Col>
                            </Row>
                        </RadioGroup>
                        {data.schType1 === 2 ?
                            <div>
                                <p>We recommend not to send multiple campaign at same time.</p>
                                <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5">
                                    <DateTimePicker
                                        value={new Date(data.sendOnDateTime1)}
                                        inputFormat="MM/dd/yyyy hh:mm a"
                                        onChange={(value) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    sendOnDateTime1: dateTimeFormat(value)
                                                };
                                            })
                                        }}
                                        slotProps={{ textField: { variant: "standard" } }}
                                        minDateTime={new Date()}
                                    />
                                </LocalizationProvider>
                            </div> : null}
                    </FormControl>
                </div>
                {data.testingType && data.testingType === 6 &&
                    < div className="mt-3">
                        <p style={innerHeading}><strong>Scheduler B</strong></p>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="schType2" id="schType2" name="schType2" value={data.schType2} onChange={handleChangeDefaultName
                            }>
                                <Row>
                                    <Col md={12}>
                                        <FormControlLabel value={1} control={<Radio color="primary" />} label="Send Now" />
                                    </Col>
                                    <Col md={12}>
                                        <FormControlLabel value={2} control={<Radio color="primary" />} label="Schedule For Later" />
                                    </Col>
                                </Row>
                            </RadioGroup>
                            {data.schType2 === 2 ?
                                <div>
                                    <p>We recommend not to send multiple campaign at same time.</p>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5">
                                        <DateTimePicker
                                            value={new Date(data.sendOnDateTime2)}
                                            inputFormat="MM/dd/yyyy hh:mm a"
                                            onChange={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        sendOnDateTime2: dateTimeFormat(value)
                                                    };
                                                })
                                            }}
                                            slotProps={{ textField: { variant: "standard" } }}
                                            minDateTime={new Date()}
                                        />
                                    </LocalizationProvider>
                                </div> : null}
                        </FormControl>
                    </div>}
                <div className="mt-3">
                    <p style={innerHeading}><strong>Choose Winner</strong></p>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="winnerType" id="winnerType" name="winnerType" value={data.winnerType} onChange={handleWinnerTypeChange}>
                            <Row>
                                <Col md={12}>
                                    <FormControlLabel value="manual" control={<Radio color="primary" />} label="Manually" />
                                </Col>
                                <Col md={12}>
                                    <FormControlLabel value="auto" control={<Radio color="primary" />} label="Automatically" />
                                </Col>
                            </Row>
                        </RadioGroup>
                        {data.winnerType === "auto" ?
                            <div className="ml-4">
                                <Row align="center" style={{ alignItems: "end" }}>
                                    <Col xs={3} style={{ display: "contents", backgroundColor: "red" }}>
                                        <p className="mb-0">By</p>
                                        <FormGroup className="ml-3" style={{ width: "100px" }}>
                                            <DropDownControls
                                                name="rateType"
                                                label="Rate Type"
                                                onChange={handleDataChange}
                                                validation={"required"}
                                                dropdownList={[{ key: "OR", value: "Open Rate" }, { key: "CR", value: "Click Rate" }]}
                                                value={data?.rateType || ""}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={5} style={{ display: "contents" }}>
                                        <p className="ml-3 mb-0">After</p>
                                        <FormGroup className="ml-3" style={{ width: "120px" }}>
                                            <DropDownControls
                                                name="time"
                                                label="Select Time"
                                                onChange={handleDataChange}
                                                validation={"required"}
                                                dropdownList={timeValues}
                                                value={data?.time || ""}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4} style={{ display: "contents" }}>
                                        <FormGroup className="ml-4" style={{ width: "100px" }}>
                                            <DropDownControls
                                                name="timeUnit"
                                                label="Select Unit"
                                                onChange={handleDataChange}
                                                validation={"required"}
                                                dropdownList={[{ key: "hours", value: "Hours" }, { key: "days", value: "Days" }]}
                                                value={data?.timeUnit || ""}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="mt-3">
                                    <span style={{ fontSize: 16 }} className="mt-5"><Input className="clientCheck" type="checkbox"
                                        checked={data.incrementalUpdate}
                                        onChange={() => {
                                            const flag = data.incrementalUpdate
                                            handleDataChange("incrementalUpdate", !flag)
                                        }} />Incremental updates for 3 tries</span>
                                </div>
                            </div>
                            : null}
                    </FormControl>
                </div>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            if (data.isSpamCheckSkipped) {
                                handleBack(2)
                            }
                            else {
                                handleBack(1)
                            }
                        }}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                            if (data.schType1 === 0) {
                                globalAlert({
                                    type: "Error",
                                    text: "Please select scheduler option.",
                                    open: true
                                })
                                return
                            }
                            if (data.testingType === 6 && data.schType2 === 0) {
                                globalAlert({
                                    type: "Error",
                                    text: "Please select scheduler option.",
                                    open: true
                                })
                                return
                            }
                            if (data.winnerType === "") {
                                globalAlert({
                                    type: "Error",
                                    text: "Please select choose winner option.",
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
        </Row >
    )
}

export default Scheduler