import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    Divider,
    InputBase,
    Paper,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Col, Row } from 'reactstrap';

const SidebarItemBtn = styled(ListItemButton)(({ theme, selected }) => ({
    borderRadius: '5px',
    marginBottom: '4px',
    backgroundColor: selected ? theme.palette.action.activePurple : 'transparent',
    color: selected ? theme.palette.action.activeText : theme.palette.text.primary,
    '&:hover': {
        backgroundColor: selected ? theme.palette.action.activePurple : '#f1f1f1',
    },
    '& .MuiListItemIcon-root': {
        color: selected ? theme.palette.action.activeText : theme.palette.text.secondary,
        minWidth: '32px',
    }
}));

// Dynamic sidebar data structure
const initialSidebarData = [
    {
        id: 'today',
        label: 'Today',
        icon: 'far fa-calendar-day',
        count: 4,
        type: 'view'
    },
    {
        id: 'next7days',
        label: 'Next 7 Days',
        icon: 'far fa-calendar-alt',
        count: 94,
        type: 'view'
    },
    {
        id: 'inbox',
        label: 'Inbox',
        icon: 'far fa-inbox',
        count: 10,
        type: 'view'
    },
    {
        id: 'work-tasks',
        label: 'Work Tasks',
        icon: 'far fa-laptop',
        count: 91,
        type: 'list'
    },
    {
        id: 'study-goals',
        label: 'Study Goals',
        icon: 'far fa-book-open',
        count: 37,
        type: 'list'
    },
    {
        id: 'travel-plans',
        label: 'Travel Plans',
        icon: 'far fa-plane-departure',
        count: 14,
        type: 'list'
    },
    {
        id: 'daily-todos',
        label: 'Daily To-Dos',
        icon: 'far fa-bullseye',
        count: 10,
        type: 'list'
    },
    {
        id: 'life-errands',
        label: 'Life Errands',
        icon: 'far fa-rainbow',
        count: 58,
        type: 'list'
    },
    {
        id: 'this-week',
        label: 'This Week',
        icon: 'far fa-calendar-check',
        count: 48,
        type: 'filter'
    },
    {
        id: 'unscheduled',
        label: 'Unscheduled',
        icon: 'far fa-hourglass-half',
        count: 168,
        type: 'filter'
    },
];

const Sidebar = ({ selectedView, onSelectView, taskList, completedTasks }) => {
    const [sidebarItems, setSidebarItems] = useState(initialSidebarData);

    // Update counts based on actual task data
    useEffect(() => {
        const updatedItems = sidebarItems.map(item => {
            let count = 0;

            switch (item.id) {
                case 'today':
                    count = taskList?.today?.length || 0;
                    break;
                case 'next7days':
                    // Calculate next 7 days tasks
                    count = (taskList?.today?.length || 0) +
                        (taskList?.tomorrow?.length || 0) +
                        (taskList?.next?.length || 0);
                    break;
                default:
                    // For other items, keep their initial count or calculate based on filters
                    count = item.count;
            }

            return { ...item, count };
        });

        setSidebarItems(updatedItems);
    }, [taskList, completedTasks]);

    // Group items by type
    const groupedItems = {
        view: sidebarItems.filter(item => item.type === 'view'),
        list: sidebarItems.filter(item => item.type === 'list'),
        filter: sidebarItems.filter(item => item.type === 'filter')
    };

    return (
        <div style={{ width: 260, borderRight: '1px solid #dee2e6' }} className='p-2'>
            <List>
                {groupedItems.view.map((item) => (
                    <SidebarItemBtn
                        key={item.id}
                        selected={selectedView === item.id}
                        onClick={() => onSelectView(item.id)}
                    >
                        <ListItemIcon>
                            <i className={item.icon} style={{ fontSize: '14px' }}></i>
                        </ListItemIcon>
                        <span style={{ fontSize: "14px", flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: "12px" }}>{item.count}</span>
                    </SidebarItemBtn>
                ))}

                {groupedItems.list.length > 0 && (
                    <>
                        <p className="mt-4 mb-2 px-3" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Lists</p>
                        {groupedItems.list.map((item) => (
                            <SidebarItemBtn
                                key={item.id}
                                selected={selectedView === item.id}
                                onClick={() => onSelectView(item.id)}
                            >
                                <ListItemIcon>
                                    <i className={item.icon} style={{ fontSize: '14px' }}></i>
                                </ListItemIcon>
                                <span style={{ fontSize: "14px", flex: 1 }}>{item.label}</span>
                                <span style={{ fontSize: "12px" }}>{item.count}</span>
                            </SidebarItemBtn>
                        ))}
                    </>
                )}

                {groupedItems.filter.length > 0 && (
                    <>
                        <p className="mt-4 mb-2 px-3" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Filters</p>
                        {groupedItems.filter.map((item) => (
                            <SidebarItemBtn
                                key={item.id}
                                selected={selectedView === item.id}
                                onClick={() => onSelectView(item.id)}
                            >
                                <ListItemIcon>
                                    <i className={item.icon} style={{ fontSize: '14px' }}></i>
                                </ListItemIcon>
                                <span style={{ fontSize: "14px", flex: 1 }}>{item.label}</span>
                                <span style={{ fontSize: "12px" }}>{item.count}</span>
                            </SidebarItemBtn>
                        ))}
                    </>
                )}
            </List>

            <Box sx={{ mt: 'auto', pt: 2 }}>
                <SidebarItemBtn
                    selected={selectedView === 'completed'}
                    onClick={() => onSelectView('completed')}
                >
                    <ListItemIcon>
                        <i className="far fa-check-square" style={{ fontSize: '14px' }}></i>
                    </ListItemIcon>
                    <span style={{ fontSize: "14px", flex: 1 }}>Completed</span>
                    <span style={{ fontSize: "12px" }}>
                        {sidebarItems.find(item => item.id === 'completed')?.count || 0}
                    </span>
                </SidebarItemBtn>
            </Box>
        </div>
    );
};

