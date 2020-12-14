// Initial state
const initialState = {
  userInfo: {},
  isLoggedIn: false
}

// Actions
const SET_USER = 'SET_USER'
const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN'

// Action creators
function setUserAction(userInfo) {
  console.log(`>>> set user action: ${JSON.stringify(userInfo)}`)
  return { type: SET_USER , userInfo}
}

function setIsLoggedInAction(isLoggedIn) {
  console.log(`>>> set is logged in action: ${JSON.stringify(isLoggedIn)}`)
  return { type: SET_IS_LOGGED_IN , isLoggedIn}
}

export function setUser(userInfo) {
  return dispatch => {
    console.log(`>>> save user: ${JSON.stringify(userInfo)}`)
    dispatch(setUserAction(userInfo))
  };
}

export function setIsLoggedIn(isLoggedIn) {
  return dispatch => {
    console.log(`>>> set is logged in: ${JSON.stringify(isLoggedIn)}`)
    dispatch(setIsLoggedInAction(isLoggedIn))
  };
}

// Reducer
export default function AuthStateReducer(state = initialState, action = {}) {
  console.log(">>> Auth: ", action)
  switch (action.type) {
    case SET_USER:
      console.log(">>> SET USER ")
      return Object.assign({}, state, {
        userInfo: action.userInfo,
      })

    case SET_IS_LOGGED_IN:
      console.log(">>> SET IS LOGGED IN ")
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn
      })

    default:
      console.log(">>> DEFAULT ", state)
      return state
  }
}
