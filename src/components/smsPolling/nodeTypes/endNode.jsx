import React from 'react';
import { Handle, Position } from 'reactflow';


const EndNode = ({data})=>{
    return (
        <div className='p-2 survey-node-wrapper'>
            <Handle className="node-handle" type="target" position={Position.Top} id={`${data.id}_target`}/>
            <div className='node-question px-1'>
                <p>
                    End Of the Polling
                </p>
            </div>
        </div>
    );
}

export default EndNode;
