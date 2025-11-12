import React, { createRef, Fragment, useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Link, Typography } from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import { addVerifyDomainEmail, deleteDomain, deleteDomainEmail, getDomainEmailList, getDomainList } from "../../../services/profileService";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";
import InputField from "../../shared/commonControlls/inputField";
import History from "../../../history";
import { handleClickHelp, validateEmail } from '../../../assets/commonFunctions';
import { staticUrl, websiteTitle, websiteTitleWithExt } from '../../../config/api';
import { ModalBuyEmailWarmUpService } from './commonModal';
import { checkAuthorized } from '../../../services/commonService';
import { setConfirmDialogAction } from '../../../actions/confirmDialogActions';
import { setPendingTransactionAction } from '../../../actions/pendingTransactionActions';

const statusTooltip = `Healthy:
DNS (Domain Name System) and email configurations are correctly set up, secure, fully aligned and functional. Domain can be used for email marketing.
 
Unhealthy:
Domain has misconfigurations, missing DNS records, or security vulnerabilities that could:
Lead to email delivery failures.
Damage domain reputation (e.g. marked as spam).
Make the domain susceptible to spoofing or phishing attacks
Domain can NOT be used for email marketing.`;
const espTooltip = "Email Service Provider";
const dkimTooltip = "DKIM (DomainKeys Identified Mail) is an email authentication method that uses a digital signature to verify the sender and ensure the message hasn't been altered during transit.";
const spfTooltip = "SPF (Sender Policy Framework) is an email authentication method that helps prevent email spoofing by allowing domain owners to specify which mail servers are authorized to send emails on behalf of their domain.";
const dmarcTooltip = `DMARC (Domain-based Message Authentication, Reporting & Conformance) is an email authentication protocol that builds upon the widely used SPF and DKIM protocols to enhance email security.\n
In essence, DMARC allows domain owners to:\n
1. Specify how receiving email servers should handle messages that fail SPF and DKIM checks: This includes options like rejecting the message (not delivering it), quarantining it (typically sending it to the spam folder), or taking no specific action (allowing the message to be delivered).\n
2. Receive reports about emails sent from their domain: These reports help domain owners understand who is sending emails on their behalf and how well their email authentication is working.\n
3. Align the "From" address with SPF and DKIM results: DMARC verifies that the domain in the "From" address (which is what recipients see) matches the domain that is authenticated by SPF and DKIM, preventing attackers from spoofing the visible "From" address.`;
const domainCapacityTooltip = "Domain reputation reflects the trustworthiness of emails originating from your domain, as assessed by email service providers (ESPs) and anti-spam services. A higher score indicates greater trustworthiness, improving the chances of your emails reaching recipients' inboxes and enabling you to send emails more frequently.\n\nTo improve the domain's sending capacity, either use the email warming service or send emails frequently to validated subscribers. Utilizing the email warming service is strongly recommended.";
const bimiTooltip = "BIMI, which stands for Brand Indicators for Message Identification, is an emerging email specification that enables the display of brand logos within supporting email clients.";

