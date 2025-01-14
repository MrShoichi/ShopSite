import React, { Component } from "react";

import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import EventBus from "../../common/EventBus";
import usersService from "../../services/user.service";
import { DropdownList } from "react-widgets";
import { toast } from "react-toastify";

class Users extends Component {
  constructor(props) {
    super(props);
    this.onChangeRole = this.onChangeRole.bind(this);

    this.state = {
      roles: [
        { name: "Пользователь", id: "2" },
        { name: "Админ", id: "1" },
      ],
      rolesLang: {
        user: "Пользователь",
        admin: "Админ",
      },
      loading: false,
    };
  }

  componentDidMount() {
    usersService.getAll().then((response) => {
      response.data = response.data.filter(
        (user) => user.id !== this.props.user.user.id
      );
      this.setState({
        users: response.data,
      });
    });
  }

  onChangeRole(user, element) {
    usersService.update(user.id, element).then(
      () => {
        this.setState({});
        toast("Роль пользователя: " + user.name + " изменена!");
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
    const { isLoggedIn, user: currentUser } = this.props;
    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
    if (!currentUser.user.role.name === "admin") {
      this.props.navigate("/tasks");
    }
    return (
      <div className="card bg-light text-dark w-100">
        {this.state.users &&
          this.state.users.map((user) => (
            <div className="card bg-light text-dark w-75">
              <br />
              <p>
                <strong>Имя:</strong> {user.name}
              </p>
              <p>
                <strong>Почта:</strong> {user.email}
              </p>
              <p>
                <strong>Роль:</strong>
              </p>
              <DropdownList
                dataKey="id"
                textField="name"
                defaultValue={this.state.rolesLang[user.role.name]}
                data={this.state.roles}
                onChange={(element) => this.onChangeRole(user, element)}
              ></DropdownList>
            </div>
          ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.auth;
  const { message } = state.message;
  return {
    user,
    isLoggedIn,
    message,
  };
}

export default connect(mapStateToProps)(Users);
