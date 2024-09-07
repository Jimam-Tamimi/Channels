import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useState, useEffect } from 'react';
import { router, SplashScreen } from 'expo-router';
import { Text, View } from 'react-native';

export default function RootLayout() {
 
 
   

 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root

          options={{
            drawerLabel: 'Conversations',
            title: 'Conversations',
            headerTitleAlign: "center"
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
