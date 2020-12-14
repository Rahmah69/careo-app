import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import moment from "moment"

import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import {useDispatch, useSelector} from 'react-redux'
import { setGestureEnable, setHeaderShown } from '../navigation/NavigationState';
import {DEVICE_HEIGHT} from '../Constant'
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen({ isExtended, setIsExtended }) {
  // const rnsUrl = 'https://reactnativestarter.com';
  // const handleClick = () => {
  //   Linking.canOpenURL(rnsUrl).then(supported => {
  //     if (supported) {
  //       Linking.openURL(rnsUrl);
  //     } else {
  //       console.log(`Don't know how to open URI: ${rnsUrl}`);
  //     }
  //   });
  // };

  const userInfo = useSelector(state => state.auth.userInfo)

  const dispatch = useDispatch()
  dispatch(setHeaderShown(false))
  dispatch(setGestureEnable(true))

  let greeting = "Good Morning"
  const hour = moment().format('hh')
  if (hour >= '18')
    greeting = "Good Evening"
  else if (hour >= '12')
    greeting = "Good Afternoon"

  greeting += "\n"
  greeting += userInfo.name

  return (
    <View style={styles.container}>

      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {greeting}
        </Text>
      </View>
      <View style={styles.section}>
        <Text color="#125171" size={22} flex={1}>
          Last Notifications
        </Text>

        <ScrollView>
        <Text size={30} bold style={styles.title}>
          Notifications
        </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  greeting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#C4CBC8',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  greetingText: {
    marginTop: DEVICE_HEIGHT / 30,
    fontSize: 25,
    color: '#125171',
    textAlign: 'center',
    fontWeight: 'bold'
  },  
  section: {
    flex: 5,
    flexDirection: 'column',
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: DEVICE_HEIGHT / 30
  },
  lastNotification: {
    flex: 1,
    marginTop: DEVICE_HEIGHT / 5,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  description: {
    padding: 15,
    lineHeight: 25,
  },
  titleDescription: {
    color: '#19e7f7',
    textAlign: 'center',
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  title: {
    marginTop: 30,
  },
  price: {
    marginBottom: 5,
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
});
