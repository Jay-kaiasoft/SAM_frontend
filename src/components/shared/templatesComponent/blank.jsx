import React from "react";

const Blank = ({content}) => {
    return (
        <>
            <style>{`#templateBody { background-color: #FFFFFF; border: 0px none #FFFFFF; } #templateFooter { background-color: #FFFFFF; border-top: 0; border-bottom: 0; } @media only screen and (max-width: 480px) { body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: none !important; } body { width: 100% !important; min-width: 100% !important; } td[id=bodyCell] { padding: 10px !important; } table[class=mcpreview-image-uploader] { width: 100% !important; display: none !important; } img[class=mcnImage] { width: 100% !important; } h1 { font-size: 24px !important; line-height: 125% !important; } h2 { font-size: 20px !important; line-height: 125% !important; } h3 { font-size: 18px !important; line-height: 125% !important; } h4 { font-size: 16px !important; line-height: 125% !important; } } @media only screen and (max-width: 600px) { table.textblockTBlock, table.textTBlock, table.imageTBlock, td.imageTdBlock, table.imageGroupTBlock, table.ImagelistContentTBlock, table.ImageCardAndCaptionTBlock, table.ecomTBlock, #cntr, .tpl-block, table.listTBlock, td.listTdBlock, #templateBody { width: 100% !important; max-width: 100% !important; } img.mcnImage, img.ecomimg { width: 100% !important; height: auto !important; max-width: 100% !important; } } @-moz-document url-prefix(http), url-prefix(file) { img: -moz-broken { -moz-force-broken-image-icon: 1; width: 24px; height: 24px; } } i.fa { background-image: none; } .marker { background-color: Yellow; } .w-100{ width: 100% !important; }`}</style>
            <div className="mcd np" style={{padding: "20px 0px"}} item-value="0">
                <center id="cntr" style={{boxShadow: "1px 1px 10px #555",padding: "1px 0"}}>
                    <table id="templateBody" border="0" cellPadding="0" cellSpacing="0" width="580" style={{margin: "10px",backgroundColor:"#ffffff"}} item-value="0">
                        <tbody>
                            <tr>
                                <td className="bodyContainer tpl-container droppableTarget ui-droppable" valign="top">
                                    <div className="mojoMcContainerEmptyMessage">
                                        Drop Content Blocks Here
                                    </div>
                                    {content}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            </div>
        </>
    );
}

export default Blank;