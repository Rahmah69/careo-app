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
import RNPickerSelect from 'react-native-picker-select'

import { fonts, colors } from '../../styles'
import {db} from '../Database'

import HeadPanel from '../components/HeadPanel'

import defaultAvatarImg from '../../../assets/images/icons/default-avatar.png'
import {DEVICE_WIDTH, DEVICE_HEIGHT, HAED_PANEL_HEIGHT, BOTTOM_TAB_HEIGHT, INPUT_FIELD_HEIGHT, isWideModel} from '../Constant'

import PickerImage from '../components/PickerImage'
import InputFieldWithDevider from '../components/InputFieldWithDevider'
import SelectFieldWithDevider from '../components/SelectFieldWithDevider'

import { removeChild, setChildList } from './ChildState'

class ChildProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      childInfo: {
        id: -1, name: '', imagePath: '', age: 0, bloodType: '', condition: '', relationship: '', uuid: '', serialNumber: '', userId: this.props.userInfo.id
      },
      originUUID: '',
      showPass: true,
      confirm: '',
      isNameEditing: false,
      uuidSerialNumList:[],
      uuidItemList: [],
      serialNumItemList: [],
    }

    console.log("Child Profile sel index: ", this.props.selChildIndex)
    this.nameInputField = React.createRef()
  }

  componentDidMount = async () => {

    if (this.props.selChildIndex == -1) {
      this.setState({isNameEditing: true})
      this.nameInputField.focus()
    }

    // the function for refresh when the page is focused.
    this.onFocusPage = this.props.navigation.addListener('focus', async () => {

      if (this.props.selChildIndex != -1) {
        let childInfo = JSON.parse(JSON.stringify(this.props.childList[this.props.selChildIndex]))
        let originUUID = this.props.childList[this.props.selChildIndex].uuid

        this.setState({childInfo: childInfo, originUUID: originUUID})
      }

      // get device id list from db      
      let uuidSerialNumList = await db.getDeviceIDList(this.props.userInfo.id)
      console.log(">>> Child Profile Component Focus: ", uuidSerialNumList)
      let uuidList = [], serialNumList = []
      for (let deviceIdInfo of uuidSerialNumList) {
        if (!uuidList.includes(deviceIdInfo.uuid))
          uuidList.push(deviceIdInfo.uuid)

        if (deviceIdInfo.serialNumber != "" && !serialNumList.includes(deviceIdInfo.serialNumber))
          serialNumList.push(deviceIdInfo.serialNumber)

      }

      uuidList.sort()
      serialNumList.sort()
      console.log(">>> uuid list: ", uuidList)
      console.log(">>> serial number list: ", serialNumList)

      let uuidItemList = [], serialNumItemList = []
      for (let uuid of uuidList) {
        uuidItemList.push({label: uuid, value: uuid})
      }
      for (let serialNum of serialNumList) {
        serialNumItemList.push({label: serialNum, value: serialNum})
      }
      console.log(">>> uuid list: ", uuidList)
      console.log(">>> serial number list: ", serialNumList)

      this.setState({uuidSerialNumList: uuidSerialNumList, uuidItemList: uuidItemList, serialNumItemList: serialNumItemList}) 
    })
  }

  // update the origin child for new uuid
  updateOriginChildForNewUUID = async () => {
    let originUUID = this.state.originUUID != null ? this.state.originUUID : ''
    let newUUID = this.state.childInfo.uuid != null ? this.state.childInfo.uuid : ''

    console.log(">>> origin uuid: ", originUUID)
    console.log(">>> new uuid: ", newUUID)
    if (originUUID != newUUID && newUUID != '') {

      // find the child for originUUID
      let child = null
      for (let item of this.props.childList) {
        if (this.state.childInfo.id != item.id && item.uuid == newUUID) {
          child = item
          break
        }
      }

      // if the child exists, update child with uuid ''
      if (child != null) {

        console.log(">>> child: ", child)
        await db.updateChildWithUUID(child.id, '')
      } else {

        console.log(">>> no child with new uuid ")
      }
    }
  }

  onAdd = async () => {
    if (!this.isValidFields())
      return

    let childInfo = this.state.childInfo
    let result = await db.insertChild(childInfo)
    console.log("add child result: ", result)
    
    if (result.rowsAffected == 1) {
      Alert.alert(
        'Success',
        'The child info has been added.',
        [
          { text: 'OK', onPress: () => {this.props.navigation.goBack()} }
        ],
        { cancelable: false }
      )
      
      // update the origin child with new uuid
      await this.updateOriginChildForNewUUID()

      let childList = await db.listChild(this.props.userInfo.id)
      this.props.setChildList(childList)

    } else {

      Alert.alert(
        'Failed',
        'Adding child info has failed.',
        [
          { text: 'OK', onPress: () => {} }
        ],
        { cancelable: false }
      )
    }
  }
  

  onSave = async () => {
    if (!this.isValidFields()) 
      return

    let childInfo = this.state.childInfo
    let result = await db.updateChild(childInfo)
    console.log("save child result: ", result)
    
    if (result.rowsAffected == 1) {
      console.log("updated child list: ", this.props.childList)

      Alert.alert(
        'Success',
        'The child info has been updated.',
        [
          { text: 'OK', onPress: () => {this.props.navigation.goBack()} }
        ],
        { cancelable: false }
      )
      
      // update the origin child with new uuid
      await this.updateOriginChildForNewUUID()

      let childList = await db.listChild(this.props.userInfo.id)
      this.props.setChildList(childList)

    } else {

      Alert.alert(
        'Failed',
        'Updating child info has failed.',
        [
          { text: 'OK', onPress: () => {} }
        ],
        { cancelable: false }
      )
    }
  }

  onDelete = () => {
    Alert.alert(
      "Confirm",
      "Are you sure to delete this child's information?",
      [
        {
          text: "Yes",
          onPress: async () => {
            let childId = this.state.childInfo.id
            console.log("deleting child information")
            let result = await db.deleteChild(childId)
            console.log(">>> deleting child result: ", result)
            this.props.removeChild(childId)

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

  isValidFields = () => {
    
    let childInfo = this.state.childInfo
    if (childInfo.name == '') {
      Alert.alert(
        'Empty',
        'The child name field is empty. Please input name',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return false
    }

    if (childInfo.age == '') {
      Alert.alert(
        'Empty',
        'The age field is empty. Please input age',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return false
    }

    if (childInfo.condition == '') {
      Alert.alert(
        'Empty',
        'The condition field is empty. Please input condition',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return false
    }

    if (childInfo.relationship == '') {
      Alert.alert(
        'Empty',
        'The relationship field is empty. Please input relationship',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      )
      return false
    }

    // check if duplicated child exists
    let childList = this.props.childList
    for (let el of childList) {
      if (el.id != childInfo.id && el.name == childInfo.name) {
        Alert.alert(
          'Duplicated',
          "The child's name already exists. Please input another child name",
          [
            { text: 'OK', onPress: () => {} }
          ],
          { cancelable: false }
        )
        return false
      }
    }

    return true
  }
  

  onChangeChildName = (value) => {
    console.log("onchange name:", value)
    let childInfo = this.state.childInfo
    childInfo.name = value
    this.setState({childInfo: childInfo})
  }

  onChangeAge = (value) => {
    console.log("onchange age:", value)
    let childInfo = this.state.childInfo
    childInfo.age = value
    this.setState({childInfo: childInfo})
  }

  onChangeBloodType = (value) => {
    console.log("onchange blood type:", value)
    let childInfo = this.state.childInfo
    childInfo.bloodType = value
    this.setState({childInfo: childInfo})
  }

  onChangeCondition = (value) => {
    console.log("onchange condition:", value)
    let childInfo = this.state.childInfo
    childInfo.condition = value
    this.setState({childInfo: childInfo})
  }

  onChangeRelationship = (value) => {
    console.log("onchange relationship:", value)
    let childInfo = this.state.childInfo
    childInfo.relationship = value
    this.setState({childInfo: childInfo})
  }

  onChangeSerialNumber = (value) => {
    console.log("onchange serial number:", value)
    let childInfo = this.state.childInfo
    childInfo.serialNumber = value
    this.setState({childInfo: childInfo})
  }

  onCloseSerialNumPicker = () => {
    let childInfo = this.state.childInfo
    if (childInfo.serialNumber == null) {
      childInfo.uuid = null

    } else {
      for (let deviceIdInfo of this.state.uuidSerialNumList) {
        if (deviceIdInfo.serialNumber == childInfo.serialNumber) {
          childInfo.uuid = deviceIdInfo.uuid
          break
        }
      }
    }

    this.setState({childInfo: childInfo})
  }

  onChangeUUID = (value) => {
    console.log("onchange uuid:", value)
    let childInfo = this.state.childInfo
    childInfo.uuid = value
    this.setState({childInfo: childInfo})
  }

  onCloseUUIDPicker = () => {
    let childInfo = this.state.childInfo
    if (childInfo.uuid == null) {
      childInfo.serialNumber = null

    } else {
      for (let deviceIdInfo of this.state.uuidSerialNumList) {
        if (deviceIdInfo.uuid == childInfo.uuid) {
          childInfo.serialNumber = deviceIdInfo.serialNumber
          break
        }
      }
    }

    this.setState({childInfo: childInfo})

  }

  onChildNamePressed = async () => {    
    await this.setState({ isNameEditing: true })
    this.nameInputField.focus()
  }

  onBlurOfUserName = (ev) => {
    console.log(">>> on blur of user name")
    if (this.state.childInfo.name != '')
      this.setState({ isNameEditing: false })
  }

  setPhotoUri = (uri) => {
    let childInfo = this.state.childInfo
    childInfo.imagePath = uri

    this.setState({childInfo: childInfo})
  }

  render() {
    return (      
      <View style={styles.container}>
        
        <HeadPanel title={this.props.selChildIndex == -1 ? "Add Child" : "Child Profile"} onPress={() => {this.props.navigation.navigate('Child List')}}/>

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}>

          <View style={styles.contentView}>
            <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: DEVICE_HEIGHT / 5}}>

              <PickerImage 
                style={{alignItems: 'center', justifyContent: 'center', width: 80, height: 120, marginTop: DEVICE_HEIGHT / 30}}
                pickerTitle="Select Avatar"
                imagePath={this.state.childInfo.imagePath}
                defaultImage={defaultAvatarImg}
                setImageUri={this.setPhotoUri} />

              {!this.state.isNameEditing && this.state.childInfo.name != '' ?
                <Text 
                  style={{color: '#125171', textAlign: 'center', fontSize: 25, fontWeight: 'bold', height: INPUT_FIELD_HEIGHT, marginTop: isWideModel() ? 10 : 40}}
                  onPress={()=> {this.onChildNamePressed()}}
                >
                  {this.state.childInfo.name}
                </Text>
                : 
                  <InputFieldWithDevider
                    title="Child Name"
                    value={this.state.childInfo.name}
                    registerInputField={(ref) => {this.nameInputField = ref}}
                    onChangeText={(value) => this.onChangeChildName(value)}
                    onBlur={(ev) => this.onBlurOfUserName(ev)}                    
                  />
              }
            </View>
            
            <View style={{marginTop: DEVICE_HEIGHT / 100, flexDirection: 'column', justifyContent: 'space-between'}}>

              <InputFieldWithDevider
                title="Age"
                value={this.state.childInfo.age}
                onChangeText={(value) => this.onChangeAge(value)}             
              />
              <InputFieldWithDevider
                title="Blood Type"
                value={this.state.childInfo.bloodType}
                onChangeText={(value) => this.onChangeBloodType(value)}             
              />
              <InputFieldWithDevider
                title="Condition"
                value={this.state.childInfo.condition}
                onChangeText={(value) => this.onChangeCondition(value)}             
              />
              <InputFieldWithDevider
                title="Relationship"
                value={this.state.childInfo.relationship}
                onChangeText={(value) => this.onChangeRelationship(value)}             
              />
              <SelectFieldWithDevider
                title="Serial Number"
                value={this.state.childInfo.serialNumber}
                items={this.state.serialNumItemList}
                onValueChange={(value, index) => this.onChangeSerialNumber(value)}
                onDonePress={this.onCloseSerialNumPicker}
                onClose={this.onCloseSerialNumPicker}
              />
              <SelectFieldWithDevider
                title="UUID"
                value={this.state.childInfo.uuid}
                items={this.state.uuidItemList}
                onValueChange={(value, index) => this.onChangeUUID(value)}
                onDonePress={this.onCloseUUIDPicker}
                onClose={this.onCloseUUIDPicker}
              />
            </View>

            {this.props.selChildIndex == -1 
            ?
            <View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity 
                style={styles.buttonStyle}
                onPress={() => this.onAdd()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B' ]}
                  style={styles.linearGradient}
                  start={{x: 0.4, y: 0}}
                  end={{x: 0.4, y: 1.5}}
                >
                <Text style={styles.buttonText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            :
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
            }
          </View>
        </KeyboardAwareScrollView>
      </View>

    )
  }
}

export default compose(
  connect(
    state => ({
      childList: state.child.childList,
      selChildIndex: state.child.selChildIndex,
      userInfo: state.auth.userInfo
    }),
    dispatch => ({
      setChildList: (childList) => dispatch(setChildList(childList)),
      removeChild: (childId) => dispatch(removeChild(childId)),
    }),
  )
)(ChildProfileScreen)

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


