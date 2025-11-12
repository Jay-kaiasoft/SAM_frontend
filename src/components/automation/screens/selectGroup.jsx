import React, { Fragment, useEffect, useState } from "react"
import { Col, Row, Input, FormGroup, Label, Table } from "reactstrap";
import { getGroupContactCount, getSegmentList } from "../../../services/clientContactService";

const SelectGroup = ({
    data,
    setData,
    groupList=[],
    setGroupList,
    globalAlert,
    id
}) => {
    const [totalMember, setTotalMember] = useState(0);  
    const handleChangeRadio = (group, index, segmentId = null) => {
        getGroupContactCount(group.groupId, segmentId).then((res) => {
            if (res.status === 200) {
                if (segmentId) {
                    setData((prev) => {
                        return {
                            ...prev,
                            totalMember: res?.result?.contactCount || 0
                        }
                    });
                    setTotalMember(res?.result?.contactCount || 0);
                } else if (res.result?.segment.toUpperCase() === "Y") {
                    getSegmentList(group.groupId).then(groupSegment => {
                        if (groupSegment.status === 200) {
                            setTotalMember(res?.result?.contactCount || 0);
                            setData((prev) => {
                                return {
                                    ...prev,
                                    selectedGroup: group,
                                    amGroupId: group.groupId,
                                    amGroupName: group.groupName,
                                    amSegmentName: '',
                                    amGroupSegmentId: 0,
                                    totalMember: res?.result?.contactCount || 0
                                }
                            });
                            setGroupList((prev) => {
                                prev[index].groupSegment = groupSegment.result;
                                return prev;
                            });
                        } else {
                            globalAlert({
                                type: "Error",
                                text: groupSegment.message,
                                open: true
                            });
                        }
                    });
                } else {
                    setData((prev) => {
                        return {
                            ...prev,
                            selectedGroup: group,
                            amGroupId: group.groupId,
                            amGroupName: group.groupName,
                            amSegmentName: '',
                            amGroupSegmentId: 0,
                            totalMember: res?.result?.contactCount || 0
                        }
                    });
                    setTotalMember(res?.result?.contactCount || 0);
                }
            }
        })
    }
    useEffect(()=>{
        if(id > 0){
            let index = groupList.findIndex(x => x.groupId === data.amGroupId);
            let tempGroup = groupList.filter(x => x.groupId === data.amGroupId)[0];
            if(data?.amGroupSegmentId > 0){
                handleChangeRadio(tempGroup, index, data?.amGroupSegmentId);
            } else {
                handleChangeRadio(tempGroup, index);
            }
        }
    },[]);
    return (
        <Row>
            <Col xl={10} className="mx-auto">
                <p className='heading-style'>Select Group for {data?.selectedEmailTemplate?.mpName} Template</p>
                <Table striped>
                    <thead>
                        <tr>
                            <th>
                                Name
                                <span style={{ float: "right" }}>Selected Member : <span>{totalMember || 0}</span></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            groupList?.length > 0 ?
                                groupList.map((group,indexG) => {
                                    return (
                                        group.lockGroup !== "Y" && <Fragment key={group.groupId}>
                                            <tr>
                                                <td className="p-0">
                                                    <FormGroup check className="w-100">
                                                        <Label check className="w-100 p-3 cursor-pointer">
                                                            <Input
                                                                name="groupOption"
                                                                type="radio"
                                                                onChange={() => { handleChangeRadio(group, indexG); }}
                                                                checked={(data?.amGroupSegmentId === 0) && (data.amGroupId === group.groupId)}
                                                            />{group.groupName}
                                                        </Label>
                                                    </FormGroup>
                                                </td>
                                            </tr>
                                            {
                                                (group?.groupSegment?.length > 0 && data.amGroupId === group.groupId) ?
                                                    group.groupSegment.map((segment, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <FormGroup check className="w-100 ml-4">
                                                                        <Label check className="w-100" style={{ cursor: 'pointer' }}>
                                                                            <Input
                                                                                name="groupOption"
                                                                                type="radio"
                                                                                onChange={() => {
                                                                                    setData((prev) => {
                                                                                        return {
                                                                                            ...prev,
                                                                                            amGroupSegmentId: segment.segId,
                                                                                            amSegmentName: segment.segName,
                                                                                            totalMember: segment?.totalMember || 0
                                                                                        }
                                                                                    });
                                                                                    handleChangeRadio(group, indexG, segment.segId);
                                                                                }}
                                                                                checked={(data?.amGroupSegmentId > 0) && (segment.segId === data?.amGroupSegmentId)}
                                                                            />{segment.segName}
                                                                        </Label>
                                                                    </FormGroup>
                                                                </td>
                                                            </tr>
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
            </Col>
        </Row>
    )
}
export default SelectGroup