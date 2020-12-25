import { connect } from 'react-redux'
import { compose } from 'recompose'
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'

import Notification from '../notification/Notification'

class LastNotificationList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lastNotiList: this.props.lastNotiList,
    }    
  }

  componentDidMount = () => {    
    setInterval(() => {
      this.refreshList()
    }, 1000)
  }

  refreshList = () => {
    // this.setState({lastNotiList: this.props.lastNotiList})
  }

  render() {
    return (
      <ScrollView style={this.props.style}>
      {
        this.state.lastNotiList.map((item, index) => {
          console.log(">>>> notification map - item: ", item)
          return <View style={{height: 100}}>
          <Notification 
            notification={item}
            isBatteryShown={true}
            isConnectionShown={true}
            style={styles.notificationSection}
          />
          <View style={styles.divider} />
          </View>
        })
        }
      </ScrollView>
    )
  }
}

export default compose(
  connect(
    state => ({
      lastNotiList: state.notification.lastNotiList
    }),
    dispatch => ({
      setLastNotiList: (notiList) => dispatch(setLastNotiList(notiList)),
    }),
  )
)(LastNotificationList)

const styles = StyleSheet.create({
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
