import React, {Component} from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import {  View,  Text,   Alert,   TouchableOpacity  } from 'react-native'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'

import UserInput from './UserInput'
import usernameImg from '../../../assets/images/icons/username.png'
import passwordImg from '../../../assets/images/icons/password.png'
import { setUser, setIsLoggedIn } from './AuthState'
import {DEVICE_WIDTH, DB_USERS_KEY} from '../Constant'
import {authStyles as styles} from '../../styles/authStyles'
import {db} from '../Database'
import { setChildList } from '../child/ChildState'
import { setDeviceList } from '../device/DeviceState'
import { setNotiList, setLastNotiList } from '../notification/NotificationState'
import {MAIN_TAB_NAV_NAME, REGISTER_PAGE_NAME, CHILD_LIST_PAGE_NAME} from '../navigation/stackNavigationData'

class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      showPass: true,
      press: false,
      loading: false,
      loadingText:'',
      users: [],
      userInfo: {name: '', email: '', phone: '', password: '', imagePath: ''},
    }
  }

  componentDidMount = async () => {
    
    let users = await db.listUser()
    console.log(">>> login compoment did mount - users: ", users)
    
    this.setState({ users: users })
  }

  showPass = () => {
    console.log("press the eye")
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false})
  }

  onChangeUsername = (email) => {
    let userInfo = this.state.userInfo
    userInfo.email = email
    this.setState({userInfo: userInfo})
  }

  onChangePassword = (pass) => {
    let userInfo = this.state.userInfo
    userInfo.password = pass
    this.setState({userInfo: userInfo})
  }

  reset = () => {
    this.setState({
      userInfo: {name: '', email: '', phone: '', password: '', imagePath: ''}    
    })
  }

  onSubmit = async () => {

    let userInfo = this.state.userInfo

    if (userInfo.email == '') {
      Alert.alert(
        'Empty',
        'Please input email or phone number.',
        [
          { text: 'OK', onPress: () => console.log('email or phone is empty') }
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
          { text: 'OK', onPress: () => console.log('password is empty') }
        ],
        { cancelable: false }
      )
      return
    }

    // check if the user that the email and password are matched exists
    let bEmailMatched = false
    let bPasswordMatched = false
    console.log(">>> user info: ", userInfo)
    for (let user of this.state.users) {
      if (user.email === userInfo.email || user.phone === userInfo.email) {
        bEmailMatched = true
        if (user.password === userInfo.password)
          bPasswordMatched = true

        userInfo = user
        break
      }
    }

    // if email is not matched
    if (!bEmailMatched) {
      Alert.alert(
        '',
        'There is no email or phone that is matched.',
        [
          { text: 'OK', onPress: () => console.log('Not matched email or phone') }
        ],
        { cancelable: false }
      )
      return
    }

    // if password is wrong
    if (!bPasswordMatched) {
      Alert.alert(
        '',
        'Password is wrong. Please type the correct password.',
        [
          { text: 'OK', onPress: () => console.log('Password wrong') }
        ],
        { cancelable: false }
      )
      return
    }
    
    
    // save the user information and go to the dashboard page
    this.props.setUser(userInfo)
    this.props.setIsLoggedIn(true)

    console.log(">>> logged user info: ", this.props.userInfo)

    // load main information like child list, device list
    let childList = await db.listChild(this.props.userInfo.id)
    let deviceList = await db.listDevice(this.props.userInfo.id)
    let lastNotiList = await db.getLastNotificationsByConnectedDevice(this.props.userInfo.id)
    let notiList = await db.listNotification(this.props.userInfo.id)

    console.log(">>> initial notiList: ", notiList)
    console.log(">>> initial lastNotiList: ", lastNotiList)

    this.props.setChildList(childList)
    this.props.setDeviceList(deviceList)
    this.props.setNotiList(notiList)
    this.props.setLastNotiList(lastNotiList)

    console.log(">>> initial child list: ", childList)
    console.log(">>> initial device list: ", deviceList)
    
    this.props.navigation.navigate(MAIN_TAB_NAV_NAME)

    this.reset()
  }

  onRegister = () => {
    this.props.navigation.navigate(REGISTER_PAGE_NAME)

    this.reset()
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        style={styles.container}>

        <View style={styles.picture}>
          <View style={styles.gotoButton}>
            <TouchableOpacity style={styles.signup} onPress={() =>this.onRegister()} activeOpacity={1}>
              <Text>SignUp</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Log In</Text>

          <View  style={styles.inputbox}>
            <Text style={styles.description} numberOfLines={2}>Enter your login details to{'\n'} access your account</Text>
            <UserInput
              source={usernameImg}
              placeholder="Email/Phone"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              eyeicon={false}
              onChangeText = {(email) => this.onChangeUsername(email)}
              value={this.state.userInfo.email}
            />            
            <UserInput
              source={passwordImg}
              secureTextEntry={this.state.showPass}
              placeholder="Password"
              returnKeyType={'done'}
              autoCapitalize={'none'}
              autoCorrect={false}
              eyeicon={true}
              eyefunc={this.showPass}
              value={this.state.userInfo.password}
              onChangeText = {(pass) => this.onChangePassword(pass)}
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
                <Text style={styles.text}>LOG IN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <OrientationLoadingOverlay
            visible={this.state.loading}
            color="white"
            indicatorSize="large"
            messageFontSize={24}
            message="Loading... 😀😀😀"
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

export default compose(
  connect(
    state => ({
      userInfo: state.auth.userInfo
    }),
    dispatch => ({
      setUser: (userInfo) => dispatch(setUser(userInfo)),
      setIsLoggedIn: (isLoggedIn) => dispatch(setIsLoggedIn(isLoggedIn)),
      setChildList: (childList) => dispatch(setChildList(childList)),
      setDeviceList: (deviceList) => dispatch(setDeviceList(deviceList)),
      setNotiList: (notiList) => dispatch(setNotiList(notiList)),
      setLastNotiList: (notiList) => dispatch(setLastNotiList(notiList))
    }),
  )
)(LoginScreen)