import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Col, Row } from "reactstrap"
import { setGlobalAlertAction } from "../../../actions/globalAlertActions"
import { getColors } from "../../../assets/commonFunctions"
import { getAssessmentReportTechnologyUse } from "../../../services/assessmentService"
import ChartJs from "../../shared/chartJsComponent/chartJs"

const technologiesLabel = {
    iPhone: "iPhone",
    androidTab: "Android Tab",
    androidPhone: "Android Phone",
    chrome: "Chrome",
    safari: "Safari",
    firefox: "Firefox",
    iPad: "iPad",
    fluid: "Fluid",
    air: "Air",
    ie: "IE Browser",
    others: "Others"
}

const createDataObject = (requestData) => {
    const labels = []
    const data = []
    Object.keys(requestData?.technologies).forEach((key) => {
        labels.push(technologiesLabel[key])
        data.push(requestData?.technologies[key])
    })
    return {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: data,
            backgroundColor: getColors(Object.keys(requestData?.technologies)?.length),
            borderWidth: 0
        }]
    };
}


const Technology = ({ globalAlert, id }) => {
    const [data, setData] = useState({})
    useEffect(() => {
        let requestData = `assId=${id}`;
        getAssessmentReportTechnologyUse(requestData).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setData(res.result);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }, [id, globalAlert]);
    return (
        <>
            <h4>Assessment : {data?.assessmentName}</h4>
            <Row>
                <Col xs={12} md={6} lg={6} xl={6} className="mx-auto" style={{ maxWidth: "350px" }}>
                    {!(data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) &&
                        <ChartJs counter={2} type='doughnut' data={createDataObject(data)}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: `Technology Use`
                                    },
                                    legend: {
                                        position: 'top',
                                        labels:{
                                            usePointStyle: true,
                                            pointStyle: 'rect'
                                        },
                                        align:'start'
                                    }
                                }
                            }}
                        />}
                </Col>
            </Row>
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Technology);