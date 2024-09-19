import React from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useHeaderHeight } from "@react-navigation/elements";
import { Image } from "expo-image";
import { MaterialIcons, FontAwesome6, Entypo } from "@expo/vector-icons";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useConversations } from "@/hooks/channels";
import Input from "@/components/utils/Input";
import { useDebounce } from "@/hooks/useDebounce";
import AppleStyleSwipeableRow from "@/components/(channels)/drawer/SwipeAbleRow";
import Conversation from "@/components/(channels)/drawer/Conversation";

type FormValues = {
  search: string;
};

export default function Home() {
  const { control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      search: "",
    },
  });

  const searchQuery = watch('search');

  // Use debounce with a queue to handle search updates
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Fetch conversations with debounced search term
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isFetching } = useConversations(debouncedSearchQuery);
  const conversations = data?.pages.flatMap((page) => page.results) ?? [];

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
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "black", opacity: 0.7 }]}></View>

      <KeyboardAvoidingView
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, value } }) => (
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
              leftElement={<MaterialIcons name="person-search" size={20} color={"white"} />}
              rightElement={
                isFetching  && watch("search")? <ActivityIndicator size="small" color={"white"} /> :
                watch("search")?
                <MaterialIcons style={{left:7}} name="clear" onPress={() => setValue('search', '')} size={24} color={"white"} />: <></>}
                
              onChangeText={onChange}
              value={value}
            />
          )}
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

      <View style={{ paddingTop: 15 }}>
        {status === "loading" ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 50, gap: 20 }}
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
            onEndReachedThreshold={0.1}
            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
          />
        )}
      </View>
    </View>
  );
}
