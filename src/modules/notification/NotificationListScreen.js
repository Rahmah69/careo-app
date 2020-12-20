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
import {headStyles} from '../../styles/headStyles'

import Notification from './Notification'

class NotificationListScreen extends React.Component {

  render() {
    let {headerSection, headerDisplaySection, headerText, backButton} = headStyles
    let { container, notificationSection, divider} = styles
    return (      
      <View style={container}>
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
            <Text flex={5} style={headerText}>Notification History</Text>
            <Text flex={1} style={headerText}></Text>
          </View>
        </View>
        
        <ScrollView style={{marginHorizontal: 20, marginTop: 10}}>
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
  }
})
