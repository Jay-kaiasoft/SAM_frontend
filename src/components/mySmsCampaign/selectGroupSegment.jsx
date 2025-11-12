import React, { Fragment, useEffect } from "react";
import { Col, FormGroup, Input, Label, Row, Table } from "reactstrap";
import { getSegmentList } from "../../services/clientContactService";

const innerHeading = {
    fontSize: 18
}


const SelectGroupSegment = ({
    data,
    setData = () => { },
    groups,
    setGroups,
    handleTotalCount = () => { },
    globalAlert
}) => {
    const handleChangeRadio = (group, index, segmentId = null) => {
        let tempGroup = groups.filter((v)=>{return v.gId === group.gId});
        if(segmentId){
            let tempSegment = tempGroup[0].segment.filter((v)=>{return v.segId === segmentId})[0];
            setData((prev) => {
                return {
                    ...prev,
                    segId: tempSegment.segId,
                    segmentName: tempSegment.segName
                }
            });
            handleTotalCount("groupSegment", tempSegment.segId);
        } else if(tempGroup.length > 0 && typeof tempGroup[0].segment === "undefined" && tempGroup[0].segmentYN === "Y"){
            getSegmentList(group.gId).then(res => {
                if (res.status === 200) {
                    setData((prev) => {
                        return {
                            ...prev,
                            groupList: group.gId,
                            groupName: group.name,
                            segId: 0,
                            segmentName: ''
                        }
                    });
                    handleTotalCount("group", group.gId);
                    setGroups((prev)=>{
                        prev[index].segment=res.result
                        return prev;
                    })
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        } else {
            setData((prev) => {
                return {
                    ...prev,
                    groupList: group.gId,
                    groupName: group.name,
                    segId: 0,
                    segmentName: ''
                }
            });
            handleTotalCount("group", group.gId);
        }
    }
    useEffect(()=>{
        if(data?.smsId > 0){
            let index = groups.findIndex(x => x.gId === data.groupList);
            let tempGroup = groups.filter(x => x.gId === Number(data.groupList))[0];
            if(data.segId > 0){
                handleChangeRadio(tempGroup, index, data.segId);
            } else {
                handleChangeRadio(tempGroup, index);
            }
        }
    },[]);
    return (
        <Row>
            <Col xs={12} sm={12} md={5} lg={5} xl={5} className="mx-auto">
                <p style={innerHeading}><strong>Select Group/Segment</strong></p>
                <div className="table-content-wrapper">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>
                                    Name
                                    <span style={{ float: "right" }}>Selected Member : <span>{data.totalMember}</span></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                groups.length > 0 ?
                                    groups.map((value, index) => {
                                        return (
                                            value.lockGroup !== "Y" && <Fragment key={value.gId}>
                                                <tr>
                                                    <td className="p-0">
                                                        <FormGroup check className="w-100">
                                                            <Label check className="w-100 p-1 cursor-pointer">
                                                                <Input
                                                                    name="groupOption"
                                                                    type="radio"
                                                                    onChange={ () => { handleChangeRadio(value,index); } }
                                                                    checked={(data.segId === 0) && (Number(data.groupList) === value.gId)}
                                                                />{value.name}
                                                            </Label>
                                                        </FormGroup>
                                                    </td>
                                                </tr>
                                                {
                                                    (value?.segment?.length > 0 && Number(data.groupList) === value.gId) ?
                                                        value.segment.map((svalue) => {
                                                            return (
                                                                <Fragment key={svalue.segId}>
                                                                    <tr>
                                                                        <td>
                                                                            <FormGroup check className="w-100 ml-4">
                                                                                <Label check className="w-100" style={{ cursor: 'pointer' }}>
                                                                                    <Input
                                                                                        name="groupOption"
                                                                                        type="radio"
                                                                                        onChange={() => { handleChangeRadio(value,index, svalue.segId); }}
                                                                                        checked={(data.segId > 0) && (svalue.segId === data.segId)}
                                                                                    />{svalue.segName}
                                                                                </Label>
                                                                            </FormGroup>
                                                                        </td>
                                                                    </tr>
                                                                </Fragment>
                                                            )
                                                        })
                                                        : null
                                                }
                                            </Fragment>
                                        )
                                    })
                                    : null
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    )
}

export default SelectGroupSegment