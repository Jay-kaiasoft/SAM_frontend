import React, { useEffect, useState } from "react"
import { Col, Row } from "reactstrap";
import { getEmailCampaignsReportSources } from "../../../../services/emailCampaignService";
import SourcesTable from "../sourcesTable";

const Sources = ({ id, campId }) => {
    const [emailCampaignsReportSourceLinks, setEmailCampaignsReportSourceLinks] = useState([])

    useEffect(() => {
        getEmailCampaignsReportSources(`campId=${campId}&id=${id}`).then(res => {
            if (res?.status === 200) {
                setEmailCampaignsReportSourceLinks(res?.result?.emailCampaignsReportSourceLinks)
            }
        })
    }, [id, campId])

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <SourcesTable sourcesData={emailCampaignsReportSourceLinks} />
            </Col>
        </Row>
    )
}

export default Sources