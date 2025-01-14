import clothesService from "../services/clothes.service";
import { CLEAR_MESSAGE, SET_MESSAGE } from "./types";

export const createCloth = (cloth) => (dispatch) => {
    return clothesService.createNewCloth(cloth).then(
        () => {
            dispatch({
                type: CLEAR_MESSAGE,
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};

export const updateCloth = (cloth) => (dispatch) => {
    return clothesService.updateCloth(cloth).then(
        () => {
            dispatch({
                type: CLEAR_MESSAGE,
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
            return Promise.reject();
        }
    );
};