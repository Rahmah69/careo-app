import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import LoginScreen from './LoginScreen';
import { saveUser } from './AuthState';

export default compose(
  connect(
    state => ({
      userinfo: state.auth.userinfo
    }),
    dispatch => ({
      saveUser: (userinfo) => dispatch(saveUser(userinfo)),
    }),
  )
)(LoginScreen);
