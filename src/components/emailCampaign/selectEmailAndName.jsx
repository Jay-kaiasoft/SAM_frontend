import React, {useCallback, useEffect, useRef, useState} from "react";
import { pathOr } from "ramda";
import { Col, Row } from "reactstrap";
import { Button, FormGroup, Menu, MenuItem, Input, InputLabel, InputAdornment, TextField} from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import { getDomainEmailList } from "../../services/profileService";
import {getGroupUDF} from "../../services/clientContactService";
import { handleClickHelp } from "../../assets/commonFunctions";

const innerHeading = {
    fontSize: 18
}

const SelectEmailAndName = ({
    handleBack,
    handleNext,
    data,
    setData,
    globalAlert,
    email,
    subEmail,
    subMemberId
}) => {
    const [emailList, setEmailList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cf, setCf] = useState([]);
    const [tempSubject, setTempSubject] = useState({"previewSubject": data?.previewSubject || "", "emailSubject": data?.emailSubject || "", "subject": data?.subject || "", "previewSubject2": data?.previewSubject2 || "", "emailSubject2": data?.emailSubject2 || "", "subject2": data?.subject2 || ""});
    const open = Boolean(anchorEl);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showSuggestions2, setShowSuggestions2] = useState(false);
    const [cursorWordRange, setCursorWordRange] = useState([0, 0]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRefEmailSubject = useRef();
    const inputRefEmailSubject2 = useRef();
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if(event.target.textContent !== "") {
            handleDataChange("fromAddress", event.target.textContent);
        }
        setAnchorEl(null);
    };
    const handleDataChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const displayGetDomainEmailList = useCallback(() =>{
        getDomainEmailList(1).then(res => {
            if (res.result.domainEmail) {
                setEmailList(res.result.domainEmail);
                if(data.fromAddress === ""){
                    let fromAddressTemp = subMemberId > 0 ? subEmail : email;
                    let emailData = res.result.domainEmail.filter((e)=>{return e.email === fromAddressTemp})
                    if(emailData.length === 0){
                        setData((prev)=>{
                            return {
                                ...prev,
                                fromAddress:""
                            }
                        })
                    } else {
                        setData((prev)=>{
                            return {
                                ...prev,
                                fromAddress: fromAddressTemp
                            }
                        })
                    }
                }
            }
        });
    },[setData, email, subEmail, subMemberId]);
    const handleOnNextClick = () => {
        if (data?.fromAddress === undefined || data?.fromAddress === "") {
            globalAlert({
                type: "Error",
                text: "Please Select a From Address",
                open: true
            })
            return
        }
        if (data?.fromName1 === undefined || data?.fromName1 === "") {
            globalAlert({
                type: "Error",
                text: "From Name can not be blank.",
                open: true
            })
            return
        }
        if (data.testingType && [3, 4, 5].includes(data.testingType)) {
            if (data?.fromName2 === undefined || data?.fromName2 === "") {
                globalAlert({
                    type: "Error",
                    text: "From Name can not be blank.",
                    open: true
                })
                return
            }
        }
        if (tempSubject?.emailSubject === undefined || tempSubject?.emailSubject === "") {
            globalAlert({
                type: "Error",
                text: "Subject can not be blank.",
                open: true
            })
            return
        }
        if (data.testingType && [1, 4, 5].includes(data.testingType)) {
            if (tempSubject?.emailSubject2 === undefined || tempSubject?.emailSubject2 === "") {
                globalAlert({
                    type: "Error",
                    text: "Subject can not be blank.",
                    open: true
                })
                return
            }
        }
        setData((prev) => {
            return { ...prev, ...tempSubject };
        });
        handleNext(1)
    }
    const handleClickOnBack = () => {
        setData((prev) => {
            return { ...prev, ...tempSubject };
        });
        handleBack(1);
    }
    const getWordAtCursor = (text, cursorPos) => {
        const isWordChar = (char) => /\w|#/.test(char);
        let start = cursorPos;
        let end = cursorPos;
        while (start > 0 && isWordChar(text[start - 1])) {
            start--;
        }
        while (end < text.length && isWordChar(text[end])) {
            end++;
        }
        return {
            word: text.slice(start, end),
            range: [start, end],
        };
    };
    const handleChange = (e) => {
        const userInput = e.target.value;
        const cursorPos = e.target.selectionStart;
        setTempSubject((prev) => {
            return { ...prev, previewSubject: userInput, emailSubject: userInput, subject: userInput};
        });
        const { word, range } = getWordAtCursor(userInput, cursorPos);
        setCursorWordRange(range);
        setShowSuggestions(word.startsWith("#"));
        setActiveIndex(-1);
    };
    const handleKeyDown = (e) => {
        const cursorStart = e.target.selectionStart;
        const cursorEnd = e.target.selectionEnd;
        const userInput = e.target.value;

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            if (cursorStart !== cursorEnd) {
                let start = cursorStart;
                let end = cursorEnd;
                const placeholderRegex = /##\w+?##/g;
                let match;
                while ((match = placeholderRegex.exec(userInput)) !== null) {
                    const placeholderStart = match.index;
                    const placeholderEnd = match.index + match[0].length;
                    if (cursorStart <= placeholderEnd && cursorEnd >= placeholderStart) {
                        start = Math.min(start, placeholderStart);
                        end = Math.max(end, placeholderEnd);
                    }
                }
                const newValue = userInput.slice(0, start) + userInput.slice(end);
                setTempSubject((prev) => {
                    return { ...prev, previewSubject: newValue, emailSubject: newValue, subject: newValue};
                });
                setShowSuggestions(false);
                requestAnimationFrame(() => {
                    if (inputRefEmailSubject.current) {
                        inputRefEmailSubject.current.focus();
                        inputRefEmailSubject.current.setSelectionRange(start, start);
                    }
                });
            } else {
                const { word, range } = getWordAtCursor(userInput, cursorStart);
                if (word.match(/##\w+?##/)) {
                    const [start, end] = range;
                    const newValue = userInput.slice(0, start) + userInput.slice(end);
                    setTempSubject((prev) => {
                        return { ...prev, previewSubject: newValue, emailSubject: newValue, subject: newValue};
                    });
                    setShowSuggestions(false);
                    requestAnimationFrame(() => {
                        if (inputRefEmailSubject.current) {
                            inputRefEmailSubject.current.focus();
                            inputRefEmailSubject.current.setSelectionRange(start, start);
                        }
                    });
                } else {
                    let newValue = userInput;
                    let newCursorPos = cursorStart;
                    if (e.key === "Backspace" && cursorStart > 0) {
                        newValue = userInput.slice(0, cursorStart - 1) + userInput.slice(cursorStart);
                        newCursorPos = cursorStart - 1;
                    } else if (e.key === "Delete" && cursorStart < userInput.length) {
                        newValue = userInput.slice(0, cursorStart) + userInput.slice(cursorStart + 1);
                        newCursorPos = cursorStart;
                    }
                    setTempSubject((prev) => {
                        return { ...prev, previewSubject: newValue, emailSubject: newValue, subject: newValue};
                    });
                    setShowSuggestions(false);
                    requestAnimationFrame(() => {
                        if (inputRefEmailSubject.current) {
                            inputRefEmailSubject.current.focus();
                            inputRefEmailSubject.current.setSelectionRange(newCursorPos, newCursorPos);
                        }
                    });
                }
            }
        } else if (showSuggestions) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => (prev < cf.length - 1 ? prev + 1 : 0));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : cf.length - 1));
            } else if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick(cf[activeIndex]);
            } else if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        }
    };
    const handleSuggestionClick = (suggestion) => {
        const [start, end] = cursorWordRange;
        const newValue = tempSubject?.emailSubject.slice(0, start) + suggestion + tempSubject?.emailSubject.slice(end);
        setTempSubject((prev) => {
            return { ...prev, previewSubject: newValue, emailSubject: newValue, subject: newValue};
        });
        setShowSuggestions(false);
        setActiveIndex(-1);

        requestAnimationFrame(() => {
            if (inputRefEmailSubject.current) {
                const newCursorPos = start + suggestion.length;
                inputRefEmailSubject.current.focus();
                inputRefEmailSubject.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };
    
    const handleChange2 = (e) => {
        const userInput = e.target.value;
        const cursorPos = e.target.selectionStart;
        setTempSubject((prev) => {
            return { ...prev, previewSubject2: userInput, emailSubject2: userInput, subject2: userInput};
        });
        const { word, range } = getWordAtCursor(userInput, cursorPos);
        setCursorWordRange(range);
        setShowSuggestions2(word.startsWith("#"));
        setActiveIndex(-1);
    };
    const handleKeyDown2 = (e) => {
        const cursorStart = e.target.selectionStart;
        const cursorEnd = e.target.selectionEnd;
        const userInput = e.target.value;

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            if (cursorStart !== cursorEnd) {
                let start = cursorStart;
                let end = cursorEnd;
                const placeholderRegex = /##\w+?##/g;
                let match;
                while ((match = placeholderRegex.exec(userInput)) !== null) {
                    const placeholderStart = match.index;
                    const placeholderEnd = match.index + match[0].length;
                    if (cursorStart <= placeholderEnd && cursorEnd >= placeholderStart) {
                        start = Math.min(start, placeholderStart);
                        end = Math.max(end, placeholderEnd);
                    }
                }
                const newValue = userInput.slice(0, start) + userInput.slice(end);
                setTempSubject((prev) => {
                    return { ...prev, previewSubject2: newValue, emailSubject2: newValue, subject2: newValue};
                });
                setShowSuggestions2(false);
                requestAnimationFrame(() => {
                    if (inputRefEmailSubject2.current) {
                        inputRefEmailSubject2.current.focus();
                        inputRefEmailSubject2.current.setSelectionRange(start, start);
                    }
                });
            } else {
                const { word, range } = getWordAtCursor(userInput, cursorStart);
                if (word.match(/##\w+?##/)) {
                    const [start, end] = range;
                    const newValue = userInput.slice(0, start) + userInput.slice(end);
                    setTempSubject((prev) => {
                        return { ...prev, previewSubject2: newValue, emailSubject2: newValue, subject2: newValue};
                    });
                    setShowSuggestions2(false);
                    requestAnimationFrame(() => {
                        if (inputRefEmailSubject2.current) {
                            inputRefEmailSubject2.current.focus();
                            inputRefEmailSubject2.current.setSelectionRange(start, start);
                        }
                    });
                } else {
                    let newValue = userInput;
                    let newCursorPos = cursorStart;
                    if (e.key === "Backspace" && cursorStart > 0) {
                        newValue = userInput.slice(0, cursorStart - 1) + userInput.slice(cursorStart);
                        newCursorPos = cursorStart - 1;
                    } else if (e.key === "Delete" && cursorStart < userInput.length) {
                        newValue = userInput.slice(0, cursorStart) + userInput.slice(cursorStart + 1);
                        newCursorPos = cursorStart;
                    }
                    setTempSubject((prev) => {
                        return { ...prev, previewSubject2: newValue, emailSubject2: newValue, subject2: newValue};
                    });
                    setShowSuggestions2(false);
                    requestAnimationFrame(() => {
                        if (inputRefEmailSubject2.current) {
                            inputRefEmailSubject2.current.focus();
                            inputRefEmailSubject2.current.setSelectionRange(newCursorPos, newCursorPos);
                        }
                    });
                }
            }
        } else if (showSuggestions2) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => (prev < cf.length - 1 ? prev + 1 : 0));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : cf.length - 1));
            } else if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick2(cf[activeIndex]);
            } else if (e.key === "Escape") {
                setShowSuggestions2(false);
            }
        }
    };
    const handleSuggestionClick2 = (suggestion) => {
        const [start, end] = cursorWordRange;
        const newValue = tempSubject?.emailSubject2.slice(0, start) + suggestion + tempSubject?.emailSubject2.slice(end);
        setTempSubject((prev) => {
            return { ...prev, previewSubject2: newValue, emailSubject2: newValue, subject2: newValue};
        });
        setShowSuggestions2(false);
        setActiveIndex(-1);

        requestAnimationFrame(() => {
            if (inputRefEmailSubject2.current) {
                const newCursorPos = start + suggestion.length;
                inputRefEmailSubject2.current.focus();
                inputRefEmailSubject2.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    useEffect(() => {
        displayGetDomainEmailList();
        getGroupUDF(data.groupId).then(res => {
            if (res.status === 200) {
                let udfs = [];
                res?.result?.udfs.forEach(it => {
                    udfs.push(it.udf.replaceAll(" ","_"));
                })
                let c = [];
                ["First_Name", "Last_Name", "Email", "Contact_No", ...udfs].map((value)=>(
                    c.push(`##${value}##`)
                ));
                setCf(c);

            }
        });
    }, [data.groupId, displayGetDomainEmailList]);

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>Select The Email Address To Send From</strong></p>
                <div className="col">
                    <div className="row">
                        <p style={{ fontSize: 15 }}><strong>Your Domain Email Addresses</strong></p>
                        <i className="far fa-question-circle spam-check-info ml-3" onClick={() => handleClickHelp("DomainandEmailVerification/Domain/HowtoSetUpTrustedDomainandEmailAddresses.html")} style={innerHeading}></i>
                    </div>
                </div>
                <FormGroup className="mt-3">
                    <InputLabel htmlFor="fromAddress">From Address</InputLabel>
                    <Input
                        id="fromAddress"
                        value={data?.fromAddress || ""}
                        disabled={true}
                        label="From Address"
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
                                            emailList.map((it,index) => {
                                                return (
                                                    <MenuItem onClick={handleClose} key={index}>{it.email}</MenuItem>
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
                <div className="mt-5 esMain">
                    <div className="input-container">
                        {data.testingType && [3, 4, 5].includes(data.testingType) && <span className="spanAB mr-3">A</span>}
                        <FormGroup className="input-box">
                            <InputField
                                type="text"
                                id="fromName1"
                                name="fromName1"
                                value={data?.fromName1 || ""}
                                onChange={handleDataChange}
                                label="From Name"
                            />
                        </FormGroup>
                    </div>
                </div>
                {data.testingType && [3, 4, 5].includes(data.testingType) &&
                    <div className="mt-5 esMain">
                        <div className="input-container">
                            <span className="spanAB mr-3">B</span>
                            <FormGroup className="input-box">
                                <InputField
                                    type="text"
                                    id="fromName2"
                                    name="fromName2"
                                    value={data?.fromName2 || ""}
                                    onChange={handleDataChange}
                                    label="From Name"
                                />
                            </FormGroup>
                        </div>
                    </div>
                }
                <div className="esMain">
                    <div className="mt-5 input-container">
                        {data.testingType && [1, 4, 5].includes(data.testingType) && <span className="spanAB mr-3">A</span>}
                        <FormGroup className="input-box">
                            <TextField
                                variant="standard"
                                inputProps={{ ref: inputRefEmailSubject }}
                                type="text"
                                label="Add Subject ( e.g. : Hi ##First_Name## look at this ##Product## )"
                                value={tempSubject?.emailSubject}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FormGroup>
                    </div>
                    {showSuggestions && (
                        <ul className="list-group w-100 mt-3 shadow" style={{zIndex:9}}>
                            {cf.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer list-group-item list-group-item-action ${
                                        index === activeIndex ? "active" : ""
                                    }`}
                                    onMouseDown={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-5 input-container">
                        {data.testingType && [1, 4, 5].includes(data.testingType) && <span className="spanAB mr-3"><i className="fas fa-eye"></i></span>}
                        <FormGroup className="input-box">
                            <InputField
                                type="text"
                                id="previewSubject"
                                name="previewSubject"
                                value={tempSubject?.previewSubject || ""}
                                onChange={handleDataChange}
                                label="Preview Subject"
                                disabled={true}
                            />
                        </FormGroup>
                    </div>
                </div>
                {data.testingType && [1, 4, 5].includes(data.testingType) && <div className="esMain">
                    <div className="mt-5 input-container">
                        <span className="spanAB mr-3">B</span>
                        <FormGroup className="input-box">
                            <TextField
                                variant="standard"
                                inputProps={{ ref: inputRefEmailSubject2 }}
                                type="text"
                                label="Add Subject ( e.g. : Hi ##First_Name## look at this ##Product## )"
                                value={tempSubject?.emailSubject2}
                                onChange={handleChange2}
                                onKeyDown={handleKeyDown2}
                            />
                        </FormGroup>
                    </div>
                    {showSuggestions2 && (
                        <ul className="list-group w-100 mt-3 shadow" style={{zIndex:9}}>
                            {cf.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer list-group-item list-group-item-action ${
                                        index === activeIndex ? "active" : ""
                                    }`}
                                    onMouseDown={() => handleSuggestionClick2(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-5 input-container">
                        <span className="spanAB mr-3"><i className="fas fa-eye"></i></span>
                        <FormGroup className="input-box">
                            <InputField
                                type="text"
                                id="previewSubject2"
                                name="previewSubject2"
                                value={tempSubject?.previewSubject2 || ""}
                                onChange={handleDataChange}
                                label="Preview Subject"
                                disabled={true}
                            />
                        </FormGroup>
                    </div>
                </div>}
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleClickOnBack()}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => handleOnNextClick()}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
    return {
        email: pathOr("", ["user", "email"], state),
        subEmail: pathOr("", ["subUser", "email"], state),
        subMemberId: pathOr("", ["subUser", "memberId"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectEmailAndName);