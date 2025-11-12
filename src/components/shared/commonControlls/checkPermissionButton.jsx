import {connect} from "react-redux";

const CheckPermissionButton = (props) => {
    const checkPermission = (subUserId,module,action) => {
        if(subUserId === 0){
            return true;
        } else {
            if(props.moduleLists[module].includes(action)){
                return true;
            } else {
                return false;
            }
        }
    }
    const result = checkPermission(props.subUser.memberId,props.module,props.action);
    return result ? props.children : null;
}
const mapStateToProps = (state) => { //store.getState()
    return {
        subUser: state.subUser,
        moduleLists: state.moduleLists
    }
}
export default connect(mapStateToProps)(CheckPermissionButton);