import React, { useMemo, useState, lazy, Suspense } from 'react';
import {Row, Col} from 'reactstrap';
import {siteURL} from "../../config/api";
import { easUrlEncoder } from '../../assets/commonFunctions';
import Loader from '../shared/loaderV2/loader';
const NewEmailTemplate = lazy(() => import("./newEmailTemplate"));
const ConvertMyExistingTemplate = lazy(() => import("./convertMyExistingTemplate"));


const BuildBuildItForMe = ({location})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    /** 
     * init: new email template/ convert email template buttons
     * new-email-template: build it for me steps
     */
    let pageStateValue = (typeof id !== "undefined" && id !== 0 && id !== null) ? "new-email-template" : "init";
    const [pageState, setPageState] = useState(pageStateValue);
    const [tmeplateButtonImgs, setTemplateButtonImgs] = useState([siteURL+"/img/bifm-1-1.png", siteURL+"/img/bifm-2-1.png"]);
    const buildNewTemplate = ()=>{setPageState("new-email-template")};
    const convertExistingTemplate = ()=>{setPageState("convert-email-template")}
    const changeImg = (i, e) => {
        if(i === 0){
            if(e === "hover"){
                setTemplateButtonImgs((prev)=>{
                    let temp = prev;
                    temp[0] = siteURL+"/img/bifm-1-2.png";
                    return [...temp];
                });
            }
            else{
                setTemplateButtonImgs((prev)=>{
                    let temp = prev;
                    temp[0] = siteURL+"/img/bifm-1-1.png";
                    return [...temp];
                });
            }
        }
        else{
            if(e === "hover"){
                setTemplateButtonImgs((prev)=>{
                    let temp = prev;
                    temp[1] = siteURL+"/img/bifm-2-2.png";
                    return [...temp];
                });
            }
            else{
                setTemplateButtonImgs((prev)=>{
                    let temp = prev;
                    temp[1] = siteURL+"/img/bifm-2-1.png";
                    return [...temp];
                });
            }

        }
    }
    return (
    <>
        <Row className="midleMain">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row className="d-flex pl-5">
                    {pageState === "init" || pageState ===  "new-email-template"?
                        <h3>New Build It For Me</h3>
                        :
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                            <h3 className="mt-5">Convert My Existing Template</h3>
                        </Col>
                    }
                </Row>
                <Row>
                    {pageState === "init"? 
                        <Col lg={{ offset: 1, size:10 }} md={{ offset: 1, size:10 }} >
                            <Row>
                                <Col sm={4} md={3} className="build-for-me-types" onMouseOver={()=>{changeImg(0, "hover")}} onMouseOut={()=>{changeImg(0, "out")}} onClick={buildNewTemplate} >
                                    <img src={tmeplateButtonImgs[0]} alt="New Email Template"/>
                                    <br/>
                                    <label>
                                        <strong>New Email Template</strong>
                                    </label>
                                    <p> Create a new template based on concept, <br/> ideas, colors, content, <br/> and image provide by me. </p>
                                </Col>
                                <Col sm={4} md={3} className="build-for-me-types" onMouseOver={()=>{changeImg(1, "hover")}} onMouseOut={()=>{changeImg(1, "out")}} onClick={convertExistingTemplate} >
                                    <img src={tmeplateButtonImgs[1]} alt="Convert Email Template"/>
                                    <br/>
                                    <label>
                                        <strong>Convert Email Template</strong>
                                    </label>
                                    <p> Create a new template based on concept, <br/> ideas, colors, content, <br/> and image provide by me. </p>
                                </Col>
                            </Row>
                        </Col>
                    :
                        pageState === "new-email-template" ?
                            <Suspense fallback={<Loader />}>
                                <NewEmailTemplate id={id}/>
                            </Suspense>
                        : 
                            <Suspense fallback={<Loader />}>
                                <ConvertMyExistingTemplate />
                            </Suspense>
                    }
                </Row>
            </Col>
        </Row>
    </>
    );
}

export default BuildBuildItForMe;
