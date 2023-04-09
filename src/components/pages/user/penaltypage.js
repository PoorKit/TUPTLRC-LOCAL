import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { observer } from 'mobx-react';
import { fetchLatestBorrow } from '../../../services/api';
import AuthContext from '../../../models/auth';
import UserContext from '../../../models/user';
import PenaltyContext from '../../../models/penalty';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../loading';

const PenaltyScreen = observer(() => {
  const AuthStore = useContext(AuthContext);
  const UserStore = useContext(UserContext);
  const PenaltyStore = useContext(PenaltyContext);
  // State to hold the latest borrow data
  const [bookTitles, setBookTitles] = useState([]);

  // Fetch the latest borrow data on component mount
  useEffect(() => {
    AuthStore.letmeload();
    const fetchLatestBorrowData = async () => {
      const latestBorrow = await fetchLatestBorrow();
      if(latestBorrow){
        const bookTitle = latestBorrow.bookId?.map((book) => book.title);
        setBookTitles(bookTitle);
      }
    };
    fetchLatestBorrowData();
    AuthStore.donewithload();
  }, []);

  // Function to log out the user
  const signOut = async() => {
    await AsyncStorage.clear();
    AuthStore.logout();
    UserStore.emptyout();
    PenaltyStore.emptyout();
    alert('Logged Out Successfully');
  };

  return (
    <>
      <Loading/>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../../../../assets/hexBg.jpg')}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={{flex: 1, justifyContent:'center', alignSelf:'center', marginTop: 40}}>
            <Text variant="titleLarge" style={styles.headerText}>
              Library Service Charge
              {'\n'}
              Payment Order Form
            </Text>
          </View>

          <View style={{flex: 1, justifyContent:'center', alignSelf:'center', alignItems:'center'}}>
            <Avatar.Image source={{uri: UserStore.currentuser.avatar.url}}/>
            <Text variant='bodyLarge' style={{color:'white'}}>{UserStore.currentuser.name}</Text>
            <Text variant='bodyMedium' style={{color:'white'}}>{UserStore.currentuser.course}</Text>
            <Text variant='bodyMedium' style={{color:'white'}}>{UserStore.currentuser.id_number}</Text>
          </View>

          {/* Book list */}
          <View style={styles.bookList}>
            {
            bookTitles.length > 0 ? 
            bookTitles.map((bookTitle, index) => (
              <Card key={index} style={{marginVertical:10}}>
                <Card.Title title={bookTitle}/>
              </Card>
            ))
            : 
            <Card>
              <Card.Title title="Weird!"/>
              <Card.Content>
                <Text>
                  You have no overdue books.
                </Text>
              </Card.Content> 
            </Card>
            }
          </View>

          <View style={{flex: 1, justifyContent:'center', alignSelf:'center'}}>
              <Text variant='displayLarge' style={{textAlign:'center', color:'white'}}>₱ {PenaltyStore.penalty}</Text>
              <Text style={{color: 'white',textAlign:'center'}}>Pay this amount at the TUP Cashier</Text>
            </View>

          {/* Subheader and log out button */}
          <View style={styles.subheader}>
            <Text variant="bodyLarge" style={styles.subheaderText}>
              Resolve this with the Library
              {'\n'}
              To Restore App Functionality
            </Text>
            <Button
              mode="contained"
              icon="logout"
              buttonColor="maroon"
              onPress={signOut}
            >
              Log-out
            </Button>
          </View>
        </View>
      </ImageBackground>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
  },
  bookList: {
    flex: 1,
    justifyContent: 'center',
    width:'80%',
    alignSelf:'center',
  },
  subheader: {
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  subheaderText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'auto',
    zIndex: 0,
  },
});

export default PenaltyScreen;
