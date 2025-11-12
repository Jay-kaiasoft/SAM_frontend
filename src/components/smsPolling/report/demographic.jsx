import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Col, Row} from "reactstrap";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import ChartJs from "../../shared/chartJsComponent/chartJs";
import {getSmsPollingReportDemographic} from "../../../services/smsPollingService";
import {createDataObject, createOptionsObject} from "../../shared/chartJsComponent/utilityCountry";

const Demographic = ({globalAlert, id})=>{
    const [data, setData] = useState({});
    useEffect(()=>{
        let requestData = `sid=${id}`;
        getSmsPollingReportDemographic(requestData).then(res => {
            if(res.status === 200){
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
    },[id, globalAlert]);
    return (
        <>
            <h4>SMS Polling : {data.smsPolling}</h4>
            <Row>
                <Col xs={12} md={6} lg={6} xl={6} className="mx-auto" style={{maxWidth:"350px"}}>
                    {!(data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) && <ChartJs counter={1} type='doughnutWithPercentage' data={createDataObject('doughnutWithPercentage',data)} options={createOptionsObject('doughnutWithPercentage',data)}/>}
                </Col>
            </Row>
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
export default connect(null,mapDispatchToProps)(Demographic);