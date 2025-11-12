import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import { getAssessmentReportDemographic } from "../../../services/assessmentService";
import ChartJs from "../../shared/chartJsComponent/chartJs";
import { CountryStateList, createDataObject, createOptionsObject } from "../../shared/chartJsComponent/utilityCountry";

const Demographic = ({ globalAlert, id }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let requestData = `assId=${id}`;
        getAssessmentReportDemographic(requestData).then(res => {
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
                    {!(data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) && <ChartJs counter={2} type='doughnut' data={createDataObject('doughnut', data)} options={createOptionsObject('doughnut', data)} />}
                </Col>
            </Row>
            {
                !(data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) &&
                    data.countrySecondList.length > 0 ?
                    data.countrySecondList.map((value, index) => (
                        <CountryStateList key={index} value={value} index={index} />
                    ))
                    : null
            }
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Demographic);