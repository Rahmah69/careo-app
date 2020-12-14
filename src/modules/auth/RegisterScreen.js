import React, {Component} from 'react'
import {  View,  Text, Alert, TouchableOpacity  } from 'react-native'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Hyperlink from 'react-native-hyperlink'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import UserInput from './UserInput'
import usernameImg from '../../../assets/images/username.png'
import passwordImg from '../../../assets/images/password.png'
import { setUser, setUsers } from './AuthState'
import { PRIVACY_POLICY_URL, TERM_SERVICE_URL, DEVICE_WIDTH, DB_USERS_KEY} from '../Constant'
import {authStyles as styles} from '../../styles/authStyles'
import {db} from '../Database'


class RegisterScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      showPass: true,
      press: false,
      loading: false,
      loadingText:'',
      userInfo: {name: "", email: '', phone: '', password: ''},
      confirm: ''
    }
  }

  showPass = () => {
    console.log("press the eye")
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false})
  }

  onChangeUsername = (email) => {
    console.log("onchange email:", email)
    let userInfo = this.state.userInfo
    userInfo.email = email
    this.setState({userInfo: userInfo})
  }

  onChangeUserId = (name) => {
    console.log("onchange user:", name)
    let userInfo = this.state.userInfo
    userInfo.name = name
    this.setState({userInfo: userInfo})
  }

  onChangePassword = (pass) => {
    console.log("onchange password:", pass)
    let userInfo = this.state.userInfo
    userInfo.password = pass
    this.setState({userInfo: userInfo})
  }

  onChangePhone = (phone) => {
    console.log("onchange phone:", phone)
    let userInfo = this.state.userInfo
    userInfo.phone = phone
    this.setState({userInfo: userInfo})
  }

  onChangeConfirm = (confirm) => {
    console.log("onchange confirm:", confirm)
    this.setState({confirm: confirm})
  }

  onSubmit = async () => {

    let users = await db.listUser()
    console.log(">>> users: ", users)
    let userInfo = this.state.userInfo

    if (userInfo.name == '') {
      Alert.alert(
        'Empty',
        'The user name field is empty. Please input user name',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return
    }

    if (userInfo.email == '' && userInfo.phone == '') {
      Alert.alert(
        'Empty',
        'The email or phone field should be filled. Please input email or phone',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return
    }

    if (userInfo.password == '') {
      Alert.alert(
        'Empty',
        'Please input password.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return
    } else if (userInfo.password.length < 6) {
      Alert.alert(
        'Confirm',
        'The password length must be more than 6.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return

    }
    
    // check if there are duplicated user name or email
    for (let user of users) {
      if (user.name === userInfo.name) {
        Alert.alert(
          'Duplicated',
          'The user name already exists. Please input another user name',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        )
        return
      }

      if (user.email === userInfo.email || user.phone === userInfo.phone) {
        Alert.alert(
          'Duplicated',
          'The email/phone already exists. Please input another email/phone',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        )
        return
      }
    }

    // if password and confirm are not matched
    if (userInfo.password != this.state.confirm) {
      Alert.alert(
        'Not Matched',
        'The password and confirm password are not matched. Please input again.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return
    }

    console.log(userInfo)

    // save the user info into the store
    this.props.setUser(userInfo)

    // save the users into the phone db
    db.insertUser(userInfo)

    // goto the dashboard page
    this.props.navigation.navigate('MainScreen')
  }

  onLogin = () => {
    this.props.navigation.navigate('Login')
  }

  render() {

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        style={styles.container}>

        <View style={styles.picture}>
          <View style={styles.gotoButton}>
            <TouchableOpacity style={styles.login} onPress={() =>this.onLogin()} activeOpacity={1}>
              <Text>LogIn</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.inputbox}>
            <UserInput
              source={usernameImg}
              placeholder="Username"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              eyeicon={false}
              onChangeText = {(name) => this.onChangeUserId(name)}
              value={this.state.userInfo.name}
            />
            <UserInput
              source={usernameImg}
              placeholder="Email"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              eyeicon={false}
              onChangeText = {(email) => this.onChangeUsername(email)}
              value={this.state.userInfo.email}
            />
            <UserInput
              source={usernameImg}
              placeholder="Phone"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              eyeicon={false}
              onChangeText = {(phone) => this.onChangePhone(phone)}
              value={this.state.userInfo.phone}
            />
            <UserInput
              source={passwordImg}
              secureTextEntry={this.state.showPass}
              placeholder="Password"
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText = {(pass) => this.onChangePassword(pass)}
              eyeicon={true}
              eyefunc={this.showPass}
              value={this.state.userInfo.password}
            />
            <UserInput
              source={passwordImg}
              secureTextEntry={true}
              placeholder="Confirm Password"
              returnKeyType={'done'}
              autoCapitalize={'none'}
              onChangeText = {(confirm) => this.onChangeConfirm(confirm)}
              autoCorrect={false}
              value={this.state.userInfo.confirm}
            />
            <View style={{width: (DEVICE_WIDTH - 40), ustifyContent:'center'}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSubmit()}
                activeOpacity={1}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B']}
                  style={styles.linearGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 0.5, y: 0.6}}
                >
                <Text style={styles.text}>SIGN UP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Hyperlink
              linkDefault={true}
              linkStyle={ { color: '#0076C6' } }
              linkText={ url => url == PRIVACY_POLICY_URL ? 'Privacy Policy' : url == TERM_SERVICE_URL ? 'Terms of Service' : url }
              >
              <Text style={{
                marginTop: 20, 
                textAlign: "center", 
                color: '#5AA4A8',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              }}>
                By continuing, you agree to accept our{'\n'} {PRIVACY_POLICY_URL} {'&'} {TERM_SERVICE_URL}.
              </Text>
            </Hyperlink>
          </View>
          <OrientationLoadingOverlay
            visible={this.state.loading}
            color="white"
            indicatorSize="large"
            messageFontSize={24}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default compose(
  connect(
    state => ({
      userInfo: state.auth.userInfo,
      users: state.auth.users
    }),
    dispatch => ({
      setUser: (userInfo) => dispatch(setUser(userInfo)),
      setUsers: (users) => dispatch(setUsers(users))
    }),
  )
) (RegisterScreen)
