import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View, Image } from 'react-native';
import { Button, Card, Dialog, Portal, Text, SegmentedButtons } from 'react-native-paper';
import DatePicker, {getToday} from 'react-native-modern-datepicker';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

import BookContext from '../../../models/books';
import BorrowContext from '../../../models/borrow';
import AuthContext from '../../../models/auth';
import Loading from '../loading';

const Cartpage = observer(() => {
    const BorrowStore = useContext(BorrowContext);
    const BooksStore = useContext(BookContext);
    const AuthStore = useContext(AuthContext);
    const navigation = useNavigation();
    const [DatepickerVisibility, setDatepickerVisibility] = useState(false);
    const [validdate, setvaliddate] = useState();
    const today = getToday();
    return (
        <>
        <Loading/>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <View style={styles.container}>
        <Portal>
        <Dialog visible={DatepickerVisibility} onDismiss={()=>setDatepickerVisibility(false)} style={{backgroundColor:'white'}}>
        <Dialog.Content style={{margin:-20}}>
        <DatePicker
        mode="calendar"
        minimumDate={getToday()}
        maximumDate={dayjs(today).add(14, 'days').format('YYYY/MM/DD')}
        options={{
            textHeaderColor: '#FFA25B',
            textDefaultColor: 'black',
            selectedTextColor: '#fff',
            mainColor: '#F4722B',
            textSecondaryColor: '#D6C7A1',
        }}
        onDateChange={(date) => {
            let datevariable = dayjs(date).day()
            if (datevariable === 0 || datevariable === 6){
                alert("Not Valid!");
                setvaliddate(null);
            }else{
                setvaliddate(dayjs(date));
            }
        }}
        
        />
        </Dialog.Content>
        <Dialog.Actions>
        <SegmentedButtons
        value=''
        onValueChange={() => {}}
        buttons={[
            {
                value:"btn1",
                icon:"check",
                label:"Confirm",
                onPress: ()=>{validdate !== null ?
                    (BorrowStore.setschedule(validdate),
                    setDatepickerVisibility(false))
                    : 
                    alert("Not a valid date has been picked!")
                    },
            },
            {
                value:"btn2",
                icon:"close",
                label:"Cancel",
                onPress: ()=>setDatepickerVisibility(false),
            }
        ]}
        />
        </Dialog.Actions>
        </Dialog>
        </Portal>
        <FlatList
        data={BorrowStore.AllBorrows.bookId}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => (
            <Card key={item._id} style={{marginTop:10}}>
            <Card.Content style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
            <Image style={{width:100, height:150, alignSelf:'center',borderRadius:10}} source={{uri:item.book_image.url}}/>
            </View>
            <View style={{flex:2, paddingLeft:10}}>
            <Text variant='titleMedium' style={{textAlign:'justify'}}>{item.title}</Text>
            <Text variant='labelSmall'>{BooksStore.GetBookDetails(item._id).main_author}</Text>
            </View>
            </Card.Content>
            <Card.Actions>
            <Text>
            Status: {BorrowStore.AllBorrows.status}
            </Text>
            <Button
            icon='trash-can-outline'
            mode='elevated'
            buttonColor='darkred'
            textColor='white'
            onPress={() => BorrowStore.cancelbook(item,BooksStore)}
            >REMOVE</Button>
            </Card.Actions>
            </Card>
            )}
            ListEmptyComponent={() => (
                <Card style={{marginTop:10}}>
                <Card.Title title="Empty Cart!"/>
                </Card>
                )}
                >
                </FlatList>
                {
                    BorrowStore.status === 'To Confirm' || BorrowStore.status === null ? 
                    BorrowStore.AllBorrows.bookId.length === 0? 
                    <Button 
                    style={{
                        width:'95%',
                        height:50,
                        alignSelf:'center',
                        justifyContent:'center',
                        marginTop:10,
                        marginBottom:10,
                        fontWeight:'bold',
                    }} 
                    mode='elevated'
                    onPress={()=>navigation.navigate('Book')}
                    icon='book-outline'
                    buttonColor='darkred'
                    textColor='white'>
                    START BROWSING BOOKS!
                    </Button>
                    :
                    <Button 
                    style={{
                        width:'95%',
                        height:50,
                        alignSelf:'center',
                        justifyContent:'center',
                        marginTop:10,
                        marginBottom:10,
                        fontWeight:'bold',
                    }} 
                    mode='elevated'
                    onPress={()=>setDatepickerVisibility(true)}
                    icon='check'
                    buttonColor='darkred'
                    textColor='white'>
                    CHECK OUT
                    </Button>
                    :
                    <Button 
                    style={{
                        width:'95%',
                        height:50,
                        alignSelf:'center',
                        justifyContent:'center',
                        marginTop:10,
                        marginBottom:10,
                        fontWeight:'bold',
                    }} 
                    mode='elevated'
                    icon='alert-circle-outline'
                    buttonColor='darkred'
                    textColor='white'
                    delayLongPress={1000}
                    onPress={()=>{null}}
                    onLongPress={()=>{alert("Book borrow has been cancelled"),BorrowStore.cancelall(BooksStore)}}
                    >
                    {BorrowStore.status.toUpperCase()} // CANCEL?
                    </Button>
                }
                </View>
                </ImageBackground>
                </>
                )
            });
            
            const styles = StyleSheet.create({
                container: {
                    flex:1,
                    width: '95%',
                    height: '95%',
                    alignSelf:'center',
                    justifyContent:'space-between',
                    zIndex:1
                },
                imagebackground:{
                    flex: 1,
                    justifyContent:'center',
                    alignSelf:'auto',
                    zIndex:0,
                }
            });
            
            export default Cartpage;