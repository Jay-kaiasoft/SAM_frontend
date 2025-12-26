import { useMemo, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from "reactstrap";
import { Autocomplete, Button, TextField } from "@mui/material";
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

const members = [
    { id: 1, email: "jhon@gmail.com" },
    { id: 2, email: "tom@gmail.com" },
    { id: 3, email: "smith@gmail.com" },
];

const SendMailModel = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // ✅ separate state for To/From
    const [toIds, setToIds] = useState([]);
    const [fromIds, setFromIds] = useState([]);

    const toValue = useMemo(
        () => members.filter((m) => toIds.includes(m.id)),
        [toIds]
    );
    const fromValue = useMemo(
        () => members.filter((m) => fromIds.includes(m.id)),
        [fromIds]
    );

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

                    {/* To */}
                    <div className="d-flex align-items-start w-100 mb-4" style={{ gap: 16 }}>
                        <div style={{ width: 80, fontWeight: 700, paddingTop: 10 }}>To</div>

                        <div className="flex-grow-1">
                            <Autocomplete
                                multiple
                                disablePortal // ✅ keeps dropdown inside modal to avoid stacking/clipping issues
                                options={members}
                                value={toValue}
                                onChange={(_, v) => setToIds(v.map((x) => x.id))}
                                getOptionLabel={(o) => o?.email || ""}
                                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                PopperProps={{
                                    style: { zIndex: 2000 }, // ✅ extra safety on z-index
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Select recipient(s)"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            style: { paddingTop: 6 },
                                        }}
                                    />
                                )}
                                sx={{
                                    "& .MuiAutocomplete-tag": {
                                        borderRadius: "8px",
                                        marginBottom: "10px"
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* From */}
                    <div className="d-flex align-items-start w-100 mb-4" style={{ gap: 16 }}>
                        <div style={{ width: 80, fontWeight: 700, paddingTop: 10 }}>From</div>

                        <div className="flex-grow-1">
                            <Autocomplete
                                multiple
                                disablePortal
                                options={members}
                                value={fromValue}
                                onChange={(_, v) => setFromIds(v.map((x) => x.id))}
                                getOptionLabel={(o) => o?.email || ""}
                                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                PopperProps={{
                                    style: { zIndex: 2000 },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Select sender(s)"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            style: { paddingTop: 6 },
                                        }}
                                    />
                                )}
                                sx={{
                                    "& .MuiAutocomplete-tag": {
                                        borderRadius: "8px",
                                        marginBottom: "10px"
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="d-flex align-items-start w-100 mb-3" style={{ gap: 16 }}>
                        <div style={{ width: 80, fontWeight: 700, paddingTop: 10 }}>Subject</div>
                        <div className="flex-grow-1">
                            <TextField
                                variant="standard"
                                fullWidth
                                placeholder="Enter subject"
                            />
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="mt-3">
                        <div
                            className="border rounded"
                            style={{ borderColor: "#e5e7eb" }}
                        >
                            <Editor
                                editorState={editorState}
                                toolbar={toolbarProperties}
                                onEditorStateChange={setEditorState}
                                toolbarClassName="px-2 border-bottom"
                                wrapperClassName="w-100"
                                editorClassName="px-3"
                                editorStyle={{ minHeight: 160 }}
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end px-4">
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        SEND
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className="mr-3">
                        SEND LATER
                    </Button>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        CANCEL
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default SendMailModel;
