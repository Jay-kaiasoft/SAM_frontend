import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import UserRoute from './routes/userRoute'
import $ from "jquery";
import Header from './components/shared/header/header.jsx'
import Footer from './components/shared/footer/footer.jsx'
import GlobalAlert from './components/shared/globalAlert/globalAlert.jsx';
import GlobalSnackBar from './components/shared/snackBar/snackBar.jsx';
import ConfirmDialog from "./components/shared/confirmDialog/ConfirmDialog";
import Loader from "./components/shared/loader/loader";
import Loader2 from "./components/shared/loaderV2/loader";
import { setSnackBarAction } from './actions/snackBarActions';
import { getSmsCampaignReplyNotification } from './services/smsCampaignService';
import History from './history';
// import { usePageTracker } from './assets/commonFunctions';
import ReceiveCall from './components/mycrm/components/tempRecieveCall.jsx';
import ModalReceiveCalling from './components/mycrm/components/modalReceiveCalling.jsx';

const AddClient = lazy(() => import("./components/mycrm/addClient.jsx"));
const AddProject = lazy(() => import("./components/mycrm/projects/addProject.jsx"));

const Login = lazy(() => import("./components/login/login.jsx"));
const Otp = lazy(() => import("./components/login/otp.jsx"));
const PageNotFound = lazy(() => import("./components/shared/pageNotFound/pageNotFound.jsx"));
const ForgotPassword = lazy(() => import("./components/forgotPassword/forgotPassword.jsx"));
const ActiveSetup = lazy(() => import("./components/activeSetUp/activeStep"));
const RegisterStep2 = lazy(() => import("./components/login/registerStep2"));
const AddSubAccountType = lazy(() => import("./components/manageUsers/addSubAccountType"));
const ForgotPasswordStep2 = lazy(() => import("./components/forgotPassword/forgotPasswordStep2"));
const ResetPassword = lazy(() => import("./components/forgotPassword/resetPassword"));
const DomainEmailVerification = lazy(() => import("./components/myProfile/domain&EmailVerification/domainEmailVerification"));
const DomainVerification = lazy(() => import("./components/myProfile/domain&EmailVerification/domainVerification"));
const ContactUs = lazy(() => import("./components/myProfile/contactUs"));
const EmailVerification = lazy(() => import("./components/myProfile/domain&EmailVerification/emailVerification"));
const InvoicePdf = lazy(() => import("./components/myProfile/account/invoicePdf"));
const MyProfileTab = lazy(() => import("./components/myProfile/myProfileTab.jsx"));
const ManageUsers = lazy(() => import("./components/manageUsers/manageUsers.jsx"));
const AddSubUsers = lazy(() => import("./components/manageUsers/addSubUsers"));
const MyDesktop = lazy(() => import("./components/myDesktop/myDesktop"));
const Register = lazy(() => import("./components/login/register"));
const Mycrm = lazy(() => import("./components/mycrm/mycrm"));
const QuickBookOauth2redirect = lazy(() => import("./components/mycrm/importClientContacts/quickBookOauth2redirect"));
const SalesForceOauth2redirect = lazy(() => import("./components/mycrm/importClientContacts/salesForceOauth2redirect"));
const ImportClientContacts = lazy(() => import("./components/mycrm/importClientContacts/importClientContacts"));
const GoogleCalendarOauthRedirect = lazy(() => import("./components/mycrm/myCalendar/googleCalendarOauthRedirect"));
const OutlookCalendarOauthRedirect = lazy(() => import("./components/mycrm/myCalendar/outlookCalendarOauthRedirect"));
const ZoomOauthRedirect = lazy(() => import("./components/mycrm/zoomOauthRedirect"));
const Appointment = lazy(() => import("./components/mycrm/myCalendar/appointment/appointment"));
const MyCalendarSettings = lazy(() => import("./components/mycrm/myCalendar/myCalendarSettings"));
const InviteUrl = lazy(() => import("./components/mycrm/inviteUrl"));
const BuildSmsTemplate = lazy(() => import("./components/myDesktop/buildSmsTemplate"));
const BuildSmsCampaign = lazy(() => import("./components/mySmsCampaign/buildSmsCampaign"));
const ManageSmsCampaign = lazy(() => import("./components/mySmsCampaign/manageSmsCampaign"));
const BuildEmailCampaign = lazy(() => import("./components/emailCampaign/buildEmailCampaign"));
const ManageEmailCampaign = lazy(() => import("./components/emailCampaign/manageEmailCampaign"));
const BuildBuildItForMe = lazy(() => import("./components/buildItforme/buildBuildItForMe"));
const BuildAutomation = lazy(() => import("./components/automation/buildAutomation"));
const Dashboard = lazy(() => import("./components/dashboard/dashboard.jsx"));
const AddMyAssessmentTemplates = lazy(() => import("./components/assessment/assessmentTemplates/addMyAssessmentTemplates"));
const ManageAssessment = lazy(() => import("./components/assessment/manageAssessment"));
const CreateAssessment = lazy(() => import("./components/assessment/createAssessment"));
const DisplayAssessment = lazy(() => import("./components/assessment/displayAssessment"));
const AddMySurveyTemplates = lazy(() => import("./components/survey/surveyTemplates/addMySurveyTemplates"));
const CreateForm = lazy(() => import("./components/form/createForm"));
const SmsCampaignReportPdf = lazy(() => import("./components/mySmsCampaign/reports/smsCampaignReportPdf"));
const CampaignReportPdf = lazy(() => import("./components/emailCampaign/report/regular/campaignReportPdf"));
const ThanksRegister = lazy(() => import("./components/login/thanksRegister"));
const AddMyPage = lazy(() => import("./components/myPages/addMyPage"));
const GoogleDriveOauthRedirect = lazy(() => import("./components/shared/fileManager/googleDriveOauthRedirect"));
const CreateSmsPolling = lazy(() => import('./components/smsPolling/createSmsPolling'));
const ManageSmsPolling = lazy(() => import("./components/smsPolling/manageSmsPolling"));
const CreateNewPost = lazy(() => import("./components/socialMediaCampaign/createNewPost"));
const ViewTemplate = lazy(() => import("./components/myDesktop/viewTemplate"));
const ViewInBrowser = lazy(() => import("./components/myDesktop/viewInBrowser"));
const DropBoxOauthRedirect = lazy(() => import("./components/shared/fileManager/dropBoxOauthRedirect"));
const OneDriveOauthRedirect  = lazy(() => import("./components/shared/fileManager/oneDriveOauthRedirect"));
const FaceBookOauthRedirect  = lazy(() => import("./components/socialMediaCampaign/faceBookOauthRedirect"));
const ManageSocialMedia  = lazy(() => import("./components/socialMediaCampaign/manageSocialMedia"));
const LinkedInOauthRedirect  = lazy(() => import("./components/socialMediaCampaign/linkedInOauthRedirect"));
const TwitterOauthRedirect  = lazy(() => import("./components/socialMediaCampaign/twitterOauthRedirect"));
const SmsPollingReport = lazy(() => import("./components/smsPolling/report/smsPollingReport"));
const SocialMediaReport = lazy(() => import("./components/socialMediaCampaign/report/socialMediaReport"));
const CampaignReportPdfABTesting = lazy(() => import("./components/emailCampaign/report/abTesting/campaignReportPdfABTesting"));
const LinkClick = lazy(() => import("./components/emailCampaign/linkClick"));
const ReportPdf = lazy(() => import("./components/shared/commonControlls/reportPdf"));
const ReportCommentPdf = lazy(() => import("./components/shared/commonControlls/reportCommentPdf.jsx"));
const ReportTextAnswerPdf = lazy(() => import("./components/shared/commonControlls/reportTextAnswertPdf.jsx"));
const SurveyReport = lazy(() => import("./components/survey/report/surveyReport"));
const AssessmentReport = lazy(() => import("./components/assessment/report/assessmentReport"));
const ShopifyOauthRedirect = lazy(() => import("./components/shared/editor/commonComponents/shopifyOauthRedirect"));
const ManageAutomation = lazy(() => import("./components/automation/manageAutomation"));
const DisplayForm = lazy(() => import("./components/form/displayForm.jsx"));
const DisplaySurvey = lazy(() => import('./components/survey/displaySurvey'));
const FormReport = lazy(() => import("./components/form/formReport"));
const CreateSurvey = lazy(() => import("./components/survey/createSurvey"));
const ManageSurvey = lazy(() => import("./components/survey/manageSurvey"));
const ManageSurveyCategory = lazy(() => import("./components/survey/manageSurveyCategory"));
const ManageAssessmentCategory = lazy(() => import("./components/assessment/manageAssessmentCategory"));
const ManageSmsReport = lazy(() => import("./components/mySmsCampaign/reports/manageSmsReport"));
const SmsReport = lazy(() => import("./components/mySmsCampaign/reports/smsReport"));
const ManageCampaignReport = lazy(() => import("./components/emailCampaign/report/manageCampaignReport"));
const CampaignReport = lazy(() => import("./components/emailCampaign/report/campaignReport"));
const ManageSocialMediaReport = lazy(() => import("./components/socialMediaCampaign/report/manageSocialMediaReport"));
const SubAccountActiveSetup = lazy(() => import('./components/activeSetUp/subAccountActiveSetup'));
const ManageSupportTicket = lazy(() => import('./components/support/manageSupportTicket'));
const AddTicket = lazy(() => import('./components/support/addTicket'));
const ViewTicket = lazy(() => import('./components/support/viewTicket'));
const OptIn = lazy(() => import('./components/optIn/optIn'));
const OptOut = lazy(() => import('./components/mycrm/optFunctionality/optOut'));
const SubscribeLink = lazy(() => import('./components/mycrm/optFunctionality/subscribeLink'));
const EmailCampaignAutomationReport = lazy(() => import('./components/automation/report/emailCampaign/emailCampaignAutomationReport'));
const MyAnalytics = lazy(() => import("./components/myAnalytics/myAnalytics"));
const AffiliateProgram = lazy(() => import("./components/affiliateProgram/affiliateProgram"));
const ChoosePlan = lazy(() => import("./components/login/choosePlan"));

