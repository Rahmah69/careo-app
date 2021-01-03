
// Initial state
const initialState = {
  deviceList: [],
  // deviceList: [
  //   {
  //     uuid: 'aaaaXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: '',
  //     battery: 40,
  //     lastSyncTime: '2020-11-09 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: '',
  //     userId: 1,      
  //   }, {
  //     uuid: 'bbbbXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: 'SFQIE2',
  //     battery: 40,
  //     lastSyncTime: '2020-11-10 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: '',
  //     userId: 1,      
  //   }, {
  //     uuid: 'ccccXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: '',
  //     battery: 40,
  //     lastSyncTime: '2020-11-11 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //     userId: 1,   
  //   }, {
  //     uuid: 'ddddXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: '',
  //     battery: 40,
  //     lastSyncTime: '2020-11-12 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: '',
  //     userId: 1,       
  //   }, {
  //     uuid: 'eeeeXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: 'SFQIE5',
  //     battery: 40,
  //     lastSyncTime: '2020-12-19 14:20:10',
  //     isConnected: true,
  //     childId: 1,
  //     childName: 'Milian',
  //     childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //     userId: 1,      
  //   }, {
  //     uuid: 'ffffXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: '',
  //     battery: 40,
  //     lastSyncTime: '2020-11-09 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //     userId: 1,   
  //   }, {
  //     uuid: 'ggggXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: 'SFQIE7',
  //     battery: 40,
  //     lastSyncTime: '2020-11-09 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //     userId: 1,       
  //   }, {
  //     uuid: 'hhhhXXXX-6e7d-4601-bda2-bffaa68956ba',
  //     serialNumber: 'SFQIE8',
  //     battery: 40,
  //     lastSyncTime: '2020-11-09 14:20:10',
  //     isConnected: false,
  //     childId: 0,
  //     childName: '',
  //     childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //     userId: 1,      
  //   }
  // ],
  curDevice: null,
  // curDevice: {
  //   uuid: 'hhhhXXXX-6e7d-4601-bda2-bffaa68956ba',
  //   serialNumber: 'SFQIE8',
  //   battery: 40,
  //   lastSyncTime: '2020-11-09 14:20:10',
  //   isConnected: true,
  //   childId: 0,
  //   childName: '',
  //   childPhoto: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  //   userId: 1,
  // },
  selDevIndex: -1,
  selUUID: ''
}

// Actions
const SET_DEVICE_LIST       = 'SET_DEVICE_LIST'
const ADD_DEVICE            = 'ADD_DEVICE'
const UPDATE_DEVICE         = 'UPDATE_DEVICE'
const REMOVE_DEVICE         = 'REMOVE_DEVICE'
const SET_SEL_DEV_INDEX     = 'SET_SEL_DEV_INDEX'
const SET_CUR_DEVICE        = 'SET_CUR_DEVICE'
const SET_SEL_UUID          = 'SET_SEL_UUID'

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

function removeDeviceAction(uuid) {
  return { type: REMOVE_DEVICE , uuid}
}

function setSelDevIndexAction(selDevIndex) {
  return { type: SET_SEL_DEV_INDEX , selDevIndex}
}

function setCurDeviceAction(curDevice) {
  return { type: SET_CUR_DEVICE , curDevice}
}

function setSelUUIDAction(selUUID) {
  return { type: SET_SEL_UUID , selUUID}
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

export function removeDevice(uuid) {
  return dispatch => {
    dispatch(removeDeviceAction(uuid))
  }
}

export function setSelDevIndex(selDevIndex) {
  return dispatch => {
    dispatch(setSelDevIndexAction(selDevIndex))
  }
}

export function setCurDevice(curDevice) {
  return dispatch => {
    dispatch(setCurDeviceAction(curDevice))
  }
}

export function setSelUUID(selUUID) {
  return dispatch => {
    dispatch(setSelUUIDAction(selUUID))
  }
}

// Reducer
export default function DeviceStateReducer(state = initialState, action = {}) {

  const getDeviceIndex = (uuid) => {
    let index = -1
    for (let i = 0; i < state.deviceList.length; i++) {
      if (state.deviceList[i].uuid == uuid) {
        index = i
        break
      }
    }

    return index
  }

  switch (action.type) {
    case SET_DEVICE_LIST:
      return Object.assign({}, state, {
        deviceList: action.deviceList,
      })

    case ADD_DEVICE:
      {
        let deviceList = state.deviceList
        deviceList.push(action.device)

        return Object.assign({}, state, {
          deviceList: deviceList,
        })
      }

    case UPDATE_DEVICE:
      {
        let deviceList = state.deviceList
        let index = getDeviceIndex(action.device.uuid)

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
        let index = getDeviceIndex(action.uuid)

        if (index >= 0) {
          deviceList.splice(index, 1)
        }

        return Object.assign({}, state, {
          deviceList: deviceList,
        })
      }

    case SET_SEL_DEV_INDEX:
      return Object.assign({}, state, {
        selDevIndex: action.selDevIndex,
      })

    case SET_CUR_DEVICE:
      return Object.assign({}, state, {
        curDevice: action.curDevice,
      })

    case SET_SEL_UUID:
      return Object.assign({}, state, {
        selUUID: action.selUUID,
      })

    default:
      return state
  }
}