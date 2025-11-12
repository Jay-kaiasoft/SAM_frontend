import { Fragment, useEffect, useRef, useState } from 'react';
import { createCaptcha, dateFormat, getObjectTime, numberWithCommas, timeFormat } from '../../../assets/commonFunctions';
import {LocalizationProvider, DatePicker, TimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import useWindowSize from './useWindowSize';
import InputField from './inputField';
import { getCountry } from '../../../services/commonService';
import { siteURL } from '../../../config/api';
import NumberField from './numberField';
import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from 'react-sortablejs';
import { ZoomModal } from '../editor/commonComponentsForEditor';
import { connect } from 'react-redux';
import Signature from '@uiw/react-signature/canvas';

const OpenEnded = ({questionJson, setValueJson, useStyles, callFrom, reset})=>{
    let questionName;
    if(callFrom === "fromForm"){
        questionName = "queQuestion";
    } else if(callFrom === "fromSurvey"){
        questionName = "squeQuestion";
    }else if(callFrom === "fromAssessment"){
        questionName = "aqueQuestion";
    }
	useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        questionJson.longAnswer ?
            <TextField label={questionJson.labellessAnswer ? questionJson[questionName] : "Enter answer"} variant="standard" value={questionJson?.value || ""} onChange={(e)=>{setValueJson(e.target.value)}} multiline minRows={3} className="mb-2" sx={useStyles.root} fullWidth/>
        :
            <TextField label={questionJson.labellessAnswer ? questionJson[questionName] : "Enter answer"} variant="standard" value={questionJson?.value || ""} onChange={(e)=>{setValueJson(e.target.value)}} className="mb-2" sx={useStyles.root} fullWidth/>
    );
}

const RadioCheckBoxControl = ({questionJson, setValueJson, setValueJsonComment, callFrom, setFormData, useStyles, reset})=>{
    let valueName,optionName,commentName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
        commentName = "optComment";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
        commentName = "soptComment";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
        commentName = "aoptComment";
    }
    const callFormLink = (value) => {
        let f = questionJson[optionName].find((val)=>{return val[valueName] === value});
        if(f.hasOwnProperty("formLink") && f.formLink !== ""){
            let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
            let obj = {...location, display: true};
            obj.mode = callFrom;
            setFormData(obj);         
        }
    }
    const handleChangeRadio = (value) => {
        setValueJsonComment(value, "");
        setValueJson(value);
        callFormLink(value);
    }
    const handleChangeCheckBox = (value, checked) => {
        if(typeof questionJson?.value === "undefined"){
            setValueJson([value]);
        } else {
            if(questionJson?.value?.includes(value)){
                setValueJsonComment(value, "");
                setValueJson(questionJson?.value.filter(x => x !== value));
            } else {
                setValueJson([...questionJson?.value,value]);
            }
        }
        if(checked){
            callFormLink(value);
        }
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
            if (questionJson.multipleAnswer) {
                questionJson.value = []
                setValueJson([])
            } else {
                setValueJson("")
            }
        }
    }, [reset])
    return (
        questionJson[optionName].length > 0 && questionJson.multipleAnswer === false ?
            <RadioGroup 
                aria-label="group" 
                name="group" 
                value={questionJson?.value || ""} 
                onChange={(e)=>{ handleChangeRadio(e.target.value) }}
            >
                {
                    questionJson[optionName].map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <FormControlLabel value={value[valueName]} control={<Radio color="primary"/>} label={value[valueName]} sx={useStyles.root}/>
                                {(questionJson?.value === value[valueName] && value[commentName] === "yes") && <TextField label="Enter comment" variant="standard" value={questionJson?.comment?.[questionJson?.value] || ""} onChange={(e)=>{setValueJsonComment(questionJson?.value, e.target.value)}} className="mb-4" sx={useStyles.root} fullWidth/>}
                            </Fragment>
                        )
                    })
                }
            </RadioGroup>
        :
            <FormGroup>
                {
                    questionJson[optionName].map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <FormControlLabel
                                    key={index}
                                    value={value[valueName]}
                                    control={
                                        <Checkbox 
                                            color="primary" 
                                            onChange={(e) => { handleChangeCheckBox(value[valueName],e.target.checked) }}
                                            checked={questionJson?.value?.includes(value[valueName]) || false}
                                        />
                                    } 
                                    label={value[valueName]}
                                    sx={useStyles.root}
                                />
                                {(questionJson?.value?.includes(value[valueName]) && value[commentName] === "yes") && <TextField label="Enter comment" variant="standard" value={questionJson?.comment?.[value[valueName]] || ""} onChange={(e)=>{setValueJsonComment(value[valueName], e.target.value)}} className="mb-4" sx={useStyles.root} fullWidth/>}
                            </Fragment>
                        )
                    })
                }
            </FormGroup>
    );
}

const SingleAnswerButton = ({questionJson, setValueJson, callFrom, setFormData, useStyles, reset})=>{
    let valueName,optionName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
    }
    const handleChange = (value) => {
        setValueJson(value);
        if(callFrom !== "fromForm"){
            let f = questionJson[optionName].find((val)=>{return val[valueName] === value});
            if(f.hasOwnProperty("formLink") && f.formLink !== ""){
                let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
                let obj = {...location, display: true};
                obj.mode = callFrom;
                setFormData(obj);         
            }
        }
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        questionJson[optionName].length > 0 ?
            questionJson[optionName].map((value, index) => {
                return (
                    <div key={index} className="mb-3 pt-1">
                        <Button
                            variant="contained" 
                            color="primary" 
                            onClick={() => { handleChange(value[valueName]); }}
                            className={questionJson?.value === value[valueName] ? "active mr-3" : "mr-3"}
                            sx={useStyles.root}
                        >
                            {value[valueName]}
                        </Button>
                    </div>
                )
            })
        : null
    );
}

