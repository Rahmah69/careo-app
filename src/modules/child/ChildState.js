
// Initial state
const initialState = {
  childList: [
    // {
    //   id: 1,
    //   name: 'AAA',
    //   age: 10,
    //   bloodType: 'A',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    //   uuid: '1234-2313-5323',
    //   serialNumber: 'SFQIE1',
    //   userId: 1,      
    // }, {
    //   id: 2,
    //   name: 'BBB',
    //   age: 7,
    //   bloodType: 'B',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: '',
    //   uuid: '1234-2313-5323',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    //   uuid: '1234-2313-5323',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: '',
    //   uuid: '',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: '',
    //   uuid: '',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: '',
    //   uuid: '',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: '',
    //   uuid: '1234-2313-5323',
    //   serialNumber: '',
    //   userId: 1,      
    // }, {
    //   id: 3,
    //   name: 'CCC',
    //   age: 7,
    //   bloodType: 'O',
    //   condition: 'Autism',
    //   relationship: 'Mother',
    //   imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    //   uuid: '1234-2313-5323',
    //   serialNumber: '',
    //   userId: 1,      
    // }
  ],
  selChildIndex: -1,
}

// Actions
const SET_CHILD_LIST      = 'SET_CHILD_LIST'
const ADD_CHILD           = 'ADD_CHILD'
const UPDATE_CHILD        = 'UPDATE_CHILD'
const REMOVE_CHILD        = 'REMOVE_CHILD'
const SET_SEL_CHILD_INDEX = 'SET_SEL_CHILD_INDEX'

// Action creators
function setChildListAction(childList) {
  return { type: SET_CHILD_LIST , childList}
}

function addChildAction(child) {
  return { type: ADD_CHILD , child}
}

function updateChildAction(child) {
  return { type: UPDATE_CHILD , child}
}

function removeChildAction(childId) {
  return { type: REMOVE_CHILD , childId}
}

function setSelChildIndexAction(selChildIndex) {
  return { type: SET_SEL_CHILD_INDEX , selChildIndex}
}

export function setChildList(childList) {
  return dispatch => {
    dispatch(setChildListAction(childList))
  }
}

export function addChild(child) {
  return dispatch => {
    dispatch(addChildAction(child))
  }
}

export function updateChild(child) {
  return dispatch => {
    dispatch(updateChildAction(child))
  }
}

export function removeChild(childId) {
  return dispatch => {
    dispatch(removeChildAction(childId))
  }
}

export function setSelChildIndex(selChildIndex) {
  return dispatch => {
    dispatch(setSelChildIndexAction(selChildIndex))
  }
}

// Reducer
export default function ChildStateReducer(state = initialState, action = {}) {

  const getChildIndex = (childId) => {
    let index = -1
    for (let i = 0; i < state.childList.length; i++) {
      if (state.childList[i].id == childId) {
        index = i
        break
      }
    }

    return index
  }

  switch (action.type) {
    case SET_CHILD_LIST:
      return Object.assign({}, state, {
        childList: action.childList,
      })

    case ADD_CHILD:
      console.log(">> add child action: ", action)
      {
        let childList = state.childList
        childList.push(action.child)

        return Object.assign({}, state, {
          childList: childList,
        })
      }

    case UPDATE_CHILD:
      {
        let childList = state.childList
        console.log("child list: ", childList)
        let index = getChildIndex(action.child.id)

        console.log("updated index: ", index)
        if (index >= 0) {
          childList[index] = action.child
        }
        console.log("child list: ", childList)

        return Object.assign({}, state, {
          childList: childList,
        })
      }

    case REMOVE_CHILD:
      {
        let childList = state.childList
        let index = getChildIndex(action.childId)

        if (index >= 0) {
          childList.splice(index, 1)
        }

        return Object.assign({}, state, {
          childList: childList,
        })
      }

    case SET_SEL_CHILD_INDEX:
      return Object.assign({}, state, {
        selChildIndex: action.selChildIndex,
      })

    default:
      return state
  }
}