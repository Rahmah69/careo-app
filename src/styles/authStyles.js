import { StyleSheet, Dimensions } from 'react-native'
import {DEVICE_WIDTH, DEVICE_HEIGHT} from '../modules/Constant'

export const authStyles = StyleSheet.create({
  title: {
    marginTop: DEVICE_HEIGHT / 15,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E4663',
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
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  btnEye: {
    position: 'absolute',
    top: 60,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  picture: {
    flex: 12,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    resizeMode: 'cover',
  },
  description: {
    textAlign: 'center',
    fontSize: 20,
    color: '#0A0',
    marginBottom: 30 
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  gotoButton: {
    marginTop: DEVICE_HEIGHT / 15,
    color: '#1E4663',
    fontWeight: 'bold',    
    textAlign: 'right',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: .25,
    shadowRadius: 3.84,
    elevation: 5
  },
  signup: {
    marginLeft: DEVICE_WIDTH - 70,
  },
  login: {
    marginLeft: 20,
    width: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1e9eff',
    marginTop: 20,
    height: 50,
    borderRadius: 20,
    zIndex: 100,
  },
  linearGradient: {
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 20,
    width: '100%',
    height: '100%'
  },
  userInput: {
    height: 100,
  }
})