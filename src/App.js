import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
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
const OneDriveOauthRedirect = lazy(() => import("./components/shared/fileManager/oneDriveOauthRedirect"));
const FaceBookOauthRedirect = lazy(() => import("./components/socialMediaCampaign/faceBookOauthRedirect"));
const ManageSocialMedia = lazy(() => import("./components/socialMediaCampaign/manageSocialMedia"));
const LinkedInOauthRedirect = lazy(() => import("./components/socialMediaCampaign/linkedInOauthRedirect"));
const TwitterOauthRedirect = lazy(() => import("./components/socialMediaCampaign/twitterOauthRedirect"));
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
    const noHeader = ["/newcrm/quickbookoauth2redirect", "/newcrm/salesforceoauth2redirect", "/newcrm/viewtemplate", "/newcrm/viewinbrowser", "/newcrm/facebookoauthredirect", "/newcrm/twitteroauthredirect", "/newcrm/linkedinoauthredirect", "/newcrm/shopifyoauthredirect", "/newcrm/zoomoauthredirect"];
    const noFooter = ["/newcrm/addmysurveytemplates", "/newcrm/addmyassessmenttemplates", "/newcrm/createform"];
    const [lastId, setLastId] = useState(0);
    const tooltips = () => {
        let tooltipId = $('.tooltip.show').attr("id");
        if ($('body').find('[aria-describedby=' + tooltipId + ']').length === 0) {
            $('.tooltip.show').tooltip('dispose');
        }
        $('[data-toggle="tooltip"]').tooltip({ placement: "bottom", boundary: 'window', container: 'body' });
    }
    useEffect(() => {
        setInterval(tooltips, 1000);
    });
    useEffect(() => {
        let interval = null;
        if (sessionStorage.getItem('isLoggedInUser') === "yes" && (props.location.pathname.split("/")[1] !== "addmypage" && props.location.pathname.split("/")[1] !== "createform" && props.location.pathname.split("/")[1] !== "addmysurveytemplates" && props.location.pathname.split("/")[1] !== "addmyassessmenttemplates")) {
            interval = setInterval(() => {
                getSmsCampaignReplyNotification(lastId).then(res => {
                    if (res.status === 200) {
                        if (res.result.notification === "YES") {
                            props.SnackBar({
                                type: "info",
                                text: "You have got SMS campaign reply",
                                open: true,
                                onClick: () => {
                                    History.push("/newcrm/managesmsinbox");
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
        return () => {
            clearInterval(interval);
            interval = null;
        }
    }, [props, lastId]);
    // usePageTracker(props?.user?.memberId, props?.subUser?.memberId);
    return (
        <Container fluid className="mainBox">
            <GlobalAlert />
            <GlobalSnackBar />
            <ConfirmDialog />
            <Loader />
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
                    <Route path="/newcrm/" exact render={() => <Redirect to="/newcrm/login" />} />
                    <Route path="/newcrm/index.html" exact render={() => <Redirect to="/newcrm/login" />} />
                    <Route path="/newcrm/login" exact component={Login} />
                    <Route path="/newcrm/otp" exact component={Otp} />
                    <Route path="/newcrm/register" exact component={Register} />
                    <Route path="/newcrm/thanksregister" exact component={ThanksRegister} />
                    <Route path="/newcrm/chooseplan" exact component={ChoosePlan} />
                    <Route path="/newcrm/activesetup" exact component={ActiveSetup} />
                    <Route path="/newcrm/subaccountactivesetup" exact component={SubAccountActiveSetup} />
                    <Route path="/newcrm/registerstep2" exact component={RegisterStep2} />
                    <Route path="/newcrm/forgotpassword" exact component={ForgotPassword} />
                    <Route path="/newcrm/forgotpasswordstep2" exact component={ForgotPasswordStep2} />
                    <Route path="/newcrm/resetpassword" exact component={ResetPassword} />
                    <Route path="/newcrm/emailverification" exact component={EmailVerification} />
                    <Route path="/newcrm/inviteurl" exact component={InviteUrl} />
                    <Route path="/newcrm/unsubscribe" exact component={OptIn} />
                    <UserRoute path="/newcrm/dashboard" exact component={Dashboard} />
                    <UserRoute path="/newcrm/mydesktop" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/mypages" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/managesupportticket" exact component={ManageSupportTicket} />
                    <UserRoute path="/newcrm/addticket" exact component={AddTicket} />
                    <UserRoute path="/newcrm/viewticket" exact component={ViewTicket} />
                    <UserRoute path="/newcrm/smstemplates" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/builditforme" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/myforms" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/mysurveytemplates" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/myassessmenttemplates" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/mydrive" exact component={MyDesktop} />
                    <UserRoute path="/newcrm/buildsmstemplate" exact component={BuildSmsTemplate} />
                    <UserRoute path="/newcrm/addmypage" exact component={AddMyPage} />
                    <UserRoute path="/newcrm/memberinfo" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/mybrandkit" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/changepassword" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/securityquestions" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/communication" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/account" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/carddetails" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/manageapps" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/manageplan" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/sms" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/apisettings" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/emailsignatures" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/emailcampaignfooter" exact component={MyProfileTab} />
                    <UserRoute path="/newcrm/invoicepdf" exact component={InvoicePdf} />
                    <UserRoute path="/newcrm/manageusers" exact component={ManageUsers} />
                    <UserRoute path="/newcrm/subaccount" exact component={AddSubUsers} />
                    <UserRoute path="/newcrm/subaccounttype" exact component={AddSubAccountType} />
                    <UserRoute path="/newcrm/domainemailverification" exact component={DomainEmailVerification} />
                    <UserRoute path="/newcrm/domainverification" exact component={DomainVerification} />
                    <UserRoute path="/newcrm/contactus" exact component={ContactUs} />
                    <UserRoute path="/newcrm/createform" exact component={CreateForm} />
                    
                    <UserRoute path="/newcrm/mycrm" exact component={Mycrm} />
                    <UserRoute path="/newcrm/clientContact" exact component={Mycrm} />
                    <UserRoute path="/newcrm/mypipeline" exact component={Mycrm} />
                    <UserRoute path="/newcrm/mytasks" exact component={Mycrm} />
                    <UserRoute path="/newcrm/mycalendar" exact component={Mycrm} />
                    <UserRoute path="/newcrm/managesmsinbox" exact component={Mycrm} />
                    <UserRoute path="/newcrm/projects" exact component={Mycrm} />
                    <UserRoute path="/newcrm/crm" exact component={Mycrm} />
                    <UserRoute path="/newcrm/mail" exact component={Mycrm} />
                    <UserRoute path="/newcrm/inventory" exact component={Mycrm} />
                    <UserRoute path="/newcrm/invoice" exact component={Mycrm} />
                    <UserRoute path="/newcrm/myTasks" exact component={Mycrm} />
                    <UserRoute path="/newcrm/journal" exact component={Mycrm} />
                    <UserRoute path="/newcrm/pipeline" exact component={Mycrm} />
                    
                    <UserRoute path="/newcrm/createimport" exact component={ImportClientContacts} />
                    <UserRoute path="/newcrm/quickbookoauth2redirect" exact component={QuickBookOauth2redirect} />
                    <UserRoute path="/newcrm/salesforceoauth2redirect" exact component={SalesForceOauth2redirect} />
                    <UserRoute path="/newcrm/manageemailcampaign" exact component={ManageEmailCampaign} />
                    <UserRoute path="/newcrm/managesmscampaign" exact component={ManageSmsCampaign} />
                    <UserRoute path="/newcrm/buildsmscampaign" exact component={BuildSmsCampaign} />
                    <UserRoute path="/newcrm/buildemailcampaign" exact component={BuildEmailCampaign} />
                    <UserRoute path="/newcrm/managecampaignreport" exact component={ManageCampaignReport} />
                    <UserRoute path="/newcrm/campaignreport" exact component={CampaignReport} />
                    <UserRoute path="/newcrm/campaignreportpdf" exact component={CampaignReportPdf} />
                    <UserRoute path="/newcrm/campaignreportabtesting" exact component={CampaignReport} />
                    <UserRoute path="/newcrm/campaignreportpdfabtesting" exact component={CampaignReportPdfABTesting} />
                    <UserRoute path="/newcrm/buildbuilditforme" exact component={BuildBuildItForMe} />
                    <UserRoute path="/newcrm/googledriveoauthredirect" exact component={GoogleDriveOauthRedirect} />
                    <UserRoute path="/newcrm/managesmspolling" exact component={ManageSmsPolling} />
                    <UserRoute path="/newcrm/createsmspolling" exact component={CreateSmsPolling} />
                    <UserRoute path="/newcrm/managesocialmedia" exact component={ManageSocialMedia} />
                    <UserRoute path="/newcrm/createsocialmediapost" exact component={CreateNewPost} />
                    <Route path="/newcrm/viewtemplate" exact component={ViewTemplate} />
                    <Route path="/newcrm/viewinbrowser" exact component={ViewInBrowser} />
                    <UserRoute path="/newcrm/dropboxoauthredirect" exact component={DropBoxOauthRedirect} />
                    <UserRoute path="/newcrm/onedriveoauthredirect" exact component={OneDriveOauthRedirect} />
                    <UserRoute path="/newcrm/facebookoauthredirect" exact component={FaceBookOauthRedirect} />
                    <UserRoute path="/newcrm/twitteroauthredirect" exact component={TwitterOauthRedirect} />
                    <UserRoute path="/newcrm/linkedinoauthredirect" exact component={LinkedInOauthRedirect} />
                    <UserRoute path="/newcrm/googlecalendaroauthredirect" exact component={GoogleCalendarOauthRedirect} />
                    <UserRoute path="/newcrm/outlookcalendaroauthredirect" exact component={OutlookCalendarOauthRedirect} />
                    <UserRoute path="/newcrm/managesurvey" exact component={ManageSurvey} />
                    <UserRoute path="/newcrm/managesurveycategory" exact component={ManageSurveyCategory} />
                    <UserRoute path="/newcrm/createsurvey" exact component={CreateSurvey} />
                    <UserRoute path="/newcrm/buildautomation" exact component={BuildAutomation} />
                    <UserRoute path="/newcrm/manageautomation" exact component={ManageAutomation} />
                    <Route path="/newcrm/customform" exact component={DisplayForm} />
                    <Route path="/newcrm/survey" exact component={DisplaySurvey} />
                    <UserRoute path="/newcrm/surveyReport" exact component={SurveyReport} />
                    <UserRoute path="/newcrm/formreport" exact component={FormReport} />
                    <UserRoute path="/newcrm/addmysurveytemplates" exact component={AddMySurveyTemplates} />
                    <UserRoute path="/newcrm/manageassessmentcategory" exact component={ManageAssessmentCategory} />
                    <UserRoute path="/newcrm/addmyassessmenttemplates" exact component={AddMyAssessmentTemplates} />
                    <UserRoute path="/newcrm/manageassessment" exact component={ManageAssessment} />
                    <UserRoute path="/newcrm/assessmentReport" exact component={AssessmentReport} />
                    <UserRoute path="/newcrm/createassessment" exact component={CreateAssessment} />
                    <UserRoute path="/newcrm/mycalendarsettings" exact component={MyCalendarSettings} />
                    <UserRoute path="/newcrm/managesmsreport" exact component={ManageSmsReport} />
                    <UserRoute path="/newcrm/smsreport" exact component={SmsReport} />
                    <UserRoute path="/newcrm/smscampaignreportpdf" exact component={SmsCampaignReportPdf} />
                    <UserRoute path="/newcrm/managesocialmediareport" exact component={ManageSocialMediaReport} />
                    <UserRoute path="/newcrm/socialmediareport" exact component={SocialMediaReport} />
                    <UserRoute path="/newcrm/smspollingreport" exact component={SmsPollingReport} />
                    <UserRoute path="/newcrm/reportpdf" exact component={ReportPdf} />
                    <UserRoute path="/newcrm/reportcommentpdf" exact component={ReportCommentPdf} />
                    <UserRoute path="/newcrm/reporttextanswerpdf" exact component={ReportTextAnswerPdf} />
                    <UserRoute path="/newcrm/shopifyoauthredirect" exact component={ShopifyOauthRedirect} />
                    <UserRoute path="/newcrm/zoomoauthredirect" exact component={ZoomOauthRedirect} />
                    <Route path="/newcrm/assessment" exact component={DisplayAssessment} />
                    <Route path="/newcrm/appointment" exact component={Appointment} />
                    <Route path="/newcrm/linkclick" exact component={LinkClick} />
                    <Route path="/newcrm/optout" exact component={OptOut} />
                    <Route path="/newcrm/subscribelink" exact component={SubscribeLink} />
                    <UserRoute path="/newcrm/emailcampaignautomationreport" exact component={EmailCampaignAutomationReport} />
                    <UserRoute path="/newcrm/myanalytics" exact component={MyAnalytics} />
                    <UserRoute path="/newcrm/dashboardanalytics" exact component={MyAnalytics} />
                    <UserRoute path="/newcrm/usermonetisation" exact component={MyAnalytics} />
                    <UserRoute path="/newcrm/campaignmonetisation" exact component={MyAnalytics} />
                    <UserRoute path="/newcrm/affiliateprogram" exact component={AffiliateProgram} />
                    <Route path="/newcrm/temprecievecall" exact component={ReceiveCall} />
                    <UserRoute path="/newcrm/addclient" exact component={AddClient} />
                    <UserRoute path="/newcrm/addProject" exact component={AddProject} />
                    <Route path="/newcrm/**" component={PageNotFound} />
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
        user: state.user,
        subUser: state.subUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        SnackBar: (data) => {
            dispatch(setSnackBarAction(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)