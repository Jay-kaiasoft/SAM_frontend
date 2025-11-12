import React, {useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import {campaignLinkClick} from "../../services/emailCampaignService";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {easUrlEncoder, getHostData} from "../../assets/commonFunctions";

const LinkClick = ({location, globalAlert}) => {
    const querySting = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    useEffect(()=>{
        getHostData().then((res)=> {
            let requestData = {
                "n": querySting.get("n") ? querySting.get("n") : "",
                "d": querySting.get("d") ? querySting.get("d") : "",
                "m": querySting.get("m") ? querySting.get("m") : "",
                "flink": querySting.get("flink") ? querySting.get("flink") : "",
                "city": res.data.address.city
            }
            campaignLinkClick(requestData).then(res => {
                if (res.status === 200) {
                    if (res.result && res.result.url) {
                        window.location.href = res.result.url + "?n=" + requestData.n + "&d=" + requestData.d + "&m=" + requestData.m;
                    }
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
        });
    },[globalAlert,querySting]);
    return (
        <>
            <style>
                {`
                body {
                    margin: 0px;
                    padding: 0px;
                }
                .container {
                    position: fixed;
                    width: 100%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                .col2 {
                    display: inline-block;
                    width: 47%;
                }
                .text-right {
                    text-align: right;
                    font-size: 20px;
                }
                .stage {
                    display: flex;
                    justify-content: left;
                    align-items: center;
                    position: relative;
                    padding: 10px 3rem 2rem;
                    overflow: hidden;
                }
                .filter-contrast {
                    filter: contrast(5);
                    background-color: white;
                }
                .dot-shuttle {
                    position: relative;
                    left: -15px;
                    width: 12px;
                    height: 12px;
                    border-radius: 6px;
                    background-color: black;
                    color: transparent;
                    margin: -1px 0;
                    filter: blur(2px);
                }
                .dot-shuttle::before, .dot-shuttle::after {
                    content: '';
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    width: 12px;
                    height: 12px;
                    border-radius: 6px;
                    background-color: black;
                    color: transparent;
                    filter: blur(2px);
                }
                .dot-shuttle::before {
                    left: 15px;
                    animation: dotShuttle 2s infinite ease-out;
                }
                .dot-shuttle::after {
                    left: 30px;
                }
                @keyframes dotShuttle {
                    0%,
                    50%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-45px);
                    }
                    75% {
                        transform: translateX(45px);
                    }
                }
            `}
            </style>
            <div className="container">
                <div className="col2 text-right mr-3">
                    <strong>Please wait !!!</strong>
                </div>
                <div className="col2">
                    <div className="stage filter-contrast">
                        <div className="dot-shuttle"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null,mapDispatchToProps)(LinkClick);