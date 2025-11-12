import React, {useState} from 'react';
import {connect} from "react-redux";
import {List, ListItem, IconButton, ListItemText, Drawer, Collapse} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {logoutUserAction} from "../../../../actions/userActions";
import history from "../../../../history";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import { staticUrl } from '../../../../config/api';

const DrawerComponent = (props) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [start, setStart] = React.useState(false);
    const [myProfile, setMyProfile] = React.useState(false);
    const [myCrm, setMyCrm] = React.useState(false);
    const [myDesktop, setMyDesktop] = React.useState(false);
    const handleStart = () => {
        setStart(!start);
    };
    const handleMyProfile = () => {
        setMyProfile(!myProfile);
    };
    const handleMyCrm = () => {
        setMyCrm(!myCrm);
    };
    const handleMyDesktop = () => {
        setMyDesktop(!myDesktop);
    };
    const handleSignOut = () => {
        props.logOut();
    }
    const noPermission = () => {
        props.globalAlert({
            type: "Error",
            text: "You don't have permission. Please contact your admin.",
            open: true
        });
    }
    const noPermission2 = () => {
        props.globalAlert({
            type: "Error",
            text: "Your Plan doesn't have this functionality. Please upgrade your plan.",
            open: true
        });
    }
    const handleClickSupport = () => {
        window.open(staticUrl + "/support/", "_blank");
    }
    return (
        <>
            <Drawer anchor='right' onClose={() => setOpenDrawer(false)} open={openDrawer} onChange={() => setOpenDrawer(true)}>
                <List style={{width:"230px"}}>
                    <ListItem divider button onClick={()=>{ setOpenDrawer(false); return history.push("/dashboard"); }}>
                        <ListItemText> Dashboard</ListItemText>
                    </ListItem>
                    <ListItem divider button onClick={handleMyCrm}>
                        <ListItemText primary="My CRM"/>
                        {myCrm ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={myCrm} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding onClick={() => setOpenDrawer(false)}>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Client Contact") ? (props.menuLists.includes("my crm") || props.subUser.memberId === 0) ? history.push("/clientContact") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Client Contact"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("My Calendar") ? (props.menuLists.includes("my crm") || props.subUser.memberId === 0) ? history.push("/mycalendar") : noPermission() : noPermission2()}}>
                                <ListItemText primary="My Calendar"/>
                            </ListItem>
                            {/*<ListItem button onClick={()=>{ return props.menuLists.includes("my crm") || props.subUser.memberId === 0 ? history.push("/mypipeline") : noPermission()}}>*/}
                            {/*    <ListItemText primary="My Pipeline"/>*/}
                            {/*</ListItem>*/}
                            {/*<ListItem button onClick={()=>{ return props.menuLists.includes("my crm") || props.subUser.memberId === 0 ? history.push("/mytasks") : noPermission()}}>*/}
                            {/*    <ListItemText primary="My Tasks"/>*/}
                            {/*</ListItem>*/}
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("SMS Inbox") ? (props.menuLists.includes("my crm") || props.subUser.memberId === 0) ? history.push("/managesmsinbox") : noPermission() : noPermission2()}}>
                                <ListItemText primary="SMS Inbox"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem divider button onClick={()=>{ setOpenDrawer(false); return props.user.planModuleList.includes("My Analytics") ? history.push("/myanalytics") : noPermission2(); }}>
                        <ListItemText> My Analytics</ListItemText>
                    </ListItem>
                    <ListItem divider button onClick={handleMyDesktop}>
                        <ListItemText primary="My Desktop"/>
                        {myDesktop ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={myDesktop} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding onClick={() => setOpenDrawer(false)}>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("My Pages Design") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/mypages") : noPermission() : noPermission2()}}>
                                <ListItemText primary="My Pages Design"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("SMS Templates") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/smstemplates") : noPermission() : noPermission2()}}>
                                <ListItemText primary="SMS Templates"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Build It For Me") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/builditforme") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Build It For Me"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("My Forms Design") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/myforms") : noPermission() : noPermission2()}}>
                                <ListItemText primary="My Forms Design"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Survey Design") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/mysurveytemplates") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Survey Design"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Assessment Design") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/myassessmenttemplates") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Assessment Design"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("My Drive") ? (props.menuLists.includes("my desktop") || props.subUser.memberId === 0) ? history.push("/mydrive") : noPermission() : noPermission2()}}>
                                <ListItemText primary="My Drive"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem divider button onClick={handleStart}>
                        <ListItemText primary="My Campaigns"/>
                        {start ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={start} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding onClick={() => setOpenDrawer(false)}>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Email Campaign") ? (props.menuLists.includes("email campaign") || props.subUser.memberId === 0) ? history.push("/manageemailcampaign") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Email Campaign"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("SMS Campaign") ? (props.menuLists.includes("sms campaign") || props.subUser.memberId === 0) ? history.push("/managesmscampaign") : noPermission() : noPermission2()}}>
                                <ListItemText primary="SMS Campaign"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Social Media Post") ? (props.menuLists.includes("social media post") || props.subUser.memberId === 0) ? history.push("/managesocialmedia") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Social Media Post"/>
                            </ListItem>
                            {/* <ListItem button onClick={()=>{ return handleClickAutomation()}}>
                                <ListItemText primary="Automation"/>
                            </ListItem> */}
                            <ListItem button onClick={()=>{ return (props.user.planModuleList.includes("Automation")) ? history.push("/manageautomation") : noPermission2()}}>
                                <ListItemText primary="Automation"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Surveys") ? (props.menuLists.includes("surveys") || props.subUser.memberId === 0) ? history.push("/managesurvey") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Survey"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("SMS Polling") ? (props.menuLists.includes("sms polling") || props.subUser.memberId === 0) ? history.push("/managesmspolling") : noPermission() : noPermission2()}}>
                                <ListItemText primary="SMS Polling"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Assessment") ? (props.menuLists.includes("assessment") || props.subUser.memberId === 0) ? history.push("/manageassessment") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Assessment"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem divider button onClick={handleMyProfile}>
                        <ListItemText primary="My Profile"/>
                        {myProfile ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={myProfile} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding onClick={() => setOpenDrawer(false)}>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Edit Profile") ? history.push("/memberinfo") : noPermission2(); }}>
                                <ListItemText primary="Edit Profile"/>
                            </ListItem>
                            { props.subUser.memberId === 0 &&
                                <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Manage User") ? history.push("/manageusers") : noPermission2(); }}>
                                    <ListItemText primary="Manage User"/>
                                </ListItem>
                            }
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Domain & Email Verifications") ? (props.menuLists.includes("domain and email verification") || props.subUser.memberId === 0) ? history.push("/domainemailverification") : noPermission() : noPermission2()}}>
                                <ListItemText primary="Domain & Email Verifications"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return props.user.planModuleList.includes("Affiliate Program") ? history.push("/affiliateprogram") : noPermission2(); }}>
                                <ListItemText primary="Affiliate Program"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return history.push("/contactus"); }}>
                                <ListItemText primary="Contact Us"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ return history.push("/managesupportticket") }}>
                                <ListItemText primary="Support Ticket"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ handleClickSupport() }}>
                                <ListItemText primary="Knowledge Base"/>
                            </ListItem>
                            <ListItem button onClick={()=>{ handleSignOut() }}>
                                <ListItemText primary="Sign Out"/>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Drawer>
            <IconButton
                onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon/>
            </IconButton>
        </>
    );
};
const mapStateToProps = ({ user,subUser,menuLists }) => ({ user,subUser,menuLists })
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        },
        logOut : () => {
            dispatch(logoutUserAction())
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DrawerComponent)