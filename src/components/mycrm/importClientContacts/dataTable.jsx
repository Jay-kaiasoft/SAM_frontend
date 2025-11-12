import React, {  useState } from "react";
import { Button } from "@mui/material";
import { pathOr } from "ramda";
import { connect } from "react-redux";
import { uploadCellDataOnServer } from "../../../services/clientContactService";
import { setGlobalAlertAction } from "../../../actions/globalAlertActions";

const allOptionList = ["firstName", "lastName", "fullName", "email", "phoneNumber", "phone", "usDefaultLanguage", "streetAddress1", "streetAddress2", "city", "state", "zipPostalCode", "country", "birthday", "gender", "dateAdded", "dateLastModified", "signupSource", "contactRating", "optInIPAddress", "optInDate", "confirmIP", "confirmDateTime", "optOutIpAddress", "latitude", "longitude", "gmtOff", "dstOff", "timezone", "region", "notes", "tags", "emailClientUsed", "age", "cc", "leid", "euid", "jobTitle", "emailPermissionStatusOther", "emailLists", "emailStatusOther", "udf1", "udf2", "udf3", "udf4", "udf5", "udf6", "udf7", "udf8", "udf9", "udf10"];
const modifyHeaders = (data) => {
    let headers = {};
    allOptionList.forEach(key => {
        if (data[key] !== undefined) {
            headers[key] = data[key];
        }
    })
    return headers;
}
const modifyData = (data, headers) => {
    let tableData = [];
    data.forEach(it => {
        let rowData = []
        Object.keys(headers).forEach(cellKey => {
            let value = "";
            if (it[cellKey] !== null) {
                value = it[cellKey]
            }
            const cellData = {
                key: cellKey,
                value: value,
            }
            rowData.push(cellData)
        })
        tableData.push(rowData);
    })
    return tableData;
}

const DataTable = ({
    onBackPress,
    onNextPress,
    onCancelPress,
    tableData,
    invalidEmails,
    totalRecord,
    tableHeaders,
    globalAlert
}) => {
    const dataToRender = tableData;
    const modifiedHeaders = modifyHeaders(tableHeaders);
    const [modifiedTableData, setModifiedTableData] = useState(modifyData(dataToRender, modifiedHeaders))
    const changeCellData = (e, rowno, key) => {
        dataToRender[rowno][key] = e.target.value;
        setModifiedTableData(modifyData(dataToRender, modifiedHeaders))
    }
    const uploadCellData = (value, key, rowno) => {
        const payload = {
            emailId: dataToRender[rowno]['emailId'],
            key: key,
            value: value
        }
        uploadCellDataOnServer(payload).then(resp => {
            if (resp && resp.status && resp.status === 200) {
                // History.push("/dashboard");
            } else {
                setModifiedTableData(modifyData(tableData, tableHeaders))
                globalAlert({
                    type: "Error",
                    text: resp ? resp.message : "Error",
                    open: true
                })
            }
        })
    }
    const renderCellData = (cell, rowno) => {
        return (
            <td align="left" className="px-1 py-2 bg-white" key={cell.key}><input value={cell.value} className="pl-1 border-0" onChange={(e) => { changeCellData(e, rowno, cell.key) }} onBlur={() => uploadCellData(cell.value, cell.key, rowno)} /></td>
        )
    }
    const renderRow = (data, rowno) => {
        return (
            <tr key={rowno}>
                <td align="right" className="pr-1 bg-white">
                    {rowno+1}
                </td>
                {data.map(cell => renderCellData(cell, rowno))}
            </tr>
        )
    }
    const renderTableData = () => {
        let i = 0;
        const renderedTableData = modifiedTableData.map(it => renderRow(it, i++));
        return (
            <>
                {renderedTableData}
            </>
        )
    }
    return (
        <div className="row">
            <div className="col-sm-12 min-height-500" align="center">
                <div id="overflow" className="dataTableContainer">
                    <table id="overmain" align="center" border="1" className="table-main">
                        <tbody>
                            {
                                modifiedTableData.length === 0 ?
                                    <tr><td align="center" className="tableLabels"><strong>All data is correct. Please click on next step.</strong></td></tr>
                                :
                                    <tr>
                                        <td align="left" className="tableLabels"><div><strong>No</strong></div></td>
                                        {Object.keys(modifiedHeaders).map((it) => (
                                            <td align="left" className="tableLabels" key={it}><div><strong>{tableHeaders[it]}</strong></div></td>
                                        ))}
                                    </tr>
                            }
                            {renderTableData()}
                        </tbody>
                    </table>
                </div>
                <div className="mt-5">
                    <table border="1" cellPadding="2" cellSpacing="2" className="recordsTableContainer" >
                        <tbody>
                            <tr>
                                <td align="left" className="tabelLabelColumn">Total Records</td>
                                <td align="center" className="tableDataColumn">{totalRecord}</td>
                            </tr>
                            <tr>
                                <td align="left" className="tabelLabelColumn">Incorrect Email Structure</td>
                                <td align="center" className="tableDataColumn">{invalidEmails}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-12 text-center mt-3 mb-5">
                <Button variant="contained" color="primary" onClick={onBackPress}><i className="far fa-long-arrow-left mr-2"></i>BACK</Button>
                <Button variant="contained" color="primary" onClick={onNextPress} className="ml-3 mr-3"><i className="far fa-long-arrow-right mr-2"></i>NEXT</Button>
                <Button variant="contained" color="primary" onClick={onCancelPress}><i className="far fa-times mr-2"></i>CANCEL</Button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        tableData: pathOr([], ["importContact", "importContactData", "body"], state),
        tableHeaders: pathOr([], ["importContact", "importContactData", "dataTableHeaders"], state),
        invalidEmails: pathOr(0, ["importContact", "importContactData", "invalidEmails"], state),
        totalRecord: pathOr(0, ["importContact", "importContactData", "totalRecord"], state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (payload) => { dispatch(setGlobalAlertAction(payload)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);