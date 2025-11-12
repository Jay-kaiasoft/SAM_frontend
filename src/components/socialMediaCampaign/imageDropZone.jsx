import React, { useMemo } from "react";
import {connect} from "react-redux";
import { useDropzone } from "react-dropzone";
import {uploadImage} from "../../services/socialMediaService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {siteURL} from "../../config/api";
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
const ImageDropZone = ({
    acceptedFilesInState,
    setAcceptedFilesInState,
    deleteAcceptedFileFromState,
    globalAlert,
    smPostImage,
    setData,
    dataOldImages,
    deleteOldFileFromState,
    user,
    setLoader
}) => {
    const { getRootProps, getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "image/*",
        noClick: false,
        noKeyboard: true,
        multiple: true,
        maxFiles: 5,
        onDrop: (acceptedFiles) => {
            const filesUploaded = JSON.parse(JSON.stringify(acceptedFiles)).concat(JSON.parse(JSON.stringify(acceptedFilesInState)));
            if (filesUploaded.length <= 10) {
                acceptedFiles.forEach(async(file) => {
                    let formData = {
                        "file":await toBase64(file),
                        "fileType":file.type,
                        "fileName":file.name
                    }
                    setLoader({
                        load: true,
                        text: "Please wait !!!"
                    });
                    uploadImage(formData).then((resp) => {
                        setLoader({
                            load: false
                        });
                        if(resp.status === 200) {
                            if (resp && resp.result && resp.result.imagePath) {
                                const fileToAccept = {
                                    fileName: resp.result.imageName,
                                    pathOnServer: resp.result.imagePath
                                }
                                setAcceptedFilesInState(fileToAccept)
                            }
                            setData((prev) => {
                                return {...prev, "smPostImage": prev.smPostImage === "" ?resp.result.imageName:prev.smPostImage+","+resp.result.imageName}
                            })
                        }
                    })
                })
            } else {
                globalAlert({
                    type: "Error",
                    text: `Only 10 images can be selected. You already selected ${acceptedFilesInState.length} images`,
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
            <div {...getRootProps({ style })}>
                <div id="sm-image-dropzone" className="sm-image-dropzone mt-3">
                    <i className="far fa-image" style={{fontSize:40}}></i>
                    <span className="mt-2">LinkedIn Only Allows One Image. First Image Will Be Used.
                        <br/>Twitter Allows Max 4.
                    </span>
                </div>
                <input  {...getInputProps()} />
            </div>
            <div className="image-preview-container">
                {
                    dataOldImages !== "" && dataOldImages.split(",").map((image,index)=>{
                        return <div className="image-container" key={index}>
                            <img src={`${siteURL}/easdrive/${user.memberId}/images/socialmedia/${image}`} alt="preview" height={120} width={120} className="image-preview" />
                            <div className="delele-button">
                                <i className="fas fa-trash-alt mt-5" onClick={() => { deleteOldFileFromState(index,image) }}></i>
                            </div>
                        </div>
                    })
                }
                {acceptedFilesInState && acceptedFilesInState.map((image, index) => {
                    return <div className="image-container" key={index}>
                        <img src={image.pathOnServer} alt="preview" height={120} width={120} className="image-preview" />
                        <div className="delele-button">
                            <i className="fas fa-trash-alt mt-5" onClick={() => { deleteAcceptedFileFromState(index,image.fileName) }}></i>
                        </div>
                    </div>
                })}
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
export default connect(mapStateToProps, mapDispatchToProps)(ImageDropZone);