import http from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { Server } from "socket.io";

let io: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to DB!!")

        const httpServer = http.createServer(app)
        io = new Server(httpServer, {
            cors: {
                origin: ["http://localhost:5173"]
            }
        })

        io.on("connection", (socket) => {
            console.log("connected:", socket.id)
            socket.on("disconnect", () => {
                console.log("disconnected:", socket.id);
            });
        })

        // server = app.listen(envVars.PORT, () => {
        //     console.log(`Sever listening to the port ${envVars.PORT}`)
        // })

        httpServer.listen(envVars.PORT, () => {
            console.log(`Server running on port ${envVars.PORT}`);
        });

    } catch (error) {
        console.log(error)
    }
}

startServer()

