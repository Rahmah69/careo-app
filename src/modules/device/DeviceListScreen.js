import { connect } from 'react-redux'
import { compose } from 'recompose'
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  AppState,
  Platform, 
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native'
import { colors, fonts } from '../../styles'
import {db} from '../Database'
import DeviceInfo from 'react-native-device-info'

import BleManager from 'react-native-ble-manager'
import LinearGradient from 'react-native-linear-gradient'
import ProgressCircle from 'react-native-progress-circle'
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'

import batteryImg from "../../../assets/images/icons/battery.png"

import HeadPanel from '../components/HeadPanel'
import { BOTTOM_TAB_HEIGHT, DEVICE_HEIGHT, DEVICE_WIDTH, HAED_PANEL_HEIGHT } from '../Constant'
import { DEVICE_SETTING_PAGE_NAME } from '../navigation/stackNavigationData'
import TextFieldWithDevider from '../components/TextFieldWithDevider'
import SelectFieldWithDevider from '../components/SelectFieldWithDevider'

import { setSelUUID, setDeviceList } from './DeviceState'
import { setChildList } from '../child/ChildState'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

class DeviceListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scanning: false,
      connecting: false,
      peripherals: new Map(),
      appState: '',
      availDevList: [
        // {uuid: 'aaaaXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childId: 1, childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png', isRegistered: true},
        // {uuid: 'bbbbXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: 'SFQIE2', childId: 0, childName: '', childPhoto: '', isRegistered: true},
        // {uuid: 'ccccXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childId: 1, childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png', isRegistered: true},
        // {uuid: 'ddddXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childId: 1, childName: '', childPhoto: '', isRegistered: false},
        // {uuid: 'eeeeXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: 'SFQIE5', childId: 1, childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png', isRegistered: true},
        // {uuid: 'ffffXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childId: 1, childName: '', childPhoto: '', isRegistered: true},
        // {uuid: 'ggggXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: 'SFQIE7', childId: 1, childName: '', childPhoto: '', isRegistered: true},
      ],
      // curDevice: this.props.curDevice,
      curDevice: null,
      selDeviceInfo: {
        uuid: '',
        serialNumber: '',
        childId: 0
      },
      percent: 0,
      bleEnable: false,
      connectModalVisible: false,
      childList: [],
    }

    this.scanCount = 0
  }

  componentDidMount() {
    console.log(">>> Device List Screen Did Mount")
    AppState.addEventListener('change', this.handleAppStateChange)

    BleManager.start({showAlert: false})

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral )
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleScanFinished )
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral )
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic )

    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        this.setState({bleEnable: true})
        console.log("The bluetooth is already enabled or the user confirm")
      })
      .catch((error) => {
        // Failure code
        console.log("The user refuse to enable bluetooth")
    })

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }

    setTimeout(() => {
      this.startScan()
    }, 500)

    this.onFocusPage = this.props.navigation.addListener('focus', async () => {
      console.log(">>> device list page focus / cur device: ", this.state.curDevice)

      await this.getChildList()
      this.updateAvailDevList()
    })
  }

  componentWillUnmount() {    
    this.handlerDiscover.remove()
    this.handlerStop.remove()
    this.handlerDisconnect.remove()
    this.handlerUpdate.remove()
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length)
      })
    }
    this.setState({appState: nextAppState})
  }

  handleDisconnectedPeripheral = (data) => {
    console.log('Disconnected from ' + data.peripheral)
    let peripherals = this.state.peripherals
    let peripheral = peripherals.get(data.peripheral)
    if (peripheral) {
      peripheral.connected = false
      peripherals.set(peripheral.id, peripheral)
      this.setState({peripherals})
    }
  }

  handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value)
  }

  handleScanFinished = () => {
    console.log("scan finished")
    this.setState({ scanning: false })
  }

  handleDiscoverPeripheral = (peripheral) => {
    console.log("discovered peripheral: ", peripheral)
    if (!peripheral.advertising.isConnectable) 
      return

    if (this.state.curDevice != null && this.state.curDevice.uuid == peripheral.id)
      return

    // check if the uuid already exists in the avail dev list
    for (let devInfo of this.state.availDevList) {
      if (devInfo.uuid == peripheral.id)
        return
    }

    // add dev in the available dev list
    let availDev = {
      uuid: peripheral.id, serialNumber: '', childId: 0, childName: '', childPhoto: '', isRegistered: false
    }
    for (let devInfo of this.props.deviceList) {
      if (devInfo.uuid == peripheral.id) {
        availDev.serialNumber = devInfo.serialNumber
        availDev.childId = devInfo.childId
        availDev.childName = devInfo.childName
        availDev.childPhoto = devInfo.childPhoto
        availDev.isRegistered = true

        if (devInfo.isConnected) {
          return
        }

        break
      }
    }

    let availDevList = this.state.availDevList
    availDevList.push(availDev)
    this.setState({availDevList: availDevList})
    // console.log("discovered peripheral: ", peripheral.id, " , isConnectable: ", peripheral.advertising.isConnectable)
  }

  updateAvailDevList = () => {

    // update available device list
    let availDevList = this.state.availDevList
    for (let devInfo of availDevList) {
      let bMatchedChild = false

      for (let child of this.props.childList) {
        if (child.uuid == devInfo.uuid) {
          devInfo.childId = child.id
          devInfo.childName = child.name
          devInfo.childPhoto = child.imagePath
          bMatchedChild = true
          break
        }
      }

      if (!bMatchedChild) {
        devInfo.childId = 0
        devInfo.childName = ''
        devInfo.childPhoto = ''
      }
    }

    // update current connected device
    let curDevice = this.state.curDevice
    for (let child of this.props.childList) {
      if (child.uuid == curDevice.uuid) {
        curDevice.childId = child.id
        curDevice.childName = child.name
        curDevice.childPhoto = child.imagePath
        break
      }
    }

    this.setState({
      availDevList: availDevList,
      curDevice: curDevice
    })
  }

  startScan = async () => {
    // return 
    console.log("on Scan ")
    let curDevice = null
    let availDevList = []
    let deviceList = await db.listDevice(this.props.userInfo.id)

    if (!this.state.scanning) {
      this.scanCount = 0
      this.setState({availDevList: []})
      BleManager.scan([], 10, true).then((results) => {
        console.log('Scanning...')
        this.setState({scanning: true})
      })
    }

    return

    // console.log("on Scan dev list: ", deviceList)
    for (let device of deviceList) {
      let availDev = {
        uuid: device.uuid,
        serialNumber: device.serialNumber,
        childName: device.childName,
        childPhoto: device.childPhoto,
        isRegistered: true
      }

      if (device.isConnected == 1)
        curDevice = availDev
      else
        availDevList.push(availDev)
    }

    // console.log("availDevlist: ", availDevList)
    console.log("curDevice: ", curDevice)

    this.setState({availDevList: availDevList, curDevice: curDevice})
  } 

  stopScan = () => {
    this.setState({scanning: false, scanCount: 0})
  }

  getChildList = async () => {

    let childNameIDList = await db.getChildIdNameList(this.props.userInfo.id)
    console.log(">>> child list: ", childNameIDList)
    let childList = []
    childNameIDList.map((child) => {
      childList.push({label: child.name, value: child.id})
    })

    this.setState({childList: childList})
  }

  onConnect = (deviceInfo) => {
    console.log(">>> on connect: ", deviceInfo)
    this.setState({
      selDeviceInfo: deviceInfo, 
      connectModalVisible: true, 
      percent: 0
    })
  }

  onViewDevice = async (uuid) => {
    console.log("onViewDevice / uuid: ", uuid)

    await this.props.setSelUUID(uuid)
    console.log("onViewDevice / props selUUID: ", this.props.selUUID)
    this.props.navigation.navigate(DEVICE_SETTING_PAGE_NAME)
  }

  onShow = () => {
  }

  onChangeChildName = (value) => {
    console.log("onChangeChildName: ", value)
    let selDeviceInfo = {...this.state.selDeviceInfo}
    selDeviceInfo.childId = value
    this.setState({selDeviceInfo})
  }

  connectBle = () => {

    this.setState({connecting: true, percent: 5})

    BleManager.connect(this.state.selDeviceInfo.uuid)
    .then(async () => {
      console.log(">>> connected: ", this.state.selDeviceInfo.uuid)
      this.setState({percent: 50})
      let availDevList = this.state.availDevList

      let i = 0
      for (let devInfo of availDevList) {

        if (devInfo.uuid == this.state.selDeviceInfo.uuid) {

          console.log(">>> found dev info in available dev list ")

          devInfo.childId = this.state.selDeviceInfo.childId
          
          if (devInfo.childId != null && devInfo.childId != 0) {
            console.log(">>> found child info ")

            await db.updateChildWithUUID(devInfo.childId, devInfo.uuid)
            let childList = await db.listChild(this.props.userInfo.id)

            for (let child of childList) {
              if (devInfo.childId == child.id) {
                devInfo.childName = child.name
                devInfo.childPhoto = child.imagePath
                break
              }
            }

            await this.props.setChildList(childList)
          }

          // update isConnected of old device as false
          if (this.state.curDevice != null) {
            console.log(">>> update old device info ")
            await db.updateConnectedInfoOfDevice(this.state.curDevice.uuid, false)
            availDevList.push(this.state.curDevice)
          }

          let device = await db.getDevice(devInfo.uuid)
          if (device == null) {
            device = {
              uuid: devInfo.uuid,
              serialNumber: devInfo.serialNumber, 
              battery: -1, 
              lastSyncTime: '', 
              isConnected: true,
              childId: devInfo.childId,
              childName: devInfo.childName,
              childPhoto: devInfo.childPhoto,
              userId: this.props.userInfo.id
            }

            await db.insertDevice(device)

          } else {
            await db.updateConnectedInfoOfDevice(devInfo.uuid, true)
            device.isConnected = true
          }

          device.isRegistered = true

          availDevList.splice(i, 1)
          
          setTimeout(() => {
            this.setState({percent: 100})

            setTimeout(() => {
              this.setState({
                curDevice: device,
                availDevList: availDevList,
                connectModalVisible: false,
                connecting: false,
              })
            }, 500)

          }, 500)

          break
        }

        i++
      }
    })
    .catch((error) => {
      console.log("Connection Error: ", error)
      this.setState({
        connecting: false,
      })
      Alert.alert(
        'Failed',
        error,
        [
          { text: 'Close' }
        ]
      )
    })
  }

  closeModal = () => {
    this.setState({connectModalVisible: false})
  }

  renderAvailableCareOItem = ({item, index}) => {

    let content = item.uuid
    if (item.serialNumber != null && item.serialNumber != '')
      content = item.serialNumber
    if (item.childName != null && item.childName != '')
      content = item.childName

    return (
      <TouchableOpacity style={{...styles.card}} onPress={() => {this.onViewDevice(item.uuid)}}>
        <View style={styles.cardImageSection}>
          <Image source={{url: item.childPhoto}} style={styles.cardImage}/>
        </View>

        <View style={styles.cardContentSection}>
          <Text style={styles.cardText}>{content}</Text>
          
          <TouchableOpacity
            // style={styles.button}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 35,
              width: 80,
              borderRadius: 5,
              zIndex: 100,
            }}
            onPress={() => this.onConnect(item)}
            activeOpacity={.5}
          >
            <LinearGradient
              colors={[ '#6FDE99', '#28A49B']}
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 0.5, y: 0.6}}
            >
              <Text style={{fontSize: 15, color: '#FFF', textAlign: 'center'}}>Connect</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  renderConnectedCareOItem = (item) => {

    let content = item.uuid
    if (item.serialNumber != null && item.serialNumber != '')
      content = item.serialNumber
    if (item.childName != null && item.childName != '')
      content = item.childName

    return (
      <View style={{height: 100, marginTop: 20}}>
        <Text style={{marginLeft: 20, color: '#125171', fontSize: 16, fontWeight: 'bold', }}>Connected CareO</Text>
        <TouchableOpacity style={styles.card} onPress={() => {this.onViewDevice(item.uuid)}}>
          <View style={styles.cardImageSection}>
            <Image source={{url: item.childPhoto}} style={styles.cardImage}/>
          </View>

          <View style={styles.cardContentSection}>
            <Text flex={4} style={{...styles.cardText, width: styles.cardText.width + (BUTTON_WIDTH - BATTERY_WIDTH) }}>{content}</Text>
              
            <View style={{flexDirection: 'column', width: BATTERY_WIDTH, height: 60, alignItems: 'center' }}>
              <View style={{flex: 3, width: 30, justifyContent: 'center', resizeMode: 'stretch', flexDirection: 'row'}}>
                <Image style={{flex: 1, height: 45, resizeMode: 'stretch'}} source={batteryImg}/>
              </View>
              <Text style={{flex: 1, fontSize: 11, textAlign: 'center', textAlignVertical: 'bottom', color: '#1C9E9C', position: 'relative'}}>
                {item.battery != null && item.battery != -1 ? item.battery.toString() + '%' : 'NaN'}
              </Text>  
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    console.log(">>> Model: ", DeviceInfo.getModel())
    console.log(">>> Header Height: ", HAED_PANEL_HEIGHT)
    let height = DEVICE_HEIGHT - HAED_PANEL_HEIGHT - BOTTOM_TAB_HEIGHT
    if (this.state.curDevice != null)
      height -= 160

    return (      
      <View style={styles.container}>
        <HeadPanel title="Device List"/>

        <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
          <View style={{flexDirection: 'column', justifyContent: 'flex-start', height: height}}>
            <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start'}}>
              <Text style={{textAlignVertical: 'center', textAlign: 'left', color: '#125171', fontSize: 16, fontWeight: 'bold', marginRight: 20, marginTop: 5}}>Available CareO List</Text>

              <TouchableOpacity
                style={{ height: 30, width: 80, }}
                onPress={() => {this.startScan()}}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B']}
                  style={styles.linearGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 0.5, y: 0.6}}
                >
                  <Text style={{fontSize: 15, color: '#FFF', textAlign: 'center'}}>{"Scan"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <FlatList
              data={this.state.availDevList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderAvailableCareOItem}
            />
          </View>
          { this.state.curDevice != null ? this.renderConnectedCareOItem(this.state.curDevice) : <View/> }
        </View>

        <OrientationLoadingOverlay
          visible={this.state.scanning}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Scanning..."
        />

        <Modal 
          animationType="fade"
          transparent={true}
          onShow={this.onShow}
          visible={this.state.connectModalVisible}>
          <View style={styles.modalView}>
            <ProgressCircle
              percent={this.state.percent}
              radius={40}
              borderWidth={10}
              color="#3399FF"
              shadowColor="#999"
              bgColor="#fff"
            >            
              <Text style={{ fontSize: 18 }}>{this.state.percent + '%'}</Text>
            </ProgressCircle>

            <TextFieldWithDevider
              title="UUID"
              value={this.state.selDeviceInfo.uuid}
              style={{paddingTop: 0, paddingLeft: 50}}
            />                
            <TextFieldWithDevider
              title="Serial Number"
              value={this.state.selDeviceInfo.serialNumber}
            />
            <SelectFieldWithDevider
              title="Child Name"
              value={this.state.selDeviceInfo.childId}
              items={this.state.childList}
              onValueChange={(value, index) => this.onChangeChildName(value)}
            />                            
            
            <View style={{flexDirection: 'row', paddingTop: 20}}> 
              <TouchableOpacity
                flex={1}
                style={{height: 40, width: 100, alignItems: 'center', marginHorizontal: 30}}
                onPress={this.connectBle}
                activeOpacity={.5}>
                <LinearGradient
                    colors={[ '#6FDE99', '#28A49B']}
                    style={styles.linearGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 0.5, y: 0.6}}
                >
                  <Text style={{fontSize: 15, color: '#FFF', textAlign: 'center'}} disable={this.state.connecting}>Connect</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                flex={1}
                style={{height: 40, width: 100, alignItems: 'center', marginHorizontal: 30}}
                onPress={this.closeModal}
                activeOpacity={.5}>
                
                <LinearGradient
                    colors={[ '#FF9BA2', '#FA5865' ]}
                    style={styles.linearGradient}
                    start={{x: 0.4, y: 0}}
                    end={{x: 0.4, y: 1.5}}
                >
                  <Text style={{fontSize: 15, color: '#FFF', textAlign: 'center'}} disable={this.state.connecting}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
                
      </View>
    )
  }
}

