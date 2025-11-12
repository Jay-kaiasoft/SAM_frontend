import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import History from '../../history'
import {deleteSubUserType, getUserType} from '../../services/profileService.js'
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";


const SubAccountTypeList = (props) => {
    const [data, setData] = useState([]);
    const editeType = (i) => {
        History.push("/subaccounttype?v=" + i);
    }
    const deleteType = (i) => {
        deleteSubUserType(i).then(res => {
            if (res.status === 200) {
                const filterTypes = [...data];
                setData(filterTypes.filter(x => x.styId !== i));
                props.globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                })
            }
            else {
                props.globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                })
            }
        })
    }

    useEffect(() => {
        getUserType().then(res => {
            if (res.result) {
                if (res.result.subaccountType) {
                    setData(res.result.subaccountType)
                }
            }
        })
    }, []);
    return (
        <>
            <div className="table-content-wrapper height-58 overflow-auto m-0">
                <Table>
                    <thead>
                        <tr>
                            <th>Sub Account Type</th>
                            <th className="text-center" style={{"width":"10%"}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 ?
                                    data.map((r, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{r.styName}</td>
                                                <td className="text-center">
                                                    <i className="mx-1 far fa-pencil-alt" onClick={()=>{editeType(r.styId)}} data-toggle="tooltip" title="Edit"/>
                                                    <i 
                                                        className="mx-1 far fa-trash-alt" 
                                                        onClick={()=>{
                                                            props.confirmDialog({
                                                                open: true,
                                                                title: 'Are you sure you want to delete selected sub account type?',
                                                                onConfirm: () => {deleteType(r.styId)}
                                                            })
                                                        }} 
                                                        data-toggle="tooltip" 
                                                        title="Delete"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                :
                                <tr key={0}><td className="text-center" colSpan="2">No Sub Account Type Found.</td></tr>
                        }
                        
                    </tbody>
                </Table>
            </div>
        </>
    )
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
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
export default connect(mapStateToProps,mapDispatchToProps)(SubAccountTypeList)