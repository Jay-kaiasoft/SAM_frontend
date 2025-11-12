import React, { useEffect, useState } from "react"
import { connect } from "react-redux";
import { pathOr } from "ramda";
import { Col, Row, FormGroup } from "reactstrap";
import { Button, Input as MuiInput, InputLabel, InputAdornment, Menu, MenuItem } from '@mui/material';
import InputField from "../../shared/commonControlls/inputField";
import { getDomainEmailList } from "../../../services/profileService";

const FromInfo = ({
    data,
    handleDataChange,
    callFrom,
    firstName,
    lastName,
    email
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [emailList, setEmailList] = useState([]);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if (event.target.textContent) {
            handleDataChange("fromEmail", event.target.textContent)
        }
        setAnchorEl(null);
    };
    useEffect(() => {
        if(typeof data !== "undefined" && (typeof data?.fromEmail === "undefined" || data?.fromEmail === "" || data?.fromEmail === null) && (typeof data?.fromName === "undefined" || data?.fromName === "" || data?.fromName === null)){
            handleDataChange("fromEmail", email)
            handleDataChange("fromName", `${firstName} ${lastName}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, email, firstName, lastName]);
    useEffect(()=>{
        getDomainEmailList(1).then(res => {
            if (res.result.domainEmail) {
                setEmailList(res.result.domainEmail);
            }
        })
    },[]);
    return (
        <Row>
            <Col xl={callFrom === "Email" ? 12 : 10} className="mx-auto">
                <p className='heading-style'>Select From Email</p>
                <FormGroup className="mt-4">
                    <InputLabel htmlFor="fromAddress">From Email</InputLabel>
                    <MuiInput
                        id="fromAddress"
                        value={data?.fromEmail || ""}
                        disabled={true}
                        label="From Email"
                        sx={{ width: "100%" }}
                        endAdornment={
                            <InputAdornment position="end">
                                <Button
                                    id="basic-button"
                                    aria-controls="basic-menu"
                                    aria-haspopup="true"
                                    color="primary"
                                    variant="contained"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    style={{ marginTop: -5 }}
                                >
                                    <span className="">VERIFIED EMAIL</span>
                                    <i className="fas fa-caret-down ml-1"></i>
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {
                                        emailList.length > 0 ?
                                            emailList.map((it,i) => {
                                                return (
                                                    <MenuItem onClick={handleClose} key={i}>{it.email}</MenuItem>
                                                )
                                            })
                                        :
                                            <MenuItem>No verified email found</MenuItem>
                                    }
                                </Menu>
                            </InputAdornment>
                        }
                    />
                </FormGroup>
                <FormGroup className='mt-4'>
                    <InputField
                        type="text"
                        id="fromName"
                        name="fromName"
                        value={data?.fromName}
                        onChange={handleDataChange}
                        label="From Name"
                    />
                    <div className='mt-4'>
                        <InputField
                            type="text"
                            id="subject"
                            name="subject"
                            value={data?.subject}
                            onChange={handleDataChange}
                            label="Email Subject"
                        />
                    </div>
                </FormGroup>
            </Col>
        </Row>
    )
}
const mapStateToProps = state => {
    return {
        firstName: pathOr("", ["user", "firstName"], state),
        lastName: pathOr("", ["user", "lastName"], state),
        email: pathOr("", ["user", "email"], state)
    }
}
export default connect(mapStateToProps, null)(FromInfo);