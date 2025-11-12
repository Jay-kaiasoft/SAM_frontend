import React from "react";
import {connect} from "react-redux";
import {Dialog, DialogContent, DialogActions, Button, DialogContentText, DialogTitle} from "@mui/material";
import {resetConfirmDialogAction} from "../../../actions/confirmDialogActions";

const ConfirmDialog = (props) => {
    const {title, subTitle, open, onConfirm, component} = props.confirmDialog;
    const handleClose = () => {
        props.dispatch(resetConfirmDialogAction());
    };
    return (
        <Dialog open={open}>
            <DialogTitle className="px-3 py-2 text-white font-family-inherit" style={{ backgroundColor: '#ffc107' }}>
                <i className="fas fa-exclamation-triangle"></i> Confirm
            </DialogTitle>
            <DialogContent className="px-3 py-2">
                <DialogContentText className="mb-0 text-black white-space-pre-line font-family-inherit" dangerouslySetInnerHTML={{__html: `${title}`}} />
                {component}
                <DialogContentText className="mb-0 text-black white-space-pre-line font-family-inherit">{subTitle}</DialogContentText>
            </DialogContent>
            <DialogActions className="px-3 py-2 border-top">
                <Button
                    variant="contained"
                    className="float-right"
                    color="primary"
                    onClick={()=>{handleClose()}}
                >
                    NO
                </Button>
                <Button
                    variant="contained"
                    className="float-right"
                    color="primary"
                    onClick={()=>{onConfirm();handleClose();}}
                >
                    YES
                </Button>
            </DialogActions>
        </Dialog>
    );
}
const mapStateToProps = state => {
    return {
        confirmDialog: state.confirmDialog
    }
}
export default connect(mapStateToProps)(ConfirmDialog)