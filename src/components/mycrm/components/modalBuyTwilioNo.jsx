import React from "react";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import InputField from "../../shared/commonControlls/inputField";
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { displayFormatNumber } from "../../../assets/commonFunctions";
import { websiteTitle } from "../../../config/api";


const ModalBuyTwilioNo = ({
    user,
    inputRefsBuyTwilioNo,
    modalBuyTwilioNo,
    dropDownRefsBuyTwilioNo,
    dataBuyTwilioNo,
    dataSearchTwilioNo,
    msgSearchTwilioNo,
    countryBuyTwilioNo,
    toggleBuyTwilioNo = () => { },
    handleChangeBuyTwilioNo = () => { },
    searchBuyTwilioNo = () => { },
    saveBuyTwilioNo = () => { },
}) => {
    return (
        <Modal size="lg" isOpen={modalBuyTwilioNo} toggle={toggleBuyTwilioNo}>
            <ModalHeader toggle={toggleBuyTwilioNo}>SMS/MMS Number Setup</ModalHeader>
            <ModalBody>
                <h6>Hello {user.firstName},</h6>
                <p>It looks like this is the first time you will be sending SMS/MMS message from {websiteTitle}. Let set your account up for this. In order to send SMS/MMS message you will first need to select a phone number to use to send SMS/MMS from. This phone number can be released in the My Profile section of our Applcation.</p>
                <p>There is a $2.00 per month cost for this phone number regardless if you send SMS/MMS. </p>
                <p>You can search for phone number by country and certain area code (NPA) or exchange (NXX).</p>
                <div className="borderBottomContactBox"></div>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={4}>
                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefsBuyTwilioNo.current[0]}
                                name="countryCode"
                                label="Select Country"
                                onChange={handleChangeBuyTwilioNo}
                                value={dataBuyTwilioNo?.countryCode || "US"}
                                dropdownList={countryBuyTwilioNo}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={4}>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefsBuyTwilioNo.current[0]}
                                type="text"
                                id="areaCode"
                                name="areaCode"
                                label="Please Enter Your Area Code"
                                onChange={handleChangeBuyTwilioNo}
                                value={dataBuyTwilioNo?.areaCode || ""}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={3}><Button variant="contained" color="primary" className="mt-3" onClick={() => { searchBuyTwilioNo() }} >SEARCH</Button></Col>
                </Row>
                <div className="borderBottomContactBox"></div>
                {
                    dataSearchTwilioNo.length > 0 && msgSearchTwilioNo === "" ?
                        <Row>
                            <RadioGroup className="w-100" row aria-label="twilioNumber" name="twilioNumber" value={dataBuyTwilioNo?.twilioNumber || ""} onChange={(e) => { handleChangeBuyTwilioNo(e.target.name, e.target.value) }}>
                                {
                                    dataSearchTwilioNo.map((value, index) => (
                                        <Col xs={3} key={index}>
                                            <FormControlLabel className="mb-0" value={value.phoneNumber} control={<Radio color="primary" />} label={displayFormatNumber(value.friendlyName, value.countryCode)} />
                                        </Col>
                                    ))
                                }
                            </RadioGroup>
                            <Col xs={12} className="border-bottom mt-2 mb-3"></Col>
                            <Col xs={12}>
                                <FormControlLabel control={<Checkbox color="primary" checked={dataBuyTwilioNo.checkForwardingYesNo === "yes"} onChange={(e)=>{handleChangeBuyTwilioNo("checkForwardingYesNo",e.target.checked ? "yes" : "no")}} />} label="Do you want to forward call to this number?" />
                            </Col>
                            {
                                dataBuyTwilioNo.checkForwardingYesNo === "yes" &&
                                <>
                                    <Col sx={6}>
                                        <FormGroup className='mb-4'>
                                            <DropDownControls
                                                ref={dropDownRefsBuyTwilioNo.current[1]}
                                                name="callForwardingCountryCode"
                                                label="Select Country"
                                                onChange={handleChangeBuyTwilioNo}
                                                value={dataBuyTwilioNo?.callForwardingCountryCode || "US"}
                                                dropdownList={countryBuyTwilioNo}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sx={6}>
                                        <FormGroup className='mb-4'>
                                            <InputField
                                                ref={inputRefsBuyTwilioNo.current[1]}
                                                type="text"
                                                id="callForwardingNumber"
                                                name="callForwardingNumber"
                                                label="Please Enter Your Number"
                                                onChange={handleChangeBuyTwilioNo}
                                                value={dataBuyTwilioNo?.callForwardingNumber || ""}
                                            />
                                        </FormGroup>
                                    </Col>
                                </>
                            }
                        </Row>
                    :
                        <Row>
                            <Col xs={12} className="text-center">{msgSearchTwilioNo}</Col>
                        </Row>
                }
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={() => saveBuyTwilioNo()} >SAVE</Button>
                <Button variant="contained" color="primary" className="mr-2" onClick={() => { toggleBuyTwilioNo() }} >CANCEL</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalBuyTwilioNo