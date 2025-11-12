import React, { useEffect, useState } from "react";
import { Row, Col, Table } from 'reactstrap';
import { dateTimeFormat } from "../../../assets/commonFunctions";
import { getSmsCampaignsReportsUnsubscribedData } from "../../../services/smsCampaignService";

const Unsubscribed = ({ csId, smsId }) => {
    const [unsubscribedData, setUnsubscribedData] = useState([])
    const [sort, setSort] = useState("firstName,desc");
    const [sortBox, setSortBox] = useState([false]);
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
        getSmsCampaignsReportsUnsubscribedData(data).then(res => {
            if (res?.status === 200) {
                setUnsubscribedData(res?.result?.unsubscribedData || [])
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
                                <th>No</th>
                                <th onClick={() => { handleClickSort("firstName", 1) }}>First Name
                                    <span>
                                        {typeof sortBox[1] !== "undefined"
                                            ? (sortBox[1] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("lastName", 2) }}>Last Name
                                    <span>
                                        {typeof sortBox[2] !== "undefined"
                                            ? (sortBox[2] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("contact", 3) }}>Contact
                                    <span>
                                        {typeof sortBox[3] !== "undefined"
                                            ? (sortBox[3] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                                <th onClick={() => { handleClickSort("date", 4) }}>Date
                                    <span>
                                        {typeof sortBox[4] !== "undefined"
                                            ? (sortBox[4] === true
                                                ? <i className="fad fa-sort-up ml-1"></i>
                                                : <i className="fad fa-sort-down ml-1"></i>)
                                            : <i className="fad fa-sort ml-1"></i>}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                unsubscribedData?.length > 0 ?
                                    unsubscribedData?.map((dataValue, dataIndex) => {
                                        return (
                                            <tr key={dataIndex}>
                                                <td>{dataIndex + 1}</td>
                                                <td>{dataValue?.firstName}</td>
                                                <td>{dataValue?.lastName}</td>
                                                <td>{dataValue?.contact}</td>
                                                <td>{dateTimeFormat(dataValue?.date)}</td>
                                            </tr>
                                        );
                                    })
                                    : <tr>
                                        <td colSpan={5} className="text-center">No Report Found</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    )
}

export default Unsubscribed;