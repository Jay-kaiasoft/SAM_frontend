import { useCallback, useEffect, useMemo, useState } from "react";
import {getPreviewAssessmentData} from "../../services/assessmentService";
import PreviewAssessment from "./previewAssessment";
import {setAnswersToJson} from "./utility";
import {Col, Modal, ModalBody, Row} from "reactstrap";
import { getCookie, setCookie } from "react-use-cookie";
import DisplayForm from "../form/displayForm";
import {easUrlEncoder, getHostData} from "../../assets/commonFunctions";
import { siteURL, smFacebookUrl, smInstagramUrl, smLinkedinUrl, smTwitterUrl, staticUrl } from "../../config/api";
const DisplayAssessment = ({location})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [dataListJson, setDataListJson] = useState(null);
    const [asmtId, setAsmtId] = useState(0);
    const [countryNameList, setCountryNameList] = useState([]);
    const [show, setShow] = useState(false);
    const [notCountry, setNotCountry] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [modalOpenForm, setModalOpenForm] = useState(false);
    const toggleOpenForm = useCallback(() => { setModalOpenForm(!modalOpenForm); }, [modalOpenForm]);

    const [displayFormData, setDisplayFormData] = useState({
        display: false,
        location: {pathname: "", search: "", hash: "", state: ""},
        mode: "fromAssessment"
    });
    const [closed, setClosed] = useState(false);
    const setFormData = useCallback((obj)=>{
        if(obj.display){
            toggleOpenForm();
        }
        setDisplayFormData((prev)=>(obj));
    },[setDisplayFormData]);
    const setFormDataDisplay = useCallback(()=>{
        setDisplayFormData((prev)=>{
            prev.display = false;
            return {...prev};
        });
        toggleOpenForm();
    },[setDisplayFormData, toggleOpenForm]);
    const myHostData = useCallback(()=>{
        if(countryNameList.length > 0) {
            getHostData().then((res1) => {
                setCountryName(res1.data.address.country);
                if (countryNameList.includes(res1.data.address.countryCode)) {
                    setShow(prev => countryNameList.includes(res1.data.address.countryCode));
                } else {
                    setNotCountry(prev => true);
                }
            });
        }
    }, [countryNameList])

    useEffect(()=>{
        getPreviewAssessmentData(id,getCookie('assessmenteas')).then(res=>{
            if(res.status === 200 && res.result.close === "N" && res.result.error === ""){
                if(res.status === 200 && res.result.assessment && res.result.error === "") {
                    setAsmtId(res.result.assessment.assId);
                    setCountryNameList(res.result.assessment.countryNameList);
                    if (getCookie('assessmenteas') !== "") {
                        setDataListJson((prev)=>{
                            let temp = setAnswersToJson(JSON.parse(res.result.assessment.assData), res.result.assessmentAnswers);
                            return {...prev, ...temp};
                        });
                    } else {
                        setDataListJson(JSON.parse(res.result.assessment.assData));
                    }
                    document.cookie = "assessmenteas=" + getCookie('assessmenteas') + "; path=/";
                }
            } else {
                setClosed(true);
            }
        });
    }, [id]);
    useEffect(()=>{
        myHostData();
    },[myHostData]);

    return (
        <>
            {
                !closed ?
                    dataListJson !== null && show ?
                        <>
                            <PreviewAssessment
                                togglePreviewForm={null}
                                dataListJson={dataListJson}
                                setDataListJson={setDataListJson}
                                saveMode={true}
                                asmtId={asmtId}
                                getCookie={getCookie}
                                setCookies={setCookie}
                                countryNameList={countryNameList}
                                setFormData = {setFormData}
                            />
                            <Modal size="xl" isOpen={modalOpenForm}>
                                <ModalBody className="p-0" style={{borderRadius: "calc(.3rem - 1px)", overflow: "hidden"}}>
                                    <DisplayForm
                                        location={displayFormData.location}
                                        mode={displayFormData.mode}
                                        setFormDataDisplay={setFormDataDisplay}
                                        otherId={asmtId}
                                    />
                                </ModalBody>
                            </Modal>
                        </>
                    :
                        notCountry && countryNameList.length !== 0 ?
                            <Row style={{height:"100vh"}} className="row align-content-between">
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
                                    <p className="text-center mb-0">
                                        <a className="navbar-brand mr-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                                    </p>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                                    <h1>The creator of this assessment<br/>has not authorized participation<br/>from your country : <span className="text-blue">{countryName.toUpperCase()}</span>.</h1>
                                </Col>
                                <Col xs={12} className="mb-3">
                                    <hr className="mt-0"/>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            Powered by <a className="navbar-brand mr-0 p-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-footer" /></a>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            Follow Us 
                                            <a className="mx-3" href={smLinkedinUrl} target="_blank" rel="noreferrer"><i className="fab fa-linkedin fa-2x"></i></a>
                                            <a className="mr-3" href={smFacebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook-square fa-2x"></i></a>
                                            <a className="mr-3" href={smInstagramUrl} target="_blank" rel="noreferrer"><i className="fab fa-instagram fa-2x text-purple-red"></i></a>
                                            <a href={smTwitterUrl} target="_blank" rel="noreferrer"><i className="eas eas-twitter-x fa-2x"></i></a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        : null
                :
                    <Row style={{height:"100vh"}} className="row align-content-between">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
                            <p className="text-center mb-0">
                                <a className="navbar-brand mr-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-main" /></a>
                            </p>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                            <h1>The assessment you are trying to access has been closed by the creator.<br/>If you would like to create your own assessment, please <a href={`${staticUrl}/assessments.html`} target="_blank" rel="noreferrer">click here</a>.</h1>
                        </Col>
                        <Col xs={12} className="mb-3">
                            <hr className="mt-0"/>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    Powered by <a className="navbar-brand mr-0 p-0" href={`${staticUrl}/index.html`}><img src={siteURL+"/img/logo.svg"} alt="logo" className="logo-footer" /></a>
                                </div>
                                <div className="d-flex align-items-center">
                                    Follow Us 
                                    <a className="mx-3" href={smLinkedinUrl} target="_blank" rel="noreferrer"><i className="fab fa-linkedin fa-2x"></i></a>
                                    <a className="mr-3" href={smFacebookUrl} target="_blank" rel="noreferrer"><i className="fab fa-facebook-square fa-2x"></i></a>
                                    <a className="mr-3" href={smInstagramUrl} target="_blank" rel="noreferrer"><i className="fab fa-instagram fa-2x text-purple-red"></i></a>
                                    <a href={smTwitterUrl} target="_blank" rel="noreferrer"><i className="eas eas-twitter-x fa-2x"></i></a>
                                </div>
                            </div>
                        </Col>
                    </Row>
            }
        </>
    );
}

export default DisplayAssessment;