import React, { Fragment, useEffect } from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { Button, Checkbox, FormControlLabel, Switch } from '@mui/material';
import { getcommunicationpreferencestab, updateSmsConversationYn, updateSmsCvrMyphoneYn } from '../../services/profileService.js'
import { updateCommunicationPref } from '../../actions/userActions.js';
import { parentCompanyTitle, websiteTitle } from '../../config/api.js';

const CommunicationPreferences = (props) => {
    const { user } = props
    const [updateSupport, setUpdateSupport] = React.useState(false);
    const [updatePromotion, setUpdatePromotion] = React.useState(false);
    const [promotionEAS, setPromotionEAS] = React.useState(false);
    const [performance, setPerformance] = React.useState(false);
    const [smsConversationYn, setSmsConversationYn] = React.useState(false);
    const [smsCvrMyphoneYn, setSmsCvrMyphoneYn] = React.useState(false);

    const handleChange = (event) => {
        if (event.target.name === "updateSupport") {
            setUpdateSupport(event.target.checked);
        } else if (event.target.name === "updatePromotion") {
            setUpdatePromotion(event.target.checked);
        } else if (event.target.name === "promotionEAS") {
            setPromotionEAS(event.target.checked);
        } else if (event.target.name === "performance") {
            setPerformance(event.target.checked);
        } else if(event.target.name === "smsConversationYn") {
            let onOff = event.target.checked?"Y":"N";
            updateSmsConversationYn(onOff).then(res=>{
                if(res.status === 200) {
                    setSmsConversationYn(!smsConversationYn);
                }
            });
        } else if(event.target.name === "smsCvrMyphoneYn") {
            let onOff = event.target.checked?"Y":"N";
            updateSmsCvrMyphoneYn(onOff).then(res=>{
                if(res.status === 200) {
                    setSmsCvrMyphoneYn(!smsCvrMyphoneYn);
                }
            });
        }
    };

    useEffect(() => {
        getcommunicationpreferencestab().then(res => {
            if(res.status === 200) {
                if (res.result.member.updateSupport === 1) {
                    setUpdateSupport(true);
                }
                if (res.result.member.updatePromotion === 1) {
                    setUpdatePromotion(true);
                }
                if (res.result.member.promotionEAS === 1) {
                    setPromotionEAS(true);
                }
                if (res.result.member.performance === 1) {
                    setPerformance(true);
                }
                if (res.result.member.smsConversationYn === "Y") {
                    setSmsConversationYn(true);
                }
                if (res.result.member.smsCvrMyphoneYn === "Y") {
                    setSmsCvrMyphoneYn(true);
                }
            }
        })
    }, [])

    const submitForm = (e) => {
        e.preventDefault();
        let RequestData = {
            ...user,
            "memberId": user.memberId,
            "updateSupport": updateSupport === true ? Number(1) : Number(0),
            "updatePromotion": updatePromotion === true ? Number(1) : Number(0),
            "promotionEAS": promotionEAS === true ? Number(1) : Number(0),
            "performance": performance === true ? Number(1) : Number(0)
        }
        props.setCommunicationPreferences(RequestData);
    }

    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>Communication Preferences</h3>
                </Col>
            </Row>

            <Form onSubmit={submitForm} className="pt-2">
                <Row >
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <FormGroup className='mb-2'>
                            <FormControlLabel
                                control={<Checkbox checked={updateSupport} color="primary" onChange={handleChange} name="updateSupport" />}
                                label="Tell me about Feature Updates and Support Issues"
                            />
                        </FormGroup>
                        <FormGroup hidden={true}>
                            <FormControlLabel
                                control={<Checkbox checked={updatePromotion} color="primary" onChange={handleChange} name="updatePromotion" />}
                                label={`Tell me about Updates and Promotions from ${parentCompanyTitle} parent company of ${websiteTitle}`}
                                hidden={true}
                            />
                        </FormGroup>
                        <FormGroup hidden={true}>
                            <FormControlLabel
                                control={<Checkbox checked={promotionEAS} color="primary" onChange={handleChange} name="promotionEAS" />}
                                label={`Tell me about Promotions on ${websiteTitle}`}
                                hidden={true}
                            />
                        </FormGroup>
                        <FormGroup hidden={true}>
                            <FormControlLabel
                                control={<Checkbox checked={performance} color="primary" onChange={handleChange} name="performance" />}
                                label="Give me analytics about the performance of my email blasts and surveys"
                                hidden={true}
                            />
                        </FormGroup>
                        <Button type="submit" variant="contained" className="mb-2" color="primary">UPDATE</Button>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    {/* <div className='d-flex mb-1'>
                        <h6 className="w-50 d-flex align-items-center m-0">Email me upon receipt of SMS reply</h6>
                        <div>
                            Off<Switch color="primary" checked={smsConversationYn} onChange={handleChange} name='smsConversationYn' />On
                        </div>
                    </div> */}
                    <div className='d-flex'>
                        <h6 className="w-50 d-flex align-items-center m-0">Forward SMS Replies to My Cell Phone</h6>
                        <div>
                            Off<Switch color="primary" checked={smsCvrMyphoneYn} onChange={handleChange} name='smsCvrMyphoneYn' />On
                        </div>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setCommunicationPreferences: (data) => {
            dispatch(updateCommunicationPref(data))
        }
    }
}

const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationPreferences);