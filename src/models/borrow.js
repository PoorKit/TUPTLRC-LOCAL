import { types, flow, applySnapshot} from "mobx-state-tree";
import { createContext} from 'react';
import { borrowBook, cancelAllborrowBook, cancelborrowBook, confirmRequest, fetchBorrow } from "../services/api";
import dayjs from "dayjs";

const Borrows = types
.model('Borrows',{
    // IGNORED safeReferences to userID and BookID REASON: NOT GONNA BOTHER DEBUGGING
    userId: types.maybeNull(types.string),
    bookId: types.optional(types.array(types.string),[]),
    accession: types.maybeNull(types.string),
    appointmentDate: types.maybeNull(types.Date),
    dueDate: types.maybeNull(types.Date),
    status: types.maybeNull(types.enumeration('status',['Pending','To Confirm','Approved','Rejected']))
})
.actions(self => ({
    // Using the FetchBorrow from the api.js file generate the flow structure for populating borrows
    fetchBorrows: flow(function* (userId){
        try{
            const response = yield fetchBorrow(userId);
            response.appointmentDate = new Date(response.appointmentDate);
            response.dueDate = new Date(response.dueDate);
            applySnapshot(self,response);
            console.log(self);
        }catch(error){
            console.log(error);
        }
    }),
    async borrowbook(userId,bookId,BooksStore){
        if(self.bookId?.length < 2 || !self.bookId.includes(bookId)){
            const response = await borrowBook(userId,bookId);
            response.appointmentDate = new Date(response.appointmentDate);
            response.dueDate = new Date(response.dueDate);
            this.addbookevent(response,bookId,BooksStore);
        }else{
            console.log("Error Occured");
        }
    },
    addbookevent(response,bookId,BooksStore){
        BooksStore.takeoutone(bookId);
        applySnapshot(self,response);
        console.log(self);
    },
    setschedule(appointmentDate){
        self.appointmentDate = dayjs(appointmentDate).toDate();
        // Condition for Weekends;
        // if(dayjs(appointmentDate).add(1,'day').day === 1 || dayjs(appointmentDate).add(1,'day').day === 0 ){
        //     self.dueDate = dayjs(appointmentDate).add(3,'day').toDate();
        // }else{
        //     self.dueDate = dayjs(appointmentDate).add(1, 'day').toDate();
        // }
        // Made redundant in App Proper, in Backend
        self.dueDate = dayjs(appointmentDate).add(1, 'day').toDate();
        this.setconfirm();
    },
    async setconfirm(){
        self.status = "Pending";
        try{
            const response = await confirmRequest(self.userId,self.appointmentDate,self.dueDate);
            console.log(response);
        }catch(error){
            console.log(error);
        }
        
    },
    async cancelall(BooksStore){
        // add for loop for the bookId array and call bookstore.returnoutone(bookId)
        self.bookId.forEach(element => {
            BooksStore.returnoutone(element);
        });
        try{
            const response = await cancelAllborrowBook(self.userId);
            console.log(response);
        }catch(error){
            console.log(error);
        }
        applySnapshot(self,{});
    },
    async cancelbook(bookId,BookStore){
        const response = await cancelborrowBook(self.userId,bookId);
        console.log(response);
        if (response.success){
            this.removeitem(bookId,BookStore);
            console.log(self);
        }else{
            console.log("Error Occured");
        }
    },
    removeitem(bookId,BooksStore){
        self.bookId.remove(bookId);
        self.dueDate = null;
        self.appointmentDate = null;
        self.status = "To Confirm";
        BooksStore.returnoutone(bookId);
    }
}))
.views(self => ({
    get AllBorrows(){
        // return all data in reference to userid
        return self;
    }
}));

const BorrowsContext = createContext(Borrows.create({}));
export default BorrowsContext;