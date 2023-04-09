import React, { useState , useContext, useEffect } from 'react';
import Homepage from '../../components/pages/user/homepage';
import Bookpage from '../../components/pages/user/bookpage';
import Cartpage from '../../components/pages/user/cartpage';
import Settings from '../../components/pages/user/settingpage';
import Notifications from '../../components/pages/user/notificationpage';
import Penalty from '../../components/pages/user/penaltypage';
import Detailspage from '../../components/pages/user/detailspage';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Avatar, Menu, Badge, IconButton, Portal} from 'react-native-paper';

import AuthContext from '../../models/auth';
import UserContext from '../../models/user';
import BorrowsContext from '../../models/borrow';
import NotificationsModel from '../../models/notification';
import { observer } from 'mobx-react';
import PenaltyContext from '../../models/penalty';
import BooksContext from '../../models/books';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/pages/loading';


const UserStacks = observer(()=>{
    const AuthStore = useContext(AuthContext);
    const UserStore = useContext(UserContext);
    const BookStore = useContext(BooksContext);
    const BorrowStore = useContext(BorrowsContext);
    const NotificationsStore = useContext(NotificationsModel);
    const PenaltyStore = useContext(PenaltyContext);
    const navigation = useNavigation();

    const signOut = async() => {
        await AsyncStorage.clear();
        AuthStore.logout();
        UserStore.emptyout();
        BorrowStore.emptyout();
        NotificationsStore.emptyout();
        PenaltyStore.emptyout();
        alert("Logged Out Successfully");
    }

    useEffect(()=>{
        AuthStore.letmeload();
        BookStore.fetchBooksModel(); 
        BorrowStore.fetchBorrows(UserStore.currentuser._id);
        PenaltyStore.fetchUserPenalty(UserStore.currentuser._id);
        NotificationsStore.fetchCurrentNotifications();
        AuthStore.donewithload();
    },[])
    
    useEffect(()=>{
        AuthStore.letmeload();
        if(PenaltyStore.userPenalty?.status === "Unpaid"){
            AuthStore.donewithload();
            navigation.navigate('Penalty');
        }
        AuthStore.donewithload();
    },[PenaltyStore.userPenalty]);

    const [visibility,setVisibility] = useState(false);
    const activenotificationcount = activenotificationcount;
    const borrowcount = BorrowStore.bookId.length;
    const UsersNavigationStack = createBottomTabNavigator();
    return (
        <>
        <Portal>
            <Loading/>
        </Portal>
        <UsersNavigationStack.Navigator 
        initialRouteName= 'Home'
        screenOptions={{
            headerStyle:{
                backgroundColor: 'maroon',
            },
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerRight: () => 
            <TouchableOpacity style={{marginRight:15}} onPress={()=>navigation.navigate('Cart')}>
            {
                // NotificationsStore.notifications and filter where deliverystatus = "delivered" and get its length()
                activenotificationcount > 0 ?
                <Badge style={{fontSize:15, marginBottom:-25, zIndex:1, backgroundColor:'mistyrose', color:'black', fontWeight:'bold'}}>{activenotificationcount}</Badge>
                :
                <></>
            }
            <IconButton icon='bell-outline' size={30} iconColor='white' onPress={() => {navigation.navigate('Notifications')}} />
            </TouchableOpacity>
            ,
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'white',
            tabBarInactiveBackgroundColor:'maroon',
            tabBarActiveBackgroundColor:'white',
            tabBarHideOnKeyboard: true,
            tabBarStyle:{
                height:80
            },
            tabBarLabelStyle:{
                paddingBottom:10,
                fontSize: 20,
                fontWeight: 'bold',
            },
        }}>
        {/* BOOKS */}
        <UsersNavigationStack.Group screenOptions={{
            headerRight: () => 
            <TouchableOpacity style={{marginRight:15}} onPress={()=>navigation.navigate('Cart')}>
            <Badge style={{fontSize:15, marginBottom:-25, zIndex:1, backgroundColor:'mistyrose', color:'black', fontWeight:'bold'}}>{borrowcount}</Badge>
            <IconButton icon='cart-outline' size={30} iconColor='white' onPress={() => {navigation.navigate('Cart')}} />
            </TouchableOpacity>
        }}>
        <UsersNavigationStack.Screen name="Book" component={Bookpage} options={{
            tabBarLabel: "Books",
            tabBarIcon: ({ focused, color, size }) => (
                <IconButton
                icon={ focused ? 'book-open-variant' : 'book-outline'}
                iconColor=  { color }
                size = { size }
                />
                ),
                headerTitleAlign: 'left',
            }}/>
            <UsersNavigationStack.Screen name="Details" component={Detailspage} options={{
                tabBarItemStyle: { display: 'none' },
                tabBarStyle: { display: 'none' },
                headerLeft: () => <IconButton icon='chevron-left-circle-outline' size={30} iconColor='white' onPress={() => {navigation.goBack()}} />,
            }}/>
            </UsersNavigationStack.Group>
            {/* HOME */}
            <UsersNavigationStack.Group>
            <UsersNavigationStack.Screen name="Home" component={Homepage} options={{
                tabBarIcon: ({ focused , color, size }) => (
                    <IconButton
                    icon={ focused ? 'home' : 'home-outline'}
                    iconColor=  { color }
                    size = { size }
                    />
                    ),
                    headerTitleAlign: 'left',
                    headerRight: () => 
                    <Menu
                    visible={visibility}
                    onDismiss={()=>setVisibility(false)}
                    anchorPosition="bottom"
                    anchor={
                        <TouchableOpacity style={{marginRight:25}} onPress={()=>setVisibility(true)}>
                        {
                            activenotificationcount > 0 ?
                            <Badge visible={!visibility} style={{fontSize:15, marginBottom:-15, marginRight:-8,zIndex:1,backgroundColor:'slategray', fontWeight:'bold'}}>{NotificationsStore.notifications.filter(notification => notification.deliveryStatus === "Delivered").length}</Badge>
                            :
                            <></>
                        }
                        <Avatar.Image size={40} source={{uri: UserStore.currentuser.avatar.url}} />
                        </TouchableOpacity>
                    }>
                    {
                        activenotificationcount > 0 ? 
                        <Badge style={{marginBottom:-25,marginRight:5, fontWeight:'bold',fontSize:15}}>{NotificationsStore.notifications.filter(notification => notification.deliveryStatus === "Delivered").length}</Badge>
                        : <></>
                    }
                    <Menu.Item leadingIcon="bell" onPress={() => {setVisibility(false),navigation.navigate("Notifications")}} title="Notifications"/>
                    
                    <Menu.Item leadingIcon="cog" onPress={() => {setVisibility(false),navigation.navigate("Settings")}} title="Settings" />
                    <Menu.Item leadingIcon="logout" onPress={() => signOut()} title="Log Out"/>
                    </Menu>,
                    
                    headerTitle: () => 
                    <View style={styles.appnamecontainer}>
                    <Image 
                    style={styles.imageContainer}
                    source={require('../../../assets/icon.png')} 
                    resizeMode='contain'
                    />
                    <View>
                    <Text style={styles.appnamestyling}>
                    TUP - Taguig
                    </Text>
                    <Text style={styles.appnamestyling}>
                    Library Center
                    </Text>
                    </View>
                    </View>
                }}/>
                <UsersNavigationStack.Screen name="Notifications" component={Notifications} options={{
                    tabBarItemStyle: { display: 'none' },
                    tabBarStyle: { display: 'none' }, 
                    headerLeft: () => <IconButton icon='chevron-left-circle-outline' size={30} iconColor='white' onPress={() => {navigation.navigate('Home')}} />,
                    headerRight: () => <IconButton icon='bell' style={{marginRight:15}} size={30} iconColor='white'/>,
                }}/>
                <UsersNavigationStack.Screen name="Settings" component={Settings} options={{
                    tabBarItemStyle: { display: 'none' },
                    tabBarStyle: { display: 'none' }, 
                    headerLeft: () => <IconButton icon='chevron-left-circle-outline' size={30} iconColor='white' onPress={() => {navigation.navigate('Home')}} />,
                }}/>
                <UsersNavigationStack.Screen name="Penalty" component={Penalty} options={{
                    tabBarItemStyle: { display: 'none' },
                    tabBarStyle: { display: 'none' }, 
                    headerShown: false,
                }}/>
                </UsersNavigationStack.Group>
                {/* CART */}
                <UsersNavigationStack.Group>
                <UsersNavigationStack.Screen name="Cart" component={Cartpage} options={{
                    tabBarLabel: "Cart",
                    tabBarIcon: ({ focused, color, size }) => (
                        <IconButton
                        icon={ focused ? 'cart' : 'cart-outline'}
                        iconColor=  { color }
                        size = { size }
                        />
                        ),
                        headerTitleAlign: 'center',
                        headerLeft: () => <IconButton icon='chevron-left-circle-outline' size={30} iconColor='white' onPress={() => {navigation.goBack()}} />,
                    }}/>
        </UsersNavigationStack.Group>
        </UsersNavigationStack.Navigator>
        </>
        )
    })
                
export default UserStacks;

const styles=StyleSheet.create({
    imageContainer:{
        height: 40,
        width: 40,
    },
    appnamecontainer:{
        flexDirection: 'row'
    },
    appnamestyling:{
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    }
    
})
