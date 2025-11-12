import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Checkbox, FormControlLabel, Button, Step, StepLabel, Stepper, RadioGroup, Radio } from '@mui/material';
import {toRGB, QontoConnector, QontoStepIcon} from "../../../assets/commonFunctions.js";
import { grabWebsiteColors, grabWebsiteImages, grabWebsiteLinks, saveBrandData } from "../../../services/profileService.js";
import { grabImagesPolling, grabColorsPolling, grabLinksPolling } from "../../../services/pollingservices.js";
import { deleteFoldersAndFilesED, importImageFromUrlED } from "../../../services/myDesktopService.js";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions.js";
import { setConfirmDialogAction } from "../../../actions/confirmDialogActions.js";
import ColorThief from "color-thief-browser";
import Loader from '../loaderV2/loader';

const ImportStyleModal = ({modalImport, toggleImport, selectedBrand, displayDataBrandList=()=>{}, callType="", valueTab, globalAlert, confirmDialog}) => {
    const [selectLinks, setSelectLinks] = useState([]);
    const [selectLogo, setSelectLogo] = useState("");
    const [selectImages, setSelectImages] = useState([]);
    const [selectColors, setSelectColors] = useState([]);
    const [dataLinkList, setDataLinkList] = useState([]);
    const [dataImageList, setDataImageList] = useState([]);
    const [dataLogoList, setDataLogoList] = useState([]);
    const [dataColorList, setDataColorList] = useState([]);
    const [dataLogoColorList, setDataLogoColorList] = useState([]);
    const [folderName, setFolderName] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const websiteName = callType === "brandKit" ? selectedBrand.brandWebsiteURL : selectedBrand.getValues("brandWebsiteURL");
    const logoSuccess = useRef(false);
    const imageSuccess = useRef(false);
    const steps = ["1","2","3","4","5"];
    const [activeStep, setActiveStep] = useState(0);
    const handleChangeLinkCheckbox = (value) => {
        if(selectLinks.includes(value)){
            setSelectLinks(prev => (prev.filter(x => x !== value)));
        } else {
            setSelectLinks((prev)=>{ return [...prev,value] });
        }
    }
    const handleChangeLogoCheckbox = (value) => {
        setSelectLogo(value);
    }
    const handleChangeImageCheckbox = (value) => {
        if(selectImages.includes(value)){
            setSelectImages(prev => (prev.filter(x => x !== value)));
        } else {
            setSelectImages((prev)=>{ return [...prev,value] });
        }
    }
    const handleChangeColorCheckbox = (value) => {
        if(selectColors.includes(value)){
            setSelectColors(prev => (prev.filter(x => x !== value)));
        } else {
            setSelectColors((prev)=>{ return [...prev,value] });
        }
    }
    const handleClickImportSave = async() => {
        if(selectLogo === "" && selectImages.length === 0 && selectColors.length === 0){
            confirmDialog({
                open: true,
                title: `You haven't select anything to import.\nAre you sure you want to continue?`,
                onConfirm: () => {toggleImport()}
            });
            return false;
        }
        if(selectImages.length > 0){
            setShowLoader(true);
            for(let i=0; i < selectImages.length; i++){
                let requestData = {
                    "destination": folderName,
                    "imageUrl": selectImages[i],
                    "memberId": callType === "brandKit" ? 0 : selectedBrand?.getValues("memberId")
                }
                await importImageFromUrlED(requestData).then(res => {
                    if (res.status === 200) {
                        imageSuccess.current = true;
                    } else {  
                        globalAlert({
                            type: "Error",
                            text: `Sorry your file "${selectImages[i]}" is not imported please try again`,
                            open: true
                        });
                    }
                });
            }
            setShowLoader(false);
        } else {
            imageSuccess.current = true;
        }
        let colorSuccess = false;
        let brandLogo="";
        if(selectLogo !== ""){
            let requestData = {
                "destination": "Logos",
                "imageUrl": selectLogo,
                "memberId": callType === "brandKit" ? 0 : selectedBrand?.getValues("memberId")
            }
            await importImageFromUrlED(requestData).then(res => {
                if (res.status === 200) {
                    brandLogo=res.result.imageUrl;
                    logoSuccess.current = true;
                } else {  
                    globalAlert({
                        type: "Error",
                        text: `Sorry your file "${selectLogo}" is not imported please try again`,
                        open: true
                    });
                }
            });
        } else {
            logoSuccess.current = true;
        }
        let brandColors="";
        if(callType === "brandKit"){
            if(selectColors.length > 0){
                if(typeof selectedBrand.brandColors !== "undefined" && selectedBrand.brandColors !== "" && selectedBrand.brandColors !== null){
                    brandColors = selectedBrand.brandColors+";"+selectColors.join(";");
                    let tempObj = brandColors.split(";").map(JSON.stringify);
                    let uniqueObj = new Set(tempObj);
                    let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                    brandColors = uniqueArr.join(";");
                } else {
                    brandColors = selectColors.join(";");
                }
            } else {
                colorSuccess = true;
            }
            if(brandLogo !== "" || brandColors !==""){
                let requestData = {
                    ...selectedBrand,
                    "brandLogo": brandLogo !== "" ? brandLogo : typeof selectedBrand.brandLogo !== "undefined" ? selectedBrand.brandLogo : null,
                    "brandColors": brandColors !== "" ? brandColors : typeof selectedBrand.brandColors !== "undefined" ? selectedBrand.brandColors : null
                }
                await saveBrandData(requestData).then(res => {
                    if (res.status === 200) {
                        colorSuccess = true;
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
        } else {
            if(selectColors.length > 0){
                if(typeof selectedBrand.getValues("brandLogo") !== "undefined" && selectedBrand.getValues("brandLogo") !== "" && selectedBrand.getValues("brandLogo") !== null){
                    brandColors = selectedBrand.getValues("brandLogo")+";"+selectColors.join(";");
                    let tempObj = brandColors.split(";").map(JSON.stringify);
                    let uniqueObj = new Set(tempObj);
                    let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                    brandColors = uniqueArr.join(";");
                } else {
                    brandColors = selectColors.join(";");
                }
            } else {
                colorSuccess = true;
            }
            if(brandLogo !== "" || brandColors !==""){
                selectedBrand.setValue("brandLogo",brandLogo !== "" ? brandLogo : typeof selectedBrand.getValues("brandLogo") !== "undefined" ? selectedBrand.getValues("brandLogo") : null)
                selectedBrand.setValue("brandColors",brandColors !== "" ? brandColors : typeof selectedBrand.getValues("brandColors") !== "undefined" ? selectedBrand.getValues("brandColors") : null)
                colorSuccess = true;
            }
        }
        if(logoSuccess.current && imageSuccess.current && colorSuccess){
            globalAlert({
                type: "Success",
                text: "Import successfully",
                open: true
            });
        }
        toggleImport();
    }
    const handleNext = () => {
        if(activeStep === 2 && selectLinks.length === 0){
            setActiveStep((prevActiveStep) => prevActiveStep + 2);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };
    const handleBack = () => {
        if(activeStep === 4 && selectLinks.length === 0){
            setActiveStep((prevActiveStep) => prevActiveStep - 2);
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <SelectLogoComponent
                        websiteName={websiteName}
                        dataLogoList={dataLogoList}
                        setDataLogoList={setDataLogoList}
                        selectLogo={selectLogo}
                        handleChangeLogoCheckbox={handleChangeLogoCheckbox}
                        handleNext={handleNext}
                        globalAlert={globalAlert}
                        toggleImport={toggleImport}
                        setShowLoader={setShowLoader}
                    />
                );
            case 1:
                return (
                    <SelectColorsComponent
                        websiteName={websiteName}
                        dataColorList={dataColorList}
                        setDataColorList={setDataColorList}
                        selectColors={selectColors}
                        setSelectColors={setSelectColors}
                        handleChangeColorCheckbox={handleChangeColorCheckbox}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        globalAlert={globalAlert}
                        toggleImport={toggleImport}
                        selectLogo={selectLogo}
                        dataLogoColorList={dataLogoColorList}
                        setDataLogoColorList={setDataLogoColorList}
                        setShowLoader={setShowLoader}
                        selectedBrand={selectedBrand}
                        callType={callType}
                    />
                );
            case 2:
                return (
                    <SelectLinksComponent
                        selectLinks={selectLinks}
                        setSelectLinks={setSelectLinks}
                        dataLinkList={dataLinkList}
                        setDataLinkList={setDataLinkList}
                        websiteName={websiteName}
                        handleChangeLinkCheckbox={handleChangeLinkCheckbox}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        globalAlert={globalAlert}
                        toggleImport={toggleImport}
                        setShowLoader={setShowLoader}
                    />
                );
            case 3:
                return (
                    <SelectImagesComponent
                        dataImageList={dataImageList}
                        setDataImageList={setDataImageList}
                        selectLinks={selectLinks}
                        selectImages={selectImages}
                        setSelectImages={setSelectImages}
                        handleChangeImageCheckbox={handleChangeImageCheckbox}
                        handleBack={handleBack}
                        handleNext={handleNext}
                        globalAlert={globalAlert}
                        toggleImport={toggleImport}
                        setShowLoader={setShowLoader}
                    />
                );
            case 4:
                return (
                    <FinishComponent
                        folderName={folderName}
                        setFolderName={setFolderName}
                        websiteName={websiteName}
                        handleBack={handleBack}
                        handleClickImportSave={handleClickImportSave}
                    />
                );
            default:
                return 'Unknown step';
        }
    }
    return (
        <>
            <Modal size="lg" isOpen={modalImport} toggle={toggleImport}>
                <ModalHeader toggle={toggleImport}>Setting Up Your Brand</ModalHeader>
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
            {showLoader && <Loader />}
        </>
    );
}
const SelectLogoComponent = ({ websiteName, dataLogoList, setDataLogoList, selectLogo, handleChangeLogoCheckbox, handleNext, globalAlert, toggleImport, setShowLoader }) => {
    useEffect(()=>{
        if (dataLogoList.length === 0) {
        let requestData = {
            "urls": [websiteName]
        }
            setShowLoader(true);
        grabWebsiteImages(requestData).then(res => {
            if (res.status === 200) {
                let wcgId = res.result.wcgId;
                if(wcgId){
                    let imageInterval = setInterval(()=>{
                        grabImagesPolling(wcgId).then((res2) => {
                            if(res2.status === 200) {
                                if(res2.result.status && res2.result.error === "") {
                                    setDataLogoList(res2.result.imageUrls);
                                    clearInterval(imageInterval);
                                        setShowLoader(false);
                                } else if(res2.result.status && res2.result.error !== "") {
                                        setShowLoader(false);
                                    globalAlert({
                                        type: "Error",
                                            text: res2.result.error,
                                        open: true
                                    });
                                    clearInterval(imageInterval);
                                }
                            } else {
                                    setShowLoader(false);
                                globalAlert({
                                    type: "Error",
                                    text: res2.message,
                                    open: true
                                });
                                clearInterval(imageInterval);
                            }
                        });
                    }, 5000)
                    } else {
                        setDataLogoList(res.result.imageUrls);
                        setShowLoader(false);
                }
            } else {  
                setShowLoader(false);
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                toggleImport();
            }
        })
        }
    },[websiteName, setDataLogoList, globalAlert, toggleImport]);
    return (
        <>
            <p className="mb-0"><strong>Please select your brand logo</strong></p>
            <p>We support .jpg, .jpeg, .png, .gif files. .svg file is not supported.</p>
            <RadioGroup value={selectLogo} onChange={(e)=>{handleChangeLogoCheckbox(e.target.value)}}>
                <Row className="mx-0 px-2 import-tab-scroll">
                    {
                        dataLogoList.map((value,index)=>(
                            <Col xs={3} className="mb-3 px-2" key={index} >
                                <FormControlLabel value={value} control={<Radio color="primary" />} label={<div className="import-image-box"><img src={value} alt="" /></div>} />
                            </Col>
                        ))
                    }
                </Row>
            </RadioGroup>
            <div className="text-center mt-3">
                <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </div>
        </>
    );
}
const SelectColorsComponent = ({ websiteName, dataColorList, setDataColorList, selectColors, setSelectColors, handleChangeColorCheckbox, handleBack, handleNext, globalAlert, toggleImport, selectLogo, dataLogoColorList, setDataLogoColorList, setShowLoader, selectedBrand, callType }) => {
    const [selectAllLink, setSelectAllLink] = useState(false);
    const handleChangeSelectAll = (value) => {
        if(value){
            setSelectColors([...dataColorList,...dataLogoColorList]);
            setSelectAllLink(true);
        } else {
            setSelectColors([]);
            setSelectAllLink(false);
        }
    }
    useEffect(()=>{
        if (dataColorList.length === 0) {
            setShowLoader(true);
        let requestData = {
            "urls": [websiteName]
        }
        grabWebsiteColors(requestData).then(res => {
            if (res.status === 200) {
                let wcgId = res.result.wcgId;
                if (wcgId) {
                    let imageInterval = setInterval(() => {
                        grabColorsPolling(wcgId).then((res2) => {
                            if (res2.status === 200) {
                                if (res2.result.status && res2.result.error === "") {
                                setDataColorList((prev)=>{
                                    let temp = []
                                        for (let i = 0; i < res2.result.websiteColors.length; i++) {
                                            temp.push(toRGB(res2.result.websiteColors[i]));
                                        }
                                        let tempObj = [...prev,...temp].map(JSON.stringify);
                                        let uniqueObj = new Set(tempObj);
                                        let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                                        return uniqueArr;
                                    })
                                    clearInterval(imageInterval);
                                    setShowLoader(false);
                                } else if (res2.result.status && res2.result.error !== "") {
                                    setShowLoader(false);
                                    globalAlert({
                                        type: "Error",
                                        text: res2.result.error,
                                        open: true
                                    });
                                    clearInterval(imageInterval);
                                }
                            } else {  
                                setShowLoader(false);
                                globalAlert({
                                    type: "Error",
                                    text: res2.message,
                                    open: true
                                });
                                clearInterval(imageInterval);
                            }
                        });
                    }, 5000)
                } else {
                    setDataColorList((prev) => {
                        let temp = []
                        for (let i = 0; i < res.result.websiteColors.length; i++) {
                            temp.push(toRGB(res.result.websiteColors[i]));
                        }
                        let tempObj = [...prev, ...temp].map(JSON.stringify);
                        let uniqueObj = new Set(tempObj);
                        let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                        return uniqueArr;
                    })
                    setShowLoader(false);
                }
            } else {
                setShowLoader(false);
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                toggleImport();
            }
        })
        if(selectLogo !== ""){
            let requestData2 = {
                "destination": "tempLogoTemp",
                "imageUrl": selectLogo,
                "memberId": callType === "brandKit" ? 0 : selectedBrand?.getValues("memberId")
            }
            importImageFromUrlED(requestData2).then(res => {
                if (res.status === 200) {
                    let colorThief = new ColorThief();
                    let sourceImage = document.createElement('img');
                    sourceImage.onload = async function () {
                        let color = await colorThief.getPalette(sourceImage,11);
                        let tc = [];
                        color.map((v)=>(
                            tc.push('rgb('+v+')')
                        ))
                        let tempObj = tc.map(JSON.stringify);
                        let uniqueObj = new Set(tempObj);
                        let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                        setDataLogoColorList(uniqueArr);
                        setSelectColors(uniqueArr);
                        let requestData3 = {
                            "source": ["tempLogoTemp"]
                        }
                        deleteFoldersAndFilesED(requestData3).then(res => {
                            if (res.status === 200) {
                                
                            }
                        });
                    };
                    sourceImage.crossOrigin = 'Anonymous';
                    sourceImage.setAttribute('src', res.result.imageUrl);
                }
            });
        }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[websiteName, setDataColorList, globalAlert, toggleImport]);
    return (
        <>
            <p><strong>Please select your brand colors</strong></p>
            { (dataColorList.length > 0 || dataLogoColorList.length > 0) ?
                <>
                    <FormControlLabel className="ml-1 mr-0 mb-2 import-image-label" control={<Checkbox onChange={(e)=>{handleChangeSelectAll(e.target.checked)}} checked={selectAllLink} color="primary" />} label="Select All" />
                    <Row className="mx-0 import-tab-scroll">
                        {
                            dataLogoColorList.length > 0 ?
                                <>
                                    <Col xs={12} className="mb-2">Logo Colors</Col>
                                    {
                                        dataLogoColorList.map((value,index)=>(
                                            <Col xs={3} className="mb-2" key={index} >
                                                <FormControlLabel className="mr-0 mb-0 import-image-label" control={<Checkbox value={value || ""} onChange={()=>{handleChangeColorCheckbox(value)}} checked={selectColors.includes(value)} color="primary" />} label={<div><span className="square-box" style={{backgroundColor:value}}></span><span className="square-box-text">{value}</span></div>} />
                                            </Col>
                                        ))
                                    }
                                    <Col xs={12}>
                                        <hr/>
                                        <p>Other Colors</p>
                                    </Col>
                                </>
                            : null
                        }
                        {
                            dataColorList.map((value,index)=>(
                                <Col xs={3} className="mb-2" key={index} >
                                    <FormControlLabel className="mr-0 mb-0 import-image-label" control={<Checkbox value={value || ""} onChange={()=>{handleChangeColorCheckbox(value)}} checked={selectColors.includes(value)} color="primary" />} label={<div><span className="square-box" style={{backgroundColor:value}}></span><span className="square-box-text">{value}</span></div>} />
                                </Col>
                            ))
                        }
                    </Row>
                </>
            : null } 
            <div className="text-center mt-3">
                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </div>
        </>
    );
}
const SelectLinksComponent = ({ selectLinks, setSelectLinks, dataLinkList, setDataLinkList, websiteName, handleChangeLinkCheckbox, handleBack, handleNext, globalAlert, toggleImport, setShowLoader }) => {
    const [selectAllLink, setSelectAllLink] = useState(false);
    const handleChangeSelectAll = (value) => {
        if(value){
            setSelectLinks(dataLinkList);
            setSelectAllLink(true);
        } else {
            setSelectLinks([]);
            setSelectAllLink(false);
        }
    }
    useEffect(()=>{
        if(dataLinkList.length === 0) {
            setShowLoader(true);
        let requestData = {
            "url": websiteName
        }
        grabWebsiteLinks(requestData).then(res => {
            if (res.status === 200) {
                    let wcgId = res.result.wcgId;
                    if (wcgId) {
                        let imageInterval = setInterval(() => {
                            grabLinksPolling(wcgId).then((res2) => {
                                if (res2.status === 200) {
                                    if (res2.result.status && res2.result.error === "") {
                                        if (res2.result.websiteLinks[0] === "") {
                                            setDataLinkList([websiteName]);
            } else {  
                                            setDataLinkList(res2.result.websiteLinks);
                                        }
                                        clearInterval(imageInterval);
                                        setShowLoader(false);
                                    } else if (res2.result.status && res2.result.error !== "") {
                                        setShowLoader(false);
                                        globalAlert({
                                            type: "Error",
                                            text: res2.result.error,
                                            open: true
                                        });
                                        clearInterval(imageInterval);
                                    }
                                } else {
                                    setShowLoader(false);
                                    globalAlert({
                                        type: "Error",
                                        text: res2.message,
                                        open: true
                                    });
                                    clearInterval(imageInterval);
                                }
                            });
                        }, 5000)
                    } else {
                        setDataLinkList(res.result.websiteLinks);
                        setShowLoader(false);
                    }
                } else {
                    setShowLoader(false);
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                toggleImport();
            }
        })
        }
    },[websiteName, setDataLinkList, globalAlert, toggleImport]);
    return (
        <>
            <p><strong>We found below links from your website. If you want to import images from them,<br/>please select link(s)</strong></p>
            { dataLinkList.length > 0 ?
                <>
                    <FormControlLabel className="ml-1 mr-0 mb-0 import-image-label" control={<Checkbox onChange={(e)=>{handleChangeSelectAll(e.target.checked)}} checked={selectAllLink} color="primary" />} label="Select All" />
                    <Row className="mx-0 import-tab-scroll">
                        {
                            dataLinkList.map((value,index)=>(
                                <Col xs={12} key={index} >
                                    <FormControlLabel className="mr-0 mb-0 import-image-label" control={<Checkbox value={value || ""} onChange={()=>{handleChangeLinkCheckbox(value)}} checked={selectLinks.includes(value)} color="primary" />} label={value} />
                                </Col>
                            ))
                        }
                    </Row>
                </>
                : null
            }
            <div className="text-center mt-3">
                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </div>
        </>
    );
}
const SelectImagesComponent = ({ dataImageList, setDataImageList, selectLinks, selectImages, setSelectImages, handleChangeImageCheckbox, handleBack, handleNext, globalAlert, toggleImport, setShowLoader }) => {
    const [selectAllLink, setSelectAllLink] = useState(false);
    const handleChangeSelectAll = (value) => {
        if(value){
            setSelectImages(dataImageList);
            setSelectAllLink(true);
        } else {
            setSelectImages([]);
            setSelectAllLink(false);
        }
    }
    useEffect(()=>{
        for(let i=0; i<selectLinks.length; i++){
            let requestData = {
                "urls": [selectLinks[i]]
            }
            setShowLoader(true);
            grabWebsiteImages(requestData).then(res => {
                if (res.status === 200) {
                    let wcgId = res.result.wcgId;
                    if (wcgId) {
                        let imageInterval = setInterval(() => {
                            grabImagesPolling(wcgId).then((res2) => {
                                if (res2.status === 200) {
                                    if (res2.result.status && res2.result.error === "") {
                    setDataImageList((prev)=>{
                                            let tempObj = [...prev, ...res2.result.imageUrls].map(JSON.stringify);
                        let uniqueObj = new Set(tempObj);
                        let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                        return uniqueArr;
                    })
                                        clearInterval(imageInterval);
                                        if(i === (selectLinks.length - 1)) {
                                        setShowLoader(false);
                                        }
                                    } else if (res2.result.status && res2.result.error !== "") {
                                        if(i === (selectLinks.length - 1)) {
                                        setShowLoader(false);
                                        }
                                        globalAlert({
                                            type: "Error",
                                            text: res2.result.error,
                                            open: true
                                        });
                                        clearInterval(imageInterval);
                                    }
                } else {  
                                    if(i === (selectLinks.length - 1)) {
                                    setShowLoader(false);
                                    }
                                    globalAlert({
                                        type: "Error",
                                        text: res2.message,
                                        open: true
                                    });
                                    clearInterval(imageInterval);
                                }
                            });
                        }, 5000)
                    } else {
                        setDataImageList((prev) => {
                            let tempObj = [...prev, ...res.result.imageUrls].map(JSON.stringify);
                            let uniqueObj = new Set(tempObj);
                            let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
                            return uniqueArr;
                        })
                        setShowLoader(false);
                    }
                } else {
                    if(i === (selectLinks.length - 1)) {
                    setShowLoader(false);
                    }
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                    toggleImport();
                }
            })
        }
    },[selectLinks, setDataImageList, globalAlert, toggleImport]);
    return (
        <>
            <p className="mb-0"><strong>Please select your images to import</strong></p>
            <p>We support .jpg, .jpeg, .png, .gif files. .svg file is not supported.</p>
            { dataImageList.length > 0 ?
                <>
                    <FormControlLabel className="ml-1 mr-0 mb-3 import-image-label" control={<Checkbox onChange={(e)=>{handleChangeSelectAll(e.target.checked)}} checked={selectAllLink} color="primary" />} label="Select All" />
                    <Row className="mx-0 pl-2 import-tab-scroll">
                        {
                            dataImageList.map((value,index)=>(
                                <Col xs={3} className="mb-3 px-2" key={index} >
                                    <FormControlLabel className="mr-0 mb-0 import-image-label" control={<Checkbox value={value || ""} onChange={()=>{handleChangeImageCheckbox(value)}} checked={selectImages.includes(value)} color="primary" />} label={<div className="import-image-box"><img src={value} alt="" /></div>} />
                                </Col>

                            ))
                        }
                    </Row>
                </>
            : null }
            <div className="text-center mt-3">
                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button variant="contained" color="primary" onClick={handleNext}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
            </div>
        </>
    );
}
const FinishComponent = ({folderName, setFolderName, websiteName, handleBack, handleClickImportSave}) => {
    useEffect(()=>{
        let temp = websiteName.replaceAll("http://","").replaceAll("https://","").replaceAll("ftp://","").replaceAll("www.","").replaceAll("/","");
        setFolderName(temp);
    },[websiteName,setFolderName]);
    return (
        <>
            <p>Your selected brand logo will save to folder name "Logos" in SAM Drive</p>
            <p>Your selected images will save to folder name "{folderName}" in SAM Drive</p>
            <p>Your selected brand colors will show in every color picker</p>
            <div className="text-center mt-3">
                <Button variant="contained" color="primary" onClick={handleBack} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button variant="contained" color="primary" onClick={()=>handleClickImportSave()}><i className="far fa-upload mr-2"></i>IMPORT</Button>
            </div>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ImportStyleModal);