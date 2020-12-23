import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import NotificationManager from 'react-native-check-notification-enable'

import TurnOnNotification from '../TurnOnNotification'
import LoginScreen from '../auth/LoginScreen'
import RegisterScreen from '../auth/RegisterScreen'
import TabNavigator from './MainTabNavigator'
import NotificationListScreen from '../notification/NotificationListScreen'
import ChildListScreen from '../child/ChildListScreen'
import ChildProfileScreen from '../child/ChildProfileScreen'
import DeviceListScreen from '../device/DeviceListScreen'
import DeviceSettingScreen from '../device/DeviceSettingScreen'

import { colors, fonts } from '../../styles'

export const MAIN_TAB_NAV_NAME        = 'MainScreen'
export const LOGIN_PAGE_NAME          = 'Login'
export const REGISTER_PAGE_NAME       = 'Register'
export const NOTI_HISTORY_PAGE_NAME   = 'Notification History'
export const SETTING_PAGE_NAME        = 'Setting'
export const CHILD_LIST_PAGE_NAME     = 'Child List'
export const CHILD_PROFILE_PAGE_NAME  = 'Child Profile'
export const DEVICE_LIST_PAGE_NAME    = 'Device List'
export const DEVICE_SETTING_PAGE_NAME = 'Device Setting'

const headerLeftComponent = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Image
        source={require('../../../assets/images/icons/toback.png')}
        resizeMode="contain"
        style={{
          height: 20,
        }}
      />
    </TouchableOpacity>    
  )
}

const headerBackground = require('../../../assets/images/topBarBg.png')

console.log(" called this page whenever every page rendered")

export const ExternalStackNavigationData = [
  {
    name: 'Turn On Notification',
    component: TurnOnNotification,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: MAIN_TAB_NAV_NAME,
    component: TabNavigator,
    headerLeft: null,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Login',
    component: LoginScreen,
    headerLeft: null,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Register',
    component: RegisterScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Child List',
    component: ChildListScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Notification History',
    component: NotificationListScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Settings',
    component: NotificationListScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
]

export const ChildStackNavigationData = [
  {
    name: 'Child List',
    component: ChildListScreen,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Child Profile',
    component: ChildProfileScreen,
    headerLeft: null,
    headerBackground: { source: headerBackground },
    headerShown: false,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
]

// export const DeviceStackNavigationData = [
//   {
//     name: 'Device List',
//     component: DeviceListScreen,
//     headerBackground: { source: headerBackground },
//     headerShown: false,
//     headerTitleStyle: {
//       fontFamily: fonts.primaryRegular,
//       color: colors.white,
//       fontSize: 18,
//     },
//   },
//   {
//     name: 'Device Setting',
//     component: DeviceSettingScreen,
//     headerLeft: null,
//     headerBackground: { source: headerBackground },
//     headerShown: false,
//     headerTitleStyle: {
//       fontFamily: fonts.primaryRegular,
//       color: colors.white,
//       fontSize: 18,
//     },
//   },
// ]
