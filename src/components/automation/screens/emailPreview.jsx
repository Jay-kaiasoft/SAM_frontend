import React from "react";
import { Col, Row } from "reactstrap";

const EmailPreview = ({
    data
}) => {
    return (
        <Row>
            <Col xl={10} className='mx-auto'>
                <p className='heading-style'>You are all set to send!</p>
                <p><b>Name of Workflow :</b> {data?.name}</p>
                <p><b>Type Of Trigger :</b> {data?.selectedAction}</p>
                {data?.selectedTriggerType ?
                    <p><b>{data?.selectedAction} Type :</b> {data?.selectedTriggerType}</p>
                    : null}
                <p><b>Selected Group :</b> {data?.amGroupName}</p>
                {data?.amSegmentName ? <p><b>Selected Segement :</b> {data?.amSegmentName}</p> : null}
                <p><b>Send on Date & Time:</b> {data?.schType === 2 ? data?.sendDateTime : 'now'}</p>
            </Col>
        </Row>
    )
}

export default EmailPreview