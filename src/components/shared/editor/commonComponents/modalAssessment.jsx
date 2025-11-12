import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "@mui/material";

const ModalAssessment = ({modalAssessmentsTags,toggleAssessmentsTags}) => {
    return (
        <>
            <Modal isOpen={modalAssessmentsTags} toggle={toggleAssessmentsTags}>
                <ModalHeader toggle={toggleAssessmentsTags}>Assessments Link</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label><strong>Select Assessments</strong></label>
                        <select id="asmtsel" className="w-100"></select>
                    </div>
                    <div className="form-group">
                        <label style={{display: "inline-block", paddingBottom: "0px"}}><strong>URL : </strong></label>
                        <div id="asmturldiv"></div>
                        <input placeholder="Url" id="asmturl" type="hidden"/>
                    </div>
                    <div className="form-group">
                        <label><strong>Title</strong></label>
                        <input className="w-100" type="text" placeholder="Title" id="asmttitle"/>
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label>
                                <input value="yes" id="asmtlinkasbtn" type="checkbox"/>Show as button
                            </label>
                        </div>
                        <div id="asmtbtndesignall">
                            <div className="font-weight-bold">Button Preview</div>
                            <div className="asmtbtndesignbtn"><a href="/#" className="bttn btn-secondary" onClick={(e)=>{e.preventDefault()}}>Button</a></div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Button Color</strong></label>
                                    <input type="text" id="asmtbackclrbox" defaultValue="#6c757d"/>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Text Color</strong></label>
                                    <input type="text" id="asmttextclrbox" defaultValue="#6c757d"/>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Style</strong></label>
                                    <div id="asmtbtnstyle">
                                        <input id="asmtbtnsol" name="asmtbtnstygrp" type="radio" defaultChecked="checked"/><span>Solid</span> <input id="asmtbtnout" name="asmtbtnstygrp" type="radio"/><span>Outline</span>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Width</strong></label>
                                    <div id="asmtbtnsty">
                                        <input id="asmtbtndef" name="asmtbtngrp" type="radio" defaultChecked="checked" defaultValue="d"/><span>Default</span> <input id="asmtbtncus" name="asmtbtngrp" type="radio" defaultValue="c"/><span>Custom</span>
                                    </div>
                                    <div id="asmtbtnwthbox">
                                        <input type="text" id="asmtbtnwth" defaultValue="300"/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label><strong>Set Border Style</strong></label>
                                    <div>
                                        <select id="asmtbtnbrdstyle" className="form-control">
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                            <option value="double">Double</option>
                                            <option value="groove">Groove</option>
                                            <option value="ridge">Ridge</option>
                                            <option value="inset">Inset</option>
                                            <option value="outset">Outset</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label><strong>Set Border Size</strong></label>
                                    <div>
                                        <input type="text" id="asmtbtnbrdsize" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="mb-0"><strong>Set Border Color</strong></label>
                                    <div>
                                        <input type="text" id="asmtbtnbrdclrbox" defaultValue="#6c757d"/>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label><strong>Set Border Radius</strong></label>
                                    <div>
                                        <input type="text" id="asmtbtnbrdradius" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <label><strong>Set Padding</strong></label>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <label><strong>Top</strong></label>
                                        <div>
                                            <input type="text" id="asmtbtnpadtop" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Bottom</strong></label>
                                        <div>
                                            <input type="text" id="asmtbtnpadbottom" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Left</strong></label>
                                        <div>
                                            <input type="text" id="asmtbtnpadleft" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Right</strong></label>
                                        <div>
                                            <input type="text" id="asmtbtnpadright" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button id="asmt_save_tooltips" variant="contained" color="primary" className="mr-3" onClick={()=>toggleAssessmentsTags()}>SAVE</Button>
                    <Button id="asmt_close_tooltips" variant="contained" color="primary" onClick={()=>toggleAssessmentsTags()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickAssessmentsTags" onClick={()=>{toggleAssessmentsTags()}}/>
        </>
    );
}

export default ModalAssessment;