import React from 'react';
import { Handle, Position } from 'reactflow';


const OpenEnded = ({data})=>{
    return (
        <div className='p-2 survey-node-wrapper'>
            {
                !data.isFirst &&
                <Handle className="node-handle" type="target" position={Position.Top} id={`${data.id}_target`} />
            }
            <div className='node-question px-2 position-relative'>
                <p className="mb-0">
                    {data.question}
                </p>
                <Handle
                    type="source"
                    className="node-handle node-handle-target"
                    position={Position.Right}
                    id={`${data.id}_src_0`}
                />
            </div>
        </div>
    );
}

export default OpenEnded;
