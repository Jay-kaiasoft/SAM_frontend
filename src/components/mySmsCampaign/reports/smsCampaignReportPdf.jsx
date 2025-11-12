import React, {useCallback, useEffect, useMemo} from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {siteURL} from "../../../config/api";
import {setGlobalAlertAction} from "../../../actions/globalAlertActions";
import {connect} from "react-redux";
import {getSmsCampaignsReportDataForPdf} from "../../../services/smsCampaignService";
import {dateTimeFormat, easUrlEncoder} from "../../../assets/commonFunctions";

const documentDefinition = {
    content: [
        {
            image: 'logo',
            width: 68,
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
    ],
    styles: {
        tableStyle: {
            fontSize:9,
            alignment:"center"
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
const SmsCampaignReportPdf = ({location,globalAlert})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const smsId = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const csId = (typeof queryString.get("y") !== "undefined" && queryString.get("y") !== "" && queryString.get("y") !== null) ? queryString.get("y") : "";
    const createPdf = useCallback(()=>{
        pdfMake.vfs = pdfFonts.vfs;
        pdfMake.createPdf(documentDefinition).download(`smscampaignreport.pdf`);
        setTimeout(function (){
            window.close();
        },1000);
    }, []);
    const executePrint = useCallback((data,canvasData) => {
        documentDefinition.content.push({
            image: canvasData,
            style: {alignment:"center"},
            fit: [500, 300],
            margin: [0, 10, 0, 10]
        });
        if(data.smsDeliveriesData.length > 0 || data.mmsDeliveriesData.length > 0) {
            documentDefinition.content.push({
                text: "Deliveries",
                margin: [0, 0, 0, 15],
            });
            if (data.smsDeliveriesData.length > 0) {
                documentDefinition.content.push({
                    text: "SMS",
                    margin: [0, 0, 0, 15],
                });
                let temp = data.smsDeliveriesData.map((val, i) => (
                    [
                        {text: i + 1},
                        {text: val.firstName},
                        {text: val.lastName},
                        {text: val.contact},
                        {text: dateTimeFormat(val.date)},
                    ]
                ));
                let header = [
                    {text: 'No', style: 'tableHeader'},
                    {text: 'First Name', style: 'tableHeader'},
                    {text: 'Last Name', style: 'tableHeader'},
                    {text: 'Contact', style: 'tableHeader'},
                    {text: 'Date', style: 'tableHeader'},
                ]
                documentDefinition.content.push({
                    table: {
                        widths: ['5%', '25%', '25%', '20%', '25%'],
                        body: [header, ...temp],
                    },
                    margin: [0, 0, 0, 15],
                    style: 'tableStyle',
                });
            }
            if (data.mmsDeliveriesData.length > 0) {
                documentDefinition.content.push({
                    text: "MMS",
                    margin: [0, 0, 0, 15],
                });
                let header = [
                    {text: 'No', style: 'tableHeader'},
                    {text: 'First Name', style: 'tableHeader'},
                    {text: 'Last Name', style: 'tableHeader'},
                    {text: 'Contact', style: 'tableHeader'},
                    {text: 'Date', style: 'tableHeader'},
                ]
                let temp = data.mmsDeliveriesData.map((val, i) => (
                    [
                        {text: i + 1},
                        {text: val.firstName},
                        {text: val.lastName},
                        {text: val.contact},
                        {text: dateTimeFormat(val.date)},
                    ]
                ));
                documentDefinition.content.push({
                    table: {
                        widths: ['5%', '25%', '25%', '20%', '25%'],
                        body: [header, ...temp],
                    },
                    margin: [0, 0, 0, 15],
                    style: 'tableStyle'
                });
            }
        }
        if(data.unDeliveredSmsData.length > 0) {
            documentDefinition.content.push({
                text: "Undelivered",
                margin: [0, 0, 0, 15],
            });
            let temp  = data.unDeliveredSmsData.map((val, i)=>(
                [
                    {text: i+1},
                    {text: val.firstName},
                    {text: val.lastName},
                    {text: val.contact},
                    {text: dateTimeFormat(val.date)},
                ]
            ));
            let header = [
                {text: 'No', style: 'tableHeader'},
                {text: 'First Name', style: 'tableHeader'},
                {text: 'Last Name', style: 'tableHeader'},
                {text: 'Contact', style: 'tableHeader'},
                {text: 'Date', style: 'tableHeader'},
            ]
            documentDefinition.content.push({
                table: {
                    widths: ['5%', '25%', '25%', '20%', '25%'],
                    body: [header, ...temp],
                },
                margin: [0, 0, 0, 15],
                style: 'tableStyle'
            });
        }
        if(data.notSentSmsData.length > 0) {
            documentDefinition.content.push({
                text: "Not Send",
                margin: [0, 0, 0, 15],
            });
            let temp  = data.notSentSmsData.map((val, i)=>(
                [
                    {text: i+1},
                    {text: val.firstName},
                    {text: val.lastName},
                    {text: val.contact},
                    {text: dateTimeFormat(val.date)},
                ]
            ));
            let header = [
                {text: 'No', style: 'tableHeader'},
                {text: 'First Name', style: 'tableHeader'},
                {text: 'Last Name', style: 'tableHeader'},
                {text: 'Contact', style: 'tableHeader'},
                {text: 'Date', style: 'tableHeader'},
            ]
            documentDefinition.content.push({
                table: {
                    widths: ['5%', '25%', '25%', '20%', '25%'],
                    body: [header, ...temp],
                },
                margin: [0, 0, 0, 15],
                style: 'tableStyle'
            });
        }
        if(data.linksData.length > 0) {
            documentDefinition.content.push({
                text: "Links",
                margin: [0, 0, 0, 15],
            });
            let header = [
                {text: 'No', style: 'tableHeader'},
                {text: 'Link Name', style: 'tableHeader'},
                {text: 'Main Link', style: 'tableHeader'},
                {text: 'Link Click', style: 'tableHeader'},
            ]
            let temp  = data.linksData.map((val, i)=>(
                [
                    {text: i+1},
                    {text: val.linkName},
                    {text: val.mainLink},
                    {text: val.linkCount},
                ]
            ));
            documentDefinition.content.push({
                table: {
                    widths: ['5%', '25%', '62%', '8%'],
                    body: [header, ...temp],
                },
                margin: [0, 0, 0, 15],
                style: 'tableStyle'
            });
        }
        if(data.unsubscribedData.length > 0) {
            documentDefinition.content.push({
                text: "Unsubscribed",
                margin: [0, 0, 0, 15],
            });
            let temp  = data.unsubscribedData.map((val, i)=>(
                [
                    {text: i+1},
                    {text: val.firstName},
                    {text: val.lastName},
                    {text: val.contact},
                    {text: dateTimeFormat(val.date)},
                ]
            ));
            let header = [
                {text: 'No', style: 'tableHeader'},
                {text: 'First Name', style: 'tableHeader'},
                {text: 'Last Name', style: 'tableHeader'},
                {text: 'Contact', style: 'tableHeader'},
                {text: 'Date', style: 'tableHeader'},
            ]
            documentDefinition.content.push({
                table: {
                    widths: ['5%', '25%', '25%', '20%', '25%'],
                    body: [header, ...temp],
                },
                margin: [0, 0, 0, 15],
                style: 'tableStyle'
            });
        }
        if(data.repliesSms.length > 0) {
            documentDefinition.content.push({
                text: "SMS Replies",
                margin: [0, 0, 0, 15],
            });
            let temp  = data.repliesSms.map((val, i)=>(
                [
                    {text: i+1},
                    {text: val.firstName},
                    {text: val.lastName},
                    {text: val.contact},
                    {text: dateTimeFormat(val.date)},
                    {text: val.details},
                ]
            ));
            let header = [
                {text: 'No', style: 'tableHeader'},
                {text: 'First Name', style: 'tableHeader'},
                {text: 'Last Name', style: 'tableHeader'},
                {text: 'Contact', style: 'tableHeader'},
                {text: 'Date', style: 'tableHeader'},
                {text: 'Details', style: 'tableHeader'},
            ]
            documentDefinition.content.push({
                table: {
                    widths: ['5%', '20%', '20%', '15%', '20%','20%'],
                    body: [header, ...temp],
                },
                margin: [0, 0, 0, 15],
                style: 'tableStyle'
            });
        }
        createPdf();
    }, [createPdf])
    useEffect(()=>{
        let requestData = `csId=${csId}&smsId=${smsId}`;
        getSmsCampaignsReportDataForPdf(requestData).then(res => {
            if(res.status === 200){
                if (res.result) {
                    executePrint(res?.result,sessionStorage.getItem("canvasData"));
                    sessionStorage.removeItem("canvasData");
                }
            } else {
                globalAlert({
                    type: "Error",
                    text: res.message,
                    open: true
                });
            }
        });
    },[csId, smsId, globalAlert, executePrint]);
    return (
        <div></div>
    );
}
const mapDispatchToProps = dispatch => {
    return {
        globalAlert: (data) => {
            dispatch(setGlobalAlertAction(data))
        }
    }
}
export default connect(null, mapDispatchToProps)(SmsCampaignReportPdf);