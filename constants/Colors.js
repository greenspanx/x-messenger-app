const tintColor = '#5a5a5a';

export default {
  tintColor,
  tabIconDefault: '#b2b2b2',
  tabIconSelected: tintColor,
  primary: '#528bcc',
  secondary: '#efefef',
  danger: '#ff314c',
  text: '#525252'
};

export const tabBarOptions = {
  style: {
    shadowColor: 'rgb(46, 61, 73)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    borderTopWidth: 0,
    elevation: 20
  },
  showLabel: false
};

export const navigatorOptions = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomWidth: 0,
      shadowColor: '#2e3d4980',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 7
    },
    headerTintColor: '#2d2d2d'
  }
};
