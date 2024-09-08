

import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import React, { useEffect, useState } from 'react'
import { Link, Redirect, router } from 'expo-router'
import Button from '@/components/Button';
export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {   
        
        setTimeout(() => {
            
            if (!isLoggedIn) {
                router.replace("/auth")
            } else {
                router.replace("/")
            }
        }, );
        return () => {

        }
    }, [])
    return (
        <View>
            {/* <Text>Main chat list</Text>
             */}
             
        </View>
    )
}



