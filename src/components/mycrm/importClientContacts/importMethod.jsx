import React from "react";
import { importMethodsConfig } from "./importMethodConfig"
import {setImportContactResult, setImportMethod} from "../../../actions/importContactActions";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import History from "../../../history";
import {connectToQuickbooks, connectToSalesforce} from "../../../services/clientContactService";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";


const ImportMethod = ({ setImportMethod, onNextPress, setActiveStep, setImportContactResult, globalAlert}) => {
    const handleOnClick = (payload) => {
        if(payload === "quickBooks"){
            connectToQuickbooks().then(res => {
                if (res.status === 200)
                {
                    if(res.result.url)
                    {
                        setImportMethod(payload);
                        let x = window.innerWidth/2 - 800/2;
                        let y = window.innerHeight/2 - 500/2;
                        window.open(res.result.url, "QuickBookWindow", "width=800,height=500,left="+x+",top="+y);
                        window.qbSuccess = function (res) {
                            setImportContactResult(res);
                            setActiveStep(2);
                        }
                        window.qbError = function (res) {
                            globalAlert({
                                type: "Error",
                                text: res ? res : "Error",
                                open: true
                            })
                        }
                    }
                }
            });
        } else if(payload === "salesforce"){
            connectToSalesforce().then(res => {
                if (res.status === 200)
                {
                    if(res.result.url)
                    {
                        setImportMethod(payload);
                        let x = window.innerWidth/2 - 800/2;
                        let y = window.innerHeight/2 - 500/2;
                        window.open(res.result.url, "SalesForceWindow", "width=800,height=500,left="+x+",top="+y);
                        window.sfSuccess = function (res) {
                            setImportContactResult(res);
                            setActiveStep(2);
                        }
                        window.sfError = function (res) {
                            globalAlert({
                                type: "Error",
                                text: res ? res : "Error",
                                open: true
                            })
                        }
                    }
                }
            });
        } else {
            setImportMethod(payload);
            onNextPress();
        }
    }
    const methodTile = (tile) => {
        return (
            <div className="import-box-types" key={tile.name} onClick={() => { handleOnClick(tile.key) }}>
                <img className="img-properties" src={tile.imageSource} alt={tile.image} />
                <span className="font-weight-bold d-block mt-2">{tile.name}</span>
            </div>
        )
    }
    const renderMethodTile = importMethodsConfig.map(tile => methodTile(tile));
    return (
        <div>
            <div className="carousel-inner">
                <div className="import-method-container">
                    <div align="center">
                        <div className="row">
                            <div className="col-sm-12 col-sm-offset-2">
                                <div className="tile-container" align="center">
                                    <span align="center">
                                        <strong>Select Import Data Source:</strong>
                                    </span>
                                    <div>
                                        {renderMethodTile}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-5 mb-5" align="center">
                                <Button variant="contained" color="primary" onClick={() => { History.push('/clientContact'); }}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        setImportMethod: (payload) => { dispatch(setImportMethod(payload)) },
        setImportContactResult: (payload) => { dispatch(setImportContactResult(payload)) },
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) },
    }
}
export default connect(null, mapDispatchToProps)(ImportMethod);