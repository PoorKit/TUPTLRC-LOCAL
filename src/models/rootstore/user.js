import { types, applySnapshot } from 'mobx-state-tree';
import { createContext } from "react";

const User = types
    .model('User', {
        _id: types.maybe(types.string),
        id_number: types.maybe(types.string),
        avatar: types.maybe(
            types.model({
                url: types.maybe(types.string)
            })),
        name: types.maybe(types.string),
        course: types.maybe(types.string),
        section: types.maybe(types.string),
        age: types.maybe(types.number),
        gender: types.maybe(types.string),
        contact: types.maybe(types.number),
        address: types.maybe(types.string),
        email: types.maybe(types.string),
        password: types.maybe(types.string),
        notification: types.maybe(types.model({
            pushToken: types.maybe(types.string)
        })),
        role: types.maybe(types.string,'student',types.enumeration('type',['students','admin'])
        ),
        status: types.maybe(types.string,'active',types.enumeration('status',['deactivated','active','fresh']))
    })
    .views(self => ({
        get currentuser(){
            return self;
        }
    }))
    .actions(self => ({
        setUser(response){
            self._id = response.user._id,
            self.id_number = response.user.id_number,
            self.avatar = response.user.avatar,
            self.name = response.user.name,
            self.course = response.user.course,
            self.section = response.user.section,
            self.age = response.user.age,
            self.gender = response.user.gender,
            self.contact = response.user.contact,
            self.address = response.user.address,
            self.email = response.user.email,
            self.password = response.user.password,
            self.notification = response.user.notification,
            self.role = response.user.role,
            self.status = response.user.status
        },
        emptyout(){
            applySnapshot(self, {});
        },
        setnotification(pushtoken){
            self.notification.pushToken = pushtoken;
        }
    }));

const UserInstance = User.create({});
const UserContext = createContext(UserInstance);

export default UserContext;
