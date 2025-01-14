import React, { Component } from "react";
import { connect } from "react-redux";
import Cloth from "./Cloth";

class AddCloth extends Component {
    constructor(props) {
        super(props);


        this.state = {
            cloth: {
                id: "",
                type: 1,
                name: "",
                description: "",
                price: 1,
                imagePreview: "",
                imageFile: null,
                existCorrect: false,
            },
        };
    }

    render() {
        const {user} = this.props.user;
        if(!user.role.name === "admin")
        {
            this.props.navigate("/clothes");
        }
        return (
            <Cloth cloth = {this.state.cloth} navigate = {this.props.navigate}/>
        );
    }
}

function mapStateToProps(state) {
    const { isLoggedIn, user } = state.auth;
    const { message } = state.message;
    return {
        isLoggedIn,
        message,
        user,
    };
}

export default connect(mapStateToProps)(AddCloth);