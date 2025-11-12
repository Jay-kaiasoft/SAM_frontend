import React, {useState} from "react";
import {Button,TextField} from "@mui/material";
import {shopifyUrl} from "../../../../config/api";
import {Col, Row} from "reactstrap";

const ShopifyOauthRedirect = (props) => {
    const [storeName, setStoreName] = useState("");
    if(typeof props.location.search !== "undefined" && props.location.search !== "" && props.location.search !== null){
        window.opener.shpSuccess(props.location.search);
        window.close();
    }
    const handleClickGo = () => {
        window.location.href=shopifyUrl+'/shopifyLogin?storeName='+storeName;
    }
    return (
        (typeof props.location.search !== "undefined" && props.location.search !== "" && props.location.search !== null) ?
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
                    <div className="col2 text-right">
                        <strong>Importing</strong>
                    </div>
                    <div className="col2">
                        <div className="stage filter-contrast">
                            <div className="dot-shuttle"></div>
                        </div>
                    </div>
                </div>
            </>
        :
            <div className="d-flex h-100 align-items-center">
                <Row className="mx-auto">
                    <Col xs={12} className="d-flex justify-content-center">
                        <TextField label="Enter Store Name" variant="standard" style={{width:"400px"}} value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                    </Col>
                    <Col xs={12} className="mt-3 d-flex justify-content-center">
                        <Button variant="contained" color="primary" onClick={handleClickGo}>GO</Button>
                    </Col>
                </Row>
            </div>
    );
}

export default ShopifyOauthRedirect;