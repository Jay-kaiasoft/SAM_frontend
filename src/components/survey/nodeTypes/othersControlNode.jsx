import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

const OthersControlNode = ({data})=>{
    const [question, setQuestion] = useState("");
    useEffect(()=>{
        setQuestion(data.question);
    },[data.question]);
    return (
        <div className='p-2 survey-node-wrapper' style={{border: `2px solid ${data.borderColor}`}}>
            {
                !data.isFirst && 
                <Handle className="node-handle" type="target" position={Position.Top} id={`${data.id}_target`} />
            }
            <div className='node-question px-1'>
                <p data-toggle="tooltip" title={question}>
                    {question.length > 50 ? question.substr(0,47)+"..." : question}
                </p>
            </div>
            <hr className='border-top border-top-2 border-secondary'/>
            <div className='border-options'>
                <div className="position-relative">
                    <p className='p-1' style={{height: "1.5em"}}></p>
                    <Handle 
                        type="source" 
                        className="node-handle node-handle-target"
                        position={Position.Right} 
                        id={`${data.id}_src_0`} 
                    /> 
                </div>
            </div>
        </div>
    );
}

export default OthersControlNode;