import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchGroupUdfList, setDuplicateSegmentPopUp, setEditSegmentPopUp, setSegmentDetails } from "../../actions/createSegmentActions";
import { pathOr } from "ramda";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import { addSegment, getSegment } from "../../services/clientContactService";

const DuplicateSegment = ({
    segmentId,
    setDuplicateSegmentPopUp,
    globalAlert,
    openDuplicateModal,
    setSegmentDetails,
    setEditSegmentPopUp,
    fetchGroupUdfList,
    reloadData
}) => {
    const createNewSegment = (data) => {
        data.groupSegmentFieldDtos.forEach(it => {
            delete it.segId;
            delete it.segfId
        })
        const payload = {
            segName: data.segName,
            groupId: data.groupId,
            memberId: data.memberId,
            subMemberId: data.subMemberId,
            groupSegmentFieldDtos: data.groupSegmentFieldDtos
        }
        addSegment(payload).then(res => {
            if (res.status === 200) {
                getSegment(res.result.segId).then(resp => {
                    fetchGroupUdfList(resp.result.groupId);
                    if (resp.status === 200) {
                        setSegmentDetails(resp.result);
                        setEditSegmentPopUp({ status: true })
                        reloadData();
                    } else {
                        globalAlert({
                            type: "Error",
                            text: resp.message,
                            open: true
                        });
                    }
                })
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleOKClick = () => {
        getSegment(segmentId).then(resp => {
            if (resp.status === 200) {
                setDuplicateSegmentPopUp({ status: false })
                createNewSegment(resp.result)
            } else {
                globalAlert({
                    type: "Error",
                    text: resp.message,
                    open: true
                });
            }
        });
    }
    return (
        <Dialog open={openDuplicateModal} aria-labelledby="customized-dialog-title">
            <DialogTitle className="px-3 py-2 text-white" id="draggable-dialog-title" style={{ backgroundColor: '#ffc107' }}><i className="fas fa-exclamation-triangle mr-2"></i>Confirm</DialogTitle>
            <DialogContent className="px-3 py-2">
                <DialogContentText className="mb-0 text-black">Are you sure you want to add duplicate segment?</DialogContentText>
            </DialogContent>
            <DialogActions className="px-3 py-2 border-top">
                <Button variant="contained" onClick={() => handleOKClick()} color="primary">OK</Button>
                <Button variant="contained" onClick={() => setDuplicateSegmentPopUp({ status: false })} color="primary">CANCEL</Button>
            </DialogActions>
        </Dialog>
    )
}

const mapStateToProps = state => {
    return {
        openDuplicateModal: pathOr(true, ["createSegment", "openDuplicateModal"], state),
        groupId: pathOr("", ["createSegment", "groupId"], state),
        groupUdfList: pathOr([], ["createSegment", "udfList"], state),
        memberId: pathOr("", ["user", "memberId"], state),
        segmentId: pathOr("", ["createSegment", "segmentId"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) },
        setDuplicateSegmentPopUp: (data) => { dispatch(setDuplicateSegmentPopUp(data)) },
        setSegmentDetails: (data) => { dispatch(setSegmentDetails(data)) },
        setEditSegmentPopUp: (data) => dispatch(setEditSegmentPopUp(data)),
        fetchGroupUdfList: (data) => { dispatch(fetchGroupUdfList(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DuplicateSegment)