export default compose(
  connect(
    state => ({
      deviceList: state.device.deviceList,
      childList: state.child.childList,
      curDevice: state.device.curDevice,
      userInfo: state.auth.userInfo,
    }),
    dispatch => ({
      setSelUUID: (selUUID) => dispatch(setSelUUID(selUUID)),
      setChildList: (childList) => dispatch(setChildList(childList)),
      setDeviceList: (deviceList) => dispatch(setDeviceList(deviceList))
    }),
  )
)(DeviceListScreen)

const CARD_HORZ_MARGIN = 20
const CARD_HORZ_PADDING = 10
const CARD_TEXT_HORZ_MARGIN = 10
const IMAGE_WIDTH = 50
const IMAGE_HEIGHT = IMAGE_WIDTH
const BUTTON_WIDTH = 80
const CARD_TEXT_WIDTH = DEVICE_WIDTH - (CARD_HORZ_MARGIN * 2) - (CARD_HORZ_PADDING * 2) - (CARD_TEXT_HORZ_MARGIN * 2) - IMAGE_WIDTH - BUTTON_WIDTH - 10
const BATTERY_WIDTH = 30

const MODAL_WIDTH = 350
const MODAL_HEIGHT = 400

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: CARD_HORZ_MARGIN,
    width: DEVICE_WIDTH - (CARD_HORZ_MARGIN * 2),
    shadowColor: '#444',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 1
    },
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: CARD_HORZ_PADDING,
    paddingVertical: 10
  },
  cardImageSection: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  cardImage: {
    backgroundColor: '#B9AEAE', 
    width: IMAGE_WIDTH, 
    height: IMAGE_HEIGHT, 
    resizeMode: 'stretch', 
    borderRadius: 40
  },
  cardContentSection: {
    flex: 5, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    flexDirection: 'row', 
    marginLeft: 10
  },
  cardText: {
    textAlign: 'left', 
    fontSize: 13, 
    color: '#125171',
    width: CARD_TEXT_WIDTH,
    // backgroundColor: '#AAA',
    marginRight: 10
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: BUTTON_WIDTH,
    borderRadius: 5,
    zIndex: 100,
  },
  linearGradient: {
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 10,
    width: '100%',
    height: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10, 
    paddingHorizontal: 15,
    width: MODAL_WIDTH,    
    height: MODAL_HEIGHT,
    marginHorizontal: (DEVICE_WIDTH - MODAL_WIDTH) / 2,
    marginVertical: (DEVICE_HEIGHT - MODAL_HEIGHT) / 2,
    alignItems: "center",
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
})
