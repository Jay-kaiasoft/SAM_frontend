import React, { useEffect, useCallback, Fragment, useState, useRef } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";
import ReactFlow, { Controls, addEdge } from 'reactflow';
import RadioButtonNode from "./nodeTypes/radioButtonNode";
import ImageControlNode from "./nodeTypes/imageControlNode";
import RatingControlNode from "./nodeTypes/ratingControlNode";
import OthersControlNode from './nodeTypes/othersControlNode';
import EndNode from './nodeTypes/endNode';
import { extractQuestionsFromJson, generateJSONForNode, generateJSONForEdges } from "./utility";
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/resizable.js';
import $ from "jquery";

const nodeTypes = {
    Radio: RadioButtonNode,
    Image: ImageControlNode,
    Rating: RatingControlNode,
    Other: OthersControlNode,
    End: EndNode
};
const LogicFlow = ({ data, setData, categoryPageList, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) => {
    const [currentNode, setCurrentNode] = useState(null);
    const [currentNodeParams, setCurrentNodeParams] = useState({});
    const [remainigQuestionModal, setRemainigQuestionModal] = useState(false);
    const [remainingQuestionsNode, setRemainingQuestionsNode] = useState([]);
    const reactFlowInstance = useRef(null);

    const setLinkInSetData = useCallback((type, pageIndex, questionIndex, optionIndex, link, formName) => {
        let radioTypes = ["single_answer", "single_answer_button", "single_answer_checkbox", "single_answer_combo", "gender", "marital_status", "education", "employment_status", "employer_type", "housing", "household_income", "race", "yes_no"];
        let imageTypes = ["image_form", "image_with_text_form"];
        let ratingTypes = ["rating_symbol", "rating_radio", "rating_box"];
        if (radioTypes.includes(type) || imageTypes.includes(type)) {
            setData((prev) => {
                prev.stData.surveysPages[pageIndex].surveysQuestions[questionIndex].surveysOptions[optionIndex].formLink = link;
                prev.stData.surveysPages[pageIndex].surveysQuestions[questionIndex].surveysOptions[optionIndex].formName = formName;
                return prev;
            });
        } else if (ratingTypes.includes(type)) {
            setData((prev) => {
                prev.stData.surveysPages[pageIndex].surveysQuestions[questionIndex].formLinks[optionIndex].formLink = link;
                prev.stData.surveysPages[pageIndex].surveysQuestions[questionIndex].formNames[optionIndex].formName = formName;
                return prev;
            });
        }
    }, [setData]);
    const onInit = (instance) => {
        reactFlowInstance.current = instance;
    };
    const onConnect = useCallback((params) => {
        params.type = "step";
        let sourceNode = nodes.find((v) => (params.source === v.id));
        let targetNode = nodes.find((v) => (params.target === v.id));
        if (sourceNode.type === "Radio") {
            let option = edges.find((v) => (params.sourceHandle === v.sourceHandle)).option;
            setData(prev => {
                let sourceNext = prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next;
                if (targetNode.type === "End") {
                    sourceNext[option] = null;
                } else {
                    sourceNext[option] = { ...sourceNext[option], pageIndex: targetNode.data.pageIndex, questionIndex: targetNode.data.questionIndex };
                    prev.stData.surveysPages[targetNode.data.pageIndex].surveysQuestions[targetNode.data.questionIndex].prev = { pageIndex: sourceNode.data.pageIndex, questionIndex: sourceNode.data.questionIndex };
                }
                prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next = sourceNext;
                return prev;
            });
            params.option = option;
        } else if (sourceNode.type === "Image") {
            let option = edges.find((v) => (params.sourceHandle === v.sourceHandle)).option;
            setData(prev => {
                let sourceNext = prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next;
                if (targetNode.type === "End") {
                    sourceNext[option] = null;
                } else {
                    sourceNext[option] = { ...sourceNext[option], pageIndex: targetNode.data.pageIndex, questionIndex: targetNode.data.questionIndex };
                    prev.stData.surveysPages[targetNode.data.pageIndex].surveysQuestions[targetNode.data.questionIndex].prev = { pageIndex: sourceNode.data.pageIndex, questionIndex: sourceNode.data.questionIndex };
                }
                prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next = sourceNext;
                return prev;
            });
            params.option = option;
        } else if (sourceNode.type === "Rating") {
            let option = edges.find((v) => (params.sourceHandle === v.sourceHandle)).option.toString();
            setData(prev => {
                let sourceNext = prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next;
                if (targetNode.type === "End") {
                    sourceNext[option] = null;
                } else {
                    sourceNext[option] = { ...sourceNext[option], pageIndex: targetNode.data.pageIndex, questionIndex: targetNode.data.questionIndex };
                    prev.stData.surveysPages[targetNode.data.pageIndex].surveysQuestions[targetNode.data.questionIndex].prev = { pageIndex: sourceNode.data.pageIndex, questionIndex: sourceNode.data.questionIndex };
                }
                prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next = sourceNext;
                return prev;
            });
            params.option = option;
        } else {
            setData(prev => {
                let sourceNext = prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next;
                if (targetNode.type === "End") {
                    sourceNext["default"] = null;
                } else {
                    sourceNext["default"] = { pageIndex: targetNode.data.pageIndex, questionIndex: targetNode.data.questionIndex };
                    prev.stData.surveysPages[targetNode.data.pageIndex].surveysQuestions[targetNode.data.questionIndex].prev = { pageIndex: sourceNode.data.pageIndex, questionIndex: sourceNode.data.questionIndex };
                }
                prev.stData.surveysPages[sourceNode.data.pageIndex].surveysQuestions[sourceNode.data.questionIndex].next = sourceNext;
                return prev;
            });
        }
        setEdges((prev) => {
            prev = prev.filter((v) => {
                return params.source !== v.source || params.sourceHandle !== v.sourceHandle;
            });
            return [...prev];
        });
        return setEdges((els) => addEdge(params, els))
    }, [edges, nodes, setData, setEdges]);
    const onModalQuestionConnect = useCallback((targetNodeId)=>{
        let newParams = {
            source: currentNodeParams.nodeId,
            sourceHandle: currentNodeParams.handleId,
            target: targetNodeId,
            targetHandle: `${targetNodeId}_target`
        };
        onConnect(newParams);
        setRemainingQuestionsNode([]);
        setRemainigQuestionModal(false);
    }, [currentNodeParams]);
    const toggleQuestionModal = useCallback(() => {
        setRemainingQuestionsNode([]);
        setRemainigQuestionModal(prev => !prev);
    }, [setRemainigQuestionModal]);
    const onConnectStart = (event, params) => {
        setCurrentNodeParams((_) => ({...params}));
        setCurrentNode(params.nodeId);
    }
    const onConnectEnd = (event) => {
        if (event.target.className === "react-flow__pane") {
            let currentNodeIndex = 0;
            for (let i = 0; i < nodes.length; i++) {
                if (currentNode === nodes[i].id) {
                    currentNodeIndex = i;
                    break;
                }
            }
            let remainingQuestionsNodeTemp = [];
            if (currentNodeIndex < nodes.length - 2) {
                for (let i = currentNodeIndex + 1; i < nodes.length; i++) {
                    remainingQuestionsNodeTemp.push(nodes[i])
                }
                setRemainingQuestionsNode((prev) => ([...prev, ...remainingQuestionsNodeTemp]));
                setRemainigQuestionModal(true);
            }
        }
    }
    const handleCategoryClick = (categoryName) => {
        let nodeData = nodes.find((v) => (v.data.categoryPageList === categoryName));
        const { y } = nodeData.position;
        reactFlowInstance.current.setViewport({
            y: -(y - 100),
        },
        {duration: 500});
    }

    useEffect(() => {
        let questions = extractQuestionsFromJson(data.stData);
        const nodesTemp = generateJSONForNode(questions, setLinkInSetData, categoryPageList);
        const edgesTemp = generateJSONForEdges(nodesTemp);
        if (nodes.length === 0 && edges.length === 0) {
            setNodes(_ => [...nodesTemp]);
            setEdges(_ => [...edgesTemp]);
        }
        $(".lfCatMain").draggable({ containment: "parent", scroll: false }).resizable({ containment: "parent" });
    }, [nodes, data.stData, setNodes, setEdges, setData, setLinkInSetData, categoryPageList, edges.length]);
    useEffect(() => {
        if (nodes.length !== 0) {
            let questions = extractQuestionsFromJson(data.stData);
            const nodesTemp = generateJSONForNode(questions, setLinkInSetData, categoryPageList);
            setNodes((prev) => {
                let temp = prev.map((e,index) => {
                    if (e.hasOwnProperty("data")) {
                        e.data.setLinkInSetData = setLinkInSetData;
                        e.data.question = nodesTemp[index].data.question;
                        e.data.borderColor = nodesTemp[index].data.borderColor;
                        if (e.data.hasOwnProperty("options")) {
                            e.data.options = e.data.options.map((eo,eindex)=>{
                                eo = nodesTemp[index].data.options[eindex];
                                return eo;
                            })
                        }
                    }
                    return e;
                })
                return [...temp];
            });
        }
    }, [setLinkInSetData, setNodes, nodes.length]);

    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="survey-flow-wrapper">
                        <ReactFlow
                            panOnScroll={true}
                            onInit={onInit}
                            nodeTypes={nodeTypes}
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onConnectStart={onConnectStart}
                            onConnectEnd={onConnectEnd}
                        >
                            <Controls />
                        </ReactFlow>
                    </div>
                </Col>
            </Row>
            <div className="lfCatMain">
                <div className="lfCat-resize">
                    <div className="lfCat">
                        {
                            categoryPageList.length > 0 ?
                                <>
                                    <div className="d-flex justify-content-between">
                                        <div className="lfCatColorBox"></div>
                                        <div className="d-flex lfCatName"><strong>Name</strong></div>
                                    </div>
                                    <hr className="my-2" />
                                    {
                                        categoryPageList.map((v, i) => (
                                            <Fragment key={i}>
                                                <div className="d-flex justify-content-between cursor-pointer" onClick={() => { handleCategoryClick(v.catName) }}>
                                                    <div className="lfCatColorBox" style={{ backgroundColor: v.color }}></div>
                                                    <div className="d-flex lfCatName">{v.catName}</div>
                                                </div>
                                                {i !== categoryPageList.length - 1 && <hr className="my-2" />}
                                            </Fragment>
                                        ))
                                    }
                                </>
                            : null
                        }
                    </div>
                </div>
            </div>
            <RemainigQuestionModal
                remainigQuestionModal={remainigQuestionModal}
                toggleQuestionModal={toggleQuestionModal}
                remainigQuestionNode={remainingQuestionsNode}
                onModalQuestionConnect={onModalQuestionConnect}
            />
        </>
    );
}

