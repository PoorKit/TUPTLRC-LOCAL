import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

export default Capture = (route) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <Image style={styles.imagecontainer} source={require('../../../../assets/icon.png')}/>
        <Text style={styles.welcome}>Woops!</Text>
        <Text style={styles.message}>{route.route.params}</Text>
        <Text style={styles.instructions}>If you think this is wrong  visit the {'\n'} TUPT Library ASAP</Text>
        <Button icon='login' mode="contained" buttonColor="maroon" onPress={()=>navigation.navigate('Login')}>Back to Login</Button>
        </View>
        )
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        },
        imagecontainer:{
            height: 120,
            width: 120,
            alignSelf: 'center',
        },
        welcome: {
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 10,
        },
        message:{
            fontSize:30,
            fontWeight:'bold',
            color:'maroon',
            textAlign:'center',
            margin: 10,
        },
        instructions: {
            textAlign: 'center',
            color: '#333333',
            margin: 10,
        },
    })