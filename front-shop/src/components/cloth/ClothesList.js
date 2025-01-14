import React, {Component} from "react";
import {connect} from "react-redux";
import EventBus from "../../common/EventBus";
import {ShowForRoles} from "../permission/ShowRolesComponent";
import clothesService from "../../services/clothes.service";


class ClothesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleReload() {
        window.location.reload(false);
    }

    handleDelete(id) {
        clothesService.deleteById(parseInt(id)).then(
            () => {
                this.handleReload();
            },
            (error) => {
                this.setState({
                    cards:
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
        const {clothes} = this.props;
        if (clothes) {

            const items = clothes.map((cloth, i) => (
                <div className="col" key={cloth.id}>
                    <div className="card h-100">
                        <div className="card-header">
                            <img
                                className="card-img-top"
                                alt={cloth.image.name}
                                src={`data:image/png;base64,${cloth.image.imageData}`}
                                onClick={() => this.props.navigate("/clothes/" + cloth.id)}
                            />
                        </div>
                        <div className="card-body ">
                            <div key={cloth.id}>
                                <p className="card-title text-truncate">
                                    <strong>Название: </strong>
                                    {cloth.name}
                                </p>
                                <p className="card-text text-muted small">
                                    <strong>Описание: </strong>
                                    {cloth.description}
                                </p>
                                <p className="card-text text-success fw-bold">
                                    <strong>Цена: </strong>
                                    {cloth.price}
                                </p>
                            </div>
                        </div>

                        <ShowForRoles permission="admin">
                            <div className="card-footer d-flex justify-content-between ">

                                <button
                                    className="btn btn-success px-4"
                                    onClick={() => this.props.navigate(`/clothes/${cloth.id}`)}
                                    disabled={this.state.isLoading}
                                >
                                    <i className="bi bi-pen"></i> Изменить
                                </button>
                                <button
                                    className="btn btn-danger px-4"
                                    onClick={() => this.handleDelete(cloth.id)}
                                    disabled={this.state.isLoading}
                                >
                                    {this.state.isLoading ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        <i className="bi bi-trash"></i>
                                    )}
                                    Удалить
                                </button>
                            </div>

                        </ShowForRoles>
                    </div>
                </div>
            ));
            return (<div className="container my-4">

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">{items}</div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    const {isLoggedIn, user} = state.auth;
    const {message} = state.message;
    return {
        user,
        isLoggedIn,
        message,
    };
}

export default connect(mapStateToProps)(ClothesList);
