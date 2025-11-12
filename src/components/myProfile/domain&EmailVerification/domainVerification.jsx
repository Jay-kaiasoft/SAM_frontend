import React, {createRef, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Col, FormGroup, Row, Table} from "reactstrap";
import InputField from "../../shared/commonControlls/inputField";
import {Button, FormControlLabel, Radio, RadioGroup, Step, StepLabel, Stepper} from "@mui/material";
import {vdomainCNAME, vdomainTXT, websiteTitle, websiteTitleWithExt} from "../../../config/api";
import { checkDMARC, getDNSProvider, saveDomain } from '../../../services/profileService';
import { setGlobalAlertAction } from '../../../actions/globalAlertActions';
import { setConfirmDialogAction } from '../../../actions/confirmDialogActions';
import { setPendingTransactionAction } from '../../../actions/pendingTransactionActions';
import { ModalBuyEmailWarmUpService, ModalDomainVerificationSuccessfully } from './commonModal';
import History from '../../../history';
import { QontoConnector, QontoStepIcon, copyElementText } from '../../../assets/commonFunctions';

const DomainVerification = (props) => {
    // const steps = ["1","2","3","4","5"];
    const steps = ["1","2","3","4"];
    const [activeStep, setActiveStep] = useState(0);
    const querySting = new URLSearchParams(props.location.search);
    const d = querySting.get("d") ? querySting.get("d") : "";
    const [data, setData] = useState({"subMemberId":props.subUser.memberId,domain:d});
    const [modalWarmUp, setModalWarmUp] = useState(false);
    const toggleWarmUp = () => { setModalWarmUp(!modalWarmUp); };
    const [modalBuyWarmUp, setModalBuyWarmUp] = useState(false);
    const toggleBuyWarmUp = () => { setModalBuyWarmUp(!modalBuyWarmUp); };
    const inputRefs = useRef([createRef()]);

    const handleNext = () => {
        // if(data?.selectType === "automatically"){
        //     setActiveStep((prevActiveStep) => prevActiveStep + 3);
        // } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // }
    };
    const handleBack = () => {
        // if(data?.selectType === "automatically"){
        //     setActiveStep((prevActiveStep) => prevActiveStep - 3);
        // } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        // }
    };
    const handleClickNextFirst = () => {
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
            if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(data.domain)){
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        getDNSProvider(data?.domain).then(res => {
            if (res.status === 200) {
                handleChange("dnsProvider",res.result.dnsProvider);
                handleNext();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    // const handleClickNextSecond = () => {
    //     if(typeof data?.selectType === "undefined" || data?.selectType === "" || data?.selectType === null){
    //         props.globalAlert({
    //             type: "Error",
    //             text: "Select type",
    //             open: true
    //         });
    //         return false;
    //     }
    //     if(data?.selectType === "manually"){
    //         handleNext();
    //     } else if(data?.selectType === "automatically"){
    //         handleNext();
    //     }
    // }
    const handleClickNextThird = () => {
        handleNext();
    }
    const handleClickNextFourth = () => {
        if(typeof data?.setExistingSpf === "undefined" || data?.setExistingSpf === "" || data?.setExistingSpf === null){
            props.globalAlert({
                type: "Error",
                text: "Please select",
                open: true
            });
            return false;
        }
        handleNext();
    }
    const handleChange = (name, value) => {
        if(name === "domain"){
            value=value.replace("http://", "").replace("https://", "").replace("www.", "").replace("/","");
        }
        setData(prev => ({ ...prev, [name]: value }))
    }
    const handleClickSave = () => {
        saveDomain(data).then(res => {
            if (res.status === 200) {
                toggleWarmUp();
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <DomainDetails
                        inputRefs={inputRefs}
                        data={data}
                        handleChange={handleChange}
                        handleClickNextFirst={handleClickNextFirst}
                    />
                );
            // case 1:
            //     return (
            //         <SelectType
            //             data={data}
            //             handleChange={handleChange}
            //             handleBack={handleBack}
            //             handleClickNextSecond={handleClickNextSecond}
            //         />
            //     );
            case 1:
                return (
                    <DkimDetails
                        data={data}
                        handleBack={handleBack}
                        handleClickNextThird={handleClickNextThird}
                    />
                );
            case 2:
                return (
                    <SpfDetails
                        data={data}
                        handleChange={handleChange}
                        handleBack={handleBack}
                        handleClickNextFourth={handleClickNextFourth}
                    />
                );
            case 3:
                return (
                    <DmarcDetails
                        data={data}
                        handleBack={handleBack}
                        handleClickSave={handleClickSave}
                        globalAlert={props.globalAlert}
                    />
                );
            default:
                return 'Unknown step';
        }
    }

    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Domain Verification</h3>
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
            <ModalDomainVerificationSuccessfully modalWarmUp={modalWarmUp} toggleWarmUp={toggleWarmUp} warmUpPrice={props.countrySetting.cntyWarmupPrice} toggleBuyWarmUp={toggleBuyWarmUp} confirmDialog={props.confirmDialog} pendingTransaction={props.pendingTransaction} />
            <ModalBuyEmailWarmUpService modalBuyWarmUp={modalBuyWarmUp} toggleBuyWarmUp={toggleBuyWarmUp} selectedDomain={data?.domain} globalAlert={props.globalAlert} subMemberId={props.subUser.memberId}/>
        </>
    );
}

const DomainDetails = ({inputRefs, data, handleChange, handleClickNextFirst}) => {
    return (
        <Row className="mt-5">
            <Col xs={3} className="mx-auto">
                <h5>Add domain</h5>
                <FormGroup>
                    <InputField
                        ref={inputRefs.current[0]}
                        type="text"
                        id="domain"
                        name="domain"
                        label="Domain"
                        onChange={handleChange}
                        validation={"required"}
                        value={data?.domain || ""}
                    />
                </FormGroup>
                <FormGroup className="text-center">
                    <Button variant="contained" color="primary" onClick={()=>{History.push("/domainemailverification");}}className="mr-3"><i className="far fa-times mr-2"></i>CANCEL</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickNextFirst()}}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </FormGroup>
            </Col>
        </Row>
    );
}

// const SelectType = ({data, handleChange, handleBack, handleClickNextSecond}) => {
//     return (
//         <Row className="mt-5">
//             <Col xs={3} className="mx-auto">
//                 <FormGroup>
//                     <FormLabel id="selectType">You want to set DKIM and SPF</FormLabel>
//                     <RadioGroup aria-label="selectType" id="selectType" name="selectType" value={data?.selectType || ""} onChange={(e)=>{handleChange(e.target.name, e.target.value)}} >
//                         <FormControlLabel value="automatically" control={<Radio color="primary" />} label="Automatically" />
//                         <FormControlLabel value="manually" control={<Radio color="primary" />} label="Manually" />
//                     </RadioGroup>
//                 </FormGroup>
//                 <FormGroup className="text-center">
//                     <Button variant="contained" color="primary" onClick={()=>{handleBack()}} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
//                     <Button variant="contained" color="primary" onClick={()=>{handleClickNextSecond()}}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
//                 </FormGroup>
//             </Col>
//         </Row>
//     );
// }

const DkimDetails = ({data, handleBack, handleClickNextThird}) => {
    const handleClickInstrucation = () => {
        let x = window.innerWidth - 600;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open('https://www.godaddy.com/en-in/help/add-a-cname-record-19236', "Godaddy DKIM Record", "width=600,height=700,left=" + x + ",top=" + y);
    }
    return (
        <Row className="mt-5">
            <Col xs={8} className="mx-auto">
                <h5>DKIM Authentication</h5>
                <p>Authorize <strong>{data?.domain}</strong> with {websiteTitle} by modifying your domain's DNS records. These changes allow your campaigns to be sent from {websiteTitleWithExt} mail servers on the behalf of your domain <strong>{data?.domain}</strong>. After you've made the required DNS changes, this configuration can take as long as 24-48 hours for the changes to propagate Worldwide.</p>
                <p>We have generated DKIM records for GoDaddy a popular DNS provider. If you are not using GoDaddy, you will need to configure your DKIM records using your DNS provider procedures.</p>
                <p><strong>Create A DKIM record</strong></p>
                <p>Create a <strong>CNAME</strong> record type in <strong>{data?.domain}</strong> domain DNS server with following value:</p>
                <div className="table-content-header">
                    <Table bordered>
                        <thead>
                            <tr role="row">
                                <th style={{width:"20%"}}>Type</th>
                                <th style={{width:"40%"}}>Name</th>
                                <th style={{width:"40%"}}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CNAME</td>
                                <td>
                                    <p id="dkimName" className="mb-0 w-100">sammail._domainkey
                                        <i
                                            id="copyDkimName"
                                            className="far fa-copy ml-3"
                                            onClick={()=>{copyElementText("dkimName", "copyDkimName", "Copied To Clipboard");}}
                                            data-toggle="tooltip"
                                            title="Copy"
                                        ></i>
                                    </p>
                                </td>
                                <td>
                                    <p id="dkimValue" className="mb-0 w-100">{vdomainCNAME}
                                        <i
                                            id="copyDkimValue"
                                            className="far fa-copy ml-3"
                                            onClick={()=>{copyElementText("dkimValue", "copyDkimValue", "Copied To Clipboard");}}
                                            data-toggle="tooltip"
                                            title="Copy"
                                        ></i>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                {
                    data?.dnsProvider === "godaddy" &&
                    <div>
                        <p>Your domain is registered with GoDaddy.</p>
                        <p><span className='text-blue cursor-pointer' onClick={()=>{handleClickInstrucation();}}>Click Here</span> for instrucation to set DKIM record in Godaddy</p>
                    </div>
                }
                <FormGroup className="text-center">
                    <Button variant="contained" color="primary" onClick={()=>{handleBack()}} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickNextThird()}}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </FormGroup>
            </Col>
        </Row>
    );
}

