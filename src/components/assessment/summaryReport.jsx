import React, {useCallback, useEffect, useState} from 'react';
import {Col, Row} from "reactstrap";
import {Button, Tab, Tabs} from "@mui/material";
import {TabPanel, a11yProps} from "../../assets/commonFunctions";
import { websiteColor } from '../../config/api';

const SummaryReport = ({setIsDone,overAll,assAtAnalysis}) => {
    const [value, setValue] = useState(0);
    const [assAtAnalysisData, setAssAtAnalysisData] = useState([]);
    const overAllData = assAtAnalysis.overall.ranges.filter((v,i)=>{ return v.minValue <= overAll.overAllPoints  && v.maxValue >= overAll.overAllPoints })[0];
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const displayAssAtAnalysisData = useCallback(() => {
        let t = [];
        overAll?.assessmentsCatPointsList.forEach((v,i)=>{
            let x = assAtAnalysis.categoryWise[i].ranges.filter((av,ai)=>( av.minValue <= v.points  && av.maxValue >= v.points ));
            if(x.length > 0){
                t.push({...x[0],catName:v.catName});
            }
        });
        setAssAtAnalysisData(t);
    },[assAtAnalysis,overAll?.assessmentsCatPointsList]);
    useEffect(()=>{
        displayAssAtAnalysisData();
    },[displayAssAtAnalysisData]);
    return(
        <div className="container w-50 mx-auto py-5">
            <Row>
                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Tabs
                        color="black"
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Summary" {...a11yProps(0)} />
                        <Tab label="Detail Results" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        <div className="detailResultsMain">
                            {
                                typeof overAllData !== "undefined" ?
                                    <Row className="rounded-lg mb-5" style={{border:`1px solid ${overAllData.color}`}}>
                                        <Col xs={12} className="text-white p-3" style={{backgroundColor:overAllData.color}}>
                                            <Row>
                                                <Col xs={6}>Summary Results</Col>
                                                <Col xs={6} className="text-right">Result :{overAllData.label}</Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} className="p-3">{overAllData.details}</Col>
                                    </Row>
                                :
                                    <Row className="rounded-lg mb-5" style={{border:`1px solid ${websiteColor}`}}>
                                        <Col xs={12} className="text-white p-3" style={{backgroundColor:websiteColor}}>
                                            <Row>
                                                <Col xs={6}>Summary Results</Col>
                                                <Col xs={6} className="text-right"></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} className="p-3">Not Evaluated</Col>
                                    </Row>
                            }
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="detailResultsMain">
                            {
                                typeof overAllData !== "undefined" ?
                                    <Row className="rounded-lg mb-5" style={{border:`1px solid ${overAllData.color}`}}>
                                        <Col xs={12} className="text-white p-3" style={{backgroundColor:overAllData.color}}>
                                            <Row>
                                                <Col xs={6}>Summary Results</Col>
                                                <Col xs={6} className="text-right">Result :{overAllData.label}</Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} className="p-3">{overAllData.details}</Col>
                                    </Row>
                                :
                                    <Row className="rounded-lg mb-5" style={{border:`1px solid ${websiteColor}`}}>
                                        <Col xs={12} className="text-white p-3" style={{backgroundColor:websiteColor}}>
                                            <Row>
                                                <Col xs={6}>Summary Results</Col>
                                                <Col xs={6} className="text-right"></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12} className="p-3">Not Evaluated</Col>
                                    </Row>
                            }
                            {
                                assAtAnalysisData.length !== 0 ?
                                    assAtAnalysisData.map((v,i)=>(
                                        <Row key={i} className="rounded-lg mb-5" style={{border:`1px solid ${v.color}`}}>
                                            <Col xs={12} className="text-white p-3" style={{backgroundColor:v.color}}>
                                                <Row>
                                                    <Col xs={6}>{v.catName}</Col>
                                                    <Col xs={6} className="text-right">Result :{v.label}</Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} className="p-3">{v.details}</Col>
                                        </Row>
                                    ))
                                : null
                            }
                        </div>
                    </TabPanel>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="text-center">
                    <Button variant="contained" color="primary" onClick={()=>{setIsDone(true);}}>NEXT</Button>
                </Col>
            </Row>
        </div>
    );
}

export default SummaryReport;