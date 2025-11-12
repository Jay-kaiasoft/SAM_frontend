import {LOAD_CREDIT_CARD_DETAILS } from "../config/actionTypes";


const initialState = null;

export const cardDetailReducer = (state = initialState, action) => {
    switch (action.type) {
     
      case LOAD_CREDIT_CARD_DETAILS:
        return action.data;

      default:
        return state;
    }
  };