import React from 'react'
import {  StyleSheet,  View,  Text,  TextInput } from 'react-native'
import {DEVICE_WIDTH, DEVICE_HEIGHT, INPUT_FIELD_HEIGHT, INPUT_FIELD_HORZ_MARGIN} from '../Constant'

export default function TextFieldWithDevider(props) {

    const inputStyle = props.style ? props.style : {}
    const style = props.style ? {...styles.input, ...inputStyle} : styles.input
    return (
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={props.style ? {...styles.input, ...inputStyle} : styles.input}>{props.value != null && props.value != 0 ? props.value.toString() : ""}</Text>
          <Text style={styles.title}>{props.title}</Text>
        </View>
        <View style={styles.devider}/>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: DEVICE_HEIGHT / 40
  },
  input: {
    width: (DEVICE_WIDTH - INPUT_FIELD_HORZ_MARGIN * 2),
    height: 50,
    marginHorizontal: INPUT_FIELD_HORZ_MARGIN,
    borderRadius: 0,
    color: '#000',
    fontSize: 18,
    textAlign: 'right',
    opacity: 0.8,
    paddingTop: DEVICE_HEIGHT / 60,
    textAlignVertical: 'center', 
    alignContent: 'center',
    alignSelf: 'baseline'
  },
  title: {
    fontSize: 20, 
    color: '#005180', 
    marginLeft: INPUT_FIELD_HORZ_MARGIN, 
    marginTop: -DEVICE_HEIGHT / 25, 
    zIndex: -1
  },
  devider: {
    borderBottomColor: '#AAA', 
    opacity: 0.5, 
    borderBottomWidth: 1, 
    width: (DEVICE_WIDTH - INPUT_FIELD_HORZ_MARGIN * 2), 
    marginTop: 10
  }
})