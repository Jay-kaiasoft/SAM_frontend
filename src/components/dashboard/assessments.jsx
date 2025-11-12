import React from "react";
import { dateFormatDashboard } from "../../assets/commonFunctions";
import { Table } from "reactstrap";

const Assessments = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">Assessments</p>
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
                        {moduleDetails?.assessmentList?.length > 0 ? moduleDetails?.assessmentList?.map((item) => {
                            return (
                                <tr key={item.assId}>
                                    <td><span><p className="m-0 text-red table-content"><u>{item?.assName}</u></p><p className="m-0 email-subheading table-content">{dateFormatDashboard(item?.assCreatedDate)}</p></span></td>
                                    <td>{item?.totalQuestion}</td>
                                    <td>{item?.totalResponses}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={3}>No Assessment Campaigns Found</td></tr>}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Assessments