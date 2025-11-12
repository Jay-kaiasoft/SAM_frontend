import React, {useState} from 'react';
import {Col, FormGroup} from 'reactstrap';
import InputField from '../shared/commonControlls/inputField';
import {Button} from "@mui/material";
import { connect } from 'react-redux';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { websiteEmailAddress } from '../../config/api';

const ConvertMyExistingTemplate = ({globalAlert})=>{
    const [displayMessage, setDisplayMessage] = useState(false);
    const [subjectLine, setSubjectLine] = useState("");
    const [templateName, setTemplateName] = useState("");
    const heandleTemplateName = (e, v)=>{
        setTemplateName(v);
    };
    const handleSubmit = ()=>{
        if(typeof templateName === "undefined" || templateName === "" || templateName === null){
            globalAlert({
                open: true,
                type: "Error",
                text: "Please enter template name"
            });
            return false;
        }
        setSubjectLine("2ff2861b3c4d1d4937bd9a37c54d445e");
        setDisplayMessage(true);
    }
    return (
        <>
            <Col xs={12} sm={12} md={{offset: 4, size: 4}} lg={{offset: 4, size: 4}} xl={{offset: 4, size: 4}}>
                <FormGroup className="mx-4 my-5">
                    <InputField
                        type="text"
                        id="templateName"
                        name="templateName"
                        value={templateName}
                        onChange={heandleTemplateName}
                        label="Template Name"
                    />
                </FormGroup>
            </Col>
            <Col xs={12} sm={12} md={{offset: 2, size: 8}} lg={{offset: 2, size: 8}} xl={{offset: 2, size: 8}} className="d-flex justify-content-center">
                <Button variant="contained" onClick={handleSubmit} color="primary" hidden={displayMessage}>
                    SUBMIT
                </Button>
                <div className="text-center" hidden={!displayMessage}>
                    <h5>Please send your email template to</h5>
                    <h5><span className="text-primary"><a href={`mailto:${websiteEmailAddress}?subject=${subjectLine}`}>{websiteEmailAddress}</a></span> with following subject line:</h5>
                    <h5><strong>{subjectLine}</strong></h5>
                </div>
            </Col>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(null, mapDispatchToProps)(ConvertMyExistingTemplate);