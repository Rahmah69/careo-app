
import { Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const SERVER_URL         = 'https://128.199.137.192'
export const PRIVACY_POLICY_URL = 'https://google.com'
export const TERM_SERVICE_URL   = 'https://careO.com'

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height

export const LAST_NOTI_LIMITS = 5

export const EATING_MSG    = 'Eating'
export const SLEEPING_MSG  = 'Sleeping'
export const CLEANING_MSG  = 'Cleaning'

export const PHOTO_WIDTH = 80
export const PHOTO_HEIGHT = PHOTO_WIDTH

export const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 90 : 50

export const INPUT_FIELD_HEIGHT         = 50
export const INPUT_FIELD_HORZ_MARGIN    = 30

export const HAED_PANEL_HEIGHT = (DeviceInfo.getModel().startsWith("iPhone 6") 
                                || DeviceInfo.getModel().startsWith("iPhone 7")
                                || DeviceInfo.getModel().startsWith("iPhone 8")) ? (20 + 40) : (44 + 40)

export const isWideModel = () => {
    if (DeviceInfo.getModel().startsWith("iPhone 6") 
        || DeviceInfo.getModel().startsWith("iPhone 7")
        || DeviceInfo.getModel().startsWith("iPhone 8"))
        {
            return false
        }

    return true
}