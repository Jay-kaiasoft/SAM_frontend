import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "@mui/material";

const ModalCustomForm = ({modalCustomFormsTags,toggleCustomFormsTags}) => {
    return(
        <>
            <Modal isOpen={modalCustomFormsTags} toggle={toggleCustomFormsTags}>
                <ModalHeader toggle={toggleCustomFormsTags}>Custom Forms Link</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label><strong>Select Custom Forms</strong></label>
                        <select id="cfsel"></select>
                    </div>
                    <div className="form-group">
                        <label style={{display: "inline-block", paddingBottom: "0px"}}><strong>URL : </strong></label>
                        <div id="cfurldiv"></div>
                        <input placeholder="Url" id="cfurl" type="hidden" />
                    </div>
                    <div className="form-group">
                        <label><strong>Title</strong></label>
                        <input className="w-100" type="text" placeholder="Title" id="cftitle" />
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label>
                                <input value="yes" id="cflinkasbtn" type="checkbox" />Show as button
                            </label>
                        </div>
                        <div id="cfbtndesignall">
                            <div className="font-weight-bold">Button Preview</div>
                            <div className="cfbtndesignbtn"><a href="/#" className="bttn btn-secondary" onClick={(e)=>{e.preventDefault()}}>Button</a></div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Button Color</strong></label>
                                    <input type="text" id="cfbackclrbox" defaultValue="#6c757d"/>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Text Color</strong></label>
                                    <input type="text" id="cftextclrbox" defaultValue="#6c757d"/>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Style</strong></label>
                                    <div id="cfbtnstyle">
                                        <input id="cfbtnsol" name="cfbtnstygrp" type="radio" defaultChecked="checked"/><span>Solid</span> <input id="cfbtnout" name="cfbtnstygrp" type="radio"/><span>Outline</span>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Width</strong></label>
                                    <div id="cfbtnsty">
                                        <input id="cfbtndef" name="cfbtngrp" type="radio" defaultChecked="checked" defaultValue="d"/><span>Default</span> <input id="cfbtncus" name="cfbtngrp" type="radio" defaultValue="c"/><span>Custom</span>
                                    </div>
                                    <div id="cfbtnwthbox">
                                        <input type="text" id="cfbtnwth" defaultValue="300"/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label><strong>Set Border Style</strong></label>
                                    <div>
                                        <select id="cfbtnbrdstyle" className="form-control">
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
                                        <input type="text" id="cfbtnbrdsize" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="mb-0"><strong>Set Border Color</strong></label>
                                    <div>
                                        <input type="text" id="cfbtnbrdclrbox" defaultValue="#6c757d"/>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label><strong>Set Border Radius</strong></label>
                                    <div>
                                        <input type="text" id="cfbtnbrdradius" className="input-width-50px" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <label><strong>Set Padding</strong></label>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <label><strong>Top</strong></label>
                                        <div>
                                            <input type="text" id="cfbtnpadtop" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Bottom</strong></label>
                                        <div>
                                            <input type="text" id="cfbtnpadbottom" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Left</strong></label>
                                        <div>
                                            <input type="text" id="cfbtnpadleft" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Right</strong></label>
                                        <div>
                                            <input type="text" id="cfbtnpadright" className="input-width-50px" defaultValue=""/> px
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button id="cf_save_tooltips" variant="contained" color="primary" className="mr-3" onClick={()=>toggleCustomFormsTags()}>SAVE</Button>
                    <Button id="cf_close_tooltips" variant="contained" color="primary" onClick={()=>toggleCustomFormsTags()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickCustomFormsTags" onClick={()=>{toggleCustomFormsTags()}}/>
        </>
    );
}

export default ModalCustomForm;