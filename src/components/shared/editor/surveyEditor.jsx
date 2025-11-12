import React, {createRef, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Row, Col} from "reactstrap";
import {loadeverytime} from "./js/eas_js_survey";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import $ from "jquery";
import ThankYouPage from "./commonComponents/thankYouPage";
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';
import {CategoryMenu, ControlMenu, DraggableSettingsMenu, EditCategoryStyleModal, ZoomModal} from "./commonComponentsForEditor";
import {setLoader} from "../../../actions/loaderActions";
import { v4 as uuidv4 } from 'uuid';

const SurveyEditor = ({data,globalAlert,categoryPageList,setLoader}) => {
    let tabRef = useRef([createRef(), createRef(), createRef(), createRef(), createRef()]);
    const [showPopper, setShowPopper] = useState(false);
    const [arrowRef, setArrowRef] = useState(null);

    const handleClickAway = () => {
        setShowPopper(false);
    };

    useEffect(() => {
        require('./css/eas_js.css');
        require('./css/styles.min.css');
        require('./js/eas_js_survey.js');
        require('../fileManager/js/filemanager.js');
        require('../fileManager/css/filemanager.css');
        loadeverytime();
        $(".modulebutton").click(function(e){
            e.stopImmediatePropagation();
            $(".modulebutton").removeClass("active");
            $(this).addClass("active");
            $(".esmdatamain").hide();
            $("."+$(this).attr("data-href")).show();
        });
    });
    useEffect(() => {
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
                    <Row>
                        <Col md={12}>
                            <DraggableSettingsMenu/>
                            <CategoryMenu/>
                            <ControlMenu type="surveyEditor" tabRef={tabRef} showPopper={showPopper} arrowRef={arrowRef} setArrowRef={setArrowRef} handleClickAway={handleClickAway}/>
                            <div id="editordiv" className="min-height-div">
                                <div id="main" style={{backgroundColor: "#d6ddec"}}>
                                    {
                                        typeof data.stHtml === "undefined" || data.stHtml === "" ?
                                            <div id="preview-template">
                                                <div className="mcd np" style={{padding: "20px 0px"}} item-value="0">
                                                    <center id="cntr" style={{backgroundColor:"#ffffff"}} item-value="0">
                                                        <div id="pageheader">
                                                            <div className="headerEmptyMessage">
                                                                Drop Content Header Blocks Here
                                                            </div>
                                                        </div>
                                                        <div id="templateBody1" className="templateBody d-flex" item-value="0" item-transition="fade" question-style={data?.stSurveyType === "traditional" ? "all" : "horizontal"} page-category={categoryPageList[0]?.catName} page-category-id={categoryPageList[0]?.id} page-category-color={categoryPageList[0]?.color} page-unique-id={uuidv4()}>
                                                            <div className="questionBlock w-100">
                                                                <div className="containerEmptyMessage text-center">
                                                                    Drop Content Body Blocks Here
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ThankYouPage />
                                                        <div id="pagefooter">
                                                            <div className="footerEmptyMessage">
                                                                Drop Content Footer Blocks Here
                                                            </div>
                                                        </div>
                                                        <input type="hidden" id="stgHid" />
                                                    </center>
                                                </div>
                                            </div>
                                        :
                                            <div id="preview-template" dangerouslySetInnerHTML={{ __html: data.stHtml }}/>
                                    }
                                </div>
                            </div>
                            <div className="editor-pane-col col-sm-12 col-md-2 padding-all-0" id="droppable-menu-2"></div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <ZoomModal />
            <EditCategoryStyleModal />
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
            {showPopper && <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center" style={{backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(1px)", zIndex: "999"}} onClick={handleClickAway}></div>}
        </>
    );
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
export default connect(null, mapDispatchToProps)(SurveyEditor);