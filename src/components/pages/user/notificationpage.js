import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, ImageBackground, View, SectionList, FlatList } from "react-native";
import { Button, Card, Chip, IconButton, Searchbar, Text } from "react-native-paper";

import NotificationsModel from "../../../models/notification";
import { SeenNotification } from "../../../services/api";

const Notifications = observer(() => {
    const NotificationsStore = useContext(NotificationsModel);
    const [querystring, setquerystring] = useState("");
    const [chipvisibility, setchipvisibility] = useState(false);
    const chipsData = ['Approve', 'Decline', 'Penalty', 'Others'];
    const [filterchips, setfilterchips] = useState([]);
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

    return (
        <>
        <ImageBackground style={styles.imagebackground} source={require('../../../../assets/hexBg.jpg')} resizeMode="cover">
        <View style={styles.container}>
        <Card style={{ flex: 1 }}>
        <Card.Content>
        <Searchbar
        placeholder="Search Notifications"
        clearIcon="close"
        value={querystring}
        onChangeText={(text) => {
            setquerystring(text);
        }}
        icon="text-search"
        onIconPress={() => {
            setchipvisibility(!chipvisibility);
        }}
        />
        {chipvisibility ? 
        <FlatList
        data={chipsData}
        renderItem={renderItem}
        keyExtractor={item => item}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, marginBottom: 5}}
        /> : null}
        <SectionList
        style={{
            marginTop: 10,
            marginBottom: 'auto',
        }}
        sections={[
            {
                title: "New Today",
                data: NotificationsStore.AllNewNotifications.filter(notification => (filterchips.length === 0 || filterchips.some(chip => notification.notificationType.includes(chip))) && (notification.notificationText.toLowerCase().includes(querystring.toLowerCase()))),
            },
            {
                title: "Previous Notifications",
                data: NotificationsStore.AllNotifications.filter(notification => (filterchips.length === 0 || filterchips.some(chip => notification.notificationType.includes(chip))) && (notification.notificationText.toLowerCase().includes(querystring.toLowerCase()))),
            },
        ]}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({ section }) => {
            const deliveredNotifications = section.data.filter(
                (item) => item.deliveryStatus === "Delivered"
                );
                if (deliveredNotifications.length !== 0) {
                    return (
                        <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                        >
                        <Text variant="titleMedium">{section.title}</Text>
                        <Button onPress={() => console.log("Hi!")}>
                            Mark All As Read
                        </Button>
                        </View>
                        );
                } else {
                    return <Text variant="titleMedium">{section.title}</Text>;
                }
                }}
        renderSectionFooter={({ section }) => {
            if (section.data.length === 0) {
                return (
                    <Card style={styles.item}>
                    <Card.Title title={`Empty Notifications`} />
                    </Card>
                    );
                }
            }}
            renderItem={({ item }) => (
                <Card key={item._id} style={{ margin: 5 }}>
                <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1, marginLeft: -5 }}>
                <IconButton
                icon={
                    item.notificationType === "Approve"
                    ? "check"
                    : item.notificationType === "Decline"
                    ? "cancel"
                    : item.notificationType === "Penalty"
                    ? "cash-check"
                    : item.notificationType === "Others"
                    ? "forum"
                    : "help"
                }
                mode="contained"
                iconColor="maroon"
                containerColor="transparent"
                />
                </View>
                <View style={{ flex: 3, paddingLeft: 5 }}>
                    { item.notificationTitle ? <Text variant="titleMedium">{item.notificationTitle}</Text> : null}
                <Text variant="bodyMedium" style={{textAlign:'justify'}}>{item.notificationText}</Text>
                </View>
                </Card.Content>
                <Card.Actions>
                    <Chip icon="information-variant" selected={true}>
                    {item.notificationType}
                    </Chip>
                {item.deliveryStatus === "Delivered" ? (
                    <Button
                    icon="eye"
                    mode="contained"
                    buttonColor="maroon"
                    // Add routing here to redirect to Penalty
                    onPress={() => {SeenNotification(item._id),NotificationsStore.seenNotification(item._id)}}
                    >
                    Seen
                    </Button>
                    ) : (
                        <></>
                        )}
                        </Card.Actions>
                        </Card>
                        )}
                        />
                        </Card.Content>
                        </Card>
                        </View>
                        </ImageBackground>
                        </>
                        )
                    });
                    
                    export default Notifications;
                    
                    const styles = StyleSheet.create({
                        container: {
                            flex: 1,
                            width:'95%',
                            height:'95%',
                            alignSelf:'center',
                            marginTop:10,
                            zIndex:1,
                        },
                        imagebackground:{
                            flex: 1,
                            justifyContent:'center',
                            alignSelf:'auto',
                            zIndex:0,
                        },
                        item:{
                            margin:5,
                        }
                    });