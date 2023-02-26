import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';

import { observer } from 'mobx-react-lite';
import BooksContext from '../../../models/books';
import { useNavigation } from '@react-navigation/native';

export default Homepage = observer(() => {
    const navigation = useNavigation();
    const BooksStore = useContext(BooksContext);
    const LatestBooks = BooksStore.Books.slice().sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated));
    const GenreCollection = [
        {id:'Fil',name:'Filipino',icon:'camera'},
        {id:'Ref',name:'Reference',icon:'card-text'},
        {id:'Bio',name:'Biology',icon:'leaf'},
        {id:'Fic',name:'Fiction',icon:'book'},
        {id:'Res',name:'Resource',icon:'cloud'},
    ]
    return (
        <>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
            <View style={styles.container}>
                {/* Latest View */}
                <View style={{flex:2}}>
                    <View style={styles.headerlist}>
                        <Text variant="titleLarge" style={{color:'white',fontWeight:'400'}}>Latest Books</Text>
                        <Text variant="titleSmall" style={{color:'white', fontWeight:'bold'}}>View More</Text>
                    </View>
                    <FlatList
                        data = {LatestBooks}
                        horizontal={true}
                        renderItem = {({item}) => (
                            <Card key={item._id} style={styles.card} onPress={()=>navigation.navigate("Details",item._id)}>
                                <Card.Cover source={{uri: item.book_image.url}} style={styles.cardcover}/>
                            </Card>
                        )}
                    />
                </View>
                {/* Genre */}
                <View style={{flex:1}}>
                    <View style={styles.headerlist}>
                        <Text variant="titleLarge" style={{color:'white',fontWeight:'400'}}>Genres</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <FlatList
                                data = {GenreCollection}
                                horizontal={true}
                                renderItem = {({item}) => (
                                    <View key={item.id}>
                                        <IconButton 
                                        icon={item.icon}
                                        size={48}
                                        mode='outlined'
                                        iconColor='white'
                                        // onPress={()=>BooksStore.setCurrentBook(item)}
                                        />
                                        <Text style={{color:'white', alignSelf:'center'}}>{item.name}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                
                </View>
            </View>
        </ImageBackground>
        </>
        )
    })
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        imagebackground:{
            flex: 1,
            justifyContent:'center',
            alignSelf:'auto',
            zIndex:0,
        },
        headerlist:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            padding:10,
        },
        itemlist:{
            flex:1,
        },
        card:{
            aspectRatio: 5 / 7,
            marginLeft:15,
        },
        cardcover:{
            height:'100%',
            width:'100%',
        },
        smallcard:{
            aspectRatio: 4/9,
            marginLeft:15,
        },
    });