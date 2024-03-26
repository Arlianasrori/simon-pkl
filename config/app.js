import express from "express"
import { adminRouter } from "../routes/adminRouter.js"
import { dudiRouter } from "../routes/dudiRouter.js"
import { siswaRouter } from "../routes/siswaRouter.js"
import { guruPembimbingRouter } from "../routes/guruPembimbingRouter.js"
import { errorMiddleware } from "../middleware/errorMiddleware.js"


export const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use("/admin",adminRouter)
app.use("/siswa",siswaRouter)
app.use("/guruPembimbing",guruPembimbingRouter)
app.use("/dudi",dudiRouter)

app.use(errorMiddleware)