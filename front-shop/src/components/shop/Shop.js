import React, {Component} from "react";
import {connect} from "react-redux";
import EventBus from "../../common/EventBus";
import clothesService from "../../services/clothes.service";
import basketService from "../../services/basket.service";
import ProductModal from "./ProductModel";

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

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            clothes: [],
            originalClothes: [], // Сохраняет исходный порядок одежды
            error: null,
            basket: null,
            filterType: "ALL",
            sortOrder: "default", // "default", "price_asc", "price_desc"
            selectedCloth: null,
        };
    }

    loadCloth() {
        let basket = null;
        console.info("load");
        if (this.props.user != null) {
            basketService.getByUserId(this.props.user.user.id, false).then((response) => {
                basket = response.data[0];
            }).catch(() => {
            });
        }
        clothesService.getAll().then(
            (response) => {
                this.setState({
                    clothes: response.data,
                    originalClothes: response.data, // Сохраняем исходный массив
                    basket: basket,
                    loading: false,
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
                    loading: false,
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }

    componentDidMount() {
        this.loadCloth();
    }

    handleFilterChange = (e) => {
        this.setState({filterType: e.target.value});
    };

    handleSortChange = (e) => {
        this.setState({sortOrder: e.target.value});
    };

    getFilteredAndSortedClothes() {
        const {clothes, originalClothes, filterType, sortOrder} = this.state;

        // Фильтрация по типу
        let filteredClothes = clothes;
        if (filterType !== "ALL") {
            filteredClothes = originalClothes.filter(cloth => cloth.type === filterType);
        }

        // Сортировка
        if (sortOrder === "price_asc") {
            filteredClothes = [...filteredClothes].sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price_desc") {
            filteredClothes = [...filteredClothes].sort((a, b) => b.price - a.price);
        } else if (sortOrder === "default") {
            filteredClothes = originalClothes.filter(cloth =>
                filterType === "ALL" || cloth.type === filterType
            );
        }

        return filteredClothes;
    }

    buyCloth(cloth) {
        if (this.props.user == null) {
            this.props.navigate("/login");
            return;
        }

        basketService.buy(this.props.user.user, cloth).then(() => {
            this.loadCloth();
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    removeCloth(cloth) {
        if (this.props.user == null) {
            this.props.navigate("/login");
            return;
        }
        basketService.remove(this.state.basket, cloth).then(() => {
            this.loadCloth();
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    isInCart(cloth) {
        if (this.state.basket != null) {
            return this.state.basket.items.some(item => item.clothId === cloth.id);
        }
        return false;
    }

    countInCart(cloth) {
        return this.state.basket.items.filter(item => item.clothId === cloth.id)[0]?.quantity || 0;
    }

    handleProductClick(cloth) {
        this.setState({selectedCloth: cloth});
    }

    handleCloseModal = () => {
        this.setState({selectedCloth: null});  // Закрытие модального окна
    };

    render() {
        const {loading, error, filterType, sortOrder} = this.state;
        const {selectedCloth} = this.state;

        if (loading) {
            return <div className="text-center my-5">Загрузка...</div>;
        }
        if (error) {
            return <div className="alert alert-danger my-5">{error}</div>;
        }

        const filteredAndSortedClothes = this.getFilteredAndSortedClothes();

        const items = filteredAndSortedClothes.map((cloth) => (
            <div className="col" key={cloth.id}>
                <div className="card h-100">
                    <div className="card-header">
                        <img
                            className="card-img-top"
                            alt={cloth.image.name}
                            src={`data:image/png;base64,${cloth.image.imageData}`}
                            onClick={() => this.handleProductClick(cloth)}  // Открытие окна товара
                        />
                    </div>
                    <div className="card-body">
                        <p className="card-title text-truncate">
                            <strong>Название: </strong>
                            {cloth.name}
                        </p>
                        <p className="card-text text-muted small">
                            <strong>Описание: </strong>
                            {cloth.description}
                        </p>
                        <p className="card-text text-success fw-bold">
                            <strong>Тип: </strong>
                            {clothingDictionary[cloth.type]}
                        </p>
                        <p className="card-text text-success fw-bold">
                            <strong>Цена: </strong>
                            {cloth.price}
                        </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between flex-wrap">
                        {!this.isInCart(cloth) ? (
                            <button
                                className="btn btn-success btn-sm flex-grow-1"
                                onClick={() => this.buyCloth(cloth)}
                            >
                                <i className="bi bi-pen mx-2"></i>
                                Купить
                            </button>
                        ) : (
                            <div className="d-flex justify-content-between w-100">
                                <button
                                    className="btn btn-success px-4"
                                    onClick={() => this.removeCloth(cloth)}
                                >
                                    -
                                </button>
                                <h5 className="my-0 align-items-center d-flex">
                                    <p className="m-0">В корзине </p>
                                    <p className="text-success mx-1 my-0">{this.countInCart(cloth)}</p>
                                </h5>
                                <button
                                    className="btn btn-success px-4"
                                    onClick={() => this.buyCloth(cloth)}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="container my-4">
                <div className="d-flex justify-content-between mb-3">
                    <select value={filterType} onChange={this.handleFilterChange} className="form-select">
                        <option value="ALL">Все</option>
                        {Object.entries(clothingDictionary).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    <select value={sortOrder} onChange={this.handleSortChange} className="form-select">
                        <option value="default">Без сортировки</option>
                        <option value="price_asc">По возрастанию цены</option>
                        <option value="price_desc">По убыванию цены</option>
                    </select>
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">{items}</div>
                {selectedCloth && <ProductModal onClose={this.handleCloseModal}
                                                cloth={selectedCloth}/>}
            </div>
        );
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

export default connect(mapStateToProps)(Shop);
