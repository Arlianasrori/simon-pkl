import express from "express"
import { adminRouter } from "../routes/adminRouter.js"
import { dudiRouter } from "../routes/dudiRouter.js"
import { siswaRouter } from "../routes/siswaRouter.js"
import { guruPembimbingRouter } from "../routes/guruPembimbingRouter.js"
import { errorMiddleware } from "../middleware/errorMiddleware.js"
import axios from "axios"

export const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,ngrok-skip-browser-warning");
    next();
})
app.use("/admin",adminRouter)
app.use("/siswa",siswaRouter)
app.use("/guruPembimbing",guruPembimbingRouter)
app.use("/dudi",dudiRouter)

app.use(errorMiddleware)