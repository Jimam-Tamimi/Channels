import Avatar from "@/components/utils/Avater";
import PressableWithScale from "@/components/utils/PressableScale";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerTitleAlign: "center",
          // Custom header to evenly space the items
          header: () => (
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  flex: 1,
                  paddingHorizontal: 15,
                  borderBottomWidth: 0.2,
                  borderBottomColor: "#fff",
                  paddingBottom: 10,
                  paddingTop: insets.top + 5,
                  backgroundColor: "#00000099"
                },
              ]}
            >
              <View className="flex-row items-center justify-start gap-8">
                <PressableWithScale
                  duration={100}
                  onPressInOptions={{
                    backgroundColor: "#00000000",
                    scale: 0.85,
                  }}
                  onPress={(e) => router.back()}
                  onPressOutOptions={{ backgroundColor: "#00000000", scale: 1 }}
                >
                  <FontAwesome6
                    style={{ paddingHorizontal: 4, paddingVertical: 2 }}
                    name="less-than"
                    size={22}
                    color="white"
                  />
                </PressableWithScale>
                <View className="flex-row items-center justify-start gap-2">
                  <Avatar
                    uri="https://randomuser.me/api/portraits/men/32.jpg"
                    size={35}
                    isActive
                  />
                  <Text style={styles.headerTitle}>Jimam Tamimi</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-end gap-8">
                <PressableWithScale
                  duration={100}
                  onPressInOptions={{
                    backgroundColor: "#00000000",
                    scale: 0.85,
                  }}
                  onPress={(e) => {}}
                  onPressOutOptions={{ backgroundColor: "#00000000", scale: 1 }}
                >
                  <Feather name="phone" size={24} color="white" />
                </PressableWithScale>
                <PressableWithScale
                  duration={100}
                  onPressInOptions={{
                    backgroundColor: "#00000000",
                    scale: 0.85,
                  }}
                  onPress={(e) => {}}
                  onPressOutOptions={{ backgroundColor: "#00000000", scale: 1 }}
                >
                  <Feather name="video" size={24} color="white" />
                </PressableWithScale>
              </View>
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "100%",
    flex: 1,
    paddingHorizontal: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: "#fff",
    paddingBottom: 10,
    // shadowColor: '#fff',
    // shadowOffset: { width: , height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    // flex: 1, // Makes sure the title takes available space
  },
  icon: {
    padding: 5,
  },
});
