import mongoose from 'mongoose'

export const connectDatabase = () =>{
    let DB_URI="";

    if(process.env.NODE_ENV == "DEVELOPMENT") 
        {DB_URI = process.env.DB_LOCAL_URI;
    
         mongoose.connect(DB_URI).then((con) => {
        console.log(
            `MONGODB Database connected with Host : ${con?.connection?.host} in ${process.env.NODE_ENV} mode`
        )
    })
    }

    if(process.env.NODE_ENV == "PRODUCTION") 
        {DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI).then((con) => {
        console.log(
            `MONGODB Database connected with Host : ${con?.connection?.host} in ${process.env.NODE_ENV} mode`
        )
    })}
}