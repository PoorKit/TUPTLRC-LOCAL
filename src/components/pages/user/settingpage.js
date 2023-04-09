import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, View, Image, ScrollView } from 'react-native';
import { Card, IconButton, Portal, Text, Dialog, TextInput, HelperText, Button } from 'react-native-paper';

import UserContext from '../../../models/user';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../../services/notifications';
import { registerNotification, unregisterNotification, updateUserInformation, updateUserPassword } from '../../../services/api';

import Loading from '../loading';
import AuthContext from '../../../models/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default Settings = observer(() => {
    const UserStore = useContext(UserContext);
    const AuthStore = useContext(AuthContext);
    
    // Inline this code with Notifications Models if Possible
    let devicepushtoken;
    let isSameToken;
    async function setdeviceasdefault(){
        AuthStore.letmeload();
        try{
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                  const { status } = await Notifications.requestPermissionsAsync();
                  finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                  alert('Failed to get push token for push notification!');
                  return;
                }
                devicepushtoken = (await Notifications.getExpoPushTokenAsync()).data;
                if(devicepushtoken !== UserStore.currentuser.notification?.pushToken){
                    UserStore.setnotification(devicepushtoken);
                    registerNotification(UserStore.currentuser._id,devicepushtoken);
                }else{
                    alert("This is already your default device for notifications\nWant to Unsubscribe?\nLong Press!");
                }
              } else {
                alert('Must use physical device for Push Notifications');
              }
        }catch(error){
            console.log(error);
        }
        AuthStore.donewithload();
    };
    function unsubscribetonotifcations(){
        AuthStore.letmeload();
        try{
            alert("Unsubscribed to Notifications")
            UserStore.setnotification('');
            unregisterNotification(UserStore.currentuser._id);
        }catch(error){
            console.log(error);
        }
        AuthStore.donewithload();
    }
    useEffect(() => {
        try{
            async function getdevicetoken(){
                devicepushtoken = await registerForPushNotificationsAsync();
                isSameToken = (UserStore.currentuser.notification?.pushToken !== null || UserStore.currentuser.notification?.pushToken !== undefined) && UserStore.currentuser.notification?.pushToken !== devicepushtoken;
            }
            getdevicetoken();
        }catch(error){
            console.log(error);
        }
    },[])
    // END HERE
    
    const [profilevisibility,setprofilevisibility] = useState(false);
    const [settingsvisibility,setsettingsvisibility] = useState(false);
    
    const toggleVisibility = (type) => {
        if (type === "Profile") {
            setprofilevisibility(true);
            setsettingsvisibility(false);
        } else {
            setsettingsvisibility(true);
            setprofilevisibility(false);
        }
    }
    
    const [CourseSectionIDModalvisibility,setCourseSectionIDModalvisibility] = useState(false);
    const [PersonalVisibility, setPersonalVisibility] = useState(false);
    const [PasswordVisibility, setPasswordVisibility] = useState(false);
    
    const [password1,setpassword1] = useState('');
    const [password1visibility,setpassword1visibility] = useState(false);
    const [password2,setpassword2] = useState('');
    const [password2visibility,setpassword2visibility] = useState(false);
    const [helperpasswordvisibility, sethelperpasswordvisibility] = useState(false);
    
    async function passwordhandler(){
        AuthStore.letmeload();
        try{
            const response = await updateUserPassword(UserStore.currentuser._id,{password1: password1,password2: password2});
            if(!response){
                sethelperpasswordvisibility(true);
            }else{
                setPasswordVisibility(false);
                sethelperpasswordvisibility(false);
            }
        }catch(error){
            alert("Internal Error Occured");
        }
        AuthStore.donewithload();
    }
    
    function deactivateaccount(){
        AuthStore.letmeload();
        try{
            alert("Are you sure you want to deactivate your account?");
            const response = deactivateaccount(UserStore.currentuser._id);
            if(response.data.success){
                alert("Deactivated Successfully");
                AuthStore.logout();
            }else{
                console.log(response.error);
                alert("Deactivation Failed");
            }
            
        }catch(error){
            console.log(error);
        }
        AuthStore.donewithload();
    }
    
    return (
        <>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <Portal>
        <Loading/>
        {/* DIALOG FOR STUDENT INFO */}
        <Dialog visible={CourseSectionIDModalvisibility} onDismiss={()=>{updateUserInformation(UserStore.currentuser._id,UserStore.currentuser),setCourseSectionIDModalvisibility(false)}} style={{backgroundColor:'white'}}>
        {/* <Dialog visible={CourseSectionIDModalvisibility} onDismiss={()=>{updateUserInformation(UserStore.currentuser._id,{course: UserStore.currentuser.course,section: UserStore.currentuser.section,id_number:UserStore.currentuser.id_number}),setCourseSectionIDModalvisibility(false)}} style={{backgroundColor:'white'}}></Dialog> */}
        <Dialog.Title style={{fontWeight:'bold',color:'maroon',textAlign:'center'}}>Profile Information</Dialog.Title>
        <Dialog.Content>
        {/* DISABLED INPUT FOR COURSE */}
        <TextInput
        style={{
            marginTop:10,
        }}
        mode="outlined"
        label="ID Number"
        placeholder='TUPT-XX-XXXX'
        autoCapitalize="characters"
        value={UserStore.currentuser.course}
        disabled={true}
        />
        {/* INPUT FOR SECTION */}
        <TextInput
        style={{
            marginTop:10,
        }}
        mode="outlined"
        label="Section"
        placeholder="Course-Section"
        autoCapitalize="characters"
        value={UserStore.currentuser.section}
        onChangeText={(text) => UserStore.setsection(text)}
        />
        <HelperText type="info">
        Auto Capitalization is applied
        </HelperText>
        {/* DISABLED INPUT FOR ID */}
        <TextInput
        style={{
            marginTop:10,
        }}
        mode="outlined"
        label="ID Number"
        placeholder='TUPT-XX-XXXX'
        autoCapitalize="characters"
        value={UserStore.currentuser.id_number}
        disabled={true}
        />
        </Dialog.Content>
        </Dialog>
        {/* DIALOG FOR Personal INFO */}
        <Dialog visible={PersonalVisibility} onDismiss={()=>{updateUserInformation(UserStore.currentuser._id,{contact: UserStore.currentuser.contact}),setPersonalVisibility(false)}} style={{backgroundColor:'white'}}>
        <Dialog.Title style={{fontWeight:'bold',color:'maroon',textAlign:'center'}}>Personal Information</Dialog.Title>
        <Dialog.Content>
        <TextInput
        mode='outlined'
        label='Phone Number'
        keyboardType='number-pad'
        placeholder='9XX-XXX-XXXX'
        value={UserStore.currentuser.contact ? UserStore.currentuser.contact.toString() : null}
        onChangeText={(text) => {
            UserStore.setcontact(text);
        }}
        maxLength={10}
        onSubmitEditing={() => {
            updateUserInformation(UserStore.currentuser._id,{Personal: UserStore.currentuser.contact}),setPersonalVisibility(false)
        }}
        />
        <HelperText type="info" padding='none'>
        Skip the first (0) of your phone number
        </HelperText>
        </Dialog.Content>
        </Dialog>
        {/* DIALOG FOR PASSWORD */}
        <Dialog  visible={PasswordVisibility} onDismiss={()=>{alert("Closed"),setPasswordVisibility(false)}} style={{backgroundColor:'white'}}>
        <Dialog.Title style={{fontWeight:'bold',color:'maroon',textAlign:'center'}}>Change Password</Dialog.Title>
        <Dialog.Content>
        <TextInput
        mode='outlined'
        label='New Password'
        placeholder='Old Password'
        onChangeText={(text) => {
            setpassword1(text);
        }}
        secureTextEntry={password1visibility}
        right={<TextInput.Icon icon="eye" size={24} onPress={()=>{setpassword1visibility(!password1visibility)}}/>}
        />
        <HelperText visible={helperpasswordvisibility} type="error">
        Password mismatch or password is too short (10 characters minimum)
        </HelperText>
        <TextInput
        mode='outlined'
        label='Confirm Password'
        placeholder='Old Password'
        onChangeText={(text) => {
            setpassword2(text);
        }}
        secureTextEntry={password2visibility}
        right={<TextInput.Icon icon="eye" size={24} onPress={()=>{setpassword2visibility(!password2visibility)}}/>}
        onSubmitEditing={() => {
            passwordhandler();
        }}
        
        />
        <HelperText visible={helperpasswordvisibility} type="error">
        Password mismatch or password is too short (10 characters minimum)
        </HelperText>
        </Dialog.Content>
        <Dialog.Actions>
        <Button
        mode='outlined'
        icon="pencil"
        textColor='maroon'
        onPress={()=>{passwordhandler()}}
        >
        SUBMIT
        </Button>
        </Dialog.Actions>
        </Dialog>
        </Portal>
        
        <View style={styles.container}>
        <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
        <Image style={{width:100,height:100,borderRadius:50}} source={{uri: UserStore.currentuser.avatar.url}}/>
        <Text style={{fontSize:20,fontWeight:'bold', color:'white'}}>{UserStore.currentuser.name}</Text>
        <Text style={{fontSize:15,color:'white'}}>{UserStore.currentuser.course} - {UserStore.currentuser.section}</Text>
        </View>
        <View style={{flex:(profilevisibility || settingsvisibility) ? 2 : 1, backgroundColor:'maroon',borderTopLeftRadius:20,borderTopRightRadius:20,justifyContent:'center'}}>
        <KeyboardAwareScrollView>
        {/* PROFILE CARD */}
        <Card style={{margin:20, flex:(profilevisibility ? 2 : 1)}}>
        <Card.Content>
        {/* VIEW FOR PROFILE HEADER */}
        <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
        <IconButton style={{alignSelf:'center'}} size={35} icon='account-circle-outline'/>
        </View>
        <View style={{flex:3, alignSelf:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>PROFILE</Text>
        <Text style={{fontSize:12}}>Update profile information</Text>
        </View>
        <View style={{flex:1}}>
        {
            profilevisibility ? 
            <IconButton style={{alignSelf:'center'}} size={35} iconColor='dimgrey' icon='chevron-up' onPress={()=>setprofilevisibility(false)}/>
            :
            <IconButton style={{alignSelf:'center'}} size={35} iconColor='dimgrey' icon='chevron-down' onPress={()=>toggleVisibility("Profile")}/>
        }
        </View>
        </View>
        {
            profilevisibility ?
            // UPDATABLE CONTENT
            <ScrollView style={{
                overflow:'scroll'
            }}>
            {/* VIEW FOR COURSE AND SECTION */}
            <View style={{
                flexDirection:'row'
            }}>
            <IconButton 
            style={{
                flex:1,
                alignSelf:'center'
            }} size={30} 
            iconColor='dimgrey' 
            icon="school-outline"/> 
            <View 
            style={{
                flex:2, 
                alignSelf:'center'
            }}>
            <Text 
            style={{
                justifyContent:'center',
                alignSelf:'center',
                textAlign:'center'
            }}>
            {
                UserStore.currentuser.course === null || UserStore.currentuser.course === undefined || UserStore.currentuser.course === "" ?
                "No course selected"
                :
                UserStore.currentuser.course
            }
            </Text>
            <Text 
            style={{
                justifyContent:'center',
                alignSelf:'center'
            }}>
            {UserStore.currentuser.section === null || UserStore.currentuser.section === undefined ?
                <Text> No section selected </Text>
                :
                <Text> {UserStore.currentuser.section} </Text>
            }
            </Text>
            <Text 
            style={{
                justifyContent:'center',
                alignSelf:'center'
            }}>
            {UserStore.currentuser.id_number === null || UserStore.currentuser.id_number === undefined ?
                <Text> No ID Number</Text>
                :
                <Text> {UserStore.currentuser.id_number} </Text>
            }
            </Text>
            </View> 
            <IconButton 
            style={{
                flex:1,
                alignSelf:'center'
            }} 
            size={30} 
            mode='contained' 
            iconColor='white' 
            containerColor='maroon' 
            icon="pencil"
            onPress={()=>setCourseSectionIDModalvisibility(true)}
            />
            </View>
            {/* VIEW FOR Personal INFORMATION */}
            <View style={{flexDirection:'row'}}>
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} iconColor='dimgrey'icon="account-outline"/> 
            <View style={{flex:2, alignSelf:'center'}}>
            <Text style={{justifyContent:'center',alignSelf:'center', textAlign:'center'}}>
            {UserStore.currentuser.contact === 0 ?
                "No Personal information"
                :
                UserStore.currentuser.contact
            }
            </Text>
            </View> 
            <IconButton 
            style={{
                flex:1,
                alignSelf:'center'
            }} 
            size={30} 
            mode='contained' 
            iconColor='white' 
            containerColor='maroon' 
            icon="pencil"
            onPress={()=>setPersonalVisibility(true)}
            />
            
            </View>
            </ScrollView>
            : 
            <></>
        }
        </Card.Content>
        </Card>
        {/* SETTINGS CARD */}
        <Card style={{margin:20, flex:(settingsvisibility ? 2 : 1)}}>
        <Card.Content>
        {/* SETTINGS HEADER */}
        <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}>
        <IconButton style={{alignSelf:'center'}} size={35} icon='cog-outline'/>
        </View>
        <View style={{flex:3, alignSelf:'center'}}>
        <Text style={{fontSize:20,fontWeight:'bold'}}>SETTINGS</Text>
        <Text style={{fontSize:12}}>Update user settings</Text>
        </View>
        <View style={{flex:1}}>
        {
            settingsvisibility ?
            <IconButton style={{alignSelf:'center'}} size={35} iconColor='dimgrey' icon='chevron-up' onPress={()=>setsettingsvisibility(false)}/>
            :
            <IconButton style={{alignSelf:'center'}} size={35} iconColor='dimgrey' icon='chevron-down' onPress={()=>toggleVisibility('Settings')}/>
        }
        </View>
        </View>
        {
            settingsvisibility ?
            // UPDATABLE CONTENT
            <ScrollView>
            {/* VIEW FOR PASSWORD */}
            <View style={{flexDirection:'row'}}>
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} iconColor='dimgrey'icon="lock-outline"/> 
            <View style={{flex:2, alignSelf:'center'}}>
            <Text style={{justifyContent:'center',alignSelf:'center', textAlign:'center'}}>
            Update Password?
            </Text>
            </View> 
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} mode='contained' iconColor='white' containerColor='maroon' icon="lock" onPress={()=>setPasswordVisibility(true)}/>
            </View>
            {/* VIEW FOR NOTIFICATION SUBSCRIPTION */}
            <View style={{flexDirection:'row'}}>
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} iconColor='dimgrey' icon={UserStore.currentuser.notification?.pushToken === devicepushtoken ? "bell-check-outline":"bell-cancel-outline"}/> 
            <View style={{flex:2, alignSelf:'center'}}>
            <Text style={{justifyContent:'center',alignSelf:'center', textAlign:'center'}}>
            {
                isSameToken ?
                'Unsubscribe to Notifications?'
                :
                'Subscribe to Notifications?'
            }
            </Text>
            </View> 
            <IconButton style={{flex:1,alignSelf:'center'}} 
            size={30} mode='contained' 
            iconColor='white'  
            containerColor='maroon' 
            icon={UserStore.currentuser.notification?.pushToken === devicepushtoken ? "bell-check":"bell-cancel"} 
            onPress={()=>setdeviceasdefault()} 
            onLongPress={()=>unsubscribetonotifcations()}/>
            </View>
            {/* VIEW FOR DEACTIVATION */}
            <View style={{flexDirection:'row'}}>
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} iconColor='dimgrey'icon="account-cancel-outline"/> 
            <View style={{flex:2, alignSelf:'center'}}>
            <Text style={{justifyContent:'center',alignSelf:'center', textAlign:'center'}}>
            Deactivate Account?
            </Text>
            </View> 
            <IconButton style={{flex:1,alignSelf:'center'}} size={30} mode='contained' iconColor='white' containerColor='maroon' icon="account-cancel"
            onPress={()=>deactivateaccount()}/>
            </View>
            </ScrollView>
            : 
            <></>
        }
        </Card.Content>
        </Card>
        </KeyboardAwareScrollView>
        </View>
        </View>
        </ImageBackground>
        </>
        )
    })
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            zIndex:1,
            marginTop: 10
        },
        imagebackground:{
            flex: 1,
            justifyContent:'center',
            alignSelf:'auto',
            zIndex:0,
        }
    });