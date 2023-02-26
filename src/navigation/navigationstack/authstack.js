import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../../components/pages/auth/login';
import Capture from '../../components/pages/auth/capture';
import Register from '../../components/pages/auth/onboard';

export default function AuthStacks(){
    const AuthStack = createNativeStackNavigator();
    return (
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Capture" component={Capture} />
        <AuthStack.Screen name="Register" component={Register} />
        </AuthStack.Navigator>
        )
    }
    
    