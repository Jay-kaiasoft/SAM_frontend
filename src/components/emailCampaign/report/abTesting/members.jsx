import React, { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Col, Row } from "reactstrap"
import { setGlobalAlertAction } from "../../../../actions/globalAlertActions"
import {getEmailCampaignsReportMembersBListPageAB, getEmailCampaignsReportMembersListAB, getEmailCampaignsReportMembersListPageAB, getEmailCampaignsReportMembersOListPageAB} from "../../../../services/emailCampaignService"
import MembersTable from "../membersTable"
import {dateTimeFormat, tableToExcel} from "../../../../assets/commonFunctions";

const Members = ({
    id,
    campId,
    globalAlert
}) => {
    const [viewSelected, setViewSelected] = useState(0)
    const [callbackAttributesA, setCallbackAttributesA] = useState({
        searchSend: "",
        perPage: "25",
        selectedPage: "0",
        sort: "firstName,asc"
    })
    const [totalPagesA, setTotalPagesA] = useState(0)
    const [totalDataA, setTotalDataA] = useState(0)
    const [membersA, setMembersA] = useState([])
    const [callbackAttributesB, setCallbackAttributesB] = useState({
        searchSend: "",
        perPage: "25",
        selectedPage: "0",
        sort: "firstName,asc"
    })
    const [totalPagesB, setTotalPagesB] = useState(0)
    const [totalDataB, setTotalDataB] = useState(0)
    const [membersB, setMembersB] = useState([])
    const [callbackAttributesO, setCallbackAttributesO] = useState({
        searchSend: "",
        perPage: "25",
        selectedPage: "0",
        sort: "firstName,asc"
    })
    const [totalPagesO, setTotalPagesO] = useState(0)
    const [totalDataO, setTotalDataO] = useState(0)
    const [membersO, setMembersO] = useState([])

    const displayMembersListA = useCallback(() => {
        const { searchSend, selectedPage, perPage, sort } = callbackAttributesA
        let data = `id=${id}&campId=${campId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setMembersA([])
        getEmailCampaignsReportMembersListPageAB(data).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setMembersA(res?.result?.members);
                    setTotalPagesA(res?.result?.getTotalPages);
                    setTotalDataA(res?.result?.totalCampaignsSendEmail);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [callbackAttributesA, globalAlert, id, campId]);

    useEffect(() => {
        displayMembersListA();
    }, [displayMembersListA, callbackAttributesA]);

    const displayMembersListB = useCallback(() => {
        const { searchSend, selectedPage, perPage, sort } = callbackAttributesB
        let data = `id=${id}&campId=${campId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setMembersB([])
        getEmailCampaignsReportMembersBListPageAB(data).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setMembersB(res?.result?.membersB);
                    setTotalPagesB(res?.result?.getTotalPages);
                    setTotalDataB(res?.result?.totalCampaignsSendEmail);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [callbackAttributesB, globalAlert, id, campId]);

    useEffect(() => {
        displayMembersListB();
    }, [displayMembersListB, callbackAttributesB]);

    const displayMembersListO = useCallback(() => {
        const { searchSend, selectedPage, perPage, sort } = callbackAttributesO
        let data = `id=${id}&campId=${campId}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setMembersO([])
        getEmailCampaignsReportMembersOListPageAB(data).then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setMembersO(res?.result?.membersO);
                    setTotalPagesO(res?.result?.getTotalPages);
                    setTotalDataO(res?.result?.totalCampaignsSendEmail);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [callbackAttributesO, globalAlert, id, campId]);

    useEffect(() => {
        displayMembersListO();
    }, [displayMembersListO, callbackAttributesO]);

    const handleClickExportToExcel = (type) => {
        let requestData = `campId=${campId}&splitGroup=${type}`
        getEmailCampaignsReportMembersListAB(requestData).then(res => {
            if (res.status === 200) {
                if (res.result.members.length > 0) {
                    let table = `<table border="1">`;
                    table += `<thead>`;
                    table += `<tr>`;
                    table += `<th>No</th>`;
                    table += `<th>First Name</th>`;
                    table += `<th>Last Name</th>`;
                    table += `<th>Email</th>`;
                    table += `<th align="center">Total Open</th>`;
                    table += `<th align="center">Unsubscribe Date</th>`;
                    table += `</tr>`;
                    table += `</thead>`;
                    table += `<tbody>`;
                    res.result.members.forEach((value, index) => {
                        table += `<tr>`;
                        table += `<td>${index + 1}</td>`;
                        table += `<td>${value.firstName}</td>`;
                        table += `<td>${value.lastName}</td>`;
                        table += `<td>${value.email}</td>`;
                        table += `<td align="center">${value.totalOpen}</td>`;
                        table += `<td align="center">${value.unsubscribeDate === "" ? "-" : dateTimeFormat(value.unsubscribeDate)}</td>`;
                        table += `</tr>`;
                    });
                    table += `</tbody>`;
                    table += `</table>`;
                    tableToExcel(table, "Work Sheet 1", `${res.result.campName}.xls`.replaceAll(" ", "_"));
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }

    const renderViewSelected = () => {
        if (viewSelected === 0) {
            return (
                <Row className="border mx-0 p-3">
                    <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                        <div className="font-size-18 mb-2">For A</div>
                        <MembersTable
                            membersData={membersA}
                            totalData={totalDataA}
                            totalPages={totalPagesA}
                            setCallbackAttributes={setCallbackAttributesA}
                            type="A"
                            handleClickExportToExcel={handleClickExportToExcel}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                        <div className="font-size-18 mb-2">For B</div>
                        <MembersTable
                            membersData={membersB}
                            totalData={totalDataB}
                            totalPages={totalPagesB}
                            setCallbackAttributes={setCallbackAttributesB}
                            type="B"
                            handleClickExportToExcel={handleClickExportToExcel}
                        />
                    </Col>
                </Row>
            )
        } else if (viewSelected === 1) {
            return (
                <Row className="border mx-0 p-3">
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <MembersTable
                            membersData={membersO}
                            totalData={totalDataO}
                            totalPages={totalPagesO}
                            setCallbackAttributes={setCallbackAttributesO}
                            type="O"
                            handleClickExportToExcel={handleClickExportToExcel}
                        />
                    </Col>
                </Row>
            )
        }
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="d-flex flex-row">
                    <div className={`cursorPointer px-3 py-2 border border-bottom-0 ${viewSelected === 0 && "gray-background"}`} onClick={() => { setViewSelected(0) }}>Initial</div>
                    <div className={`cursorPointer px-3 py-2 border-top border-right ${viewSelected === 1 && "gray-background"}`} onClick={() => { setViewSelected(1) }}>Remain</div>
                </div>
                {renderViewSelected()}
            </Col>
        </Row>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(Members);