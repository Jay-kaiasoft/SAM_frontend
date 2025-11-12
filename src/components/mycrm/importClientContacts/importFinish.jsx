import React, { createRef, useEffect, useRef, useState } from 'react';
import { pathOr } from 'ramda';
import { connect } from 'react-redux';
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import {Row, Col, ModalHeader, ModalBody, ModalFooter, Modal, FormGroup} from 'reactstrap';
import InputField from "../../shared/commonControlls/inputField";
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import { addTempCronContact, searchForBuyNumber } from '../../../services/clientContactService';
import { setGlobalAlertAction } from '../../../actions/globalAlertActions';
import History from '../../../history';
import $ from "jquery"
import { checkAuthorized, getCountry } from '../../../services/commonService';
import { setPendingTransactionAction } from '../../../actions/pendingTransactionActions';
import { setLoader } from '../../../actions/loaderActions';
import { userLoggedIn } from '../../../actions/userActions';
import { setConfirmDialogAction } from '../../../actions/confirmDialogActions';
import { buyNumberForSmsCampaign } from '../../../services/smsCampaignService';
import { displayFormatNumber } from '../../../assets/commonFunctions';
import { websiteTitle } from '../../../config/api';
import { setSubUserAction } from '../../../actions/subUserActions';

const ImportFinish = ({
    onBackPress,
    onCancelPress,
    UDFs,
    transId,
    cronEndId,
    cronStartId,
    cronEmailVerification,
    cronOptInYN,
    mainFields,
    isPhoneNumber,
    memberId,
    groupID,
    globalAlert,
    cronCheckDuplicateYN,
    pendingTransaction,
    confirmDialog,
    userLoggedIn,
    setSubUserAction,
    setLoader,
    user,
    subUser
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
    const handleOnNext = () => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                if((typeof user.twilioNumber === "undefined" || user.twilioNumber === "" || user.twilioNumber === null) && cronOptInYN === "Y" && isPhoneNumber === true){
                    toggleBuyTwilioNo();
                } else {
                    handleCallImport();
                }
            } else {
                pendingTransaction([{
                    "pendingTransactionType": "addClientImport"
                }]);
                History.push("/carddetails");
            }
        });
    }
    const handleCallImport = () => {
        const payload = {
            cronMemberId: memberId,
            cronGroupId: groupID,
            cronStartId: cronStartId,
            cronEndId: cronEndId,
            udfs: UDFs,
            transId: transId,
            cronCheckDuplicateYN: cronCheckDuplicateYN,
            cronEmailVerification: cronEmailVerification,
            cronOptInYN: cronOptInYN,
            mainFields: mainFields,
        }
        $(`button.importFinish`).hide();
        $(`button.importFinish`).after(`<div class="lds-ellipsis ml-3 mr-3"><div></div><div></div><div></div>`);
        addTempCronContact(payload).then(resp => {
            if (resp && resp.status && resp.status === 200) {
                globalAlert({
                    type: "Success",
                    text: resp ? resp.message : "Success",
                    open: true
                })
                History.push("/clientContact");
            } else {
                globalAlert({
                    type: "Error",
                    text: resp ? resp.message : "Error",
                    open: true
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.importFinish`).show();
        })
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
            "flagType": "manage",
            "callForwardingCountryCode": dataBuyTwilioNo?.callForwardingCountryCode ? countryBuyTwilioNo.filter((x)=>{ return x.key === dataBuyTwilioNo?.callForwardingCountryCode })[0].cntCode : "",
            "callForwardingNumber": dataBuyTwilioNo?.callForwardingNumber || "",
            "checkForwardingYesNo": dataBuyTwilioNo.checkForwardingYesNo
        }
        buyNumberForSmsCampaign(d).then(res => {
            if (res.status === 200) {
                if(subUser.memberId > 0) {
                    setSubUserAction({ ...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber });
                    sessionStorage.setItem('subUser',JSON.stringify({...subUser, "twilioNumber": dataBuyTwilioNo.twilioNumber}));
                } else {
                    userLoggedIn({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber});
                    sessionStorage.setItem('user',JSON.stringify({...user, "twilioNumber": dataBuyTwilioNo.twilioNumber}));
                }
                toggleBuyTwilioNo();
                handleCallImport();
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
            <div className="body" style={{ minHeight: "450px" }}>
                <div className="mt-3 d-flex flex-column align-items-center">
                    <div className="w-50">
                        <p className="mb-0">You have successful uploaded your CSV/Excel.</p>
                        <p className="mb-0">Please click the <strong> Import and Finish </strong> button to commit the records.</p>
                        <p className="mb-0">The import process may take some time depending on the size of your data.</p>
                        <p className="mb-0">Thank you for patience!</p>
                    </div>
                    <div className="mt-3">
                        <Button variant="contained" color="primary" onClick={onBackPress}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                        <Button variant="contained" color="primary" className="ml-3 mr-3 importFinish"  onClick={() => handleOnNext()}><i className="far fa-check mr-2"></i>IMPORT AND FINISH</Button>
                        <Button variant="contained" color="primary" onClick={onCancelPress}><i className="far fa-times mr-2"></i>CANCEL</Button>
                    </div>
                </div>
            </div>
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
        UDFs: pathOr([], ["importContact", "udfs"], state),
        transId: pathOr("", ["importContact", "importContactData", "transId"], state),
        cronStartId: pathOr("", ["importContact", "importContactData", "cronStartId"], state),
        cronEndId: pathOr("", ["importContact", "importContactData", "cronEndId"], state),
        cronEmailVerification: pathOr("", ["importContact", "importContactData", "cronEmailVerification"], state),
        cronOptInYN: pathOr("", ["importContact", "importContactData", "cronOptInYN"], state),
        mainFields: pathOr("", ["importContact", "importContactData", "mainFields"], state),
        isPhoneNumber: pathOr("", ["importContact", "importContactData", "isPhoneNumber"], state),
        memberId: pathOr(null, ["user", "memberId"], state),
        groupID: pathOr("", ["importContact", "groupID"], state),
        cronCheckDuplicateYN: pathOr("", ["importContact", "cronCheckDuplicateYN"], state),
        user: state.user,
        subUser: state.subUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
        pendingTransaction: (data) => { dispatch(setPendingTransactionAction(data)) },
        confirmDialog: (data) => { dispatch(setConfirmDialogAction(data)) },
        userLoggedIn: (data) => { dispatch(userLoggedIn(data)) },
        setSubUserAction: (data) => { dispatch(setSubUserAction(data)) },
        setLoader: (data) => { dispatch(setLoader(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportFinish);