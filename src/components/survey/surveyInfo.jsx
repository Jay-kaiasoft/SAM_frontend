import React from "react";
import { Col, FormGroup } from "reactstrap";
import { Button } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import history from "../../history";

const SurveyInfo = ({
    data,
    handleChange = () => { },
    handleClickNextFirst = () => { },
    handleClickSaveValidation = () => { },
}) => {
    return (
        <Col xs={4} className="mx-auto">
            <FormGroup >
                <InputField type="text" id="sryName" name="sryName" value={data?.sryName || ""} onChange={handleChange} label="Survey Title" />
            </FormGroup>
            <FormGroup >
                <InputField type="text" id="sryDescription" name="sryDescription" value={data?.sryDescription || ""} onChange={handleChange} label="Survey Description" minRows={3} multiline />
            </FormGroup>
            <FormGroup className="text-center mb-5">
                <Button variant="contained" color="primary" onClick={() => { history.push("/managesurvey") }} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                <Button variant="contained" color="primary" onClick={()=>{handleClickSaveValidation(0)}} className="mr-3 saveAndDraft"><i className="far fa-save mr-2"></i>SAVE AND DRAFT</Button>
                <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </FormGroup>
        </Col>
    )
}

export default SurveyInfo