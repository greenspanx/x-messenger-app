import React from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import GallerySwiper from 'react-native-gallery-swiper';
import i18n from 'i18n-js';
import { getPhotoPreview } from '../utils';

export default class ImageViewerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    ...(!navigation.getParam('isVisibleHeader', true) && {
      header: null
    }),
    title: i18n.t('photo')
  });

  state = {
    isVisibleHeader: true
  };

  componentDidMount() {
    this.props.navigation.setParams({
      isVisibleHeader: true
    });
  }

  toggleVisibleHeader = () => {
    const isVisible = this.props.navigation.getParam('isVisibleHeader');
    this.props.navigation.setParams({
      isVisibleHeader: !isVisible
    });

    this.setState({ isVisibleHeader: !isVisible });
  };

  render() {
    const { isVisibleHeader } = this.state;
    const images = this.props.navigation.getParam('images');
    const backgroundStyle = {
      backgroundColor: isVisibleHeader ? '#fff' : '#000'
    };
    return (
      <GallerySwiper
        imageComponent={(imageProps, imageDimensions) => {
          if (imageProps.image.preview && !imageProps.imageLoaded) {
            return (
              <Image
                {...imageProps}
                source={getPhotoPreview(imageProps.image.preview).preview}
              />
            );
          }

          return <Image {...imageProps} {...imageProps} />;
        }}
        style={backgroundStyle}
        onSingleTapConfirmed={this.toggleVisibleHeader}
        images={images}
        initialNumToRender={1}
        sensitiveScroll={false}
      />
    );
  }
}
