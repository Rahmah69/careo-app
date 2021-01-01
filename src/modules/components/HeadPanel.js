import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'

import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import {HAED_PANEL_HEIGHT} from '../Constant'
import toBackImg from '../../../assets/images/icons/toback.png'

export default function HeadPanel(props) {
  
  let {headerSection, headerDisplaySection, headerText, backButton} = styles

  return (
    <View style={headerSection}>
    {props.onPress != null 
      ? <View style={headerDisplaySection}>
          <TouchableOpacity
            flex={1}
            style={{marginLeft: 20, width: 10}}
            onPress={props.onPress}
            activeOpacity={1}
          >
            <Image style={backButton} source={toBackImg}/>
          </TouchableOpacity>
          <Text flex={5} style={headerText}>{props.title}</Text>
          <Text flex={1} style={headerText}></Text>
        </View>
      : <Text style={headerText}>{props.title}</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    height: HAED_PANEL_HEIGHT, 
    width: '100%', 
    backgroundColor: '#C4CBC8',
    paddingTop: (HAED_PANEL_HEIGHT - 35),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: .8,
    shadowRadius: 3.84,
    elevation: 2,
  },
  headerDisplaySection: {
    flex: 1,
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center', 
    textAlignVertical: 'center',
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#125171',
  },
  backButton: {
    width: 15, 
    height: 20,
    marginTop: 3,
  },
})