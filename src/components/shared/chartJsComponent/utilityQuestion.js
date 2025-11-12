import {Col, Row} from "reactstrap";
import ChartJs from "../../shared/chartJsComponent/chartJs";
import {getColors} from "../../../assets/commonFunctions";
import { v4 as uuidv4 } from 'uuid';
import {Fragment} from "react";
import { usercontentUrl } from "../../../config/api";
import {Modal, ModalHeader, ModalBody, ModalFooter, Table} from "reactstrap";
import {Button, Link} from "@mui/material";

const createDataObject = (type, requestData) => {
    let labels = [];
    let data = [];
    let datasets = [];
    let totalColors = [];
    switch (type) {
        case "pie" :
            requestData?.optionList?.forEach((value, index) => {
                if(value.optionVal.toString().includes(usercontentUrl)){
                    labels.push(`Image ${index+1}`);
                } else {
                    labels.push(`${(value.optionVal.length > 50) ? value.optionVal.substr(0,47)+"..." : value.optionVal}`);
                }
                data.push(value.perColor);
            });
            return {
                labels: labels,
                datasets: [{
                    label: 'My First Dataset',
                    data: data,
                    backgroundColor: getColors(requestData?.optionList?.length),
                    borderWidth:0
                }]
            };
        case "bar" :
            labels = [(requestData?.question?.length > 50) ? requestData?.question?.substr(0,47)+"..." : requestData?.question];
            totalColors = getColors(requestData.optionList.length);
            requestData?.optionList?.map((value,index)=>(
                datasets.push({
                    label: value.optionVal.toString().includes(usercontentUrl) ? `Image ${index+1}` : `${(value.optionVal.length > 50) ? value.optionVal.substr(0,47)+"..." : value.optionVal}`,
                    data: [value.totalAns],
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
const createOptionsObject = (type) => {
    switch (type) {
        case "pie" :
            return {
                plugins: {
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
                },
                responsive:true,
                maintainAspectRatio:false,
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
                maintainAspectRatio:false
            };
        default :
            return {};
    }
}
export const OptionQuestion = ({value, index, pieChart=true, barChart=false, isAnimated=true, handleClickCommentIcon = ()=>{}}) => {
    let size = (pieChart && barChart)?4:6;
    let tc = getColors(value?.optionList?.length);
    return (
        <Row className="mt-3 questions">
            <Col xs={12} md={12} lg={size} xl={size}>
                <h5 className="d-flex justify-content-between">{`${value.disOrder}. ${value.question}`}<span>{value.totalAnsForQues}</span></h5>
                {
                    value?.optionList?.length ?
                        value?.optionList?.map((oValue, oIndex) => (
                            <div key={oIndex} className="ml-3 d-flex justify-content-between">
                                <p className="d-flex align-items-center">
                                    <span className="small-color-box" style={{backgroundColor:tc[oIndex]}}></span>
                                    <span className="mx-3 text-center">{oValue.perColor}%</span>
                                    {
                                        oValue.optionVal.toString().includes(usercontentUrl) ?
                                            <img src={`${oValue.optionVal}`} alt={`${oValue.optionVal}`} style={{maxWidth:"100px",maxHeight: "100px"}} />
                                        :
                                            <span>{oValue.optionVal}</span>
                                    }
                                    {oValue?.hasComment === true && <i className="far fa-comment-lines ml-3" onClick={()=>{handleClickCommentIcon(value.question, oValue.optionVal, oValue.comments)}}></i>}
                                    {typeof oValue.optionDescription !== "undefined" && <span className="mx-3">{oValue.optionDescription}</span>}
                                </p>
                                <span>{oValue.totalAns}</span>
                            </div>
                        ))
                    : null
                }
            </Col>
            {
                (barChart) ?
                    <Col xs={12} md={12} lg={size} xl={size}>
                        <ChartJs counter={uuidv4()} type='bar' data={createDataObject('bar', value)} options={createOptionsObject('bar')} isAnimated={isAnimated} />
                    </Col>
                : null
            }
            {
                (pieChart) ?
                    <Col xs={12} md={12} lg={size} xl={size} className="mx-auto">
                        <ChartJs counter={uuidv4()} type='pie' data={createDataObject('pie', value)} options={createOptionsObject('pie')} isAnimated={isAnimated} />
                    </Col>
                :null
            }
        </Row>
    );
}
export const TextQuestion = ({value, handleClickMoreTextAnserIcon=()=>{}}) => {
    return (
        <Row className="mt-3 questions">
            <Col xs={12} md={12} lg={12} xl={12}>
                <h5>{`${value.disOrder}. ${value.question}`}</h5>
                {
                    value?.optionList?.length ?
                        <>
                            <ul>
                                {
                                    value?.optionList?.filter((_, index)=>(index < 3)).map((aValue, aIndex) => (
                                        <li key={aIndex}>{aValue.optionVal}</li>
                                    ))
                                }
                                {
                                    value?.optionList?.length > 3 ?
                                        <li style={{listStyle:"none", marginLeft: -14, cursor:"pointer"}} onClick={()=>{handleClickMoreTextAnserIcon(value.question, value?.optionList)}}>
                                            <p className="text-primary">More...</p>
                                        </li>
                                    :null
                                }
                            </ul>
                        </>
                    : null
                }
            </Col>
        </Row>
    )
}
export const ContactForm = ({ value }) => {
    return (
        <Row className="mt-3 questions">
            <Col xs={12} md={12} lg={12} xl={12}>
                <h5>{`${value.disOrder}. ${value.question}`}</h5>
                {
                    value?.optionList?.length ?
                        value?.optionList?.map((contactInfo, index) => {
                            return (
                                <Row key={index} className={`${index !== value?.optionList?.length - 1 && "border-bottom"} py-3 px-3`}>
                                    {value?.labels?.map((label, subIndex) => {
                                        return (
                                            <Col xs={12} md={12} lg={6} xl={6} key={subIndex} className="mb-2">
                                                <Row className="px-5">
                                                    <Col xs={4} md={4} className="d-flex justify-content-between">
                                                        <span><b>{label}</b></span>
                                                        <span>:</span>
                                                    </Col>
                                                    <Col xs={8} md={8}>
                                                        <p className="ml-4 mb-0">{contactInfo[label]}</p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            )
                        })
                    : null
                }
            </Col>
        </Row>
    )
}

export const RenderMatrix = ({ value, pieChart=true, barChart=false, isAnimated = true }) => {
    return (
        <Row className="mt-3 questions">
            <Col xs={12} md={12} lg={12} xl={12}>
                <Row>
                    <Col xs={12} md={12} lg={6} xl={6}>
                        <h5 className="d-flex justify-content-between">{`${value.disOrder}. ${value.question}`}<span>{value.totalAnsForQues}</span></h5>
                    </Col>
                </Row>
                {
                    value?.rows?.map((row, index) => {
                        const questionData = {
                            question: row,
                            optionList: value[row]
                        }
                        let size = (pieChart && barChart)?4:6;
                        let tc = getColors(value[row]?.length);
                        return (
                            <Row key={index}>
                                <Col xs={12} md={12} lg={size} xl={size}>
                                    <p className="ml-3">{row}</p>
                                    {value[row]?.map((item, itemIndex) => {
                                        return (
                                            <div key={itemIndex} className="ml-3 d-flex justify-content-between">
                                                <p className="ml-3 d-flex align-items-center"><span className="small-color-box" style={{backgroundColor:tc[itemIndex]}}></span><span className="mr-2 width-50px text-center">{item.perColor}%</span>{`${item?.optionVal}`}</p>
                                                <span>{item.totalAns}</span>
                                            </div>
                                        )
                                    })}
                                </Col>
                                {
                                    (barChart) ?
                                            <Col xs={12} md={12} lg={size} xl={size}>
                                                <ChartJs counter={uuidv4()} type='bar' data={createDataObject('bar', questionData)} options={createOptionsObject('bar')} isAnimated={isAnimated} />
                                            </Col>
                                    : null
                                }
                                {
                                    (pieChart) ?
                                        <Col xs={12} md={12} lg={size} xl={size}>
                                            <ChartJs counter={uuidv4()} type='pie' data={createDataObject('pie', questionData)} options={createOptionsObject('pie')} isAnimated={isAnimated} />
                                        </Col>
                                    :
                                        null
                                }
                            </Row>
                        )
                    })
                }
            </Col>
        </Row>
    )
}

export const RenderMatrixText = ({ value }) => {
    return (
        <Row className="mt-3 questions">
            <Col xs={12} md={12} lg={12} xl={12}>
                <h5>{`${value.disOrder}. ${value.question}`}</h5>
                {
                    value?.optionList?.map((olValue, olIndex) => {
                        return (
                            <Row key={olIndex} className={`${olIndex !== value?.optionList?.length - 1 && "border-bottom"} py-3 px-3`}>
                                {
                                    value?.rows?.map((rValue, rIndex) => {
                                        return (
                                            <Fragment key={rIndex}>
                                                <Col xs={12} md={12} lg={12} xl={12} className="pl-3 mb-2"><strong>{rValue}</strong></Col>
                                                {
                                                    value?.columns?.map((cValue, cIndex) => {
                                                        return (
                                                            <Col xs={12} md={12} lg={12} xl={12} className="pl-3 mb-2" key={cIndex}>
                                                                <Row className="pl-3">
                                                                    <Col xs={3} md={3} className="d-flex justify-content-between">
                                                                        <span>{cValue}</span>
                                                                        <span>:</span>
                                                                    </Col>
                                                                    <Col xs={9} md={9}>
                                                                        <p className="ml-4 mb-0">{olValue[rValue][cValue]}</p>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </Fragment>
                                        )
                                    })
                                }
                            </Row>
                        )
                    })
                }
            </Col>
        </Row>
    )
}
export const CommentData = ({modalCommentData, toggleCommentData, commentData, reportType}) => {
    const handleClickPrint = () => {
        let tempCommentData = {...commentData, "reportType":reportType};
        sessionStorage.setItem("commentData", JSON.stringify(tempCommentData));
        window.open(`/reportcommentpdf`);
    }
    return (
        <Modal isOpen={modalCommentData} size="lg">
            <ModalHeader toggle={toggleCommentData} className="d-flex align-items-center">
                <sapn>Comment Data</sapn>
                <Link component="a" className="btn-circle ml-3" data-toggle="tooltip" title="Print" style={{zIndex:"9",lineHeight:0}} onClick={()=>{handleClickPrint()}}>
                <i className="far fa-print"></i>
                <div className="bg-dark-blue"></div>
                </Link>
            </ModalHeader>
            <ModalBody>
                <p><span className="font-weight-bold">Survey</span> : {commentData.name}</p>
                <p><span className="font-weight-bold">Question</span> : {commentData.question}</p>
                <p><span className="font-weight-bold">Option</span> : {commentData.optionVal}</p>
                <div className="table-content-wrapper height-58 overflow-auto">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center" style={{width:"10%"}}>No.</th>
                                <th>Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                commentData?.comments?.length > 0 ?
                                    commentData?.comments?.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{element}</td>
                                            </tr>
                                        );
                                    })
                                :
                                    <tr>
                                        <td colSpan={2} className="text-center">No comment found</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={toggleCommentData}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}

export const TextAnswerData = ({modalTextAnswerData, toggleTextAnswerData, textAnswerData}) => {
    const handleClickPrint = () => {
        let tempTextAnswerData = {...textAnswerData, "reportType":"Survey"};
        sessionStorage.setItem("textAnswerData", JSON.stringify(tempTextAnswerData));
        window.open(`/reporttextanswerpdf`);
    }
    return (
        <Modal isOpen={modalTextAnswerData} size="lg">
            <ModalHeader toggle={toggleTextAnswerData} className="d-flex align-items-center">
                <sapn>Text Answer Data</sapn>
                <Link component="a" className="btn-circle ml-3" data-toggle="tooltip" title="Print" style={{zIndex:"9",lineHeight:0}} onClick={()=>{handleClickPrint()}}>
                <i className="far fa-print"></i>
                <div className="bg-dark-blue"></div>
                </Link>
            </ModalHeader>
            <ModalBody>
                <p><span className="font-weight-bold">Survey</span> : {textAnswerData.name}</p>
                <p><span className="font-weight-bold">Question</span> : {textAnswerData.question}</p>
                <div className="table-content-wrapper height-58 overflow-auto">
                    <Table striped>
                        <thead>
                            <tr>
                                <th className="text-center" style={{width:"10%"}}>No.</th>
                                <th>Answers</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            textAnswerData?.answers?.length > 0?
                                textAnswerData?.answers.map((element, index)=>{
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{element?.optionVal}</td>
                                        </tr>
                                    );
                                })
                            :null
                        }
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={toggleTextAnswerData}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    );
}