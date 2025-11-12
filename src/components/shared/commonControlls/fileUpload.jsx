import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { deleteFile, uploadFile } from "../../../services/supportService";
import { Button } from "@mui/material";

const activeStyle = {
    borderColor: "#2196f3",
};
const acceptStyle = {
    borderColor: "#00e676",
};
const rejectStyle = {
    borderColor: "#ff1744",
};

function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result);
    };
    reader.onerror = function (error) {
        console.log("Error: ", error);
    };
}

const FileUpload = ({
    title = "",
    label = "Upload File Here",
    url = "",
    deleteUrl = "",
    className = "",
    onFileUpload = () => { },
    showButton = false,
    showAttachments = true,
    attachments = [],
}) => {
    const [acceptedFilesInState, setAcceptedFiles] = useState(attachments || []);
    useEffect(() => {
        setAcceptedFiles(attachments);
    }, [attachments]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        noClick: false,
        noKeyboard: true,
        multiple: true,
        onDrop: (acceptedFiles) => {
            acceptedFiles.forEach((file) => {
                handleSaveFile(file);
            });
        },
    });

    const handleSaveFile = async (file) => {
        getBase64(file, (base64) => {
            const payload = {
                file: base64,
                fileType: file.type,
                fileName: file.name,
            };
            uploadFile(url, payload).then((res) => {
                if (res?.status === 200) {
                    const { fileName, fileDownloadUri, path } = res?.result;
                    onFileUpload([
                        ...acceptedFilesInState,
                        { fileName, fileDownloadUri: fileDownloadUri || path },
                    ]);
                    setAcceptedFiles((prev) => {
                        return [...prev, { fileName, fileDownloadUri }];
                    });
                }
            });
        });
    };

    const deleteAcceptedFileFromState = (file, index) => {
        if (deleteUrl) {
            const deleteUrlTemp = deleteUrl.replace("{fileName}", file.fileName);
            deleteFile(deleteUrlTemp).then((res) => {
                if (res.status === 200) {
                    const currentFiles = [...acceptedFilesInState];
                    currentFiles.splice(index, 1);
                    setAcceptedFiles(currentFiles);
                }
            });
        } else {
            const currentFiles = [...acceptedFilesInState];
            currentFiles.splice(index, 1);
            setAcceptedFiles(currentFiles);
        }
    };

    const style = useMemo(
        () => ({
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragAccept, isDragReject]
    );
    return (
        <div className={className}>
            {title ? (
                <p className="upload-title">
                    {title}
                </p>
            ) : null}
            <div {...getRootProps({ style })}>
                {!showButton ? (
                    <div
                        id="sm-image-dropzone"
                        className="upload-container"
                    >
                        <p className="upload-label">
                            {label}
                        </p>
                    </div>
                ) : (
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        <div>
                            <i className="far fa-paperclip mr-2"></i>
                            <span>Attachment</span>
                        </div>
                    </Button>
                )}
                <input {...getInputProps()} />
            </div>
            {showAttachments ? (
                <div className="mt-2">
                    {acceptedFilesInState &&
                        acceptedFilesInState.map((file, index) => {
                            return (
                                <div className="file-main-container" key={index}>
                                    <p className="file-label mb-0">{file.fileName}</p>
                                    <i
                                        className="far fa-times"
                                        onClick={() => {
                                            deleteAcceptedFileFromState(file, index);
                                        }}
                                    ></i>
                                </div>
                            );
                        })}
                </div>
            ) : (
                false
            )}
        </div>
    );
};

export default FileUpload;
