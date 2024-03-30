import express from "express"
import { adminRouter } from "../routes/adminRouter.js"
import { pembimbingDudiRouter } from "../routes/pembimbingDudiRouter.js"
import { siswaRouter } from "../routes/siswaRouter.js"
import { guruPembimbingRouter } from "../routes/guruPembimbingRouter.js"
import { notificationRouter } from "../routes/notificationRouter.js"
import { errorMiddleware } from "../middleware/errorMiddleware.js"

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
<<<<<<< HEAD
app.use("/dudi",pembimbingDudiRouter)
app.use("/notification",notificationRouter)
=======
app.use("/pembimbingDudi",pembimbingDudiRouter)
>>>>>>> pembimbing_dudi_api

app.use(errorMiddleware)