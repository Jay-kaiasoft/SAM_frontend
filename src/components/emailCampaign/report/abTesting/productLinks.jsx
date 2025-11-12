import React, { useEffect, useState } from "react"
import { Col, Row } from "reactstrap";
import { getEmailCampaignsReportProductLinksAB } from "../../../../services/emailCampaignService";
import ProductLinksTable from "../productLinksTable";


const ProductLinks = ({ id, campId }) => {
    const [viewSelected, setViewSelected] = useState(0)
    const [productLinksData, setProductLinksData] = useState({})

    useEffect(()=>{
        const data = `id=${id}&campId=${campId}`
        getEmailCampaignsReportProductLinksAB(data).then(res=>{
            if(res?.status===200){
                setProductLinksData(res?.result)
            }
        })
    },[id,campId])
    const renderViewSelected = () => {
        if (viewSelected === 0) {
            return (
                <Row className="border mx-0 p-3">
                    <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                        <div className="font-size-18 mb-2">For A</div>
                        <ProductLinksTable productLinksData={productLinksData?.productLinks} />
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                        <div className="font-size-18 mb-2">For B</div>
                        <ProductLinksTable productLinksData={productLinksData?.productLinksB} />
                    </Col>
                </Row>
            )
        } else if (viewSelected === 1) {
            return (
                <Row className="border mx-0 p-3">
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <ProductLinksTable productLinksData={productLinksData?.productLinksO} />
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

export default ProductLinks