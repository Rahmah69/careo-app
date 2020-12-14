import HomeScreen from '../home/HomeViewContainer';
import CalendarScreen from '../calendar/CalendarViewContainer';
import GridsScreen from '../grids/GridsViewContainer';
import PagesScreen from '../pages/PagesViewContainer';
import ComponentsScreen from '../components/ComponentsViewContainer';

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
    component: CalendarScreen,
    icon: iconChildren,
  },
  {
    name: 'Breacelet',
    component: CalendarScreen,
    icon: iconBracelet,
  },
  {
    name: 'Parent',
    component: CalendarScreen,
    icon: iconParent,
  },
  {
    name: 'Menu',
    component: CalendarScreen,
    icon: iconMenu,
  },
];

export default tabNavigationData;