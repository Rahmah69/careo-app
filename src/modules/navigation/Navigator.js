import * as React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import RootNavigatorView from './RootNavigation'
import { useSelector, useDispatch } from 'react-redux'
import { setIsLoggedIn, setIsSignedUp } from '../auth/AuthState'
import { setChildList } from '../child/ChildState'
import { setDeviceList } from '../device/DeviceState'
import { setNotiList, setLastNotiList } from '../notification/NotificationState'

import { setGestureEnable, setHeaderShown } from './NavigationState'
import NotificationListScreen from '../notification/NotificationListScreen'

const defaultAvatar = require('../../../assets/images/icons/default-avatar.png')
const iconHome = require('../../../assets/images/drawer/home.png')
const iconCalendar = require('../../../assets/images/drawer/calendar.png')
const iconGrids = require('../../../assets/images/drawer/grids.png')
const iconPages = require('../../../assets/images/drawer/pages.png')
const iconComponents = require('../../../assets/images/drawer/components.png')
const iconSettings = require('../../../assets/images/drawer/settings.png')
const iconBlog = require('../../../assets/images/drawer/blog.png')

const drawerData = [
  {
    name: 'Notification History',
    icon: iconHome,
  },
  {
    name: 'Settings',
    icon: iconCalendar,
  },
  {
    name: 'Help',
    icon: iconGrids,
  },
  {
    name: 'Privacy Policy',
    icon: iconPages,
  },
  {
    name: 'Terms Of Services',
    icon: iconComponents,
  },
]

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props) {

  const dispatch = useDispatch()

  const logout = () => {    
    dispatch(setIsLoggedIn(false))
    dispatch(setIsSignedUp(false))
    dispatch(setHeaderShown(false))
    dispatch(setGestureEnable(false))
    dispatch(setChildList([]))
    dispatch(setDeviceList([]))
    dispatch(setNotiList([]))
    dispatch(setLastNotiList([]))


    props.navigation.navigate('Login')
  }

  const gotoProfilePage = () => {
    // props.navigation.navigate('UserProfile')
  }

  const gotoNotiListPage = () => {
    props.navigation.navigate('Login')
  }

  const userInfo = useSelector(state => state.auth.userInfo)

  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={userInfo.imagePath != null && userInfo.imagePath != '' ? {url: userInfo.imagePath} : defaultAvatar}
        />
        <View style={{ paddingLeft: 15 }}>
          <Text style={styles.userName} onPress={() => gotoProfilePage()}>{userInfo.name}</Text>
          <Text style={{ marginTop: 10, color: '#4BC1FD' }}>{userInfo.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx+1}`}
          label={() => (
            <View style={styles.menuLabelFlex}>
              <Text style={styles.menuTitle}>{item.name}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate(item.name)}
        />
      ))}

      <View style={styles.divider} />

      <DrawerItem
        label={() => (
          <View style={styles.menuLabelFlex}>
            <Text style={styles.logout}>Log Out</Text>
          </View>
        )}
        onPress={() => logout()}
      />
    </DrawerContentScrollView>
  )
}

export default function App() {

  const gestureEnable = useSelector(state => state.navigation.gestureEnable)

  return (
    <Drawer.Navigator
      drawerStyle={{
        // backgroundColor: '#3C38B1',
        backgroundColor: '#fff',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        gestureEnabled: gestureEnable
      }}
    >
      <Drawer.Screen name="Homes" component={RootNavigatorView} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125171'
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row'
  },
  logout: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF2E2E'
  },
  userName: {
    color: '#125171',
    fontSize: 20,
    fontWeight: 'bold'
  },
  divider: {
    borderBottomColor: '#2680EB',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10
  },
})
