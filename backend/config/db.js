import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to the MongoDB Database : ${connect.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed : ", error.message);
        process.exit(1);
    }
}

export default connectDatabase;