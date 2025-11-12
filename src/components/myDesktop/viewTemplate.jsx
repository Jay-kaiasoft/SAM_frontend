import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { getMyPagesPreview, getPreviewFreeTemplate } from "../../services/myDesktopService";
import AddScript from '../shared/commonControlls/addScript';

const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL}, 'google_translate_element');
}
window.googleTranslateElementInit=googleTranslateElementInit;

const ViewTemplate = (props) => {
    AddScript('https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    const [data, setData] = useState({});
    const [languages, setLanguages] = useState([]);
    const [currentSelectedLanguage, setCurrentSelectedLanguage] = useState("");
    const [currentSelectedId, setCurrentSelectedId] = useState(null);
    const querySting = useMemo(() => { return new URLSearchParams(props.location.search) }, [props.location.search]);

    const getPreviewToShow = (id, lan) => {
        getMyPagesPreview(id, lan).then(res => {
            if (res.result && res.result.response) {
                setData(res.result.response);
                let languageAvailable = [];
                if (res?.result?.response?.mpTemplateLanguage) {
                    languageAvailable.push(res?.result?.response?.mpTemplateLanguage);
                }
                if (res?.result?.response?.mpTemplateConvertLangList) {
                    const languages = res?.result?.response?.mpTemplateConvertLangList || "";
                    languageAvailable = [...languages.split(","), ...languageAvailable];
                }
                setLanguages(languageAvailable);
            }
        });
    }

    const setDataHTML = (data) => {
        if(typeof data === "undefined"){
            return "";
        }
        let div = document.createElement('div');
        div.innerHTML = data;
        div?.querySelector(".removeClass")?.remove();
        return div.innerHTML;
    }

    useEffect(() => {
        if (typeof querySting.get("bmpId") !== "undefined" && querySting.get("bmpId") !== "" && querySting.get("bmpId") !== null) {
            setCurrentSelectedLanguage("en");
            setCurrentSelectedId(querySting.get("bmpId"));
            getMyPagesPreview(querySting.get("bmpId"), "en");
        } else if (typeof querySting.get("mpId") !== "undefined" && querySting.get("mpId") !== "" && querySting.get("mpId") !== null) {
            setCurrentSelectedLanguage("en");
            setCurrentSelectedId(querySting.get("mpId"));
            getPreviewToShow(querySting.get("mpId"), "en");
        } else if (typeof querySting.get("ftFolderName") !== "undefined" && querySting.get("ftFolderName") !== "" && querySting.get("ftFolderName") !== null) {
            setCurrentSelectedLanguage("en");
            setCurrentSelectedId(querySting.get("ftFolderName"));
            getPreviewFreeTemplate(querySting.get("ftFolderName")).then(res => {
                if (res.status === 200 && res.result) {
                    setData({"ttCampDetail": res.result.freeTemplate});
                }
            })
        }
    }, [querySting]);
    useEffect(()=>{
        document.querySelector("#google_translate_element").style.display = "none";
        setTimeout(()=>{
            document.querySelector("div.skiptranslate iframe").style.display = "none";
            document.querySelector("body").style.top = 0;
            document.querySelector("#google_translate_element .skiptranslate span").remove();
            document.querySelector("#google_translate_element .skiptranslate").style.fontSize = 0;
            document.querySelector("#google_translate_element").style.display = "";
            document.querySelector("#google_translate_element").addEventListener("click",function(){
                document.querySelector("body").style.top = 0;
                document.querySelector("div.skiptranslate iframe").style.display = "none";
            });
        },2000);
    },[]);
    return (
        <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mx-auto">
                <div className='language-button-container'>
                    {languages.length > 1 &&
                        languages.map((lan) => {
                            return (
                                <div
                                    key={lan}
                                    className="language-button notranslate"
                                    style={{ backgroundColor: `${lan === currentSelectedLanguage ? "#007bff" : "#d3d3d3"}` }}
                                    onClick={() => {
                                        getPreviewToShow(currentSelectedId, lan)
                                        setCurrentSelectedLanguage(lan)
                                    }}
                                >
                                    {lan}
                                </div>
                            )
                        })
                    }
                    <div id="google_translate_element"></div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: setDataHTML(data?.ttCampDetail?.replaceAll('contenteditable="true"','')?.replaceAll("mojoMcBlock ","")) }} />
            </Col>
        </Row>
    );
}

export default ViewTemplate;