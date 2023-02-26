import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { observer } from 'mobx-react';

export default Penalty = observer(() => {
    return (
        <>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
            <View style={styles.container}>
                <Text style={{color:'white'}}> Hello! </Text>
            </View>
        </ImageBackground>
        </>
    )
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        zIndex:1,
    },
    imagebackground:{
        flex: 1,
        justifyContent:'center',
        alignSelf:'auto',
        zIndex:0,
    }
});