window.jQuery = $;
window.$ = $;

const App = (props) => {
    const noHeader = ["/quickbookoauth2redirect","/salesforceoauth2redirect","/viewtemplate","/viewinbrowser","/facebookoauthredirect","/twitteroauthredirect","/linkedinoauthredirect","/shopifyoauthredirect", "/zoomoauthredirect"];
    const noFooter = ["/addmysurveytemplates","/addmyassessmenttemplates","/createform"];
    const [lastId, setLastId] = useState(0);
    const tooltips = () => {
        let tooltipId=$('.tooltip.show').attr("id");
        if($('body').find('[aria-describedby='+tooltipId+']').length === 0){
            $('.tooltip.show').tooltip('dispose');
        }
        $('[data-toggle="tooltip"]').tooltip({placement:"bottom",boundary: 'window',container: 'body'});
    }
    useEffect(()=>{
        setInterval(tooltips,1000);
    });
    useEffect(()=>{
        let interval = null;
        if(sessionStorage.getItem('isLoggedInUser') === "yes" && (props.location.pathname.split("/")[1] !== "addmypage" && props.location.pathname.split("/")[1] !== "createform" && props.location.pathname.split("/")[1] !== "addmysurveytemplates" && props.location.pathname.split("/")[1] !== "addmyassessmenttemplates")){
            interval = setInterval(() => {
                getSmsCampaignReplyNotification(lastId).then(res => {
                    if (res.status === 200) {
                        if(res.result.notification === "YES"){
                            props.SnackBar({
                                type: "info",
                                text: "You have got SMS campaign reply",
                                open: true,
                                onClick: ()=>{
                                    History.push("/managesmsinbox");
                                }
                            });
                            setLastId(res.result.lastId);
                        } else {
                            setLastId(res.result.lastId);
                        }
                    }
                })
            }, 30 * 1000);
        }
        return ()=>{
            clearInterval(interval);
            interval = null;
        }
    },[props, lastId]);
    // usePageTracker(props?.user?.memberId, props?.subUser?.memberId);
    return (
        <Container fluid className="mainBox">
            <GlobalAlert />
            <GlobalSnackBar/>
            <ConfirmDialog/>
            <Loader/>
            {(sessionStorage.getItem('isLoggedInUser') === "yes") && <ModalReceiveCalling />}
            {(sessionStorage.getItem('isLoggedInUser') === "yes") && ((!noHeader.includes(props.location.pathname)) && props.location.pathname.split("/")[1] !== "appointment") &&
                <Row className="headerMain">
                    <Col className='p-0'>
                        <Header className='m-0' />
                    </Col>
                </Row>
            }
            <Suspense fallback={
                <Loader2 />
            }>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/login" />} />
                    <Route path="/index.html" exact render={() => <Redirect to="/login" />} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/otp" exact component={Otp} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/thanksregister" exact component={ThanksRegister} />
                    <Route path="/chooseplan" exact component={ChoosePlan} />
                    <Route path="/activesetup" exact component={ActiveSetup} />
                    <Route path="/subaccountactivesetup" exact component={SubAccountActiveSetup} />
                    <Route path="/registerstep2" exact component={RegisterStep2} />
                    <Route path="/forgotpassword" exact component={ForgotPassword} />
                    <Route path="/forgotpasswordstep2" exact component={ForgotPasswordStep2} />
                    <Route path="/resetpassword" exact component={ResetPassword} />
                    <Route path="/emailverification" exact component={EmailVerification} />
                    <Route path="/inviteurl" exact component={InviteUrl} />
                    <Route path="/unsubscribe" exact component={OptIn} />
                    <UserRoute path="/dashboard" exact component={Dashboard} />
                    <UserRoute path="/mydesktop" exact component={MyDesktop} />
                    <UserRoute path="/mypages" exact component={MyDesktop} />
                    <UserRoute path="/managesupportticket" exact component={ManageSupportTicket}/>
                    <UserRoute path="/addticket" exact component={AddTicket}/>
                    <UserRoute path="/viewticket" exact component={ViewTicket}/>
                    <UserRoute path="/smstemplates" exact component={MyDesktop} />
                    <UserRoute path="/builditforme" exact component={MyDesktop} />
                    <UserRoute path="/myforms" exact component={MyDesktop} />
                    <UserRoute path="/mysurveytemplates" exact component={MyDesktop}/>
                    <UserRoute path="/myassessmenttemplates" exact component={MyDesktop}/>
                    <UserRoute path="/mydrive" exact component={MyDesktop} />
                    <UserRoute path="/buildsmstemplate" exact component={BuildSmsTemplate} />
                    <UserRoute path="/addmypage" exact component={AddMyPage} />
                    <UserRoute path="/memberinfo" exact component={MyProfileTab} />
                    <UserRoute path="/mybrandkit" exact component={MyProfileTab} />
                    <UserRoute path="/changepassword" exact component={MyProfileTab} />
                    <UserRoute path="/securityquestions" exact component={MyProfileTab} />
                    <UserRoute path="/communication" exact component={MyProfileTab} />
                    <UserRoute path="/account" exact component={MyProfileTab} />
                    <UserRoute path="/carddetails" exact component={MyProfileTab} />
                    <UserRoute path="/manageapps" exact component={MyProfileTab} />
                    <UserRoute path="/manageplan" exact component={MyProfileTab} />
                    <UserRoute path="/sms" exact component={MyProfileTab}/>
                    <UserRoute path="/apisettings" exact component={MyProfileTab} />
                    <UserRoute path="/emailsignatures" exact component={MyProfileTab} />
                    <UserRoute path="/emailcampaignfooter" exact component={MyProfileTab} />
                    <UserRoute path="/invoicepdf" exact component={InvoicePdf} />
                    <UserRoute path="/manageusers" exact component={ManageUsers} />
                    <UserRoute path="/subaccount" exact component={AddSubUsers} />
                    <UserRoute path="/subaccounttype" exact component={AddSubAccountType} />
                    <UserRoute path="/domainemailverification" exact component={DomainEmailVerification} />
                    <UserRoute path="/domainverification" exact component={DomainVerification} />
                    <UserRoute path="/contactus" exact component={ContactUs} />
                    <UserRoute path="/createform" exact component={CreateForm} />
                    <UserRoute path="/mycrm" exact component={Mycrm} />
                    <UserRoute path="/clientContact" exact component={Mycrm} />
                    <UserRoute path="/mypipeline" exact component={Mycrm} />
                    <UserRoute path="/mytasks" exact component={Mycrm} />
                    <UserRoute path="/mycalendar" exact component={Mycrm} />
                    <UserRoute path="/managesmsinbox" exact component={Mycrm} />
                    <UserRoute path="/createimport" exact component={ImportClientContacts} />
                    <UserRoute path="/quickbookoauth2redirect" exact component={QuickBookOauth2redirect} />
                    <UserRoute path="/salesforceoauth2redirect" exact component={SalesForceOauth2redirect} />
                    <UserRoute path="/manageemailcampaign" exact component={ManageEmailCampaign} />
                    <UserRoute path="/managesmscampaign" exact component={ManageSmsCampaign} />
                    <UserRoute path="/buildsmscampaign" exact component={BuildSmsCampaign} />
                    <UserRoute path="/buildemailcampaign" exact component={BuildEmailCampaign} />
                    <UserRoute path="/managecampaignreport" exact component={ManageCampaignReport} />
                    <UserRoute path="/campaignreport" exact component={CampaignReport} />
                    <UserRoute path="/campaignreportpdf" exact component={CampaignReportPdf}/>
                    <UserRoute path="/campaignreportabtesting" exact component={CampaignReport} />
                    <UserRoute path="/campaignreportpdfabtesting" exact component={CampaignReportPdfABTesting}/>
                    <UserRoute path="/buildbuilditforme" exact component={BuildBuildItForMe} />
                    <UserRoute path="/googledriveoauthredirect" exact component={GoogleDriveOauthRedirect} />
                    <UserRoute path="/managesmspolling" exact component={ManageSmsPolling} />
                    <UserRoute path="/createsmspolling" exact component={CreateSmsPolling}/>
                    <UserRoute path="/managesocialmedia" exact component={ManageSocialMedia} />
                    <UserRoute path="/createsocialmediapost" exact component={CreateNewPost} />
                    <Route path="/viewtemplate" exact component={ViewTemplate} />
                    <Route path="/viewinbrowser" exact component={ViewInBrowser} />
                    <UserRoute path="/dropboxoauthredirect" exact component={DropBoxOauthRedirect} />
                    <UserRoute path="/onedriveoauthredirect" exact component={OneDriveOauthRedirect} />
                    <UserRoute path="/facebookoauthredirect" exact component={FaceBookOauthRedirect} />
                    <UserRoute path="/twitteroauthredirect" exact component={TwitterOauthRedirect} />
                    <UserRoute path="/linkedinoauthredirect" exact component={LinkedInOauthRedirect} />
                    <UserRoute path="/googlecalendaroauthredirect" exact component={GoogleCalendarOauthRedirect} />
                    <UserRoute path="/outlookcalendaroauthredirect" exact component={OutlookCalendarOauthRedirect} />
                    <UserRoute path="/managesurvey" exact component={ManageSurvey} />
                    <UserRoute path="/managesurveycategory" exact component={ManageSurveyCategory} />
                    <UserRoute path="/createsurvey" exact component={CreateSurvey} />
                    <UserRoute path="/buildautomation" exact component={BuildAutomation} />
                    <UserRoute path="/manageautomation" exact component={ManageAutomation} />
                    <Route path="/customform" exact component={DisplayForm}/>
                    <Route path="/survey" exact component={DisplaySurvey}/>
                    <UserRoute path="/surveyReport" exact component={SurveyReport} />
                    <UserRoute path="/formreport" exact component={FormReport}/>
                    <UserRoute path="/addmysurveytemplates" exact component={AddMySurveyTemplates}/>
                    <UserRoute path="/manageassessmentcategory" exact component={ManageAssessmentCategory} />
                    <UserRoute path="/addmyassessmenttemplates" exact component={AddMyAssessmentTemplates}/>
                    <UserRoute path="/manageassessment" exact component={ManageAssessment} />
                    <UserRoute path="/assessmentReport" exact component={AssessmentReport} />
                    <UserRoute path="/createassessment" exact component={CreateAssessment} />
                    <UserRoute path="/mycalendarsettings" exact component={MyCalendarSettings} />
                    <UserRoute path="/managesmsreport" exact component={ManageSmsReport} />
                    <UserRoute path="/smsreport" exact component={SmsReport} />
                    <UserRoute path="/smscampaignreportpdf" exact component={SmsCampaignReportPdf}/>
                    <UserRoute path="/managesocialmediareport" exact component={ManageSocialMediaReport} />
                    <UserRoute path="/socialmediareport" exact component={SocialMediaReport} />
                    <UserRoute path="/smspollingreport" exact component={SmsPollingReport} />
                    <UserRoute path="/reportpdf" exact component={ReportPdf} />
                    <UserRoute path="/reportcommentpdf" exact component={ReportCommentPdf} />
                    <UserRoute path="/reporttextanswerpdf" exact component={ReportTextAnswerPdf} />
                    <UserRoute path="/shopifyoauthredirect" exact component={ShopifyOauthRedirect} />
                    <UserRoute path="/zoomoauthredirect" exact component={ZoomOauthRedirect} />
                    <Route path="/assessment" exact component={DisplayAssessment}/>
                    <Route path="/appointment" exact component={Appointment}/>
                    <Route path="/linkclick" exact component={LinkClick}/>
                    <Route path="/optout" exact component={OptOut}/>
                    <Route path="/subscribelink" exact component={SubscribeLink}/>
                    <UserRoute path="/emailcampaignautomationreport" exact component={EmailCampaignAutomationReport} />
                    <UserRoute path="/myanalytics" exact component={MyAnalytics} />
                    <UserRoute path="/dashboardanalytics" exact component={MyAnalytics} />
                    <UserRoute path="/usermonetisation" exact component={MyAnalytics} />
                    <UserRoute path="/campaignmonetisation" exact component={MyAnalytics} />
                    <UserRoute path="/affiliateprogram" exact component={AffiliateProgram} />
                    <Route path="/temprecievecall" exact component={ReceiveCall} />
                    <UserRoute path="/addclient" exact component={AddClient} />
                    <UserRoute path="/projects" exact component={Mycrm} />
                    <UserRoute path="/addProject" exact component={AddProject} />
                    <Route path="/**" component={PageNotFound} />
                </Switch>
            </Suspense>
            {(sessionStorage.getItem('isLoggedInUser') === "yes") && ((!noHeader.includes(props.location.pathname)) && (!noFooter.includes(props.location.pathname)) && props.location.pathname.split("/")[1] !== "appointment") &&
                <Row className="footerMain">
                    <Col>
                        <Footer />
                    </Col>
                </Row>
            }
        </Container>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user:state.user,
        subUser:state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        SnackBar: (data) => {
            dispatch(setSnackBarAction(data))
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App)