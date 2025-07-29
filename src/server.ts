// iYj0LXNK7jZ8Cn8J
// Ride-Ease
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to DB!!")
        server = app.listen(envVars.PORT, () => {
            console.log(`Sever listening to the port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()

