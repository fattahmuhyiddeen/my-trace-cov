import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import StartScreen from '@screens/Start'
import PhoneScreen from '@screens/Phone'
import PermissionScreen from '@screens/Permission'
import ConsentScreen from '@screens/Consent'

import HomeScreen from '@screens/Home'
import VerifyScreen from '@screens/Verify'
import PinScreen from '@screens/Pin'

const AuthStackNav = createStackNavigator()
export const AuthNavigator = () => (
    <AuthStackNav.Navigator initialRouteName="Permission">
        <AuthStackNav.Screen options={{ headerShown: false }} name="Phone" component={PhoneScreen} />
        <AuthStackNav.Screen options={{ headerShown: false }} name="Start" component={StartScreen} />
        <AuthStackNav.Screen options={{ headerShown: false }} name="Consent" component={ConsentScreen} />
        <AuthStackNav.Screen options={{ headerShown: false }} name="Permission" component={PermissionScreen} />
    </AuthStackNav.Navigator>
)

const HomeStackNav = createStackNavigator()
const HomeNavigator = () => (
    <HomeStackNav.Navigator initialRouteName="Status">
        <HomeStackNav.Screen options={{ headerShown: false }} name="Status" component={HomeScreen} />
    </HomeStackNav.Navigator>
)

const UploadStackNav = createStackNavigator()
const UploadNavigator = () => (
    <UploadStackNav.Navigator initialRouteName="Verify">
        <UploadStackNav.Screen options={{ headerShown: false }} name="Verify" component={VerifyScreen} />
        <UploadStackNav.Screen options={{ headerShown: false }} name="Pin" component={PinScreen} />
    </UploadStackNav.Navigator>
)

const MainTabNav = createBottomTabNavigator()
export const MainNavigator = () => (
    <MainTabNav.Navigator initialRouteName="Home">
        <MainTabNav.Screen options={{ headerShown: false }} name="Home" component={HomeNavigator} />
        <MainTabNav.Screen options={{ headerShown: false }} name="Upload" component={UploadNavigator} />
    </MainTabNav.Navigator>
)