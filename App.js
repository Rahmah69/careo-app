import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, LogBox, Alert } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import {notificationManager} from './src/modules/notification/NotificationManager'

export default function App() {
  
  LogBox.ignoreAllLogs()

  const onRegister = (token) => {
    console.log("APP notification onRegister: ", token)
  }

  const onNotification = (notify) => {
    console.log("APP onNotification: ", notify)
  }

  const onOpenNotification = (notify) => {
    console.log("APP onOpenNotification: ", notify)
    alert("Open Notification")
  }

  console.log("**************** APP Start ****************")
  notificationManager.configure(onRegister, onNotification, onOpenNotification)

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate
          loading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
