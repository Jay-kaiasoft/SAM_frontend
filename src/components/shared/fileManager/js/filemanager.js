import $ from 'jquery';
import {dropboxUrl, googleDriveUrl, onedriveUrl, proxyBaseURL, siteURL} from "../../../../config/api";
import {aiTransactions, authenticateDB, authenticateGD, authenticateOD, copyFoldersAndFilesED, createFolderED, cutFoldersAndFilesED, deleteFoldersAndFilesED, getFoldersDB, getFoldersED, getFoldersGD, getFoldersOD, getImagesDB, getImagesED, getImagesGD, getImagesOD, getSearchImagesDB, getSearchImagesGD, importImageFromAiUrl, importImageFromUrlED, oauthDB, oauthGD, oauthOD} from "../../../../services/myDesktopService";
import {dateTimeFormat, handleClickHelp, imageUrlToPngBlob, toBase64} from "../../../../assets/commonFunctions";
import "datatables/media/js/jquery.dataTables";
import "datatables/media/css/jquery.dataTables.css";
import 'jquery-ui/ui/widgets/draggable.js';
import OpenAI from "openai/index.mjs";

let SITEURL=siteURL;
let currentfolder = "";
let searchstring = "";
let blo_id = "";
let target_id="";
let contentblockid="";
let dropZoneObj = "";
let fileType = "";
let droparray1 = {
    "DeleteFolderDialog": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading"><i class="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;Are you sure?</span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button" tabindex="0"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">x</span></span></div><div style="width: auto; height: auto;" data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><p>Warning!!!<br/>This Delete action will delete all References of selected Folder(s) and it\u2019s Image(s).</p><div class="above-below15 below0 buttonsContainer"><a href="javascript:void(0);" class="button p0 confirmfolder">Delete</a><a href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">Cancel</a></div></div></div>',
    "MoveFolderDialog": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading"><i class="fas fa-exclamation-triangle"></i>&nbsp;&nbsp;Are you sure?</span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button" tabindex="0"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">x</span></span></div><div style="width: auto; height: auto;" data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><p>Warning!!!<br/>This Move action will delete all References of selected Folder(s) and it\u2019s Image(s).</p><div class="above-below15 below0 buttonsContainer"><a href="javascript:void(0);" class="button p0 confirmmovefolder">Move</a><a href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">Cancel</a></div></div></div>',
    "templates/editorContainer/drop/upload/content": '<div id="UploadManager_{{id}}" class="file-upload bg-white fileUploader" style="display: none;"><div class="header-bar selfclear pad-lv2 small-meta fwb"><span data-dojo-attach-point="status">            Uploading         </span><a href="javascript:void(0);" data-dojo-attach-point="min" style="display: none;"><span data-dojo-attach-point="minToggle" class="freddicon menu-down float-right"></span></a><a style="" href="javascript:void(0);" data-dojo-attach-point="close"><span class="freddicon cross-fill float-right"></span></a></div><ul class="upload-list" data-dojo-attach-point="uploadList"></ul></div>',
    "templates/editorContainer/drop/upload/listcontent": '<li id="FileListItem_1" class="dz-preview dz-file-preview selfclear pad-lv2 border-bottom"><div class="group size2of3 dz-details"><div data-dojo-attach-point="thumbnail" class="thumbnail bg-gray border-gray float-left mar-lv2 mar-tb0 mar-l0 icon"><img data-dz-thumbnail /></div><p class="nomargin dz-filename" data-dojo-attach-point="fileName"><span data-dz-name id="filenamer"></span></p></div><div class="lastGroup size1of3 alignr"><div class="group size2of3"><div style="" data-dojo-attach-point="progressMeter" class="meter mar-r0 dz-progress"><span class="rounded12 dz-upload" data-dz-uploadprogress="" data-dojo-attach-point="progress" style=""></span></div></div></div></li>',
    "ImportDialog": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div data-dojo-attach-point="titleBar" class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading" level="1">    Import URL    </span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">    x    </span></span></div><div data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><div id="ImportUrlDialog_2"><div class="dijitDialogPaneContentArea"><div class="field-wrapper"><label for="import">          Import a file from a URL:          </label><input class="av-text mar-b0" data-dojo-attach-point="importInput" id="import" type="text"></div><div class="dijitDialogPaneActionBar"><a class="button p0" data-dojo-attach-point="importButton">          Import          </a><a class="small-meta fwb" href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">          Cancel          </a></div></div></div></div></div>',
    "CreateNewFolder": '<a id="a{{Dialog.id}}" rel="leanModal" href="#{{Dialog.id}}" style="display: none;"></a><div id="{{Dialog.id}}" style="display: none;" class="dijitDialogShow dijitDialog dijitDialogFocused dijitFocused" role="dialog"><div data-dojo-attach-point="titleBar" class="dijitDialogTitleBar"><span data-dojo-attach-point="titleNode" class="dijitDialogTitle" role="heading" level="1">    Create New Folder    </span><span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" title="Cancel" role="button"><span data-dojo-attach-point="closeText" class="closeText" title="Cancel">    x    </span></span></div><div data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"><div id="ImportUrlDialog_2"><div class="dijitDialogPaneContentArea"><div class="field-wrapper"><label for="create">          New folder name:          </label><input class="av-text mar-b0" data-dojo-attach-point="createInput" id="create" type="text"></div><div class="dijitDialogPaneActionBar"><a class="button p0" data-dojo-attach-point="createButton">          Create          </a><a class="small-meta fwb" href="javascript:void(0);" data-dojo-attach-point="closeButtonNode">          Cancel          </a></div></div></div></div></div>',
}
window.handleClickHelp=handleClickHelp;
let filemanagerarr = {
    "mainfilemanagerarrcontent": '<div id="FileManager_{{dlInd}}_{{tarInd}}" class="topsliderpane-container filemanager-container" style="display: none; opacity: 1; z-index: 9999;"><div class="wizard-top-container"><div class="relative zin-lv3 float-right" style="padding-right: 15px;"><a href="javascript:void(0);" data-dojo-attach-point="closeLink" class="inline-i"><i class="fas fa-times"></i></a></div><div class="wizard-title"><div class="builder-bar get-started" style="display: inline-block;"><span data-dojo-attach-point="title">My Drive</span><span data-dojo-attach-point="emailTitle" class="emailTitle"></span></div></div></div><div style="opacity: 1;overflow:auto;" data-dojo-attach-point="content" class="content"><div class="line main-section" data-dojo-attach-point="filesSection"><div data-dojo-attach-point="listControls"><div data-dojo-attach-point="dropTarget" class="dropzone file-drop-target absolute bg-white full-height full-width"><div class="dead-center alignc absolute"><div><img class="mar-lv2" src="' + SITEURL + 'images/files/file-manager-add.svg" height="90"></div><p>You can also drop files on this window to upload</p></div></div></div><!--  files list --><div class="file-manager lastUnit size1of1" data-dojo-attach-point="listContainer" id="list-container"><div><div class="grid-slat-module grid-active"><div class="margin-b-20"><div class="drivebox" id="easdrive"><img src="' + SITEURL + '/img/mydrive-icon.png" /><span>SAM Drive</span></div><div class="drivebox" id="googledrive"><img src="' + SITEURL + '/img/googledrive-icon.png" /><span>Google Drive</span></div><div class="drivebox" id="dropbox"><img src="' + SITEURL + '/img/dropbox-icon.png" /><span>Dropbox</span></div><div class="drivebox" id="onedrive"><img src="' + SITEURL + '/img/onedrive-icon.png" /><span>One Drive</span></div><div class="drivebox" id="imagewithai"><img src="' + SITEURL + '/img/ai-icon.png" /><span>Image With AI</span></div></div><div id="foldermain"><h6 class="d-inline-block mb-0 mt-2 align-middle">Folder</h6><div class="pull-right icon-wrapper"><a class="btn-circle" data-dojo-attach-point="createnewfolder" data-toggle="tooltip" title="Add"><i class="far fa-plus-square"></i><div class="bg-green"></div></a><a class="btn-circle" data-toggle="tooltip" title="Help" onclick="handleClickHelp(\'Functionality/mydrive/mydrive.html\')"><i class="far fa-question-circle"></i><div class="bg-grey"></div></a></div><div id="folderview"></div></div><div id="imageview"><div class="pull-left icon-wrapper"><a class="btn-circle" data-dojo-attach-point="listButton" data-toggle="tooltip" title="List"><i class="far fa-list"></i><div class="bg-black"></div></a><a class="btn-circle" data-dojo-attach-point="gridButton" data-toggle="tooltip" title="Grid"><i class="far fa-th-large"></i><div class="bg-black"></div></a><a class="btn-circle" data-dojo-attach-point="uploadButton" data-toggle="tooltip" title="Upload"><i class="far fa-upload"></i><div class="bg-black"></div></a><a class="btn-circle" data-dojo-attach-point="importfromurl" data-toggle="tooltip" title="Import from URL"><i class="far fa-file-upload"></i><div class="bg-black"></div></a><a class="btn-circle" data-dojo-attach-point="selectall" data-toggle="tooltip" title="Select All"><i class="far fa-check-square"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle cmd" data-dojo-attach-point="copyButton" data-toggle="tooltip" title="Copy"><i class="far fa-copy"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle cmd" data-dojo-attach-point="moveButton" data-toggle="tooltip" title="Cut"><i class="far fa-cut"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle cmd" data-dojo-attach-point="deleteButton" data-toggle="tooltip" title="Delete"><i class="far fa-trash-alt"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle" data-dojo-attach-point="pasteButton" data-toggle="tooltip" title="Paste"><i class="far fa-paste"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle" data-dojo-attach-point="moveHereButton" data-toggle="tooltip" title="Paste"><i class="far fa-paste"></i><div class="bg-black"></div></a><a style="display: none;" class="btn-circle" data-dojo-attach-point="cancelButton" data-toggle="tooltip" title="Cancel"><i class="far fa-ban"></i><div class="bg-black"></div></a></div><div class="pull-right table-btn" style="width: 230px; position: relative;"><input id="searchImage" name="searchImage" type="text" class="form-control" placeholder="Search" value=""><button type="button" class="btn btn-default search-but" data-dojo-attach-point="searchButton" style="margin-right: 0"><i class="fal fa-search"></i></button></div><ul class="files-list selfclear" data-dojo-attach-point="fileList" data-dojo-type="mojo/analytics/List" id="files-list" data-dojo-props="\'lazy\': true, url:\'/file/list\', sort: \'created_at\', asc: false"></ul></div><div id="imagedetail"><h6>Details</h6><div id="imginfo"></div></div><div><div class="line section" id="campaign-no-result"><div class="lastUnit size1of1 nopadding mar-lv2 mar-r0 mar-l0"><div class="no-data alignc noborder"><img class="icon" src="' + SITEURL + 'images/files/file-manager-add.svg" role="presentation"><p>Drop files from your computer here or</p><a href="javascript:void(0);" class="button" data-dojo-attach-point="uploadFromFileBrowse">Browse</a><a href="javascript:void(0);" class="button" data-dojo-attach-point="importfromurl">Import from URL</a></div></div></div></div></div></div><div data-dojo-attach-point="paginationControls" class="fm-pagination bg-white absolute border-top pad-lv2 pad-lr0"></div></div></div></div></div>'
}

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

