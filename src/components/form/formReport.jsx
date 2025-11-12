import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {Col, Row, Table, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Select, MenuItem, TextField, InputAdornment, IconButton, Link, Button} from "@mui/material";
import { Pagination } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import {connect} from "react-redux";
import ColumnResizer from "../shared/commonControlls/column-resizer";
import SetAnswerFormat from "./setAnswerFormat";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {getCustomFormReport, getCustomFormAllDataReport, deleteCustomFormAnswers, reportExportFormToGroup} from "../../services/customFormService";
import {dateTimeFormat, easUrlEncoder, tableToExcel} from "../../assets/commonFunctions";
import {getIconClass, getAnswersForReport, generateReportTable} from "./utility";
import history from "../../history";
import {searchIconTransparent} from "../../assets/commonFunctions";
import FormToGroupMapping from "../shared/commonControlls/formToGroupMapping";

const FormReport = ({location, confirmDialog, globalAlert}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [data, setData] = useState({});
    const [questions, setQuestions] = useState([]);
    const [search,setSearch] = useState("");
    const [selectedPage,setSelectedPage] = useState(0);
    const [searchSend,setSearchSend] = useState("");
    const [perPage,setPerPage] = useState(25);
    const [sort,setSort] = useState("stIpAddress,desc");
    const [dataForm, setDataForm] = useState([]);
    const [totalData,setTotalData] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [sortBox, setSortBox] = useState([false]);
    const [mainTablecheckBoxValue, setMainTablecheckBoxValue] = useState(false);
    const [tableCheckBoxValue, setTableCheckBoxValue] = useState([]);
    const [tableCheckBoxValueList, setTableCheckBoxValueList] = useState([]);
    const [modalExportGroup, setModalExportGroup] = useState(false);
    const toggleExportGroup = useCallback(() => {setModalExportGroup(!modalExportGroup); setModalData({});},[modalExportGroup]);
    const [modalData, setModalData] = useState({});
    const [questionAll, setQuestionAll] = useState([]);

    const generateReport = ()=>{
        getCustomFormAllDataReport(id).then(res=>{
            if (res.status === 200) {
                let reportJSON = [];
                res.result.customFormReport.forEach((dataV, i)=>{
                    let record = [];
                    let qa = [];
                    record.push((i+1));
                    dataV.customFormPages.forEach((pageV)=>{
                        pageV.customFormQuestions.forEach((queV)=>{
                            qa.push(getAnswersForReport(queV.queType, JSON.parse(queV.queAnswers)));
                            if(queV.commentsColumns !== null && queV.commentsColumns.length > 0) {
                                queV.commentsColumns.forEach((column) => {
                                    if(typeof queV.queComments !== "undefined" && (queV.queComments !== null || queV.queComments !== '') && (JSON.parse(queV.queComments))) {
                                        qa.push(JSON.parse(queV.queComments)[column] + "<br/>")
                                    } else {
                                        qa.push("")
                                    }
                        })
                            }
                        })
                    });
                    record.push(qa);
                    record.push(dataV.stIpAddress);
                    record.push(dataV.stDate);
                    record.push(dataV.stCity);
                    record.push(dataV.stState);
                    record.push(dataV.stCountry);
                    record.push(dataV.stTechnology);
                    record.push(dataV.stSources);
                    reportJSON.push(record);
                });
                let table = generateReportTable(questions, reportJSON);
                tableToExcel(table, "Work Sheet 1", "form-report-data.xls");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const displayReport = useCallback(()=>{
        let data = `id=${id}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        getCustomFormReport(data).then(res => {
            if (res.result) {
                setData(res.result);
                let tempQuestions = [];
                let tempQuestionAll = [];
                if(res.result.customFormReport.length > 0 && res.result.customFormReport[0].customFormPages.length>0){
                    res.result.customFormReport[0].customFormPages.forEach((val)=>{
                        if(val.customFormQuestions.length > 0){
                            val.customFormQuestions.forEach((question)=>{
                                tempQuestions.push({question: question.queQuestion, type: question.queType});
                                tempQuestionAll.push({queQuestion: question.queQuestion, queType: question.queType, queNumber: question.queId});
                                if(question?.commentsColumns !== null && question?.commentsColumns.length > 0) {
                                    question?.commentsColumns.forEach((column)=>{
                                        tempQuestions.push({question: "comments for "+ column, type: question.queType, key: column});
                                    })
                                }	
                            })
                        }
                    }) 
                }
                setDataForm(res.result.customFormReport);
                setQuestions((prev)=>{
                    prev = tempQuestions;
                    return [...prev];
                });
                setQuestionAll((prev)=>{
                    prev = tempQuestionAll;
                    return [...prev];
                });
                setTotalPages(res.result.getTotalPages);
                setTotalData(res.result.totalAnswer);
            }
        });
    }, [id, searchSend,selectedPage,perPage,sort]);
    const handleChangePagination = (event,value) => {
        setSelectedPage(value-1);
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }
    const handleClickSearch = () => {
        setSelectedPage(0);
        setSearchSend(search);
    }
    const handleChangePerPage = (event) => {
        setSelectedPage(0);
        setPerPage(event.target.value);
    }
    const handleClickSort = (name,index) => {
        if(sortBox[index] === true) {
            name += ",desc";
            const newSortBox = [...sortBox];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        } else {
            name += ",asc";
            const newSortBox = [];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        }
        setSelectedPage(0);
        setSort(name);
    }
    const tableCheckBox = (index,id) => {
        const newTableCheckBoxValue = [...tableCheckBoxValue]
        newTableCheckBoxValue[index] = !newTableCheckBoxValue[index]
        setTableCheckBoxValue(newTableCheckBoxValue)
        if(!newTableCheckBoxValue[index]){
            setTableCheckBoxValueList(tableCheckBoxValueList.filter(x => x !== id));
        } else {
            setTableCheckBoxValueList([...tableCheckBoxValueList,id]);
        }
        let length = newTableCheckBoxValue.filter(function (value) {
            return value === true;
        }).length
        if (length !== newTableCheckBoxValue.length) {
            setMainTablecheckBoxValue(false)
        }
    }
    const mainTableCheckBox = () => {
        let flag = mainTablecheckBoxValue
        setMainTablecheckBoxValue(!flag)
        let newTableCheckBoxValue = []
        const newTableCheckBoxValueList = []
        dataForm.forEach(element => {
            newTableCheckBoxValue.push(!flag)
            if(!flag)
                newTableCheckBoxValueList.push(element.stId)
        });
        setTableCheckBoxValue(newTableCheckBoxValue)
        setTableCheckBoxValueList(newTableCheckBoxValueList);
    }
    const deleteFormReport = ()=>{
        let requestData = {
            "stId": tableCheckBoxValueList
        }
        deleteCustomFormAnswers(requestData).then(res=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                setTableCheckBoxValueList([]);
                setTableCheckBoxValue([]);
                setMainTablecheckBoxValue(false);
                displayReport();
            }else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleClickExportToGroup = () => {
        toggleExportGroup();
    }
    console.log("modalData", modalData);
    const handleClickSave = () => {
        if(typeof modalData?.cfGroupId === "undefined" || modalData?.cfGroupId === ""){
            globalAlert({
                type: "Error",
                text: "Please select Group.",
                open: true
            });
            return false;
        }
        if((typeof modalData?.cfMapping?.Email === "undefined" || modalData?.cfMapping?.Email === "") && (typeof modalData?.cfMapping?.phoneNumber === "undefined" || modalData?.cfMapping?.phoneNumber === "")){
            globalAlert({
                type: "Error",
                text: "Please select Email or Mobile.",
                open: true
            });
            return false;
        }
        let requestData = {
            ...modalData,
            "cfMapping": JSON.stringify(modalData?.cfMapping),
            "cfId": data?.cfId
        }
        reportExportFormToGroup(requestData).then(res=>{
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                toggleExportGroup();
            }else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    useEffect(()=>{
        displayReport();
    },[displayReport, selectedPage,perPage,searchSend]);
    return(
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="icon-wrapper d-inline-block mr-3">
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Back" onClick={()=>{history.push("/myforms")}}>
                        <i className="far fa-long-arrow-left"></i>
                        <div className="bg-dark-grey"></div>
                    </Link>
                </div>
                <h3 className="d-inline-block mb-0 align-middle">Form Report</h3>
                {
                    data?.customFormReport?.length > 0 ?
                        <div className="icon-wrapper d-inline-block mx-5">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export To Excel" onClick={generateReport}>
                                <i className="far fa-download"></i>
                                <div className="bg-dark-grey"></div>
                            </Link>
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" onClick={()=>{
                                if (tableCheckBoxValueList.length > 0) {
                                    confirmDialog({
                                        open: true,
                                        title: 'Are you sure you want to delete selected campaign?',
                                        onConfirm: () => {deleteFormReport()}
                                    })
                                } else {
                                    globalAlert({
                                        type: "Error",
                                        text: "You must check one of the checkboxes.",
                                        open: true
                                    });
                                }
                            }}>
                                <i className="far fa-trash-alt"></i>
                                <div className="bg-red"></div>
                            </Link>
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export To Group" onClick={handleClickExportToGroup}>
                                <i className="far fa-download"></i>
                                <div className="bg-dark-grey"></div>
                            </Link>
                        </div>
                    : null
                }
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="top-button mb-2">
                    <div>
                        <span className="align-middle">Show</span>
                        <Select
                            variant="standard"
                            name="perPage"
                            onChange={handleChangePerPage}
                            value={perPage}
                            className="mx-2 align-middle"
                        >
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={75}>75</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                        <span className="align-middle">entries</span>
                    </div>
                    <div>
                        <TextField
                            placeholder="Search"
                            variant="standard"
                            name="search"
                            type="text"
                            value={search}
                            onChange={handleChangeSearch}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton sx={searchIconTransparent.root} onClick={handleClickSearch}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </div>
                </div>
                <div className="formReportTableWrapper">
                    <Table className="table-form-report" id="report-table">
                        <thead>
                            <tr>
                                <th className="text-center" style={{width:80}}>
                                    <Input className="clientCheck" type="checkbox" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()}/>
                                </th>
                                <th style={{width:80}}>#</th>
                                {
                                    questions.map((queV, queI)=>{
                                        return (
                                            queV.type !== "captcha" && <Fragment key={queI+1}>
                                                <th className="table-form-report-th" data-toggle="tooltip" title={queV.question}>
                                                    <div className="d-flex align-items-center">
                                                        <div className={`formReportItem ${getIconClass(queV.type)}`}><div></div></div>
                                                        <div className="d-inline-block question-div">{queV.question}</div>
                                                    </div>
                                                </th>
                                                <ColumnResizer className="columnResizer" minWidth={200}/>
                                            </Fragment>
                                        );
                                    })
                                }
                                <th onClick={()=>{handleClickSort("stIpAddress",0)}} style={{width:125}}>IP
                                    <span>
                                    {typeof sortBox[0] !== "undefined"
                                        ? (sortBox[0] === true
                                            ? <i className="fad fa-sort-up ml-1"></i>
                                            : <i className="fad fa-sort-down ml-1"></i> )
                                        : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stDate",1)}} style={{width:130}}>Date
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stCity",2)}} style={{width:115}}>City
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stState",3)}} style={{width:115}}>State
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stCountry",4)}} style={{width:115}}>Country
                                    <span>
                                        {typeof sortBox[4] !== "undefined"
                                            ? (sortBox[4] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stTechnology",5)}} style={{width:125}}>Technology
                                    <span>
                                        {typeof sortBox[5] !== "undefined"
                                            ? (sortBox[5] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={()=>{handleClickSort("stSources",6)}} style={{width:95}}>Source
                                    <span>
                                        {typeof sortBox[6] !== "undefined"
                                            ? (sortBox[6] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i> )
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.customFormReport?.length > 0 ?
                                    data?.customFormReport.map((dataV, dataI)=>{
                                        return (
                                            <tr key={dataI}>
                                                <td align="center">
                                                    <Input type="checkbox" checked={tableCheckBoxValue[dataI]} onChange={() => tableCheckBox(dataI, dataV.stId)}/>
                                                </td>
                                                <td className="text-white-space word-wrap-anywhere">{dataI + 1}</td>
                                                {
                                                    dataV?.customFormPages?.length > 0 ?
                                                    dataV?.customFormPages.map((pageV, pageI) => {
                                                        return (
                                                            <Fragment key={pageI}>
                                                            {
                                                                pageV?.customFormQuestions?.length > 0 ?
                                                                pageV?.customFormQuestions.map((queV, queI)=>{
                                                                    return (
                                                                        queV.queType !== "captcha" && 
                                                                        <Fragment key={queI}>
                                                                            <td className="table-form-report-td">
                                                                            {
                                                                                queV.queAnswers !== "" && queV.queAnswers !== null ?
                                                                                    <SetAnswerFormat queV={queV} />
                                                                                : null
                                                                            }
                                                                            </td>
                                                                            <td className="marker"></td>
                                                                            {
                                                                                (queV.commentsColumns !== null && queV.commentsColumns.length) > 0 ?
                                                                                queV.commentsColumns.map((column, ci) => {
                                                                                    return (<Fragment key={ci}>
                                                                                        <td className="table-form-report-td">
                                                                                            {
                                                                                                typeof queV.queComments !== "undefined" && (queV.queComments !== null || queV.queComments !== '') && (JSON.parse(queV.queComments)?.hasOwnProperty(column))?
                                                                                                <span className="answer-bg">{JSON.parse(queV.queComments)[column]}</span>
                                                                                                :null 
                                                                                            }
                                                                                        </td>
                                                                                        <td className="marker"></td>
                                                                                    </Fragment>)
                                                                                }): null
                                                                            }
                                                                        </Fragment>
                                                                    );
                                                                })
                                                                :null
                                                            }
                                                            </Fragment>
                                                        );
                                                    })
                                                    :null
                                                }
                                                <td className="text-white-space word-wrap-anywhere" style={{padding: "0 20px !important"}}>{dataV.stIpAddress}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dateTimeFormat(dataV.stDate)}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dataV.stCity}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dataV.stState}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dataV.stCountry}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dataV.stTechnology}</td>
                                                <td className="text-white-space word-wrap-anywhere">{dataV.stSources === "PC"?"Desktop":"Mobile"}</td>
                                            </tr>
                                        );
                                    })
                                : <tr><td colSpan={9} className="text-center">No Data Found</td></tr>
                            }
                        </tbody>
                    </Table>
                </div>
                <Row className="mt-3">
                    <Col xs={6}><span className="align-middle pt-2">{`Showing ${dataForm.length > 0 ? (perPage*selectedPage)+1 : 0} to ${((perPage*selectedPage)+1)+dataForm.length-1} of ${totalData} entries`}</span></Col>
                    <Col xs={6}><Pagination className="float-right" count={totalPages} variant="outlined" shape="rounded" page={selectedPage+1} showFirstButton showLastButton onChange={handleChangePagination}/></Col>
                </Row>
                <Modal size="lg" isOpen={modalExportGroup} toggle={toggleExportGroup}>
                    <ModalHeader toggle={toggleExportGroup}>Data: Field mapping</ModalHeader>
                    <ModalBody>
                        <FormToGroupMapping questionAll={questionAll} data={modalData} setData={setModalData} callFromModal={"yes"} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="contained" color="primary" className="mr-3" onClick={()=>handleClickSave()}>SAVE</Button>
                        <Button variant="contained" color="primary" onClick={()=>toggleExportGroup()} >CLOSE</Button>
                    </ModalFooter>
                </Modal>
            </Col>
        </Row>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
    }
}
export default connect(null,mapDispatchToProps)(FormReport);