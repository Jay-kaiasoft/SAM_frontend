import React from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Button, Checkbox, Box } from "@mui/material";
import CreateSms from "./createSms";
import CreateImageVideo from "./createImageVideo";
import InputField from "../shared/commonControlls/inputField";
import MessagePreview from "./messagePreview";

const innerHeading = {
    fontSize: 18
}

const MessagePreviewImageVideo = ({ image }) => {
    return (
        <div>
            <img src={image} alt="" className="img-thumbnail w-75 h-50 mb-2" />
        </div>
    );
}

const SmsDetails = ({
    sms,
    udfFields,
    initSmsCost,
    data,
    user,
    videoModal,
    assessmentLinkList,
    customFormLinkList,
    surveyLinkList,
    videoUrl,
    totalSms,
    addTextSms = () => { },
    filemanager = () => { },
    handleChange = () => { },
    setSms = () => { },
    toggleVideoModal = () => { },
    handleVideoUrl = () => { },
    handleClickAddVideoLink = () => { }
}) => {
    return (
        <Row>
            <Col xs={12} sm={12} md={10} lg={8} xl={8} className="mx-auto">
                <p style={innerHeading}><strong>SMS Details</strong></p>
                <Row className="mt-3">
                    <Col xs={12} sm={12} md={8} className="justify-content-center">
                        <Row>
                            <Col sm={12}>
                                <Button variant="contained" color="primary" onClick={addTextSms} className="mr-3">
                                    ADD SMS Text
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => { filemanager("preview_McBlock_sms", "sms", "sms"); }} className="mr-3">
                                    ADD IMAGE
                                </Button>
                                <Button variant="contained" color="primary" onClick={toggleVideoModal} className="mr-3">
                                    ADD VIDEO
                                </Button>
                                <i className="far fa-question-circle"></i>
                                {/* <div className="mt-3">
                                                <FormControlLabel className="mr-0 mb-0" control={<Checkbox value={data?.convertTinyUrlYN || false} onChange={()=>{data.convertTinyUrlYN === "Y" ? showWarningTinyURL() : handleChange("convertTinyUrlYN","Y")}} checked={data?.convertTinyUrlYN === "Y"} color="primary" />} label="Optional TinyURL : Convert Original URL to Short URL" />
                                            </div> */}
                                <div className="mt-3 text-danger">Warning : If you use image greater than 1 MB image will not be sent.</div>
                                <Box className="mt-3 ">
                                    {/*<Box sx={{minHeight: 500}} className="msgSortable tpl-container">*/}
                                    <Box className="msgSortable tpl-container">
                                        {
                                            sms.map((element, index) => (
                                                element.smsType === "text" ?
                                                    <CreateSms text={element.smsDetail} key={index} setSms={setSms} udfFields={udfFields} refIndex={index} initSmsCost={initSmsCost} surveyLinkList={surveyLinkList} assessmentLinkList={assessmentLinkList} customFormLinkList={customFormLinkList} />
                                                    :
                                                    <CreateImageVideo key={index} image={element.imageUrl} setSms={setSms} refIndex={index} initSmsCost={initSmsCost} />
                                            ))
                                        }
                                    </Box>
                                    <Box sx={{ backgroundColor: "#f2eeee" }} className="py-1 px-3">
                                        <Checkbox checked={data.chkOptOut === 1} onChange={() => { data.chkOptOut === 0 ? handleChange("chkOptOut", 1) : handleChange("chkOptOut", 0) }} inputProps={{ 'aria-label': 'controlled' }} size="small" color="primary" className="p-1" />
                                        <span style={{ color: "#999" }}>Include Opt-out message. Opt-Out message must include word STOP </span>
                                        <FormGroup className="p-2 mb-0 bg-white">
                                            <InputField
                                                type="text"
                                                id="optOutMsg"
                                                name="optOutMsg"
                                                value={data?.optOutMsg || ""}
                                                onChange={handleChange}
                                                label="Optout Message"
                                            />
                                        </FormGroup>
                                        <p className="mb-0 pl-2">SMS charges may apply.</p>
                                    </Box>
                                    <Box sx={{ backgroundColor: "#f2eeee" }} className="text-right mt-3 py-2 px-3">
                                        <strong>
                                            Approximated Total Campaign Cost : {user.countryPriceSymbol}{totalSms}
                                        </strong>
                                    </Box>
                                </Box>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={4}>
                        <Row className="smsBackImg">
                            <div className="smsMainScreen">
                                {
                                    sms.map((element, index) => (
                                        element.smsType === "text" ?
                                            <MessagePreview key={index} text={element.smsDetail} convertTinyUrlYN={data.convertTinyUrlYN} />
                                            :
                                            <MessagePreviewImageVideo key={index} image={element.imageUrl} />
                                    ))
                                }
                            </div>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12}>
                                <strong>Note:</strong> This is a simulation rendering. Actual SMS campaign message may render differently on different mobile devices.
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Modal isOpen={videoModal} toggle={toggleVideoModal}>
                <ModalHeader toggle={toggleVideoModal}>
                    <h4>Video Link</h4>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={{ offset: 2, size: 10 }} className="mx-auto" >
                            <FormGroup>
                                <InputField
                                    type="text"
                                    id="videoLink"
                                    name="videoLink"
                                    label="Video Link"
                                    onChange={handleVideoUrl}
                                    value={videoUrl}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={handleClickAddVideoLink} className="mr-3"> ADD </Button>
                    <Button variant="contained" color="primary" onClick={toggleVideoModal} className="mr-3"> CLOSE </Button>
                </ModalFooter>
            </Modal>
        </Row>
    )
}

export default SmsDetails