import React, { Component } from "react";
import { connect } from "react-redux";
import basketService from "../../services/basket.service";
import { Navigate } from 'react-router-dom';

const clothingDictionary = {
    T_SHIRT: "Футболка",
    JEANS: "Джинсы",
    JACKET: "Куртка",
    DRESS: "Платье",
    SHORTS: "Шорты",
    SWEATER: "Свитер",
    SKIRT: "Юбка",
    SUIT: "Костюм",
    SHOES: "Обувь",
    HAT: "Шляпа",
    SCARF: "Шарф",
    GLOVES: "Перчатки",
    SOCKS: "Носки",
};

class ProductModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
        };
    }

    addToCart(cloth) {
        if (this.props.user == null) {
            alert("Сначала произведите вход!");
            return;
        }

        this.setState({ loading: true });

        basketService.buy(this.props.user.user, cloth)
            .then(() => {
                this.setState({ loading: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ loading: false, error: error.message });
            });
    }

    render() {
        const { cloth, onClose } = this.props;
        const { loading, error } = this.state;

        if (!cloth) return null;

        return (
            <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{cloth.name}</h5>
                            <button
                                    className="btn-close"
                                    onClick={onClose}>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <img
                                        className="img-fluid"
                                        src={`data:image/png;base64,${cloth.image.imageData}`}
                                        alt={cloth.name}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Описание:</strong> {cloth.description}</p>
                                    <p><strong>Тип:</strong> {clothingDictionary[cloth.type]}</p>
                                    <p><strong>Цена:</strong> {cloth.price} руб.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => this.addToCart(cloth)}
                                        disabled={loading}
                                    >
                                        {loading ? "Добавление..." : "Добавить в корзину"}
                                    </button>
                                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(ProductModal);
