import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, TextInput, HelperText } from "react-native-paper";
import LoadingScreen from "../loading";

// GOOGLE LOGIN AND FIREBASE AUTHENTICATION
// FIREBASE AUTHENTICATION IS DONE TO MAKE IT EASY TO GET UPDATED API KEY
import { loginasync, googleloginasync} from "../../../services/api";
import * as Google from 'expo-auth-session/providers/google';
import firebase from '../../../services/firebase';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// STATE HANDLERS
import { observer } from "mobx-react";
import AuthContext from '../../../models/auth';
import UserContext from "../../../models/user";
import BorrowsContext from '../../../models/borrow';
import NotificationsModel from '../../../models/notification';
import BooksContext from "../../../models/books";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


export default Login = observer(() => {
    const AuthStore = useContext(AuthContext);
    const UserStore = useContext(UserContext);
    const BorrowStore = useContext(BorrowsContext);
    const NotificationsStore = useContext(NotificationsModel);
    const BooksStore = useContext(BooksContext);

    // Check if user data is stored in AsyncStorage on app load
    async function checkUserData() {
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');
    
        if (email && password) {
            // User data is stored in AsyncStorage, log in the user
            try{
                const response = await loginasync(email,password);
                AuthStore.donewithload();
                console.log(response);
                if(response.success === false){
                    navigation.navigate('Capture', response.message);
                }
                switch(response.user.status){
                    case 'fresh':
                        alert("You need to login through your google account!");
                        break;
                    case 'active':
                        UserStore.setUser(response);
                        NotificationsStore.fetchCurrentNotifications(UserStore.currentuser._id);
                        BorrowStore.fetchBorrows(UserStore.currentuser._id);
                        BooksStore.fetchBooksModel();
                        await AsyncStorage.setItem("Token", response.token);
                        AuthStore.loggedin(response.token);
                        alert("You have successfully logged in!");
                        break;
                }
            }catch(err){
                setemailinputerror(!emailinputerror);
                setpasswordinputerror(!passwordinputerror);
                alert("Invalid Credentials");
                AuthStore.donewithload();
                console.log(err);
            }
        }
    }

    checkUserData();

    const navigation = useNavigation();
    const handlesubmit = async() => {
        try{
            const response = await loginasync(email,password);
            AuthStore.donewithload();
            if(response.success === false){
                navigation.navigate('Capture', response.message);
                setemailinputerror(!emailinputerror);
                setpasswordinputerror(!passwordinputerror);
                return;
            }
            switch(response.user.status){
                case 'fresh':
                    alert("You need to login through your google account!");
                    break;
                case 'active':
                    await AsyncStorage.setItem('email', email);
                    await AsyncStorage.setItem('password', password);
                    UserStore.setUser(response);
                    NotificationsStore.fetchCurrentNotifications(UserStore.currentuser._id);
                    BorrowStore.fetchBorrows(UserStore.currentuser._id);
                    BooksStore.fetchBooksModel();
                    await AsyncStorage.setItem("Token", response.token);
                    AuthStore.loggedin(response.token);
                    alert("You have successfully logged in!");
                    break;
            }
        }catch(err){
            setemailinputerror(!emailinputerror);
            setpasswordinputerror(!passwordinputerror);
            alert("Invalid Credentials");
            AuthStore.donewithload();
            console.log(err);
        }
    }
    
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        expoClientId: "55235832534-ddpgbusqvhva16bmubfa92ktdvgrsprl.apps.googleusercontent.com",
        androidClientId: '55235832534-3fd4vj16jk0vl7bkdtd58t3qk15r5h81.apps.googleusercontent.com',
        iosClientId: '',
        scopes: ['profile','email'],
    });
    useEffect(() => {
        if (response?.type === 'success' && response?.params?.hd === 'tup.edu.ph') {
            const { id_token } = response.params;
            const auth = getAuth(firebase);
            const credential = GoogleAuthProvider.credential(id_token);
            async function callgooglelogin(){
                try{
                    const currentuser = await signInWithCredential(auth, credential);
                    const serverresponse = await googleloginasync(currentuser._tokenResponse);
                    if(serverresponse === undefined){
                        AuthStore.donewithload();
                        alert("An Error has occured with the server, please try again later!");
                    }
                    if(serverresponse.success){
                        switch (serverresponse.user.status){
                            case 'deactivated':
                                AuthStore.donewithload();
                                navigation.navigate('Capture');
                                break;
                            case 'fresh':
                                AuthStore.donewithload();
                                UserStore.setUser(serverresponse);
                                navigation.navigate('Register',{token: id_token});
                                break;
                            case 'active':
                                AuthStore.donewithload();
                                UserStore.setUser(serverresponse);
                                NotificationsStore.fetchCurrentNotifications(UserStore.currentuser._id);
                                BorrowStore.fetchBorrows(UserStore.currentuser._id);
                                BooksStore.fetchBooksModel();
                                await AsyncStorage.setItem("Token", id_token);
                                AuthStore.loggedin(id_token);
                                alert("Login Successful!");
                                break;
                        }
                    }else{
                        alert(serverresponse.message);
                    }
                }catch(error){
                    alert("An Error has Occurred Try Again Later.")
                    AuthStore.donewithload();
                    console.log(error);
                }
            }
            callgooglelogin();
        }else{
            AuthStore.donewithload();
            alert("Email is not Valid, TUP emails are required!");
        }
    },[response]);
    
    const [showpass,toggleshowpass] = useState(true);
    const [emailinputerror,setemailinputerror] = useState(false);
    const [passwordinputerror,setpasswordinputerror] = useState(false);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <LoadingScreen/>
        <View style={{maxWidth:300}}>
        <Image style={styles.imagecontainer} source={require('../../../../assets/icon.png')}/>
        <Text style={styles.welcome}>TUP-T</Text>
        <Text style={styles.welcome}>Learning Resource Center</Text>
        <TextInput 
        style={styles.loginput} 
        mode='outlined' 
        placeholder='example@tup.edu.ph' 
        label="TUP-T Email"
        value={email}
        error={emailinputerror}
        onChangeText={(text) => setEmail(text)}
        />
        {
            emailinputerror && <HelperText type="error" visible={emailinputerror}>
            Email address doesn't exist or wrong email spelling!
            </HelperText>
        }
        <TextInput 
        style={styles.passinput} 
        mode='outlined' 
        label="Password"
        placeholder='example123'
        value={password}
        secureTextEntry={showpass}
        error={passwordinputerror}
        onChangeText={(text) => setPassword(text)}
        right={<TextInput.Icon
            icon='eye' 
            onPress={()=>toggleshowpass(!showpass)}/>}
            />
        {
            passwordinputerror && <HelperText type="error" visible={passwordinputerror}>
            Check your spelling!
            </HelperText>
        }
            <Button 
            style={{marginTop:10}}
            icon="login" 
            mode="contained" 
            buttonColor="maroon"
            onPress={()=>{handlesubmit(),AuthStore.letmeload()}}>
            Login!
            </Button>
            <Text style={styles.instruction}>Or you can try Logging in through your {'\n'}Google Account</Text>
            <Button
            contentStyle={styles.googleloginbutton}
            icon="google-plus"
            mode="outlined"
            disabled={!request}
            onPress={()=>{AuthStore.letmeload(),promptAsync()}}>
            Google Login
            </Button>
            <Text style={styles.instruction}>Want a suprise? {'\n\n'}You can also Sign Up using your {'\n'} Google Account</Text>
            </View>
            </KeyboardAwareScrollView>
            )
        });
        
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "mistyrose",
            },
            imagecontainer:{
                marginTop:20,
                height: 120,
                width: 120,
                alignSelf: 'center',
            },
            welcome: {
                fontSize: 28,
                textAlign: "center",
                margin: 10,
                fontWeight: "bold"
            },
            instruction:{
                fontSize: 15,
                textAlign: "center",
                color:'grey',
                margin:10
            },
            loginput: {
                width: 300,
                alignSelf:'center',
            },
            passinput: {
                width: 300,
                alignSelf:'center',
            },
            googleloginbutton:{
                backgroundColor:'white',
            }
        })