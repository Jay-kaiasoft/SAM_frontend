import { Button } from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import { Col, Row } from "reactstrap";
import ReactFlow, {Controls, addEdge, ReactFlowProvider} from 'reactflow';
import {clearQuestionLogicFlow, saveDemographicLocation, saveQuestionLogicFlow} from "../../services/smsPollingService";
import OpenEndedNode from "./nodeTypes/openEndedNode";
import OptionNode from "./nodeTypes/optionNode";
import EndNode from "./nodeTypes/endNode";
import $ from "jquery";
import { handleClickHelp } from "../../assets/commonFunctions";

const generateJSONForNode = (questions) => {
    let xPos = 250;
    let yPos = 100;
    let total = 50;
    let temp = questions.map((element, index)=>{
        let node_id = `dndnode_${element.queId}_${index}`;
        element.queTypeId === 1?total+=(yPos)+(40*element.optionVal.length):total+=(yPos)+(30);
        return {
            id: node_id,
            type:element.queTypeId === 1?"Option":"OpenEnded",
            data: {
                id: node_id,
                queId: element.queId,
                queTypeId:element.queTypeId,
                question: element.question,
                isFirst: index === 0,
                options: element.optionVal
            },
            position:{x: xPos, y: element.queTypeId === 2?(total-((yPos)+(30))):(total - (yPos + (40*element.optionVal.length)))}
        }
    });
    total+=(yPos)+(30);
    temp = [
        ...temp,
        {
            id: "dnd_node_end",
            type: "End",
            data: {
                id: "dnd_node_end"
            },
            position:{x: xPos, y: (total-((yPos)+(30)))}
        }
    ];
    return temp;
};
const generateJSONForEdges = (nodeJson) => {
    let temp = [];
    nodeJson.forEach((v, i, a)=>{
        if(i < (a.length - 1)) {
            if(v.type === "Option") {
                v.data.options.forEach((val, j)=>{
                    temp = [...temp, {id: `${v.id}_src_${j}`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_${j}`, targetHandle: `${a[i+1].id}_target`, type: 'step', option: val}]
                });
            } else {
                temp = [...temp, {id: `${v.id}_src_0`, source: v.id, target: a[i+1].id, sourceHandle: `${v.id}_src_0`, targetHandle: `${a[i+1].id}_target`, type: 'step'}];
            }
        }
    });
    return temp;
};
const generateInitialQuestionFlow = (questions) => {
    return questions.map((e, i) => {
        return {
            queId: e.queId,
            optionValNo: e.optionVal.map((opt, j)=>({positionNo: j, condQue:((questions.length - 1) === i)?-1:0}))
        }
    })
};

const nodeTypes = {
    OpenEnded: OpenEndedNode,
    Option: OptionNode,
    End: EndNode
};

const QuestionsFlow = ({
    data,
    handleNext,
    handleBack,
    globalAlert,
    handleDataChange,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange
}) => {
    const [questionFlow, setQuestionFlow] = useState(data.hasOwnProperty("questionFlow")?data.questionFlow:generateInitialQuestionFlow(data.questions));
    useEffect(()=>{
        if(!data.hasOwnProperty("questionFlowJson") || data.questionFlowJson === "") {
            let nodes1 = generateJSONForNode(data.questions);
            let edges1 = generateJSONForEdges(nodes1);
            setNodes(_=>[...nodes1]);
            setEdges(_=>[...edges1]);

        } else {
            setNodes(_=>[...data.questionFlowJson.nodes]);
            setEdges(_=>[...data.questionFlowJson.edges]);
        }
    }, [data, setEdges, setNodes]);
    const handleClickNext = () => {
        let requestData = {
            "pollingId": data.iid,
            "questionFlowJson": JSON.stringify({nodes: nodes, edges: edges}),
            "questionFlow": questionFlow
        }
        $("button.nextClick").hide();
        $("button.nextClick").after('<div class="lds-ellipsis ml-3 mt-3"><div></div><div></div><div></div>');
        saveQuestionLogicFlow(requestData).then(res => {
            if (res.status === 200) {
                handleDataChange("questionFlowJson", {nodes: nodes, edges: edges});
                let requestData = {
                    "iid": data.iid,
                    "country":["United States","Canada"]
                }
                saveDemographicLocation(requestData).then(res => {
                    if (res.status === 200) {
                        handleDataChange("country", ["United States","Canada"]);
                        handleNext(1);
                    } else {
                        globalAlert({
                            type: "Error",
                            text: res.message,
                            open: true
                        });
                    }
                    $(".lds-ellipsis").remove();
                    $("button.nextClick").show();
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
                $(".lds-ellipsis").remove();
                $("button.nextClick").show();
            }
        });
    }
    const handleClickClearFlow = () => {
        let qId = [];
        data.questions.map((v)=>(
            qId.push(v.queId)
        ));
        let requestData = {
            "iid": data.iid,
            "questions":qId
        }
        $("button.clearFlow").hide();
        $("button.clearFlow").after('<div class="lds-ellipsis ml-3 mt-3"><div></div><div></div><div></div>');
        clearQuestionLogicFlow(requestData).then(res => {
            if (res.status === 200) {
                let nodes1 = generateJSONForNode(data.questions);
                let edges1 = generateJSONForEdges(nodes1);
                if(data.hasOwnProperty("questionFlowJson")){
                    handleDataChange("questionFlowJson", {nodes: nodes1, edges: edges1});
                }
                setNodes(nodes1);
                setEdges(edges1);
                setQuestionFlow(generateInitialQuestionFlow(data.questions));
                handleDataChange("questionFlow", generateInitialQuestionFlow(data.questions));
                globalAlert({
                    type: "Success",
                    text: res.message,
                    open: true
                });
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
            $(".lds-ellipsis").remove();
            $("button.clearFlow").show();
        });
    }
    const onConnect = useCallback((params)=>{
        params.type = "step";
            let sourceNode = nodes.find((v)=>(params.source === v.id));
            let targetNode = nodes.find((v)=>(params.target === v.id));
        let conQue = targetNode.type === "End"?-1:targetNode.data.queId;
        let posiotionNo = parseInt(params.sourceHandle.split("src_")[1]);
        setQuestionFlow(prevState => {
            return prevState.map((e1) => {
                if(e1.queId === sourceNode.data.queId){
                    e1.optionValNo = e1.optionValNo.map((e2)=>{
                        if(e2.positionNo === posiotionNo) {
                            e2.condQue = conQue;
                        }
                        return e2;
                    });
                }
                return e1;
            })
        })
            setEdges((prev)=>{
            prev = prev.filter((v)=>{
                return params.source !== v.source || params.sourceHandle !== v.sourceHandle;
            });
                return addEdge(params, prev);
        });
    },[nodes, setEdges])
    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={10} lg={10} xl={10} className="mx-auto">
                    <p className="mb-1"><strong>Answer Logic Flow</strong></p>
                    <p className="mb-0">Please select questions's answer and its next question based on that answer. Would you like to apply condition on SMS polling question?<i className="far fa-question-circle ml-2" onClick={() => handleClickHelp("SMS/Features/createSMSPoll/HowtoCreateYourFirstSMSPoll.html")}></i></p>
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="mx-auto">
                    <ReactFlowProvider>
                        <div className="survey-flow-wrapper" id="smsPolingFlowWrapper">
                            <ReactFlow
                                panOnScroll={true}
                                nodeTypes={nodeTypes}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                nodes={nodes}
                                edges={edges}
                                onConnect={onConnect}
                                id="smsPolingFlow"
                            >
                                <Controls />
                            </ReactFlow>
                        </div>
                    </ReactFlowProvider>
                </Col>
            </Row>
            <Row>
                <div className="col-12 mb-2" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            handleBack(1)
                        }}
                        className="mt-3"
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleClickClearFlow}
                        className="ml-3 mt-3 clearFlow"
                    >
                        <i className="far fa-broom mr-2"></i>CLEAR ANSWER LOGIC FLOW
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3 mt-3 nextClick"
                        onClick={() => {handleClickNext()}}
                        title="Changes will be committed!!"
                        data-toggle="tooltip"
                    >
                        <i className="far fa-long-arrow-right mr-2"></i>NEXT
                    </Button>
                </div>
            </Row>
        </>
    );
}
export default QuestionsFlow;