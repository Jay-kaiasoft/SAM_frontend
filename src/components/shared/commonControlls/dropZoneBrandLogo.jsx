import React, { useEffect, useMemo, useState } from "react";
import { connect } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { Col, Row } from 'reactstrap';
import { toBase64 } from "../../../assets/commonFunctions.js";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions.js";
import { uploadFileED } from "../../../services/myDesktopService.js";

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
    width: "55%",
    height: 150,
    maxWidth: "55%"
};
const img = {
    maxWidth: 200,
    maxHeight: 100,
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

const DropZoneBrandLogo = (props) => {
    const [imageUrl, setImageUrl] = useState(props.brandLogo);
    const { getRootProps, getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "image/jpeg,image/png,image/gif",
        noClick: false,
        noKeyboard: true,
        multiple: false,
        onDrop: async (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length === 1) {
                const form = new FormData();
                form.append('file', acceptedFiles[0]);
                form.append('fileType', acceptedFiles[0].type);
                form.append('fileURL', await toBase64(acceptedFiles[0]));
                let folderName = "Logos";
                // let folderName = props.brandWebsite.replaceAll("http://","").replaceAll("https://","").replaceAll("ftp://","").replaceAll("www.","").replaceAll("/","");
                uploadFileED(folderName,form).then(res => {
                    if (res.status === 200) {
                        let tempImageUrl = res.result.imageUrl;
                        props.handleChangeLogo(tempImageUrl);
                        setImageUrl(tempImageUrl);
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
    useEffect(()=>{
        setImageUrl(props.brandLogo);
    },[props.brandLogo]);
    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }),
        [isDragActive ,isDragAccept ,isDragReject]
    );
    return (
        <>
            <Row className="mb-3">
                <Col xs={12} className="d-flex justify-content-center">
                    <div {...getRootProps({ style })} data-toggle="tooltip" data-html={true} title={`Type : .jpg, .jpeg, .png, .gif`}>
                        <input  {...getInputProps()} />
                        {
                            typeof imageUrl !== "undefined" && imageUrl !== "" && imageUrl !== null ?
                                "Click To Change A Brand Logo"
                            :
                                "Click To Upload A Brand Logo"
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
export default connect(null,mapDispatchToProps)(DropZoneBrandLogo);