import React, {useEffect, useState} from 'react';
import {Table} from "reactstrap";
import {getReportTwitterTweetsDetails} from "../../../services/socialMediaService";

const TwitterReport = ({ smId, encSsId, setSmName }) => {
    const [data,setData] = useState({});
    useEffect(() => {
        const data = `smId=${smId}&encSsId=${encSsId}`
        getReportTwitterTweetsDetails(data).then(res => {
            if (res?.status === 200) {
                setData(res?.result);
                setSmName(res?.result?.smName);
            }
        })
    }, [smId, encSsId, setSmName]);
    return(
        <div className="table-content-wrapper height-58 w-50 mx-auto mt-3 overflow-auto">
            <Table striped>
                <thead>
                <tr>
                    <th>Date</th>
                    <th width="20%" className="text-center">Retweets</th>
                    <th width="20%" className="text-center">Likes</th>
                </tr>
                </thead>
                <tbody>
                    {
                        data.hasOwnProperty("today") ?
                            !(data?.today && Object.keys(data?.today).length === 0 && Object.getPrototypeOf(data?.today) === Object.prototype) &&
                                data.today.msg === "" ?
                                    <tr>
                                        <td>Today</td>
                                        <td className="text-center"><i className="far fa-retweet mr-2 cursor-text"></i>{data.today.stwrTotalRetweets}</td>
                                        <td className="text-center"><i className="far fa-heart mr-2 cursor-text"></i>{data.today.stwrTotalLikes}</td>
                                    </tr>
                                :
                                    <tr>
                                        <td>Today</td>
                                        <td colSpan={2}>{data.today.msg}</td>
                                    </tr>
                        : null
                    }
                    {
                        data?.twitterTweetsList?.length > 0 ?
                            data?.twitterTweetsList?.map((value, index)=>{
                                return (
                                    <tr key={index}>
                                        <td>{value.stwrDate}</td>
                                        <td className="text-center"><i className="far fa-retweet mr-2 cursor-text"></i>{value.stwrTotalRetweets}</td>
                                        <td className="text-center"><i className="far fa-heart mr-2 cursor-text"></i>{value.stwrTotalLikes}</td>
                                    </tr>
                                );
                            })
                        : null
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default TwitterReport;