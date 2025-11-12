import React from 'react'
import { connect } from 'react-redux'
import { resetSnackBarAction } from '../../../actions/snackBarActions'
import {Snackbar, Alert, Slide} from "@mui/material";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

const GlobalSnackBar = props => {
    const { type, text, open, onClick } = props.snackBar;
    const handleClose = () => {
        props.dispatch(resetSnackBarAction())
    };
    const handleClickOnClick = (e) => {
        if(e.target.nodeName === "svg" && e.target.dataset.testid === "CloseIcon"){
            handleClose();
        } else {
            onClick();
            handleClose();
        }
    }
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={open}
            autoHideDuration={30000}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
            onClick={(e)=>{handleClickOnClick(e)}}
            className="cursor-pointer"
        >
            <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
                {text}
            </Alert>
        </Snackbar>
    )
}
const mapStateToProps = state => {
    return {
        snackBar: state.snackBar
    }
}
export default connect(mapStateToProps)(GlobalSnackBar)