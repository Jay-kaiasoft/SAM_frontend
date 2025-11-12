import { LOAD_MEMBER_INFO, UPDATE_MEMBER_INFO ,SET_COMMUNICATION_PREFERENCES} from "../config/actionTypes";

const initialState = {};

export const profileReducer = (state = initialState, action) => {
  
  switch (action.type) {
    
    case LOAD_MEMBER_INFO:
      return action.memberInfo;

    case UPDATE_MEMBER_INFO:
      return action.data;

    default:
      return state;
  }
};
