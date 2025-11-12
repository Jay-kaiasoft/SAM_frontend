import React, { useMemo, useState, useEffect } from "react";
import { connect } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { uploadProfileImage } from '../../../services/userService.js'
import { userLoggedIn } from "../../../actions/userActions.js";
import { getInitials, toBase64 } from "../../../assets/commonFunctions.js";
import { setSubUserAction } from "../../../actions/subUserActions.js";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions.js";

const baseStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: "50%",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    width: 102,
    height: 102,
    maxWidth: 102
};

const img = {
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius:"50%",
    textAlign:"center",
    lineHeight:"90px",
    objectFit:"cover",
    fontSize:"32px"
};
const activeStyle = {
    borderColor: "#2196f3"
};

const acceptStyle = {
    borderColor: "#00e676"
};

const rejectStyle = {
    borderColor: "#ff1744"
};

const DropzoneControle = (props) => {
    const [files, setFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState(props.subUser.memberId > 0 ? props.subUser.imageUrl + `?v=${Math.floor(Math.random() * 100001)}` : props.user.imageUrl + `?v=${Math.floor(Math.random() * 100001)}`);
    const { getRootProps, getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "image/jpeg,image/png",
        noClick: false,
        noKeyboard: true,
        multiple: false,
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length === 1) {
                setFiles(
                    acceptedFiles.map(file =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                );
                if (props.manageusers) {
                    let formData = {
                        "file":await toBase64(acceptedFiles[0]),
                        "fileType":acceptedFiles[0].type
                    }
                    uploadProfileImage(formData).then(resp => {
                        if (resp && resp.result && resp.result.fileDownloadUri) {
                            let imgTemp = resp.result.fileDownloadUri + `?v=${Math.floor(Math.random() * 100001)}`;
                            setImageUrl(imgTemp);
                            if(props.subUser.memberId > 0){
                                props.subUserLoggedIn({...props.subUser, "imageUrl": imgTemp});
                                sessionStorage.setItem('subUser',JSON.stringify({...props.subUser, "imageUrl": imgTemp}));
                                props.subUser.imageUrl=imgTemp;
                            } else {
                                props.userLoggedIn({...props.user, "imageUrl": imgTemp});
                                sessionStorage.setItem('user',JSON.stringify({...props.user, "imageUrl": imgTemp}));
                                props.user.imageUrl=imgTemp;
                            }
                        }
                    })
                }
            }
            if(rejectedFiles.length > 0){
                props.globalAlert({
                    type: "Error",
                    text: "You will not be able to upload this file in this format.\nPlease select .jpg or .png.",
                    open: true
                })
            }
        }
    });
    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }),
        [isDragActive ,isDragAccept ,isDragReject]
    );

    useEffect(
        () => () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <>
            <div {...getRootProps({ style })}>
                <input  {...getInputProps()} />
                {
                    typeof imageUrl !== "undefined" && imageUrl !== "" && imageUrl !== null ?
                        <img className="cursor-pointer" src={imageUrl} alt="logo" style={img} data-toggle="tooltip" data-html={true} title={`Recommend Size : 100 X 100<br/>Type : .jpg, .png`}/>
                    :
                        <div className="cursor-pointer profile-image-upload" data-toggle="tooltip" data-html={true} title={`Recommend Size : 100 X 100<br/>Type : .jpg, .png`}>{props.subUser.memberId > 0 ? getInitials(props.subUser.firstName, props.subUser.lastName) : getInitials(props.user.firstName, props.user.lastName)}</div>
                }
            </div>
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
        userLoggedIn: (data) => {
            dispatch(userLoggedIn(data))
        },
        subUserLoggedIn: (data) => {
            dispatch(setSubUserAction(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DropzoneControle);