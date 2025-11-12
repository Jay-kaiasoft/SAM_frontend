import React, { useEffect, useState } from "react"
import { connect } from "react-redux";
import { Row, Col, Table, FormGroup, ModalHeader, ModalBody, ModalFooter, Modal } from 'reactstrap'
import {Button, Box, alpha, Menu, MenuItem, Divider, TextField, styled} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DropDownControls from "../../shared/commonControlls/dropdownControl";
import { getGroupUDF } from "../../../services/clientContactService";
import { getSurveyAllList } from "../../../services/surveyService";
import { getAssessmentAllList } from "../../../services/assessmentService";
import { getCustomFormLinkList } from "../../../services/customFormService";
import InputField from "../../shared/commonControlls/inputField";
import $ from "jquery"

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 0,
        marginTop: 0,
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),

            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const CreateSms = ({ text, refIndex, setData, udfFields, initSmsCost, surveyLinkList, assessmentLinkList, customFormLinkList }) => {
    const [smsUdfOption, setSmsUdfOption] = useState("##First Name##");
    const [personliseMenu, setPersonliseMenu] = useState(null);
    const [linkPreviewMenu, setLinkPreviewMenu] = useState(null);
    const [characters, setCharacters] = useState(text?.length);
    const [linkModalData, setLinkModalData] = useState([]);
    const [linkModalTitle, setLinkModalTitle] = useState("");
    const [modalUserMessage, setModalUserMessage] = useState(false);
    const [linkModal, setLinkModal] = useState(false);
    const toggleUserMessage = () => setModalUserMessage(!modalUserMessage);
    const toggleLinkModal = () => setLinkModal(!linkModal);
    const openPersonalise = Boolean(personliseMenu);
    const openLinkPreview = Boolean(linkPreviewMenu);
    const udfData = [
        {
            key: "##First Name##",
            value: "First Name"
        },
        {
            key: "##Last Name##",
            value: "Last Name"
        },
        {
            key: "##Email##",
            value: "Email"
        },
        {

            key: "##Contact No##",
            value: "Contact No",
        },
        ...udfFields
    ];
    const handleOpenPersonalise = (event) => {
        setPersonliseMenu(event.currentTarget);
    }
    const handleClosePersonalise = () => {
        setPersonliseMenu(null);
    }
    const handleOpenLinkPrivew = (event) => {
        setLinkPreviewMenu(event.currentTarget);
    }
    const handleCloseLinkPrivew = () => {
        setLinkPreviewMenu(null);
    }
    const handleTextSmsChange = (event) => {
        setCharacters(event.target.value.length);
        setData((prev) => {
            const prevSms = [...prev.sms]
            return {
                ...prev,
                sms: prevSms.map((item, index) => {
                    if (index === refIndex) {
                        return { ...item, smsDetail: event.target.value }
                    }
                    return item
                })
            }
        })
    }
    const deleteSms = (key) => {
        setData((prev) => {
            let prevSms = [...prev.sms]
            prevSms.splice(key, 1)
            return {
                ...prev,
                sms: prevSms
            }
        })
    }
    const handleTags = () => {
        toggleUserMessage();
        setCharacters((prev) => {
            return prev + smsUdfOption.length + 1;
        });
        setData((prev) => {
            const prevSms = [...prev.sms]
            return {
                ...prev,
                sms: prevSms.map((item, index) => {
                    if (index === refIndex) {
                        return { ...item, smsDetail: item.smsDetail + " " + smsUdfOption + " " }
                    }
                    return item
                })
            }
        })
        handleClosePersonalise();
    }
    const handleLinkPrivew = (link) => {
        if (link === "Survey") {
            setLinkModalTitle("Survey List");
            setLinkModalData(surveyLinkList);
            toggleLinkModal();
        } else if (link === "Assessment") {
            setLinkModalTitle("Assessment List");
            setLinkModalData(assessmentLinkList);
            toggleLinkModal();
        } else if (link === "Form") {
            setLinkModalTitle("Form List");
            setLinkModalData(customFormLinkList);
            toggleLinkModal();
        }
        handleCloseLinkPrivew();
    }
    useEffect(() => {
        setCharacters(text?.length);
    }, [text]);
    return (
        <>
            <Row className="msgSortableItem">
                <Col sm={11} className="pl-3 pr-0">
                    <Box
                        sx={{
                            bgcolor: '#f2eeee',
                            width: '100%'
                        }}
                    >
                        <Button
                            id="personalisation-button"
                            aria-controls="personalisation-menu"
                            aria-haspopup="true"
                            aria-expanded={openPersonalise ? 'true' : undefined}
                            variant="text"
                            disableElevation
                            onClick={handleOpenPersonalise}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            PERSONALISE
                        </Button>
                        <Button
                            id="preview-button"
                            aria-controls="preview-menu"
                            aria-haspopup="true"
                            aria-expanded={openLinkPreview ? 'true' : undefined}
                            variant="text"
                            disableElevation
                            onClick={handleOpenLinkPrivew}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            LINK PREVIEWS
                        </Button>
                        <StyledMenu
                            id="personalisation-menu"
                            MenuListProps={{
                                'aria-labelledby': 'personalisation-button',
                            }}
                            anchorEl={personliseMenu}
                            open={openPersonalise}
                            onClose={handleClosePersonalise}
                            sx={{
                                marginLeft: 28,
                                borderRadius: 0
                            }}
                        >
                            <MenuItem disableRipple>
                                <div className="mr-2 mb-3 ml-2" style={{ width: 130 }}>
                                    <DropDownControls
                                        id="smsUdfData"
                                        name="smsUdfData"
                                        label="Select Field"
                                        onChange={(e, v) => {
                                            setSmsUdfOption(v);
                                        }}
                                        value={smsUdfOption}
                                        dropdownList={udfData}
                                    />
                                </div>
                                <Button variant="contained" color="primary" onClick={handleTags}>
                                    ADD CONTACT FIELD
                                </Button>
                            </MenuItem>
                        </StyledMenu>
                        <StyledMenu
                            id="preview-menu"
                            MenuListProps={{
                                'aria-labelledby': 'privew-button',
                            }}
                            anchorEl={linkPreviewMenu}
                            open={openLinkPreview}
                            onClose={handleCloseLinkPrivew}
                            sx={{ marginLeft: 4 }}
                        >
                            <MenuItem onClick={() => { handleLinkPrivew("Survey") }} disableRipple>
                                Insert Survey
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { handleLinkPrivew("Assessment") }} disableRipple>
                                Insert Assesment
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { handleLinkPrivew("Form") }} disableRipple>
                                Insert Form
                            </MenuItem>
                        </StyledMenu>

                        <div style={{ background: "white" }}>
                            <TextField
                                id="standard-multiline-static"
                                label="SMS Content"
                                multiline
                                value={text}
                                onChange={handleTextSmsChange}
                                fullWidth
                                minRows={4}
                                variant="standard"
                                className="mt-1"
                            />
                        </div>
                        <div className="mx-2 my-2">
                            <span className="px-2">Approx SMS: {Math.ceil(characters / 160)}</span>
                            <span className="px-2">Approx Cost: {Math.ceil(characters / 160) * initSmsCost}</span>
                            <span className="px-2 float-right">Characters: {characters}</span>
                        </div>
                    </Box>
                </Col>
                <Col sm={1}>
                    <i className="far fa-trash-alt mx-0" style={{ position: "absolute", top: "40%", fontSize: "1.5em" }} onClick={() => { deleteSms(refIndex) }}></i>
                </Col>
                <Modal isOpen={modalUserMessage} toggle={toggleUserMessage}>
                    <ModalHeader toggle={toggleUserMessage}>

                    </ModalHeader>
                    <ModalBody>
                        <p>
                            If you are using a user defined field in the SMS message the simulation rendering will estimate the size of your SMS. One SMS message can be 160 characters. We will break them into multiple messages if required.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="contained" color="primary" onClick={toggleUserMessage}>
                            CLOSE
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={linkModal} toggle={toggleLinkModal} size="xl">
                    <ModalHeader toggle={toggleLinkModal}>
                        {linkModalTitle}
                    </ModalHeader>
                    <ModalBody>
                        <div className="table-content-wrapper height-58 overflow-auto">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th className="text-center">
                                            No.
                                        </th>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            URL
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        linkModalData.map((element, index) => {
                                            const handleRowclick = (url) => {
                                                setCharacters((prev) => {
                                                    return prev + ("" + url).length + 1;
                                                });
                                                setData((prev) => {
                                                    const prevSms = [...prev.sms]
                                                    return {
                                                        ...prev,
                                                        sms: prevSms.map((item, index) => {
                                                            if (index === refIndex) {
                                                                return { ...item, smsDetail: item.smsDetail + "\n" + url + "\n" }
                                                            }
                                                            return item
                                                        })
                                                    }
                                                })
                                                toggleLinkModal();
                                            }
                                            return (
                                                <tr key={index} onClick={() => { handleRowclick(element.url) }} className="cursorPointer">
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>{element.name}</td>
                                                    <td>{element.url}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="contained" color="primary" onClick={toggleLinkModal}>
                            CLOSE
                        </Button>
                    </ModalFooter>
                </Modal>
            </Row>
        </>
    );
}

const SMSDetails = ({
    handleBack,
    data,
    setData,
    countrySetting,
    user
}) => {
    const [videoModal, setVideoModal] = useState(false);
    const toggleVideoModal = () => setVideoModal(!videoModal);
    const [rowDisplayOrder, setRowDisplayOrder] = useState(1);
    const [udfFields, setUdfFields] = useState([]);
    const [surveyLinkList, setSurveyLinkList] = useState([]);
    const [assessmentLinkList, setAssessmentLinkList] = useState([]);
    const [customFormLinkList, setCustomFormLinkList] = useState([]);
    const [totalSms, setTotalSms] = useState(0);
    const initSmsCost = countrySetting.cntySMSPerPrice;
    const [videoUrl, setVideoUrl] = useState("");
    const addTextSms = () => {
        setData((prev) => {
            return {
                ...prev,
                sms: [
                    ...prev.sms,
                    { "rowDisplayOrder": rowDisplayOrder, "smsType": "text", "smsDetail": "" }
                ]
            }
        })
        setRowDisplayOrder(rowDisplayOrder + 1);
    }
    const handleVideoUrl = (name, value) => {
        if (name === "videoLink")
            setVideoUrl(value);
    }
    useEffect(() => {
        let index_start = 0;
        let index_stop = 0;
        $(".msgSortable").sortable({
            helper: "clone",
            placeholder: "ui-state-highlight",
            revert: true,
            forceHelperSize: true,
            forcePlaceholderSize: true,
            cursor: 'move',
            start: (event, ui) => {
                index_start = ui.item.index();
            },
            update: (event, ui) => {
                index_stop = ui.item.index();
                let e = document.getElementsByClassName("msgSortableItem");
                let picked = e[index_start];
                let swap = e[index_stop];
                setData((prev) => {
                    let temp = prev.sms;
                    if (index_start > index_stop) {
                        temp.splice(index_stop, 0, prev.sms[index_start]);
                        temp.splice(temp.lastIndexOf(prev.sms[index_start]) + 1, 1);
                        $(picked).after(swap);
                    }
                    else {
                        temp.splice(index_stop + 1, 0, prev.sms[index_start]);
                        temp.splice(temp.indexOf(prev.sms[index_start]), 1);
                        $(picked).before(swap);
                    }
                    return {
                        ...prev,
                        sms: [...temp]
                    };
                });
            }
        });
    });
    useEffect(() => {
        if (!data.sms) {
            setData((prev) => {
                return {
                    ...prev,
                    sms: [{
                        "rowDisplayOrder": 1,
                        "smsType": "text",
                        "smsDetail": ""
                    }]
                }
            })
            setRowDisplayOrder(2)
        }
        else {
            setRowDisplayOrder(data?.sms?.length + 1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (typeof data?.amGroupId !== "undefined" && data?.amGroupId > 0) {
            getGroupUDF(data?.amGroupId).then(
                res => {
                    let temp = [];
                    if (res.result.udfs) {
                        res.result.udfs.forEach((e) => {
                            temp.push({ value: e.udf, key: "##" + e.udf + "##" });
                        })
                    }
                    setUdfFields(temp);
                }
            );
        }
    }, [data?.amGroupId]);
    useEffect(() => {
        let temp = 0;
        data?.sms?.forEach((element) => {
            temp += (Math.ceil(element?.smsDetail?.length / 160) * initSmsCost);
        });
        setTotalSms(temp);
    }, [data?.sms, initSmsCost]);
    useEffect(() => {
        getSurveyAllList().then(res => {
            if (res.status === 200) {
                if (res.result.surveyList) {
                    let l = [];
                    res.result.surveyList.map((v) => (
                        l.push({ name: v.sryName, url: v.sryUrl })
                    ))
                    setSurveyLinkList(l);
                }
            }
        });
        getAssessmentAllList().then(res => {
            if (res.status === 200) {
                if (res.result.assessmentList) {
                    let l = [];
                    res.result.assessmentList.map((v) => (
                        l.push({ name: v.assName, url: v.assUrl })
                    ))
                    setAssessmentLinkList(l);
                }
            }
        });
        getCustomFormLinkList().then(res => {
            if (res.status === 200) {
                if (res.result.customFormList) {
                    let l = [];
                    res.result.customFormList.map((v) => (
                        l.push({ name: v.cfFormName, url: v.customFormUrl })
                    ))
                    setCustomFormLinkList(l);
                }
            }
        });
    }, [])
    return (
        <Row>
            <Col xs={10} sm={10} md={10} lg={10} xl={10} className="mx-auto">
                <p className='heading-style'><strong>SMS Details</strong></p>
                <Row className="mt-3">
                    <Col xs={12} sm={12} md={12} className="justify-content-center">
                        <Row>
                            <Col sm={12}>
                                <Button variant="contained" color="primary" onClick={addTextSms}>
                                    ADD SMS Text
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleBack}>
                                    ADD IMAGE
                                </Button>
                                <Button variant="contained" color="primary" onClick={toggleVideoModal}>
                                    ADD VIDEO
                                </Button>
                                <i className="far fa-question-circle"></i>
                                <Box className="mt-3 ">
                                    <Box sx={{ minHeight: 500 }} className="msgSortable tpl-container">
                                        {
                                            data?.sms?.map((element, index) => {
                                                return <CreateSms text={element?.smsDetail} key={index} setData={setData} udfFields={udfFields} refIndex={index} initSmsCost={initSmsCost} surveyLinkList={surveyLinkList} assessmentLinkList={assessmentLinkList} customFormLinkList={customFormLinkList} />
                                            })
                                        }
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f2eeee"
                                        }}
                                        className="py-1 px-3"
                                    >
                                        <span style={{ color: "#999" }}>Opt-out-message</span><br />
                                        <p>Reply STOP to stop</p>
                                    </Box>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f2eeee"
                                        }}
                                        className="text-right mt-3 py-2 px-3"
                                    >
                                        <strong>
                                            Approximated Total Campaign Cost : {user.countryPriceSymbol}{totalSms}
                                        </strong>
                                    </Box>
                                </Box>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Modal isOpen={videoModal} toggle={toggleVideoModal}>
                <ModalHeader toggle={toggleVideoModal}>
                    <h4>Video Link</h4>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={{
                            offset: 2,
                            size: 10
                        }}
                            className="mx-auto"
                        >
                            <FormGroup>
                                <InputField
                                    type="text"
                                    id="videoLink"
                                    name="videoLink"
                                    label="Video link"
                                    onChange={handleVideoUrl}
                                    value={videoUrl}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={toggleVideoModal}>
                        ADD
                    </Button>
                    <Button variant="contained" color="primary" onClick={toggleVideoModal}>
                        CLOSE
                    </Button>
                </ModalFooter>
            </Modal>
        </Row>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        countrySetting: state.countrySetting
    }
}
export default connect(mapStateToProps, null)(SMSDetails);