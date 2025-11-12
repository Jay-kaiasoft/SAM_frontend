import React, {useCallback, useEffect, useState} from "react"
import { Col, Row } from "reactstrap"
import {getEmailCampaignsReportDashboardAB, setChooseWinner} from "../../../../services/emailCampaignService"
import DashboardData from "../dashboardData"
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../../../actions/confirmDialogActions";
import {connect} from "react-redux";
import { getClientTimeZone } from "../../../../assets/commonFunctions"

const Dashboard = ({ id, campId, isAnimated, viewSelectedData, globalAlert, confirmDialog, user, subUser }) => {
    const [viewSelected, setViewSelected] = useState(viewSelectedData);
    const [dashboardData, setDashboardData] = useState({});
    const displayGetEmailCampaignsReportDashboardAB = useCallback(() => {
        let timeZone = (typeof user.timeZone === "undefined" || user.timeZone === "" || user.timeZone === null) ? getClientTimeZone() : user.timeZone;
        const data = `id=${id}&campId=${campId}&timeZone=${timeZone}`
        getEmailCampaignsReportDashboardAB(data).then(res => {
            if (res?.status === 200) {
                setDashboardData(res?.result)
            }
        })
    },[id,campId,user.timeZone]);
    const handleClickWinner = (type) => {
        confirmDialog({
            open: true,
            title: `Are you sure you want to choose winner ${type}?`,
            onConfirm: () => {
                const requestData = {
                    "campId":campId,
                    "winner":type,
                    "subMemberId":subUser.memberId
                };
                setChooseWinner(requestData).then(res => {
                    if (res?.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        displayGetEmailCampaignsReportDashboardAB();
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                })
            }
        });
    }
    useEffect(() => {
        displayGetEmailCampaignsReportDashboardAB();
    }, [displayGetEmailCampaignsReportDashboardAB])
    const renderViewSelected = () => {
        if (viewSelected === 0) {
            return (
                <Row className="border mx-0">
                    {
                        dashboardData?.resultTie === "Y" && dashboardData?.isCompletedAB !== "Y" ?
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center my-2">Result is tie. You need to select Winner by clicking "Winner" button.</Col>
                        : null
                    }
                    <DashboardData inHalfScreen={true} className={"border-right"} heading={"For A"} dashboardData={dashboardData?.dashboard} winner={dashboardData?.winner} byAutoManual={dashboardData?.byAutoManual} handleClickWinner={handleClickWinner} campId={campId} globalAlert={globalAlert}/>
                    <DashboardData inHalfScreen={true} heading={"For B"} dashboardData={dashboardData?.dashboardB} winner={dashboardData?.winner} byAutoManual={dashboardData?.byAutoManual} handleClickWinner={handleClickWinner} campId={campId} globalAlert={globalAlert}/>
                </Row>
            )
        } else if (viewSelected === 1) {
            return (
                <Row className="border mx-0">
                    <DashboardData heading={"For Winner"} dashboardData={dashboardData?.dashboardO} campId={campId} globalAlert={globalAlert}/>
                </Row>
            )
        } else if (viewSelected === 2) {
            return (
                <Row id="dashboard">
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Row className="border mx-0">
                            {
                                dashboardData?.resultTie === "Y" && dashboardData?.isCompletedAB !== "Y" ?
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center my-2" data-html2canvas-ignore="false">Result is tie. You need to select Winner by clicking "Winner" button.</Col>
                                    : null
                            }
                            <DashboardData inHalfScreen={true} className={"border-right"} heading={"For A"} dashboardData={dashboardData?.dashboard} isAnimated={isAnimated} winner={dashboardData?.winner} byAutoManual={dashboardData?.byAutoManual} handleClickWinner={handleClickWinner} campId={campId} globalAlert={globalAlert}/>
                            <DashboardData inHalfScreen={true} heading={"For B"} dashboardData={dashboardData?.dashboardB} isAnimated={isAnimated} winner={dashboardData?.winner} byAutoManual={dashboardData?.byAutoManual} handleClickWinner={handleClickWinner} campId={campId} globalAlert={globalAlert}/>
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Row className="border mx-0 border-top-0">
                            <DashboardData heading={"For Winner"} dashboardData={dashboardData?.dashboardO} isAnimated={isAnimated}  campId={campId} globalAlert={globalAlert}/>
                        </Row>
                    </Col>
                </Row>
            )
        }
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="text-center mb-3">{dashboardData?.campName}</h3>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} >
                <div className="d-flex flex-row" >
                    <div className={`cursorPointer px-3 py-2 border border-bottom-0 ${viewSelected === 0 && "gray-background"}`} onClick={() => { setViewSelected(0) }}>Initial</div>
                    <div className={`cursorPointer px-3 py-2 border-top ${viewSelected === 1 && "gray-background"}`} onClick={() => { setViewSelected(1) }}>Remain</div>
                    <div id="dashboardAll" className={`cursorPointer px-3 py-2 border border-bottom-0 ${viewSelected === 2 && "gray-background"}`} onClick={() => { setViewSelected(2) }}>All</div>
                </div>
                {renderViewSelected()}
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="mt-3">Last opened: {dashboardData?.lastOpened}<b></b></div>
            </Col>
        </Row>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
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
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);