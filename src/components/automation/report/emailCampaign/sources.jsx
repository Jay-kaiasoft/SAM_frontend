import React, { Fragment, useEffect, useState } from "react"
import { Col, Row, Table } from "reactstrap";
import { getAutomationReportProductLinksClickUser, getAutomationReportSources } from "../../../../services/automationService";
import LinkClickModal from "../../../emailCampaign/report/linkClickModal";

const Sources = ({ id, globalAlert }) => {
    const [emailCampaignsReportSourceLinks, setEmailCampaignsReportSourceLinks] = useState([])

    useEffect(() => {
        getAutomationReportSources(id).then(res => {
            if (res?.status === 200) {
                setEmailCampaignsReportSourceLinks(res?.result)
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [id])

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3 className="text-center mb-3">{emailCampaignsReportSourceLinks?.campaignDetails?.name}</h3>
                <SourcesTable sourcesData={emailCampaignsReportSourceLinks?.campaignDetails?.productSources} />
                {
                    emailCampaignsReportSourceLinks?.conditionDetails?.length > 0 ?
                        emailCampaignsReportSourceLinks?.conditionDetails?.map((value,index)=>(
                            <Fragment key={index}>
                                <hr className="my-4"/>
                                <h5 className="text-center">Condition : {value.conditionType}</h5>
                                <div className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.yes.oldMypage} = Yes </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.yes.sendMypage}</p>
                                </div>
                                <SourcesTable sourcesData={value.yes.productSources} />
                                <div  className="d-flex justify-content-center">
                                    <p className="font-weight-bold mb-3"> {value.no.oldMypage} = No </p>
                                    <p className="font-weight-bold mb-3 ml-5"> My Page : {value.no.sendMypage}</p>
                                </div>
                                <SourcesTable sourcesData={value.no.productSources} />
                            </Fragment>
                        ))
                    : null
                }
            </Col>
        </Row>
    )
}

const SourcesTable = ({ sourcesData }) => {
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
                        <th width="10%" className="text-center">No</th>
                        <th width="60%" align="left">Link Name</th>
                        <th width="20%" className="text-center">PC</th>
                        <th width="10%" className="text-center">Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sourcesData?.length > 0 ?
                            sourcesData?.map((value, index) => {
                                return (
                                    <tr key={index} onClick={() => toggleLinkClickModal(value?.id, value?.campLink)} className="cursor-pointer">
                                        <td className="text-center">{index + 1}</td>
                                        <td>{value?.campLink}</td>
                                        <td className="text-center">{value?.pc}</td>
                                        <td className="text-center">{value?.mobile}</td>
                                    </tr>
                                );
                            })
                        :
                            <tr>
                                <td colSpan={4} className="text-center">No Data Found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
            <LinkClickModal linkSelected={linkSelected} linkClickModal={linkClickModal} toggleLinkClickModal={toggleLinkClickModal} />
        </div>
    )
}

export default Sources;