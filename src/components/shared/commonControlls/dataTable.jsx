import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
    { field: 'id', headerName: 'No', width: 70 },
    { field: 'date', headerName: 'Date', width: 180 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'type', headerName: 'Type', width: 180 },
    { field: 'totalmember', headerName: 'Total Members / Responses', width: 180 },
    { field: 'approxcost', headerName: 'Approx Cost', width: 180 },
    { field: 'billstype', headerName: 'Bills Type', width: 180 }
];

const rows = [
    { id: 1, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 2, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 3, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 4, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 5, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 6, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 7, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 8, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 9, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 10, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 11, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 12, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
    { id: 13, date: '14/05/021', name: 'Snow', type: 'Jon', totalmember: 'abc',approxcost:20 ,billstype: "billing" },
];
const DataTable = (props) => {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
}
export default DataTable;