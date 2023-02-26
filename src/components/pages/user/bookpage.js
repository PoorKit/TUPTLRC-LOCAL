import { observer } from 'mobx-react-lite';
import React, { useContext, useState, createRef } from 'react';
import { ImageBackground, StyleSheet, View, FlatList, Image} from 'react-native';
import { Searchbar, Card, IconButton, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import BookContext from '../../../models/books';
import BorrowContext from '../../../models/borrow';

const Bookpage = observer(() => {
    const navigation = useNavigation();
    const BookStore = useContext(BookContext);
    BookStore.fetchBooksModel();
    
    const [querystring, setquerystring] = useState('');
    const [pagenumber, setpagenumber ] = useState(0);
    const tablimit = 10;
    const flatListRef = createRef();
    
    const toberendeddata = BookStore.AllBooks
    // Just add all filterable data here if we need more search parameters such as Title, Author, Abstract, etc search.
    .filter(book => 
        book.title.toLowerCase().includes(querystring.toLowerCase()) || 
        book.main_author?.toLowerCase().includes(querystring.toLowerCase()))
        // This is for when result is over the tab limit or result limit as defined by const tablimit
        // .splice(pagenumber * tablimit, pagenumber * tablimit + tablimit);
        const BorrowStore = useContext(BorrowContext);
        console.log(BorrowStore.AllBorrows);
        function comparison(item_id){
            if(BorrowStore.AllBorrows.bookId.includes(item_id)){
                return true;
            }else{
                return false;
            };
        };
        return (
            <>
            <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
            <View style={styles.container}>
            <View style={styles.searchbarstyling}>
            <Searchbar 
            placeholder="Search" 
            value={querystring}
            onChangeText={(text) => {setpagenumber(0),setquerystring(text)}} 
            style={{marginBottom:4, borderRadius: 40, flexGrow:3}}
            clearIcon="close"
            icon="text-search"
            onIconPress={() => {console.log("clicked")}}
            />
            </View>
            <FlatList 
            ref={ flatListRef }
            data={
                toberendeddata
            }
            // REVISION ON ENDREACHEDTHRESHOLD
            // onEndReachedThreshold={0.000001}
            // onEndReached={()=>{
            //     setTimeout(()=>{
            //         if (BookStore.AllBooks.filter(book => book.title.toLowerCase().includes(querystring.toLowerCase()))
            //         .splice(pagenumber * tablimit + tablimit, pagenumber * tablimit + tablimit * 2).length > 0)
            //         {
            //             setpagenumber(pagenumber + 1);
            //         }
            //     },1000)
            //     flatListRef.current.scrollToIndex({ animated: true, index: 0 });
            // }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <Card key={item._id} 
                style= { comparison(item._id) ? 
                    {marginTop: 4, marginBottom: 4, borderColor:'lightsalmon', borderWidth:5} 
                    : 
                    {marginTop: 2, marginBottom: 2}}>
                    <Card.Title 
                    title={item.title} 
                    subtitle={item.main_author} 
                    left={()=>
                        <Image style={{height:'200%'}} source={{uri: item.book_image.url}} resizeMethod={'scale'} resizeMode={'contain'}/>
                    }
                    right={()=>
                        <IconButton
                        icon="eye"
                        size={20}
                        mode="outlined"
                        iconColor="maroon"
                        onPress={()=>navigation.navigate("Details",item._id)}/>
                    }/>
                    </Card>
                    )}
                    ListEmptyComponent={() => (
                        <Card>
                        <Card.Title title="No Results!"/>
                        </Card>
                        )}
                        >
                        </FlatList>
                        </View>
                        </ImageBackground>
                        </>
                        )
                    });
                    
                    export default Bookpage;
                    
                    const styles = StyleSheet.create({
                        container: {
                            width:'90%',
                            height: '95%',
                            alignSelf: 'center',
                            zIndex:1
                        },
                        imagebackground:{
                            flex: 1,
                            justifyContent:'center',
                            alignSelf:'auto',
                            zIndex:0,
                        }
                    });