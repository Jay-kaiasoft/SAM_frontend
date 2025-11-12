import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {resetGlobalAlertAction} from "../../../actions/globalAlertActions";
import {connect} from "react-redux";

const GlobalAlert = (props) => {
    const { type, text, open } = props.globalAlert;
    const handleClose = () => {
        props.dispatch(resetGlobalAlertAction());
    };

    if (text === '') {
        return <></>
    }
    return (
        <Dialog open={open} aria-labelledby="customized-dialog-title">
                {(() => {
                    if (type === "Error") {
                        return (
                        <DialogTitle className="px-3 py-2 text-white font-family-inherit" style={{ backgroundColor: '#b50101' }} id="customized-dialog-title" onClose={handleClose}>
                            <i className="far fa-times-circle"></i> {type}
                            </DialogTitle>
                        )
                    } else if (type === "Success") {
                        return (
                        <DialogTitle className="px-3 py-2 text-white font-family-inherit" style={{ backgroundColor: '#4285f4' }} id="draggable-dialog-title">
                            <i className="far fa-check-circle"></i> {type}
                            </DialogTitle>
                        )
                    } else if (type === "Warning") {
                        return (
                        <DialogTitle className="px-3 py-2 text-white font-family-inherit" style={{ backgroundColor: '#ffc107' }} id="draggable-dialog-title">
                            <i className="fas fa-exclamation-triangle"></i> {type}
                            </DialogTitle>
                        )
                    }
                })()}
            <DialogContent className="px-3 py-2">
                <DialogContentText className="mb-0 text-black white-space-pre-line font-family-inherit" dangerouslySetInnerHTML={{__html: `${text}`}} />
            </DialogContent>
            <DialogActions className="px-3 py-2 border-top">
                <Button autoFocus variant="contained" onClick={handleClose} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
    );
}

const mapStateToProps = state => {
    return {
        globalAlert: state.globalAlert
    }
}
export default connect(mapStateToProps)(GlobalAlert)