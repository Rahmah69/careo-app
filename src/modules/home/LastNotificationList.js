import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'

import moment from "moment"
import {useSelector} from 'react-redux'

import { fonts, colors } from '../../styles'
import timer from 'react-native-timer'
import Notification from '../notification/Notification'
import {db} from '../Database'


export default LastNotificationList = (props) => {

  const lastNotiList = useSelector(state => state.notification.lastNotiList)

  return (
    <ScrollView style={props.style}>
      {
      lastNotiList.map((item, index) => {
        console.log(">>>> notification map - item: ", item)
        return <View style={{height: 100}}>
        <Notification 
          notification={item}
          isBatteryShown={true}
          isConnectionShown={true}
          style={styles.notificationSection}
        />
        <View style={styles.divider} />
        </View>
      })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  notificationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row'
  },
  divider: {
    borderBottomColor: '#2680EB',
    opacity: 0.2,
    borderBottomWidth: 1,
    marginHorizontal: 1,
  },
})
