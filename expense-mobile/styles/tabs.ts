import { StyleSheet } from 'react-native';

export const tabsColors = {
  active: '#2563EB',
  inactive: '#8E8E93',
};

export const tabsStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 88,
    paddingTop: 10,
    paddingBottom: 10,
  },

  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBarLabel: {
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
});