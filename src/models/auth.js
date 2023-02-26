import { types } from "mobx-state-tree";
import { createContext } from "react";

const Auth = types
.model("Auth", {
    token: '',
    isAuthenticated: types.optional(types.boolean,false),
    isLoading: types.optional(types.boolean,false),
})
.actions((self) => ({
    letmeload(){
        self.isLoading = true;
    },
    donewithload(){
        self.isLoading = false;
    },
    loggedin(token) {
        self.isAuthenticated = true;
        self.token = token;
    },
    logout() {
        self.token = '';
        self.isAuthenticated = false;
    }
}))
.views((self) => ({
    get amiauthenticated(){
        return self.isAuthenticated;
    },
    get mytoken(){
        return self.token;
    },
    get loadingstate(){
        return self.isLoading;
    }
}))
// Need to instantiate Auth first!
const AuthInstance = Auth.create({});
const AuthContext = createContext(AuthInstance);

export default AuthContext;
