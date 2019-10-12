import React from 'react';
import { Platform, Image as RNImage } from 'react-native';
import { Image as CacheImage } from './ImageCache';

const isAndroid = Platform.OS === 'android';

export default function Image(props) {
  if (isAndroid) {
    return <RNImage uri={{ uri: props.uri }} {...props} />;
  } else {
    return <CacheImage {...props} />;
  }
}
