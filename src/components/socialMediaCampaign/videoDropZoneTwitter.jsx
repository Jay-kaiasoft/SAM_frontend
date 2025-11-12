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
const VideoDropZoneTwitter = ({
    acceptedVideoFilesInStateTwt,
    setAcceptedVideoFilesInStateTwt,
    deleteAcceptedVideoFileFromStateTwt,
    globalAlert,
    setData,
    dataOldVideoTwt,
    deleteOldVideoFileFromStateTwt,
    videoThumbnailTwt,
    setVideoThumbnailTwt,
    setLoader
}) => {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject,} = useDropzone({
        accept: "video/mp4",
        noClick: false,
        noKeyboard: true,
        multiple: false,
        onDrop: (acceptedFiles) => {
            
            const filesUploaded = JSON.parse(JSON.stringify(acceptedFiles)).concat(JSON.parse(JSON.stringify(acceptedVideoFilesInStateTwt)));
            if (filesUploaded.length === 1) {
                acceptedFiles.forEach((file) => {
                    getMetadata(file).then(async(fileMeatdata)=>{
                        let fileSize = file.size/Math.pow(1024, 2);
                        let videoDuration = fileMeatdata.duration;
                        let platformSupportSize = 512;
                        let platformSupportDuration = 140;
                        let sizePlatform = "Twitter";
                        let durationPlatform = "Twitter";
                        if(fileSize > platformSupportSize && videoDuration > platformSupportDuration){
                            globalAlert({
                                type: "Error",
                                text: `File can not be uploaded because you have selected ${durationPlatform}, so file size can not be exceeded ${platformSupportSize+" MB"} and video duration can not be exceeded 2 Minutes`,
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
                                text: `File can not be uploaded because you have selected ${durationPlatform}, so video duration can not be exceeded 2 Minutes`,
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
                                    getThumbnails(file, {quality: 0.6, start: 1, end: 1}).then((th)=>{setVideoThumbnailTwt(URL.createObjectURL(th[0].blob))});
                                    if (resp && resp.result && resp.result.videoPath) {
                                        const fileToAccept = {
                                            fileName: resp.result.videoName,
                                            pathOnServer: resp.result.videoPath
                                        }
                                        setAcceptedVideoFilesInStateTwt(fileToAccept)
                                    }
                                    setData((prev) => {
                                        return {...prev, "smPostVideoTwitter": resp.result.videoName}
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
                <h6 className="">
                    <i className="fab fa-twitter"></i> Twitter
                </h6>
                {
                    (dataOldVideoTwt === "" && acceptedVideoFilesInStateTwt.length === 0) &&
                        <div {...getRootProps({ style })} className="w-100">
                    <div id="sm-image-dropzone" className="sm-image-dropzone align-items-center">
                        <i className="far fa-video" style={{fontSize:40}}></i>
                        <span className="mt-2">
                            Twitter    -  Video Size Limit : 512 MB Video Duration Limit:  2 minutes
                        </span>
                    </div>
                    <input  {...getInputProps()} />
                </div>
                }
                {
                    (dataOldVideoTwt !== "" || acceptedVideoFilesInStateTwt.length !== 0) &&
                        <div className="video-preview-container w-100 h-100">
                    {
                        dataOldVideoTwt !== "" && dataOldVideoTwt.split(",").map((image,index)=>{
                            return (
                                <div className="video-container" key={index}>
                                            <img src={videoThumbnailTwt} alt="preview" className="video-preview" />
                                    <div className="delele-button">
                                        <i className="fas fa-trash-alt mt-5" onClick={() => { deleteOldVideoFileFromStateTwt(index,image) }}></i>
                                    </div>
                                </div>
                            )
                        })
                    }
                            {
                                acceptedVideoFilesInStateTwt && acceptedVideoFilesInStateTwt.map((image, index) => {
                                    return (
                                        <div className="video-container" key={index}>
                                            <img src={videoThumbnailTwt} alt="preview" className="video-preview" />
                            <div className="delele-button">
                                <i className="fas fa-trash-alt mt-5" onClick={() => {deleteAcceptedVideoFileFromStateTwt(index,image.fileName)}}></i>
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
export default connect(mapStateToProps, mapDispatchToProps)(VideoDropZoneTwitter);