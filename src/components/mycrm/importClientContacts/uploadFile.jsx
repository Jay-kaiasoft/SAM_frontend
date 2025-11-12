import React, { useCallback, useEffect, useState } from "react";
import "../../../index.css"
import { Button } from "@mui/material";
import { FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import { uploadFile, importContact } from "../../../services/clientContactService";
import { pathOr } from "ramda";
import { setFilePath, setHeaders, setImportContactResult, setImportType } from "../../../actions/importContactActions";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { connect } from "react-redux";
import { findDuplicates, headerDropdownValues, modifyHeaders, rowLabelValues } from "./uploadFileConfigs";
import {siteURL} from "../../../config/api";
import $ from "jquery"
import { handleClickHelp, toBase64 } from "../../../assets/commonFunctions";

const UploadFile = ({
    onBackPress,
    onProcessPress,
    onCancelPress,
    globalAlert,
    setFilePath,
    filePath,
    memberId,
    subMemberId,
    setImportContactResult,
    dropdownValues,
    fields,
    importContactSuccessfull,
    setImportType,
    setHeaders
}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [dateFormat, setDateFormat] = useState({});
    const [openSelectHeader, setOpenSelectHeader] = useState(false);
    const [data, setData] = useState({});
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const uploadFileOnServer = useCallback(async() => {
        let formData = {
            "file":await toBase64(selectedFiles[0]),
            "fileType":selectedFiles[0].type,
            "fileName":selectedFiles[0].name
        }
        uploadFile(formData).then(resp => {
            if (resp && resp.status && resp.status === 200) {
                setIsFileUploaded(true);
                const filePath = pathOr("", ["result", "filePath"], resp);
                setFilePath(filePath);
            }
            else {
                globalAlert({
                    type: "Error",
                    text: resp ? resp.message : "Error",
                    open: true
                })
            }
        })
    }, [globalAlert, selectedFiles, setFilePath])
    useEffect(()=>{
        setDateFormat({"dateFormat":"MMDDYYYY"});
    },[]);
    useEffect(() => {
        if (selectedFiles.length > 0) {
            uploadFileOnServer(selectedFiles);
        }
    }, [selectedFiles, uploadFileOnServer]);

    const openDialogBox = () => {
        document.getElementById('input_file').click();
    }
    
    const actionOnProcessPress = () => {
        const payload = {
            path: filePath,
            memberId: memberId,
            subMemberId: subMemberId,
            format: dateFormat.dateFormat
        }
        $(`button.processFile`).hide();
        $(`button.processFile`).after(`<div class="lds-ellipsis ml-3 mr-3"><div></div><div></div><div></div>`);
        importContact(payload).then(res => {
            if (res && res.status && res.status === 200) {
                const importContactResult = pathOr("", ["result"], res);
                setImportContactResult(importContactResult);
                const filePath = pathOr("", ["result", "filePath"], res);
                setFilePath(filePath);
                const headers = pathOr([], ["headers"], importContactResult)
                if (headers.length > 1) {
                    setImportType(true);
                    setOpenSelectHeader(true);
                    return;
                } else {
                    onProcessPress();
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res ? res.message : "Error",
                    open: true
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.processFile`).show();
        })
    }
    const renderDropdown = (row, formattedDropdownValue) => {
        return (
            <tr className="fm-border-bottom" key={row.key}>
                <td align="left" className="w-50 p-2">
                    Column {row.key}: <br></br><span className="font-size-12">(e.g.{row.value})</span>
                </td>
                <td align="left" className="p-2">
                    <FormGroup>
                        <DropDownControls
                            name={row.dropDownName}
                            label="Select Field"
                            validation={"required"}
                            dropdownList={formattedDropdownValue}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </td>
            </tr>
        )
    }
    const uploadHeaders = (formattedRowsLabel) => {
        if (Object.keys(data).length < formattedRowsLabel.length) {
            globalAlert({
                type: "Error",
                text: "Please Select Headers",
                open: true
            })
            return;
        }
        const modifiedHeaders = modifyHeaders(data);
        let headers = [];
        let i
        for (i = 1; i <= Object.keys(modifiedHeaders).length; i++) {
            headers.push(modifiedHeaders[i]);
        }
        if (findDuplicates(modifiedHeaders)) {
            globalAlert({
                type: "Error",
                text: "Same header name is not allow.",
                open: true
            })
            return;
        }
        setHeaders(headers)
        const payload = {
            path: filePath,
            memberId: memberId,
            format: dateFormat.dateFormat,
            columnHeaders: modifiedHeaders
        }
        importContact(payload).then(res => {
            if (res && res.status && res.status === 200) {
                const importContactResult = pathOr("", ["result"], res);
                setImportContactResult(importContactResult);
                onProcessPress();
            }
            else {
                globalAlert({
                    type: "Error",
                    text: res ? res.message : "Error",
                    open: true
                })
            }
        })
    }
    const handleClickCancel = () => {
        onCancelPress();
        setOpenSelectHeader(false);
    }
    const renderSelectHeader = () => {
        const formattedDropdownValue = headerDropdownValues(dropdownValues);
        const formattedRowsLabel = rowLabelValues(fields);
        const renderedDropDowns = formattedRowsLabel.map(row => renderDropdown(row, formattedDropdownValue));
        return (
            <Modal isOpen={openSelectHeader} size="lg">
                <ModalHeader className="align-items-center" toggle={() => { handleClickCancel(); }}> Select Header </ModalHeader>
                <ModalBody className="overflow-auto" style={{height:"75vh"}}>
                    <table border="0" cellSpacing="0" cellPadding="8" align="center" className="w-75">
                        <tbody>
                            <tr className="fm-border-bottom">
                                <td align="left" className="w-50 p-2">
                                    <strong>CSV Fields</strong>
                                </td>
                                <td align="left" className="p-2">
                                    <strong>SAM Fields</strong>
                                </td>
                            </tr>
                            {renderedDropDowns}
                        </tbody>
                    </table>
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button variant="contained" color="primary" onClick={() => uploadHeaders(formattedRowsLabel)} className="mr-3">NEXT</Button>
                    <Button variant="contained" color="primary" onClick={() => handleClickCancel()}>CANCEL</Button>
                </ModalFooter>
            </Modal>
        )
    }
    return (
        <div className="row">
            <div className="col-12" align="center">
                <input type="file" name="" id='input_file' accept=".xls,.xlsx,.csv" hidden 
                    onChange={(e) => {
                        const files = e.target.files;
                        const maxSize = 15 * 1024 * 1024;
                        const validFiles = Array.from(files);
                        const oversizedFiles = validFiles.filter(file => file.size > maxSize);
                        if (oversizedFiles.length > 0) {
                            globalAlert({
                                type: "Error",
                                text: 'File size should not exceed 15MB. The file is too large.',
                                open: true
                            })
                            e.target.value = '';
                            return;
                        }
                        setSelectedFiles(e.target.files);
                    }} />
                {isFileUploaded ?
                    (<div className="w4rAnimated_checkmark" align="center">
                        <svg className="d-inline-block ml-5" version="1.1" src="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" >
                            <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                            <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                        </svg>
                        <img src={siteURL+"/img/info-icon.png"} alt="Info Icon" onClick={()=>{handleClickHelp("ClientData/ClientContact/CSV/HowToUploadCSVContactsIntoEmailsAndSurveys.html")}} height="30px" width="30px" className="info-icon d-inline-block ml-4" />
                        <span className="d-block mt-3"><strong>File Upload Completed</strong></span>
                    </div>) :
                    (<div>
                        <img src={siteURL+'/img/spritemap_csv.png'} alt="Upload File" align="center" onClick={openDialogBox} onDragOver={(e)=>{e.preventDefault()}} onDragEnter={(e)=>{e.preventDefault()}} onDrop={(e)=>{setSelectedFiles(e.dataTransfer.files);e.preventDefault()}} />
                        <img src={siteURL+"/img/info-icon.png"} alt="Info Icon" onClick={()=>{handleClickHelp("ClientData/ClientContact/CSV/HowToUploadCSVContactsIntoEmailsAndSurveys.html")}} height="30px" width="30px" className="info-icon" />
                    </div>)
                }
            </div>
            <div className="col-12 instruction-container" align="center">
                <div align="center" className="upload_instruction">
                    <div className="pt-2 pb-2"><span>1. email_address or phone is required.</span></div>
                    {/* <div className="pt-2 pb-2"><span>1. first_name, last_name, email_address or phone is required.</span></div> */}
                    <div className="pt-2 pb-2"><span>2. All other fields are optional.</span></div>
                    <div className="pt-2 pb-2"><span>3. We will attempt to match your column header with our field value.</span></div>
                    {/* <div className="pt-2 pb-2"><span>4. Dates that do not match your specified format will be dropped.</span></div> */}
                </div>
            </div>
            {/* {isFileUploaded && (
                <div className="col-12" align="center">
                    <div align="center" className="select-date-class">
                        <span><strong>Select Date Format:</strong></span>
                        <br></br>
                        <div className="select-date">
                            <FormGroup>
                                <DropDownControls
                                    name="dateFormat"
                                    label="Select"
                                    validation={"required"}
                                    dropdownList={dateFormats}
                                    onChange={handleOnChange}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            )
            } */}
            {importContactSuccessfull &&
                (
                    <div>
                        {renderSelectHeader()}
                    </div>
                )
            }
            <div className="col-12 mb-5" align="center">
                <Button color="primary" variant="contained" onClick={onBackPress}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button color="primary" variant="contained" className="ml-3 mr-3 processFile" onClick={actionOnProcessPress} disabled={!isFileUploaded}><i className="far fa-file-contract mr-2"></i>PROCESS FILE</Button>
                <Button variant="contained" color="primary" onClick={()=>{window.open(siteURL+"/sample_sam_data.csv");}}><i className="far fa-file-download mr-2"></i>DOWNLOAD SAMPLE DATA</Button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        filePath: pathOr("", ["importContact", "filePath"], state),
        memberId: pathOr(null, ["user", "memberId"], state),
        subMemberId: pathOr(null, ["subUser", "memberId"], state),
        dropdownValues: pathOr([], ["importContact", "importContactData", "headers"], state),
        fields: pathOr([], ["importContact", "importContactData", "body"], state),
        importContactSuccessfull: pathOr(false, ["importContact", "importContactSuccessfull"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        setFilePath: (payload) => { dispatch(setFilePath(payload)) },
        setImportContactResult: (payload) => { dispatch(setImportContactResult(payload)) },
        setImportType: (payload) => { dispatch(setImportType(payload)) },
        setHeaders: (payload) => { dispatch(setHeaders(payload)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);