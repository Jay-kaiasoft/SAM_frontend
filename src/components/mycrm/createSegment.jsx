import React, { useEffect, useState } from "react";
import {Button, TextField, Autocomplete} from "@mui/material";
import { pathOr } from "ramda";
import { fetchGroupUdfList, setNewSegmentPopUp } from "../../actions/createSegmentActions";
import { connect } from "react-redux";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { addSegment, getGroupUDFValueList } from "../../services/clientContactService";

const dropDownValues = [
    {
        key: "like",
        value: "Contains"
    },
    {
        key: "not like",
        value: "Not Contains"
    },
    {
        key: "=",
        value: "Equals"
    },
    {
        key: "!=",
        value: "Not Equal"
    },
    {
        key: "begins with",
        value: "Begins With"
    },
    {
        key: "not begins with",
        value: "Not Begins With"
    },
    {
        key: "ends with",
        value: "Ends With"
    },
    {
        key: "not ends with",
        value: "Not Ends With"
    },
    {
        key: ">",
        value: "Greater Than"
    },
    {
        key: ">=",
        value: "Greater Than or Equal"
    },
    {
        key: "<",
        value: "Less Than"
    },
    {
        key: "<=",
        value: "Less Than or Equal"
    }
]
const initialFields = [
    {
        key: 1,
        groupUdf: "dropdown1",
        comparison: "dropdown1",
        udfValue: "input1"
    }
];
const CreateSegment = ({
    openSegmentModal,
    setNewSegmentPopUp,
    groupId,
    fetchGroupUdfList,
    groupUdfList,
    globalAlert,
    memberId,
    subMemberId,
    reloadData
}) => {

    const initialFieldsToDisplay = [...initialFields]
    const [fields, setFields] = useState(initialFieldsToDisplay);
    const [currentSelected, setCurrentSelected] = useState(1);
    const [groupUdfData, setGroupUdfData] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [udfValueData, setUdfvalueData] = useState([]);
    const [segmentName, setSegmentName] = useState("");
    const [udfAutoCompleteValue, setUdfAutoCompleteValue] = useState([]);
    useEffect(() => {
        if (groupId) {
            fetchGroupUdfList(groupId)
        }
    }, [fetchGroupUdfList, groupId])

    const handleUdfAutoCompleteValue = (name, value) => {
        const data = `${groupId}/${value}`;
        getGroupUDFValueList(data).then(resp => {
            if (resp.status === 200) {
                setUdfAutoCompleteValue(prev => ({ ...prev, [name]: resp.result }))
            } else {
                globalAlert({
                    type: "Error",
                    text: resp.message,
                    open: true
                });
            }
        })
    }
    const handleUdfData = (name, value) => {
        setGroupUdfData(prev => ({ ...prev, [name]: value }))
        handleUdfAutoCompleteValue(name, value);
    }
    const handleComparisonData = (name, value) => {
        setComparisonData(prev => ({ ...prev, [name]: value }))
    }
    const handleUdfValueData = (name, value) => {
        setUdfvalueData(prev => ({ ...prev, [name]: value }))
    }
    const handleSegmentName = (name, value) => {
        setSegmentName(value);
    }

    const createNewField = (condition) => {
        const lastIndex = fields[fields.length - 1].key;
        const newFieldData = {
            condition: condition,
            key: lastIndex + 1,
            groupUdf: `dropdown${lastIndex + 1}`,
            comparison: `dropdown${lastIndex + 1}`,
            udfValue: `input${lastIndex + 1}`
        }
        fields.push(newFieldData);
        setFields(fields)
        setCurrentSelected(lastIndex + 1)
    }

    const deleteField = (id) => {
        const filteredfields = fields.filter((item) => item.key !== id);
        setFields(filteredfields)
        setCurrentSelected(filteredfields[filteredfields.length - 1].key)
    }
    const createNewSegment = () => {
        if (!segmentName) {
            globalAlert({
                type: "Error",
                text: "Please enter segment name.",
                open: true
            })
            return;
        }
        const groupSegmentFields = [];
        let segDisplayOrder = 1;
        fields.forEach((field) => {
            const segFieldName = groupUdfData[field.groupUdf] ? groupUdfData[field.groupUdf] : null
            if (!segFieldName) {
                globalAlert({
                    type: "Error",
                    text: "Please select segment field.",
                    open: true
                })
                return
            }
            const segFieldOperator = comparisonData[field.comparison] ? comparisonData[field.comparison] : null;
            if (!segFieldOperator) {
                globalAlert({
                    type: "Error",
                    text: "Please select Operator",
                    open: true
                })
                return
            }
            const segFieldValue = udfValueData[field.udfValue] ? udfValueData[field.udfValue] : null;
            if (!segFieldValue) {
                globalAlert({
                    type: "Error",
                    text: "Please enter segment field value.",
                    open: true
                })
                return
            }
            const segConditions = field.condition;
            const groupSegment = {
                segDisplayOrder,
                segFieldName,
                segFieldOperator,
                segFieldValue,
                segConditions: segConditions ? segConditions : ""
            }
            groupSegmentFields.push(groupSegment)
            segDisplayOrder++;
        })
        const payload = {
            segName: segmentName,
            groupId,
            memberId,
            subMemberId,
            groupSegmentFieldDtos: groupSegmentFields
        }
        setFields([...initialFields])
        setComparisonData([]);
        setGroupUdfData([]);
        setUdfvalueData([]);
        setUdfAutoCompleteValue([]);
        setComparisonData([]);
        setSegmentName("");
        setCurrentSelected(1)
        setNewSegmentPopUp({ status: false })
        addSegment(payload).then(res => {
            if (res.status === 200) {
                reloadData();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClose = () => {
        setFields([...initialFields])
        setComparisonData([]);
        setGroupUdfData([]);
        setUdfvalueData([]);
        setUdfAutoCompleteValue([]);
        setComparisonData([]);
        setSegmentName("");
        setCurrentSelected(1)
        setNewSegmentPopUp({ status: false })
    }
    const renderFields = (field) => {
        return (
            <Row key={field.key}>
                {field.condition ?
                    (
                        <Col xs={12} className="separator"><span className="font-weight-bold text-blue">{field.condition}</span></Col>
                    ) : null
                }
                <Col xs={3} className="mb-4">
                    <DropDownControls
                        name={field.groupUdf}
                        label="Select Field"
                        onChange={handleUdfData}
                        validation={"required"}
                        dropdownList={groupUdfList}
                        value={groupUdfData[`dropdown${field.key}`] || ""}
                    />
                </Col>
                <Col xs={3} className="mb-4">
                    <DropDownControls
                        name={field.comparison}
                        label="Select"
                        onChange={handleComparisonData}
                        validation={"required"}
                        dropdownList={dropDownValues}
                        value={comparisonData[`dropdown${field.key}`] || ""}
                    />
                </Col>
                <Col xs={3} className="mb-4">
                    <Autocomplete
                        freeSolo
                        disableClearable
                        options={typeof udfAutoCompleteValue[field.groupUdf] !== "undefined" ? udfAutoCompleteValue[field.groupUdf].map((option) => option) : []}
                        onChange={(event, value)=>{handleUdfValueData(field.udfValue,value)}}
                        value={udfValueData[`input${field.key}`] || ""}
                        renderInput={(params) => (
                            <TextField
                                variant="standard"
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                name={field.udfValue}
                                label="Enter Value"
                                onChange={(event, value)=>{handleUdfValueData(field.udfValue,event.target.value)}}
                            />
                        )}
                    />
                </Col>
                <Col xs={3} className="mt-3 pr-0">
                    {field.key !== 1 ?
                        (
                            <button className="segment-btn btn-delete" onClick={() => { deleteField(field.key) }}><i className="far fa-trash-alt"></i></button>
                        )
                        : <></>
                    }
                    {field.key === currentSelected ? (
                        <button className="segment-btn btn-edit mx-2" onClick={() => { createNewField("OR") }}><i className="far fa-plus-square"></i>&nbsp;OR</button>
                    ) : <></>}
                    {field.key === currentSelected ? (
                        <button className="segment-btn btn-add" onClick={() => { createNewField("AND") }}><i className="far fa-plus-square"></i>&nbsp;AND</button>
                    ) : <></>}
                </Col>
            </Row>
        )
    }
    return (
        <Modal size="lg" isOpen={openSegmentModal} toggle={()=>{setNewSegmentPopUp({ status: false })}}>
            <ModalHeader toggle={()=>{setNewSegmentPopUp({ status: false })}}>Create Segment</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={12}>
                        <InputField
                            type="text"
                            name="SegmentName"
                            label="Name"
                            onChange={handleSegmentName}
                            validation={"required"}
                            value={segmentName}
                        />
                    </Col>
                    <Col xs={12} className="mt-3">Filter</Col>
                    <Col xs={12}>{fields.map((field) => (renderFields(field)))}</Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-4" onClick={() => createNewSegment()}>SAVE</Button>
                <Button variant="contained" color="primary" onClick={() => handleClose()}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    )
}
const mapStateToProps = state => {
    return {
        openSegmentModal: pathOr(true, ["createSegment", "openNewModal"], state),
        groupId: pathOr("", ["createSegment", "groupId"], state),
        groupUdfList: pathOr([], ["createSegment", "udfList"], state),
        memberId: pathOr("", ["user", "memberId"], state),
        subMemberId: pathOr("", ["subUser", "memberId"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) },
        setNewSegmentPopUp: (data) => { dispatch(setNewSegmentPopUp(data)) },
        fetchGroupUdfList: (data) => { dispatch(fetchGroupUdfList(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSegment)