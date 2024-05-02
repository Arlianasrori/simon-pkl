import express from "express"
import { adminRouter } from "../routes/adminRouter.js"
import { pembimbingDudiRouter } from "../routes/pembimbingDudiRouter.js"
import { siswaRouter } from "../routes/siswaRouter.js"
import { guruPembimbingRouter } from "../routes/guruPembimbingRouter.js"
import { notificationRouter } from "../routes/notificationRouter.js"
import { errorMiddleware } from "../middleware/errorMiddleware.js"
import { absenRouter } from "../routes/absenRouter.js"
import { adminDeveloperRouter } from "../routes/adminDeveloperRouter.js"
import { authRouter } from "../routes/authRouter.js"
import fileUpload from "express-fileupload"
import env from "dotenv"
import cookieParser from "cookie-parser"

export const app = express()

env.config()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,ngrok-skip-browser-warning");
    next();
})
app.use(express.static('public'))
app.use(fileUpload())
app.use("/admin",adminRouter)
app.use("/siswa",siswaRouter)
app.use("/guruPembimbing",guruPembimbingRouter)
app.use("/dudi",pembimbingDudiRouter)
app.use("/notification",notificationRouter)
app.use("/pembimbingDudi",pembimbingDudiRouter)
app.use("/absen",absenRouter)
app.use("/developer",adminDeveloperRouter)
app.use("/auth",authRouter)

app.use(errorMiddleware)