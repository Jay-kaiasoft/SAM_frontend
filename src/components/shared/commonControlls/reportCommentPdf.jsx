import React, {useCallback, useEffect} from 'react';
import {connect} from "react-redux";
import {siteURL, websiteTitle} from "../../../config/api";
import pdfMake from "pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
const documentDefinition = {
    content: [],
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
        },
        tableHeaderLeft: {
            bold: true,
            fontSize: 9,
            color: 'black',
            alignment: "left",
            fillColor: "#cccccc"
        },
        stackStyle: {
            border: "1px solid #cccccc"
        }
    },
    images: {
        logo: siteURL+'/img/logo.png'
    }
};
const ReportCommentPdf = ({user}) => {
    const createPdf = useCallback((reportType)=>{
        pdfMake.vfs = pdfFonts.vfs;
        pdfMake.createPdf(documentDefinition).download(`${reportType}CommentReport.pdf`);
        setTimeout(function (){
            window.close();
        },3000);
    }, []);
    const executePrint = useCallback((commentData) => {
        if(typeof user.imageUrl !== "undefined" && user.imageUrl !== null && user.imageUrl !== ""){
            documentDefinition.images={
                ...documentDefinition.images,
                userLogo: siteURL+'/usercontent/'+user.memberId+'/images/profilepic/profilepic.png'
            };
            documentDefinition.content.push({
                image: 'userLogo',
                fit: [25, 25],
                margin:[0,0,0,10],
                style: {alignment:"center"}
            });
        } else {
            documentDefinition.content.push({ text: `${user.firstName} ${user.lastName}`, style: {alignment: "center"}});
        }
        let address="";
        if(typeof user.streetAddress !== "undefined" && user.streetAddress !== null && user.streetAddress !== ""){
            address+=`${user.streetAddress}, `;
        }
        if(typeof user.address !== "undefined" && user.address !== null && user.address !== ""){
            address+=`${user.address}, `;
        }
        if(typeof user.city !== "undefined" && user.city !== null && user.city !== ""){
            address+=`${user.city}, `;
        }
        if(typeof user.state !== "undefined" && user.state !== null && user.state !== ""){
            if(typeof user.postCode !== "undefined" && user.postCode !== null && user.postCode !== ""){
                address+=`${user.state} ${user.postCode}`;
            } else {
                address+=`${user.state}`;
            }
        }
        if(address !== ""){
            documentDefinition.content.push(
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [{border:[false,true,false,true],text: address, alignment:"center", fontSize:7}]
                        ]
                    }
                }
            );
        }
        documentDefinition.content.push(
            {text: `${commentData.reportType} : ${commentData.name}`, fontSize:10, margin:[0,10,0,0]},
            {text: `Question : ${commentData.question}`, fontSize:10, margin:[0,10,0,0]},
            {text: `Option : ${commentData.optionVal}`, fontSize:10, margin:[0,10,0,0]},
        );
        let data = [];
        data.push([{text: 'No.', style: 'tableHeader'}, {text: 'Comment', style: 'tableHeaderLeft'}]);
        if(commentData.comments.length > 0){
            commentData.comments.forEach((value, index)=>(
                data.push([{text:index+1,alignment: "center"},{text:value,alignment: "left"}])
            ))
        } else {
            data.push([{text: 'No comment found', colSpan:2, alignment: "center"}, {}]);
        }
        documentDefinition.content.push(
            {text: '', margin:[0,20,0,0]},
            {
                style: 'tableStyle',
                table: {
                    widths: ['10%', '90%'],
                    body: data
                }
            }
        );
        documentDefinition.content.push(
            {
                image: 'logo',
                width: 68,
                margin:[0,20,0,10],
                style: {alignment:"center"}
            },
            {
                table: {
                    widths: ['100%'],
                    body: [
                        [{border:[false,true,false,true],text: `Brought To You by ${websiteTitle}`, alignment:"center", fontSize:7}]
                    ]
                }
            }
        );
        createPdf(commentData.reportType);
    }, [createPdf,user]);
    useEffect(()=>{
        executePrint(JSON.parse(sessionStorage.getItem("commentData")));
        sessionStorage.removeItem("commentData");
    },[executePrint]);
    return (
        <div></div>
    );
}
const mapStateToProps = (state) => { //store.getState()
    return {
        user:state.user
    }
}
export default connect(mapStateToProps, null)(ReportCommentPdf);