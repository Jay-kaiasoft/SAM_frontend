import React from "react";
import {connect} from "react-redux";
import {Col, Row, FormGroup} from "reactstrap";
import {Button} from "@mui/material";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {dateFormat} from "../../assets/commonFunctions";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {publishAndConfirm, saveAndConfirm} from "../../services/smsPollingService";
import history from "../../history";
import {setPendingTransactionAction} from "../../actions/pendingTransactionActions";
import $ from "jquery";

const Confirmation = ({
    data,
    handleBack,
    handleDataChange,
    user,
    subUser,
    globalAlert,
    pendingTransaction
}) => {
    let nd = new Date();
    nd = nd.setMonth(nd.getMonth()+1);
    const handleClickSave = () => {
        let requestData = {
            "iid": data.iid,
            "subMemberId": subUser.memberId,
            "dpublishDate": data.dpublishDate,
            "rndHash": data.rndHash
        }
        $("button.saveClick").hide();
        $("button.saveClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
        saveAndConfirm(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/managesmspolling");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.saveClick").show();
        });
    }
    const handleClickPublish = () => {
        let requestData = {
            "iid": data.iid,
            "subMemberId": subUser.memberId,
            "dpublishDate": data.dpublishDate,
            "rndHash": data.rndHash
        }
        $("button.publishClick").hide();
        $("button.publishClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
        publishAndConfirm(requestData).then(res => {
            if (res.status === 200) {
                if(res.result.location === "paymentProfile"){
                    pendingTransaction([{
                        ...requestData,
                        "pendingTransactionType": "publishSmsPolling"
                    }]);
                    history.push("/carddetails");
                } else {
                    globalAlert({
                        type: "Success",
                        text: res.message,
                        open: true
                    });
                    history.push("/managesmspolling");
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.publishClick").show();
        });
    }
    return (
        <>
            <div>
                <Row>
                    <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto" align="left">
                        <p><strong>Confirmation</strong></p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto" align="left">
                        <div>
                            <p><strong>Name :</strong>{`${data.vheading}`}</p>
                            <p><strong>Description :</strong>{`${data.tdetail}`}</p>
                            <FormGroup className='mb-4'>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={new Date(data?.dpublishDate) || new Date(nd)}
                                        label="Poll Close Date (MM/DD/YYYY)"
                                        inputFormat="MM/dd/yyyy"
                                        onChange={(Value) => {
                                            handleDataChange("dpublishDate", dateFormat(Value))
                                        }}
                                        slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                        minDate={new Date()}
                                    />
                                </LocalizationProvider>
                            </FormGroup>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col align="center">
                        <div className="col-12 mt-3 mb-3" align="center">
                            <Button color="primary" variant="contained" onClick={() => handleBack(1)}>
                                <i className="far fa-long-arrow-left mr-2"></i>BACK
                            </Button>
                            <Button color="primary" variant="contained" className="ml-3 saveClick" onClick={() => handleClickSave()}>
                                <i className="far fa-save mr-2"></i>SAVE AND DRAFT
                            </Button>
                            <Button color="primary" variant="contained" className="ml-3 publishClick" onClick={() => handleClickPublish()}>
                                <i className="far fa-envelope-open-text mr-2"></i>SAVE AND PUBLISH
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        pendingTransaction: (data) => {dispatch(setPendingTransactionAction(data))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);