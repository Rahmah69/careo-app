import React from 'react'
import {  StyleSheet,  View,  Text,  TextInput } from 'react-native'
import {DEVICE_WIDTH, DEVICE_HEIGHT, INPUT_FIELD_HEIGHT, INPUT_FIELD_HORZ_MARGIN} from '../Constant'

export default function InputFieldWithDevider(props) {

    return (
      <View style={styles.container}>
        <View>
          <TextInput 
            ref={ref => {props.registerInputField != null ? props.registerInputField(ref) : ""}}                      
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
            value={props.value}
            onChangeText={(value) => props.onChangeText(value)}
            onBlur={(ev) => {if (props.onBlur != null) props.onBlur(ev)}}
          />
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
    backgroundColor: 'white',
    width: (DEVICE_WIDTH - INPUT_FIELD_HORZ_MARGIN * 2),
    height: INPUT_FIELD_HEIGHT,
    marginHorizontal: INPUT_FIELD_HORZ_MARGIN,
    borderRadius: 0,
    color: '#000',
    fontSize: 20,
    textAlign: 'right',
    opacity: 0.5
  },
  title: {
    fontSize: 20, 
    color: '#005180', 
    marginLeft: INPUT_FIELD_HORZ_MARGIN, 
    marginTop: -40, 
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