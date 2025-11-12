import React from "react";
import { Col, Row } from "reactstrap";
import {Radio, RadioGroup, FormControl, FormControlLabel} from '@mui/material';
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {dateTimeFormatDB} from '../../../assets/commonFunctions';

const Scheduler = ({
    data,
    handleDataChange
}) => {
    console.log("data",data)
    
    return (
        <Row>
            <Col xl={10} className='mx-auto'>
                <p className='heading-style'>Select Schedule Details</p>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="schType"
                        id="schType" 
                        name="schType"
                        value={data?.schType || 0}
                        onChange={(event) => {
                            handleDataChange("schType", Number(event.target.value))
                        }}>
                        <FormControlLabel value={1} control={<Radio color="primary" />} label="Start When Automation Campaign Is Published" />
                        <FormControlLabel value={2} control={<Radio color="primary" />} label="Automation Start Scheduler" />
                    </RadioGroup>
                    {data?.schType === 2 ?
                        <div className='mt-3' style={{ minWidth: "400px" }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5 w-100">
                                <DateTimePicker
                                    value={new Date(data?.sendDateTime)}
                                    inputFormat="MM/dd/yyyy hh:mm a"
                                    onChange={(value) => {
                                        handleDataChange("sendDateTime", dateTimeFormatDB(value))
                                    }}
                                    sx={{ width: 250 }}
                                    slotProps={{ textField: { variant: "standard" } }}
                                    minDateTime={new Date()}
                                />
                            </LocalizationProvider>
                        </div> : null}
                </FormControl>
            </Col>
        </Row>
    )
}
export default Scheduler;