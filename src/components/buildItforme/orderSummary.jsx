import React from "react";
import { Col, Row, Table } from "reactstrap";

const innerHeading = {
    fontSize: 18
}

const OrderSummary = ({
    listPackages
}) => {
    return (
        <>
            <Row className="mx-0 mb-2">
                <Col xs={12} sm={12} md={{ offset: 2, size: 8 }} lg={{ offset: 2, size: 8 }} xl={{ offset: 2, size: 8 }}>
                    <p style={innerHeading}><strong>Payment</strong></p>
                    <h6><strong>ORDER SUMMARY</strong></h6>
                </Col>
            </Row>
            <Row className="mx-0">
                <Col xs={12} sm={12} md={{ offset: 2, size: 8 }} lg={{ offset: 2, size: 8 }} xl={{ offset: 2, size: 8 }}>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <td>
                                    Email Template Design
                                </td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{listPackages[0].bfmpLable}</td>
                                <td>${listPackages[0].bfmpAmount}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>${listPackages[0].bfmpAmount}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default OrderSummary