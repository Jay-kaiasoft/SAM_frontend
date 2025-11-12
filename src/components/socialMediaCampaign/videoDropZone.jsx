import React, { useMemo } from "react";
import {connect} from "react-redux";
import { useDropzone } from "react-dropzone";
import {uploadVideo} from "../../services/socialMediaService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import { getThumbnails, getMetadata } from 'video-metadata-thumbnails';
import { toBase64 } from "../../assets/commonFunctions";

const activeStyle = {
    borderColor: "#2196f3"
};
const acceptStyle = {
    borderColor: "#00e676"
};
const rejectStyle = {
    borderColor: "#ff1744"
};
const VideoDropZone = ({
    acceptedVideoFilesInState,
    setAcceptedVideoFilesInState,
    deleteAcceptedVideoFileFromState,
    globalAlert,
    setData,
    dataOldVideo,
    deleteOldVideoFileFromState,
    videoThumbnail,
    setVideoThumbnail,
    optionStatus
}) => {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject,} = useDropzone({
        accept: "video/mp4",
        noClick: false,
        noKeyboard: true,
        multiple: false,
        onDrop: (acceptedFiles) => {
            const filesUploaded = JSON.parse(JSON.stringify(acceptedFiles)).concat(JSON.parse(JSON.stringify(acceptedVideoFilesInState)));
            if (filesUploaded.length === 1) {
                acceptedFiles.forEach((file) => {
                    getMetadata(file).then(async(fileMeatdata)=>{
                        let fileSize = file.size/Math.pow(1024, 2);
                        let videoDuration = fileMeatdata.duration;
                        let platformSupportSize = 0;
                        let platformSupportDuration = 0;
                        let sizePlatform = "";
                        let durationPlatform = "";
                        if(optionStatus.linkedin) {
                            platformSupportSize = 200;
                            sizePlatform = "Linkedin";
                        } else if(optionStatus.twitter) {
                            platformSupportSize = 512;
                            sizePlatform = "Twitter";
                        } else {
                            platformSupportSize = 1024;
                            sizePlatform = "Facebook";
                        }
                        if(optionStatus.twitter) {
                            platformSupportDuration = 140;
                            durationPlatform = "Twitter";
                        } else if(optionStatus.linkedin) {
                            platformSupportDuration = 1800;
                            durationPlatform = "Linkedin"
                        } else {
                            platformSupportDuration = 240*60;
                            durationPlatform = "Facebook"
                        }
                        if(fileSize > platformSupportSize && videoDuration > platformSupportDuration){
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${sizePlatform === durationPlatform?durationPlatform:sizePlatform + " and " + durationPlatform}, so file size can not be exceeded ${sizePlatform === "Facebook"?"1 GB":platformSupportSize+" MB"} and video duration can not be exceeded ${durationPlatform === "Twitter"?"2 Minutes":(platformSupportDuration/60)+" Minutes"}`,
                                open: true
                            });
                        } else if(fileSize > platformSupportSize) {
                                globalAlert({
                                    type: "Error",
                                    text: `File can not be uploaded because you have selected ${sizePlatform}, so file size can not be exceeded ${sizePlatform === "Facebook"?"1 GB":platformSupportSize+" MB"}`,
                                    open: true
                                });
                        } else if(videoDuration > platformSupportDuration) {
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${durationPlatform}, so video duration can not be exceeded ${durationPlatform === "Twitter"?"2 Minutes":platformSupportDuration/60+" Minutes"}`,
                                open: true
                            });
                        } else {
                            let formData = {
                                "file":await toBase64(file),
                                "fileType":file.type,
                                "fileName":file.name
                            }
                            uploadVideo(formData).then((resp) => {
                                if(resp.status === 200) {
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnail(URL.createObjectURL(th[0].blob))});
                                    if (resp && resp.result && resp.result.videoPath) {
                                        const fileToAccept = {
                                            fileName: resp.result.videoName,
                                            pathOnServer: resp.result.videoPath
                                        }
                                        setAcceptedVideoFilesInState(fileToAccept)
                                    }
                                    setData((prev) => {
                                        return {...prev, "smPostVideo": resp.result.videoName}
                                    })
                                }
                            })
                        }
                    });
                })
            } else {
                globalAlert({
                    type: "Error",
                    text: `Only one video can be selected.`,
                    open: true
                });
            }

        }
    });
    const style = useMemo(
        () => ({
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }),
        [isDragActive, isDragAccept, isDragReject]
    );
    return (
        <>
            <div {...getRootProps({ style })} className="d-flex mt-3">
                <div id="sm-image-dropzone" className="sm-image-dropzone w-75 align-items-center">
                    <i className="far fa-video" style={{fontSize:40}}></i>
                    <span className="mt-2">
                        Facebook   -  Video Size Limit : 1 GB   Video Duration Limit: 240 minutes
                        {/*Twitter    -  Video Size Limit : 512 MB Video Duration Limit:  2 minutes<br/>*/}
                        {/*Linkedin   -  Video Size Limit : 200 MB Video Duration Limit: 30 minutes*/}
                    </span>
                </div>
                <input  {...getInputProps()} />
                <div className="video-preview-container w-25">
                    {
                        dataOldVideo !== "" && dataOldVideo.split(",").map((image,index)=>{
                            return (
                                <div className="video-container" key={index}>
                                    <img src={videoThumbnail} alt="preview" height={120} width={120} className="image-preview" />
                                    <div className="delele-button">
                                        <i className="fas fa-trash-alt mt-5" onClick={() => { deleteOldVideoFileFromState(index,image) }}></i>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {acceptedVideoFilesInState && acceptedVideoFilesInState.map((image, index) => {
                        return <div className="video-container" key={index}>
                            <img src={videoThumbnail} alt="preview" height={120} width={120} className="image-preview" />
                            <div className="delele-button">
                                <i className="fas fa-trash-alt mt-5" onClick={() => {deleteAcceptedVideoFileFromState(index,image.fileName)}}></i>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>

    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoDropZone);