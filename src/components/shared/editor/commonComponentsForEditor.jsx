import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {siteURL, staticUrl} from "../../../config/api";
import {Link, Button, RadioGroup, FormControlLabel, Radio, MenuItem, styled, Menu, alpha, TextField} from "@mui/material";
import {Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import InputField from "../commonControlls/inputField";
import {getSurveyCategoryList, saveSurveyCategory} from "../../../services/surveyService";
import {getAssessmentCategoryList, saveAssessmentCategory} from "../../../services/assessmentService";
import $ from "jquery";
import {checkSpam} from "../../../services/emailCampaignService";
import { fontData, handleClickHelp, PopoverTooltip } from '../../../assets/commonFunctions';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from "react-draft-wysiwyg";
import {EditorState, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { saveEmailSignature } from '../../../services/profileService';

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
        borderRadius: 6,
        marginTop: theme.spacing(1),
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
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

export const SocialMediaMenuItem = ({tabRef, showPopper, arrowRef, setArrowRef, i})=>{
    return (
        <div className="editormenuitem">
            <div className="em socialmediaimg" data-toggle="tooltip" title="SOCIAL MEDIA & COMMUNICATION" ref={tabRef.current[i]}><i className="fas fa-thumbs-up"></i></div>
            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={i} showText={"SOCIAL MEDIA & COMMUNICATION"}/>
            <div className="emjoin"></div>
            <div className="editorsubmenu esmsocial">
                <div className="esmtitle">COMMUNICATION</div>
                <div className="esmdata">
                    <img className="socialmedia" src={siteURL+"/img/icons/color-link-48.png"} alt="website" data-title="website"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-emails-48.png"} alt="emails" data-title="emails"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-phones-48.png"} alt="phones" data-title="phones"/>
                </div>
                <div id="socialhr"><hr/></div>
                <div className="esmtitle">SOCIAL MEDIA</div>
                <div className="esmdata">
                    <img className="socialmedia" src={siteURL+"/img/icons/color-facebook-48.png"} alt="facebook" data-title="facebook"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-twitter-48.png"} alt="tweet" data-title="tweet"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-linkedin-48.png"} alt="linkedin" data-title="linkedin"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-youtube-48.png"} alt="youtube" data-title="youtube"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-tumblr-48.png"} alt="tumblr" data-title="tumblr"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-instagram-48.png"} alt="instagram" data-title="instagram"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-soundcloud-48.png"} alt="soundcloud" data-title="soundcloud"/>
                    <img className="socialmedia" src={siteURL+"/img/icons/color-pinterest-48.png"} alt="pinterest" data-title="pinterest"/>
                </div>
            </div>
        </div>
    );
}

export const ContentPageControls = ({type=""})=>{
    return (
        <div className="esmdata">
            <div aria-label="Content" role="tabpanel"
                 className="dijitStackContainerChildWrapper dijitVisible padding-all-0">
                <div title="" widgetid="content-pane"
                     className="dijitStackContainer-child dijitStackContainer-dijitContentPane"
                     id="content-pane"
                     data-dojo-type="dijit/layout/ContentPane">
                    <ul id="blocks-container">
                        <li id="dojoUnique1"
                            className="mojoBlockSourceItem float-left alignc selfclear textIcon dojoDndItem"
                            data-toggle="tooltip" title="Add some text to your email.">
                            <div>{`<!--Text-->`}</div>
                        </li>
                        <li id="dojoUnique2"
                            className="mojoBlockSourceItem float-left alignc selfclear boxedTextIcon dojoDndItem"
                            data-toggle="tooltip" title="Highlight a block of text.">
                            <div>{`<!--Boxed Text-->`}</div>
                        </li>
                        <li id="dojoUnique14"
                            className="mojoBlockSourceItem float-left alignc selfclear boxedText20Icon dojoDndItem"
                            data-toggle="tooltip" title="Highlight a block of text.">
                            <div>{`<!--Boxed Text20-->`}</div>
                        </li>
                        <li id="dojoUnique15"
                            className="mojoBlockSourceItem float-left alignc selfclear boxedText21Icon dojoDndItem"
                            data-toggle="tooltip" title="Highlight a block of text.">
                            <div>{`<!--Boxed Text21-->`}</div>
                        </li>
                        <li id="dojoUnique16"
                            className="mojoBlockSourceItem float-left alignc selfclear boxedText22Icon dojoDndItem"
                            data-toggle="tooltip" title="Highlight a block of text.">
                            <div>{`<!--Boxed Text22-->`}</div>
                        </li>
                        <li id="dojoUnique3"
                            className="mojoBlockSourceItem float-left alignc selfclear dividerIcon dojoDndItem"
                            data-toggle="tooltip" title="Divide sections of your email.">
                            <div>{`<!--Divider-->`}</div>
                        </li>
                        <li id="dojoUnique27"
                            className="mojoBlockSourceItem float-left alignc selfclear buttonIcon dojoDndItem"
                            data-toggle="tooltip" title="Add a button">
                            <div>{`<!--Button-->`}</div>
                        </li>
                        <li id="dojoUnique38"
                            className="mojoBlockSourceItem float-left alignc selfclear attachmentIcon dojoDndItem"
                            data-toggle="tooltip" title="Add an attachment">
                            <div>{`<!--Attachment-->`}</div>
                        </li>
                        <li id="dojoUnique4"
                            className="mojoBlockSourceItem float-left alignc selfclear imageIcon dojoDndItem"
                            data-toggle="tooltip" title="Drop an image in your email">
                            <div>{`<!--Image-->`}</div>
                        </li>
                        <li id="dojoUnique25"
                            className="mojoBlockSourceItem float-left alignc selfclear logoIcon dojoDndItem"
                            data-toggle="tooltip" title="Drop an image in your email">
                            <div>{`<!--logoIcon-->`}</div>
                        </li>
                        <li id="dojoUnique30"
                            className="mojoBlockSourceItem float-left alignc selfclear imageGroupIcon2h dojoDndItem"
                            data-toggle="tooltip" title="Arrange a collection of images.">
                            <div>{`<!--Image Group 2h-->`}</div>
                        </li>
                        <li id="dojoUnique31"
                            className="mojoBlockSourceItem float-left alignc selfclear imageGroupIcon2s dojoDndItem"
                            data-toggle="tooltip" title="Arrange a collection of images.">
                            <div>{`<!--Image Group 2s-->`}</div>
                        </li>
                        <li id="dojoUnique28"
                            className="mojoBlockSourceItem float-left alignc selfclear imageGroupIcon3h dojoDndItem"
                            data-toggle="tooltip" title="Arrange a collection of images.">
                            <div>{`<!--Image Group 3h-->`}</div>
                        </li>
                        <li id="dojoUnique29"
                            className="mojoBlockSourceItem float-left alignc selfclear imageGroupIcon3s dojoDndItem"
                            data-toggle="tooltip" title="Arrange a collection of images.">
                            <div>{`<!--Image Group 3s-->`}</div>
                        </li>
                        <li id="dojoUnique5"
                            className="mojoBlockSourceItem float-left alignc selfclear imageGroupIcon dojoDndItem"
                            data-toggle="tooltip" title="Arrange a collection of images.">
                            <div>{`<!--Image Group-->`}</div>
                        </li>
                        <li id="dojoUnique17"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon11 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption11-->`}</div>
                        </li>
                        <li id="dojoUnique6"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCardIcon dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image Card-->`}</div>
                        </li>
                        <li id="dojoUnique32"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIconH dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption + H-->`}</div>
                        </li>
                        <li id="dojoUnique33"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon12H dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption12 + H-->`}</div>
                        </li>
                        <li id="dojoUnique34"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon21H dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption21 + H-->`}</div>
                        </li>
                        <li id="dojoUnique35"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon22H dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption22 + H-->`}</div>
                        </li>
                        <li id="dojoUnique36"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon31H dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption31 + H-->`}</div>
                        </li>
                        <li id="dojoUnique37"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon32H dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption32 + H-->`}</div>
                        </li>
                        <li id="dojoUnique7"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption-->`}</div>
                        </li>
                        <li id="dojoUnique18"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon12 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption12-->`}</div>
                        </li>
                        <li id="dojoUnique19"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon21 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption21-->`}</div>
                        </li>
                        <li id="dojoUnique20"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon22 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption22-->`}</div>
                        </li>
                        <li id="dojoUnique21"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon31 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption31-->`}</div>
                        </li>
                        <li id="dojoUnique22"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon32 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--Image + Caption32-->`}</div>
                        </li>
                        <li id="dojoUnique8"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon2 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--2Image + 2Caption-->`}</div>
                        </li>
                        <li id="dojoUnique27"
                            className="mojoBlockSourceItem float-left alignc selfclear imageCaptionIcon3 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--3Image + 3Caption-->`}</div>
                        </li>
                        <li id="dojoUnique23"
                            className="mojoBlockSourceItem float-left alignc selfclear twoimageCaptionIcon1 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--2image + 1caption1-->`}</div>
                        </li>
                        <li id="dojoUnique24"
                            className="mojoBlockSourceItem float-left alignc selfclear twoimageCaptionIcon2 dojoDndItem"
                            data-toggle="tooltip" title="Add an image with a descriptive caption.">
                            <div>{`<!--2image + 1caption2-->`}</div>
                        </li>
                        {
                            type === "pageEditor" &&
                                <>
                                    <li id="dojoUnique12"
                                        className="mojoBlockSourceItem float-left alignc selfclear footerIcon dojoDndItem"
                                        data-toggle="tooltip" title="Footer with contact information">
                                        <div>{`<!--Footer-->`}</div>
                                    </li>
                                    <li id="dojoUnique13"
                                        className="mojoBlockSourceItem float-left alignc selfclear codeIcon dojoDndItem"
                                        data-toggle="tooltip" title="Use your own custom HTML">
                                        <div>{`<!--Code-->`}</div>
                                    </li>
                                </>
                        }

                        <li id="dojoUnique26"
                            className="mojoBlockSourceItem float-left alignc selfclear videolsIcon dojoDndItem"
                            data-toggle="tooltip" title="Add an video with preview image">
                            <div>{`<!--Video-->`}</div>
                        </li>
                    </ul>
                    <div id="start-tour-link" style={{display: "none"}}
                         className="clear pad-lv3 alignc small-meta">
                        Need a refresher? <a href="/#" className="startTour">Take
                        a
                        quick
                        tour</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}

