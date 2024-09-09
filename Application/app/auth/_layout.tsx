import { Slot, Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name='sign-in'  options={{ headerShown:false}}/>
      <Stack.Screen name='sign-up'  options={{ headerShown:false}}/>
    </Stack>  
  )
}
