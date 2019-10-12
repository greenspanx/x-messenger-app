import React from 'react';
import { View, Text } from 'react-native';

const Badge = props => (
  <View style={{ width: 24, height: 24, margin: 5 }}>
    {props.children}
    {props.badgeCount > 0 && (
      <View
        style={{
          position: 'absolute',
          right: -12,
          top: -5,
          backgroundColor: '#f15445',
          borderRadius: 9,
          width: 18,
          height: 18,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>{props.badgeCount}</Text>
      </View>
    )}
  </View>
);

export default Badge;
