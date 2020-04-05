import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux'

import { AuthNavigator, MainNavigator } from './AppNavigator'

export const Navigator = () => {
    const isAuth = useSelector(state => !!state.user.user)

    return (
        <NavigationContainer>
            {!isAuth && <MainNavigator />}
            {/* {!isAuth && <AuthNavigator />} */}
        </NavigationContainer>
    )
}