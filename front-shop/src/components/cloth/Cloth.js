import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";
import { connect } from "react-redux";
import ImageService from "../../services/image.service";
import { ShowForRoles } from "../permission/ShowRolesComponent";
import { BlockWithoutRoles } from "../permission/BlockRolesComponent";
import { SET_MESSAGE } from "../../actions/types";
import { addImage, getImage, updateImage } from "../../actions/image";
import { createCloth, updateCloth } from "../../actions/clothes";
import Textarea from "react-validation/build/textarea";
import clothesService from "../../services/clothes.service";


const required = (value) => {
    console.info(value);
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Это поле обязательно!
            </div>
        );
    }
};


const descriptionValidator = (value) => {
    if (value.length < 5 || value.length > 250) {
        return (
            <div className="alert alert-danger" role="alert">
                Описание должно быть от 5 до 250 символов.
            </div>
        );
    }
};

const nameValidator = (value) => {
    if (value.length < 5 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                Название должно быть от 5 до 20 символов.
            </div>
        );
    }
};



class Cloth extends Component {
    constructor(props) {
        super(props);
        this.handleAdded = this.handleAdded.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.setUp = this.setUp.bind(this);
        this.addNewCloth = this.addNewCloth.bind(this);
        this.updateCloth = this.updateCloth.bind(this);

        let cloth = this.props.cloth === undefined ?? null;
        this.state = this.setUp(cloth);
    }

    setUp(cloth) {
        return {
            id: cloth.id ?? "",
            name: cloth.name ?? "",
            description: cloth.description ?? "",
            imagePreview: cloth.image
                ? `data:image/png;base64,${cloth.image.imageData}`
                : "",
            type: "T_SHIRT",
            imageFile: cloth.image ?? "",
            newFile: cloth.image ?? "",
            price: cloth.price ?? "",
            loading: false,
        };
    }

    componentDidMount() {
        if (!this.props.cloth) {
            clothesService.getById(this.props.params.id).then(
                (response) => {
                    let task = response.data;
                    this.setState(this.setUp(task));
                },
                (error) => {
                    this.props.navigate("/clothes", { replace: true });
                }
            );
        }
    }

    handleReload = () => {
        window.location.reload();
    };


