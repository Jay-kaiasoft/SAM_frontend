import React, { useEffect, useState } from 'react';
import { Col, Row } from "reactstrap";
import CheckPermissionButton from "../shared/commonControlls/checkPermissionButton";
import history from '../../history';
import { Link } from '@mui/material';
import { deleteSmsTemplate, getSmsTemplateList } from '../../services/myDesktopService';
import { connect } from 'react-redux';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { setConfirmDialogAction } from '../../actions/confirmDialogActions';

const SmsTemplates = ({
    confirmDialog,
    globalAlert
}) => {
    const [smsTemplateList, setSmsTemplateList] = useState([])

    useEffect(() => {
        getSmsTemplateList().then(res => {
            if (res?.status === 200) {
                setSmsTemplateList(res?.result?.smsTemplateList)
            }
        })
    }, [])

    const handleDelete = (id) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this SMS template?',
            onConfirm: () => {
                deleteSmsTemplate(id).then(res => {
                    if (res.status === 200) {
                        globalAlert({
                            open: true,
                            type: "Success",
                            text: res.message
                        })
                        getSmsTemplateList().then(res => {
                            if (res?.status === 200) {
                                setSmsTemplateList(res?.result?.smsTemplateList)
                            }
                        })
                    } else {
                        globalAlert({
                            open: true,
                            type: "Error",
                            text: res.message
                        })
                    }
                })
            }
        })
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className='d-inline-block mb-0 align-middle'>SMS Templates</h3>
                <div className="icon-wrapper d-inline-block mx-5">
                    <CheckPermissionButton module="custom form" action="add">
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={() => { history.push("/buildsmstemplate") }}>
                            <i className="far fa-plus-square"></i>
                            <div className="bg-green"></div>
                        </Link>
                    </CheckPermissionButton>
                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text">
                        <i className="far fa-question-circle"></i>
                        <div className="bg-grey"></div>
                    </Link>
                </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div>
                    {
                        smsTemplateList?.map((item) => {
                            return (
                                <div className="sms-main-box" key={item.sstId}>
                                    <div className="sms-bg">
                                        <div className="sms-text">
                                            {item.sstDetails}
                                        </div>
                                    </div>
                                    <div className="card-sms-body">
                                        <div className="card-title">{item.sstName}</div>
                                        <div className="card-content">
                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Edit" onClick={() => { history.push(`/buildsmstemplate?v=${item.sstId}`) }}></i>
                                            {(item.sstName !== "Opt In" && item.sstName !== "Opt Out" && item.sstName !== "Rejoin Group") && <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={() => handleDelete(item.sstId)}></i>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Col>
        </Row>
    );
}


const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmsTemplates);