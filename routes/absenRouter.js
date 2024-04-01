import express from "express"
import absenController from "../controller/absenController.js"

export const absenRouter = express.Router()

absenRouter.post("/addJadwalAbsen",absenController.addJadwalAbsen)