import React, { createRef, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { pathOr } from "ramda";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import {Row, Col, FormGroup, Modal, ModalBody, ModalFooter} from "reactstrap";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import InputField from "../../shared/commonControlls/inputField";
import { checkDuplicates, transformGroupUtil, transformUdfsWithHeader, transformUdfsWithoutHeader } from "./fieldMappingUtils";
import { fetchGroupInformation, fetchGroups, saveGroup, setCronCheckDuplicateYN, setGroupID, setUDFs } from "../../../actions/importContactActions";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { setImportContactResult } from '../../../actions/importContactActions';


const FieldMappingComponent = ({
    onBackPress,
    onNextPress,
    onCancelPress,
    fetchGroups,
    group,
    memberId,
    subMemberId,
    globalAlert,
    saveGroup,
    fetchGroupInformation,
    filePath,
    tableData,
    importWithoutHeader,
    headers,
    setUDFs,
    setGroupID,
    transId,
    importSource,
    cronCheckDuplicateYN,
    setCronCheckDuplicateYN,
    importContactData,
    setImportContactResult
}) => {
    const [groupNumber, setGroupNumber] = useState("");
    const [groupName, setGroupName] = useState("");
    const [openPopUp, setOpenPopup] = useState(false);
    const [dropdownValues, setDropdownValues] = useState([]);
    const [data, setData] = useState({})
    const [nameToShow, setNameToShow] = useState("");
    const dropDownRefs = useRef([createRef()]);
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        setDropdownValues(transformGroupUtil(group));
    }, [group]);
    useEffect(()=>{
        tableData.map((v)=>(
            setData(prev => ({ ...prev, [v.key]: v.dbField !== null ?  v.dbField : v.value.length ===1 ? v.value[0] : v.value[v.value.length-1]}))
        ))
    },[tableData])

    const handleOnChange = (name, value) => {
        setGroupNumber(value)
        setGroupID(value)
        const group = dropdownValues.find(obj => obj.key === value);
        setNameToShow(group.value)
        if (importWithoutHeader) {
            const payload = {
                path: filePath,
                groupId: value,
                columnHeaders: headers,
                quickbook: importSource==="quickBooks" ? "yes" :"no",
                salesforce: importSource==="salesforce" ? "yes" :"no",
                transId:transId
            }
            fetchGroupInformation(payload);
        }
        else {
            const payload = {
                path: filePath,
                groupId: value,
                quickbook: importSource==="quickBooks" ? "yes" :"no",
                salesforce: importSource==="salesforce" ? "yes" :"no",
                transId:transId
            }
            fetchGroupInformation(payload);
        }
    }
    const handleOnNextProcess = () => {
        let countUpdfs = 0;
        const udfs = [];
        const dbFields = {};
        const dbFields1 = {};
        let isValid = true;
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let c = 0;
        tableData.forEach(it => {
            if (it.value.length > 1) {
                udfs.push(it.key)
            } else {
                dbFields[c] = data[it.key];
                dbFields1[it.key] = data[it.key];
                c++;
            }
            countUpdfs++;
        })
        setImportContactResult({...importContactData, "mainFields": dbFields1});
        if (Object.keys(data).length < countUpdfs) {
            globalAlert({
                type: "Error",
                text: "Please Select All Fields",
                open: true
            })
            return;
        }
        if (checkDuplicates(dbFields)) {
            globalAlert({
                type: "Error",
                text: "Same Field is not allowed",
                open: true
            })
            return;
        }
        let modifiedUdfs
        if (importWithoutHeader) {
            modifiedUdfs = transformUdfsWithoutHeader(data, udfs);
        }
        else {
            modifiedUdfs = transformUdfsWithHeader(data, udfs);
        }
        if (checkDuplicates(modifiedUdfs)) {
            globalAlert({
                type: "Error",
                text: "Same UDF is not allowed",
                open: true
            })
            return;
        }
        setUDFs(modifiedUdfs);
        onNextPress();
    }
    const handleChange = (name, value) => {
        setGroupName(value);
    }
    const handleDropdownChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const renderDropdown = (row) => {
        const dropdowns = [];
        if(row.value.length === 1) {
            tableData.forEach(it => {
                if(it.value.length === 1) {
                    dropdowns.push({
                        key: it.dbField,
                        value: it.value[0]
                    })
                }
            })
        } else {
            row.value.map((v)=>(
                dropdowns.push({
                    key: v,
                    value: v
                })
            ))
        }
        return (
            <tr className="fm-border-bottom" key={row.key}>
                <td align="left" className="p-3">
                    {row.key}
                    <span className="d-block" style={{ fontSize: "12px" }}>e.g. {row.eg}</span>
                </td>
                <td align="left" className="p-3">
                    →
                </td>
                <td align="left" className="p-3">
                    <div style={{ width: "200px" }}>
                        <FormGroup>
                            <DropDownControls
                                name={row.key}
                                label="Please Select"
                                validation={"required"}
                                dropdownList={dropdowns}
                                onChange={handleDropdownChange}
                                value={data[row.key] || row.value[0]}
                            />
                        </FormGroup>
                    </div>
                </td>
            </tr>
        )
    }
    const renderedDropDowns = tableData.map(row => renderDropdown(row))
    const renderDropDownDiv = () => {
        return (
            <table cellPadding="8" cellSpacing="0" width="60%" align="center">
                <tbody>
                    <tr className="fm-border-bottom">
                        <td colSpan="3" className="font-weight-bold p-3" align="left" style={{ backgroundColor: "#f5f5f5" }}>
                            Import Data: Field mapping
                        </td>
                    </tr>
                    <tr className="font-weight-bold fm-border-bottom">
                        <td align="left" width="45%" className="p-3">
                            CSV Field
                        </td>
                        <td align="left" width="15%" className="p-3">&nbsp;</td>
                        <td align="left" className="p-3">
                            <span id="selectGrpName">{nameToShow}</span> Field
                        </td>
                    </tr>
                    {renderedDropDowns}
                </tbody>
            </table>
        )
    }
    const handleClose = () => {
        setOpenPopup(false);
        setGroupName("");
    };
    const createGroup = () => {
        if (groupName.length === 0) {
            globalAlert({
                type: "Error",
                text: "Please Enter Group Name",
                open: true
            })
            return;
        }
        const payload = {
            "memberId": memberId,
            "groupName": groupName,
            "groupId": 0,
            "subMemberId": subMemberId
        }
        saveGroup(payload);
        setOpenPopup(false);
        setGroupName("");
    }
    const renderNewGroupPopup = () => {
        return (
            <Modal isOpen={openPopUp} toggle={handleClose}>
                <ModalBody>
                    <Row>
                        <Col md={12}>
                            <FormGroup>
                                <InputField
                                    id="groupName"
                                    name="groupName"
                                    label="Group Name"
                                    validation="required"
                                    onChange={handleChange}
                                    value={groupName ? groupName : ""}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={createGroup} className="mr-3">CREATE</Button>
                    <Button variant="contained" color="primary" onClick={handleClose}>CANCEL</Button>
                </ModalFooter>
            </Modal>
        )
    }
    const handleClickCheckBox = (value) => {
        if(value){
            setCronCheckDuplicateYN("Y");
        } else {
            setCronCheckDuplicateYN("N");
        }
    }
    const handleClickAddNewGroup = () => {
        let tempCheckLockGroup = group.filter((x) => { return x.lockGroup === "Y" });
        if(tempCheckLockGroup.length > 0){
            globalAlert({
                type: "Warning",
                text: `You can not add new group because one of your group is locked due to high bounce rate.\n\nPlease validate your group contacts by clicking "Verify Group Contact" icon.`,
                open: true
            });
        } else {
            setOpenPopup(true);
        }
    }
    return (
        <div className="col-md-12 body">
            <div className="carousel-inner">
                <div className="row">
                    <div className="col-12" align="center">
                        <label className="lable-style">Field Mapping</label>
                    </div>
                    <div className="col-6" align="right">
                        <div align="left" className="w-25">
                            <FormGroup>
                                <DropDownControls
                                    ref={dropDownRefs.current[0]}
                                    name="group"
                                    label="Select Group"
                                    validation={"required"}
                                    dropdownList={dropdownValues}
                                    onChange={handleOnChange}
                                    value={groupNumber || ""}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="col-6 align-self-center">
                        <Button color="primary" variant="contained" onClick={() => { handleClickAddNewGroup() }}>ADD NEW GROUP</Button>
                    </div>
                    <div className="col-12 text-center">
                        <FormControlLabel control={<Checkbox color="primary" checked={ cronCheckDuplicateYN === "Y" } onChange={(event) => { handleClickCheckBox(event.target.checked) }}/> } label="Ignore Duplicate Records"/>
                    </div>
                    <div className="col-12">
                        {renderNewGroupPopup()}
                    </div>
                    {groupNumber &&
                        (<div className="dropdown-class" align="center">
                            <br></br>
                            {renderDropDownDiv()}
                            <br></br>
                        </div>)
                    }
                    <div className="col-12 mt-3 mb-5" align="center">
                        <Button variant="contained" color="primary" onClick={onBackPress}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                        <Button variant="contained" color="primary" className="ml-3 mr-3" onClick={() => handleOnNextProcess()}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        <Button variant="contained" color="primary" onClick={onCancelPress}><i className="far fa-times mr-2"></i>CANCEL</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        filePath: pathOr("", ["importContact", "filePath"], state),
        group: pathOr([], ["importContact", "group"], state),
        memberId: pathOr(null, ["user", "memberId"], state),
        subMemberId: pathOr(null, ["subUser", "memberId"], state),
        tableData: pathOr([], ["importContact", "groupInformation", "result"], state),
        importWithoutHeader: pathOr(false, ["importContact", "importWithoutHeader"], state),
        headers: pathOr([], ["importContact", "headers"], state),
        transId: pathOr("", ["importContact", "importContactData", "transId"], state),
        importSource: pathOr("", ["importContact", "importSource"], state),
        cronCheckDuplicateYN: pathOr("", ["importContact", "cronCheckDuplicateYN"], state),
        importContactData: pathOr({}, ["importContact", "importContactData"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchGroups: () => { dispatch(fetchGroups()) },
        saveGroup: (payload) => { dispatch(saveGroup(payload)) },
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        fetchGroupInformation: (payload) => { dispatch(fetchGroupInformation(payload)) },
        setUDFs: (payload) => { dispatch(setUDFs(payload)) },
        setGroupID: (payload) => { dispatch(setGroupID(payload)) },
        setCronCheckDuplicateYN: (payload) => { dispatch(setCronCheckDuplicateYN(payload)) },
        setImportContactResult: (payload) => { dispatch(setImportContactResult(payload)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldMappingComponent);