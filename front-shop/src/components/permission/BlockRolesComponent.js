import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const BlockRolesComponent = (props) => {
    const couldBlock = props.userPermission !== props.permission ;
    console.info(couldBlock);

    return couldBlock ?<div style = {{pointerEvents: "none"}}>{props.children}</div>:props.children;
};

BlockRolesComponent.propTypes = {
    permission: PropTypes.string.isRequired,
    userPermission: PropTypes.string.isRequired
};


const mapStateToProps = (state) => {
    let role = state.auth.user.user.role.name;
    return {
    userPermission: role
}};

export const BlockWithoutRoles = connect(mapStateToProps)(BlockRolesComponent);
