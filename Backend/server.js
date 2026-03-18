import dotenv from "dotenv"
import {app} from './app.js'
import connectDB from "./src/db/db.js"

dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{
    app.listen(3000,(req,res)=>{
        console.log("Server is running at port 4000")
    })
})
.catch((err)=>{
    console.log("MongoDB connection Failed")
})

