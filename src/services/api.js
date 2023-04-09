import axios from 'axios';
import * as constants from './constants';
import AuthContext from '../models/user';

const base_axios_config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthContext.mytoken}`
    }
}

export const updateUserInformation = async(userid,updatedparams) => {
    try{
        console.log(updatedparams);
        // This works and takes into account only what parameters are updated
        const response = await axios.put(constants.base_full_url + "/profile/update/"+userid, updatedparams, base_axios_config);
        if(response.data.success){
            alert("Updated Successfully");
        }
    }catch(error){
        console.log(error);
    }
}
export const updateUserPassword = async(userid,updatedparams) => {
    try{
        // This works and takes into account only what parameters are updated
        const response = await axios.put(constants.base_full_url + "/user/updatepassword/"+userid, updatedparams, base_axios_config);
        if(response.data.success){
            alert("Updated Successfully");
            return response.data.success;
        }
    }catch(error){
        alert("Password Update Failed:\nPassword does not match, must not be empty, and minimum of 8 characters");
        return false;
    }
}
export const deactivateaccount = async(userid) => {
    try{
        const response = await axios.post(constants.base_full_url + "/user/deactivate/"+userid, base_axios_config);
        if(response.data.success){
            alert("Updated Successfully");
            return true;
        }
    }catch(error){
        console.log(error);
    }
}
export const activateaccount = async(userid) => {
    try{
        const response = await axios.put(constants.base_full_url + "/user/activate/"+userid, base_axios_config);
        if(response.data.success){
            alert("Account Fully Registered");
            return true;
        }
    }catch(error){
        console.log(error);
    }
}

export const registerNotification = async(userid,pushtoken) => {
    try{
        // This works and takes into account only what parameters are updated
        const response = await axios.post(constants.base_full_url + "/notification/register", {userid: userid, token: pushtoken}, base_axios_config);
        if(response.data.success){
            alert("This is now your default device for notifications");
        }
    }catch(error){
        console.log(error);
    }
}
export const unregisterNotification = async(userid) => {
    try{
        // This works and takes into account only what parameters are updated
        const response = await axios.post(constants.base_full_url + "/notification/unregister", {userid: userid}, base_axios_config);
        if(response.data.success){
            alert("Updated Successfully");
        }
    }catch(error){
        console.log(error);
    }
}
export const SeenNotification = async(notificationid) => {
    try{
        // This works and takes into account only what parameters are updated
        const response = await axios.post(constants.base_full_url + "/notification/recieved", {id: notificationid}, base_axios_config);
        if(response.success){
            alert("Marked as Seen!");
        }
    }catch(error){
        console.log(error);
    }
}
export const fetchNotifications = async() => {
    try{
        const response = await axios.get(constants.base_full_url+'/notification', base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const FetchPenalty = async() => {
    try{
        const response = await axios.get(constants.base_full_url+'/profile/penalty', null, base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const fetchBorrow = async(userID) => {
    try{
        const response = await axios.get(constants.base_full_url+'/borrow/request', base_axios_config);
        return response.data.studentborrowbook;
    }catch(error){
        console.log(error);
    }
}

export const fetchLatestBorrow = async() => {
    try{
        const response = await axios.get(constants.base_full_url+'/borrow/books', base_axios_config);
        return response.data.studentappointmentbook;
    }catch(error){
        console.log(error);
    }
}

export const borrowBook = async(userID,bookID) => {
    try{
        const response = await axios.post(constants.base_full_url+'/book/borrow', {userId: userID, bookId: bookID}, base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}
export const cancelborrowBook = async(userID,bookID) => {
    try{
        const response = await axios.post(constants.base_full_url+'/book/cancel', {userId: userID, bookId: bookID}, base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}
export const cancelAllborrowBook = async(userID) => {
    try{
        const response = await axios.post(constants.base_full_url+'/book/cancel/all', {userId: userID}, base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}
export const confirmRequest = async(userID,appointmentDate,dueDate) => {
    try{
        const response = await axios.post(constants.base_full_url+'/book/confirm', {userId: userID,appointmentDate: appointmentDate, dueDate: dueDate}, base_axios_config);
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const fetchBooks = async() => {
    try{
        const response = await axios.post(constants.base_full_url+"/books", base_axios_config);
        const books = response.data.studentbook.map(book => {
            const convertedBook = {...book}; // create a copy of the book object
            convertedBook.Fil = convertedBook.Fil === true || convertedBook.Fil === "1";
            convertedBook.Ref = convertedBook.Ref === true || convertedBook.Ref === "1";
            convertedBook.Bio = convertedBook.Bio === true || convertedBook.Bio === "1";
            convertedBook.Fic = convertedBook.Fic === true || convertedBook.Fic === "1";
            convertedBook.Res = convertedBook.Res === true || convertedBook.Res === "1";
            return convertedBook;
            });
        const data = {
            books,
            bookSubjects: response.data.bookSubjects
            };
        return data;
    }catch(error){
        console.log(error);
    }
}

export const loginasync = async(email,password) => {
    try{
        const response = await axios.post(constants.base_full_url+"/login",{email,password});
        return response.data;
    }catch(error){
        const response = {success: false, message: error.response.data.message};
        return response;
    }
}
export const googleloginasync = async(currentUser) => {
    try{
        const response = await axios.post(constants.base_full_url+"/user/google",{currentUser});
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}