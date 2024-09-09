import React from "react";
import { Text, TextInput, View, StyleSheet, ViewStyle, TextInputProps, StyleProp, TextStyle } from 'react-native';
import PropTypes from "prop-types";

interface PropTypes extends React.ComponentProps<typeof TextInput> {
  rightElement?: PropTypes.ReactElementLike;
  leftElement?: PropTypes.ReactElementLike;
  containerStyle?: ViewStyle;
  style?:  StyleProp<TextStyle>;
}

const Input: React.FC<PropTypes> = (props) => {
  return (
    <View
      style={[{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#3236458f",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: "center",
        maxWidth: "100%",
        
      }, {...props?.containerStyle}]}
    >
      {props.leftElement}

      <TextInput
        {...props}
        className={` flex-1 text-lg font-semibold tracking-widest text-white `}
        placeholderTextColor={"white"}
      />
      {props.rightElement}
      {/* <FontAwesome name="eye" size={20} color="white" /> */}
      {/* <FontAwesome6 name="eye-low-vision" size={16} color="white"  /> */}
      {/* <MaterialCommunityIcons name="form-textbox-password" size={21} color="white" /> */}
    </View>
  );
};
export default Input