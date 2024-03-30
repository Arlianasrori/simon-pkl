import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"

export const guruPembimbingRouter = express.Router()

guruPembimbingRouter.get("/getGuruPembimbing/:id", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa/:id_guru_pembimbing", guruPembimbingController.getSiswa)