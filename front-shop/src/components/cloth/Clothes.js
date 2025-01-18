import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "../../helpers/history";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import EventBus from "../../common/EventBus";
import ClothesList from "./ClothesList";
import clothesService from "../../services/clothes.service";

class Clothes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: "",
        };

    }

    nextPath(path) {
        history.push(path);
        window.location.reload(false);
    }

    componentDidMount() {
        clothesService.getAll().then(
            (response) => {
                this.setState({
                    clothes: response.data,
                });

            },
            (error) => {
                this.setState({
                    error:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString(),
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );

    }

    render() {
        const { isLoggedIn, user } = this.props;
        if (!isLoggedIn && !this.state.content) {
            return <Navigate to="/" />;
        }
        if (user.user.role.name !== "admin") {
            return <Navigate to="/" />;
        }
        return (
            <div className="card bg-light text-dark ">
                <ShowForRoles permission="admin">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => this.nextPath("/clothes/add")}
                    >
                        Добавить одежду
                    </button>
                </ShowForRoles>
                <ClothesList clothes={this.state.clothes} navigate={this.props.navigate} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.auth;
    return {
        isLoggedIn,
        user
    };
}

export default connect(mapStateToProps)(Clothes);