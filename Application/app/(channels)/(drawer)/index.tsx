import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import React, { useEffect } from "react";
import { Link, router } from "expo-router";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Conversation from "@/components/drawer/Conversation";
import AppleStyleSwipeableRow from "@/components/drawer/SwipeAbleRow";
import { useConversations } from "@/hooks/channels";

export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      // router.push("/(drawer)/conversations")
    });
  }, []);

  const frame = useSafeAreaFrame();

  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useConversations();
    console.log(data)

  const conversations = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <View style={{ paddingHorizontal: 15, flex: 1, paddingTop: useHeaderHeight() + 20 }}>
      <Image
        contentFit="cover"
        source={require("../../../assets/images/New folder/9.jpg")}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          position: "absolute",
          overflow: "hidden",
        }}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "black", opacity: 0.7 },
        ]}
      ></View>
 
        <KeyboardAvoidingView
          style={{
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
            noError
            containerStyle={{
              paddingHorizontal: 13,
              flex: 1,
              borderRadius: 100,
            }}
            style={{
              fontSize: 15,
              fontWeight: "500",
              letterSpacing: 1.5,
              paddingLeft: 5,
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
          style={{  paddingTop: 15, }}
        >
          {status === "loading" ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
            contentContainerStyle={{paddingBottom:  50, gap:20}}
              data={conversations}
              keyExtractor={(channel) => channel.id.toString()}
              renderItem={({ item }) => (
                <AppleStyleSwipeableRow key={item.id}>
                  <Conversation {...item} />
                </AppleStyleSwipeableRow>
              )}
              onEndReached={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.1} // Adjust this value if necessary
              ListFooterComponent={
                isFetchingNextPage ? <ActivityIndicator size="small" /> : null
              }
              // Add this to debug if onEndReached is firing
        
            />
          )}
        </View>  
    </View>
  );
}
