import React, { useState, useRef, createRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import AnchorLink from '@mui/material/Link';
import { Row, Col, Form, FormGroup } from 'reactstrap';
import CorousealsComponent from '../shared/carouselsComponent/corouselsComponent.jsx';
import { registerUserAction } from '../../actions/userActions.js';
import InputField from '../shared/commonControlls/inputField.jsx';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import $ from 'jquery';
import {checkEmail, getPlanById} from "../../services/userService.js";
import {setGlobalAlertAction} from "../../actions/globalAlertActions.js";
import {parentCompanyTitle, siteURL, staticUrl, websiteEmailAddress, websiteName, websiteTitle, websiteTitleWithExt} from "../../config/api.js";
import { validateEmail } from '../../assets/commonFunctions.js';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = (props) => {
    const {user} = props;
    const inputRefs = useRef([createRef(), createRef(), createRef(), createRef()]);
    const [data, setData] = useState(user);
    const [plan, setPlan] = useState({});
    const [modal, setModal] = useState(false);
    const [num, setNum] = useState(0);
    const [low, setLow] = useState(0);
    const [upp, setUpp] = useState(0);
    const [spe, setSpe] = useState(0);
    const [len, setLen] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const queryString = useMemo(() => { return new URLSearchParams(props.location.search) }, [props.location.search]);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        document.title = `Register - ${websiteTitle}`;
        $(document).ready(function () {
            $('#password').focus(function (e) {
                $('.password-requirements-reg').toggleClass("prshowhide");
                $('#password').removeAttr('readonly');
            }).blur(function (e) {
                $('.password-requirements-reg').toggleClass("prshowhide");
                $('#password').attr('readonly', 'readonly');
            });
        });
    }, []);
    useEffect(() => {
        if(typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null){
            let requestData = `countryId=100&planId=${queryString.get("v")}`
            getPlanById(requestData).then(res=>{
                if(res.status === 200){
                    setPlan(res.result.plan);
                } else {
                    window.location.href=`${staticUrl}/pricing.html`;        
                }
            })
        } else {
            window.location.href=`${staticUrl}/pricing.html`;
        }
    }, [queryString]);
    const toggle = () => setModal(!modal);
    const handleChange = (name, value) => {
        if (name === "password") {
            value=value.replace(/\s/gi, "");
            checkValidationPass(value);
        }
        if(name === "optin"){
            setData(prev => ({ ...prev, [name]: value ? "Y" : "N" }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    }

    const checkValidationPass = (str) => {
        let upperCase = new RegExp('[A-Z]');
        let lowerCase = new RegExp('[a-z]');
        let numbers = new RegExp('[0-9]');
        let splChars = "*|,\":<>[]{}`';()@&$#%!";

        let num = 0;
        let low = 0;
        let upp = 0;
        let spe = 0;
        let len = 0;
        let i;
        for (i = 0; i < str.length; i++) {
            if (str[i].match(numbers)) {
                num = 1;
            }
            else if (str[i].match(lowerCase)) {
                low = 1;
            }
            else if (str[i].match(upperCase)) {
                upp = 1;
            }
            else if (splChars.indexOf(str.charAt(i)) !== -1) {
                spe = 1;
            }
        }
        if (str.length > 7) {
            len = 1;
        }

        if (num === 1) {
            setNum(1);
        }
        else {
            setNum(0);
        }

        if (low === 1) {
            setLow(1);
        }
        else {
            setLow(0);
        }

        if (upp === 1) {
            setUpp(1);
        }
        else {
            setUpp(0);
        }


        if (spe === 1) {
            setSpe(1);
        }
        else {
            setSpe(0);
        }

        if (len === 1) {
            setLen(1);
        }
        else {
            setLen(0);
        }

        if (num === 1 && low === 1 && upp === 1 && spe === 1 && len === 1) {
            return true;
        }
        else {
            return false;
        }
    }

    const submitForm = (e) => {
        e.preventDefault();
        let isValid = true;
        for (let i = 0; i < inputRefs.current.length; i++) {
            const valid = inputRefs.current[i].current.validate()
            if (!valid) {
                isValid = false
            }
        }
        if (!isValid) {
            return
        }
        if(!validateEmail(data?.email)){
            props.globalAlert({
                type: "Error",
                text: "Please enter proper email",
                open: true
            });
            return false;
        }
        if(!checkValidationPass(data?.password)){
            props.globalAlert({
                type: "Error",
                text: "Invalid password format.\nPlease use suggested combination in password",
                open: true
            });
            return false;
        }
        checkEmail(data?.email).then(res => {
            if (res.status === 200) {
                props.register({...data, planId: queryString.get("v")});
            } else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    return (
        <>
            <Row>
                <Col xs={12} sm={8} md={7} lg={7} xl={7} className="pl-0">
                    <CorousealsComponent />
                </Col>
                <Col xs={12} sm={4} md={5} lg={5} xl={5} className="formBox overflow-auto" style={{height:"100vh"}}>
                    <Box className="formMidle">
                        <p className="text-center pt-1">
                            <a className="navbar-brand" href={`${staticUrl}/index.html`}>
                                <img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /> </a>
                        </p>
                        <br />
                        <h2 className="text-center mb-4">Create My Account</h2>
                        <p className="text-center mb-5">Already have a {websiteTitleWithExt} account? <Link to={"login"} >Sign in here</Link>.</p>
                        {
                            ((typeof plan.hasOwnProperty("planName") !== "undefined" && plan.hasOwnProperty("planName") !== "" && plan.hasOwnProperty("planName") !== null) && (typeof plan.hasOwnProperty("countrySetting") !== "undefined" && plan.hasOwnProperty("countrySetting") !== "" && plan.hasOwnProperty("countrySetting"))) &&
                                <div className="border-gray border rounded p-3 mb-4">
                                    <p>Your selected plan</p>
                                    <p className="d-flex justify-content-between">
                                        <span>{plan?.planName}</span>
                                        <span>{plan?.countrySetting?.cntyPriceSymbol+plan?.countrySetting?.cntyPlanPrice}</span>
                                    </p>
                                    <p className="mb-0 text-right"><a href={`${staticUrl}/pricing.html`}>Change Plan...</a></p>
                                </div>
                        }
                        <Form onSubmit={submitForm} >
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.firstName || ""}
                                />
                            </FormGroup>
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[1]}
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.lastName || ""}
                                />
                            </FormGroup>
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[2]}
                                    type="text"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    onChange={handleChange}
                                    validation={"required"}
                                    value={data?.email || ""}
                                />
                            </FormGroup>
                            <FormGroup>
                                <InputField
                                    ref={inputRefs.current[3]}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    label="Password"
                                    validation="required"
                                    onChange={handleChange}
                                    value={data?.password || ""}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <div className="password-requirements-reg">
                                    <ul className="mb-0 padding-all-0">
                                        <li className={`lowercase-char ${(low === 0) ? "completed" : ""}`}>One lowercase character</li>
                                        <li className={`special-char ${(spe === 0) ? "completed" : ""}`}>One special character</li>
                                        <li className={`uppercase-char ${(upp === 0) ? "completed" : ""}`}>One uppercase character</li>
                                        <li className={`8-char ${(len === 0) ? "completed" : ""}`}>Eight characters minimum</li>
                                        <li className={`number-char ${(num === 0) ? "completed" : ""}`}>One number</li>
                                    </ul>
                                </div>
                            </FormGroup>
                            <p>By clicking the Create My Account button, you agree to {websiteTitleWithExt}</p>
                            <p><AnchorLink component="a" className="cursor-pointer text-blue" onClick={toggle}>Anti-spam Policy &amp; Terms of Use</AnchorLink></p>
                            <FormControlLabel control={<Checkbox onChange={(e)=>{handleChange(e.target.name,e.target.checked);}} name="optin" color="primary" checked={data?.optin === "Y"} />} label={`Yes, I want to hear about promotions and features from ${websiteTitleWithExt} through Email and SMS. ( Don't worry we won't spam you )`} />
                            <FormGroup className="text-center mt-5">
                                <Button type="submit" variant="contained" color="primary">CREATE MY ACCOUNT</Button>
                            </FormGroup>
                        </Form>
                    </Box>
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Terms of Use</ModalHeader>
                <ModalBody style={{ background: "#EFEFEF", maxHeight: "350px", overflowY: "scroll", overflowX: "hidden" }}>
                    <div>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> the parent company of <strong>{websiteName}</strong> as any reference to <strong>{parentCompanyTitle}</strong> is interchangeable with the website <strong>{websiteName}</strong> which maintains this site for information and communication purposes. This web page contains the Terms of Use governing your access to and use of the <strong>{websiteName}</strong> (the Website or Site). If you do not accept these Terms of Use or you do not meet or comply with their provisions, you may not use the Website.
                        </p>
                        <p align="justify">
                            A. TERMS APPLICABLE TO ALL USERS</p>
                        <p align="justify">
                            <strong>1. Overview</strong></p>
                        <p align="justify">
                            YOUR USE OF THIS WEBSITE IS EXPRESSLY CONDITIONED UPON YOUR ACCEPTING AND AGREEING TO THESE
                            TERMS OF USE.</p>
                        <p align="justify">
                            For users who are not registered with this Website, your use of the Website will be deemed
                            to be acceptance of the Terms of Use, Section A.</p>
                        <p align="justify">
                            For users who are registered with the Website, your use of the Website shall be subject to
                            (i) certain designated terms (see Section B below) in addition to those terms applicable to
                            all users and (ii) shall be further conditioned on your [clicking the &quot;I AGREE TO THE
                            TERMS OF USE&quot; button at the end of these Terms of Use].</p>
                        <p align="justify">
                            IF THESE TERMS OF USE ARE NOT COMPLETELY ACCEPTABLE TO YOU, YOU MUST IMMEDIATELY TERMINATE
                            YOUR USE OF THIS WEBSITE.</p>
                        <p align="justify">
                            <strong>2. Changes To Terms</strong></p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> may, at any time, for any reason and without notice, make
                            changes to (i) this Website, including its look, feel, format, and content, as well as (ii)
                            the products and/or services as described in this Website. Any modifications will take
                            effect when posted to the Website. Therefore, each time you access the Website, you need to
                            review the Terms of Use upon which access and use of this Website is conditioned. By your
                            continuing use of the Website after changes are posted, you will be deemed to have accepted
                            such changes.</p>
                        <p align="justify">
                            <strong>3. Scope of Use and User E-Mail</strong></p>
                        <p align="justify">
                            You are only authorized to view, use, copy for your records and download small portions of
                            the Content (including without limitation text, graphics, software, audio and video files
                            and photos) of this Website for your informational, non-commercial use, provided that you
                            leave all the copyright notices, including copyright management information, or other
                            proprietary notices intact.</p>
                        <p align="justify">
                            You may not store, modify, reproduce, transmit, reverse engineer or distribute a significant
                            portion of the Content on this Website, or the design or layout of the Website or individual
                            sections of it, in any form or media. The systematic retrieval of data from the Website is
                            also prohibited.</p>
                        <p align="justify">
                            E-mail submissions over the Internet may not be secure and are subject to the risk of
                            interception by third parties. Please consider this fact before e-mailing any information.
                            Also, please consult our <a href={`${staticUrl}/privacy-policy.html`}><span style={{ color: "#000080" }}>Privacy Policy</span></a>. You agree not to submit or transmit any e-mails or materials through the Website that: (i)
                            are defamatory, threatening, obscene or harassing, (ii) contain a virus, worm, Trojan horse
                            or any other harmful component, (iii) incorporate copyrighted or other proprietary material
                            of any third party without that party&#39;s permission or (iv) otherwise violate any
                            applicable laws. <strong>{parentCompanyTitle}</strong> shall not be subject to any obligations of confidentiality
                            regarding any information or materials that you submit online except as specified in these
                            Terms of Use, or as set forth in any additional terms and conditions relating to specific
                            products or services, or as otherwise specifically agreed or required by law.
                        </p>

                        <p align="justify">
                            The commercial use, reproduction, transmission or distribution of any information, software or other material available through the Website without the prior written consent of <strong>{parentCompanyTitle}</strong> is strictly prohibited.</p>
                        <p align="justify">
                            <strong>4. Copyrights and Trademarks</strong></p>
                        <p align="justify">
                            The materials at this Site, as well as the organization and layout of this site, are copyrighted and are protected by United States and international copyright laws and treaty provisions. You may access, download and print materials on this Website solely for your personal and non-commercial use; however, any print out of this Site, or portions of the Site, must include <strong>{parentCompanyTitle}</strong>&rsquo;s copyright notice. No right, title or interest in any of the materials contained on this Site is transferred to you as a result of accessing, downloading or printing such materials. You may not copy, modify, distribute, transmit, display, reproduce, publish, license any part of this Site; create derivative works from, link to or frame in another website, use on any other website, transfer or sell any information obtained from this Site without the prior written permission of <strong>{parentCompanyTitle}</strong>.
                        </p>
                        <p align="justify">
                            Except as expressly provided under the &quot;Scope of Use&quot; Section above, you may not use, reproduce, modify, transmit, distribute, or publicly display or operate this Website without the prior written permission of <strong>{parentCompanyTitle}</strong>. You may not use a part of this Website on any other Website, without <strong>{parentCompanyTitle}</strong>&rsquo;s prior written consent.
                        </p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> respects the intellectual property rights of others and expects our Users/ users to do the same. The policy of <strong>{parentCompanyTitle}</strong> is to terminate the accounts of repeat copyright offenders and other users who infringe upon the intellectual property rights of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us at <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}><span style={{ color: "#000080" }}>{websiteEmailAddress}</span>.</a>
                        </p>
                        <p align="justify">
                            <strong>5.&nbsp; Links</strong></p>
                        <p align="justify">
                            For your convenience, we may provide links to various other Websites that may be of interest to you and for your convenience only.&nbsp; However, <strong>{parentCompanyTitle}</strong> does not control or endorse such Websites and is not responsible for their content nor is it responsible for the accuracy or reliability of any information, data, opinions, advice, or statements contained within such Websites. Please read the terms and conditions or terms of use policies of any other company or website you may link to from our website. These Terms of Use policy applies only to <strong>{parentCompanyTitle}</strong>&rsquo;s website and the products and services <strong>{parentCompanyTitle}</strong> offers.&nbsp; If you decide to access any of the third party sites linked to this Website, you do so at your own risk. <strong>{parentCompanyTitle}</strong> reserves the right to terminate any link or linking program at any time. <strong>{parentCompanyTitle}</strong> disclaims all warranties, express and implied, as to the accuracy, validity, and legality or otherwise of any materials or information contained on such sites.
                        </p>
                        <p align="justify">
                            You may not link to this Website without <strong>{parentCompanyTitle}</strong>&rsquo;s written permission. If you are interested in linking to this Website, please contact <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}><span style={{ color: "#000080" }}>{websiteEmailAddress}</span>.</a>
                        </p>
                        <p align="justify">
                            <strong>6.&nbsp; No Unlawful Or Prohibited Use</strong></p>
                        <p align="justify">
                            As a condition of your use of the Website, you warrant to <strong>{parentCompanyTitle}</strong> that you will not use the Website for any purpose that is unlawful or prohibited by these terms, conditions, and notices. You may not use the Website in any manner that could damage, disable, overburden, or impair the Site or interfere with any other party&#39;s use and enjoyment of the Website. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the Site.
                        </p>
                        <p align="justify">
                            <strong>7. Spamming</strong></p>
                        <p align="justify">
                            Gathering email addresses from <strong>{parentCompanyTitle}</strong> through harvesting or automated means is prohibited.&nbsp; Posting or transmitting unauthorized or unsolicited advertising, promotional materials, or any other forms of solicitation to other Users is prohibited.&nbsp; Inquiries regarding a commercial relationship with <strong>{parentCompanyTitle}</strong> should be directed to <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}><span style={{ color: "#000080" }}>{websiteEmailAddress}</span></a>.
                        </p>
                        <p alignf="justify">
                            <strong>8.&nbsp; No Warranties</strong></p>
                        <p align="justify">
                            THE WEBSITE, AND ANY CONTENT, ARE PROVIDED TO YOU ON AN &quot;AS IS,&quot; &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTY OF ANY KIND WHETHER EXPRESS, STATUTORY OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, SYSTEMS INTEGRATION, ACCURACY, AND NON-INFRINGEMENT, ALL OF WHICH <strong>{parentCompanyTitle}</strong> EXPRESSLY DISCLAIMS. <strong>{parentCompanyTitle}</strong> DOES NOT ENDORSE AND MAKES NO WARRANTY AS TO THE ACCURACY, COMPLETENESS, CURRENCY, OR RELIABILITY OF THE CONTENT, AND <strong>{parentCompanyTitle}</strong> WILL NOT BE LIABLE OR OTHERWISE RESPONSIBLE FOR ANY FAILURE OR DELAY IN UPDATING THE WEBSITE OR ANY CONTENT. WE HAVE NO DUTY TO UPDATE THE CONTENT OF THE WEBSITE. <strong>{parentCompanyTitle}</strong> &nbsp;MAKES NO REPRESENTATIONS OR WARRANTIES THAT USE OF THE CONTENT WILL BE UNINTERRUPTED OR ERROR-FREE. YOU ARE RESPONSIBLE FOR ANY RESULTS OR OTHER CONSEQUENCES OF ACCESSING THE WEBSITE AND USING THE CONTENT, AND FOR TAKING ALL NECESSARY PRECAUTIONS TO ENSURE THAT ANY CONTENT YOU MAY ACCESS, DOWNLOAD OR OTHERWISE OBTAIN IS FREE OF VIRUSES OR ANY OTHER HARMFUL COMPONENTS. THIS WARRANTY DISCLAIMER MAY BE DIFFERENT IN CONNECTION WITH SPECIFIC PRODUCTS AND SERVICES OFFERED BY <strong>{parentCompanyTitle}</strong>. SOME STATES DO NOT ALLOW THE DISCLAIMER OF IMPLIED WARRANTIES, SO THE FOREGOING DISCLAIMER MAY NOT APPLY TO YOU. YOU MAY ALSO HAVE OTHER LEGAL RIGHTS THAT VARY FROM JURISDICTION TO JURISDICTION.
                        </p>
                        <p align="justify">
                            <strong>9. &nbsp;Governing Law, Location and Miscellaneous</strong></p>
                        <p align="justify">
                            These Terms of Use shall be governed in all respects by the laws of the States of the USA, without reference to its choice of law rules. If an applicable law is in conflict with any part of the Terms of Use, the Terms of Use will be deemed modified to conform to the law. The other provisions will not be affected by any such modification.
                        </p>
                        <p align="justify">
                            <strong>10. Separate Agreements</strong></p>
                        <p align="justify">
                            You may have other agreements with <strong>{parentCompanyTitle}</strong>. Those agreements are separate and in addition to these Terms of Use. These Terms of Use do not modify, revise or amend the terms of any other agreements you may have with <strong>{parentCompanyTitle}</strong>.
                        </p>
                        <p align="justify">
                            <strong>11.&nbsp; DMCA&nbsp; Copyright Policy and Copyright Agent</strong></p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> respects the intellectual property rights of others.&nbsp; If you believe something on this Site has infringed your intellectual property rights, please notify our agent and provide the following information:
                        </p>
                        <p align="justify">
                            (i)&nbsp;&nbsp;A physical or electronic signature of a person authorized to act on
                            behalf of the owner of an exclusive right that is allegedly infringed.</p>
                        <p align="justify">
                            (ii)&nbsp;&nbsp;Identification of the copyrighted work claimed to have been infringed.</p>
                        <p align="justify">
                            (iii)&nbsp;&nbsp;Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled.</p>
                        <p align="justify">
                            (iv)&nbsp;&nbsp;Address, telephone number, and, if available, an electronic mail address where we may contact you.</p>
                        <p align="justify">
                            (v)&nbsp;&nbsp;A statement that the complaining party has a good faith belief that use of
                            the material in the manner complained of is not authorized by the copyright owner, its
                            agent, or the law.</p>
                        <p align="justify">
                            (vi)&nbsp;&nbsp;A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.&nbsp;</p>
                        <p align="justify">
                            The Site&rsquo;s Copyright Agent can be reached at:</p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong><br />
                            PO Box 7775 #99980<br />
                            San Francisco, CA 94120-7775<br />
                            1 415 906-4001<br />
                            <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}>
                                <span style={{ color: "#000080" }}>{websiteEmailAddress}</span></a>
                            <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}>
                                <span
                                    style={{ color: "#000080" }}>&nbsp;&nbsp;</span></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                        <p align="justify">
                            &nbsp;
                            <strong>13. U.S. Resident</strong></p>
                        <p align="justify">
                            You represent that you are a United States resident.</p>
                        <p align="justify">
                            <strong>14. No Professional Advice</strong></p>
                        <p align="justify">
                            The information available on the Website is intended to be a general information resource
                            regarding the matters covered, and is not tailored to your specific circumstance. You should
                            not construe this as legal, accounting or other professional advice. This Website is not
                            intended for use by minors. YOU SHOULD EVALUATE ALL INFORMATION, OPINIONS AND ADVICE
                            AVAILABLE ON THIS WEBSITE IN CONSULTATION WITH YOUR INSURANCE SPECIALIST, OR WITH YOUR
                            LEGAL, TAX, FINANCIAL OR OTHER ADVISOR, AS APPROPRIATE.</p>
                        <p align="justify">
                            <strong>15. Users Disputes</strong></p>
                        <p align="justify">
                            You are solely responsible for your interactions with other Users. <strong>{parentCompanyTitle}</strong> reserves the right, but has no obligation, to monitor disputes between you and other Users.
                        </p>
                        <p align="justify">
                            <strong>16. User Submissions And Communications; Public Areas:</strong></p>
                        <p align="justify">
                            You acknowledge that you own, solely responsible or otherwise control all of the rights to the content that you post; that the content is accurate; that use of the content you supply does not violate these Terms of Use and will not cause injury to any person or entity; and that you will indemnify <strong>{parentCompanyTitle}</strong> or its affiliates for all claims resulting from content you supply.
                        </p>
                        <p align="justify">
                            If you make any submission to an area of the Website accessed or accessible by the public (&ldquo;Public Area&rdquo;) or if you submit any business information, idea, concept or invention to <strong>{parentCompanyTitle}</strong> by email, you automatically represent and warrant that the owner of such content or intellectual property has expressly granted <strong>{parentCompanyTitle}</strong> a royalty-free, perpetual, irrevocable, world-wide nonexclusive license to use, reproduce, create derivative works from, modify, publish, edit, translate, distribute, perform, and display the communication or content in any media or medium, or any form, format, or forum now known or hereafter developed. <strong>{parentCompanyTitle}</strong> may sublicense its rights through multiple tiers of sublicenses.&nbsp; If you wish to keep any business information, ideas, concepts or inventions private or proprietary, you must not submit them to the Public Areas or to <strong>{parentCompanyTitle}</strong> by email. We try to answer every email in a timely manner, but are not always able to do so.
                        </p>
                        <p align="justify">
                            Some of the forums (individual bulletin boards and posts on the social network, for instance) on the Website are not moderated or reviewed.&nbsp; Accordingly, Users will be held directly and solely responsible for the content of messages that are posted. While not moderating the forums, the Site reviewer will periodically perform an administrative review for the purpose of deleting messages that are old, have received few responses, are off topic or irrelevant, serve as advertisements or seem otherwise inappropriate. <strong>{parentCompanyTitle}</strong> has full discretion to delete messages. Users are encouraged to read the specific forum rules displayed in each discussion forum first before participating in that forum.
                        </p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> reserves the right (but is not obligated) to do any or all of
                            the following:</p>
                        <p align="justify">
                            1.&nbsp;&nbsp;Record the dialogue in public chat rooms.</p>
                        <p align="justify">
                            2.&nbsp;&nbsp;Examine an allegation that a communication(s) do(es) not conform to the terms
                            of this section and determine in its sole discretion to remove or request the removal of the
                            communication(s).</p>
                        <p align="justify">
                            3.&nbsp;&nbsp;Remove communications that are abusive, illegal, or disruptive, or that
                            otherwise fail to conform with these Terms of Use.</p>
                        <p align="justify">
                            4.&nbsp;&nbsp;Terminate a Member&#39;s access to any or all Public Areas and/or the <strong>{parentCompanyTitle}</strong> Site upon any breach of these Terms of Use.</p>
                        <p align="justify">
                            5.&nbsp;&nbsp;Monitor, edit, or disclose any communication in the Public Areas.</p>
                        <p align="justify">
                            6.&nbsp;&nbsp;Edit or delete any communication(s) posted on the <strong>{parentCompanyTitle}</strong> Site, regardless of whether such communication(s) violate these standards.</p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> reserves the right to take any action it deems necessary to protect the personal safety of our guests or the public. <strong>{parentCompanyTitle}</strong> has no liability or responsibility to users of the <strong>{parentCompanyTitle}</strong> Website or any other person or entity for performance or nonperformance of the aforementioned activities.
                        </p>
                        <p align="justify">
                            <strong>17. Arbitration</strong></p>
                        <p align="justify">
                            Except as regarding any action seeking equitable relief, including without limitation for the purpose of protecting any <strong>{parentCompanyTitle}</strong> confidential information and/or intellectual property rights, any controversy or claim arising out of or relating to these Terms of Use or this Website shall be settled by binding arbitration in accordance with the commercial arbitration rules, in effect at the time the proceedings begin, of the American Arbitration Association. Any such controversy or claim shall be arbitrated on an individual basis, and shall not be consolidated in any arbitration with any claim or controversy of any other party. The arbitration shall be held in California, USA.
                        </p>
                        <p align="justify">
                            All information relating to or disclosed by any party in connection with the arbitration of
                            any disputes hereunder shall be treated by the parties, their representatives, and the
                            arbitrator as proprietary business information. Such information shall not be disclosed by
                            any party or their respective representatives without the prior written authorization of the
                            party furnishing such information. Such information shall not be disclosed by the arbitrator
                            without the prior written authorization of all parties. Each party shall bear the burden of
                            its own counsel fees incurred in connection with any arbitration proceedings.</p>
                        <p align="justify">
                            Judgment upon the award returned by the arbitrator may be entered in any court having
                            jurisdiction over the parties or their assets or application of enforcement, as the case may
                            be. Any award by the arbitrator shall be the sole and exclusive remedy of the parties. The
                            parties hereby waive all rights to judicial review of the arbitrator&#39;s decision and any
                            award contained therein.</p>
                        <p align="justify">
                            <strong>18. Limitation of Liability</strong></p>
                        <p align="justify">
                            YOUR USE OF THE CONTENT IS AT YOUR OWN RISK. <strong>{parentCompanyTitle}</strong> SPECIFICALLY DISCLAIMS ANY LIABILITY, WHETHER BASED IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, FOR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, CONSEQUENTIAL, OR SPECIAL DAMAGES ARISING OUT OF OR IN ANY WAY CONNECTED WITH ACCESS TO, USE OF OR RELIANCE ON THE CONTENT (EVEN IF <strong>{parentCompanyTitle}</strong> HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES) OR THAT ARISE IN CONNECTION WITH MISTAKES OR OMISSIONS IN, OR DELAYS IN TRANSMISSION OF, INFORMATION TO OR FROM THE USER, ANY FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION, DELETION, DEFECT, DELAY IN OPERATION OR TRANSMISSION OR DELIVERY, COMPUTER VIRUS, COMMUNICATION LINE FAILURE, THEFT OR DESTRUCTION OR UNAUTHORIZED ACCESS TO, ALTERATION OF, OR USE OF RECORDS, PROGRAMS OR FILES, INTERRUPTIONS IN TELECOMMUNICATIONS CONNECTIONS TO THE WEBSITE OR VIRUSES, WHETHER CAUSED IN WHOLE OR IN PART BY NEGLIGENCE, ACTS OF GOD, TELECOMMUNICATIONS FAILURE, THEFT OR DESTRUCTION OF, OR UNAUTHORIZED ACCESS TO THE WEBSITE OR THE CONTENT. THIS LIMITATION OF LIABILITY MAY BE DIFFERENT IN CONNECTION WITH SPECIFIC PRODUCTS AND SERVICES OFFERED BY <strong>{parentCompanyTitle}</strong>. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY, SO THIS LIMITATION MAY NOT APPLY TO YOU.
                        </p>
                        <p align="justify">
                            <strong>19. Indemnity</strong></p>
                        <p align="justify">
                            You agree to defend, indemnify, and hold <strong>{parentCompanyTitle}</strong>, its officers, directors, employees, agents, licensors, and suppliers, harmless from and against any claims, actions or demands, liabilities and settlements including without limitation, reasonable legal and accounting fees, resulting from, or alleged to result from, your violation of these Terms of Use.
                        </p>
                        <p align="justify">
                            B. ADDITIONAL TERMS APPLICABLE ONLY TO REGISTERED USERS</p>
                        <p align="justify">
                            <strong>20. Accounts And Security</strong></p>
                        <p align="justify">
                            <strong>{parentCompanyTitle}</strong> does not warrant that the functions contained in the service
                            provided by the Website will be uninterrupted or error-free, that defects will be corrected
                            or that this service or the server that makes it available will be free of viruses or other
                            harmful components.</p>
                        <p align="justify">
                            As part of the registration process, each user will select a password (&ldquo;Password&rdquo;) and Sign in Name (&ldquo;Sign in Name&rdquo;). You shall provide <strong>{parentCompanyTitle}</strong> with accurate, complete, and updated Account information. Failure to do so shall constitute a breach of this Terms of Use, which may result in immediate termination of your Account.
                        </p>
                        <p align="justify">
                            You may not:</p>
                        <p align="justify">
                            1.&nbsp;&nbsp;Select or use a Sign in Name of another person with the intent to impersonate
                            that person;</p>
                        <p align="justify">
                            2.&nbsp;&nbsp;Use a name subject to the rights of any other person without
                            authorization;</p>
                        <p align="justify">
                            3.&nbsp;&nbsp;Use a Sign in Name that Website, in its sole discretion, deems inappropriate or
                            offensive.</p>
                        <p align="justify">
                            4.&nbsp;&nbsp;Use or sell {websiteName} services in competition against any line
                            of business of {parentCompanyTitle} without express written approval.</p>
                        <p align="justify">
                            5.&nbsp;&nbsp;Send any email that violates US laws or encourages behavior that might be
                            deemed offensive to others as defined by the Officers of {parentCompanyTitle}</p>
                        <p align="justify">
                            6.&nbsp;&nbsp;Aggressively market, SPAM or send viral marketing campaigns</p>
                        <p align="justify">
                            7.&nbsp;&nbsp;Upload any content that may contain a computer virus or cause harm to a
                            subscriber</p>
                        <p align="justify">
                            8.&nbsp;&nbsp;Send any emails that the management of {parentCompanyTitle} finds objectionable</p>
                        <p align="justify">
                            You shall notify <strong>{parentCompanyTitle}</strong> of any known or suspected unauthorized use(s) of your Account, or any known or suspected breach of security, including loss, theft, or unauthorized disclosure of your password.&nbsp; You shall be responsible for maintaining the confidentiality of your password.</p>
                        <p align="justify">
                            Any fraudulent, abusive, or otherwise illegal activity may be grounds for termination of your Account, at <strong>{parentCompanyTitle}</strong>&rsquo;s sole discretion, and you may be reported to appropriate law-enforcement agencies.</p>
                        <p align="justify">
                            Contact us: If you would like to request additional information regarding these Terms of Use, please contact us at <a href={`mailto:${websiteEmailAddress}?subject=Reference%20Terms%20of%20Service`}><span style={{ color: "#000080" }}><u>{websiteEmailAddress}</u></span>.</a>
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={toggle}>CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        register: (data) => {
            dispatch(registerUserAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register)