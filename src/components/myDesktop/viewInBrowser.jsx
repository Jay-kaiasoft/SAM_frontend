import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { viewInBrowser } from '../../services/emailCampaignService';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import { connect } from 'react-redux';
import AddScript from '../shared/commonControlls/addScript';

const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL}, 'google_translate_element');
}
window.googleTranslateElementInit=googleTranslateElementInit;

const ViewInBrowser = (props) => {
    AddScript('https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    const [data, setData] = useState({});
    const querySting = useMemo(() => { return new URLSearchParams(props.location.search) }, [props.location.search]);

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
        if ((typeof querySting.get("mpId") !== "undefined" && querySting.get("mpId") !== "" && querySting.get("mpId") !== null) && (typeof querySting.get("ci") !== "undefined" && querySting.get("ci") !== "" && querySting.get("ci") !== null) && (typeof querySting.get("ui") !== "undefined" && querySting.get("ui") !== "" && querySting.get("ui") !== null)) {
            let requestData = `mpId=${querySting.get("mpId")}&ci=${querySting.get("ci")}&ui=${querySting.get("ui")}`
            viewInBrowser(requestData).then(res => {
                if (res.status === 200) {
                    setData(res.result.response);
                }
            });
        } else {
            props.globalAlert({
                type: "Error",
                text: "Oops !! Something went wrong in URL",
                open: true
            });
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
                    <div id="google_translate_element"></div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: setDataHTML(data?.ttCampDetail?.replaceAll('contenteditable="true"','')?.replaceAll("mojoMcBlock ","")) }} />
            </Col>
        </Row>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(ViewInBrowser);