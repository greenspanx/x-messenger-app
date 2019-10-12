import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { MaterialIndicator } from 'react-native-indicators';

export default class LoadingOverlay extends React.Component {
  render() {
    let { isVisible } = this.props;

    if(isVisible) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <MaterialIndicator
              color='#5a5a5a'
              size={35}
            />
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    height: 90,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
  }
});
