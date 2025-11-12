import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button, Link } from '@mui/material';
import DropZoneEmailFooter from "../shared/commonControlls/dropZoneEmailFooter";
import InputField from "../shared/commonControlls/inputField";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { getWhiteListingDetails, updateWhiteListingDetails } from "../../services/userService";
import { handleClickHelp } from "../../assets/commonFunctions";
const img = {
    maxWidth: 150,
    maxHeight: 75
};
const previewLinkMain = {
    color: "#75abff",
    fontSize: "12px",
    whiteSpace: "pre-wrap"
}
const previewLink = {
    color: "#75abff",
    cursor: "pointer"
}

const EmailCampaignFooter = ({globalAlert}) => {
    const [data, setData] = useState({"whiteListingLogo":"","whiteListingDetails":""});
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    }
    const handleClickUpdate = () => {
        if(typeof data.whiteListingDetails === "undefined" || data.whiteListingDetails === "" || data.whiteListingDetails === null){
            globalAlert({
                type: "Error",
                text: `Please enter footer details`,
                open: true
            });
            return;
        }
        let requestData = {
            "whiteListingDetails": data.whiteListingDetails
        }
        updateWhiteListingDetails(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(()=>{
        getWhiteListingDetails().then(res => {
            if (res.status === 200) {
                if (res.result) {
                    setData(res.result);
                }
            }
        });
    },[]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className='text-center mb-5'>
                        <h3 className="d-inline-block mb-0 align-middle">Email Campaign Footer</h3>
                        <div className="icon-wrapper d-inline-block mx-5">
                            <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("EmailMarketing/EmailCampaign/whitelisting/EmailWhitelisting.html") }} data-toggle="tooltip" title="Help">
                                <i className="far fa-question-circle"></i>
                                <div className="bg-grey"></div>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <DropZoneEmailFooter data={data} setData={setData} />
                            <Row>
                                <Col xs={12} className="mb-3">
                                    <InputField
                                        id="whiteListingDetails"
                                        name="whiteListingDetails"
                                        label="Footer Details"
                                        multiline
                                        fullWidth
                                        minRows={4}
                                        value={data?.whiteListingDetails || ""}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col xs={12} className="text-center">
                                    <Button variant="contained" color="primary" onClick={()=>{handleClickUpdate()}}>UPDATE</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} className="shadow p-5 d-flex flex-column justify-content-between">
                            <p className="text-center">Preview</p>
                            <div>
                                {
                                    (typeof data.whiteListingLogo !== "undefined" && data.whiteListingLogo !== "" && data.whiteListingLogo !== null) &&
                                    <div className="text-center"><img src={data.whiteListingLogo} alt="logo" style={img} /></div>
                                }
                                <div className="text-center py-2" style={previewLinkMain}>{data.whiteListingDetails}</div>
                                <div className="text-center" style={previewLinkMain}><span style={previewLink}>View In Browser</span> | <span style={previewLink}>Unsubscribe</span> | <span style={previewLink}>Change Language</span></div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(EmailCampaignFooter);