import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const DB = await mongoose.connect(
            process.env.MONGO_DB_URI,
        );
        console.log({message:"DB connceted succesfully"});
        
    } catch (error) {
        console.log({ message: "DB connection Failed" });
        console.log(error);
    }
}