const SpfDetails = ({data, handleChange, handleBack, handleClickNextFourth}) => {
    const handleClickInstrucation = () => {
        let x = window.innerWidth - 600;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open('https://www.godaddy.com/en-in/help/add-a-txt-record-19232', "Godaddy SPF", "width=600,height=700,left=" + x + ",top=" + y);
    }
    const handleClickBack = () => {
        handleChange("setExistingSpf","");
        handleBack();
    }
    return (
        <Row className="mt-5">
            <Col xs={8} className="mx-auto">
                <h5>SPF Authentication</h5>
                <p>Please check your dns server records for existing SPF record.</p>
                <div className="d-flex align-items-center mb-3">
                    <div>Do you have an existing SPF record?</div>
                    <div className="ml-3">
                        <RadioGroup
                            row
                            id="setExistingSpf" 
                            name="setExistingSpf"
                            value={data?.setExistingSpf || ""}
                            onChange={(event) => {
                                handleChange("setExistingSpf", event.target.value);
                            }}>
                            <FormControlLabel className="mb-0" value={"yes"} control={<Radio color="primary" />} label="Yes" />
                            <FormControlLabel className="mb-0" value={"no"} control={<Radio color="primary" />} label="No" />
                        </RadioGroup>
                    </div>
                </div>
                { 
                    data?.setExistingSpf === "yes" &&
                    <>
                        <p>If you have existing a SPF record please add the following to <strong>{vdomainTXT}</strong> after the text <strong> v=spf1</strong>. Make sure no other values are removed when adding our include: value below. Your email service provider's include: value might already be present, so be careful not to remove it.</p>
                        <div className="table-content-header">
                            <Table bordered>
                                <thead>
                                    <tr role="row">
                                        <th style={{width:"20%"}}>Type</th>
                                        <th style={{width:"20%"}}>Name</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>TXT</td>
                                        <td>
                                            <p id="spfName" className="mb-0 w-100">@
                                                <i
                                                    id="copySpfName"
                                                    className="far fa-copy ml-3"
                                                    onClick={()=>{copyElementText("spfName", "copySpfName", "Copied To Clipboard");}}
                                                    data-toggle="tooltip"
                                                    title="Copy"
                                                ></i>
                                            </p>
                                        </td>
                                        <td>
                                            <p id="spfValue" className="mb-0 w-100">{vdomainTXT}
                                                <i
                                                    id="copySpfValue"
                                                    className="far fa-copy ml-3"
                                                    onClick={()=>{copyElementText("spfValue", "copySpfValue", "Copied To Clipboard");}}
                                                    data-toggle="tooltip"
                                                    title="Copy"
                                                ></i>
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </>
                }
                { 
                    data?.setExistingSpf === "no" &&
                    <>
                        <p>If you don't have an existing SPF record, create a TXT record for <strong>{data?.domain}</strong> with this value:</p>
                        <div className="table-content-header">
                            <Table bordered>
                                <thead>
                                    <tr role="row">
                                        <th style={{width:"20%"}}>Type</th>
                                        <th style={{width:"20%"}}>Name</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>TXT</td>
                                        <td>
                                            <p id="spfName2" className="mb-0 w-100">@
                                                <i
                                                    id="copySpfName2"
                                                    className="far fa-copy ml-3"
                                                    onClick={()=>{copyElementText("spfName2", "copySpfName2", "Copied To Clipboard");}}
                                                    data-toggle="tooltip"
                                                    title="Copy"
                                                ></i>
                                            </p>
                                        </td>
                                        <td>
                                            <p id="spfValue2" className="mb-0 w-100">v=spf1 {vdomainTXT} ~all
                                                <i
                                                    id="copySpfValue2"
                                                    className="far fa-copy ml-3"
                                                    onClick={()=>{copyElementText("spfValue2", "copySpfValue2", "Copied To Clipboard");}}
                                                    data-toggle="tooltip"
                                                    title="Copy"
                                                ></i>
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <p>Please note:<br/>{`The ~all tag indicates a “soft fail” and the -all indicates a “hard fail”. The all tag has the follow security features. -all means “fail servers” that aren’t listed in the SPF record are not authorized to send email (not compliant emails will be rejected). ~all means “soft fail” If the email is received from a server that isn’t listed, the email will be marked as a soft fail (emails will be accepted but marked). +all We strongly recommend not to use this option, this tag allows any server to send email from your domain.`}</p>
                        <p className="mb-4">Source your mail server or DNS provider for more information.</p>
                    </>
                }
                {
                    data?.dnsProvider === "godaddy" &&
                    <div>
                        <p>Your domain is registered with GoDaddy.</p>
                        <p><span className='text-blue cursor-pointer' onClick={()=>{handleClickInstrucation();}}>Click Here</span> for instrucation to set SPF in Godaddy</p>
                    </div>
                }
                <FormGroup className="text-center">
                    <Button variant="contained" color="primary" onClick={()=>{handleClickBack()}} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickNextFourth()}}><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                </FormGroup>
            </Col>
        </Row>
    );
}

