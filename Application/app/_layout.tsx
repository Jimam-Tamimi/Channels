import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../assets/global.css"

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),

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

  return  (

    <Stack  screenOptions={{ headerShown: true,   }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>

  );
}
