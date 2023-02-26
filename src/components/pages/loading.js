import React, { useContext } from 'react';

import { ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { observer } from 'mobx-react-lite';

import AuthContext from '../../models/auth';

export default LoadingScreen = observer(() => {
    const AuthStore = useContext(AuthContext);
    return (
        <Portal>
        <Dialog visible={AuthStore.loadingstate}>
        <Dialog.Content>
        <ActivityIndicator animating={AuthStore.loadingstate} size={100} color='maroon' />
        </Dialog.Content>
        </Dialog>
        </Portal>
        )
    })