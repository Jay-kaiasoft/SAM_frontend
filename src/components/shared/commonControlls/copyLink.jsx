import {copyLink} from "../../../assets/commonFunctions";

const CopyLink = ({elementName, iconSelector, title="Copy Link"})=>{
    return (
        <i
            id={iconSelector}
            className="far fa-copy ml-3 mr-2 align-self-start"
            onClick={()=>{copyLink(elementName, iconSelector);}}
            data-toggle="tooltip"
            title={title}
        ></i>
    );
}

export default CopyLink;