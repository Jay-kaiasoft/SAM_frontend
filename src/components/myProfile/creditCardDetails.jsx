import React, {useState, useRef, createRef, Fragment, useEffect, useCallback} from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import InputField from '../shared/commonControlls/inputField.jsx';
import NumberField from '../shared/commonControlls/numberField.jsx';
import DropDownControls from '../shared/commonControlls/dropdownControl.jsx';
import Button from '@mui/material/Button';
import { checkPassword, getCreditCardDetails, removeCreditCard } from '../../services/profileService.js';
import History from "../../history";
import { saveCreditCardDetails, removeCardDetails, updateCardDetails, loadCreditCardDetails} from '../../actions/userActions.js';
import { connect } from 'react-redux';
import {getCountry, getCountryToState, validatePhoneFormat} from "../../services/commonService";
import {displayCountryId} from "../../assets/commonFunctions";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import UninvoicedModal from './uninvoicedModal.jsx';
import { setConfirmDialogAction } from '../../actions/confirmDialogActions.js';
import { updateCreditCardDetails } from '../../services/userService.js';
import creditCardType from "credit-card-type";
import { InputAdornment } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { websiteName, websiteTitle } from '../../config/api.js';

const CreditCardDetails = (props) => {
    const { user } = props;
    const { cardDetail } = props;
    const inputRefs = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const numberRefs = useRef([createRef(), createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef(), createRef()]);
    const [data, setData] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [payCC, setPayCC] = useState("currentCc");
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setPayCC("currentCc");
        setModal(!modal);
    };
    const [modalData, setModalData] = useState({});
    const [addNewCcData, setAddNewCcData] = useState({});
    const [creditCardTypeName, setCreditCardTypeName] = useState("");
    const [creditCardCVV, setCreditCardCVV] = useState(4);
    const [creditCardFormat, setCreditCardFormat] = useState([4, 8, 12]);
    const [creditCardLength, setCreditCardLength] = useState([16]);
    const [focusedElement, setFocusedElement] = useState("name");
    const handleChange = (name, value) => {
        if(name === "cardNumber"){
            if(value.trim().length > 3){
                var visaCards = creditCardType(value);
                if(visaCards.length > 0){
                    setCreditCardTypeName(visaCards[0].niceType);
                    setCreditCardCVV(visaCards[0].code.size);
                    setCreditCardFormat(visaCards[0].gaps);
                    setCreditCardLength(visaCards[0].lengths);
                } else {
                    setCreditCardTypeName("");
                    setCreditCardCVV(4);
                    setCreditCardFormat([4, 8, 12]);
                    setCreditCardLength([16]);
                }
            } else {
                setCreditCardTypeName("");
                setCreditCardCVV(4);
                setCreditCardFormat([4, 8, 12]);
                setCreditCardLength([16]);
            }
        }
        setData(prev => ({ ...prev, [name]: value }))
    }
    const fetchData = () => {
        getCountry().then(res => {
            if (res.result.country) {
                let country = []
                res.result.country.map(x => (
                    country.push({
                        "key": String(x.id),
                        "value": x.cntName
                    })
                ));
                setCountry(country);
            }
        })
    }
    const changeCountry = (countryId) => {
        getCountryToState(countryId).then(res => {
            if (res.result.state) {
                let state = [];
                res.result.state.map(x => (
                    state.push({
                        "key": x.stateLong,
                        "value": x.stateLong
                    })
                ));
                setState(state);
            }
        });
    }
    const getCCDetials = useCallback(() => {
        if(typeof addNewCcData.newCc === "undefined" || addNewCcData.newCc === null || addNewCcData.newCc === ""){
            if(cardDetail){
                setData(cardDetail);
                changeCountry(cardDetail.country);
            } else {
                getCreditCardDetails().then(res => {
                    if (res.result.paymentProfile) {
                        props.loadCreditCardDetails(res.result.paymentProfile);
                        setData(res.result.paymentProfile);
                        changeCountry(res.result.paymentProfile.country);
                    } else {
                        setData(user);
                        changeCountry(user.country);
                    }
                })
            }
        }
    },[user,cardDetail,props,addNewCcData.newCc])
    useEffect(() => {
        fetchData();
        getCCDetials();
    }, [getCCDetials])

    const submitForm =async (e) => {
        e.preventDefault();
        let isValid = true;
        let i = cardDetail ? 0 : 2 ;
        for (i; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < numberRefs.current.length; i++) {
            const valid = numberRefs.current[i].current.validateNumber()
            if (!valid) {
                isValid = false
            }
        }
        for (let i = 0; i < dropDownRefs.current.length; i++) {
            const valid = dropDownRefs.current[i].current.validateDropDown()
            if (!valid) {
                isValid = false
            }
        }
        if(typeof data.phone !== "undefined" && data.phone !== "" && data.phone !== null){
            let isValidPh = await validatePhoneFormat(user.country, numberRefs.current[3].current.getValue());
            if(!isValidPh){
                props.globalAlert({
                    type: "Error",
                    text: `Invalid phone number format or Do not put a national prefix on your phone number. ${websiteTitle} will set the national prefix by your contacts country setting to ensure it is correct`,
                    open: true
                })
                return;
            }
        }
        if (!isValid) {
            return
        }
        let requestData = {
            "memberId": user.memberId,
            "cardNumber": data.cardNumber.replace(/ /g,""),
            "expMonthYear": data.expMonthYear,
            "cardCode": data.cardCode,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "address": data.address,
            "city": data.city,
            "state": data.state,
            "postCode": data.postCode,
            "country": data.country,
            "phone": data.phone,
            "email": user.email,
            "businessName": data.businessName
        }
        if(typeof addNewCcData.newCc === "undefined" || addNewCcData.newCc === null || addNewCcData.newCc === ""){
            props.setCreditCardDetails(requestData);
        } else {
            updateCreditCardDetails(requestData).then((res)=>{
                if(res.status === 200){
                    props.globalAlert({
                        type: "Success",
                        text: res?.message,
                        open: true
                    });
                    setAddNewCcData({});  
                } else{
                    props.globalAlert({
                        type: "Error",
                        text: res?.message,
                        open: true
                    });
                }
            });  
        }
    }
    const handleClickPayNow = () =>{
        let requestData = {
            "deleteProfileMode":1,
            "daLeavingDetails":"",
            "chkPayNow":payCC,
            "newCc":""
        }
        removeCreditCard(requestData).then((res)=>{
            if(res.status === 200){
                if(res.result.newCc === "newCc"){
                    setAddNewCcData(res.result);
                    props.loadCreditCardDetails(null);
                    setData(null);
                    setData(user);
                    toggle();
                } else {
                    props.globalAlert({
                        type: "Success",
                        text: res?.message,
                        open: true
                    });
                    props.loadCreditCardDetails(null);
                    setData(null);
                    setData(user);
                    toggle();
                }
            } else{
                props.globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const handleCallDeleteAccount = () => {
        props.confirmDialog({
            open: true,
            title: 'Adding new credit card will replace saved credit card.\nAre you sure you want to add new credit card?',
            onConfirm: ()=>{
                props.removeCreditcardCard();
                setData(null);
                setData(user);
                toggle();
            }
        });
    }
    const removeCard = () => {
        let requestData = {
            "password": "",
            "flag": 0
        }
        checkPassword(requestData).then((res)=>{
            if(res.status === 200){
                setModalData(res.result);
                if(res.result.authorizeCustomerProfileId === "" || res.result.authorizeCustomerProfileId === null || res.result.tranTotalMember === 0){
                    props.confirmDialog({
                        open: true,
                        title: 'Are you sure you want to delete payment profile?',
                        onConfirm: ()=>{
                            props.removeCreditcardCard();
                            setData(null);
                            setData(user);
                        }
                    });
                } else if(res.result.unInv === 1 && res.result.tranTotalMember>=res.result.invLessAmtNotCharge){
                    toggle();
                } else {
                    toggle();
                }
            } else{
                props.globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }
    const cancelClick = () => {
        History.push("/memberinfo");
    }
    
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>Payment Profile</h3>
                </Col>
                <Col sm="12" md={{ size: 4, offset: 4 }} className='text-center'>
                    <img alt="sealserver" src="https://sealserver.trustwave.com/seal_image.php?customerId=ded751cddc1046b69288437788ee373b&size=105x54&style=invert" />
                    <img alt="authorize" className="pl-3" src="https://verify.authorize.net/anetseal/images/secure90x72.gif" />
                </Col>
                <Col sm="12" md={{ size: 4, offset: 4 }} className='text-center mt-3'>
                    <p>For your Security we do not store your Credit Card. Your Credit Card information is stored at <a href="http://www.authorize.net/" target="_blank" rel="noreferrer">http://www.authorize.net</a>  which is an industry leader in security and PCI credit card controls. You have the right to remove this Credit Card and delete your account profile at {websiteName} at any time.</p>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mt-5 mb-5'>Credit Card Details</h3>
                </Col>
            </Row>
            <Form onSubmit={submitForm}>
                <Row>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        {cardDetail ?
                            <>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[0]}
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        label="Card Number"
                                        onChange={handleChange}
                                        validation={"required"}
                                        value={data?.cardNumber || ""}
                                        disabled={true}
                                    />
                                </FormGroup>
                                <FormGroup className='mb-4'>
                                    <InputField
                                        ref={inputRefs.current[1]}
                                        type="text"
                                        id="cardType"
                                        name="cardType"
                                        label="Card Type"
                                        onChange={handleChange}
                                        validation={"required"}
                                        value={data?.cardType || ""}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </>
                        :
                            <>
                                <Cards
                                    number={data?.cardNumber || ""}
                                    expiry={data?.expMonthYear || ""}
                                    cvc={data?.cardCode || ""}
                                    name={data?.firstName+" "+data?.lastName || ""}
                                    focused={focusedElement}
                                />
                                <FormGroup className='mb-4 mt-4'>
                                    <NumberField
                                        ref={numberRefs.current[0]}
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        label="Card Number"
                                        onChange={handleChange}
                                        validation={`required|length:${creditCardLength.join(",")}`}
                                        value={data?.cardNumber || ""}
                                        format={
                                            (()=>{
                                                let str = "";
                                                let old = 0;
                                                creditCardFormat.forEach((v)=>{
                                                    str += "#".repeat(v-old)+" ";
                                                    old=v;
                                                })
                                                str += "#".repeat(creditCardLength[creditCardLength.length-1]-old)+" ";
                                                return str.trim();
                                            })()
                                        }
                                        InputProps={{endAdornment:<InputAdornment position="end">{creditCardTypeName}</InputAdornment>}}
                                        onFocus={()=>{setFocusedElement("number");}}
                                    />
                                </FormGroup>
                                <FormGroup className='mb-4'>
                                    <NumberField
                                        ref={numberRefs.current[1]}
                                        type="text"
                                        id="expMonthYear"
                                        name="expMonthYear"
                                        label="MM/YY"
                                        format="##/##"
                                        onChange={handleChange}
                                        validation={"required|min:5"}
                                        value={data?.expMonthYear || ""}
                                        onFocus={()=>{setFocusedElement("expiry");}}
                                    />
                                </FormGroup>
                                <FormGroup className='mb-4'>
                                    <NumberField
                                        ref={numberRefs.current[2]}
                                        type="text"
                                        id="cardCode"
                                        name="cardCode"
                                        label="CVV"
                                        onChange={handleChange}
                                        validation={`required|min:${creditCardCVV}`}
                                        value={data?.cardCode || ""}
                                        format={"#".repeat(creditCardCVV)}
                                        onFocus={()=>{setFocusedElement("cvc");}}
                                    />
                                </FormGroup>
                            </>
                        }

                        {cardDetail && props.subUser.memberId === 0 ? <><Button variant="contained" className="mt-3" color="primary" onClick={removeCard} >REMOVE CREDIT CARD</Button><Button variant="contained" className="mt-3 ml-2" color="primary" onClick={cancelClick}>Cancel</Button></> : null}

                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h3 className='text-center mt-5 mb-5'>Billing Details</h3>
                    </Col>
                    <Col sm="12" md={{ size: 4, offset: 4 }}>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[2]}
                                type="text"
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.firstName || ""}
                                disabled={cardDetail ? true : false}
                                onFocus={()=>{setFocusedElement("name");}}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[3]}
                                type="text"
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.lastName || ""}
                                disabled={cardDetail ? true : false}
                                onFocus={()=>{setFocusedElement("name");}}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[4]}
                                type="text"
                                id="businessName"
                                name="businessName"
                                label="Company"
                                onChange={handleChange}
                                value={data?.businessName || ""}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[5]}
                                type="text"
                                id="address"
                                name="address"
                                label="Address"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.address || ""}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[6]}
                                type="text"
                                id="city"
                                name="city"
                                label="City"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.city || ""}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <InputField
                                ref={inputRefs.current[7]}
                                type="text"
                                id="postCode"
                                name="postCode"
                                label="Zip"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.postCode || ""}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>

                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[0]}
                                name="country"
                                label="Country"
                                onChange={(e,v) => {handleChange(e,v);changeCountry(v);}}
                                validation={"required"}
                                value={Number.isInteger(Number(data?.country || "")) ? Number(data?.country || "") : Number(displayCountryId(data?.country || ""))}
                                dropdownList={country}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>

                        <FormGroup className='mb-4'>
                            <DropDownControls
                                ref={dropDownRefs.current[1]}
                                name="state"
                                label="State"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.state || ''}
                                dropdownList={state}
                                disabled={cardDetail ? true : false}
                            />
                        </FormGroup>

                        <FormGroup className='mb-4'>
                            <NumberField
                                ref={numberRefs.current[3]}
                                type="text"
                                id="phoneNumber"
                                name="phone"
                                label="Phone Number"
                                onChange={handleChange}
                                value={data?.phone || ""}
                                disabled={cardDetail ? true : false}
                                format="####################"
                            />
                        </FormGroup>
                        {!cardDetail ? <><Button type="submit" variant="contained" className="mt-3" color="primary">SAVE</Button><Button variant="contained" className="mt-3 ml-2" color="primary" onClick={cancelClick}>Cancel</Button></>
                        : null}
                    </Col>
                </Row>
            </Form>
            <UninvoicedModal toggle={toggle} modal={modal} modalData={modalData} handleCallDeleteAccount={handleCallDeleteAccount} handleClickPayNow={handleClickPayNow} removeCreditCard={true} payCC={payCC} setPayCC={setPayCC} />
        </Fragment>
    )
}

const mapStateToProps = (state) => { //store.getState()
    return {
        cardDetail: state.cardDetail,
        user: state.user,
        subUser: state.subUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCreditCardDetails: (data) => {
            dispatch(saveCreditCardDetails(data))
        },
        updateCreditCardDetails: (data) => {
            dispatch(updateCardDetails(data))
        },
        removeCreditcardCard: () => {
            dispatch(removeCardDetails())
        },
        loadCreditCardDetails: (data) => {
            dispatch(loadCreditCardDetails(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditCardDetails)