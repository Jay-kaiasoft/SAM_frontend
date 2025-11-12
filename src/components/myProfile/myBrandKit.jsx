import React, { useState, useRef, createRef, Fragment, useEffect, useCallback } from 'react';
import { Row, Col, FormGroup, Modal, ModalBody, ModalHeader } from 'reactstrap';
import InputField from '../shared/commonControlls/inputField.jsx';
import { connect } from 'react-redux';
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import { Tabs, Tab, Button, Link, Step, StepLabel, Stepper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ImportStyleModal from '../shared/commonControlls/importStyleModal.jsx';
import { checkCreateURL, QontoConnector, QontoStepIcon, TabPanel, a11yProps, toRGB, handleClickHelp, setBrandColorsToLocal, fontData } from '../../assets/commonFunctions.js';
import DropZoneBrandLogo from '../shared/commonControlls/dropZoneBrandLogo.jsx';
import { deleteBrandData, getBrandData, saveBrandData } from '../../services/profileService.js';
import $ from 'jquery';
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';
import { setConfirmDialogAction } from '../../actions/confirmDialogActions.js';
import { userLoggedIn } from '../../actions/userActions.js';
import History from '../../history.js';
import { websiteTitleWithExt } from '../../config/api.js';

const MyBrandKit = ({globalAlert, confirmDialog, user, userLoggedIn}) => {
    const inputRefs = useRef([createRef(), createRef()]);
    const [data, setData] = useState({});
    const [selectedBrand, setSelectedBrand] = useState({});
    const [dataBrandList, setDataBrandList] = useState([]);
    const [modalImport, setModalImport] = useState(false);
    const [valueTab, setValueTab] = useState(0);
    const [brandColorInput, setBrandColorInput] = useState("#000000");
    const textSetting = "Arial, Helvetica Neue, Helvetica, sans-serif";
    const toggleImport = () => { setModalImport(!modalImport); }
    const [modalAddBrand, setModalAddBrand] = useState(false);
    const toggleAddBrand = () => {
        if(modalAddBrand){
            setData({});
            setActiveStep(0);
        }
        setModalAddBrand(!modalAddBrand); 
    }
    const steps = ["1","2"];
    const [activeStep, setActiveStep] = useState(0);
    
    const handleChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }))
    }
    const handleChangeTab = (event, newValue) => {
        let temp = []
        setDataBrandList((prev)=>{
            temp = prev.filter((v,i)=> i === newValue);
            return prev;
        });
        setSelectedBrand(temp[0]);
        setValueTab(newValue);
    };
    const handleClickImport = (brandWebsite) => {
        let isUrlCorrect = checkCreateURL(brandWebsite,globalAlert);
        setSelectedBrand(prev => ({ ...prev, "brandWebsiteURL": isUrlCorrect }))
        toggleImport();
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleNextFirst = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if(typeof data.brandWebsite !== "undefined" && data.brandWebsite !== "" && data.brandWebsite !== null && data.brandWebsite.match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm) === null){
            globalAlert({
                type: "Error",
                text: `Please enter proper website`,
                open: true
            });
            return;
        }
        if (!isValid) {
            return;
        }
        handleNext();
    }
    const handleClickAuthorized = () => {
        let requestData = {
            ...data,
            "brandId": data?.brandId || 0,
            "brandName": data.brandName,
            "brandWebsite": data.brandWebsite
        }
        saveBrandData(requestData).then((res) => {
            if (res.status === 200) {
                if(data?.brandId){
                    displayDataBrandList(valueTab);
                } else {
                    displayDataBrandList(valueTab,"Add");
                }
                toggleAddBrand();
            } else {  
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleClickNotAuthorized = () => {
        toggleAddBrand();
    }
    const displayDataBrandList = useCallback((valueTab, callFrom="") => {
        getBrandData().then(res => {
            if (res.status === 200) {
                setDataBrandList(res.result.brandKitsList);
                userLoggedIn({ ...user, "brandKits": res.result.brandKitsList });
                sessionStorage.setItem('user', JSON.stringify({ ...user, "brandKits": res.result.brandKitsList }));
                setBrandColorsToLocal(res.result.brandKitsList);
                if(res.result.brandKitsList.length>0){
                    setSelectedBrand((prev)=>{
                        if(JSON.stringify(prev) === "{}"){
                            prev=res.result.brandKitsList[0]
                            return prev
                        } else {
                            if(callFrom === "Add"){
                                prev=res.result.brandKitsList[res.result.brandKitsList.length-1]
                            } else {
                                prev=res.result.brandKitsList[valueTab]
                            }    
                            return prev
                        }
                    })
                    if(callFrom === "Add"){
                        setTimeout(()=>{
                            handleChangeTab("", res.result.brandKitsList.length-1);
                            handleClickImport(res.result.brandKitsList[res.result.brandKitsList.length-1].brandWebsite);
                        },1000);
                    }
                }
            } else {  
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    const handleChangeFonts = (name, value) => {
        let requestData = {
            ...selectedBrand,
            "brandFonts": {...selectedBrand.brandFonts, [name]: value }
        }
        saveBrandData(requestData).then(res => {
            if (res.status === 200) {
                displayDataBrandList(valueTab);
            } else {  
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleChangeLogo = (value) => {
        let requestData = {
            ...selectedBrand,
            "brandLogo": value
        }
        saveBrandData(requestData).then(res => {
            if (res.status === 200) {
                displayDataBrandList(valueTab);
            } else {  
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleClickEdit = () => {
        setData(selectedBrand);
        toggleAddBrand();
    }
    const handleClickDelete = (id) => {
        confirmDialog({
            open: true,
            title: `Are you sure you want to delete this brand?`,
            onConfirm: () => {
                let tempSelectedBrandColors = selectedBrand?.brandColors?.split(";") || [];
                deleteBrandData(id).then(res => {
                    if (res.status === 200) {
                        if(typeof localStorage.getItem("spectrum.homepage") !== "undefined" && localStorage.getItem("spectrum.homepage") !== "" && localStorage.getItem("spectrum.homepage") !== null){
                            let tempColor = [];
                            localStorage.getItem("spectrum.homepage").split(";").map((v)=>(
                                (!tempSelectedBrandColors.includes(v)) ?
                                    tempColor.push(v)
                                : null
                            ));
                            localStorage.setItem("spectrum.homepage",tempColor.join(";"));
                        }
                        setData({});
                        setValueTab(0);
                        setSelectedBrand({});
                        displayDataBrandList(valueTab);
                    } else {  
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                })
            }
        });
    }
    const handleChangeColor = useCallback((color) => {
        let temp = "";
        if(typeof selectedBrand.brandColors !== "undefined" && selectedBrand.brandColors !== "" && selectedBrand.brandColors !== null){
            let spectrumColor = selectedBrand.brandColors+";"+toRGB(color);
            let tempObj = spectrumColor.split(";").map(JSON.stringify);
            let uniqueObj = new Set(tempObj);
            let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
            temp = uniqueArr.join(";");
        } else {
            temp = toRGB(color);
        }
        let requestData = {
            ...selectedBrand,
            "brandColors": temp
        }
        saveBrandData(requestData).then(res => {
            if (res.status === 200) {
                displayDataBrandList(valueTab);
                setBrandColorInput(color);
            } else {  
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[displayDataBrandList, globalAlert, selectedBrand])
    const handleClickDeleteLogo = () => {
        confirmDialog({
            open: true,
            title: `Are you sure you want to delete this brand logo?`,
            onConfirm: () => {
                handleChangeLogo("");
            }
        });
    }
    const handleClickDeleteColor = (color) => {
        confirmDialog({
            open: true,
            title: `Are you sure you want to delete this brand color?`,
            onConfirm: () => {
                let temp = "";
                if(typeof selectedBrand.brandColors !== "undefined" && selectedBrand.brandColors !== "" && selectedBrand.brandColors !== null){
                    let scolor = selectedBrand.brandColors.split(";").filter((v)=>{ return v !== color })
                    temp = scolor.join(";");
                }
                let requestData = {
                    ...selectedBrand,
                    "brandColors": temp
                }
                saveBrandData(requestData).then(res => {
                    if (res.status === 200) {
                        displayDataBrandList(valueTab);
                    } else {  
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                })
            }
        });
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Row>
                        <Col sm="6" className="mx-auto">
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="brandName"
                                    name="brandName"
                                    label="Brand Name"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.brandName || ""}
                                />
                            </FormGroup>
                            <FormGroup className='mb-4'>
                                <InputField
                                    ref={inputRefs.current[1]}
                                    type="text"
                                    id="brandWebsite"
                                    name="brandWebsite"
                                    label="Brand Website"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.brandWebsite || ""}
                                />
                            </FormGroup>
                            <div className="text-center mb-3">
                                <Button variant="contained" color="primary" onClick={handleNextFirst}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                            </div>
                        </Col>
                    </Row>
                );
            case 1:
                return (
                    <Row>
                        <Col sm="11" className="mx-auto">
                            <p>We kindly request that you confirm your authorization to use the "{data.brandName}" logo and images. Please acknowledge that you have the necessary rights to utilize them in your project</p>
                            <p className="mb-4">By acknowledging, you agree that any violation of usage rights will not be the responsibility of {websiteTitleWithExt}.</p>
                            <div className="text-center mb-3">
                                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                                <Button variant="contained" color="primary" onClick={handleClickAuthorized} className="mr-3"><i className="far fa-user mr-2"></i>I am Authorized</Button>
                                <Button variant="contained" color="primary" onClick={handleClickNotAuthorized} className="mr-3"><i className="far fa-user-slash mr-2"></i>I am not Authorized</Button>
                            </div>
                        </Col>
                    </Row>
                );
            default:
                return 'Unknown step';
        }
    }
    useEffect(() => {
        displayDataBrandList(valueTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayDataBrandList]);
    useEffect(()=>{
        $(".brandColorPicker").spectrum({
            allowEmpty:true,
            color: brandColorInput,
            showInput: true,
            className: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            showAlpha: true,
            maxSelectionSize: 1000,
            preferredFormat: "hex",
            localStorageKey: "spectrum.homepage",
            change: function(color) {
                handleChangeColor(color.toHexString());
            },
            hide: function(color) {
                handleChangeColor(color.toHexString());
            },
            chooseText: "Select",
            palette: []
        });
    },[brandColorInput, valueTab, handleChangeColor]);
    return (
        <Fragment>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className='text-center mb-5'>
                        <h3 className="d-inline-block mb-0 align-middle">My Brand Kit</h3>
                        <div className="icon-wrapper d-inline-block mx-5">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{toggleAddBrand()}}>
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                            <Link component="a" className="btn-circle" onClick={() => { History.push("/mydrive") }} data-toggle="tooltip" title="Go To My Drive">
                                <i className="far fa-cloud-download-alt"></i>
                                <div className="bg-dark-grey"></div>
                            </Link>
                            <Link component="a" className="btn-circle" onClick={() => { handleClickHelp("Myprofile/Branding/ImportWebsiteBrand.html") }} data-toggle="tooltip" title="Help">
                                <i className="far fa-question-circle"></i>
                                <div className="bg-grey"></div>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
            {
                dataBrandList.length > 0 &&
                    <>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Tabs
                                    color="black"
                                    value={valueTab}
                                    onChange={handleChangeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {
                                        dataBrandList.map((v,index)=>(
                                            <Tab key={index} label={v.brandName} className="mr-3" {...a11yProps(index)} />
                                        ))
                                    }
                                </Tabs>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                                {
                                    dataBrandList.map((v,index)=>(
                                        <TabPanel key={index} value={valueTab} index={index}>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="d-flex justify-content-between">
                                                    <div>
                                                        <p>Brand Name : {v.brandName}</p>
                                                        <div className="mb-3">
                                                            Brand Website : {v.brandWebsite}
                                                            <Button variant="contained" color="primary" onClick={() => { handleClickImport(v.brandWebsite); }} className="ml-3"><i className="far fa-upload mr-2"></i>Add your brand logo and colors automatically</Button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Edit" onClick={ ()=>{ handleClickEdit() } } >
                                                            <i className="far fa-pencil-alt"></i>
                                                            <div className="bg-blue"></div>
                                                        </Link>
                                                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete" onClick={() => { handleClickDelete(v.brandId) }} >
                                                            <i className="far fa-trash-alt"></i>
                                                            <div className="bg-red"></div>
                                                        </Link>
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <div>
                                                        <div className=" d-flex justify-content-between align-items-center mb-3">
                                                            <h5 className="mb-0">Logo</h5>
                                                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete Logo" onClick={() => { handleClickDeleteLogo() }} >
                                                                <i className="far fa-trash-alt"></i>
                                                                <div className="bg-red"></div>
                                                            </Link>
                                                        </div>
                                                        <DropZoneBrandLogo brandWebsite={v.brandWebsite} brandLogo={v.brandLogo} handleChangeLogo={handleChangeLogo} />
                                                    </div>
                                                    <hr/>
                                                    <div>
                                                        <h5 className="mb-3">Colors</h5>
                                                        <div>
                                                            <span className="mr-3">Click To Add A Brand Color</span>
                                                            <input type="text" defaultValue={brandColorInput} className="brandColorPicker"/>
                                                        </div>
                                                        {
                                                            typeof v.brandColors !== "undefined" && v.brandColors !== "" && v.brandColors !== null &&
                                                                <Row className="mt-3">
                                                                    {
                                                                        v.brandColors.split(";").map((bcvalue,bcindex)=>(
                                                                            <Col xs={4} className="px-1 mb-3" key={bcindex} >
                                                                                <div className="d-flex justify-content-center align-items-center">
                                                                                    <span className="square-box mr-1" style={{backgroundColor:bcvalue}}></span>
                                                                                    <Link component="a" className="btn-circle" data-toggle="tooltip" title="Delete Color" onClick={() => { handleClickDeleteColor(bcvalue) }} >
                                                                                        <i className="far fa-trash-alt" style={{paddingLeft:"6px"}}></i>
                                                                                        <div className="bg-red"></div>
                                                                                    </Link>
                                                                                </div>
                                                                                <span className="square-box-text">{bcvalue}</span>
                                                                            </Col>
                                                                        ))
                                                                    }
                                                                </Row>
                                                        }
                                                    </div>
                                                </Col>
                                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                    <h5 className="mb-3">Fonts</h5>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="country-label" variant="standard">Text Setting</InputLabel>
                                                        <Select
                                                            labelId="country-label"
                                                            name="textSetting"
                                                            onChange={(e)=>{handleChangeFonts(e.target.name, e.target.value)}}
                                                            value={v.brandFonts.textSetting || textSetting}
                                                            variant="standard"
                                                        >
                                                            {
                                                                fontData.map((value, index) => (
                                                                    <MenuItem key={index} value={value.key} style={{fontFamily:value.key}}>{value.value}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Col>
                                            </Row>
                                        </TabPanel>
                                    ))
                                }
                            </Col>
                        </Row>
                    </>
            }
            {modalImport && <ImportStyleModal modalImport={modalImport} toggleImport={toggleImport} selectedBrand={selectedBrand} displayDataBrandList={displayDataBrandList} callType="brandKit" valueTab={valueTab} />}
            <Modal size="lg" isOpen={modalAddBrand} toggle={toggleAddBrand}>
                <ModalHeader toggle={toggleAddBrand}>Your Brand Information</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Stepper className="w-50 p-1 mb-1 mx-auto" alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {getStepContent(activeStep)}
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        }
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyBrandKit)