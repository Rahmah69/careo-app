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
import { colors, fonts } from '../../styles'

import { RadioGroup, GridRow } from '../../components'
import { addChild, updateChild, removeChild, setSelIndex } from './ChildState'
import LinearGradient from 'react-native-linear-gradient'

class ChildListScreen extends React.Component {

  _openArticle = article => {
    this.props.navigation.navigate('ChildProfileScreen')
  }  

  _renderItem = ({item, index}) => {
    let {card, cardImageSection, cardImage, cardContentSection, cardTextView, cardTextTitle, cardTextContent} = styles
    return (
      <TouchableOpacity style={card}>
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

  onAdd = () => {

  }

  render() {
    let { headerSection, headerText, buttonSection, button, linearGradient, buttonText} = styles
    return (      
      <View style={styles.container}>
        <View style={headerSection}>
          <Text style={headerText}>Child List</Text>
        </View>

        <FlatList style={{marginTop: 10}}
          data={this.props.childList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />

        <View style={buttonSection}>
          <TouchableOpacity
            style={button}
            onPress={() => this.onAdd()}
            activeOpacity={1}
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
      childList: state.child.childList
    }),
    dispatch => ({
      setSelIndex: (child) => dispatch(setSelIndex(selIndex)),
    }),
  )
)(ChildListScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerSection: {
    height: 44 + 40, 
    width: '100%', 
    backgroundColor: '#C4CBC8'
  },
  headerText: {
    marginTop: 50, 
    height: 50, 
    textAlign: 'center', 
    textAlignVertical: 'center',
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#125171'
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
    paddingVertical: 10
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
    color: '#C1CFD8'
  },
  buttonSection: {
    height: 50, 
    width: '100%', 
    alignItems: 'center'
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