const DomainEmailVerification = (props) => {
    const [modalHelp, setModalHelp] = useState(false);
    const toggleHelp = () => setModalHelp(!modalHelp);
    const [modalAddVerifyEmail, setModalAddVerifyEmail] = useState(false);
    const toggleAddVerifyEmail = () => setModalAddVerifyEmail(!modalAddVerifyEmail);
    const [domainData, setDomainData] = useState([]);
    const [domainEmailData, setDomainEmailData] = useState([]);
    const [addDomainEmailData, setAddDomainEmailData] = useState({ "uid": props.user.memberId, "subMemberId": props.subUser.memberId });
    const publicDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.co.in", "zoho.com", "mail.com", "aol.com"];
    const inputRefsAddEmail = useRef([createRef()]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [modalBuyWarmUp, setModalBuyWarmUp] = useState(false);
    const toggleBuyWarmUp = () => { setModalBuyWarmUp(!modalBuyWarmUp); };
    const [indexHelp, setIndexHelp] = useState(0);

    const modalData = [
        {
            title: "Why do we verify domain names and email addresses?",
            content: () => `We verify domain that you want to use for your SalesAndMarketing marketing campaign to make sure that you are authorized to use that domain name and email address associated with that domain.\n\nFor example if you own or are authorized to use domain name xyz.com and want to use the email address newsletter@xyz.com and sales@xyz.com then we need verify both the domain name and email addresses that you wish to use at SalesAndMarketing.ai.\n\nEmail verification is required to use the your email address in your marketing campaign but domain verification is not. However, we high recommend that you verify your domain to void having your marketing campaign email being flagged as spam when using your email address.`
        },
        {
            title: "How does domain and email verification process works?",
            content: () => (
                <>
                    <h5>How does domain verification process works?</h5>
                    <p>{websiteTitle} domain verification process wizard give you a unique SPF and DKIM key to add to your domain DNS server. Adding DKIM and SPF keys to your DNS tells the receiving mail servers like Gmail.com, Yahoo.com, Outlook.com, Live.com, and MSN.com that you have authorized our mail servers to send email on your behalf. <Link target="_blank" rel="noopener" href={`${staticUrl}/dkim-and-spf-records.html`}>Learn more about DKIM and SPF</Link>.</p>
                    <p><strong>Step 1</strong>: We will ask you for your domain name that you want to use with your email marketing and survey campaign. If you want to use multiple domains for you’re different email campaign or survey then you will have repeat this process for each domain. Depending on you account type you might be limited to how many domain or email you can use at {websiteTitleWithExt}.</p>
                    <p><strong>Step 2:</strong> We will give you two dns key and value pair to add to your domain DNS. One is SPF key value pair and other is DKIM key value pair. Once you have added these two keys to your domain DNS then you can click Verify button on step two.</p>
                    <p><strong>Step 3:</strong> If you have done everything correctly in previous steps we will give you confirmation page. Once domain is validated, then you will be able to validate email address associated with that domain to use in your {websiteTitle} campaigns.</p>
                    <h5>How email verification process works?</h5>
                    <p>Once you have verified a domain you can verify the email address associated with that domain.</p>
                    <p><strong>Step 1:</strong> We will ask you for email address. Once you provide the email address associated with a verified domain we will send you an email on that email address with a unique code.</p>
                    <p><strong>Step 2:</strong> We will ask you to enter that unique code. Once code is verified you will be able to use the verified email address in your {websiteTitle} campaign.</p>
                </>
            )
        },
        {
            title: "What is DKIM?",
            content: () => ( dkimTooltip )
        },
        {
            title: "What is SPF?",
            content: () => ( spfTooltip )
        },
        {
            title: "What is DMarc?",
            content: () => ( dmarcTooltip )
        },
        {
            title: "What is BIMI?",
            content: () => ( bimiTooltip )
        }
    ]

    const deleteDomainEmailData = (deId) => {
        props.confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this email address?',
            onConfirm: () => {
                deleteDomainEmail(deId).then(res => {
                    if (res.status === 200) {
                        const filterDomainEmail = [...domainEmailData];
                        setDomainEmailData(filterDomainEmail.filter(x => x.deId !== deId));
                        props.globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        props.globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const deleteDomainData = (dId) => {
        props.confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this domain? All emails associated with this domain will also be deleted.',
            onConfirm: () => {
                deleteDomain(dId).then(res => {
                    if (res.status === 200) {
                        const filterDomain = [...domainData];
                        setDomainData(filterDomain.filter(x => x.id !== dId));
                        props.globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        props.globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const getDomainEmail = (dId) => {
        const DomainEmail = domainEmailData.filter(x => x.did === dId);
        return DomainEmail.length > 0 ?
            DomainEmail.map((devalue, deindex) => {
                return (
                    <tr key={deindex}>
                        <td className='border-0'><i className="far fa-trash-alt mr-3" onClick={() => { deleteDomainEmailData(devalue.deId) }}></i>{devalue.email}</td>
                        <td colSpan={13} className='border-0'>Healthy</td>
                    </tr>
                )
            })
            :
            <tr>
                <td colSpan={2} className="text-center border-0">There is no any data.</td>
                <td colSpan={12} className="border-0"></td>
            </tr>
    }
    const handleChangeAddEmail = (name, value) => {
        setAddDomainEmailData(prev => ({ ...prev, [name]: value }))
    }
    const addDomainVerify = (domainName) => {
        History.push("/domainverification?d=" + domainName);
    }
    const submitFormAddEmail = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < inputRefsAddEmail.current.length; i++) {
            const valid = inputRefsAddEmail.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        if (typeof addDomainEmailData?.email !== "undefined" && addDomainEmailData?.email !== "" && addDomainEmailData?.email !== null) {
            if (!validateEmail(addDomainEmailData?.email)) {
                props.globalAlert({
                    type: "Error",
                    text: "Please enter proper email",
                    open: true
                });
                return false;
            }
        }
        addVerifyDomainEmail(addDomainEmailData).then(res => {
            toggleAddVerifyEmail();
            setAddDomainEmailData(prev => ({ ...prev, "email": "" }));
            if (res.status === 200) {
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const handleClickBuyTheService = (domainName) => {
        checkAuthorized().then(res => {
            if (res.status === 200) {
                setSelectedDomain(domainName);
                toggleBuyWarmUp();
            } else {
                props.confirmDialog({
                    open: true,
                    title: 'Your credit card is not available. Please add it.',
                    onConfirm: () => {
                        props.pendingTransaction([{
                            "pendingTransactionType": "buyEmailWarmUp"
                        }]);
                        History.push("/carddetails");
                    }
                })
            }
        })
    }
    const handleClickHelpLink = (index) => {
        setIndexHelp(index);
        toggleHelp();
    }

    useEffect(() => {
        getDomainEmailList(0).then(res => {
            if (res.result.domainEmail) {
                setDomainEmailData(res.result.domainEmail);
            }
        });
        getDomainList().then(res => {
            if (res.result.domain) {
                setDomainData(res.result.domain);
            }
        });
    }, []);

    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={6} lg={6} xl={6}><h3>Domain & Email Verification</h3></Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-right"><Button variant="contained" color="primary" className="mr-3" onClick={() => toggleAddVerifyEmail()}>ADD/VERIFY EMAIL</Button><Button variant="contained" color="primary" onClick={() => { History.push("/domainverification") }}>ADD/VERIFY A DOMAIN</Button></Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="my-4">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className='flex-row-reverse'
                        >
                            <Typography className='ml-3' component="span"><h4 className='mb-0'>Documentation</h4></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(0)}>Why do we verify domain names and email addresses?</Link></h5>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(1)}>How does domain and email verification process works?</Link></h5>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(2)}>What is DKIM?</Link></h5>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(3)}>What is SPF?</Link></h5>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(4)}>What is DMarc?</Link></h5>
                                <h5><Link component="button" onClick={() => handleClickHelpLink(5)}>What is BIMI?</Link></h5>
                                <h5><Link component="a" href={`${staticUrl}/support`} target='_blank'>Addition support documentation</Link></h5>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        domainData ?
                            domainData.map((value, index) => {
                                return (
                                    <Fragment key={index}>
                                        <Card className='mb-4'>
                                            <Table responsive className='mb-0'>
                                                <thead>
                                                    <tr>
                                                        <th style={{ "min-width": "350px" }}>DOMAIN</th>
                                                        <th style={{ "min-width": "120px" }}>STATUS <i className="far fa-info-circle ml-3" data-toggle="tooltip" title={statusTooltip.replaceAll("\n","<br/>")} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th style={{ "min-width": "200px" }}>DNS Provider</th>
                                                        <th style={{ "min-width": "200px" }}>Email Provider <i className="far fa-info-circle ml-3" data-toggle="tooltip" title={espTooltip} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th style={{ "min-width": "60px" }}>DKIM</th>
                                                        <th style={{ "min-width": "40px" }}><i className="far fa-info-circle" data-toggle="tooltip" title={dkimTooltip} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th className='text-center' style={{ "min-width": "60px" }}>SPF</th>
                                                        <th style={{ "min-width": "40px" }}><i className="far fa-info-circle" data-toggle="tooltip" title={spfTooltip} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th style={{ "min-width": "60px" }}>DMarc</th>
                                                        <th style={{ "min-width": "40px" }}><i className="far fa-info-circle" data-toggle="tooltip" title={dmarcTooltip.replaceAll("\n","<br/>")} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th className='text-center' style={{ "min-width": "60px" }}>BIMI</th>
                                                        <th style={{ "min-width": "40px" }}><i className="far fa-info-circle" data-toggle="tooltip" title={bimiTooltip} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th style={{ "min-width": "200px" }}>Domain Capacity <i className="far fa-info-circle ml-3" data-toggle="tooltip" title={domainCapacityTooltip.replaceAll("\n","<br/>")} data-html={true} data-template="<div class='custom-tooltip tooltip' role='tooltip'><div class='arrow'></div><div class='tooltip-inner'></div></div>"></i></th>
                                                        <th style={{ "min-width": "120px" }}>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="align-middle">
                                                            <i className="far fa-trash-alt mr-3" onClick={() => { deleteDomainData(value.id) }}></i>
                                                            {value.domain}
                                                        </td>
                                                        <td className="align-middle">
                                                            {
                                                                value.status === 1 ?
                                                                    "Healthy"
                                                                :
                                                                    publicDomains.includes(value.domain) ?
                                                                        <span style={{ "color": "#fe2600" }}>--</span>
                                                                    :
                                                                        <span style={{ "color": "#fe2600" }}>Unhealthy</span>
                                                            }
                                                        </td>
                                                        <td className="align-middle">{value.dsp}</td>
                                                        <td className="align-middle">{value.esp}</td>
                                                        <td className="align-middle text-center">
                                                            {
                                                                value?.dkim === "Y" ? 
                                                                    <i className="far fa-check text-green"></i>
                                                                :
                                                                    <i className="far fa-times text-red"></i>
                                                            }
                                                        </td>
                                                        <td></td>
                                                        <td className="align-middle text-center">
                                                            {
                                                                value?.spf === "Y" ?
                                                                    <i className="far fa-check text-green"></i>
                                                                :
                                                                    <i className="far fa-times text-red"></i>
                                                            }
                                                        </td>
                                                        <td></td>
                                                        <td className="align-middle text-center">
                                                            {
                                                                value?.dmarc === "Y" ?
                                                                    <i className="far fa-check text-green"></i>
                                                                :
                                                                    <i className="far fa-times text-red"></i>
                                                            }
                                                        </td>
                                                        <td></td>
                                                        <td className="align-middle text-center">
                                                            {
                                                                value?.bimi === "Y" ?
                                                                    <i className="far fa-check text-green"></i>
                                                                :
                                                                    <i className="far fa-times text-red"></i>
                                                            }
                                                        </td>
                                                        <td></td>
                                                        <td className="align-middle">{value?.domainCapacity} Emails Per Day</td>
                                                        <td className="align-middle">
                                                            {
                                                                (!publicDomains.includes(value.domain) && value.status !== 1) ?
                                                                    <Button variant="contained" color="primary" onClick={() => { addDomainVerify(value.domain) }}>VERIFY</Button>
                                                                : <span>&nbsp;</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{"width":"20%"}}>EMAIL ADDRESSES</th>
                                                        <th style={{"width":"80%"}} colSpan={13}>STATUS</th>
                                                    </tr>
                                                    {getDomainEmail(value.id)}
                                                    {
                                                        value.status === 1 ?
                                                            <tr>
                                                                <td colSpan={14}>
                                                                    <div className='d-flex align-items-center'>
                                                                        <Button variant="contained" color="primary" onClick={() => { handleClickBuyTheService(value.domain) }}>BUY DOMAIN WARMUP SERVICE</Button>
                                                                        <i className="far fa-question-circle ml-3 font-size-18" onClick={() => { handleClickHelp("DomainandEmailVerification/Domain/EmailWarmup/HowtoWarmUpaDomain.html") }}></i>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        : null
                                                    }
                                                </tbody>
                                            </Table>
                                        </Card>
                                    </Fragment>
                                );
                            })
                        :
                            <p className="text-center">There is no any data.</p>
                    }
                </Col>
            </Row>
            <Modal size="lg" isOpen={modalHelp} toggle={toggleHelp}>
                <ModalHeader toggle={toggleHelp}>{modalData[indexHelp].title}</ModalHeader>
                <ModalBody className='white-space-pre-line'>
                    {modalData[indexHelp].content()}
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={() => toggleHelp()} >CANCEL</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalAddVerifyEmail} toggle={toggleAddVerifyEmail}>
                <form onSubmit={submitFormAddEmail}>
                    <ModalHeader toggle={toggleAddVerifyEmail}>Verify Email</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <InputField
                                ref={inputRefsAddEmail.current[0]}
                                type="text"
                                id="email"
                                name="email"
                                label="Enter email"
                                value={addDomainEmailData?.email || ""}
                                onChange={handleChangeAddEmail}
                                validation={"required"}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="contained" color="primary" type="submit" className="mr-3" >SUBMIT</Button>
                        <Button variant="contained" color="primary" onClick={() => toggleAddVerifyEmail()} >CANCEL</Button>
                    </ModalFooter>
                </form>
            </Modal>
            <ModalBuyEmailWarmUpService modalBuyWarmUp={modalBuyWarmUp} toggleBuyWarmUp={toggleBuyWarmUp} selectedDomain={selectedDomain} globalAlert={props.globalAlert} warmUpPrice={props.countrySetting.cntyWarmupPrice} displayDetails={true} size={"lg"} subMemberId={props.subUser.memberId} />
        </>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser,
        countrySetting: state.countrySetting
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
export default connect(mapStateToProps, mapDispatchToProps)(DomainEmailVerification);