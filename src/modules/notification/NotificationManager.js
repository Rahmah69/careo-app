
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification from "react-native-push-notification"
import {Platform} from 'react-native'

class NotificationManager {

  configure = (onRegister, onNotification, onOpenNotification) => {

    console.log("Notification Manager configure")

    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("Notification on register TOKEN:", token)
      },
    
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification)
    
        if (Platform.OS === 'ios') {
          if (notification.data.openedInForeground) {
            notification.userInteraction = true
          }

        } else {
          notification.userInteraction = true
        }

        if (notification.userInteraction) {
          console.log(" Notification User Action")
          onOpenNotification(notification)

        } else {
          onNotification(notification)
        }

        // Only call callback if not from foreground
        if (Platform.OS === 'ios') {
          if (!notification.data.openedInForeground) {
            notification.finish('backgroundFetchResultNoData')
          }

        } else {
          notification.finish('backgroundFetchResultNoData')
        }
        // process the notification
    
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData)
      },
    
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action)
        console.log("NOTIFICATION:", notification)
    
        // process the action
      },
    
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err)
      },
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    })
  }


  _buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "lc_launcher",
      smallIcon: options.smallIcon || "lc_launcher",
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || false,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data
    }
  }

  _buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || "view",
      category: options.category || "",
      userInfo: {
        id: id,
        item: data
      }
    }
  }

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /** Android Only Properties */
      ...this._buildAndroidNotification(id, title, message, data, options),
      /* IOS Only Properties */
      ...this._buildIOSNotification(id, title, message, data, options),
      /* IOS and Android Properties */
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false // If the notification was opened by the user from the notification area or not
    })
  }

  cancalAllLocalNotification = () => {
    if (Platform.OS === 'ios') {  
      PushNotificationIOS.removeAllDeliveredNotifications()

    } else {
      PushNotification.cancelAllLocalNotifications()
    }
  }

  unregister = () => {
    PushNotification.unregister()
  }
}

export const notificationManager = new NotificationManager()