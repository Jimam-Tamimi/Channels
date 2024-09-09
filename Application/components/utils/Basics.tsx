import { View, Text, ViewProps } from "react-native";
import React from "react";
import { useHeaderHeight } from '@react-navigation/elements';

export function IgnoreHeaderView(props:ViewProps) {
  return (
    <View
      style={{ paddingTop: useHeaderHeight()  }}
      {...props}
    ></View>
  );
}
