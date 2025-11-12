import React from "react";
import { Col, FormGroup, Row } from "reactstrap";
import InputField from "../../shared/commonControlls/inputField";
import DropDownControls from "../../shared/commonControlls/dropdownControl";

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

const WorkflowDetails = ({
    data,
    handleDataChange,
    title = ""
}) => {
    return (
        <Row>
            <Col xl={10} className="mx-auto">
                <p className='heading-style'>{title}</p>
                <FormGroup className='mt-4'>
                    <InputField
                        type="text"
                        id="name"
                        name="name"
                        value={data?.name}
                        onChange={(name, value) => { handleDataChange("label", value); handleDataChange(name, value) }}
                        label="Enter Name of Workflow"
                    />
                    <div className="mt-5">
                        <DropDownControls
                            name="mailType"
                            label="Campaign Type"
                            onChange={(name, value)=>{
                                handleDataChange(name, value);
                            }}
                            validation={"required"}
                            dropdownList={campaignTypes}
                            value={data?.mailType || ""}
                        />
                    </div>
                    <div className="mt-5">
                        <InputField
                            type="text"
                            id="detail"
                            name="detail"
                            multiline={true}
                            minRows={4}
                            value={data?.detail}
                            onChange={handleDataChange}
                            label="Enter Detail of Workflow"
                        />
                    </div>
                </FormGroup>
            </Col>
        </Row>
    )
}
export default WorkflowDetails