import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';

export default function UploadProgress({ percent, size, onAbortPress }) {
  return (
    <View style={styles.container}>
      <CircularProgress
        size={size}
        width={2}
        lineCap="round"
        fill={percent}
        tintColor="#fff"
        backgroundColor="transparent"
      />

      <View style={styles.abortWrapper}>
        <TouchableWithoutFeedback onPress={onAbortPress}>
          <Ionicons
            name={'ios-close'}
            size={size}
            color="#fff"
            style={styles.icon}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  abortWrapper: {
    position: 'absolute'
  },
  icon: {
    paddingTop: 3
  }
});
