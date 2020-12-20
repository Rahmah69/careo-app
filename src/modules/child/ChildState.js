
// Initial state
const initialState = {
  childList: [
    {
      id: 1,
      name: 'AAA',
      age: 10,
      bloodType: 'A',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      serialNumber: 'SFQIE1',
      userId: 1,      
    }, {
      id: 2,
      name: 'BBB',
      age: 7,
      bloodType: 'B',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: '',
      serialNumber: 'SFQIE2',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      serialNumber: '',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: '',
      serialNumber: '',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: '',
      serialNumber: '',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: '',
      serialNumber: '',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: '',
      serialNumber: '',
      userId: 1,      
    }, {
      id: 3,
      name: 'CCC',
      age: 7,
      bloodType: 'O',
      condition: 'Autism',
      relationship: 'Mother',
      imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      serialNumber: '',
      userId: 1,      
    }
  ],
  selIndex: -1,
}

// Actions
const SET_CHILD_LIST  = 'SET_CHILD_LIST'
const ADD_CHILD       = 'ADD_CHILD'
const UPDATE_CHILD    = 'UPDATE_CHILD'
const REMOVE_CHILD    = 'REMOVE_CHILD'
const SET_SEL_INDEX   = 'SET_SEL_INDEX'

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

function setSelIndexAction(selIndex) {
  return { type: SET_SEL_INDEX , selIndex}
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

export function setSelIndex(selIndex) {
  return dispatch => {
    dispatch(setSelIndexAction(selIndex))
  }
}

// Reducer
export default function ChildStateReducer(state = initialState, action = {}) {

  const isChild = (element, id) => element.id = id

  switch (action.type) {
    case SET_CHILD_LIST:
      return Object.assign({}, state, {
        childList: action.childList,
      })

    case ADD_CHILD:
      childList.push(action.child)

      return Object.assign({}, state, {
        childList: childList,
      })

    case UPDATE_CHILD:
      {
        let childList = state.childList
        let index = childList.findIndex(isChild, action.child.id)

        if (index >= 0) {
          childList[index] = action.child
        }

        return Object.assign({}, state, {
          childList: childList,
        })
      }

    case REMOVE_CHILD:
      {
        let childList = state.childList
        let index = childList.findIndex(isChild, action.childId)

        if (index >= 0) {
          childList.slice(index, 1)
        }

        return Object.assign({}, state, {
          childList: childList,
        })
      }

    case SET_SEL_INDEX:
      return Object.assign({}, state, {
        selIndex: action.selIndex,
      })

    default:
      return state
  }
}