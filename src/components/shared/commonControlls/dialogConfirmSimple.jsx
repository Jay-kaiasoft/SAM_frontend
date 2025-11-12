import React, { useCallback, useState } from "react";
import { Button, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle } from "@mui/material";

const DialogConfirmSimple = () => {
    const [modalOaConfirm, setModalOaConfirm] = useState(false);
    const toggleOaConfirm = useCallback(() => setModalOaConfirm(!modalOaConfirm),[modalOaConfirm]);
    return (
        <>
            <Dialog open={modalOaConfirm}>
                <DialogTitle className="px-3 py-2 text-white font-family-inherit" style={{ backgroundColor: '#ffc107' }}>
                    <i className="fas fa-exclamation-triangle"></i> Confirm
                </DialogTitle>
                <DialogContent className="px-3 py-2">
                    <DialogContentText id="oaconfirm-text" className="mb-0 text-black white-space-pre-line font-family-inherit" />
                </DialogContent>
                <DialogActions className="px-3 py-2 border-top">
                    <Button variant="contained" className="float-right" color="primary" onClick={()=>{toggleOaConfirm()}} >
                        NO
                    </Button>
                    <Button id="yes_oaconfirm" variant="contained" className="float-right" color="primary" onClick={()=>{toggleOaConfirm();}} >
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
            <input type="hidden" id="clickOaConfirmModal" onClick={()=>{toggleOaConfirm()}}/>
        </>
    );
}

export default DialogConfirmSimple;