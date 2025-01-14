import ImageService from "../services/image.service";
import { CLEAR_MESSAGE, SET_MESSAGE } from "./types";

export const getImage = (id) => (dispatch) => {
    return ImageService.getImageById(id).then(
        (response) => {
            return Promise.resolve(response);
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

export const addImage = (image) => (dispatch) => {
    return ImageService.addNewImage(image).then(
        (response) => {
            dispatch({
                type: CLEAR_MESSAGE,
            });

            return Promise.resolve(response);
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

export const updateImage = (image, id) => (dispatch) => {
    return ImageService.updateImageById(image, id).then(
        (response) => {
            dispatch({
                type: CLEAR_MESSAGE,
            });
            return Promise.resolve(response);
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