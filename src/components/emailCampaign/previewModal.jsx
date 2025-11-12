import React from "react";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {Button, Autocomplete, TextField, Chip} from "@mui/material";
import { validateEmail } from "../../assets/commonFunctions";

const PreviewModal = ({ modalSendPreviewEmail, toggleSendPreviewEmail, subMemberId, subEmail, email, contactSelected, setContactSelected, prevKeyStroke, setPrevKeyStroke, globalAlert, handleCallSendPreviewEmail }) => {
    return (
        <Modal isOpen={modalSendPreviewEmail} toggle={toggleSendPreviewEmail}>
            <ModalHeader toggle={toggleSendPreviewEmail}>Send Test Email</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={10} sm={10} md={10} lg={10} xl={10} className="mx-auto">
                        <p><strong>Send Test Email to Your Email :</strong></p>
                        <p>{subMemberId > 0 ? subEmail : email}</p>
                        <div>
                            <Autocomplete
                                freeSolo
                                multiple
                                autoSelect={true}
                                options={[]}
                                getOptionLabel={(option) => option?.label}
                                value={contactSelected}
                                onChange={(event, value,reason) => {
                                    if(reason === "selectOption"){
                                        if(typeof value[value.length-1] === "string"){
                                            if(validateEmail(value[value.length-1])){
                                                setContactSelected(prev=>{
                                                    return [...prev, value[value.length-1]]
                                                })
                                            }
                                        } else {
                                            if(validateEmail(value[value.length-1])){
                                                setContactSelected(prev=>{
                                                    return [...prev, value[value.length-1]]
                                                })
                                            }
                                        }
                                    } else if(reason === "removeOption"){
                                        setContactSelected(value);
                                    } else {
                                        if(validateEmail(value[value.length-1])){
                                            setContactSelected(prev=>{
                                                return [...prev, value[value.length-1]]
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
                                        label="Add Other Emails to Send Test Email"
                                        className="w-100"
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
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return typeof option === "object" ? (
                                            validateEmail(option.clientEmail) ? ( <Chip key={key} variant="default" label={option.clientEmail} {...tagProps} /> ) : ( value.splice(index, 1) )
                                        ) : (
                                            validateEmail(option) ? ( <Chip key={key} variant="default" label={option} {...tagProps} /> ) : ( value.splice(index, 1) )
                                        );
                                    })
                                }
                            />
                        </div>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={()=>handleCallSendPreviewEmail()} className='sendEmail'>SEND</Button>
                <Button variant="contained" color="primary" onClick={()=>toggleSendPreviewEmail()} className="ml-3">CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}

export default PreviewModal;