import React, { createRef, useRef, useState } from "react";
import { Col, Row } from "reactstrap";
import { Button, FormGroup } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import History from "../../history";
import { sendSubmitRequest } from "../../services/supportService";
import FileUpload from "../shared/commonControlls/fileUpload";
const baseURL = process.env.REACT_APP_SUPPORT_BASE_URL;

const typeList = [
    {
        value: "Email Campaign",
        key: "Email Campaign",
    },
    {
        value: "Survey Campaigns",
        key: "Survey Campaigns",
    },
    {
        value: "Integrations",
        key: "Integrations",
    },
    {
        value: "List Imports / Management",
        key: "List Imports / Management",
    },
    {
        value: "Templates",
        key: "Templates",
    },
    {
        value: "Reports",
        key: "Reports",
    },
    {
        value: "Accounting Settings",
        key: "Accounting Settings",
    },
    {
        value: "Billing Assistance",
        key: "Billing Assistance",
    },
    {
        value: "Other",
        key: "Other",
    },
];
const innerHeading = {
    fontSize: 18
}

export const AddTicket = () => {
    const inputRefs = useRef([createRef(), createRef(), createRef()])
    const [fileUploaded, setFileUploaded] = useState([]);
    const [data, setData] = useState({
        subject: "",
        type: "",
        description: "",
    })
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = () => {
        let isValid = true;
        for (let i = 0; i < 2; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!inputRefs.current[2].current.validateDropDown()) {
            isValid = false
        }
        if (!isValid) {
            return
        }
        const { subject, type, description } = data;
        let fileName = "";
        fileUploaded?.forEach((file, index) => {
            fileName += file.fileName;
            if (index !== fileUploaded.length - 1) {
                fileName += ",";
            }
        });
        const payload = {
            srId: 0,
            srSubject: subject,
            srType: type,
            description,
            fileName,
        };
        sendSubmitRequest(payload).then((res) => {
            if (res.status === 200) {
                History.goBack()
            }
        });
    };

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row>
                    <Col xs={10} sm={10} md={4} lg={4} xl={4} className="mx-auto">
                        <p style={innerHeading}><strong>Support Ticket</strong></p>
                        <FormGroup className="mt-4">
                            <InputField
                                type="text"
                                id="subject"
                                name="subject"
                                validation={"required"}
                                value={data?.subject || ""}
                                onChange={handleDataChange}
                                label="Subject"
                                ref={inputRefs.current[0]}
                            />
                        </FormGroup>
                        <FormGroup className="mt-4">
                            <DropDownControls
                                name="type"
                                label="What can we help you with today?"
                                onChange={handleDataChange}
                                validation={"required"}
                                dropdownList={typeList}
                                value={data?.type || ""}
                                ref={inputRefs.current[2]}
                            />
                        </FormGroup>
                        <FormGroup className="mt-4">
                            <InputField
                                type="text"
                                id="description"
                                name="description"
                                validation={"required"}
                                value={data?.description || ""}
                                onChange={handleDataChange}
                                label="Description"
                                multiline={true}
                                minRows={6}
                                ref={inputRefs.current[1]}
                            />
                        </FormGroup>
                        <FileUpload
                            className="mt-4"
                            onFileUpload={(files) => {
                                setFileUploaded(files);
                            }}
                            showAttachments={true}
                            url={baseURL + '/submitRequest/uploadFile'}
                            attachments={fileUploaded}
                        />
                        <div className="col-12 mt-4 mb-3" align="center">
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => { History.goBack() }}
                            >
                                <i className="far fa-long-arrow-left mr-2"></i>BACK
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3"
                                onClick={handleSubmit}
                            >
                                <i className="far fa-envelope mr-2"></i>Submit Support Ticket
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AddTicket