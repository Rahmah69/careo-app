import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import gallery from '../modules/gallery/GalleryState';
import navigation from '../modules/navigation/NavigationState';
import auth from '../modules/auth/AuthState';
import child from '../modules/child/ChildState';
import notification from '../modules/notification/NotificationState';
import app from '../modules/AppState';
import calendar from '../modules/calendar/CalendarState';

export default combineReducers({
  // ## Generator Reducers
  gallery,
  navigation,
  auth,
  child,
  notification,
  app,
  calendar,
});
