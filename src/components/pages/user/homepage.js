import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Chip, Portal } from 'react-native-paper';

import { observer } from 'mobx-react-lite';
import BooksContext from '../../../models/books';
import { useNavigation } from '@react-navigation/native';
import { book_image_default } from '../../../services/constants';
import Loading from '../loading';

export default Homepage = observer(() => {
    const navigation = useNavigation();
    const BooksStore = useContext(BooksContext);
    const LatestBooks = BooksStore.AllBooks.slice(0, 5); // Limit to 5 latest entries
    const GenreCollection = BooksStore.AllSubjects;
    return (
        <>
        <Portal>
            <Loading/>
        </Portal>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
            <View style={styles.container}>
                {/* Latest View */}
                <View style={{flex:3}}>
                    <View style={styles.headerlist}>
                        <Text variant="titleLarge" style={{color:'white',fontWeight:'400'}}>Latest Books</Text>
                        <Text variant="titleSmall" style={{color:'white', fontWeight:'bold'}} onPress={()=>(navigation.navigate('Book'))}>View More</Text>
                    </View>
                    <FlatList
                        data = {LatestBooks}
                        horizontal={true}
                        renderItem = {({item}) => (
                            <Card key={item._id} style={styles.card} onPress={()=>navigation.navigate("Details",item._id)}>
                            <Card.Cover source={{uri: item.book_image?.url || book_image_default}} style={styles.cardcover}/>
                            </Card>
                        )}
                    />
                </View>
                {/* Genre */}
                <View style={{flex:1}}>
                    <View style={styles.headerlist}>
                        <Text variant="titleLarge" style={{color:'white',fontWeight:'400'}}>Genres</Text>
                    </View>
                        <View style={{flex:1, flexDirection:'row', margin:10}}>
                            <FlatList
                                data = {GenreCollection}
                                horizontal={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem = {({item}) => (
                                    <View key={item.id}>
                                        <Chip
                                        style={{
                                            margin:1,
                                            marginBottom: 5,
                                            padding:2,
                                            minHeight:40,
                                            maxHeight:40,
                                            alignSelf:'center',
                                            backgroundColor:'lightsalmon',
                                        }}
                                        mode='flat'
                                        compact={true}
                                        selectedColor='maroon'
                                        textStyle={{color:'white'}}
                                        onPress={() => {
                                            navigation.navigate("Book", {tag: item});
                                        }}
                                        >
                                        {item}
                                        </Chip>
                                    </View>
                                )}
                            />
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