import React, {useState} from "react";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import InputField from "../../../shared/commonControlls/inputField";
import {Button, Chip, TextField} from "@mui/material";
import {siteURL} from "../../../../config/api";
import {validateEmail} from "../../../../assets/commonFunctions";
import {Autocomplete} from "@mui/material";
import {getContactEmailList, getContactNumberList} from "../../../../services/clientContactService";
import {sendEmailAppointmentLink, sendSmsAppointmentLink} from "../../../../services/myCalendarServices";
import $ from "jquery";

const LinkSendToModal = ({shareModal, toggleShareModal, shareMedium, memberId, subMemberId, globalAlert})=>{
    const [appointmentLinkMsg, setAppointmentLinkMsg] = useState("You may access my calendar by clicking this URL : \n\n"+siteURL+"/appointment?v="+memberId);
    const [contactList, setContactList] = useState([]);
    const [contactSelected, setContactSelected] = useState([]);
    const [prevKeyStroke, setPrevKeyStroke] = useState("");
    const fetchContactListOnSearch = (searchText) => {
        if (searchText.length > 0) {
            getContactNumberList(searchText).then((res) => {
                if (res.status === 200) {
                    const contactList1 = res?.result?.contactList;
                    setContactList(contactList1);
                }
            })
        }
    }
    const fetchContactEmailListOnSearch =(searchText) => {
        if (searchText.length > 0) {
            getContactEmailList(searchText).then((res) => {
                if (res.status === 200) {
                    const contactList1 = res?.result?.contactList;
                    setContactList(contactList1);
                }
            })
        }
    }
    const validatePhoneNumber = (text)=>{
        if(text === "") return;
        let pattern = /^([+][0-9]{1,4}){0,1}([0-9]{7,15}){1}$/;
        return text.match(pattern);
    }
    const handleShareClick =async ()=>{
        if(contactSelected.length === 0){
            globalAlert({
                type: "Error",
                text: `Please enter at least one ${shareMedium === "Email"?"email":"mobile number"}`,
                open: true
            })
        } else if(appointmentLinkMsg === ""){
            globalAlert({
                type: "Error",
                text: "Message can not be empty",
                open: true
            })
        } else {
            let requestData = {
                message: appointmentLinkMsg,
                contactList: contactSelected,
                subMemberId:subMemberId
            };
            $("button.sendLink").remove();
            $('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>').insertAfter("button.publishGTCancel");
            $("button.publishGTCancel").remove();
            if(shareMedium === "SMS"){
                sendSmsAppointmentLink(requestData).then((res)=>{
                    if(res.status === 200){
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.result.error,
                            open: true
                        });
                    }
                    toggleShareModal();
                })
            }
            if(shareMedium === "Email"){
                sendEmailAppointmentLink(requestData).then((res)=>{
                    if(res.status === 200){
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.result.error,
                            open: true
                        });
                    }
                    toggleShareModal();
                })
            }
            setContactSelected([]);
        }
    }
    return (
        <Modal size="md" isOpen={shareModal}>
            <ModalHeader toggle={()=>{toggleShareModal();setContactSelected([]);}}>
                Send {shareMedium}
            </ModalHeader>
            <ModalBody className="px-4 py-2">
                <Row className="mx-0">
                    <Col md={12}>
                        {
                            shareMedium === "SMS" &&
                            <Autocomplete
                                freeSolo
                                multiple
                                autoSelect={true}
                                options={contactList.length > 0 ? contactList : []}
                                getOptionLabel={(option) => option?.label}
                                onChange={(event, value,reason) => {
                                    if(reason === "selectOption"){
                                        if(typeof value[value.length-1] === "string"){
                                            if(validatePhoneNumber(value[value.length-1])){
                                                setContactSelected(prev=>{
                                                    return [...prev, {"emailId": 0, "clientNumber": value[value.length-1]}]
                                                })
                                            }
                                        } else {
                                            if(validatePhoneNumber(value[value.length-1].clientNumber)){
                                                setContactSelected(prev=>{
                                                    return [...prev, {"emailId": Number(value[value.length-1].emailId), "clientNumber": value[value.length-1].clientNumber}]
                                                })
                                            }
                                        }
                                    } else if(reason === "removeOption"){
                                        setContactSelected(value);
                                    } else {
                                        if(validatePhoneNumber(value[value.length-1])){
                                            setContactSelected(prev=>{
                                                return [...prev, {"emailId": 0, "clientNumber": value[value.length-1]}]
                                            })
                                        }
                                    }
                                }}
                                onClick={(e)=>{e.preventDefault()}}
                                renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                        name="Mobile Number's"
                                        label="Mobile Number's"
                                        className="w-100"
                                        onChange={(event) => {
                                            fetchContactListOnSearch(event?.target?.value);
                                        }}
                                        onKeyDown={event => {
                                            if(event.key !== "Enter"){
                                                setPrevKeyStroke(event.key);
                                            }
                                            if(event.key === "Enter"){
                                                if(prevKeyStroke !== "ArrowDown" && prevKeyStroke !== "ArrowUp"){
                                                    if(!validatePhoneNumber(event.target.value)){
                                                        setTimeout(()=>{
                                                            globalAlert({
                                                                type: "Error",
                                                                text: "Please enter proper mobile number",
                                                                open: true
                                                            });
                                                        },300);
                                                        event.defaultMuiPrevented = true;
                                                    }
                                                }
                                            }
                                        }}
                                        onBlur={event=>{
                                            if(!validatePhoneNumber(event.target.value) && event.target.value !== ""){
                                                globalAlert({
                                                    type: "Error",
                                                    text: "Please enter proper mobile number",
                                                    open: true
                                                });
                                            }
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        typeof option === "object"?
                                            validatePhoneNumber(option.clientNumber) ? <Chip variant="default" label={option.clientNumber} {...getTagProps({ index })} /> : value.splice(index, 1)
                                        :
                                            validatePhoneNumber(option) ? <Chip variant="default" label={option} {...getTagProps({ index })} /> : value.splice(index, 1)
                                    ))
                                }
                            />
                        }
                        {
                            shareMedium === "Email" &&
                            <Autocomplete
                                freeSolo
                                multiple
                                autoSelect={true}
                                options={contactList.length > 0 ? contactList : []}
                                getOptionLabel={(option) => option?.label}
                                onChange={(event, value,reason) => {
                                    if(reason === "selectOption"){
                                        if(typeof value[value.length-1] === "string"){
                                            if(validateEmail(value[value.length-1])){
                                                setContactSelected(prev=>{
                                                    return [...prev, {"emailId": 0, "clientEmail": value[value.length-1]}]
                                                })
                                            }
                                        } else {
                                            if(validateEmail(value[value.length-1].clientEmail)){
                                                setContactSelected(prev=>{
                                                    return [...prev, {"emailId": Number(value[value.length-1].emailId), "clientEmail": value[value.length-1].clientEmail}]
                                                })
                                            }
                                        }
                                    } else if(reason === "removeOption"){
                                        setContactSelected(value);
                                    } else {
                                        if(validateEmail(value[value.length-1])){
                                            setContactSelected(prev=>{
                                                return [...prev, {"emailId": 0, "clientEmail": value[value.length-1]}]
                                            })
                                        }
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        variant="standard"
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                        id="email"
                                        name="email"
                                        label="Email"
                                        className="w-100"
                                        onChange={(event) => {
                                            fetchContactEmailListOnSearch(event?.target?.value);
                                        }}
                                        onKeyDown={event => {
                                            if(event.key !== "Enter"){
                                                setPrevKeyStroke(event.key);
                                            }
                                            if(event.key === "Enter"){
                                                if(prevKeyStroke !== "ArrowDown" && prevKeyStroke !== "ArrowUp"){
                                                    if(!validateEmail(event.target.value)){
                                                        setTimeout(()=>{
                                                            globalAlert({
                                                                type: "Error",
                                                                text: "Please enter proper email",
                                                                open: true
                                                            });
                                                        },300);
                                                        event.defaultMuiPrevented = true;
                                                    }
                                                }
                                            }
                                        }}
                                        onBlur={event=>{
                                            if(!validateEmail(event.target.value) && event.target.value !== ""){
                                                globalAlert({
                                                    type: "Error",
                                                    text: "Please enter proper email",
                                                    open: true
                                                });
                                            }
                                        }}
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        typeof option === "object" ?
                                            validateEmail(option.clientEmail) ? <Chip variant="default" label={option.clientEmail} {...getTagProps({ index })} /> : value.splice(index, 1)
                                        :
                                            validateEmail(option) ? <Chip variant="default" label={option} {...getTagProps({ index })} /> : value.splice(index, 1)
                                    ))
                                }
                            />
                        }
                    </Col>
                </Row>
                <Row className="mt-4 mx-0">
                    <Col md={12} className="mx-auto">
                        <InputField
                            id="message"
                            multiline
                            value={appointmentLinkMsg}
                            minRows={6}
                            onChange={(_, val)=>{
                                setAppointmentLinkMsg(val);
                            }}
                            label="Message"
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={handleShareClick} className="ml-3 sendLink">SEND</Button>
                <Button variant="contained" color="primary" onClick={()=>{toggleShareModal();setContactSelected([]);}} className="ml-3 publishGTCancel">CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}

export default LinkSendToModal;
