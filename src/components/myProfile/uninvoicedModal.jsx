import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import {Row, Col, Table, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import { getUninvoicedList } from './../../services/profileService';
import { websiteName } from "../../config/api";

const UninvoicedModal = ({toggle, modal, user, modalData, handleCallDeleteAccount, handleClickPayNow, removeCreditCard = false, payCC = "", setPayCC = ()=>{}}) => {
    const [data, setData] = useState([]);
    useEffect(()=>{
        getUninvoicedList().then(res => {
            if (res.result.uninvoiced) {
                setData(res.result.uninvoiced);
            }
        });
    },[]);
    return (
        <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>{removeCreditCard ? "Remove Payment Profile" : "Remove Account"}</ModalHeader>
            <ModalBody>
                <p>Please note below that you have uninvoiced transaction(s).</p>
                <h5>Uninvoiced</h5>
                <div className="table-content-wrapper m-0">
                    <Table striped>
                        <thead>
                            <tr role="row">
                                <th width="80%">Plan Name</th>
                                <th className="text-center" width="20%">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{modalData.planName}</td>
                                <td className="text-center">{user.countryPriceSymbol}{modalData.planPrice}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                {
                    modalData.planName === "Pay as You Grow" ?
                        <div className="table-content-wrapper m-0">
                            <Table striped>
                                <thead>
                                    <tr role="row">
                                        <th width="60%">Info</th>
                                        <th className="text-center" width="20%">Contact</th>
                                        <th className="text-center" width="20%">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Contacts</td>
                                        <td className="text-center">{modalData.member}</td>
                                        <td className="text-center">{user.countryPriceSymbol}{modalData.pennyPerContactPrice}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    :
                        <div className="table-content-wrapper overflow-auto m-0" style={{maxHeight: 'calc(100vh - 500px)'}}>
                            <Table striped>
                                <thead>
                                    <tr role="row">
                                        <th className="text-center">No</th>
                                        <th className="text-center">Date</th>
                                        <th>Name</th>
                                        <th className="text-center">Type</th>
                                        <th className="text-center">Total Members /<br/>Responses</th>
                                        <th className="text-center">Approx Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ?
                                            data.map((value, index) =>
                                                <tr key={index}>
                                                    <td className="text-center">{index+1}</td>
                                                    <td className="text-center">{value.tranCampaignDate}</td>
                                                    <td className="white-space-pre-line">{value.tranCampaignName}</td>
                                                    <td className="text-center" style={{textTransform: 'capitalize'}}>{value.tranType === "sms" ? value.tranType.toUpperCase() : value.tranType}</td>
                                                    <td className="text-center">{value.tranTotalMember}</td>
                                                    <td className="text-center">{user.countryPriceSymbol}{value.tranTotalAmount.toFixed(2)}</td>
                                                </tr>
                                            ) 
                                        :
                                            <tr><td colSpan="6">No Data Found</td></tr>   
                                    }
                                </tbody>
                            </Table>
                        </div>
                }
                {
                    modalData.flag === 1 ?
                        <p className="mt-3"><strong>You have not accrued the minimum amount to be billed.</strong></p>
                    :
                        <p className="mt-3">You will be billed : {user.countryPriceSymbol+modalData.tranTotalMember}</p>
                }
                {
                    modalData.unInv === 1 && modalData.tranTotalMember>=modalData.invLessAmtNotCharge ?
                        null
                    :
                        <p id="paymentDownWithAcc">We will not bill you for this small invoice This one is on us. Thank you for using {websiteName}!</p>
                }
                {
                    (modalData.unInv !== 2 &&  removeCreditCard)  && 
                    <RadioGroup aria-label="payCC" id="payCC" name="payCC" value={payCC} onChange={(e)=>{setPayCC(e.target.value)}}>
                        <Row>
                            <Col md={12}>
                                <FormControlLabel value="currentCc" control={<Radio color="primary" />} label="Pay with current credit card and remove card" />
                            </Col>
                            <Col md={12}>
                                <FormControlLabel value="newCc" control={<Radio color="primary" />} label="Set new credit card" />
                            </Col>
                        </Row>
                    </RadioGroup>
                }
            </ModalBody>
            <ModalFooter>
                {
                    modalData.unInv === 2 &&  removeCreditCard ?
                        <Button variant="contained" color="primary" className="mr-3" onClick={()=>handleCallDeleteAccount()}>ADD NEW CREDIT CARD</Button>
                    :
                        modalData.unInv === 1 && modalData.tranTotalMember>=modalData.invLessAmtNotCharge ?
                            <Button variant="contained" color="primary" className="mr-3" onClick={()=>handleClickPayNow()}>{payCC === "newCc" ? "SET NOW" : "PAY NOW"}</Button>
                        :
                            <Button variant="contained" color="primary" className="mr-3" onClick={()=>handleCallDeleteAccount()}>Done</Button>
                }
                <Button variant="contained" color="primary" onClick={()=>toggle()} >CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps,null)(UninvoicedModal);