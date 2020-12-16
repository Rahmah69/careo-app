import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'

import moment from "moment"

import { fonts, colors } from '../../styles'
import timer from 'react-native-timer'
import Notification from '../components/Notification'
import {db} from '../Database'

export default LastNotificationList = (props) => {

  const REFRESH_TIMER_NAME = 'REFRESH_TIMER'
  const [lastNotifications, setLastNotifications] = useState([])
  const [refreshTimer, setRefreshTimer] = useState(null)

  const refreshNotification = () => {
  // get last notifications
  // let notifications = db.getLastNotificationsByConnectedDevice()

    console.log(">>> refreshNotification is called")
    // testing
    let notifications = [
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-10, 'seconds').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Eating',
        confirmed: 1,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-1, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Cleaning',
        confirmed: 0,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-5, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Sleeping',
        confirmed: 1,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-2, 'hours').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Sleeping',
        confirmed: 0,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 80,
        time: moment().add(-5, 'days').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Eating',
        confirmed: 1,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-2, 'months').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Cleaning',
        confirmed: 1,
        childName: 'Milian'
      },
      {
        serialNumber: 'F2155293',
        battery: 90,
        time: moment().add(-1, 'years').format('YYYY-MM-DD hh:mm:ss'),
        content: 'Cleaning',
        confirmed: 1,
        childName: 'Milian'
      },
    ]

    // recalculate 
    let curTime = moment()
    for (let notification of notifications) {
      let time = moment(notification.time, "YYYY-MM-DD hh:mm:ss")

      let yearAgo = curTime.diff(time, 'years')
      if (yearAgo > 0) {
        if (yearAgo == 1)
          notification.time = yearAgo + 'year ago'
        else
          notification.time = yearAgo + 'years ago'
        continue
      }

      let monthAgo = curTime.diff(time, 'months')
      if (monthAgo > 0) {
        if (monthAgo == 1)
          notification.time = monthAgo + 'month ago'
        else
          notification.time = monthAgo + 'months ago'
        continue
      }

      let dayAgo = curTime.diff(time, 'days')
      if (dayAgo > 0) {
        if (dayAgo == 1)
          notification.time = dayAgo + 'day ago'
        else
          notification.time = dayAgo + 'days ago'
        continue
      }

      let hourAgo = curTime.diff(time, 'hours')
      if (hourAgo > 0) {
        if (hourAgo == 1)
          notification.time = hourAgo + 'hr ago'
        else
          notification.time = hourAgo + 'hrs ago'
        continue
      }

      let minAgo = curTime.diff(time, 'minutes')
      if (minAgo > 0) {
        if (minAgo == 1)
          notification.time = minAgo + 'min ago'
        else
          notification.time = minAgo + 'mins ago'
        continue
      }

      let secondAgo = curTime.diff(time, 'seconds')
      if (secondAgo >= 0) {
        if (secondAgo == 0)
          secondAgo = 1

        if (secondAgo == 1)
          notification.time = secondAgo + 'sec ago'
        else
          notification.time = secondAgo + 'secs ago'
      }
    }

    setLastNotifications(notifications)
    console.log(">>> Last Notifications: ", lastNotifications)
  }

  // component mount and unmount
  useEffect(() => {
      console.log(">>> Last Notification List Component Mount")

      const refTimer = timer.setTimeout(REFRESH_TIMER_NAME, refreshNotification, 5000)
      timer.timeoutExists(REFRESH_TIMER_NAME)
      setRefreshTimer(refTimer)
        
      return () => {
        console.log(">>> Last Notification List Component Unmount")

        if (refreshTimer != null) {
          clearTimeout(refreshTimer)
          console.log(">>> Refresh Timer Removed")
        }
      }
  })  
  

  return (
    <ScrollView style={props.style}>
      {
      lastNotifications.map((item, index) => {
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
