import React from "react";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import { Button, Link } from "@mui/material";
import { siteURL } from "../../../../config/api";
import DialogConfirmSimple from "../../commonControlls/dialogConfirmSimple";

const ModalImageAi = ({modalImageAi,toggleImageAi}) => {
    return(
        <>
            <Modal id="modalimageai" size="lg" isOpen={modalImageAi} toggle={toggleImageAi}>
                <ModalHeader toggle={toggleImageAi}>Image With AI Assistant</ModalHeader>
                <ModalBody>
                    <div id="writetoaskimagemain">
                        <label><strong>Provide Writing Instructions To The AI</strong></label>
                        <div className="d-flex position-relative">
                            <Link component="a" id="write_new_image" className="btn-circle active position-absolute" data-toggle="tooltip" title="New Image" style={{ zIndex: "9" }}>
                                <i className="far fa-plus"></i>
                                <div className="bg-blue"></div>
                            </Link>
                            <input type="text" id="writetoaskimage" className="w-100 rounded" defaultValue=""/>
                            <Link component="a" id="write_openaistg_image" className="btn-circle active position-absolute" data-toggle="tooltip" title="Go" style={{ zIndex: "9" }}>
                                <i className="far fa-arrow-right"></i>
                                <div className="bg-blue"></div>
                            </Link>
                        </div>
                        <span className="font-size-12">AI may produce inaccurate image, you are responsible for your image.</span>
                    </div>
                    <Row className="mt-3">
                        <Col xs={4} className="border-right overflow-hidden pr-0">
                            <div className="pr-3" style={{height:"65vh",overflowX:"hidden", overflowY:"auto"}}>
                                <h5 className="text-center">Style</h5>
                                <Row>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/none.png"} alt="None" className="w-100 style-icon active" />
                                        <p className="text-center">None</p>
                                    </Col>
                                </Row>
                                <h6>Photography</h6>
                                <Row>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/filmic.png"} alt="Flimic" className="w-100 style-icon" />
                                        <p className="text-center">Flimic</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/photo.png"} alt="PhotoStyle" className="w-100 style-icon" />
                                        <p className="text-center">Photo</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/vibrant.png"} alt="Vibrant" className="w-100 style-icon" />
                                        <p className="text-center">Vibrant</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/softfocus.png"} alt="Soft focus" className="w-100 style-icon" />
                                        <p className="text-center">Soft focus</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/neon.png"} alt="Neon" className="w-100 style-icon" />
                                        <p className="text-center">Neon</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/moody.png"} alt="Moody" className="w-100 style-icon" />
                                        <p className="text-center">Moody</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/minimalist.png"} alt="Minimalist" className="w-100 style-icon" />
                                        <p className="text-center">Minimalist</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/longexposure.png"} alt="Long exposure" className="w-100 style-icon" />
                                        <p className="text-center">Long exposure</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/highflash.png"} alt="High flash" className="w-100 style-icon" />
                                        <p className="text-center">High flash</p>
                                    </Col>
                                </Row>
                                <h6>Digital Art</h6>
                                <Row>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/anime.png"} alt="Anime" className="w-100 style-icon" />
                                        <p className="text-center">Anime</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/dreamy.png"} alt="Dreamy" className="w-100 style-icon" />
                                        <p className="text-center">Dreamy</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/retrowave.png"} alt="Retrowave" className="w-100 style-icon" />
                                        <p className="text-center">Retrowave</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/psychedelic.png"} alt="Psychedelic" className="w-100 style-icon" />
                                        <p className="text-center">Psychedelic</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/playful.png"} alt="Playful" className="w-100 style-icon" />
                                        <p className="text-center">Playful</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/midcentury.png"} alt="Midcentury" className="w-100 style-icon" />
                                        <p className="text-center">Midcentury</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/gradient.png"} alt="Gradient" className="w-100 style-icon" />
                                        <p className="text-center">Gradient</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/conceptart.png"} alt="Concept art" className="w-100 style-icon" />
                                        <p className="text-center">Concept art</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/3d.png"} alt="3D" className="w-100 style-icon" />
                                        <p className="text-center">3D</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/3dmodel.png"} alt="3D model" className="w-100 style-icon" />
                                        <p className="text-center">3D model</p>
                                    </Col>
                                </Row>
                                <h6>Fine Art</h6>
                                <Row>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/watercolor.png"} alt="Watercolour" className="w-100 style-icon" />
                                        <p className="text-center">Watercolour</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/stainedglass.png"} alt="Stained glass" className="w-100 style-icon" />
                                        <p className="text-center">Stained glass</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/papercut.png"} alt="Papercut" className="w-100 style-icon" />
                                        <p className="text-center">Papercut</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/oilpainting.png"} alt="Oil painting" className="w-100 style-icon" />
                                        <p className="text-center">Oil painting</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/inkprint.png"} alt="Ink print" className="w-100 style-icon" />
                                        <p className="text-center">Ink print</p>
                                    </Col>
                                    <Col xs={6}>
                                        <img src={siteURL+"/img/ai_style/colourpencil.png"} alt="Colour pencil" className="w-100 style-icon" />
                                        <p className="text-center">Colour pencil</p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={8}>
                            <div id="aigeneratedimagemain" className="d-none flex-column align-items-center justify-content-center w-100">
                                <label><strong>File Name</strong></label>
                                <input type="text" id="aifilename" className="w-75 rounded" defaultValue=""/>
                                <img id="aigeneratedimage" src="" alt="AI Generated" className="w-50 mt-3" />
                                <Button id="useit_openaistg_image" variant="contained" color="primary" className="mt-3">USE IT</Button>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            <input type="hidden" id="clickImageAiModal" onClick={()=>{toggleImageAi()}}/>
            <DialogConfirmSimple />
        </>
    );
}

export default ModalImageAi;