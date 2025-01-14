import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

class Profile extends Component {
  constructor(props) {
    super(props);
      this.handleDelete = this.handleDelete.bind(this);
      this.state = {
      tests: "",
    };
  }

    handleDelete(e, id) {
        /*testsService.cancelTest(e.id).then(
            (response) => {
                window.location.reload(false);
            },
            (error) => {
                this.setState({
                    tasks:
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
        );*/
    }




  render() {
    const { user: currentUser, isTestExists } = this.props;
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    if (isTestExists) {
      return <Navigate to="/test" />;
    }
    let testsStatistics;
    if(this.state.tests)
    {
      testsStatistics = this.state.tests.map((test, i) => (
        <div className="card bg-light text-dark w-75">
          <div className="d-flex">
            <strong>Дата теста: </strong>
            <p className="mx-2">{new Date(test.date).toLocaleDateString()}</p>
          </div>

          <button
            type="button"
            className="btn btn-danger"
            disabled={this.state.loading}
            onClick={() => this.handleDelete(test, i)}
          >
            {this.state.loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <i className="bi bi-trash" style={{ fontSize: 16 }}></i>
            &nbsp;Удалить
          </button>
        </div>
      ));
    }

    return (
      <div>
        <div className="card bg-light text-dark w-100">
        <h1>{currentUser.user.name}</h1>
        <br />
        <p>
          <strong>Имя:</strong> {currentUser.user.name}
        </p>
        <p>
          <strong>Почта:</strong> {currentUser.user.email}
        </p>
        </div>
        <hr />
        <div className="card bg-light text-dark w-100">
        <strong>Статистика:</strong>
        {testsStatistics}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const {isTestExists} = state.test;
  return {
    user,
    isTestExists
  };
}

export default connect(mapStateToProps)(Profile);
