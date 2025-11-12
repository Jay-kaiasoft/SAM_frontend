import React, {useCallback, useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import $ from 'jquery';
import {printInvoice} from "../../../services/profileService";
import {siteURL, websiteEmailAddress, websiteTitle} from "../../../config/api";
import { toCamelCase } from '../../../assets/commonFunctions';

const InvoicePdf = (props) => {
    const { user } =props;
    let params = useMemo(()=>{ return props.location.search ? props.location.search.replace("?","").split("&") : [];},[props.location.search]);
    let sendData = useMemo(() => {
        return  {"memberId":params[1].replace("d=",""),
        "invId":params[0].replace("v=","")}
    },[params]);
    const createPdf = useCallback((printInvoiceData) => {
        const documentDefinition = {
            content: [
                {
                    image: 'logo',
                    width: 100,
                    margin:[0,0,0,10],
                    style: {alignment:"center"}
                },
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [{border:[false,true,false,true],text: '6701 Koll Center Parkway #250, Pleasanton, California 94566 • PHONE: 415-906-4001 Ext 2', alignment:"center"}]
                        ]
                    }
                },
                {
                    table: {
                        widths: ['25%', '35%', '25%', '15%'],
                        body: [
                            [{text: 'Client Name :', bold: true, alignment:"right",margin:[0,5,0,0]}, {text: user.firstName+" "+user.lastName,margin:[0,5,0,0]}, {text: 'Client Id :', bold: true, alignment:"right",margin:[0,5,0,0]}, {text:user.memberId,margin:[0,5,0,0]}],
                            [{text: 'Company Name :', bold: true, alignment:"right"}, (typeof user.businessName === "undefined" || user.businessName === "" || user.businessName === null) ? "-" : user.businessName, {text: 'Invoice Date :', bold: true, alignment:"right"}, printInvoiceData.invoice.invDate],
                            [{text: 'Address :', bold: true, alignment:"right"}, toCamelCase(user.address), {text: 'Invoice No. :', bold: true, alignment:"right"}, printInvoiceData.invoice.invNo],
                            ['', toCamelCase(user.city+" "+user.state+" "+user.postCode), '', '']
                        ]
                    },
                    layout:"noBorders"
                },
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [{border:[false,false,false,true],text: '', alignment:"center"}]
                        ]
                    }
                }
            ],
            styles: {
                tableStyle: {
                    fontSize:9
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: 'black',
                    alignment: "center",
                    fillColor: "#cccccc"
                }
            },
            images: {
                logo: siteURL+'/img/logo.png'
            }
        };
        let totalMonthlyPaymentMplPlanEmailQty=0,totalPreviousUninvoicedTranTotalAmount=0,totalMonthlyPaymentInvMonthlyEmailAmount=0,totalEmailCampaignTranTotalMember=0,totalEmailCampaignTranTotalAmount=0,totalSurveyTranTotalMember=0,totalSurveyTranTotalAmount=0,totalAssessmentTranTotalMember=0,totalAssessmentTranTotalAmount=0,totalCustomFormTranTotalMember=0,totalCustomFormTranTotalAmount=0,totalSMSTranTotalMember=0,totalSMSTranTotalAmount=0,totalSMSPolliingNumberTranTotalAmount=0,totalSMSPollingTranTotalAmount=0,totalLanguageTranslationTranTotalMember=0,totalLanguageTranslationTranTotalAmount=0,totalSocialMediaPostingTranTotalMember=0,totalSocialMediaPostingTranTotalAmount=0,totalSMSConversationsTranTotalMember=0,totalSMSConversationsTranTotalAmount=0,totalCallingTranTotalMember=0,totalCallingTranTotalAmount=0,totalBuildItForMeTranTotalAmount=0,totalSmsCalendarAppointmentTranTotalAmount=0,totalShareAppointmentLinkTranTotalAmount=0,totalAdditionalContactsTranTotalAmount=0,totalTenDLCTranTotalAmount=0,totalWarmupTranTotalAmount=0,totalEmailVerificationTranTotalAmount=0,totalSmsCalendarReminderTranTotalAmount=0,totalAiImageChargesTranTotalAmount=0;
        let data = [];
        data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Plan Name', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
        data.push([{text:1,alignment: "center"},{text:printInvoiceData.invoice.invPlanName},{text:user.countryPriceSymbol+printInvoiceData.invoice.invPlanPrice.toFixed(2),alignment: "right"}]);
        data.push([{text: 'Sub Total', colSpan:2, alignment: "right"}, {}, {text: user.countryPriceSymbol+printInvoiceData.invoice.invPlanPrice.toFixed(2), alignment: "right"}]);
        documentDefinition.content.push(
            {text: 'Plan Details', style: 'subheader', margin:[0,10,0,0]},
            {
                style: 'tableStyle',
                table: {
                    widths: ['20%', '60%', '20%'],
                    body: data
                }
            }
        );
        if(printInvoiceData.previousUninvoiced.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.previousUninvoiced.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalPreviousUninvoicedTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalPreviousUninvoicedTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Previous Uninvoiced', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.invoice.invMonthlyYN === "Y") {
            let data = [];
            let count=1;
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Details', style: 'tableHeader'}, {text: 'Current Contacts', style: 'tableHeader'}, {text: 'Plan Contacts', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            if(printInvoiceData.invoiceMonthly.invMonthlyEmailAmount > 0){
                data.push([{text:count,alignment: "center"},{text:'Email Marketing'},{text:printInvoiceData.invoiceMonthly.invCurrentContacts,alignment: "right"},{text:printInvoiceData.monthlyPlanLogs.mplPlanEmailQty,alignment: "right"},{text:user.countryPriceSymbol+printInvoiceData.invoiceMonthly.invMonthlyEmailAmount.toFixed(2),alignment: "right"}]);
                totalMonthlyPaymentMplPlanEmailQty+=printInvoiceData.monthlyPlanLogs.mplPlanEmailQty;
                totalMonthlyPaymentInvMonthlyEmailAmount+=printInvoiceData.invoiceMonthly.invMonthlyEmailAmount;
                count++;
            }
            if(printInvoiceData.invoiceMonthly.invMonthlySmsAmount > 0){
                data.push([{text:count,alignment: "center"},{text:'SMS Marketing & SMS Polling'},{text:printInvoiceData.invoiceMonthly.invCurrentContacts,alignment: "right"},{text:printInvoiceData.monthlyPlanLogs.mplPlanSmsQty,alignment: "right"},{text:user.countryPriceSymbol+printInvoiceData.invoiceMonthly.invMonthlySmsAmount.toFixed(2),alignment: "right"}]);
                totalMonthlyPaymentMplPlanEmailQty+=printInvoiceData.monthlyPlanLogs.mplPlanSmsQty;
                totalMonthlyPaymentInvMonthlyEmailAmount+=printInvoiceData.invoiceMonthly.invMonthlySmsAmount;
                count++;
            }
            if(printInvoiceData.invoiceMonthly.invMonthlySurveyAmount > 0){
                data.push([{text:count,alignment: "center"},{text:'Surveys & Assessments'},{text:'',alignment: "right"},{text:'Unlimited',alignment: "right"},{text:user.countryPriceSymbol+printInvoiceData.invoiceMonthly.invMonthlySurveyAmount.toFixed(2),alignment: "right"}]);
                totalMonthlyPaymentInvMonthlyEmailAmount+=printInvoiceData.invoiceMonthly.invMonthlySurveyAmount;
                count++;
            }
            if(printInvoiceData.invoiceMonthly.invMonthlyIndividualAmount > 0){
                data.push([{text:count,alignment: "center"},{text:'Forms'},{text:'',alignment: "right"},{text:'Unlimited',alignment: "right"},{text:user.countryPriceSymbol+printInvoiceData.invoiceMonthly.invMonthlyIndividualAmount.toFixed(2),alignment: "right"}]);
                totalMonthlyPaymentInvMonthlyEmailAmount+=printInvoiceData.invoiceMonthly.invMonthlyIndividualAmount;
                count++;
            }
            if(printInvoiceData.monthlyPlanLogs.mplPlanSocialmediaQty > 0){
                data.push([{text:count,alignment: "center"},{text:'Social Media Posting'},{text:'',alignment: "right"},{text:'Unlimited',alignment: "right"},{text:user.countryPriceSymbol+printInvoiceData.invoiceMonthly.invMonthlySocialMediaAmount.toFixed(2),alignment: "right"}]);
                totalMonthlyPaymentInvMonthlyEmailAmount+=printInvoiceData.invoiceMonthly.invMonthlySocialMediaAmount;
            }
            data.push([{text: 'Sub Total', colSpan:3, alignment: "right"}, {}, {}, {text: totalMonthlyPaymentMplPlanEmailQty, alignment: "right"}, {text: user.countryPriceSymbol+totalMonthlyPaymentInvMonthlyEmailAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Monthly Payment', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '54%', '15%', '15%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.campaign.length > 0 && (printInvoiceData.invoice.invPlanName === "Free" || printInvoiceData.invoice.invPlanName === "Pay As You Go")) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Campaign Info', style: 'tableHeader'}, {text: 'Email Sent', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.campaign.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalEmailCampaignTranTotalMember+=value.tranTotalMember;
                    totalEmailCampaignTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalEmailCampaignTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalEmailCampaignTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Email Campaign', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.survey.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Survey Info', style: 'tableHeader'}, {text: 'Participants', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.survey.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSurveyTranTotalMember+=value.tranTotalMember;
                    totalSurveyTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalSurveyTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalSurveyTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Survey Campaign', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.assessment.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Assessment Info', style: 'tableHeader'}, {text: 'Participants', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.assessment.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalAssessmentTranTotalMember+=value.tranTotalMember;
                    totalAssessmentTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalAssessmentTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalAssessmentTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Assessment', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.customForm.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Individual Info', style: 'tableHeader'}, {text: 'Participants', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.customForm.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalCustomFormTranTotalMember+=value.tranTotalMember;
                    totalCustomFormTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalCustomFormTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalCustomFormTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Custom Form', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.sms.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'SMS/MMS Info', style: 'tableHeader'}, {text: 'SMS/MMS', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.sms.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSMSTranTotalMember+=value.tranTotalMember;
                    totalSMSTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalSMSTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalSMSTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS/MMS Campaign', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.smsPollingNumber.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.smsPollingNumber.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSMSPolliingNumberTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:3, alignment: "right"}, {}, {}, {text: user.countryPriceSymbol+totalSMSPolliingNumberTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS Polliing Number Purchased/Renewed', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '73%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.smsPolling.length > 0) {
            let data = [];
            data.push([{text: 'Item', style: 'tableHeader'}, {text: '', style: 'tableHeader'}, {text: '', style: 'tableHeader'}, {text: '', style: 'tableHeader'}, {text: 'Poll', style: 'tableHeader', colSpan:2}, {}, {text: 'Response', style: 'tableHeader', colSpan: 2}, {}, {text: 'Cost', style: 'tableHeader'}]);
            data.push([{text: '#', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Poll Name', style: 'tableHeader'}, {text: 'From Number', style: 'tableHeader'}, {text: 'Message', style: 'tableHeader'}, {text: 'Question', style: 'tableHeader'}, {text: 'Valid', style: 'tableHeader'}, {text: 'Invalid', style: 'tableHeader'}, {text: '', style: 'tableHeader'}]);
            printInvoiceData.smsPolling.map((value,index)=>{
                if(value.cost > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranCampaignName},{text:value.tranPollFormNo,alignment: "center"},{text:value.welcmsg,alignment: "center"},{text:value.pollQues,alignment: "center"},{text:value.respValid,alignment: "center"},{text:value.respInvalid,alignment: "center"},{text:user.countryPriceSymbol+value.cost.toFixed(2),alignment: "right"}]);
                    totalSMSPollingTranTotalAmount+=value.cost;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:8, alignment: "right"}, {}, {}, {}, {}, {}, {}, {}, {text: user.countryPriceSymbol+totalSMSPollingTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS Polling', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['5%', '12%', '28%', '16%', '9%', '9%', '7%', '7%', '7%'],
                        body: data
                    }
                },
                {text: '', margin:[0,10,0,0]},
                {
                    layout:"noBorders",
                    table: {
                        widths: ['17%', '83%'],
                            body: [
                            [{text:'Poll Message :',alignment: 'right', fontSize:10},{text: 'These are messages sent before poll start and after it finishes.', fontSize:10}],
                            [{text:'Poll Questions :',alignment: 'right', fontSize:10},{text: 'Number of SMS sent to ask questions in a poll.', fontSize:10}],
                            [{text:'Response Valid :',alignment: 'right', fontSize:10},{text: 'Number of SMS response to question that were valid.', fontSize:10}],
                            [{text:'Response Invalid :',alignment: 'right', fontSize:10},{text: 'Number of SMS response to question that were invalid.', fontSize:10}]
                        ]
                    }
                }
            );
        }
        if(printInvoiceData.languageTranslation.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Language Translation Info', style: 'tableHeader'}, {text: 'Translation', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.languageTranslation.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalLanguageTranslationTranTotalMember+=value.tranTotalMember;
                    totalLanguageTranslationTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalLanguageTranslationTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalLanguageTranslationTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Language Translation', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.socialMediaPosting.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Posting Info', style: 'tableHeader'}, {text: 'Post', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.socialMediaPosting.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSocialMediaPostingTranTotalMember+=value.tranTotalMember;
                    totalSocialMediaPostingTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalSocialMediaPostingTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalSocialMediaPostingTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Social Media Posting', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.smsConversations.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'SMS Info', style: 'tableHeader'}, {text: 'SMS', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.smsConversations.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSMSConversationsTranTotalMember+=value.tranTotalMember;
                    totalSMSConversationsTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalSMSConversationsTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalSMSConversationsTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS Conversations', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.calling.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Calling Info', style: 'tableHeader'}, {text: 'Calling', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.calling.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:value.tranTotalMember,alignment: "right"},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalCallingTranTotalMember+=value.tranTotalMember;
                    totalCallingTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: totalCallingTranTotalMember, alignment: "right"}, {text: user.countryPriceSymbol+totalCallingTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Calling', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '49%', '11%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.buildItForMe.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.buildItForMe.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalBuildItForMeTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalBuildItForMeTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Build It For Me', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.smsCalendarAppointment.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.smsCalendarAppointment.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSmsCalendarAppointmentTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalSmsCalendarAppointmentTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS Calendar Appointment', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.shareAppointmentLink.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.shareAppointmentLink.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalShareAppointmentLinkTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalShareAppointmentLinkTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Share Appointment Link', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.additionalContacts.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.additionalContacts.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalAdditionalContactsTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalAdditionalContactsTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Additional Contacts', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.tenDLC.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.tenDLC.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalTenDLCTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalTenDLCTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: '10DLC Process Charges', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.warmup.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.warmup.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalWarmupTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalWarmupTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Domain Warmup Service', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.emailVerification.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.emailVerification.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalEmailVerificationTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalEmailVerificationTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Group Contact Verification Charges', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.smsCalendarReminder.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.smsCalendarReminder.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalSmsCalendarReminderTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalSmsCalendarReminderTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'SMS Calendar Reminder', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.ai.length > 0) {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Date', style: 'tableHeader'}, {text: 'Transaction Id', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            printInvoiceData.ai.map((value,index)=>{
                if(value.tranTotalAmount > 0){
                    data.push([{text:index+1,alignment: "center"},{text:value.tranCampaignDate,alignment: "center"},{text:value.tranId,alignment: "center"},{text:value.tranCampaignName},{text:user.countryPriceSymbol+value.tranTotalAmount.toFixed(2),alignment: "right"}]);
                    totalAiImageChargesTranTotalAmount+=value.tranTotalAmount;
                }
                return "";
            });
            data.push([{text: 'Sub Total', colSpan:4, alignment: "right"}, {}, {}, {}, {text: user.countryPriceSymbol+totalAiImageChargesTranTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'AI Image Charges', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['6%', '11%', '13%', '60%', '10%'],
                        body: data
                    }
                }
            );
        }
        if(printInvoiceData.invoice.invPlanName === "Pay as You Grow") {
            let data = [];
            data.push([{text: 'Item #', style: 'tableHeader'}, {text: 'Info', style: 'tableHeader'}, {text: 'Contact', style: 'tableHeader'}, {text: 'Total Cost', style: 'tableHeader'}]);
            data.push([{text:1,alignment: "center"},{text:"Contacts",alignment: "left"},{text:printInvoiceData.invoice.invCurrentContacts,alignment: "center"},{text:user.countryPriceSymbol+printInvoiceData.invoice.invTotalAmount.toFixed(2),alignment: "right"}]);
            data.push([{text: 'Sub Total', colSpan:3, alignment: "right"}, {}, {}, {text: user.countryPriceSymbol+printInvoiceData.invoice.invTotalAmount.toFixed(2), alignment: "right"}]);
            documentDefinition.content.push(
                {text: 'Current Contacts', style: 'subheader', margin:[0,10,0,0]},
                {
                    style: 'tableStyle',
                    table: {
                        widths: ['10%','60%', '20%', '10%'],
                        body: data
                    }
                }
            );
        }

        let summaryData = [];
        let totalSummarySubTotal=0,totalSummaryTotalDue=0;
        summaryData.push([{text: 'Summary', colSpan:2, style: 'tableHeader'}, {}]);
        if(printInvoiceData.invoice.invPlanPrice > 0){
            summaryData.push([{text: 'Plan Details', alignment: 'right'}, {text:user.countryPriceSymbol+printInvoiceData.invoice.invPlanPrice.toFixed(2),alignment: 'right'}]);
        }
        totalSummarySubTotal+=printInvoiceData.invoice.invPlanPrice;
        if(printInvoiceData.invoice.invPlanName === "Pay as You Grow") {
            totalSummarySubTotal+=printInvoiceData.invoice.invTotalAmount;
        }
        if(totalMonthlyPaymentInvMonthlyEmailAmount>0){
            summaryData.push([{text: 'Monthly Payment', alignment: 'right'}, {text:user.countryPriceSymbol+totalMonthlyPaymentInvMonthlyEmailAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalMonthlyPaymentInvMonthlyEmailAmount;
        }
        if(totalPreviousUninvoicedTranTotalAmount>0){
            summaryData.push([{text: 'Previous Uninvoiced', alignment: 'right'}, {text:user.countryPriceSymbol+totalPreviousUninvoicedTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalPreviousUninvoicedTranTotalAmount;
        }
        if(totalEmailCampaignTranTotalAmount>0){
            summaryData.push([{text: 'Email Campaign', alignment: 'right'}, {text:user.countryPriceSymbol+totalEmailCampaignTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalEmailCampaignTranTotalAmount;
        }
        if(totalSurveyTranTotalAmount>0){
            summaryData.push([{text: 'Survey Campaign', alignment: 'right'}, {text:user.countryPriceSymbol+totalSurveyTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSurveyTranTotalAmount;
        }
        if(totalAssessmentTranTotalAmount>0){
            summaryData.push([{text: 'Assessment', alignment: 'right'}, {text:user.countryPriceSymbol+totalAssessmentTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalAssessmentTranTotalAmount;
        }
        if(totalCustomFormTranTotalAmount>0){
            summaryData.push([{text: 'Custom Form', alignment: 'right'}, {text:user.countryPriceSymbol+totalCustomFormTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalCustomFormTranTotalAmount;
        }
        if(totalSMSTranTotalAmount>0){
            summaryData.push([{text: 'SMS/MMS Campaign', alignment: 'right'}, {text:user.countryPriceSymbol+totalSMSTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSMSTranTotalAmount;
        }
        if(totalSMSPolliingNumberTranTotalAmount>0){
            summaryData.push([{text: 'SMS Polliing Number Purchased/Renewed', alignment: 'right'}, {text:user.countryPriceSymbol+totalSMSPolliingNumberTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSMSPolliingNumberTranTotalAmount;
        }
        if(totalSMSPollingTranTotalAmount>0){
            summaryData.push([{text: 'SMS Polliing', alignment: 'right'}, {text:user.countryPriceSymbol+totalSMSPollingTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSMSPollingTranTotalAmount;
        }
        if(totalLanguageTranslationTranTotalAmount>0){
            summaryData.push([{text: 'Language Translation', alignment: 'right'}, {text:user.countryPriceSymbol+totalLanguageTranslationTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalLanguageTranslationTranTotalAmount;
        }
        if(totalSocialMediaPostingTranTotalAmount>0){
            summaryData.push([{text: 'Social Media Posting', alignment: 'right'}, {text:user.countryPriceSymbol+totalSocialMediaPostingTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSocialMediaPostingTranTotalAmount;
        }
        if(totalSMSConversationsTranTotalAmount>0){
            summaryData.push([{text: 'SMS Conversations', alignment: 'right'}, {text:user.countryPriceSymbol+totalSMSConversationsTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSMSConversationsTranTotalAmount;
        }
        if(totalCallingTranTotalAmount>0){
            summaryData.push([{text: 'Calling', alignment: 'right'}, {text:user.countryPriceSymbol+totalCallingTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalCallingTranTotalAmount;
        }
        if(totalBuildItForMeTranTotalAmount>0){
            summaryData.push([{text: 'Build It For Me', alignment: 'right'}, {text:user.countryPriceSymbol+totalBuildItForMeTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalBuildItForMeTranTotalAmount;
        }
        if(totalSmsCalendarAppointmentTranTotalAmount>0){
            summaryData.push([{text: 'SMS Calendar Appointment', alignment: 'right'}, {text:user.countryPriceSymbol+totalSmsCalendarAppointmentTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSmsCalendarAppointmentTranTotalAmount;
        }
        if(totalShareAppointmentLinkTranTotalAmount>0){
            summaryData.push([{text: 'Share Appointment Link', alignment: 'right'}, {text:user.countryPriceSymbol+totalShareAppointmentLinkTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalShareAppointmentLinkTranTotalAmount;
        }
        if(totalAdditionalContactsTranTotalAmount>0){
            summaryData.push([{text: 'Additional Contacts', alignment: 'right'}, {text:user.countryPriceSymbol+totalAdditionalContactsTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalAdditionalContactsTranTotalAmount;
        }
        if(totalTenDLCTranTotalAmount>0){
            summaryData.push([{text: '10DLC Process Charges', alignment: 'right'}, {text:user.countryPriceSymbol+totalTenDLCTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalTenDLCTranTotalAmount;
        }
        if(totalWarmupTranTotalAmount>0){
            summaryData.push([{text: 'Domain Warmup Service', alignment: 'right'}, {text:user.countryPriceSymbol+totalWarmupTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalWarmupTranTotalAmount;
        }
        if(totalEmailVerificationTranTotalAmount>0){
            summaryData.push([{text: 'Group Contact Verification Charges', alignment: 'right'}, {text:user.countryPriceSymbol+totalEmailVerificationTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalEmailVerificationTranTotalAmount;
        }
        if(totalSmsCalendarReminderTranTotalAmount>0){
            summaryData.push([{text: 'SMS Calendar Reminder', alignment: 'right'}, {text:user.countryPriceSymbol+totalSmsCalendarReminderTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalSmsCalendarReminderTranTotalAmount;
        }
        if(totalAiImageChargesTranTotalAmount>0){
            summaryData.push([{text: 'AI Image Charges', alignment: 'right'}, {text:user.countryPriceSymbol+totalAiImageChargesTranTotalAmount.toFixed(2),alignment: 'right'}]);
            totalSummarySubTotal+=totalAiImageChargesTranTotalAmount;
        }
        summaryData.push([{text: 'Sub Total', alignment: 'right'}, {text:user.countryPriceSymbol+totalSummarySubTotal.toFixed(2),alignment: 'right'}]);
        totalSummaryTotalDue+=totalSummarySubTotal;
        summaryData.push([{text: 'Total Due', alignment: 'right', fontSize:12, bold: true}, {text:user.countryPriceSymbol+totalSummaryTotalDue.toFixed(2),alignment: 'right'}]);
        documentDefinition.content.push(
            {text: '', margin:[0,20,0,0]},
            {
                style: 'tableStyle',
                table: {
                    widths: ['85%', '15%'],
                    body: summaryData
                }
            },
            {text: '', margin:[0,20,0,0]},
            {
                layout:"noBorders",
                table: {
                    widths: ['25%', '75%'],
                    body: [
                        [{text:'Credit Card Transaction ID :',alignment: 'right', fontSize:10},{text: printInvoiceData.invoice.invTransationId, fontSize:10}],
                        [{text:'Credit Card Charged :',alignment: 'right', fontSize:10},{text: user.countryPriceSymbol+printInvoiceData.invoice.invTotalAmount.toFixed(2), fontSize:10}],
                        [{text:'Credit Card :',alignment: 'right', fontSize:10},{text: printInvoiceData.invoice.invPayCardNo, fontSize:10}]
                    ]
                }
            },
            {text: `Thank you for using ${websiteTitle} for your marketing! If you have any question or concerns, please contacts us at ${websiteEmailAddress} or call 1-415-906-4001 ext 2.`, fontSize:10, margin:[0,20,0,0]},
        );
        pdfMake.vfs = pdfFonts.vfs;
        pdfMake.createPdf(documentDefinition).download(`invoice-${printInvoiceData.invoice.invNo}.pdf`);
        setTimeout(function (){
            window.close();
        },1000);
    },[user]);
    useEffect(()=>{
        $( document ).ready(function() {
            printInvoice(sendData).then(res => {
                if (res.result) {
                    createPdf(res.result);
                }
            });
        });
    },[sendData,createPdf]);
    return (
        <div id="convertPdf">
            <table border={"0"} style={{border:"0"}}>
                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user: state.user
    }
}
export default connect(mapStateToProps,null)(InvoicePdf);