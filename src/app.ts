import cors from "cors"
import express, { Request, Response } from "express"
import { router } from "./routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express()
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://ride-ease-app.vercel.app"],
    credentials: true
}))
app.use(cookieParser());
app.use("/api", router)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Wellcome to Ride Ease"
    })
})
app.use(globalErrorHandler)

export default app