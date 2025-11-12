import React from "react";
import CopyLink from "../shared/commonControlls/copyLink";
import { Col, FormGroup } from "reactstrap";
import { Button, TextField } from "@mui/material";
import history from "../../history";

const PublishingOptions = ({
    link
}) => {
    return (
        <Col xs={8} className="mx-auto">
            <h4>Assessment Publishing Options</h4>
            <p className="font-weight-bold">Put javascript snippet below to into your website home page</p>
            <TextField
                name="jsLink"
                multiline
                fullWidth
                minRows={2}
                value={link.jsLink}
                readOnly={true}
                onFocus={event => event.target.select()}
                InputProps={{ endAdornment: <CopyLink elementName="jsLink" iconSelector="copyJsLink" /> }}
                variant="standard"
            />
            <p className="font-weight-bold mt-5">Send Link in Email or Text</p>
            <TextField
                name="link"
                multiline
                fullWidth
                minRows={2}
                value={link.link}
                readOnly={true}
                onFocus={event => event.target.select()}
                InputProps={{ endAdornment: <CopyLink elementName="link" iconSelector="copyLink" /> }}
                variant="standard"
            />
            <p className="font-weight-bold mt-5">Embed in Your Page</p>
            <TextField
                name="embedLink"
                multiline
                fullWidth
                minRows={2}
                value={link.embedLink}
                readOnly={true}
                onFocus={event => event.target.select()}
                variant="standard"
                InputProps={{ endAdornment: <CopyLink elementName="embedLink" iconSelector="copyEmbedLink" /> }}
            />
            <FormGroup className="text-center mb-4 mt-3 bold">
                <Button variant="contained" color="primary" onClick={() => { history.push("/manageassessment") }}><i className="far fa-check mr-2"></i>DONE</Button>
            </FormGroup>
        </Col>
    )
}

export default PublishingOptions