import AuthService from "../services/auth.service";
import {use} from "react";

export default async function authHeader() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
        return await AuthService.validate(user.accessToken).then(
            async (response) => {
                if (!response.data) {
                    await AuthService.token(user.refreshToken);
                    user = JSON.parse(localStorage.getItem("user"));
                }
                return {
                    Authorization: "Bearer " + user.accessToken,
                    baseURL: "http://localhost:3000",
                    withCredentials: true,
                };
            }
        );
    } else {
        return {};
    }
}
