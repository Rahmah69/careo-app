import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { compose } from 'recompose'
import { useSelector } from 'react-redux'

import StackNavigationData from './stackNavigationData';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100 + '%',
    height: Header.height,
  },
});

export default function NavigatorView(props) {
  // if (authState.isLoggedIn || authState.hasSkippedLogin) {
  //     return <AppNavigator />;
  // }
  // return <AuthScreen />;

  const headerShown = useSelector(state => state.navigation.headerShown)

  const headerLeftComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.toggleDrawer()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Image
          source={require('../../../assets/images/drawer/menu.png')}
          resizeMode="contain"
          style={{
            height: 20,
          }}
        />
      </TouchableOpacity>    
    )
  }

  return (
    <Stack.Navigator>
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx+1}`}
          name={item.name} 
          component={item.component} 
          options={{
            headerLeft: item.headerLeft || headerLeftComponentMenu,
            headerShown: headerShown,
            gestureEnabled: false,   
            headerBackground: () => (
              <Image style={styles.headerImage} source={item.headerBackground.source} />
            ),
            headerTitleStyle: item.headerTitleStyle,
          }} 
        />
      ))}
    </Stack.Navigator>
  );
}

