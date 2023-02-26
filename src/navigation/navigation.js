import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';

import UserStacks from './navigationstack/userstack';
import AuthStacks from './navigationstack/authstack';
import AuthContext from '../models/auth';

import {observer} from 'mobx-react';

export default NavigationStack = observer(() => {
    const AuthStore = useContext(AuthContext);
    return (
        <NavigationContainer>
        {
            AuthStore.amiauthenticated ? <UserStacks/> : <AuthStacks/>
        }
        </NavigationContainer>
        )
    });
    
    