    handleAdded(e) {
        e.preventDefault();
        this.setState({
            loading: true,
        });
        if (!this.validateImage()) {
            return;
        }

        this.form.validateAll();

        const { dispatch } = this.props;
        if (this.checkBtn.context._errors.length === 0) {
            dispatch(addImage(this.state.newFile))
                .then((response) => {
                    this.addNewCloth(response.data);
                })
                .catch(() => {
                    console.log("ups");
                    this.setState({
                        loading: false,
                    });
                });
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    addNewCloth(image) {
        this.props
            .dispatch(
                createCloth({
                    name: this.state.name,
                    description: this.state.description,
                    type: this.state.type,
                    price: this.state.price,
                    image: image,
                })
            )
            .then(() => {
                this.props.navigate("/clothes", { replace: true });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
                ImageService.deleteById(image.id);
            });
    }

    validateImage() {
        const { dispatch } = this.props;
        if (this.state.newFile === "") {
            dispatch({
                type: SET_MESSAGE,
                payload: "Изображение должно быть добавлено",
            });
            this.setState({
                loading: false,
            });
            return false;
        }

        return true;
    }

    handleUpdate(e) {
        e.preventDefault();
        this.setState({
            loading: true,
        });
        this.form.validateAll();
        const { dispatch } = this.props;
        if (this.checkBtn.context._errors.length === 0) {
            if (this.state.newFile === this.state.imageFile) {
                dispatch(getImage(this.state.imageFile.id))
                    .then((response) => {
                        this.updateCloth(response.data);
                    })
                    .catch(() => {
                        this.setState({
                            loading: false,
                        });
                    });
            } else {
                dispatch(updateImage(this.state.newFile, this.state.imageFile.id))
                    .then((response) => {
                        this.updateCloth(response.data);
                    })
                    .catch(() => {
                        this.setState({
                            loading: false,
                        });
                    });
            }
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    updateCloth(image) {
        const { dispatch } = this.props;
        dispatch(
            updateCloth({
                id: this.state.id,
                name: this.state.name,
                description: this.state.description,
                type: this.state.type,
                price: this.state.price,
                image: image,
            })
        )
            .then(() => {
                this.props.navigate("/clothes", { replace: true });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                });
            });
    }



    onChangeDescription(e) {
        this.setState({
            description: e.target.value,
        });
    }

    onChangeType(e) {
        this.setState({
            type: e.target.value,
        });
    }


    onChangeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    onChangePrice(e) {
        this.setState({
            price: e.target.value,
        });
    }

    onChangeImage(e) {
        if (e.target.files[0]) {
            this.setState({
                newFile: e.target.files[0],
                imagePreview: URL.createObjectURL(e.target.files[0]),
            });
        }
    }

    render() {
        const { isLoggedIn, message } = this.props;

        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }

        return (
            <div className="col-md-12">
                <BlockWithoutRoles permission="admin">
                    <div className="card bg-light text-dark">
                        <h1>
                            <center>Добавление товара </center>
                        </h1>

                        <Form
                            onSubmit={!this.state.id ? this.handleAdded : this.handleUpdate}
                            ref={(c) => {
                                this.form = c;
                            }}
                        >
                            <img
                                className="rounded mx-auto d-block w-50"
                                alt={this.state.newFile.name}
                                id="image"
                                src={this.state.imagePreview}
                            ></img>
                            <hr></hr>
                            <h4>Изображение</h4>
                            <Input type="file" onChange={this.onChangeImage}></Input>
                            <div className="form-group">
                                <label htmlFor="name">Название: </label>
                                <Input
                                    className="form-control small-12 medium-12 columns"
                                    name="name"
                                    value={this.state.name}
                                    rows="14"
                                    onChange={this.onChangeName}
                                    validations={[required, nameValidator]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Описание: </label>
                                <Textarea
                                    className="form-control small-12 medium-12 columns"
                                    name="description"
                                    value={this.state.description}
                                    rows="14"
                                    onChange={this.onChangeDescription}
                                    validations={[required, descriptionValidator]}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Тип: </label>
                                <Select
                                    className="form-control small-12 medium-12 columns"
                                    name="type"
                                    onChange={this.onChangeType}
                                    validations={[required]}
                                    value="T_SHIRT"
                                >
                                    <option value="T_SHIRT">Футболка</option>
                                    <option value="JEANS">Джинсы</option>
                                    <option value="JACKET">Куртка</option>
                                    <option value="DRESS">Платье</option>
                                    <option value="SHORTS">Шорты</option>
                                    <option value="SWEATER">Свитер</option>
                                    <option value="SKIRT">Юбка</option>
                                    <option value="SUIT">Костюм</option>
                                    <option value="SHOES">Обувь</option>
                                    <option value="HAT">Шляпа</option>
                                    <option value="SCARF">Шарф</option>
                                    <option value="GLOVES">Перчатки</option>
                                    <option value="SOCKS">Носки</option>
                                </Select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Цена: </label>
                                <Input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={this.state.price}
                                    onChange={this.onChangePrice}
                                />
                            </div>

                            <ShowForRoles permission="admin">
                                <div className="form-group justify-content-center d-flex">
                                    <button
                                        className="btn btn-dark btn-block m-4"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        {!this.state.id ? (
                                            <span>Добавить</span>
                                        ) : (
                                            <span>Сохранить</span>
                                        )}
                                    </button>
                                </div>

                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </ShowForRoles>
                            <CheckButton
                                style={{display: "none"}}
                                ref={(c) => {
                                    this.checkBtn = c;
                                }}
                            />
                        </Form>
                    </div>
                </BlockWithoutRoles>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {isLoggedIn} = state.auth;
    const {message} = state.message;
    const {isTestExists} = state.test;

    return {
        isLoggedIn,
        message,
        isTestExists,
    };
}

export default connect(mapStateToProps)(Cloth);