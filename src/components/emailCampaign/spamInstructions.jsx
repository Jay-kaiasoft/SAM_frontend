import { Button } from "@mui/material";
import React from "react";
import { Col, Row } from "reactstrap";

const innerHeading = {
    fontSize: 18
}

const meta = "Make sure you DKIM ad SPF record are sent in your domain DNS servers.|Do not use purchased list.If the user has not given you the email address, they will flag your campaign and it will end up in junk. Ask for their permission before sending.|Watch what you say in your email campaign. Words associated with sales, if overused, they may trigger spam filter. There are keywords that you should avoid. We can check for know word that can increase your email chances of being flagged as Spam like free, buy, promo, prize, bonus, purchase, order, etc. Political based words can also increase the chances of being flagged as spam if overused.|Never shout at your subscriber using exclamation, question, dollar sign, etc. Example: “Buy Now!!”|Subject line should be clean without any shouting and know trigger words.|From email address matters so please avoid using obscure from field name like 4235sfad8@domain.com. Use from address that clear and trustworthy like “contact@”, “support@”, “feedback@”. Stick with a limited number of verified and recognized From field name.|Balance the image to text ratio. Too many images and not enough text will increase the chance of being flagged as Spam.|Avoid the following:<br><ul><li>Hashbusting: Inserting random characters in the subject line or content to fool spam filters, e.g. “F.ree. p.r!z.e”</li><li>Deceptive Subject Lines: Starting the subject line with “Re:” or “Fwd:” to suggest an ongoing communication with the sender.</li><li>tMisleading Claims: Subject line stating that the recipient has won a prize, while the copy lists conditions that must be met in order to claim it.</li><li>Image Text: Concealing a text message in an image to fool spam filters.</li></ul>";


const SpamInstructions = ({
    handleBack = () => { },
    handleDataChange = () => { },
    handleSpamCheck = () => { },
    handleNext = () => { }
}) => {
    return (
        <Row>
            <Col xs={10} sm={10} md={8} lg={6} xl={6} className="mx-auto">
                <p style={innerHeading}><strong>Avoid Spam/Junk Folder</strong></p>
                <ol>
                    {meta.split("|").map((it, index) => {
                        return (
                            <li key={index} style={{ fontSize: 15 }} className="mt-1"><p
                                dangerouslySetInnerHTML={{ __html: it }}
                            /></li>
                        )
                    })}
                </ol>
                <p style={{ fontSize: 15 }}>Would you like to check your Spam Flag Probability?</p>
                <div className="col-12 mt-3 mb-3" align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleBack(1)}
                    >
                        <i className="far fa-long-arrow-left mr-2"></i>BACK
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                            handleDataChange("isSpamCheckSkipped", false);
                            handleSpamCheck();
                            handleNext(1)
                        }}
                    >
                        <i className="far fa-check mr-2"></i>YES
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        className="ml-3"
                        onClick={() => {
                            handleDataChange("isSpamCheckSkipped", true)
                            handleNext(2)
                        }}
                    >
                        <i className="far fa-times mr-2"></i>NO
                    </Button>
                </div>
            </Col>
        </Row>
    )
}

export default SpamInstructions