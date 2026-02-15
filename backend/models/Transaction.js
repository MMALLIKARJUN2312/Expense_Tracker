import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }, 
    title : {
        type : String,
        required : [true, "Please add a title for the transaction"],
        trim : true 
    }, 
    amount : {
        type : Number,
        required : [true, "Please add an amount for the transaction"]
    },
    category : {
        type : String,
        required : [true, "Please add a category for the transaction"],
        trim : true
    },
    date : {
        type : Date,
        required : [true, "Please add a date for the transaction"]
    }, 
    notes : {
        type : String,
        trim : true,
        default : ""
    }
},
{
    timestamps : true
})

// Create an index on user and date for efficient querying
transactionSchema.index({ user: 1, date: -1 });

const Transaction = new mongoose.model("Transaction", transactionSchema);

export default Transaction;

