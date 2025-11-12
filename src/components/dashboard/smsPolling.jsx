import React from "react";
import { Table } from "reactstrap";
import { dateFormatDashboard } from "../../assets/commonFunctions";

const SmsPolling = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">SMS Polling</p>
            <div className="table-conntainer">
                <Table borderless striped>
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{ width: "20%" }}>TOTAL QUESTIONS</th>
                            <th style={{ width: "20%" }}>TOTAL RESPONSES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleDetails?.smsPolling?.length > 0 ? moduleDetails?.smsPolling?.map((item) => {
                            return (
                                <tr key={item.iid}>
                                    <td><span><p className="m-0 text-red table-content"><u>{item?.vheading}</u></p><p className="m-0 email-subheading table-content">{dateFormatDashboard(item?.createdDate)}</p></span></td>
                                    <td>{item?.totalQuestion}</td>
                                    <td>{item?.totalResponses}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={3}>No SMS Polling Found</td></tr>}

                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default SmsPolling