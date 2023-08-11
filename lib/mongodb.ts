import mongoose from "mongoose";

const {MONGO_URI} = process.env

if(!MONGO_URI){
    throw new Error("MongoDB must be defined")
}

export const connectDB =  async () =>{
    try{
        const {connection} = await mongoose.connect(MONGO_URI)
        if(connection.readyState===1){
          console.log("MongoDB connected")
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(false)
    }
}