const RemainigQuestionModal = ({ remainigQuestionModal, toggleQuestionModal, remainigQuestionNode, onModalQuestionConnect }) => {
    return (
        <Modal isOpen={remainigQuestionModal} size="xl">
            <ModalHeader className="" toggle={toggleQuestionModal}>Select The Question To Connect</ModalHeader>
            <ModalBody className="m-4">
                <div className="table-content-wrapper height-58 overflow-auto">
                    <Table striped>
                        <thead>
                            <tr>
                                <th width="25%">Category Name</th>
                                <th width="75%">Questions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                remainigQuestionNode.map((element, index) => {
                                    return (
                                        <tr key={index} onClick={() => { onModalQuestionConnect(element.id) }}>
                                            <td className='vertical-align-center'>
                                                <div className="d-flex cursor-pointer">
                                                    <div className="lfCatColorBox" style={{ backgroundColor: element?.data?.borderColor }}></div>
                                                    <div className="d-flex lfCatName">{element?.data?.categoryPageList}</div>
                                                </div>
                                            </td>
                                            <td style={{paddingBottom: "0px"}} className='cursor-pointer vertical-align-center'>
                                                <div className='w-100 text-white-space'>
                                                    {element?.data?.question || "End Node"}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button variant="contained" color="primary" onClick={toggleQuestionModal}>CANCEL</Button>
            </ModalFooter>
        </Modal>
    )
}

export default LogicFlow