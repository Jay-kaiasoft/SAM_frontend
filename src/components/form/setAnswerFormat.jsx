import React, {Fragment} from "react";


const SetAnswerFormat = ({queV}) => {
    let queType=queV.queType;
    let singleValueControl = ["open_ended", "single_answer_button", "date_control", "time_control", "rating_box", "rating_symbol", "rating_radio", "yes_no", "email", ];
    let singleMultipleValueControl = ["single_answer", "single_answer_checkbox", "single_answer_combo", "rank"];
    let keyValueControl = ["contact_form", "matrix"];
    let imageValueControl = ["image_form", "image_with_text_form"];
    return (
        <>
            {
                (() => {
                    if(singleValueControl.includes(queType)){
                        return  <span className="answer-bg">{JSON.parse(queV.queAnswers).value}</span>;
                    }else if(singleMultipleValueControl.includes(queType)){
                        if(typeof JSON.parse(queV.queAnswers).value === "string"){
                            return  <span className="answer-bg">{JSON.parse(queV.queAnswers).value}</span>;
                        } else if(typeof JSON.parse(queV.queAnswers).value === "object"){
                            return JSON.parse(queV.queAnswers).value.map((v, i)=>{
                                return <span key={i} className="answer-bg">{v}</span>;
                            })
                        }
                    }else if(imageValueControl.includes(queType)){
                        if(typeof JSON.parse(queV.queAnswers).value === "string"){
                                return  (
                                    <div className="w-100 h-100">
                                        <div className="image-box d-flex align-items-center justify-content-center mx-auto mb-3">
                                            <img src={JSON.parse(queV.queAnswers).value} className="img-control-items" alt="Answer"/>
                                        </div>
                                    </div>
                                );
                            } else if(typeof JSON.parse(queV.queAnswers).value === "object"){
                                return  (
                                    <>
                                    {
                                        JSON.parse(queV.queAnswers).value.map((v, i)=>{
                                            return (
                                                <Fragment key={i}>
                                                    <div className="w-100 h-100">
                                                        <div className="image-box d-flex align-items-center justify-content-center mx-auto mb-3">
                                                            <img src={v} className="img-control-items" alt="Answer"/>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            );
                                        })
                                    }
                                    </>
                                );
                            }
                    }else if(keyValueControl.includes(queType)){
                        return (
                            <>
                                {
                                    Object.keys(JSON.parse(queV.queAnswers).value).map((val, index)=>{
                                        return (
                                            <span className="answer-bg" key={index} style={{whiteSpace: "pre-line"}}>
                                                {`${val} : ${typeof JSON.parse(queV.queAnswers).value[val] === "string"?
                                                    JSON.parse(queV.queAnswers).value[val]:
                                                    JSON.parse(queV.queAnswers).value[val] instanceof Array?
                                                        JSON.parse(queV.queAnswers).value[val].join(", "):
                                                        printJsonHelper(JSON.parse(queV.queAnswers).value[val])
                                                        }`}              
                                            </span>
                                        );
                                    })
                                }
                            </>
                        );
                    }else if(queType === "constant_sum"){
                        return (
                            <>
                                {
                                    Object.keys(JSON.parse(queV.queAnswers).value.questions).map((val, index)=>{
                                        return (<span className="answer-bg" key={index} style={{whiteSpace: "pre-line"}}>
                                            {`${val} : ${JSON.parse(queV.queAnswers).value.questions[val]}`}
                                        </span>);
                                    })
                                }
                                <span className="answer-bg">{`Total : ${JSON.parse(queV.queAnswers).value.total}${JSON.parse(queV.queAnswers).value.mustTotalTo > 0?`/${JSON.parse(queV.queAnswers).value.mustTotalTo}`:""}`}</span>
                            </>
                        );
                    }else if(queType === "consent_agreement" || queType === "sms_consent_agreement"){
                        if(JSON.parse(queV.queAnswers).value){
                            return <span className="answer-bg">Agree</span>;
                        }else{
                            return <span className="answer-bg">Disagree</span>;
                        }
                    } else if(queType === "phone"){
                        return(
                            <span className="answer-bg">
                                {`${(JSON.parse(queV.queAnswers).value.countryCode).trim()} ${JSON.parse(queV.queAnswers).value.PhoneNo}`}
                            </span>
                        );
                    }
                })()
            }
        </>
    );
}

const printJsonHelper = (obj) => {
    let x = ``;
    Object.keys(obj).forEach((val)=>{
        x += ` ${val} :- ${obj[val]},`
    })
    return x.slice(0, -1);
}

export default SetAnswerFormat;