import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap";
import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const toolbarProperties = {
    options: ['inline', 'list', 'link', 'emoji', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    list: {
        options: ['unordered', 'ordered'],
    }
}

const SendMailModel = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            groupName: "",
        },
    });

    const onSubmit = (data) => {
        onClose();
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered size="lg">
            <ModalHeader toggle={onClose}>Email</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className="px-4 py-3" style={{ overflow: "visible" }}>
                    <Row className="mb-4">
                        <Col sm={12}>
                            <div className="d-flex justify-content-start align-items-center">
                                {["Templates", "Sequences", "Documents", "Meeting", "Quotes"].map(
                                    (tab, index) => (
                                        <div
                                            key={tab}
                                            className={`contact-tab ${activeTab === index
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                setActiveTab(index)
                                            }
                                        >
                                            {tab}
                                        </div>
                                    )
                                )}
                            </div>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-start align-items-center w-100 mb-4" style={{ gap: 10 }}>
                        <span style={{ fontWeight: "bold", width: "10%" }}>
                            To
                        </span>
                        <div className="w-100">
                            <TextField
                                variant="standard"
                                fullWidth
                                // label="Task"
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-start align-items-center w-100 mb-4" style={{ gap: 10 }}>
                        <span style={{ fontWeight: "bold", width: "10%" }}>
                            From
                        </span>
                        <div className="w-100">
                            <TextField
                                variant="standard"
                                fullWidth
                                // label="Task"
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-start align-items-center w-100 mb-4" style={{ gap: 10 }}>
                        <span style={{ fontWeight: "bold", width: "10%" }}>
                            Subject
                        </span>
                        <div className="w-100">
                            <TextField
                                variant="standard"
                                fullWidth
                                // label="Task"
                                placeholder="Enter subject"
                            />
                        </div>
                    </div>

                    <div style={{ position: "relative" }}>
                        <Editor
                            editorState={editorState}
                            wrapperClassName="wrapper-class d-inline-block"
                            // editorClassName="editor-class"
                            toolbarClassName="editor-toolbar-custom"
                            onEditorStateChange={(state) => {
                                setEditorState(state)
                            }}
                            toolbar={toolbarProperties}
                            wrapperStyle={{ width: "98%" }}
                        />

                    </div>
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end px-4">
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        Send
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        Send Later
                    </Button>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default SendMailModel;
