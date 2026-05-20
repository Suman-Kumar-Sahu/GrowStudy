import dotenv from "dotenv"
import { app } from './app.js'
import connectDB from "./src/db/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error("MongoDB connection Failed:", err.message)
    })

