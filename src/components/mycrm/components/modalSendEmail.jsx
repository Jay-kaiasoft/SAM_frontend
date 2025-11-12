import React, { useCallback, useEffect, useRef, useState } from "react";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Button, FormGroup, IconButton, Input, InputAdornment, InputLabel, Link, Menu, MenuItem, Step, StepLabel, Stepper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { QontoConnector, QontoStepIcon, searchIconTransparent } from "../../../assets/commonFunctions";
import { myPageImageUrl } from "../../../config/api";
import { getMyPagesList, getMyPagesTags } from "../../../services/myDesktopService";
import FilterMyPages from "../../shared/commonControlls/filterMyPages";
import InputField from "../../shared/commonControlls/inputField";
import $ from "jquery";
import { getDomainEmailList } from "../../../services/profileService";
import { getGroupUDF, sendEmailToContact } from "../../../services/clientContactService";

const ModalSendEmail = ({modalSendEmail, toggleModalSendEmail, user, email, subMemberId, subEmail, groupId, globalAlert, emailId}) => {
    const steps = ["1","2"];
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState({});

    const handleReset = () => {
        setActiveStep(0);
        setData({});
        toggleModalSendEmail();
    }
    const handleChange = (name, value) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleClickNextFirst = () => {
        if(typeof data?.myPageId === "undefined" || data?.myPageId === "" || data?.myPageId === null){
            globalAlert({
                type: "Error",
                text: "Please select page design.",
                open: true
            });
            return false;
        }
        handleNext();
    }
    const handleClickSend = () => {
        if (data?.fromAddress === undefined || data?.fromAddress === "") {
            globalAlert({
                type: "Error",
                text: "Please select a from address.",
                open: true
            })
            return
        }
        if (data?.fromName === undefined || data?.fromName === "") {
            globalAlert({
                type: "Error",
                text: "Please enter from name.",
                open: true
            })
            return
        }
        if (data?.emailSubject === undefined || data?.emailSubject === "") {
            globalAlert({
                type: "Error",
                text: "Please enter subject.",
                open: true
            })
            return
        }
        let requestData = {
            ...data,
            groupId:groupId,
            emailId: emailId
        }
        $(`button.handleSend`).hide();
        $(`button.handleSend`).after(`<div class="lds-ellipsis"><div></div><div></div><div></div>`);
        sendEmailToContact(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                toggleModalSendEmail();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.handleSend`).show();
        })
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <SelectMyPage
                        data={data}
                        handleChange={handleChange}
                        user={user}
                        handleClickNextFirst={handleClickNextFirst}
                    />
                );
            case 1:
                return (
                    <SelectEmailAndName
                        data={data}
                        setData={setData}
                        handleChange={handleChange}
                        handleBack={handleBack}
                        handleClickSend={handleClickSend}
                        email={email}
                        subMemberId={subMemberId}
                        subEmail={subEmail}
                        groupId={groupId}
                        globalAlert={globalAlert}
                     />
                );
            default:
                return 'Unknown step';
        }
    }

    return (
        <Modal size="xl" isOpen={modalSendEmail}>
            <ModalHeader toggle={() => { handleReset(); }}>Send Email</ModalHeader>
            <ModalBody>
                <Stepper className="w-50 p-1 mb-1 mx-auto" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {getStepContent(activeStep)}
            </ModalBody>
            <ModalFooter>
                <Button className="mr-3" variant="contained" color="primary" onClick={() => { handleReset(); }}>CLOSE</Button>
            </ModalFooter>
        </Modal>
    );
}

const SelectMyPage = ({data, handleChange, user, handleClickNextFirst}) => {
    const [filterPublishedValues, setFilterPublishedValues] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [myDataPublished, setMyDataPublished] = useState([]);
    const [myDataPublishedAll, setMyDataPublishedAll] = useState([]);
    const [search, setSearch] = useState("");

    const handleChangeSelectedFilter = (filterName) => {
        if(selectedFilter.includes(filterName)){
            setSelectedFilter(selectedFilter.filter(x => x !== filterName));
        } else {
            setSelectedFilter([...selectedFilter,filterName]);
        }
    }
    const handleClickPage = (mpId) => {
        handleChange("myPageId",mpId);
    }
    const renderPagesList = () => {
        let renderedPagesList = []
        for (let index = 0; index < myDataPublished.length; index += 2) {
            const page =
                <div className="col-lg-3 col-md-6 card-container" key={index}>
                    <div className={`card mb-3 ${myDataPublished[index].mpId === data?.myPageId ? "active-tmpt" : ""}`} onClick={() => { handleClickPage(myDataPublished[index].mpId) }}>
                        <div className="card-img-wrapper">
                            <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index].mpId)} alt="tile" />
                        </div>
                        <div className="card-body">
                            <div className="card-title">{(myDataPublished[index].mpType === 2  && myDataPublished[index].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index].groupName}></i> : null}{myDataPublished[index].mpName}</div>
                        </div>
                    </div>
                    {index + 1 <= myDataPublished.length - 1 &&
                        <div className={`card mb-3 ${myDataPublished[index + 1].mpId === data?.myPageId ? "active-tmpt" : ""}`} onClick={() => { handleClickPage(myDataPublished[index + 1].mpId) }}>
                            <div className="card-img-wrapper">
                                <img className="card-img-top" src={myPageImageUrl.replace("{{memberId}}", user.memberId).replace("{{folderName}}", "mypage").replace("{{myPageId}}", myDataPublished[index+1].mpId)} alt="tile" />
                            </div>
                            <div className="card-body">
                                <div className="card-title">{(myDataPublished[index + 1].mpType === 2  && myDataPublished[index + 1].groupName !== "") ? <i className="far fa-users fa-users-g" data-toggle="tooltip" title={myDataPublished[index + 1].groupName}></i> : null}{myDataPublished[index + 1].mpName}</div>
                            </div>
                        </div>
                    }
                </div>
            renderedPagesList.push(page)
        }
        return renderedPagesList.length !== 0?renderedPagesList:0;
    }
    const handleChangeFilter = () => {
        if(selectedFilter.length > 0) {
            setMyDataPublished([]);
            myDataPublishedAll.filter((value) => (
                (value.mpTags !== null && value.mpTags !== "") ?
                    selectedFilter.map((filter) => (
                        value.mpTags.toLowerCase().split(", ").includes(filter) === true ?
                            setMyDataPublished((prev) => {
                                let t = 0;
                                prev.map((p)=>(
                                    t = p.mpId === value.mpId ? 1 : 0
                                ))
                                if(t === 0){
                                    if(search === "") {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else if(search !== "" && value.mpName.toLowerCase().includes(search.toLocaleLowerCase())) {
                                        return [...prev, {...value, "id": value.mpId, "name": value.mpName}];
                                    } else {
                                        return [...prev];
                                    }
                                } else {
                                    return [...prev];
                                }
                            })
                        : null
                    ))
                : null
            ))
        } else {
            let t = [];
            myDataPublishedAll?.map((v)=>(
                t.push({...v,id:v.mpId,name:v.mpName})
            ))
            if(search !== ""){
                t = t.filter((v)=>{return v.mpName.toLowerCase().includes(search.toLocaleLowerCase())});
            }
            setMyDataPublished(t);
        }
    }

    useEffect(()=>{
        getMyPagesTags(2).then(res => {
            if (res.result) {
                setFilterPublishedValues(res.result.tags);
            }
        });
        getMyPagesList(2).then(res => {
            if (res.result) {
                setMyDataPublishedAll(res.result.mypage);
            }
        });
        return () => {
            setFilterPublishedValues([]);
            setMyDataPublishedAll([]);
        };
    },[]);
    useEffect(()=>{
        handleChangeFilter();
        return () => {
            setMyDataPublished([]);
        };
    },[selectedFilter,myDataPublishedAll]);
    return (
        <Row className="px-3">
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3">
                Select A Page Design
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="mb-3 text-right">
                <TextField
                    placeholder="Search"
                    name="search"
                    type="text"
                    value={search}
                    onChange={(event)=>{setSearch(event.target.value);}}
                    variant="standard"
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton sx={searchIconTransparent.root} onClick={handleChangeFilter}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                    }}
                />
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                <FilterMyPages filterValues={filterPublishedValues} handleChangeSelectedFilter={handleChangeSelectedFilter} selectedFilter={selectedFilter} />
            </Col>
            <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                <div className="pages-container">
                    {
                        myDataPublished.length !== 0 ?
                            renderPagesList()
                        :
                            <Row style={{height:"50vh"}} className="row align-items-center w-100">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center mt-3">
                                    <p className="mb-5">You have no page design available</p>
                                    <p>Create A Page Design</p>
                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{History.push("/addmypage")}} style={{zIndex:9}}>
                                        <i className="far fa-plus-square"></i>
                                        <div className="bg-green"></div>
                                    </Link>
                                </Col>
                            </Row>
                    }
                </div>
            </Col>
            <Col xs={12} className="mt-3">
                <div className="text-center">
                    <Button variant="contained" color="primary" onClick={handleClickNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </div>
            </Col>
        </Row>
    );
}

const SelectEmailAndName = ({data, setData, handleChange, handleBack, handleClickSend, email, subMemberId, subEmail, groupId}) => {
    const [emailList, setEmailList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cf, setCf] = useState([]);
    const [tempSubject, setTempSubject] = useState({"previewSubject": data?.previewSubject || "", "emailSubject": data?.emailSubject || "", "subject": data?.subject || ""});
    const open = Boolean(anchorEl);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cursorWordRange, setCursorWordRange] = useState([0, 0]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRefEmailSubject = useRef();
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if(event.target.textContent !== "") {
            handleChange("fromAddress", event.target.textContent);
        }
        setAnchorEl(null);
    };
    const displayGetDomainEmailList = useCallback(() =>{
        getDomainEmailList(1).then(res => {
            if (res.result.domainEmail) {
                setEmailList(res.result.domainEmail);
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
        });
    },[setData, email, subEmail, subMemberId]);
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
    const handleChangeData = (e) => {
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

    useEffect(() => {
        displayGetDomainEmailList();
        getGroupUDF(groupId).then(res => {
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
    }, [groupId, displayGetDomainEmailList]);

    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={6} xl={6} className="mx-auto">
                <p>Select The Email Address To Send From</p>
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
                <div className="mt-3 esMain">
                    <div className="input-container">
                        <FormGroup className="input-box">
                            <InputField
                                type="text"
                                id="fromName"
                                name="fromName"
                                value={data?.fromName || ""}
                                onChange={handleChange}
                                label="From Name"
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="mt-3 esMain">
                    <div className="input-container">
                        <FormGroup className="input-box">
                            <TextField
                                variant="standard"
                                inputProps={{ ref: inputRefEmailSubject }}
                                type="text"
                                label="Add Subject ( e.g. : Hi ##First_Name## look at this ##Product## )"
                                value={tempSubject?.emailSubject}
                                onChange={handleChangeData}
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
                    <div className="mt-3 input-container">
                        <FormGroup className="input-box">
                            <InputField
                                type="text"
                                id="previewSubject"
                                name="previewSubject"
                                value={tempSubject?.previewSubject || ""}
                                onChange={handleChange}
                                label="Preview Subject"
                                disabled={true}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button color="primary" variant="contained" onClick={() => handleBack()} ><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button color="primary" variant="contained" className="ml-3" onClick={() => handleClickSend()} ><i className="far fa-envelope mr-2 handleSend"></i>SEND</Button>
                </div>
            </Col>
        </Row>
    );
}

export default ModalSendEmail;