const TaskListColumn = ({ taskList, onTaskToggle, selectedTasks }) => {
    const [newTask, setNewTask] = useState('');
    const [selectedDay, setSelectedDay] = useState('next7days'); // Default view

    const handleAddTask = () => {
        if (!newTask.trim()) return;

        // Here you would typically update your state with the new task
        console.log('Adding new task:', newTask);
        setNewTask('');
    };

    return (
        <div className="p-4" style={{ flexGrow: 1, overflowY: 'auto', borderRight: '1px solid #dee2e6' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <i className="far fa-bars mr-3 " style={{ fontSize: '18px' }}></i>
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>Next 7 Days</span>
                </div>
                <div>
                    <i className="far fa-sort-alt mr-3" style={{ cursor: 'pointer', fontSize: '18px' }}></i>
                    <i className="far fa-ellipsis-h" style={{ cursor: 'pointer', fontSize: '18px' }}></i>
                </div>
            </div>

            <Paper elevation={0} className="d-flex align-items-center px-3 mb-4" sx={{ bgcolor: '#F8F8F8', borderRadius: '10px' }}>
                <i className="far fa-plus mr-2" style={{ fontSize: '16px' }} onClick={handleAddTask}></i>
                <InputBase
                    placeholder="Add Task"
                    fullWidth
                    sx={{ py: 1, fontSize: '14px' }}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
            </Paper>

            <p className="mb-2" style={{ fontWeight: "bold" }}>
                Today
                <small className='ml-2'>{taskList?.today?.length || 0}</small>
            </p>
            {
                taskList?.today?.map((item) => {
                    const isSelected = selectedTasks.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            className="d-flex align-items-center py-2 px-2 mb-2"
                            style={{
                                marginTop: "8px",
                                backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                                borderRadius: '4px'
                            }}
                        >
                            <input
                                type='checkbox'
                                className='mr-3'
                                style={{ width: "16px", height: "16px" }}
                                checked={isSelected}
                                onChange={() => onTaskToggle(item.id)}
                            />
                            <span style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                flexGrow: 1,
                                color: isSelected ? "#1976d2" : "#333",
                                // textDecoration: isSelected ? "line-through" : "none"
                            }}>
                                {item?.title}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                                <span style={{
                                    fontSize: "14px",
                                    color: "#0478DC",
                                    minWidth: "60px",
                                    textAlign: "right"
                                }}>
                                    {item?.time}
                                </span>
                            </div>
                        </div>
                    );
                })
            }

            <p className="mb-2 mt-3" style={{ fontWeight: "bold" }}>
                Tomorrow
                <small className='ml-2'>{taskList?.tomorrow?.length || 0}</small>
            </p>
            {
                taskList?.tomorrow?.map((item) => {
                    const isSelected = selectedTasks.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            className="d-flex align-items-center py-2 px-2 mb-2"
                            style={{
                                marginTop: "8px",
                                backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                                borderRadius: '4px'
                            }}
                        >
                            <input
                                type='checkbox'
                                className='mr-3'
                                style={{ width: "16px", height: "16px" }}
                                checked={isSelected}
                                onChange={() => onTaskToggle(item.id)}
                            />
                            <span style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                flexGrow: 1,
                                color: isSelected ? "#1976d2" : "#333",
                                // textDecoration: isSelected ? "line-through" : "none"
                            }}>
                                {item?.title}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                                <span style={{
                                    fontSize: "14px",
                                    color: "#0478DC",
                                    minWidth: "60px",
                                    textAlign: "right"
                                }}>
                                    {item?.time}
                                </span>
                            </div>
                        </div>
                    );
                })
            }

            <p className="mb-2 mt-3" style={{ fontWeight: "bold" }}>
                Next 7 Days
                <small className='ml-2'>{taskList?.next?.length || 0}</small>
            </p>
            {
                taskList?.next?.map((item) => {
                    const isSelected = selectedTasks.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            className="d-flex align-items-center py-2 px-2 mb-2"
                            style={{
                                marginTop: "8px",
                                backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                                borderRadius: '4px'
                            }}
                        >
                            <input
                                type='checkbox'
                                className='mr-3'
                                style={{ width: "16px", height: "16px" }}
                                checked={isSelected}
                                onChange={() => onTaskToggle(item.id)}
                            />
                            <span style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                flexGrow: 1,
                                color: isSelected ? "#1976d2" : "#333",
                                // textDecoration: isSelected ? "line-through" : "none"
                            }}>
                                {item?.title}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                                <span style={{
                                    fontSize: "14px",
                                    minWidth: "60px",
                                    textAlign: "right",
                                    color: "#0478DC",
                                }}>
                                    {item?.time}
                                </span>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};

