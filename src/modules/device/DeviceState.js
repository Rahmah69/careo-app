
// Initial state
const initialState = {
  availableDeviceList: [
    {
      serialNumber: 'SFQIE1',
      battery: 40,
      lastSyncTime: '2020-11-09 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: '',
      userId: 1,      
    }, {
      serialNumber: 'SFQIE2',
      battery: 40,
      lastSyncTime: '2020-11-10 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: '',
      userId: 1,      
    }, {
      serialNumber: 'SFQIE3',
      battery: 40,
      lastSyncTime: '2020-11-11 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      userId: 1,   
    }, {
      serialNumber: 'SFQIE4',
      battery: 40,
      lastSyncTime: '2020-11-12 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: '',
      userId: 1,       
    }, {
      serialNumber: 'SFQIE5',
      battery: 40,
      lastSyncTime: '2020-12-19 14:20:10',
      isConnected: true,
      childId: 1,
      childName: 'Milian',
      childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      userId: 1,      
    }, {
      serialNumber: 'SFQIE6',
      battery: 40,
      lastSyncTime: '2020-11-09 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      userId: 1,   
    }, {
      serialNumber: 'SFQIE7',
      battery: 40,
      lastSyncTime: '2020-11-09 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      userId: 1,       
    }, {
      serialNumber: 'SFQIE8',
      battery: 40,
      lastSyncTime: '2020-11-09 14:20:10',
      isConnected: false,
      childId: 0,
      childName: '',
      childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
      userId: 1,      
    }
  ],
  connectedIndex: 4,
}

// Actions
const SET_DEVICE_LIST       = 'SET_DEVICE_LIST'
const ADD_DEVICE            = 'ADD_DEVICE'
const UPDATE_DEVICE         = 'UPDATE_DEVICE'
const REMOVE_DEVICE         = 'REMOVE_DEVICE'
const SET_CONNECTED_INDEX   = 'SET_CONNECTED_INDEX'

// Action creators
function setDeviceListAction(deviceList) {
  return { type: SET_DEVICE_LIST, deviceList}
}

function addDeviceAction(device) {
  return { type: ADD_DEVICE , device}
}

function updateDeviceAction(device) {
  return { type: UPDATE_DEVICE , device}
}

function removeDeviceAction(serialNumber) {
  return { type: REMOVE_DEVICE , serialNumber}
}

function setConnectedIndexAction(index) {
  return { type: SET_CONNECTED_INDEX , index}
}

export function setDeviceList(deviceList) {
  return dispatch => {
    dispatch(setDeviceListAction(deviceList))
  }
}

export function addDevice(device) {
  return dispatch => {
    dispatch(addDeviceAction(device))
  }
}

export function updateDevice(device) {
  return dispatch => {
    dispatch(updateDeviceAction(device))
  }
}

export function removeDevice(serialNumber) {
  return dispatch => {
    dispatch(removeDeviceAction(serialNumber))
  }
}

export function setConnectedIndex(index) {
  return dispatch => {
    dispatch(setConnectedIndexAction(index))
  }
}

// Reducer
export default function DeviceStateReducer(state = initialState, action = {}) {

  const isDevice = (element, serialNumber) => element.serialNumber = serialNumber

  switch (action.type) {
    case SET_DEVICE_LIST:
      return Object.assign({}, state, {
        deviceList: action.deviceList,
      })

    case ADD_DEVICE:
      deviceList.push(action.device)

      return Object.assign({}, state, {
        deviceList: deviceList,
      })

    case UPDATE_DEVICE:
      {
        let deviceList = state.deviceList
        let index = deviceList.findIndex(isDevice, action.device.serialNumber)

        if (index >= 0) {
          deviceList[index] = action.device
        }

        return Object.assign({}, state, {
          deviceList: deviceList,
        })
      }

    case REMOVE_DEVICE:
      {
        let deviceList = state.deviceList
        let index = deviceList.findIndex(isDevice, action.serialNumber)

        if (index >= 0) {
          deviceList.slice(index, 1)
        }

        return Object.assign({}, state, {
          deviceList: deviceList,
        })
      }

    case SET_CONNECTED_INDEX:
      return Object.assign({}, state, {
        connectedIndex: action.connectedIndex,
      })

    default:
      return state
  }
}