import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'

import {getTimeDiffString} from '../Functions'

import { Text } from '../../components/StyledText'
import sleepingImg from "../../../assets/images/icons/sleeping.png"
import eatingImg from "../../../assets/images/icons/eating.png"
import cleaningImg from "../../../assets/images/icons/cleaning.png"
import batteryImg from "../../../assets/images/icons/battery.png"
import braceletImg from "../../../assets/images/icons/bracelet.png"
import checkedImg from "../../../assets/images/icons/checked.png"
import unCheckedImg from "../../../assets/images/icons/unchecked.png"

import {EATING_MSG, SLEEPING_MSG, CLEANING_MSG} from "../Constant"

export default Notification = (props) => {

  console.log(">>> Notification rendered: ", props.notification)
  const notification = props.notification
  const notiSectionFlex = !props.isBatteryShown && !props.isConnectionShown ? 5 : props.isBatteryShown || props.isConnectionShown ? 4 : 3

  return (
    <View style={props.style}>
      <View style={styles.notiSection}>
        <View flex={notiSectionFlex} style={styles.contentSection}>
          <View style={styles.contentImageSection}>
            {
              notification.content == EATING_MSG || notification.content == SLEEPING_MSG || notification.content == CLEANING_MSG
                ? <Image source={notification.content == EATING_MSG ? eatingImg : notification.content == SLEEPING_MSG ? sleepingImg : cleaningImg} 
                        style={styles.contentImage} />
                : <View/>
            }
          </View>
          <View flex={3} style={styles.contentTextSection}>
            <Text flex={1} style={{color: '#125171', fontSize: 14}}>
              {notification.childName != null && notification.childName != '' ? notification.childName : notification.serialNumber}
            </Text>
            <Text flex={2} style={{color: '#125171', fontSize: 18, fontWeight: 'bold'}}>
              {notification.content}
            </Text>
          </View>
        </View>

        {props.isBatteryShown ? 
          <View style={styles.batterySection}>
            <View style={styles.batteryImageSection}>
              <Image style={styles.batteryImage} source={batteryImg}/>
            </View>
            <Text style={styles.batteryText}>{notification.battery + '%'}</Text>
          </View>
        : <View/>
        }

        {props.isConnectionShown ? 
          <View style={styles.batterySection}>
            <View style={styles.batteryImageSection}>
              <Image style={styles.batteryImage} source={braceletImg} />
            </View>
            <Text style={styles.batteryText}>ON</Text>
          </View>
          : <View/>
        }
        
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Text style={{ fontSize: 13, textAlign: 'center', textAlignVertical: 'bottom',  color: '#125171', marginTop: 15, position: 'relative'}}>
          {getTimeDiffString(notification.time)}
        </Text>
        <View style={{ flex: 3, width: 35, justifyContent: 'center', resizeMode: 'stretch', flexDirection: 'row'}}>
          <Image style={{ flex: 1, height: 35, marginVertical: 10, resizeMode: 'stretch'}} 
                source={notification.confirmed ? checkedImg : unCheckedImg} />
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' 
  },
  notiSection: {
    flex: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },  
  contentSection: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  contentImageSection: {
    flex:1, flexDirection: 'column', height: 60
  },
  contentImage: {  
    flex: 1, width: 50, resizeMode: 'stretch' 
  },  
  contentTextSection: {
    flexDirection: 'column', justifyContent: 'center', alignItems: 'baseline', marginLeft: 10
  },
  batterySection: {
    flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
  },
  batteryImageSection: { 
    flex: 3, width: 30, justifyContent: 'center', resizeMode: 'stretch', flexDirection: 'row', marginTop: 5
  },
  batteryImage: { 
    flex: 1, height: 50, marginVertical: 10, resizeMode: 'stretch'
  },
  batteryText: {
    fontSize: 11, textAlign: 'center', textAlignVertical: 'bottom', marginBottom: 10, color: '#1C9E9C', position: 'relative'
  },
})
