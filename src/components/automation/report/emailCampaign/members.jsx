import React, { useState, useEffect, useCallback, Fragment } from "react"
import { Col, Row, Table } from "reactstrap";
import {dateTimeFormat, tableToExcel} from "../../../../assets/commonFunctions";
import { Link } from "@mui/material";
import { getAutomationReportMemberClick, getAutomationReportMembersList, getAutomationReportMembersListPage } from "../../../../services/automationService";
import MembersTable from "../../../emailCampaign/report/membersTable";

const Members = ({ memberData, globalAlert }) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="text-center mb-3">{memberData?.campaignDetails?.name}</h3>
                <Member id={memberData?.campaignDetails?.campSendId} globalAlert={globalAlert} />
                {
                    memberData?.conditionDetails?.length > 0 ?
                        memberData?.conditionDetails?.map((value,index)=>(
                            <Fragment key={index}>
                                <hr className="my-4"/>
                                <h5 className="text-center">Condition : {value.conditionType}</h5>
                                <div className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.yes.oldMypage} = Yes </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.yes.sendMypage}</p>
                                </div>
                                <Member id={value.yes?.campSendId === null ? 0 : value.yes?.campSendId} globalAlert={globalAlert} />
                                <div  className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.no.oldMypage} = No </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.no.sendMypage}</p>
                                </div>
                                <Member id={value.no?.campSendId === null ? 0 : value.no?.campSendId} globalAlert={globalAlert} />
                            </Fragment>
                        ))
                    : null
                }
            </Col>
        </Row>
    );
}

const Member = ({ id, globalAlert }) => {
    const [view, setView] = useState("table")
    const [memberSelected, setMemberSelected] = useState(null)
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [membersData, setMembersData] = useState([])
    const [memberClickData, setMemberClickData] = useState([])
    const [callbackAttributes, setCallbackAttributes] = useState({
        searchSend: "",
        perPage: "25",
        selectedPage: "0",
        sort: "firstName,asc"
    })

    const displayMembersList = useCallback(() => {
        const { searchSend, selectedPage, perPage, sort } = callbackAttributes
        let data = `csId=${id}&searchKey=${searchSend}&page=${selectedPage}&size=${perPage}&sort=${sort}`;
        setMembersData([]);
        setTotalPages(1);
        setTotalData(0);
        if(id !== 0){
            getAutomationReportMembersListPage(data).then(res => {
                if (res.status === 200) {
                    if (res.result) {
                        setMembersData(res?.result?.automationReportMembers);
                        setTotalPages(res?.result?.getTotalPages);
                        setTotalData(res?.result?.totalCampaignsSendEmail);
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
    }, [callbackAttributes, globalAlert, id]);

    useEffect(() => {
        displayMembersList();
    }, [displayMembersList, callbackAttributes]);

    const handleMemberSelect = (index, emailid) => {
        setMemberSelected(index)
        const data = `csId=${id}&emailId=${emailid}`
        getAutomationReportMemberClick(data).then(res=>{
            if(res?.status===200){
                setMemberClickData(res?.result)
            }
        })
    }
    const handleClickExportToExcel = (type) => {
        if(type === "") {
            getAutomationReportMembersList(id).then(res => {
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
    }
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                {view === "table" ?
                    <MembersTable
                        membersData={membersData}
                        setCallbackAttributes={setCallbackAttributes}
                        totalData={totalData}
                        totalPages={totalPages}
                        setView={setView}
                        type=""
                        handleClickExportToExcel={handleClickExportToExcel}
                        showViewChangeButtons={true}
                    /> :
                    <div>
                    <div>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Export Member To Excel" onClick={()=>{handleClickExportToExcel("")}}>
                            <i className="far fa-file-excel"></i>
                            <div className="bg-green"></div>
                        </Link>
                        <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="List View" onClick={() => { setView("table") }}>
                            <i className="far fa-list"></i>
                            <div className="bg-dark-grey"></div>
                        </Link>
                        <Link component="a" className="btn-circle ml-2" data-toggle="tooltip" title="Grid View" onClick={() => { setView("grid") }}>
                            <i className="far fa-border-all"></i>
                            <div className="bg-dark-grey"></div>
                        </Link>
                    </div>
                        <div className="d-flex flex-row w-100 mt-2">
                        <div className="d-flex flex-column w-25">
                            {membersData?.map((member, index) => {
                                return (
                                    <div key={index}
                                        style={{ backgroundColor: `${memberSelected === index ? "#F7F7F7" : ""}` }}
                                        className="d-flex border rounded p-3 mb-2 cursor-pointer"
                                        onClick={() => { handleMemberSelect(index, member?.emailId) }}
                                    >
                                        <div className="box-round">{member?.firstName?.charAt(0)}{member?.lastName?.charAt(0)}</div>
                                        <div className="d-flex flex-column ml-2">
                                            <span>{`${member?.firstName} ${member?.lastName}`}</span>
                                            <span>{member?.email}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-75">
                            {memberSelected !== null ?
                                <div className="d-flex flex-column border ml-3 px-3 py-2">
                                    <span>Total Email Open : {memberClickData?.totalEmailOpen}</span>
                                    <span className="mt-2"><b>Product Links</b></span>
                                    <div className="table-content-wrapper mt-1">
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th width="80%" align="left">Link</th>
                                                    <th width="20%" className="text-center">Link Clicked</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    memberClickData?.productLinks?.length > 0 ?
                                                        memberClickData?.productLinks?.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{value?.link}</td>
                                                                    <td align="center">{value?.linkClicked}</td>
                                                                </tr>
                                                            );
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan={6} className="text-center">No Data Found.</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <span className="mt-2"><b>Technology</b></span>
                                    <div className="table-content-wrapper mt-1">
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th width="60%" align="left">Link</th>
                                                    <th width="20%" className="text-center">Mobile</th>
                                                    <th width="20%" className="text-center">Desktop</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    memberClickData?.technology?.length > 0 ?
                                                        memberClickData?.technology?.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{value?.campLink}</td>
                                                                    <td align="center">{value?.mobile}</td>
                                                                    <td align="center">{value?.pc}</td>
                                                                </tr>
                                                            );
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan={6} className="text-center">No Data Found.</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <span className="mt-2"><b>Location</b></span>
                                    <div className="table-content-wrapper mt-1">
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th width="10%">No</th>
                                                    <th width="40%" align="left">Link</th>
                                                    <th width="15%" align="left">Locations</th>
                                                    <th width="15%" align="left">Date</th>
                                                    <th width="20%" className="text-center">Browser</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    memberClickData?.location?.length > 0 ?
                                                    memberClickData?.location?.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{value?.link}</td>
                                                                    <td>{value?.location}</td>
                                                                    <td align="center">{dateTimeFormat(value?.date)}</td>
                                                                    <td align="center">{value?.browser}</td>
                                                                </tr>
                                                            );
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan={6} className="text-center">No Data Found.</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div> :
                                <div className="d-flex ml-3 px-3 py-2 justify-content-center">
                                    <span className="mt-3">Click member for more details...</span>
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                }
            </Col>
        </Row>
    )
}

export default Members;