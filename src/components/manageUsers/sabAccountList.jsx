import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import History from '../../history'
import { getSubUsersList, deleteSubUser } from '../../services/profileService.js'
import {setGlobalAlertAction} from "../../actions/globalAlertActions";
import {setConfirmDialogAction} from "../../actions/confirmDialogActions";
import { saveSubUsers } from '../../actions/userActions.js';

const SubAcountsList = (props) => {
    const [data, setData] = useState([]);
    const editeUser = (i) => {
        History.push("/subaccount?v=" + i);
    }
    const deleteUser = (i) => {
        deleteSubUser(i).then(res => {
            if (res.status === 200) {
                const filterUsers = [...data]
                setData(filterUsers.filter(x => x.memberId !== i));
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
    const handleClickSendInvitation = (id) => {
        let user = data.filter(x => x.memberId === Number (id))[0];
        props.addSubUser(
            [{
                ...user,
                btnType: "sendInvitation"
            }]
        );
    }

    useEffect(() => {
        getSubUsersList().then(res => {
            if (res.result) {
                if (res.result.subaccount) {
                    setData(res.result.subaccount)
                }
            }
        })
    }, []);

    return (
        <>
            <div className="table-content-wrapper height-58 overflow-auto m-0">
                <Table striped>
                    <thead>
                        <tr role="row">
                            <th style={{"width":"14%"}}>Sub Account Type</th>
                            <th style={{"width":"16%"}}>First Name</th>
                            <th style={{"width":"16%"}}>Last Name</th>
                            <th style={{"width":"24%"}}>Email</th>
                            <th style={{"width":"14%"}}>Phone</th>
                            <th style={{"width":"8%"}}>Status</th>
                            <th className="text-center" style={{"width":"8%"}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 ?
                                data.map((r, i) =>
                                    <tr key={i}>
                                        <td>{r.subaccountTypeName}</td>
                                        <td>{r.firstName}</td>
                                        <td>{r.lastName}</td>
                                        <td>{r.email}</td>
                                        <td>{r.phone}</td>
                                        <td>{r.status}</td>
                                        <td className="text-right">
                                            {r.status === "Pending" && <i className="mx-1 far fa-envelope" onClick={()=>{handleClickSendInvitation(r.memberId)}} data-toggle="tooltip" title="Send Invitation"/>}
                                            <i className="mx-1 far fa-pencil-alt" onClick={()=>{editeUser(r.memberId)}} data-toggle="tooltip" title="Edit"/>
                                            <i className="mx-1 far fa-trash-alt" onClick={()=>{deleteUser(r.memberId)}} data-toggle="tooltip" title="Delete"/>
                                        </td>
                                    </tr>
                                ) 
                            :
                                <tr key={0}><td colSpan="7">No Data Found</td></tr>   
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
        addSubUser: (data) => {
            dispatch(saveSubUsers(data))
        },
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        confirmDialog: (data) => {
            dispatch(setConfirmDialogAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(SubAcountsList)