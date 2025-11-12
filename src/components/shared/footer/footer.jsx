import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from "../../../assets/styles/componentStyles.js";
import { siteURL, websiteTitleWithExt } from "../../../config/api";

const Footer = props => {
    return (
        <Row className='bg-white' style={{ zIndex: 999 }}>
            <Col xs={12} sm={12} md={12} lg={12} className='p-0'><hr className='mt-0' /></Col>
            <Col xs={12} sm={12} md={3} lg={3}>
                <img src={siteURL + "/img/logo.svg"} alt="logo" style={styles.footerLogo} />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} className="text-center">Copyright &copy; {new Date().getFullYear()} {websiteTitleWithExt}. All Rights Reserved.</Col>
            <Col xs={12} sm={12} md={3} lg={3} className="text-right"></Col>
            <Col xs={12} sm={12} md={12} lg={12} className='p-0 mb-3'></Col>
        </Row>
    )
}

export default Footer