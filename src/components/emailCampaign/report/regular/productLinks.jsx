import React, { useEffect, useState } from "react"
import { Col, Row } from "reactstrap";
import { getEmailCampaignsReportProductLinks } from "../../../../services/emailCampaignService";
import ProductLinksTable from "../productLinksTable";

const ProductLinks = ({ id, campId }) => {
    const [productLinksData, setProductLinksData] = useState([])

    useEffect(() => {
        getEmailCampaignsReportProductLinks(`campId=${campId}&id=${id}`).then(res => {
            if (res?.status === 200) {
                setProductLinksData(res?.result?.productLinks)
            }
        })
    }, [campId, id])

    return (
        <Row>
            <Col>
                <ProductLinksTable productLinksData={productLinksData} />
            </Col>
        </Row>
    )
}

export default ProductLinks