import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TextInput, Image, Dimensions, TouchableOpacity } from "react-native"
import eyeImg from "../../../assets/images/eye_black.png"

export default class UserInput extends Component {
  render() {
    return (
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor="gray"
          underlineColorAndroid="transparent"
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
        <Image source={this.props.source} style={styles.inlineImg} />
        {
          this.props.eyeicon === true ?
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.btnEye}
              onPress={this.props.eyefunc}>
              <Image source={eyeImg} style={styles.iconEye} />
            </TouchableOpacity>
            :null
        }
      </View>
    )
  }
}
UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  onChangeText:PropTypes.func,
  value:PropTypes.string,
  eyeicon: PropTypes.bool,
  eyefunc: PropTypes.func
}

const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height

const INPUT_HEIGHT              = 50
const INPUT_HORZ_MARGIN         = 20

const INLINE_IMG_WIDTH          = 22
const INLINE_IMG_HEIGHT         = INLINE_IMG_WIDTH
const INLINE_IMG_HORZ_MARGIN    = 15

const EYE_IMG_WIDTH             = 25
const EYE_IMG_HEIGHT            = EYE_IMG_WIDTH
const EYE_IMG_RIGHT_MARGIN      = 15

const ZORDERINDEX               = 99

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: DEVICE_WIDTH - INPUT_HORZ_MARGIN * 2,
    height: INPUT_HEIGHT,
    marginHorizontal: INPUT_HORZ_MARGIN,
    paddingLeft: INLINE_IMG_HORZ_MARGIN + INLINE_IMG_WIDTH + INLINE_IMG_HORZ_MARGIN,
    borderRadius: 20,
    color: '#A0A0A0',
  },
  inputWrapper: {
    marginBottom: 10
  },
  inlineImg: {
    position: 'absolute',
    zIndex: ZORDERINDEX,
    width: INLINE_IMG_WIDTH,
    height: INLINE_IMG_HEIGHT,
    left: INPUT_HORZ_MARGIN + INLINE_IMG_HORZ_MARGIN,
    top: (INPUT_HEIGHT - INLINE_IMG_HEIGHT) / 2,
  },
  btnEye: {
    position: 'absolute',
    zIndex: ZORDERINDEX,
    width: EYE_IMG_WIDTH,
    height: EYE_IMG_HEIGHT,
    left: DEVICE_WIDTH - INPUT_HORZ_MARGIN - EYE_IMG_RIGHT_MARGIN - EYE_IMG_WIDTH,
    top: (INPUT_HEIGHT - EYE_IMG_HEIGHT) / 2,
  },
  iconEye: {
    width: EYE_IMG_WIDTH,
    height: EYE_IMG_HEIGHT,
    tintColor: 'rgba(0,0,0,0.2)',
  },
})
