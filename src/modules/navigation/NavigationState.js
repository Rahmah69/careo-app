// Initial state
const initialState = {
    headerShown: false,
    gestureEnable: false
  }
  
  // Actions
  const SET_HEADER_SHOWN = 'SET_HEADER_SHOWN'
  const SET_GESTURE_ENABLE = 'SET_GESTURE_ENABLE'
  
  // Action creators
  function setHeaderShownAction(headerShown) {
    console.log(`>>> set header shown action: ${headerShown}`)
    return { type: SET_HEADER_SHOWN , headerShown}
  }
  
  export function setHeaderShown(headerShown) {
    return dispatch => {
      console.log(`>>> set header shown: ${headerShown}`)
      dispatch(setHeaderShownAction(headerShown))
    };
  }
  
  function setGestureEnableAction(gestureEnable) {
    console.log(`>>> set geture enable action: ${gestureEnable}`)
    return { type: SET_GESTURE_ENABLE , gestureEnable}
  }
  
  export function setGestureEnable(gestureEnable) {
    return dispatch => {
      console.log(`>>> set geture enable: ${gestureEnable}`)
      dispatch(setGestureEnableAction(gestureEnable))
    };
  }
  
  // Reducer
  export default function NavigationStateReducer(state = initialState, action = {}) {
    console.log(">>> Navigation State: ", action)
    switch (action.type) {
      case SET_HEADER_SHOWN:
        console.log(">>> SET HEADER SHOWN ")
        return Object.assign({}, state, {
          headerShown: action.headerShown,
        })

    case SET_GESTURE_ENABLE:
        console.log(">>> SET GESTURE ENABLE ")
        return Object.assign({}, state, {
        gestureEnable: action.gestureEnable,
        })
  
      default:
        console.log(">>> NAVIGATION STATE DEFAULT ", state)
        return state
    }
  }
  