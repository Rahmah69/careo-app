import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native'

import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import {PHOTO_WIDTH, PHOTO_HEIGHT} from '../Constant'

export default function PickerImage(props) {

  const [pageX, setPageX] = useState(0)
  const [pageY, setPageY] = useState(0)

  const [modalVisible, setModalVisible] = useState(false)

  const onShow = () => {
    console.log("on show: ", pageX, pageY)
  }

  onImageClick = async (ev) => {
    setPageX(ev.nativeEvent.pageX)
    setPageY(ev.nativeEvent.pageY)
    setModalVisible(true)
  }

  imagePickerCallBack = async (response) => {
    console.log('Response = ', response)
    if (response.didCancel) {
      console.log('User cancelled image picker')
      
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.error)

    } else if (response.uri) {
      console.log("response.uri: ", response.uri)
      props.setImageUri(response.uri)
    }
  }

  setFromLibrary = () => {

    console.log("set from library")
    let options = {
      mediaType: 'photo',
      saveToPhoto: true,
    }

    launchImageLibrary(options, imagePickerCallBack)
  }

  setFromCamara = () => {

    console.log("set from library")
    let options = {
      mediaType: 'photo',
      saveToPhoto: true,
    }

    launchCamera(options, imagePickerCallBack)
  }

  setChoice = async (isCamera) => {
    await closeModal()
    setTimeout(() => {
      if (isCamera) {
        setFromCamara()
      } else {
        setFromLibrary()
      }
    }, 10)
  }
  
  closeModal = () => {
    console.log("close image picker selector")
    setModalVisible(false)
  }

  return (    
    <View style={props.style}>
      <TouchableOpacity flex={1} 
          style={styles.imageTouchable} 
          onPress={(ev) => {onImageClick(ev)}} activeOpacity={.8}>
        <Image flex={1} 
          source={props.imagePath != null && props.imagePath != '' ? {url: props.imagePath} : props.defaultImage} 
          style={styles.image}/>
      </TouchableOpacity>
      
      <Modal 
        animationType="fade"
        transparent={true}
        onShow={onShow}
        visible={modalVisible}>
        <View flex={1} style={{position: 'absolute', top: pageY, left: pageX}}>
          <View style={styles.modalView}>
            <Text style={styles.titleText}>{props.pickerTitle}</Text>
            
            <View style={styles.blueDivider} />
            
            <TouchableOpacity 
              onPress={() => setChoice(true)}
              activeOpacity={.5}
            >
              <Text style={styles.buttonText}>Select from camera...</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            <TouchableOpacity 
              onPress={() => setChoice(false)}
              activeOpacity={.5}
            >
              <Text style={styles.buttonText}>Select from library...</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            
            <TouchableOpacity 
              onPress={closeModal}
              activeOpacity={.5}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  imageTouchable: {
    width: PHOTO_WIDTH, 
    height: PHOTO_HEIGHT, 
    borderRadius: PHOTO_WIDTH / 2
  },
  image: {
    height: PHOTO_WIDTH, 
    width: PHOTO_HEIGHT, 
    resizeMode:'stretch', 
    borderRadius: PHOTO_WIDTH / 2, 
    backgroundColor: '#AAA'
  },
  titleText: {
    textAlignVertical: 'center', 
    marginTop: 15, 
    marginBottom: 10, 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#125171'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10, 
    paddingHorizontal: 15,    
    alignItems: "center",
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  blueDivider: {
    borderBottomColor: '#2680EB',
    opacity: 0.5,
    borderBottomWidth: 1,
    width: 200,
  },
  divider: {
    borderBottomColor: '#AAA',
    opacity: 0.5,
    borderBottomWidth: 1,
    width: 200,
  },
  buttonText: {
    marginVertical: 10,
    width: 200,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
})


