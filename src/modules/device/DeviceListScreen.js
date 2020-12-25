import { connect } from 'react-redux'
import { compose } from 'recompose'
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { colors, fonts } from '../../styles'

import batteryImg from "../../../assets/images/icons/battery.png"

import HeadPanel from '../components/HeadPanel'
import LinearGradient from 'react-native-linear-gradient'
import { addDevice, updateDevice, removeDevice, setSelDevIndex, setCurDevice, setSelUUID } from './DeviceState'
import { BOTTOM_TAB_HEIGHT, DEVICE_HEIGHT, DEVICE_WIDTH, HAED_PANEL_HEIGHT } from '../Constant'
import { DEVICE_SETTING_PAGE_NAME } from '../navigation/stackNavigationData'

class DeviceListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      availDevList: [
        {uuid: 'aaaaXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'},
        {uuid: 'bbbbXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '2FUWIF', childName: '', childPhoto: ''},
        {uuid: 'ccccXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'},
        {uuid: 'ddddXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childName: '', childPhoto: ''},
        {uuid: 'eeeeXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '5FUWIF', childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'},
        {uuid: 'ffffXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '', childName: '', childPhoto: ''},
        {uuid: 'ggggXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '7FUWIF', childName: '', childPhoto: ''},
        {uuid: 'hhhhXXXX-6e7d-4601-bda2-bffaa68956ba', serialNumber: '8FUWIF', childName: '', childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'},
      ],
      curDevice: this.props.curDevice,
      // curDevice: null
    }
  }

  componentDidMount() {
    console.log(">>> Child List Screen Did Mount")

    this.onFocusPage = this.props.navigation.addListener('focus', async () => {
      console.log(">>> device list page focus / cur device: ", this.state.curDevice)
      await this.setState({deviceList: this.props.deviceList})
      this.onScan()
    })
  }

  onScan = () => {

  } 

  onConnect = () => {

  }

  onViewDevice = async (uuid) => {
    console.log("onViewDevice / uuid: ", uuid)

    await this.props.setSelUUID(uuid)
    console.log("onViewDevice / props selDevIndex: ", this.props.selUUID)
    this.props.navigation.navigate(DEVICE_SETTING_PAGE_NAME)
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
            onPress={() => this.onConnect()}
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
    console.log("CARD_TEXT_WIDTH: ", CARD_TEXT_WIDTH)

    console.log("renderConnectedCareOItem")
    let content = item.uuid
    if (item.serialNumber != null && item.serialNumber != '')
      content = item.serialNumber
    if (item.childName != null && item.childName != '')
      content = item.childName

    return (
      <View style={{height: 100, marginTop: 20}}>
        <Text style={{marginLeft: 20, color: '#125171', fontSize: 16, fontWeight: 'bold', }}>Connected CareO</Text>
        <TouchableOpacity style={styles.card}>
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
                {item.battery != null ? item.battery + '%' : 'NaN'}
              </Text>  
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    let height = DEVICE_HEIGHT - HAED_PANEL_HEIGHT - BOTTOM_TAB_HEIGHT
    if (this.state.curDevice != null)
      height -= 160

    return (      
      <View style={styles.container}>
        <HeadPanel title="Device List"/>

        <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{flexDirection: 'column', justifyContent: 'flex-start', height: height}}>
            <View style={{marginLeft: 20, marginTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start'}}>
              <Text style={{textAlignVertical: 'center', color: '#125171', fontSize: 16, fontWeight: 'bold', marginRight: 20, marginTop: 5}}>Available CareO List</Text>

              <TouchableOpacity
                style={{ height: 30, width: 80, }}
                onPress={() => this.onScan()}
                activeOpacity={.5}
              >
                <LinearGradient
                  colors={[ '#6FDE99', '#28A49B']}
                  style={styles.linearGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 0.5, y: 0.6}}
                >
                  <Text style={{fontSize: 15, color: '#FFF', textAlign: 'center'}}>Scan</Text>
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
                
      </View>
    )
  }
}

export default compose(
  connect(
    state => ({
      deviceList: state.device.deviceList,
      selDevIndex: state.device.selDevIndex,
      curDevice: state.device.curDevice,
    }),
    dispatch => ({
      addDevice: (device) => dispatch(addDevice(device)),
      updateDevice: (device) => dispatch(updateDevice(device)),
      removeDevice: (uuid) => dispatch(removeDevice(uuid)),
      setSelDevIndex: (selDevIndex) => dispatch(setSelDevIndex(selDevIndex)),
      setCurDevice: (curDevice) => dispatch(setCurDevice(curDevice)),
      setSelUUID: (selUUID) => dispatch(setSelUUID(selUUID)),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 10,
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
})
