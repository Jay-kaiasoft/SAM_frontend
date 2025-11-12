import React from 'react';
import { Handle, Position } from 'reactflow';


const OptionNode = ({data})=>{
    return (
        <div className='p-2 survey-node-wrapper'>
            {
                !data.isFirst &&
                <Handle className="node-handle" type="target" position={Position.Top} id={`${data.id}_target`} />
            }
            <div className='node-question px-1'>
                <p className="px-2">
                    {data.question}
                </p>
            </div>
            <hr className='border-top border-top-2 border-secondary'/>
            <div className='pl-2'>
                {
                    data.options.map((value, index)=>{
                        return (
                            <div key={index} className="position-relative">
                                <div className='d-flex justify-content-between'>
                                    {value}
                                </div>
                                <Handle
                                    type="source"
                                    className="node-handle node-handle-target"
                                    position={Position.Right}
                                    id={`${data.id}_src_${index}`}
                                    key={index}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default OptionNode;
