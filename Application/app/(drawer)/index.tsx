import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
import Avatar from "@/components/utils/Avater";
import Conversation from "@/components/drawer/Channel";
import AppleStyleSwipeableRow from "@/components/conversations/SwipeAbleRow";
import { useAuthRedirect } from "@/hooks/auth";
import { useChannels } from "@/hooks/channel";
import useWebSocketHandler from "@/hooks/webSocketHandler";
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

  

  const { data: channels, isLoading, isError, error } = useChannels();




  const [messages, setMessages] = useState<string[]>([]);

  const handleChatMessage = (data:any) => {
    console.log("from index page",data)
  };

  // Handle WebSocket messages regardless of screen focus
  useWebSocketHandler('CHAT', handleChatMessage, false);

  
  

  return (
    <>
      <View style={{ paddingHorizontal: 15, flex: 1 }}>
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
            { backgroundColor: "black", opacity: 0.7 },
          ]}
        ></View>

        <ScrollView
          // style={StyleSheet.absoluteFillObject}
          style={{ paddingTop: useHeaderHeight() + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            // behavior={"height"}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
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
                borderRadius: 100,
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
            <Animated.View
              style={[
                {
                  borderRadius: 100,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                },
                animatedStyle,
              ]}
            >
              <Pressable
                className="p-2"
                onPressIn={() => {
                  scale.value = withTiming(0.9, { duration: 200 });
                  progress.value = withTiming(1, { duration: 200 });
                }}
                onPressOut={() => {
                  scale.value = withTiming(1, { duration: 200 });
                  progress.value = withTiming(0, { duration: 200 });
                }}
              >
                <FontAwesome6 name="plus" size={22} color="white" />
              </Pressable>
            </Animated.View>
          </KeyboardAvoidingView>
          <View
            className="flex-1 gap-3 "
            style={{ paddingBottom: useHeaderHeight() + 50, paddingTop: 15 }}
          >
    

            <FlatList
              data={channels}
              keyExtractor={(channel) => channel.id.toString()}
              renderItem={({ item }) => (
                <AppleStyleSwipeableRow key={item.id}>
                  <Conversation
                    {...item}
                    // profiles={item.channel_profiles
                    //   .map((profile) => profile.user.username)
                    //   .join(", ")}  
                  />
                </AppleStyleSwipeableRow>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
