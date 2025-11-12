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
const VideoDropZoneLinkedin = ({
    acceptedVideoFilesInStateLin,
    setAcceptedVideoFilesInStateLin,
    deleteAcceptedVideoFileFromStateLin,
    globalAlert,
    setData,
    dataOldVideoLin,
    deleteOldVideoFileFromStateLin,
    videoThumbnailLin,
    setVideoThumbnailLin,
    setLoader
}) => {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject,} = useDropzone({
        accept: "video/mp4",
        noClick: false,
        noKeyboard: true,
        multiple: false,
        onDrop: (acceptedFiles) => {
            const filesUploaded = JSON.parse(JSON.stringify(acceptedFiles)).concat(JSON.parse(JSON.stringify(acceptedVideoFilesInStateLin)));
            if (filesUploaded.length === 1) {
                acceptedFiles.forEach((file) => {
                    getMetadata(file).then(async(fileMeatdata)=>{
                        let fileSize = file.size/Math.pow(1024, 2);
                        let videoDuration = fileMeatdata.duration;
                        let platformSupportSize = 200;
                        let platformSupportDuration = 1800;
                        let sizePlatform = "Linkedin";
                        let durationPlatform = "Linkedin";
                        if(fileSize > platformSupportSize && videoDuration > platformSupportDuration){
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${durationPlatform}, so file size can not be exceeded ${platformSupportSize+" MB"} and video duration can not be exceeded ${(platformSupportDuration/60)+" Minutes"}`,
                                open: true
                            });
                        } else if(fileSize > platformSupportSize) {
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${sizePlatform}, so file size can not be exceeded ${platformSupportSize+" MB"}`,
                                open: true
                            });
                        } else if(videoDuration > platformSupportDuration) {
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${durationPlatform}, so video duration can not be exceeded ${(platformSupportDuration/60)+" Minutes"}`,
                                open: true
                            });
                        } else {
                            let formData = {
                                "file":await toBase64(file),
                                "fileType":file.type,
                                "fileName":file.name
                            }
                            setLoader({
                                load: true,
                                text: "Please wait !!!"
                            });
                            uploadVideo(formData).then((resp) => {
                                setLoader({
                                    load: false
                                });
                                if(resp.status === 200) {
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnailLin(URL.createObjectURL(th[0].blob))});
                                    if (resp && resp.result && resp.result.videoPath) {
                                        const fileToAccept = {
                                            fileName: resp.result.videoName,
                                            pathOnServer: resp.result.videoPath
                                        }
                                        setAcceptedVideoFilesInStateLin(fileToAccept)
                                    }
                                    setData((prev) => {
                                        return {...prev, "smPostVideoLinkedin": resp.result.videoName}
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
            <div className="d-flex mt-3 align-items-center flex-column">
                <h6>
                    <i className="fab fa-linkedin"></i> Linkedin
                </h6>
                {
                    (dataOldVideoLin === "" && acceptedVideoFilesInStateLin.length === 0) &&
                        <div {...getRootProps({ style })} className="w-100">
                    <div id="sm-image-dropzone" className="sm-image-dropzone align-items-center">
                        <i className="far fa-video" style={{fontSize:40}}></i>
                        <span className="mt-2">
                            Linkedin   -  Video Size Limit : 200 MB Video Duration Limit: 30 minutes
                        </span>
                    </div>
                    <input  {...getInputProps()} />
                </div>

                }
                {
                    (dataOldVideoLin !== "" || acceptedVideoFilesInStateLin.length !== 0) &&
                        <div className="video-preview-container w-100 h-100">
                    {
                        dataOldVideoLin !== "" && dataOldVideoLin.split(",").map((image,index)=>{
                            return (
                                <div className="video-container" key={index}>
                                            <img src={videoThumbnailLin} alt="preview" className="video-preview" />
                                    <div className="delele-button">
                                        <i className="fas fa-trash-alt mt-5" onClick={() => { deleteOldVideoFileFromStateLin(index,image) }}></i>
                                    </div>
                                </div>
                            )
                        })
                    }
                            {
                                acceptedVideoFilesInStateLin && acceptedVideoFilesInStateLin.map((image, index) => {
                                    return (
                                        <div className="video-container" key={index}>
                                            <img src={videoThumbnailLin} alt="preview" className="video-preview" />
                            <div className="delele-button">
                                <i className="fas fa-trash-alt mt-5" onClick={() => {deleteAcceptedVideoFileFromStateLin(index,image.fileName)}}></i>
                            </div>
                        </div>
                                    )
                                })
                            }
                </div>
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(VideoDropZoneLinkedin);