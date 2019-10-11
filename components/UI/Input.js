import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default function Input(props) {
  const {
    style,
    label,
    symbol,
    refInput,
    InputComponent,
    renderLeftComponent,
    error,
    value
  } = props;
  const Component = InputComponent || TextInput;
  const inputWrapperStyle = !label && { marginBottom: 10 };
  const isEmptyWrapperStyle = error &&
    value === '' && {
      borderBottomColor: Colors.danger
    };
  const isEmptyLabelStyle = error &&
    value === '' && {
      color: Colors.danger
    };

  return (
    <View style={[styles.inputWrapper, inputWrapperStyle, isEmptyWrapperStyle]}>
      {label && <Text style={[styles.label, isEmptyLabelStyle]}>{label}</Text>}
      <View style={styles.row}>
        {symbol && <Text style={[styles.symbol, styles.input]}>{symbol}</Text>}
        <Component
          {...props}
          ref={refInput}
          style={[styles.input, style, { flex: 1 }]}
          placeholderTextColor={'#b2b2b2'}
          value={value}
        />
        {renderLeftComponent && renderLeftComponent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb'
  },
  label: {
    color: '#b2b2b2',
    fontSize: 16,
    fontWeight: '500'
  },
  row: {
    flexDirection: 'row'
  },
  input: {
    paddingTop: 7,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#595959'
  },
  symbol: {
    paddingRight: 2
  }
});
