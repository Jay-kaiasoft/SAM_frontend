import React, {createRef, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Row, Col} from "reactstrap";
import {loadeverytime, reloadfirst, savefullcontent} from "./js/eas_js";
import IncludeTemplate from "../templatesComponent/includeTemplate";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import $ from "jquery";
import {siteURL} from "../../../config/api";
import {AddSignatureModal, ContentPageControls, DraggableSettingsMenu, PageEditorButtons, SettingMenuItems, SocialMediaMenuItem, SpamCheckerModal, ZoomModal} from "./commonComponentsForEditor";
import {getShopifyAuthentication, shopifyOauth} from "../../../services/shopifyService";
import {setLoader} from "../../../actions/loaderActions";
import { handleClickHelp, PopoverTooltip } from '../../../assets/commonFunctions';
const Editor = ({data,handleBack,globalAlert,toggleMyPageSetting,handleClickSave,handleClickPublish,handleClickSendPreviewEmail,user,setLoader,closeMyPageEditor, handleClickExportToImage, handleClickExportToPDF, handleClickExportToHTML, subUser}) => {
    const [shopify, setShopify] = useState(false);
    const [modalSpamChecker, setModalSpamChecker] = useState(false);
    const toggleSpamChecker = () => setModalSpamChecker(!modalSpamChecker);
    let tabRef = useRef([createRef(), createRef(), createRef(), createRef(), createRef(), createRef()]);
    const [showPopper, setShowPopper] = useState(false);
    const [arrowRef, setArrowRef] = useState(null);

    const handleClickSpamChecker = () => {
        toggleSpamChecker();
    }
    const handleClickAway = () => {
        setShowPopper(false);
    };
    const callReloadFirst = () => {
        reloadfirst(data.mpType, data.groupId, user.memberId);
    }

    useEffect(() => {
        require('./css/eas_js.css');
        require('./css/styles.min.css');
        require('./js/eas_js.js');
        require('../fileManager/js/filemanager.js');
        require('../fileManager/css/filemanager.css');
        getShopifyAuthentication().then(res => {
            if (res.status === 200) {
                if (res.result.shopify) {
                    setShopify(true);
                }
            }
        });
        loadeverytime();
        $(".modulebutton").click(function(e){
            e.stopImmediatePropagation();
            $(".modulebutton").removeClass("active");
            $(this).addClass("active");
            $(".esmdatamain").hide();
            $("."+$(this).attr("data-href")).show();
        });
        $("#shopifysubitemtext").unbind("click").click(function(){
            $(".editormenuitem").removeClass("active");
            let x = window.innerWidth / 2 - 600 / 2;
            let y = window.innerHeight / 2 - 700 / 2;
            window.open(siteURL + '/shopifyoauthredirect', "ShopifyWindow", "width=600,height=700,left=" + x + ",top=" + y);
            window.shpSuccess = function (data) {
                shopifyOauth(data).then(res => {
                    if (res.status === 200) {
                        setShopify(true);
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    });
    useEffect(() => {
        $(".midleMain").animate({ scrollTop: 0}, 500);
        setShowPopper(true);
        return () => {
            for (var name in window.CKEDITOR.instances) {
                if (window.CKEDITOR.instances.hasOwnProperty(name)) {
                    window.CKEDITOR.instances[name].destroy(true);
                }
            }
        };
    }, []);

    return (
        <>
            <Row className="editor-main-block">
                <Col md={12}>
                    <PageEditorButtons
                        toggleMyPageSetting={toggleMyPageSetting}
                        handleBack={handleBack}
                        handleClickPublish={handleClickPublish}
                        handleClickSave={handleClickSave}
                        handleClickSendPreviewEmail={handleClickSendPreviewEmail}
                        data={data}
                        handleClickSpamChecker={handleClickSpamChecker}
                        closeMyPageEditor={closeMyPageEditor}
                        handleClickExportToImage={handleClickExportToImage}
                        handleClickExportToPDF={handleClickExportToPDF}
                        handleClickExportToHTML={handleClickExportToHTML}
                    />
                    <Row>
                        <Col md={12}>
                            <DraggableSettingsMenu/>
                            {data?.mpType !== 3 && <div className="editor-pane-col col-sm-12 col-md-2 padding-all-0" id="droppable-menu-3">
                                <div className="ui-widget-content" id="draggable-menu" onClick={handleClickAway}>
                                    <div id="editormenutop">
                                        <i className="fas fa-ellipsis-h"></i>
                                    </div>
                                    <div id="editormenu">
                                        <SettingMenuItems type="pageEditor" tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={0}/>
                                        <div className="editormenuitem">
                                            <div className="em pageproperties" data-toggle="tooltip" title="CONTENT BLOCKS" ref={tabRef.current[1]}><i className="fas fa-code"></i></div>
                                            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={1} showText={"CONTENT BLOCKS"}/>
                                            <div className="emjoin"></div>
                                            <div className="editorsubmenu esmhtml">
                                                <div className="esmtitle">CONTENT BLOCKS</div>
                                                <ContentPageControls type="pageEditor"/>
                                            </div>
                                        </div>
                                        <div className="editormenuitem">
                                            <div className="em ecommerce" data-toggle="tooltip" title="eCOMMERCE" ref={tabRef.current[2]}><i className="fas fa-cart-arrow-down"></i></div>
                                            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={2} showText={"eCOMMERCE"}/>
                                            <div className="emjoin"></div>
                                            <div className="editorsubmenu esmecom">
                                                <div className="esmtitle">eCOMMERCE</div>
                                                <div className="esmdata">
                                                    <div className="subitem">
                                                        {
                                                            shopify ?
                                                                <div className="subitemtext"><img src={siteURL + "/img/shopify-circle.png"} alt="Shopify"/><span>Shopify</span><i className="far fa-angle-right"></i></div>
                                                            :
                                                                <div id="shopifysubitemtext" className="subitemtext1"><img src={siteURL + "/img/shopify-circle.png"} alt="Shopify"/><span>Shopify</span><i className="far fa-angle-right"></i></div>
                                                        }
                                                        <div className="esmjoin"></div>
                                                        <div className="subsubitem">
                                                            <div className="subsubitemcon">
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-one-image-title-price-desc.png"}
                                                                    data-title="soitpd"/>
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-two-image-title-price-desc.png"}
                                                                    data-title="stitpd"/>
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-one-image-title-price.png"}
                                                                    data-title="soitp"/>
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-two-image-title-price.png"}
                                                                    data-title="stitp"/>
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-one-image-title.png"}
                                                                    data-title="soit"/>
                                                                <img className="ecommerceimg" alt="Shopify"
                                                                    src={siteURL + "/img/shopify-two-image-title.png"}
                                                                    data-title="stit"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="editormenuitem">
                                            <div className="em filemanager" data-toggle="tooltip" title="MY DRIVE" ref={tabRef.current[3]}><i className="fas fa-cloud-download-alt"></i></div>
                                            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={3} showText={"MY DRIVE"}/>
                                        </div>
                                        <div className="editormenuitem">
                                            <div className="em surveys" data-toggle="tooltip" title="QUICK LINKS" ref={tabRef.current[4]}><i className="fas fa-link"></i></div>
                                            <PopoverTooltip tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={4} showText={"QUICK LINKS"}/>
                                            <div className="emjoin"></div>
                                            <div className="editorsubmenu esmsaf">
                                                <div className="esmtitle">QUICK LINKS</div>
                                                <div className="esmdata">
                                                    <div className="subitem" id="srvylist">
                                                        Surveys<i
                                                        className="far fa-window-maximize qlinksmaximizeicon"></i>
                                                    </div>
                                                    <div className="subitem" id="asmtlist">
                                                        Assessments<i
                                                        className="far fa-window-maximize qlinksmaximizeicon"></i>
                                                    </div>
                                                    <div className="subitem" id="cflist">
                                                        Custom Forms<i
                                                        className="far fa-window-maximize qlinksmaximizeicon"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <SocialMediaMenuItem tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} i={5}/>
                                    </div>
                                    <div id="editormenubottom">
                                        <i className="far fa-question-circle" onClick={() => {
                                            handleClickHelp("Functionality/Functionality/Toolbar/AccessDesignToolsFromTheToolbarInEmailsAndSurveys.html")
                                        }}></i>
                                    </div>
                                </div>
                            </div>}
                            <div id="editordiv" className="min-height-div">
                                <div id="main" style={{backgroundColor: "#d6ddec"}}>
                                    {
                                        typeof data.allTempData === "undefined" || data.allTempData === "" ?
                                            <div id="preview-template">
                                                {
                                                    data.tname !== "" ?
                                                        <IncludeTemplate tname={data.tname}/>
                                                    : null
                                                }
                                            </div>
                                        :
                                            <div id="preview-template" dangerouslySetInnerHTML={{ __html: data.allTempData }}/>
                                    }
                                </div>
                            </div>
                            <div className="editor-pane-col col-sm-12 col-md-2 padding-all-0" id="droppable-menu-2"></div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ZoomModal />
            <input type="hidden" id="clickError" data-type="" value="" onClick={()=>{
                globalAlert({
                    type: (typeof $("#clickError").attr("data-type") !== "undefined" || $("#clickError").attr("data-type") !== "") ? $("#clickError").attr("data-type") : "Error",
                    text: $("#clickError").val(),
                    open: true
                });
            }}/>
            <input type="hidden" id="downloadImageError" onClick={()=>{
                globalAlert({
                    type: "Error",
                    text: "Sorry your file is not imported please try again",
                    open: true

                });
            }}/>
            <input type="hidden" id="clickLoader" value="" onClick={()=>{
                setLoader({
                    load: ($("#clickLoader").val() === "true"),
                    text: "Please wait !!!"
                });
            }}/>
            <SpamCheckerModal modalSpamChecker={modalSpamChecker} toggleSpamChecker={toggleSpamChecker} globalAlert={globalAlert} user={user} groupId={data.groupId} savefullcontent={savefullcontent}/>
            {(showPopper && data?.mpType !== 3) && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(1px)", zIndex: "999"}} onClick={handleClickAway}></div>}
            <AddSignatureModal globalAlert={globalAlert} subUser={subUser} callReloadFirst={callReloadFirst} />
        </>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(Editor);