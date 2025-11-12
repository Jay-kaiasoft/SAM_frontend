import { Handle } from "reactflow";
import {EmailOutlined, PlayCircleOutline, CallSplit, Timer, PlayArrowOutlined, CropSquare, FilterList, PauseCircleOutline, Link} from '@mui/icons-material';
import {CustomEdge} from './customeEdge';

const StartNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
        <div className="Nodetitle">
            <PlayArrowOutlined fontSize="large" />{node?.data?.label}
        </div>
    </div>
};
const StopNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <div className="Nodetitle">
            <CropSquare fontSize="large" />{node?.data?.label}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
    </div>
};
const TriggerNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
        <div className="Nodetitle">
            <PlayCircleOutline fontSize="large" />{node?.data?.label}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
    </div>
};
const EmailNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
        <div className="Nodetitle">
            <EmailOutlined fontSize="large" />{node?.data?.label?.substring(0, 21)}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
        
    </div>
};
const TimerNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
        <div className="Nodetitle">
            <Timer fontSize="large" />{node?.data?.label}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
    </div>
};
const FilterNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" />
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }}/>
        <div className="Nodetitle">
            <FilterList fontSize="large" />{node?.data?.label}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
    </div>
};
const ConditionNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <Handle className="startNodehandal green" type="source" id="yes" position="bottom" style={{ left: "33%", bottom: "-6px" }} />
        <Handle className="startNodehandal red" type="source" id="no" position="bottom" style={{ left: "66%", bottom: "-6px" }} />
        <div className="Nodetitle">
            <CallSplit fontSize="large" style={{ transform: "rotate(180deg)" }} />{node?.data?.label}
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper" onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            : null
        }
    </div>
};
const PauseNode = (node) => {
    return <div className="nodeWrapper">
        <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
        <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
        <div className="Nodetitle">
            <PauseCircleOutline fontSize="large" />Pause Workflow
        </div>
        {
            node.data.hideEditDeleteBtn !== true?
                <div className="button-wrapper-main">
                    <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                        <i className="far fa-pencil-alt text-blue"></i>
                    </div>
                    <div className="button-wrapper " onClick={() => node.data.handleClickDelete(node)}>
                        <i className="far fa-trash-alt text-danger"></i>
                    </div>
                </div>
            :null
        }
    </div>
};
const LinkNode = (node) => {
    return (
        <>
            <div className="nodeWrapper flex-column">
                <Handle className="startNodehandal" type="target" position="top" style={{ top: "-6px" }} />
                <Handle className="startNodehandal" type="source" position="bottom" style={{ bottom: "-6px" }} />
                <div className="w-100 d-flex justify-content-between">
                    <div className="Nodetitle">
                        <Link fontSize="large" />Link
                    </div>
                    {
                        node.data.hideEditDeleteBtn !== true?
                            <div className="button-wrapper-main justify-content-end">
                                {/* <div className="button-wrapper" onClick={() => node.data.handleClickEdit("in", node)}>
                                    <i className="far fa-pencil-alt text-blue"></i>
                                </div> */}
                                <div className="button-wrapper " onClick={() => node.data.handleClickDelete(node)}>
                                    <i className="far fa-trash-alt text-danger"></i>
                                </div>
                            </div>
                        :null
                    }
                </div>
                {
                    typeof node.data.links === "undefined" ?
                        <div>
                            Please connect with Event or Email node
                        </div>
                    :
                        node.data.links.length > 0 ?
                            <div className="d-flex flex-column align-items-end">
                                {
                                    node.data.links.map((v,i)=>{
                                        return (
                                            <div key={i} className="position-relative py-1">
                                                {v}
                                                <Handle 
                                                    className="startNodehandal"
                                                    type="source" 
                                                    position="right" 
                                                    id={`${node.id}_src_${i}`} 
                                                    key={i}
                                                    style={{ right: "-23px" }}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        :
                            <div>
                                No Links Found
                            </div>
                }
            </div>
        </>
    )
};

export const nodeTypes = {
    Start: StartNode,
    Trigger: TriggerNode,
    Email: EmailNode,
    Timer: TimerNode,
    Filter: FilterNode,
    Condition: ConditionNode,
    Pause: PauseNode,
    Stop: StopNode,
    Link: LinkNode
};

export const edgeTypes = {
    custom: CustomEdge,
};