export const FormPageControls = ({type=""})=>{
    return (
        <div className="esmdatamain1 esmdatamain" style={{height: "85%"}}>
            <div className="esmdata">
                {
                    type !== "formEditor" &&
                        <div style={{fontSize: 12, textAlign: "center"}}>
                            <strong>DEMOGRAPHICS QUESTIONS</strong>
                        </div>
                }
                <ul className="block pad-lr0 dojoDndSource dojoDndTarget dojoDndContainer" id="blocks-container-form">
                    {
                        type !== "formEditor" &&
                        <DemographicsControls/>
                    }
                    {type !== "formEditor" && <li id="dojohr" className="float-left alignc selfclear dojoDndItem"><hr/></li>}
                    <li id="dojohr" style={{fontSize: 12}} className="float-left alignc selfclear dojoDndItem text-center"><strong>FORM QUESTIONS</strong></li>
                    <li id="dojoUniqueb21"
                        className="mojoBlockFormItem float-left alignc selfclear labelIcon dojoDndItem"
                        data-toggle="tooltip" title="Label">
                        <div>{`<!--Label-->`}</div>
                    </li>
                    <li id="dojoUniqueb1"
                        className="mojoBlockFormItem float-left alignc selfclear openEndedIcon dojoDndItem"
                        data-toggle="tooltip" title="Open Ended">
                        <div>{`<!--Open Ended-->`}</div>
                    </li>
                    <li id="dojoUniqueb2"
                        className="mojoBlockFormItem float-left alignc selfclear singleAnswerIcon dojoDndItem"
                        data-toggle="tooltip" title="Single Answer">
                        <div>{`<!--Single Answer-->`}</div>
                    </li>
                    <li id="dojoUniqueb3"
                        className="mojoBlockFormItem float-left alignc selfclear singleAnswerCIcon dojoDndItem"
                        data-toggle="tooltip" title="Multi Answer">
                        <div>{`<!--Single Answer Checkbox-->`}</div>
                    </li>
                    <li id="dojoUniqueb4"
                        className="mojoBlockFormItem float-left alignc selfclear singleAnswerBIcon dojoDndItem"
                        data-toggle="tooltip" title="Single Answer">
                        <div>{`<!--Single Answer Button-->`}</div>
                    </li>
                    <li id="dojoUniqueb5"
                        className="mojoBlockFormItem float-left alignc selfclear singleAnswerComboIcon dojoDndItem"
                        data-toggle="tooltip" title="Dropdown">
                        <div>{`<!--Single Answer Combo-->`}</div>
                    </li>
                    <li id="dojoUniqueb7"
                        className="mojoBlockFormItem float-left alignc selfclear imageFIcon dojoDndItem"
                        data-toggle="tooltip" title="Image Control">
                        <div>{`<!--Image Form-->`}</div>
                    </li>
                    <li id="dojoUniqueb8"
                        className="mojoBlockFormItem float-left alignc selfclear imageWithTextFIcon dojoDndItem"
                        data-toggle="tooltip" title="Image with Text Control">
                        <div>{`<!--Image With Text Form-->`}</div>
                    </li>
                    <li id="dojoUniqueb14"
                        className="mojoBlockFormItem float-left alignc selfclear dateControlIcon dojoDndItem"
                        data-toggle="tooltip" title="Date Control">
                        <div>{`<!--Date Control-->`}</div>
                    </li>
                    <li id="dojoUniqueb15"
                        className="mojoBlockFormItem float-left alignc selfclear timeControlIcon dojoDndItem"
                        data-toggle="tooltip" title="Time Control">
                        <div>{`<!--Time Control-->`}</div>
                    </li>
                    <li id="dojoUniqueb16"
                        className="mojoBlockFormItem float-left alignc selfclear consentAgreement dojoDndItem"
                        data-toggle="tooltip" title="Consent Agreement">
                        <div>{`<!--Consent Agreement-->`}</div>
                    </li>
                    {
                        type === "formEditor" &&
                            <li id="dojoUniqueb23"
                                className="mojoBlockFormItem float-left alignc selfclear consentAgreement dojoDndItem"
                                data-toggle="tooltip" title="SMS Consent Agreement">
                                <div>{`<!--SMS Consent Agreement-->`}</div>
                            </li>
                    }
                    <li id="dojoUniqueb17"
                        className="mojoBlockFormItem float-left alignc selfclear emailIcon dojoDndItem"
                        data-toggle="tooltip" title="Email Control">
                        <div>{`<!--Email-->`}</div>
                    </li>
                    <li id="dojoUniqueb18"
                        className="mojoBlockFormItem float-left alignc selfclear phoneIcon dojoDndItem"
                        data-toggle="tooltip" title="Phone Control">
                        <div>{`<!--Phone-->`}</div>
                    </li>
                    <li id="dojoUniqueb20"
                        className="mojoBlockFormItem float-left alignc selfclear contactFormIcon dojoDndItem"
                        data-toggle="tooltip" title="Contact Form">
                        <div>{`<!--Contact Form-->`}</div>
                    </li>
                    {
                        type === "formEditor" &&
                            <>
                                <li id="dojoUniqueb22"
                                    className="mojoBlockFormItem float-left alignc selfclear captchaIcon dojoDndItem"
                                    data-toggle="tooltip" title="Captcha">
                                    <div>{`<!--Captcha-->`}</div>
                                </li>
                                <li id="dojoUniqueb24"
                                    className="mojoBlockFormItem float-left alignc selfclear signatureIcon dojoDndItem"
                                    data-toggle="tooltip" title="Signature">
                                    <div>{`<!--Signature-->`}</div>
                                </li>
                            </>
                    }
                    <li id="dojohr" className="float-left alignc selfclear dojoDndItem"><hr/></li>
                    <li id="dojohr" style={{fontSize: 12}} className="float-left alignc selfclear dojoDndItem text-center"><strong>SURVEY QUESTIONS</strong></li>
                    <li id="dojoUniqueb6"
                        className="mojoBlockFormItem float-left alignc selfclear matrixIcon dojoDndItem"
                        data-toggle="tooltip" title="Matrix">
                        <div>{`<!--Matrix-->`}</div>
                    </li>
                    <li id="dojoUniqueb9"
                        className="mojoBlockFormItem float-left alignc selfclear ratingBox dojoDndItem"
                        data-toggle="tooltip" title="Rating Box">
                        <div>{`<!--Rating Box-->`}</div>
                    </li>
                    <li id="dojoUniqueb10"
                        className="mojoBlockFormItem float-left alignc selfclear ratingSymbol dojoDndItem"
                        data-toggle="tooltip" title="Rating Symbol">
                        <div>{`<!--Rating Symbol-->`}</div>
                    </li>
                    <li id="dojoUniqueb11"
                        className="mojoBlockFormItem float-left alignc selfclear ratingRadio dojoDndItem"
                        data-toggle="tooltip" title="Rating Radio">
                        <div>{`<!--Rating Radio-->`}</div>
                    </li>
                    <li id="dojoUniqueb12"
                        className="mojoBlockFormItem float-left alignc selfclear yesNo dojoDndItem"
                        data-toggle="tooltip" title="Yes No">
                        <div>{`<!--Yes No-->`}</div>
                    </li>
                    <li id="dojoUniqueb13"
                        className="mojoBlockFormItem float-left alignc selfclear rank dojoDndItem"
                        data-toggle="tooltip" title="Rank">
                        <div>{`<!--Rank-->`}</div>
                    </li>
                    <li id="dojoUniqueb19"
                        className="mojoBlockFormItem float-left alignc selfclear constantSum dojoDndItem"
                        data-toggle="tooltip" title="Constant Sum">
                        <div>{`<!--Constant Sum-->`}</div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const DemographicsControls = ()=>{
    return (
        <>
            <li id="dojoUniqued1"
                className="mojoBlockFormItem float-left alignc selfclear genderIcon dojoDndItem"
                data-toggle="tooltip" title="Gender">
                <div>{`<!--Gender-->`}</div>
            </li>
            <li id="dojoUniqued2"
                className="mojoBlockFormItem float-left alignc selfclear ageIcon dojoDndItem"
                data-toggle="tooltip" title="Age">
                <div>{`<!--Age-->`}</div>
            </li>
            <li id="dojoUniqued3"
                className="mojoBlockFormItem float-left alignc selfclear maritalStatusIcon dojoDndItem"
                data-toggle="tooltip" title="Marital Status">
                <div>{`<!--Marital Status-->`}</div>
            </li>
            <li id="dojoUniqued4"
                className="mojoBlockFormItem float-left alignc selfclear educationIcon dojoDndItem"
                data-toggle="tooltip" title="Education">
                <div>{`<!--Education-->`}</div>
            </li>
            <li id="dojoUniqued5"
                className="mojoBlockFormItem float-left alignc selfclear employmentStatusIcon dojoDndItem"
                data-toggle="tooltip" title="Employment Status">
                <div>{`<!--Employment Status-->`}</div>
            </li>
            <li id="dojoUniqued6"
                className="mojoBlockFormItem float-left alignc selfclear employerTypeIcon dojoDndItem"
                data-toggle="tooltip" title="Employer Type">
                <div>{`<!--Employer Type-->`}</div>
            </li>
            <li id="dojoUniqued7"
                className="mojoBlockFormItem float-left alignc selfclear housingIcon dojoDndItem"
                data-toggle="tooltip" title="Housing">
                <div>{`<!--Housing-->`}</div>
            </li>
            <li id="dojoUniqued8"
                className="mojoBlockFormItem float-left alignc selfclear householdIncomeIcon dojoDndItem"
                data-toggle="tooltip" title="Household Income">
                <div>{`<!--Household Income-->`}</div>
            </li>
            <li id="dojoUniqued9"
                className="mojoBlockFormItem float-left alignc selfclear raceIcon dojoDndItem"
                data-toggle="tooltip" title="Race">
                <div>{`<!--Race-->`}</div>
            </li>
        </>
    );
}

export const HeaderFooterControls = ()=>{
    return (
        <>
            <div className="esmdatamain2 esmdatamain" style={{display:"none"}}>
                <div className="esmdata2">
                    <ul className="block pad-lr0 dojoDndSource dojoDndTarget dojoDndContainer" id="blocks-container-header">
                        <li id="dojoUniqueh1"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout1 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 1">
                            <div>{`<!--Header Layout 1-->`}</div>
                        </li>
                        <li id="dojoUniqueh2"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout2 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 2">
                            <div>{`<!--Header Layout 2-->`}</div>
                        </li>
                        <li id="dojoUniqueh3"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout3 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 3">
                            <div>{`<!--Header Layout 3-->`}</div>
                        </li>
                        <li id="dojoUniqueh4"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout4 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 4">
                            <div>{`<!--Header Layout 4-->`}</div>
                        </li>
                        <li id="dojoUniqueh5"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout5 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 5">
                            <div>{`<!--Header Layout 5-->`}</div>
                        </li>
                        <li id="dojoUniqueh6"
                            className="mojoBlockSourceItem float-left alignc selfclear headerLayout6 dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 6">
                            <div>{`<!--Header Layout 6-->`}</div>
                        </li>
                        <li id="dojoUniqueh7"
                            className="mojoBlockSourceItem float-left alignc selfclear logoIcon dojoDndItem"
                            data-toggle="tooltip" title="Header Layout 7">
                            <div>{`<!--Header Layout 7-->`}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="esmdatamain3 esmdatamain" style={{display:"none"}}>
                <div className="esmdata3">
                    <ul className="block pad-lr0 dojoDndSource dojoDndTarget dojoDndContainer" id="blocks-container-footer">
                        <li id="dojoUniquef1"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout1 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 1">
                            <div>{`<!--Footer Layout 1-->`}</div>
                        </li>
                        <li id="dojoUniquef2"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout2 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 2">
                            <div>{`<!--Footer Layout 2-->`}</div>
                        </li>
                        <li id="dojoUniquef3"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout3 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 3">
                            <div>{`<!--Footer Layout 3-->`}</div>
                        </li>
                        <li id="dojoUniquef4"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout4 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 4">
                            <div>{`<!--Footer Layout 4-->`}</div>
                        </li>
                        <li id="dojoUniquef5"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout5 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 5">
                            <div>{`<!--Footer Layout 5-->`}</div>
                        </li>
                        <li id="dojoUniquef6"
                            className="mojoBlockSourceItem float-left alignc selfclear footerLayout6 dojoDndItem"
                            data-toggle="tooltip" title="Footer Layout 6">
                            <div>{`<!--Footer Layout 6-->`}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export const ControlMenu = ({type="", tabRef, showPopper, arrowRef, setArrowRef, handleClickAway}) => {
    return (
        <div className="editor-pane-col col-sm-12 col-md-2 padding-all-0" id="droppable-menu-3">
            <div className="ui-widget-content" id="draggable-menu" onClick={handleClickAway}>
                <div id="editormenutop">
                    <i className="fas fa-ellipsis-h"></i>
                </div>
                <div id="editormenu">
                    <SettingMenuItems tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={0}/>
                    <div className="editormenuitem" id="questioncontrol">
                        <div className="em pageproperties" data-toggle="tooltip" title="CONTENT BLOCKS" ref={tabRef.current[1]}><i className="fas fa-code"></i></div>
                        <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={1} showText={"CONTENT BLOCKS"}/>
                        <div className="emjoin"></div>
                        <div className="editorsubmenu esmhtml">
                            <div className="esmtitle">CONTENT BLOCKS</div>
                            <div style={{textAlign: "center", marginBottom: "10px"}}>
                                <div className="modulebutton active" data-href="esmdatamain1">Body</div>
                                <div className="modulebutton" data-href="esmdatamain2">Header</div>
                                <div className="modulebutton" data-href="esmdatamain3">Footer</div>
                            </div>
                            <FormPageControls type={type}/>
                            <HeaderFooterControls/>
                        </div>
                    </div>
                    <div className="editormenuitem" id="landingpagecontrol" style={{display:"none"}}>
                        <div className="em pageproperties" data-toggle="tooltip" title="CONTENT BLOCKS" ref={tabRef.current[2]}><i className="fas fa-code"></i></div>
                        <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={2} showText={"CONTENT BLOCKS"}/>
                        <div className="emjoin"></div>
                        <div className="editorsubmenu esmhtml">
                            <div className="esmtitle">CONTENT BLOCKS</div>
                            <div style={{textAlign: "center", marginBottom: "10px"}}>
                                <div className="modulebutton active" data-href="esmdatamain1">Body</div>
                                <div className="modulebutton" data-href="esmdatamain2">Header</div>
                                <div className="modulebutton" data-href="esmdatamain3">Footer</div>
                            </div>
                            <div className="esmdatamain1 esmdatamain" style={{height: "85%"}}>
                                <ContentPageControls/>
                            </div>
                            <HeaderFooterControls/>
                        </div>
                    </div>
                    {type === "surveyEditor" && <div className="editormenuitem" id="aicontrol">
                        <div className="em aiproperties" data-toggle="tooltip" title="ADD QUESTION WITH AI" ref={tabRef.current[4]}>
                            <img src={siteURL+"/img/ai-logo-light.svg"} alt="AI" />
                        </div>
                        <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={4} showText={"ADD QUESTION WITH AI"}/>
                    </div>}
                    <SocialMediaMenuItem tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={3}/>
                </div>
                <div id="editormenubottom">
                    <i className="far fa-question-circle" onClick={() => {
                        handleClickHelp("Functionality/Functionality/Toolbar/AccessDesignToolsFromTheToolbarInEmailsAndSurveys.html")
                    }}></i>
                </div>
            </div>
        </div>
    );
}

export const ZoomModal = () => {
    const [modalImageZoom, setModalImageZoom] = useState(false);
    const toggleImageZoom = () => setModalImageZoom(!modalImageZoom);
    return (
        <>
            <Modal size="lg" isOpen={modalImageZoom} toggle={toggleImageZoom}>
                <ModalHeader toggle={toggleImageZoom}></ModalHeader>
                <ModalBody>
                    <div id="showZoomImage" className="text-center"></div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleImageZoom()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickImageZoom" onClick={()=>{toggleImageZoom()}}/>
        </>
    );
}

export const CategoryModal = ({globalAlert,setCategoryPageList,subUser,addPage, editorType="survey", callFromFirstPage="", handleNextFromCategory=()=>{}})=>{
    const [modalAddCategoryPage, setModalAddCategoryPage] = useState(false);
    const toggleAddCategoryPage = useCallback(() => {setModalAddCategoryPage(!modalAddCategoryPage)}, [modalAddCategoryPage]);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryPage, setCategoryPage] = useState({id:"1",catName:"None", color: "#000000"});
    const [category,setCategory] = useState("");
    const inputRefs = useRef([createRef()]);
    const handleChangeCategoryPage = (id,name) => {
        setCategoryPage(prev=>({...prev, id:id,catName:name}));
    }
    const handleChangeCategoryPageColor = (color)=>{
        setCategoryPage(prev=>({...prev, color: color}));
    }
    const handleClickAddCategoryPage = () => {
        if(category === "") {
            if(categoryPage.id !== ""){
                setCategoryPageList((prev) => { return [...prev, categoryPage] });
                toggleAddCategoryPage();
                if(callFromFirstPage !== "yes"){
                    addPage(categoryPage.id, categoryPage.catName, categoryPage.color);
                }
                setCategoryPage(_=>({id:"1",catName:"None", color: "#000000"}));
                if(callFromFirstPage === "yes"){
                    handleNextFromCategory();
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: "Please select a category or add a new category",
                    open: true
                });
            }
        } else {
            let requestData = {
                "id": 0,
                "catName":category,
                "subMemberId":subUser.memberId
            }
            if(editorType === "survey") {
                saveSurveyCategory(requestData).then(res => {
                    if (res.status === 200) {
                        setCategoryPageList((prev) => { return [...prev, {id:res.result.id,catName:category, color: categoryPage.color}] });
                        setCategoryList((prev) => { return [...prev, {id:res.result.id,catName:category, color: "#000000"}] });
                        toggleAddCategoryPage();
                        if(callFromFirstPage !== "yes"){
                            addPage(res.result.id, category, categoryPage.color);
                        }
                        setCategory("");
                        setCategoryPage(_=>({id:"1",catName:"None", color: "#000000"}));
                        if(callFromFirstPage === "yes"){
                            handleNextFromCategory();
                        }
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            } else if(editorType === "assessment") {
                saveAssessmentCategory(requestData).then(res => {
                    if (res.status === 200) {
                        setCategoryPageList((prev) => { return [...prev, {id:res.result.id,catName:category, color: categoryPage.color}] });
                        setCategoryList((prev) => { return [...prev, {id:res.result.id,catName:category, color: "#000000"}] });
                        toggleAddCategoryPage();
                        if(callFromFirstPage !== "yes"){
                            addPage(res.result.id, category, categoryPage.color);
                        }
                        setCategory("");
                        setCategoryPage(_=>({id:"1",catName:"None", color: "#000000"}));
                        if(callFromFirstPage === "yes"){
                            handleNextFromCategory();
                        }
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }

        }
    }
    useEffect(() => {
        if(editorType === "survey") {
            getSurveyCategoryList().then(res => {
                if (res.result && res.result.surveyCategoryList) {
                    setCategoryList(res.result.surveyCategoryList.map(v=>({...v, color: '#000000'})));
                }
            })
        } else if(editorType === "assessment") {
            getAssessmentCategoryList().then(res => {
                if (res.result && res.result.assessmentCategoryList) {
                    setCategoryList(res.result.assessmentCategoryList.map(v=>({...v, color: '#000000'})));
                }
            })
        }
    },[editorType]);
    useEffect(()=>{
        setTimeout(()=>{
            $(".category-color-picker").spectrum({
                allowEmpty:true,
                color: "#000000",
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                change: function(color) {
                    handleChangeCategoryPageColor(color.toHexString());
                },
                showAlpha: true,
                maxSelectionSize: 1000,
                preferredFormat: "hex",
                localStorageKey: "spectrum.homepage",
                chooseText: "Select",
                palette: []
            });
        }, 100);
    }, [toggleAddCategoryPage]);
    return (
        <>
            <Modal size="lg" isOpen={modalAddCategoryPage} toggle={toggleAddCategoryPage}>
                <ModalHeader toggle={toggleAddCategoryPage}>
                    Set Category for Page
                    <div className='font-size-12'>Category colors will not display in your {editorType}, but will help you organize your {editorType}</div>
                </ModalHeader>
                <ModalBody>
                    {
                        (callFromFirstPage === "yes") && <p className='text-danger'>You must select the category</p>
                    }
                    <RadioGroup aria-label="categoryPage" name="categoryPage" value={categoryPage.id} >
                        <Row>
                            {
                                categoryList.length > 0 ?
                                    categoryList.map((v,i)=>(
                                        <Col key={i} xs={4} className="d-flex justify-content-between align-items-center mb-2">
                                            <FormControlLabel className="mb-0 w-75" value={v.id} control={<Radio color="primary" onChange={(e)=>{handleChangeCategoryPage(v.id,v.catName)}}/>} label={v.catName}/>
                                            <input type="text" defaultValue={v.color} className="category-color-picker"/>
                                        </Col>
                                    ))
                                    : <Col xs={10} className="text-center mx-auto">No category found.</Col>
                            }
                        </Row>
                    </RadioGroup>
                    <hr/>
                    <Row>
                        <Col md={8} sm={12} xs={12} className="mx-auto d-flex justify-content-between align-items-center">
                            <FormGroup style={{width:"85%"}}>
                                <InputField
                                    ref={inputRefs.current[0]}
                                    type="text"
                                    id="category"
                                    name="category"
                                    label="Add New Category"
                                    onChange={(name,value)=>{setCategory(value)}}
                                    value={category}
                                />
                            </FormGroup>
                            <input type="text" defaultValue={'#000000'} className="category-color-picker"/>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>handleClickAddCategoryPage()} className="mr-3">ADD</Button>
                    <Button variant="contained" color="primary" onClick={()=>toggleAddCategoryPage()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickAddCategoryPage" onClick={()=>{toggleAddCategoryPage()}}/>
        </>
    );
}

export const SettingMenuItems = ({type = "", tabRef, showPopper, arrowRef, setArrowRef, i})=>{
    const word = type === "pageEditor"? "DEFAULT":"PAGE";
    return (
        <div className="editormenuitem">
            <div className="em htmlelements" data-toggle="tooltip" title={word + " SETTINGS"} ref={tabRef.current[i]}><i className="fas fa-cog"></i></div>
            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={i} showText={word + " SETTINGS"}/>
            <div className="emjoin"></div>
            <div className="editorsubmenu esmpage">
                <div className="esmtitle">{word} SETTINGS</div>
                <div className="esmdata">
                    {
                        type === "pageEditor" &&
                            <div className="subitem">
                                <div className="subitemtext">Canvas Background<i
                                    className="far fa-angle-right"></i></div>
                                <div className="esmjoin"></div>
                                <div className="subsubitem">
                                    <div className="form-group">
                                        <label>Color</label>
                                        <input type="text" id="canboxbackbox"/>
                                    </div>
                                    <div className="form-group">
                                        <label>Image</label>
                                        <div style={{fontSize: "20px", textAlign: "center"}}>
                                            <i id="canuploadimg" className="fas fa-upload"></i>
                                            <img id="candispimg" style={{
                                                display: "none",
                                                maxWidth: "100px",
                                                maxHeight: "50px",
                                                marginRight: "15px"
                                            }} alt="canvas"/>
                                            <i id="candeleteimg" style={{display: "none"}}
                                            className="far fa-trash-alt"></i></div>
                                    </div>
                                    <div className="form-group">
                                        <label>Repeat</label>
                                        <div id="grid">
                                            <img item-value="stretch" alt="stretch"
                                                className="grid" src={siteURL + "/img/grid-stretch.png"}/>
                                            <img item-value="repeat" alt="repeat"
                                                className="grid" src={siteURL + "/img/grid.png"}/>
                                            <img item-value="repeat-x" alt="repeat-x"
                                                className="grid" src={siteURL + "/img/grid-h.png"}/>
                                            <img item-value="repeat-y" alt="repeat-y"
                                                className="grid" src={siteURL + "/img/grid-v.png"}/>
                                            <img item-value="no-repeat" alt="no-repeat"
                                                className="grid" src={siteURL + "/img/grid-no.png"}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Brightness</label>
                                        <div id="canbrightness"></div>
                                    </div>
                                    <div className="form-group">
                                        <label>Position</label>
                                        <div id="canposition">
                                            <div className="pos" item-value="0% 0%"></div>
                                            <div className="pos" item-value="0% 50%"></div>
                                            <div className="pos" item-value="0% 100%"></div>
                                            <div className="pos" item-value="50% 0%"></div>
                                            <div className="pos" item-value="50% 50%"></div>
                                            <div className="pos" item-value="50% 100%"></div>
                                            <div className="pos" item-value="100% 0%"></div>
                                            <div className="pos" item-value="100% 50%"></div>
                                            <div className="pos" item-value="100% 100%"></div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Blending</label>
                                        <select id="canblend">
                                            <option value="normal">Normal</option>
                                            <option value="overlay">Overlay</option>
                                            <option value="multiply">Multiply</option>
                                            <option value="screen">Screen</option>
                                            <option value="darken">Darken</option>
                                            <option value="lighten">Lighten</option>
                                            <option value="color">Color</option>
                                            <option value="color-dodge">Color Dodge</option>
                                            <option value="saturation">Saturation</option>
                                            <option value="luminosity">Luminosity</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                    }
                    <div className="subitem">
                        <div className="subitemtext">{type==="pageEditor"?"Page":""} Background<i
                            className="far fa-angle-right"></i></div>
                        <div className="esmjoin"></div>
                        <div className="subsubitem">
                            <div className="form-group">
                                <label>Color</label>
                                <input type="text" id="pdconboxbackbox"/>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <div style={{fontSize: "20px", textAlign: "center"}}>
                                    <i id="pdconuploadimg"
                                    className="fas fa-upload"></i>
                                    <img id="pdcondispimg" style={{
                                        display: "none",
                                        maxWidth: "100px",
                                        maxHeight: "50px",
                                        marginRight: "15px"
                                    }} alt="page"/>
                                    <i id="pdcondeleteimg" style={{display: "none"}}
                                    className="far fa-trash-alt"></i></div>
                            </div>
                            <div className="form-group">
                                <label>Repeat</label>
                                <div id="pdcongrid">
                                    <img item-value="stretch" alt="stretch" className="grid" src={siteURL+"/img/grid-stretch.png"}/>
                                    <img item-value="repeat" alt="repeat" className="grid" src={siteURL+"/img/grid.png"}/>
                                    <img item-value="repeat-x" alt="repeat-x" className="grid" src={siteURL+"/img/grid-h.png"}/>
                                    <img item-value="repeat-y" alt="repeat-y" className="grid" src={siteURL+"/img/grid-v.png"}/>
                                    <img item-value="no-repeat" alt="no-repeat" className="grid" src={siteURL+"/img/grid-no.png"}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Brightness</label>
                                <div id="pdconbrightness"></div>
                            </div>
                            <div className="form-group">
                                <label>Position</label>
                                <div id="pdconposition">
                                    <div className="pos" item-value="0% 0%"></div>
                                    <div className="pos" item-value="0% 50%"></div>
                                    <div className="pos" item-value="0% 100%"></div>
                                    <div className="pos" item-value="50% 0%"></div>
                                    <div className="pos" item-value="50% 50%"></div>
                                    <div className="pos" item-value="50% 100%"></div>
                                    <div className="pos" item-value="100% 0%"></div>
                                    <div className="pos" item-value="100% 50%"></div>
                                    <div className="pos" item-value="100% 100%"></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Blending</label>
                                <select id="pdconblend">
                                    <option value="normal">Normal</option>
                                    <option value="overlay">Overlay</option>
                                    <option value="multiply">Multiply</option>
                                    <option value="screen">Screen</option>
                                    <option value="darken">Darken</option>
                                    <option value="lighten">Lighten</option>
                                    <option value="color">Color</option>
                                    <option value="color-dodge">Color Dodge</option>
                                    <option value="saturation">Saturation</option>
                                    <option value="luminosity">Luminosity</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="subitem">
                        <div className="subitemtext">Text Settings<i className="far fa-angle-right"></i></div>
                        <div className="esmjoin"></div>
                        <div className="subsubitem">
                            <div>
                                <label>Name</label>
                                <select id="pdselectfamily">
                                    {
                                        fontData.map((value, index) => (
                                            <option key={index} value={value.key} style={{fontFamily:value.key}}>{value.value}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div>
                                <label>Size</label>
                                <select id="pdselectfontsize">
                                    <option value="9px">9px</option>
                                    <option value="10px">10px</option>
                                    <option value="11px">11px</option>
                                    <option value="12px">12px</option>
                                    <option value="13px">13px</option>
                                    <option value="14px">14px</option>
                                    <option value="15px">15px</option>
                                    <option value="16px">16px</option>
                                    <option value="17px">17px</option>
                                    <option value="18px">18px</option>
                                    <option value="19px">19px</option>
                                    <option value="20px">20px</option>
                                    <option value="22px">22px</option>
                                    <option value="24px">24px</option>
                                    <option value="26px">26px</option>
                                    <option value="28px">28px</option>
                                    <option value="30px">30px</option>
                                    <option value="32px">32px</option>
                                    <option value="34px">34px</option>
                                    <option value="36px">36px</option>
                                    <option value="38px">38px</option>
                                    <option value="40px">40px</option>
                                    <option value="42px">42px</option>
                                    <option value="44px">44px</option>
                                    <option value="46px">46px</option>
                                    <option value="48px">48px</option>
                                    <option value="50px">50px</option>
                                    <option value="52px">52px</option>
                                    <option value="54px">54px</option>
                                    <option value="56px">56px</option>
                                    <option value="58px">58px</option>
                                    <option value="60px">60px</option>
                                    <option value="62px">62px</option>
                                    <option value="64px">64px</option>
                                    <option value="66px">66px</option>
                                    <option value="68px">68px</option>
                                    <option value="70px">70px</option>
                                    <option value="72px">72px</option>
                                </select>
                            </div>
                            <div>
                                <label>Line Height(in Pixel)</label>
                                <input type="text" id="pdtextlineheight"/>
                            </div>
                            <div>
                                <label>Style</label>
                                <div className="pagestylebox">
                                    <Link id="pgstlbold" component="a">
                                        <div className="pagestyle"><i className="far fa-bold"></i></div>
                                    </Link>
                                    <Link id="pgstlitalic" component="a">
                                        <div className="pagestyle"><i className="far fa-italic"></i></div>
                                    </Link>
                                    <Link id="pgstlunderline" component="a">
                                        <div className="pagestyle"><i className="far fa-underline"></i></div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <label>Color</label>
                                <input type="text" id="pdtextcolorbox"/>
                            </div>
                        </div>
                    </div>
                    <div className="subitem">
                        <div className="subitemtext">Border<i className="far fa-angle-right"></i></div>
                        <div className="esmjoin"></div>
                        <div className="subsubitem">
                            <div>
                                <label>Border Style(in Pixel)</label>
                                <div>
                                    <select id="pdconselectbortsty">
                                        <option value=""
                                                className="optpreview border-style none">None
                                        </option>
                                        <option value="solid"
                                                className="optpreview border-style solid">Solid
                                        </option>
                                        <option value="dashed"
                                                className="optpreview border-style dashed">Dashed
                                        </option>
                                        <option value="dotted"
                                                className="optpreview border-style dotted">Dotted
                                        </option>
                                        <option value="double"
                                                className="optpreview border-style double">Double
                                        </option>
                                        <option value="groove"
                                                className="optpreview border-style groove">Groove
                                        </option>
                                        <option value="ridge"
                                                className="optpreview border-style ridge">Ridge
                                        </option>
                                        <option value="inset"
                                                className="optpreview border-style inset">Inset
                                        </option>
                                        <option value="outset"
                                                className="optpreview border-style outset">Outset
                                        </option>
                                    </select>
                                    <div className="float-left mojoBorderWidth">
                                        <input id="pdconborwid" tabIndex="0"
                                            data-dojo-attach-point="textbox,focusNode"
                                            autoComplete="off" type="text"/>
                                    </div>
                                    <input type="text" id="pdconboxborderbox"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subitem">
                        <div className="subitemtext">Margin<i className="far fa-angle-right"></i></div>
                        <div className="esmjoin"></div>
                        <div className="subsubitem">
                            <div>
                                <label>Margin(in Pixel)</label>
                                <div style={{marginBottom: "10px"}}>
                                    <div style={{float: "left"}}>
                                        Top&nbsp;
                                        <div id="boxpadtopbox" role="presentation">
                                            <input id="boxmrgtop" tabIndex="10" data-dojo-attach-point="textbox,focusNode" autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{float: "right"}}>
                                        Bottom&nbsp;
                                        <div id="boxpadbottombox" role="presentation">
                                            <input id="boxmrgbottom" tabIndex="11" data-dojo-attach-point="textbox,focusNode" autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                <div>
                                    <div style={{float: "left"}}>
                                        Left&nbsp;
                                        <div id="boxpadleftbox" role="presentation">
                                            <input id="boxmrgleft" tabIndex="12" data-dojo-attach-point="textbox,focusNode" autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{float: "right"}}>
                                        Right&nbsp;
                                        <div id="boxpadrightbox" role="presentation">
                                            <input id="boxmrgright" tabIndex="13" data-dojo-attach-point="textbox,focusNode" autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{clear: "both"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subitem">
                        <div className="subitemtext">Padding<i className="far fa-angle-right"></i></div>
                        <div className="esmjoin"></div>
                        <div className="subsubitem">
                            <div>
                                <label>Padding(in Pixel)</label>
                                <div style={{marginBottom: "10px"}}>
                                    <div style={{float: "left"}}>
                                        Top&nbsp;
                                        <div id="boxpadtopbox" role="presentation">
                                            <input id="boxpadtop" tabIndex="20"
                                                data-dojo-attach-point="textbox,focusNode"
                                                autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{float: "right"}}>
                                        Bottom&nbsp;
                                        <div id="boxpadbottombox" role="presentation">
                                            <input id="boxpadbottom" tabIndex="21"
                                                data-dojo-attach-point="textbox,focusNode"
                                                autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{clear: "both"}}></div>
                                </div>
                                <div>
                                    <div style={{float: "left"}}>
                                        Left&nbsp;
                                        <div id="boxpadleftbox" role="presentation">
                                            <input id="boxpadleft" tabIndex="22"
                                                data-dojo-attach-point="textbox,focusNode"
                                                autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{float: "right"}}>
                                        Right&nbsp;
                                        <div id="boxpadrightbox" role="presentation">
                                            <input id="boxpadright" tabIndex="23"
                                                data-dojo-attach-point="textbox,focusNode"
                                                autoComplete="off" type="text"/>
                                        </div>
                                    </div>
                                    <div style={{clear: "both"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const DraggableSettingsMenu = () => {
    return (
        <div className="ui-widget-content" id="draggable-setting-menu">
            <div id="dsmtop">
                <span className="font-weight-bold" style={{fontSize:"14px", position: "relative", top: "-2px"}}>Properties</span>
                <i id="dsmclosemenu" className="fas fa-times"></i>
            </div>
            <div id="dsmmenu-resize" className='w-100 overflow-auto'>
            <div id="dsmmenu">
                <div className="form-group text-right dsmbsettingbutton">
                    <i className="tpl-open-ai tpl-specific-t" data-toggle="tooltip" title="Content With AI Assistant">AI</i>
                    <i className="fas fa-pencil-alt tpl-image-edit tpl-specific-i" data-toggle="tooltip" title="Edit Image"></i>
                    {/* <i className="fas fa-pencil-alt tpl-image-edit-ai tpl-specific-i" data-toggle="tooltip" title="Edit Image With AI"></i> */}
                    <i className="far fa-image tpl-image-replace tpl-specific-i" data-toggle="tooltip" title="Replace Image"></i>
                    <i className="fal fa-trash-alt tpl-social-delete tpl-specific-s" data-toggle="tooltip" title="Delete Content"></i>
                    <i className="fas fa-pencil-alt tpl-ecom-edit tpl-specific-e" data-toggle="tooltip" title="Change"></i>
                    <i className="far fa-paperclip tpl-attachment-edit tpl-specific-a" data-toggle="tooltip" title="Change Attached File"></i>
                    <i className="fas fa-plus-circle tpl-block-clone" data-toggle="tooltip" title="Duplicate Block"></i>
                    <i className="fal fa-trash-alt tpl-block-delete" data-toggle="tooltip" title="Delete Block"></i>
                    <i className="fas fa-long-arrow-alt-up tpl-block-move-up" data-toggle="tooltip" title="Move Up Block"></i>
                    <i className="fas fa-long-arrow-alt-down tpl-block-move-down" data-toggle="tooltip" title="Move Down Block"></i>
                </div>
                <div id="dsmbutton">
                    <div id="cbutton" className="active">Content</div>
                    <div id="bbutton" className="">Block</div>
                </div>
                <div id="dsmcsetting"></div>
                <div id="dsmbsetting" style={{display: "none"}}></div>
            </div>
            </div>
            <div id="dsmbottom">
                <i className="far fa-question-circle" onClick={()=>{handleClickHelp("Functionality/Functionality/Toolbar/ContentandBlockDesignToolbar-QuestionlayoutandPagetransitions.html")}}></i>
            </div>
        </div>
    );
}

export const PageEditorButtons = ({handleBack, toggleMyPageSetting, handleClickSendPreviewEmail, handleClickSave, handleClickPublish, data, handleClickSpamChecker, closeMyPageEditor, handleClickExportToImage, handleClickExportToPDF, handleClickExportToHTML})=>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Row className="editor-buttons">
            <Col md={5}>
                <Link component="a" className="btn-circle" onClick={()=>{handleBack()}} data-toggle="tooltip" title="Back">
                    <i className="fad fa-long-arrow-left"></i>
                    <div className="bg-blue"></div>
                </Link>
                <span className="mx-2">Page Name : {data.mpName}</span>
                <Link component="a" className="btn-circle" onClick={()=>{toggleMyPageSetting()}} data-toggle="tooltip" title="Edit">
                    <i className="far fa-pencil-alt"></i>
                    <div className="bg-blue"></div>
                </Link>
                {
                    data.group > 0 ?
                        <Link id="editGroup" component="a" className="btn-circle" onClick={()=>{toggleMyPageSetting()}} data-toggle="tooltip" title={data.groupName}>
                            <i className="far fa-address-book"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        : null
                }
            </Col>
            <Col md={3} style={{paddingLeft: "50px"}}>
                <div id="posformob" title="300px" className="devisbtn"><i className="fas fa-mobile-android-alt"></i></div>
                <div id="posfortab" title="450px" className="devisbtn"><i className="fas fa-tablet-android-alt"></i></div>
                <div id="posfordes" title="600px" className="devisbtn ac"><i className="fas fa-desktop"></i></div>
            </Col>
            <Col md={4}>
                <Row>
                    {/*<Col md={7}>*/}
                        {/*<span className="mr-1">Content Spam Score : <span id="spamassassinscore">3.5</span></span>*/}

                    {/*</Col>*/}
                    <Col md={12} className="text-right">
                        <Link component="a" className="btn-circle" onClick={()=>{window.open(`${staticUrl}/roi-calculator.html`, '_blank')}} data-toggle="tooltip" title="ROI Calculator">
                            <i className="far fa-calculator"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle" onClick={()=>{handleClickSpamChecker()}} data-toggle="tooltip" title="Spam Checker">
                            <i className="far fa-user-secret"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle send-preview-email" onClick={() => { handleClickSendPreviewEmail() }} data-toggle="tooltip" title="Send Preview Email">
                            <i className="far fa-envelope"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle save" onClick={()=>{handleClickSave("no")}} data-toggle="tooltip" title="Save">
                            <i className="far fa-save"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle save-for-later" onClick={()=>{handleClickSave("yes")}} data-toggle="tooltip" title="Save And Exit">
                            <i className="far fa-save"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle publish" onClick={()=>{handleClickPublish()}} data-toggle="tooltip" title="Publish">
                            <i className="far fa-envelope-open-text"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <Link component="a" className="btn-circle export" onClick={handleClick} data-toggle="tooltip" title="Export" id="customized-button" aria-controls={open ? 'customized-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
                            <i className="far fa-file-export ml-1"></i>
                            <div className="bg-blue"></div>
                        </Link>
                        <StyledMenu
                            id="customized-menu"
                            MenuListProps={{ 'aria-labelledby': 'customized-button', }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={()=>{handleClickExportToImage();handleClose();}} disableRipple><i className="far fa-file-image mr-2"></i>As Image</MenuItem>
                            <MenuItem onClick={()=>{handleClickExportToPDF();handleClose();}} disableRipple><i className="far fa-file-pdf mr-2"></i>As PDF</MenuItem>
                            <MenuItem onClick={()=>{handleClickExportToHTML();handleClose();}} disableRipple><i className="far fa-file-code mr-2"></i>As HTML</MenuItem>
                        </StyledMenu>
                        <Link component="a" className="btn-circle" onClick={()=>{closeMyPageEditor()}} data-toggle="tooltip" title="Cancel">
                            <i className="far fa-times"></i>
                            <div className="bg-blue"></div>
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export const SpamCheckerModal = ({modalSpamChecker, toggleSpamChecker, globalAlert, user, groupId, savefullcontent}) => {
    const [checkerStatus, setCheckerStatus] = useState(false);
    const [subject, setSubject] = useState("");
    const [spamCheckDetails, setSpamCheckDetails] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModalOpen = () => setModalOpen(!modalOpen);
    const [title, setTitle] = useState("");
    const resetData = () => {
        setCheckerStatus(false);
        setSubject("");
        setSpamCheckDetails({});
    }
    const handleClickCheck = () => {
        if(subject === ""){
            globalAlert({
                type: "Error",
                text: "Please enter subject",
                open: true
            });
            return false;
        }
        savefullcontent();
        $("button.checkButton").hide();
        $("button.checkButton").after('<div class="lds-ellipsis mr-3"><div></div><div></div><div></div>');
        setCheckerStatus(true);
        let requestData = {
            "domainName":user.email.split("@")[1],
            "campName": "",
            "allTempData":$("#all_temp_data").val(),
            "myPageId": 0,
            "selectedGid": groupId,
            "replyToAdd":user.email,
            "fromName": `${user.firstName} ${user.lastName}`,
            "subject": subject,
            "fromAdd": user.email,
            "testingType": 0,
            "subjectB": "",
            "allTempDataB":"",
            "myPageIdB": 0,
            "fromNameB": "",
            "checkSpamYN":"Y"
        }
        checkSpam(requestData).then(res => {
            if (res.status === 200) {
                setSpamCheckDetails(res.result);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.checkButton").show();
        });
    }
    const handleClickModalOpen = (title) => {
        setTitle(title);
        toggleModalOpen();
    }
    const titleDetails = (title) => {
        title = title.split(" : ")[0];
        switch (title) {
            case "First Word Flag":
                return (
                    <>
                        <p><strong>First Word Flag</strong></p>
                        <p>The first word in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with the word "Hi...", "Hello..." or "Hey..." could be from a friend but, more frequently, these greetings are seen in SPAM emails.</p>
                    </>
                );
            case "First Character Flag":
                return (
                    <>
                        <p><strong>First Character Flag</strong></p>
                        <p>The first character in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with a dollar sign or special characters, such as ">...", are frequently seen starting the Subject line of a SPAM email.</p>
                    </>
                );
            case "Spam Words":
                return (
                    <>
                        <p><strong>Spam Words</strong></p>
                        <p>When spam words appear in a Subject line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to spam words by deleting the email before opening it.</p>
                    </>
                );
            case "Percent Capital Letters":
                return (
                    <>
                        <p><strong>Percent Capital Letters</strong></p>
                        <p>When the overall percentage of upper case letters to lower case letters becomes too high, there is a greater chance that SPAM filters and/or recipients might react to the email as though it is SPAM.</p>
                    </>
                );
            case "Repeating Capital Letters":
                return (
                    <>
                        <p><strong>Repeating Capital Letters</strong></p>
                        <p>When too many upper case letters occur in sequence (i.e., "SALE"), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Number of Characters":
                return (
                    <>
                        <p><strong>Number of Characters</strong></p>
                        <p>The ideal number of characters in a subject line is typically considered to be between 20 and 35. The main reason for keeping the length of the Subject line within this range is because the software people use to read their email will only display a certain number of characters by default. If the subject line is too long, its text will be truncated.</p>
                    </>
                );
            case "Word/Space Ratio":
                return (
                    <>
                        <p><strong>Word/Space Ratio</strong></p>
                        <p>Spammers have tendency to use blank spaces to catch the recipient's attention. When the ratio of spaces to words becomes too high in a Subject line, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Gappy Check":
                return (
                    <>
                        <p><strong>Gappy Check</strong></p>
                        <p>Spammers will often use spaces between characters as an attempt to bypass word filters. When the w*o*r*d*s in a Subject line have gaps in them, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Repetition Check":
                return (
                    <>
                        <p><strong>Repetition Check</strong></p>
                        <p>When a series of characters are found in repetition (i.e., ">>>"), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Consecutive Numbers":
                return (
                    <>
                        <p><strong>Consecutive Numbers</strong></p>
                        <p>When a Subject line has significant amount of numbers found in sequence, there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Special Character Flag":
                return (
                    <>
                        <p><strong>Special Character Flag</strong></p>
                        <p>When a Subject line has a greater than expected amount of special characters (i.e., & $ # @ ( )[ ] !), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Punctuation Flag":
                return (
                    <>
                        <p><strong>Punctuation Flag</strong></p>
                        <p>When a Subject line has a greater than expected amount of punctuation (i.e., too many periods .....), there is a greater chance that SPAM filters and/or recipients will react to the email as though it is SPAM.</p>
                    </>
                );
            case "Vulgar Words":
                return (
                    <>
                        <p><strong>Vulgar Words</strong></p>
                        <p>When vulgar words appear in a Subject line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to vulgar words by deleting the email before opening it.</p>
                    </>
                );
            case "Content Spam Words":
                return (
                    <>
                        <p><strong>Spam Words</strong></p>
                        <p>When spam words appear in a Content line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to spam words by deleting the email before opening it.</p>
                    </>
                );
            case "Content Vulgar Words":
                return (
                    <>
                        <p><strong>Vulgar Words</strong></p>
                        <p>When vulgar words appear in a Content line, there is a high probability that SPAM filters will delete the email before it reaches the Recipients. Beyond this, individuals could react to vulgar words by deleting the email before opening it.</p>
                    </>
                );
            default:
                return (
                    <>
                        <p><strong>First Word Flag</strong></p>
                        <p>The first word in a subject line offers a good indication whether the email might be viewed as SPAM. For example, subject lines starting with the word "Hi...", "Hello..." or "Hey..." could be from a friend but, more frequently, these greetings are seen in SPAM emails.</p>
                    </>
                );
        }
    }
    return (
        <>
            <Modal size="lg" isOpen={modalSpamChecker} toggle={()=>{toggleSpamChecker(); resetData();}}>
                <ModalHeader toggle={()=>{toggleSpamChecker(); resetData();}}>Spam Checker</ModalHeader>
                <ModalBody>
                    {
                        !checkerStatus ?
                            <div className="w-75 mx-auto">
                                <InputField type="text" id="subject" name="subject" value={subject} onChange={(name, value)=>{setSubject(value)}} label="Subject" />
                            </div>
                        :
                            <div className="mx-5">
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
                                </div>
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
                                        spamCheckDetails?.checkSubjectContent?.emailSubjectError?.length > 0 ?
                                            spamCheckDetails?.checkSubjectContent?.emailSubjectError.map((v,i)=>(
                                                <div key={i} className="col-12 d-flex ml-5 my-2 align-items-center">
                                                    <i className="far fa-times-circle error-circle"></i>
                                                    <p className="mb-0">{v}</p>
                                                    <i className="far fa-question-circle ml-3 font-size-18" onClick={()=>{handleClickModalOpen(v)}}></i>
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
                                            spamCheckDetails?.checkSubjectContent?.emailContentError.map((v,i)=>(
                                                <div key={i} className="col-12 d-flex ml-5 mt-1 mb-1 align-items-center">
                                                    <i className="far fa-times-circle error-circle"></i>
                                                    <p className="mb-0">{v}</p>
                                                    <i className="far fa-question-circle ml-3 font-size-18" onClick={()=>{handleClickModalOpen("Content "+v)}}></i>
                                                </div>
                                            ))
                                        : null
                                    }
                                </div>
                            </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>handleClickCheck()} className="mr-3 checkButton">CHECK</Button>
                    <Button variant="contained" color="primary" onClick={()=>{toggleSpamChecker(); resetData();}} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalOpen} toggle={toggleModalOpen}>
                <ModalHeader toggle={toggleModalOpen}>Details</ModalHeader>
                <ModalBody>
                    {titleDetails(title)}
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={()=>toggleModalOpen()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
export const EditCategoryStyleModal = ({editorType="survey"}) => {
    const [modalEditCategoryStyle, setModalEditCategoryStyle] = useState(false);
    const toggleEditCategoryStyle = () => setModalEditCategoryStyle(!modalEditCategoryStyle);
    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        if(editorType === "survey") {
            getSurveyCategoryList().then(res => {
                if (res.result && res.result.surveyCategoryList) {
                    setCategoryList(res.result.surveyCategoryList);
                }
            })
        } else if(editorType === "assessment") {
            getAssessmentCategoryList().then(res => {
                if (res.result && res.result.assessmentCategoryList) {
                    setCategoryList(res.result.assessmentCategoryList);
                }
            })
        }
    },[editorType]);
    return (
        <>
            <Modal isOpen={modalEditCategoryStyle} toggle={toggleEditCategoryStyle}>
                <ModalHeader toggle={toggleEditCategoryStyle}>Category / Progress Bar Settings</ModalHeader>
                <ModalBody>
                    <div>
                        <p className="mb-0 font-weight-bold">Category</p>
                        <div id="ecscatprevmain" className='d-flex'>
                            <p className="text-center mb-0 w-100" id="catNamePreview"></p>
                            <i id="editcatprev" className="far fa-pencil-alt"></i>
                        </div>
                        <div id="ecscatcombomain" className='d-none align-items-center mt-2'>
                            <div className='w-75'>
                                <select id="ecsselectcategory">
                                    {
                                        categoryList.map((v,i)=>(
                                            <option key={i} value={v.id}>{v.catName}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className='w-25 d-flex justify-content-center align-items-center'>
                                <input type="text" id="ecscatcolorbox" style={{display:"none"}}/>
                                <i id="closecatcombo" className="far fa-times ml-3"></i>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <Row>
                        <Col xs={6}>
                            <label className="font-weight-bold">Font Family</label>
                            <select id="ecsselectfamily">
                                {
                                    fontData.map((value, index) => (
                                        <option key={index} value={value.key} style={{fontFamily:value.key}}>{value.value}</option>
                                    ))
                                }
                            </select>
                        </Col>
                        <Col xs={6}>
                            <label className="font-weight-bold">Font Size</label>
                            <select id="ecsselectfontsize">
                                <option value="9px">9px</option>
                                <option value="10px">10px</option>
                                <option value="11px">11px</option>
                                <option value="12px">12px</option>
                                <option value="13px">13px</option>
                                <option value="14px">14px</option>
                                <option value="15px">15px</option>
                                <option value="16px">16px</option>
                                <option value="17px">17px</option>
                                <option value="18px">18px</option>
                                <option value="19px">19px</option>
                                <option value="20px">20px</option>
                                <option value="22px">22px</option>
                                <option value="24px">24px</option>
                                <option value="26px">26px</option>
                                <option value="28px">28px</option>
                                <option value="30px">30px</option>
                                <option value="32px">32px</option>
                                <option value="34px">34px</option>
                                <option value="36px">36px</option>
                                <option value="38px">38px</option>
                                <option value="40px">40px</option>
                                <option value="42px">42px</option>
                                <option value="44px">44px</option>
                                <option value="46px">46px</option>
                                <option value="48px">48px</option>
                                <option value="50px">50px</option>
                                <option value="52px">52px</option>
                                <option value="54px">54px</option>
                                <option value="56px">56px</option>
                                <option value="58px">58px</option>
                                <option value="60px">60px</option>
                                <option value="62px">62px</option>
                                <option value="64px">64px</option>
                                <option value="66px">66px</option>
                                <option value="68px">68px</option>
                                <option value="70px">70px</option>
                                <option value="72px">72px</option>
                            </select>
                        </Col>
                        <Col xs={6} className="mt-3">
                            <label className="font-weight-bold">Line Height</label><br/>
                            <input type="text" id="ecstextlineheight" className="input-width-50px"/> px
                        </Col>
                        <Col xs={6} className="mt-3">
                            <label className="font-weight-bold">Style</label>
                            <div className="pagestylebox">
                                <span id="ecsstlbold"><div className="pagestyle"><i className="far fa-bold"></i></div></span>
                                <span id="ecsstlitalic"><div className="pagestyle"><i className="far fa-italic"></i></div></span>
                                <span id="ecsstlunderline"><div className="pagestyle"><i className="far fa-underline"></i></div></span>
                            </div>
                        </Col>
                        <Col xs={6} className="mt-3">
                            <label className="font-weight-bold">Text Color</label><br/>
                            <input type="text" id="ecstextcolorbox" style={{display:"none"}}/>
                        </Col>
                        <Col xs={6} className="mt-3">
                            <label className="font-weight-bold">Background Color</label><br/>
                            <input type="text" id="ecsbgcolorbox" style={{display:"none"}}/>
                        </Col>
                        <Col xs={12} className="mt-3">
                            <label className="font-weight-bold">Padding</label>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <label className="font-weight-bold">Top</label>
                                    <div>
                                        <input type="text" id="ecspadtop" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                                <div>
                                    <label className="font-weight-bold">Bottom</label>
                                    <div>
                                        <input type="text" id="ecspadbottom" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                                <div>
                                    <label className="font-weight-bold">Left</label>
                                    <div>
                                        <input type="text" id="ecspadleft" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                                <div>
                                    <label className="font-weight-bold">Right</label>
                                    <div>
                                        <input type="text" id="ecspadright" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" className="mr-3" id="clickSaveCategoryStyle">SAVE</Button>
                    <Button variant="contained" color="primary" onClick={()=>toggleEditCategoryStyle()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickEditCategoryStyle" onClick={()=>{toggleEditCategoryStyle()}}/>
            <input type="hidden" id="editorType" value={editorType}/>
        </>
    );
}
export const CategoryMenu = () => {
    return (
        <div id="draggable-category-list" style={{display:"none"}}>
            <div id="dsmtop">
                <i className="fas fa-ellipsis-h"></i>
            </div>
            <div id="dcllist-resize" className='w-100 overflow-auto'><div id="dcllist" className="p-2"></div></div>
            <div id="dsmbottom">
                <i className="far fa-question-circle" onClick={()=>{handleClickHelp("Functionality/Functionality/Toolbar/AccessCategoryTextToolbartopersonalizeyoursurveysandassessment.html")}}></i>
            </div>
        </div>
    );
}
const toolbarProperties = {
    options: ['inline', 'list', 'link', 'emoji', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    list: {
        options: ['unordered', 'ordered'],
    }
}
export const AddSignatureModal = ({ globalAlert, subUser, callReloadFirst }) => {
    const [signatureData, setSignatureData] = useState({signId: 0, signTitle: "", signDescription: EditorState.createEmpty()});
    const [modalAddSignature, setModalAddSignature] = useState(false);
    const toggleAddSignature = () => { 
        if (modalAddSignature) {
            setSignatureData({signId: 0, signTitle: "", signDescription: EditorState.createEmpty()});
        }
        setModalAddSignature(!modalAddSignature); 
    };

    const handleChangeData = (name, value) => {
        setSignatureData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const handleClickSave = () => {
        if(signatureData.signTitle.trim() === "") {
            globalAlert({
                type: "Error",
                text: "Please enter signature title.",
                open: true
            });
            return;
        }
        const contentState = signatureData.signDescription.getCurrentContent();
        const plainText = contentState.getPlainText().trim();
        if (!plainText) {
            globalAlert({
                type: "Error",
                text: "Please enter signature content.",
                open: true
            });
            return;
        }
        let requestData = {
            signId: signatureData.signId,
            signTitle: signatureData.signTitle,
            signDescription: draftToHtml(convertToRaw(signatureData.signDescription.getCurrentContent())).replace(/\n$/, ''),
            subMemberId: subUser.memberId
        };
        saveEmailSignature(requestData).then((res) => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                $('#templateBody').find('.mojoMcBlock.tpl-block .textTdBlock').unbind("each").each(function() {
                    let id = $(this).attr("id");
                    if(typeof window?.CKEDITOR?.instances?.[id] !== "undefined"){
                        window.CKEDITOR.instances[id].destroy();
                    }
                });
                callReloadFirst();
                toggleAddSignature();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    
    return (
        <>
            <Modal isOpen={modalAddSignature} toggle={toggleAddSignature}>
                <ModalHeader>Your Signature Information</ModalHeader>
                <ModalBody>
                    <TextField
                        variant="standard"
                        label="Signature Title"
                        value={signatureData?.signTitle || ""}
                        onChange={(e) => handleChangeData("signTitle", e.target.value)}
                        fullWidth
                    />
                    <div className="d-flex mt-3">
                        <Editor
                            editorState={signatureData.signDescription}
                            wrapperClassName="wrapper-class d-inline-block"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            onEditorStateChange={(state) => {
                                handleChangeData("signDescription", state);
                            }}
                            toolbar={toolbarProperties}
                            wrapperStyle={{width:"100%", height:"100%"}}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={() => { handleClickSave(); }} className="mr-3">SAVE</Button>
                    <Button variant="contained" color="primary" onClick={() => { toggleAddSignature(); }}>CANCEL</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickAddSignature" onClick={()=>{toggleAddSignature()}}/>
        </>
    );
}