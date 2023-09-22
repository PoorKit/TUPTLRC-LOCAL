import { observer } from 'mobx-react';
import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, ScrollView, StyleSheet, View, Image, FlatList } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';

import AuthContext from '../../../models/auth';
import UserContext from '../../../models/user';
import BooksContext from '../../../models/books';
import BorrowContext from '../../../models/borrow';
import { book_image_default } from '../../../services/constants';
import Loading from '../loading';


const Detailspage = observer(({route}) => {
    const AuthStore = useContext(AuthContext);
    const UserStore = useContext(UserContext);
    const BookStore = useContext(BooksContext);
    const BorrowStore = useContext(BorrowContext);
    // Implementation of Route.Params could be as used here
    const BookDetails = BookStore.GetBookDetails(route.params);
    useEffect(()=>{
        AuthStore.letmeload();
        BorrowStore.fetchBorrows();
        console.log(BorrowStore.AllBorrows);
        AuthStore.donewithload();
    },[])
    const navigation = useNavigation();
    return (
        <>
        <Loading/>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <View style={styles.container}>
        <View style={styles.imagecontainer}>
            <Image 
            style={{width:150, height:150, alignSelf:'center',borderRadius:10}}
            source={{uri:BookDetails.book_image?.url || book_image_default}}
            />
            <Text style={{color:'white', alignSelf:'center', marginTop: 4, margin: 2, fontWeight:'bold'}} variant="titleSmall">
            {BookDetails.title}
            </Text>
            <Text style={{color:'white', alignSelf:'center', margin: 2, fontWeight:'bold'}} variant="titleSmall">
            {
                BookDetails.main_author ? BookDetails.main_author : "NO DATA AVAILABLE"
            }
            </Text>
        </View>
        <Card style={styles.abstractcontainer}>
        <Card.Content>
        <ScrollView
        showsVerticalScrollIndicator={false}
        >
            <Text style={styles.abstracttext}>
            {
                BookDetails.abstract?.length > 0 ?
                BookDetails.abstract
                :
                'No Abstract Available'
            }
            </Text>
        </ScrollView>
        </Card.Content>
        </Card>
        {
            BookDetails.subjects.length > 0 ?
            <>
            <Text variant='labelLarge' style={{color:'white'}}>Tags</Text>
            <FlatList
            style={styles.tagscontainer}
            data={BookDetails.subjects}
            renderItem={({item}) => (
                <Chip key={item} mode='flat' style={{maxHeight:40,minHeight:40, margin: 1}}>{item}</Chip>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            />
            </>
            : null
        }
        { 
            BorrowStore.AllBorrows.bookId.find(obj => obj._id === BookDetails._id) ? 
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
            onPress={()=>{
                BorrowStore.cancelbook(BookDetails,BookStore).then(()=>{
                    navigation.navigate("Book");
                });
            }}
            icon='cancel'
            buttonColor='darkred'
            textColor='white'
            >
            Cancel
            </Button>
            :
            BookDetails.on_shelf <= 0 ||  BookDetails.on_shelf === null ? 
            <Button style={{
                width:'95%',
                height:50,
                alignSelf:'center',
                justifyContent:'center',
                marginTop:10,
                marginBottom:10,
                fontWeight:'bold',
            }} 
            mode='elevated'
            onPress={()=>{
                alert("No Stocks Left!");
            }}
            icon='book-lock'
            buttonColor='darkgrey'
            textColor='black'
            >
            Unavailable
            </Button>
            : 
            BorrowStore.AllBorrows.bookId.length == 2 ? 
            <Button style={{
                width:'95%',
                height:50,
                alignSelf:'center',
                justifyContent:'center',
                marginTop:10,
                marginBottom:10,
                fontWeight:'bold',
            }} 
            mode='elevated'
            onPress={()=>{
                alert("Max Borrow Capacity of 2 Books!");
            }}
            icon='book-lock'
            buttonColor='darkgrey'
            textColor='black'
            >
            Unavailable
            </Button>
            : 
            <Button style={{
                backgroundColor: 'maroon',
                width:'95%',
                height:50,
                alignSelf:'center',
                justifyContent:'center',
                marginTop:10,
                marginBottom:10,
                fontWeight:'bold',
            }} 
            mode='elevated'
            onPress={()=>{
                BorrowStore.borrowbook(UserStore.currentuser._id,BookDetails,BookStore);
                alert("Book added to cart");
                navigation.goBack();
            }}
            icon='cart-outline'
            buttonColor='white'
            textColor='white'
            >
            Borrow This Book
            </Button>
        }
        </View>
        </ImageBackground>
        </>
        )
    });
    
    const styles = StyleSheet.create({
        container: {
            width:'95%',
            height: '95%',
            alignSelf: 'center',
            zIndex:1,
        },
        imagebackground:{
            flex: 1,
            justifyContent:'center',
            alignSelf:'auto',
            zIndex:0,
        },
        abstractcontainer:{
            marginTop: 5,
            flex:6,
            backfaceVisibility: 'hidden',
            // backgroundColor: 'transparent',
        },
        abstracttext:{
            alignSelf:'center', 
            textAlign:'justify',
            lineHeight:24,
            fontSize:16,
            fontWeight:'600'
        },
        tagscontainer:{
            flex:1,
        },
        imagecontainer:{
            flex:4,
        }
    });
    
    export default Detailspage;