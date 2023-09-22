import { types, flow, applySnapshot} from "mobx-state-tree";
import { createContext} from 'react';
import { borrowBook, cancelAllborrowBook, cancelborrowBook, confirmRequest, fetchBorrow } from "../services/api";
import { book_image_default } from "../services/constants";
import dayjs from "dayjs";

const BookImage = types.model({
    public_id: types.maybeNull(types.string),
    url: types.optional(types.string, book_image_default),
  });

const Book = types.model("Book", {
    _id: types.string,
    book_image: BookImage,
    title: types.string,
})

const Borrows = types
.model('Borrows',{
    // IGNORED safeReferences to userID and BookID REASON: NOT GONNA BOTHER DEBUGGING
    userId: types.maybeNull(types.string),
    bookId: types.optional(types.array(Book),[]),
    accession: types.maybeNull(types.string),
    appointmentDate: types.maybeNull(types.Date),
    dueDate: types.maybeNull(types.Date),
    status: types.maybeNull(types.enumeration('status',['Pending','To Confirm','Approved','Rejected']))
})
.actions(self => ({
    // Using the FetchBorrow from the api.js file generate the flow structure for populating borrows
    fetchBorrows: flow(function* (){
        try{
            const response = yield fetchBorrow();
            if(response){
                response.appointmentDate = new Date(response.appointmentDate);
                response.dueDate = new Date(response.dueDate);
                applySnapshot(self,response);
            }
        }catch(error){
            console.log(error);
        }
    }),
    // create a function that would set all the values inside the borrow object to undefined or null depending on their type
    emptyout: flow(function*() {
        applySnapshot(self, {
            userId: undefined,
            bookId: undefined,
            accession: undefined,
            appointmentDate: undefined,
            dueDate: undefined,
            status: undefined,
        });
    }),
    async borrowbook(userId,bookId,BookStore){
        if(self.bookId?.length < 2 || !self.bookId.includes(bookId)){
            const response = await borrowBook(userId,bookId);
            if(response.success){
                this.addbookevent(bookId,BookStore);
            }
        }else{
            console.log("Error Occured");
        }
    },
    addbookevent(bookId,BookStore){
        BookStore.takeoutone(bookId._id);
        // /default-book_p70mge.png
        const newImage = BookImage.create({
                public_id: bookId.book_image?._id || null,
                url: bookId.book_image?.url || book_image_default,
            })
        const newBook = Book.create({
            _id: bookId._id,
            book_image: newImage,
            title: bookId.title,
        });
        self.bookId.push(newBook);
    },
    setschedule(appointmentDate){
        self.appointmentDate = dayjs(appointmentDate).toDate();
        self.dueDate = dayjs(appointmentDate).add(1, 'day').toDate();
        this.setconfirm({appointmentDate: self.appointmentDate, dueDate: self.dueDate});
    },
    async setconfirm(dates){
        self.status = "Pending";
        try{
            const response = await confirmRequest(self.userId, dates.appointmentDate, dates.dueDate);
            if(response.success){
                alert("Request Confirmed, Wait for Approval");
            }
        }catch(error){
            console.log(error);
        }
        
    },
    async cancelall(BooksStore){
        // add for loop for the bookId array and call bookstore.returnoutone(bookId)
        self.bookId.forEach(element => {
            BooksStore.returnoutone(element._id);
        });
        try{
            const response = await cancelAllborrowBook(self.userId);
        }catch(error){
            console.log(error);
        }
        applySnapshot(self,{});
    },
    async cancelbook(bookId,BookStore){
        const response = await cancelborrowBook(self.userId,bookId._id);
        if (response.success){
            this.removeitem(bookId._id,BookStore);
            alert("Book cancelled successfully!");
            console.log("WOW!");
            console.log(self.bookId);
        }else{
            alert("Error occured while cancelling book");
        }
    },
    removeitem(bookId,BooksStore){
        const index = self.bookId.findIndex((book) => book._id === bookId);
        if (index !== -1) {
            self.bookId.splice(index, 1);
          }
        BooksStore.returnoutone(bookId);
        self.dueDate = null;
        self.appointmentDate = null;
        self.status = "To Confirm";
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