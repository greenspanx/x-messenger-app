import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingTextIndicator = ({ text }) => (
  <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
    <ActivityIndicator size={'small'} />
    <Text
      style={{
        fontSize: 17,
        fontWeight: '600',
        marginHorizontal: 16,
        textAlign: 'center',
        color: '#2d2d2d'
      }}
    >
      {text}
    </Text>
  </View>
);

export default LoadingTextIndicator;
