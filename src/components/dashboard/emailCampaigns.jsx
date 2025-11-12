import React from "react";
import { Table } from "reactstrap";
import { deteTimeFormatDashboard } from "../../assets/commonFunctions";

const EmailCampaigns = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">Email Campaigns</p>
            <div className="table-conntainer">
                <Table borderless striped>
                    <thead>
                        <tr>
                            <th></th>
                            <th>SENT</th>
                            <th>OPENED</th>
                            <th>CLICKS</th>
                            <th>BOUNCES</th>
                            <th>UNSUBS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleDetails?.emailCampaigns?.length > 0 ? moduleDetails?.emailCampaigns?.map((item) => {
                            return (
                                <tr key={item.campId}>
                                    <td><span><p className="m-0 text-red table-content"><u>{item?.campName}</u></p><p className="m-0 email-subheading table-content">{deteTimeFormatDashboard(item?.sendOnDate)}</p></span></td>
                                    <td>{item?.totalSent}</td>
                                    <td><p className="m-0">{item?.totalOpened}</p><p className="m-0">{`${item?.totalOpenedPercentage}%`}</p></td>
                                    <td><p className="m-0">{item?.totalClicks}</p><p className="m-0">{`${item?.totalClicksPercentage}%`}</p></td>
                                    <td>{item?.totalBounce}</td>
                                    <td>{item?.totalUnsubscription}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={6}>No Email Campaigns Found</td></tr>}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default EmailCampaigns