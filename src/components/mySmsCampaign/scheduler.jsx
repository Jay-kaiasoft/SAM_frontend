import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Col, Row } from "reactstrap";
import { dateTimeFormatDB } from "../../assets/commonFunctions";

const innerHeading = {
    fontSize: 18
}

const Scheduler = ({
    data,
    setData = () => { },
    handleSmsOptionChange = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                <p style={innerHeading}><strong>Scheduler</strong></p>
                <FormControl component="fieldset">
                    <RadioGroup aria-label="scheduleType" id="scheduleType" name="scheduleType" value={data.scheduleType} onChange={handleSmsOptionChange}>
                        <Row>
                            <Col md={12}>
                                <FormControlLabel value={1} control={<Radio color="primary" />} label="Send Now" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value={2} control={<Radio color="primary" />} label="Schedule For Later" />
                            </Col>

                        </Row>
                    </RadioGroup>
                </FormControl>
                {
                    data.scheduleType === 2 ?
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    value={new Date(data.sendOnDate)}
                                    inputFormat="MM/dd/yyyy hh:mm a"
                                    onChange={(value) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                sendOnDate: dateTimeFormatDB(value)
                                            };
                                        })
                                    }}
                                    slotProps={{ textField: { variant: "standard" } }}
                                    minDateTime={new Date()}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        :
                        null
                }
            </Col>
        </Row>
    )
}

export default Scheduler