import { Switch } from "@mui/material";
import React from "react";
import { Table } from "reactstrap";

const SmsConversation = ({
    user,
    numberStatus,
    defaultConversationsTwilioNumber,
    setToggleBuyTwilioNo = () => { },
    handleClickSwitchToCampaign = () => { },
    handleDeleteSmsConversationsNumber = () => { },
    handleClickForwardCallSwitch = () => {},
    conversationsTwilioNumber
}) => {
    
    return (
        <div className="table-content-wrapper">
            <Table striped>
                <thead>
                    <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                        <td>Phone Number</td>
                        <td width="15%">Forward Call</td>
                        <td width="15%">Forward Number</td>
                        <td width="15%">Status</td>
                        <td width="10%" align="center">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        typeof user.conversationsTwilioNumber !== "undefined" && user.conversationsTwilioNumber !== "" && user.conversationsTwilioNumber !== null ?
                            <tr>
                                <td>{user.conversationsTwilioNumber}</td>
                                <td>
                                    <div className="d-flex align-items-center" style={{marginTop:"-7px", marginBottom:"-7px"}}>
                                        Off<Switch color="primary" inputProps={{style:{"position":"absolute"}}} checked={conversationsTwilioNumber.numberCallForwarding !== null} onChange={(e)=>{handleClickForwardCallSwitch(e.target.checked, conversationsTwilioNumber?.numberCallForwarding, user.conversationsTwilioNumber, conversationsTwilioNumber.cfnTwilioPhoneSid);}} />On
                                    </div>
                                </td>
                                <td>
                                    {
                                        conversationsTwilioNumber?.numberCallForwarding !== null &&
                                        <div className="d-flex align-items-center justify-content-between">
                                            {conversationsTwilioNumber?.numberCallForwarding?.cfnForwardingNumber}
                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Change" onClick={() => { handleClickForwardCallSwitch(true, conversationsTwilioNumber?.numberCallForwarding, user.conversationsTwilioNumber, conversationsTwilioNumber.cfnTwilioPhoneSid); }}></i>
                                        </div>
                                    }
                                </td>
                                <td>{numberStatus}</td>
                                <td align="center">
                                    <i className="far fa-exchange mr-3" data-toggle="tooltip" title="Switch to SMS Campaign" onClick={() => { handleClickSwitchToCampaign() }}></i>
                                    <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Change" onClick={() => { setToggleBuyTwilioNo() }}></i>
                                    <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={() => { handleDeleteSmsConversationsNumber() }}></i>
                                </td>
                            </tr>
                        :
                            typeof defaultConversationsTwilioNumber.defaultConversationsTwilioNumber !== "undefined" && defaultConversationsTwilioNumber.defaultConversationsTwilioNumber !== "" && defaultConversationsTwilioNumber.defaultConversationsTwilioNumber !== null ?
                                <tr>
                                    <td>{defaultConversationsTwilioNumber.defaultConversationsTwilioNumber}</td>
                                    <td>
                                        <div className="d-flex align-items-center" style={{marginTop:"-7px", marginBottom:"-7px"}}>
                                            Off<Switch color="primary" inputProps={{style:{"position":"absolute"}}} checked={defaultConversationsTwilioNumber.numberCallForwarding !== null} onChange={(e)=>{handleClickForwardCallSwitch(e.target.checked, defaultConversationsTwilioNumber?.numberCallForwarding, defaultConversationsTwilioNumber.defaultConversationsTwilioNumber, defaultConversationsTwilioNumber.defaultConversationsSubAccountPhoneSId);}} />On
                                        </div>
                                    </td>
                                    <td>
                                        {
                                            defaultConversationsTwilioNumber?.numberCallForwarding !== null &&
                                            <div className="d-flex align-items-center justify-content-between">
                                                {defaultConversationsTwilioNumber?.numberCallForwarding?.cfnForwardingNumber}
                                                <i className="far fa-pencil-alt" data-toggle="tooltip" title="Change" onClick={() => { handleClickForwardCallSwitch(true, defaultConversationsTwilioNumber?.numberCallForwarding, defaultConversationsTwilioNumber.defaultConversationsTwilioNumber, defaultConversationsTwilioNumber.defaultConversationsSubAccountPhoneSId); }}></i>
                                            </div>
                                        }
                                    </td>
                                    <td>{numberStatus}</td>
                                    <td align="center"></td>
                                </tr>
                            :
                                <tr>
                                    <td colSpan={5} align="center">No phone number found.</td>
                                </tr>
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default SmsConversation