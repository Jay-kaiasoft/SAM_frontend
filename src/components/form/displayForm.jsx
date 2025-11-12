import { useCallback, useEffect, useMemo, useState } from "react";
import {getPreviewCustomFormData} from "../../services/customFormService";
import PreviewForm from "./previewForm";
import {setAnswersToJson} from "./utility";
import { getCookie, setCookie } from "react-use-cookie";
import { easUrlEncoder } from "../../assets/commonFunctions";
const DisplayForm = ({location, mode, setFormDataDisplay, otherId})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location?.search)) }, [location?.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [dataListJson, setDataListJson] = useState(null);
    const [cfId, setCfId] = useState(0);
    const [showPreviewForm, setShowPreviewForm] = useState(true);
    const togglePreviewForm = useCallback(()=>{
        setShowPreviewForm(prev=>!prev);
        setFormDataDisplay();
    }, [setShowPreviewForm, setFormDataDisplay]);
    useEffect(()=>{
        getPreviewCustomFormData(id,getCookie('customformeas')).then(res=>{
            if(res.status === 200 && res.result.customForm && res.result.error === ""){
                setCfId(res.result.customForm.cfId);
                if(getCookie('customformeas') !== ""){
                    setDataListJson(setAnswersToJson(JSON.parse(res.result.customForm.cfFormData), res.result.customFormAnswers));
                } else{
                    setDataListJson(JSON.parse(res.result.customForm.cfFormData));
                }
                document.cookie = "customformeas="+getCookie('customformeas')+"; path=/";
            }
        });
    }, [id]);
    return (
        <>
            {
                dataListJson !== null && showPreviewForm?
                    <PreviewForm 
                        togglePreviewForm={mode!=="fromSurvey" && mode !== "fromAssessment"?null:togglePreviewForm}
                        dataListJson={dataListJson}
                        setDataListJson={setDataListJson}
                        saveMode={true}
                        cfId={cfId}
                        getCookie={getCookie}
                        setCookies={setCookie}
                        from={mode}
                        otherId={typeof otherId === "undefined"?0:otherId}
                    />:null
            }
        </>
    );
}

export default DisplayForm;