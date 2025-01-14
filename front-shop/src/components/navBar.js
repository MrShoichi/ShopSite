import {Component} from "react";
import {Link} from "react-router-dom";
import {ShowForRoles} from "./permission/ShowRolesComponent";
import {connect} from "react-redux";
import {logout} from "../actions/auth";
import EventBus from "../common/EventBus";
import {history} from "../helpers/history";
import {clearMessage} from "../actions/message";
import {FaShoppingBasket, FaShoppingCart, FaUserAlt} from "react-icons/fa";
import {GiClothes} from "react-icons/gi";
import basketService from "../services/basket.service"; // Иконки для улучшения внешнего вида

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.state = {
            currentUser: undefined,
        };

        history.listen((location) => {
            props.dispatch(clearMessage());
        });
    }

    componentDidMount() {
        const user = this.props.user;

        if (user) {
            this.setState({
                currentUser: user,
            });
            let basket = null;
            basketService.getByUserId(this.props.user.user.id, false).then((response) => {
                basket = response.data[0];
                if(basket) {
                    console.info(basket.items.reduce((sum, i) => sum + i.quantity, 0));
                    this.setState({
                        basketCount: basket.items.reduce((sum, i) => sum + i.quantity, 0)
                    });
                }
            }).catch(() => {
            });


        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        this.props.dispatch(logout());
        this.setState({
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, basketCount} = this.state;

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <FaShoppingCart/> Shop
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarText"
                        aria-controls="navbarText"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        {currentUser && (
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <ShowForRoles permission="admin">
                                    <li className="nav-item">
                                        <Link to={"/users"} className="nav-link">
                                            <FaUserAlt/> Пользователи
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={"/clothes"} className="nav-link">
                                            <GiClothes/> Одежда
                                        </Link>
                                    </li>

                                </ShowForRoles>
                            </ul>
                        )}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={"/shop"} className="nav-link">
                                    <FaShoppingCart/> Каталог
                                </Link>
                            </li>
                            {currentUser ? (
                                <>

                                    <li className="nav-item">
                                        <Link to={"/profile"} className="nav-link">
                                            <FaUserAlt/> Профиль
                                        </Link>
                                    </li>

                                    <li className="nav-item d-flex justify-content-between">
                                        <Link to={"/basket"} className="nav-link">
                                            <FaShoppingBasket className="my-0"/> Корзина
                                        </Link>
                                        <p className="basket-text">{basketCount}</p>
                                    </li>

                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link" onClick={this.logOut}>
                                            Выйти
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to={"/login"} className="nav-link">
                                            Войти
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link to={"/register"} className="nav-link">
                                            Зарегистрироваться
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <Link to={"/info"} className="nav-link">
                                    <GiClothes/> Об авторе
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    const {user} = state.auth;

    return {
        user,
    };
}

export default connect(mapStateToProps)(NavBar);
