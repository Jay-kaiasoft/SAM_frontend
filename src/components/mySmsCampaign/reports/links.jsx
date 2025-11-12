import React, { useEffect, useState } from "react";
import { Row, Col, Table } from 'reactstrap';
import { getSmsCampaignsReportsLinksData } from "../../../services/smsCampaignService";
import LinkTraceReportModal from "./linkTraceReportModal";

const Links = ({ csId, smsId }) => {
    const [linksData, setLinksData] = useState([])
    const [linkModal, setLinkModal] = useState(false);
    const [sort, setSort] = useState("linkName,desc");
    const [sortBox, setSortBox] = useState([false]);
    const [encLinkId, setEncLinkId] = useState("")
    const toggleLinksModal = (encLinkId = "") => {
        setLinkModal((prevState) => (!prevState))
        setEncLinkId(encLinkId)
    }
    const handleClickSort = (name, index) => {
        if (sortBox[index] === true) {
            name += ",desc";
            const newSortBox = [...sortBox];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        } else {
            name += ",asc";
            const newSortBox = [];
            newSortBox[index] = !newSortBox[index];
            setSortBox(newSortBox);
        }
        setSort(name);
    }
    useEffect(() => {
        const data = `csId=${csId}&smsId=${smsId}&sort=${sort}`
        getSmsCampaignsReportsLinksData(data).then(res => {
            if (res?.status === 200) {
                setLinksData(res?.result?.linksData || [])
            }
        })
    }, [csId, smsId, sort])
    return (
        <Row>
            <Col>
                <div className="table-content-wrapper height-58">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center">No</th>
                                <th onClick={() => { handleClickSort("linkName", 1) }}>Link Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("mainLink", 2) }}>Main Link
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th className="text-center">Link Click</th>
                                <th className="text-center">Report</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                linksData?.length > 0 ?
                                    linksData?.map((dataValue, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td className="text-center">{dataIndex + 1}</td>
                                                <td>{dataValue?.linkName}</td>
                                                <td>{dataValue?.mainLink}</td>
                                                <td className="text-center">{dataValue?.linkCount}</td>
                                                <td className="text-center"><i className="mx-1 far fa-chart-pie" data-toggle="tooltip" title="Report" onClick={() => toggleLinksModal(dataValue?.encLinkId)}></i></td>
                                            </tr>
                                        );
                                    })
                                    : <tr>
                                        <td colSpan={5}>No Report Found</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
            <LinkTraceReportModal linkModal={linkModal} toggleLinksModal={() => toggleLinksModal("")} encLinkId={encLinkId} />
        </Row>
    )
}

export default Links;