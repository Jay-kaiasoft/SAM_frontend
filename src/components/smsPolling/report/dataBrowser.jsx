import React, {useCallback, useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {smsPollingReportDataBrowser} from "../../../services/smsPollingService";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import {OptionQuestion, TextQuestion} from "../../shared/chartJsComponent/utilityQuestion";
import Filter from "./filter";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import Switch from "@mui/material/Switch";

const DataBrowser = ({globalAlert, id, isAnimated})=>{
    const [data, setData] = useState({});
    const [barChart, setBarChart] = useState(false);
    const [pieChart, setPieChart] = useState(true);
    const dataQueAnsList = useMemo(()=>{
        return {
            "sid":id,
            "questionType":1,
            "controlTypes": [],
            "questionNumbers": [],
            "queAnsList": [],
            "toNumber": ""
        }
    },[id]);
    const displaySmsPollingReportDataBrowser = useCallback((dataQueAnsList) => {
        smsPollingReportDataBrowser(dataQueAnsList).then(res => {
            if(res.status === 200){
                if (res.result) {
                    setData(res.result);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[globalAlert]);
    useEffect(()=>{
        displaySmsPollingReportDataBrowser(dataQueAnsList);
    },[displaySmsPollingReportDataBrowser,dataQueAnsList]);
    return (
        <>
            <h4>SMS Polling : {data.smsPolling}</h4>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header"><h4 className="text-center w-100">Filters</h4></AccordionSummary>
                <AccordionDetails>
                    <Filter id={id} globalAlert={globalAlert} displaySmsPollingReportDataBrowser={displaySmsPollingReportDataBrowser} />
                </AccordionDetails>
            </Accordion>
            <div className="d-flex justify-content-end my-2 mx-0">
                <div>
                    <h6 className="d-inline-block">Pie Chart</h6>
                    <Switch color="primary" checked={pieChart} onChange={()=>{setPieChart(!pieChart)}} name='pie' />
                </div>
                <div>
                    <h6 className="d-inline-block">Bar Chart</h6>
                    <Switch color="primary" checked={barChart} onChange={()=>{setBarChart(!barChart)}} name='bar' />
                </div>
            </div>
            {
                !(data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) &&
                    <>
                        {
                            data.questions.length > 0 ?
                                data.questions.map((value, index) => (
                                    value.queTypeId === 1 ?
                                        <OptionQuestion key={index} index={index} value={value} isAnimated={isAnimated} pieChart={pieChart} barChart={barChart}/>
                                    :
                                        <TextQuestion key={index} value={value}/>
                                ))
                            : null
                        }
                </>
            }
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(DataBrowser);