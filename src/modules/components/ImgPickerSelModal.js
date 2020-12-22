import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'

export default function ImagePickerSelModal(props) {
  
  const {titleText, buttonText} = styles

  const onShow = () => {
    console.log("on show: ", props.pageX, props.pageY)
  }

  return (      
    <Modal 
      animationType="fade"
      transparent={true}
      onShow={onShow}
      visible={props.visible}>
      <View flex={1} style={{position: 'absolute', top: props.pageY, left: props.pageX}}>
        <View style={styles.modalView}>
          <Text style={titleText}>{props.title}</Text>
          
          <View style={styles.blueDivider} />
          
          <TouchableOpacity 
            onPress={() => props.setChoice(true)}
            activeOpacity={.5}
          >
            <Text style={buttonText}>Select from camera...</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          <TouchableOpacity 
            onPress={() => props.setChoice(false)}
            activeOpacity={.5}
          >
            <Text style={buttonText}>Select from library...</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          
          <TouchableOpacity 
            onPress={props.close}
            activeOpacity={.5}
          >
            <Text style={buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    position: 'absolute',
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


