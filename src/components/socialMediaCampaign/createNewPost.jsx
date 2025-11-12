import React, {useCallback, useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {Row, Col} from "reactstrap"
import {Button, FormGroup, styled, TextField, Menu, MenuItem, InputAdornment} from "@mui/material"
import InputField from "../shared/commonControlls/inputField"
import ImageDropZone from "./imageDropZone";
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {dateTimeFormatDB, easUrlEncoder} from "../../assets/commonFunctions";
import EmojiPicker from "emoji-picker-react";
import Emoji from "emoji-js";
import {facebookOauth, getFacebookUserData, getLinkPreview, getSocialMediaAuthentication, getSocialMediaCampaign, getTwitterUserData, linkedInOauth, linkedinPagesData, linkedinUserData, postNow, removeImage, saveAsDraft, saveSchedule, twitterOauth} from "../../services/socialMediaService";
import {facebookUrl, linkedinUrl, siteURL, twitterUrl} from "../../config/api";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import history from "../../history";
import $ from "jquery";
import {getThumbnails} from "video-metadata-thumbnails";
import axios from "axios";
import VideoDropZoneFacebook from "./videoDropZoneFacebook";
// import VideoDropZoneTwitter from "./videoDropZoneTwitter";
import VideoDropZoneLinkedin from "./videoDropZoneLinkedin";
import {setLoader} from "../../actions/loaderActions";
import { getClientTimeZone } from './../../assets/commonFunctions';
import PostPreview from "./postPreview";
import ModalLinkedinPages from "./modalLinkedinPages";

let jsemoji = new Emoji();
jsemoji.img_set = "emojione";
jsemoji.img_sets.emojione = {
    path: "",
    sheet: "",
    sheet_size: null,
    mask: null
}
jsemoji.img_sets.emojione.path = "https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/";
jsemoji.supports_css = false;
jsemoji.allow_native = true;
jsemoji.replace_mode = "unified";

const CustomInput = styled((props) => (
    <TextField
        variant="standard"
        hiddenLabel={true}
        multiline
        InputProps={{ disableUnderline: true }}
        {...props}
        fullWidth
    />
))(({ theme }) => ({
    "& .MuiInputBase-input": {
        display: "block",
        height: "auto",
        minHeight: "8em",
        maxHeight: "15em",
        overflow: "auto",
        lineHeight: 1.42857143,
        backgroundColor: "transparent",
        fontSize: "inherit",
        color: "#555",
        cursor: "text",
        boxShadow: "none",
        padding: "10px"
    }
}));

const CreateNewPost = ({
    connectedToSocialMedia = {
        facebook: false,
        linkedin: false,
        twitter: false
    },
    user,
    subUser,
    globalAlert,
    setLoader,
    location
}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [viewSelected, setViewSelected] = useState(1);
    const [postOption, setPostOption] = useState(1);
    const [currentSelectedOption, setCurrentSelectedOption] = useState(1)
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [acceptedFilesInState, setAcceptedFiles] = useState([]);
    const [acceptedVideoFilesInStateFb, setAcceptedVideoFilesFb] = useState([]);
    const [acceptedVideoFilesInStateTwt, setAcceptedVideoFilesTwt] = useState([]);
    const [acceptedVideoFilesInStateLin, setAcceptedVideoFilesLin] = useState([]);
    const [videoThumbnailFb, setVideoThumbnailFb] = useState("");
    const [videoThumbnailTwt, setVideoThumbnailTwt] = useState("");
    const [videoThumbnaiLin, setVideoThumbnailLin] = useState("");
    const [socialConnection, setSocialConnection] = useState(connectedToSocialMedia)
    const [optionsStatus, setOptionsStatus] = useState(connectedToSocialMedia)
    const [anchorEl, setAnchorEl] = useState(null);
    const [dataFaceBook, setDataFaceBook] = useState({});
    const [dataTwitter, setDataTwitter] = useState({});
    const [dataLinkedIn, setDataLinkedIn] = useState({});
    const [dataPagesLinkedIn, setDataPagesLinkedIn] = useState([]);
    const [data, setData] = useState({
        "smId":0,
        "smName":"",
        "smpScheduleDateTime":"",
        "publishType":"",
        "originalPost":"",
        "smFacebookPost":"",
        "smLinkedinPost":"",
        "smTwitterPost":"",
        "smPostImage":"",
        "smPostVideoFacebook": "",
        "smPostVideoTwitter": "",
        "smPostVideoLinkedin": "",
        "facebookPostLink":"",
        "twitterPostLink":"",
        "linkedinPostLink":"",
        "memberId":user.memberId,
        "subMemberId":subUser.memberId,
    });
    const [captions, setCaptions] = useState({
        original: "",
        facebook: "",
        twitter: "",
        linkedin: ""
    });
    const [modalLIButton, setModalLIButton] = useState("");
    const [modalLinkedInPages, setModalLinkedInPages] = useState(false);
    const [isImageDropeZone, setIsImageDropeZone] = useState(true);
    const toggleLinkedInPages = () => setModalLinkedInPages(!modalLinkedInPages);
    const [selectedLIPages, setSelectedLIPages] = useState([]);
    const [dataOldImages, setDataOldImages] = useState("");
    const [dataOldVideoFb, setDataOldVideoFb] = useState("");
    const [dataOldVideoTwt, setDataOldVideoTwt] = useState("");
    const [dataOldVideoLin, setDataOldVideoLin] = useState("");
    const open = Boolean(anchorEl);
    const linkRegx = useMemo(()=>{ return /(http(s?):\/\/)([\w]{2,}\.)[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm },[]);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        setAnchorEl(null);
    };
    const handleSocialConnectionChange = (name) => {
        setSocialConnection((prev) => {
            return {
                ...prev,
                [name]: true
            }
        })
        setOptionsStatus((prev) => {
            return {
                ...prev,
                [name]: true
            }
        })
    }
    const handleCaptionsChange = (name, value) => {
        if (name === "original") {
            setData((prev) => {
                return {
                    ...prev,
                    "originalPost":value,
                    "smFacebookPost": optionsStatus.facebook?value:"",
                    "smLinkedinPost": optionsStatus.linkedin ? value.replaceAll(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') : "",
                    "smTwitterPost":optionsStatus.twitter?value:""
                }
            })
        }
        else {
            if (optionsStatus.facebook && name === "facebook") {
                setData((prev) => {
                    return {...prev, "smFacebookPost": value}
                })
            }
            if (optionsStatus.twitter && name === "twitter") {
                setData((prev) => {
                    return {...prev, "smTwitterPost":value}
                })
            }
            if (optionsStatus.linkedin && name === "linkedin") {
                setData((prev) => {
                    return {...prev, "smLinkedinPost":value.replaceAll(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')}
                })
            }
        }
    }
    const setCaptionsChange = useCallback((name,linkValue) => {
        if (name === "original") {
            if (optionsStatus.facebook) {
                setCaptions((prev) => {
                    return {...prev, facebook: linkValue}
                });
            }
            if (optionsStatus.twitter) {
                setCaptions((prev) => {
                    return {...prev, twitter: linkValue}
                });
            }
            if (optionsStatus.linkedin) {
                setCaptions((prev) => {
                    return {...prev, linkedin: linkValue}
                });
            }
        }
        else {
            setCaptions((prev) => {
                return {...prev, [name]: linkValue}
            })
        }
    },[optionsStatus]);
    const setFacebookCaptions = useCallback(() => {
        let link = document.getElementById("allText").value.match(linkRegx);
        let linkPreview = "";
        if(typeof link !== "undefined" && link !== null && link !== ""){
            getLinkPreview(link[0]).then(res => {
                if (res.status === 200) {
                    if(res.result){
                        let titleValue = document.getElementById("allText").value;
                        link.map((v)=>(
                            titleValue=titleValue.replace(v,`<a href="${v}" target="_blank">${v}</a>`)
                        ));
                        linkPreview = `<div id="sm-pv-facebook-body" class="sm-pv-facebook-body">${titleValue}</div><div class="sm-pv-media-facebook"><div class="sm-pv-link-wrap-facebook"><div class="sm-pv-link-image-facebook" style="background-image:url('${res.result.img}')"></div><div class="sm-pv-link-title-facebook">${res.result.title}</div><div class="sm-pv-link-body-facebook">${res.result.description}</div></div></div>`;
                        setCaptionsChange("facebook",linkPreview);
                        setData((prev) => {
                            return {...prev, "facebookPostLink": JSON.stringify(res.result)}
                        })
                    }
                }
            });
        }
    },[setCaptionsChange,linkRegx]);
    const setTwitterCaptions = useCallback(() => {
        let link = document.getElementById("allText").value.match(linkRegx);
        let linkPreview = "";
        if(typeof link !== "undefined" && link !== null && link !== ""){
            getLinkPreview(link[0]).then(res => {
                if (res.status === 200) {
                    if(res.result){
                        let titleValue = document.getElementById("allText").value;
                        link.map((v)=>(
                            titleValue=titleValue.replace(v,`<a href="${v}" target="_blank">${v}</a>`)
                        ));
                        linkPreview = `<div id="sm-pv-twitter-body" class="sm-pv-twitter-body">${titleValue}</div><div class="sm-pv-media-twitter"><div class="sm-pv-link-wrap-twitter"><div class="sm-pv-link-image-twitter" style="background-image:url('${res.result.img}')"></div><div class="sm-pv-link-body-twitter">${res.result.siteName}</div><div class="sm-pv-link-title-twitter">${res.result.title}</div><div class="sm-pv-link-body-twitter">${res.result.description}</div></div></div>`;
                        setCaptionsChange("twitter",linkPreview);
                        setData((prev) => {
                            return {...prev, "twitterPostLink": JSON.stringify(res.result)}
                        })
                    }
                }
            });
        }
    },[setCaptionsChange,linkRegx]);
    const setLinkedInCaptions = useCallback(() => {
        let link = document.getElementById("allText").value.match(linkRegx);
        let linkPreview = "";
        if(typeof link !== "undefined" && link !== null && link !== ""){
            getLinkPreview(link[0]).then(res => {
                if (res.status === 200) {
                    if(res.result){
                        let titleValue = document.getElementById("allText").value;
                        link.map((v)=>(
                            titleValue=titleValue.replace(v,`<a href="${v}" target="_blank">${v}</a>`)
                        ));
                        linkPreview = `<div id="sm-pv-linkedin-body" class="sm-pv-linkedin-body">${titleValue}</div><div class="sm-pv-media-linkedin"><div class="sm-pv-link-wrap-linkedin"><div class="sm-pv-link-image-linkedin" style="background-image:url('${res.result.img}')"></div><div class="sm-pv-link-title-linkedin">${res.result.title}</div></div></div>`;
                        setCaptionsChange("linkedin",linkPreview);
                        setData((prev) => {
                            return {...prev, "linkedinPostLink": JSON.stringify(res.result)}
                        })
                    }
                }
            });
        }
    },[setCaptionsChange,linkRegx]);
    useEffect(()=>{
        let link = data.smFacebookPost.match(linkRegx);
        if(typeof link !== "undefined" && link !== null && link !== ""){
            setTimeout(setFacebookCaptions,3000);
        } else {
            setCaptionsChange("facebook",data.smFacebookPost);
        }
    },[data.smFacebookPost,setFacebookCaptions,setCaptionsChange,linkRegx]);
    useEffect(()=>{
        let link = data.smTwitterPost.match(linkRegx);
        if(typeof link !== "undefined" && link !== null && link !== ""){
            setTimeout(setTwitterCaptions,3000);
        } else {
            setCaptionsChange("twitter",data.smTwitterPost);
        }
    },[data.smTwitterPost,setTwitterCaptions,setCaptionsChange,linkRegx]);
    useEffect(()=>{
        let link = data.smLinkedinPost.match(linkRegx);
        if(typeof link !== "undefined" && link !== null && link !== ""){
            setTimeout(setLinkedInCaptions,3000);
        } else {
            setCaptionsChange("linkedin",data.smLinkedinPost);
        }
    },[data.smLinkedinPost,setLinkedInCaptions,setCaptionsChange,linkRegx]);
    const handleClickFacebookLogin = (name) => {
        let x = window.innerWidth / 2 - 600 / 2;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open(facebookUrl+'/facebookLogin', "FacebookWindow", "width=600,height=700,left=" + x + ",top=" + y);
        window.fbSuccess = function (data) {
            facebookOauth(data).then(res => {
                if (res.status === 200) {
                    setDataFaceBook(res.result);
                    handleSocialConnectionChange(name);
                }
            });
        }
        window.fbError = function () {
            globalAlert({
                type: "Error",
                text: "Something went wrong!!!",
                open: true
            });
        }
    }
    const handleClickTwitterLogin = (name) => {
        let x = window.innerWidth / 2 - 600 / 2;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open(twitterUrl+'/twitterLogin', "TwitterWindow", "width=600,height=700,left=" + x + ",top=" + y);
        window.twSuccess = function (data) {
            twitterOauth(data).then(res => {
                if (res.status === 200) {
                    setDataTwitter(res.result);
                    handleSocialConnectionChange(name);
                }
            });
        }
        window.twError = function () {
            globalAlert({
                type: "Error",
                text: "Something went wrong!!!",
                open: true
            });
        }
    }
    const handleClickLinkedinLogin = (name) => {
        let x = window.innerWidth / 2 - 600 / 2;
        let y = window.innerHeight / 2 - 700 / 2;
        window.open(linkedinUrl+'/linkedinLogin', "LinkedinWindow", "width=600,height=700,left=" + x + ",top=" + y);
        window.liSuccess = function (data) {
            linkedInOauth(data).then(res => {
                if (res.status === 200) {
                    setDataLinkedIn(res.result);
                    handleSocialConnectionChange(name);
                }
            });
        }
        window.liError = function () {
            globalAlert({
                type: "Error",
                text: "Something went wrong!!!",
                open: true
            });
        }
    }
    const handleOptionStatusChange = (name) => {
        const currentStatus = optionsStatus[name]
        if(name === "facebook"){
            if(currentStatus){
            setData((prev) => {
                    return {...prev, "smFacebookPost":"","facebookPostLink":"", "smPostVideoFacebook": ""}
            });
        } else {
            setData((prev) => {
                return {...prev, "smFacebookPost":prev.originalPost}
            });
        }
        } else if (name === "twitter") {
            if(currentStatus) {
            setData((prev) => {
                    return {...prev, "smTwitterPost":"","twitterPostLink":"", "smPostVideoTwitter":""}
            });
        } else {
            setData((prev) => {
                return {...prev, "smTwitterPost":prev.originalPost}
            });
        }
        } else if (name === "linkedin") {
            if(currentStatus) {
            setData((prev) => {
                    return {...prev, "smLinkedinPost":"","linkedinPostLink":"", "smPostVideoLinkedin": ""}
            });
        } else {
            setData((prev) => {
                return {...prev, "smLinkedinPost":prev.originalPost}
            });
        }
    }
        setOptionsStatus((prev) => {
            return {
                ...prev,
                [name]: !currentStatus
            }
        })
        setCurrentSelectedOption(1);
    }
    const setAcceptedFilesInState = (file) => {
        setAcceptedFiles((prev) => {
            return [...prev, file]
        })
    }
    const setAcceptedVideoFilesInStateFb = (file=null) => {
        setAcceptedVideoFilesFb((prev) => {
            return file===null?[]:[file];
        })
    }
    // const setAcceptedVideoFilesInStateTwt = (file=null) => {
    //     setAcceptedVideoFilesTwt((prev) => {
    //         return file===null?[]:[file];
    //     })
    // }
    const setAcceptedVideoFilesInStateLin = (file=null) => {
        setAcceptedVideoFilesLin((prev) => {
            return file===null?[]:[file];
        })
    }
    const deleteAcceptedFileFromState = (index,fileName) => {
        removeImage(0,fileName).then(res => {
            if (res.status === 200) {
                const currentFiles = JSON.parse(JSON.stringify(acceptedFilesInState));
                currentFiles.splice(index, 1);
                setAcceptedFiles(currentFiles);
                let smPostImage = data.smPostImage.split(",").filter((v,i)=>{return i !== index}).join(",");
                setData((prev) => {return {...prev, "smPostImage": smPostImage}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const deleteAcceptedVideoFileFromStateFb = (index,fileName) => {
        removeImage(0,fileName).then(res => {
            if (res.status === 200) {
                setAcceptedVideoFilesFb([]);
                setData((prev) => {return {...prev, "smPostVideoFacebook": ""}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    // const deleteAcceptedVideoFileFromStateTwt = (index,fileName) => {
    //     removeImage(0,fileName).then(res => {
    //         if (res.status === 200) {
    //             setAcceptedVideoFilesTwt([]);
    //             setData((prev) => {return {...prev, "smPostVideoTwitter": ""}});
    //         } else {
    //             globalAlert({
    //                 type: "Error",
    //                 text: res.message,
    //                 open: true
    //             });
    //         }
    //     });
    // }
    const deleteAcceptedVideoFileFromStateLin = (index,fileName) => {
        removeImage(0,fileName).then(res => {
            if (res.status === 200) {
                setAcceptedVideoFilesLin([]);
                setData((prev) => {return {...prev, "smPostVideoLinkedin": ""}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const deleteOldFileFromState = (index,fileName) => {
        removeImage(id,fileName).then(res => {
            if (res.status === 200) {
                const currentFiles = dataOldImages.split(",");
                currentFiles.splice(index, 1);
                setDataOldImages(currentFiles.join(","));
                let smPostImage = data.smPostImage.split(",").filter((v,i)=>{return v !== fileName}).join(",");
                setData((prev) => {return {...prev, "smPostImage": smPostImage}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const deleteOldVideoFileFromStateFb = (index,fileName) => {
        removeImage(id,fileName).then(res => {
            if (res.status === 200) {
                const currentFiles = dataOldVideoFb.split(",");
                currentFiles.splice(index, 1);
                setDataOldVideoFb(currentFiles.join(","));
                let smPostVideo = data.smPostVideoFacebook.split(",").filter((v,i)=>{return v !== fileName}).join(",");
                setData((prev) => {return {...prev, "smPostVideoFacebook": smPostVideo}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    // const deleteOldVideoFileFromStateTwt = (index,fileName) => {
    //     removeImage(id,fileName).then(res => {
    //         if (res.status === 200) {
    //             const currentFiles = dataOldVideoTwt.split(",");
    //             currentFiles.splice(index, 1);
    //             setDataOldVideoTwt(currentFiles.join(","));
    //             let smPostVideo = data.smPostVideoTwitter.split(",").filter((v,i)=>{return v !== fileName}).join(",");
    //             setData((prev) => {return {...prev, "smPostVideoTwitter": smPostVideo}});
    //         } else {
    //             globalAlert({
    //                 type: "Error",
    //                 text: res.message,
    //                 open: true
    //             });
    //         }
    //     });
    // }
    const deleteOldVideoFileFromStateLin = (index,fileName) => {
        removeImage(id,fileName).then(res => {
            if (res.status === 200) {
                const currentFiles = dataOldVideoLin.split(",");
                currentFiles.splice(index, 1);
                setDataOldVideoLin(currentFiles.join(","));
                let smPostVideo = data.smPostVideoLinkedin.split(",").filter((v,i)=>{return v !== fileName}).join(",");
                setData((prev) => {return {...prev, "smPostVideoLinkedin": smPostVideo}});
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const renderPostOptionDetails = () => {
        switch (postOption) {
            case 1:
                return (
                    <div className="post-option-detail-container mt-1">
                        <p>Post will be published immediately.</p>
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                className="postNow"
                                onClick={() => handleClickPostNow()}
                            >
                                POST NOW
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3"
                                onClick={() => history.push("/managesocialmedia")}
                            >
                                CANCEL
                            </Button>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="post-option-detail-container mt-1">
                        <p>Select date and time in ( PST )</p>
                        <LocalizationProvider dateAdapter={AdapterDateFns} className="mt-5">
                            <DateTimePicker
                                value={new Date(data.smpScheduleDateTime)}
                                inputFormat="MM/dd/yyyy hh:mm a"
                                onChange={(value) => {
                                    setData((prev) => {return {...prev, "smpScheduleDateTime": dateTimeFormatDB(value)}});
                                }}
                                slotProps={{ textField: { variant: "standard" } }}
                                minDateTime={new Date()}
                            />
                        </LocalizationProvider>
                        <div className="mt-3">
                            <Button
                                color="primary"
                                variant="contained"
                                className="schedule"
                                onClick={() => handleClickSchedule()}
                            >
                                SCHEDULE
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3"
                                onClick={() => history.push("/managesocialmedia")}
                            >
                                CANCEL
                            </Button>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="post-option-detail-container mt-1">
                        <p>This Post can't be publish until you schedule a post or post now</p>
                        <div>
                            <Button
                                color="primary"
                                variant="contained"
                                className="saveAsDraft"
                                onClick={() => handleClickSaveAsDraft()}
                            >
                                SAVE AS DRAFT
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                className="ml-3"
                                onClick={() => history.push("/managesocialmedia")}
                            >
                                CANCEL
                            </Button>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const renderPostCaptionInput = () => {
        let name, value
        if (currentSelectedOption === 1) {
            name = "original"
            value = data.originalPost
        } else if (currentSelectedOption === 2) {
            name = "facebook"
            value = data.smFacebookPost
        } else if (currentSelectedOption === 3) {
            name = "twitter"
            value = data.smTwitterPost
        } else if (currentSelectedOption === 4) {
            name = "linkedin"
            value = data.smLinkedinPost
        }
        const handleEmojiClick = (n, e) => {
            handleCaptionsChange(name, value + n.emoji)
        }
        return (
            <div className="emojionearea">
                <div style={{ width: "95%" }}>
                    <CustomInput
                        id="allText"
                        value={value}
                        onChange={(event) => {handleCaptionsChange(name, event.target.value)}}
                    />
                </div>
                <div className="emojionearea-button">
                    {!openEmojiPicker && <i className="far fa-grin ml-1" onClick={() => setOpenEmojiPicker(true)}></i>}
                    {openEmojiPicker && <i className="fas fa-times ml-1" onClick={() => setOpenEmojiPicker(false)}></i>}
                </div>
                {openEmojiPicker &&
                    <div className="emojionearea-picker emojionearea-picker-position-bottom">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                }
            </div>
        )
    }

    const handleClickPostNow = () => {
        if(data.smName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter name of campaign.",
                open: true
            });
            return false;
        } else if(optionsStatus.facebook === false && optionsStatus.twitter === false && optionsStatus.linkedin === false){
            globalAlert({
                type: "Error",
                text: "Please select at least one social media profile.",
                open: true
            });
            return false;
        } else if(data.smFacebookPost === "" && data.smTwitterPost === "" && data.smLinkedinPost === ""){
            globalAlert({
                type: "Error",
                text: "Please enter content for post.",
                open: true
            });
            return false;
        }
        $("button.postNow").hide();
        $("button.postNow").after('<div class="lds-ellipsis"><div></div><div></div><div></div>');
        if (optionsStatus.linkedin) {
            linkedinPagesData().then(res => {
                if (res.status === 200) {
                    if(res.result && res.result.pageData){
                        setDataPagesLinkedIn(res.result.pageData);
                    }
                    setModalLIButton("Post Now");
                    toggleLinkedInPages();
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $(".lds-ellipsis").remove();
                $("button.postNow").show();
            });
        } else {
            callPostNow();
        }
    }
    const callPostNow = () => {
        let requestData = {
            ...data,
            "publishType":"postNow",
            "linkedinSendTo":selectedLIPages.join(":")
        }
        postNow(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: (dataOldVideoFb === "" && dataOldVideoTwt ==="" && dataOldVideoLin === "" && acceptedVideoFilesInStateFb.length === 0 && acceptedVideoFilesInStateTwt.length === 0 && acceptedVideoFilesInStateLin.length === 0) ? res.message : "Processing your video, posted after processing.",
                    open: true
                });
                history.push("/managesocialmedia");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.postNow").show();
        });
    }
    const handleClickSchedule = () => {
        if(data.smName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter name of campaign.",
                open: true
            });
            return false;
        } else if(optionsStatus.facebook === false && optionsStatus.twitter === false && optionsStatus.linkedin === false){
            globalAlert({
                type: "Error",
                text: "Please select at least one social media profile.",
                open: true
            });
            return false;
        } else if(data.smpScheduleDateTime === ""){
            globalAlert({
                type: "Error",
                text: "Please select date and time.",
                open: true
            });
            return false;
        }
        $("button.schedule").hide();
        $("button.schedule").after('<div class="lds-ellipsis"><div></div><div></div><div></div>');
        if (optionsStatus.linkedin) {
            linkedinPagesData().then(res => {
                if (res.status === 200) {
                    if(res.result && res.result.pageData){
                        setDataPagesLinkedIn(res.result.pageData);
                    }
                    setModalLIButton("Schedule");
                    toggleLinkedInPages();
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
                $(".lds-ellipsis").remove();
                $("button.schedule").show();
            });
        } else {
            callSaveSchedule();
        }
    }
    const callSaveSchedule = () => {
        let requestData = {
            ...data,
            "publishType":"schedule",
            "linkedinSendTo":selectedLIPages.join(":"),
            "timeZone": getClientTimeZone()
        }
        saveSchedule(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/managesocialmedia");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.schedule").show();
        });
    }
    const handleClickSaveAsDraft = () => {
        if(data.smName === ""){
            globalAlert({
                type: "Error",
                text: "Please enter name of campaign.",
                open: true
            });
            return false;
        } else if(optionsStatus.facebook === false && optionsStatus.twitter === false && optionsStatus.linkedin === false){
            globalAlert({
                type: "Error",
                text: "Please select at least one social media profile.",
                open: true
            });
            return false;
        }
        let requestData = {
            ...data,
            "publishType":"saveasdraft"
        }
        $("button.saveAsDraft").hide();
        $("button.saveAsDraft").after('<div class="lds-ellipsis mr-3 ml-0"><div></div><div></div><div></div>');
        saveAsDraft(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                history.push("/managesocialmedia");
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.saveAsDraft").show();
        });
    }
    const handleChangeLIPages = (pageId) => {
        if(selectedLIPages.includes(pageId)){
            setSelectedLIPages(selectedLIPages.filter(x => x !== pageId));
        } else {
            setSelectedLIPages([...selectedLIPages,pageId]);
        }
    }
    useEffect(()=>{
        getSocialMediaAuthentication().then(res => {
            if (res.status === 200) {
                if(res.result.facebook){
                    getFacebookUserData().then(res => {
                        if (res.status === 200) {
                            setDataFaceBook(res.result);
                            handleSocialConnectionChange("facebook");
                        }
                    });
                }
                if(res.result.twitter){
                    getTwitterUserData().then(res => {
                        if (res.status === 200) {
                            setDataTwitter(res.result);
                            handleSocialConnectionChange("twitter");
                        }
                    });
                }
                if(res.result.linkedin){
                    linkedinUserData().then(res => {
                        if (res.status === 200) {
                            setDataLinkedIn(res.result);
                            handleSocialConnectionChange("linkedin");
                        }
                    });
                }
            }
            if(id > 0){
                let requestData = `smId=${id}&timeZone=${getClientTimeZone()}`
                getSocialMediaCampaign(requestData).then(res => {
                    if (res.status === 200) {
                        if(res.result && res.result.socialMediaCampaign){
                            setData((prev) => {
                                return {
                                    ...prev,
                                    ...res.result.socialMediaCampaign,
                                    "originalPost": res.result.socialMediaCampaign.smFacebookPost !== "" ? res.result.socialMediaCampaign.smFacebookPost : res.result.socialMediaCampaign.smTwitterPost !== "" ? res.result.socialMediaCampaign.smTwitterPost : res.result.socialMediaCampaign.smLinkedinPost !== "" ? res.result.socialMediaCampaign.smLinkedinPost : ""
                                }
                            });
                            setDataOldImages(res.result.socialMediaCampaign.smPostImage);
                            setDataOldVideoFb(res.result.socialMediaCampaign.smPostVideoFacebook);
                            setDataOldVideoTwt(res.result.socialMediaCampaign.smPostVideoTwitter);
                            setDataOldVideoLin(res.result.socialMediaCampaign.smPostVideoLinkedin);
                            if(res.result.socialMediaCampaign.smPostVideoFacebook !== "") {
                                setIsImageDropeZone(false);
                                let videoUrl = `${siteURL}/easdrive/${user.memberId}/images/socialmedia/${res.result.socialMediaCampaign.smPostVideoFacebook}`;
                                axios({
                                    url: videoUrl,
                                    method: "GET",
                                    responseType: "blob"
                                }).then((response)=>{
                                    const file = new File([response.data], 'video.mp4', { type: 'video/mp4' });
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnailFb(URL.createObjectURL(th[0].blob))});
                                })
                            }
                            if(res.result.socialMediaCampaign.smPostVideoTwitter !== "") {
                                setIsImageDropeZone(false);
                                let videoUrl = `${siteURL}/easdrive/${user.memberId}/images/socialmedia/${res.result.socialMediaCampaign.smPostVideoTwitter}`;
                                axios({
                                    url: videoUrl,
                                    method: "GET",
                                    responseType: "blob"
                                }).then((response)=>{
                                    const file = new File([response.data], 'video.mp4', { type: 'video/mp4' });
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnailTwt(URL.createObjectURL(th[0].blob))});
                                })
                            }
                            if(res.result.socialMediaCampaign.smPostVideoLinkedin !== "") {
                                setIsImageDropeZone(false);
                                let videoUrl = `${siteURL}/easdrive/${user.memberId}/images/socialmedia/${res.result.socialMediaCampaign.smPostVideoLinkedin}`;
                                axios({
                                    url: videoUrl,
                                    method: "GET",
                                    responseType: "blob"
                                }).then((response)=>{
                                    const file = new File([response.data], 'video.mp4', { type: 'video/mp4' });
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnailLin(URL.createObjectURL(th[0].blob))});
                                })
                            }
                            if(res.result.socialMediaCampaign.smFacebookPost === ""){
                                setTimeout(function() {
                                    setOptionsStatus((prev) => {
                                        return {...prev, "facebook": false}
                                    })
                                },3000);
                            }
                            if(res.result.socialMediaCampaign.smTwitterPost === ""){
                                setTimeout(function() {
                                    setOptionsStatus((prev) => {
                                        return {...prev, "twitter": false}
                                    })
                                },3000);
                            }
                            if(res.result.socialMediaCampaign.smLinkedinPost === ""){
                                setTimeout(function() {
                                    setOptionsStatus((prev) => {
                                        return {...prev, "linkedin": false}
                                    })
                                },3000);
                            }
                        }
                    }
                });
            }
        });
    },[id, user.memberId]);
    return (
        <>
            <Row className="midleMain">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="overflow-hidden">
                            <Row className="d-flex">
                                <h3 className="ml-10" style={{ marginLeft: 40 }}>New Social Media Post</h3>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} align="center">
                            <div className="create-post-container" align="left">
                                <FormGroup className="campaignNameContainer">
                                    <InputField
                                        type="text"
                                        id="smName"
                                        name="smName"
                                        value={data.smName}
                                        onChange={(name, value) => {
                                            setData((prev) => {
                                                return {...prev, [name]: value}
                                            })
                                        }}
                                        label="Name of Campaign"
                                    />
                                </FormGroup>
                                <div className="row">
                                    <div className="col-sm-12 mt-3">
                                        <ul className="sm-Profiles">
                                            {socialConnection.facebook &&
                                                <li className="wrapper" onClick={() => handleOptionStatusChange("facebook")}>
                                                    <div className="sm-profile-img">
                                                        <div className="sm-post-accountImage-facebook">
                                                            <div className="sm-post-accountImage-wrap">
                                                                <img src={dataFaceBook.img} alt="facebook" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {optionsStatus.facebook && <span className="sm-profile-check"><i className="fas fa-check-circle"></i></span>}
                                                    <span className="sm-profile-icon facebook"><i className="fab fa-facebook-f"></i></span>
                                                </li>
                                            }
                                            {socialConnection.twitter &&
                                                <li className="wrapper" onClick={() => handleOptionStatusChange("twitter")}>
                                                    <div className="sm-profile-img">
                                                        <div className="sm-post-accountImage-twitter">
                                                            <div data-char="" className="sm-post-accountImage-wrap">
                                                                <img src={dataTwitter.img} alt="twitter" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {optionsStatus.twitter && <span className="sm-profile-check"><i className="fas fa-check-circle"></i></span>}
                                                    <span className="sm-profile-icon twitter"><i className="eas eas-twitter-x"></i></span>
                                                </li>
                                            }
                                            {socialConnection.linkedin &&
                                                <li className="wrapper" onClick={() => handleOptionStatusChange("linkedin")}>
                                                    <div className="sm-profile-img">
                                                        <div className="sm-post-accountImage-linkedin">
                                                            <div data-char="" className="sm-post-accountImage-wrap">
                                                                <img src={dataLinkedIn.img} alt="linkedin" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {optionsStatus.linkedin && <span className="sm-profile-check"><i className="fas fa-check-circle"></i></span>}
                                                    <span className="sm-profile-icon linkedin"><i className="fab fa-linkedin-in"></i></span>
                                                </li>
                                            }
                                            {!socialConnection.facebook || !socialConnection.twitter || !socialConnection.linkedin ? <li>
                                                <InputAdornment className="mb-5" position="start">
                                                    <Button
                                                        id="basic-button"
                                                        aria-controls="basic-menu"
                                                        aria-haspopup="true"
                                                        color="primary"
                                                        variant="contained"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}
                                                        className="mt-5 py-3"
                                                    >
                                                        <i className="fas fa-plus-circle"></i>
                                                    </Button>
                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}
                                                    >
                                                        {!socialConnection.facebook &&
                                                            <MenuItem onClick={() => {
                                                                handleClickFacebookLogin("facebook")
                                                                handleClose()
                                                            }}><i className="fab fa-facebook mr-2"></i>Connect Facebook
                                                            </MenuItem>
                                                        }
                                                        {!socialConnection.twitter &&
                                                            <MenuItem onClick={() => {
                                                                handleClickTwitterLogin("twitter")
                                                                handleClose()
                                                            }}><i className="eas eas-twitter-x mr-2"></i>Connect Twitter
                                                            </MenuItem>
                                                        }
                                                        {!socialConnection.linkedin &&
                                                            <MenuItem onClick={() => {
                                                                handleClickLinkedinLogin("linkedin")
                                                                handleClose()
                                                            }}><i className="fab fa-linkedin mr-2"></i> Connect Linkedin
                                                            </MenuItem>
                                                        }
                                                    </Menu>
                                                </InputAdornment>
                                            </li> : null}
                                        </ul>
                                    </div>
                                </div>
                                <div className="post-option-container mt-3">
                                    <div className={`${currentSelectedOption === 1 ? "option-item-active" : "option-item"} `} onClick={() => setCurrentSelectedOption(1)}><p className="mx-2 my-2">Original</p></div>
                                    {optionsStatus.facebook && <div className={`${currentSelectedOption === 2 ? "option-item-active" : "option-item"} `} onClick={() => setCurrentSelectedOption(2)}><i className="fab fa-facebook mx-3 my-2"></i></div>}
                                    {optionsStatus.twitter && <div className={`${currentSelectedOption === 3 ? "option-item-active" : "option-item"} `} onClick={() => setCurrentSelectedOption(3)}><i className="eas eas-twitter-x mx-3 my-2"></i></div>}
                                    {optionsStatus.linkedin && <div className={`${currentSelectedOption === 4 ? "option-item-active" : "option-item"} `} onClick={() => setCurrentSelectedOption(4)}><i className="fab fa-linkedin mx-3 my-2"></i></div>}
                                </div>
                                {renderPostCaptionInput()}
                                <Button variant="contained" onClick={()=>{setIsImageDropeZone(true)}} className={`mt-3 mr-3 py-2 ${isImageDropeZone?"active":""}`} disabled={dataOldVideoFb !== "" || dataOldVideoTwt !=="" || dataOldVideoLin !== "" || acceptedVideoFilesInStateFb.length !== 0 || acceptedVideoFilesInStateTwt.length !== 0 || acceptedVideoFilesInStateLin.length !== 0}>
                                    <i className="far fa-image font-size-20" data-toggle="tooltip" title="Add Images"></i>
                                </Button>
                                <Button variant="contained" onClick={()=>{setIsImageDropeZone(false)}} className={`mt-3 py-2 ${!isImageDropeZone?"active":""}`} disabled={dataOldImages !== "" || acceptedFilesInState.length !== 0}>
                                    <i className="far fa-video font-size-20" data-toggle="tooltip" title="Add Video"></i>
                                </Button>
                                {
                                    isImageDropeZone ?
                                        <ImageDropZone acceptedFilesInState={acceptedFilesInState} setAcceptedFilesInState={(file) => setAcceptedFilesInState(file)} deleteAcceptedFileFromState={(index,fileName) => deleteAcceptedFileFromState(index,fileName)} smPostImage={data.smPostImage} setData={setData} dataOldImages={dataOldImages} deleteOldFileFromState={deleteOldFileFromState} setLoader={setLoader}/>
                                    :
                                        <Row>
                                            {
                                                optionsStatus.facebook === true ?
                                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <VideoDropZoneFacebook acceptedVideoFilesInStateFb={acceptedVideoFilesInStateFb} setAcceptedVideoFilesInStateFb={(file) => setAcceptedVideoFilesInStateFb(file)} deleteAcceptedVideoFileFromStateFb={(index,fileName) => deleteAcceptedVideoFileFromStateFb(index,fileName)} smPostVideo={data.smPostVideoFacebook} setData={setData} dataOldVideoFb={dataOldVideoFb} deleteOldVideoFileFromStateFb={deleteOldVideoFileFromStateFb} videoThumbnailFb={videoThumbnailFb} setVideoThumbnailFb={setVideoThumbnailFb} setLoader={setLoader}/>
                                                    </Col>
                                                :null
                                            }
                                            {/* {
                                                optionsStatus.twitter === true ?
                                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <VideoDropZoneTwitter acceptedVideoFilesInStateTwt={acceptedVideoFilesInStateTwt} setAcceptedVideoFilesInStateTwt={(file) => setAcceptedVideoFilesInStateTwt(file)} deleteAcceptedVideoFileFromStateTwt={(index,fileName) => deleteAcceptedVideoFileFromStateTwt(index,fileName)} smPostVideo={data.smPostVideoTwitter} setData={setData} dataOldVideoTwt={dataOldVideoTwt} deleteOldVideoFileFromStateTwt={deleteOldVideoFileFromStateTwt} videoThumbnailTwt={videoThumbnailTwt} setVideoThumbnailTwt={setVideoThumbnailTwt} setLoader={setLoader}/>
                                                    </Col>
                                                :null
                                            } */}
                                            {
                                                optionsStatus.linkedin === true ?
                                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                                    <VideoDropZoneLinkedin acceptedVideoFilesInStateLin={acceptedVideoFilesInStateLin} setAcceptedVideoFilesInStateLin={(file) => setAcceptedVideoFilesInStateLin(file)} deleteAcceptedVideoFileFromStateLin={(index,fileName) => deleteAcceptedVideoFileFromStateLin(index,fileName)} smPostVideo={data.smPostVideoLinkedin} setData={setData} dataOldVideoLin={dataOldVideoLin} deleteOldVideoFileFromStateLin={deleteOldVideoFileFromStateLin} videoThumbnailLin={videoThumbnaiLin} setVideoThumbnailLin={setVideoThumbnailLin} setLoader={setLoader}/>
                                                    </Col>
                                                :null
                                            }
                                        </Row>
                                }
                                {
                                    data.status === "Published" ?
                                        <Button color="primary" variant="contained" className="mt-3" onClick={() => history.push("/managesocialmedia")}>CANCEL</Button>
                                    :
                                        <>
                                            <div className="post-option-container mt-4">
                                                <div className={`${postOption === 1 ? "option-item-active" : "option-item"} `} onClick={() => setPostOption(1)}><p className="mx-2 my-2">Post Now</p></div>
                                                <div className={`${postOption === 2 ? "option-item-active" : "option-item"} `} onClick={() => setPostOption(2)}><p className="mx-2 my-2">Schedule</p></div>
                                                <div className={`${postOption === 3 ? "option-item-active" : "option-item"} `} onClick={() => setPostOption(3)}><p className="mx-2 my-2">Save As Draft</p></div>
                                            </div>
                                            {renderPostOptionDetails()}
                                        </>
                                }
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} align="center">
                            <div className="preview-container" align="left">
                                <div className="toggle-container">
                                    <div className={`${viewSelected === 1 ? "toggle-container-item-active" : "toggle-container-item"} `} onClick={() => setViewSelected(1)}>
                                        <p className="my-2 toggle-container-item-text">Desktop Preview</p>
                                    </div>
                                    <div className={`${viewSelected === 2 ? "toggle-container-item-active" : "toggle-container-item"} `} onClick={() => setViewSelected(2)}>
                                        <p className="my-2 toggle-container-item-text">Mobile Preview</p>
                                    </div>
                                </div>
                                {!optionsStatus.facebook && !optionsStatus.twitter && !optionsStatus.linkedin ? <div className="mt-5">
                                    <p>Select at least one social media profile and start typing to see preview</p>
                                </div> : null}
                                <div className="mt-5">
                                    <PostPreview
                                        captions={captions}
                                        data={data}
                                        dataFaceBook={dataFaceBook}
                                        dataLinkedIn={dataLinkedIn}
                                        dataTwitter={dataTwitter}
                                        optionsStatus={optionsStatus}
                                        user={user}
                                        videoThumbnaiLin={videoThumbnaiLin}
                                        videoThumbnailFb={videoThumbnailFb}
                                        videoThumbnailTwt={videoThumbnailTwt}
                                        viewSelected={viewSelected}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ModalLinkedinPages
                dataPagesLinkedIn={dataPagesLinkedIn}
                modalLIButton={modalLIButton}
                modalLinkedInPages={modalLinkedInPages}
                selectedLIPages={selectedLIPages}
                callPostNow={callPostNow}
                callSaveSchedule={callSaveSchedule}
                globalAlert={globalAlert}
                handleChangeLIPages={handleChangeLIPages}
                toggleLinkedInPages={toggleLinkedInPages}
            />
        </>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateNewPost);