import React, { createRef, useEffect, useRef, useState } from "react";
import {Col, FormGroup, Row, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, Link} from "@mui/material";
import { handleClickHelp } from '../../../assets/commonFunctions';
// import { checkAuthorized } from "../../../services/commonService";
import InputField from "../../shared/commonControlls/inputField";
import { buyWarmupService } from "../../../services/profileService";
import History from './../../../history';
import { websiteTitle } from "../../../config/api";

export const ModalDomainVerificationSuccessfully = ({modalWarmUp,toggleWarmUp,warmUpPrice,toggleBuyWarmUp,confirmDialog,pendingTransaction}) => {
    // const handleClickBuyTheService = () => {
    //     checkAuthorized().then(res => {
    //         if (res.status === 200) {
    //             toggleWarmUp();
    //             toggleBuyWarmUp();
    //         } else {
    //             confirmDialog({
    //                 open: true,
    //                 title: 'Your credit card is not available. Please add it.',
    //                 onConfirm: () => {
    //                     pendingTransaction([{
    //                         "pendingTransactionType": "buyEmailWarmUp"
    //                     }]);
    //                     History.push("/carddetails");
    //                 }
    //             })
    //         }
    //     })
    // }
    return (
        <Modal size="lg" isOpen={modalWarmUp} toggle={toggleWarmUp}>
            <ModalHeader toggle={toggleWarmUp}>Domain Verification Successfully</ModalHeader>
            <ModalBody>
                <p className="mb-0">Your Domain has been successfully verified.</p>
                {/* <p className="font-weight-bold mb-0">PLEASE READ</p>
                <p>{websiteTitle} highly recommends you warmup your domain on our email servers to minimize Junk and prevent your domain from being blocked. The cost is ${warmUpPrice}. Your exposure is greater the larger the size of your contact list. It is optional, but if you have greater then 6% bounce rate in your email addresses, we will require that you validate your emails and warmup your domain. Your first campaign will be sent out slowly according to a best practices Domain warmup schedule.</p>
                <p className="mb-0">To learn more, please view this knowledge base article.</p>
                <Link className="cursor-pointer" component="a" onClick={()=>{handleClickHelp("DomainandEmailVerification/Domain/Warmup/EmailWarnupSchedule-knowbestpractices.html")}}>Warmup Schedule</Link> */}
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=>{History.push("/domainemailverification");}} >OK</Button>
                {/* <Button variant="contained" color="primary" className="mr-2" onClick={()=>{handleClickBuyTheService()}} >BUY THE SERVICE</Button> */}
                {/* <Button variant="contained" color="primary" className="mr-2" onClick={()=> {toggleWarmUp();History.push("/domainemailverification");}} >CANCEL</Button> */}
            </ModalFooter>
        </Modal>
    );
}

export const ModalBuyEmailWarmUpService = ({modalBuyWarmUp,toggleBuyWarmUp,selectedDomain,globalAlert,warmUpPrice=0,displayDetails=false, size="md", subMemberId}) => {
    const inputRefs = useRef([createRef()]);
    const [data, setData] = useState({});
    const handleChange = (name, value) => {
        if(name === "warmDomain"){
            value=value.replace("http://", "").replace("https://", "").replace("www.", "").replace("/","");
        }
        setData(prev => ({ ...prev, [name]: value }))
    }
    const handleClickClose = () => {
        setData({"warmDomain":selectedDomain,"warmEmail":""});
        toggleBuyWarmUp();
    }
    const handleClickBuyEmailWarmUp = async() => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        let requestData = {
            ...data,
            "warmEmail": `${data.warmEmail}@${data.warmDomain}`,
            "subMemberId":subMemberId
        }
        buyWarmupService(requestData).then(res => {
            if(res.status === 200) {
                handleClickClose();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                History.push("/domainemailverification");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    useEffect(()=>{
        setData({"warmDomain":selectedDomain,"warmEmail":""});
    },[selectedDomain]);
    return (
        <Modal size={size} isOpen={modalBuyWarmUp} toggle={handleClickClose}>
            <ModalHeader toggle={handleClickClose}>Buy Domain Warmup Service</ModalHeader>
            <ModalBody>
                {
                    displayDetails === true &&
                    <div className="p-3">
                        <p className="font-weight-bold mb-0">PLEASE READ</p>
                        <p>{websiteTitle} highly recommends you warmup your domain on our email servers to minimize Junk and prevent your domain from being blocked. The cost is ${warmUpPrice}. Your exposure is greater the larger the size of your contact list.</p>
                        <p className="mb-0">To learn more, please view this knowledge base article.</p>
                        <p className="mb-4"><Link className="cursor-pointer" component="a" onClick={()=>{handleClickHelp("DomainandEmailVerification/Domain/Warmup/EmailWarnupSchedule-knowbestpractices.html")}}>Warmup Schedule</Link></p>
                    </div>
                }
                <Row>
                    <Col xs={size === "md" ? 10 : 8} className="mx-auto">
                        <FormGroup>
                            Domain : {data?.warmDomain}
                        </FormGroup>
                        <FormGroup>
                            <InputField
                                ref={inputRefs.current[0]}
                                type="text"
                                id="warmEmail"
                                name="warmEmail"
                                label="Email"
                                onChange={handleChange}
                                validation={"required"}
                                value={data?.warmEmail || ""}
                                InputProps={{
                                    endAdornment: `@${data.warmDomain}`
                                }}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=>{handleClickBuyEmailWarmUp()}} >BUY</Button>
                <Button variant="contained" color="primary" className="mr-2" onClick={()=> {handleClickClose()}} >CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}