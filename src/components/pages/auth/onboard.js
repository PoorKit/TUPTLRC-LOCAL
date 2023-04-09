// Initialize for React Native
import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, TextInput, HelperText, Avatar, SegmentedButtons } from 'react-native-paper';
import { observer } from "mobx-react-lite";
import MultiSelect from 'react-native-multiple-select';

import { updateUserInformation, updateUserPassword } from "../../../services/api";

import AuthContext from "../../../models/auth";
import UserContext from "../../../models/user";
import BorrowsContext from '../../../models/borrow';
import NotificationsModel from '../../../models/notification';
import BooksContext from "../../../models/books";

// OPTIONALLY ADDING SUBSCRIPTION TO NOTIFICATIONS

export default Register = observer(({ route, navigation })=>{
    const UserStore = useContext(UserContext);
    const AuthStore = useContext(AuthContext);
    const BorrowStore = useContext(BorrowsContext);
    const NotificationsStore = useContext(NotificationsModel);
    const BooksStore = useContext(BooksContext);

    const [step1,setstep1] = useState(true);
    const [step2,setstep2] = useState(false);
    const [step3,setstep3] = useState(false);
    const token = route.params.token;
    // Code Generator


    // Step 1 to Step 2
    function step1tostep2() {
        setstep1(false);
        setstep2(true);
    }
    // Step 2 to Step 3
    const [IDVALUE, setIDVALUE ] = useState();
    const [COURSEVALUE, setCOURSEVALUE ] = useState();
    const [SECTIONVALUE, setSECTIONVALUE ] = useState();
    const [PHONEVALUE, setPHONEVALUE ] = useState();
    const [STEP2ERROR, setSTEP2ERROR] = useState(false);
    function verifyinput(){
        if (IDVALUE && COURSEVALUE && SECTIONVALUE && PHONEVALUE){
            let IDverificationarray = IDVALUE.split("-");
            if(IDverificationarray[0] !== "TUPT" || isNaN(IDverificationarray[1]) || isNaN(IDverificationarray[2]) || IDverificationarray.length !== 3){
                alert("Please check if you have correctly filled up all fields");
                setSTEP2ERROR(true);
                return null;
            }
            setSTEP2ERROR(false);
            setstep2(false);
            setstep3(true);
            alert("You won't be able to change the ID NUMBER and COURSE CODE without going to the Library, Verify that these are accurate!");
        }else{
            alert("Please fill all the fields");
            setSTEP2ERROR(true);
        }
    }
    // Step 3 to Server
    function updateaccountinformation(){
        try{
            updateUserInformation(UserStore.currentuser._id,{id_number : IDVALUE,course: COURSEVALUE,section: SECTIONVALUE,contact: PHONEVALUE, status: 'active'});
            UserStore.setcourse([COURSEVALUE]);
            UserStore.setid(IDVALUE);
            UserStore.setsection(SECTIONVALUE);
            UserStore.setcontact(PHONEVALUE);
            NotificationsStore.fetchCurrentNotifications(UserStore.currentuser._id);
            BorrowStore.fetchBorrows(UserStore.currentuser._id);
            BooksStore.fetchBooksModel();
            AuthStore.loggedin(token);
        }catch(error){
            console.log(error);
        }
    }
    return (
        <View style={styles.container}>
        {
            // {/* Initialization */}
            step1 ? 
            <>
            <View style={{alignItems:'center'}}>
            <Text variant="displaySmall" style={styles.TextContent}> Welcome!</Text>
            <Text variant="titleLarge" style={styles.TextContent}>{UserStore.currentuser.name}</Text>
            <Text variant="bodyMedium" style={styles.TextContent}>Thank you for registering through the mobile app</Text>
            <Text variant="bodyMedium" style={styles.TextContent}>Before you start using the mobile app!</Text>
            </View>
            <View>
                <Button mode="contained" buttonColor="maroon" textColor="white" icon="check" onPress={()=>{step1tostep2()}}>Understood</Button>
            </View>
            </>:
            // {/* INFORMATION PROPER */}
            step2 ?
            <>
            <View>
            <Text variant="displaySmall" style={styles.TextContent}> Thank You!</Text>
            <Text variant="titleLarge" style={styles.TextContent}>{UserStore.currentuser.name}</Text>
            <Text variant="bodyMedium" style={styles.TextContent}>We would now like to set up your student information!</Text>
            </View>
            <View style={{width:"90%", maxWidth:300}}>
            <TextInput
            style={{
                marginTop:10,
            }}
            mode="outlined"
            label="TUP-T ID NUMBER"
            placeholder='TUPT-XX-XXXX'
            value={IDVALUE}
            onChangeText={(text) => {
                setIDVALUE(text.toUpperCase());
            }}
            maxLength={12}
            />
            <HelperText type={STEP2ERROR ? "error" : "info"}>
                {
                    STEP2ERROR ? "This is a required field*" : "You need to put the TUPT-XX-XXXX prefix"
                }
            </HelperText>
            <Text style={{marginTop:10,marginBottom:-15, zIndex:1,fontSize:20}}>Course</Text>
            <MultiSelect
            styleDropdownMenuSubsection={{
                borderRadius:2,
            }}
            styleDropdownMenu={{
                margin:2,
                borderRadius:10,
            }}
            styleInputGroup={{
                height:50,
                borderTopLeftRadius:10,
                borderTopRightRadius:10,
            }}
            styleSelectorContainer={{
                height:200,
                paddingBottom:50,
            }}
            items={[
                // BACHELOR OF ENGINEERING TECHNOLOGY (BET) COURSES
                {id: 'BETAT' , name : "BET Major in Automotive Technology (BETAT-T)"},
                {id: 'BETChT' , name : "BET Major in Chemical Technology (BETChT-T)"},
                {id: 'BETCT' , name : "BET Major in Construction Technology (BETCT-T)"},
                {id: 'BETET' , name : "BET Major in Electrical Technology (BETET-T)"},
                {id: 'BETEMT' , name : "BET Major in Electromechanical Technology (BETEMT-T)"},
                {id: 'BETElxT' , name : "BET Major in Electronics Technology (BETElxT-T)"},
                {id: 'BETInCT' , name : "BET Major in Instrumentation and Control Technology (BETInCT-T)"},
                {id: 'BETMT' , name : "BET Major in Mechanical Technology (BETMT-T)"},
                {id: 'BETMecT' , name : "BET Major in Mechatronics Technology (BETMecT-T)"},
                {id: 'BETNDTT' , name : "BET Major in Non-Destructive Testing Technology (BETNDTT-T)"},
                {id: 'BETDMT' , name : "BET Major in Dies & Moulds Technology (BETDMT-T)"},
                {id: 'BETHVAC/RT' , name : "BET Major in Heating, Ventilation and Airconditioning/Refrigeration Technology (BETHVAC/RT-T)"},
                // ENGINEERING COURSES
                {id: 'BSCESEP',name: "Bachelor of Science in Civil Engineering (BSCESEP-T)"},
                {id: 'BSEESEP',name: "Bachelor of Science in Electrical Engineering (BSEESEP-T)"},
                {id: 'BSECESEP',name: "Bachelor of Science in Electronics Engineering (BSECESEP-T)"},
                {id: 'BSMESEP',name: "Bachelor of Science in Mechanical Engineering (BSMESEP-T)"},
                // OTHER SCIENCE COURSES
                {id: 'BSIT',name: "Bachelor of Science in Information Technology (BSIT-T)"},
                {id: 'BSIS',name: "Bachelor of Science in Information System (BSIS-T)"},
                {id: 'BSESSDP',name: "Bachelor of Science in Environmental Science (BSESSDP-T)"},
                // OTHERS
                {id: 'BGTAT',name: "Bachelor in Graphics Technology Major in Architecture Technology (BGTAT-T)"},
                {id: 'BTVTEdET',name: "BTVTE Major in Electrical Technology (BTVTEdET-T)"},
                {id: 'BTVTEdElxT',name: "BTVTE Major in Electronics Technology (BTVTEdElxT-T)"},
                {id: 'BTVTEdICT',name: "BTVTE Major in Information and Communication Technology (BTVTEdICT-T)"},
            ]}
            single={true}
            uniqueKey="id"
            searchInputPlaceholderText="Search Courses..."
            displayKey="name"
            selectedItems={[COURSEVALUE]}
            onSelectedItemsChange={(array) => {array.forEach(element => {setCOURSEVALUE(element)})}}
            itemFontSize={15}
            />
            <HelperText type={STEP2ERROR ? "error" : "info"}>
                {
                    STEP2ERROR ? "This is a required field*" : "It will be shortened automatically!"
                }
            </HelperText>
            <TextInput
            style={{
                marginTop:10,
            }}
            mode="outlined"
            label="Section"
            placeholder="Course-Section"
            autoCapitalize="characters"
            onChangeText={(text) => {setSECTIONVALUE(text)}}
            />
            <HelperText type={STEP2ERROR ? "error" : "info"}>
                {
                    STEP2ERROR ? "This is a required field*" : "Course - Section (no need to include your course)"
                }
            </HelperText>
            <TextInput
            mode='outlined'
            label='Phone Number'
            keyboardType='number-pad'
            placeholder='9XX-XXX-XXXX'
            onChangeText={(text) => {setPHONEVALUE(text)}}
            maxLength={10}
            />
            <HelperText type={STEP2ERROR ? "error" : "info"}>
                {
                    STEP2ERROR ? "This is a required field*" : "Skip the first (0) of your phone number"
                }
            </HelperText>
            </View>
            <View style={{width:'90%',maxWidth:300}}>
            <Text variant="bodyMedium" style={{textAlign:'justify'}}>By clicking SUBMIT you have acurately provided information to the best of your ability, providing false information can get your account suspended or deleted from the records.</Text>
            <Button mode="contained" buttonColor="maroon" textColor="white" icon="check" onPress={()=>{verifyinput()}}>Submit</Button>
            </View>
            </>:
            // {/* ACKNOWLEDGEMENT */}
            step3 ?
            <>
            <View style={{width:"95%", maxWidth:350,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
            <Avatar.Image size={100} source={{uri: UserStore.currentuser.avatar.url}} style={{flex:2,alignItems:'center', backgroundColor:'transparent'}}/>
            <View style={{flex:3}}>
            <Text variant="titleMedium">{UserStore.currentuser.name}</Text>
            <Text variant="bodySmall">{UserStore.currentuser.email}</Text>
            </View>
            </View>
            <View style={{width:'90%',maxWidth:300,marginTop:10}}>
            <TextInput
            mode="outlined"
            label="TUP-T ID NUMBER"
            value={IDVALUE}
            disabled={true}
            />
            <TextInput
            mode="outlined"
            label="COURSE"
            value={COURSEVALUE}
            disabled={true}
            />
            <TextInput
            mode="outlined"
            label="SECTION"
            value={SECTIONVALUE}
            disabled={true}
            />
            <TextInput
            mode="outlined"
            label="PHONE NUMBER"
            value={PHONEVALUE}
            disabled={true}
            />
            <Text variant="bodyLarge" style={{marginTop:10, textAlign:'justify'}}>I hereby ascertain that the information I have provided are accurate to the best of my knowledge</Text>
            <Text variant="bodyMedium" style={{marginTop:10, textAlign:'justify'}}>I hereby understand that the mobile application is a thesis project and that some bugs are to be expected</Text>
            <SegmentedButtons
            onValueChange={() => null}
            buttons={[
                {
                    label: 'Back',
                    style: {marginTop: 10},
                    icon: "arrow-left",
                    onPress: () => {setstep2(true),setstep3(false)},
                },
                {
                    label: 'Proceed',
                    style: {marginTop: 10},
                    icon: "arrow-right",
                    onPress: () => {updateaccountinformation()},
                }
            ]}
            />
            </View>
            </>:
            <></>
        }
        </View>
        )
    })
    
    const styles = StyleSheet.create({
        container:{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:'mistyrose'
        },
        TextContent:{
            textAlign:'center',
            alignSelf:'center',
            width:'95%',
            maxWidth:300,
            margin:5,
        }
    });