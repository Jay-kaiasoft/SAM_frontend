import React from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Button} from "@mui/material";

const ModalButton = ({modalButton,toggleButton}) => {
    return(
        <>
            <Modal isOpen={modalButton} toggle={toggleButton}>
                <ModalHeader toggle={toggleButton}>Add Button</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label className="w-100"><strong>URL</strong></label>
                        <select id="genurlset" className="form-control">
                            <option value="http://">http://</option>
                            <option value="https://">https://</option>
                        </select>
                        <input placeholder="Url" id="genurl" />
                    </div>
                    <div className="form-group">
                        <label><strong>Title</strong></label>
                        <input className="w-100" type="text" placeholder="Title" id="gentitle" />
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label>
                                <input value="yes" id="genlinkasbtn" type="checkbox" />Show as button
                            </label>
                        </div>
                        <div id="genbtndesignall">
                            <div className="font-weight-bold">Button Preview</div>
                            <div className="genbtndesignbtn"><a href="/#" className="bttn btn-secondary" onClick={(e)=>{e.preventDefault()}}>Button</a></div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Button Color</strong></label>
                                    <input type="text" id="genbackclrbox" defaultValue="#6c757d"/>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Text Color</strong></label>
                                    <input type="text" id="gentextclrbox" defaultValue="#6c757d"/>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Style</strong></label>
                                    <div id="genbtnstyle">
                                        <input id="genbtnsol" name="genbtnstygrp" type="radio" defaultChecked="checked"/><span>Solid</span> <input id="genbtnout" name="genbtnstygrp" type="radio"/><span>Outline</span>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label className="clslbl"><strong>Set Width</strong></label>
                                    <div id="genbtnsty">
                                        <input id="genbtndef" name="genbtngrp" type="radio" defaultChecked="checked" defaultValue="d"/><span>Default</span> <input id="genbtncus" name="genbtngrp" type="radio" defaultValue="c"/><span>Custom</span>
                                    </div>
                                    <div id="genbtnwthbox">
                                        <input type="text" id="genbtnwth" defaultValue="300"/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label><strong>Set Border Style</strong></label>
                                    <div>
                                        <select id="genbtnbrdstyle" className="form-control">
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
                                        <input type="text" id="genbtnbrdsize" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <div className="btndgnms">
                                    <label className="mb-0"><strong>Set Border Color</strong></label>
                                    <div>
                                        <input type="text" id="genbtnbrdclrbox" defaultValue="#6c757d"/>
                                    </div>
                                </div>
                                <div className="btndgnms">
                                    <label><strong>Set Border Radius</strong></label>
                                    <div>
                                        <input type="text" id="genbtnbrdradius" defaultValue=""/> px
                                    </div>
                                </div>
                            </div>
                            <div className="btndgnm">
                                <label><strong>Set Padding</strong></label>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <label><strong>Top</strong></label>
                                        <div>
                                            <input type="text" id="genbtnpadtop" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Bottom</strong></label>
                                        <div>
                                            <input type="text" id="genbtnpadbottom" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Left</strong></label>
                                        <div>
                                            <input type="text" id="genbtnpadleft" defaultValue=""/> px
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Right</strong></label>
                                        <div>
                                            <input type="text" id="genbtnpadright" defaultValue=""/> px
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button id="save_buttonstg" variant="contained" color="primary" className="mr-3" onClick={()=>toggleButton()}>SAVE</Button>
                    <Button id="delete_buttonstg" variant="contained" color="primary" className="mr-3" onClick={()=>toggleButton()}>DELETE</Button>
                    <Button id="close_buttonstg" variant="contained" color="primary" onClick={()=>toggleButton()} >CLOSE</Button>
                </ModalFooter>
            </Modal>
            <input type="hidden" id="clickButtonModal" onClick={()=>{toggleButton()}}/>
        </>
    );
}

export default ModalButton;