import { useCallback, useEffect, useMemo, useState } from "react";
import {getPreviewSurveyData} from "../../services/surveyService";
import PreviewSurvey from "./previewSurvey";
import {setAnswersToJson} from "./utility";
import {Col, Modal, ModalBody, Row} from "reactstrap";
import { getCookie, setCookie } from "react-use-cookie";
import DisplayForm from "../form/displayForm";
import {easUrlEncoder, getHostData} from "../../assets/commonFunctions";
import { siteURL, smFacebookUrl, smInstagramUrl, smLinkedinUrl, smTwitterUrl, staticUrl } from "../../config/api";
const DisplaySurvey = ({location})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [dataListJson, setDataListJson] = useState(null);
    const [sryId, setSryId] = useState(0);
    const [countryNameList, setCountryNameList] = useState([]);
    const [show, setShow] = useState(false);
    const [notCountry, setNotCountry] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [displayFormData, setDisplayFormData] = useState({
        display: false,
        location: {pathname: "", search: "", hash: "", state: ""},
        mode: "fromSurvey"
    });
    const [closed, setClosed] = useState(false);
    const [modalOpenForm, setModalOpenForm] = useState(false);
    const toggleOpenForm = useCallback(() => { setModalOpenForm(!modalOpenForm); }, [modalOpenForm]);

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
        getPreviewSurveyData(id,getCookie('surveyeas')).then(res=>{
            if(res.status === 200 && res.result.close === "N" && res.result.error === "") {
                if (res.status === 200 && res.result.survey && res.result.error === "") {
                    setSryId(res.result.survey.sryId);
                    setCountryNameList(res.result.survey.countryNameList);
                    if (getCookie('surveyeas') !== "") {
                        setDataListJson((prev)=>{
                            let temp = setAnswersToJson(JSON.parse(res.result.survey.sryData), res.result.surveyAnswers);
                            return {...prev, ...temp};
                        });
                    } else {
                        setDataListJson(JSON.parse(res.result.survey.sryData));
                    }
                    document.cookie = "surveyeas=" + getCookie('surveyeas') + "; path=/";
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
                    dataListJson !== null && show?
                        <>
                            <PreviewSurvey
                                togglePreviewForm={null}
                                dataListJson={dataListJson}
                                setDataListJson={setDataListJson}
                                saveMode={true}
                                sryId={sryId}
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
                                        otherId={sryId}
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
                                    <h1>The creator of this survey<br/>has not authorized participation<br/>from your country : <span className="text-blue">{countryName.toUpperCase()}</span>.</h1>
                                </Col>
                                <Col xs={12} className="mb-3 text-center">
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
                            <h1>The survey you are trying to access has been closed by the creator.<br/>If you would like to create your own survey, please <a href={`${staticUrl}/surveys.html`} target="_blank" rel="noreferrer">click here</a>.</h1>
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

export default DisplaySurvey;