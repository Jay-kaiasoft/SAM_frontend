import React from "react";
import { Table } from "reactstrap";

const SubUser = ({
    subUserList
}) => {
    return (
        <div className="table-content-wrapper">
            <Table striped>
                <thead>
                    <tr style={{ backgroundColor: "#424242", color: "#ffffff" }}>
                        <td width="10%">Account No.</td>
                        <td>Name</td>
                        <td width="30%">SMS Campaign Phone Number</td>
                        <td width="30%">SMS Conversation Phone Number</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        subUserList.length > 0 ?
                            subUserList.map((user) => {
                                return (
                                    <tr key={user.memberId}>
                                        <td align="center">{user.memberId}</td>
                                        <td>{user.memName}</td>
                                        <td>{user.twilioNumber}</td>
                                        <td>{user.conversationsTwilioNumber}</td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={4} align="center">No sub user found.</td>
                            </tr>
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default SubUser