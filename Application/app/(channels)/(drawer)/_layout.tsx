import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useState, useEffect } from "react";
import { router, SplashScreen } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import DrawerComponent from "@/components/DrawerComponent";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Avatar from "@/components/utils/Avater";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useAuthRedirect, useSignOut } from "@/hooks/auth";
import { Image } from "expo-image";
import LoadingScreen from "@/components/utils/LoadingScreen";
import { notify } from "react-native-notificated";
export default function RootLayout() {
  const isLoading = useAuthRedirect();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const insets = useSafeAreaInsets();
  const signOut = useSignOut();

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <View style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          drawerStatusBarAnimation: "slide",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerLabelStyle: { marginLeft: -18 },
          drawerActiveBackgroundColor: "green",
          headerTransparent: true,
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerTitleAlign: "center",

          // Custom header to evenly space the items
          header: () => (
            <View
              style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}
            >
              {/* Drawer Toggler Icon */}
              <AntDesign
                name="menu-fold"
                size={24}
                color="white"
                onPress={() => navigation.toggleDrawer()}
                style={styles.icon}
              />
              {/* Title */}
              <Text style={styles.headerTitle}>Conversations</Text>
              {/* Avatar */}
              <Pressable onPress={e => {
                signOut()
              }}>
                <Avatar
                  uri="https://randomuser.me/api/portraits/men/32.jpg"
                  size={40}
                  isActive
                />
              </Pressable>
            </View>
          ),
        })}
        drawerContent={(props) => {
          return <DrawerComponent {...props} />;
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Conversations",
            title: "Conversations",
            drawerIcon: ({ size, color }) => (
              <AntDesign name="message1" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="message-requests"
          options={{
            drawerLabel: "Message Requests",
            title: "Message Requests",
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons
                name="message-text-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="archived"
          options={{
            drawerLabel: "Archived",
            title: "Archived",
            drawerIcon: ({ size, color }) => (
              <Entypo name="archive" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1, // Makes sure the title takes available space
  },
  icon: {
    padding: 5,
  },
});
