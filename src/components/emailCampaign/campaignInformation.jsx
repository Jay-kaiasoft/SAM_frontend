import React from "react";
import { Col, Row } from "reactstrap";
import { Button, FormGroup } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import {getCampaignExists} from "../../services/emailCampaignService";

const innerHeading = {
    fontSize: 18
}

const campaignTypes = [
    {
        key: "Newsletter",
        value: "Newsletter"
    },
    {
        key: "Lead Nurturing",
        value: "Lead Nurturing"
    },
    {
        key: "Promotional",
        value: "Promotional"
    },
    {
        key: "Milestone",
        value: "Milestone"
    },
    {
        key: "Survey",
        value: "Survey"
    }
]

const CampaignInformation = ({
    handleBack,
    handleNext,
    globalAlert,
    data,
    setData
}) => {
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const handleNextClick = () => {
        if (data?.campaignName === undefined || data?.campaignName === "") {
            globalAlert({
                type: "Error",
                text: "Name Of Campaign can not be blank.",
                open: true
            })
            return
        }
        if (data?.mailType === undefined || data?.mailType === "") {
            globalAlert({
                type: "Error",
                text: "Select campaign type.",
                open: true
            })
            return
        }
        getCampaignExists(data.campaignName).then(res => {
            if (res.status === 200) {
                handleNext(1);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        });
    }
    return (
        <Row>
            <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto">
                <p style={innerHeading}><strong>Campaign Information</strong></p>
                <FormGroup className="mt-3">
                    <InputField
                        type="text"
                        id="campaignName"
                        name="campaignName"
                        value={data?.campaignName || ""}
                        onChange={handleDataChange}
                        label="Name of Campaign"
                    />
                </FormGroup>
                <FormGroup className="mt-4">
                    <DropDownControls
                        name="mailType"
                        label="Campaign Type"
                        onChange={handleDataChange}
                        validation={"required"}
                        dropdownList={campaignTypes}
                        value={data?.mailType || ""}
                    />
                </FormGroup>
                <FormGroup className="mt-4">
                    <InputField
                        type="text"
                        id="campaignDescription"
                        name="campaignDescription"
                        value={data?.campaignDescription || ""}
                        onChange={handleDataChange}
                        label="Campaign Description"
                        multiline={true}
                        minRows={6}
                    />
                </FormGroup>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(3)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => handleNextClick()}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}

export default connect(null, mapDispatchToProps)(CampaignInformation);