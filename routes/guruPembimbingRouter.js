import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"

export const guruPembimbingRouter = express.Router()

guruPembimbingRouter.get("/getGuruPembimbing", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa", guruPembimbingController.getSiswa)