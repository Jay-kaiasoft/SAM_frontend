import { Col, Row, Table } from "reactstrap"
import { dateTimeFormat } from "../../assets/commonFunctions"

const innerHeading = {
    fontSize: 18
}

const Preview = ({ data }) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>You are all set to send!</strong></p>
                <div>
                    <Table className="w-100">
                        <tbody>
                            <tr>
                                <td className="text-right" style={{ width: "35%" }}>Name of SMS :</td>
                                <td>{data.smsName}</td>
                            </tr>
                            <tr>
                                <td className="text-right">Group :</td>
                                <td>{data.groupName}</td>

                            </tr>
                            {
                                data.segId > 0 ?
                                    <tr>
                                        <td className="text-right">Segment :</td>
                                        <td>{data.segmentName}</td>
                                    </tr>
                                    : null
                            }
                            <tr>
                                <td className="text-right">Total Member :</td>
                                <td>{data.totalMember}</td>
                            </tr>
                            {
                                data.scheduleType === 2 ?
                                    <tr>
                                        <td className="text-right">Send on Date and Time :</td>
                                        <td>{dateTimeFormat(data.sendOnDate)} (PST)</td>
                                    </tr> :
                                    null
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    )
}

export default Preview