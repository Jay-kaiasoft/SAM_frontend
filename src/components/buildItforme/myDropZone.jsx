import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../../assets/commonFunctions";
import { siteURL } from "../../config/api";
import { bfmRemoveFile, bfmUploadFile } from "../../services/buildItForMeService";

function MyDropzone({ data, setData, globalAlert, id, oldBfmAttachmentFile, setOldBfmAttachmentFile, user }) {
    const [files, setFiles] = useState([]);
    const onDrop = useCallback(async (acceptedFiles) => {
        let formData = {
            "file": await toBase64(acceptedFiles[0]),
            "fileType": acceptedFiles[0].type,
            "fileName": acceptedFiles[0].name
        }
        bfmUploadFile(formData).then(res => {
            if (res.status === 200) {
                setFiles((prev) => {
                    return [...prev, acceptedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    }))];
                })
                if (data.bfmAttachmentFile === "") {
                    setData((prev) => {
                        return { ...prev, "bfmAttachmentFile": acceptedFiles[0].name };
                    });
                } else {
                    setData((prev) => {
                        return { ...prev, "bfmAttachmentFile": prev.bfmAttachmentFile + "," + acceptedFiles[0].name };
                    });
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }, [data, setData, globalAlert]);
    const { getRootProps, getInputProps, } = useDropzone({
        noClick: false,
        noKeyboard: true,
        onDrop: onDrop
    });
    const deleteImage = (index, name) => {
        let bfmId = 0;
        bfmRemoveFile(bfmId, name).then(res => {
            if (res.status === 200) {
                setFiles(files.filter((f, i) => { return i !== index }));
                setData((prev) => {
                    return { ...prev, "bfmAttachmentFile": prev.bfmAttachmentFile.split(",").filter((f, i) => { return i !== index }).join(",") };
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const deleteOldImage = (index, name) => {
        let bfmId = typeof id !== "undefined" ? id : 0;
        bfmRemoveFile(bfmId, name).then(res => {
            if (res.status === 200) {
                setData((prev) => {
                    return { ...prev, "bfmAttachmentFile": prev.bfmAttachmentFile.split(",").filter((f, i) => { return f !== name }).join(",") };
                });
                setOldBfmAttachmentFile((prev) => {
                    return prev.split(",").filter((f, i) => { return i !== index }).join(",")
                })
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        })
    }
    const handleClickDownload = (name) => {
        if (name !== "") {
            window.open(siteURL + "/easdrive/" + user.memberId + "/images/builditforme/" + name);
        }
    }
    const thumbs = files.map((file, index) => (
        <div className="thumb" key={index}>
            <div className="thumbInner">
                <img src={file[0].preview} alt="Preview Thumb" />
            </div>
            <i className="far fa-times closeButton" onClick={() => { deleteImage(index, file[0].name) }}></i>
        </div>
    ));

    useEffect(() => {
        files.forEach(file => URL.revokeObjectURL(file[0].preview));
    }, [files]);
    return (
        <>
            <div {...getRootProps()} className="dropzone-init mb-0">
                <input {...getInputProps()} />
                <p className="mb-0">Drop the file here to upload...</p>
            </div>
            <p style={{ fontSize: 10 }}>
                We take PSD, PNG, AI, PDF, EPS or even JPEG. Please include custom fonts if necessary. Multiple files supported. Max size per file is 256MB.
            </p>
            {
                typeof id !== "undefined" && id !== 0 ?
                    oldBfmAttachmentFile !== "" ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Files</th>
                                    <th className="text-right" width="10%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    oldBfmAttachmentFile.split(",").map((v, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ wordWrap: "anywhere" }}>{v}</td>
                                                <td align="center">
                                                    <i className="fas fa-file-download mr-2" data-toggle="tooltip" title="Download File" onClick={() => { handleClickDownload(v) }}></i>
                                                    <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={() => { deleteOldImage(i, v) }}></i>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        : null
                    : null
            }
            <aside className="thumbsContainer">
                {thumbs}
            </aside>
        </>
    )
}

export default MyDropzone