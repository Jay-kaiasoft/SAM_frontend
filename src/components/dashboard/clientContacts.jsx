import React from "react";
import { Table } from "reactstrap";

const ClientContacts = ({ moduleDetails }) => {
    return (
        <>
            <p className="text-center">Client Contacts</p>
            <div className="table-conntainer">
                <Table borderless striped>
                    <thead>
                        <tr>
                            <th className="text-left">FIRST NAME</th>
                            <th className="text-left">LAST NAME</th>
                            <th className="text-left">EMAIL ID</th>
                            <th className="text-left">PHONE NUMBER</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleDetails?.contactList?.length > 0 ? moduleDetails?.contactList?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td align='left'>{item?.firstName}</td>
                                    <td align='left'>{item?.lastName}</td>
                                    <td align='left'>{item?.email}</td>
                                    <td align='left'>{item?.phoneNumber}</td>
                                </tr>
                            )
                        }) : <tr><td align='center' colSpan={4}>No Client Contact Found</td></tr>}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default ClientContacts