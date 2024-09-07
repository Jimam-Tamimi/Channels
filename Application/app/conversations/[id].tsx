import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react'
import {  Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Conversation() {
    const local = useLocalSearchParams();

    return (
        <SafeAreaView>
            <Text>{local.id}</Text>
            <Link href={"/"}>Got to main page</Link>

        </SafeAreaView>
    )
}
