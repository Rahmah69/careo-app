import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { fonts, colors } from '../../styles'
import {db} from '../Database'

import HeadPanel from '../components/HeadPanel'

import defaultAvatarImg from '../../../assets/images/icons/default-avatar.png'
import {DEVICE_WIDTH, DEVICE_HEIGHT, HAED_PANEL_HEIGHT, BOTTOM_TAB_HEIGHT, INPUT_FIELD_HEIGHT} from '../Constant'

import PickerImage from '../components/PickerImage'
import InputFieldWithDevider from '../components/InputFieldWithDevider'
import TextFieldWithDevider from '../components/TextFieldWithDevider'
import SelectFieldWithDevider from '../components/SelectFieldWithDevider'

import { setChildList } from '../child/ChildState'
import { setDeviceList } from './DeviceState'
import { DEVICE_LIST_PAGE_NAME } from '../navigation/stackNavigationData'

class DeviceSettingScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deviceInfo: {
        uuid: this.props.selUUID,
        serialNumber: '',
        battery: 0,
        lastSyncTime: '',
        isConnected: false,
        childId: 0,
        childName: '',
        childPhoto: '',
        userId: this.props.userInfo.id
      },
      lastNotification: '',
      isNewDevice: true,
      originChildId: -1,
      deviceChildId: -1,
      childList: []
    }

    console.log("DeviceSettingScreen constructor selDevUUID: ", this.props.selUUID)
  }

  componentDidMount = async () => {

    console.log("DeviceSettingScreen Component Did Mount")
    console.log("sel uuid: ", this.props.selUUID)

    // the function for refresh when the page is focused.
    this.onFocusPage = this.props.navigation.addListener('focus', async () => {
      let uuid = this.props.selUUID

      let device = await db.getDevice(uuid)
      if (device != null) {
        this.setState({deviceInfo: device, isNewDevice: false})
      }

      console.log(">>> userInfo: ", this.props.userInfo)

      let childNameIDList = await db.getChildIdNameList(this.props.userInfo.id)
      console.log(">>> child list: ", childNameIDList)
      let childList = []
      let deviceChildId = -1
      childNameIDList.map((child) => {
        childList.push({label: child.name, value: child.id})
        if (child.uuid == this.state.deviceInfo.uuid) {
          deviceChildId = child.id
        }
      })

      // get last notification content
      let lastNotification = await db.getLastNotificationByUUID(uuid)
      
      console.log(">>> original child id: ", deviceChildId)
      this.setState({
        childList: childList, 
        originChildId: deviceChildId, 
        lastNotification: lastNotification
      })
    })
  }  

  onSave = async () => {

    let deviceInfo = this.state.deviceInfo
    let originChildId = this.state.originChildId
    let newChildId = deviceInfo.childId != null && deviceInfo.childId > 0 ? deviceInfo.childId : -1

    console.log(">>> original child id: ", originChildId)
    console.log(">>> new child id: ", newChildId)

    if (originChildId != newChildId) {
      if (originChildId > 0) {
        let result = await db.updateChildWithUUID(originChildId, "")
        console.log(">>> remove uuid from original child id: ", result)
      }

      if (newChildId > 0) {
        let result = await db.updateChildWithUUID(newChildId, deviceInfo.uuid)
        console.log(">>> set uuid to new child id: ", result)

        // get child information
        let childInfo = await db.getChild(deviceInfo.childId)
        deviceInfo.childName = childInfo.name
        deviceInfo.childPhoto = childInfo.imagePath
      }
    }

    
    // if new device
    if (this.state.isNewDevice) {
      let result = await db.insertDevice(deviceInfo)
      console.log(">>> device insert result: ", result)

      Alert.alert(
        'Success',
        'The device info has been added.',
        [
          { text: 'OK', onPress: () => {this.props.navigation.goBack()} }
        ],
        { cancelable: false }
      )

    } else {
      let result = await db.updateDevice(deviceInfo)
      console.log(">>> device update result: ", result)

      Alert.alert(
        'Success',
        'The device info has been updated.',
        [
          { text: 'OK', onPress: () => {this.props.navigation.goBack()} }
        ],
        { cancelable: false }
      )
    }

    // update the child list store
    let listChild = await db.listChild(this.props.userInfo.id)
    console.log(">>> after saving device, user list: ", listChild)
    this.props.setChildList(listChild)
  }

  onDelete = () => {
    Alert.alert(
      "Confirm",
      "Are you sure to remove this device's information?",
      [
        {
          text: "Yes",
          onPress: async () => {
            if (this.state.deviceInfo.isConnected) {
              // stop ble connection
              
            }

            await db.deleteDevice(this.state.deviceInfo.uuid)

            // go back
            this.props.navigation.goBack()
          }
        },
        {
          text: "No",
          onPress: () => {
            console.log("No Pressed")
          },
          style: "cancel"
        },
      ],
      { cancelable: false }
    )
  }  

  onChangeChildName = (value) => {
    console.log("onchange name:", value)
    let deviceInfo = this.state.deviceInfo
    deviceInfo.childId = value
    this.setState({deviceInfo: deviceInfo})
  }

  render() {
    return (      
      <View style={styles.container}>
        
        <HeadPanel title={"CareO Setting"} onPress={() => {this.props.navigation.navigate(DEVICE_LIST_PAGE_NAME)}}/>

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}>

          <View style={styles.contentView}>
            
            <View flex={6} style={{marginTop: DEVICE_HEIGHT / 50, flexDirection: 'column', justifyContent: 'space-between'}}>

              <TextFieldWithDevider
                title="UUID"
                value={this.state.deviceInfo.uuid}
                style={{paddingTop: 0, paddingLeft: 50}}
              />
              <TextFieldWithDevider
                title="Serial Number"
                value={this.state.deviceInfo.serialNumber}
              />
              <TextFieldWithDevider
                title="Battery"
                value={this.state.deviceInfo.battery != null && this.state.deviceInfo.battery != -1 ? this.state.deviceInfo.battery : ''}
              />
              <TextFieldWithDevider
                title="Last Sync Time"
                value={this.state.deviceInfo.lastSyncTime}
              />
              <TextFieldWithDevider
                title="Last Notification"
                value={this.state.lastNotification}
              />
              <SelectFieldWithDevider
                title="Child Name"
                value={this.state.deviceInfo.childId}
                items={this.state.childList}
                onValueChange={(value, index) => this.onChangeChildName(value)}
              />
            </View>

            <View flex={1} style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <TouchableOpacity 
                style={styles.buttonStyle}
                onPress={() => this.onSave()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B' ]}
                  style={styles.linearGradient}
                  start={{x: 0.4, y: 0}}
                  end={{x: 0.4, y: 1.5}}
                >
                <Text style={styles.buttonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.buttonStyle}
                onPress={() => this.onDelete()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#FF9BA2', '#FA5865' ]}
                  style={styles.linearGradient}
                  start={{x: 0.4, y: 0}}
                  end={{x: 0.4, y: 1.5}}
                >
                <Text style={styles.buttonText}>Delete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
          </View>
        </KeyboardAwareScrollView>
      </View>

    )
  }
}

export default compose(
  connect(
    state => ({
      selUUID: state.device.selUUID,
      userInfo: state.auth.userInfo
    }),
    dispatch => ({
      setChildList: (childList) => dispatch(setChildList(childList)),
    }),
  )
)(DeviceSettingScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // flexDirection: 'column',
  },
  contentView: {
    flex:1, 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    // height: (DEVICE_HEIGHT - HAED_PANEL_HEIGHT - BOTTOM_TAB_HEIGHT - 100),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: .25,
    shadowRadius: 3.84,
    elevation: 5,
    
    marginBottom: DEVICE_HEIGHT / 10
  },
  buttonStyle: {
    height: 40, width: 100, 
    alignItems: 'center', 
    marginHorizontal: 30
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
})


