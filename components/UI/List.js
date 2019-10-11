import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class List extends React.Component {
  static defaultProps = {
    border: true
  };

  render() {
    const length = React.Children.count(this.props.children);

    return (
      <View style={[styles.wrapper]}>
        <View style={styles.divider} />
        {React.Children.map(this.props.children, (children, k) => {
          return (
            <View>
              {children}
              {length - 1 !== k && <View style={styles.divider} />}
            </View>
          );
        })}
        <View style={styles.divider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff'
  },
  divider: {
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb'
  }
});
