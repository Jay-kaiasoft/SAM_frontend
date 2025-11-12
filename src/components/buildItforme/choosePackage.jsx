import React from "react";
import { Col, Row } from "reactstrap";

const innerHeading = {
    fontSize: 18
}

const ChoosePackage = ({ listPackages }) => {
    return (
        <Row className="mx-0">
            <Col xs={12} sm={12} md={{ offset: 4, size: 4 }} lg={{ offset: 4, size: 4 }} xl={{ offset: 4, size: 4 }}>
                <p style={innerHeading}><strong>Choose Your Package</strong></p>
                <Row>
                    <Col sm={12}>
                        <div className="buld-for-me-types buld-for-me-packs checked text-center pt-4 pb-2 mx-5 my-5">
                            <label><strong>{listPackages[0].bfmpLable} / ${listPackages[0].bfmpAmount}</strong></label>
                            <p dangerouslySetInnerHTML={{ __html: listPackages[0].bfmpText }}></p>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default ChoosePackage