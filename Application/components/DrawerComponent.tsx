import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DrawerComponent(props:any) {
  const insets = useSafeAreaInsets();
  return (
    <View  className='flex-1 bg-[#000000f0]' style={{paddingTop: insets.top, backgroundColor: "#000000f0"}}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      
    </View>
  )
}