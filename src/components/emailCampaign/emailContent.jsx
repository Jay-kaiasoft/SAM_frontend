import React, { useEffect, useRef, useState } from "react";
import { Button, FormGroup, TextField } from "@mui/material";
import { Col, Row } from "reactstrap";
import SelectPage from "./selectPage";
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { getGroupUDFAuto } from "../../services/clientContactService";

let personaliseData = [
    {
        key: "##First_Name##",
        value: "First Name"
    },
    {
        key: "##Last_Name##",
        value: "Last Name"
    },
    {
        key: "##Email##",
        value: "Email"
    },
    {
        key: "##Contact_No##",
        value: "Contact No",
    }
];

const EmailContent = ({
    data,
    setData = () => { },
    handleDataChange = () => { },
    handleBack = () => { },
    handleNext = () => { },
    globalAlert = () => { }
}) => {
    const [cursorWordRange, setCursorWordRange] = useState([0, 0]);
    const inputRefTextEmail = useRef();

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
    const handleClickPersonalise = (value) => {
        const [start, end] = cursorWordRange;
        const newValue = data?.textEmail?.slice(0, start) + value + data?.textEmail?.slice(end);
        handleDataChange("textEmail", newValue);
        requestAnimationFrame(() => {
            if (inputRefTextEmail.current) {
                const newCursorPos = start + value.length;
                inputRefTextEmail.current.focus();
                inputRefTextEmail.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };
    const handleChangeText = (e) => {
        const userInput = e.target.value;
        const cursorPos = e.target.selectionStart;
        handleDataChange("textEmail", userInput);
        const { range } = getWordAtCursor(userInput, cursorPos);
        setCursorWordRange(range);
    }
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
                handleDataChange("textEmail", newValue);
                requestAnimationFrame(() => {
                    if (inputRefTextEmail.current) {
                        inputRefTextEmail.current.focus();
                        inputRefTextEmail.current.setSelectionRange(start, start);
                    }
                });
            } else {
                const { word, range } = getWordAtCursor(userInput, cursorStart);
                if (word.match(/##\w+?##/)) {
                    const [start, end] = range;
                    const newValue = userInput.slice(0, start) + userInput.slice(end);
                    handleDataChange("textEmail", newValue);
                    requestAnimationFrame(() => {
                        if (inputRefTextEmail.current) {
                            inputRefTextEmail.current.focus();
                            inputRefTextEmail.current.setSelectionRange(start, start);
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
                    handleDataChange("textEmail", newValue);
                    requestAnimationFrame(() => {
                        if (inputRefTextEmail.current) {
                            inputRefTextEmail.current.focus();
                            inputRefTextEmail.current.setSelectionRange(newCursorPos, newCursorPos);
                        }
                    });
                }
            }
        }
    };

    useEffect(() => {
        if(data.campType === 1) {
            getGroupUDFAuto(data?.groupId || 0).then(res => {
                if (res.status === 200) {
                    res?.result?.udfs.forEach(it => {
                        personaliseData.push({
                            key: "##"+it.udf.replaceAll(" ", "_")+"##",
                            value: it.udf
                        });
                    });
                }
            });
        }
    }, []);

    return (
        <>
            {data.campType === 1 ?
                <Row>
                    <Col xs={10} sm={10} md={6} lg={6} xl={6} className="mx-auto">
                        <p className="font-size-18"><strong>Type A Text For Email Marking Campaign</strong></p>
                        <FormGroup className="mb-3">
                            <DropDownControls
                                id="personaliseData"
                                name="personaliseData"
                                label="Select Personalise"
                                onChange={(e, v) => {
                                    handleClickPersonalise(v);
                                }}
                                dropdownList={personaliseData}
                            />
                        </FormGroup>
                        <FormGroup>
                            <TextField
                                variant="standard"
                                inputProps={{ ref: inputRefTextEmail }}
                                type="text"
                                id="textEmail"
                                name="textEmail"
                                value={data?.textEmail || ""}
                                onChange={handleChangeText}
                                onKeyDown={handleKeyDown}
                                label="Text Email"
                                multiline={true}
                                minRows={6}
                            />
                        </FormGroup>
                        <div className="col-12 mt-3 mb-3" align="center">
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => handleBack(1)}
                            >
                                <i className="far fa-long-arrow-left mr-2"></i>BACK
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3"
                                onClick={() => {
                                    if (data?.textEmail === undefined || data?.textEmail === "") {
                                        globalAlert({
                                            type: "Error",
                                            text: "Please Type A Text For Email Marking Campaign.",
                                            open: true
                                        })
                                        return
                                    }
                                    handleNext(1)
                                }}
                            >
                                <i className="far fa-long-arrow-right mr-2"></i>NEXT
                            </Button>
                        </div>
                    </Col>
                </Row> 
            :
                <SelectPage title="Select A Page Design For Email Marketing Campaign" handleBack={handleBack} mpId="mpId" handleNext={handleNext} data={data} setData={setData} />
            }
        </>
    )
}

export default EmailContent