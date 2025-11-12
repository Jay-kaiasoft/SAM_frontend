import React, {useCallback, useEffect, useMemo} from 'react';
import {connect} from "react-redux";
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {siteURL} from "../../../../config/api";
import {getCampaignsReportPrint} from "../../../../services/emailCampaignService";
import {setGlobalAlertAction} from "../../../../actions/globalAlertActions";
import {dateTimeFormat, easUrlEncoder} from "../../../../assets/commonFunctions";

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
const CampaignReportPdf = ({location,globalAlert})=>{
    const queryString = useMemo(() => { return new URLSearchParams(easUrlEncoder(location.search)) }, [location.search]);
    const id = (typeof queryString.get("v") !== "undefined" && queryString.get("v") !== "" && queryString.get("v") !== null) ? queryString.get("v") : 0;
    const campId = (typeof queryString.get("y") !== "undefined" && queryString.get("y") !== "" && queryString.get("y") !== null) ? queryString.get("y") : "";
    const createPdf = useCallback(()=>{
        pdfMake.vfs = pdfFonts.vfs;
        pdfMake.createPdf(documentDefinition).download(`emailcampaignreport.pdf`);
        setTimeout(function (){
            window.close();
        },1000);
    }, []);
    const executePrint = useCallback((data,canvasData) => {
        let tableBody = [];
        documentDefinition.content.push({
            image: canvasData,
            style: {alignment:"center"},
            fit: [500, 700],
            margin: [0, 20, 0, 20],
            pageBreak: 'after'
        });
        documentDefinition.content.push({
            text: "Product Links",
            margin: [0, 0, 0, 15],
        });
        let tableHeader = [
            {text: "No", style: 'tableHeader'},
            {text: "Link Name", style: 'tableHeader'},
            {text: "Unique Links", style: 'tableHeader'},
            {text: "Total Clicks", style: 'tableHeader'},
            {text: "Click Through Rate(CTR)", style: 'tableHeader'},
        ];
        let temp=[];
        if(data.productLinks.length > 0){
            temp = data.productLinks.map((value, i)=>(
                [
                    {text: i+1},
                    {text: value.campLink, alignment: "left"},
                    {text: value.uniqueClicks},
                    {text: value.totalClicks},
                    {text: value.clickThroughRate.toFixed(2)+"%"},
                ]
            ));
            tableBody = [tableHeader, ...temp];
        } else {
            temp = [{text: "No Data Found.", colSpan: 5},{},{},{},{}];
            tableBody = [tableHeader, temp];
        }
        documentDefinition.content.push({
            table: {
                widths: ['5%', '50%', '15%', '15%', '15%'],
                body: tableBody,
            },
            style: 'tableStyle',
            pageBreak: 'after'
        });
        documentDefinition.content.push({
            text: "Members",
            margin: [0, 0, 0, 15],
        });
        tableHeader = [
            {text: "No", style: 'tableHeader'},
            {text: "First Name", style: 'tableHeader'},
            {text: "Last Name", style: 'tableHeader'},
            {text: "Email", style: 'tableHeader'},
            {text: "Total Open", style: 'tableHeader'},
            {text: "Unsubscribe Date", style: 'tableHeader'},
        ];
        if(data.members.length > 0){
            temp = data.members.map((value, i)=>([
                {text: i+1},
                {text: value.firstName},
                {text: value.lastName},
                {text: value.email},
                {text: value.totalOpen},
                {text: value.unsubscribeDate === "" ? "-" : dateTimeFormat(value.unsubscribeDate)}
            ]));
            tableBody = [tableHeader, ...temp];
        } else {
            temp = [{text: "No Data Found.", colSpan: 6},{},{},{},{},{}];
            tableBody = [tableHeader, temp];
        }
        documentDefinition.content.push({
            table: {
                widths: ['5%', '20%', '20%', '25%', '5%', '25%'],
                body: tableBody,
            },
            style: 'tableStyle',
            pageBreak: 'after'
        });
        documentDefinition.content.push({
            text: "Sources",
            margin: [0, 0, 0, 15],
        });
        tableHeader = [
            {text: "No", style: 'tableHeader'},
            {text: "Link Name", style: 'tableHeader'},
            {text: "PC", style: 'tableHeader'},
            {text: "Mobile", style: 'tableHeader'},
        ];
        if(data.sourceLinks.length > 0){
            temp = data.sourceLinks.map((value, i)=>([
                {text: i+1},
                {text: value.campLink, alignment: "left"},
                {text: value.pc},
                {text: value.mobile},
            ]))
            tableBody = [tableHeader, ...temp];
        } else {
            temp = [{text: "No Data Found.", colSpan: 4},{},{},{}];
            tableBody = [tableHeader, temp];
        }
        documentDefinition.content.push({
            table: {
                widths: ['5%', '45%', '25%', '25%'],
                body: tableBody,
            },
            style: 'tableStyle',
        });
        createPdf();
    },[createPdf]);
    useEffect(()=>{
        const requestData = `campId=${campId}&id=${id}`;
        getCampaignsReportPrint(requestData).then(res => {
            if (res?.status === 200) {
                executePrint(res?.result,sessionStorage.getItem("canvasData"));
                sessionStorage.removeItem("canvasData");
            } else {
                globalAlert({
                    type: "Error",
                    text: res?.message,
                    open: true
                });
            }
        });
    }, [id,campId,globalAlert,executePrint]);
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
export default connect(null, mapDispatchToProps)(CampaignReportPdf);