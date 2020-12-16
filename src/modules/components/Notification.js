import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

import { Text } from '../../components/StyledText'
import sleepingImg from "../../../assets/images/sleeping.png"
import eatingImg from "../../../assets/images/eating.png"
import cleaningImg from "../../../assets/images/cleaning.png"
import batteryImg from "../../../assets/images/battery.png"
import braceletImg from "../../../assets/images/bracelet.png"
import checkedImg from "../../../assets/images/checked.png"
import unCheckedImg from "../../../assets/images/unchecked.png"

import {EATING_MSG, SLEEPING_MSG, CLEANING_MSG} from "../Constant"

export default Notification = (props) => {

  console.log(">>> Notification rendered: ", props.notification)
  const notification = props.notification
  const notiSectionFlex = !props.isBatteryShown && !props.isConnectionShown ? 5 : props.isBatteryShown || props.isConnectionShown ? 4 : 3
  return (
    <View style={props.style}>
      <View style={{flex: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View flex={notiSectionFlex} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View flex={1} style={{ flexDirection: 'column', height: 60}}>
            {
              notification.content == EATING_MSG || notification.content == SLEEPING_MSG || notification.content == CLEANING_MSG
                ? <Image source={notification.content == EATING_MSG ? eatingImg : notification.content == SLEEPING_MSG ? sleepingImg : cleaningImg} 
                        style={{ flex: 1, width: 50, resizeMode: 'stretch'}} />
                : <View/>
            }
          </View>
          <View flex={3} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'baseline', marginLeft: 10}}>
            <Text flex={1} style={{color: '#125171', fontSize: 14}}>
            {notification.childName}
            </Text>
            <Text flex={2} style={{color: '#125171', fontSize: 18, fontWeight: 'bold'}}>
            {notification.content}
            </Text>
          </View>
        </View>

        {props.isBatteryShown ? 
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <View style={{flex: 3, justifyContent: 'center', marginTop: 20}}>
              <Image source={batteryImg} styles={{ flex: 1, width: 50, height: 50, resizeMode: 'stretch' }}/>
            </View>
            <View flex={1} style={{justifyContent: 'center'}}>
              <Text style={{ flex: 1, color: '#1C9E9C', fontSize: 11, marginBottom: -15}}>{notification.battery + '%'}</Text>
            </View>
          </View>
         : <View/>
        }

        {props.isConnectionShown ? 
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: 3, width: 60, flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
              <Image source={braceletImg} styles={{ flex: 1, height: 50, justifyContent: 'center', resizeMode: 'stretch'}}/>
            </View>
            <View flex={1} style={{justifyContent: 'center'}}>
              <Text style={{ flex: 1, color: '#1C9E9C', fontSize: 11, textAlign: 'center', marginBottom: -15 }}>ON</Text>
            </View>
          </View>
        : <View/>
        }
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Text style={{ fontSize: 13, textAlign: 'center', textAlignVertical: 'bottom',  color: '#125171', marginTop: 15, position: 'relative'}}>
          {notification.time}
        </Text>
        <View style={{ flex: 3, width: 45, justifyContent: 'center', resizeMode: 'stretch', flexDirection: 'row'}}>
          <Image style={{ flex: 1, height: 45, marginVertical: 10, resizeMode: 'stretch'}} 
                source={notification.confirmed ? checkedImg : unCheckedImg} />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  notiSection: {
  },  
  contentImage: {   
  },  
  batteryText: {
  },
  batteryImage: { 
  },
  braceletImage: {  
  }
})
