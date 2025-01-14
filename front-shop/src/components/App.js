import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/App.css";
import Login from "./auth/Login";
import Register from "./auth/Registration";
import Profile from "./auth/Profile";
import Users from "./admin/Users";
import Clothes from "./cloth/Clothes";

import NavigateComponent from "../helpers/navigate";
import {ToastContainer} from "react-toastify";
import NavBar from "./navBar";
import AddCloth from "./cloth/AddCloth";
import Cloth from "./cloth/Cloth";
import Shop from "./shop/Shop";
import Info from "./Info";
import Basket from "./shop/Basket";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <NavBar/>

                <div className="container mt-3">
                    <Routes>
                        <Route
                            path="/"
                            element={<NavigateComponent Component={Register}/>}
                        />
                        <Route
                            path="/info"
                            element={<NavigateComponent Component={Info}/>}
                        />
                        <Route
                            exact
                            path="/clothes"
                            element={<NavigateComponent Component={Clothes} />}
                        />
                        <Route
                            exact
                            path="/basket"
                            element={<NavigateComponent Component={Basket} />}
                        />
                        <Route
                            exact
                            path="/clothes/add"
                            element={<NavigateComponent Component={AddCloth} />}
                        />
                        <Route
                            exact
                            path="/clothes/:id"
                            element={<NavigateComponent Component={Cloth} />}
                        />
                        <Route
                            exact
                            path="/shop"
                            element={<NavigateComponent Component={Shop} />}
                        />
                        <Route
                            path="/users"
                            element={<NavigateComponent Component={Users}/>}
                        />
                        <Route
                            path="/login"
                            element={<NavigateComponent Component={Login}/>}
                        />
                        <Route
                            path="/register"
                            element={<NavigateComponent Component={Register}/>}
                        />
                        <Route
                            path="/profile"
                            element={<NavigateComponent Component={Profile}/>}
                        />
                    </Routes>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </BrowserRouter>
        );
    }
}

export default App;
