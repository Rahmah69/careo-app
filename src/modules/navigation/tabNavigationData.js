import HomeScreen from '../home/HomeViewContainer';
import CalendarScreen from '../calendar/CalendarViewContainer';
import ChildListScreen from '../child/ChildListScreen';
import UserProfileScreen from '../auth/UserProfileScreen';
import ComponentsScreen from '../components/ComponentsViewContainer';
import {ChildNavigatorView, DeviceNavigatorView} from './RootNavigation'

const iconHome = require('../../../assets/images/tabbar/home0.png');
const iconChildren = require('../../../assets/images/tabbar/children.png');
const iconBracelet = require('../../../assets/images/tabbar/bracelet.png');
const iconParent = require('../../../assets/images/tabbar/parent.png');
const iconMenu = require('../../../assets/images/tabbar/menubutton.png');

const tabNavigationData = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: iconHome,
  },
  {
    name: 'Children',
    component: ChildNavigatorView,
    icon: iconChildren,
  },
  {
    name: 'Bracelet',
    component: DeviceNavigatorView,
    icon: iconBracelet,
  },
  {
    name: 'Parent',
    component: UserProfileScreen,
    icon: iconParent,
  },
];

export default tabNavigationData;