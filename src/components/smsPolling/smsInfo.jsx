import React, { createRef, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Col, Row, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import {buyNumberForSmsPolling, saveSmsInfo} from "../../services/smsPollingService";
import history from "../../history";
import $ from "jquery";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { setLoader } from "../../actions/loaderActions";
import { searchForBuyNumber } from "../../services/clientContactService";
import { displayFormatNumber } from "../../assets/commonFunctions";
import { getCountry } from "../../services/commonService";
import { websiteTitle } from "../../config/api";

const SmsInfo = ({
    handleNext,
    data,
    handleDataChange,
    setData,
    globalAlert,
    user,
    subUser,
    confirmDialog,
    setLoader
}) => {
    const [countryBuyTwilioNo, setCountryBuyTwilioNo] = useState([]);
    const [dataBuyTwilioNo, setDataBuyTwilioNo] = useState({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
    const [dataSearchTwilioNo, setDataSearchTwilioNo] = useState([]);
    const [msgSearchTwilioNo, setMsgSearchTwilioNo] = useState("");
    const [modalBuyTwilioNo, setModalBuyTwilioNo] = useState(false);
    const toggleBuyTwilioNo = () => {
        setModalBuyTwilioNo(!modalBuyTwilioNo);
        setDataBuyTwilioNo({"areaCode":0, "countryCode":"US", "checkForwardingYesNo": "no"});
        setDataSearchTwilioNo([]);
        setMsgSearchTwilioNo("");
    };
    const inputRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const dropDownRefsBuyTwilioNo = useRef([createRef(), createRef()]);
    const handleNextClick = () => {
        if (data.vheading === "" || typeof data.vheading === "undefined") {
            globalAlert({
                type: "Error",
                text: "Please enter polling title",
                open: true
            })
            return
        }
        if (data.twelcomeMsg === "" || typeof data.twelcomeMsg === "undefined") {
            globalAlert({
                type: "Error",
                text: "Please enter welcome message",
                open: true
            })
            return
        }
        if (data.tfinalMsg === "" || typeof data.tfinalMsg === "undefined") {
            globalAlert({
                type: "Error",
                text: "Please enter finalize message",
                open: true
            })
            return
        }
        if (data.twelcomeMsg.toLowerCase() === data.tfinalMsg.toLowerCase()) {
            globalAlert({
                type: "Error",
                text: "Please do not enter same welcome message and finalize message",
                open: true
            })
            return
        }
        let requestData = {
            "iid":data.iid,
            "vheading": data.vheading,
            "tdetail": data.tdetail,
            "twelcomeMsg": data.twelcomeMsg,
            "tfinalMsg": data.tfinalMsg,
            "rndHash":data.rndHash,
            "subMemberId":subUser.memberId
        }
        $("button.nextClick").hide();
        $("button.nextClick").after('<div class="lds-ellipsis ml-3"><div></div><div></div><div></div>');
        saveSmsInfo(requestData).then(res => {
            if (res.status === 200) {
                setData((prev) => {
                    return { ...prev, ...res.result.smsInfo };
                });
                if(typeof data.vsmspollingNumber === "undefined" || data.vsmspollingNumber === null || data.vsmspollingNumber === ""){
                    toggleBuyTwilioNo();
                } else {
                    handleNext(1);
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.nextClick").show();
        });
    }
    const handleChangeBuyTwilioNo = (name, value) => {
        setDataBuyTwilioNo(prev => ({ ...prev, [name]: value }));
        if(name === "checkForwardingYesNo" && value === "yes"){
            handleChangeBuyTwilioNo("callForwardingNumber",user.cell);
            let tempIso2 = countryBuyTwilioNo.filter((x)=>{ return x.id === parseInt(user.country) })[0].key;
            handleChangeBuyTwilioNo("callForwardingCountryCode", tempIso2);
        } else if(name === "checkForwardingYesNo" && value === "no") {
            handleChangeBuyTwilioNo("callForwardingNumber", "");
            handleChangeBuyTwilioNo("callForwardingCountryCode", "");
        }
    }
    const searchBuyTwilioNo = () => {
        let d = {
            "areaCode":dataBuyTwilioNo.areaCode ? dataBuyTwilioNo.areaCode : 0,
            "countryCode":dataBuyTwilioNo.countryCode ? dataBuyTwilioNo.countryCode : "US"
        }
        searchForBuyNumber(d).then(res => {
            if (res.status === 200) {
                if(res.result.searchNumber.length > 0){
                    setDataSearchTwilioNo(res.result.searchNumber);
                    setMsgSearchTwilioNo("");
                } else {
                    setMsgSearchTwilioNo("Phone number not found for this area code");
                }
            } else {
                setMsgSearchTwilioNo("OOPS!! there is some problem arise. Please try again.");
            }
        });
    }
    const saveBuyTwilioNo = () => {
        let isValid = true;
        if(typeof dataBuyTwilioNo.twilioNumber === "undefined" || dataBuyTwilioNo.twilioNumber === ""){
            globalAlert({
                type: "Error",
                text: "Please select number.",
                open: true
            });
            isValid = false
        }
        if(dataBuyTwilioNo.checkForwardingYesNo === "yes" &&  (typeof dataBuyTwilioNo.callForwardingNumber === "undefined" || dataBuyTwilioNo.callForwardingNumber === "" || dataBuyTwilioNo.callForwardingNumber === null)){
            globalAlert({
                type: "Error",
                text: "Please enter forward number.",
                open: true
            });
            isValid = false
        }
        if (!isValid) {
            return
        }
        confirmDialog({
            open: true,
            title: `Are you sure, you want to buy this ${dataBuyTwilioNo.twilioNumber} number?`,
            onConfirm: () => { confirmSaveBuyTwilioNo() }
        })
    }
    const confirmSaveBuyTwilioNo = () => {
        setLoader({
            load: true,
            text: "Please wait !!!"
        });
        let d = {
            "memberId":user.memberId,
            "subMemberId":subUser.memberId,
            "fullName":`${user.firstName} ${user.lastName}`,
            "subFullName":`${subUser.firstName} ${subUser.lastName}`,
            "twilioNumber":dataBuyTwilioNo.twilioNumber,
            "noExisting":"No",
            "iid":data.iid,
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumberForSmsPolling(d).then(res => {
            if (res.status === 200) {
                handleNext(1);
                toggleBuyTwilioNo();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            setLoader({
                load: false
            });
        });
    }
    const fetchData = () => {
        getCountry().then(res => {
            if (res.result.country) {
                let country = [];
                res.result.country.map(x => (
                    country.push({
                        "key": x.iso2,
                        "value": x.cntName,
                        "id": x.id,
                        "cntCode": x.cntCode
                    })
                ));
                setCountryBuyTwilioNo(country);
            }
        })
    }
    useEffect(()=>{
        fetchData();
    },[]);
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mx-auto">
                    <p><strong>SMS Info</strong></p>
                    <FormGroup className="mt-3">
                        <InputField
                            type="text"
                            id="vheading"
                            name="vheading"
                            value={data?.vheading || ""}
                            onChange={handleDataChange}
                            label="Customize Your SMS Polling Title Here"
                        />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <InputField
                            type="text"
                            id="tdetail"
                            name="tdetail"
                            value={data?.tdetail || ""}
                            onChange={handleDataChange}
                            label="SMS Polling Description"
                            multiline={true}
                            minRows={4}
                        />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <InputField
                            type="text"
                            id="twelcomeMsg"
                            name="twelcomeMsg"
                            value={data?.twelcomeMsg || ""}
                            onChange={handleDataChange}
                            label="Customize Your Welcome Message Here"
                            multiline={true}
                            minRows={4}
                        />
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <InputField
                            type="text"
                            id="tfinalMsg"
                            name="tfinalMsg"
                            value={data?.tfinalMsg || ""}
                            onChange={handleDataChange}
                            label="Customize Your Finalize Message Here"
                            multiline={true}
                            minRows={4}
                        />
                    </FormGroup>
                    <div className="col-12 mt-3 mb-3" align="center">
                        <>
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/managesmspolling")}} className="mr-3">
                                <i className="far fa-times mr-2"></i>CANCEL
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3 nextClick"
                                onClick={() => {handleNextClick()}}
                                title="Changes will be committed!!"
                                data-toggle="tooltip"
                            >
                                <i className="far fa-long-arrow-right mr-2"></i>NEXT
                            </Button>
                        </>
                    </div>
                </Col>
            </Row>
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
                        <Col xs={3}><Button variant="contained" color="primary" className="mt-3" onClick={()=>{searchBuyTwilioNo()}} >SEARCH</Button></Col>
                    </Row>
                    <div className="borderBottomContactBox"></div>
                    {
                        dataSearchTwilioNo.length > 0 && msgSearchTwilioNo === "" ?
                            <Row>
                                <RadioGroup className="w-100" row aria-label="twilioNumber" name="twilioNumber" value={dataBuyTwilioNo?.twilioNumber || ""} onChange={(e)=>{handleChangeBuyTwilioNo(e.target.name,e.target.value)}}>
                                    {
                                        dataSearchTwilioNo.map((value,index)=>(
                                            <Col xs={3} key={index}>
                                                <FormControlLabel className="mb-0" value={value.phoneNumber} control={<Radio color="primary" />} label={displayFormatNumber(value.friendlyName,value.countryCode)} />
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
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=>{saveBuyTwilioNo()}} >SAVE</Button>
                    <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleBuyTwilioNo()}} >CANCEL</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        confirmDialog: (data) => {dispatch(setConfirmDialogAction(data))},
        setLoader: (data) => {dispatch(setLoader(data))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SmsInfo);