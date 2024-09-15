import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../assets/global.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { removeAuthData } from "@/secure-storage/authStorage";
import { useAuthRedirect } from "@/hooks/auth";
import { LogBox } from "react-native";
import {
  createNotifications,
  RotateInRotateOut,
  RotateZIn,
  SlideInLeftSlideOutRight,
  ZoomInDownZoomOutDown,
  ZoomInDownZoomOutUp,
} from "react-native-notificated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";

// Ignore all log notifications
LogBox.ignoreAllLogs();
export const unstable_settings = {
  initialRouteName: "(drawer)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),

    // InterBlack: require("../assets/fonts/Inter/static/Inter_18pt-Black.ttf"),
    // InterExtraBold: require("../assets/fonts/Inter/static/Inter_18pt-ExtraBold.ttf"),
    // InterBold: require("../assets/fonts/Inter/static/Inter_18pt-Bold.ttf"),
    // InterSemiBold: require("../assets/fonts/Inter/static/Inter_18pt-SemiBold.ttf"),
    // InterMedium: require("../assets/fonts/Inter/static/Inter_18pt-Medium.ttf"),
    // InterRegular: require("../assets/fonts/Inter/static/Inter_18pt-Regular.ttf"),
    // InterLight: require("../assets/fonts/Inter/static/Inter_18pt-Light.ttf"),
    // InterExtraLight: require("../assets/fonts/Inter/static/Inter_18pt-ExtraLight.ttf"),
    // InterThin: require("../assets/fonts/Inter/static/Inter_18pt-Thin.ttf")
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const queryClient = new QueryClient();
  const { NotificationsProvider, useNotifications, ...events } =
    createNotifications({
      animationConfig: ZoomInDownZoomOutUp,
      defaultStylesSettings: {
        darkMode: true,

        globalConfig: {
          bgColor: "#00000090",
          borderType: "accent",
        },
      },
    });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WebSocketProvider>
          <GestureHandlerRootView>
            <NotificationsProvider>
              <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="(drawer)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="channels"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </QueryClientProvider>
            </NotificationsProvider>
          </GestureHandlerRootView>
        </WebSocketProvider>
      </PersistGate>
    </Provider>
  );
}