const DmarcDetails = ({data, handleBack, handleClickSave, globalAlert}) => {
    const [dataDmarc, setDataDmarc] = useState(true);
    useEffect(()=>{
        checkDMARC(data?.domain).then(res => {
            if (res.status === 200) {
                setDataDmarc(res.result.checkDMARC);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[]);
    return (
        <Row className="mt-5">
            <Col xs={6} className="mx-auto">
                <h5>DMARC Authentication</h5>
                {
                    dataDmarc ?
                        <p>Your DMARC is set.</p>
                    :
                        <>
                            <h5 className='mt-3 text-warning'><i className="fas fa-exclamation-triangle"></i> Warning</h5>
                            <p>
                                Your company's DMARC policy prevents to send and receive emails from your company's email server and a remote email server. Use personal email accounts when testing.  
                            </p>
                            <p>
                                To change your DMARC policy use the following setting
                            </p>
                            <div className="table-content-header">
                                <Table bordered>
                                    <thead>
                                        <tr role="row">
                                            <th style={{width:"8%"}}>Type</th>
                                            <th style={{width:"25%"}}>Name</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>TXT</td>
                                            <td>
                                                <p id="dmarcName" className="mb-0 w-100">_dmarc.{data.domain}
                                                    <i
                                                        id="copyDmarcName"
                                                        className="far fa-copy ml-3"
                                                        onClick={()=>{copyElementText("dmarcName", "copyDmarcName", "Copied To Clipboard");}}
                                                        data-toggle="tooltip"
                                                        title="Copy"
                                                    ></i>
                                                </p>
                                            </td>
                                            <td>
                                                <p id="dmarcValue" className="mb-0 w-100">v=DMARC1; p=none; rua=mailto:c05b0825cd96066@rep.dmarcanalyzer.com; ruf=mailto:c05b0825cd96066@for.dmarcanalyzer.com; fo=1
                                                    <i
                                                        id="copyDmarcValue"
                                                        className="far fa-copy ml-3"
                                                        onClick={()=>{copyElementText("dmarcValue", "copyDmarcValue", "Copied To Clipboard");}}
                                                        data-toggle="tooltip"
                                                        title="Copy"
                                                    ></i>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </>
                }
                <FormGroup className="text-center">
                    <Button variant="contained" color="primary" onClick={()=>{handleBack()}} className="mr-3"><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{handleClickSave()}} className="mr-3"><i className="far fa-save mr-2"></i>SAVE</Button>
                    <Button variant="contained" color="primary" onClick={()=>{History.push("/domainemailverification");}}><i className="far fa-times mr-2"></i>CANCEL</Button>
                </FormGroup>
            </Col>
        </Row>
    );
}

const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser,
        countrySetting:state.countrySetting
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        },
        pendingTransaction: (data) => {
            dispatch(setPendingTransactionAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DomainVerification);