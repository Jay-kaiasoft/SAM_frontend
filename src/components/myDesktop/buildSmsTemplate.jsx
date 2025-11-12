import React, { useEffect, useMemo, useState } from "react";
import { Col, FormGroup, Table, Row, ModalHeader, ModalBody, ModalFooter, Modal } from "reactstrap";
import {alpha, Button, Step, StepLabel, Stepper, Box, Menu, MenuItem, Divider, styled} from "@mui/material";
import InputField from "../shared/commonControlls/inputField";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import history from '../../history';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DropDownControls from "../shared/commonControlls/dropdownControl";
import { getSurveyAllList } from "../../services/surveyService";
import { getAssessmentAllList } from "../../services/assessmentService";
import { getCustomFormLinkList } from "../../services/customFormService";
import { getSmsTemplate, saveSmsTemplate } from "../../services/myDesktopService";
import {easUrlEncoder, QontoConnector, QontoStepIcon} from "../../assets/commonFunctions";
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

const BuildSmsTemplate = ({
    globalAlert,
    subMemberId,
    ...props
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["1", "2"];
    const [data, setData] = useState({
        sstName: "",
        sstDetails: ""
    })
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = queryString.get("v") ? queryString.get("v") : "";
    const sstId = (typeof id !== "undefined" && id !== "") ? id : 0;
    const [personliseMenu, setPersonliseMenu] = useState(null);
    const [linkPreviewMenu, setLinkPreviewMenu] = useState(null);
    const [linkModalTitle, setLinkModalTitle] = useState("");
    const [surveyLinkList, setSurveyLinkList] = useState([]);
    const [assessmentLinkList, setAssessmentLinkList] = useState([]);
    const [customFormLinkList, setCustomFormLinkList] = useState([]);
    const [smsUdfOption, setSmsUdfOption] = useState("##First Name##");
    const [linkModalData, setLinkModalData] = useState([]);

    const [linkModal, setLinkModal] = useState(false);
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
        {
            key: "##Gender##",
            value: "Gender"
        },
        {
            key: "##Date Of Birth##",
            value: "Date Of Birth"
        },
        {
            key: "##Country##",
            value: "Country"
        },
        {
            key: "##State##",
            value: "State"
        },
        {
            key: "##Address##",
            value: "Address"
        },
        {
            key: "##Street Address##",
            value: "Street Address"
        },
        {
            key: "##Zip Code##",
            value: "Zip Code"
        },
        {
            key: "##Language##",
            value: "Language"
        }
    ];
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

    const handleTags = () => {
        setData((prev) => {
            return ({
                ...prev,
                sstDetails: prev.sstDetails + " " + smsUdfOption
            })
        })
        handleClosePersonalise();
    }

    const handleDataChange = (name, value) => {
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    useEffect(() => {
        if (sstId) {
            getSmsTemplate(sstId).then(res => {
                if (res.status === 200) {
                    const smsTemplate = res.result.smsTemplate
                    if (smsTemplate) {
                        setData({
                            sstName: smsTemplate.sstName,
                            sstDetails: smsTemplate.sstDetails
                        })
                    }
                }
            })
        }
    }, [sstId])

    const handleSave = () => {
        if (!data.sstDetails) {
            globalAlert({
                open: true,
                type: "Error",
                text: "Please enter SMS template content"
            })
            return
        }
        const payload = {
            sstId,
            subMemberId,
            ...data
        }
        $(`button.handleSave`).hide();
        $(`button.handleSave`).after(`<div class="lds-ellipsis mx-3"><div></div><div></div><div></div>`);
        saveSmsTemplate(payload).then(res => {
            if (res.status === 200) {
                history.push("/smstemplates")
                globalAlert({
                    open: true,
                    type: "Success",
                    text: res.message
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.handleSave`).show();
        })
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Col xs={10} sm={8} md={8} lg={4} xl={4} className="mx-auto">
                        {
                            (data?.sstName === "Opt In" || data?.sstName === "Opt Out" || data?.sstName === "Rejoin Group") && sstId !== 0 ?
                                <>
                                    <p className="font-weight-bold">SMS Template Name</p>
                                    <p>{data?.sstName}</p>
                                </>
                            :
                                <InputField
                                    type="text"
                                    id="sstName"
                                    name="sstName"
                                    label="SMS Template Name"
                                    onChange={handleDataChange}
                                    value={data?.sstName}
                                />
                        }
                        <FormGroup className="text-center mt-5">
                            <Button variant="contained" color="primary" onClick={()=>{history.push("/smstemplates")}} className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                            <Button variant="contained" color="primary" onClick={() => {
                                if (!data?.sstName) {
                                    globalAlert({
                                        open: true,
                                        type: "Error",
                                        text: "Please enter SMS template name."
                                    })
                                    return
                                }
                                setActiveStep(activeStep + 1)
                            }}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                        </FormGroup>
                    </Col>
                )
            case 1:
                return (
                    <Col xs={10} sm={8} md={8} lg={6} xl={6} className="mx-auto">
                        {
                            (data?.sstName === "Opt In" || data?.sstName === "Opt Out" || data?.sstName === "Rejoin Group") && sstId !== 0 && <p>We highly recommend that you personalize this statement by using your business name and adding your branding and logo, if you have them.</p>
                        }
                        <Box
                            sx={{
                                bgcolor: '#f2eeee',
                                width: '100%'
                            }}>
                            <Button
                                id="personalisation-button"
                                aria-controls="personalisation-menu"
                                aria-haspopup="true"
                                aria-expanded={openPersonalise ? 'true' : undefined}
                                variant="text"
                                disableElevation
                                onClick={handleOpenPersonalise}
                                endIcon={<KeyboardArrowDownIcon />}
                                className="text-black"
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
                                className="text-black"
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
                                                            setData((prev) => {
                                                                return ({
                                                                    ...prev,
                                                                    sstDetails: prev?.sstDetails + " " + url + ""
                                                                })
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
                            <div style={{ background: "white" }}>
                                <InputField
                                    type="text"
                                    id="sstDetails"
                                    name="sstDetails"
                                    label="SMS Template Content"
                                    onChange={handleDataChange}
                                    value={data?.sstDetails}
                                    multiline
                                    minRows={5}
                                />
                            </div>
                            <div className="mx-2 my-2">
                                <span className="px-2">Approx SMS: {Math.ceil(data?.sstDetails?.length / 160)}</span>
                                <span className="px-2 float-right">Characters: {data?.sstDetails?.length}</span>
                            </div>
                        </Box>
                        <FormGroup className="text-center mt-5">
                            <Button variant="contained" color="primary" onClick={() => { setActiveStep(activeStep - 1) }}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            <Button variant="contained" color="primary" className="mx-3 handleSave" onClick={() => { handleSave() }}><i className="far fa-save mr-2"></i>SAVE</Button>
                            <Button variant="contained" color="primary" onClick={() => { history.push("/smstemplates") }}><i className="far fa-times mr-2"></i>CANCEL</Button>
                        </FormGroup>
                    </Col>
                )
            default:
                return "Unknown Step"
        }
    }

    return (
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h3>SMS Template</h3>
                <Stepper className="w-50 mx-auto" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {getStepContent(activeStep)}
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => { //store.getState()
    return {
        subMemberId: state.subUser.memberId
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BuildSmsTemplate);