const SingleAnswerCombo = ({questionJson, setValueJson, callFrom, setFormData, useStyles, reset})=>{
    let valueName,optionName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
    }
    const handleSelectChange = (value) => {
        if(questionJson.multipleAnswer){
            if(typeof value === "string"){
                setValueJson(value.split(","));
            } else{
                setValueJson(value)
            }
        } else {
            setValueJson(value)
        }
        if(callFrom !== "fromForm"){
            let tempValue;
            if(typeof value === "string"){
                tempValue = value;
            } else {
                tempValue = value[value.length-1];
            }
            let f = questionJson[optionName].find((val)=>{return val[valueName] === tempValue});
            if(f.hasOwnProperty("formLink") && f.formLink !== ""){
                let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
                let obj = {...location, display: true};
                obj.mode = callFrom;
                setFormData(obj);         
            }
        }
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
            if (questionJson.multipleAnswer) {
                questionJson.value = []
                setValueJson([])
            } else {
                setValueJson("")
            }
        }
    }, [reset])
    return (
        questionJson[optionName].length > 0 ?
            <FormControl variant="standard" fullWidth>
                <InputLabel id="combo-label" variant="standard" sx={useStyles.root}>Select Answer</InputLabel>
                <Select 
                    value={typeof questionJson?.value === "undefined" && questionJson.multipleAnswer?[]:(questionJson?.value || "")} 
                    onChange={(e)=>{handleSelectChange(e.target.value)}} 
                    className="mb-2 pt-1" 
                    multiple={questionJson.multipleAnswer}
                    sx={useStyles.root}
                >
                    {
                        questionJson[optionName].map((value, index) => {
                            return (
                                <MenuItem key={index} value={value[valueName]} sx={useStyles.root}>{value[valueName]}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        : null
    );
}

const DateControl = ({questionJson, setValueJson, useStyles, callFrom, reset})=>{
    let questionName;
    if(callFrom === "fromForm"){
        questionName = "queQuestion";
    } else if(callFrom === "fromSurvey"){
        questionName = "squeQuestion";
    }else if(callFrom === "fromAssessment"){
        questionName = "aqueQuestion";
    }
    let min = questionJson.startDate === null?new Date("01/01/1970"):new Date(questionJson.startDate);
    let max = questionJson.endDate === null?new Date("01/01/2170"):new Date(questionJson.endDate);
    useEffect(()=>{
        if(typeof questionJson?.value === "undefined"){
            if(questionJson.startDate === null){
                setValueJson(dateFormat(new Date()));
            } else {
                setValueJson(min);
            }
        }
    },[]);
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={new Date(questionJson?.value)}
                label={questionJson.labellessAnswer ? questionJson[questionName] : "MM/DD/YYYY"}
                inputFormat="MM/dd/yyyy"
                onChange={(v)=>{
                    setValueJson(dateFormat(v));
                }}
                sx={useStyles.root}
                slotProps={{ textField: { variant: "standard", className: "mb-2 mt-1 w-100" } }}
                minDate={min}
                maxDate={max}
            />
        </LocalizationProvider>
    );
}

const TimeControl = ({questionJson, setValueJson, useStyles, callFrom, reset})=>{
    let questionName;
    if(callFrom === "fromForm"){
        questionName = "queQuestion";
    } else if(callFrom === "fromSurvey"){
        questionName = "squeQuestion";
    }else if(callFrom === "fromAssessment"){
        questionName = "aqueQuestion";
    }
	useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    useEffect(()=>{
        if(typeof questionJson?.value === "undefined"){
            setValueJson(timeFormat(new Date()));
        }
    },[]);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
                label={questionJson.labellessAnswer ? questionJson[questionName] : "HH:MM am/pm"}
                value={getObjectTime(questionJson?.value)}
                onChange={(v) => {
                    setValueJson(timeFormat(v));
                }}
                sx={useStyles.root}
                slotProps={{ textField: { variant: "standard", className: "w-100" } }}
            />
        </LocalizationProvider>
    );
}

const getSelectedValueRating = (callFrom, questionJson) => {
    if(callFrom === "fromForm"){
        return parseInt(questionJson?.value.split("/")[0]);
    } else {
        return questionJson?.value;
    }
}

const handleOnClickRating = (callFrom, questionJson, setValueJson, setFormData, v, totalValue) => {
    if(callFrom === "fromForm"){
        setValueJson(v+"/"+totalValue)
    } else {
        setValueJson(v);
        if(questionJson.formLinks[v-1].formLink !== ""){
            let location = {location:{pathname:"/customform", search: `?${questionJson.formLinks[v-1].formLink.split("?").pop()}`,hash:"", state: undefined}}
            let obj = {...location, display: true};
            obj.mode = callFrom;
            setFormData(obj);
        }
    }
}

const RatingBoxBtn = ({questionJson, setValueJson, callFrom, setFormData, reset})=>{
    const [windowWidth,] = useWindowSize();
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        <>
            {
                (()=>{
                    if(windowWidth > 992){
                        return (
                            <>
                                <div className="row row-cols-10 rating-box">
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i)=>(
                                        <div 
                                            className={(questionJson.hasOwnProperty("value") && getSelectedValueRating(callFrom, questionJson)===v)?"col rating-box-btn active":"col rating-box-btn"}
                                            key={i}
                                            onClick={()=>{handleOnClickRating(callFrom, questionJson, setValueJson, setFormData, v, "10")}}
                                        >
                                            {v}
                                        </div>
                                    ))
                                }
                                </div>
                                <div className="row justify-content-between mb-2 pt-1">
                                    <div>{questionJson.aText}</div>
                                    <div>{questionJson.bText}</div>
                                </div>
                            </>
                        );
                    } else {
                        return (
                            <>
                                <div className="row row-cols-10 rating-box justify-content-center">
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i)=>(
                                        <div 
                                            className={(questionJson.hasOwnProperty("value") && getSelectedValueRating(callFrom, questionJson)===v)?"rating-box-btn active":"rating-box-btn"}
                                            key={i}
                                            onClick={()=>{handleOnClickRating(callFrom, questionJson, setValueJson, setFormData, v, "10")}}
                                        >
                                            {v}
                                            {
                                                i === 0 ? 
                                                    <label>{questionJson.aText}</label>:
                                                    i === 9 ?
                                                        <label>{questionJson.bText}</label>:null
                                            }
                                        </div>
                                    ))
                                }
                                </div>
                            </>
                        );
                    }
                })()
            }
        </>
    );
}

const RatingRadioBtn = ({questionJson, setValueJson, callFrom, setFormData, useStyles, reset})=>{
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        <FormControl className="pt-1">
            <RadioGroup
                row
                name="controlled-radio-buttons-group"
                value={!questionJson.hasOwnProperty("value")?0:getSelectedValueRating(callFrom, questionJson)}
                onChange={(e)=>{handleOnClickRating(callFrom, questionJson, setValueJson, setFormData, e.target.value, "10")}}
            >
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i)=>{
                        return (
                        <FormControlLabel value={v} key={i} control={<Radio color="primary"/>} label={v} labelPlacement="top" className="ml-0 mr-2" sx={useStyles.root}/>
                        );
                    })
                }
            </RadioGroup>
        </FormControl>
    );
}

