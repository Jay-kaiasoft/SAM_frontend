import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import InputField from "../../shared/commonControlls/inputField"
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import DropDownControls from "../../shared/commonControlls/dropdownControl"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import NumberField from "../../shared/commonControlls/numberField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { dateFormat } from "../../../assets/commonFunctions";

const ModalCreateContact = ({
    modalCreateContact,
    createContactData,
    inputRefsCreateContact,
    numberRefsCreateContact,
    createContactUdf,
    createContactInputRefsCount,
    dropDownRefsCreateContact,
    country,
    language,
    state,
    groupSegmentDetails,
    user,
    createContactUdfList = () => { },
    changeCountry = () => { },
    toggleCreateContact = () => { },
    submitFormCreateContact = () => { },
    createContactHandleChange = () => { }
}) => {
    return (
        <Modal isOpen={modalCreateContact} toggle={toggleCreateContact}>
            <form onSubmit={submitFormCreateContact}>
                <ModalHeader toggle={toggleCreateContact}>Add Member</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={10} className="mx-auto">
                            <h4>Member Fields</h4>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[0]}
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.firstName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[1]}
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.lastName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[2]}
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    label="Full Name"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.fullName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[3]}
                                    type="text"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.email || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <NumberField
                                    ref={numberRefsCreateContact.current[0]}
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Mobile Number"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.phoneNumber || ""}
                                    format="####################"
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <NumberField
                                    ref={numberRefsCreateContact.current[1]}
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.phone || ""}
                                    format="####################"
                                />
                            </FormGroup>
                            <FormGroup component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup row aria-label="gender" name="gender" value={createContactData?.gender || ""} onChange={(e) => { createContactHandleChange(e.target.name, e.target.value) }}>
                                    <FormControlLabel className="mb-0" value="Male" control={<Radio color="primary" />} label="Male" />
                                    <FormControlLabel className="mb-0" value="Female" control={<Radio color="primary" />} label="Female" />
                                </RadioGroup>
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={new Date(createContactData?.birthday) || null}
                                        label="Date Of Birth (MM/DD/YYYY)"
                                        inputFormat="MM/dd/yyyy"
                                        onChange={(Value) => { createContactHandleChange("birthday", dateFormat(Value)) }}
                                        slotProps={{ textField: { variant: "standard", className: "w-100" } }}
                                        maxDate={new Date()}
                                    />
                                </LocalizationProvider>
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                {
                                    country.length > 0 ?
                                        <DropDownControls
                                            ref={dropDownRefsCreateContact.current[0]}
                                            id="country"
                                            name="country"
                                            label="Country"
                                            onChange={(e, v) => { createContactHandleChange(e, v); changeCountry(v); }}
                                            validation={"required"}
                                            value={createContactData.country || country.filter((v) => (v.id === Number(user.country)))[0].value}
                                            dropdownList={country}
                                        />
                                        : null
                                }
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefsCreateContact.current[1]}
                                    id="stateProvRegion"
                                    name="stateProvRegion"
                                    label="State"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.stateProvRegion || ''}
                                    dropdownList={state}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[4]}
                                    type="text"
                                    id="streetAddress1"
                                    name="streetAddress1"
                                    label="Street Address1"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.streetAddress1 || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[5]}
                                    type="text"
                                    id="streetAddress2"
                                    name="streetAddress2"
                                    label="Street Address2"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.streetAddress2 || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[6]}
                                    type="text"
                                    id="city"
                                    name="city"
                                    label="City"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.city || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefsCreateContact.current[7]}
                                    type="text"
                                    id="zipPostalCode"
                                    name="zipPostalCode"
                                    label="Zip / Post Code "
                                    onChange={createContactHandleChange}
                                    value={createContactData?.zipPostalCode || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <DropDownControls
                                    ref={dropDownRefsCreateContact.current[2]}
                                    id="usDefaultLanguage"
                                    name="usDefaultLanguage"
                                    label="Language"
                                    onChange={createContactHandleChange}
                                    value={createContactData?.usDefaultLanguage || ""}
                                    dropdownList={language}
                                />
                            </FormGroup>
                            <h4>Opt In</h4>
                            <FormControl className="mb-4">
                                <FormLabel id="demo-controlled-radio-buttons-group">If you want to send Opt In message, please select option below</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="optInType"
                                    value={createContactData?.optInType}
                                    onChange={(e)=>{createContactHandleChange(e.target.name, e.target.value);}}
                                >
                                    <FormControlLabel className="mb-0" value="email" control={<Radio />} label="Email" />
                                    <FormControlLabel className="mb-0" value="sms" control={<Radio />} label="SMS" />
                                    <FormControlLabel className="mb-0" value="both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                            <h4>Groups</h4>
                            <p>Check a group to add person to group.</p>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="groupId" name="groupId" value={Number(createContactData?.groupId) || ""} onChange={(e) => { createContactHandleChange(e.target.name, e.target.value); createContactUdfList(e.target.value); }}>
                                    {groupSegmentDetails.map((value, index) => {
                                        return (
                                            value.lockGroup !== "Y" && <FormControlLabel key={index} className="mb-0 text-capitalize" value={value.groupId} control={<Radio color="primary" />} label={value.groupName} />
                                        )
                                    })}
                                </RadioGroup>
                            </FormControl>
                            {
                                createContactUdf.length > 0 ?
                                    <>
                                        <h4 className="mt-4">Custom Fields</h4>
                                        {
                                            createContactUdf.map((value, index) => {
                                                return (
                                                    <FormGroup key={index} className='mb-4'>
                                                        <InputField
                                                            ref={inputRefsCreateContact.current[createContactInputRefsCount++]}
                                                            type="text"
                                                            id={`udf${value.udfLabel}`}
                                                            name={`udf${value.udfLabel}`}
                                                            label={value.udf}
                                                            onChange={createContactHandleChange}
                                                            value={createContactData[`udf${value.udfLabel}`] || ""}
                                                        />
                                                    </FormGroup>
                                                );
                                            })
                                        }
                                    </>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="contained" color="primary" className="mr-2 addMember">CREATE</Button>
                    <Button variant="contained" color="primary" onClick={() => toggleCreateContact()} >CANCEL</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ModalCreateContact