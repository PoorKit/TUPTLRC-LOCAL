import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, ScrollView, StyleSheet, View, Image } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

import UserContext from '../../../models/user';
import BooksContext from '../../../models/books';
import BorrowContext from '../../../models/borrow';
import { borrowBook } from '../../../services/api';

const Detailspage = observer(({route}) => {
    const UserStore = useContext(UserContext);
    const BookStore = useContext(BooksContext);
    const BorrowStore = useContext(BorrowContext);
    // Implementation of Route.Params could be as used here
    const BookDetails = BookStore.GetBookDetails(route.params);
    // or passing all of the necessary information through props (route in this case) to the BookDetails component
    // and thus limit the call to server from the client.
    const navigation = useNavigation();
    return (
        <>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <View style={styles.container}>
        <Image 
        style={{width:150, height:150, alignSelf:'center',borderRadius:10}}
        source={{uri:BookDetails.book_image.url}}
        />
        <Text style={{color:'white', alignSelf:'center', marginTop: 4, margin: 2, fontWeight:'bold'}} variant="titleSmall">
        {BookDetails.title}
        </Text>
        <Text style={{color:'white', alignSelf:'center', margin: 2, fontWeight:'bold'}} variant="titleSmall">
        {
            BookDetails.main_author ? BookDetails.main_author : "NO DATA AVAILABLE"
        }
        </Text>
        <Card style={styles.abstractcontainer}>
        <Card.Content>
        <ScrollView>
        <Text style={styles.abstracttext}>
        NO ABSTRACT ON SOME DATA HARD CODED FOR NOW AND IS AVAILABLE TO BE SCROLLED
        {'\n\n\n'}
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
        </Text>
        </ScrollView>
        </Card.Content>
        </Card>
        { 
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
            BorrowStore.AllBorrows.bookId.includes(BookDetails._id) ? 
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
                BorrowStore.cancelbook(BookDetails._id,BookStore);
                alert("Book removed from cart");
                navigation.goBack();
            }}
            icon='cancel'
            buttonColor='darkred'
            textColor='white'
            >
            Cancel
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
                BorrowStore.borrowbook(UserStore.currentuser._id,BookDetails._id,BookStore);
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
            flex:1,
            backfaceVisibility: 'hidden',
            backgroundColor: 'transparent',
        },
        abstracttext:{
            alignSelf:'center', 
            textAlign:'justify', 
            color:'white',
            lineHeight:20,
        }
    });
    
    export default Detailspage;