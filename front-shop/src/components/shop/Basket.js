import React, {Component} from "react";
import {connect} from "react-redux";
import basketService from "../../services/basket.service";
import clothesService from "../../services/clothes.service";
import {Navigate} from "react-router-dom";

class Basket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            currentBasket: null,
            pastBaskets: [],
            clothesData: {},
            error: null,
        };
    }

    componentDidMount() {
        this.loadBasketData();
    }

    async loadBasketData() {
        if (this.props.user == null) {
            this.props.navigate("/login");
            return;
        }

        this.setState({loading: true});

        try {
            let currentBasket, pastBaskets = [];
            await Promise.all([basketService.getByUserId(this.props.user.user.id, false).then((response) => {
                    currentBasket = response.data[0];

                }).catch(() => {
                }),
                basketService.getByUserId(this.props.user.user.id, true).then((response) => {
                    pastBaskets = response.data;
                }).catch(() => {
                })
            ]);

            const allClothIds = new Set();

            if (currentBasket) {
                currentBasket.items.forEach(item => allClothIds.add(item.clothId));
            }

            pastBaskets.forEach(basket => {
                basket.items.forEach(item => allClothIds.add(item.clothId));
            });

            const clothesData = await this.loadClothesData([...allClothIds]);
            console.info(currentBasket);
            this.setState({
                currentBasket,
                pastBaskets,
                clothesData,
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error.message || "Failed to load basket data",
                loading: false,
            });
        }
    }

    async loadClothesData(clothIds) {
        const clothesData = {};
        await Promise.all(
            clothIds.map(async (id) => {
                try {
                    const response = await clothesService.getById(id);
                    clothesData[id] = response.data;
                } catch (error) {
                    console.error(`Failed to load cloth with id ${id}:`, error);
                }
            })
        );
        return clothesData;
    }

    async buy() {
        if(this.state.currentBasket != null)
            basketService.buyBasket(this.state.currentBasket.id).then(()=> {
                this.loadBasketData();
            });
    }

    renderBasketItems(items) {
        const {clothesData} = this.state;

        return items.map((item, index) => {
            const cloth = clothesData[item.clothId];
            if (!cloth) return null;

            return (
                <div className="card" key={item.id}>
                    <img
                        className="w-25 align-self-center card-img"
                        alt={cloth.image.name}
                        src={`data:image/png;base64,${cloth.image.imageData}`}
                        onClick={() => this.props.navigate("/clothes/" + cloth.id)}
                    />
                    <div className="card-body ">
                        <div className="h-100 align-content-end " key={cloth.id}>
                            <p className="card-title text-truncate">
                                <strong>Название: </strong>
                                {cloth.name}
                            </p>
                            <p className="card-text text-success fw-bold">
                                <strong>Цена: </strong>
                                {cloth.price}
                            </p>

                        </div>
                    </div>
                    <hr/>
                    <p className="card-text text-success w-100 fw-bold">
                        <strong>Количество: </strong>
                        {item.quantity}
                    </p>
                </div>
            );
        });
    }

    render() {
        const {loading, currentBasket, pastBaskets, error} = this.state;

        if (loading) {
            return <div className="text-center my-5">Loading...</div>;
        }

        if (error) {
            return <div className="alert alert-danger my-5">{error}</div>;
        }

        return (
            <div className="container my-4">
                <h2>Корзина</h2>
                {currentBasket && currentBasket.items.length > 0 ? (
                    <div className="container p-5">
                        {this.renderBasketItems(currentBasket.items)}
                        <div className="text-end fw-bold">
                            Total: {currentBasket.items.reduce((sum, item) => {
                            const cloth = this.state.clothesData[item.clothId];
                            return sum + (cloth ? cloth.price * item.quantity : 0);
                        }, 0)} $
                        </div>
                        <div className="w-100 ">
                            <button
                                className="btn btn-success mt-4 w-100 align-self-center"
                                onClick={() => this.buy()}
                            >Купить</button>
                        </div>
                    </div>
                ) : (
                    <p>Нет предметов в корзине</p>
                )}

                <h2 className="mt-5">Покупки</h2>
                {pastBaskets.length > 0 ? (
                    pastBaskets.map((basket, index) => (
                        <div className="card p-3 mb-3" key={index}>
                            <h5>Корзина {basket.dateCreated.split("T")[0]}</h5>
                            {this.renderBasketItems(basket.items)}
                            <div className="text-end fw-bold">
                                Total: {basket.items.reduce((sum, item) => {
                                const cloth = this.state.clothesData[item.clothId];
                                return sum + (cloth ? cloth.price * item.quantity : 0);
                            }, 0)} $
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет прошлых покупок</p>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {isLoggedIn, user} = state.auth;
    return {
        user,
        isLoggedIn,
    };
}

export default connect(mapStateToProps)(Basket);