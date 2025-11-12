import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import {Col, Row} from "reactstrap";
import {Link, Tab, Tabs} from "@mui/material";
import history from "../../../history";
import {TabPanel, a11yProps, easUrlEncoder} from "../../../assets/commonFunctions";
import Demographic from "./demographic";
import Technology from "./technology";
import DataBrowser from "./dataBrowser";
import html2canvas from "html2canvas";
import { setLoader } from "../../../actions/loaderActions";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { assessmentReportDataBrowser } from "../../../services/assessmentService";
import { genrateCsv } from "../../../assets/commonFunctions";

const AssessmentReport = ({location,setLoader, globalAlert})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [value, setValue] = useState(0);
    const [isAnimated, setIsAnimated] = useState(true);
    const dataQueAnsList = useMemo(()=>{
        return {
            "assId":id,
            "questionType":1,
            "controlTypes": [],
            "questionNumbers": [],
            "queAnsList":[],
            "participantId":0
        }
    },[id]);
    const handleChange = (event, newValue) => {
        setIsAnimated(true);
        setValue(newValue);
    };
    const handlePrint = async ()=>{
        setValue(2);
        setIsAnimated(false);
        setLoader({
            load: true,
            text: "Please wait !!!"
        })
        setTimeout(async () => {
            let count = document.getElementsByClassName("questions").length;
            let questionsData = [];
            let i;
            for (i = 0; i < count; i++) {
                let t = await htmlToCanvas(document.getElementsByClassName("questions").item(i));
                questionsData.push(t);
            }
            count = document.getElementsByClassName("country-main").length;
            let countryData = [];
            for (i = 0; i < count; i++) {
                let countryMain = document.getElementsByClassName("country-main").item(i);
                let t = [];
                t.push(await htmlToCanvas(countryMain.childNodes[0]));
                for(let j = 1; j < countryMain.childElementCount; j++){
                    t.push(await htmlToCanvas(countryMain.childNodes[j]));
                }
                countryData.push(t);
            }
            let canvasData = {"questionsData":questionsData, "countryData":countryData, "reportType":"Assessment"};
            sessionStorage.setItem("canvasData", JSON.stringify(canvasData));
            setLoader({
                load: false
            })
            window.open(`/reportpdf`);
        },2000);
    }
    const handleCsv = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        })
        assessmentReportDataBrowser(dataQueAnsList).then(res => {
            if (res.status === 200) {
                genrateCsv("Assessment", res.result.assessmentName, res.result.questions, res.result.countryList);
                setLoader({
                    load: false
                })
            } else {
                setLoader({
                    load: false
                })
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const htmlToCanvas = async(item) => {
        return html2canvas(item, {
            scrollX: 0,
            scrollY: -window.scrollY
        }).then(canvas => {
            return canvas.toDataURL();
        });
    }
    return (
        <Row className="midleMain">
            <Col xs={12}>
                <Row>
                    <Col xs={12}>
                        <div className="d-flex align-items-center">
                            <div className="icon-wrapper mr-3">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={()=>{history.push("/manageassessment")}}>
                                    <i className="far fa-long-arrow-left"></i>
                                    <div className="bg-dark-grey"></div>
                                </Link>
                            </div>
                            <h3>Assessment Report</h3>
                            <div className="icon-wrapper d-inline-block mx-5">
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="Print" onClick={handlePrint}>
                                    <i className="far fa-print"></i>
                                    <div className="bg-dark-blue"></div>
                                </Link>
                                <Link component="a" className="btn-circle" data-toggle="tooltip" title="CSV" onClick={handleCsv}>
                                    <i class="far fa-file-csv"></i>
                                    <div className="bg-dark-grey"></div>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                        <Tabs
                            color="black"
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Demographic" {...a11yProps(0)}/>
                            <Tab label="Technology" {...a11yProps(1)}/>
                            <Tab label="Data Browser" {...a11yProps(2)}/>
                            {/*<Tab label="Participants" {...a11yProps(3)}/>*/}
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TabPanel value={value} index={0}><Demographic id={id}/></TabPanel>
                        <TabPanel value={value} index={1}><Technology id={id}/></TabPanel>
                        <TabPanel value={value} index={2}><DataBrowser id={id} isAnimated={isAnimated} setIsAnimated={setIsAnimated}/></TabPanel>
                        {/*<TabPanel value={value} index={3}><Participants id={id} isAnimated={isAnimated}/></TabPanel>*/}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        setLoader: (data) => {
            dispatch(setLoader(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}

export default connect(null, mapDispatchToProps)(AssessmentReport);