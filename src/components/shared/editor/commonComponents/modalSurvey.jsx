import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "@mui/material";

const ModalSurvey = ({modalSurveysTags,toggleSurveysTags}) => {
    return (
        <>
            <Modal isOpen={modalSurveysTags} toggle={toggleSurveysTags}>
                <ModalHeader toggle={toggleSurveysTags}>Surveys Link</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label><strong>Select Survey</strong></label>
                        <select id="sursel"></select>
                    </div>
                    <div className="form-group">
                        <label style={{display: "inline-block", paddingBottom: "0px"}}><strong>URL : </strong></label>
                        <div id="sururldiv"></div>
                        <input placeholder="Url" id="sururl" type="hidden" />
                    </div>
                    <div className="form-group">
                        <label><strong>Title</strong></label>
                        <input className="w-100" type="text" placeholder="Title" id="surtitle" />
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label>
                                <input defaultValue="yes" id="linkasbtn" type="checkbox" />Show as button
                            </label>
                        </div>
                        <div id="btndesignall">
                            <div className="font-weight-bold">Button Preview</div>
                            <div className="btndesignbtn"><a href="/#" className="bttn btn-secondary" onClick={(e)=>{e.preventDefault()}}>Button</a></div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Button Color</strong></label>
                                    <input type="text" id="srvybackclrbox" defaultValue="#6c757d"/>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Text Color</strong></label>
                                    <input type="text" id="srvytextclrbox" defaultValue="#6c757d"/>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Style</strong></label>
                                    <div id="srybtnstyle">
                                        <input id="srybtnsol" name="srybtnstygrp" type="radio" defaultChecked="checked"/><span>Solid</span> <input id="srybtnout" name="srybtnstygrp" type="radio"/><span>Outline</span>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Width</strong></label>
                                    <div id="srybtnsty">
                                        <input id="srybtndef" name="srybtngrp" type="radio" defaultChecked="checked" defaultValue="d"/><span>Default</span> <input id="srybtncus" name="srybtngrp" type="radio" defaultValue="c"/><span>Custom</span>
                                    </div>
                                    <div id="srybtnwthbox">
                                        <input type="text" id="srybtnwth" defaultValue="300"/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label><strong>Set Border Style</strong></label>
                                    <div>
                                        <select id="srybtnbrdstyle" className="form-control">
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
                                        <input type="text" id="srybtnbrdsize" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="mb-0"><strong>Set Border Color</strong></label>
                                    <div>
                                        <input type="text" id="srybtnbrdclrbox" defaultValue="#6c757d"/>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label><strong>Set Border Radius</strong></label>
                                    <div>
                                        <input type="text" id="srybtnbrdradius" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <label><strong>Set Padding</strong></label>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <label><strong>Top</strong></label>
                                        <div>
                                            <input type="text" id="srybtnpadtop" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Bottom</strong></label>
                                        <div>
                                            <input type="text" id="srybtnpadbottom" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Left</strong></label>
                                        <div>
                                            <input type="text" id="srybtnpadleft" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Right</strong></label>
                                        <div>
                                            <input type="text" id="srybtnpadright" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button id="save_tooltips" variant="contained" color="primary" className="mr-3" onClick={()=>toggleSurveysTags()}>SAVE</Button>
                    <Button id="sry_close_tooltips" variant="contained" color="primary" onClick={()=>toggleSurveysTags()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickSurveysTags" onClick={()=>{toggleSurveysTags()}}/>
        </>
    );
}

export default ModalSurvey;