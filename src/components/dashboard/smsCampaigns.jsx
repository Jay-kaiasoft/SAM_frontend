import React from "react";
import { Table } from "reactstrap";
import { deteTimeFormatDashboard } from "../../assets/commonFunctions";

const SmsCampaigns = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">SMS Campaigns</p>
            <div className="table-conntainer">
                <Table borderless striped>
                    <thead>
                        <tr>
                            <th></th>
                            <th>SENT</th>
                            <th>NOT SENT</th>
                            <th>DELIVERED</th>
                            <th>UNDELIVERED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleDetails?.smsCampaigns?.length > 0 ? moduleDetails?.smsCampaigns?.map((item) => {
                            return (
                                <tr key={item.smsId}>
                                    <td><span><p className="m-0 text-red table-content"><u>{item?.smsName}</u></p><p className="m-0 email-subheading table-content">{deteTimeFormatDashboard(item?.sendOnDate)}</p></span></td>
                                    <td>{item?.totalSent}</td>
                                    <td>{item?.totalNotSent}</td>
                                    <td>{item?.totalDelivered}</td>
                                    <td>{item?.totalUndelivered}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={5}>No SMS Campaigns Found</td></tr>}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default SmsCampaigns