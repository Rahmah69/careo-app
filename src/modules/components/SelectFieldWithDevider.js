import React from 'react'
import {  StyleSheet,  View,  Text, } from 'react-native'
import {DEVICE_WIDTH, DEVICE_HEIGHT, INPUT_FIELD_HEIGHT, INPUT_FIELD_HORZ_MARGIN} from '../Constant'
import RNPickerSelect from 'react-native-picker-select'

export default function SelectFieldWithDevider(props) {

    return (      
      <View style={styles.container}>
        <View style={styles.input}>
          <RNPickerSelect 
            style={pickerSelectStyles}
            onValueChange={props.onValueChange}
            value={props.value}
            items={props.items}
            onDonePress={()=>{if (props.onDonePress != null) props.onDonePress()}}
            onClose={()=>{if (props.onClose != null) props.onClose()}}
          />
        </View>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.devider}/>
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    marginTop: DEVICE_HEIGHT / 40
  },
  title: {
    fontSize: 18, 
    color: '#005180', 
    marginLeft: INPUT_FIELD_HORZ_MARGIN, 
    marginTop: -40, 
    zIndex: -1, 
    textAlign: 'left'
  },
  input: {
    backgroundColor: 'white',
    width: DEVICE_WIDTH - INPUT_FIELD_HORZ_MARGIN * 2,
    height: INPUT_FIELD_HEIGHT,
    marginHorizontal: INPUT_FIELD_HORZ_MARGIN,
    borderRadius: 0,
    color: '#000',
    fontSize: 20,
    textAlign: 'right',
    opacity: 0.5
  },
  devider: {
    borderBottomColor: '#AAA', 
    opacity: 0.5, 
    borderBottomWidth: 1, 
    width: DEVICE_WIDTH - INPUT_FIELD_HORZ_MARGIN * 2, 
    alignSelf: 'center', 
    marginTop: 10
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 100,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    color: 'black',
    textAlign: 'right',
  },
  inputAndroid: {
    fontSize: 16,
    paddingLeft: 100,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 8,
    color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
})
