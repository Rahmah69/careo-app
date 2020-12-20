// @flow
type AppStateType = {
  isFirstOpen: boolean,
  notificationEnable: boolean,
}

type ActionType = {
  type: string,
  payload?: any,
}

export const initialState: AppStateType = {
  isFirstOpen: true,
  notificationEnable: false
}

export const SET_FIRST_OPEN = 'AppState/SET_FIRST_OPEN'

export const SET_NOTIFI_ENABLE = 'AppState/SET_NOTIFI_ENABLE'

export function setAppOpened(): ActionType {
  return {
    type: SET_FIRST_OPEN,
  }
}

export function setAppNotificationEnable(): ActionType {
  return {
    type: SET_NOTIFI_ENABLE,
  }
}

export default function AppStateReducer(
  state: AppStateType = initialState,
  action: ActionType,
): AppStateType {
  switch (action.type) {
    case SET_FIRST_OPEN:
      return {
        ...state,
        isFirstOpen: false,
      }
    case SET_NOTIFI_ENABLE:
      console.log("notification enabled set")
      return {
        ...state,
        notificationEnable: true,
      }
    default:
      return state
  }
}
