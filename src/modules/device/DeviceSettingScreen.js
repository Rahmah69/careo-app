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
import SelectFieldWithDevider from '../components/SelectFieldWithDevider'

import { updateChild } from '../child/ChildState'
import { updateDevice, removeDevice, setSelIndex } from './DeviceState'
import { DEVICE_LIST_PAGE_NAME } from '../navigation/stackNavigationData'
import TextFieldWithDevider from '../components/TextFieldWithDevider'

class DeviceSettingScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deviceInfo: {
        uuid: this.props.selUUID,
        serialNumber: '',
        battery: NaN,
        lastSyncTime: '',
        lastNotification: '',
        childId: 0,
        isConnected: false,
        userId: this.props.userInfo.id
      },
      selDevIndex: -1,
      selChildId: -1,
      deviceChildId: -1,
      childList: []
    }

    console.log("DeviceSettingScreen constructor selDevUUID: ", this.props.selUUID)
    console.log("DeviceSettingScreen constructor device List: ", this.props.deviceList)
  }

  componentDidMount = async () => {

    console.log("DeviceSettingScreen Component Did Mount")

    let uuid = this.props.selUUID
    this.props.deviceList.map((device, index) => {
      if (device.uuid = uuid) {
        this.setState({deviceInfo: device, selDevIndex: index})
      }
    })

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

    this.setState({childList: childList, deviceChildId, deviceChildId, selChildId: deviceChildId})

  }  

  onSave = async () => {

    // let deviceInfo = this.state.deviceInfo
    // let result = await db.updateChild(deviceInfo)
    // console.log("save child result: ", result)
    
    // if (result.rowsAffected == 1) {
    //   await this.props.updateChild(deviceInfo)

    //   console.log("updated child list: ", this.props.childList)

    //   Alert.alert(
    //     'Success',
    //     'The child info has been updated.',
    //     [
    //       { text: 'OK', onPress: () => {this.props.navigation.goBack()} }
    //     ],
    //     { cancelable: false }
    //   )
    // } else {

    //   Alert.alert(
    //     'Failed',
    //     'Updating child info has failed.',
    //     [
    //       { text: 'OK', onPress: () => {} }
    //     ],
    //     { cancelable: false }
    //   )
    // }
  }

  onDelete = () => {
    Alert.alert(
      "Confirm",
      "Are you sure to remove this device's information?",
      [
        {
          text: "Yes",
          onPress: async () => {
            // go back
            // this.props.navigation.goBack()
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
        // let deviceInfo = this.state.deviceInfo
    // deviceInfo.name = value
    this.setState({selChildId: value})
  }

  render() {
    return (      
      <View style={styles.container}>
        
        <HeadPanel title={"CareO Setting"} onPress={() => {this.props.navigation.navigate(DEVICE_LIST_PAGE_NAME)}}/>

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          style={styles.container}>

          <View style={styles.contentView}>
            
            <View flex={6} style={{marginTop: DEVICE_HEIGHT / 50, flexDirection: 'column', justifyContent: 'space-between'}}>

              <TextFieldWithDevider
                title="UUID"
                value={this.state.deviceInfo.uuid}
                style={{paddingTop: 3}}
              />
              <TextFieldWithDevider
                title="Serial Number"
                value={this.state.deviceInfo.serialNumber}
              />
              <TextFieldWithDevider
                title="Battery"
                value={this.state.deviceInfo.battery}
              />
              <TextFieldWithDevider
                title="Last Sync Time"
                value={this.state.deviceInfo.lastSyncTime}
              />
              <TextFieldWithDevider
                title="Last Notification"
                value={this.state.deviceInfo.lastNotification}
              />
              <SelectFieldWithDevider
                title="Child Name"
                value={this.state.selChildId}
                items={this.state.childList}
                onValueChange={(value, index) => this.onChangeChildName(value)}
              />
            </View>

            <View flex={1} style={{marginTop: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
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
      deviceList: state.device.deviceList,
      selUUID: state.device.selUUID,
      userInfo: state.auth.userInfo
    }),
    dispatch => ({
      updateDevice: (device) => dispatch(updateDevice(device)),
      updateChild: (child) => dispatch(updateChild(child)),
      removeDevice: (uuid) => dispatch(removeDevice(uuid)),
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
    height: (DEVICE_HEIGHT - HAED_PANEL_HEIGHT - BOTTOM_TAB_HEIGHT - 100),
    width: '100%',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: .25,
    // shadowRadius: 3.84,
    // elevation: 5,
    
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


