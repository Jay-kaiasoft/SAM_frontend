import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {useNodesState, useEdgesState, addEdge} from 'reactflow';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import DraggableMenu from './draggableMenu';
import EmailAndTimerComponent from './emailAndTimerComponent';
import TriggerComponent from './triggerComponent';
import ConditionComponent from './conditionComponent';
import { addAutomation, getAutomationDataById, getAutomationMyPageLinkList } from '../../services/automationService';
import { dateTimeFormatDB, easUrlEncoder, getClientTimeZone } from '../../assets/commonFunctions';
import { setGlobalAlertAction } from '../../actions/globalAlertActions';
import history from "../../history";
import $ from "jquery";
import { nodeTypes, edgeTypes } from "./util";
import { pathOr } from "ramda";

let id = 0;
const getId = () => `dndnode_${id++}`;
const getEdgeId = (sourceNodeId, targetNodeId) => `reactflow__edge-${sourceNodeId}null-${targetNodeId}null`;

const BuildAutomation = ({
    location,
    timeZone,
    globalAlert
}) => {
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const handleClickEdit = (event, element) => {
        if (element.id.includes('edge')) {
            
        } else {
            setActiveNodeData(element)
            setNodeType(element.type)
            if (element.type === "Trigger") {
                setTriggerModal(true)
            } else if (element.type === "Condition") {
                setConditionModal(true)
            } else {
                setEmailTimerModal(true)
            }
        }
    };
    const handleClickDelete = useCallback((node) => {
        let tempNodes = [];
        setNodes((prev)=>{
            tempNodes = prev.filter(item => item.id !== node.id);
            return prev.filter(item => item.id !== node.id)
        });
        setEdges((prev)=>{
            prev = prev.filter(item => (item.source !== node.id && item.target !== node.id));
            let tempLinkNodes = tempNodes.filter((e)=>(e.type === "Link"));
            if(tempLinkNodes.length > 0){
                tempLinkNodes.forEach((element)=>{
                    if(prev.filter((e)=>(e.target === element.id)).length === 0){
                        setNodes((prev1)=>{
                            return prev1.map((e)=>{
                                if(e.id === element.id){
                                    let tempData = e.data;
                                    delete tempData.links;
                                    e.data = {
                                        ...tempData
                                    }
                                }
                                return e;
                            })
                        })
                        prev = prev.filter((v)=>{
                            return !v?.sourceHandle?.includes(element.id);
                        });
                    }
                })   
            }
            return [...prev];
        });
        setActionIds((prev)=>{
            return prev.filter(item => item !== node.id)
        });
        setActiveNodeData({})
    },[setNodes, setEdges]);
    const initialNodes = useMemo(() => {
        return [
            {
                id: getId(),
                type: 'Start',
                data: { 
                    label: 'Start'
                },
                position: { x: 150, y: 50 },
            },
            {
                id: getId(),
                type: 'Trigger',
                data: { 
                    label: 'Event',
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                },
                position: { x: 150, y: 150 },
            }
        ];
    },[handleClickDelete]);
    const initialEdges = useMemo(() => {
        return [
            {
                id: getEdgeId(initialNodes[0].id, initialNodes[1].id),
                source: initialNodes[0].id,
                target: initialNodes[1].id
            }
        ]
    },[initialNodes]);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [emailTimerModal, setEmailTimerModal] = React.useState(false);
    const [conditionModal, setConditionModal] = React.useState(false);
    const [triggerModal, setTriggerModal] = React.useState(id===0?true:false);
    const [nodeType, setNodeType] = React.useState("");
    const [activeNodeData, setActiveNodeData] = React.useState(initialNodes[1]);
    const [actionIds, setActionIds] = React.useState([]);
    const [campDetails, setCampDetails] = React.useState({});
    const [isPublished, setIsPublished] = React.useState(false);
    const onConnect = (params) => {
        if (actionIds.includes(params.source)) {
            params.label = params.sourceHandle === "yes" ? "Yes":"No";
        }
        let srcNode = nodes.find(e=>((e.hasOwnProperty("id") && e.id === params.source)));
        let targetNode = nodes.find(e=>((e.hasOwnProperty("id") && e.id === params.target)));
        if(srcNode.type === "Email" || targetNode.type === "Email" || srcNode.type === "Timer" || targetNode.type === "Timer"){
            if(srcNode.type === targetNode.type) {
                globalAlert({
                    open: true,
                    text: "Same type node",
                    type: "Error"
                })
                return;
            }
        }
        if(targetNode.type === "Link"){
            if(srcNode.type === "Email"){
                let myPageId = srcNode.data.emailTemplateSelected.mpId;
                getAutomationMyPageLinkList(myPageId).then(res => {
                    if (res.status === 200) {
                        setNodes((prev)=>{
                            return prev.map((e)=>{
                                if(e.id === targetNode.id){
                                    e.data = {
                                        ...e.data,
                                        links: res.result.linkList
                                    }
                                }
                                return e;
                            })
                        })
                    } else {
                        globalAlert({
                            open: true,
                            text: res.message,
                            type: "Error"
                        })
                    }
                });
            } else if(srcNode.type === "Trigger"){
                if(typeof srcNode.data.selectedEmailTemplate !== "undefined"){
                    let myPageId = srcNode.data.selectedEmailTemplate.mpId;
                    getAutomationMyPageLinkList(myPageId).then(res => {
                        if (res.status === 200) {
                            setNodes((prev)=>{
                                return prev.map((e)=>{
                                    if(e.id === targetNode.id){
                                        e.data = {
                                            ...e.data,
                                            links: res.result.linkList
                                        }
                                    }
                                    return e;
                                })
                            })
                        } else {
                            globalAlert({
                                open: true,
                                text: res.message,
                                type: "Error"
                            })
                        }
                    });
                } else {
                    globalAlert({
                        open: true,
                        text: "Trigger data is not set",
                        type: "Error"
                    })
                    return;
                }
            } else {
                globalAlert({
                    open: true,
                    text: "Link node can connect with Event or Email node",
                    type: "Error"
                })
                return;
            }
        }
        setEdges((prev)=>{
            prev = prev.filter((v)=>{
                if(nodes.filter((e)=>(e.id === params.source))[0].type !== "Link"){
                    return params.source !== v.source || (params.sourceHandle && (params.sourceHandle !== v.sourceHandle));
                } else {
                    if(typeof params.sourceHandle !== "undefined" && params.sourceHandle !== null){
                        return params.sourceHandle !== v.sourceHandle;
                    } else {
                        if(v.sourceHandle === null){
                            return params.source !== v.source;
                        } else {
                            return true;
                        }
                    }
                }
            });
            prev = prev.filter((v)=>{
                if(nodes.filter((e)=>(e.id === params.target))[0].type !== "Stop"){
                    return params.target !== v.target;
                } else {
                    return v;
                }
            });
            let tempLinkNodes = nodes.filter((e)=>(e.type === "Link"));
            if(tempLinkNodes.length > 0){
                tempLinkNodes.forEach((element)=>{
                    if(prev.filter((e)=>(e.target === element.id)).length === 0){
                        setNodes((prev1)=>{
                            return prev1.map((e)=>{
                                if(e.id === element.id){
                                    let tempData = e.data;
                                    delete tempData.links;
                                    e.data = {
                                        ...tempData
                                    }
                                }
                                return e;
                            })
                        })
                        prev = prev.filter((v)=>{
                            return !v?.sourceHandle?.includes(element.id);
                        });
                    }
                })   
            }
            return [...prev];
        });
        return setEdges((els) => addEdge(params, els));
    }
    const onInit = (_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance);
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };
    const onDrop = (event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        if (type === "Trigger") {
            let isAlreadyPresent = false
            nodes.forEach((element) => {
                if (element.type === "Trigger") {
                    globalAlert({
                        open: true,
                        type: "Error",
                        text: "There can only be one trigger point"
                    })
                    isAlreadyPresent = true
                    return
                }
            })
            if (isAlreadyPresent)
                return
        } else if (type === "Start") {
            let isAlreadyPresent = false
            nodes.forEach((element) => {
                if (element.type === "Start") {
                    globalAlert({
                        open: true,
                        type: "Error",
                        text: "There can only be one starting point"
                    })
                    isAlreadyPresent = true
                    return
                }
            })
            if (isAlreadyPresent)
                return
        } else if (type === "Stop") {
            let isAlreadyPresent = false
            nodes.forEach((element) => {
                if (element.type === "Stop") {
                    globalAlert({
                        open: true,
                        type: "Error",
                        text: "There can only be one stoping point"
                    })
                    isAlreadyPresent = true
                    return
                }
            })
            if (isAlreadyPresent)
                return
        } 
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
            id: getId(),
            type,
            position,
            data: { 
                label: `${type === "Trigger" ? "Event" : type}`,
                handleClickEdit:handleClickEdit,
                handleClickDelete:handleClickDelete
            },
        };
        if (["Email", "Timer"].includes(newNode.type)) {
            setEmailTimerModal(true)
            setNodeType(newNode.type)
            setActiveNodeData(newNode)
        } else if (newNode.type === "Condition") {
            setConditionModal(true)
            setNodeType(newNode.type)
            setActiveNodeData(newNode)
        } else {
            setNodes((es) => es.concat(newNode));
        }
    };
    const handleClickSubmitEmailTimer = (values) => {
        let tempNodes = nodes.filter(item => item.id !== activeNodeData.id)
        let tempActiveNode = Object.assign({}, activeNodeData)
        tempActiveNode.data = {
            label: values.label,
            emailTemplateSelected: values.emailTemplateSelected,
            fromEmail: values.fromEmail,
            fromName: values.fromName,
            subject: values.subject,
            handleClickEdit:handleClickEdit,
            handleClickDelete:handleClickDelete
        }
        let newNode
        let newEdge
        if (activeNodeData.type === "Email" && values.value > 0) {
            let newNodeID = getId()
            newNode = {
                id: newNodeID,
                type: "Timer",
                position: { x: activeNodeData.position?.x || activeNodeData.xPos, y: (activeNodeData.position?.y || activeNodeData.yPos) + 100 },
                data: {
                    label: values.value + " " + values.duration + " delay",
                    duration: values.duration,
                    value: values.value,
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                },
            };
            newEdge = {
                id: getEdgeId(tempActiveNode.id, newNodeID),
                source: tempActiveNode.id,
                target: newNodeID
            };
        }
        if (activeNodeData.xPos && activeNodeData.yPos) {
            tempActiveNode.position = { x: activeNodeData.xPos, y: activeNodeData.yPos }
            delete tempActiveNode.xPos
            delete tempActiveNode.yPos
        }
        setEmailTimerModal(false)
        tempNodes.push(tempActiveNode)
        if (newNode) {
            tempNodes.push(newNode)
            setEdges([...edges, newEdge]);
        }
        setNodes(tempNodes);
        setActiveNodeData({})
    }
    const handleClickSubmitTrigger = (values) => {
        let tempNodes = nodes.filter(item => item.id !== activeNodeData.id)
        let tempEdges = edges.filter(item => item.source === activeNodeData.id)
        let tempActiveNode = Object.assign({}, activeNodeData)
        tempActiveNode.data = { 
            label: values.name, 
            ...values,
            handleClickEdit:handleClickEdit,
            handleClickDelete:handleClickDelete
        }
        setCampDetails(values);
        let newNode
        let newEdge
        if (tempEdges.length === 0) {
            let newNodeID = getId()
            newNode = {
                id: newNodeID,
                type: "Timer",
                position: { x: activeNodeData.position?.x || activeNodeData.xPos, y: (activeNodeData.position?.y || activeNodeData.yPos) + 100 },
                data: {
                    label: values.value + " " + values.duration + " delay",
                    duration: values.duration,
                    value: values.value,
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                },
            };
            newEdge = {
                id: getEdgeId(tempActiveNode.id, newNodeID),
                source: tempActiveNode.id,
                target: newNodeID
            };
        } else {
            let tempNodeTimer = Object.assign({}, nodes.filter(item => item.id === tempEdges[0].target)[0]);
            tempNodes = tempNodes.filter((v)=> v.id !== tempNodeTimer.id);
            let tempNewNodeTimer = {
                ...tempNodeTimer,
                data: {
                    ...tempNodeTimer.data,
                    label: values.value + " " + values.duration + " delay",
                    duration: values.duration,
                    value: values.value,
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                },
            };
            tempNodes = [...tempNodes, tempNewNodeTimer];
        }
        if (activeNodeData.xPos && activeNodeData.yPos) {
            tempActiveNode.position = { x: activeNodeData.xPos, y: activeNodeData.yPos }
            delete tempActiveNode.xPos
            delete tempActiveNode.yPos
        }
        setEmailTimerModal(false)
        tempNodes.push(tempActiveNode)
        if (newNode) {
            tempNodes.push(newNode)
            setEdges([...edges, newEdge]);
        }
        setNodes(tempNodes);
        setTriggerModal(false)
        setActiveNodeData({})
    }
    const handleClickSubmitCondition = (value) => {
        const node = nodes.find((item) => item.id === activeNodeData.id)
        let tempActionIds = actionIds
        tempActionIds.push(activeNodeData.id)
        setActionIds(tempActionIds)
        if (node) {
            const tempNodes = {
                ...node,
                data: {
                    ...value,
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                }
            }
            setNodes(prev => {
                let temp = prev.filter((v)=> v.id !== tempNodes.id);
                return [...temp, tempNodes];
            });
        } else {
            let newNode = {
                id: activeNodeData.id,
                type: "Condition",
                position: { x: activeNodeData?.position?.x, y: activeNodeData?.position?.y },
                data: {
                    ...value,
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                }
            };
            let tempNodes = [...nodes]
            tempNodes.push(newNode)
            setNodes(tempNodes)
        }
        setConditionModal(false)
        setActiveNodeData({})
    }
    const handleClickSubmitTimer = (values) => {
        const node = nodes.find((item) => item.id === activeNodeData.id)
        if (node) {
            const tempNodes = {
                ...node,
                data: {
                    ...values,
                    label: values.value + " " + values.duration + " delay",
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                }
            }
            let tempEdges = edges.filter(item => item.target === activeNodeData.id)
            let tempNodeEmail = {};
            if(tempEdges.length > 0){
                tempNodeEmail = Object.assign({}, nodes.filter(item => item.id === tempEdges[0].source)[0]);
            }
            if(tempNodeEmail?.type === 'Trigger'){
                let tempNewNodeEmail = {
                    ...tempNodeEmail,
                    data: {
                        ...tempNodeEmail.data,
                        duration: values.duration,
                        value: values.value,
                        handleClickEdit:handleClickEdit,
                        handleClickDelete:handleClickDelete
                    },
                };
                setNodes(prev => {
                    let temp = prev.filter((v)=> v.id !== tempNodes.id);
                    temp = temp.filter((v)=> v.id !== tempNewNodeEmail.id);
                    return [...temp, tempNodes, tempNewNodeEmail];
                });
                setCampDetails(prev => {
                    return {...prev, duration: values.duration, value: values.value}
                });
            } else {
                setNodes(prev => {
                    let temp = prev.filter((v)=> v.id !== tempNodes.id);
                    return [...temp, tempNodes];
                });
            }
        } else {
            let newNode = {
                id: activeNodeData.id,
                type: "Timer",
                position: { x: activeNodeData?.position?.x, y: activeNodeData?.position?.y },
                data: {
                    ...values,
                    label: values.value + " " + values.duration + " delay",
                    handleClickEdit:handleClickEdit,
                    handleClickDelete:handleClickDelete
                }
            };
            let tempNodes = [...nodes];
            tempNodes.push(newNode);
            setNodes(tempNodes);
            setEmailTimerModal(false);
        }
        setActiveNodeData({})
        setEmailTimerModal(false)
    }
    useEffect(()=>{
        if(id !== 0) {
            getAutomationDataById(id).then((res)=>{
                setTriggerModal(false);
                let tempNodes = [];
                let tempCampDetails = res.result.campaignDetailsData;
                if(res.result.automationData.amId === 0) {
                    delete tempCampDetails.amId;
                }
                setCampDetails(tempCampDetails);
                JSON.parse(res.result.automationData.amJSON).nodes.map((node)=>(
                    node.type === "Trigger" ?
                        tempNodes.push({
                            ...node,
                            "data":{
                                ...node.data,
                                ...tempCampDetails,
                                handleClickEdit:handleClickEdit,
                                handleClickDelete:handleClickDelete
                            }
                        })
                    :
                        tempNodes.push({
                            ...node,
                            "data":{
                                ...node.data,
                                handleClickEdit:handleClickEdit,
                                handleClickDelete:handleClickDelete
                            }
                        }) 
                ))
                setNodes(prevState => {
                    prevState=tempNodes;
                    return [...prevState];
                });
                setEdges(prevState => {
                    prevState=JSON.parse(res.result.automationData.amJSON).edges;
                    return [...prevState];
                });
                if(res.result.automationData.amId === 0) {
                    setIsPublished(true);
                }
                let tempActionIds = [];
                JSON.parse(res.result.automationData.amJSON).nodes.map((node)=>(
                    node.type === "Condition" ?
                        tempActionIds.push(node.id)
                    : null
                ))
                setActionIds(tempActionIds);
            });
        } else {
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [id, setNodes, setEdges, handleClickDelete, initialNodes, initialEdges]);
    const handlePublishAndDraft = (type) => {
        if(type === "publish"){
            let startNode = nodes.find(item => item.type==="Start");
            if (typeof startNode === "undefined" || startNode === "" || startNode === null) {
                globalAlert({
                    open: true,
                    text: "Please set start node",
                    type: "Error"
                })
                return;
            }
            let stopNode = nodes.find(item => item.type==="Stop");
            if (typeof stopNode === "undefined" || stopNode === "" || stopNode === null) {
                globalAlert({
                    open: true,
                    text: "Please set stop node",
                    type: "Error"
                })
                return;
            }
            // if (nodes.length - edges.length > 1) {
            //     globalAlert({
            //         open: true,
            //         text: "Not Valid",
            //         type: "Error"
            //     })
            //     return;
            // }
            if (Object.keys(campDetails).length === 0){
                globalAlert({
                    open: true,
                    text: "Please Set Campaign Details in Trigger Node",
                    type: "Error"
                })
                return;
            }
            if (nodes.length === 0) {
                globalAlert({
                    open: true,
                    text: "Trying to send empty automation",
                    type: "Error"
                })
                return;
            }
            let conditionNodes = nodes.filter(item => item.type === "Condition");
            for (let i = 0; i < conditionNodes.length; i++) {
                if(edges.filter(item => item.source === conditionNodes[i].id).length === 0) {
                    globalAlert({
                        open: true,
                        text: "Condition Node is not connected to any target.",
                        type: "Error"
                    })
                    return;
                }
            }
            let triggerNode = nodes.find(item => item.type==="Trigger");
            let connectedToTriggerNodeId = edges.find(e=> e.source === triggerNode.id).target;
            let connectedToTriggerNode = nodes.find(item=>item.id === connectedToTriggerNodeId);
            if(connectedToTriggerNode.type !== "Timer") {
                globalAlert({
                    open: true,
                    text: "Trigger should be connected with Timer Node.",
                    type: "Error"
                })
                return;
            }
            let tempError = 0;
            nodes.forEach((value)=>{
                let tempEdge = edges.filter(e => e.source === value.id);
                if(tempEdge.length !== 2 && value.type === "Condition"){
                    tempError++;
                }
                if(tempEdge.length === 0 && value.type !== "Stop"){
                    tempError++;
                }
            });
            if(tempError !== 0){
                globalAlert({
                    open: true,
                    text: "There is unconnected node(s).\nPlease connect to other node or connect to Stop node.",
                    type: "Error"
                })
                return false;
            }
        }
        let tempCampDetails = campDetails;
        tempCampDetails.sendDateTime = dateTimeFormatDB(tempCampDetails.sendDateTime);
        let data = {
            "amId": isPublished?0:id,
            "amName": campDetails?.name,
            "amDesc": campDetails?.detail,
            "amStartingAction": campDetails?.selectedAction,
            "amStartCondition": campDetails?.selectedTriggerType,
            "amTemplateId": campDetails?.amTemplateId,
            "myPageId": campDetails?.amTemplateId,
            "amGroupId": campDetails?.amGroupId,
            "amGroupSegmentId": campDetails?.amGroupSegmentId,
            "sendDateTime": dateTimeFormatDB(campDetails?.sendDateTime),
            "amJSON": JSON.stringify({nodes: nodes, edges: edges}),
            "saveStatus": type,
            "createdDateTime": dateTimeFormatDB(new Date()),
            "updatedDatetime": dateTimeFormatDB(new Date()),
            "campDetails": JSON.stringify(tempCampDetails),
            "schType":campDetails.schType,
            "timeZone":(typeof timeZone === "undefined" || timeZone === "" || timeZone === null) ? getClientTimeZone() : timeZone
        }
        $(`button.${type}`).hide();
        $(`button.${type}`).after(`<div class="lds-ellipsis ${type === "publish" && "mr-2"}"><div></div><div></div><div></div>`);
        addAutomation(data).then(res => {
            if (res.status === 200) {
                history.push("/manageAutomation")
                globalAlert({
                    open: true,
                    text: res.message,
                    type: "Success"
                })
            } else {
                globalAlert({
                    open: true,
                    text: res.message,
                    type: "Error"
                })
            }
            $(".lds-ellipsis").remove();
            $(`button.${type}`).show();
        });
    }
    return (
        <div className='midleMain'>
            <div className='btnContainer'>
                <Button variant="contained" className='mr-2 publish' onClick={() => handlePublishAndDraft("publish")}>PUBLISH</Button>
                <Button variant="contained" className='mr-2 draft' onClick={() => handlePublishAndDraft("draft")}>SAVE AS DRAFT</Button>
                <Button variant="contained" onClick={() => history.push("/manageAutomation")}>CANCEL</Button>
            </div>
            <div style={{ display: "flex", flexDirection: `${window.innerWidth < 540 ? 'column-reverse' : 'unset'}`, width: "100%" }} className="flowChartWrapper dndflow">
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <DraggableMenu />
                    <ReactFlow
                        panOnScroll={true}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onInit={onInit}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onConnect={onConnect}
                        key="edges"
                    >
                    </ReactFlow>
                </div>
                <EmailAndTimerComponent emailTimerModal={emailTimerModal} setEmailTimerModal={setEmailTimerModal} handleClickSubmitTimer={handleClickSubmitTimer} handleClickSubmitEmailTimer={handleClickSubmitEmailTimer} nodeType={nodeType} activeNodeData={activeNodeData} />
                <TriggerComponent triggerModal={triggerModal} setTriggerModal={setTriggerModal} handleClickSubmitTrigger={handleClickSubmitTrigger} activeNodeData={activeNodeData} id={id} />
                <ConditionComponent conditionModal={conditionModal} setConditionModal={setConditionModal} handleClickSubmitCondition={handleClickSubmitCondition} activeNodeData={activeNodeData} />
            </div>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        timeZone: pathOr("", ["user", "timeZone"], state)
    }
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => { dispatch(setGlobalAlertAction(data)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BuildAutomation);