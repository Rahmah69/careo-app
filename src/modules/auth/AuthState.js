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
  return { type: SET_USER , userInfo}
}

function setIsLoggedInAction(isLoggedIn) {
  return { type: SET_IS_LOGGED_IN , isLoggedIn}
}

export function setUser(userInfo) {
  return dispatch => {
    dispatch(setUserAction(userInfo))
  };
}

export function setIsLoggedIn(isLoggedIn) {
  return dispatch => {
    dispatch(setIsLoggedInAction(isLoggedIn))
  }
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
