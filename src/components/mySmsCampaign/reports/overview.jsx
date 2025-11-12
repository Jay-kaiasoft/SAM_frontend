import React, { useEffect, useState } from "react";
import { Row, Col } from 'reactstrap';
import { getSmsCampaignsReportDashboard } from "../../../services/smsCampaignService";
import AnimatedCircleDiagram from "../../shared/commonControlls/animatedCircleDiagram";

const Overview = ({ csId, smsId, isAnimated }) => {
    const [dashboardData, setDashboardData] = useState({})
    useEffect(() => {
        const data = `csId=${csId}&smsId=${smsId}`
        getSmsCampaignsReportDashboard(data).then(res => {
            if (res.status === 200) {
                setDashboardData(res?.result)
            }
        })
    }, [csId, smsId])
    return (
        <Row id="overview">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>{dashboardData?.smsName}</h3>
                <p>{dashboardData?.recipients} Recipients</p>
                <p>List: {dashboardData?.smsName}</p>
            </Col>
            <Col lg={4} md={12} sm={12} xs={12}>
                <AnimatedCircleDiagram
                    percentage={dashboardData?.successFulDeliveriesData?.percentage}
                    pathColor="#009999"
                    isAnimated={isAnimated}
                />
                <p className="text-center mt-3">
                    Successful Deliveries  - {dashboardData?.successFulDeliveriesData?.totalCount}
                </p>
            </Col>
            <Col lg={4} md={12} sm={12} xs={12}>
                <AnimatedCircleDiagram
                    percentage={dashboardData?.unDeliveredData?.percentage}
                    pathColor="#BD380F"
                    isAnimated={isAnimated}
                />
                <p className="text-center mt-3">
                    Undelivered - {dashboardData?.unDeliveredData?.count}
                </p>
            </Col>
            <Col lg={4} md={12} sm={12} xs={12}>
                <AnimatedCircleDiagram
                    percentage={dashboardData?.notSentData?.percentage}
                    pathColor="#FF0000"
                    isAnimated={isAnimated}
                />
                <p className="text-center mt-3">
                    Not Sent - {dashboardData?.notSentData?.count}
                </p>
            </Col>
        </Row>
    )
}

export default Overview;