import { Slot, Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name='index'  options={{ headerShown:false}}/>
      <Stack.Screen name='signup'  options={{ headerShown:false}}/>
    </Stack>  
  )
}
