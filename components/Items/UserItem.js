import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import UserPicture from '../UserPicture';

export default class CompanyCard extends React.PureComponent {
  render() {
    let { user, onPress, pictureSize, style } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.wrapper, style]}>
          <UserPicture
            user={user}
            hideBorder
            size={pictureSize || 45}
            picture={user.picture}
          />
          <View style={styles.info}>
            <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.url} ellipsizeMode="tail" numberOfLines={1}>
              @{user.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = ScaledSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  info: {
    paddingLeft: 10
  },
  name: {
    fontSize: '16@ms0.4',
    fontWeight: '500',
    color: '#14171a',
    marginBottom: 1
  },
  url: {
    color: '#66757f',
    fontSize: 14
  }
});