const RatingSymbol = ({questionJson, setValueJson, callFrom, setFormData, reset})=>{
    const [clicked,setClicked] = useState(false);
    const [tempValue,setTempValue] = useState(0);
    let totalValue = 0, valueLength = 0;
    if(callFrom === "fromForm"){
        totalValue = questionJson.customFormOptions[0].optValue;
        valueLength = questionJson.customFormOptions[0].optValue;
    } else if(callFrom === "fromSurvey"){
        totalValue = "10";
        valueLength = questionJson.surveysOptions[0].soptValue;
    }else if(callFrom === "fromAssessment"){
        totalValue = "10";
        valueLength = questionJson.assessmentsOptions[0].aoptValue;
    }
    useEffect(()=>{
        if (reset.reset === "Yes") {
            setClicked(false);
            setClicked(false);
            setTempValue(0);
            setValueJson("")
        }
    }, [reset])
    useEffect(() => {
        setClicked(typeof questionJson?.value === "undefined" ? false : true);
        return () => {
            setClicked(false);
            setTempValue(0);
        }
    },[questionJson])
    return (
        <div className="d-flex justify-content-start text-center mb-2">
            {
                Array.from({ length: valueLength }, (_, i) =>(i+1)).map((value)=>{
                    return (
                        <i 
                            key={value}
                            className={`${value <= (typeof questionJson?.value !== "undefined"?getSelectedValueRating(callFrom, questionJson):tempValue) ?"fas":"far"} ${questionJson.symbol} rating-symbol`}
                            onMouseOver={()=>{
                                if(!clicked)
                                    setTempValue(value);
                            }}
                            onMouseOut={()=>{
                                if(!clicked)
                                    setTempValue(0);
                            }}
                            onClick={()=>{
                                setClicked(true);
                                handleOnClickRating(callFrom, questionJson, setValueJson, setFormData, value, totalValue);
                            }}
                        >        
                        </i>
                    )
                })
            }
        </div>
    );
}

const YesNo = ({questionJson, setValueJson, callFrom, setFormData, reset})=>{
    let tempColor1 = "#242424", tempColor2 = "#242424";
    if(questionJson?.value === questionJson.label1){
        tempColor1 = "#28a745";
        tempColor2 = "#242424"
    } else if(questionJson?.value === questionJson.label2){
        tempColor1 = "#242424"
        tempColor2 = "#dc3545";
    }
    const handleOnClick = (v) => {
        setValueJson(v)
        if(callFrom !== "fromForm"){
            let f = "";
            if(callFrom === "fromSurvey"){
                f = questionJson.surveysOptions.find((val)=>{return val.soptValue === v});
            }else if(callFrom === "fromAssessment"){
                f = questionJson.assessmentsOptions.find((val)=>{return val.aoptValue === v});
            }
            if(f.hasOwnProperty("formLink") && f.formLink !== ""){
                let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
                let obj = {...location, display: true};
                obj.mode = callFrom;
                setFormData(obj);         
            }
        }
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        <div className="d-flex justify-content-start pt-1">
            <div>
                <div style={{width: 100}} className="d-flex justify-content-center align-items-center p-3 border border-1 rounded cursor-pointer" onClick={()=>{handleOnClick(questionJson.label1)}}>
                    <i className={questionJson.symbol.split("/")[0]} style={{ fontSize: 50, color: tempColor1 }} > </i>
                </div>
                <p className="text-center my-2">{questionJson.label1}</p>
            </div>
            <div className="ml-3">
                <div style={{width: 100}} className="d-flex justify-content-center align-items-center p-3 border border-1 rounded cursor-pointer" onClick={()=>{handleOnClick(questionJson.label2)}}>
                    <i className={questionJson.symbol.split("/")[1]} style={{ fontSize: 50, color: tempColor2 }} > </i>
                </div>
                <p className="text-center my-2">{questionJson.label2}</p>
            </div>
        </div>
    );
}

