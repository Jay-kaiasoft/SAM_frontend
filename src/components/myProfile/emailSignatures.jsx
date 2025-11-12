import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button, Link, TextField } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import {EditorState, ContentState, convertToRaw} from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { connect } from "react-redux";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { deleteEmailSignature, getEmailSignatureList, saveEmailSignature } from "../../services/profileService";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";

const toolbarProperties = {
    options: ['inline', 'list', 'link', 'emoji', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    list: {
        options: ['unordered', 'ordered'],
    }
}

const EmailSignatures = ({ globalAlert, confirmDialog, subUser }) => {
    const [signatureData, setSignatureData] = useState({signId: 0, signTitle: "", signDescription: EditorState.createEmpty()});
    const [dataList, setDataList] = useState([]);
    const [modalAddSignature, setModalAddSignature] = useState(false);
    const toggleAddSignature = () => { 
        if (modalAddSignature) {
            setSignatureData({signId: 0, signTitle: "", signDescription: EditorState.createEmpty()});
        }
        setModalAddSignature(!modalAddSignature); 
    };

    const handleChangeData = (name, value) => {
        setSignatureData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    const handleClickEdit = (signId) => {
        const signature = dataList.find(item => item.signId === signId);
        if (signature) {
            setSignatureData({
                signId: signature.signId,
                signTitle: signature.signTitle,
                signDescription: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(signature.signDescription).contentBlocks))
            });
        }
        toggleAddSignature();
    }
    const handleClickDelete = (signId) => {
        confirmDialog({
            open: true,
            title: 'Are you sure you want to delete this signature?',
            onConfirm: () => {
                let requestData = { signId: [signId] };
                deleteEmailSignature(requestData).then((res) => {
                    if (res.status === 200) {
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                        displayEmailSignatureList();
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const handleClickSave = () => {
        if(signatureData.signTitle.trim() === "") {
            globalAlert({
                type: "Error",
                text: "Please enter signature title.",
                open: true
            });
            return;
        }
        const contentState = signatureData.signDescription.getCurrentContent();
        const plainText = contentState.getPlainText().trim();
        if (!plainText) {
            globalAlert({
                type: "Error",
                text: "Please enter signature content.",
                open: true
            });
            return;
        }
        let requestData = {
            signId: signatureData.signId,
            signTitle: signatureData.signTitle,
            signDescription: draftToHtml(convertToRaw(signatureData.signDescription.getCurrentContent())).replace(/\n$/, ''),
            subMemberId: subUser.memberId
        };
        saveEmailSignature(requestData).then((res) => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
                toggleAddSignature();
                displayEmailSignatureList();
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const displayEmailSignatureList = useCallback(() => {
        getEmailSignatureList().then((res) => {
            if(res.status === 200) {
                let tempEmailSignature = res.result.emailSignature || [];
                tempEmailSignature.map(item => {
                    let description = item?.signDescription === null || item?.signDescription === "null" ? "" : item?.signDescription;
                    description = EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(description).contentBlocks));
                    const contentState = description.getCurrentContent();
                    item.displaySignDescription = contentState.getPlainText().trim();
                    return item;
                });
                setDataList(tempEmailSignature || []);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }, []);

    useEffect(() => {
        displayEmailSignatureList();
    }, [displayEmailSignatureList]);

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className='text-center mb-5'>
                        <h3 className="d-inline-block mb-0 align-middle">Manage Email Signatures</h3>
                        <div className="icon-wrapper d-inline-block mx-5">
                            <Link component="a" className="btn-circle" data-toggle="tooltip" title="Add" onClick={()=>{ toggleAddSignature(); }}>
                                <i className="far fa-plus-square"></i>
                                <div className="bg-green"></div>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={8} lg={8} xl={8} className="mx-auto">
                    <div className="table-content-wrapper">
                        <Table striped>
                            <thead>
                                <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                                    <td width="30%">Signature Title</td>
                                    <td width="60%">Signature</td>
                                    <td width="10%" align="center">Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataList.length > 0 ? (
                                        dataList.map((item) => (
                                            <tr key={item.signId}>
                                                <td>{item.signTitle}</td>
                                                <td className="text-overflow-ellipsis overflow-hidden" style={{ maxWidth: "50px" }}>{item.displaySignDescription}</td>
                                                <td align="center">
                                                    <i className="far fa-pencil-alt mr-3" data-toggle="tooltip" title="Edit" onClick={() => { handleClickEdit(item.signId); }}></i>
                                                    <i className="far fa-trash-alt" data-toggle="tooltip" title="Delete" onClick={() => { handleClickDelete(item.signId); }}></i>
                                                </td>
                                            </tr>
                                        ))
                                    ) : ( 
                                        <tr>
                                            <td colSpan="3" className="text-center">No Signatures Found</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={modalAddSignature} toggle={toggleAddSignature}>
                <ModalHeader>Your Signature Information</ModalHeader>
                <ModalBody>
                    <TextField
                        variant="standard"
                        label="Signature Title"
                        value={signatureData?.signTitle || ""}
                        onChange={(e) => handleChangeData("signTitle", e.target.value)}
                        fullWidth
                    />
                    <div className="d-flex mt-3">
                        <Editor
                            editorState={signatureData.signDescription}
                            wrapperClassName="wrapper-class d-inline-block"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            onEditorStateChange={(state) => {
                                handleChangeData("signDescription", state);
                            }}
                            toolbar={toolbarProperties}
                            wrapperStyle={{width:"100%", height:"100%"}}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="contained" color="primary" onClick={() => { handleClickSave(); }} className="mr-3">SAVE</Button>
                    <Button variant="contained" color="primary" onClick={() => { toggleAddSignature(); }}>CANCEL</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailSignatures);