import React from 'react';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Button, Link} from "@mui/material";
import { handleClickHelp } from '../../../../assets/commonFunctions';
import DialogConfirmSimple from '../../commonControlls/dialogConfirmSimple';

const ModalOpenAi = ({modalOpenAi,toggleOpenAi}) => {
    return(
        <>
            <Modal id="modalopenai" size="lg" isOpen={modalOpenAi} toggle={toggleOpenAi}>
                <ModalHeader toggle={toggleOpenAi}>Content With AI Assistant</ModalHeader>
                <ModalBody>
                    <div id="openaistyle" className="d-flex justify-content-between align-items-center">
                        <div>
                            <input id="openaiwrite" name="openaicontent" type="radio" defaultChecked="checked"/><span className="mr-3">Write New Content</span> <input id="openairewrite" name="openaicontent" type="radio"/><span>Rewrite Content</span>
                        </div>
                        <Link component="a" className="btn-circle" data-toggle="tooltip" title="Help Text" onClick={()=>{handleClickHelp("AI/AI/AIandEmail.html")}} style={{ zIndex: "9" }}>
                        <i className="far fa-question-circle"></i>
                        <div className="bg-grey"></div>
                    </Link>
                    </div>
                    <div className="mt-3" id="suggestionmain" style={{display:"none"}}>
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="mb-0"><strong>Suggestion</strong></label>
                            <div>
                                <i id="suggestionprev" className="fas fa-chevron-left mr-2 cursor-not-allowed"></i>
                                <span id="suggestionindex">1</span>
                                <span className="mx-2">/</span>
                                <span id="suggestiontotal">1</span>
                                <i id="suggestionnext" className="fas fa-chevron-right ml-2"></i>
                            </div>
                            <Button id="useit_openaistg" variant="contained" color="primary">USE IT</Button>
                        </div>
                        <hr/>
                        <div id="suggestiontext" className="white-space-pre-line bg-gray p-2 rounded"></div>
                    </div>
                    <div className="mt-3" id="writetoaskmain">
                        <label><strong>Provide Writing Instructions To The AI</strong></label>
                        <div className="d-flex position-relative">
                            <Link component="a" id="write_new" className="btn-circle active position-absolute" data-toggle="tooltip" title="New Topic" style={{ zIndex: "9" }}>
                                <i className="far fa-plus"></i>
                                <div className="bg-blue"></div>
                            </Link>
                            <input type="text" id="writetoask" className="w-100 rounded" defaultValue=""/>
                            <Link component="a" id="write_openaistg" className="btn-circle active position-absolute" data-toggle="tooltip" title="Go" style={{ zIndex: "9" }}>
                                <i className="far fa-arrow-right"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        </div>
                        <span className="font-size-12">AI may produce inaccurate content, you are responsible for your content.</span>
                    </div>
                    <div className="mt-3" id="rewritethecontentmain" style={{display:"none"}}>
                        <label><strong>Original Content</strong></label>
                        <div id="rewriteoriginalcontent" className="mb-2"></div>
                        <label><strong>Provide Writing Instructions To The AI</strong></label>
                        <div className="d-flex position-relative">
                            <Link component="a" id="rewrite_new" className="btn-circle active position-absolute" data-toggle="tooltip" title="New Topic" style={{ zIndex: "9" }}>
                                <i className="far fa-plus"></i>
                                <div className="bg-blue"></div>
                            </Link>
                            <input type="text" id="rewritethecontent" className="w-100 rounded" defaultValue=""/>
                            <Link component="a" id="rewrite_openaistg" className="btn-circle active position-absolute" style={{ zIndex: "9" }}>
                                <i className="far fa-arrow-right"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        </div>
                        <span className="font-size-12">AI may produce inaccurate content, you are responsible for your content.</span>
                    </div>
                </ModalBody>
            </Modal>
            <input type="hidden" id="clickOpenAiModal" onClick={()=>{toggleOpenAi()}}/>
            <DialogConfirmSimple />
        </>
    );
}

export default ModalOpenAi;