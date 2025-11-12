import React, { useEffect, useState } from "react"
import { Col, Row } from "reactstrap"
import { getEmailCampaignsReportDashboard } from "../../../../services/emailCampaignService";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../../../actions/globalAlertActions";
import { setConfirmDialogAction } from "../../../../actions/confirmDialogActions";
import DashboardData from "../dashboardData";
import { getClientTimeZone } from "../../../../assets/commonFunctions";

const Dashboard = ({id, campId, isAnimated, globalAlert, user}) => {
    const [dashboardData, setDashboardData] = useState({})
    useEffect(() => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        const data = `campId=${campId}&id=${id}&timeZone=${timeZone}`
        getEmailCampaignsReportDashboard(data).then(res => {
            if (res?.status === 200) {
                setDashboardData(res?.result?.dashboard)
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        })
    }, [campId, globalAlert, id, user.timeZone])
    return (
        <Row id="dashboard">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="text-center mb-3">{dashboardData?.campName}</h3>
            </Col>
            <DashboardData dashboardData={dashboardData} isAnimated={isAnimated} campId={campId} globalAlert={globalAlert} />
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="mt-3">Last opened: <b>{dashboardData?.lastOpened}</b></div>
            </Col>
        </Row>
    )
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);