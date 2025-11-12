import React, { Fragment, useEffect, useState } from "react";
import { getAutomationReportProductLinks, getAutomationReportProductLinksClickUser } from "../../../../services/automationService";
import { dateTimeFormat } from "../../../../assets/commonFunctions";
import LinkClickModal from "../../../emailCampaign/report/linkClickModal";
import { Col, Row, Table } from "reactstrap";

const ProductLinks = ({id, globalAlert}) => {
    const [productLinksData, setProductLinksData] = useState([]);

    useEffect(() => {
        getAutomationReportProductLinks(id).then(res => {
            if (res?.status === 200) {
                setProductLinksData(res?.result);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [id]);

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="text-center mb-3">{productLinksData?.campaignDetails?.name}</h3>
                <ProductLinksTable productLinksData={productLinksData?.campaignDetails?.productLinks} />
                {
                    productLinksData?.conditionDetails?.length > 0 ?
                        productLinksData?.conditionDetails?.map((value,index)=>(
                            <Fragment key={index}>
                                <hr className="my-4"/>
                                <h5 className="text-center">Condition : {value.conditionType}</h5>
                                <div className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.yes.oldMypage} = Yes </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.yes.sendMypage}</p>
                                </div>
                                <ProductLinksTable productLinksData={value.yes?.productLinks} />
                                <div  className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.no.oldMypage} = No </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.no.sendMypage}</p>
                                </div>
                                <ProductLinksTable productLinksData={value.no?.productLinks} />
                            </Fragment>
                        ))
                    : null
                }
            </Col>
        </Row>
    );
}

const ProductLinksTable = ({ productLinksData }) => {
    const [expandRow, setExpandRow] = useState({
        "0": false
    })
    const [linkClickModal, setLinkClickModal] = useState(false);
    const [linkSelected, setLinkSelected] = useState({})
    const toggleLinkClickModal = (id, campLink) => {
        setLinkClickModal(prevState => !prevState);
        if (!linkClickModal) {
            getAutomationReportProductLinksClickUser(id).then(res => {
                if (res?.status === 200) {
                    setLinkSelected({ productLinksClickUser: res?.result?.productLinksClickUser, campLink })
                }
            })
        }
    }
    return (
        <div className="table-content-wrapper height-58 overflow-auto">
            <Table striped>
                <thead>
                    <tr>
                        <th width="5%"></th>
                        <th width="5%" align="left">No</th>
                        <th width="40%" align="left">Link Name</th>
                        <th width="15%" align="left" className="text-center">Unique Links</th>
                        <th width="15%" align="left" className="text-center">Total Clicks</th>
                        <th width="20%" className="text-center">Click Through Rate (CTR)</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productLinksData?.length > 0 ?
                            productLinksData?.map((value, index) => {
                                return (
                                    <Fragment key={index}>
                                        <tr
                                            onClick={(e) => {
                                                if (e.target?.className !== "far fa-minus" && e.target?.className !== "far fa-plus") {
                                                    toggleLinkClickModal(value?.id, value?.campLink);
                                                }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {value?.totalClicks > 0 ? <td align="center">
                                                {
                                                    expandRow[index] ?
                                                    <i className="far fa-minus" onClick={(e) => {
                                                        setExpandRow((prev) => {
                                                            return {
                                                                ...prev,
                                                                [index]: false
                                                            }
                                                        })
                                                    }}></i> : <i className="far fa-plus" onClick={() => {
                                                        setExpandRow((prev) => {
                                                            return {
                                                                ...prev,
                                                                [index]: true
                                                            }
                                                        })
                                                    }}></i>
                                                }
                                            </td> : <td></td>}
                                            <td>{index + 1}</td>
                                            <td>{value?.campLink}</td>
                                            <td align="center">{value?.uniqueClicks}</td>
                                            <td align="center">{value?.totalClicks}</td>
                                            <td align="center">{value?.clickThroughRate?.toFixed(2)}%</td>
                                        </tr>
                                        {expandRow[index] ?
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="d-flex flex-column w-100 w-sm-75 m-2 pl-5">
                                                        {
                                                            value?.userDetailList?.map((user,uIndex) => {
                                                                return (
                                                                    <div className="d-flex flex-column" key={uIndex}>
                                                                        <div className="d-flex flex-row border-bottom p-2">
                                                                            <div className="text-center" style={{ width: "10%" }}><strong>No</strong></div>
                                                                            <div style={{ width: "60%" }}><strong>User Name</strong></div>
                                                                            <div className="text-center" style={{ width: "20%" }}><strong>Total Clicked</strong></div>
                                                                        </div>
                                                                        <div className="d-flex flex-row border-bottom p-2">
                                                                            <div className="text-center" style={{ width: "10%" }}>{uIndex + 1}</div>
                                                                            <div style={{ width: "60%" }}>{user?.userName}</div>
                                                                            <div className="text-center" style={{ width: "20%" }}>{user?.totalClicked}</div>
                                                                        </div>
                                                                        <div className="d-flex flex-row p-2 mt-1 border-bottom">
                                                                            <div className="text-center" style={{ width: "10%" }}><strong>No</strong></div>
                                                                            <div style={{ width: "25%" }}><strong>Location</strong></div>
                                                                            <div style={{ width: "30%" }}><strong>Date</strong></div>
                                                                            <div style={{ width: "15%" }}><strong>Technology</strong></div>
                                                                            <div style={{ width: "10%" }}><strong>Browser</strong></div>
                                                                        </div>
                                                                        <div className="border-bottom">
                                                                            {user?.locationList?.map((item, index) => {
                                                                                return (
                                                                                    <div className="d-flex p-2" key={index}>
                                                                                        <div className="text-center" style={{ width: "10%" }}>{index + 1}</div>
                                                                                        <div style={{ width: "25%" }}>{item?.location}</div>
                                                                                        <div style={{ width: "30%" }}>{dateTimeFormat(item?.clickDate)}</div>
                                                                                        <div style={{ width: "15%" }}>{item?.technology}</div>
                                                                                        <div style={{ width: "10%" }}>{item?.browser}</div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                            </tr> : null}
                                    </Fragment>
                                );
                            })
                            :
                            <tr>
                                <td colSpan={6} className="text-center">No Data Found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
            <LinkClickModal linkSelected={linkSelected} linkClickModal={linkClickModal} toggleLinkClickModal={toggleLinkClickModal} />
        </div>
    )
}

export default ProductLinks;