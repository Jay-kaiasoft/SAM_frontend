import { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import { Button, Divider, Menu, MenuItem, TextField, alpha, Box, styled } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DropDownControls from "../shared/commonControlls/dropdownControl";

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

const CreateSms = ({ text, refIndex, setSms, udfFields, initSmsCost, surveyLinkList, assessmentLinkList, customFormLinkList }) => {
    const [smsUdfOption, setSmsUdfOption] = useState("##First Name##");
    const [personliseMenu, setPersonliseMenu] = useState(null);
    const [linkPreviewMenu, setLinkPreviewMenu] = useState(null);
    const [characters, setCharacters] = useState(text.length);
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
        setSms((prev) => {
            prev[refIndex] = { ...prev[refIndex], smsDetail: event.target.value };
            return [...prev];
        });
    }
    const deleteSms = (key) => {
        setSms((prev) => {
            let temp = [...prev];
            temp.splice(key, 1);
            return [...temp];
        });
    }
    const handleTags = () => {
        setCharacters((prev) => {
            return prev + smsUdfOption.length + 1;
        });
        setSms((prev) => {
            prev[refIndex] = { ...prev[refIndex], smsDetail: prev[refIndex].smsDetail + " " + smsUdfOption + " " };
            return [...prev];
        });
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
        setCharacters(text.length);
    }, [text]);

    return (
        <>
            <Row className="msgSortableItem">
                <Col sm={11} className="pl-3 pr-0">
                    <Box sx={{ bgcolor: '#f2eeee', width: '100%' }} >
                        <Button
                            id="personalisation-button"
                            aria-controls="personalisation-menu"
                            aria-haspopup="true"
                            aria-expanded={openPersonalise ? 'true' : undefined}
                            variant="text"
                            disableElevation
                            onClick={handleOpenPersonalise}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                                color: "#242424 !important"
                            }}
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
                            sx={{
                                color: "#242424 !important"
                            }}
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
                                        <th className="text-center"> No. </th>
                                        <th> Name </th>
                                        <th> URL </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        linkModalData.map((element, index) => {
                                            const handleRowclick = (url) => {
                                                setCharacters((prev) => {
                                                    return prev + ("" + url).length + 1;
                                                });
                                                setSms((prev) => {
                                                    prev[refIndex] = { ...prev[refIndex], smsDetail: prev[refIndex].smsDetail + "\n" + url + "\n" };
                                                    return [...prev];
                                                });
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

export default CreateSms