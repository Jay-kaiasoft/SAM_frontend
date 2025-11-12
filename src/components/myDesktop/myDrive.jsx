import React, {useCallback, useEffect, useState} from 'react';
import {filemanager} from "../shared/fileManager/js/filemanager";
import AddScript from "../shared/commonControlls/addScript";
import {siteURL} from "../../config/api";
import $ from 'jquery';
import {ZoomModal} from "../shared/editor/commonComponentsForEditor";
import {editImage} from "../../services/myDesktopService";
import {connect} from "react-redux";
import {setLoader} from "../../actions/loaderActions";
import { setGlobalAlertAction } from './../../actions/globalAlertActions';
import ModalImageAi from '../shared/editor/commonComponents/modalImageAi.jsx';

let path = "";
let filename = "";
let imagePath = "";
let pixie5;
function launchPixieEditor() {
    const script = document.createElement('script');
    script.src = siteURL+'/externaljs/pixie/pixie.umd.js';
    script.async = false;
    document.body.appendChild(script);
    $('body').find("#pixie-editor-container").remove();
    $('body').append('<div id="pixie-editor-container"></div>');
    const ui = {
            mode: 'overlay',
        visible: false,
        menubar: {
            items: [
                {
                    type: 'button',
                    icon: [
                        {
                            tag: 'path',
                            attr: {
                                d: 'm11.99 18.54-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z',
                            },
                        },
                    ],
                    align: 'right',
                    position: 0,
                    action: editor => {
                        console.log("onClose Btn");
                        // editor.togglePanel('objects');
                    },
                },
                {
                    type: 'button',
                    icon: [
                        {
                            tag: 'path',
                            attr: {
                                d: 'M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z',
                            },
                        },
                    ],
                    align: 'left',
                    buttonVariant: 'outline',
                    menuItems: [
                        {
                            action: editor => {
                                editor.tools.import.uploadAndReplaceMainImage();
                            },
                            label: 'Background Image',
                        },
                        {
                            action: editor => {
                                editor.tools.import.uploadAndAddImage();
                            },
                            label: 'Overlay Image',
                        },
                        {
                            action: editor => {
                                editor.tools.import.uploadAndOpenStateFile();
                            },
                            label: 'Editor Project File',
                        },
                    ],
                },
            ],
        },
            toolbar: {
                hide: false,
                hideOpenButton: false,
                hideSaveButton: false,
                hideCloseButton: false,
            }
    };
    const config = {
        selector: "#pixie-editor-container",
        baseUrl: siteURL+'/externaljs/pixie/assets',
        ui: {...ui, visible: true},
        onLoad: function() {},
        onSave: function(data, name) {
            let requestData = {
                "imageName": filename,
                "imageData": data,
                "imagePath": imagePath
            }
            editImage(requestData).then(res=>{
                $('.treeview ul li:first-of-type').trigger("click");
                pixie5.close();
            })
        },
        onClose: function() {
            delete window.Pixie;
            document.body.removeChild(script);
        }
    };
    pixie5 = null;
    let interval = setInterval(() => {
        if(typeof window.Pixie !== "undefined"){
            clearInterval(interval);
            interval = null;
            $("#clickLoader").val(false);
            $("#clickLoader").trigger("click");
        }
        pixie5 = new window.Pixie({...config});
        pixie5.setConfig({image: path})
    }, 1000);
}
function clickSelectItemCallMyDrive(){
    $(".pixie-edit").unbind("click").click(function() {
        path = $(this).attr('item-url');
        filename = $(this).attr('item-file-name');
        filename = `${filename.replaceAll("."+filename.split(".").pop(),"")}_copy.${filename.split(".").pop()}`;
        imagePath = path.split("/images/").pop().replace(path.split("/").pop(),"");
        $("#clickLoader").val(true);
        $("#clickLoader").trigger("click");
        launchPixieEditor();
    })
}
window.clickSelectItemCallMyDrive=clickSelectItemCallMyDrive;
const MyDrive = ({globalAlert, setLoader}) => {
    AddScript(siteURL+'/externaljs/dropzone.js');
    AddScript(siteURL+'/externaljs/jquery.leanModal.min.js');
    AddScript(siteURL+'/externaljs/bootstrap-treeview.js');
    const [modalImageAi, setModalImageAi] = useState(false);
    const toggleImageAi = useCallback(() => setModalImageAi(!modalImageAi),[modalImageAi]);
    useEffect(() => {
        $("#clickLoader").val(true);
        $("#clickLoader").trigger("click");
        setTimeout(function () {
            require('../shared/fileManager/js/filemanager.js');
            require('../shared/editor/css/eas_js.css');
            require('../shared/editor/css/styles.min.css');
            require('../shared/fileManager/css/filemanager.css');
            filemanager("preview_McBlock_mydrive","mydrive","mydrive","mydrive","");
            $(".wizard-top-container").remove();
            $(".fm-pagination").remove();
            $(".filemanager-container").removeClass("topsliderpane-container");
            $("#list-container").removeClass("lastUnit");
        }, 6000);
    },[]);
    return (
        <>
            <div className="myDriveMain position-relative"></div>
            <input type="hidden" id="clickError" data-type="" value="" onClick={()=>{
                globalAlert({
                    type: (typeof $("#clickError").attr("data-type") !== "undefined" || $("#clickError").attr("data-type") !== "") ? $("#clickError").attr("data-type") : "Error",
                    text: $("#clickError").val(),
                    open: true
                });
            }}/>
            <input type="hidden" id="clickLoader" value="" onClick={()=>{
                setLoader({
                    load: ($("#clickLoader").val() === "true"),
                    text: "Please wait !!!"
                });
            }}/>
            <ZoomModal />
            <ModalImageAi modalImageAi={modalImageAi} toggleImageAi={toggleImageAi} />
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
export default connect(null, mapDispatchToProps)(MyDrive);