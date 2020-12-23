import {LAST_NOTI_LIMITS} from '../Constant'
import moment from "moment"

// Initial state
const initialState = {
  // total notifications
  notiList: [
    {
      uuid: '1234-2313-5323',
      serialNumber: 'A2345293',
      battery: 90,
      time: moment().add(-10, 'seconds').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Eating',
      confirmed: 1,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-1, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 0,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'BIER123',
      battery: 90,
      time: moment().add(-5, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Sleeping',
      confirmed: 1,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-2, 'hours').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Sleeping',
      confirmed: 0,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 80,
      time: moment().add(-5, 'days').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Eating',
      confirmed: 1,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-2, 'months').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-1, 'years').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-2, 'months').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-1, 'years').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: 'Milian'
    },
  ],

  // last notifications
  lastNotiList: [
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-10, 'seconds').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Eating',
      confirmed: 1,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-1, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 0,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-5, 'minutes').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Sleeping',
      confirmed: 1,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-2, 'hours').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Sleeping',
      confirmed: 0,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 80,
      time: moment().add(-5, 'days').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Eating',
      confirmed: 1,
      childName: 'Milian'
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-2, 'months').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: ''
    },
    {
      uuid: '1234-2313-5323',
      serialNumber: 'F2155293',
      battery: 90,
      time: moment().add(-1, 'years').format('YYYY-MM-DD hh:mm:ss'),
      content: 'Cleaning',
      confirmed: 1,
      childName: ''
    },
  ],
}

// Actions
const SET_NOTI_LIST       = 'SET_NOTI_LIST'
const SET_LAST_NOTI_LIST  = 'SET_LAST_NOTI_LIST'
const ADD_NOTIFICATION    = 'ADD_NOTIFICATION'

// Action creators
function setNotiListAction(notiList) {
  return { type: SET_NOTI_LIST, notiList}
}

function setLastNotiListAction(lastNotiList) {
  return { type: SET_LAST_NOTI_LIST , lastNotiList}
}

export function setNotiList(notiList) {
  return dispatch => {
    dispatch(setNotiListAction(notiList))
  }
}

export function setLastNotiList(lastNotiList) {
  return dispatch => {
    dispatch(setLastNotiListAction(lastNotiList))
  }
}

// Reducer
export default function NotificationStateReducer(state = initialState, action = {}) {

  switch (action.type) {
    case SET_NOTI_LIST:
      return Object.assign({}, state, {
        notiList: action.notiList,
      })

    case SET_LAST_NOTI_LIST:
      return Object.assign({}, state, {
        lastNotiList: action.lastNotiList,
      })

    default:
      return state
  }
}