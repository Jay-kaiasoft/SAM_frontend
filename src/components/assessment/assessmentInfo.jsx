import React from "react";
import { Col, FormGroup } from "reactstrap";
import { Button } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import history from "../../history";
import DropDownControls from "../shared/commonControlls/dropdownControl";

const AssessmentInfo = ({
    data,
    groupDetails,
    handleChange = () => { },
    handleClickNextFirst = () => { },
    handleClickSaveValidation = () => { },
}) => {
    return (
        <Col xs={4} className="mx-auto">
            <FormGroup >
                <DropDownControls
                    id="assGroupId"
                    name="assGroupId"
                    label="Select Group"
                    onChange={handleChange}
                    value={data?.assGroupId || ""}
                    dropdownList={groupDetails}
                />
            </FormGroup>
            <FormGroup >
                <InputField type="text" id="assName" name="assName" value={data?.assName || ""} onChange={handleChange} label="Assessment Title" />
            </FormGroup>
            <FormGroup >
                <InputField type="text" id="assDescription" name="assDescription" value={data?.assDescription || ""} onChange={handleChange} label="Assessment Description" minRows={3} multiline />
            </FormGroup>
            <FormGroup className="text-center mb-5">
                <Button variant="contained" color="primary" onClick={() => { history.push("/manageassessment") }} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                <Button variant="contained" color="primary" onClick={()=>{handleClickSaveValidation(0)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE AND DRAFT</Button>
                <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </FormGroup>
        </Col>
    )
}

export default AssessmentInfo