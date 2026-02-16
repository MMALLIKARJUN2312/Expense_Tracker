import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to the MongoDB Database : ${connect.connection.host}`);
        console.log(`MongoDB Connected in ${process.env.NODE_ENV} mode`);
    } catch (error) {
        console.error("MongoDB connection failed : ", error.message);
        process.exit(1);
    }
}

export default connectDatabase;