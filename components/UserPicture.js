import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  Image as RNImage
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as CacheImage } from './ImageCache';
import { getBackgroundColorByID, getPhotoPreview } from '../utils';

export default function UserPicture({
  size,
  user = {},
  chooseOverlay,
  onPress,
  isLoading
}) {
  const backgroundColor = user._id ? getBackgroundColorByID(user._id) : '';
  const defaultSize = 100;
  const fontSize = Math.abs((40 * (size || defaultSize)) / 100);

  const wrapperStyle = {
    borderRadius: size || 50,
    width: size || defaultSize,
    height: size || defaultSize
  };

  let initials = '';
  if (user._id) {
    initials =
      String(user.first_name).substr(0, 1) +
      String(user.last_name).substr(0, 1);
  }

  const isAndroid = Platform.OS === 'android';

  return (
    <View style={[styles.logoWrap, wrapperStyle]}>
      {chooseOverlay && (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.overlayWrapper}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={'#fff'} />
            ) : (
              <Ionicons name="ios-camera" size={46} color="#fff" />
            )}
          </View>
        </TouchableWithoutFeedback>
      )}

      {user.picture && user.picture.url ? (
        <>
          {chooseOverlay && isAndroid ? (
            <RNImage
              source={{ uri: user.picture.url }}
              style={styles.picture}
            />
          ) : (
            <CacheImage
              {...getPhotoPreview(user.picture.preview)}
              uri={user.picture.url}
              style={styles.picture}
            />
          )}
        </>
      ) : (
        <View style={[styles.initialsWrapper, { backgroundColor }]}>
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  picture: {
    width: '100%',
    height: '100%'
  },
  initialsWrapper: {
    backgroundColor: '#597fab',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  initials: {
    fontSize: 25,
    color: '#fff'
  },
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  }
});
