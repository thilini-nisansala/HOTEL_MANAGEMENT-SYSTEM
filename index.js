import bodyParser from 'body-parser';
import express from 'express';
import usersRouter from './routes/usersRoute.js';
import mongoose    from 'mongoose';
import galleryItemRouter from './routes/gallaryitemRoute.js'; 
import  Jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const app = express()

app.use(bodyParser.json())

const connectionString = process.env.MONGO_URL;

app.use((req,res,next)=>{
    const token = req.header("Authorization")?.replace("Bearer","")

    if(token != null){
        Jwt.verify(token, process.env.JWT_KEY, (err,decoded)=>{
        if(err){
            req.user = decoded       
            next()
        }else{
            next()
        }
        })
    }else{
        next()
    }
});

mongoose.connect(connectionString).then(
    ()=>{
        console.log("connected to the database")
    }
).catch(
    ()=>{
        console.log("connection failed")
    }
)

app.use("/api/users",usersRouter)
app.use("/api/gallery",galleryItemRouter)



app.listen(5000,(req,res)=>{
    console.log("server is running on port 5000 ")
});