import React, {useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import {emailVerification} from "../../../actions/profileActions";
import { Col, Row } from 'reactstrap';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import styles from "../../../assets/styles/componentStyles.js";
import { siteURL } from '../../../config/api';
import Footer from '../../shared/footer/footer';
import History from '../../../history';
import Lottie from "lottie-react";
import loaderAnimation from "../../shared/loader/loaderAnimation.json";

const EmailVerification = (props) => {
    let params = useMemo(()=>{ return props.location.search ? props.location.search.replace("\"","").replace("?","").split("&") : [];},[props.location.search]);
    useEffect(()=>{
        if(params.length > 0)
        {
            let requestData={
                "uid":params[0].replace("v=",""),
                "email": params[1].replace("d=",""),
                "subMemberId":props.subUser.memberId
            }
            props.emailVerification(requestData);
        } else {
            setTimeout(()=>{
                History.push("/");
            },5000);
        }
    },[params,props]);
    return (
        <>
            <Row className="headerMain">
                <Col className='p-0'>
                    <Box>
                        <AppBar elevation={0} color='transparent' position='static' sx={styles.header}>
                            <Toolbar>
                                <Typography style={{ flexGrow: 1 }}>
                                    <img src={siteURL+"/img/logo.svg"} alt="logo" style={styles.footerLogo} />
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </Col>
            </Row>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        params.length > 0 ?
                            <div className="d-flex" style={{height:"100%"}}>
                                <div className="w-100 d-flex flex-column align-items-center justify-content-center">
                                    <div className="lottie-main">
                                        <Lottie animationData={loaderAnimation} loop={true} />
                                    </div>
                                    <div className="mt-3">Please wait !!!</div>
                                    <div className="mt-3">Your email verification is processing...</div>
                                </div>
                            </div>
                        :
                            <div className="d-flex" style={{height:"100%"}}>
                                <div className="w-100 m-auto text-center">
                                    <div className="mt-3">Thank you...</div>
                                    <div className="mt-3">Your email verification process is completed...</div>
                                </div>
                            </div>
                    }
                </Col>
            </Row>
            <Row className="footerMain">
                <Col>
                    <Footer />
                </Col>
            </Row>
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        emailVerification: (data) => {
            dispatch(emailVerification(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(EmailVerification);