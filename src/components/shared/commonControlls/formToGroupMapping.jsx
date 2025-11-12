import React, { createRef, useEffect, useRef, useState } from "react";
import { FormGroup } from "reactstrap";
import DropDownControls from "./dropdownControl";
import { getGroupFieldsList, getGroupListWithCheckDuplicate, saveGroup } from "../../../services/clientContactService";
import { transformGroupUtil } from "../../mycrm/importClientContacts/fieldMappingUtils";
import { Button } from "@mui/material";
import ModalCreateGroup from "../../mycrm/components/modalCreateGroup";
import $ from "jquery";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";

const FormToGroupMapping = ({questionAll, data, setData, callFromModal="no", user, subUser, globalAlert}) => {
    const [groupAllData, setGroupAllData] = useState([]);
    const [groupFieldData, setGroupFieldData] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [createGroupData, setCreateGroupData] = useState({});
    const [createUDFNo, setCreateUDFNo] = useState(0);
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    const toggleCreateGroup = () => { setModalCreateGroup(!modalCreateGroup); setCreateGroupData({}); setCreateUDFNo(0); };
    const dropDownRefs = useRef([createRef()]);
    const dropDownUDF = [{ "key": 0, "value": "User Defined Fields" }, { "key": 1, "value": 1 }, { "key": 2, "value": 2 }, { "key": 3, "value": 3 }, { "key": 4, "value": 4 }, { "key": 5, "value": 5 }, { "key": 6, "value": 6 }, { "key": 7, "value": 7 }, { "key": 8, "value": 8 }, { "key": 9, "value": 9 }, { "key": 10, "value": 10 }];
    let createRefArray = [];
    createRefArray.push(createRef());
    for (let i = 0; i < 10; i++) {
        createRefArray.push(createRef());
    }
    const inputRefs = useRef(createRefArray);
    const totalUDFNo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const handleChangeGroup = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
        getGroupFieldsList(value).then(res => {
            if (res.status === 200) {
                setGroupFieldData(res.result);
            }
        });
    }
    console.log("questionAll",questionAll);
    const handleChangeQuestion = (name, value) => {
        if(value === 0) {
            setData(prev => {
                delete prev?.cfMapping?.[name];
                return {...prev};
            });
        } else {
            setData(prev => ({
                ...prev,
                cfMapping:{...prev?.cfMapping, [name]: value}
            }));
        }
    }
    const renderMapping = () => {
        return (
            <table cellPadding="8" cellSpacing="0" width={`${callFromModal === "no" ? "60%" : "100%" }`} align="center">
                <tbody>
                    <tr className="fm-border-bottom">
                        <td colSpan="3" className="font-weight-bold p-3" align="left" style={{ backgroundColor: "#f5f5f5" }}>
                            Data: Field mapping
                        </td>
                    </tr>
                    <tr className="font-weight-bold fm-border-bottom">
                        <td align="left" width="30%" className="p-3">
                            Group Field
                        </td>
                        <td align="left" width="5%" className="p-3">&nbsp;</td>
                        <td align="left" className="p-3">
                            Form Field
                        </td>
                    </tr>
                    {
                        groupFieldData.map((value, index)=>(
                            <tr className="fm-border-bottom" key={index}>
                                <td align="left" className="p-3">
                                    {value.value}
                                </td>
                                <td align="left" className="p-3">
                                    →
                                </td>
                                <td align="left" className="p-3">
                                    <FormGroup>
                                        <DropDownControls
                                            name={value.key}
                                            label="Please Select"
                                            dropdownList={questionData}
                                            onChange={handleChangeQuestion}
                                            value={data?.cfMapping?.[value.key] || 0}
                                        />
                                    </FormGroup>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )
    }
    const handleClickAddNewGroup = () => {
        let tempCheckLockGroup = groupAllData.filter((x) => { return x.lockGroup === "Y" });
        if(tempCheckLockGroup.length > 0){
            globalAlert({
                type: "Warning",
                text: `You can not add new group because one of your group is locked due to high bounce rate.\n\nPlease validate your group contacts by clicking "Verify Group Contact" icon.`,
                open: true
            });
        } else {
            toggleCreateGroup();
        }
    }
    const createGroupHandleChange = (name, value) => {
        if (name === "udf") {
            setCreateUDFNo(value);
        }
        setCreateGroupData(prev => ({ ...prev, [name]: value }))
    }
    const submitFormCreateGroup = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i <= createUDFNo; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let udfList = [];
        for (let i = 1; i <= createUDFNo; i++) {
            udfList.push({ "id": 0, "udf": createGroupData[`udf` + i] });
        }
        let requestData = {
            "groupId": 0,
            "groupName": createGroupData.groupName,
            "memberId": user.memberId,
            "subMemberId": subUser.memberId,
            "udfs": udfList
        }
        $(`button.createGroup`).hide();
        $(`button.createGroup`).after(`<div class="lds-ellipsis mr-2"><div></div><div></div><div></div>`);
        saveGroup(requestData).then(res => {
            if (res.status === 200) {
                toggleCreateGroup();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                displayGroupDetails();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $(`button.createGroup`).show();
        });
    }
    const displayGroupDetails = () => {
        getGroupListWithCheckDuplicate().then(res => {
            if (res.status === 200) {
                setGroupAllData(transformGroupUtil(res.result.group));
            }
        });
    }
    useEffect(()=>{
        displayGroupDetails();
        let tempQuestionData = [{
            key: 0,
            value: "None"
        }];
        questionAll.forEach(element => {
            if(element.queType !== "matrix" && element.queType !== "contact_form" && element.queType !== "constant_sum" && element.queType !== "rank" && element.queType !== "label" && element.queType !== "captcha"){
                tempQuestionData.push({
                    key: callFromModal === "no" ? element.queQuestion : element.queNumber,
                    value: element.queQuestion
                })
            }
        });
        setQuestionData(tempQuestionData);
        if((typeof data?.cfId !== "undefined" && data?.cfId !== 0 && data?.cfId !== "") && (typeof data?.cfGroupId !== "undefined" && data?.cfGroupId !== 0 && data?.cfGroupId !== "")){
            getGroupFieldsList(data?.cfGroupId).then(res => {
                if (res.status === 200) {
                    setGroupFieldData(res.result);
                }
            });
        }
    },[]);
    return (
        <>
            <FormGroup className={`${callFromModal === "no" ? "w-50" : "w-75" } mx-auto d-flex align-items-end`}>
                <div className="w-100 mr-3">
                    <DropDownControls
                        name="cfGroupId"
                        label="Select Group"
                        dropdownList={groupAllData}
                        onChange={handleChangeGroup}
                        value={data?.cfGroupId || ""}
                    />
                </div>
                <div style={{width:"200px"}}>
                    <Button color="primary" variant="contained" onClick={() => { handleClickAddNewGroup() }}>ADD NEW GROUP</Button>
                </div>
            </FormGroup>
            {(typeof data?.cfGroupId !== "undefined" && data?.cfGroupId !== "") && renderMapping()}
            <ModalCreateGroup
                modalCreateGroup={modalCreateGroup}
                createGroupData={createGroupData}
                createUDFNo={createUDFNo}
                dropDownRefs={dropDownRefs}
                dropDownUDF={dropDownUDF}
                inputRefs={inputRefs}
                totalUDFNo={totalUDFNo}
                createGroupHandleChange={createGroupHandleChange}
                submitFormCreateGroup={submitFormCreateGroup}
                toggleCreateGroup={toggleCreateGroup}
            />
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser:state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FormToGroupMapping);