import React, {Fragment, useEffect, useState} from "react";
import { Col, Row, Table } from "reactstrap";
import { Input, FormGroup, Label } from 'reactstrap'
import { Button } from '@mui/material';
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { getGroupContactCount, getSegmentList } from "../../services/clientContactService";
import { getMyPageById } from "../../services/myDesktopService";

const innerHeading = {
    fontSize: 18
}

const SelectGroupSegment = ({
    handleBack,
    handleNext,
    groups,
    setGroups,
    data,
    setData,
    globalAlert
}) => {
    const [totalMember, setTotalMember] = useState(data.totalMember);
    const [myPageGroupId, setMyPageGroupId] = useState(0);
    const [selectedSegmentIds, setSelectedSegmentIds] = useState(data.segId || []);
    const [selectedSegmentNames, setSelectedSegmentNames] = useState(data.segNames || []);

    const updateTotalMemberForSegments = async (group, segId, segNames) => {
        let total = 0;
        for (let sId of segId) {
            const res = await getGroupContactCount(group.gId, sId);
            if (res.status === 200) {
                total += res?.result?.contactCount || 0;
            }
        }
        setTotalMember(total);
        setData((prev) => ({
            ...prev,
            segId,
            segNames,
            totalMember: total,
            groupId: group.gId,
            groupName: group.name
        }));
    };

    const handleChangeCheckbox = async (group, segment) => {
        let segIds = [...selectedSegmentIds];
        let segNames = [...selectedSegmentNames];
        if (segIds.includes(segment.segId)) {
            segIds = segIds.filter(id => id !== segment.segId);
            segNames = segNames.filter(name => name !== segment.segName);
        } else {
            segIds.push(segment.segId);
            segNames.push(segment.segName);
        }
        setSelectedSegmentIds(segIds);
        setSelectedSegmentNames(segNames);
        await updateTotalMemberForSegments(group, segIds, segNames);
    };

    const handleChangeRadio = (group, index, segmentId = null) => {
        if(group.typeEmail === "unverified" || group.typeEmail === "email"){
            let msg = "";
            if(group.typeEmail === "unverified"){
                msg = "Group contact is not verified";
            } else if(group.typeEmail === "email") {
                msg = "Group contact is under verification process";
            }
            globalAlert({
                type: "Warning",
                text: msg,
                open: true
            });
        }
        getGroupContactCount(group.gId, segmentId).then((res) => {
            if (res.status === 200) {
                if (res.result?.segment.toUpperCase() === "Y") {
                    getSegmentList(group.gId).then(groupSegment => {
                        if (groupSegment.status === 200) {
                            setTotalMember(res?.result?.contactCount || 0);
                            setData((prev) => {
                                return {
                                    ...prev,
                                    groupId: group.gId,
                                    groupName: group.name,
                                    segId: [],
                                    segmentName: '',
                                    totalMember: res?.result?.contactCount || 0
                                }
                            });
                            setSelectedSegmentIds([]);
                            setGroups((prev) => {
                                prev[index].segment = groupSegment.result;
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
                            groupId: group.gId,
                            groupName: group.name,
                            segId: [],
                            segmentName: '',
                            totalMember: res?.result?.contactCount || 0
                        }
                    });
                    setSelectedSegmentIds([]);
                    setTotalMember(res?.result?.contactCount || 0);
                }
            }
        })
    }
    const checkMyPageGroupId = (group, index) => {
        if(myPageGroupId > 0){
            if(group.gId === myPageGroupId){
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    useEffect(()=>{
        if(data.mpId){
            getMyPageById(data.mpId).then(res => {
                if (res.result && res.result.mypage) {
                    if(res.result.mypage.groupId !== null){
                        setMyPageGroupId(res.result.mypage.groupId);
                    }
                }
            });
        }
    },[data.mpId]);
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>Select Group/Segment</strong></p>
                {myPageGroupId > 0 && <p>Your current Page selected has contact list associated with it. The associated contact list is show below. Please select the group to select the segment of the group.</p>}
                <div className="table-content-wrapper">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>
                                    Name
                                    <span style={{ float: "right" }}>Selected Member : <span>{totalMember}</span></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                groups.length > 0 ?
                                    groups.map((group,indexG) => {
                                        return (
                                            (group.lockGroup !== "Y" && checkMyPageGroupId(group, indexG)) && <Fragment key={group.gId}>
                                                <tr>
                                                    <td className="p-0">
                                                        <FormGroup check className="w-100">
                                                            <Label check className="w-100 p-1 cursor-pointer">
                                                                <Input
                                                                    name="groupOption"
                                                                    type="radio"
                                                                    onChange={() => { handleChangeRadio(group, indexG); }}
                                                                    checked={(selectedSegmentIds.length === 0) && (data.groupId === group.gId)}
                                                                />{group.name}
                                                            </Label>
                                                        </FormGroup>
                                                    </td>
                                                </tr>
                                                {
                                                    (group?.segment?.length > 0 && data.groupId === group.gId) ?
                                                        group.segment.map((segment,index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <FormGroup check className="w-100 ml-4">
                                                                            <Label check className="w-100 cursor-pointer">
                                                                                <Input
                                                                                    name="segmentOption"
                                                                                    type="checkbox"
                                                                                    className="mr-1"
                                                                                    onChange={() => handleChangeCheckbox(group, segment)}
                                                                                    checked={selectedSegmentIds.includes(segment.segId)}
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
                </div>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(1)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                            if (data?.groupId === undefined || data?.groupId === "") {
                                globalAlert({
                                    type: "Error",
                                    text: "Please Select a group",
                                    open: true
                                })
                                return
                            }
                            if (!totalMember > 0) {
                                globalAlert({
                                    type: "Error",
                                    text: "Selected Group/Segment has no member.",
                                    open: true
                                })
                                return
                            }
                            handleNext(1)
                        }}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}


export default connect(null, mapDispatchToProps)(SelectGroupSegment);