const TaskDetails = ({ reports, selectedTasks, onReportToggle }) => (
    <div className="p-4" style={{ width: 400 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
                <input
                    type='checkbox'
                    className='mr-3'
                    style={{ width: "16px", height: "16px", color: '#ced4da' }}
                    // checked={selectedTasks.length > 0}
                    onChange={() => {/* Handle select all */ }}
                />

                <div className="d-flex align-items-center" style={{ color: "#0478DC", }}>
                    <span>
                        <i className="far fa-calendar-alt mr-2" style={{ fontSize: '14px' }}></i>
                    </span>
                    <span style={{ fontWeight: 600 }}>Today, Sep 5, 13:00-17:00</span>
                </div>

            </div>
            <span>
                <i className="far fa-flag text-muted" style={{ fontSize: '16px' }}></i>
            </span>
        </div>

        <Divider className="mb-4" />

        <div className="d-flex justify-content-between align-items-start mb-3">
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Prepare Work Report</span>
            <i className="far fa-stream" style={{ fontSize: '16px' }}></i>
        </div>

        {
            reports?.map((item) => {
                const isSelected = selectedTasks.includes(`report-${item.id}`);
                return (
                    <div
                        key={item.id}
                        className="d-flex align-items-center py-2 px-2 mb-2"
                        style={{
                            marginTop: "8px",
                            backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                            borderRadius: '4px'
                        }}
                    >
                        <input
                            type='checkbox'
                            className='mr-3'
                            style={{ width: "16px", height: "16px" }}
                            checked={isSelected}
                            onChange={() => onReportToggle(item.id)}
                        />
                        <span style={{
                            fontSize: "16px",
                            fontWeight: 400,
                            flexGrow: 1,
                            color: isSelected ? "#1976d2" : "#333",
                            textDecoration: isSelected ? "line-through" : "none"
                        }}>
                            {item?.title}
                        </span>
                    </div>
                );
            })
        }
    </div>
);

const MyTask = () => {
    const [taskList, setTaskList] = useState({
        today: [
            {
                id: 1,
                title: "Morning Run",
                time: "09:00"
            },
            {
                id: 2,
                title: "Interview Mr. Li",
                time: "11:00"
            },
            {
                id: 3,
                title: "Prepare Work Report",
                time: "14:00"
            },
            {
                id: 4,
                title: "Evening Reading",
                time: "20:00"
            }
        ],
        tomorrow: [
            {
                id: 5,
                title: "Check Work Emails",
                time: "Sep 6"
            },
            {
                id: 6,
                title: "Work Report",
                time: "Sep 6"
            },
        ],
        next: [
            {
                id: 7,
                title: "Morning Run",
                time: "09:00"
            },
            {
                id: 8,
                title: "Interview Mr. Li",
                time: "11:00"
            },
            {
                id: 9,
                title: "Prepare Work Report",
                time: "14:00"
            },
            {
                id: 10,
                title: "Evening Reading",
                time: "20:00"
            }
        ],
    });

    const [reports, setReports] = useState([
        {
            id: 1,
            title: "Organize Documents",
        },
        {
            id: 2,
            title: "Prepare Presentation",
        },
    ]);

    const [selectedView, setSelectedView] = useState('next7days');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const handleTaskToggle = (taskId) => {
        setSelectedTasks(prev => {
            if (prev.includes(taskId)) {
                const newSelected = prev.filter(id => id !== taskId);
                // Move to completed if needed
                const taskToComplete = getAllTasks().find(task => task.id === taskId);
                if (taskToComplete) {
                    setCompletedTasks(prevCompleted => [...prevCompleted, taskToComplete]);
                }
                return newSelected;
            } else {
                return [...prev, taskId];
            }
        });
    };

    const handleReportToggle = (reportId) => {
        const taskId = `report-${reportId}`;
        handleTaskToggle(taskId);
    };

    const getAllTasks = () => {
        return [
            ...taskList.today,
            ...taskList.tomorrow,
            ...taskList.next
        ];
    };

    return (
        <>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 p-md-0">
                    <div className='d-flex border rounded-lg'>
                        <Sidebar
                            selectedView={selectedView}
                            onSelectView={setSelectedView}
                            taskList={taskList}
                            completedTasks={completedTasks}
                        />
                        <TaskListColumn
                            taskList={taskList}
                            onTaskToggle={handleTaskToggle}
                            selectedTasks={selectedTasks}
                        />
                        <TaskDetails
                            reports={reports}
                            selectedTasks={selectedTasks}
                            onReportToggle={handleReportToggle}
                        />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default MyTask;