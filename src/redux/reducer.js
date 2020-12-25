import { combineReducers } from 'redux'

// ## Generator Reducer Imports
import navigation from '../modules/navigation/NavigationState'
import auth from '../modules/auth/AuthState'
import child from '../modules/child/ChildState'
import device from '../modules/device/DeviceState'
import notification from '../modules/notification/NotificationState'
import app from '../modules/AppState'

export default combineReducers({
  // ## Generator Reducers
  navigation,
  auth,
  child,
  device,
  notification,
  app,
})
