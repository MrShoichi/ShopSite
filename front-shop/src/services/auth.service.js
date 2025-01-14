import axios from "axios";

const API_URL = "http://localhost:8081/auth/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "login", {email: email, password: password})
            .then((response) => {

                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("test");
    }

    async token(refreshToken) {
        return await axios
            .post(API_URL + "token", {
                token: refreshToken,
            })
            .then((response) => {
                if (response.data.accessToken) {
                    let user = JSON.parse(localStorage.getItem("user"));
                    user.accessToken = response.data.accessToken;
                    localStorage.setItem("user", JSON.stringify(user));
                }

                return response.data;
            }).catch(() => {
                return false;
            });
    }

    async validate(token) {
        return await axios.post(API_URL + "validate", {
            token,
        });
    }

    register(name, email, password) {
        return axios.post(API_URL + "registration", {
            name,
            email,
            password,
        });
    }
}

const authService = new AuthService();

export default authService;
