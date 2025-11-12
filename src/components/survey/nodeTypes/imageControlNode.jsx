import React, {useState, useEffect, useCallback} from 'react';
import { Handle, Position } from 'reactflow';
import AttachFormModal from '../attachFormModal';
import {getCustomFormLinkList} from "../../../services/customFormService";
import {Checkbox, FormControlLabel} from "@mui/material";

const ImageControlNode = ({data})=>{
    const [attachFormModal, setAttachFormModal] = useState(false);
    const [indices, setIndices] = useState({pageIndex: 0, questionIndex: 0, optionIndex: 0});
    const [customFormLinkList, setCustomFormLinkList] = useState([]);
    const toggleAttachFormModal = useCallback(()=>{
        setAttachFormModal(prev=>!prev);
    }, [setAttachFormModal]);
    const openModal = ()=>{setAttachFormModal(prev=>!prev)};
    const [optionCheckBoxVal, setOptionCheckBoxVal] = useState(data?.formLinks?.map((v)=>(v)) || []);
    const [optionCheckBoxFormNameVal, setOptionCheckBoxFormNameVal] = useState(data?.formNames?.map((v)=>(v)) || []);
    const setOptionCheckBoxFormNameValFunction = useCallback((optionIndex, name)=>{
        setOptionCheckBoxFormNameVal((prev)=>{
            prev[optionIndex] = name;
            return [...prev];
        });
    }, [setOptionCheckBoxFormNameVal]);
    useEffect(()=>{
        getCustomFormLinkList().then(res => {
            if (res.status === 200) {
                if (res.result.customFormList) {
                    let l = [];
                    res.result.customFormList.map((v) => (
                        l.push({ name: v.cfFormName, url: v.customFormUrl })
                    ))
                    setCustomFormLinkList(l);
                }
            }
        });
    }, []);
    const setOptionCheckBoxValFunction = useCallback((optionIndex, url)=>{
        setOptionCheckBoxVal((prev)=>{
            prev[optionIndex] = url;
            return [...prev];
        });
    }, [setOptionCheckBoxVal]);
    const handleChange = (event, pageIndex, questionIndex, optionIndex)=>{
        if(event.target.value === ""){
            setIndices((prev)=>{
                return {...prev, pageIndex: pageIndex, questionIndex: questionIndex, optionIndex: optionIndex}; 
            })
            openModal();
        } else {
            data.setLinkInSetData(data.type, pageIndex, questionIndex, optionIndex, "", "");
            setOptionCheckBoxVal(prev=>{
                prev[optionIndex] = "";
                return [...prev];
            });
            event.target.parentElement.parentElement.parentElement.removeAttribute("data-original-title");
            setOptionCheckBoxFormNameVal(prev=>{
                prev[optionIndex] = '';
                return [...prev];
            });
        }
    }
    return (
        <div className='p-2 survey-node-wrapper' style={{border: `2px solid ${data.borderColor}`}}>
            {
                !data.isFirst && 
                <Handle className="node-handle" type="target" position={Position.Top} id={`${data.id}_target`} />
            }
            <div className='node-question px-1'>
                <p data-toggle="tooltip" title={data.question}>
                    {data.question.length > 50 ? data.question.substr(0,47)+"..." : data.question}
                </p>
            </div>
            <hr className='border-top border-top-2 border-secondary'/>
            <div className='border-options'>
                {
                    data.images.map((v, i)=>{
                        return (
                            <div key={i} className="position-relative p-1">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <p className='px-1 m-0'>
                                        <img  src={v} style={{width: 50, height: 50}} alt={v}/>
                                    </p>
                                    <p className='pr-1 pl-5 m-0' data-toggle={optionCheckBoxFormNameVal[i] !== ""?"tooltip": ""} data-original-title={optionCheckBoxFormNameVal[i] !== ""?optionCheckBoxFormNameVal[i]:""} data-trigger="hover">
                                        <FormControlLabel className="m-0" control={<Checkbox color="primary" checked={optionCheckBoxVal[i] !== ""} onChange={(event)=>{ handleChange(event, data.pageIndex, data.questionIndex, i); }} value={optionCheckBoxVal[i]} />} label="Attach Form" />
                                    </p>
                                </div>
                                <Handle 
                                    type="source" 
                                    className="node-handle node-handle-target"
                                    position={Position.Right} 
                                    id={`${data.id}_src_${i}`} 
                                    key={i}
                                /> 
                            </div>
                        );
                    })
                }
            </div>
            <AttachFormModal 
                attachFormModal={attachFormModal} 
                toggleAttachFormModal={toggleAttachFormModal} 
                customFormLinkList={customFormLinkList}
                optionIndices={indices}
                setLinkInSetData={data.setLinkInSetData}
                type={data.type}
                setOptionCheckBoxValFunction={setOptionCheckBoxValFunction}
                setOptionCheckBoxFormNameValFunction={setOptionCheckBoxFormNameValFunction}
            />
        </div>
    );
}

export default ImageControlNode;
