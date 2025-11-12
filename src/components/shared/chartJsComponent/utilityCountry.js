import {Col, Row} from "reactstrap";
import ChartJs from "./chartJs";
import {getColors} from "../../../assets/commonFunctions";
import { v4 as uuidv4 } from 'uuid';

export const createDataObject = (type,requestData) => {
    let labels = [];
    let data = [];
    let datasets = [];
    let totalColors = [];
    switch (type) {
        case "doughnut" :
            requestData?.countryFirstList?.forEach((value)=> {
                labels.push(value.countryName.length > 50 ? value.countryName.substr(0,47)+"..." : value.countryName);
                data.push(value.visit);
            });
            return {
                labels: labels,
                datasets: [{
                    label: 'My First Dataset',
                    data: data,
                    backgroundColor: getColors(requestData?.countryFirstList?.length),
                    borderWidth:0
                }]
            };
        case "doughnutWithPercentage" :
            labels = ["People Participated", "People Not Participated"];
            data.push(requestData.participatedPer === "NaN" ? 0 : requestData.participatedPer);
            data.push(100 - (requestData.participatedPer === "NaN" ? 0 : requestData.participatedPer));
            return {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: getColors(2),
                        borderWidth:0
                    }
                ],
                text: data[0] + "%"
            }
        case "bar" :
            labels = [requestData.stateName];
            totalColors = getColors(requestData.cityList.length);
            requestData.cityList.map((value,index)=>(
                datasets.push({
                    label: value.cityName.length > 50 ? value.cityName.substr(0,47)+"..." : value.cityName,
                    data: [value.visit],
                    backgroundColor: totalColors[index],
                    barPercentage: 0.1,
                    categoryPercentage: 1
                })
            ))
            return {
                labels: labels,
                datasets: datasets
            };
        default :
            return {};
    }
}
export const createOptionsObject = (type, requestData) => {
    switch (type) {
        case "doughnut" :
            return {
                plugins: {
                    title: {
                        display: true,
                        text: `${requestData.peopleParticipated} People Participated`
                    },
                    legend: {
                        position: 'top',
                        labels:{
                            usePointStyle: true,
                            pointStyle: 'rect'
                        },
                        align:'start'
                    }
                }
            };
        case "doughnutWithPercentage" :
            return {
                plugins: {
                    title: {
                        display: true,
                        text: `${requestData.peopleParticipated} People Participated / ${requestData.peopleAsk} People Ask`
                    },
                    legend: {
                        position: 'top',
                        labels:{
                            usePointStyle: true,
                            pointStyle: 'rect'
                        },
                        align:'start'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label} : ${context.raw}%` || '';
                            }
                        }
                    }
                }
            };
        case "bar" :
            return {
                plugins: {
                    legend: {
                        position: 'top',
                        labels:{
                            usePointStyle: true,
                            pointStyle: 'rect'
                        },
                        align:'start'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                responsive:true,
                maintainAspectRatio:false,
            };
        default :
            return {};
    }
}
export const CountryStateList = ({value, index, isAnimated=true}) => {
    return (
        <div className="border mt-5 country-main">
            <h5 className="mt-3 text-center">{value.countryName}</h5>
            {
                value.stateList.length > 0 ?
                    value.stateList.map((sValue,sIndex)=>(
                        <Row className="mb-3" key={sIndex}>
                            <Col xs={12} md={12} lg={12} xl={12} className="mx-auto state-main" style={{maxWidth:"1000px",height:"250px"}}>
                                <ChartJs counter={uuidv4()} type='bar' data={createDataObject('bar',sValue)} options={createOptionsObject('bar',sValue)} isAnimated={isAnimated}/>
                            </Col>
                        </Row>
                    ))
                : null
            }
        </div>
    );
}