const Matrix = ({questionJson, setValueJson, setValueJsonText, callFrom, useStyles, reset})=> {
    let type, valueName;
    if(questionJson.answerType === "1") {
        type = "radio";
    } else if(questionJson.answerType === "2") {
        type = "checkbox";
    } else {
        type = "text";
    }
    if(callFrom === "fromForm"){
        valueName = "optValue";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
    }
    let allRows = [];
    questionJson.rows.map((v)=>(
       allRows.push(v[valueName])
    ));
    let allColumns = [];
    questionJson.columns.map((v)=>(
        allColumns.push(v[valueName])
    ));
    const [matrixState, setMatrixState] = useState({});
    const [windowWidth,] = useWindowSize();
    const handleChange = (v, v1) => {
        if(type === "checkbox"){
            if(typeof questionJson?.value === "undefined"){
                setValueJson({[v]:[v1]});
            } else {
                let t = {};
                if(typeof questionJson?.value?.[v] === "undefined"){
                    t = {
                        ...questionJson.value,
                        [v]: [v1]
                    };
                } else {
                    if(questionJson?.value?.[v]?.includes(v1)){
                        t = {
                            ...questionJson.value,
                            [v]: [...questionJson?.value?.[v].filter((x)=>x !== v1)]
                        };
                    } else {
                        t = {
                            ...questionJson.value,
                            [v]: [...questionJson?.value?.[v], v1]
                        };
                    }
                }
                setValueJson(t);
            }
        } else if(type === "radio") {
            if(typeof questionJson?.value === "undefined"){
                setValueJson({[v]:[v1]});
            } else {
                let t = {...questionJson.value,[v]:[v1]};
                setValueJson(t);
            }
        }
    }
    useEffect(()=>{
        if (reset.reset === "Yes") {
            setMatrixState({});
            setValueJson({});
        }
    }, [reset])
    useEffect(() => {
        setMatrixState(questionJson?.value || {});
    },[questionJson]);
    return (
        (()=>{
            if(windowWidth < 768){
                return (
                    <table className="w-100 mb-2">
                        {
                            allRows.map((v, i)=>{
                                return (
                                    <tbody key={i}>
                                        <tr className="text-left">
                                            <th colSpan={2}>
                                                {v}
                                            </th>
                                        </tr>
                                        {
                                            allColumns.map((v1, j)=>{
                                                return (
                                                    <tr key={`${i}${j}`}>
                                                        <th className="font-weight-normal">{v1}</th>
                                                        <th>
                                                        {
                                                            type==="text" ?
                                                                <div className="w-100 d-flex justify-content-center align-items-center">
                                                                    <InputField
                                                                        name={i.toString()+j}
                                                                        className="px-2 mb-2"
                                                                        value={matrixState?.[v]?.[v1]}
                                                                        onChange={(name, Value)=>{
                                                                            setMatrixState((prev)=>{
                                                                                return {
                                                                                    ...prev,
                                                                                    [v]:{...prev?.[v],[v1]:Value}
                                                                                }
                                                                            });
                                                                        }}
                                                                        onBlur={()=>{setValueJsonText(matrixState)}}
                                                                        sx={useStyles.root}
                                                                    />
                                                                </div>
                                                            :
                                                                <input
                                                                    type={type}
                                                                    value={i.toString()+j}
                                                                    onChange={()=>{ handleChange(v, v1); }}
                                                                    checked={questionJson?.value?.[v]?.includes(v1) || false}
                                                                    className="cursor-pointer"
                                                                />
                                                        }
                                                        </th>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>     
                                );
                            })
                        }
                    </table>
                );
            } else {
                return (
                    <>
                        <table className="w-100 mb-2">
                            <thead>
                                <tr className="text-center" style={{height:40}}>
                                    <th style={{width: `calc(100%/${allColumns.length+1})`}}></th>
                                    {
                                        allColumns?.map((v, i) => {
                                            return (<th key={i} className="font-weight-normal" style={{width: `calc(100%/${allColumns.length+1})`}}>{v}</th>);
                                        }) 
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allRows?.map((v, i) => {
                                        return (
                                            <tr key={i} className="text-center" style={{height:40}}>
                                                <th className="text-left font-weight-normal">{questionJson.rows[i][valueName]}</th>
                                                {
                                                    allColumns?.map((v1, j) => {
                                                        return (
                                                            <th key={i.toString()+j.toString()} className="font-weight-normal">
                                                                {
                                                                    type==="text" ?
                                                                        <div className="w-100 d-flex justify-content-center align-items-center">
                                                                            <InputField
                                                                                name={i.toString()+j}
                                                                                className="px-2 mb-2"
                                                                                value={matrixState?.[v]?.[v1]}
                                                                                onChange={(name, Value)=>{
                                                                                    setMatrixState((prev)=>{
                                                                                        return {
                                                                                            ...prev,
                                                                                            [v]:{...prev?.[v],[v1]:Value}
                                                                                        }
                                                                                    });
                                                                                }}
                                                                                onBlur={()=>{setValueJsonText(matrixState)}}
                                                                                sx={useStyles.root}
                                                                            />
                                                                        </div>
                                                                    :
                                                                        <input
                                                                            type={type}
                                                                            value={i.toString()+j}
                                                                            onChange={()=>{ handleChange(v, v1); }}
                                                                            checked={questionJson?.value?.[v]?.includes(v1) || false}
                                                                            className="cursor-pointer"
                                                                        />
                                                                }
                                                            </th>
                                                        );
                                                    }) 
                                                }
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            questionJson?.comments ?
                                <div className="mb-2 pt-1">
                                    {questionJson.commentsText}   
                                </div>
                            : null
                        }
                    </>
                );
            }
        })()
    );
}

const ConstantSum = ({questionJson, setValueJson, setValueJsonText, useStyles, reset}) => {
    const [numVals, setNumVals] = useState({questions:{}, total:0});
    const [total, setTotal] = useState(0);
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(0);
    const [segments, setSegments] = useState(0);
    const [decimals, setDecimals] = useState(0);
    const [incr, setIncr] = useState(0);
    const [mTotal, setMTotal] = useState(0);
    useEffect(()=>{
        if (reset.reset === "Yes") {
            let temp = { questions: {}, total: 0 };           
            setNumVals(temp);
            setTotal(temp.total);
            questionJson.value = { questions: {}, total: 0 }
        }
    }, [reset]);
    useEffect(() => {
        setMTotal(parseFloat(questionJson.mustTotalTo));
        if(questionJson.type === "range"){
            setLower(parseInt(questionJson.lowerRange));
            setUpper(parseInt(questionJson.upperRange));
            setSegments(parseInt(questionJson.segments));
            setDecimals(parseFloat(questionJson.decimals));
            setIncr(Math.ceil((questionJson.upperRange-questionJson.lowerRange)/questionJson.segments));
        }
        let temp = {questions:{}, total:0};
        // console.log("questionJson.labelList.length", questionJson.labelList.length)
        for(let i=0; i<questionJson.labelList.length; i++){
            // Check if questionJson?.value?.questions exists
            if (!questionJson?.value?.questions) {
                temp.questions[questionJson.labelList[i]] = 0; // Default to 0 if undefined
            } else {
                // Check if the specific question exists in the value.questions object
                temp.questions[questionJson.labelList[i]] = questionJson.value.questions[questionJson.labelList[i]] || 0;
            }
        }
        temp.total = questionJson?.value?.total || 0;
        setNumVals(temp);
        setTotal(temp.total);
    },[questionJson]);
    return (
        <>
            <p className="pt-1">{questionJson?.description}</p>
            {
                (()=>{
                    if (questionJson?.type === "range") {
                        return (
                            <table className="w-100">
                                <tbody>
                                    {
                                        Array.from({ length: questionJson?.labelList?.length }, (_, i) => (i + 1)).map((v, i) => {
                                            return (
                                                <Fragment key={v}>
                                                    <tr>
                                                        <td colSpan={2} className="font-weight-bold">{questionJson.labelList[i]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-0">
                                                            <input
                                                                type="range"
                                                                min={lower}
                                                                max={upper}
                                                                style={{width:"100%", marginTop: 7}}
                                                                value={numVals?.questions[questionJson?.labelList[i]] || 0}
                                                                step = {decimals}
                                                                onChange = {(e)=>{
                                                                    setNumVals((prev)=>{
                                                                        prev.questions[questionJson?.labelList[i]] = e.target.value;
                                                                        let temp = {...prev};
                                                                        let t = 0;
                                                                        for(let p in temp.questions){
                                                                            t += parseFloat(temp.questions[p])
                                                                        }
                                                                        setTotal(t);
                                                                        prev.total = t;
                                                                        return {...prev};
                                                                    });
                                                                }}
                                                                onMouseOut={(e)=>{
                                                                    // If questionJson?.value is undefined, initialize it with default structure
                                                                    let t = questionJson?.value || { questions: {}, total: 0 };

                                                                    // Ensure that t.questions exists and is an object
                                                                    if (!t.questions) {
                                                                        t.questions = {};
                                                                    }

                                                                    // Now, safely set the value
                                                                    t.questions[questionJson?.labelList[i]] = e.target.value;
                                                                    t.total = total;
                                                                    t.mustTotalTo = mTotal;

                                                                    // Update the parent state or perform any further actions
                                                                    setValueJson(t);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-2 text-right" style={{width: "10%"}}>
                                                            {numberWithCommas(numVals?.questions[questionJson.labelList[i]])}
                                                        </td>
                                                    </tr>
                                                    <tr className="segmentRow">
                                                        <td>
                                                            <div className="w-100 d-flex justify-content-between font-weight-bold">
                                                                {
                                                                    incr === 1 ?
                                                                        <>
                                                                            <span>{numberWithCommas(lower)}</span>
                                                                            <span>{numberWithCommas(upper)}</span>
                                                                        </>
                                                                    :
                                                                        <>
                                                                            {
                                                                                Array.from({ length: segments }, (_, i)=>(i+1)).map((v, i)=>{
                                                                                    return (
                                                                                        <span key={v} className={i===0?"sum-ranges text-left":"sum-ranges text-center"}>{numberWithCommas(lower + (i * incr))}</span>
                                                                                    );
                                                                                })
                                                                            }
                                                                            <span className="sum-ranges text-right">{numberWithCommas(upper)}</span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            );
                                        })
                                    }
                                    {
                                        questionJson?.showTotal ?
                                            <tr>
                                                <td colSpan={2} className="text-right font-weight-bold py-3">Total : {numberWithCommas(total)}</td>
                                            </tr>
                                        : null
                                    }
                                </tbody>
                            </table>
                        );
                    } else {
                        return (
                            <table className="mt-4 w-100">
                                <tbody>
                                    {
                                        Array.from({length:questionJson.labelList.length }, (_, i)=>(i+1)).map(function(v, i){
                                            return (
                                                <tr key={v} className="py-3">
                                                    <td style={{width: "80%"}}>
                                                        {questionJson.labelList[i]}
                                                    </td>
                                                    <td>
                                                        <InputField
                                                            type="text"
                                                            value={numberWithCommas(numVals.questions[questionJson.labelList[i]])}
                                                            className="pr-1 text-right"
                                                            InputProps={{min: 0, inputProps: { style: { textAlign: "right" }, }}}
                                                            onChange={(name, value)=>{
                                                                setNumVals((prev)=>{
                                                                    prev.questions[questionJson.labelList[i]] = value === ""? 0 : value.replaceAll(",","");
                                                                    let temp = {...prev};
                                                                    let t = 0;
                                                                    for(let p in temp.questions){
                                                                        t += parseFloat(temp.questions[p])
                                                                    }
                                                                    setTotal(t);
                                                                    prev.total = t;
                                                                    return {...prev};
                                                                });
                                                            }}
                                                            onBlur={(e)=>{
                                                                let t = typeof questionJson?.value === "undefined" ? {questions:{}, total:0} : questionJson?.value;
                                                                t.questions[questionJson?.labelList[i]] = e.target.value.replaceAll(",", "");
                                                                t.total = total;
                                                                t.mustTotalTo = mTotal;
                                                                setValueJsonText(t);
                                                            }}
                                                            onKeyDown={(e)=>{
                                                                let x = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Tab", "Backspace", "Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
                                                               if(!x.includes(e.key)) {
                                                                    e.preventDefault();
                                                               }
                                                            }}
                                                            sx={useStyles.root}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                    {
                                        questionJson.showTotal?
                                            <tr className="py-3">
                                                <td colSpan={2} className="text-right font-weight-bold py-3">Total : {numberWithCommas(total)}</td>
                                            </tr>
                                        : null
                                    }
                                </tbody>
                            </table>
                        );
                    }
                })()
            }
        </>
    );
}

const Rank = ({ questionJson, setValueJson, callFrom, reset }) => {
    let valueName,optionName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
    }
    const [tempValue, setTempValue] = useState([]);
    useEffect(()=>{
        if (reset.reset === "Yes") {
            setTempValue(questionJson[optionName].map(v => v[valueName]));
            setValueJson([])                
        }
    }, [reset])

    useEffect(() => {
        if (typeof questionJson?.value === "undefined" || questionJson?.value.length === 0) {
            setTempValue(questionJson[optionName].map(v=>v[valueName]));
        } else {
            setTempValue(questionJson?.value);
        }
    },[questionJson]);
    const handleChangeValue = (value) => {
        if(tempValue.length > 0) {
            let newArray = [];
            value.forEach((v)=>{
                let selectedValue = tempValue.filter( x => x === v.toString());
                newArray.push(...selectedValue);
            })
            setTempValue(newArray);
            setValueJson(newArray);
        }
    }
    return (
        <ReactSortable list={tempValue} setList={handleChangeValue} animation= {150} fallbackOnBody= {true} swapThreshold= {0.65} ghostClass={"ghost"} group={"shared"} forceFallback={true}>
            {
                tempValue?.length > 0 ?
                    tempValue?.map((value, index) => {
                        return (
                            <div className="d-flex justify-content-between rankSortableItem mb-2 pt-1 cursor-move" key={index}>
                                <div>{value}</div>
                                <i className="fas fa-grip-vertical pt-1" style={{pointerEvents:"none"}}></i>
                            </div>
                        );
                    })
                : null
            }
        </ReactSortable>
    );
}

const ContactForm = ({questionJson, setValueJsonText, useStyles, reset}) => {
    const verticallyClass = questionJson.vertically?"col-12":"col-md-6 col-sm-12";
    const [tempValue,setTempValue]=useState({});
    useEffect(()=>{
        if (reset.reset === "Yes") {
            setTempValue({})
            setValueJsonText({})
        }
    }, [reset])
    useEffect(() => {
        let t = {};
        for(let i=0; i<questionJson.labelList.length; i++) {
            if (typeof questionJson?.value === "undefined") {
                t[questionJson.labelList[i].name] = "";
            } else {
                if (typeof questionJson?.value[questionJson.labelList[i].name] === "undefined")
                    t[questionJson.labelList[i].name] = "";
                else
                    t[questionJson.labelList[i].name] = questionJson?.value[questionJson.labelList[i].name];
            }
        }
        setTempValue(t);
    },[questionJson]);
    return (
        <div className="row">
            {
                questionJson.labelList.map((v, i)=>{
                    return (
                        <div key={i} className={`${verticallyClass} mb-2`}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="w-100">
                                {
                                    questionJson.icons?
                                        <span className="mr-2 mb-2"><i className={v.icon}></i></span>
                                    : null
                                }
                                <TextField
                                    type="text"
                                    label={v.name}
                                    name={v.name}
                                    variant="standard"
                                    fullWidth
                                    className="mb-1"
                                    required={v.requireStatus !== null?v.requireStatus:false}
                                    value={tempValue[v.name] || ""}
                                    onChange={(e)=>{
                                        setTempValue((prev)=>{
                                            prev[v.name] = e.target.value;
                                            return {...prev};
                                        });
                                    }}
                                    onBlur={(e)=>{
                                        setValueJsonText(tempValue);
                                    }}
                                    sx={useStyles.root}
                                />
                            </Box>
                        </div>
                    );
                })
            }
        </div>
    );
}

const ImageForm = ({questionJson, setValueJson, callFrom, setFormData, reset}) => {
    let valueName,optionName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
    }
    const handleChange = (v,checked) => {
        if(questionJson.multipleAnswer){
            if(typeof questionJson?.value === "undefined"){
                setValueJson([v[valueName]]);
            } else {
                if(questionJson?.value?.includes(v[valueName])){
                    setValueJson(questionJson?.value.filter(x => x !== v[valueName]));
                } else {
                    setValueJson([...questionJson?.value,v[valueName]]);
                }
            }
        } else {
            setValueJson([v[valueName]]);
        }
        if(callFrom !== "fromForm" && checked){
            let f = questionJson[optionName].find((val)=>{return val[valueName] === v[valueName]});
            if(f.hasOwnProperty("formLink") && f.formLink !== ""){
                let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
                let obj = {...location, display: true};
                obj.mode = callFrom;
                setFormData(obj);         
            }
        }
    }
    const handleClickZoom = (imageUrl) => {
        document.getElementById('clickImageZoom').click();
        setTimeout(()=>{
            document.getElementById('showZoomImage').innerHTML='<img src="' + imageUrl + '" style="max-height: 400px; max-width: 100%;" />'
        },500);
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson([])
        }
    }, [reset])
    return (
        <>
            <div className="row mx-0">
                {
                    questionJson[optionName].map((v, i)=>{
                        let imageId = uuidv4();
                        return (
                            <div key={i} className="mr-3 mb-4">
                                <div className="image-box">
                                    <label className="w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer" htmlFor={`img-${imageId}-${i}`}>
                                        <img src={v[valueName]} className="img-control-items" alt=""/> 
                                    </label>
                                </div>
                                <div className="text-center pt-2">
                                    <input 
                                        type={questionJson.multipleAnswer?"checkbox":"radio"}
                                        id={`img-${imageId}-${i}`}
                                        onChange={(e)=>{ handleChange(v,e.target.checked); }}
                                        checked={questionJson?.value?.includes(v[valueName]) || false}
                                        className="cursor-pointer"
                                    />
                                    <i className="far fa-search-plus ml-3" onClick={()=>{handleClickZoom(v[valueName]);}}></i>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <ZoomModal/>
        </>
    );
}

const ImageWithTextForm = ({questionJson, setValueJson, callFrom, setFormData, reset}) => {
    let valueName,optionName,descriptionName;
    if(callFrom === "fromForm"){
        valueName = "optValue";
        optionName = "customFormOptions";
        descriptionName = "optDescription";
    } else if(callFrom === "fromSurvey"){
        valueName = "soptValue";
        optionName = "surveysOptions";
        descriptionName = "soptDescription";
    }else if(callFrom === "fromAssessment"){
        valueName = "aoptValue";
        optionName = "assessmentsOptions";
        descriptionName = "aoptDescription";
    }
    const [windowWidth, ] = useWindowSize();
    const handleChange = (v,checked) => {
        if(questionJson.multipleAnswer){
            if(typeof questionJson?.value === "undefined"){
                setValueJson([v[valueName]]);
            } else {
                if(questionJson?.value?.includes(v[valueName])){
                    setValueJson(questionJson?.value.filter(x => x !== v[valueName]));
                } else {
                    setValueJson([...questionJson?.value,v[valueName]]);
                }
            }
        } else {
            setValueJson([v[valueName]]);
        }
        if(callFrom !== "fromForm" && checked){
            let f = questionJson[optionName].find((val)=>{return val[valueName] === v[valueName]});
            if(f.hasOwnProperty("formLink") && f.formLink !== ""){
                let location = {location:{pathname:"/customform", search: `?${f.formLink.split("?").pop()}`,hash:"", state: undefined}}
                let obj = {...location, display: true};
                obj.mode = callFrom;
                setFormData(obj);         
            }
        }
    }
    const handleClickZoom = (imageUrl) => {
        document.getElementById('clickImageZoom').click();
        setTimeout(()=>{
            document.getElementById('showZoomImage').innerHTML='<img src="' + imageUrl + '" style="max-height: 400px; max-width: 100%;" />'
        },500);
    }
    useEffect(() => {
        if (reset.reset === "Yes") {
                setValueJson([])
        }
    }, [reset])
    return (
        <>
            {(()=>{
                if(windowWidth >= 778){
                    return (
                        questionJson[optionName].map((v, i)=>{
                            let imageId = uuidv4();
                            return (
                                <div key={i} className="row mb-2 pt-1">
                                    <div className="col-md-2 col-xs-3">
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <input
                                                type={questionJson.multipleAnswer?"checkbox":"radio"}
                                                id={`img-${imageId}-${i}`}
                                                onChange={(e)=>{ handleChange(v,e.target.checked); }}
                                                checked={questionJson?.value?.includes(v[valueName]) || false}
                                                className="cursor-pointer"
                                            />
                                            <i className="far fa-search-plus ml-3" onClick={()=>{handleClickZoom(v[valueName]);}}></i>
                                        </div>
                                    </div>
                                    <div className="image-box">
                                        <label className="w-100 h-100 d-flex align-items-center justify-content-center cursor-pointer" htmlFor={`img-${imageId}-${i}`}>
                                            <img src={v[valueName]} className="img-control-items" alt=""/>
                                        </label>
                                    </div>
                                    <div className="col text-white-space d-flex align-items-center">
                                        <label className="w-100 cursor-pointer" htmlFor={`img-${imageId}-${i}`}>
                                            {v[descriptionName]}
                                        </label>
                                    </div>
                                </div>
                            );
                        })
                    );
                } else{
                    return (
                        questionJson[optionName].map((v, i)=>{
                            let imageId = uuidv4();
                            return (
                                <div key={i} className="mb-4">
                                    <label className="row mb-2 pt-1 justify-content-center align-items-center" htmlFor={`img-${imageId}-${i}`}>
                                        <img src={v[valueName]} className="cursor-pointer" style={{maxHeight: 140, maxWidth:140}} alt=""/>
                                    </label>
                                    <div className="row mb-1 pt-1 justify-content-center align-items-center">
                                        <label className="text-white-space cursor-pointer" htmlFor={`img-${imageId}-${i}`}>
                                            {v[descriptionName]}
                                        </label>
                                    </div>
                                    <div className="w-100 d-flex justify-content-center align-items-center">
                                        <input
                                            type={questionJson.multipleAnswer?"checkbox":"radio"}
                                            onChange={(e)=>{ handleChange(v,e.target.checked); }}
                                            id={`img-${imageId}-${i}`}
                                            checked={questionJson?.value?.includes(v[valueName]) || false}
                                            className="cursor-pointer"
                                        />
                                        <i className="far fa-search-plus ml-3" onClick={()=>{handleClickZoom(v[valueName]);}}></i>
                                    </div>
                                </div>
                            );
                        })
                    );
                }
            })()}
            <ZoomModal/>
        </>
    );
}

const Email = ({questionJson, setValueJson, useStyles, callFrom, reset}) => {
    let questionName;
    if(callFrom === "fromForm"){
        questionName = "queQuestion";
    } else if(callFrom === "fromSurvey"){
        questionName = "squeQuestion";
    }else if(callFrom === "fromAssessment"){
        questionName = "aqueQuestion";
    }
	useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson("")
        }
    }, [reset])
    return (
        <TextField label={questionJson.labellessAnswer ? questionJson[questionName] : "Enter email"} variant="standard" fullWidth value={questionJson?.value || ""} onChange={(e)=>{setValueJson(e.target.value.trim())}} sx={useStyles.root}/>
    );
}

const Phone = ({questionJson, setValueJsonText, useStyles, callFrom, reset}) => {
    let questionName;
    if(callFrom === "fromForm"){
        questionName = "queQuestion";
    } else if(callFrom === "fromSurvey"){
        questionName = "squeQuestion";
    }else if(callFrom === "fromAssessment"){
        questionName = "aqueQuestion";
    }
    const [countries, setCountries] = useState([]);
    const [tempValue, setTempValue] = useState({});
    useEffect(()=>{
        if (reset.reset === "Yes") {
            setTempValue({})
            setValueJsonText({})
        }
    }, [reset])
    useEffect(() => {
        setTempValue({"countryCode":questionJson?.value?.countryCode || "", "countryId": questionJson?.value?.countryId || "", "PhoneNo" : questionJson?.value?.PhoneNo || ""});
    },[questionJson]);
    useEffect(()=>{
        getCountry().then(res => {
            if (res.result.country) {
                let c = [];
                res.result.country.forEach((x) => {
                    if(x.cntCode !== null){
                        c.push({
                            "key": String(x.id),
                            "value": x.cntName,
                            "cntCode":x.cntCode,
                            "iso2":x.iso2
                        })
                    }
                });
                setCountries(c);
            }
        })
        return () => {
            setCountries([]);
        };
    },[]);
    return (
        <div className="row mb-2 pt-1">
            <div className="col-4">
                <FormControl fullWidth>
                    <InputLabel id="country-label" variant="standard" sx={useStyles.root}>Country</InputLabel>
                    <Select 
                        label="country"
                        labelId="country-label"
                        variant="standard"
                        onChange={(e) => {
                            setTempValue((prev)=>{
                                return {
                                    ...prev,
                                    "countryCode":countries.find((v)=>(v.key === e.target.value)).cntCode,
                                    "countryId": e.target.value
                                }
                            });
                        }}
                        onBlur={() => {
                            setValueJsonText(tempValue);
                        }}
                        value={tempValue?.countryId || "Select Country"}
                        fullWidth
                        sx={useStyles.root}
                    >
                        <MenuItem value="Select Country" sx={useStyles.root}>Select Country</MenuItem>
                        {
                            countries.map((ele, i) => (
                                <MenuItem key={i} value={ele.key} sx={useStyles.root}>
                                    <img src={siteURL+"/img/country_icon/"+ele.iso2.toLowerCase()+".gif"} alt={ele.value} className="mr-2"/>{ele.value}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <div className="col-8">
                <NumberField
                    label={questionJson.labellessAnswer ? questionJson[questionName] : "Phone"}
                    onChange={(_, val) => {
                        setTempValue((prev)=>{
                            return {
                                ...prev,
                                "PhoneNo": val.split(" ")[1]
                            }
                        });
                    }}
                    onBlur={() => {
                        setValueJsonText(tempValue);
                    }}
                    value={tempValue?.PhoneNo}
                    format={(tempValue?.countryCode|| "")+" ######################"}
                    sx={useStyles.root}
                />
            </div>
            {
                questionJson?.description !== "" &&
                    <div className="col-12 white-space-pre-line mt-3">
                        {questionJson?.description}
                    </div>
            }
        </div>
    );
}

const ConsentAgreement = ({ questionJson, setValueJson, useStyles, reset }) => {
    useEffect(() => {
        if (reset.reset === "Yes") {
            setValueJson(false)
        }
    }, [reset])
    return (
        <>
            <div className="row">
                <div className="col-12">
                    {
                        questionJson.terms.split("\n").map((v, i)=>{
                            return (<p key={i} className="mb-2 pt-1">{v}</p>);
                        })
                    }
                </div>
            </div>
            <div className="row pt-1">
                <div className="col-12">
                    <FormControlLabel className="mr-0 mb-0" control={<Checkbox onChange={()=>{setValueJson(!questionJson?.value)}} checked={questionJson?.value || false} color="primary" />} label={questionJson.agreement} sx={useStyles.root}/>
                </div>
            </div>

        </>
    );
}

const CaptchaControl = ({questionJson, setValueJson, useStyles}) => {
    useEffect(()=>{
        createCaptcha("capCodeForm");
    },[])
    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <canvas id="capCodeForm" className="capcode" width="300" height="80"></canvas>
                <i className="far fa-sync fa-2x ml-3" onClick={()=>{createCaptcha("capCodeForm");}}></i>
            </div>
            <TextField label="Enter code" variant="standard" value={questionJson?.value || ""} onChange={(e)=>{setValueJson(e.target.value)}} className="mb-2" sx={useStyles.root} fullWidth/>
        </div>
    );
}

const SignatureControl = ({ questionJson, setValueJson }) => {
    const sigPadRef = useRef(null);
    const containerRef = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(0);

    const handleEnd = () => {
        if (sigPadRef.current) {
            const dataURL = sigPadRef?.current?.canvas?.toDataURL("image/png");
            setValueJson(dataURL);
            console.log("Signature saved:", dataURL);
        }
    };

     useEffect(() => {
        const resizeCanvas = () => {
            if (containerRef.current) {
                const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
                const halfRemInPx = 0.5 * remInPx;
                const adjustedWidth = containerRef.current.offsetWidth - halfRemInPx;
                setCanvasWidth(adjustedWidth);
            }
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);
    useEffect(() => {
        if (!questionJson?.value || !sigPadRef.current || canvasWidth === 0) return;
        const canvas = sigPadRef.current.getCanvas ? sigPadRef.current.getCanvas() : sigPadRef.current.canvas;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = questionJson.value;
    }, [questionJson?.value, canvasWidth]);

    return (
        <div ref={containerRef} className='border rounded p-1'>
            <Signature 
                ref={sigPadRef} 
                width={canvasWidth} 
                height="300" 
                onPointer={handleEnd}
                value={questionJson?.value || null}
            />
        </div>
    );
}

const RenderQuestion = ({ reset, questionJson, setValueJson, setValueJsonText, setValueJsonComment=(a,b)=>{}, setFormData, callFrom, questionStyle }) => {
    let typeName
    if(callFrom === "fromForm"){
        typeName = "queType";
    } else if(callFrom === "fromSurvey"){
        typeName = "squeType";
    }else if(callFrom === "fromAssessment"){
        typeName = "aqueType";
    }
    let useStyles = createUseStyles(questionStyle);
    switch(questionJson[typeName]){
        case "open_ended":
        case "age":
            return (
                <OpenEnded questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles} callFrom={callFrom} reset={reset}/>
            );
        case "single_answer":
        case "single_answer_checkbox":
        case "gender":
        case "marital_status":
        case "education":
        case "employment_status":
        case "employer_type":
        case "housing":
        case "household_income":
        case "race":
            return (
                <RadioCheckBoxControl questionJson={questionJson} setValueJson={setValueJson} setValueJsonComment={setValueJsonComment} callFrom={callFrom} setFormData={setFormData} useStyles={useStyles} reset={reset}/>
            );
        case "single_answer_button":
            return (
                <SingleAnswerButton questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} useStyles={useStyles} reset={reset} />
            );
        case "single_answer_combo":
            return (
                <SingleAnswerCombo questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} useStyles={useStyles} reset={reset} />
            );
        case "date_control":
            return (
                <DateControl questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles} reset={reset} />
            );
        case "time_control":
            return (
                <TimeControl questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles} reset={reset} />
            );
        case "rating_box":
            return (
                <RatingBoxBtn questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} reset={reset} />
            );
        case "rating_radio":
            return (
                <RatingRadioBtn questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} useStyles={useStyles} reset={reset} />
            );
        case "rating_symbol":
            return (
                <RatingSymbol questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} reset={reset} />
            );
        case "yes_no":
            return (
                <YesNo questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} reset={reset} />
            );
        case "matrix":
            return (
                <Matrix questionJson={questionJson} setValueJson={setValueJson} setValueJsonText={setValueJsonText} callFrom={callFrom} useStyles={useStyles} reset={reset} />
            );
        case "constant_sum":
            return (
                <ConstantSum questionJson={questionJson} setValueJson={setValueJson} setValueJsonText={setValueJsonText} useStyles={useStyles} reset={reset}
                />
            );
        case "rank":
            return (
                <Rank questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} reset={reset} />
            );
        case "contact_form":
            return (
                <ContactForm questionJson={questionJson} setValueJsonText={setValueJsonText} useStyles={useStyles} reset={reset} />
            );
        case "image_form":
            return (
                <ImageForm questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} reset={reset} />
            );
        case "image_with_text_form":
            return (
                <ImageWithTextForm questionJson={questionJson} setValueJson={setValueJson} callFrom={callFrom} setFormData={setFormData} reset={reset} />
            );
        case "email":
            return (
                <Email questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles} callFrom={callFrom} reset={reset}/>
            );
        case "phone":
            return (
                <Phone questionJson={questionJson} setValueJsonText={setValueJsonText} useStyles={useStyles} callFrom={callFrom} reset={reset}/>
            );
        case "consent_agreement":
        case "sms_consent_agreement":
            return (
                <ConsentAgreement questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles} reset={reset} />
            );
        case "captcha":
            return (
                <CaptchaControl questionJson={questionJson} setValueJson={setValueJson} useStyles={useStyles}/>
            );
        case "signature":
            return (
                <SignatureControl questionJson={questionJson} setValueJson={setValueJson} />
            );
        default:
            return <div></div>
    }
}

const createUseStyles = (questionStyle) => {
    return {
        root: {
            color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
            fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
            fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
            fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
            fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
            lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            "& input": {
                color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
                fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
                fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
                fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
                fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
                lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            },
            "& textarea": {
                color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
                fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
                fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
                fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
                fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
                lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            },
            "& label": {
                color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
                fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
                fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
                fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
                fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
                lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            },
            "& span:last-of-type": {
                color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
                fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
                fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
                fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
                fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
                lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            },
            "& div": {
                color: typeof questionStyle.color !== "undefined" ? `${questionStyle.color} !important` : "inherit",
                fontFamily: typeof questionStyle.fontFamily !== "undefined" ? `${questionStyle.fontFamily} !important` : "inherit",
                fontSize: typeof questionStyle.fontSize !== "undefined" ? `${questionStyle.fontSize} !important` : "inherit",
                fontStyle: typeof questionStyle.fontStyle !== "undefined" ? `${questionStyle.fontStyle} !important` : "inherit",
                fontWeight: typeof questionStyle.fontWeight !== "undefined" ? `${questionStyle.fontWeight} !important` : "inherit",
                lineHeight: typeof questionStyle.lineHeight !== "undefined" ? `${questionStyle.lineHeight} !important` : "inherit",
            }
        }
    }
}
const mapStateToProps = (state) => ({
    reset: state.resetQuestion,
})

export default connect(mapStateToProps, null)(RenderQuestion);