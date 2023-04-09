import { observer } from 'mobx-react-lite';
import React, { useContext, useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, FlatList, Image } from 'react-native';
import { Searchbar, Card, IconButton, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AuthContext from '../../../models/auth';
import BookContext from '../../../models/books';
import BorrowContext from '../../../models/borrow';
import { book_image_default } from '../../../services/constants';
import Loading from '../loading';

const Bookpage = observer((route) => {
    const navigation = useNavigation();
    const AuthStore = useContext(AuthContext);
    const BookStore = useContext(BookContext);
    // This is for when result is over the tab limit or result limit as defined by const tablimit
    // .splice(pagenumber * tablimit, pagenumber * tablimit + tablimit);
    const BorrowStore = useContext(BorrowContext);

    const [chipvisibility, setchipvisibility] = useState(false);
    let borrowedbook = BorrowStore.AllBorrows.bookId;
    useEffect(()=>{
        AuthStore.letmeload();
        BorrowStore.fetchBorrows();
        borrowedbook = BorrowStore.AllBorrows.bookId;
        console.log(borrowedbook);
        AuthStore.donewithload();
    },[BorrowStore.bookId, BorrowStore.AllBorrows]);

    const [querystring, setquerystring] = useState('');
    const chipsData = BookStore.AllSubjects;
    const [filterchips, setfilterchips] = useState([]);
    useEffect(()=>{
        AuthStore.letmeload();
        if(route.route.params?.tag){
            setchipvisibility(true);
            setfilterchips([...filterchips, route.route.params.tag]);
        }
        AuthStore.donewithload();
    },[route.route.params]);

    const renderItem = ({ item }) => {
        const isSelected = filterchips.includes(item);
        return (
            <Chip
            style={{
                margin:1,
                marginBottom: 5,
                padding:2,
                minHeight:40,
                maxHeight:40,
                alignSelf:'center',
                backgroundColor: isSelected ? 'white' : 'lightsalmon',
            }}
            mode={isSelected ? 'outlined' : 'flat'}
            compact={true}
            selected={ isSelected ? true : false }
            selectedColor='maroon'
            textStyle={ isSelected ? {color:'maroon'} : {color:'white'}}
            elevated={ isSelected ? true : false}
            onPress={() => {
                if (isSelected) {
                    setfilterchips(filterchips.filter(chip => chip !== item));
                } else {
                    setfilterchips([...filterchips, item]);
                }
            }}
            >
            {item}
            </Chip>
            );
        };
    const filteredbooks = BookStore.AllBooks.filter(book => !borrowedbook.some(borrowed => borrowed._id === book._id));
    const toberendeddata = [...filteredbooks, ...borrowedbook]
        .filter(book => (filterchips.length === 0 || filterchips.some(chip => book.subjects?.includes(chip))) &&
        (querystring.length === 0 || 
            book.title.toLowerCase().includes(querystring.toLowerCase()) || 
            book.main_author?.toLowerCase().includes(querystring.toLowerCase()) || 
            book.subjects?.some(subject => querystring.toLowerCase().includes(subject.toLowerCase())) ||
            book.isbn?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.publisher?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.abstract?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.call_number?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.yearPub?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.edition?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.language?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.location?.toLowerCase().includes(querystring.toLowerCase()) ||
            book.electronic_access?.toLowerCase().includes(querystring.toLowerCase())
            ))
        .sort((a, b) => {
            const dateA = new Date(a.date_entered);
            const dateB = new Date(b.date_entered);
            if (dateA.getTime() === dateB.getTime()) {
              return 0;
            } else if (dateA.getTime() === NaN || dateA.getTime() < dateB.getTime()) {
              return 1;
            } else {
              return -1;
            }
          });
    return (
        <>
        <Loading/>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <View style={styles.container}>
        <View>
            <Searchbar 
            placeholder="Search" 
            value={querystring}
            onChangeText={(text) => {setquerystring(text)}} 
            style={{marginBottom:4, borderRadius: 40, flexGrow:3}}
            clearIcon="close"
            icon= { chipvisibility? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'}
            onIconPress={() => {
                setchipvisibility(!chipvisibility);
            }}
            />
            {
                chipvisibility ? 
                <FlatList
                    data={chipsData}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                : null
            }
        </View>
        <FlatList 
        style={{
            margin:'auto'
        }}
        data={toberendeddata}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
            <Card key={item._id} 
                style= { 
                    BorrowStore.AllBorrows.bookId.find(obj => obj._id === item._id) ? 
                {marginTop: 4, marginBottom: 4, borderColor:'lightsalmon', borderWidth:4} 
                : 
                {marginTop: 2, marginBottom: 2}}>
                <Card.Title 
                title={item.title} 
                subtitle={item.main_author} 
                left={()=>
                    <Image style={{height:'200%'}} source={{uri: item.book_image?.url || book_image_default}} resizeMethod={'scale'} resizeMode={'contain'}/>
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
        />
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