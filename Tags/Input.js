import React from "react";
import { View, TextInput } from "react-native";

import styles from "./styles";

const Input = (props) => {

  const {
    value,
    onChangeText,
    onSubmitEditing,
    inputStyle,
    inputContainerStyle,
    textInputProps,
    onBlur
  } = props;

  return (
    <View style={[styles.textInputContainer, inputContainerStyle]}>
      <TextInput
        {...textInputProps}
        style={[styles.textInput, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        underlineColorAndroid="transparent"
        // returnKeyType='next'
      />
    </View>
  );

};

export { Input };
export default Input;