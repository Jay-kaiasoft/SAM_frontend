import { Link } from '@mui/material';
import { Row, Col } from 'reactstrap';

export const ConditionCommonComponent = ({data, handleClickBounce}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <hr className="my-4"/>
                <h5 className="text-center">Condition : {data.conditionType}</h5>
            </Col>
            <ConditionYesNoCommonComponent data={data.yes} yesNoValue={"Yes"} handleClickBounce={handleClickBounce} />
            <ConditionYesNoCommonComponent data={data.no} yesNoValue={"No"} handleClickBounce={handleClickBounce} />
        </Row>
    );
}
const ConditionYesNoCommonComponent = ({data, yesNoValue, handleClickBounce}) => {
    return (
        <Col xs={12} sm={12} md={12} lg={6} xl={6} className={yesNoValue === "Yes" ? "border-right" : ""}>
            <Row className="mb-3 mx-0">
                <Col xs={12} className="font-weight-bold mb-3">
                    {data.oldMypage} = {yesNoValue}
                </Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-file-edit font-size-20 icon-main"></i>Subject</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.subject}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-user font-size-20 icon-main"></i>Sender Name</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.fromName}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Sender Email</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.fromEmail}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-envelope-open-text font-size-20 icon-main"></i>My Page</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.sendMypage}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-mailbox font-size-20 icon-main"></i>Total Queued</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.totalQueued || data.sent}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-mail-bulk font-size-20 icon-main"></i>Sent</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.sent}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-shipping-fast font-size-20 icon-main"></i>Delivered</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.delivered}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3 cursor-pointer" data-toggle="tooltip" title="Exception/Error returned by Receiver Mail Server."><span className="d-flex"><i className="far fa-exclamation-triangle font-size-20 icon-main"></i>Non Deliverable</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.exception}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3 cursor-pointer" data-toggle="tooltip" title="Email Address Invalid/doesn't exist."><span className="d-flex"><i className="far fa-reply font-size-20 icon-main"></i><Link component="a" onClick={() => { handleClickBounce(data.campSendId) }} className="text-center cursor-pointer">Bounced</Link></span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.bounced}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-envelope-open-text font-size-20 icon-main"></i>Opened</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.opened}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-envelope font-size-20 icon-main"></i>Unread</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.unread}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-bell-slash font-size-20 icon-main"></i>Unsubscribed</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.unsubscribed}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-link font-size-20 icon-main"></i>Total Click Through Rate (TCTR)</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.totalClickThroughRate}</Col>
                <Col xs={4} className="d-flex justify-content-between mb-3"><span className="d-flex"><i className="far fa-link font-size-20 icon-main"></i>Unique Click Through Rate (UCTR)</span><span className="d-flex">:</span></Col>
                <Col xs={8} className="mb-3">{data.uniqueClickThroughRate}</Col>
            </Row>
        </Col>
    );
}