let filefoldermanagerlistcheck = 0;
let filefoldermanagerdellist = [];
export function filemanager(block_id, target_id, contentblockid, type="", ft="image") {
    fileType=ft;
    $(".filemanager-container").remove();
    let fullhtml1 = filemanagerarr["mainfilemanagerarrcontent"];
    fullhtml1 = replaccon("{{dlInd}}", contentblockid, fullhtml1);
    fullhtml1 = replaccon("{{tarInd}}", target_id, fullhtml1);
    if(type === "mydrive"){
        $(".myDriveMain").append(fullhtml1);
        $("#clickLoader").val(false);
        $("#clickLoader").trigger("click");
    } else {
        $("body").append(fullhtml1);
    }
    if($("#searchImage").val() === ""){
        searchstring = "";
    }
    let FileManager_ = $("#FileManager_" + contentblockid + "_" + target_id);
    FileManager_.find('a[data-dojo-attach-point="closeLink"]').unbind("click").click(function () {
        FileManager_.remove();
        $('#UploadManager_' + contentblockid + "_" + target_id).remove();
    });
    FileManager_.find('.icon-wrapper a[data-dojo-attach-point="uploadButton"]').unbind("click").click(function () {
        $('.file-drop-target').trigger("click");
    });
    FileManager_.find('.icon-wrapper a[data-dojo-attach-point="importfromurl"],.no-data a[data-dojo-attach-point="importfromurl"]').unbind("click").click(function () {
        blo_id = contentblockid + "_" + target_id;
        $("#" + blo_id + ",#a" + blo_id).remove();
        let dilogstring = droparray1["ImportDialog"];
        dilogstring = replaccon("{{Dialog.id}}", blo_id, dilogstring);
        $("body").append(dilogstring);
        $("#a" + blo_id).leanModal({ top: 100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
        closeleanModal();
        setTimeout(function () {
            $("#a" + blo_id)[0].click();
        }, 500);
        $("#" + blo_id + " div div a.button").unbind("click").click(function () {
            let filepath = $('#' + blo_id + ' div div input[data-dojo-attach-point="importInput"]').val();
            if (filepath.match(/^(ht|f)tps?:\/\/[a-z0-9-.]+\.[a-z]{2,4}\/?([^\s<>#%",{}\\|\\^[\]`]+)?$/) !== null && filepath.match(/\.(jpeg|jpg|gif|png|pdf)$/) !== null) {
                currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
                let requestData = {
                    "destination": currentfolder,
                    "imageUrl": filepath
                }
                importImageFromUrlED(requestData).then(res => {
                    if (res.status !== 200) {
                        $("#clickError").attr("data-type","Error");
                        $("#clickError").val("Sorry your file is not imported please try again");
                        $("#clickError").trigger("click");
                    }
                    filemanagerlist(block_id, target_id, contentblockid);
                    $("#a" + blo_id + ",#" + blo_id + ",#" + blo_id + "_overlay,#lean_overlay").remove();
                });
            } else {
                $("#clickError").attr("data-type","Error");
                $("#clickError").val("Enter proper url or You will not be able to upload this file in this format.");
                $("#clickError").trigger("click");
            }
        });

    });
    FileManager_.find('.icon-wrapper a[data-dojo-attach-point="createnewfolder"]').unbind("click").click(function () {
        blo_id = contentblockid + "_" + target_id;
        $("#" + blo_id + ",#a" + blo_id).remove();
        let dilogstring = droparray1["CreateNewFolder"];
        dilogstring = replaccon("{{Dialog.id}}", blo_id, dilogstring);
        $("body").append(dilogstring);
        $("#a" + blo_id).leanModal({ top: 100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
        closeleanModal();
        setTimeout(function () {
            $("#a" + blo_id)[0].click();
        }, 500);
        $("#" + blo_id + " div div a.button").unbind("click").click(function () {
            let newfoldername = $('#' + blo_id + ' div div input[data-dojo-attach-point="createInput"]').val();
            if (newfoldername.match(/^[0-9a-zA-Z\-_]+$/) !== null) {
                currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
                let requestData = {
                    "destination": currentfolder,
                    "newFolderName": newfoldername
                }
                createFolderED(requestData).then(res => {
                    if (res.status === 200) {
                        if (res.message === "1") {
                            createtreeview(block_id, target_id, contentblockid).then(()=>(sn2(block_id, target_id, contentblockid, newfoldername)));
                        }
                        if (res.message === "2") {
                            $("#clickError").attr("data-type","Error");
                            $("#clickError").val(newfoldername + " is already exist");
                            $("#clickError").trigger("click");
                        }
                    }
                });
            } else {
                $("#clickError").attr("data-type","Error");
                $("#clickError").val("Enter proper folder name.");
                $("#clickError").trigger("click");
            }
        });

    });
    FileManager_.find('#campaign-no-result a[data-dojo-attach-point="uploadFromFileBrowse"]').unbind("click").click(function () {
        $('.file-drop-target').trigger("click");
    });
    fullhtml1 = droparray1["templates/editorContainer/drop/upload/content"];
    fullhtml1 = replaccon("{{id}}", contentblockid + "_" + target_id, fullhtml1);
    $("body").append(fullhtml1);
    $('#UploadManager_' + contentblockid + '_' + target_id + ' .header-bar [data-dojo-attach-point="close"]').unbind("click").click(function () {
        $('#UploadManager_' + contentblockid + "_" + target_id).hide();
    });
    let cd=$(".drivebox.active").attr("id");
    currentfolder = (typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" || cd!=="easdrive") ? "root" : $('.treeview ul li.node-selected').attr("path-value");
    setDropZone(block_id, target_id, contentblockid);
    FileManager_.find('[data-dojo-attach-point="content"]').on('dragenter', function (event) {
        event.stopPropagation();
        event.preventDefault();
        FileManager_.find('.file-drop-target').addClass("over");
    }).on('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        FileManager_.find('.file-drop-target').addClass("over");
    });
    FileManager_.find('[data-dojo-attach-point="dropTarget"] .dz-default.dz-message').hide();
    FileManager_.show();
    if(type === "mydrive"){
        $("#files-list").css("height", (parseInt($(".filemanager-container").height()) - 355) + "px");
    } else {
        $("#files-list").css("height", (parseInt($(".filemanager-container").height()) - 260) + "px");
    }
    $("#easdrive").addClass("active");
    filemanagerlist(block_id, target_id, contentblockid);
    $("#easdrive").unbind("click").click(function () {
        filemanagerlist(block_id, target_id, contentblockid);
    });
    $("#googledrive").unbind("click").click(function () {
        authenticateGD().then(res => {
            if (res.status === 200 && res.result.authenticate === true) {
                $.when(getImageGD(),getFolderGD()).done(function(images,folders) {
                    getResponse(images,JSON.parse(folders),block_id);
                });
            } else if (res.result.authenticate === false){
                let x = window.innerWidth / 2 - 600 / 2;
                let y = window.innerHeight / 2 - 400 / 2;
                window.open(googleDriveUrl+'/googleSignIn', "GoogleDriveWindow", "width=600,height=400,left=" + x + ",top=" + y);
                window.gdSuccess = function (data) {
                    let requestData = data+"&fileType="+fileType;
                    oauthGD(requestData).then(res => {
                        if (res.status === 200) {
                            getResponse(res.result.getImages,JSON.parse(res.result.getFolders),block_id);
                        }
                    });
                }
                window.gdError = function () {
                    $("#clickError").attr("data-type","Error");
                    $("#clickError").val("Something went wrong...Please try again later...");
                    $("#clickError").trigger("click");
                }
            }
        });
    });
    $("#dropbox").unbind("click").click(function () {
        authenticateDB().then(res => {
            if (res.status === 200 && res.result.authenticate === true) {
                $.when(getImageDB(),getFolderDB()).done(function(images,folders) {
                    getResponseDB(images,folders,block_id);
                });
            } else if (res.result.authenticate === false){
                let x = window.innerWidth / 2 - 600 / 2;
                let y = window.innerHeight / 2 - 400 / 2;
                window.open(dropboxUrl+'/dropboxSignIn', "DropBoxWindow", "width=600,height=400,left=" + x + ",top=" + y);
                window.dbSuccess = function (data) {
                    let requestData = data+"&fileType="+fileType;
                    oauthDB(requestData).then(res => {
                        if (res.status === 200) {
                            getResponseDB(res.result.imageList,res.result.folderList,block_id);
                        }
                    });
                }
                window.dbError = function () {
                    $("#clickError").attr("data-type","Error");
                    $("#clickError").val("Something went wrong...Please try again later...");
                    $("#clickError").trigger("click");
                }
            }
        });
    });
    $("#onedrive").unbind("click").click(function () {
        authenticateOD().then(res => {
            if (res.status === 200 && res.result.authenticate === true) {
                $.when(getImageOD(),getFolderOD()).done(function(images,folders)
                {
                    getResponseOD(images,folders,block_id);
                });
            } else if (res.result.authenticate === false){
                let x = window.innerWidth / 2 - 600 / 2;
                let y = window.innerHeight / 2 - 400 / 2;
                window.open(onedriveUrl+'/onedriveSignIn', "OneDriveWindow", "width=600,height=400,left=" + x + ",top=" + y);
                window.odSuccess = function (data) {
                    let requestData = data+"&fileType="+fileType;
                    oauthOD(requestData).then(res => {
                        if (res.status === 200) {
                            getResponseOD(res.result.imageList,res.result.folderList,block_id);
                        }
                    });
                }
                window.odError = function () {
                    $("#clickError").attr("data-type","Error");
                    $("#clickError").val("Something went wrong...Please try again later...");
                    $("#clickError").trigger("click");
                }
            }
        });
    });
    $("#imagewithai").unbind("click").click(function () {
        let prompt  = "";
        $("#clickImageAiModal").trigger("click");
        setTimeout(()=>{
            $("#modalimageai").draggable();
            $("#aigeneratedimage").attr("src","");
            $("#aifilename").val("");
            $("#aigeneratedimagemain").removeClass("d-flex").addClass("d-none");
            $("#writetoaskimage").val("");
            $('#write_openaistg_image').unbind('click').click(async function(){
                $("#clickLoader").val(true);
                $("#clickLoader").trigger("click");
                try {
                    prompt += "\n " + $("#writetoaskimage").val();
                    prompt = prompt.trim("\n").trim();
                    let sendPrompt = prompt;
                    if($(".style-icon.active").siblings("p").text() !== "None"){
                        sendPrompt += " in "+$(".style-icon.active").siblings("p").text()+" effect";
                    }
                    let result = "";
                    let tranType = 0;
                    if(typeof $("#aioriginalimage").attr("src") === "undefined"){
                        result = await openai.images.generate({
                            model: "dall-e-3",
                            prompt: sendPrompt,
                            n: 1,
                            size: "1024x1024",
                        });
                        tranType = 1;
                    } else {
                        // let url = "http://localhost:3000/img/1678773931969maxresdefault.jpg";
                        let url = $("#aioriginalimage").attr("src");
                        await imageUrlToPngBlob(url).then(async (pngBlob) => {
                            let mask = await imageUrlToPngBlob(url, "yes");
                            result = await openai.images.edit({
                                model: "dall-e-2",
                                image: pngBlob,
                                mask: mask,
                                prompt: sendPrompt,
                                n: 1,
                                size: "1024x1024",
                            });
                            tranType = 2;
                        });
                    }
                    if(typeof result?.error?.message !== "undefined"){
                        $("#clickError").attr("data-type","Error");
                        $("#clickError").val(result.error.message);
                        $("#clickError").trigger("click");
                    } else {
                        $("#aifilename").val($("#writetoaskimage").val().substring(0,255).replaceAll(/[^a-zA-Z0-9.-]+/g,"_"));
                        $("#aigeneratedimage").attr("src",result.data[0].url);
                        $("#aigeneratedimagemain").removeClass("d-none").addClass("d-flex");
                        aiTransactions(tranType).then(res => {
                            if (res.status === 200) {
                            } else {
                                $("#clickError").attr("data-type","Error");
                                $("#clickError").val("Something went wrong...Please try again later...");
                                $("#clickError").trigger("click");
                            }
                        });      
                    }
                    $("#clickLoader").val(false);
                    $("#clickLoader").trigger("click");
                } catch (e) {
                    console.log("e",e);
                    $("#clickError").attr("data-type","Error");
                    $("#clickError").val("Something went wrong...Please try again later...");
                    $("#clickError").trigger("click");
                    $("#clickLoader").val(false);
                    $("#clickLoader").trigger("click");
                }
            });
            $('.style-icon').unbind('click').click(function(){
                $('.style-icon').removeClass("active");
                $(this).addClass("active");
            });
            $('#useit_openaistg_image').unbind('click').click(function(){
                let requestData = {
                    "imageUrl": $("#aigeneratedimage").attr("src"),
                    "fileName": $("#aifilename").val() !== "" ? $("#aifilename").val().substring(0,255).replaceAll(/[^a-zA-Z0-9.-]+/g,"_")+".png" : $("#writetoaskimage").val().substring(0,255).replaceAll(/[^a-zA-Z0-9.-]+/g,"_")+".png"
                };
                importImageFromAiUrl(requestData).then(res => {
                    if (res.status === 200) {
                        let imageUrl = res.result.imageUrl;
                        (async () => {
                            await filemanagerlist(block_id, target_id, contentblockid);
                            setTimeout(()=>{
                                $('#files-list li div.thumb-image img[item-path="'+imageUrl+'"]').trigger("click");
                                $("#clickImageAiModal").trigger("click");
                            },3000);
                        })();
                    } else {
                        $("#clickError").attr("data-type","Error");
                        $("#clickError").val("Something went wrong...Please try again later...");
                        $("#clickError").trigger("click");
                    }
                }) 
            });
            $('#write_new_image').unbind('click').click(function(){
                if($("#writetoaskimage").val() !== "" || $("#aigeneratedimage").attr("src") !== ""){
                    $('#clickOaConfirmModal').trigger('click');
                    setTimeout(()=>{
                        $("#oaconfirm-text").html('Your image will be cleared and it can not be undone.\nAre you sure you want to continue?');
                        $("#yes_oaconfirm").unbind("click").click(function(){
                            $("#aigeneratedimage").attr("src","");
                            $("#aifilename").val("");
                            $("#aigeneratedimagemain").removeClass("d-flex").addClass("d-none");
                            $("#writetoaskimage").val("");
                            prompt = "";
                        });
                    },100);
                }
            });
        },1000);
    });
}
async function filemanagerlist(block_id, target_id, contentblockid) {
    $('.icon-wrapper a[data-dojo-attach-point="uploadButton"],.icon-wrapper a[data-dojo-attach-point="importfromurl"],.icon-wrapper a[data-dojo-attach-point="selectall"],.icon-wrapper a[data-dojo-attach-point="createnewfolder"],.icon-wrapper a[class="btn-help"]').show();
    let cd=$(".drivebox.active").attr("id");
    $(".drivebox").removeClass("active");
    $("#easdrive").addClass("active");
    currentfolder = (typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" || cd!=="easdrive") ? "root" : $('.treeview ul li.node-selected').attr("path-value");
    if (currentfolder === "root" || cd!=="easdrive") {
        createtreeview(block_id, target_id, contentblockid).then(()=>{sn1(block_id, target_id, contentblockid)});
    }
    setTimeout(function () {
        $(".editormenuitem").removeClass("active");
        $("#imginfo").html("");
        setfolderclick(block_id, target_id, contentblockid);
        $('#folderview .mainitem div.dijitCheckBox input[type="checkbox"]').unbind("click").click(function () {
            if ($(this).is(':checked')) {
                filefoldermanagerlistcheck++;
                filefoldermanagerdellist.push($(this).val());
                $(this).closest("div").addClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                $('.icon-wrapper .cmd').show();
            } else {
                filefoldermanagerlistcheck--;
                filefoldermanagerdellist.splice(filefoldermanagerdellist.indexOf($(this).val()), 1);
                $(this).closest("div").removeClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                if (filefoldermanagerlistcheck === 0 || filefoldermanagerlistcheck < 0) {
                    $('.icon-wrapper .cmd').hide();
                }
            }
        });
        $('.table-btn button[data-dojo-attach-point="searchButton"]').unbind("click").click(function () {
            if($("#searchImage").val() !== ""){
                searchstring = $("#searchImage").val();
                let sd = $(".drivebox.active").attr("id");
                currentfolder = (typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" || cd!=="easdrive") ? "root" : $('.treeview ul li.node-selected').attr("path-value");
                $('#files-list').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your images...");
                if (sd === "easdrive") {
                    filemanagerlist(block_id, target_id, contentblockid);
                } else if (sd === "googledrive") {
                    if(currentfolder.match("&PF=") !== null){
                        let t = currentfolder.replaceAll("?","").split("&");
                        currentfolder = t[0].replace("F=","");
                    }
                    getSearchImagesGD(currentfolder,searchstring,fileType).then(res => {
                        if (res.status === 200) {
                            let imageValue = res.result.getImages;
                            if (imageValue.length === 0) {
                                setNoFilesMsg();
                            } else {
                                setLiGD(imageValue);
                            }
                            setClickSelectItemCall(block_id, target_id, contentblockid);
                        } else {
                            return [];
                        }
                    })
                } else if (sd === "dropbox") {
                    getSearchImagesDB(currentfolder.replace("?F=",""),searchstring,fileType).then(res => {
                        if (res.status === 200) {
                            let imageValue = typeof res.result.imageList === "undefined" ? [] : res.result.imageList;
                            if (imageValue.length === 0) {
                                setNoFilesMsg();
                            } else {
                                setLiDB(imageValue);
                            }
                            setClickSelectItemCall(block_id, target_id, contentblockid);
                        } else {
                            return [];
                        }
                    })
                } else if (sd === "onedrive") {
                    let requestData = `${currentfolder}&fileType=${fileType}&searchStr=${searchstring}`;
                    getImagesOD(requestData).then(res => {
                        if (res.status === 200) {
                            let imageValue = typeof res.result.imageList === "undefined" ? [] : res.result.imageList;
                            if (imageValue.length === 0) {
                                setNoFilesMsg();
                            } else {
                                setLiOD(imageValue);
                            }
                            setClickSelectItemCall(block_id, target_id, contentblockid);
                        } else {
                            return [];
                        }
                    })
                }
            }
        });
        $('.icon-wrapper a[data-dojo-attach-point="gridButton"]').unbind("click").click(function () {
            let sd = $(".drivebox.active").attr("id");
            currentfolder = (typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" || cd!=="easdrive") ? "root" : $('.treeview ul li.node-selected').attr("path-value");
            $('#files-list').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your images...");
            if (sd === "easdrive") {
                filemanagerlist(block_id, target_id, contentblockid);
            } else if (sd === "googledrive") {
                let requestData = `${currentfolder.replace("?","")}?fileType=`+fileType;
                getImagesGD(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.getImages;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            setLiGD(imageValue);
                        }
                        setClickSelectItemCall(block_id, target_id, contentblockid);
                    } else {
                        return [];
                    }
                })
            } else if (sd === "dropbox") {
                let requestData = `${currentfolder}&fileType=`+fileType;
                getImagesDB(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.imageList;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            setLiDB(imageValue);
                        }
                        setClickSelectItemCall(block_id, target_id, contentblockid);
                    } else {
                        return [];
                    }
                })
            } else if (sd === "onedrive") {
                let requestData = `${currentfolder}&fileType=${fileType}&searchStr=`;
                getImagesOD(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.imageList;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            setLiOD(imageValue);
                        }
                        setClickSelectItemCall(block_id, target_id, contentblockid);
                    } else {
                        return [];
                    }
                })
            }
        });
        $('.icon-wrapper a[data-dojo-attach-point="listButton"]').unbind("click").click(function () {
            let sd = $(".drivebox.active").attr("id");
            currentfolder = (typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" || cd!=="easdrive") ? "root" : $('.treeview ul li.node-selected').attr("path-value");
            $('#files-list').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your images...");
            let ivFirst='<table id="tablelist" class="table table-hover table-striped table-section-r"><thead><tr role="row"><th class="no-sort"></th><th>Name</th><th>File Type</th><th>Modified Date</th><th>Size</thst></tr></thead><tbody>';
            let ivLast='</tbody></table>';
            if (sd === "easdrive") {
                getImagesED(requestData).then(res => {
                    if (res.status === 200) {
                        if (res.result.fileList.length > 0) {
                            let iv = '';
                            let cf = currentfolder === "root" ? "" : currentfolder + "/";
                            res.result.fileList.map((value)=> (
                                value.fileType === "image" ?
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.url+'\',\''+value.fileName+'\',\''+value.fileName.split(".").pop().toLowerCase()+'\',\''+format_size(value.imageSize)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td><div class="dijit dijitReset dijitInline dijitCheckBox selectCheckBox grid-select av-checkbox" role="presentation" style="margin-right:10px;"><input value="' + cf + value.fileName + '" tabindex="0" role="checkbox" class="dijitReset dijitCheckBoxInput" type="checkbox"></div><i class="far fa-search-plus" onclick="imagezoom(\''+value.url+'\')"></i></td><td><span class="table-overflow"><i class="far fa-image"></i>'+value.fileName+'</span></td><td>'+value.fileName.split(".").pop().toLowerCase()+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.imageSize)+'</td></tr>'
                                :
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.url+'\',\''+value.fileName+'\',\''+value.fileName.split(".").pop().toLowerCase()+'\',\''+format_size(value.imageSize)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td><div class="dijit dijitReset dijitInline dijitCheckBox selectCheckBox grid-select av-checkbox" role="presentation"><input value="' + cf + value.fileName + '" tabindex="0" role="checkbox" class="dijitReset dijitCheckBoxInput" type="checkbox"></div></td><td><span class="table-overflow"><i class="far fa-file-pdf"></i>'+value.fileName+'</span></td><td>'+value.fileName.split(".").pop().toLowerCase()+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.imageSize)+'</td></tr>'

                            ));
                            $('.filemanager-container #files-list').html(ivFirst+iv+ivLast);
                            setdatatable();
                            $('#files-list td div.dijitCheckBox input[type="checkbox"]').unbind("click").click(function () {
                                if ($(this).is(':checked')) {
                                    filefoldermanagerlistcheck++;
                                    filefoldermanagerdellist.push($(this).val());
                                    $(this).closest("div").addClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                                    $('.icon-wrapper .cmd').show();
                                } else {
                                    filefoldermanagerlistcheck--;
                                    filefoldermanagerdellist.splice(filefoldermanagerdellist.indexOf($(this).val()), 1);
                                    $(this).closest("div").removeClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                                    if (filefoldermanagerlistcheck === 0 || filefoldermanagerlistcheck < 0) {
                                        $('.icon-wrapper .cmd').hide();
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else if (sd === "googledrive") {
                let requestData = `${currentfolder.replace("?","")}?fileType=`+fileType;
                getImagesGD(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.getImages;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            let iv='';
                            imageValue.map((value)=> (
                                value.fileType === "image" ?
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnailLink+'\',\''+value.name+'\',\''+value.name.split(".").pop().toLowerCase()+'\',\''+format_size(value.size)+'\',\''+value.imageMediaMetadata.width+' x '+value.imageMediaMetadata.height+'\')"><td><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnailLink+'\')"></i></td><td><i class="far fa-image"></i> '+value.name+'</td><td>'+value.name.split(".").pop().toLowerCase()+'</td><td>'+dateTimeFormat(value.modifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                                :
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnailLink+'\',\''+value.name+'\',\''+value.name.split(".").pop().toLowerCase()+'\',\''+format_size(value.size)+'\',\'\')"><td></td><td><i class="far fa-file-pdf"></i> '+value.name+'</td><td>'+value.name.split(".").pop().toLowerCase()+'</td><td>'+dateTimeFormat(value.modifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                            ));
                            $('.filemanager-container #files-list').html(ivFirst+iv+ivLast);
                            setdatatable();
                        }
                    } else {
                        return [];
                    }
                })
            }
            else if (sd === "dropbox") {
                let requestData = `${currentfolder}&fileType=`+fileType;
                getImagesDB(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.imageList;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            let iv='';
                            imageValue.map((value)=> (
                                value.fileType === "image" ?
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnail+'\')"></i></td><td><i class="far fa-image"></i> '+value.fileName+'</td><td>'+value.extension+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                                :
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td></td><td><i class="far fa-file-pdf"></i> '+value.fileName+'</td><td>'+value.extension+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                            ));
                            $('.filemanager-container #files-list').html(ivFirst+iv+ivLast);
                            setdatatable();
                        }
                    } else {
                        return [];
                    }
                })
            }
            else if (sd === "onedrive") {
                let requestData = `${currentfolder}&fileType=${fileType}&searchStr=`;
                getImagesOD(requestData).then(res => {
                    if (res.status === 200) {
                        let imageValue = res.result.imageList;
                        if (imageValue.length === 0) {
                            setNoFilesMsg();
                        } else {
                            let iv='';
                            imageValue.map((value)=> (
                                value.fileType === "image" ?
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnail+'\')"></i></td><td><i class="far fa-image"></i> '+value.fileName+'</td><td>'+value.extension+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                                :
                                    iv+='<tr onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><td></td><td><i class="far fa-file-pdf"></i> '+value.fileName+'</td><td>'+value.extension+'</td><td>'+dateTimeFormat(value.lastModifiedTime)+'</td><td>'+format_size(value.size)+'</td></tr>'
                            ));
                            $('.filemanager-container #files-list').html(ivFirst+iv+ivLast);
                            setdatatable();
                        }
                    } else {
                        return [];
                    }
                })
            }
        });
        $('.icon-wrapper a[data-dojo-attach-point="deleteButton"]').unbind("click").click(function () {
            blo_id = "deletefolder";
            $("#" + blo_id + ",#a" + blo_id).remove();
            let dilogstring = droparray1["DeleteFolderDialog"];
            dilogstring = replaccon("{{Dialog.id}}", blo_id, dilogstring);
            $("body").append(dilogstring);
            $("#a" + blo_id).leanModal({ top: 100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
            closeleanModal();
            setTimeout(function () {
                $("#a" + blo_id)[0].click();
            }, 500);
            $('#deletefolder a.confirmfolder').unbind("click").click(function () {
                if (filefoldermanagerlistcheck > 0) {
                    let requestData = {
                        "source": filefoldermanagerdellist
                    }
                    deleteFoldersAndFilesED(requestData).then(res => {
                        if (res.status === 200) {
                            $("#a" + blo_id + ",#" + blo_id + ",#" + blo_id + "_overlay,#lean_overlay").remove();
                            $('.icon-wrapper .cmd').hide();
                            filefoldermanagerlistcheck = 0;
                            filefoldermanagerdellist = [];
                            createtreeview(block_id, target_id, contentblockid).then(()=>{sn1(block_id, target_id, contentblockid)});
                            filemanagerlist(block_id, target_id, contentblockid);
                        }
                    });
                }
            });
        });
        if ($('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').css("display") !== "none") {
            $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').hide();
        }
    }, 1000);
    $('#files-list').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your images...");
    let requestData = {
        "currentFolder": currentfolder,
        "searchTerm": searchstring,
        fileType: fileType
    }
    getImagesED(requestData).then(res => {
        if (res.status === 200) {
            if(res.result.fileList.length > 0){
                let cf = currentfolder === "root" ? "" : currentfolder+"/";
                setLiED(res.result.fileList,cf);
                $('#campaign-no-result').hide();
                $('.size1of2.unit [data-dojo-props="files-list-control"]').show();
                $('#files-list li div.dijitCheckBox input[type="checkbox"]').unbind("click").click(function (){
                    if ($(this).is(':checked')) {
                        filefoldermanagerlistcheck++;
                        filefoldermanagerdellist.push($(this).val());
                        $(this).closest("div").addClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                        $('.icon-wrapper .cmd').show();
                    } else {
                        filefoldermanagerlistcheck--;
                        filefoldermanagerdellist.splice(filefoldermanagerdellist.indexOf($(this).val()), 1);
                        $(this).closest("div").removeClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                        if (filefoldermanagerlistcheck === 0 || filefoldermanagerlistcheck < 0) {
                            $('.icon-wrapper .cmd').hide();
                        }
                    }
                });
                $('.icon-wrapper a[data-dojo-attach-point="selectall"]').unbind("click").click(function () {
                    if ($(this).hasClass('active') === false) {
                        $('#files-list li div.dijitCheckBox input[type="checkbox"],#folderview .mainitem div.dijitCheckBox input[type="checkbox"]').each(function () {
                            if (!$(this).is(':checked')) {
                                $(this).trigger("click");
                            }
                        });
                        $('#folderview').treeview('checkAll');
                        $('.icon-wrapper .cmd').show();
                        $(this).addClass("active");
                    } else {
                        filefoldermanagerlistcheck = 0;
                        filefoldermanagerdellist = [];
                        $('#files-list li div.dijitCheckBox input[type="checkbox"],#folderview .mainitem div.dijitCheckBox input[type="checkbox"]').each(function () {
                            $(this).trigger("click");
                        });
                        $('#folderview').treeview('uncheckAll');
                        if (filefoldermanagerlistcheck === 0 || filefoldermanagerlistcheck < 0) {
                            $('.icon-wrapper .cmd').hide();
                        }
                        $(this).removeClass("active");
                    }
                });
                $('.icon-wrapper a[data-dojo-attach-point="moveButton"]').unbind("click").click(function () {
                    blo_id = "movefolder";
                    $("#" + blo_id + ",#a" + blo_id).remove();
                    let dilogstring = droparray1["MoveFolderDialog"];
                    dilogstring = replaccon("{{Dialog.id}}", blo_id, dilogstring);
                    $("body").append(dilogstring);
                    $("#a" + blo_id).leanModal({ top: 100, closeButton: "span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]" });
                    closeleanModal();
                    setTimeout(function () {
                        $("#a" + blo_id)[0].click();
                    }, 500);
                    $('#movefolder a.confirmmovefolder').unbind("click").click(function () {
                        $("#a" + blo_id + ",#" + blo_id + ",#" + blo_id + "_overlay,#lean_overlay").remove();
                        $('.icon-wrapper .cmd').hide();
                        $('.icon-wrapper a[data-dojo-attach-point="selectall"]').hide();
                        $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').hide();
                        $('.icon-wrapper a[data-dojo-attach-point="moveHereButton"]').show();
                        $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').show();
                    });
                });
                $('.icon-wrapper a[data-dojo-attach-point="copyButton"]').unbind("click").click(function () {
                    $('.icon-wrapper .cmd').hide();
                    $('.icon-wrapper a[data-dojo-attach-point="selectall"]').hide();
                    $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').hide();
                    $('.icon-wrapper a[data-dojo-attach-point="pasteButton"]').show();
                    $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').show();
                });
                $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').unbind("click").click(function () {
                    filefoldermanagerlistcheck = 0;
                    filefoldermanagerdellist = [];
                    $('.icon-wrapper a[data-dojo-attach-point="moveHereButton"]').hide();
                    $('.icon-wrapper a[data-dojo-attach-point="pasteButton"]').hide();
                    $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').hide();
                    $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').removeClass("dijitCheckBoxChecked selectCheckBoxChecked dijitChecked");
                    $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').show();
                    $('.icon-wrapper a[data-dojo-attach-point="selectall"]').show();
                });
                $('.icon-wrapper a[data-dojo-attach-point="moveHereButton"]').unbind("click").click(function () {
                    currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
                    let requestData = {
                        "source": filefoldermanagerdellist,
                        "destination": currentfolder
                    }
                    cutFoldersAndFilesED(requestData).then(res => {
                        if (res.status === 200) {
                            filefoldermanagerlistcheck = 0;
                            filefoldermanagerdellist = [];
                            $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').show();
                            $('.icon-wrapper a[data-dojo-attach-point="selectall"]').show();
                            $('.icon-wrapper a[data-dojo-attach-point="moveHereButton"]').hide();
                            $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').hide();
                            createtreeview(block_id, target_id, contentblockid).then(()=>{sn3(block_id, target_id, contentblockid)});
                        }
                    });
                });
                $('.icon-wrapper a[data-dojo-attach-point="pasteButton"]').unbind("click").click(function () {
                    currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" || $('.treeview ul li.node-selected').attr("path-value") === "" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
                    let requestData = {
                        "source": filefoldermanagerdellist,
                        "destination": currentfolder
                    }
                    copyFoldersAndFilesED(requestData).then(res => {
                        if (res.status === 200) {
                            filefoldermanagerlistcheck = 0;
                            filefoldermanagerdellist = [];
                            $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').show();
                            $('.icon-wrapper a[data-dojo-attach-point="selectall"]').show();
                            $('.icon-wrapper a[data-dojo-attach-point="pasteButton"]').hide();
                            $('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').hide();
                            createtreeview(block_id, target_id, contentblockid).then(()=>{sn3(block_id, target_id, contentblockid)});
                        }
                    });
                });
                setClickSelectItemCall(block_id, target_id, contentblockid);
                if ($('.icon-wrapper a[data-dojo-attach-point="cancelButton"]').css("display") !== "none") {
                    $('#files-list li div.dijitCheckBox,#folderview .mainitem div.dijitCheckBox').hide();
                }
            } else {
                setNoFilesMsg();
                if ($('#filemanagerdelallcheck_' + contentblockid + "_" + target_id).is(':checked')) {
                    $('#filemanagerdelallcheck_' + contentblockid + "_" + target_id).trigger("click");
                }
                $('.size1of2.unit [data-dojo-props="files-list-control"]').hide();
                $('.size1of2.unit [data-dojo-props="files-list-control"] button[data-dojo-attach-point="deleteButton"]').hide();
            }
        }
    });
}
function replaccon(conten, contenval, str) {
    if (typeof str !== typeof undefined && str !== false && str.includes(conten)) {
        let innerPadding = str.match(new RegExp(conten, "g")).length
        for (let i = 0; i < innerPadding; i++) {
            str = str.replace(conten, contenval);
        }
    } else {
        if (typeof str === typeof undefined && str === false) {
            str = "";
        }
    }
    return str;
}
function closeleanModal() {
    $("span[data-dojo-attach-point*=closeButtonNode],a[data-dojo-attach-point*=closeButtonNode]").unbind("click").click(function () {
        $(".link-modal.dijitDialogShow,.link-modal,#lean_overlay").remove();
    });
}
function setfolderclick(block_id, target_id, contentblockid) {
    $('.treeview ul li').unbind("click").click(function (e) {
        if ($(e.target).hasClass("expand-icon") === true || $(e.target).hasClass("check-icon") === true) return;
        $("#imginfo").html("");
        $('#files-list').html("<i class='fad fa-spinner-third fa-spin fa-5x'></i><br/>Please wait...We are fetching your images...");
        let sd = $(".drivebox.active").attr("id");
        if (sd === "easdrive") {
            setTimeout(function () {
                filemanagerlist(block_id, target_id, contentblockid);
            }, 200);
        } else if (sd === "googledrive") {
            if ($(this).attr("path-value") === "") {
                currentfolder = "root";
            } else {
                let t = $(this).attr("path-value").replaceAll("?","").split("&");
                currentfolder = t[0].replace("F=","");
            }
            let requestData = `${currentfolder}?fileType=`+fileType;
            getImagesGD(requestData).then(res => {
                if (res.status === 200) {
                    let imageValue = res.result.getImages;
                    if (imageValue.length === 0) {
                        setNoFilesMsg();
                    } else {
                        setLiGD(imageValue);
                    }
                    setfolderclick(block_id, target_id, contentblockid);
                    setClickSelectItemCall(block_id, target_id, contentblockid);
                } else {
                    return [];
                }
            })
        } else if (sd === "dropbox") {
            if ($(this).hasClass("node-selected") === true) {
                currentfolder = "";
            } else {
                currentfolder = $(this).attr("path-value");
            }
            let requestData = `${currentfolder}&fileType=`+fileType;
            getImagesDB(requestData).then(res => {
                if (res.status === 200) {
                    let imageValue = res.result.imageList;
                    if (imageValue.length === 0) {
                        setNoFilesMsg();
                    } else {
                        setLiDB(imageValue);
                    }
                    setfolderclick(block_id, target_id, contentblockid);
                    setClickSelectItemCall(block_id, target_id, contentblockid);
                } else {
                    return [];
                }
            })
        } else if (sd === "onedrive") {
            if ($(this).hasClass("node-selected") === true) {
                currentfolder = "?F=";
            } else {
                currentfolder = $(this).attr("path-value");
            }
            let requestData = `${currentfolder}&fileType=${fileType}&searchStr=`;
            getImagesOD(requestData).then(res => {
                if (res.status === 200) {
                    let imageValue = res.result.imageList;
                    if (imageValue.length === 0) {
                        setNoFilesMsg();
                    } else {
                        setLiOD(imageValue);
                    }
                    setfolderclick(block_id, target_id, contentblockid);
                    setClickSelectItemCall(block_id, target_id, contentblockid);
                } else {
                    return [];
                }
            })
        }
    });
}
function setcheckboxclick(value, action) {
    if (action === "checked") {
        filefoldermanagerlistcheck++;
        filefoldermanagerdellist.push(value);
        $('.icon-wrapper .cmd').show();
    }
    if (action === "unchecked") {
        filefoldermanagerlistcheck--;
        filefoldermanagerdellist.splice(filefoldermanagerdellist.indexOf(value), 1);
        if (filefoldermanagerlistcheck === 0 || filefoldermanagerlistcheck < 0) {
            $('.icon-wrapper .cmd').hide();
        }
    }
}
async function createtreeview(block_id, target_id, contentblockid) {
    await getFoldersED().then(res => {
        if (res.status === 200) {
            $('#folderview').treeview({
                data: res.result.getFolders,
                levels: 2,
                expandIcon: 'fas fa-caret-right',
                collapseIcon: 'fas fa-caret-down',
                checkedIcon: 'far fa-check-square',
                uncheckedIcon: 'far fa-square',
                nodeIcon: 'fas fa-folder',
                showCheckbox: true,
                showBorder: false,
                onNodeCollapsed: function (event, node) {
                    setTimeout(function () {
                        setfolderclick(block_id, target_id, contentblockid);
                    }, 200);
                },
                onNodeExpanded: function (event, node) {
                    setTimeout(function () {
                        setfolderclick(block_id, target_id, contentblockid);
                    }, 200);
                },
                onNodeChecked: function (event, node) {
                    setTimeout(function () {
                        setcheckboxclick(node.pathValue, "checked");
                        setfolderclick(block_id, target_id, contentblockid);
                    }, 200);
                },
                onNodeUnchecked: function (event, node) {
                    setTimeout(function () {
                        setcheckboxclick(node.pathValue, "unchecked");
                        setfolderclick(block_id, target_id, contentblockid);
                    }, 200);
                },
            });
        }
    });
    return true;
}
function viewimagedetail(filepath, filename, extension, size, dimension) {
    let html = '';
    if(extension === 'pdf'){
        html = '<div class="imgdiv" style="height: max-content;"><i class="far fa-file-pdf fa-4x"></i></div>';
    } else {
        html = '<div class="imgdiv"><img src="' + filepath + '" /></div>';
    }
    html += '<div class="imgtxt"><span><strong>Name</strong></span><span>' + filename + '</span></div>';
    html += '<div class="imgtxt"><span><strong>Extension</strong></span><span>' + extension + '</span></div>';
    html += '<div class="imgtxt"><span><strong>Size</strong></span><span>' + size + '</span></div>';
    if(extension !== 'pdf'){
        html += '<div class="imgtxt"><span><strong>Dimension</strong></span><span>' + dimension + '</span></div>';
    }
    $("#imginfo").html(html);
}
window.viewimagedetail=viewimagedetail;
function imagezoom(filepath) {
    $("#clickImageZoom").trigger("click");
    setTimeout(()=>{
        $("#showZoomImage").html('<img src="' + filepath + '" style="max-height: 400px; max-width: 100%;" />');
    },500);
}
window.imagezoom=imagezoom;
function format_size(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
window.format_size=format_size;
function setdatatable() {
    $("#tablelist").DataTable({
        paging: false,
        searching: false,
        info: false,
        order: [],
        scrollX: false,
        autoWidth: false,
        columnDefs: [
            { targets: 0, orderable: false, width: "10%" },
            { targets: 1, width: "40%" },
            { targets: 2, width: "15%" },
            { type: "date-uk", targets: 3, width: "25%" },
            { "type": "file-size", "targets": 4, width: "10%" },
        ],
        fixedColumns: true
    });
    $.extend($.fn.dataTableExt.oSort, {
        "date-uk-pre": function (a, b) {
            if (a === null || a === "") {
                return 0;
            }
            let t = a.split(' ');
            let ukDatea = t[0].split('/');
            return (ukDatea[2] + ukDatea[0] + ukDatea[1]) * 1;
        },
        "date-uk-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        "date-uk-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });
    $.extend($.fn.dataTableExt.type.order, {
        "file-size-pre": function (data) {
            let matches = data.match( /^(\d+(?:\.\d+)?)\s*([a-z]+)/i );
            let multipliers = {
                b:  1,
                bytes: 1,
                kb: 1000,
                kib: 1024,
                mb: 1000000,
                mib: 1048576,
                gb: 1000000000,
                gib: 1073741824,
                tb: 1000000000000,
                tib: 1099511627776,
                pb: 1000000000000000,
                pib: 1125899906842624
            };
            if (matches) {
                let multiplier = multipliers[matches[2].toLowerCase()];
                return parseFloat( matches[1] ) * multiplier;
            } else {
                return -1;
            }
        }
    });
}
function getResponse(imageValue, folderValue, block_id) {
    $(".icon-wrapper a").hide();
    $('.icon-wrapper a[data-dojo-attach-point="listButton"],.icon-wrapper a[data-dojo-attach-point="gridButton"]').show();
    $(".drivebox").removeClass("active");
    $("#googledrive").addClass("active");
    $("#imginfo").html("");
    currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
    if (imageValue.length === 0) {
        setNoFilesMsg();
    } else {
        setLiGD(imageValue);
    }
    let id = $(".filemanager-container").attr("id");
    id = id.split("_");
    if(id[1] !== "attachment"){
        block_id = "preview_McBlock_" + id[1];
    }
    target_id = id[2];
    contentblockid = id[1];
    if ($.trim(folderValue) !== "") {
        $('#folderview').treeview({
            data: folderValue,
            levels: 2,
            expandIcon: 'fas fa-caret-right',
            collapseIcon: 'fas fa-caret-down',
            nodeIcon: 'fas fa-folder',
            showBorder: false,
            onNodeCollapsed: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
            onNodeExpanded: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
        });
        setTimeout(function () {
	        let selectableNodes = $('#folderview').treeview('search', ["My Drive", { ignoreCase: false, exactMatch: true }]);
	        $('#folderview').treeview('selectNode', [selectableNodes]);
	        setfolderclick(block_id, target_id, contentblockid);
    		setClickSelectItemCall(block_id, target_id, contentblockid);
	    }, 1000);
    }
    setfolderclick(block_id, target_id, contentblockid);
    setClickSelectItemCall(block_id, target_id, contentblockid);
}
function getResponseDB(imageValue, folderValue, block_id) {
    $(".icon-wrapper a").hide();
    $('.icon-wrapper a[data-dojo-attach-point="listButton"],.icon-wrapper a[data-dojo-attach-point="gridButton"]').show();
    $(".drivebox").removeClass("active");
    $("#dropbox").addClass("active");
    $("#imginfo").html("");
    currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
    if ($.trim(imageValue) === "") {
        setNoFilesMsg();
    } else {
        setLiDB(imageValue);
    }
    let id = $(".filemanager-container").attr("id");
    id = id.split("_");
    if(id[1] !== "attachment"){
        block_id = "preview_McBlock_" + id[1];
    }
    target_id = id[2];
    contentblockid = id[1];
    if ($.trim(folderValue) !== "") {
        $('#folderview').treeview({
            data: folderValue,
            levels: 2,
            expandIcon: 'fas fa-caret-right',
            collapseIcon: 'fas fa-caret-down',
            nodeIcon: 'fas fa-folder',
            showBorder: false,
            onNodeCollapsed: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
            onNodeExpanded: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
        });
        setTimeout(function () {
	        let selectableNodes = $('#folderview').treeview('search', ["My Drive", { ignoreCase: false, exactMatch: true }]);
	        $('#folderview').treeview('selectNode', [selectableNodes]);
	        setfolderclick(block_id, target_id, contentblockid);
    		setClickSelectItemCall(block_id, target_id, contentblockid);
	    }, 1000);
    }
    setfolderclick(block_id, target_id, contentblockid);
    setClickSelectItemCall(block_id, target_id, contentblockid);
}
function getResponseOD(imageValue, folderValue, block_id) {
    $(".icon-wrapper a").hide();
    $('.icon-wrapper a[data-dojo-attach-point="listButton"],.icon-wrapper a[data-dojo-attach-point="gridButton"]').show();
    $(".drivebox").removeClass("active");
    $("#onedrive").addClass("active");
    $("#imginfo").html("");
    currentfolder = typeof $('.treeview ul li.node-selected').attr("path-value") === "undefined" ? "root" : $('.treeview ul li.node-selected').attr("path-value");
    if ($.trim(imageValue) === "") {
        setNoFilesMsg();
    } else {
        setLiOD(imageValue);
    }
    let id = $(".filemanager-container").attr("id");
    id = id.split("_");
    if(id[1] !== "attachment"){
        block_id = "preview_McBlock_" + id[1];
    }
    target_id = id[2];
    contentblockid = id[1];
    if ($.trim(folderValue) !== "") {
        $('#folderview').treeview({
            data: folderValue,
            levels: 2,
            expandIcon: 'fas fa-caret-right',
            collapseIcon: 'fas fa-caret-down',
            nodeIcon: 'fas fa-folder',
            showBorder: false,
            onNodeCollapsed: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
            onNodeExpanded: function (event, node) {
                setTimeout(function () {
                    setfolderclick(block_id, target_id, contentblockid);
                }, 200);
            },
        });
        setTimeout(function () {
	        let selectableNodes = $('#folderview').treeview('search', ["My Drive", { ignoreCase: false, exactMatch: true }]);
	        $('#folderview').treeview('selectNode', [selectableNodes]);
            setfolderclick(block_id, target_id, contentblockid);
            setClickSelectItemCall(block_id, target_id, contentblockid);
	    }, 1000);
    }
    setfolderclick(block_id, target_id, contentblockid);
    setClickSelectItemCall(block_id, target_id, contentblockid);
}
async function getImageGD() {
    let requestData = `root?fileType=`+fileType;
    const res = await getImagesGD(requestData);
    if (res.status === 200) {
        return res.result.getImages;
    } else {
        return [];
    }
}
async function getFolderGD() {
    const res = await getFoldersGD("root");
    if (res.status === 200) {
        return res.result.getFolders;
    } else {
        return [];
    }
}
async function getImageDB() {
    let requestData = `?F=&fileType=`+fileType;
    const res = await getImagesDB(requestData);
    if (res.status === 200) {
        return res.result.imageList;
    } else {
        return [];
    }
}
async function getFolderDB() {
    return getFoldersDB().then(res => {
        if (res.status === 200) {
            return res.result.folderList;
        } else {
            return [];
        }
    });
}
async function getImageOD() {
    let requestData = `?F=&fileType=${fileType}&searchStr=`;
    return getImagesOD(requestData).then(res => {
        if (res.status === 200) {
            return res.result.imageList;
        } else {
            return [];
        }
    });
}
async function getFolderOD() {
    return getFoldersOD().then(res => {
        if (res.status === 200) {
            return res.result.folderList;
        } else {
            return [];
        }
    });
}
function setDropZone(block_id, target_id, contentblockid){
    if(dropZoneObj !== ""){
        dropZoneObj[0].dropzone.destroy();
    }
    dropZoneObj = $('[data-dojo-attach-point="dropTarget"]').dropzone({
        url: proxyBaseURL + "/easDrive/uploadFile?destination=" + currentfolder,
        method:"post",
        params: {},
        headers:{"Authorization": "Bearer " + sessionStorage.getItem('token')},
        acceptedFiles: "image/jpeg,image/png,image/gif,application/pdf",
        dictDefaultMessage: "",
        previewsContainer: ".upload-list",
        previewTemplate: droparray1["templates/editorContainer/drop/upload/listcontent"],
        maxFilesize: 256,
        timeout: 0,
        destroy:true,
        autoProcessQueue:true,
        maxfilesexceeded: function (file) {
            $("#clickError").attr("data-type","Error");
            $("#clickError").val("You have uploaded more than 256 Image. Only the first 256 files will be uploaded!");
            $("#clickError").trigger("click");
            this.removeFile(file);
        },
        createImageThumbnails: true,
        addRemoveLinks: false,
        accept: async function (file, done) {
            if(file.type === "application/pdf"){
                $(file.previewElement).find('div[data-dojo-attach-point="thumbnail"]').addClass("d-flex align-items-center justify-content-center");
                $(file.previewElement).find('div[data-dojo-attach-point="thumbnail"]').html('<i class="far fa-file-pdf fa-2x"></i>');
            }
            $('#UploadManager_' + contentblockid + "_" + target_id).show();
            $('.file-drop-target').removeClass("over");
            let imageData = await toBase64(file);
            dropZoneObj[0].dropzone.options.params={"fileType":file.type,"fileURL":imageData};
            dropZoneObj[0].dropzone.processFile(file);
        },
        init: function () {
            this.on("processing", async function(file, xhr, formData) { 
                this.options.url = proxyBaseURL + "/easDrive/uploadFile?destination=" + currentfolder;
            });
            this.on("error", function (file, response) {
                $('.dz-file-preview').hide();
                let str = "Sorry but the image, " + file.name + ", you are trying to upload has a generated an error!\nYou will not be able to upload this file in this format.\nPlease contact support or change file format.";
                this.removeFile(file);
                $("#clickError").attr("data-type","Error");
                $("#clickError").val(str);
                $("#clickError").trigger("click");
            });
            this.on("success", function (file, serverFileName) {
                $('.file-drop-target').removeClass("over");
                if(serverFileName.status !== 200){
                    if (serverFileName.filestatus === "filevirus") {
                        $("#clickError").attr("data-type","Error");
                        $("#clickError").val(serverFileName.filestatusmessage);
                        $("#clickError").trigger("click");
                    }
                }
            });
            this.on("complete", function (file, serverFileName) {
                if(file.status !== "error"){
                    filemanagerlist(block_id, target_id, contentblockid);
                }
            });
        }
    });
}
function sn1(block_id, target_id, contentblockid){
    setTimeout(function () {
        setfolderclick(block_id, target_id, contentblockid);
        let selectableNodes = $('#folderview').treeview('search', ["My Drive", {ignoreCase: false, exactMatch: true}]);
        $('#folderview').treeview('selectNode', [selectableNodes]);
    },200);
}
function sn2(block_id, target_id, contentblockid, newfoldername) {
    setTimeout(function () {
        setfolderclick(block_id, target_id, contentblockid);
        let parts = currentfolder.split("/");
        let levels = parts.length;
        let expandibleNodes = $('#folderview').treeview('search', [parts[0], { ignoreCase: false, exactMatch: true }]);
        let selectableNodes = $('#folderview').treeview('search', [newfoldername, { ignoreCase: false, exactMatch: true }]);
        $('#folderview').treeview('expandNode', [expandibleNodes, { levels: levels }]);
        $('#folderview').treeview('selectNode', [selectableNodes]);
        $("#a"+blo_id+",#"+blo_id+",#"+blo_id+"_overlay,#lean_overlay").remove();
        filemanagerlist(block_id, target_id, contentblockid);
    },200);
}
function sn3(block_id, target_id, contentblockid) {
    setTimeout(function () {
        setfolderclick(block_id, target_id, contentblockid);
        let parts = currentfolder.split("/");
        let levels = parts.length;
        let expandibleNodes = $('#folderview').treeview('search', [parts[0], { ignoreCase: false, exactMatch: true }]);
        let selectableNodes = $('#folderview').treeview('search', [parts[levels - 1], { ignoreCase: false, exactMatch: true }]);
        $('#folderview').treeview('expandNode', [expandibleNodes, { levels: levels }]);
        $('#folderview').treeview('selectNode', [selectableNodes]);
        filemanagerlist(block_id, target_id, contentblockid);
    },200);
}
function setClickSelectItemCall(block_id, target_id, contentblockid){
    let urlList = ["addmypage","createform","addmysurveytemplates","addmyassessmenttemplates","mydrive","buildsmscampaign"];
    let currentUrl="";
    for(let i=0;i<urlList.length;i++){
        if(window.location.href.search(urlList[i]) > 0){
            currentUrl=urlList[i];
        }
    }
    if(currentUrl === "addmypage"){
        window.clickSelectItemCall(block_id,target_id,contentblockid);
    } else if(currentUrl === "createform"){
        window.clickSelectItemCallForm(block_id,target_id,contentblockid);
    } else if(currentUrl === "addmysurveytemplates"){
        window.clickSelectItemCallSurvey(block_id,target_id,contentblockid);
    } else if(currentUrl === "addmyassessmenttemplates"){
        window.clickSelectItemCallAssessment(block_id,target_id,contentblockid);
    } else if(currentUrl === "mydrive"){
        window.clickSelectItemCallMyDrive();
    } else if(currentUrl === "buildsmscampaign"){
        window.clickSelectItemCallSmsCampaign();
    } 
}
function setNoFilesMsg(){
    let currentfoldertext = ($('.treeview ul li.node-selected').text() === "" || $('.treeview ul li.node-selected').text() === "?F=") ? "root" : $('.treeview ul li.node-selected').text();
    $('.filemanager-container #files-list').html("No files in the " + currentfoldertext + " folder."); 
}
function setLiED(result,cf){
    let iv = "";
    result.map((value)=> (
        value.fileType === "image" ?
            iv+='<li class="selfclear"><div class="thumb-image"><img src="'+value.url+'?'+new Date().getTime()+'" item-path="'+value.url+'" item-name="'+value.fileName+'" onmouseenter="viewimagedetail(\''+value.url+'?'+new Date().getTime()+'\',\''+value.fileName+'\',\''+value.fileName.split(".").pop().toLowerCase()+'\',\''+format_size(value.imageSize)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')" /><div class="imageicon"><i class="far fa-edit pixie-edit" item-url="'+value.url+'" item-file-name="'+value.fileName+'"></i><i class="far fa-search-plus" onclick="imagezoom(\''+value.url+'?'+new Date().getTime()+'\')"></i><div class="dijit dijitReset dijitInline dijitCheckBox selectCheckBox grid-select av-checkbox" role="presentation"><input value="'+cf+value.fileName+'" tabindex="0" role="checkbox" class="dijitReset dijitCheckBoxInput" type="checkbox"></div></div></div></li>'
        :
            iv+='<li class="selfclear"><div class="thumb-image" onmouseenter="viewimagedetail(\''+value.url+'?'+new Date().getTime()+'\',\''+value.fileName+'\',\''+value.fileName.split(".").pop().toLowerCase()+'\',\''+format_size(value.imageSize)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><div class="thumb-i h-100 d-flex justify-content-center align-items-center" item-path="'+value.url+'" item-name="'+value.fileName+'"><i class="far fa-file-pdf fa-4x"></i></div><div class="imageicon"><div class="dijit dijitReset dijitInline dijitCheckBox selectCheckBox grid-select av-checkbox" role="presentation"><input value="'+cf+value.fileName+'" tabindex="0" role="checkbox" class="dijitReset dijitCheckBoxInput" type="checkbox"></div></div></div></li>'
    ));
    $('.filemanager-container #files-list').html(iv);
}
function setLiGD(result){
    let iv = "";
    result.map((value)=> (
        value.fileType === "image" ?
            iv+='<li class="selfclear"><div class="thumb-image"><img src="'+value.thumbnailLink+'" item-fileid="'+value.id+'" item-name="'+value.name+'" onmouseenter="viewimagedetail(\''+value.thumbnailLink+'\',\''+value.name+'\',\''+value.name.split(".").pop().toLowerCase()+'\',\''+format_size(value.size)+'\',\''+value.imageMediaMetadata.width+' x '+value.imageMediaMetadata.height+'\')"/><div class="imageicon"><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnailLink+'\')"></i></div></div></li>'
        :
            iv+='<li class="selfclear"><div class="thumb-image" onmouseenter="viewimagedetail(\''+value.thumbnailLink+'\',\''+value.name+'\',\''+value.name.split(".").pop().toLowerCase()+'\',\''+format_size(value.size)+'\',\'\')"><div class="thumb-i h-100 d-flex justify-content-center align-items-center" item-fileid="'+value.id+'" item-name="'+value.name+'"><i class="far fa-file-pdf fa-4x"></i></div></div></li>'
    ));
    $('.filemanager-container #files-list').html(iv);
}
function setLiDB(result){
    let iv = "";
    result.map((value)=> (
        value.fileType === "image" ?
            iv+='<li class="selfclear"><div class="thumb-image"><img src="'+value.thumbnail+'" item-filepath="'+value.path+'" item-name="'+value.fileName+'" onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"/><div class="imageicon"><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnail+'\')"></i></div></div></li>'
        :
            iv+='<li class="selfclear"><div class="thumb-image" onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><div class="thumb-i h-100 d-flex justify-content-center align-items-center" item-filepath="'+value.path+'" item-name="'+value.fileName+'"><i class="far fa-file-pdf fa-4x"></i></div></div></li>'
    ));
    $('.filemanager-container #files-list').html(iv);
}
function setLiOD(result){
    let iv = "";
    result.map((value)=> (
        value.fileType === "image" ?
            iv+='<li class="selfclear"><div class="thumb-image"><img src="'+value.thumbnail+'" item-id="'+value.path+'" item-name="'+value.fileName+'" onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"/><div class="imageicon"><i class="far fa-search-plus" onclick="imagezoom(\''+value.thumbnail+'\')"></i></div></div></li>'
        :
            iv+='<li class="selfclear"><div class="thumb-image" onmouseenter="viewimagedetail(\''+value.thumbnail+'\',\''+value.fileName+'\',\''+value.extension+'\',\''+format_size(value.size)+'\',\''+value.imageWidth+' x '+value.imageHeight+'\')"><div class="thumb-i h-100 d-flex justify-content-center align-items-center" item-id="'+value.path+'" item-name="'+value.fileName+'"><i class="far fa-file-pdf fa-4x"></i></div></div></li>'
    ));
    $('.filemanager-container #files-list').html(iv);
}