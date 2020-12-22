import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import {db} from '../Database'

import { setIsLoggedIn, setUser } from './AuthState'
import HeadPanel from '../components/HeadPanel'

import UserInput from './UserInput'
import defaultAvatarImg from '../../../assets/images/icons/default-avatar.png'
import usernameImg from '../../../assets/images/icons/username.png'
import passwordImg from '../../../assets/images/icons/password.png'
import {PHOTO_WIDTH, PHOTO_HEIGHT, DEVICE_WIDTH, DEVICE_HEIGHT, HAED_PANEL_HEIGHT, BOTTOM_TAB_HEIGHT} from '../Constant'
import ImagePickerSelModal from '../components/ImgPickerSelModal'
import { setGestureEnable, setHeaderShown } from '../navigation/NavigationState'

class UserProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imagePickerVisible: false,
      userInfo: JSON.parse(JSON.stringify(this.props.userInfo)),
      showPass: true,
      confirm: '',
      pageX: 0, pageY: 0,
      isNameEditing: false
    }
    this.nameInputField = React.createRef()
  }
  
  componentDidMount() {
    let userInfo = {...this.state.userInfo}
    userInfo.password = ''
    this.setState({userInfo})
    console.log(">>> User Profile Screen Did Mount: User Info: ", this.props.userInfo)
  }

  showPass = () => {
    console.log("press the eye")
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false})
  }

  onChangeEmail = (email) => {
    console.log("onchange email:", email)
    let userInfo = this.state.userInfo
    userInfo.email = email
    this.setState({userInfo: userInfo})
  }

  onChangeUserName = (name) => {
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

  onSave = async () => {

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

    if (userInfo.password != '' && userInfo.password.length < 6) {
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
      if (user.id !== userInfo.id && user.name === userInfo.name) {
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

      if (user.id !== userInfo.id && (user.email === userInfo.email || user.phone === userInfo.phone)) {
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
    let result = await db.updateUser(userInfo)
    console.log("update user result: ", result)

    if (result.rowsAffected == 1) {
      Alert.alert(
        'Updated',
        'User information has been updated.',
        [
          { text: 'OK', onPress: () => null }
        ],
        { cancelable: false }
      )
    }
  }

  onLogOut = () => {
    this.props.setIsLoggedIn(false)
    this.props.setHeaderShown(false)
    this.props.setGestureEnable(false)

    this.props.navigation.navigate('Login')
  }

  onPhotoClick = async (ev) => {
    await this.setState({pageX: ev.nativeEvent.pageX, pageY: ev.nativeEvent.pageY})
    this.setState({imagePickerVisible: true})
  }

  onUserNamePressed = async () => {    
    await this.setState({ isNameEditing: true })
    this.nameInputField.focus()
  }

  onBlurOfUserName = (ev) => {
    console.log(">>> on blur of user name")
    if (this.state.userInfo.name != '')
      this.setState({ isNameEditing: false })
  }

  imagePickerCallBack = async (response) => {
    console.log('Response = ', response)
    if (response.didCancel) {
      console.log('User cancelled image picker')
      
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.error)

    } else if (response.uri) {
      console.log("response.uri: ", response.uri)
      this.setPhotoUri(response.uri)
    }
  }

  setFromLibrary = () => {

    console.log("set from library")
    let options = {
      mediaType: 'photo',
      saveToPhoto: true,
    }

    launchImageLibrary(options, this.imagePickerCallBack)
  }

  setFromCamara = () => {

    console.log("set from library")
    let options = {
      mediaType: 'photo',
      saveToPhoto: true,
    }

    launchCamera(options, this.imagePickerCallBack)
  }

  setChoice = async (isCamera) => {
    await this.closeImagePicker()
    setTimeout(() => {
      if (isCamera) {
        this.setFromCamara()
      } else {
        this.setFromLibrary()
      }
    }, 10)
  }

  setPhotoUri = (uri) => {
    let userInfo = this.state.userInfo
    userInfo.imagePath = uri

    this.setState({userInfo: userInfo})
  }
  
  closeImagePicker = () => {
    console.log("close image picker selector")
    this.setState({imagePickerVisible: false})
  }

  render() {
    let { contentView, linearGradient, buttonText} = styles
    return (      
      <View style={styles.container}>
        
        <HeadPanel title="User Profile"/>

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          style={styles.container}>

          <View style={contentView}>
            <View style={{justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', height: 200}}>
              <View style={{alignItems: 'center', justifyContent: 'center', width: 80, height: 120, marginTop: 30, marginBottom: 20}}>
                <TouchableOpacity flex={1} 
                    style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT, borderRadius: PHOTO_WIDTH / 2}} 
                    onPress={(ev) => {this.onPhotoClick(ev)}} activeOpacity={.8}>
                  <Image flex={1} 
                    source={this.state.userInfo.imagePath != null && this.state.userInfo.imagePath != '' ? {url: this.state.userInfo.imagePath} : defaultAvatarImg} 
                    style={{height: PHOTO_WIDTH, width: PHOTO_HEIGHT, resizeMode:'stretch', borderRadius: PHOTO_WIDTH / 2, backgroundColor: '#AAA'
                    }}/>
                </TouchableOpacity>
              </View>

              {!this.state.isNameEditing ?
                <Text 
                  style={{color: '#125171', textAlign: 'center', fontSize: 25, fontWeight: 'bold', height: INPUT_HEIGHT, }}
                  onPress={()=> {this.onUserNamePressed()}}
                >
                  {this.state.userInfo.name}
                </Text>
                : 
                  <View style={styles.inputWrapper}>
                    <TextInput 
                      ref={ref => {this.nameInputField = ref}}                      
                      style={styles.input}
                      placeholder="Username"
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'done'}
                      placeholderTextColor="gray"
                      underlineColorAndroid="transparent"
                      value={this.state.userInfo.name}
                      onChangeText={(name) => this.onChangeUserName(name)}
                      onBlur={(ev) => this.onBlurOfUserName(ev)}
                    />
                    <Image source={usernameImg} style={styles.inlineImg} />
                  </View>
              }
            </View>
            
            <View flex={2} style={{marginTop: 30, flexDirection: 'column', justifyContent: 'space-between'}}>
              <UserInput
                source={usernameImg}
                placeholder="Email"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                eyeicon={false}
                onChangeText = {(email) => this.onChangeEmail(email)}
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
                value={this.state.confirm}
              />
            </View>

            <View flex={1} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity 
                style={{flex: 1, height: 40, alignItems: 'center'}}
                onPress={() => this.onSave()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B' ]}
                  style={linearGradient}
                  start={{x: 0.4, y: 0}}
                  end={{x: 0.4, y: 1.5}}
                >
                <Text style={buttonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{flex: 1, height: 40, alignItems: 'center'}}
                onPress={() => this.onLogOut()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#FF9BA2', '#FA5865' ]}
                  style={linearGradient}
                  start={{x: 0.4, y: 0}}
                  end={{x: 0.4, y: 1.5}}
                >
                <Text style={buttonText}>Log Out</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <ImagePickerSelModal 
          visible={this.state.imagePickerVisible}
          title="Select Avatar"
          pageX={this.state.pageX}
          pageY={this.state.pageY}
          close={this.closeImagePicker}
          setChoice={this.setChoice} />
      </View>

    )
  }
}

export default compose(
  connect(
    state => ({
      userInfo: state.auth.userInfo,
    }),
    dispatch => ({
      setUser: (userInfo) => dispatch(setUser(userInfo)),
      setIsLoggedIn: (isLoggedIn) => dispatch(setIsLoggedIn(isLoggedIn)),
      setHeaderShown: (headerShown) => dispatch(setHeaderShown(headerShown)),
      setGestureEnable: (gestureEnable) => dispatch(setGestureEnable(gestureEnable))
    }),
  )
)(UserProfileScreen)

const INPUT_HEIGHT              = 50
const INPUT_HORZ_MARGIN         = 20

const INLINE_IMG_WIDTH          = 22
const INLINE_IMG_HEIGHT         = INLINE_IMG_WIDTH
const INLINE_IMG_HORZ_MARGIN    = 15

const ZORDERINDEX               = 99

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // flexDirection: 'column',
  },
  contentView: {
    flex:1, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    height: (DEVICE_HEIGHT - HAED_PANEL_HEIGHT - BOTTOM_TAB_HEIGHT - 100),
    // width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: DEVICE_HEIGHT / 10
  },
  linearGradient: {
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 10,
    width: 100,
    height: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: DEVICE_WIDTH - INPUT_HORZ_MARGIN * 2,
    height: INPUT_HEIGHT,
    marginHorizontal: INPUT_HORZ_MARGIN,
    borderRadius: 20,
    color: '#555',
    fontSize: 20,
    textAlign: 'center'
  },
  inputWrapper: {
    marginBottom: 0
  },
  inlineImg: {
    position: 'absolute',
    zIndex: ZORDERINDEX,
    width: INLINE_IMG_WIDTH,
    height: INLINE_IMG_HEIGHT,
    left: INPUT_HORZ_MARGIN + INLINE_IMG_HORZ_MARGIN,
    top: (INPUT_HEIGHT - INLINE_IMG_HEIGHT) / 2,
  },
})


