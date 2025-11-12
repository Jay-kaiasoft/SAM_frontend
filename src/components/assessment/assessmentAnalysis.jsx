import React, {useEffect, useState} from "react";
import {Col, Row, Table} from "reactstrap";
import {Tab, Tabs, TextField, Button, Select, MenuItem} from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import {connect} from "react-redux";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import $ from 'jquery';
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';
import NumberField from "../shared/commonControlls/numberField";
import {TabPanel, a11yProps} from "../../assets/commonFunctions";


const AssessmentAnalysis = ({analysisJson, setAnalysisJson, globalAlert})=>{
    const [value, setValue] = useState(0);
    const [assessmentTotalPoint, setAssessmentTotalPoint] = useState(0);
    const [overAllMinValueInput, setOverAllMinValueInput] = useState(0);
    const [overAllMaxValueInput, setOverAllMaxValueInput] = useState(0);
    const [overAllLabelInput, setOverAllLabelInput] = useState("");
    const [overAllDetailInput, setOverAllDetailInput] = useState("");
    const [overAllColorInput, setOverAllColorInput] = useState("#000000");
    const [overAllSaveMode, setOverAllSaveMode] = useState(true);
    const [overAllIndex, setOverallIndex] = useState(0);
    const [categoryMinValueInput, setCategoryMinValueInput] = useState(0);
    const [categoryMaxValueInput, setCategoryMaxValueInput] = useState(0);
    const [categoryLabelInput, setCategoryLabelInput] = useState("");
    const [categoryDetailInput, setCategoryDetailInput] = useState("");
    const [categoryColorInput, setCategoryColorInput] = useState("#000000");
    const [categorySaveMode, setCategorySaveMode] = useState(true);
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editedAnalysisJson, setEditedAnalysisJson] = useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const requiredFieldMsg = (requiredField)=>{

        globalAlert({
            type: "Error",
            text: `Please enter ${requiredField}.`,
            open: true
        });
    }
    const handleOverallSaveClick = ()=>{
        if(overAllMinValueInput === 0){
            requiredFieldMsg("minimum value");
            return false;
        } else if(overAllMaxValueInput === 0){
            requiredFieldMsg("maximum value");
            return false;
        } else if(overAllLabelInput === ""){
            requiredFieldMsg("label details");
            return false;
        } else if(overAllDetailInput === ""){
            requiredFieldMsg("details");
            return false;
        } else if(overAllMinValueInput > overAllMaxValueInput){
            globalAlert({
                type: "Error",
                text: `Min value can not be greater than max value`,
                open: true
            });
            return false;
        } else if(analysisJson.overall.ranges.length !== 0 && overAllMinValueInput < analysisJson.overall.ranges[analysisJson.overall.ranges.length -1].maxValue && overAllSaveMode){
            globalAlert({
                type: "Error",
                text: `Please enter valid min/max value because they are conflicting with other values`,
                open: true
            });
            return false;
        } else if(overAllMaxValueInput > analysisJson.overall.totalPoints) {
            globalAlert({
                type: "Error",
                text: `Max value can not be greater than total points`,
                open: true
            });
            return false;
        } else {
            let tempJson = {
                minValue: overAllMinValueInput,
                maxValue: overAllMaxValueInput,
                label: overAllLabelInput,
                details: overAllDetailInput,
                color: overAllColorInput
            };
            if(overAllSaveMode){
                setAnalysisJson((prev)=>{
                    prev.overall.ranges.push(tempJson);
                    return {...prev};
                });
            } else {
                setAnalysisJson((prev)=>{
                    prev.overall.ranges[overAllIndex] = tempJson;
                    return {...prev};
                });
                setOverAllSaveMode(true);
            }
        }
        setOverAllColorInput("#000000");
        setOverAllDetailInput("");
        setOverAllLabelInput("");
        setOverAllMaxValueInput(0);
        setOverAllMinValueInput(0);
    };
    const handleOverallEditClick = (i) => {
        setOverAllSaveMode(false);
        setOverallIndex(i);
        setOverAllColorInput(analysisJson.overall.ranges[i].color);
        setOverAllDetailInput(analysisJson.overall.ranges[i].details);
        setOverAllLabelInput(analysisJson.overall.ranges[i].label);
        setOverAllMaxValueInput(analysisJson.overall.ranges[i].maxValue);
        setOverAllMinValueInput(analysisJson.overall.ranges[i].minValue);
    };
    const handleOverallDeleteClick = (i)=>{
        setAnalysisJson((prev)=>{
            prev.overall.ranges.splice(i, 1);
            return {...prev};
        });
    };
    const handleCategorySaveClick = () => {
        if(selectedCategory !== ""){
            if(categoryMinValueInput === 0){
                requiredFieldMsg("minimum value");
                return false;
            } else if(categoryMaxValueInput === 0){
                requiredFieldMsg("maximum value");
                return false;
            } else if(categoryLabelInput === ""){
                requiredFieldMsg("label details");
                return false;
            } else if(categoryDetailInput === ""){
                requiredFieldMsg("details");
                return false;
            } else if(categoryMinValueInput > categoryMaxValueInput){
                globalAlert({
                    type: "Error",
                    text: `Min value can not be greater than max value`,
                    open: true
                });
                return false;
            } else if(analysisJson.categoryWise[selectedCategory].ranges.length !== 0 && categoryMinValueInput < analysisJson.categoryWise[selectedCategory].ranges[analysisJson.categoryWise[selectedCategory].ranges.length -1].maxValue && categorySaveMode){
                globalAlert({
                    type: "Error",
                    text: `Please enter valid min/max value because they are conflicting with other values`,
                    open: true
                });
                return false;
            } else if(categoryMaxValueInput > analysisJson.categoryWise[selectedCategory].totalPoints) {
                globalAlert({
                    type: "Error",
                    text: `Max value can not be greater than total points`,
                    open: true
                });
                return false;
            } else {
                let tempJson = {
                    minValue: categoryMinValueInput,
                    maxValue: categoryMaxValueInput,
                    label: categoryLabelInput,
                    details: categoryDetailInput,
                    color: categoryColorInput
                };
                if(categorySaveMode){
                    setAnalysisJson((prev)=>{
                        prev.categoryWise[selectedCategory].ranges.push(tempJson);
                        return {...prev};
                    });
                } else {
                    setAnalysisJson((prev)=>{
                        prev.categoryWise[selectedCategory].ranges[categoryIndex] = tempJson;
                        return {...prev};
                    });
                    setCategorySaveMode(true);
                }
            }
        } else{
            globalAlert({
                type: "Error",
                text: `Please select a section first`,
                open: true
            });
        }
        setCategoryColorInput("#000000");
        setCategoryDetailInput("");
        setCategoryLabelInput("");
        setCategoryMaxValueInput(0);
        setCategoryMinValueInput(0);
    };
    const handleCategoryEditClick = (i,v) => {
        setCategorySaveMode(false);
        setCategoryIndex(i);
        setSelectedCategory(v);
        setCategoryColorInput(analysisJson.categoryWise[v].ranges[i].color);
        setCategoryDetailInput(analysisJson.categoryWise[v].ranges[i].details);
        setCategoryLabelInput(analysisJson.categoryWise[v].ranges[i].label);
        setCategoryMaxValueInput(analysisJson.categoryWise[v].ranges[i].maxValue);
        setCategoryMinValueInput(analysisJson.categoryWise[v].ranges[i].minValue);
    };
    const handleCategoryDeleteClick = (i, v) => {
        setAnalysisJson((prev)=>{
            prev.categoryWise[v].ranges.splice(i, 1);
            return {...prev};
        });
    };
    useEffect(()=>{
        setAssessmentTotalPoint(analysisJson.overall.totalPoints);
    }, [analysisJson.overall.totalPoints]);
    useEffect(()=>{
        $("#overAllColorPicker").spectrum({
            allowEmpty:true,
            color: overAllColorInput,
            showInput: true,
            className: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            showAlpha: true,
            maxSelectionSize: 1000,
            preferredFormat: "hex",
            localStorageKey: "spectrum.homepage",
            change: function(color) {
                setOverAllColorInput(color.toHexString());
            },
            chooseText: "Select",
            palette: []
        });
        $("#categoryColorPicker").spectrum({
            allowEmpty:true,
            color: categoryColorInput,
            showInput: true,
            className: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            showAlpha: true,
            maxSelectionSize: 1000,
            preferredFormat: "hex",
            localStorageKey: "spectrum.homepage",
            change: function(color) {
                setCategoryColorInput(color.toHexString());
            },
            chooseText: "Select",
            palette: []
        });
    }, [overAllColorInput, categoryColorInput, value]);
    useEffect(()=>{
        let t = 0;
        analysisJson.categoryWise.forEach((value)=>{
            t += value.ranges.length > 0 ? 1 : 0
        })
        setEditedAnalysisJson(t === 0 ? false : true);
    },[analysisJson]);
    return (
        <>
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
                        <Tab {...a11yProps(0)} label="Overall Analysis Range"/>
                        <Tab label="Section Analysis Range" {...a11yProps(1)} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabPanel value={value} index={0}>
                        <Row>
                            <Col style={{height:"30px"}}>Assessment Total Points: <strong>{assessmentTotalPoint}</strong></Col>
                        </Row>
                        <Row className="mt-3">
                            <Col xs={3}>
                                <NumberField type="text" value={overAllMinValueInput} onChange={(_, value)=>{setOverAllMinValueInput(parseInt(value))}} label="Min Value" format="####################"/>
                            </Col>
                            <Col xs={3}>
                                <NumberField type="text" value={overAllMaxValueInput} onChange={(_, value)=>{setOverAllMaxValueInput(parseInt(value))}} label="Max Value" format="####################"/>
                            </Col>
                            <Col xs={3}>
                                <InputField type="text" value={overAllLabelInput} onChange={(_, value)=>{setOverAllLabelInput(value)}} label="Label"/>
                            </Col>
                            <Col xs={3} className="d-flex align-items-end justify-content-center">
                                <input type="text" defaultValue={overAllColorInput} id="overAllColorPicker"/>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col xs={12}>
                                <TextField
                                    multiline
                                    fullWidth
                                    variant="standard"
                                    minRows={4}
                                    label="Details"
                                    value={overAllDetailInput}
                                    onChange={(e)=>{setOverAllDetailInput(e.target.value)}}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center align-items-center mt-3">
                            <Button variant="contained" color="primary" onClick={handleOverallSaveClick}><i className="far fa-save mr-2"></i>SAVE</Button>
                        </Row>
                        {
                            analysisJson.overall.ranges.length > 0 &&
                                <Row className="mt-4">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Range</th>
                                                <th>Label</th>
                                                <th>Color</th>
                                                <th>Details</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                analysisJson.overall.ranges.map((val, i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td>{val.minValue} - {val.maxValue}</td>
                                                            <td>{val.label}</td>
                                                            <td><div style={{width: 30, height: 20, backgroundColor: val.color}}></div></td>
                                                            <td>{val.details}</td>
                                                            <td>
                                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={()=>{handleOverallEditClick(i)}}></i>
                                                                <i className="far fa-trash-alt ml-2" data-toggle="tooltip" title="Delete" onClick={()=>{handleOverallDeleteClick(i)}}></i>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Row>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Row>
                            <Col xs={4}>
                                <Select
                                    value={selectedCategory || "Select Section"}
                                    onChange={(e)=>{
                                        setSelectedCategory(e.target.value === "Select Section" ? "" : e.target.value);
                                    }}
                                    className="w-100"
                                    variant="standard"
                                >
                                    <MenuItem value="Select Section">Select Section</MenuItem>
                                    {
                                        analysisJson.categoryWise.map((val, i)=>{
                                            return <MenuItem value={""+val.index} key={i}>
                                                <div className="d-flex">
                                                    <div className="lfCatColorBox" style={{backgroundColor: val.catColor}}></div>
                                                    <div>{val.catName}</div>
                                                </div>
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col xs={4}>{selectedCategory !== "" && <p className="mb-0 mt-1">Total Points : <strong>{analysisJson.categoryWise[selectedCategory].totalPoints}</strong></p>}</Col>
                        </Row>
                        <Row className="mt-3">
                            <Col xs={3}>
                                <NumberField type="text" value={categoryMinValueInput} onChange={(_, value)=>{setCategoryMinValueInput(parseInt(value))}} label="Min Value" format="####################"/>
                            </Col>
                            <Col xs={3}>
                                <NumberField type="text" value={categoryMaxValueInput} onChange={(_, value)=>{setCategoryMaxValueInput(parseInt(value))}} label="Max Value" format="####################"/>
                            </Col>
                            <Col xs={3}>
                                <InputField type="text" value={categoryLabelInput} onChange={(_, value)=>{setCategoryLabelInput(value)}} label="Label"/>
                            </Col>
                            <Col xs={3} className="d-flex align-items-end justify-content-center">
                                <input type="text" defaultValue={categoryColorInput} id="categoryColorPicker"/>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col xs={12}>
                                <TextField
                                    multiline
                                    fullWidth
                                    minRows={4}
                                    label="Details"
                                    value={categoryDetailInput}
                                    onChange={(e)=>{setCategoryDetailInput(e.target.value)}}
                                    variant="standard"
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center align-items-center mt-3">
                            <Button variant="contained" color="primary" onClick={handleCategorySaveClick}><i className="far fa-save mr-2"></i>SAVE</Button>
                        </Row>
                        {
                            editedAnalysisJson ?
                                <Row className="mt-4">
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Range</th>
                                            <th>Label</th>
                                            <th>Section</th>
                                            <th>Color</th>
                                            <th>Details</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            selectedCategory !== "" ?
                                                analysisJson.categoryWise[selectedCategory].ranges.length > 0 ?
                                                    analysisJson.categoryWise[selectedCategory].ranges.map((val, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{val.minValue} - {val.maxValue}</td>
                                                                <td>{val.label}</td>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <div className="lfCatColorBox" style={{backgroundColor: analysisJson.categoryWise[selectedCategory].catColor}}></div>
                                                                        <div>{analysisJson.categoryWise[selectedCategory].catName}</div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{
                                                                        width: 30,
                                                                        height: 20,
                                                                        backgroundColor: val.color
                                                                    }}></div>
                                                                </td>
                                                                <td>{val.details}</td>
                                                                <td>
                                                                    <i className="far fa-pencil-alt" data-toggle="tooltip"
                                                                       title="Edit" onClick={() => {
                                                                        handleCategoryEditClick(i, selectedCategory)
                                                                    }}></i>
                                                                    <i className="far fa-trash-alt ml-2"
                                                                       data-toggle="tooltip" title="Delete" onClick={() => {
                                                                        handleCategoryDeleteClick(i, selectedCategory)
                                                                    }}></i>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                :
                                                    <tr><td colSpan="6" className="text-center">No Range found for selected Section</td></tr>
                                            :
                                                analysisJson.categoryWise.map((v) => {
                                                    return v.ranges.map((val, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{val.minValue} - {val.maxValue}</td>
                                                                <td>{val.label}</td>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <div className="lfCatColorBox" style={{backgroundColor: v.catColor}}></div>
                                                                        <div>{v.catName}</div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{
                                                                        width: 30,
                                                                        height: 20,
                                                                        backgroundColor: val.color
                                                                    }}></div>
                                                                </td>
                                                                <td>{val.details}</td>
                                                                <td>
                                                                    <i className="far fa-pencil-alt"
                                                                       data-toggle="tooltip" title="Edit"
                                                                       onClick={() => {
                                                                           handleCategoryEditClick(i, v.index)
                                                                       }}></i>
                                                                    <i className="far fa-trash-alt ml-1"
                                                                       data-toggle="tooltip" title="Delete"
                                                                       onClick={() => {
                                                                           handleCategoryDeleteClick(i, v.index)
                                                                       }}></i>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                })
                                        }
                                        </tbody>
                                    </Table>
                                </Row>
                            : null
                        }
                    </TabPanel>
                </Col>
            </Row>
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
export default connect(null, mapDispatchToProps)(AssessmentAnalysis);
