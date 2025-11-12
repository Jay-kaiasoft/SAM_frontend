import React from "react";
import { Row, Col } from 'reactstrap';
import SmsDeleveries from "./smsDeleveries";
import MmsDeleveries from "./mmsDeleveries";

const Deliveries = ({ csId, smsId }) => {
    return (
        <>
            <Row className="mb-3">
                <Col>
                    <h3>Deliveries</h3>
                </Col>
            </Row>
            <SmsDeleveries csId={csId} smsId={smsId} />
            <MmsDeleveries csId={csId} smsId={smsId} />
        </>
    );
}

export default Deliveries;
