import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { useHeaderHeight } from "@react-navigation/elements";
import { IgnoreHeaderView } from "@/components/utils/Basics";
import { Image } from "expo-image";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      // router.push("/(drawer)/conversations")
    });

    return () => {};
  }, []);

  const frame = useSafeAreaFrame();

  const scale = useSharedValue(1);
  const progress = useSharedValue(0); // Use this to animate the color

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#3236458f", "#3236459f"]
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 200 });
    progress.value = withTiming(1, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    progress.value = withTiming(0, { duration: 200 });
  };

  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Image
        contentFit="cover"
        source={require("../../assets/images/New folder/9.jpg")}
        // source={require("../../assets/images/New folder/4.jpg")}

        style={[
          {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            position: "absolute",
            overflow: "hidden",
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "black", opacity: 0.55 },
        ]}
      ></View>

      <ScrollView
        // style={StyleSheet.absoluteFillObject}
        style={{ paddingTop: useHeaderHeight() + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={"height"}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Input
            placeholderTextColor={"white"}
            placeholder="Search"
            inputMode="search"
            className="text-base"
            containerStyle={{
              paddingVertical: 6,
              paddingHorizontal: 13,
              flex: 1,
              borderRadius:100
            }}
            style={{
              fontSize: 15,
              fontWeight: "500",
              letterSpacing: 1.5,
              marginLeft: 8,
            }}
            leftElement={
              <MaterialIcons name="person-search" size={20} color={"white"} />
            }
          />
          <Animated.View style={[{borderRadius: 100, height:"100%", width:40, justifyContent: "center", alignItems: 'center'}, animatedStyle]}>
            <Pressable
              className="p-2"
              
              onPressIn={() => handlePressIn()}
              onPressOut={() => handlePressOut()}
            >
              <FontAwesome6 name="plus" size={22} color="white" />
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>

        <View style={{}}>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
          <Text>Jimam</Text>
        </View>
      </ScrollView>
    </View>
  );
}
