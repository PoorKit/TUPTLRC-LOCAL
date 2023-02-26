import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default Capture = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Oh No!</Text>
        <Text style={styles.instructions}>It looks like your account has been {'\n'} deactivated</Text>
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
        welcome: {
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
        },
        instructions: {
            textAlign: 'center',
            color: '#333333',
            marginBottom: 5,
        },
    })