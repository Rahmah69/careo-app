import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native'

import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import {db} from '../Database'
import LinearGradient from 'react-native-linear-gradient'

import { setUser } from './AuthState'
import {headStyles} from '../../styles/headStyles'

class UserProfileScreen extends React.Component {
  
  componentDidMount() {
    console.log(">>> User Profile Screen Did Mount")
  }

  onSave = () => {

  }

  onLogOut = () => {

  }

  render() {
    let {headerSection, headerText, headerDisplaySection, backButton} = headStyles
    let { linearGradient, buttonText} = styles
    return (      
      <View style={styles.container}>
        <View style={headerSection}>
          <View style={headerDisplaySection}>
            <TouchableOpacity
              flex={1}
              style={{marginLeft: 20, width: 10}}
              onPress={() => this.props.navigation.goBack()}
              activeOpacity={1}
            >
              <Text style={backButton}>{"<"}</Text>
            </TouchableOpacity>
            <Text flex={5} style={headerText}>User Profile</Text>
            <Text flex={1} style={headerText}></Text>
          </View>
        </View>

        <View flex={1} style={{alignItems: 'center', flexDirection: 'column'}}>
          <View flex={1} style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: 80}}>
            <Image flex={1} source={{url: this.props.userInfo.imagePath}} style={{height: 80, resizeMode:'stretch', borderRadius: 40, backgroundColor: '#AAA'}}/>
          </View>
          <Text flex={1} style={{color: '#125171', textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>
            {this.props.userInfo.name}
          </Text>
        </View>
        
        <View flex={2}>
        </View>

        <View flex={1} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity 
            style={{flex: 1, height: 40, alignItems: 'center'}}
            onPress={() => this.onSave()}
            activeOpacity={1}
          >
            <LinearGradient
              colors={[ '#6FDE99', '#28A49B' ]}
              style={linearGradient}
              start={{x: 0.4, y: 0}}
              end={{x: 0.4, y: 1.5}}
            >
            <Text style={buttonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{flex: 1, height: 40, alignItems: 'center'}}
            onPress={() => this.onLogOut()}
            activeOpacity={1}
          >
            <LinearGradient
              colors={[ '#FF9BA2', '#FA5865' ]}
              style={linearGradient}
              start={{x: 0.4, y: 0}}
              end={{x: 0.4, y: 1.5}}
            >
            <Text style={buttonText}>LogOut</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default compose(
  connect(
    state => ({
      userInfo: state.auth.userInfo,
    }),
    dispatch => ({
      setUser: (userInfo) => dispatch(setUser(userInfo))
    }),
  )
)(UserProfileScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  linearGradient: {
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 10,
    width: 100,
    height: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
})


