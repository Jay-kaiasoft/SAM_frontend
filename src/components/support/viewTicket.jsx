import React, { useEffect, useMemo, useState } from "react";
import { Col, Row } from "reactstrap";
import { getSubmitRequestDetails, sendSubmitRequest } from "../../services/supportService";
import { easUrlEncoder } from "../../assets/commonFunctions";
import ConversationBox from "../mycrm/conversationBox";
import $ from "jquery"
import InputField from "../shared/commonControlls/inputField";
import { Button } from "@mui/material";
import History from "../../history";
import FileUpload from "../shared/commonControlls/fileUpload";
const baseURL = process.env.REACT_APP_SUPPORT_BASE_URL;

const ViewTicket = (props) => {
    const [description, setDescription] = useState("");
    const [fileUploaded, setFileUploaded] = useState([]);
    const [requestDetails, setRequestDetails] = useState({});
    const [conversationData, setConversationData] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const srId =
        typeof queryString.get("srId") !== "undefined" &&
            queryString.get("srId") !== "" &&
            queryString.get("srId") !== null
            ? queryString.get("srId")
            : 0;

    const getRequestDetails = (srId) => {
        setIsLoad(false);
        const data = "srId=" + srId;
        getSubmitRequestDetails(data).then((res) => {
            if (res?.status === 200) {
                setRequestDetails(res?.result);
                const conversations = res?.result?.submitRequestDetails?.map(
                    (detail) => {
                        return {
                            ...detail,
                            content: detail.srdDescription,
                            dateTime: detail.srdDate,
                            type: detail.srdAdminRply === "N" ? "self" : "other",
                        };
                    }
                );
                setConversationData(conversations);
            }
            setIsLoad(false);
            setTimeout(() => {
                $("#conversation-main").animate({ scrollTop: $('#conversation-main')[0].scrollHeight }, 1000);
            }, 1000);
        });

    };

    useEffect(() => {
        getRequestDetails(srId);
        const interval = setInterval(() => {
            getRequestDetails(srId);
        }, 30 * 1000);
        return () => clearInterval(interval);
    }, [srId]);

    const handleSubmit = () => {
        let fileName = "";
        fileUploaded?.forEach((file, index) => {
            fileName += file.fileName;
            if (index !== fileUploaded.length - 1) {
                fileName += ",";
            }
        });
        const payload = {
            srId: requestDetails?.submitRequest?.srId,
            srSubject: requestDetails?.submitRequest?.srSubject,
            srType: requestDetails?.submitRequest?.srType,
            description,
            fileName,
        };
        sendSubmitRequest(payload).then((res) => {
            if (res.status === 200) {
                getRequestDetails(srId);
                setFileUploaded([]);
                setDescription("");
            }
        });
    };

    const deleteAcceptedFileFromState = (index) => {
        const currentFiles = [...fileUploaded];
        currentFiles.splice(index, 1);
        setFileUploaded(currentFiles);
    };

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>{`Subject : ${requestDetails?.submitRequest?.srSubject || ""
                    }`}</h3>
                <Row>
                    <Col xs={10} sm={10} md={6} lg={6} xl={5} className="mx-auto">
                        <div className="conversation-wrapper">
                            <div id="conversation-main" className="conversation-main">
                                <ConversationBox conversationData={conversationData} isLoad={isLoad} />
                            </div>
                            <div className="bottom-container">
                                <InputField
                                    type="text"
                                    id="description"
                                    name="description"
                                    validation={"required"}
                                    value={description || ""}
                                    onChange={(name, value) => {
                                        setDescription(value)
                                    }}
                                    label="Description"
                                    multiline={true}
                                    minRows={6}
                                />
                                <div className="file-container">
                                    {fileUploaded &&
                                        fileUploaded.map((file, index) => {
                                            return (
                                                <div className="file-main" key={index}>
                                                    <p className="file-text mb-0">{file.fileName}</p>
                                                    <i
                                                        className="far fa-times"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            deleteAcceptedFileFromState(index);
                                                        }}
                                                    >
                                                    </i>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="bottom-button-container">
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => { History.goBack() }}
                                    >
                                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                                    </Button>
                                    <FileUpload
                                        showButton={true}
                                        showAttachments={false}
                                        onFileUpload={(files) => {
                                            setFileUploaded(files);
                                        }}
                                        attachments={fileUploaded}
                                        url={baseURL + '/submitRequest/uploadFile'}
                                    />
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={handleSubmit}
                                    >
                                        <i className="far fa-envelope mr-2"></i>Submit Support Ticket
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default ViewTicket