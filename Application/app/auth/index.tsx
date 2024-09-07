

import { Dimensions, ImageBackground, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
export default function Auth() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const insets = useSafeAreaFrame()
  useEffect(() => {

    return () => {

    }
  }, [])

  return (

    <View className='flex-col items-center justify-center flex-1 w-full '   >
      <Image contentFit='cover' source={require("../../assets/images/wallpaperflare.com_wallpaper.jpg")} style={[styles.image, StyleSheet.absoluteFill]} />
      <View className='absolute top-0 w-full h-full bg-black opacity-50 '></View>

      <View className='container w-full max-w-full gap-32'>

        <View className='gap-3'>
          <Text className='text-2xl font-bold tracking-widest text-[#fffafc] opacity-75'>WELCOME</Text>
          <Text style={{ letterSpacing: 8 }} className='text-6xl font-bold leading-[1.35]   text-white'>Sign In To Continue</Text>
          <Text className='font-semibold tracking-[2] text-lg text-white'>Don't Have An Account?
            <Link className='' href={"/auth"}>
              <Text className='font-bold text-[rgba(235,37,96,0.91)]'> Sign Up</Text>
            </Link>
          </Text>

        </View>

        <View className='gap-7'>

          <View className='flex-row justify-between  *:text-white bg-[#3236458f] px-5 py-2.5 rounded-md font-bold  items-center max-w-full'>
            <TextInput className='flex-1 text-lg font-semibold tracking-widest text-white ' placeholderTextColor={"white"} placeholder='Email' />
            <Fontisto name="email" size={20} color={"white"} />
          </View>

          <View className='flex-row justify-between  *:text-white bg-[#3236458f] px-5 py-2.5 rounded-md font-bold  items-center max-w-full'>
            <TextInput keyboardType='visible-password' textContentType='password' className='flex-1 text-lg font-semibold tracking-widest text-white ' placeholderTextColor={"white"} placeholder='Password' />
            {/* <FontAwesome name="eye" size={20} color="white" /> */}
            {/* <FontAwesome6 name="eye-low-vision" size={16} color="white"  /> */}
            <MaterialCommunityIcons name="form-textbox-password" size={21} color="white" />
          </View>
          <Pressable onPress={e => console.log(e)} className={`bg-[rgba(235,37,96,0.62)]   rounded duration-300 transition-all ease-in-out active:bg-[rgba(235,37,96,0.91)] py-2.5 w-full `}>
            <Text className={`  w-full text-center text-white text-lg m-auto font-bold `}>Click Me</Text>
          </Pressable>
          <View>
            <Text className='self-center text-lg font-bold tracking-widest text-white active:text-[rgba(235,37,96,0.91)] duration-300 transition-all ease-in-out'>Forgot Passowrd?</Text>

          </View>
          <View className='flex-row items-center justify-between ' style={{ marginTop: 20 }}>
            <View className='' style={{ width: Dimensions.get('window').width / 100 * 40, height: 2.5, borderRadius: 1000, backgroundColor: 'white', }}></View>
            <Text className='font-bold text-white '>OR</Text>
            <View className='' style={{ width: Dimensions.get('window').width / 100 * 40, height: 2.5, borderRadius: 1000, backgroundColor: 'white', }}></View>
          </View>

          <View className='flex-row items-center justify-center gap-16 '>
            <Image source={require("../../assets/images/Google Logo.svg")} style={{ width: 40, height: 40, }} />
            <Image source={require("../../assets/images/facebook-logo.png")} style={{ width: 40, height: 40, }} />
            <Image source={require("../../assets/images/apple logo.svg")} style={{ width: 40, height: 40, }} />
          </View>
        </View>

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: "100%",
    height: "100%",
    zIndex: -100
  },
  socialLoginImage: {
    width: 40,
    height: 40,
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
  },
});
