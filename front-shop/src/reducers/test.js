import { TEST_CREATED, TEST_COMPLETE } from "../actions/types";

const test = JSON.parse(localStorage.getItem("test"));

const initialState = test ? { isTestExists: true }: { isTestExists: false };

export default function authReduce(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case TEST_CREATED:
      return {
        ...state,
        isTestExists: true,
      };
    case TEST_COMPLETE:
      return {
        isTestExists: false,
      };
    default:
      return state;
  }
}
