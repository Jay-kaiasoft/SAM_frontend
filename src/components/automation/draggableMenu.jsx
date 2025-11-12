import React from 'react';
import {EmailOutlined, PlayCircleOutline, MoreHoriz, CallSplit, Timer, PlayArrowOutlined, CropSquare, HelpOutline, Link} from '@mui/icons-material';
import Box from '@mui/material/Box';
import Draggable from "react-draggable";
import { handleClickHelp } from '../../assets/commonFunctions';

const DraggableMenu = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Draggable handle="strong">
            <aside className="sidebarcontainer">
                <strong className="cursor sidebartop" >
                    <div data-toggle="tooltip" title="Drag Form Here">
                        <MoreHoriz fontSize="large" style={{ fill: "white" }} />
                    </div>
                </strong>
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Start')} draggable data-toggle="tooltip" title="Start">
                        <PlayArrowOutlined fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Trigger')} draggable data-toggle="tooltip" title="Event">
                        <PlayCircleOutline fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
                {/* <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper dnnode" onDragStart={(event) => onDragStart(event, 'Pause')} draggable data-toggle="tooltip" title="Pause">
                        <PauseCircleOutlineIcon fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box> */}
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper dnnode" onDragStart={(event) => onDragStart(event, 'Email')} draggable data-toggle="tooltip" title="Email">
                        <EmailOutlined fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Timer')} draggable data-toggle="tooltip" title="Timer">
                        <Timer fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
                {/* <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Filter')} draggable data-toggle="tooltip" title="Filter">
                        <FilterAltIcon fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box> */}
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Condition')} draggable data-toggle="tooltip" title="Condition">
                        <CallSplit fontSize="large" className="sidebarSVGImg" style={{ transform: "rotate(180deg)" }} />
                    </div>
                </Box>
                {/* <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Link')} draggable data-toggle="tooltip" title="Link">
                        <Link fontSize="large" className="sidebarSVGImg" style={{ transform: "rotate(180deg)" }} />
                    </div>
                </Box> */}
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onDragStart={(event) => onDragStart(event, 'Stop')} draggable data-toggle="tooltip" title="Stop">
                        <CropSquare fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
                <Box className="sidebarBoxWrapper">
                    <div className="IconWrapper" onClick={()=>{handleClickHelp("Automation/Automation/Email/AutomationEmail.html")}} draggable data-toggle="tooltip" title="Help">
                        <HelpOutline fontSize="large" className="sidebarSVGImg" />
                    </div>
                </Box>
            </aside>
        </Draggable>
    );
}

export default DraggableMenu;