import React, {Component} from 'react'
import {  StyleSheet, View,  Text,   Alert,  TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import NotificationManager from 'react-native-check-notification-enable'

import notificationOnImg from '../../assets/images/turnOnNotification.png'
import { DEVICE_WIDTH, DEVICE_HEIGHT } from './Constant'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import NotificationSetting from 'react-native-open-notification'

// import PushNotification from "react-native-push-notification"
var PushNotification = require("react-native-push-notification")

export default class TurnOnNotification extends Component {
  constructor(props){
    super(props)
    this.state = {
      showPass: true,
      press: false,
      loading: false,
      loadingText:'',
      users: [],
      userInfo: {userId: '', email: '', password: ''},
    }
  }

  componentDidMount = async () => {
    NotificationManager.areNotificationsEnabled().then((enable)=>{
        console.log("notification enabled: ", enable); //true or false

        if (enable) {
            this.props.navigation.navigate('Login')
        }
    }).catch((e)=>{
        console.log(e);
    })

    // PushNotification.localNotificationSchedule({
    //     //... You can use all the options from localNotifications
    //     message: "My Notification Message", // (required)
    //     date: new Date(Date.now() + 10 * 1000), // in 60 secs
    //     allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    // });
  }

  onTurnOnNotification = async () => {
      NotificationSetting.open()
  }

  onSkip = () => {
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
        <View style={styles.picture}>

            <Text style={styles.title}>Turn On Notification</Text>

            <Image source={notificationOnImg} style={styles.image} />

            <View  style={styles.inputbox}>
                <View style={{width: (DEVICE_WIDTH - 60), ustifyContent:'center'}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onTurnOnNotification()}
                        activeOpacity={1}
                    >
                        <LinearGradient
                            colors={[ '#6FDE99', '#28A49B']}
                            style={styles.linearGradient}
                            start={{x: 0, y: 0}}
                            end={{x: 0.5, y: 0.6}}
                        >
                            <Text style={styles.text}>TURN ON</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skip}
                        onPress={() => this.onSkip()}
                        activeOpacity={1}
                    >
                        <Text style={{color: '#1E4663', fontSize: 18}}>Skip this</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
  }
}

const IMAGE_WIDTH   = DEVICE_WIDTH / 5 * 4
const IMAGE_HEIGHT  = DEVICE_HEIGHT / 9 * 5

const SKIP_BUTTON_WIDTH   = 80

const styles = StyleSheet.create({
    title: {
        marginTop: DEVICE_HEIGHT / 10,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E4663',
    },
    image: {
        marginLeft: (DEVICE_WIDTH - IMAGE_WIDTH) / 2,
        marginTop: DEVICE_HEIGHT / 30,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        resizeMode: 'stretch'
    },
    picture: {
      flex: 12,
      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
      backgroundColor: 'white',
      resizeMode: 'cover',
    },
    inputbox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: DEVICE_HEIGHT / 10
    },
    linearGradient: {
        alignItems:'center', 
        justifyContent:'center', 
        borderRadius: 20,
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 20,
    },
    skip: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: (DEVICE_WIDTH - SKIP_BUTTON_WIDTH - 60) / 2,
        textAlign: 'center',
        width: SKIP_BUTTON_WIDTH,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#1E4663',
    },
  });
  