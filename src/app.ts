import cors from "cors"
import express, { Request, Response } from "express"
import { router } from "./routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express()
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api", router)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Wellcome to Ride Ease"
    })
})
app.use(globalErrorHandler)

export default app