import express from "express"
import pembimbingDudiController from "../controller/pembimbingDudiController.js"

export const pembimbingDudiRouter = express.Router()

pembimbingDudiRouter.get('/getPembimbingDudiById/:id', pembimbingDudiController.getPembimbingDudiById)
pembimbingDudiRouter.get('/getSiswaPembimbingDudi/:id', pembimbingDudiController.getSiswaPembimbingDudi)
pembimbingDudiRouter.get('/getAllSiswaPembimbingDudi', pembimbingDudiController.getAllSiswaPembimbingDudi)
pembimbingDudiRouter.get('/getAllPengajuanPkl', pembimbingDudiController.getAllPengajuanPkl)
pembimbingDudiRouter.get('/getPengajuanPklById/:id', pembimbingDudiController.getPengajuanPklById)