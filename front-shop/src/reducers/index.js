import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import test from "./test"

export default combineReducers({
  auth,
  message,
  test,
});
