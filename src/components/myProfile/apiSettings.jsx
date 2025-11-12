import React, { useEffect, useMemo, useState } from "react";
import { Switch, Checkbox, FormControlLabel, FormLabel, FormGroup, TextField, Button, Link } from "@mui/material";
import { Col, Row } from "reactstrap";
import CopyLink from "../shared/commonControlls/copyLink";
import { connect } from "react-redux";
import { setGlobalAlertAction } from "../../actions/globalAlertActions";
import { deleteWhiteListingUrls, generateAuthKey, getSupportApiModuleList, getSupportApiSetting, getWhiteListingUrlsList, saveAllowApiAccess, saveAllowApiTo, saveWhiteListingUrls } from "../../services/profileService";
import { setConfirmDialogAction } from "../../actions/confirmDialogActions";
import { staticUrl } from "../../config/api";

const ApiSettings = ({globalAlert, confirmDialog}) => {
    const [data, setData] = useState({
        supportApiAuth: {
            secretKey: "",
            authToken: ""
        },
        whiteListUrls: [
            { id: 0, url: "" }
        ],
        allowApiAccess: "N",
        allowApiTo: []
    });
    const [modules, setModules] = useState([]);

    const customTLDs = [
        'com', 'net', 'org', 'info', 'biz', 'name', 'pro', 'online', 'site', 'tech', 'store', 'blog', 'website', 'app',
        'me', 'dev', 'cloud', 'shop', 'agency', 'space', 'fun', 'life', 'world', 'today', 'live', 'group', 'company', 'solutions', 'services',
        'design', 'digital', 'codes', 'build', 'io', 'ai', 'tv', 'cc', 'co', 'vip', 'fashion', 'ltd', 'global', 'media', 'marketing', 'consulting', 'events', 'systems', 'network', 'support', 'technology',
        
        'in', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'it', 'es', 'jp', 'cn', 'ru', 'br', 'nl', 'se', 'no', 'fi', 'ch', 'nz',

        'gov', 'edu', 'mil',
        
        'co.uk', 'co.in', 'co.au', 'com.br', 'com.au', 'com.cn', 'com.mx', 'com.sg'
    ];

    const domainRegex = useMemo(() => {
        const escapedTLDs = customTLDs.map(tld => tld.replace('.', '\\.'));
        const tldPattern = `(${escapedTLDs.join('|')})`;
        return new RegExp(`^(https?:\\/\\/)(www\\.)?([a-zA-Z0-9-]+\\.)+${tldPattern}(\\/.*)?$`, 'i');
    }, [customTLDs]);
    
    const handleAllowApiAccess = (e) => {
        let requestData = {};
        let tempAllowApiAccess = "";
        if (e.target.checked) {
            requestData = {
                "enableApi": "Y"
            };
            tempAllowApiAccess = "Y";
        } else {
            requestData = {
                "enableApi": "N"
            };
            tempAllowApiAccess = "N";
        }
        saveAllowApiAccess(requestData).then(res => {
            if (res.status === 200) {
                setData(prev => ({
                    ...prev,
                    allowApiAccess: tempAllowApiAccess,
                    supportApiAuth: {
                        secretKey: res?.result?.secretKey || "",
                        authToken: res?.result?.authToken || ""
                    },
                }));
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    };
    const handleClickRegenerate = () => {
        generateAuthKey().then(res => {
            if (res.status === 200) {
                setData(prev => ({
                    ...prev,
                    supportApiAuth: {
                        secretKey: res.result.secretKey,
                        authToken: res.result.authToken
                    }
                }));
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    };
    const handleClickAllowApiTo = () => {
        let requestData = {
            allowApiTo: data.allowApiTo
        };
        saveAllowApiTo(requestData).then(res => {
            if (res.status === 200) {
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    };
    const displayGetWhiteListingUrlsList = () => {
        getWhiteListingUrlsList().then(res => {
            if (res.status === 200) {
                let tempWhitelistUrls = res?.result?.whiteListingUrls?.length > 0 ? res?.result?.whiteListingUrls : [{ id: 0, url: "" }];
                setData(prev => ({
                    ...prev,
                    whiteListUrls: tempWhitelistUrls,
                }));
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    };
    const handleClickWhitelistUrls = () => {
        if (data.whiteListUrls.length === 0) {
            globalAlert({
                type: "Error",
                text: "Please add at least one URL",
                open: true
            });
            return;
        } else {
            const blankUrl = data.whiteListUrls.filter(item => item.url === "");
            if (blankUrl.length > 0) {
                globalAlert({
                    type: "Error",
                    text: "Please fill all the URL fields",
                    open: true
                });
                return;
            }
            const invalidUrl = data.whiteListUrls.filter(item => !item.url || !domainRegex.test(item.url));
            if (invalidUrl.length > 0) {
                globalAlert({   
                    type: "Error",
                    text: "Please enter valid URLs",
                    open: true
                }); 
                return;
            }
            const duplicateUrl = data.whiteListUrls.filter((item, index) => {
                return data.whiteListUrls.findIndex(i => i.url === item.url) !== index;
            });
            if (duplicateUrl.length > 0) {
                globalAlert({
                    type: "Error",
                    text: "Duplicate URLs are not allowed",
                    open: true
                });
                return;
            }
        }
        saveWhiteListingUrls(data?.whiteListUrls).then(res => {
            if (res.status === 200) {
                displayGetWhiteListingUrlsList();
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    };
    const handleDeleteWhitelistUrl = (idx) => {
        confirmDialog({
            open: true,
            title: `Are you sure you want to delete this Whitelist URL?`,
            onConfirm: () => {
                let requestData = {
                    id: [data.whiteListUrls[idx].id]
                };
                deleteWhiteListingUrls(requestData).then(res => {
                    if (res.status === 200) {
                        const newUrls = data.whiteListUrls.filter((_, i) => i !== idx);
                        setData(prev => ({
                            ...prev,
                            whiteListUrls: newUrls
                        }));
                        globalAlert({
                            type: "Success",
                            text: res.message,
                            open: true
                        });
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                });
            }
        });
    }
    const displaySupportApiModuleList = () => {
        getSupportApiModuleList().then(res => {
            if (res.status === 200) {
                setModules(res.result.supportApiModuleList);
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }
    const displaySupportApiSetting = () => {
        getSupportApiSetting().then(res => {
            if (res.status === 200) {
                let tempAllowApiTo = [];
                if (res?.result?.supportApiPermissionList) {
                    res.result.supportApiPermissionList.map(item => (
                        tempAllowApiTo.push(item.perMdId)
                    ));
                }
                setData(prev => ({
                    ...prev,
                    ...res.result,
                    supportApiAuth: {
                        secretKey: res?.result?.supportApiAuth?.secretKey || "",
                        authToken: res?.result?.supportApiAuth?.authToken || ""
                    },
                    allowApiTo: tempAllowApiTo
                }));
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    }

    useEffect(() => {
        if(data?.allowApiAccess === "Y") {
            displaySupportApiModuleList();
            displayGetWhiteListingUrlsList();
        }
    }, [data?.allowApiAccess]);
    useEffect(() => {
        displaySupportApiSetting();
    }, []);

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className='text-center mb-5'>API Settings</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mb-3">
                    <div className='d-flex justify-content-between'>
                        <div className="d-flex align-items-baseline ">
                            <h6 className="m-0">Allow API Access</h6>
                            <div className="ml-3">
                                Off<Switch color="primary" checked={data?.allowApiAccess === "Y"} onChange={handleAllowApiAccess} name='allowApiAccess' />On
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <Link className="cursor-pointer" component="a" onClick={ () => {window.open(`${staticUrl}/api.html`, "_blank")}}>API Documentation</Link>
                        </div>
                    </div>
                </Col>
                {
                    data?.allowApiAccess === "Y" && <>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="d-flex justify-content-end align-items-end">
                                {/* <div>
                                    <FormLabel>Environment</FormLabel>
                                    <FormGroup row>
                                        <RadioGroup
                                            row
                                            name="environment"
                                            value={data.environment || "Sandbox"}
                                            onChange={e => setData(prev => ({
                                                ...prev,
                                                environment: e.target.value
                                            }))}
                                        >
                                            <FormControlLabel value="Sandbox" control={<Radio />} label="Sandbox" />
                                            <FormControlLabel value="Production" control={<Radio />} label="Production" />
                                        </RadioGroup>
                                    </FormGroup>
                                </div> */}
                                <Button variant="contained" color="primary" className="mb-2" onClick={handleClickRegenerate}>REGENERATE</Button>
                            </div>
                            <TextField
                                variant="standard"
                                id="secretKey"
                                name="secretKey"
                                label="Secret Key"
                                fullWidth
                                value={data?.supportApiAuth?.secretKey || ""}
                                readOnly={true}
                                onFocus={event => event.target.select()}
                                InputProps={{ endAdornment: <CopyLink elementName="secretKey" iconSelector="copySecretKey" title="Copy Secret Key" /> }}
                            />
                            <TextField
                                variant="standard"
                                id="authToken"
                                name="authToken"
                                label="Auth Token"
                                className="mt-3"
                                fullWidth
                                value={data?.supportApiAuth?.authToken || ""}
                                readOnly={true}
                                onFocus={event => event.target.select()}
                                InputProps={{ endAdornment: <CopyLink elementName="authToken" iconSelector="copyAuthToken" title="Copy Auth Token" /> }}
                            />
                            <div className="mt-5">
                                <FormLabel>API Access To :</FormLabel>
                                <FormGroup row>
                                    {modules.map((mod, idx) => (
                                        <FormControlLabel
                                            key={idx}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={data.allowApiTo.includes(mod.mdId)}
                                                    onChange={e => {
                                                        setData(prev => {
                                                            const allowApiTo = prev.allowApiTo || [];
                                                            if (e.target.checked) {
                                                                return {
                                                                    ...prev,
                                                                    allowApiTo: [...allowApiTo, mod.mdId]
                                                                };
                                                            } else {
                                                                return {
                                                                    ...prev,
                                                                    allowApiTo: allowApiTo.filter(m => m !== mod.mdId)
                                                                };
                                                            }
                                                        });
                                                    }}
                                                />
                                            }
                                            label={mod.mdName}
                                            className="mr-3"
                                        />
                                    ))}
                                </FormGroup>
                                <Button variant="contained" className="mt-3" color="primary" onClick={handleClickAllowApiTo}>SAVE</Button>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div>
                                <h6>Whitelist URLs</h6>
                                <FormGroup>
                                    {Array.isArray(data.whiteListUrls) && data.whiteListUrls.length > 0 ? (
                                        data.whiteListUrls.map((item, idx) => (
                                            <div key={idx} className="d-flex align-items-end mb-3">
                                                <div className="flex-grow-1">
                                                    <TextField
                                                        variant="standard"
                                                        label={`URL ${idx + 1}`}
                                                        value={item.url}
                                                        onChange={e => {
                                                            const newUrls = data.whiteListUrls.map((w, i) =>
                                                                i === idx ? { ...w, url: e.target.value } : w
                                                            );
                                                            setData(prev => ({
                                                                ...prev,
                                                                whiteListUrls: newUrls
                                                            }));
                                                        }}
                                                        fullWidth
                                                        autoFocus={data.whiteListUrls.length - 1 === idx}
                                                    />
                                                </div>
                                                {data.whiteListUrls.length > 1 && (<i
                                                    className="far fa-trash-alt text-danger cursor-pointer font-size-18 ml-2"
                                                    title="Remove"
                                                    onClick={() => { handleDeleteWhitelistUrl(idx); }}
                                                ></i>)}
                                                {idx === data.whiteListUrls.length - 1 && (
                                                    <i
                                                        className="far fa-plus-square cursor-pointer font-size-18 ml-2"
                                                        title="Add URL"
                                                        onClick={() => {
                                                            setData(prev => ({
                                                                ...prev,
                                                                whiteListUrls: [
                                                                    ...prev.whiteListUrls,
                                                                    { id: 0, url: "" }
                                                                ]
                                                            }));
                                                        }}
                                                    ></i>
                                                )}
                                            </div>
                                        ))
                                    ) : null }
                                </FormGroup>
                                <Button variant="contained" className="mt-3" color="primary" onClick={handleClickWhitelistUrls}>SAVE</Button>
                            </div>
                        </Col>
                    </>
                }
            </Row>
        </>
    );
};
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }   
    }
}
export default connect(null, mapDispatchToProps)(ApiSettings);