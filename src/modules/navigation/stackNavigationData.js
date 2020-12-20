import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import NotificationManager from 'react-native-check-notification-enable'

import TurnOnNotification from '../TurnOnNotification'
import LoginScreen from '../auth/LoginScreen'
import RegisterScreen from '../auth/RegisterScreen'
import TabNavigator from './MainTabNavigator'
import NotificationListScreen from '../notification/NotificationListScreen'
import ChildListScreen from '../child/ChildListScreen';

// import ProfileScreen from '../profile/ProfileViewContainer'
// import ArticleScreen from '../article/ArticleViewContainer'
// import ChatScreen from '../chat/ChatViewContainer'
// import MessagesScreen from '../chat/MessagesViewContainer'
// import ChartsScreen from '../charts/ChartsViewContainer'
// import AuthScreen from '../auth/AuthViewContainer'

import { colors, fonts } from '../../styles'
import UserProfileScreen from '../auth/UserProfileScreen'

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
        source={require('../../../assets/images/icons/arrow-back.png')}
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

const StackNavigationData = [
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
    name: 'MainScreen',
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
    name: 'UserProfile',
    component: UserProfileScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
]

export default StackNavigationData
