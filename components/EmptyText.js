import React from 'react';
import { View, Text } from 'react-native';

export default function EmptyText({ children, isVisible, FooterComponent }) {
  if (isVisible) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15
        }}
      >
        <Text
          style={{
            color: '#b3b3b3',
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 23
          }}
        >
          {children}
        </Text>
        {FooterComponent && (
          <View style={{ marginTop: 15 }}>{FooterComponent()}</View>
        )}
      </View>
    );
  }
  return null;
}
