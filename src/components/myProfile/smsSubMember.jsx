import React from 'react';
import {Col, Row} from "reactstrap";
import SmsCampaignPhoneList from "./smsCampaignPhoneList";

const SmsSubMember = ({smsCampaignPhoneList, handleSmsCampaignPhoneListCollaplse, handleDeleteSmsCampaignNumber, user, setToggleBuyTwilioNo, smsCampaignReleasePhoneList, handleSmsCampaignReleasePhoneListCollaplse, handleClickSwitchToConversation}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className='text-center mt-5'>SMS</h3>
            </Col>
            <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                <SmsCampaignPhoneList smsCampaignPhoneList={smsCampaignPhoneList} handleSmsCampaignPhoneListCollaplse={handleSmsCampaignPhoneListCollaplse} handleDeleteSmsCampaignNumber={handleDeleteSmsCampaignNumber} user={user} setToggleBuyTwilioNo={setToggleBuyTwilioNo} smsCampaignReleasePhoneList={smsCampaignReleasePhoneList} handleSmsCampaignReleasePhoneListCollaplse={handleSmsCampaignReleasePhoneListCollaplse} handleClickSwitchToConversation={handleClickSwitchToConversation} />
            </Col>
        </Row>
    );
}

export default SmsSubMember;