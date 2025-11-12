import React, {useState, useRef, createRef, Fragment, useEffect, useMemo} from 'react';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import InputField from "../shared/commonControlls/inputField.jsx";
import DropDownControls from "../shared/commonControlls/dropdownControl.jsx";
import { Button } from '@mui/material';
import { getUserType, getSubUsersList } from '../../services/profileService.js'
import { connect } from 'react-redux';
import { saveSubUsers } from '../../actions/userActions.js';
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import History from '../../history'
import { easUrlEncoder, validateEmail } from '../../assets/commonFunctions.js';
import { verifyEmail } from '../../services/userService.js';

const SubAcounts = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const { user } = props
    const userTemplate = { memberId: Number(id), parentMemberId: user.memberId, subaccountTypeId: "", firstName: "", lastName: "", email: "" };
    const inputRefs = useRef([createRef(), createRef(), createRef()]);
    const dropDownRefs = useRef([createRef()]);
    const [users, setUsers] = useState([userTemplate]);
    const [userType, setUserType] = useState([]);
    useEffect(() => {
        getUserType().then(res => {
            if (res.result) {
                if (res.result.subaccountType) {
                    let ut = [];
                    res.result.subaccountType.map(x => (
                        ut.push({
                            "key": x.styId,
                            "value": x.styName
                        })
                    ));
                    setUserType(ut);
                }
            }
        });
        if (id>0) {
            getSubUsersList().then(res => {
                if (res.result) {
                    if (res.result.subaccount) {
                        let data = res.result.subaccount.filter(x => x.memberId === Number (id));
                        setUsers(data);
                    }
                }
            });
        }
    }, [id,user.memberId]);


    const handleChange = (event, index) => {
        const updateUsers = users.map((user, i) => index === i ?
            Object.assign(user, { [event.target.name]: event.target.value }) : user);
        setUsers(updateUsers);
    };
    const cancel = () => {
        History.push("/manageusers");
    }

    const checkValidation = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
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
        return isValid;
    }

    const submitForm =async (e) => {
        e.preventDefault();
        setUsers((prev)=>{
            prev[0].btnType=e.nativeEvent.submitter.id;
            return prev;
        })
        const Valid = checkValidation();
        if(!Valid){
            return false;
        }
        for (let i = 0; i < users.length; i++) {
            if(!validateEmail(users[i].email)){
                props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
            let requestData = {
                "email": users[i].email,
                "memberId": id
            }
            const resV = await verifyEmail(requestData);
            if (resV.status !== 200) {
                props.globalAlert({
                    type: "Error",
                    text: resV.message,
                    open: true,
                });
                return false;
            }
        }
        if (Valid) {
            props.addSubUser(users);
        }
    }

    return (
        <Fragment >
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                            <h3 >Add Users</h3>
                        </Col>
                    </Row>

                    <Form onSubmit={submitForm}>
                        {/* <Row> */}
                            {users.map((user, index) => (
                                <Fragment key={index}>
                                    <Row>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3} >
                                            <FormGroup >
                                                <DropDownControls
                                                    ref={dropDownRefs.current[0]}
                                                    id={"subaccountTypeId" + index}
                                                    name="subaccountTypeId"
                                                    label="Sub Account Type"
                                                    onChange={handleChange}
                                                    index={index}
                                                    validation={"required"}
                                                    value={user?.subaccountTypeId || ""}
                                                    dropdownList={userType}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <FormGroup >
                                                <InputField
                                                    ref={inputRefs.current[0]}
                                                    type="text"
                                                    id={"firstName" + index}
                                                    name="firstName"
                                                    label="First Name"
                                                    onChange={handleChange}
                                                    validation={"required"}
                                                    index={index}
                                                    value={user?.firstName || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <FormGroup >
                                                <InputField
                                                    ref={inputRefs.current[1]}
                                                    type="text"
                                                    id={"lastName" + index}
                                                    name="lastName"
                                                    label="Last Name"
                                                    onChange={handleChange}
                                                    validation={"required"}
                                                    index={index}
                                                    value={user?.lastName || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <FormGroup >
                                                <InputField
                                                    ref={inputRefs.current[2]}
                                                    type="text"
                                                    id={"email" + index}
                                                    name="email"
                                                    label="Email"
                                                    onChange={handleChange}
                                                    validation={"required"}
                                                    index={index}
                                                    value={user?.email || ""}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {/* <Col xs={12} sm={12} md={2} lg={2} xl={2} className="pl-0">
                                        <FormGroup >
                                            <InputField
                                                ref={inputRefs.current[3]}
                                                index={index}
                                                type={showPassword ? 'text' : 'password'}
                                                id={"password" + index}
                                                name="password"
                                                label="Password"
                                                onChange={handleChange}
                                                validation={"required"}
                                                value={user?.password || ""}
                                                InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position="end">
                                                            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                }}
                                            />
                                        </FormGroup>
                                    </Col> */}
                                    {/* <Col xs={12} sm={12} md={2} lg={2} xl={2} className="pl-0">
                                        <div className={classes.addUserNumber}>
                                            <FormGroup >
                                                <NumberField
                                                    ref={numberRefs.current[0]}
                                                    index={index}
                                                    type="text"
                                                    id={"phone" + index}
                                                    name="phone"
                                                    label="Phone"
                                                    onChange={handleChange}
                                                    validation={"required"}
                                                    value={user?.phone || ""}
                                                />
                                            </FormGroup>
                                        </div>
                                        {
                                            index === 0 ?
                                                ""
                                            :
                                                <div className={classes.addUserDelButton}>
                                                    <i className="mx-0 mt-4 far fa-trash-alt" onClick={()=>{deleteUser(index)}} data-toggle="tooltip" title="Delete"></i>
                                                </div>
                                        }
                                    </Col> */}
                                </Fragment>
                            ))
                            }
                            {users.length > 0 &&
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {id>0 && <Button id="update" type="submit" variant="contained" className="mr-2" color="primary">UPDATE</Button>}
                                        <Button id="sendInvitation" type="submit" variant="contained" color="primary">SEND INVITATION</Button>
                                        <Button type="button" variant="contained" className="ml-2" color="primary" onClick={() => cancel()}>CANCEL</Button>
                                    </Col>
                                </Row>
                            }
                        {/* </Row> */}
                    </Form>
                </Col>
            </Row>
        </Fragment>
    )
}


const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addSubUser: (data) => {
            dispatch(saveSubUsers(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubAcounts);