import { useEffect, useState } from "react";

const MessagePreview = ({ text, convertTinyUrlYN }) => {
    const [textMessage, setTextMessage] = useState(text);
    useEffect(() => {
        let t = text;
        let y = text.match(/^(https?:\/\/)?([\w]{2,}\.)?[\w]{2,256}(\.[\w]{2,6})+(\b([-a-zA-Z0-9@:%_+.~#?&//=]*))+/gm);
        if (y != null && convertTinyUrlYN === "Y") {
            y.forEach((element) => {
                t = t.replace(element, "https://tinyeas.us/xxxxxxxx");
            });
            setTextMessage(t);
        }
        else {
            setTextMessage(t);
        }
    }, [text, convertTinyUrlYN]);
    return (
        <div className="smsPreviewMobile" style={{ padding: (text.length === 0) ? 0 : 5 }} dangerouslySetInnerHTML={{ __html: `${textMessage.replace(/\n/g, "<br/>")}` }} />
    );
}

export default MessagePreview