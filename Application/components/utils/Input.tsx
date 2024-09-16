import React from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";
import PropTypes from "prop-types";
import { FieldError, FieldErrors, FieldErrorsImpl, FieldValues, Merge } from "react-hook-form";

interface PropTypes extends React.ComponentProps<typeof TextInput> {
  rightElement?: PropTypes.ReactElementLike;
  leftElement?: PropTypes.ReactElementLike;
  error?:  any;
  containerStyle?: ViewStyle;
  style?: StyleProp<TextStyle>;
  noError?:boolean;
}

const Input: React.FC<PropTypes> = (props) => {
  return (
    <>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#3236458f",
            paddingRight: 20,
            borderRadius: 6,
            alignItems: "center",
            maxWidth: "100%",
          },
          { ...props?.containerStyle },
        ]}
      >
        {props.leftElement}

        <TextInput
          {...props}
          className={` flex-1 text-lg font-semibold tracking-widest text-white `}
          placeholderTextColor={"white"}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            paddingRight: 5,
            ...props.style as any
          }}
        />
        {props.rightElement}
        {/* <FontAwesome name="eye" size={20} color="white" /> */}
        {/* <FontAwesome6 name="eye-low-vision" size={16} color="white"  /> */}
        {/* <MaterialCommunityIcons name="form-textbox-password" size={21} color="white" /> */}
      </View>

      {!props?.noError && (
        <Text style={{ color: "#fc0303", top: 1, fontSize: 12, fontWeight: "700", letterSpacing:1 }}>{toCamelCase(props?.error?.message ? props?.error?.message  : '' )}</Text>
      )}
    </>
  );
};
export default Input;


function toCamelCase(text:string) {
  return text
    .toLowerCase() // Convert the entire text to lowercase
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters except spaces
    .trim() // Remove leading and trailing spaces
    .split(/\s+/) // Split the text into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words with a space
}