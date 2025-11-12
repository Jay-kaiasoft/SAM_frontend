import React, { useEffect, useState } from "react";
import {Button, TextField, Autocomplete} from "@mui/material";
import { pathOr } from "ramda";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import { fetchGroupUdfList, getSegmentDetails, setEditSegmentPopUp } from "../../actions/createSegmentActions";
import { getGroupUDFValueList, updateSegment } from "../../services/clientContactService";

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

const EditSegment = ({
    getSegmentDetails,
    globalAlert,
    openSegmentModal,
    segmentId,
    setEditSegmentPopUp,
    fetchGroupUdfList,
    segmentDetails,
    groupUdfList,
    reloadData
}) => {
    const [fields, setFields] = useState([]);
    const [segmentName, setSegmentName] = useState("");
    const [currentSelected, setCurrentSelected] = useState(1);
    const [groupUdfData, setGroupUdfData] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [udfValueData, setUdfvalueData] = useState([]);
    const [udfAutoCompleteValue, setUdfAutoCompleteValue] = useState({});

    const handleUdfAutoCompleteValue = (name, value) => {
        const data = `${segmentDetails.groupId}/${value}`;
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
    const formatDataFields = (segmentData) => {
        segmentData.sort((a, b) => (a.segDisplayOrder > b.segDisplayOrder) ? 1 : ((b.segDisplayOrder > a.segDisplayOrder) ? -1 : 0))
        const formattedData = [];
        segmentData.forEach((it) => {
            const field = {
                id: it.segDisplayOrder,
                groupUdf: `dropdown${it.segDisplayOrder}`,
                comparison: `dropdown${it.segDisplayOrder}`,
                udfValue: `input${it.segDisplayOrder}`,
                segConditions: it.segConditions ? it.segConditions : null
            }
            handleUdfData(field.groupUdf, it.segFieldName);
            handleComparisonData(field.comparison, it.segFieldOperator);
            handleUdfValueData(field.udfValue, it.segFieldValue)
            formattedData.push(field)
        })
        setCurrentSelected(formattedData[formattedData.length - 1].id)
        setFields(formattedData)
    }
    useEffect(() => {
        if (segmentDetails && segmentDetails.segName) {
            setSegmentName(segmentDetails.segName)
        }
        if (segmentDetails && segmentDetails.groupSegmentFieldDtos) {
            formatDataFields(segmentDetails.groupSegmentFieldDtos)
        }
        //eslint-disable-next-line
    }, [segmentDetails])

    const createNewField = (condition) => {
        const lastIndex = fields[fields.length - 1].id;
        const newFieldData = {
            segConditions: condition,
            id: lastIndex + 1,
            groupUdf: `dropdown${lastIndex + 1}`,
            comparison: `dropdown${lastIndex + 1}`,
            udfValue: `input${lastIndex + 1}`
        }
        fields.push(newFieldData);
        setFields(fields)
        setCurrentSelected(lastIndex + 1)
    }

    const deleteField = (field) => {
        const filteredfields = fields.filter((item) => item.id !== field.id);
        setFields(filteredfields)
        delete groupUdfData[field.groupUdf]
        delete comparisonData[field.comparison]
        delete udfValueData[field.udfValue]
        setCurrentSelected(filteredfields[filteredfields.length - 1].id)
    }
    const editOldSegment = () => {
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
            const segConditions = field.segConditions;
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
            groupId: segmentDetails.groupId,
            memberId: segmentDetails.memberId,
            subMemberId: segmentDetails.subMemberId,
            segAddedDate: null,
            groupSegmentFieldDtos: groupSegmentFields
        }
        setEditSegmentPopUp({ status: false })
        setFields([])
        setComparisonData([]);
        setGroupUdfData([]);
        setUdfvalueData([]);
        setComparisonData([]);
        setSegmentName("");
        updateSegment(segmentDetails.segId, payload).then(res => {
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
        setEditSegmentPopUp({ status: false })
        setFields([])
        setComparisonData([]);
        setGroupUdfData([]);
        setUdfvalueData([]);
        setComparisonData([]);
        setSegmentName("");
    }
    const renderFields = (field) => {
        return (
            <Row key={field.id}>
                {field.segConditions ?
                    (
                        <Col xs={12} className="separator"><span className="font-weight-bold text-blue">{field.segConditions}</span></Col>
                    ) : null
                }
                <Col xs={3} className="mb-4">
                    <DropDownControls
                        name={field.groupUdf}
                        label="Select Field"
                        onChange={handleUdfData}
                        validation={"required"}
                        dropdownList={groupUdfList}
                        value={groupUdfData[`dropdown${field.id}`] || ""}
                    />
                </Col>
                <Col xs={3} className="mb-4">
                    <DropDownControls
                        name={field.comparison}
                        label="Select"
                        onChange={handleComparisonData}
                        validation={"required"}
                        dropdownList={dropDownValues}
                        value={comparisonData[`dropdown${field.id}`] || ""}
                    />
                </Col>
                <Col xs={3} className="mb-4">
                            <Autocomplete
                                freeSolo
                                disableClearable
                                options={typeof udfAutoCompleteValue[field.groupUdf] !== "undefined" ? udfAutoCompleteValue[field.groupUdf].map((option) => option) : []}
                                onChange={(event, value)=>{handleUdfValueData(field.udfValue,value)}}
                                value={udfValueData[`input${field.id}`] || ""}
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
                            {field.id !== 1 ?
                                (
                                    <button className="segment-btn btn-delete" onClick={() => { deleteField(field) }}><i className="far fa-trash-alt"></i></button>
                                )
                                : <></>
                            }
                            {field.id === currentSelected ? (
                                <button className="segment-btn btn-edit mx-2" onClick={() => { createNewField("OR") }}><i className="far fa-plus-square"></i>&nbsp;OR</button>
                            ) : <></>}
                            {field.id === currentSelected ? (
                                <button className="segment-btn btn-add" onClick={() => { createNewField("AND") }}><i className="far fa-plus-square"></i>&nbsp;AND</button>
                            ) : <></>}
                        </Col>
                    </Row>
        )
    }
    return (
        <Modal size="lg" isOpen={openSegmentModal} toggle={()=>{setEditSegmentPopUp({ status: false })}}>
            <ModalHeader toggle={()=>{setEditSegmentPopUp({ status: false })}}>Edit Segment</ModalHeader>
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
                <Button variant="contained" color="primary" className="mr-4" onClick={() => editOldSegment()}>SAVE</Button>
                <Button variant="contained" color="primary" onClick={() => handleClose()}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    )
}

const mapStateToProps = state => {
    return {
        openSegmentModal: pathOr(true, ["createSegment", "openEditModal"], state),
        groupId: pathOr("", ["createSegment", "groupId"], state),
        memberId: pathOr("", ["user", "memberId"], state),
        segmentId: pathOr("", ["createSegment", "segmentId"], state),
        segmentDetails: pathOr("", ["createSegment", "segmentDetails"], state),
        groupUdfList: pathOr([], ["createSegment", "udfList"], state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) },
        setEditSegmentPopUp: (data) => { dispatch(setEditSegmentPopUp(data)) },
        getSegmentDetails: (data) => { dispatch(getSegmentDetails(data)) },
        fetchGroupUdfList: (data) => { dispatch(fetchGroupUdfList(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditSegment)