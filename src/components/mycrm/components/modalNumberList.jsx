import React from "react";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const ModalNumberList = ({
    modalNumberList,
    toggleNumberList = () => { },
    freeNumber,
    usedNumber,
    selectRadioNumber,
    defaultYN,
    setDefaultYN = () => { },
    handleChangeFreeNumberList = () => { },
    handleChangeSelectNumberType = () => { },
    selectedFreeNumber,
    setSelectedFreeNumber,
    selectedUsedNumber,
    setSelectedUsedNumber,
    handleChangeUsedNumberList = () => { }
}) => {
    return (
        <Modal size="lg" isOpen={modalNumberList} toggle={toggleNumberList}>
            <ModalHeader toggle={toggleNumberList}>Number List</ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs={11} className="mx-auto">
                        <p>To start SMS Chat, choose one of the following action.</p>
                        <RadioGroup row aria-label="selectRadioNumber" id="selectRadioNumber" name="selectRadioNumber" value={selectRadioNumber} onChange={(event) => { handleChangeSelectNumberType(Number(event.target.value)) }}>
                            {freeNumber.length > 0 && <FormControlLabel value={1} control={<Radio color="primary" />} label="Free Number List" />}
                            {usedNumber.length > 0 && <FormControlLabel value={2} control={<Radio color="primary" />} label="Used Number List" />}
                            <FormControlLabel value={3} control={<Radio color="primary" />} label="New number" />
                        </RadioGroup>
                        {
                            selectRadioNumber === 1 ?
                                <>
                                    <hr />
                                    <RadioGroup row aria-label="numberList" name="numberList" value={selectedFreeNumber}>
                                        {
                                            freeNumber.map((v, i) => (
                                                <FormControlLabel className="mb-0 w-25 mr-0 pr-3" value={v.scmNumber} key={i} control={<Radio color="primary" onChange={() => { setSelectedFreeNumber(v.scmNumber) }} />} label={v.scmNumber} />
                                            ))
                                        }
                                    </RadioGroup>
                                    <FormControl className="w-100">
                                        <FormControlLabel control={<Checkbox color="primary" checked={defaultYN === "Y"} onChange={(event) => { setDefaultYN(defaultYN === "N" ? "Y" : "N") }} />} label="Default for SMS Chat" />
                                    </FormControl>
                                </>
                                : null
                        }
                        {
                            selectRadioNumber === 2 ?
                                <>
                                    <hr />
                                    <RadioGroup row aria-label="usedNumberList" name="usedNumberList" value={selectedUsedNumber}>
                                        {
                                            usedNumber.map((v, i) => (
                                                <FormControlLabel key={i} className="mb-0 w-25 mr-0 pr-3" value={v.scmNumber} control={<Radio color="primary" onChange={() => { setSelectedUsedNumber(v.scmNumber) }} />} label={v.scmNumber} />
                                            ))
                                        }
                                    </RadioGroup>
                                    <FormControl className="w-100">
                                        <FormControlLabel control={<Checkbox color="primary" checked={defaultYN === "Y"} onChange={(event) => { setDefaultYN(defaultYN === "N" ? "Y" : "N") }} />} label="Default for SMS Chat" />
                                    </FormControl>
                                </>
                                : null
                        }
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                {(selectRadioNumber === 1 || selectRadioNumber === 2) && <Button variant="contained" color="primary" onClick={selectRadioNumber === 1 ? handleChangeFreeNumberList : selectRadioNumber === 2 ? handleChangeUsedNumberList : null} className="mr-2">Save</Button>}
                <Button variant="contained" color="primary" onClick={toggleNumberList}>CLOSE</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNumberList