import React, { useEffect, useMemo, useState } from "react";
import { connect } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { Col, Row } from 'reactstrap';
import { uploadWhiteListingLogo } from '../../../services/userService.js'
import { toBase64 } from "../../../assets/commonFunctions.js";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions.js";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    width: "65%",
    height: 300,
    maxWidth: "65%"
};
const img = {
    maxWidth: 300,
    maxHeight: 150,
    marginTop: 10
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

const DropZoneEmailFooter = (props) => {
    const [imageUrl, setImageUrl] = useState("");
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
                let formData = {
                    "file":await toBase64(acceptedFiles[0]),
                    "fileType":acceptedFiles[0].type
                }
                uploadWhiteListingLogo(formData).then(resp => {
                    if (resp && resp.result && resp.result.fileDownloadUri) {
                        let tempImageUrl = resp.result.fileDownloadUri + `?v=${Math.floor(Math.random() * 100001)}`
                        setImageUrl(tempImageUrl);
                        props.setData((prev) => {
                            return { ...prev, "whiteListingLogo": tempImageUrl };
                        });
                    }
                })
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
    useEffect(()=>{
        if(props.data.whiteListingLogo !== ""){
            setImageUrl(`${props.data.whiteListingLogo}?v=${Math.floor(Math.random() * 100001)}`);
        }
    },[props.data.whiteListingLogo]);
    return (
        <>
            <Row className="mb-3">
                <Col xs={12} className="d-flex justify-content-center">
                    <div {...getRootProps({ style })} data-toggle="tooltip" data-html={true} title={`Type : .jpg, .png`}>
                        <input  {...getInputProps()} />
                        {
                            typeof imageUrl !== "undefined" && imageUrl !== "" && imageUrl !== null ?
                                "Click To Change An Image"
                            :
                                "Click To Upload An Image"
                        }
                        {
                            typeof imageUrl !== "undefined" && imageUrl !== "" && imageUrl !== null ?
                                <img src={imageUrl} alt="logo" style={img} />
                            : null
                        }
                    </div>
                </Col>
            </Row>
        </>

    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(DropZoneEmailFooter);