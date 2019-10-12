import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import Colors from '../constants/Colors';

export default function HeaderRightButton({
  loading,
  renderIcon,
  color,
  disabled,
  title,
  onPress
}) {
  if (loading) {
    return (
      <View style={{ paddingHorizontal: 10 }}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  } else {
    if (renderIcon) {
      return (
        <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={onPress}>
          {renderIcon()}
        </TouchableOpacity>
      );
    } else {
      const colorText =
        color && Colors[color] ? Colors[color] : Colors['primary'];
      const disabledStyle = disabled && { color: 'gray' };
      const isAndroid = Platform.OS === 'android';

      return (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={[{ color: colorText, fontSize: 16 }, disabledStyle]}>
            {isAndroid ? title.toUpperCase() : title}
          </Text>
        </TouchableOpacity>
      );
    }
  }
}
