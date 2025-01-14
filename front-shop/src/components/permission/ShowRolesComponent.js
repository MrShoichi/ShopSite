import PropTypes from "prop-types";
import { connect } from "react-redux";

const ShowRolesComponent = (props) => {
  const couldShow = props.userPermission === props.permission;
  return couldShow ? props.children : null;
};

ShowRolesComponent.propTypes = {
  permission: PropTypes.string.isRequired,
  userPermission: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {  if (state.auth.user.user.role) {
    return {
      userPermission: state.auth.user.user.role.name,
    };
  }
};

export const ShowForRoles = connect(mapStateToProps)(ShowRolesComponent);
