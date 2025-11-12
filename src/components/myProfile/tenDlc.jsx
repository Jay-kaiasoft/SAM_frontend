import { Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAll10DLCData } from "../../services/profileService";
import { Table } from "reactstrap";

const TenDlc = ({
    tenDLCPrice,
    tenDLCStatus,
    tenDLCValue,
    handleChangeTenDLC = () => { }
}) => {
    const [tenDLCData, setTenDLCData] = useState([]);
    useEffect(()=>{
        if(tenDLCStatus){
            getAll10DLCData().then(res => {
                if (res.status === 200) {
                    setTenDLCData(res.result.tenDLCData);
                }
            });
        }
    },[tenDLCStatus]);
    return (
        <>
            <h6>Highly Recommended</h6>
            <div className='d-flex'>
                <div className="d-flex pt-2">Enable 10DLC ATP Certification.<span className="cursor-pointer" data-toggle="tooltip" title={`10DLC Registration Charge ${tenDLCPrice}`}>&nbsp;(charges apply)</span></div>
                <div className="d-flex flex-column ml-3">
                    <div>
                        No<Switch color="primary" checked={tenDLCStatus} onChange={() => { handleChangeTenDLC() }} name='tenDLCStatus' disabled={tenDLCValue === "Processing"} />Yes
                    </div>
                    {
                        tenDLCValue === "Processing" ?
                            <div className="text-center">Processing</div>
                            : null
                    }
                </div>
            </div>
            { tenDLCData.length > 0 &&
                <div className="table-content-wrapper w-75 mt-5">
                    <Table striped>
                        <thead>
                            <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                                <td>Brand Name</td>
                                <td>Campaign Type</td>
                                <td width="10%">Status</td>
                                <td width="15%">Register Date</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tenDLCData.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{value.datBrandName	}</td>
                                            <td>{value.datCampaignType	}</td>
                                            <td>{value.datIsActive === "yes" ? "Active" : "Inactive"}</td>
                                            <td>{value.datRegistrationDate}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            }
        </>
    )
}

export default TenDlc