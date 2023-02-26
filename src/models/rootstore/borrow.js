import { types, flow, applySnapshot} from "mobx-state-tree";
import { createContext} from 'react';
import { fetchBorrow } from "../services/api";
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
        fetchBorrows: flow(function* (){
            try{
                self = yield fetchBorrow();
            }catch(error){
                console.log(error);
            }
        }),
        borrowbook(userId,bookId,BooksStore){
            if(self.bookId?.length < 2 && !self.bookId.includes(bookId)){
                applySnapshot(self,{bookId: [...self.bookId,bookId],userId: userId,status:'To Confirm'});
                BooksStore.takeoutone(bookId);
            }else{
                console.log("Error Occured");
            }
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
        setconfirm(){
            self.status = "Pending";
        },
        cancelall(BooksStore){
            // add for loop for the bookId array and call bookstore.returnoutone(bookId)
            self.bookId.forEach(element => {
                BooksStore.returnoutone(element);
            });
            applySnapshot(self,{});
        },
        cancelbook(bookId,BookStore){
            self.bookId.remove(bookId);
            BookStore.returnoutone(bookId);
            self.dueDate = null;
            self.appointmentDate = null;
            self.status = "To Confirm";
        }
    }))
    .views(self => ({
        get AllBorrows(){
            // return all data in reference to userid
            // is configured to get it all of the data in API.js
            return self;
        }
    }));
    
const BorrowsContext = createContext(Borrows.create({}));
export default BorrowsContext;