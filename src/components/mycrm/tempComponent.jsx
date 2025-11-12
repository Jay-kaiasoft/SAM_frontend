import React from 'react';
import { Col, Row } from "reactstrap";

const TempComponent = ({compName}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>{compName}</h3>
                <Row style={{height:"calc(100vh - 250px)"}} className="row align-items-center">
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                        <p className="fa-2x">Coming Soon...</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default TempComponent;