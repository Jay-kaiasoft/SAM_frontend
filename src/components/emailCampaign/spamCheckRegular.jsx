import { Button } from "@mui/material";
import React from "react";
import { Row, Col } from "reactstrap";

const spamCheckText1 = "SPAM Analysis. You can refer to our knowledge base to learn more about <a href='javascript:void(0);' style='text-decoration: underline;' onClick='handleClickHelp(\"EmailMarketing/EmailCampaign/SPAM/WhatisSPAMandhowtopreventit.html\")'>SPAM</a>.<br>SPAM Probability Checking may take some time."
const spamCheckText2 = "WARNING! It is highly recommended you give us permission to send email on your behalf with our <a href='' className='hover'>Trusted Domain process.</a><br>If you do not know the owner of the domain or go through this setup, please use an internet email account such as Hotmail or Gmail."


const SpamCheckRegular = ({
    data,
    spamCheckDetails,
    handleClickModalOpen = () => { },
    handleBack = () => { },
    handleNext = () => { }
}) => {
    return (
        <Row>
            <Col xs={10} sm={10} md={6} lg={6} xl={6} className="mx-auto">
                <p className="font-size-18"><strong>Spam Flag Probability Checking</strong></p>
                <p dangerouslySetInnerHTML={{ __html: spamCheckText1 }} />
                <p dangerouslySetInnerHTML={{ __html: spamCheckText2 }} />
                {
                    !["gmail.com", "yahoo.com", "yahoo.co.in", "hotmail.com", "outlook.com", "msn.com", "live.com", "zoho.com", "mail.com", "aol.com"].includes(data.fromAddress.split("@")[1]) ?
                        <>
                            <p className="font-size-18"><strong>Authentication Check</strong></p>
                            <div className="row mb-3">
                                <div className="col d-flex align-items-center">
                                    {
                                        typeof spamCheckDetails?.dkim === "undefined" ?
                                            <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>
                                            :
                                            <div className={`spam-check-indicator ${spamCheckDetails.dkim === 1 ? "green" : "red"}`}></div>
                                    }
                                    <p className="w-75 mb-0">DKIM Check</p>
                                    {
                                        typeof spamCheckDetails?.dkim !== "undefined" ?
                                            <i className="far fa-question-circle font-size-18 ml-3" data-toggle="tooltip" title="DKIM/SPF Article" onClick={() => { }}></i>
                                            : null
                                    }
                                </div>
                                <div className="col d-flex align-items-center">
                                    {
                                        typeof spamCheckDetails?.spf === "undefined" ?
                                            <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>
                                            :
                                            <div className={`spam-check-indicator ${spamCheckDetails.spf === 1 ? "green" : "red"}`}></div>
                                    }
                                    <p className="w-75 mb-0">SPF Check</p>
                                    {
                                        typeof spamCheckDetails?.spf !== "undefined" ?
                                            <i className="far fa-question-circle font-size-18 ml-3" data-toggle="tooltip" title="DKIM/SPF Article" onClick={() => { }}></i>
                                            : null
                                    }
                                </div>
                            </div>
                        </>
                        : null
                }
                <p className="font-size-18"><strong>Spam Filter Check</strong></p>
                <div className="row my-3">
                    <div className="col-6 d-flex align-items-center">
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.localSpamScore === "undefined" ?
                                <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>
                                :
                                <div className={`spam-check-indicator ${parseFloat(spamCheckDetails.checkSubjectContent.localSpamScore) < 5 ? "green" : "red"}`}></div>
                        }
                        <p className="w-75 mb-0">Spamassassin</p>
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.localSpamScore !== "undefined" ?
                                <i className="far fa-question-circle font-size-18 ml-3"
                                    data-toggle="tooltip" title="Result of SPAM check"></i>
                                : null
                        }
                    </div>
                    {/*<div className="col d-flex align-items-center">*/}
                    {/*    {*/}
                    {/*        typeof spamCheckDetails?.checkSubjectContent?.gmailSpam === "undefined" ?*/}
                    {/*            <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>*/}
                    {/*        :*/}
                    {/*            <div className={`spam-check-indicator ${spamCheckDetails.checkSubjectContent.gmailSpam === 0 ? "green" : "red"}`}></div>*/}
                    {/*    }*/}
                    {/*    <p className="w-75 mb-0">Gmail</p>*/}
                    {/*    {*/}
                    {/*        typeof spamCheckDetails?.checkSubjectContent?.gmailSpam !== "undefined" ?*/}
                    {/*            <i className="far fa-question-circle font-size-18 ml-3"*/}
                    {/*               data-toggle="tooltip" title="Result of SPAM check"></i>*/}
                    {/*        : null*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
                {/*<div className="row my-3">*/}
                {/*    <div className="col d-flex align-items-center">*/}
                {/*        {*/}
                {/*            typeof spamCheckDetails?.checkSubjectContent?.outlookSpam === "undefined" ?*/}
                {/*                <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>*/}
                {/*                :*/}
                {/*                <div className={`spam-check-indicator ${spamCheckDetails.checkSubjectContent.outlookSpam === 0 ? "green" : "red"}`}></div>*/}
                {/*        }*/}
                {/*        <p className="w-75 mb-0">Hotmail</p>*/}
                {/*        {*/}
                {/*            typeof spamCheckDetails?.checkSubjectContent?.outlookSpam !== "undefined" ?*/}
                {/*                <i className="far fa-question-circle font-size-18 ml-3"*/}
                {/*                   data-toggle="tooltip" title="Result of SPAM check"></i>*/}
                {/*            : null*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*    <div className="col d-flex align-items-center">*/}
                {/*        {*/}
                {/*            typeof spamCheckDetails?.checkSubjectContent?.outlookClientSpam === "undefined" ?*/}
                {/*                <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>*/}
                {/*                :*/}
                {/*                <div className={`spam-check-indicator ${spamCheckDetails.checkSubjectContent.outlookClientSpam === 0 ? "green" : "red"}`}></div>*/}
                {/*        }*/}
                {/*        <p className="w-75 mb-0">Outlook Client</p>*/}
                {/*        {*/}
                {/*            typeof spamCheckDetails?.checkSubjectContent?.outlookClientSpam !== "undefined" ?*/}
                {/*                <i className="far fa-question-circle font-size-18 ml-3"*/}
                {/*                   data-toggle="tooltip" title="Result of SPAM check"></i>*/}
                {/*            : null*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*</div>*/}
                <p className="font-size-18"><strong>Content Check</strong></p>
                <div className="row">
                    <div className="col-12 d-flex align-items-center">
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.emailSubjectColor === "undefined" ?
                                <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>
                                :
                                <div className={`spam-check-indicator ${spamCheckDetails.checkSubjectContent.emailSubjectColor === 1 ? "green" : "red"}`}></div>
                        }
                        <p className="mb-0">Email Subject Check</p>
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.emailSubjectColor !== "undefined" ?
                                <i className="far fa-question-circle ml-3 font-size-18" data-toggle="tooltip" title={`${spamCheckDetails.checkSubjectContent.emailSubjectColor === 1 ? "Good to go" : "May be SPAM"}`}></i>
                                : null
                        }
                    </div>
                    {
                        data.emailSubject.match(/##+[A-Za-z0-9_]+##/g) == null ?
                            <div id="emailsubjectwarning">Recommend Personalize Subject Line</div>
                            : null
                    }
                    {
                        spamCheckDetails?.checkSubjectContent?.emailSubjectError?.length > 0 ?
                            spamCheckDetails?.checkSubjectContent?.emailSubjectError.map((v, i) => (
                                <div key={i} className="col-12 d-flex ml-5 my-2 align-items-center">
                                    <i className="far fa-times-circle error-circle"></i>
                                    <p className="mb-0">{v}</p>
                                    <i className="far fa-question-circle ml-3 font-size-18" onClick={() => { handleClickModalOpen(v) }}></i>
                                </div>
                            ))
                            : null
                    }
                    <div className="col-12 d-flex align-items-center mt-3">
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.emailContentColor === "undefined" ?
                                <div className="spam-check-indicator"><div className="lds-ripple"><div></div><div></div></div></div>
                                :
                                <div className={`spam-check-indicator ${spamCheckDetails.checkSubjectContent.emailContentColor === 1 ? "green" : "red"}`}></div>
                        }
                        <p className="mb-0">Email Content Check</p>
                        {
                            typeof spamCheckDetails?.checkSubjectContent?.emailContentColor !== "undefined" ?
                                <i className="far fa-question-circle ml-3 font-size-18" data-toggle="tooltip" title={`${spamCheckDetails.checkSubjectContent.emailContentColor === 1 ? "Good to go" : "May be SPAM"}`}></i>
                                : null
                        }
                    </div>
                    {
                        spamCheckDetails?.checkSubjectContent?.emailContentError?.length > 0 ?
                            spamCheckDetails?.checkSubjectContent?.emailContentError.map((v, i) => (
                                <div key={i} className="col-12 d-flex ml-5 mt-1 mb-1 align-items-center">
                                    <i className="far fa-times-circle error-circle"></i>
                                    <p className="mb-0">{v}</p>
                                    <i className="far fa-question-circle ml-3 font-size-18" onClick={() => { handleClickModalOpen("Content " + v) }}></i>
                                </div>
                            ))
                            : null
                    }
                </div>
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
                        onClick={() => handleNext(1)}
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Col>
        </Row>
    )
}


export default SpamCheckRegular