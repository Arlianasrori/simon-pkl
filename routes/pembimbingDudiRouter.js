import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"

export const pembimbingDudiRouter = express.Router()

pembimbingDudiRouter.get('/getPembimbingDudiById', pembimbingDudiController.getPembimbingDudiById)
pembimbingDudiRouter.get('/getSiswaPembimbingDudi', pembimbingDudiController.getSiswaPembimbingDudi)
pembimbingDudiRouter.get('/getAllPengajuanPkl', pembimbingDudiController.getAllPengajuanPkl)
pembimbingDudiRouter.get('/getAllPengajuanPkl', pembimbingDudiController.getAllPengajuanPkl)