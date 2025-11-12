import React from "react";
import { Table } from "reactstrap";
import { dateFormatDashboard } from "../../assets/commonFunctions";

const Surveys = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">Surveys</p>
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
                        {moduleDetails?.surveyList?.length > 0 ? moduleDetails?.surveyList?.map((item) => {
                            return (
                                <tr key={item.sryId}>
                                    <td><span><p className="m-0 text-red table-content"><u>{item?.sryName}</u></p><p className="m-0 email-subheading table-content">{dateFormatDashboard(item?.sryCreatedDate)}</p></span></td>
                                    <td>{item?.totalQuestion}</td>
                                    <td>{item?.totalResponses}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={3}>No Survey Campaigns Found</td></tr>}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Surveys