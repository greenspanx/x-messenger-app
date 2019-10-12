import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';

export default class LoadingIndicator extends React.Component {
  render() {
    let { isVisible } = this.props;

    if(isVisible) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" {...this.props} />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
