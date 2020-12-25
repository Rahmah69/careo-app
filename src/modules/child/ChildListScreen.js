import { connect } from 'react-redux'
import { compose } from 'recompose'
import React from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors, fonts } from '../../styles'

import { addChild, updateChild, removeChild, setSelChildIndex } from './ChildState'
import HeadPanel from '../components/HeadPanel'
import {CHILD_PROFILE_PAGE_NAME} from '../navigation/stackNavigationData'
import { setLastNotiList, setNotiList } from '../notification/NotificationState'

class ChildListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      childList: this.props.childList,
    }
  }

  componentDidMount() {
    console.log(">>> Child List Screen Did Mount")

    this.onFocusPage = this.props.navigation.addListener('focus', () => {
      console.log(">>> child list page focus")
      this.setState({childList: this.props.childList})

      // let notiList = this.props.notiList
      // notiList.splice(0, 1)
      // this.props.setNotiList(notiList)
    })

  }

  onAdd = () => {
    this.props.setSelChildIndex(-1)
    console.log(">> on Add sel index: ", this.props.selChildIndex)
    this.props.navigation.navigate(CHILD_PROFILE_PAGE_NAME)
  }

  onItemView = (index) => {
    this.props.setSelChildIndex(index)
    console.log(">> on onItemView sel index: ", this.props.selChildIndex)
    this.props.navigation.navigate(CHILD_PROFILE_PAGE_NAME)
  }

  _renderItem = ({item, index}) => {
    let {card, cardImageSection, cardImage, cardContentSection, cardTextView, cardTextTitle, cardTextContent} = styles
    return (
      <TouchableOpacity style={card} activeOpacity={.5} onPress={() => this.onItemView(index)}>
        <View style={cardImageSection}>
          <Image source={{url: item.imagePath}} style={cardImage}/>
        </View>

        <View style={cardContentSection}>
          <View style={cardTextView}>
            <Text style={cardTextTitle}>Name:  </Text>
            <Text style={cardTextContent}>{item.name}</Text>
          </View>
          <View style={cardTextView}>
            <Text style={cardTextTitle}>Age:  </Text>
            <Text style={cardTextContent}>{item.age}</Text>
          </View>
          <View style={cardTextView}>
            <Text style={cardTextTitle}>Condition:  </Text>
            <Text style={cardTextContent}>{item.condition}</Text>
          </View>
          
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    let { buttonSection, button, linearGradient, buttonText} = styles
    return (      
      <View style={styles.container}>
        <HeadPanel title="Child List"/>

        <FlatList style={{marginTop: 10}}
          data={this.state.childList}
          keyExtractor={(item) => item.id}
          renderItem={this._renderItem}
        />

        <View style={buttonSection}>
          <TouchableOpacity
            style={button}
            onPress={() => this.onAdd()}
            activeOpacity={0.5}
          >
            <LinearGradient
              colors={[ '#6FDE99', '#28A49B' ]}
              style={linearGradient}
              start={{x: 0.4, y: 0}}
              end={{x: 0.4, y: 1.5}}
            >
            <Text style={buttonText}>Add</Text>
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
      childList: state.child.childList,
      selChildIndex: state.child.selChildIndex,
      lastNotiList: state.notification.lastNotiList,
      notiList: state.notification.notiList,
    }),
    dispatch => ({
      setSelChildIndex: (selChildIndex) => dispatch(setSelChildIndex(selChildIndex)),
      setLastNotiList: (notiList) => dispatch(setLastNotiList(notiList)),
      setNotiList: (notiList) => dispatch(setNotiList(notiList)),
    }),
  )
)(ChildListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: '5%',
    width: '90%',
    shadowColor: '#444',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 1
    },
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardImageSection: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  cardImage: {
    backgroundColor: '#B9AEAE', 
    width: 70, 
    height: 70, 
    resizeMode: 'stretch', 
    borderRadius: 40
  },
  cardContentSection: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column', 
    marginLeft: 10
  },
  cardTextView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
  },
  cardTextTitle: {
    flex: 1, 
    textAlign: 'left', 
    fontSize: 13, 
    color: '#125171'
  },
  cardTextContent: {
    flex: 2, 
    textAlign: 'left', 
    fontSize: 13, 
    color: '#515F68'
  },
  buttonSection: {
    height: 50, 
    width: '100%', 
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1e9eff',
    marginTop: 8,
    height: 35,
    width: 100,
    borderRadius: 5,
    zIndex: 100,
  },
  linearGradient: {
    alignItems:'center', 
    justifyContent:'center', 
    borderRadius: 10,
    width: '100%',
    height: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
})
