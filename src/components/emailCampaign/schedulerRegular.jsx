import React from "react";
import { Col, Row } from "reactstrap";
import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { dateTimeFormat } from "../../assets/commonFunctions";

const SchedulerRegular = ({
    data,
    setData = () => { },
    handleEmailOptionChange = () => { },
    handleBack = () => { },
    handleNext = () => { },
    globalAlert = () => { }
}) => {
    return (
        <Row>
            <Col xs={9} sm={9} md={6} lg={4} xl={4} className="mx-auto">
                <p className="font-size-18"><strong>Scheduler</strong></p>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="schType" id="schType" name="schType" value={data.schType} onChange={handleEmailOptionChange}>
                        <Row>
                            <Col md={12}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Send Now" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={2} control={<Radio color="primary" />} label="Schedule For Later" />
                            </Col>
                        </Row>
                    </RadioGroup>
                    {data.schType === 2 ?
                        <div>
                            <p>We recommend not to send multiple campaign at same time.</p>
                            <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5">
                                <DateTimePicker
                                    value={new Date(data.sendOnDateTime)}
                                    inputFormat="MM/dd/yyyy hh:mm a"
                                    onChange={(value) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                sendOnDateTime: dateTimeFormat(value)
                                            };
                                        })
                                    }}
                                    slotProps={{ textField: { variant: "standard" } }}
                                    minDateTime={new Date()}
                                />
                            </LocalizationProvider>
                        </div> : null}
                </FormControl>
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
                        onClick={data.schType !== 0 ? () => handleNext(1) : () => globalAlert({
                            type: "Error",
                            text: "Please select scheduler option.",
                            open: true
                        })}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default SchedulerRegular