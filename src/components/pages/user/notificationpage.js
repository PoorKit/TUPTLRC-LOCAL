import React, { useContext, useState } from "react";
import { observer, Observer } from "mobx-react-lite";
import { StyleSheet, ImageBackground, View, SectionList } from "react-native";
import { Button, Card, Chip, IconButton, Searchbar, Text } from "react-native-paper";

import NotificationsModel from "../../../models/notification";
import { SeenNotification } from "../../../services/api";

const Notifications = observer(() => {
    const NotificationsStore = useContext(NotificationsModel);
    console.log(NotificationsStore);
    const [querystring, setquerystring] = useState("");
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
            console.log("clicked");
        }}
        />
        <SectionList
        style={{
            marginTop: 10,
        }}
        sections={[
            {
                title: "New Today",
                data: NotificationsStore.AllNewNotifications,
            },
            {
                title: "Previous Notifications",
                data: NotificationsStore.AllNotifications,
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
                            alignItems: "center",
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
                        <Text variant="titleMedium">{item.notificationTitle}</Text>
                        <Text variant="bodyMedium">{item.notificationText}</Text>
                        </View>
                        <View style={{ flex: 2 }}>
                        <Chip icon="information-variant" selected={true}>
                        {item.notificationType}
                        </Chip>
                        </View>
                        </Card.Content>
                        <Card.Actions>
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
                                stickySectionHeadersEnabled={true}
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