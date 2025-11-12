import React, {useEffect, useMemo, useState} from 'react';
import {connect} from "react-redux";
import {Row, Col, Form, FormGroup} from "reactstrap";
import {Button, TextField} from "@mui/material";
import {Table} from 'reactstrap';
import $ from 'jquery';
import {getSubAccountTypeDetails} from "../../services/profileService";
import History from "../../history";
import {saveSubUserType} from "../../actions/userActions";
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import { easUrlEncoder } from '../../assets/commonFunctions';

const AddSubAccountType = (props) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(props.location.search)) }, [props.location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const { user } = props;
    const [data,setData]=useState({});
    const [styName,setStyName]=useState("");
    let pgn="";

    useEffect(()=>{
        $(document).ready(function() {
            $(".actionBtn").unbind("click").click(function(){
                let cn = $(this).val();
                if($(this).prop("checked")===true)
                {
                    $("."+cn).prop("checked",true);
                }
                else
                {
                    $("."+cn).prop("checked",false);
                }
            });
            $(".pageBtn").unbind("click").click(function(){
                let cn = $(this).val();
                if($(this).prop("checked")===true)
                {
                    $("."+cn).prop("checked",true);
                }
                else
                {
                    $("."+cn).prop("checked",false);
                }
            });
            $(".actionAll").unbind("click").click(function(){
                if($(".actionAll").prop("checked")===true)
                {
                    $(".pageBtn:checked").trigger("click");
                    setTimeout(function () {
                        $(".pageBtn").trigger("click");
                        $(".actionBtn").prop("checked",true);
                    }, 200);
                }
                else
                {
                    $(".pageBtn:checked").trigger("click");
                    $(".actionBtn").prop("checked",false);
                }
            });
            $('td input[type="checkbox"]:not(.pageBtn)').unbind("click").click(function(){
                let cn = $(this).attr("class");
                cn = cn.split(" ");
                if(cn[0]!=="perView")
                {
                    $("."+cn[1]+".perView").prop("checked",true);
                }
            });
        });
        setStyName(typeof data.subaccountType !== "undefined" ? data.subaccountType.styName : "")
    },[data]);
    useEffect(()=>{
        getSubAccountTypeDetails(id).then(res => {
            if (res.result) {
                setData(res.result);
            }
        })
    },[id]);
    const cancel = () => {
        History.push("/manageusers");
    }
    const submitForm = (e) => {
        e.preventDefault();
        if(styName.trim()==="")
        {
            props.globalAlert({
                type: "Error",
                text: "Please enter name.",
                open: true
            })
            return false;
        }
        let ci=0;
        let saveData = '{';
        saveData += '"styName":"'+styName+'",';
        saveData += '"styId":'+(id ? id : 0)+',';
        saveData += '"styMemberId":'+user.memberId+',';
        saveData += '"pages":[';
        data["pages"].map((v,i)=>(
            ($(`[name="ac_ids_${v.pgId}[]"]:checked`).length>0) ?
                $(`[name="ac_ids_${v.pgId}[]"]:checked`).each(function (){
                    if(ci!==0)
                    {
                        saveData += ',';
                    }
                    saveData += '{';
                    saveData += '"perPgId":'+v.pgId+',';
                    saveData += '"perActionName":"'+$(this).val()+'"';
                    saveData += '}';
                    ci=1;
                })
            :
                null
        ));
        saveData += ']';
        saveData += '}';
        props.addSubUserType(JSON.parse(saveData));
    }
    return (
        <>
            <Row className="midleMain pt-0">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3 className="mt-3">Add Sub Account Type</h3>
                    <Form onSubmit={submitForm}>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <FormGroup >
                                    <TextField
                                        type="text"
                                        id="sty_name"
                                        name="sty_name"
                                        label="Sub Account Type Name"
                                        value={styName}
                                        onChange={(e)=>{setStyName(e.target.value)}}
                                        fullWidth
                                        autoComplete="off"
                                        variant="standard"
                                    />
                                </FormGroup>
                            </Col>
                            {
                                $.isEmptyObject(data) ?
                                    ""
                                :
                                <>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <div className="table-content-wrapper2 m-0">
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" style={{width:"30px"}}><input type="checkbox" className="actionAll"/></th>
                                                        <th style={{padding: "5px !important"}}>Functionality</th>
                                                        <th style={{padding: "5px !important"}}>Module</th>
                                                        {
                                                            data["acName"].map((v,i)=>{
                                                                return <th className="text-center" key={i}>{v.acName}<br/><input type="checkbox" className="actionBtn" value={`per${v.acName}`} /></th>;
                                                            })
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data["pages"].map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    {
                                                                        pgn!==v.pgName ?
                                                                            (<>
                                                                                <td className="text-center" style={{width:"30px", padding: "5px !important"}}><input type="checkbox" className="pageBtn" value={v.pgName.replaceAll(" ","")} /></td>
                                                                                <td>{pgn=v.pgName}</td>
                                                                            </>)
                                                                            :
                                                                            (<>
                                                                                <td style={{width:"30px", padding: "5px !important"}}></td>
                                                                                <td></td>
                                                                            </>)
                                                                    }
                                                                    <td>{v.pgModuleName}</td>
                                                                    {
                                                                        data["acName"].map((av, ai) => {
                                                                            return <td className="text-center" key={ai} style={{width:"30px", padding: "5px !important"}}>{v.pgdActionName.includes(av.acName) ? <input type="checkbox" className={`per${av.acName} ${v.pgName.replaceAll(" ","")} ${v.pgModuleName.replaceAll(" ","")}`} name={`ac_ids_${v.pgId}[]`} value={av.acName} defaultChecked={typeof v.pgdCheckedActionName !== "undefined" && v.pgdCheckedActionName.includes(av.acName) ? "checked" : ""} /> : ""}</td>
                                                                        })
                                                                    }
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        
                                        </div>

                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3 mb-4">
                                        <Button type="submit" variant="contained" color="primary">SAVE</Button>
                                        <Button type="submit" variant="contained" className="ml-2" color="primary" onClick={() => cancel()}>CANCEL</Button>
                                    </Col>
                                </>
                            }
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        addSubUserType: (data) => {
            dispatch(saveSubUserType(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSubAccountType);