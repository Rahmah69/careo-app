import * as React from 'react';
import { Text, View, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../styles';
import {useSelector} from 'react-redux'

const iconMenu = require('../../../assets/images/tabbar/menubutton.png');

import PagesScreen from '../pages/PagesViewContainer';
import tabNavigationData from './tabNavigationData';

const Tab = createBottomTabNavigator();

export default function BottomTabs(props) {

  const openSideMenuBar = () => {
    console.log(">>> openSideMenuBar")
    props.navigation.toggleDrawer()
  }

  return (
    <Tab.Navigator tabBarOptions={{
      style: {height: Platform.OS === 'ios' ? 90 : 50},
      showLabel: false,
      }}>
      {tabNavigationData.map((item, idx) => (
        <Tab.Screen 
          key={`tab_item${idx+1}`}
          name={item.name}
          component={item.component}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabBarItemContainer}>
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
                />
              </View>
            ),
          }}
        />        
      ))}
      <Tab.Screen 
          key={`tab_item99`}
          name='menu'
          component={PagesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabBarItemContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    openSideMenuBar()
                  }}>
                <Image
                  resizeMode="contain"
                  source={iconMenu}
                  style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
                />
                </TouchableOpacity>
              </View>
            ),   
          }}
        />   
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
    paddingHorizontal: 10,
    bottom: Platform.OS === 'ios' ? -5 : 0,
  },
  tabBarIcon: {
    width: 35,
    height: 35,
  },
  tabBarIconFocused: {
    tintColor: colors.primary,
  },
});
