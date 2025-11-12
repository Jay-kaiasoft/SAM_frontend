import { Switch } from "@mui/material";
import React from "react";
import { Table } from "reactstrap";

const SmsPollPhoneList = ({
    smsPollingPhoneList,
    handleSmsPollingPhoneListCollapse = () => { },
    handleDeleteSmsPollingNumber = () => { },
    handleClickForwardCallSwitch = () => {},
    checkCollapse
}) => {
    return (
        <div className="table-content-wrapper">
            <Table striped>
                <thead>
                    <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                        <td width="15%">Phone Number</td>
                        <td>Name</td>
                        <td width="15%">Forward Call</td>
                        <td width="15%">Forward Number</td>
                        <td width="10%">Status</td>
                        <td width="10%" align="center">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        smsPollingPhoneList.length > 0 ?
                            smsPollingPhoneList?.map((item) => {
                                return (
                                    <tr key={item.iid} hidden={item.smsDisplay === "Y" ? false : true} >
                                        <td
                                            onClick={() => { handleSmsPollingPhoneListCollapse(item.position) }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsPollingPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.isMaster && item.vsmspollingNumber}
                                        </td>
                                        <td
                                            onClick={() => { handleSmsPollingPhoneListCollapse(item.position) }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsPollingPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.vheading}
                                        </td>
                                        <td>
                                            {(item.isMaster) &&
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
                                            onClick={() => { handleSmsPollingPhoneListCollapse(item.position) }}
                                            style={{ cursor: `${checkCollapse(item.isMaster, smsPollingPhoneList?.[item.position + 1]?.isMaster) ? "pointer" : ""}` }}
                                        >
                                            {item.numberStatus !== null ? item.numberStatus : ""}
                                        </td>
                                        <td align="center">
                                            {
                                                item.btnDelete === "Y" ?
                                                    <i className="far fa-trash-alt mr-3" data-toggle="tooltip" title="Delete" onClick={() => handleDeleteSmsPollingNumber(item.iid, item.vsmspollingNumber)}></i>
                                                :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={6} align="center">No phone number found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
        </div>
    )
}


export default SmsPollPhoneList