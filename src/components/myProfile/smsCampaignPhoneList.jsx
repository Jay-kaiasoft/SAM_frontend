import React, { useState } from 'react';
import { Switch } from '@mui/material';
import {Table} from "reactstrap";

const SmsCampaignPhoneList = ({smsCampaignPhoneList, handleSmsCampaignPhoneListCollaplse, handleDeleteSmsCampaignNumber, user, subUser, setToggleBuyTwilioNo, smsCampaignReleasePhoneList, handleSmsCampaignReleasePhoneListCollaplse, handleClickSwitchToConversation, handleClickForwardCallSwitch, checkCollapse}) => {
    const [clickCollaplse, setClickCollaplse] = useState([]);
    const [clickReleaseCollaplse, setClickReleaseCollaplse] = useState([]);
    const handleClickCollaplse = (position) => {
        setClickCollaplse((prev)=>{
            prev.includes(position) ?
                prev=prev.filter((x)=> x !== position)
            :
                prev.push(position)
            return prev;
        });
    }
    const handleClickTD = (isMaster, position) => {
        if(isMaster && smsCampaignPhoneList?.smsCampaignsPhoneList?.[position + 1]?.isMaster === false){
            handleSmsCampaignPhoneListCollaplse(position);
            handleClickCollaplse(position);
        }
    }
    const handleClickReleaseCollaplse = (position) => {
        setClickReleaseCollaplse((prev)=>{
            prev.includes(position) ?
                prev=prev.filter((x)=> x !== position)
            :
                prev.push(position)
            return prev;
        });
    }
    const handleClickReleaseTD = (isMaster, position) => {
        if(isMaster && smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.[position + 1]?.isMaster === false){
            handleSmsCampaignReleasePhoneListCollaplse(position);
            handleClickReleaseCollaplse(position);
        }
    }
    return (
        <>
            <p>Used Number List</p>
            <div className="table-content-wrapper">
                <Table striped>
                    <thead>
                        <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                            <td width="5%"></td>
                            <td width="10%">Phone Number</td>
                            <td>Name</td>
                            <td width="10%">Forward Call</td>
                            <td width="10%">Forward Number</td>
                            <td width="10%">Status</td>
                            <td width="12%" align="center">Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        smsCampaignPhoneList?.btnChangeDelete === "Y" ? 
                            <tr>
                                <td></td>
                                <td>{smsCampaignPhoneList.twilioNumber}</td>
                                <td></td>
                                <td>
                                    <div className="d-flex align-items-center" style={{marginTop:"-7px", marginBottom:"-7px"}}>
                                        Off<Switch color="primary" inputProps={{style:{"position":"absolute"}}} checked={smsCampaignPhoneList.numberCallForwarding !== null} onChange={(e)=>{handleClickForwardCallSwitch(e.target.checked, smsCampaignPhoneList?.numberCallForwarding, smsCampaignPhoneList.fromContact, smsCampaignPhoneList.scmNumberPhoneSid);}} />On
                                    </div>
                                </td>
                                <td>
                                    {
                                        smsCampaignPhoneList?.numberCallForwarding !== null &&
                                        <div className="d-flex align-items-center justify-content-between">
                                            {smsCampaignPhoneList?.numberCallForwarding?.cfnForwardingNumber}
                                            <i className="far fa-pencil-alt" data-toggle="tooltip" title="Change" onClick={() => { handleClickForwardCallSwitch(true, smsCampaignPhoneList?.numberCallForwarding, smsCampaignPhoneList.fromContact, smsCampaignPhoneList.scmNumberPhoneSid); }}></i>
                                        </div>
                                    }
                                </td>
                                <td>{smsCampaignPhoneList.numberStatus}</td>
                                <td align="center">
                                    <div className="w-50 text-right">
                                        <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Change" onClick={() => { setToggleBuyTwilioNo() }}></i>
                                        <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={() => { handleDeleteSmsCampaignNumber(user.memberId, 0, smsCampaignPhoneList.twilioNumber) }}></i>
                                    </div>
                                </td>
                            </tr>
                        :
                            null
                    }
                    {
                        smsCampaignPhoneList?.smsCampaignsPhoneList?.length > 0 ?
                            smsCampaignPhoneList?.smsCampaignsPhoneList?.map((item) => {
                                return (
                                    <tr hidden={item.smsDisplay === "Y" ? false : true} key={item.position}>
                                        <td
                                            onClick={() => { handleClickTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignPhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                            align="center"
                                        >
                                            {checkCollapse(item.isMaster, smsCampaignPhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) &&<i className={clickCollaplse.includes(item.position) ? "far fa-angle-up" : "far fa-angle-down"}></i>}
                                        </td>
                                        <td
                                            onClick={() => { handleClickTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignPhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.isMaster && item.fromContact}
                                        </td>
                                        <td
                                            onClick={() => { handleClickTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignPhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.smsName}
                                        </td>
                                        <td>
                                            {item.isMaster && 
                                                <div className="d-flex align-items-center" style={{marginTop:"-7px", marginBottom:"-7px"}}>
                                                    Off<Switch color="primary" inputProps={{style:{"position":"absolute"}}} checked={item.numberCallForwarding !== null} onChange={(e)=>{handleClickForwardCallSwitch(e.target.checked, item?.numberCallForwarding, item.fromContact, item.scmNumberPhoneSid);}} />On
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {
                                                item?.numberCallForwarding !== null &&
                                                <div className="d-flex align-items-center justify-content-between">
                                                    {item?.numberCallForwarding?.cfnForwardingNumber}
                                                    <i className="far fa-pencil-alt" data-toggle="tooltip" title="Change" onClick={() => { handleClickForwardCallSwitch(true, item?.numberCallForwarding, item.fromContact, item.scmNumberPhoneSid); }}></i>
                                                </div>
                                            }
                                        </td>
                                        <td
                                            onClick={() => { handleClickTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignPhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.numberStatus !== null ? item.numberStatus : ""}
                                        </td>
                                        <td align="center">
                                            <div className="w-50 text-right">
                                                {(item.isMaster && user?.conversationsTwilioNumber?.replaceAll("+","") !== item?.fromContact?.replaceAll("+","")) && <i className="far fa-exchange mr-3" data-toggle="tooltip" title="Switch to SMS Conversation" onClick={()=>{handleClickSwitchToConversation(item.fromContact,item.scmNumberPhoneSid)}}></i>}
                                                {item.btnChange === "Y" && <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Change" onClick={() => { setToggleBuyTwilioNo() }}></i>}
                                                {item.btnDelete === "Y" && <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={() => { handleDeleteSmsCampaignNumber(user.memberId, item.scdSmsId, item.fromContact) }}></i>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        :
                            <tr>
                                <td colSpan={7} align="center">No phone number found.</td>
                            </tr>
                    }
                    </tbody>
                </Table>
            </div>
            <p className="mt-5">Released Number Log</p>
            <div className="table-content-wrapper">
                <Table striped>
                    <thead>
                    <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                        <td width="5%"></td>
                        <td width="15%">Phone Number</td>
                        <td>Name</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.length > 0 ?
                            smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.map((item) => {
                                return (
                                    <tr hidden={item.smsDisplay === "Y" ? false : true} key={item.position}>
                                        <td
                                            onClick={() => { handleClickReleaseTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                            align="center"
                                        >
                                            {checkCollapse(item.isMaster, smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) &&<i className={clickReleaseCollaplse.includes(item.position) ? "far fa-angle-up" : "far fa-angle-down"}></i>}
                                        </td>
                                        <td
                                            onClick={() => { handleClickReleaseTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.isMaster && item.fromContact}
                                        </td>
                                        <td
                                            onClick={() => { handleClickReleaseTD(item.isMaster, item.position); }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsCampaignReleasePhoneList?.smsCampaignsPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.smsName}
                                        </td>
                                    </tr>
                                )
                            })
                        :
                            <tr>
                                <td colSpan={3} align="center">No phone number found.</td>
                            </tr>
                    }
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default SmsCampaignPhoneList;