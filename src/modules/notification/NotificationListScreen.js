import { connect } from 'react-redux'
import { compose } from 'recompose'
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native'
import { colors, fonts } from '../../styles'
import HeadPanel from '../components/HeadPanel'

import Notification from './Notification'

class NotificationListScreen extends React.Component {

  render() {
    let { container, notificationSection, divider} = styles
    return (      
      <View style={container}>
        <HeadPanel
          title="Notification History"
          onPress={() => this.props.navigation.goBack()}/>

        <ScrollView style={{marginHorizontal: 20, marginVertical: 10}}>
          {
          this.props.notiList.map((item, index) => {
            console.log(">>>> notification map - item: ", item)
            return <View style={{height: 100}}>
                <Notification 
                  notification={item}
                  isBatteryShown={false}
                  isConnectionShown={false}
                  style={notificationSection}
                />
                <View style={divider} />
            </View>
          })
          }
        </ScrollView>
      </View>
    )
  }
}

export default compose(
  connect(
    state => ({
      notiList: state.notification.notiList
    }),
  )
)(NotificationListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row'
  },
  divider: {
    borderBottomColor: '#2680EB',
    opacity: 0.2,
    borderBottomWidth: 1,
    marginHorizontal: 1,
  },
})
